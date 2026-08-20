"use client";

import { useEffect, useRef } from "react";

type Kind = "circle" | "arrow" | "tick" | "underline" | "bracket";

// Hand-drawn tailor's-chalk annotations over photography — the house thinking
// out loud on the cloth. Rough, white, imperfect. Each draws itself once, when
// scrolled into view.
export default function ChalkMark({
  kind = "circle",
  className = "",
  label,
  width = 120,
  height = 120,
}: {
  kind?: Kind;
  className?: string;
  label?: string;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("drawn");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`chalk ${className}`} style={{ width, height }} aria-hidden>
      <svg viewBox="0 0 120 120" width={width} height={height} fill="none">
        <g
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ ["--len" as string]: "560" }}
        >
          {kind === "circle" && (
            <path
              className="chalk-draw"
              d="M60 12 C92 10 112 34 110 62 C108 92 82 110 56 108 C28 106 10 82 12 54 C14 30 34 14 62 13"
            />
          )}
          {kind === "arrow" && (
            <>
              <path className="chalk-draw" d="M8 96 C40 78 74 52 104 20" style={{ ["--len" as string]: "180" }} />
              <path className="chalk-draw" d="M104 20 L86 26 M104 20 L98 40" style={{ ["--len" as string]: "60" }} />
            </>
          )}
          {kind === "tick" && (
            <path className="chalk-draw" d="M18 62 L48 92 L106 24" style={{ ["--len" as string]: "180" }} />
          )}
          {kind === "underline" && (
            <path className="chalk-draw" d="M6 66 C40 58 82 60 116 54" style={{ ["--len" as string]: "130" }} />
          )}
          {kind === "bracket" && (
            <path className="chalk-draw" d="M40 10 C20 12 18 30 20 60 C22 90 20 106 40 110" style={{ ["--len" as string]: "180" }} />
          )}
        </g>
      </svg>
      {label && (
        <span className="mono" style={{ position: "absolute", left: "50%", bottom: -18, transform: "translateX(-50%)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "currentColor", whiteSpace: "nowrap" }}>
          {label}
        </span>
      )}
    </div>
  );
}
