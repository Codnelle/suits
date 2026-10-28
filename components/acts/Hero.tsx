"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { copy } from "@/lib/copy";
import { openBooking } from "@/lib/booking";
import Magnetic from "@/components/ui/Magnetic";

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const h = copy.hero;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo(q(".hero-top > *"), { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.3);
    tl.fromTo(q(".hero-eyebrow"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 0.5);
    // the headline rises line by line from a clipped baseline
    tl.fromTo(
      q(".hline > span"),
      { yPercent: 115 },
      { yPercent: 0, duration: 1.15, ease: "cloth", stagger: 0.12 },
      0.6
    );
    tl.fromTo(q(".hero-bottom > *"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 1.1);
    gsap.fromTo(q(".hero-video"), { scale: 1.08 }, { scale: 1, duration: 12, ease: "none" });
  }, []);

  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[620px] bg-[var(--color-ink)] overflow-hidden">
      <div className="relative w-full h-full overflow-hidden">
        {/* full-screen video */}
        <video
          className="hero-video absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline
          poster="/media/hero-poster.webp"
        >
          <source src="/media/hero.webm" type="video/webm" />
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>

        {/* subtle gradient so the quiet UI reads without a heavy overlay */}
        <span aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(15,18,22,0.28) 0%, transparent 26%, transparent 58%, rgba(15,18,22,0.34) 100%)" }} />

        {/* content — minimal, gallery-quiet */}
        <div className="relative z-10 h-full flex flex-col justify-between p-[clamp(24px,3vw,56px)] text-white [text-shadow:0_1px_20px_rgba(15,18,22,0.4)]">
          {/* top row — logo left, one quiet line right */}
          <div className="hero-top flex items-start justify-between">
            <a href="#top" aria-label={h.brand}>
              <img src="/media/shahee-logo.png" alt={h.brand} className="h-[clamp(18px,1.6vw,26px)] w-auto" />
            </a>
            <span className="label !text-white/75 hidden sm:block">By appointment only</span>
          </div>

          {/* headline — high-contrast serif, caps nouns + italic connectors */}
          <div>
            <span className="hero-eyebrow label !text-white/65 block mb-5">{h.tag}</span>
            <h1 className="font-[family-name:var(--font-display)] font-medium leading-[1.02] tracking-[-0.01em] text-[clamp(30px,4.6vw,66px)]">
              <span className="hline block overflow-hidden py-[0.06em]"><span className="block whitespace-nowrap">Bespoke SUITS,</span></span>
              <span className="hline block overflow-hidden py-[0.06em]"><span className="block whitespace-nowrap"><em className="italic">tailored in</em> your HOME.</span></span>
            </h1>
          </div>

          {/* bottom row — a quiet sub, and the one call to action */}
          <div className="hero-bottom flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <p className="max-w-[30ch] text-[clamp(14px,1vw,16px)] text-white/80 leading-relaxed">{h.sub}</p>
            <Magnetic className="shrink-0">
              <button
                onClick={() => openBooking()}
                className="group inline-flex items-center gap-4 pl-7 pr-2 py-2 rounded-full bg-white/95 text-[var(--color-bone)] transition-colors hover:bg-white"
              >
                <span className="text-[11px] tracking-[0.2em] uppercase font-medium">{h.cta}</span>
                <span className="relative grid place-items-center w-10 h-10 rounded-full bg-[var(--color-bone)] text-white overflow-hidden">
                  <span className="transition-transform duration-500 group-hover:translate-x-6">→</span>
                  <span className="absolute transition-transform duration-500 -translate-x-6 group-hover:translate-x-0">→</span>
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
