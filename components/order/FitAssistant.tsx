"use client";

import { useEffect, useRef, useState } from "react";
import { copy, type House } from "@/lib/copy";

type Turn = { role: "user" | "assistant"; content: string };

// Questions worth one tap, per house — and for the whole collection.
const PROMPTS: Record<string, string[]> = {
  all: ["Which house suits a wedding reception?", "How do I measure my chest on my own?", "What's the difference between the linings?"],
  classics: ["Which Classics cloth wears best for daily office use?", "Is Dove Linen right for Bengaluru heat?", "Notch or peak lapel for interviews?"],
  prime: ["What makes Chanderi different from wool?", "Can a Prime suit work for a day wedding?", "Which buttons go with silk?"],
  royale: ["Banarasi or brocade for a groom?", "What lapel suits a Royale suit?", "How heavy is a brocade suit to wear?"],
  prestige: ["What makes Prestige cloth rare?", "Is hand pick-stitch worth it here?", "Which lining would you pair with handloom silk?"],
};

const ERRORS: Record<string, string> = {
  offline: `The assistant isn't switched on yet. Write to ${copy.booking.email} and the team will answer.`,
  busy: "A lot of people are asking right now — give it a moment and try again.",
  unavailable: `Something went wrong on our side. Try again, or write to ${copy.booking.email}.`,
};

/**
 * Sits right under the products on /order and follows the house filter:
 * ask about the cloth you're looking at, the design choices, or how to take
 * a measurement at home.
 */
export default function FitAssistant({ house }: { house: House | null }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, busy]);

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    const next: Turn[] = [...turns, { role: "user", content: q }];
    setTurns(next);
    setDraft("");
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/fit-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ house: house?.id, messages: next }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        setError(ERRORS[data.error ?? ""] ?? ERRORS.unavailable);
        setTurns(turns); // let them send the same question again
        setDraft(q);
        return;
      }
      setTurns([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setError(ERRORS.unavailable);
      setTurns(turns);
      setDraft(q);
    } finally {
      setBusy(false);
    }
  };

  const prompts = PROMPTS[house?.id ?? "all"] ?? PROMPTS.all;

  return (
    <section aria-label="Ask the atelier" className="mt-20 pt-14 border-t border-[var(--color-ash)]/15">
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-[clamp(32px,5vw,80px)] items-start">
        <div>
          <p className="eyebrow mb-5"><em>ask the</em> ATELIER</p>
          <h3 className="display text-[clamp(28px,3.2vw,44px)] leading-[1.02] text-[var(--color-bone)]">
            {house ? <>About <em>the</em> {house.name.replace("House of ", "").toUpperCase()}</> : <>Not <em>sure</em> WHICH CLOTH?</>}
          </h3>
          <p className="body-serif mt-5 max-w-[38ch] !text-[var(--color-bone)]/75">
            Ask about any cloth{house ? ` in ${house.name}` : ""}, the design choices, or how to take a measurement at home. Answers come from our catalogue and measuring guide.
          </p>
        </div>

        <div className="rounded-[6px] border border-[var(--color-line)] bg-[#FBF9F6]">
          <div
            ref={logRef}
            className="max-h-[420px] min-h-[180px] overflow-y-auto px-6 pt-6 pb-2 flex flex-col gap-4"
            data-lenis-prevent
            aria-live="polite"
          >
            {turns.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {prompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => ask(p)}
                    className="text-left text-[13px] px-4 py-2.5 rounded-full border border-[var(--color-bone)]/15 bg-[var(--color-ink)] text-[var(--color-bone)] hover:border-[var(--color-bone)] transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
            {turns.map((t, i) =>
              t.role === "user" ? (
                <p key={i} className="self-end max-w-[85%] rounded-[14px] rounded-br-[4px] bg-[var(--color-bone)] text-white text-[14px] leading-relaxed px-4 py-2.5 whitespace-pre-wrap">
                  {t.content}
                </p>
              ) : (
                <p key={i} className="self-start max-w-[92%] body-serif !text-[15px] leading-relaxed whitespace-pre-wrap">
                  {t.content}
                </p>
              )
            )}
            {busy && (
              <p className="self-start body-serif !text-[14px] !text-[var(--color-ash)] italic">Master G's notes are open…</p>
            )}
          </div>

          {error && <p role="alert" className="px-6 pb-2 text-[13px] text-[#9A4B3C]">{error}</p>}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(draft);
            }}
            className="flex items-center gap-2 border-t border-[var(--color-line)] p-3"
          >
            <label htmlFor="fit-q" className="sr-only">Your question</label>
            <input
              id="fit-q"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={1500}
              placeholder={house ? `Ask about ${house.name}…` : "Ask about a cloth, a lapel, or a measurement…"}
              className="flex-1 bg-transparent px-3 py-2.5 text-[14px] text-[var(--color-bone)] placeholder:text-[var(--color-ash)]/70 outline-none"
            />
            <button type="submit" disabled={busy || !draft.trim()} className="pill !py-2.5 !px-5 disabled:opacity-40 disabled:pointer-events-none">
              Ask
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
