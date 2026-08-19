"use client";

import { useEffect, useRef, ElementType } from "react";
import { gsap } from "@/lib/gsap";

// Eases content in as it scrolls up into view (scrubbed), so sections
// cross-dissolve instead of snapping in.
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  y = 34,
}: {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.set(el, { opacity: 0, y });
    const tw = gsap.to(el, {
      opacity: 1,
      y: 0,
      ease: "cloth",
      scrollTrigger: { trigger: el, start: "top 88%", end: "top 58%", scrub: true },
    });
    return () => {
      tw.scrollTrigger?.kill();
      tw.kill();
    };
  }, [y]);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
