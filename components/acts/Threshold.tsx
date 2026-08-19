"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { copy } from "@/lib/copy";

export default function Threshold() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(el);
    if (reduce) return;

    const tl = gsap.timeline();
    tl.fromTo(q(".frame-line"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "cloth", stagger: 0.08, transformOrigin: "left" }, 0);
    tl.fromTo(q(".frame-line-v"), { scaleY: 0 }, { scaleY: 1, duration: 1, ease: "cloth", stagger: 0.08, transformOrigin: "top" }, 0.1);
    tl.fromTo(q(".meta"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06 }, 0.4);
    tl.fromTo(q(".rule"), { width: 0 }, { width: "min(46vw,560px)", duration: 1.1, ease: "cloth" }, 0.6);
    tl.fromTo(q(".display-line > span"), { yPercent: 120 }, { yPercent: 0, duration: 1.15, ease: "cloth", stagger: 0.1 }, 0.7);
    tl.fromTo(q(".support, .index-item, .cue"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 }, 1.1);

    gsap.fromTo(q(".bg"), { scale: 1.06 }, { scale: 1.0, duration: 9, ease: "none" });

    const st = gsap.to(q(".inner"), {
      scale: 0.985,
      opacity: 0,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "45% top", scrub: true },
    });
    return () => {
      st.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const a = copy.act0;

  return (
    <section ref={root} id="top" className="relative h-[100svh] overflow-hidden">
      {/* atmosphere */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <span className="beam" />
        <span className="fog fog-1" />
        <span className="fog fog-2" />
      </div>
      {/* spotlit subject */}
      <img
        src="/media/threshold-bg.webp"
        alt=""
        aria-hidden
        className="bg absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: 0.34,
          filter: "brightness(0.82) contrast(1.15)",
          WebkitMaskImage: "radial-gradient(85% 78% at 50% 40%, #000 30%, transparent 82%)",
          maskImage: "radial-gradient(85% 78% at 50% 40%, #000 30%, transparent 82%)",
        }}
      />
      {/* legibility scrim + floor */}
      <span aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(115% 85% at 50% 40%, rgba(10,10,11,0.35) 0%, transparent 30%, transparent 55%, var(--color-ink) 100%)" }} />

      <div className="inner absolute inset-0">
        {/* inset frame */}
        <div className="pointer-events-none absolute inset-[clamp(16px,2.4vw,40px)]">
          <span className="frame-line absolute top-0 left-0 right-0 h-px bg-[var(--color-ash)]/25" />
          <span className="frame-line absolute bottom-0 left-0 right-0 h-px bg-[var(--color-ash)]/25" />
          <span className="frame-line-v absolute top-0 bottom-0 left-0 w-px bg-[var(--color-ash)]/25" />
          <span className="frame-line-v absolute top-0 bottom-0 right-0 w-px bg-[var(--color-ash)]/25" />
        </div>

        {/* content grid */}
        <div className="relative h-full grid grid-rows-[auto_1fr_auto] px-[clamp(28px,5vw,76px)] py-[clamp(28px,4vw,60px)]">
          {/* top meta bar */}
          <div className="flex items-center justify-between">
            <span className="meta label hidden sm:block">{a.estLeft}</span>
            <span className="meta font-[family-name:var(--font-playfair)] text-[15px] tracking-[0.4em] text-[var(--color-bone)]">{a.crest}</span>
            <span className="meta label hidden sm:block">{a.estRight}</span>
          </div>

          {/* center headline block */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="meta label mb-8">{a.eyebrow}</span>
            <h1 className="display text-[clamp(46px,9.5vw,150px)] text-[var(--color-bone)]">
              <span className="display-line block overflow-hidden"><span className="block">{a.displayA}</span></span>
              <span className="display-line block overflow-hidden"><span className="block"><em>{a.displayB}</em></span></span>
            </h1>
            <span className="rule h-px bg-[var(--color-brass)] my-9" style={{ width: 0 }} />
            <p className="support body-copy !max-w-[52ch] !text-center !text-[var(--color-ash)]">{a.support}</p>
          </div>

          {/* bottom meta bar */}
          <div className="grid grid-cols-3 items-end gap-4">
            <span className="meta label hidden md:block self-end">{a.manifesto}</span>
            <div className="cue col-span-3 md:col-span-1 flex flex-col items-center gap-3">
              <span className="label">{a.cue}</span>
              <span className="w-px h-8 bg-[var(--color-bone)]/60 cue-pulse" />
            </div>
            <span className="meta label hidden md:block self-end text-right">{a.cities}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
