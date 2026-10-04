"use client";

import { ScrollTrigger } from "@/lib/gsap";

type Lenisish = {
  resize: () => void;
  scrollTo: (y: number, opts?: { immediate?: boolean; force?: boolean }) => void;
};

// Recalculating triggers is the one moment the page can visibly jump: Lenis
// keeps its own animated/target scroll, so after a refresh it can be a frame or
// two out of step with the real position. Re-pin it to where we actually are.
export function refreshScrollTriggers() {
  if (typeof window === "undefined") return;

  const lenis = (window as unknown as { lenis?: Lenisish }).lenis;
  const y = window.scrollY;

  ScrollTrigger.refresh();

  if (lenis) {
    lenis.resize();
    lenis.scrollTo(y, { immediate: true, force: true });
  } else {
    window.scrollTo(0, y);
  }
}