"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { copy } from "@/lib/copy";
import ChapterRule from "@/components/ui/ChapterRule";
import Reveal from "@/components/ui/Reveal";
import SwatchChip from "@/components/ui/SwatchChip";

// a mono swatch code in the house style — W-1408 · 13OZ
const swatchCode = (i: number, weight: string) =>
  `W-14${String(i + 1).padStart(2, "0")} · ${(weight.match(/\d+\s*oz/i)?.[0] ?? "").toUpperCase().replace(/\s+/g, "")}`;

// V — The Cloth Library.
// A horizontal "shelf" of cloth chapters. Draggable with inertia — a flick
// glides, then settles on the nearest cloth with the house ease.
export default function ClothLibrary() {
  const swatches = copy.cloth.swatches;
  const shelfRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const drag = useRef({
    down: false,
    moved: false,
    pointerId: 0,
    startX: 0,
    startLeft: 0,
    lastX: 0,
    lastT: 0,
    vel: 0,
    raf: 0,
  });

  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    const cards = Array.from(shelf.querySelectorAll<HTMLElement>("[data-card]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = cards.indexOf(e.target as HTMLElement);
            if (i >= 0) setActive(i);
          }
        });
      },
      { root: shelf, threshold: 0.55 }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
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
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(cardScrollLeft(c) - shelf.scrollLeft);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    const target = cardScrollLeft(cards[best]);
    if (immediate) {
      shelf.scrollLeft = target;
      return;
    }
    gsap.to(shelf, { scrollLeft: target, duration: 0.85, ease: "cloth", overwrite: true });
  };

  const scrollTo = (i: number) => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    const next = Math.max(0, Math.min(swatches.length - 1, i));
    const cards = shelf.querySelectorAll<HTMLElement>("[data-card]");
    const card = cards[next];
    if (card) gsap.to(shelf, { scrollLeft: cardScrollLeft(card), duration: 0.85, ease: "cloth", overwrite: true });
  };

  // ---- inertia drag ----
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    const shelf = shelfRef.current;
    if (!shelf) return;
    cancelAnimationFrame(drag.current.raf);
    gsap.killTweensOf(shelf);
    const d = drag.current;
    d.down = true;
    d.moved = false;
    d.pointerId = e.pointerId;
    d.startX = e.clientX;
    d.startLeft = shelf.scrollLeft;
    d.lastX = e.clientX;
    d.lastT = performance.now();
    d.vel = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down || e.pointerId !== d.pointerId) return;
    const shelf = shelfRef.current;
    if (!shelf) return;
    const now = performance.now();
    const dt = now - d.lastT;
    const dx = e.clientX - d.lastX;
    if (dt > 0) {
      // velocity in px per 60fps frame, smoothed for a calm glide
      const instant = (-dx / dt) * 16.67;
      d.vel = d.vel * 0.72 + instant * 0.28;
    }
    d.lastX = e.clientX;
    d.lastT = now;

    const total = e.clientX - d.startX;
    if (Math.abs(total) > 4) d.moved = true;
    if (d.moved) shelf.scrollLeft = d.startLeft - total;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (e.pointerId !== d.pointerId) return;
    d.down = false;

    if (!d.moved) return;

    const shelf = shelfRef.current;
    if (!shelf) return;

    // flick fast enough → coast with friction, then settle
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

  return (
    <section id="cloth" className="relative bg-[var(--color-ink)] py-28 overflow-hidden">
      <div className="px-[clamp(20px,5vw,80px)]">
        <ChapterRule n={copy.cloth.label} label={copy.cloth.tag} right="THE COLLECTION" />
        <Reveal className="flex items-end justify-between gap-8 flex-wrap mb-14">
          <div>
            <h2 className="display text-[clamp(34px,4.6vw,64px)] mb-4 text-[var(--color-bone)]">{copy.cloth.title}</h2>
            <p className="body-copy">{copy.cloth.lead}</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="label tabular-nums text-[var(--color-brass)]">
              {`0${active + 1}`} <span className="text-[var(--color-ash)]/50">/ 0{swatches.length}</span>
            </span>
            <div className="flex gap-2">
              <button type="button" aria-label="Previous cloth" onClick={() => scrollTo(active - 1)} className="w-9 h-9 grid place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-bone)] hover:border-[var(--color-brass)] hover:text-[var(--color-brass)] transition-colors">←</button>
              <button type="button" aria-label="Next cloth" onClick={() => scrollTo(active + 1)} className="w-9 h-9 grid place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-bone)] hover:border-[var(--color-brass)] hover:text-[var(--color-brass)] transition-colors">→</button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* the shelf */}
      <div
        ref={shelfRef}
        data-lenis-prevent
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDragStart={(e) => e.preventDefault()}
        className="flex gap-[clamp(20px,3vw,44px)] overflow-x-auto px-[clamp(20px,5vw,80px)] pb-6 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: "none" }}
      >
        {swatches.map((s, i) => (
          <article
            key={s.id}
            data-card
            className="shrink-0 w-[min(82vw,420px)] group"
          >
            <figure
              className="relative aspect-[4/5] overflow-hidden mask-edges"
              data-measure={swatchCode(i, s.weight)}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--rx", `${((e.clientX - r.left) / r.width) * 100}%`);
              }}
            >
              <img
                src={`/media/${s.media}.webp`}
                alt={`${s.name} cloth`}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-cloth)] group-hover:scale-[1.05]"
              />
              {/* faint herringbone weave — cloth held to the light */}
              <span className="weave" aria-hidden />
              {/* raking highlight that shifts across the weave on hover */}
              <span className="rake" aria-hidden />
              {/* swatch chip with mono code, lower right */}
              <span className="absolute bottom-4 right-4">
                <SwatchChip hex={s.hex} code={swatchCode(i, s.weight)} tone="light" />
              </span>
            </figure>

            <div className="pt-6">
              <div className="flex items-baseline justify-between gap-4 mb-3">
                <h3 className="font-[family-name:var(--font-display)] text-[clamp(20px,2vw,26px)] text-[var(--color-bone)]">{s.name}</h3>
                <span className="label text-[var(--color-ash)] tabular-nums">{`0${i + 1}`}</span>
              </div>
              <p className="body-copy !max-w-[36ch] mb-5">{s.line}</p>

              <dl className="grid grid-cols-3 gap-4 border-t border-[var(--color-ash)]/15 pt-5">
                <Spec k="Origin" v={s.origin} />
                <Spec k="Weight" v={s.weight} />
                <Spec k="Season" v={s.season} />
              </dl>

              <div className="flex flex-wrap gap-2 mt-5">
                {s.occasions.map((o) => (
                  <span key={o} className="label !tracking-[0.16em] !text-[var(--color-ash)] border border-[var(--color-line)] px-3 py-1.5 rounded-full">{o}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="label !text-[var(--color-ash)]/60 !tracking-[0.2em] mb-1.5">{k}</dt>
      <dd className="text-[13px] text-[var(--color-bone)] leading-snug">{v}</dd>
    </div>
  );
}
