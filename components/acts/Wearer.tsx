"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { copy } from "@/lib/copy";
import ChapterRule from "@/components/ui/ChapterRule";

export default function Wearer() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nums = el.querySelectorAll<HTMLElement>("[data-num]");

    const set = () =>
      nums.forEach((n) => {
        const target = Number(n.dataset.num);
        if (reduce) {
          n.textContent = String(target);
          return;
        }
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          ease: "cloth",
          onUpdate: () => { n.textContent = String(Math.round(obj.v)); },
        });
      });

    const st = ScrollTrigger.create({ trigger: el, start: "top 65%", once: true, onEnter: set });

    // subtle warm drift on the media (stands in for the looping wearer film)
    let media: gsap.core.Tween | undefined;
    if (!reduce) {
      media = gsap.fromTo(
        el.querySelector(".wearer-media"),
        { scale: 1.05 },
        { scale: 1.0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
      );
    }
    return () => {
      st.kill();
      media?.scrollTrigger?.kill();
      media?.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] flex flex-col justify-center px-[clamp(20px,5vw,80px)] py-28 bg-[var(--color-ink)]"
      style={{ filter: "sepia(0.06) saturate(1.05)" }}
    >
      <ChapterRule n={copy.wearer.label} label={copy.wearer.tag} right="THE FITTING ROOM" />
      <div className="grid md:grid-cols-2 items-center gap-12">
      <div className="relative aspect-[4/5] overflow-hidden mask-edges">
        {/*
          Drop-in point for the looping wearer film:
          <video className="wearer-media absolute inset-0 w-full h-full object-cover"
                 autoPlay muted loop playsInline poster="/media/wearer-poster.webp">
            <source src="/media/wearer.webm" type="video/webm" />
            <source src="/media/wearer.mp4"  type="video/mp4" />
          </video>
        */}
        <img src="/media/wearer-poster.webp" alt="A man wearing the finished suit" className="wearer-media absolute inset-0 w-full h-full object-cover" />
      </div>

      <div className="max-w-md">
        <h2 className="display text-[clamp(32px,4.4vw,60px)] mb-6 text-[var(--color-bone)]">{copy.wearer.title}</h2>
        <p className="body-copy mb-12">{copy.wearer.body}</p>

        <div className="flex gap-10">
          {copy.wearer.counter.map((num, i) => (
            <div key={i}>
              <span
                data-num={num}
                className="font-[family-name:var(--font-playfair)] text-[clamp(36px,4vw,56px)] text-[var(--color-brass)] tabular-nums"
              >
                0
              </span>
              <span className="label block mt-2 !tracking-[0.2em]">{copy.wearer.counterLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
