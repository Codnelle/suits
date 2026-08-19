"use client";

import { useEffect, useRef, useState } from "react";
import { openBooking } from "@/lib/booking";
import { copy } from "@/lib/copy";

// Minimal light top bar that fades in once the hero has scrolled away.
export default function BookBar() {
  const [show, setShow] = useState(false);
  const last = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShow(y > window.innerHeight * 0.9);
      setHidden(y > last.current && y > window.innerHeight);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[clamp(20px,4vw,54px)] py-4 border-b border-[var(--color-line)] bg-[var(--color-ink)]/80 backdrop-blur-md transition-[transform,opacity] duration-400"
      style={{
        transform: show && !hidden ? "translateY(0)" : "translateY(-105%)",
        opacity: show ? 1 : 0,
        pointerEvents: show && !hidden ? "auto" : "none",
      }}
    >
      <a href="#top" className="font-[family-name:var(--font-playfair)] text-[15px] tracking-[0.14em] text-[var(--color-bone)]">{copy.hero.brand}</a>
      <button
        onClick={openBooking}
        className="text-[11px] uppercase tracking-[0.2em] px-5 py-2.5 rounded-full border border-[var(--color-bone)]/25 text-[var(--color-bone)] hover:bg-[var(--color-bone)] hover:text-white transition-colors"
      >
        {copy.hero.cta}
      </button>
    </div>
  );
}
