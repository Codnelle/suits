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
    tl.fromTo(q(".hero-panel"), { opacity: 0, scale: 1.02 }, { opacity: 1, scale: 1, duration: 1.1, ease: "cloth" }, 0);
    tl.fromTo(q(".hero-top > *"), { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.3);
    tl.fromTo(q(".word > span"), { yPercent: 120 }, { yPercent: 0, duration: 1.1, ease: "cloth", stagger: 0.09 }, 0.4);
    tl.fromTo(q(".hero-bottom > *"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.9);
    gsap.fromTo(q(".hero-video"), { scale: 1.08 }, { scale: 1, duration: 10, ease: "none" });
  }, []);

  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[620px] p-[clamp(10px,1.4vw,20px)] bg-[var(--color-ink)] overflow-hidden">
      {/* corner registration ticks */}
      <span className="tick top-3 left-3 text-[var(--color-ash)]" />
      <span className="tick bottom-3 right-3 text-[var(--color-ash)]" />

      <div className="relative w-full h-full rounded-[6px] overflow-hidden">
        {/* video */}
        <video
          className="hero-video absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline
          poster="/media/hero-poster.webp"
        >
          <source src="/media/hero.webm" type="video/webm" />
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
        {/* legibility scrims */}
        <span aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(15,18,22,0.34) 0%, rgba(15,18,22,0.08) 32%, rgba(15,18,22,0.06) 60%, rgba(15,18,22,0.42) 100%)" }} />

        {/* frosted glass panel */}
        <div className="hero-panel absolute inset-[clamp(10px,1.4vw,22px)] rounded-[4px] border border-white/25" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(2px)" }} />

        {/* content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-[clamp(22px,3.4vw,54px)] text-white">
          {/* top row */}
          <div className="hero-top flex items-start justify-between">
            <a href="#top" className="font-[family-name:var(--font-playfair)] text-[clamp(18px,1.5vw,22px)] tracking-[0.12em]">{h.brand}</a>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {h.pills.map((p) => (
                <span key={p} className="text-[12px] tracking-wide px-4 py-2 rounded-full border border-white/25 bg-white/8 backdrop-blur-sm">{p}</span>
              ))}
            </div>
          </div>

          {/* center block */}
          <div className="max-w-[1100px]">
            <span className="label !text-white/70 block mb-6">{h.tag}</span>
            <h1 className="flex flex-wrap gap-x-[0.35em] font-[family-name:var(--font-inter)] font-medium uppercase leading-[0.92] tracking-[-0.02em] text-[clamp(44px,9vw,150px)]">
              {h.words.map((w) => (
                <span key={w} className="word block overflow-hidden"><span className="block">{w}</span></span>
              ))}
            </h1>
          </div>

          {/* bottom row */}
          <div className="hero-bottom flex items-end justify-between gap-8">
            <p className="max-w-[34ch] text-[clamp(15px,1.2vw,18px)] text-white/85 leading-relaxed">{h.sub}</p>
            <Magnetic className="shrink-0">
              <button
                onClick={openBooking}
                className="group inline-flex items-center gap-4 pl-7 pr-2 py-2 rounded-full bg-white text-[var(--color-bone)] transition-colors hover:bg-[var(--color-brass)] hover:text-white"
              >
                <span className="text-[12px] tracking-[0.18em] uppercase font-medium">{h.cta}</span>
                <span className="relative grid place-items-center w-11 h-11 rounded-full bg-[var(--color-bone)] text-white overflow-hidden">
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
