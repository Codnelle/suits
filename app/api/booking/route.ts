import { NextResponse } from "next/server";
import { copy, CONFIG_GROUPS } from "@/lib/copy";

export const runtime = "nodejs";

const INBOX = process.env.SHAHEE_INBOX ?? "hello@shahee.in";
const FROM = process.env.SHAHEE_FROM ?? "Shahee <onboarding@resend.dev>";
const RESEND_KEY = process.env.RESEND_API_KEY;

type Payment = { id?: string; orderId?: string; amount?: number };

type Payload = {
  kind?: "booking" | "order";
  name?: string;
  phone?: string;
  email?: string;
  occasion?: string;
  zone?: string;
  areas?: string;
  date?: string;
  time?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
  total?: number;
  lines?: {
    fabric?: string;
    house?: string;
    blend?: string;
    price?: number;
    configuration?: Record<string, string>;
    measurements?: Record<string, string>;
  }[];
  payment?: Payment;
};

const escape = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const rows = (fields: [string, string | undefined][]) =>
  fields
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `<tr><td style="padding:6px 18px 6px 0;color:#8B9099;font:12px/1.6 ui-monospace,monospace;text-transform:uppercase;letter-spacing:.1em;white-space:nowrap">${escape(k)}</td><td style="padding:6px 0;color:#14161A;font:14px/1.6 system-ui,sans-serif">${escape(String(v))}</td></tr>`)
    .join("");

const section = (title: string, inner: string) => `
  <h2 style="margin:26px 0 8px;color:#B8894B;font:11px/1 ui-monospace,monospace;text-transform:uppercase;letter-spacing:.2em">${escape(title)}</h2>
  <table style="border-collapse:collapse;border-top:1px solid rgba(20,22,26,.12)">${inner}</table>`;

const wrap = (subject: string, inner: string) => `
<div style="background:#F2EFE9;padding:32px;font-family:system-ui,sans-serif">
  <div style="max-width:620px;margin:0 auto;background:#fff;border:1px solid rgba(20,22,26,.12);padding:32px">
    <p style="margin:0 0 4px;color:#14161A;font:13px/1 ui-monospace,monospace;letter-spacing:.32em">SHAHEE</p>
    <h1 style="margin:0 0 6px;color:#14161A;font:22px/1.3 Georgia,serif">${escape(subject)}</h1>
    <p style="margin:0 0 22px;color:#575C64;font:12px/1.6 ui-monospace,monospace">Received from shahee.in</p>
    ${inner}
    <p style="margin:26px 0 0;padding-top:14px;border-top:1px solid rgba(20,22,26,.12);color:#8B9099;font:12px/1.6 system-ui,sans-serif">
      SHAHEE — Made to Measure, Bengaluru. Reply to this email or message the customer on WhatsApp to confirm.
    </p>
  </div>
</div>`;

const plain = (parts: string[]) => parts.filter(Boolean).join("\n\n");

const configLabel = (key: string, id: string) => {
  const group = CONFIG_GROUPS.find((g) => g.key === key);
  if (!group) return id;
  const known = copy.configure[group.key].find((o) => o.id === id);
  return known ? `${group.label}: ${known.title}` : `${group.label}: ${id}`;
};

const describeConfig = (config: Record<string, string> = {}) =>
  Object.entries(config)
    .filter(([, v]) => v)
    .map(([k, v]) => configLabel(k, v))
    .join(" · ");

const describeMeasurements = (measurements: Record<string, string> = {}) => {
  const field = (id: string) =>
    copy.measure.fields.find((f) => f.id === id)?.label ?? id;
  return Object.entries(measurements)
    .filter(([, v]) => v)
    .map(([k, v]) => `${field(k)} ${v}`)
    .join(", ");
};

function build(p: Payload) {
  const money = (n?: number) =>
    typeof n === "number" ? `₹${n.toLocaleString("en-IN")}` : undefined;

  if (p.kind === "order") {
    const lines = p.lines ?? [];
    const lineRows = lines
      .map((l) => {
        const cfg = describeConfig(l.configuration);
        const m = describeMeasurements(l.measurements);
        return `<div style="padding:14px 0;border-bottom:1px solid rgba(20,22,26,.12)">
          <p style="margin:0;color:#14161A;font:16px/1.4 Georgia,serif">${escape(l.fabric ?? "")} <span style="color:#8B9099;font:12px ui-monospace,monospace">${escape(l.house ?? "")}</span></p>
          <p style="margin:4px 0 0;color:#575C64;font:12px/1.6 ui-monospace,monospace">${escape(l.blend ?? "")}${cfg ? ` · ${escape(cfg)}` : ""}</p>
          ${m ? `<p style="margin:4px 0 0;color:#8B9099;font:11px/1.6 ui-monospace,monospace">${escape(m)}</p>` : ""}
          <p style="margin:6px 0 0;color:#14161A;font:13px/1.4 system-ui,sans-serif">${money(l.price)}</p>
        </div>`;
      })
      .join("");
    const contact = rows([
      ["Name", p.name],
      ["Phone", p.phone],
      ["Email", p.email],
      ["Address", [p.address, p.city, p.state].filter(Boolean).join(", ")],
      ["Pincode", p.pincode],
      ["Notes", p.notes],
      ["Payment", p.payment?.id ? `${p.payment.id} · ${money(p.payment.amount)}` : undefined],
    ]);
    const subject = `Remote order — ${p.name ?? "customer"} — ${money(p.total)}`;
    return {
      subject,
      html: wrap(subject, contact + section("Order", lineRows + rows([["Total", money(p.total)]]))),
      text: plain([
        `REMOTE ORDER — ${p.name ?? ""} (${p.phone ?? ""} / ${p.email ?? ""})`,
        `Address: ${[p.address, p.city, p.state].filter(Boolean).join(", ")} ${p.pincode ?? ""}`,
        ...lines.map((l) =>
          [
            `${l.fabric} (${l.house ?? ""}, ${l.blend ?? ""}) — ${describeConfig(l.configuration)} — ${money(l.price)}`,
            describeMeasurements(l.measurements) ? `Measurements: ${describeMeasurements(l.measurements)}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        ),
        `Total: ${money(p.total)}`,
        p.payment?.id ? `Payment: ${p.payment.id}` : "",
        p.notes ? `Notes: ${p.notes}` : "",
      ]),
    };
  }

  const subject = `Home visit request — ${p.name ?? "customer"} — ${p.date ?? ""} ${p.time ?? ""}`;
  const contact = rows([
    ["Name", p.name],
    ["Phone", p.phone],
    ["Email", p.email],
    ["Occasion", p.occasion ?? "Not specified"],
    ["Zone", `${p.zone ?? ""}${p.areas ? ` — ${p.areas}` : ""}`],
    ["Date & time", `${p.date ?? ""} ${p.time ?? ""}`],
    ["Address", p.address],
    ["Pincode", p.pincode],
    ["Notes", p.notes],
    ["Payment", p.payment?.id ? `${p.payment.id} · ${money(p.payment.amount)}` : "Not paid"],
  ]);
  return {
    subject,
    html: wrap(subject, contact),
    text: plain([
      `HOME VISIT REQUEST — ${p.name ?? ""} (${p.phone ?? ""} / ${p.email ?? ""})`,
      `Occasion: ${p.occasion ?? "Not specified"}`,
      `Zone: ${p.zone ?? ""} — ${p.areas ?? ""}`,
      `Slot: ${p.date ?? ""} ${p.time ?? ""}`,
      `Address: ${p.address ?? ""} ${p.pincode ?? ""}`,
      p.notes ? `Notes: ${p.notes}` : "",
      p.payment?.id ? `Payment: ${p.payment.id} (${money(p.payment.amount)})` : "",
    ]),
  };
}

export async function POST(req: Request) {
  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ delivered: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.name || !payload.email) {
    return NextResponse.json({ delivered: false, error: "Name and email required" }, { status: 400 });
  }

  const { subject, html, text } = build(payload);

  if (!RESEND_KEY) {
    return NextResponse.json({
      delivered: false,
      mailto: `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`,
    });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({ from: FROM, to: [INBOX], reply_to: payload.email, subject, html, text }),
    });

    if (!res.ok) {
      return NextResponse.json({
        delivered: false,
        mailto: `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`,
      });
    }

    return NextResponse.json({ delivered: true });
  } catch {
    return NextResponse.json({
      delivered: false,
      mailto: `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`,
    });
  }
}
