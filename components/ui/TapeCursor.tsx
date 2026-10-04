"use client";

import { useEffect, useRef } from "react";

// The tape-measure cursor. A thin crosshair follows the pointer; over anything
// carrying a [data-measure] attribute it grows a readout of whatever it is
// touching — the fabric's blend. Desktop, fine-pointer, motion-on only.
//
// The crosshair sits in a difference-blended layer so it inverts against any
// ground. The readout deliberately lives OUTSIDE that layer: blending would
// invert its own type against the backdrop and destroy the contrast.
export default function TapeCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const el = ref.current;
    const read = readRef.current;
    if (!el || !read) return;

    document.documentElement.classList.add("tape-on");

    let raf = 0;
    let tx = -100, ty = -100, x = -100, y = -100;
    const loop = () => {
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      read.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-measure]");
      if (target) {
        el.classList.add("measuring");
        read.classList.add("measuring");
        read.textContent = target.dataset.measure || "";
      } else {
        el.classList.remove("measuring");
        read.classList.remove("measuring");
      }
    };
    const onLeave = () => {
      el.classList.remove("measuring");
      read.classList.remove("measuring");
      tx = -100;
      ty = -100;
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("tape-on");
    };
  }, []);

  return (
    <>
      <div ref={ref} className="tape" aria-hidden>
        <span className="tape-h" />
        <span className="tape-v" />
      </div>
      <span ref={readRef} className="tape-read" aria-hidden />
    </>
  );
}