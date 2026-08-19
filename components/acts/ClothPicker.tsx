"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { copy } from "@/lib/copy";
import ChapterRule from "@/components/ui/ChapterRule";

export default function ClothPicker() {
  const swatches = copy.cloth.swatches;
  const [sel, setSel] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current, ul = underlineRef.current;
    if (!row || !ul) return;
    const btn = row.querySelectorAll<HTMLElement>("[data-swatch]")[sel];
    if (!btn) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(ul, { x: btn.offsetLeft, width: btn.offsetWidth, duration: reduce ? 0 : 0.4, ease: "cloth" });
  }, [sel]);

  const choose = (i: number) => {
    if (i === sel) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setSel(i); return; }
    // crossfade the cloth + swap the copy
    gsap.to([imgRef.current, textRef.current], {
      opacity: 0,
      duration: 0.22,
      ease: "cloth",
      onComplete: () => {
        setSel(i);
        gsap.fromTo([imgRef.current, textRef.current], { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "cloth" });
      },
    });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); choose((sel + 1) % swatches.length); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); choose((sel - 1 + swatches.length) % swatches.length); }
  };

  const s = swatches[sel];

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center px-[clamp(20px,5vw,80px)] py-28 bg-[var(--color-ink)]">
      <ChapterRule n={copy.cloth.label} label={copy.cloth.tag} right="THE CLOTH LIBRARY" />

      <div className="grid md:grid-cols-2 items-center gap-[clamp(32px,6vw,90px)]">
        {/* the selected cloth, in the hand */}
        <div className="relative aspect-[4/5] max-h-[76svh] w-full mx-auto overflow-hidden mask-edges">
          <img ref={imgRef} src={`/media/${s.media}.webp`} alt={`${s.name} cloth`} className="absolute inset-0 w-full h-full object-cover" />
        </div>

        <div>
          <h2 className="display text-[clamp(34px,4.6vw,64px)] mb-3 text-[var(--color-bone)]">{copy.cloth.title}</h2>
          <p className="body-copy mb-9">Five cloths, held to the light. Choose one — the rest wait for next season.</p>

          {/* swatch selector */}
          <div
            ref={rowRef}
            role="radiogroup"
            aria-label="Choose a cloth"
            tabIndex={0}
            onKeyDown={onKey}
            className="relative flex gap-4 pb-3 mb-8"
          >
            {swatches.map((sw, i) => (
              <button
                key={sw.id}
                data-swatch
                role="radio"
                aria-checked={sel === i}
                aria-label={sw.name}
                onClick={() => choose(i)}
                onMouseEnter={() => choose(i)}
                className="w-14 h-14 md:w-16 md:h-16 shrink-0 transition-transform duration-300 ease-[var(--ease-cloth)] hover:-translate-y-1.5"
                style={{ backgroundColor: sw.hex, border: `1px solid ${sel === i ? "var(--color-brass)" : "rgba(23,24,28,0.18)"}` }}
              />
            ))}
            <span ref={underlineRef} aria-hidden className="absolute bottom-0 left-0 h-px bg-[var(--color-brass)]" style={{ width: 56 }} />
          </div>

          <div ref={textRef}>
            <div className="flex items-baseline gap-4 mb-2">
              <span className="label">{`0${sel + 1} / 05`}</span>
              <p className="font-[family-name:var(--font-playfair)] text-[clamp(20px,2vw,26px)] text-[var(--color-bone)]">{s.name}</p>
            </div>
            <p className="body-copy">{s.line}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
