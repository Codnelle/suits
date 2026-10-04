"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { copy, houseOf, type Fabric, type House } from "@/lib/copy";
import { cartLines, type CartLine } from "@/lib/cart";
import FabricModal from "@/components/ui/FabricModal";
import CartDrawer from "@/components/order/CartDrawer";
import { openBooking } from "@/lib/booking";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function OrderFlow() {
  const [house, setHouse] = useState<House | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cart, setCart] = useState(false);

  useEffect(() => {
    const sync = () => setLines(cartLines());
    sync();
    window.addEventListener("cart-changed", sync);
    return () => window.removeEventListener("cart-changed", sync);
  }, []);

  const fabrics = house ? copy.cloth.fabrics.filter((f) => f.house === house.id) : copy.cloth.fabrics;
  const openFabric: Fabric | undefined = openId
    ? copy.cloth.fabrics.find((f) => f.id === openId)
    : undefined;

  const total = lines.reduce((sum, l) => sum + (copy.cloth.fabrics.find((f) => f.id === l.fabricId)?.price ?? 0), 0);
  const clear = useCallback(() => setLines([]), []);

  return (
    <>
      <section className="relative bg-[var(--color-ink)] pt-32 pb-16 overflow-hidden">
        <div className="px-[clamp(20px,5vw,80px)] max-w-5xl mx-auto">
          <span className="label">{copy.order.tag}</span>
          <h1 className="display text-[clamp(40px,6vw,86px)] mt-5 mb-6 text-[var(--color-bone)] leading-[0.95]">
            {copy.order.title}
          </h1>
          <p className="body-copy mb-8">{copy.order.lead}</p>
          <p className="text-[12px] text-[var(--color-ash)]">
            In Bengaluru?{" "}
            <button onClick={() => openBooking()} className="stitch-link text-[var(--color-brass)]">
              Book Master G at home instead
            </button>
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-ink)] pb-24">
        <div className="px-[clamp(20px,5vw,80px)] max-w-6xl mx-auto">
          <hr className="stitch-rule mb-12" />
          <span className="label mb-8 block">How it works</span>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-24">
            {copy.order.steps.map((s) => (
              <Reveal key={s.n}>
                <li className="h-full list-none p-6 rounded-[6px] border border-[var(--color-line)] bg-[var(--color-cloud)]/60">
                  <span className="label">{s.n}</span>
                  <h2 className="display text-[clamp(20px,2vw,26px)] mt-3 mb-3 text-[var(--color-bone)]">{s.title}</h2>
                  <p className="text-[13px] text-[var(--color-ash)] leading-relaxed">{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[var(--color-ink)] pb-28">
        <div className="px-[clamp(20px,5vw,80px)] max-w-6xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <div>
              <span className="label">Step 01 — Choose your fabric</span>
              <h2 className="display text-[clamp(28px,3.4vw,46px)] mt-3 text-[var(--color-bone)]">
                The Collection
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setHouse(null)}
                aria-pressed={house === null}
                className="label !tracking-[0.14em] px-5 py-2.5 rounded-full border transition-colors"
                style={house === null ? chipOn : chipOff}
              >
                {copy.cloth.allHouses}
              </button>
              {copy.cloth.houses.map((h) => (
                <button
                  type="button"
                  key={h.id}
                  onClick={() => setHouse(h)}
                  aria-pressed={house?.id === h.id}
                  className="label !tracking-[0.14em] px-5 py-2.5 rounded-full border transition-colors"
                  style={house?.id === h.id ? chipOn : chipOff}
                >
                  {h.name.replace("House of ", "")} · {h.short}
                </button>
              ))}
            </div>
          </div>

          {house && <p className="body-copy !text-[13px] mb-8 max-w-[62ch]">{house.blurb}</p>}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fabrics.map((f) => {
              const h = houseOf(f.house);
              return (
                <article key={f.id} className="group">
                  <button
                    type="button"
                    onClick={() => setOpenId(f.id)}
                    data-measure={f.blend}
                    aria-label={`Open ${f.name}`}
                    className="block w-full text-left"
                  >
                    <figure className="relative aspect-[4/5] overflow-hidden mask-edges">
                      <img
                        src={`/media/${f.media}`}
                        alt={`${f.name} cloth`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-cloth)] group-hover:scale-[1.05]"
                      />
                      <span className="weave" aria-hidden />
                      <span className="rake" aria-hidden />
                      <span className="absolute top-4 left-4 label !tracking-[0.14em] text-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
                        Choose
                      </span>
                    </figure>
                    <div className="pt-5">
                      <h3 className="font-[family-name:var(--font-display)] text-[clamp(20px,2vw,25px)] text-[var(--color-bone)]">
                        {f.name}
                      </h3>
                      <p className="mono text-[10px] tracking-[0.16em] uppercase text-[var(--color-ash)] mt-2">
                        {f.blend}
                      </p>
                      <p className="text-[12px] text-[var(--color-ash)] mt-2">
                        {h.name} · {h.range}
                      </p>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-[var(--color-ash)]/15">
            <p className="text-[12px] text-[var(--color-ash)] max-w-[46ch]">
              {copy.order.measureNote}{" "}
              <a href={`mailto:${copy.order.tapeEmail}`} className="stitch-link text-[var(--color-brass)]">
                {copy.order.tapeEmail}
              </a>
            </p>
            <Magnetic strength={0.2}>
              <button
                onClick={() => setCart(true)}
                className="inline-flex items-center gap-4 pl-6 pr-2 py-2 rounded-full bg-[var(--color-bone)] text-white transition-colors hover:bg-[var(--color-brass)]"
              >
                <span className="text-[11px] tracking-[0.2em] uppercase">
                  {copy.order.cartTitle} · {lines.length}
                </span>
                <span className="grid place-items-center w-10 h-10 rounded-full bg-[var(--color-brass)] text-white text-[15px]">
                  {lines.reduce((s, l) => s + (copy.cloth.fabrics.find((f) => f.id === l.fabricId)?.price ?? 0), 0) > 0
                    ? money(total)
                    : "—"}
                </span>
              </button>
            </Magnetic>
          </div>

          <p className="text-[11px] text-[var(--color-ash)] mt-8">{copy.cloth.priceNote}</p>
        </div>
      </section>

      {openFabric && (
        <FabricModal fabric={openFabric} mode="order" onClose={() => setOpenId(null)} />
      )}

      {cart && (
        <CartDrawer
          lines={lines}
          total={total}
          onClose={() => setCart(false)}
          onRemove={() => setLines(cartLines())}
          onPlaced={clear}
        />
      )}

      <section className="bg-[var(--color-ink)] pb-24">
        <div className="px-[clamp(20px,5vw,80px)] max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6 pt-10 border-t border-[var(--color-ash)]/15">
          <Link href="/#cloth" className="stitch-link text-[12px] text-[var(--color-ash)]">
            ← Back to The Collection
          </Link>
          <p className="text-[12px] text-[var(--color-ash)]">
            Or let Master G come to you —{" "}
            <button onClick={() => openBooking()} className="stitch-link text-[var(--color-brass)]">
              book a home visit
            </button>
          </p>
        </div>
      </section>
    </>
  );
}

const chipOn = {
  backgroundColor: "var(--color-bone)",
  borderColor: "var(--color-bone)",
  color: "#fff",
} as const;

const chipOff = {
  borderColor: "var(--color-line)",
  color: "var(--color-ash)",
} as const;