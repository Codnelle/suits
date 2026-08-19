"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Lenis wired into GSAP's ticker (not running its own RAF).
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // reduced-motion → native scroll, no Lenis

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // refresh once fonts settle to fix pin math
    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
