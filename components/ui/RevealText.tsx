"use client";

import { useRef, useEffect, ElementType } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Mask-reveal, line by line. Text nodes stay present for screen readers;
// only an inner wrapper is transformed.
export default function RevealText({
  lines,
  as: Tag = "div",
  className = "",
  lineClassName = "",
  stagger = 0.09,
  start = "top 82%",
  delay = 0,
}: {
  lines: React.ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  stagger?: number;
  start?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const inner = el.querySelectorAll<HTMLElement>(".reveal-line > span");
    if (reduce) {
      gsap.set(inner, { yPercent: 0 });
      return;
    }
    gsap.set(inner, { yPercent: 120 });
    const tween = gsap.to(inner, {
      yPercent: 0,
      duration: 1.1,
      ease: "cloth",
      stagger,
      delay,
      scrollTrigger: { trigger: el, start },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [stagger, start, delay]);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className={`reveal-line ${lineClassName}`}>
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  );
}
