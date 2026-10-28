"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { copy } from "@/lib/copy";
import { openBooking } from "@/lib/booking";
import Reveal from "@/components/ui/Reveal";

// CAPS stay as written; the lowercase connectors are set in italic.
function Words({ parts }: { parts: readonly string[] }) {
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && " "}
          {p === p.toUpperCase() ? p : <em>{p}</em>}
        </span>
      ))}
    </>
  );
}

/**
 * Directly after the made suit:
 *   1. the studio — one sentence that explains the house, one call to action
 *   2. one pinned scene — "where HERITAGE meets MEASURE", a small photograph
 *      under it grows until it covers the line, and becomes the first of four
 *      full-bleed panels that carry Master G's visit sideways, captioned by a
 *      single running sentence
 *   3. the line that closes the visit
 */
export default function Atelier() {
  const s = copy.story;
  const steps = s.process.steps;

  const sceneRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const scalerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const scene = sceneRef.current;
    const sticky = stickyRef.current;
    const win = windowRef.current;
    const scaler = scalerRef.current;
    const track = trackRef.current;
    const chrome = chromeRef.current;
    if (!scene || !sticky || !win || !scaler || !track || !chrome) return;

    // The jewel is the whole first photograph in miniature, at the viewport's
    // own aspect, centred between the two lines. Growing the clip and the
    // scale together on the same ease keeps the photograph exactly filling
    // the window at every step.
    const jewel = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const w = Math.min(Math.max(W * 0.17, 150), 280);
      return { W, H, w, h: (w * H) / W };
    };
    const startInset = () => {
      const { W, H, w, h } = jewel();
      return `inset(${(H - h) / 2}px ${(W - w) / 2}px ${(H - h) / 2}px ${(W - w) / 2}px)`;
    };
    const place = () => sticky.style.setProperty("--jh", `${jewel().h}px`);
    place();

    const n = steps.length;
    const GROW_END = 0.24;
    const SLIDE_START = 0.3;
    const SLIDE_END = 0.95;
    const seg = (SLIDE_END - SLIDE_START) / (n - 1);
    let last = 0;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scene,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        invalidateOnRefresh: true,
        onRefresh: place,
      },
      // the lit word follows the panel actually on screen, not the scrollbar
      onUpdate: () => {
        const x = Number(gsap.getProperty(track, "xPercent"));
        const i = Math.max(0, Math.min(n - 1, Math.round((-x / 100) * n)));
        if (i !== last) {
          last = i;
          setActive(i);
        }
      },
    });

    // 1 — the photograph grows out of its window until it covers the line
    tl.fromTo(win, { clipPath: startInset }, { clipPath: "inset(0px 0px 0px 0px)", ease: "power2.inOut", duration: GROW_END }, 0);
    tl.fromTo(scaler, { scale: () => jewel().w / jewel().W }, { scale: 1, ease: "power2.inOut", duration: GROW_END }, 0);

    // 2 — once it fills the frame, the caption arrives and the panels step
    // across, each one held still before the next
    tl.fromTo(chrome, { opacity: 0 }, { opacity: 1, duration: 0.04 }, GROW_END);
    for (let k = 1; k < n; k++) {
      tl.to(track, { xPercent: (-100 * k) / n, ease: "power2.inOut", duration: seg * 0.55 }, SLIDE_START + seg * (k - 1) + seg * 0.25);
    }
    tl.to({}, { duration: 1 - SLIDE_END }, SLIDE_END); // hold the last panel

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reduce, steps.length]);

  // per-step line crossfades when the panel changes
  useEffect(() => {
    if (reduce || !lineRef.current) return;
    gsap.fromTo(lineRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: "cloth" });
  }, [active, reduce]);

  const studio = (
    <section className="relative bg-[var(--color-ink)] px-6 pt-[4vh] pb-[6vh] text-center">
      <Reveal>
        <p className="lead max-w-[30ch] mx-auto">{s.studio.lead}</p>
      </Reveal>
      <Reveal>
        <p className="body-serif max-w-[52ch] mx-auto mt-8 !text-[var(--color-bone)]/80">{s.studio.body}</p>
      </Reveal>
      <Reveal>
        <button onClick={() => openBooking()} className="pill mt-11">
          Book <em>your</em> FITTING
        </button>
      </Reveal>
    </section>
  );

  const closing = (
    <section className="relative bg-[var(--color-ink)] px-6 pt-[22vh] pb-[10vh] text-center">
      <Reveal>
        <p className="statement !text-[clamp(40px,6.4vw,104px)]">
          <span className="block"><Words parts={s.process.closeA} /></span>
          <span className="block"><Words parts={s.process.closeB} /></span>
        </p>
      </Reveal>
      <Reveal>
        <button onClick={() => openBooking()} className="pill mt-14">
          Meet <em>Master</em> G
        </button>
      </Reveal>
    </section>
  );

  // reduced motion: the same story, stacked and still
  if (reduce) {
    return (
      <>
        {studio}
        <section className="bg-[var(--color-ink)] px-6 pb-[16vh] text-center">
          <p className="eyebrow mb-8"><Words parts={s.essence.eyebrow} /></p>
          <p className="statement mb-[12vh]">
            <span className="block"><Words parts={s.essence.line1} /></span>
            <span className="block"><Words parts={s.essence.line2} /></span>
          </p>
          {steps.map((st) => (
            <figure key={st.word} className="max-w-5xl mx-auto mb-16">
              <img src={`/media/${st.media}`} alt="" className="w-full aspect-[16/9] object-cover" />
              <figcaption className="body-serif mt-5">
                {st.conn} <span className="uppercase">{st.word}</span> — {st.line}
              </figcaption>
            </figure>
          ))}
        </section>
        {closing}
      </>
    );
  }

  return (
    <>
      {studio}

      <section ref={sceneRef} id="atelier" className="relative h-[560svh] bg-[var(--color-ink)]" aria-label="Master G at home">
        <div ref={stickyRef} className="sticky top-0 h-[100svh] overflow-hidden [--jh:160px]">
          {/* the line the photograph will grow over, parted around it */}
          <div className="absolute inset-x-0 bottom-[calc(50%+var(--jh)/2+3.5vh)] px-6 text-center">
            <p className="eyebrow mb-7"><Words parts={s.essence.eyebrow} /></p>
            <p className="statement"><Words parts={s.essence.line1} /></p>
          </div>
          <p className="statement absolute inset-x-0 top-[calc(50%+var(--jh)/2+3vh)] px-6 text-center">
            <Words parts={s.essence.line2} />
          </p>

          {/* the window, and the four panels stepping across behind it */}
          <div ref={windowRef} className="absolute inset-0 z-10 overflow-hidden" style={{ clipPath: "inset(41% 41% 41% 41%)" }}>
            <div ref={scalerRef} className="absolute inset-0 origin-center will-change-transform">
              <div
                ref={trackRef}
                className="absolute inset-y-0 left-0 flex will-change-transform"
                style={{ width: `${steps.length * 100}%` }}
              >
                {steps.map((st, i) => (
                  <div key={st.word} className="relative h-full" style={{ width: `${100 / steps.length}%` }}>
                    <img
                      src={`/media/${st.media}`}
                      alt={`${st.conn} ${st.word.toLowerCase()} — ${st.line}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* caption chrome, shown once the photograph fills the frame */}
            <div ref={chromeRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0 }}>
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-[42%]" style={{ background: "linear-gradient(to top, rgba(14,12,10,0.62), transparent)" }} />

              <div className="absolute inset-x-0 bottom-[7vh] px-6 text-center text-white">
                <div ref={lineRef} className="font-[family-name:var(--font-body)] text-[clamp(14px,1.05vw,16px)] text-white/85 mb-5 min-h-[1.5em]">
                  {steps[active].line}
                </div>
                <p className="font-[family-name:var(--font-display)] text-[clamp(22px,3.2vw,48px)] leading-tight md:whitespace-nowrap">
                  {steps.map((st, i) => (
                    <span key={st.word} className="transition-opacity duration-500" style={{ opacity: i === active ? 1 : 0.42 }}>
                      {i > 0 && " "}
                      <em>{st.conn}</em> {st.word}
                      {i < steps.length - 1 && !st.word.endsWith(".") && ","}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {closing}
    </>
  );
}
