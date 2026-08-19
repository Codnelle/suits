"use client";

import { useEffect, useRef, useState } from "react";

const SERVICES = ["Bespoke Two-Piece", "Three-Piece", "Black Tie", "Wedding", "Overcoat", "Full Wardrobe"];
const ATELIERS = ["London — Savile Row", "Milan — Via Gesù", "New York — 57th"];
const TIMES = ["10:00", "11:30", "14:00", "15:30", "17:00"];

export default function Booking() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [service, setService] = useState(SERVICES[0]);
  const [atelier, setAtelier] = useState(ATELIERS[0]);
  const [time, setTime] = useState(TIMES[2]);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openFn = () => { setOpen(true); setStep(1); setDone(false); };
    window.addEventListener("open-booking", openFn);
    return () => window.removeEventListener("open-booking", openFn);
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (open) { lenis?.stop(); document.documentElement.style.overflow = "hidden"; }
    else { lenis?.start(); document.documentElement.style.overflow = ""; }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const steps = ["The Occasion", "Atelier & Date", "Your Details"];
  const dateTxt = date ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "your preferred date";

  return (
    <div
      aria-hidden={!open}
      className="fixed inset-0 z-[80] transition-opacity duration-500"
      style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
    >
      <div className="absolute inset-0 bg-[#17181c]/45 backdrop-blur-[3px]" onClick={() => setOpen(false)} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Book a fitting"
        className="absolute top-1/2 left-1/2 w-[min(94vw,940px)] max-h-[92vh] overflow-hidden grid md:grid-cols-[0.85fr_1.15fr] rounded-[6px] bg-[var(--color-cloud)] border border-[var(--color-line)]"
        style={{ transform: `translate(-50%, ${open ? "-50%" : "-46%"})`, transition: "transform 520ms var(--ease-cloth)", boxShadow: "0 50px 120px -40px rgba(20,20,25,0.4)" }}
      >
        <button onClick={() => setOpen(false)} aria-label="Close" className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full border border-[var(--color-line)] text-[var(--color-ash)] hover:text-[var(--color-bone)] transition-colors">✕</button>

        {/* aside */}
        <div className="hidden md:flex flex-col p-10 bg-[var(--color-ink)] border-r border-[var(--color-line)]">
          <span className="label">Ashford &amp; Vane</span>
          <h3 className="display text-[clamp(30px,3vw,44px)] mt-5 mb-5 text-[var(--color-bone)]">Book<br />a Fitting</h3>
          <p className="body-copy">A private consultation with a master cutter. Measurements, cloth and construction — considered together.</p>
          <ul className="mt-auto pt-10 flex flex-col gap-3.5">
            {steps.map((s, i) => (
              <li key={s} className={`flex items-center gap-3 text-[12px] uppercase tracking-[0.14em] ${i + 1 === step ? "text-[var(--color-bone)]" : i + 1 < step ? "text-[var(--color-ash)]" : "text-[var(--color-ash)]/50"}`}>
                <b className={i + 1 <= step ? "text-[var(--color-brass)]" : "text-[var(--color-line)]"}>0{i + 1}</b> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* form */}
        <div className="p-8 md:p-12 overflow-y-auto">
          {done ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto mb-6 grid place-items-center rounded-full border border-[var(--color-brass)]/50 text-[var(--color-brass)] text-xl">✓</div>
              <h4 className="display text-[26px] mb-3 text-[var(--color-bone)]">Your request is noted.</h4>
              <p className="body-copy mx-auto text-center">{name ? name + ", your" : "Your"} {service} fitting at {atelier} is requested for {dateTxt} at {time}. A cutter will confirm by email.</p>
              <button onClick={() => setOpen(false)} className="mt-8 label border-b border-[var(--color-brass)]/40 pb-1">Close</button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div>
                  <h4 className="display text-[clamp(22px,2.4vw,30px)] mb-7 text-[var(--color-bone)]">What are we building?</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SERVICES.map((s) => (
                      <button key={s} onClick={() => setService(s)}
                        className={`px-4 py-3.5 rounded-[3px] text-[13px] border transition-colors ${service === s ? "bg-[var(--color-bone)] text-white border-[var(--color-bone)]" : "border-[var(--color-line)] text-[var(--color-bone)] hover:border-[var(--color-ash)]"}`}>{s}</button>
                    ))}
                  </div>
                  <div className="flex justify-end mt-8">
                    <Next onClick={() => setStep(2)} />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <h4 className="display text-[clamp(22px,2.4vw,30px)] mb-7 text-[var(--color-bone)]">Where, and when?</h4>
                  <Field label="Atelier">
                    <div className="grid gap-2.5">
                      {ATELIERS.map((a) => (
                        <button key={a} onClick={() => setAtelier(a)}
                          className={`px-4 py-3.5 rounded-[3px] text-[13px] border text-left transition-colors ${atelier === a ? "bg-[var(--color-bone)] text-white border-[var(--color-bone)]" : "border-[var(--color-line)] text-[var(--color-bone)] hover:border-[var(--color-ash)]"}`}>{a}</button>
                      ))}
                    </div>
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4 mt-5">
                    <Field label="Preferred date">
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
                    </Field>
                    <Field label="Time">
                      <div className="grid grid-cols-3 gap-2">
                        {TIMES.map((t) => (
                          <button key={t} onClick={() => setTime(t)} className={`py-3 rounded-[3px] text-[12px] border transition-colors ${time === t ? "bg-[var(--color-brass)] text-white border-[var(--color-brass)]" : "border-[var(--color-line)] text-[var(--color-bone)] hover:border-[var(--color-ash)]"}`}>{t}</button>
                        ))}
                      </div>
                    </Field>
                  </div>
                  <div className="flex justify-between mt-8">
                    <Back onClick={() => setStep(1)} />
                    <Next onClick={() => setStep(3)} />
                  </div>
                </div>
              )}
              {step === 3 && (
                <form onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
                  <h4 className="display text-[clamp(22px,2.4vw,30px)] mb-7 text-[var(--color-bone)]">Introduce yourself.</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input" /></Field>
                    <Field label="Phone"><input type="tel" placeholder="+44 …" className="input" /></Field>
                  </div>
                  <Field label="Email"><input type="email" placeholder="you@email.com" className="input" /></Field>
                  <Field label="Notes for your cutter (optional)"><textarea rows={2} placeholder="Occasion, references, timeline…" className="input resize-none" /></Field>
                  <div className="flex justify-between mt-8">
                    <Back onClick={() => setStep(2)} />
                    <button type="submit" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--color-bone)] text-white text-[11px] uppercase tracking-[0.2em]">Request Appointment →</button>
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
function Next({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--color-bone)] text-white text-[11px] uppercase tracking-[0.2em]">Continue →</button>;
}
function Back({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-ash)] hover:text-[var(--color-bone)]">← Back</button>;
}
