import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { copy } from "@/lib/copy";

export const runtime = "nodejs";

// POST /api/fit-assistant  { house?: string, messages: { role, content }[] }
// The order page's cloth & fit assistant. Answers from the Shahee catalogue
// and the measuring guide only; replies come back as plain text.

const MAX_TURNS = 16;
const MAX_CHARS = 1500;

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Built once from lib/copy so the assistant can never drift from the site.
// Kept free of anything per-request so the prompt prefix caches.
const SYSTEM = `You are the cloth and fit assistant on Shahee Suits' order page. Shahee is a made-to-measure suit house in Bengaluru, India. Customers outside Bengaluru order here: they choose a cloth, enter their own measurements, choose the design, and Shahee delivers the finished suit anywhere in India. Inside Bengaluru, the tailor Master G visits the customer's home instead (₹199 visit fee, adjusted against the suit).

Your job: help the customer choose a house and a cloth for their occasion, explain the design choices, and guide them through taking each measurement at home. Answer only from the catalogue, guide and policies below. If something isn't covered (delivery dates, stock, custom cloth, alterations beyond the policy), say you don't know and point them to ${copy.booking.email}. Never invent a cloth, a price, a blend or a promise.

Measurements: you may explain how to take each one and what a typical range looks like, but never give the customer numbers to enter in place of measuring — a made-to-measure suit is cut from their real measurements. If they are unsure, suggest the free Shahee measuring tape (write to ${copy.order.tapeEmail}).

Style: warm, brief and specific, like a good salesperson in a quiet shop. Two to five short sentences, or a short list when comparing. Plain text only: no markdown headings, no bold, no tables. Prices in rupees as shown.

<houses>
${copy.cloth.houses.map((h) => `- ${h.name} (${h.range}): ${h.blurb}`).join("\n")}
</houses>

<cloths>
${copy.cloth.fabrics
  .map((f) => {
    const h = copy.cloth.houses.find((x) => x.id === f.house)!;
    return `- ${f.name} — ${h.name}, ${f.blend}, from ${money(f.price)} per suit. Suits: ${f.occasions.join(", ")}. ${f.line}`;
  })
  .join("\n")}
${copy.cloth.priceNote}
</cloths>

<design_choices>
${Object.entries(copy.configure)
  .map(([group, options]) => `${group}: ${options.map((o) => `${o.title} (${o.note})`).join("; ")}`)
  .join("\n")}
</design_choices>

<measuring_guide>
${copy.measure.lead}
${copy.measure.fields.map((f) => `- ${f.label}: ${f.hint}`).join("\n")}
</measuring_guide>

<policies>
${copy.booking.terms.map((t) => `- ${t}`).join("\n")}
</policies>`;

type Turn = { role: "user" | "assistant"; content: string };

function clean(body: unknown): { house?: string; turns: Turn[] } | null {
  if (!body || typeof body !== "object") return null;
  const { house, messages } = body as { house?: unknown; messages?: unknown };
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const turns: Turn[] = [];
  for (const m of messages.slice(-MAX_TURNS)) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return null;
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (content) turns.push({ role: m.role, content });
  }
  // the API wants the conversation to open on a user turn and end on one
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return null;
  return { house: typeof house === "string" ? house : undefined, turns };
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return NextResponse.json({ error: "offline" }, { status: 503 });
  }

  const input = clean(await req.json().catch(() => null));
  if (!input) return NextResponse.json({ error: "Send at least one user message." }, { status: 400 });

  const house = copy.cloth.houses.find((h) => h.id === input.house);
  const messages: Anthropic.Beta.BetaMessageParam[] = input.turns.map((t) => ({ role: t.role, content: t.content }));
  // which house the customer is looking at goes after the cached prefix
  if (house) {
    const last = messages[messages.length - 1];
    last.content = `[The customer is browsing ${house.name}.]\n\n${last.content as string}`;
  }

  const client = new Anthropic();
  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 4096,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      cache_control: { type: "ephemeral" },
      system: SYSTEM,
      messages,
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({
        reply: `I can't help with that one, but the team can — write to ${copy.booking.email}.`,
      });
    }

    const reply = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return NextResponse.json({ reply: reply || `Sorry, I lost my thread. Try asking again, or write to ${copy.booking.email}.` });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "busy" }, { status: 429 });
    }
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("fit-assistant: Anthropic credentials rejected");
      return NextResponse.json({ error: "offline" }, { status: 503 });
    }
    if (error instanceof Anthropic.APIError) {
      console.error(`fit-assistant: API error ${error.status}`, error.message);
      return NextResponse.json({ error: "unavailable" }, { status: 502 });
    }
    console.error("fit-assistant:", error);
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
}
