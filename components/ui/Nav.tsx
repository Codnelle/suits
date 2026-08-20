"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { copy } from "@/lib/copy";

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = 0;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        const down = y > last && y > 120;
        gsap.to(el, { yPercent: down ? -130 : 0, duration: 0.32, ease: "cloth", overwrite: true });
        last = y;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <>
      <header
        ref={ref}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[var(--pad,clamp(20px,4.5vw,64px))] py-5"
        style={{ mixBlendMode: "difference", ["--pad" as string]: "clamp(20px,4.5vw,64px)" }}
      >
        <a href="#top" className="font-[family-name:var(--font-display)] text-[15px] tracking-[0.28em] text-white">
          {copy.nav.wordmark}
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {copy.nav.links.map((l) => (
            <a key={l} href="#" className="label !text-white/80 hover:!text-white transition-colors">
              {l}
            </a>
          ))}
          <a
            href="#invitation"
            className="label !text-white border border-white/60 px-4 py-2.5 hover:bg-white hover:!text-black transition-colors"
          >
            {copy.nav.cta}
          </a>
        </nav>

        <button
          className="md:hidden relative w-8 h-4"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`absolute left-0 right-0 h-px bg-white transition-all ${open ? "top-1.5 rotate-45" : "top-0.5"}`} />
          <span className={`absolute left-0 right-0 h-px bg-white transition-all ${open ? "bottom-1.5 -rotate-45" : "bottom-0.5"}`} />
        </button>
      </header>

      {/* mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--color-ink)] flex flex-col justify-center gap-2 px-8 transition-[clip-path,opacity] duration-700 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
        aria-hidden={!open}
      >
        {[...copy.nav.links, copy.nav.cta].map((l) => (
          <a
            key={l}
            href="#invitation"
            onClick={() => setOpen(false)}
            className="display text-[clamp(34px,10vw,56px)] text-[var(--color-bone)]"
          >
            {l}
          </a>
        ))}
      </div>
    </>
  );
}
