"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * The spine of the Detail section: a thread that sews itself straight down the
 * page as you scroll. A running stitch is revealed top→bottom behind a needle
 * that tracks your scroll position, finishing in a knot at the very bottom.
 */
export default function StitchLine() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const section = el.parentElement as HTMLElement | null;
    if (!section) return;
    const reveal = el.querySelector<HTMLElement>(".spine-reveal");
    const needle = el.querySelector<HTMLElement>(".spine-needle");
    const knot = el.querySelector<HTMLElement>(".spine-knot");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      if (reveal) reveal.style.clipPath = "inset(0 0 0 0)";
      if (needle) needle.style.opacity = "0";
      return;
    }
    if (reveal) reveal.style.clipPath = "inset(0 0 100% 0)";
    if (needle) needle.style.opacity = "0";
    if (knot) knot.style.transform = "translate(-50%,-50%) scale(0)";

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 72%",
      end: "bottom 65%",
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        if (reveal) reveal.style.clipPath = `inset(0 0 ${(1 - p) * 100}% 0)`;
        if (needle) {
          needle.style.top = `${p * 100}%`;
          needle.style.opacity = p > 0.004 && p < 0.996 ? "1" : "0";
        }
        if (knot) knot.style.transform = `translate(-50%,-50%) scale(${p > 0.985 ? 1 : 0})`;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={wrap} className="pointer-events-none absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 z-0" aria-hidden>
      {/* faint full guide */}
      <span className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-[var(--color-line)]" />
      {/* running stitch, revealed as it is sewn */}
      <div className="spine-reveal absolute inset-0">
        <span
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1.5px]"
          style={{ background: "repeating-linear-gradient(to bottom, var(--color-brass) 0 7px, transparent 7px 14px)" }}
        />
      </div>
      {/* the needle */}
      <span className="spine-needle absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <span className="block w-px h-4 bg-gradient-to-b from-transparent to-[var(--color-brass)]" />
        <span className="block w-[7px] h-[7px] rounded-full bg-[var(--color-brass)]" style={{ boxShadow: "0 0 12px 2px rgba(184,137,75,.55)" }} />
      </span>
      {/* knot at the end */}
      <span className="spine-knot absolute left-1/2 bottom-0 w-2.5 h-2.5 rounded-full border border-[var(--color-brass)] bg-[var(--color-ink)]" style={{ transform: "translate(-50%,-50%) scale(0)" }} />
    </div>
  );
}
