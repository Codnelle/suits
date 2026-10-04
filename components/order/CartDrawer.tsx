"use client";

import { useEffect, useRef, useState } from "react";
import { copy, CONFIG_GROUPS, fabricById } from "@/lib/copy";
import { clearCart, removeFromCart, type CartLine } from "@/lib/cart";
import { payWithRazorpay } from "@/lib/razorpay";

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function CartDrawer({
  lines,
  total,
  onClose,
  onRemove,
  onPlaced,
}: {
  lines: CartLine[];
  total: number;
  onClose: () => void;
  onRemove: () => void;
  onPlaced: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [note, setNote] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
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
    };
  }, [onClose]);

  const remove = (key: string) => {
    removeFromCart(key);
    onRemove();
  };

  const placeOrder = async () => {
    setBusy(true);
    const result = await payWithRazorpay({
      amount: total * 100,
      receipt: `order_${Date.now()}`,
      description: `${lines.length} made-to-measure suit${lines.length > 1 ? "s" : ""}`,
      prefill: { name, email: email || undefined, contact: phone || undefined },
      notes: { kind: "order", items: String(lines.length), city: city || "" },
      onSuccess: ({ paymentId }) => {
        void deliver({ id: paymentId, amount: total });
      },
    });
    setBusy(false);
    if (result.status === "unconfigured") {
      setNote(
        "Online payment is being switched on. Your order has been recorded anyway — we will confirm the amount and delivery by WhatsApp or email."
      );
      await deliver();
    }
  };

  const deliver = async (payment?: { id: string; amount: number }) => {
    setBusy(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "order",
          name,
          phone,
          email,
          address,
          city,
          state,
          pincode,
          total,
          notes: note || undefined,
          payment,
          lines: lines.map((l) => {
            const fabric = fabricById(l.fabricId);
            return {
              fabric: fabric?.name,
              house: fabric ? copy.cloth.houses.find((h) => h.id === fabric.house)?.name : undefined,
              blend: fabric?.blend,
              price: fabric?.price,
              configuration: l.configuration,
              measurements: l.measurements,
            };
          }),
        }),
      });
      const data = (await res.json()) as { delivered?: boolean; mailto?: string };
      if (!data.delivered && data.mailto) window.location.href = data.mailto;
      clearCart();
      onPlaced();
      setPlaced(true);
    } catch {
      setNote("We could not reach Shahee just now. Please email your order and we will take it from there.");
    } finally {
      setBusy(false);
    }
  };

  const summary = lines.map((l) => {
    const fabric = fabricById(l.fabricId);
    const config = Object.entries(l.configuration)
      .map(([k]) => copy.configure[k as keyof typeof copy.configure]?.find((o) => o.id === l.configuration[k])?.title)
      .filter(Boolean)
      .join(" · ");
    const measured = Object.values(l.measurements).filter(Boolean).length;
    return { line: l, fabric, config, measured };
  });

  return (
    <div className="fixed inset-0 z-[85]">
      <div className="absolute inset-0 bg-[#14161A]/55 backdrop-blur-[4px]" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={copy.order.cartTitle}
        tabIndex={-1}
        className="absolute top-0 right-0 h-full w-[min(96vw,560px)] overflow-y-auto bg-[var(--color-cloud)] border-l border-[var(--color-line)] outline-none"
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full border border-[var(--color-line)] text-[var(--color-ash)] hover:text-[var(--color-bone)] transition-colors">✕</button>

        <div className="p-6 md:p-10">
          <span className="label">Shahee</span>
          <h3 className="display text-[clamp(26px,3vw,36px)] mt-3 mb-8 text-[var(--color-bone)]">
            {copy.order.cartTitle}
          </h3>

          {placed ? (
            <div className="py-8 text-center">
              <div className="w-14 h-14 mx-auto mb-6 grid place-items-center rounded-full border border-[var(--color-brass)]/50 text-[var(--color-brass)] text-xl">✓</div>
              <h4 className="display text-[24px] mb-3 text-[var(--color-bone)]">Order received.</h4>
              <p className="body-copy mx-auto text-center !text-[13px]">{note}</p>
              <p className="body-copy mx-auto text-center !text-[13px] mt-4 border border-[var(--color-line)] rounded-[4px] px-5 py-4">
                {copy.booking.confirmNote}
              </p>
              <button type="button" onClick={onClose} className="mt-8 label border-b border-[var(--color-brass)]/40 pb-1">
                Close
              </button>
            </div>
          ) : summary.length === 0 ? (
            <p className="body-copy !text-[13px]">{copy.order.empty}</p>
          ) : (
            <>
              <ul className="flex flex-col gap-6 mb-8">
                {summary.map(({ line, fabric, config, measured }) => (
                  <li key={line.key} className="flex gap-4 pb-6 border-b border-[var(--color-ash)]/15">
                    <figure className="relative w-20 h-24 shrink-0 overflow-hidden rounded-[3px]">
                      <img src={`/media/${fabric?.media}`} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    </figure>
                    <div className="flex-1">
                      <p className="font-[family-name:var(--font-display)] text-[18px] text-[var(--color-bone)]">
                        {fabric?.name}
                      </p>
                      <p className="mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-ash)] mt-1">
                        {config}
                      </p>
                      <p className="text-[11px] text-[var(--color-ash)] mt-1">
                        {measured} measurements on file
                      </p>
                      <div className="flex items-center justify-between gap-3 mt-3">
                        <span className="text-[13px] text-[var(--color-bone)] tabular-nums">{money(fabric?.price ?? 0)}</span>
                        <button
                          type="button"
                          onClick={() => remove(line.key)}
                          className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-ash)] hover:text-[var(--color-bone)]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex items-baseline justify-between mb-7">
                <span className="label">Total</span>
                <span className="display text-[clamp(24px,3vw,34px)] text-[var(--color-bone)] tabular-nums">
                  {money(total)}
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-ash)] mb-7">{copy.cloth.priceNote}</p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void placeOrder();
                }}
              >
                <span className="label mb-4 block">Deliver to</span>
                <div className="grid sm:grid-cols-2 gap-x-4">
                  <Field label="Full name">
                    <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
                  </Field>
                  <Field label="Phone">
                    <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 …" className="input" />
                  </Field>
                </div>
                <Field label="Email">
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
                </Field>
                <Field label="Address">
                  <textarea required rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className="input resize-none" />
                </Field>
                <div className="grid sm:grid-cols-3 gap-x-4">
                  <Field label="City">
                    <input required value={city} onChange={(e) => setCity(e.target.value)} className="input" />
                  </Field>
                  <Field label="State">
                    <input required value={state} onChange={(e) => setState(e.target.value)} className="input" />
                  </Field>
                  <Field label="Pincode">
                    <input
                      required
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      className="input"
                    />
                  </Field>
                </div>
                <Field label="Notes (optional)">
                  <textarea rows={2} value={note.startsWith("Online payment") ? "" : note} onChange={(e) => setNote(e.target.value)} placeholder="Timeline, delivery instructions…" className="input resize-none" />
                </Field>

                {note && note.startsWith("Online payment") && (
                  <p className="text-[11px] text-[var(--color-ash)] mb-5">{note}</p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-[var(--color-bone)] text-white text-[11px] uppercase tracking-[0.2em] transition-opacity disabled:opacity-40"
                >
                  {busy ? "Opening payment…" : `${copy.order.placeOrder} · ${money(total)}`}
                </button>
              </form>
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