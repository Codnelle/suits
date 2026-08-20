"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { copy } from "@/lib/copy";
import ChapterRule from "@/components/ui/ChapterRule";
import Reveal from "@/components/ui/Reveal";

// VII — The Process. Eighty hours in six movements, tracked down a line that
// fills as the reader descends.
export default function Process() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fill = lineRef.current?.querySelector<HTMLElement>(".process-fill");
    const wrap = lineRef.current;
    if (!fill || !wrap) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { fill.style.transform = "scaleY(1)"; return; }
    fill.style.transform = "scaleY(0)";
    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top 70%",
      end: "bottom 60%",
      scrub: 0.6,
      onUpdate: (self) => { fill.style.transform = `scaleY(${self.progress})`; },
    });
    return () => st.kill();
  }, []);

  const { label, tag, title, lead, steps } = copy.process;

  return (
    <section className="relative bg-[var(--color-ink)] px-[clamp(20px,5vw,80px)] py-28 overflow-hidden">
      <ChapterRule n={label} label={tag} right="EIGHTY HOURS" />
      <Reveal className="max-w-2xl mb-20">
        <h2 className="display text-[clamp(36px,4.8vw,68px)] mb-6 text-[var(--color-bone)]">{title}</h2>
        <p className="body-copy">{lead}</p>
      </Reveal>

      <div ref={lineRef} className="relative max-w-6xl mx-auto">
        {/* progress spine */}
        <span aria-hidden className="absolute top-0 bottom-0 left-[13px] md:left-1/2 md:-translate-x-1/2 w-px bg-[var(--color-line)]" />
        <span aria-hidden className="process-fill absolute top-0 bottom-0 left-[13px] md:left-1/2 md:-translate-x-1/2 w-px origin-top bg-[var(--color-brass)]" />

        <div className="flex flex-col gap-[14vh] md:gap-[20vh]">
          {steps.map((s, i) => {
            const imageFirst = i % 2 === 0;
            const Img = (
              <figure className="group relative w-full aspect-[4/3] mask-edges overflow-hidden">
                <img
                  src={`/media/${s.media}.jpg`}
                  alt={s.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-cloth)] group-hover:scale-[1.05]"
                />
              </figure>
            );
            const Txt = (
              <div className={imageFirst ? "md:pl-[8%]" : "md:pr-[8%] md:text-right md:ml-auto"}>
                <span className="font-[family-name:var(--font-display)] text-[clamp(40px,5vw,64px)] leading-none text-[var(--color-brass)]/70">{s.n}</span>
                <h3 className="display text-[clamp(26px,3.2vw,44px)] mt-4 mb-4 text-[var(--color-bone)]">{s.title}</h3>
                <p className={`body-copy ${imageFirst ? "" : "md:ml-auto"}`}>{s.body}</p>
              </div>
            );
            return (
              <Reveal key={s.n}>
                <div className="relative grid md:grid-cols-2 items-center gap-y-8 gap-x-[12vw] pl-12 md:pl-0">
                  <span aria-hidden className="absolute left-[13px] md:left-1/2 top-0 -translate-x-1/2 md:-translate-y-0 w-[9px] h-[9px] rounded-full border border-[var(--color-brass)] bg-[var(--color-ink)]" />
                  {imageFirst ? (<>{Img}{Txt}</>) : (<><div className="md:order-2">{Img}</div><div className="md:order-1">{Txt}</div></>)}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
