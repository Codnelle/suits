"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useImageSequence, nearestLoaded } from "@/lib/useImageSequence";
import { copy } from "@/lib/copy";
import Hotspot from "@/components/ui/Hotspot";
import SectionLabel from "@/components/ui/SectionLabel";

const DESKTOP_COUNT = 120;
const MOBILE_COUNT = 60;
const pad = (n: number) => String(n).padStart(3, "0");

// hotspots live in the X-ray interior window (frames 096–107 → progress)
const HS_IN = 0.8;
const HS_OUT = 0.905;

export default function AssemblyCanvas() {
  const [isMobile, setIsMobile] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [openSpot, setOpenSpot] = useState<string | null>(null);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const count = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;
  const srcFor = useCallback(
    (i: number) => (isMobile ? `/sequence/sm/frame-${pad(i)}.webp` : `/sequence/frame-${pad(i)}.webp`),
    [isMobile]
  );

  const { framesRef, gateReady, progress } = useImageSequence(count, srcFor, 15);

  const wrapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hotspotLayerRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const proxy = useRef({ f: 0, p: 0 });
  const drawnFrame = useRef(-1);

  // ---- draw a frame with manual cover-fit ----
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const idx = Math.round(proxy.current.f);
    if (idx === drawnFrame.current) return;
    const frame = nearestLoaded(framesRef.current, Math.min(count - 1, Math.max(0, idx)));
    if (!frame) return;
    drawnFrame.current = idx;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = "naturalWidth" in frame ? frame.naturalWidth : frame.width;
    const ih = "naturalHeight" in frame ? frame.naturalHeight : frame.height;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(frame as CanvasImageSource, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }, [framesRef, count]);

  // ---- canvas sizing (DPR-aware, debounced) ----
  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      drawnFrame.current = -1;
      draw();
    };
    size();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        size();
        ScrollTrigger.refresh();
      }, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [reduce, draw]);

  // ---- scrub + ticker draw + overlays ----
  useEffect(() => {
    if (reduce || !gateReady) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const acts = copy.assembly.acts;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          proxy.current.p = self.progress;
          // hotspot layer visibility (imperative — no re-render per frame)
          const layer = hotspotLayerRef.current;
          if (layer) {
            const on = self.progress >= HS_IN && self.progress <= HS_OUT;
            layer.style.opacity = on ? "1" : "0";
            layer.style.pointerEvents = on ? "auto" : "none";
          }
          // aria-label at act boundaries
          const ai = self.progress < 0.33 ? 0 : self.progress < 0.6 ? 1 : 2;
          canvas.setAttribute("aria-label", `Shahee — Made to Measure — Act ${acts[ai].n}, ${acts[ai].title}`);
        },
      },
    });
    // frame proxy across the whole distance
    tl.to(proxy.current, { f: count - 1, ease: "none", duration: 1 }, 0);

    // copy overlays fade in/out across their progress ranges
    acts.forEach((act, i) => {
      const el = copyRefs.current[i];
      if (!el) return;
      const [s, e] = act.range;
      gsap.set(el, { opacity: 0, y: 24 });
      tl.to(el, { opacity: 1, y: 0, duration: 0.05, ease: "cloth" }, s);
      tl.to(el, { opacity: 0, y: -24, duration: 0.05, ease: "cloth" }, Math.max(s + 0.05, e - 0.05));
    });

    const tick = () => draw();
    gsap.ticker.add(tick);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reduce, gateReady, count, draw]);

  const acts = copy.assembly.acts;

  // ---------- reduced-motion: six static key frames, vertical, same copy ----------
  if (reduce) {
    const keys = [0, 39, 60, 71, 96, 119];
    return (
      <section id="assembly" className="bg-[var(--color-ink)]">
        {keys.map((k, i) => {
          const act = acts[Math.min(acts.length - 1, Math.floor(i / 2))];
          return (
            <div key={k} className="min-h-[100svh] grid md:grid-cols-2 items-center gap-10 px-[clamp(20px,5vw,80px)] py-24">
              <img src={`/sequence/frame-${pad(k)}.webp`} alt={`Suit assembly, stage ${i + 1}`} className="w-full max-w-[520px] mx-auto" />
              {i % 2 === 0 && (
                <div className="max-w-md">
                  <SectionLabel n={act.n}>{act.label}</SectionLabel>
                  <h2 className="display text-[clamp(30px,4vw,52px)] mt-6 mb-6 text-[var(--color-bone)]">{act.title}</h2>
                  <p className="body-copy">{act.body}</p>
                </div>
              )}
            </div>
          );
        })}
      </section>
    );
  }

  // ---------- the pinned assembly ----------
  return (
    <section ref={containerRef} id="assembly" className="relative h-[600svh] bg-[var(--color-ink)]">
      <div ref={wrapRef} className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Shahee — Made to Measure — assembly"
          className="absolute inset-0 w-full h-full"
        />

        {/* dissolve the pinned canvas into the ink ground at both edges */}
        <span className="seam-top" aria-hidden />
        <span className="seam-bottom" aria-hidden />

        {/* copy overlays */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {acts.map((act, i) => (
            <div
              key={act.n}
              ref={(el) => { copyRefs.current[i] = el; }}
              className="absolute left-[clamp(20px,5vw,80px)] bottom-[12vh] md:top-1/2 md:-translate-y-1/2 md:bottom-auto max-w-[min(90vw,420px)]"
            >
              <SectionLabel n={act.n}>{act.label}</SectionLabel>
              <h2 className="display text-[clamp(28px,3.4vw,46px)] mt-5 mb-5 text-[var(--color-bone)]">{act.title}</h2>
              <p className="body-copy">{act.body}</p>
            </div>
          ))}
        </div>

        {/* hotspot layer (fitted coordinate space = canvas cover) */}
        <div ref={hotspotLayerRef} className="absolute inset-0 z-10" style={{ opacity: 0, transition: "opacity 400ms var(--ease-cloth)" }}>
          {copy.hotspots.map((s) => (
            <Hotspot
              key={s.id}
              spot={s}
              open={openSpot === s.id}
              onOpen={setOpenSpot}
              onClose={() => setOpenSpot(null)}
            />
          ))}
        </div>

        {/* loader gate */}
        {!gateReady && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-[var(--color-ink)]">
            <div className="w-[min(60vw,320px)] text-center">
              <div className="h-px bg-[var(--color-brass)]/20 overflow-hidden">
                <div className="h-full bg-[var(--color-brass)]" style={{ width: `${Math.round(progress * 100)}%`, transition: "width 200ms linear" }} />
              </div>
              <p className="label mt-5">Preparing the Cloth</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
