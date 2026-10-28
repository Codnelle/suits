"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { copy, type House } from "@/lib/copy";
import Reveal from "@/components/ui/Reveal";
import SwatchChip from "@/components/ui/SwatchChip";
import FabricModal from "@/components/ui/FabricModal";
import { openBooking } from "@/lib/booking";

// II — The Collection.
// Four houses on a shelf. Pick a house, drag through its cloth, open one to
// choose the lapel, lining, pick-stitch and buttons.
export default function ClothLibrary() {
  const [house, setHouse] = useState<House | null>(null);
  const [active, setActive] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const shelfRef = useRef<HTMLDivElement>(null);

  const fabrics = useMemo(
    () => (house ? copy.cloth.fabrics.filter((f) => f.house === house.id) : copy.cloth.fabrics),
    [house]
  );
  const openFabric = openId ? copy.cloth.fabrics.find((f) => f.id === openId) : undefined;

  useEffect(() => {
    setActive(0);
    if (shelfRef.current) shelfRef.current.scrollLeft = 0;
  }, [house]);

  // The "current" cloth is the left-most one on screen — that is what the reader
  // is actually looking at, and what the arrows step from. Tracking the *last*
  // visible card instead made Previous a no-op at the far end of the shelf.
  const firstVisible = () => {
    const shelf = shelfRef.current;
    if (!shelf) return 0;
    const cards = Array.from(shelf.querySelectorAll<HTMLElement>("[data-card]"));
    if (!cards.length) return 0;
    const edge = shelf.getBoundingClientRect().left + 8;
    const idx = cards.findIndex((c) => c.getBoundingClientRect().right > edge);
    return idx === -1 ? cards.length - 1 : idx;
  };

  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    let raf = 0;
    const sync = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const i = firstVisible();
        setActive((prev) => (prev === i ? prev : i));
      });
    };
    shelf.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => {
      shelf.removeEventListener("scroll", sync);
      cancelAnimationFrame(raf);
    };
  }, [fabrics]);

  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      shelf.scrollLeft += e.deltaX;
    };
    shelf.addEventListener("wheel", onWheel, { passive: false });
    return () => shelf.removeEventListener("wheel", onWheel);
  }, []);

  const cardScrollLeft = (card: HTMLElement) => {
    const shelf = shelfRef.current;
    if (!shelf) return 0;
    return card.getBoundingClientRect().left - shelf.getBoundingClientRect().left + shelf.scrollLeft;
  };

  const snapNearest = (immediate = false) => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    const cards = Array.from(shelf.querySelectorAll<HTMLElement>("[data-card]"));
    if (!cards.length) return;
    const target = cardScrollLeft(cards[firstVisible()]);
    if (immediate) {
      shelf.scrollLeft = target;
      return;
    }
    gsap.to(shelf, { scrollLeft: target, duration: 0.85, ease: "cloth", overwrite: true });
  };

  const scrollTo = (i: number) => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    const next = Math.max(0, Math.min(fabrics.length - 1, i));
    const cards = shelf.querySelectorAll<HTMLElement>("[data-card]");
    const card = cards[next];
    if (card) gsap.to(shelf, { scrollLeft: cardScrollLeft(card), duration: 0.85, ease: "cloth", overwrite: true });
  };

  const drag = useRef({
    down: false,
    moved: false,
    swiped: false,
    pointerId: 0,
    startX: 0,
    startLeft: 0,
    lastX: 0,
    lastT: 0,
    vel: 0,
    raf: 0,
  });

  // A flick ends with a click event on whatever was under the pointer. Swallow
  // that one click so dragging the shelf never opens a cloth by accident.
  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    const swallow = (e: MouseEvent) => {
      if (!drag.current.swiped) return;
      e.preventDefault();
      e.stopPropagation();
    };
    shelf.addEventListener("click", swallow, true);
    return () => shelf.removeEventListener("click", swallow, true);
  }, []);

  // Drag to flick. No pointer capture: capturing would retarget the trailing
  // click to the shelf and the cloth would never open. We listen on the window
  // for the life of the gesture instead.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    const shelf = shelfRef.current;
    if (!shelf) return;
    cancelAnimationFrame(drag.current.raf);
    gsap.killTweensOf(shelf);
    const d = drag.current;
    d.down = true;
    d.moved = false;
    d.swiped = false;
    d.pointerId = e.pointerId;
    d.startX = e.clientX;
    d.startLeft = shelf.scrollLeft;
    d.lastX = e.clientX;
    d.lastT = performance.now();
    d.vel = 0;

    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== d.pointerId) return;
      const now = performance.now();
      const dt = now - d.lastT;
      const dx = ev.clientX - d.lastX;
      if (dt > 0) {
        const instant = (-dx / dt) * 16.67;
        d.vel = d.vel * 0.72 + instant * 0.28;
      }
      d.lastX = ev.clientX;
      d.lastT = now;

      const total = ev.clientX - d.startX;
      if (Math.abs(total) > 4) d.moved = true;
      if (d.moved) shelf.scrollLeft = d.startLeft - total;
    };

    const end = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      d.down = false;
      if (!d.moved) return;
      d.swiped = true;

      if (Math.abs(d.vel) > 1.2) {
        let v = d.vel;
        const tick = () => {
          shelf.scrollLeft += v;
          v *= 0.94;
          if (Math.abs(v) < 0.4) {
            snapNearest();
            return;
          }
          d.raf = requestAnimationFrame(tick);
        };
        d.raf = requestAnimationFrame(tick);
      } else {
        snapNearest();
      }
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  };

  return (
    <section id="cloth" className="relative bg-[var(--color-ink)] py-[clamp(96px,15vh,180px)] overflow-hidden">
      <div className="px-[clamp(20px,5vw,80px)]">
        <Reveal className="mb-16 md:mb-24">
          <p className="eyebrow mb-7"><em>the</em> COLLECTION</p>
          <h2 className="display text-[clamp(40px,6.4vw,96px)] text-[var(--color-bone)] leading-[0.98]">
            <span className="block">FOUR houses,</span>
            <span className="block"><em>one</em> WARDROBE.</span>
          </h2>
          <p className="body-copy mt-7">{copy.cloth.lead}</p>
        </Reveal>

        {/* the houses */}
        <div className="flex flex-wrap gap-2.5 mb-4">
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
              className="label !tracking-[0.14em] px-5 py-2.5 rounded-full border transition-colors flex flex-col items-start gap-1 text-left"
              style={house?.id === h.id ? chipOn : chipOff}
            >
              <span>{h.name}</span>
              <span className="mono !text-[9px] tracking-[0.12em] opacity-75 normal-case">{h.short}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 mb-8 pb-6 border-b border-[var(--color-ash)]/15">
          <p className="text-[12px] text-[var(--color-ash)] leading-relaxed max-w-[58ch]">
            {house
              ? house.blurb
              : "Drag the shelf, or open any cloth to choose your lapel, lining, pick-stitch and buttons."}
          </p>
          <div className="flex items-center gap-6 shrink-0">
            {house && (
              <button
                type="button"
                onClick={() =>
                  openBooking({
                    label: `${house.name} (${house.range})`,
                    note: `Looking at ${house.name} — ${house.range}.`,
                  })
                }
                className="label !tracking-[0.18em] px-5 py-3 rounded-full bg-[var(--color-bone)] text-white transition-opacity hover:opacity-85"
              >
                {copy.cloth.browseCta}
              </button>
            )}
            <span className="label tabular-nums text-[var(--color-brass)]">
              {`0${fabrics.length}`} <span className="text-[var(--color-ash)]/50">CLOTHS</span>
            </span>
          </div>
        </div>
      </div>

      {/* the shelf */}
      <div
        ref={shelfRef}
        onPointerDown={onPointerDown}
        onDragStart={(e) => e.preventDefault()}
        className="flex gap-[clamp(20px,3vw,44px)] overflow-x-auto px-[clamp(20px,5vw,80px)] pb-6 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: "none" }}
      >
        {fabrics.map((s, i) => {
          const h = copy.cloth.houses.find((x) => x.id === s.house)!;
          return (
            <article key={s.id} data-card className="shrink-0 w-[min(82vw,420px)] group">
              <figure
                className="relative aspect-[4/5] overflow-hidden mask-edges"
                data-measure={s.blend}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--rx", `${((e.clientX - r.left) / r.width) * 100}%`);
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(s.id)}
                  className="absolute inset-0 w-full h-full"
                  aria-label={`Open ${s.name}`}
                >
                  <img
                    src={`/media/${s.media}`}
                    alt={`${s.name} cloth`}
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-cloth)] group-hover:scale-[1.05]"
                  />
                  <span className="weave" aria-hidden />
                  <span className="rake" aria-hidden />
                </button>

                <span className="absolute bottom-4 right-4">
                  <SwatchChip hex={s.hex} code={h.name.replace("House of ", "")} tone="light" />
                </span>
                <span className="absolute top-4 left-4 label !tracking-[0.14em] text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Open
                </span>
              </figure>

              <div className="pt-6">
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <button
                    type="button"
                    onClick={() => setOpenId(s.id)}
                    className="text-left font-[family-name:var(--font-display)] text-[clamp(20px,2vw,26px)] text-[var(--color-bone)] hover:text-[var(--color-brass)] transition-colors"
                  >
                    {s.name}
                  </button>
                  <span className="label text-[var(--color-ash)] tabular-nums">0{i + 1}</span>
                </div>
                <p className="mono text-[10px] tracking-[0.16em] uppercase text-[var(--color-ash)] mb-3">
                  {s.blend}
                </p>
                <p className="body-copy !max-w-[36ch] !text-[13px] mb-5">{s.line}</p>

                <dl className="grid grid-cols-2 gap-4 border-t border-[var(--color-ash)]/15 pt-5">
                  <Spec k="House" v={h.name} />
                  <Spec k="Range" v={h.range} />
                </dl>

                <div className="flex flex-wrap gap-2 mt-5">
                  {s.occasions.map((o) => (
                    <span key={o} className="label !tracking-[0.16em] !text-[var(--color-ash)] border border-[var(--color-line)] px-3 py-1.5 rounded-full">{o}</span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="px-[clamp(20px,5vw,80px)] flex items-center justify-end gap-4 mt-2">
        <button type="button" aria-label="Previous cloth" onClick={() => scrollTo(active - 1)} className="w-9 h-9 grid place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-bone)] hover:border-[var(--color-brass)] hover:text-[var(--color-brass)] transition-colors">←</button>
        <span className="label tabular-nums text-[var(--color-brass)]">
          {`0${active + 1}`} <span className="text-[var(--color-ash)]/50">/ 0{fabrics.length}</span>
        </span>
        <button type="button" aria-label="Next cloth" onClick={() => scrollTo(active + 1)} className="w-9 h-9 grid place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-bone)] hover:border-[var(--color-brass)] hover:text-[var(--color-brass)] transition-colors">→</button>
      </div>

      {openFabric && (
        <FabricModal fabric={openFabric} mode="browse" onClose={() => setOpenId(null)} />
      )}
    </section>
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

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="label !text-[var(--color-ash)]/60 !tracking-[0.2em] mb-1.5">{k}</dt>
      <dd className="text-[13px] text-[var(--color-bone)] leading-snug">{v}</dd>
    </div>
  );
}