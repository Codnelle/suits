"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { copy, CONFIG_GROUPS, defaultConfiguration, houseOf, type Fabric } from "@/lib/copy";
import { addToCart } from "@/lib/cart";
import { openBooking } from "@/lib/booking";

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function FabricModal({
  fabric,
  mode = "browse",
  onClose,
}: {
  fabric: Fabric;
  mode?: "browse" | "order";
  onClose: () => void;
}) {
  const house = houseOf(fabric.house);
  const [config, setConfig] = useState<Record<string, string>>(defaultConfiguration);
  const [measure, setMeasure] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [added, setAdded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const required = copy.measure.fields.filter((f) => !("optional" in f) || !f.optional);
  const missing = required.filter((f) => !measure[f.id]?.trim());

  const chosen = useMemo(
    () =>
      CONFIG_GROUPS.map((g) => {
        const option = copy.configure[g.key].find((o) => o.id === config[g.key]);
        return { label: g.label, title: option?.title ?? "", note: option?.note ?? "" };
      }),
    [config]
  );

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lastFocus.current = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => panelRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
      lastFocus.current?.focus();
    };
  }, [onClose]);

  const submitOrder = () => {
    addToCart({
      fabricId: fabric.id,
      configuration: config,
      measurements: mode === "order" ? measure : {},
    });
    setAdded(true);
    setTimeout(onClose, 900);
  };

  return (
    <div className="fixed inset-0 z-[85] transition-opacity duration-400" style={{ opacity: 1 }}>
      <div className="absolute inset-0 bg-[#14161A]/55 backdrop-blur-[4px]" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={fabric.name}
        tabIndex={-1}
        className="absolute top-1/2 left-1/2 w-[min(96vw,1080px)] max-h-[92svh] overflow-y-auto rounded-[6px] bg-[var(--color-cloud)] border border-[var(--color-line)] outline-none"
        style={{ transform: "translate(-50%, -50%)", boxShadow: "0 50px 120px -40px rgba(20,20,25,0.5)" }}
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full border border-[var(--color-line)] bg-[var(--color-cloud)]/80 backdrop-blur text-[var(--color-ash)] hover:text-[var(--color-bone)] transition-colors">✕</button>

        <div className="grid md:grid-cols-[minmax(0,42%)_1fr]">
          <figure className="relative m-0 aspect-[4/5] md:aspect-auto md:min-h-[560px] overflow-hidden">
            <img src={`/media/${fabric.media}`} alt={`${fabric.name} cloth`} className="absolute inset-0 w-full h-full object-cover" />
            <span className="weave" aria-hidden />
            <span className="absolute bottom-4 left-5 mono text-[10px] tracking-[0.18em] uppercase text-white/90">
              {house.name} · {house.short}
            </span>
          </figure>

          <div className="p-6 md:p-10">
            <span className="label">{copy.cloth.tag}</span>
            <h3 className="display text-[clamp(26px,3vw,40px)] mt-3 mb-2 text-[var(--color-bone)]">{fabric.name}</h3>
            <p className="mono text-[11px] tracking-[0.16em] uppercase text-[var(--color-ash)] mb-4">{fabric.blend}</p>
            <p className="body-copy !text-[13px] mb-6">{fabric.line}</p>

            <dl className="grid grid-cols-2 gap-5 border-y border-[var(--color-line)] py-5 mb-6">
              <div>
                <dt className="label !text-[var(--color-ash)]/60 !tracking-[0.2em] mb-1.5">House</dt>
                <dd className="text-[13px] text-[var(--color-bone)]">{house.name}</dd>
              </div>
              <div>
                <dt className="label !text-[var(--color-ash)]/60 !tracking-[0.2em] mb-1.5">Range</dt>
                <dd className="text-[13px] text-[var(--color-bone)] tabular-nums">{house.range}</dd>
              </div>
              <div>
                <dt className="label !text-[var(--color-ash)]/60 !tracking-[0.2em] mb-1.5">Indicative price</dt>
                <dd className="text-[13px] text-[var(--color-bone)] tabular-nums">{money(fabric.price)}</dd>
              </div>
              <div>
                <dt className="label !text-[var(--color-ash)]/60 !tracking-[0.2em] mb-1.5">Blend</dt>
                <dd className="text-[13px] text-[var(--color-bone)]">{fabric.blend}</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2 mb-8">
              {fabric.occasions.map((o) => (
                <span key={o} className="label !tracking-[0.16em] !text-[var(--color-ash)] border border-[var(--color-line)] px-3 py-1.5 rounded-full">{o}</span>
              ))}
            </div>

            {/* the four decisions */}
            <h4 className="label mb-4">{mode === "order" ? "Select your design" : "Design it"}</h4>
            <div className="flex flex-col gap-5 mb-8">
              {CONFIG_GROUPS.map((g) => (
                <div key={g.key}>
                  <div className="flex items-baseline justify-between gap-4 mb-2.5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-ash)]">{g.label}</span>
                    <span className="text-[11px] text-[var(--color-bone)]">
                      {copy.configure[g.key].find((o) => o.id === config[g.key])?.title}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {copy.configure[g.key].map((o) => {
                      const active = config[g.key] === o.id;
                      return (
                        <button
                          type="button"
                          key={o.id}
                          onClick={() => setConfig((c) => ({ ...c, [g.key]: o.id }))}
                          aria-pressed={active}
                          title={o.note}
                          className="label !tracking-[0.14em] px-4 py-2 rounded-full border transition-colors"
                          style={active
                            ? { backgroundColor: "var(--color-bone)", borderColor: "var(--color-bone)", color: "#fff" }
                            : { borderColor: "var(--color-line)", color: "var(--color-ash)" }}
                        >
                          {o.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {mode === "order" && (
              <>
                <h4 className="label mb-2">{copy.measure.title}</h4>
                <p className="text-[11px] text-[var(--color-ash)] leading-relaxed mb-5 max-w-[48ch]">{copy.measure.lead}</p>
                <div className="grid sm:grid-cols-2 gap-x-5 gap-y-3.5 mb-5">
                  {copy.measure.fields.map((f) => (
                    <label key={f.id} className="block">
                      <span className="block text-[10px] uppercase tracking-[0.18em] text-[var(--color-ash)] mb-1.5">
                        {f.label}
                        {"optional" in f && f.optional ? <em className="not-italic opacity-60"> · optional</em> : null}
                      </span>
                      <input
                        inputMode="decimal"
                        value={measure[f.id] ?? ""}
                        onChange={(e) => setMeasure((m) => ({ ...m, [f.id]: e.target.value }))}
                        placeholder={f.hint}
                        className="input !py-2.5 !text-[13px]"
                      />
                    </label>
                  ))}
                </div>
                <label className="block mb-6">
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-[var(--color-ash)] mb-1.5">
                    {copy.measure.notesLabel}
                  </span>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={copy.measure.notesHint}
                    className="input resize-none !py-2.5 !text-[13px]"
                  />
                </label>
                <p className="text-[11px] text-[var(--color-ash)] mb-5">
                  {copy.order.measureNote}{" "}
                  <a href={`mailto:${copy.order.tapeEmail}`} className="stitch-link text-[var(--color-brass)]">{copy.order.tapeEmail}</a>
                </p>
              </>
            )}

            <p className="text-[11px] text-[var(--color-ash)] leading-relaxed mb-6">{copy.cloth.priceNote}</p>

            {mode === "order" ? (
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={submitOrder}
                  disabled={missing.length > 0}
                  className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[var(--color-bone)] text-white text-[11px] uppercase tracking-[0.2em] transition-opacity disabled:opacity-35"
                >
                  {added ? "Added to order ✓" : `Add to cart · ${money(fabric.price)}`}
                </button>
                {missing.length > 0 && (
                  <span className="text-[11px] text-[var(--color-ash)]">
                    {missing.length} measurement{missing.length > 1 ? "s" : ""} still needed
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openBooking({
                      label: `${fabric.name} · ${fabric.blend} · ${house.name}`,
                      note: `Design considered: ${chosen.map((c) => `${c.label.toLowerCase()} ${c.title.toLowerCase()}`).join(", ")}.`,
                    });
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--color-bone)] text-white text-[11px] uppercase tracking-[0.2em]"
                >
                  Book Master G with this cloth
                </button>
                <Link
                  href="/order"
                  onClick={onClose}
                  className="stitch-link text-[12px] text-[var(--color-brass)]"
                >
                  {copy.booking.notInBangalore}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}