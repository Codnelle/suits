"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { copy } from "@/lib/copy";
import { payWithRazorpay } from "@/lib/razorpay";

type Zone = (typeof copy.booking.zones)[number];

const TIMES = ["10:00", "11:30", "13:00", "15:00", "17:00", "19:00"];
const FEE = 19900;

export default function Booking() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [zone, setZone] = useState<Zone>(copy.booking.zones[0]);
  const [time, setTime] = useState(TIMES[2]);
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState("");
  const [notes, setNotes] = useState("");
  const [clothTag, setClothTag] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [payNote, setPayNote] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const reset = () => {
    setStep(1);
    setDone(false);
    setAgreed(false);
    setPayNote("");
    setClothTag("");
    setOccasion("");
    setNotes("");
  };

  useEffect(() => {
    const openFn = (e: Event) => {
      const detail = (e as CustomEvent<{ note?: string; label?: string } | undefined>).detail;
      lastFocus.current = document.activeElement as HTMLElement | null;
      reset();
      if (detail?.note) setNotes(detail.note);
      if (detail?.label) setClothTag(detail.label);
      setOpen(true);
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
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") close();
      };
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
    setTerms(false);
    lastFocus.current?.focus();
  };

  const dateTxt = date
    ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "your preferred date";

  const submit = async (payment?: { id: string; amount: number }) => {
    setBusy(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "booking",
          name,
          phone,
          email,
          occasion: occasion || undefined,
          zone: zone.name,
          areas: zone.areas,
          date: dateTxt,
          time,
          address,
          pincode,
          notes: [clothTag ? `Interested in: ${clothTag}` : "", notes].filter(Boolean).join(" · "),
          payment,
        }),
      });
      const data = (await res.json()) as { delivered?: boolean; mailto?: string };
      if (!data.delivered && data.mailto) window.location.href = data.mailto;
      setDone(true);
    } catch {
      setDone(true);
    } finally {
      setBusy(false);
    }
  };

  const payAndSubmit = async () => {
    setBusy(true);
    const result = await payWithRazorpay({
      amount: FEE,
      receipt: `visit_${Date.now()}`,
      description: "Home visit — Master G at your door",
      prefill: { name, email: email || undefined, contact: phone || undefined },
      notes: { kind: "booking", zone: zone.name, date: dateTxt, time },
      onSuccess: ({ paymentId }) => {
        void submit({ id: paymentId, amount: 199 });
      },
    });
    setBusy(false);
    if (result.status === "unconfigured") {
      setPayNote(
        "Online payment is being switched on. Your request has been recorded anyway — we will confirm the ₹199 visit fee by WhatsApp or email."
      );
      await submit();
    }
  };

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
        aria-label={copy.booking.title}
        tabIndex={-1}
        className="absolute top-1/2 left-1/2 w-[min(94vw,980px)] max-h-[92svh] overflow-hidden flex flex-col md:flex-row rounded-[6px] bg-[var(--color-cloud)] border border-[var(--color-line)] outline-none"
        style={{ transform: `translate(-50%, ${open ? "-50%" : "-46%"})`, transition: "transform 520ms var(--ease-cloth)", boxShadow: "0 50px 120px -40px rgba(20,20,25,0.5)" }}
      >
        <button type="button" onClick={close} aria-label="Close" className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full border border-[var(--color-line)] text-[var(--color-ash)] hover:text-[var(--color-bone)] transition-colors">✕</button>

        {/* aside — the four things that happen */}
        <div className="hidden md:flex md:flex-col min-h-0 md:w-[37%] md:shrink-0 overflow-y-auto p-10 bg-[var(--color-ink)] border-r border-[var(--color-line)]">
          <span className="label">Shahee</span>
          <h3 className="display text-[clamp(28px,3vw,42px)] mt-5 mb-5 text-[var(--color-bone)]">
            {copy.booking.title}
          </h3>
          <p className="body-copy !text-[13px]">{copy.booking.stepAside}</p>

          <ul className="mt-10 flex flex-col gap-4">
            {copy.booking.steps.map((s, i) => (
              <li key={s} className="flex items-baseline gap-4">
                <b className="text-[12px] text-[var(--color-brass)] tabular-nums">0{i + 1}</b>
                <span className="text-[13px] text-[var(--color-bone)] leading-snug">{s}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-10">
            <Link
              href="/order"
              onClick={close}
              className="block text-[12px] text-[var(--color-bone)] border-b border-[var(--color-brass)]/50 pb-1 w-fit"
            >
              {copy.booking.notInBangalore} →
            </Link>
            <p className="mt-3 text-[11px] text-[var(--color-ash)] leading-relaxed">
              {copy.booking.notInBangaloreNote}
            </p>
          </div>
        </div>

        {/* form */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-10">
          <div className="md:hidden flex items-center gap-2 mb-6" aria-hidden>
            {copy.booking.formSteps.map((s, i) => (
              <span key={s} className={`h-[3px] flex-1 rounded-full ${i + 1 <= step ? "bg-[var(--color-brass)]" : "bg-[var(--color-line)]"}`} />
            ))}
          </div>

          {done ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 mx-auto mb-6 grid place-items-center rounded-full border border-[var(--color-brass)]/50 text-[var(--color-brass)] text-xl">✓</div>
              <h4 className="display text-[26px] mb-3 text-[var(--color-bone)]">Request received.</h4>
              <p className="body-copy mx-auto text-center !text-[13px]">
                {name ? `${name}, your` : "Your"} home visit across {zone.name} is requested for{" "}
                {dateTxt} at {time}. {payNote}
              </p>
              <p className="body-copy mx-auto text-center !text-[13px] mt-4 max-w-[42ch] border border-[var(--color-line)] rounded-[4px] px-5 py-4">
                {copy.booking.confirmNote}
              </p>
              <p className="text-[12px] text-[var(--color-ash)] mt-6">
                Something urgent? <a href={`mailto:${copy.booking.email}`} className="stitch-link text-[var(--color-brass)]">{copy.booking.email}</a>
              </p>
              <button type="button" onClick={close} className="mt-8 label border-b border-[var(--color-brass)]/40 pb-1">Close</button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <form
                  id="bk-where"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(2);
                  }}
                >
                  <h4 className="display text-[clamp(22px,2.4vw,30px)] mb-2 text-[var(--color-bone)]">When and where?</h4>
                  <p className="body-copy !text-[13px] mb-6">Pick the zone closest to you, then tell us where exactly.</p>

                  <div className="grid gap-2.5">
                    {copy.booking.zones.map((z) => {
                      const active = zone.id === z.id;
                      return (
                        <button
                          type="button"
                          key={z.id}
                          onClick={() => setZone(z)}
                          aria-pressed={active}
                          className="flex items-center gap-4 px-4 py-3 rounded-[4px] text-left border transition-colors"
                          style={active
                            ? { backgroundColor: "var(--color-bone)", borderColor: "var(--color-bone)" }
                            : { borderColor: "var(--color-line)" }}
                        >
                          <span className={`label !tracking-[0.16em] shrink-0 ${active ? "!text-[var(--color-brass)]" : "!text-[var(--color-brass)]"}`}>{z.name}</span>
                          <span className={`flex-1 ${active ? "text-white" : "text-[var(--color-bone)]"}`}>
                            <span className="block text-[13px] leading-snug">{z.areas}</span>
                            <span className={`block mono text-[10px] mt-1 tracking-[0.1em] ${active ? "text-white/65" : "text-[var(--color-ash)]"}`}>
                              {z.pincodes}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-5">
                    <Field label="Preferred date">
                      <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="input" />
                    </Field>
                    <Field label="House pincode">
                      <input
                        required
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                        placeholder="560038"
                        className="input"
                      />
                    </Field>
                  </div>
                  <Field label="Full address for the visit">
                    <input
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Flat, building, street, landmark"
                      className="input"
                    />
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

                  <div className="flex justify-end mt-8">
                    <Next />
                  </div>
                </form>
              )}

              {step === 2 && (
                <form
                  id="bk-you"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(3);
                  }}
                >
                  <h4 className="display text-[clamp(22px,2.4vw,30px)] mb-6 text-[var(--color-bone)]">Introduce yourself.</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Full name">
                      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input" />
                    </Field>
                    <Field label="Phone">
                      <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 …" className="input" />
                    </Field>
                  </div>
                  <Field label="Email">
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="input" />
                  </Field>

                  <Group label={`${copy.booking.occasionLabel} · ${copy.booking.occasionOptional}`}>
                    <div className="flex flex-wrap gap-2">
                      {copy.booking.occasions.map((o) => {
                        const active = occasion === o;
                        return (
                          <button
                            type="button"
                            key={o}
                            onClick={() => setOccasion(active ? "" : o)}
                            aria-pressed={active}
                            className="label !tracking-[0.14em] px-4 py-2 rounded-full border transition-colors"
                            style={active
                              ? { backgroundColor: "var(--color-bone)", borderColor: "var(--color-bone)", color: "#fff" }
                              : { borderColor: "var(--color-line)", color: "var(--color-ash)" }}
                          >
                            {o}
                          </button>
                        );
                      })}
                    </div>
                  </Group>

                  {clothTag && (
                    <div className="flex items-center justify-between gap-3 mb-4 px-4 py-3 rounded-[4px] border border-[var(--color-brass)]/50 bg-[var(--color-brass)]/8">
                      <span className="text-[12px] text-[var(--color-bone)]">{clothTag}</span>
                      <button type="button" onClick={() => setClothTag("")} className="text-[11px] text-[var(--color-ash)] hover:text-[var(--color-bone)]">
                        Remove
                      </button>
                    </div>
                  )}

                  <Field label="Notes for Master G (optional)">
                    <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Timeline, a cut you already own, anything else…" className="input resize-none" />
                  </Field>

                  <div className="flex justify-between items-center gap-4 mt-8">
                    <Back onClick={() => setStep(1)} />
                    <Next />
                  </div>
                </form>
              )}

              {step === 3 && (
                <form
                  id="bk-pay"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void payAndSubmit();
                  }}
                >
                  <h4 className="display text-[clamp(22px,2.4vw,30px)] mb-6 text-[var(--color-bone)]">Confirm your slot.</h4>

                  <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4 border-y border-[var(--color-line)] py-6 mb-6">
                    <Row k="Zone" v={`${zone.name} — ${zone.areas}`} />
                    <Row k="Slot" v={`${dateTxt} at ${time}`} />
                    <Row k="Address" v={`${address}${pincode ? ` — ${pincode}` : ""}`} />
                    <Row k="Occasion" v={occasion || "Not specified"} />
                    <Row k="Contact" v={`${name}${phone ? ` · ${phone}` : ""}`} />
                    <Row k="Home visit fee" v={`${copy.booking.fee.now} (${copy.booking.fee.was})`} />
                  </dl>

                  <p className="body-copy !text-[12px] mb-5 max-w-[52ch]">{copy.booking.fee.note}</p>

                  <button
                    type="button"
                    onClick={() => setTerms(true)}
                    className="block text-left w-full text-[11px] text-[var(--color-ash)] mb-5 hover:text-[var(--color-bone)] transition-colors"
                  >
                    Read the {copy.booking.termsTitle} →
                  </button>

                  <label className="flex items-start gap-3 cursor-pointer select-none mb-6">
                    <input
                      type="checkbox"
                      required
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[var(--color-brass)]"
                    />
                    <span className="text-[12px] text-[var(--color-bone)] leading-snug">{copy.booking.termsLabel}</span>
                  </label>

                  <p className="body-copy !text-[12px] !max-w-[52ch] mb-7 border border-[var(--color-line)] rounded-[4px] px-4 py-3">
                    {copy.booking.confirmNote}
                  </p>

                  <div className="flex justify-between items-center gap-4">
                    <Back onClick={() => setStep(2)} />
                    <button
                      type="submit"
                      disabled={!agreed || busy}
                      className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[var(--color-bone)] text-white text-[11px] uppercase tracking-[0.2em] whitespace-nowrap shrink-0 transition-opacity disabled:opacity-35"
                    >
                      {busy ? "Opening payment…" : `Pay ${copy.booking.fee.now} & request`}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {terms && (
        <div className="absolute inset-0 z-[90] grid place-items-center p-6" role="dialog" aria-modal="true" aria-label={copy.booking.termsTitle}>
          <div className="absolute inset-0 bg-[#14161A]/60" onClick={() => setTerms(false)} />
          <div className="relative w-[min(94vw,680px)] max-h-[80svh] overflow-y-auto rounded-[6px] bg-[var(--color-cloud)] border border-[var(--color-line)] p-8">
            <div className="flex items-start justify-between gap-6 mb-4">
              <h4 className="display text-[clamp(22px,2.4vw,30px)] text-[var(--color-bone)]">{copy.booking.termsTitle}</h4>
              <button type="button" onClick={() => setTerms(false)} aria-label="Close terms" className="w-8 h-8 rounded-full border border-[var(--color-line)] text-[var(--color-ash)] shrink-0">✕</button>
            </div>
            <p className="body-copy !text-[13px] mb-5">{copy.booking.termsIntro}</p>
            <ol className="flex flex-col gap-3">
              {copy.booking.terms.map((t, i) => (
                <li key={t} className="flex gap-4 text-[13px] text-[var(--color-bone)] leading-relaxed">
                  <b className="text-[var(--color-brass)] mono text-[11px] pt-0.5">{String(i + 1).padStart(2, "0")}</b>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="label !text-[var(--color-ash)]/60 !tracking-[0.2em] mb-1.5">{k}</dt>
      <dd className="text-[13px] text-[var(--color-bone)] leading-snug">{v}</dd>
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

function Next() {
  return (
    <button
      type="submit"
      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--color-bone)] text-white text-[11px] uppercase tracking-[0.2em] whitespace-nowrap shrink-0"
    >
      Continue →
    </button>
  );
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-ash)] hover:text-[var(--color-bone)] whitespace-nowrap shrink-0">
      ← Back
    </button>
  );
}