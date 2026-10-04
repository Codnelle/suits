"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { copy } from "@/lib/copy";
import { openBooking } from "@/lib/booking";
import Reveal from "@/components/ui/Reveal";
import ChalkMark from "@/components/ui/ChalkMark";
import Magnetic from "@/components/ui/Magnetic";

// 01 — The four steps, told beside a sticky photograph. The numbers tick up
// once the section arrives, and a Book Master G sits at the end of it.
export default function FittingRoom() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const nums = el.querySelectorAll<HTMLElement>("[data-num]");
    const runCounters = () =>
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
          onUpdate: () => {
            n.textContent = String(Math.round(obj.v));
          },
        });
      });
    const counterTrigger = ScrollTrigger.create({ trigger: el, start: "top 60%", once: true, onEnter: runCounters });

    const blocks = el.querySelectorAll<HTMLElement>(".stage-block");
    const triggers = Array.from(blocks).map((block, i) =>
      ScrollTrigger.create({
        trigger: block,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => setActive(i),
        onEnterBack: () => setActive(i),
      })
    );

    return () => {
      counterTrigger.kill();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const stages = copy.masterg.stages;

  return (
    <section ref={root} className="relative px-[clamp(20px,5vw,80px)] pt-24 pb-28 bg-[var(--color-ink)]">
      <div className="grid md:grid-cols-2 gap-[clamp(32px,6vw,90px)] items-start">
        {/* sticky stage imagery */}
        <div className="md:sticky md:top-[14vh]">
          <div className="relative aspect-[4/5] overflow-hidden mask-edges">
            {stages.map((s, i) => (
              <img
                key={s.k}
                src={`/media/${s.media}`}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[700ms] ease-[var(--ease-cloth)]"
                style={{ opacity: active === i ? 1 : 0 }}
              />
            ))}
            <ChalkMark kind="bracket" className="top-[16%] left-[6%]" width={70} height={130} />
            <ChalkMark kind="tick" className="top-[9%] right-[10%]" width={64} height={64} />
            <span className="absolute bottom-4 left-4 label !text-[var(--color-brass)] bg-[var(--color-cloud)]/80 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {stages[active].k}
            </span>
          </div>

          {/* the numbers */}
          <Reveal className="flex flex-wrap gap-x-10 gap-y-6 mt-10">
            {copy.masterg.counters.map((num, i) => (
              <div key={i}>
                <span
                  data-num={num}
                  className="font-[family-name:var(--font-display)] text-[clamp(36px,4vw,56px)] text-[var(--color-brass)] tabular-nums"
                >
                  0
                </span>
                <span className="label block mt-2 !tracking-[0.2em]">{copy.masterg.counterLabels[i]}</span>
              </div>
            ))}
            <div>
              <span className="font-[family-name:var(--font-display)] text-[clamp(36px,4vw,56px)] text-[var(--color-bone)] tabular-nums">
                {copy.masterg.stages.length}
              </span>
              <span className="label block mt-2 !tracking-[0.2em]">ALL AT HOME</span>
            </div>
          </Reveal>
        </div>

        {/* stages, scrolled */}
        <div className="flex flex-col">
          <div className="mb-12 max-w-md">
            <h2 className="display text-[clamp(32px,4.4vw,60px)] mb-6 text-[var(--color-bone)]">{copy.masterg.title}</h2>
            <p className="body-copy">{copy.masterg.body}</p>
          </div>

          {stages.map((s, i) => (
            <div
              key={s.k}
              className="stage-block min-h-[38vh] flex flex-col justify-center border-t border-[var(--color-ash)]/15 py-10"
            >
              <span className="label">{`0${i + 1} — ${s.k}`}</span>
              <h3 className="display text-[clamp(24px,2.6vw,36px)] mt-4 mb-4 text-[var(--color-bone)]">{s.title}</h3>
              <p className="body-copy">{s.body}</p>
            </div>
          ))}

          <Reveal className="pt-6">
            <Magnetic strength={0.2}>
              <button
                onClick={() => openBooking()}
                className="group inline-flex items-center gap-4 pl-6 pr-2 py-2 rounded-full bg-[var(--color-bone)] text-white transition-colors hover:bg-[var(--color-brass)]"
              >
                <span className="text-[11px] tracking-[0.2em] uppercase font-medium">{copy.masterg.cta}</span>
                <span className="relative grid place-items-center w-10 h-10 rounded-full bg-[var(--color-brass)] text-white overflow-hidden">
                  <span className="transition-transform duration-500 group-hover:translate-x-6">→</span>
                  <span className="absolute transition-transform duration-500 -translate-x-6 group-hover:translate-x-0">→</span>
                </span>
              </button>
            </Magnetic>
            <p className="text-[11px] text-[var(--color-ash)] mt-4">
              Home visit {copy.booking.fee.now} ({copy.booking.fee.was}) — {copy.booking.fee.note.toLowerCase()}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}