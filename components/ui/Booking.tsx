"use client";

import { useEffect, useRef, useState } from "react";
import { copy } from "@/lib/copy";

type Occasion = { id: string; title: string; sub: string; media: string };
type Atelier = (typeof copy.invitation.ateliers)[number];

const OCCASIONS: Occasion[] = [
  { id: "wedding", title: "The Wedding", sub: "Baraat · Dulha", media: "man-wedding" },
  { id: "reception", title: "Engagement / Reception", sub: "The evening itself", media: "man-dinner" },
  { id: "corporate", title: "Corporate & Business", sub: "The everyday two-piece", media: "man-boardroom" },
  { id: "festive", title: "Festive & Gala", sub: "Celebration & statement", media: "man-stage" },
];

const TIMES = ["10:00", "11:30", "13:00", "15:00", "17:00", "19:00"];
const STEPS = ["The Occasion", "Area & Date", "Your Details"];

export default function Booking() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [atelier, setAtelier] = useState<Atelier>(copy.invitation.ateliers[0]);
  const [time, setTime] = useState(TIMES[2]);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const openFn = () => {
      lastFocus.current = document.activeElement as HTMLElement | null;
      setOpen(true);
      setStep(1);
      setDone(false);
    };
    window.addEventListener("open-booking", openFn);
    return () => window.removeEventListener("open-booking", openFn);
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      const t = setTimeout(() => panelRef.current?.focus(), 60);
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
      document.addEventListener("keydown", onKey);
      return () => {
        clearTimeout(t);
        document.removeEventListener("keydown", onKey);
      };
    }
    lenis?.start();
    document.documentElement.style.overflow = "";
  }, [open]);

  const close = () => {
    setOpen(false);
    lastFocus.current?.focus();
  };

  const ateliers: Atelier[] = [...copy.invitation.ateliers];
  const dateTxt = date ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "your preferred date";

  return (
    <div
      aria-hidden={!open}
      className="fixed inset-0 z-[80] transition-opacity duration-500"
      style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
    >
      <div className="absolute inset-0 bg-[#14161A]/50 backdrop-blur-[4px]" onClick={close} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Book a fitting"
        tabIndex={-1}
        className="absolute top-1/2 left-1/2 w-[min(94vw,960px)] max-h-[92svh] overflow-hidden flex flex-col md:flex-row rounded-[6px] bg-[var(--color-cloud)] border border-[var(--color-line)] outline-none"
        style={{ transform: `translate(-50%, ${open ? "-50%" : "-46%"})`, transition: "transform 520ms var(--ease-cloth)", boxShadow: "0 50px 120px -40px rgba(20,20,25,0.5)" }}
      >
        <button type="button" onClick={close} aria-label="Close" className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full border border-[var(--color-line)] text-[var(--color-ash)] hover:text-[var(--color-bone)] transition-colors">✕</button>

        {/* aside */}
        <div className="hidden md:flex md:flex-col min-h-0 md:w-[39%] md:shrink-0 overflow-y-auto p-10 bg-[var(--color-ink)] border-r border-[var(--color-line)]">
          <span className="label">Shahee</span>
          <h3 className="display text-[clamp(30px,3vw,44px)] mt-5 mb-5 text-[var(--color-bone)]">Book<br />Master G</h3>
          <p className="body-copy">A private consultation at your doorstep. Master G brings the complete catalogue — cloth, cut and measurements, considered together at home.</p>
          <ul className="mt-auto pt-10 flex flex-col gap-3.5">
            {STEPS.map((s, i) => (
              <li key={s} className={`flex items-center gap-3 text-[12px] uppercase tracking-[0.14em] ${i + 1 === step ? "text-[var(--color-bone)]" : i + 1 < step ? "text-[var(--color-ash)]" : "text-[var(--color-ash)]/50"}`}>
                <b className={i + 1 <= step ? "text-[var(--color-brass)]" : "text-[var(--color-line)]"}>0{i + 1}</b> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* form */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-10">
          {/* mobile step indicator */}
          <div className="md:hidden flex items-center gap-2 mb-6" aria-hidden>
            {STEPS.map((_, i) => (
              <span key={i} className={`h-[3px] flex-1 rounded-full ${i + 1 <= step ? "bg-[var(--color-brass)]" : "bg-[var(--color-line)]"}`} />
            ))}
          </div>

          {done ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto mb-6 grid place-items-center rounded-full border border-[var(--color-brass)]/50 text-[var(--color-brass)] text-xl">✓</div>
              <h4 className="display text-[26px] mb-3 text-[var(--color-bone)]">Your request is noted.</h4>
              <p className="body-copy mx-auto text-center">
                {name ? name + ", your" : "Your"} {occasion.title.toLowerCase()} home visit across {atelier.city} Bengaluru is requested for {dateTxt} at {time}. Master G will confirm by email.
              </p>
              <button type="button" onClick={close} className="mt-8 label border-b border-[var(--color-brass)]/40 pb-1">Close</button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div>
                  <h4 className="display text-[clamp(22px,2.4vw,30px)] mb-2 text-[var(--color-bone)]">What are we building?</h4>
                  <p className="body-copy !text-[13px] mb-6">The occasion shapes the cloth, the cut and the weight of the weave.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {OCCASIONS.map((o) => (
                      <button
                        type="button"
                        key={o.id}
                        onClick={() => setOccasion(o)}
                        aria-pressed={occasion.id === o.id}
                        className={`group relative text-left overflow-hidden rounded-[4px] border transition-colors ${occasion.id === o.id ? "border-[var(--color-brass)]" : "border-[var(--color-line)] hover:border-[var(--color-ash)]"}`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img src={`/media/${o.media}.jpg`} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[var(--ease-cloth)] group-hover:scale-[1.05]" />
                          <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(23,24,28,0.72) 100%)" }} />
                          <span className={`absolute top-2 right-2 w-4 h-4 rounded-full border transition-colors ${occasion.id === o.id ? "bg-[var(--color-brass)] border-[var(--color-brass)]" : "border-white/60"}`} />
                        </div>
                        <div className="p-3">
                          <p className="text-[13px] text-[var(--color-bone)] font-medium">{o.title}</p>
                          <p className="text-[11px] text-[var(--color-ash)]">{o.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end mt-8">
                    <Next onClick={() => setStep(2)} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                  <h4 className="display text-[clamp(22px,2.4vw,30px)] mb-6 text-[var(--color-bone)]">Where, and when?</h4>
                  <Group label="Area">
                    <div className="grid gap-2.5">
                      {ateliers.map((a) => {
                        const active = atelier.city === a.city;
                        return (
                          <button
                            type="button"
                            key={a.city}
                            onClick={() => setAtelier(a)}
                            aria-pressed={active}
                            className="flex items-center gap-3 px-4 py-3 rounded-[4px] text-left border transition-colors"
                            style={active
                              ? { backgroundColor: "var(--color-bone)", borderColor: "var(--color-bone)", color: "#fff" }
                              : { borderColor: "var(--color-line)", color: "var(--color-bone)" }}
                          >
                            <span className={`label !tracking-[0.16em] shrink-0 ${active ? "!text-white/70" : "!text-[var(--color-brass)]"}`}>{a.city}</span>
                            <span className="text-[13px] flex-1">{a.address}</span>
                            <span className={`text-[12px] hidden sm:inline ${active ? "text-white/70" : "text-[var(--color-ash)]"}`}>{a.cutter}</span>
                          </button>
                        );
                      })}
                    </div>
                  </Group>
                  <div className="grid sm:grid-cols-2 gap-4 mt-5">
                    <Field label="Preferred date">
                      <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="input" />
                    </Field>
                    <Group label="Time">
                      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Choose a time">
                        {TIMES.map((t) => {
                          const active = time === t;
                          return (
                            <button
                              type="button"
                              key={t}
                              role="radio"
                              aria-checked={active}
                              onClick={() => setTime(t)}
                              className="py-3 rounded-[4px] text-[12px] border font-medium transition-colors"
                              style={active
                                ? { backgroundColor: "var(--color-brass)", color: "#fff", borderColor: "var(--color-brass)" }
                                : { borderColor: "var(--color-line)", color: "var(--color-bone)" }}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </Group>
                  </div>
                  <div className="flex justify-between items-center gap-4 mt-8">
                    <Back onClick={() => setStep(1)} />
                    <Next submit />
                  </div>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
                  <h4 className="display text-[clamp(22px,2.4vw,30px)] mb-6 text-[var(--color-bone)]">Introduce yourself.</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Full name"><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input" /></Field>
                    <Field label="Phone"><input type="tel" placeholder="+91 …" className="input" /></Field>
                  </div>
                  <Field label="Email"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="input" /></Field>
                  <Field label="Notes for Master G (optional)"><textarea rows={2} placeholder="Occasion, references, timeline…" className="input resize-none" /></Field>
                  <div className="flex justify-between items-center gap-4 mt-8">
                    <Back onClick={() => setStep(2)} />
                    <button type="submit" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--color-bone)] text-white text-[11px] uppercase tracking-[0.2em] whitespace-nowrap shrink-0">Request Appointment →</button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-4">
      <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--color-ash)] mb-2.5">{label}</span>
      {children}
    </label>
  );
}
function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="block mb-4">
      <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--color-ash)] mb-2.5">{label}</span>
      {children}
    </div>
  );
}
function Next({ onClick, submit }: { onClick?: () => void; submit?: boolean }) {
  if (submit) return <button type="submit" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--color-bone)] text-white text-[11px] uppercase tracking-[0.2em] whitespace-nowrap shrink-0">Continue →</button>;
  return <button type="button" onClick={onClick} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--color-bone)] text-white text-[11px] uppercase tracking-[0.2em] whitespace-nowrap shrink-0">Continue →</button>;
}
function Back({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-ash)] hover:text-[var(--color-bone)] whitespace-nowrap shrink-0">← Back</button>;
}
