"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useImageSequence, nearestLoaded } from "@/lib/useImageSequence";
import { copy } from "@/lib/copy";
import { refreshScrollTriggers } from "@/lib/scroll";
import Hotspot from "@/components/ui/Hotspot";

const DESKTOP_COUNT = 120;
const MOBILE_COUNT = 60;
const pad = (n: number) => String(n).padStart(3, "0");

// the suit sits small between the two halves of a statement at either end,
// and fills the frame while it is being made
const SETTLED = 0.56;

// hotspots appear once the jacket is on, before the closing line arrives
const HS_IN = 0.55;
const HS_OUT = 0.72;

const Line = ({ a, conn, b }: { a?: string; conn?: string; b?: string }) => (
  <>
    {a}
    {conn && <> <em>{conn}</em></>}
    {b && <> {b}</>}
  </>
);

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

  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hotspotLayerRef = useRef<HTMLDivElement>(null);
  const openRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const closeRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const proxy = useRef({ f: 0 });
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
  // Sized from layout dimensions, not getBoundingClientRect: the stage is
  // scaled with a transform, and the backing store must stay full-size so the
  // suit is sharp when it fills the frame.
  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      drawnFrame.current = -1;
      draw();
    };
    size();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        size();
        refreshScrollTriggers();
      }, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [reduce, draw]);

  // ---- scrub + ticker draw + choreography ----
  useEffect(() => {
    if (reduce || !gateReady) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!container || !canvas || !stage) return;

    const [openA, openB] = openRefs.current;
    const [closeA, closeB] = closeRefs.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          const layer = hotspotLayerRef.current;
          if (layer) {
            const on = self.progress >= HS_IN && self.progress <= HS_OUT;
            layer.style.opacity = on ? "1" : "0";
            layer.style.pointerEvents = on ? "auto" : "none";
          }
        },
      },
    });

    // the frame sequence runs the whole distance
    tl.to(proxy.current, { f: count - 1, ease: "none", duration: 1 }, 0);

    // opening: the statement parts, the suit comes forward to be made
    tl.to(openA, { opacity: 0, yPercent: -60, duration: 0.08, ease: "power2.in" }, 0.07);
    tl.to(openB, { opacity: 0, yPercent: 60, duration: 0.08, ease: "power2.in" }, 0.07);
    tl.to(stage, { scale: 1, duration: 0.13, ease: "power2.inOut" }, 0.08);

    // closing: the finished suit settles back, and the line closes around it
    tl.to(stage, { scale: SETTLED, duration: 0.13, ease: "power2.inOut" }, 0.78);
    tl.fromTo(closeA, { opacity: 0, yPercent: -60 }, { opacity: 1, yPercent: 0, duration: 0.09, ease: "cloth" }, 0.84);
    tl.fromTo(closeB, { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: 0.09, ease: "cloth" }, 0.86);

    const tick = () => draw();
    gsap.ticker.add(tick);

    refreshScrollTriggers();

    return () => {
      gsap.ticker.remove(tick);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reduce, gateReady, count, draw]);

  const { open, close } = copy.story;

  // ---------- reduced-motion: static key frames with the same two lines ----------
  if (reduce) {
    return (
      <section id="master-g" className="bg-[var(--color-ink)] py-[16vh] text-center">
        <p className="statement !text-[clamp(40px,6vw,96px)]"><Line {...open} /></p>
        <div className="flex flex-wrap justify-center gap-6 my-[10vh] px-6">
          {[0, 40, 80, 119].map((k) => (
            <img key={k} src={`/sequence/frame-${pad(k)}.webp`} alt="" className="w-[min(40vw,320px)] mask-edges" />
          ))}
        </div>
        <p className="statement !text-[clamp(40px,6vw,96px)]"><Line {...close} /></p>
      </section>
    );
  }

  // ---------- the pinned assembly ----------
  const statementCls =
    "statement absolute left-0 right-0 text-center px-6 !text-[clamp(40px,6.2vw,104px)] will-change-transform";

  return (
    <section ref={containerRef} id="master-g" className="relative h-[620svh] bg-[var(--color-ink)]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* the suit — scaled as a whole so it can sit between the lines */}
        <div
          ref={stageRef}
          className="absolute inset-0 mask-frame will-change-transform"
          style={{ transform: `scale(${SETTLED})` }}
        >
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Shahee — a suit being made, from shirt to waistcoat to jacket"
            className="absolute inset-0 w-full h-full"
          />
          {/* hotspots share the canvas's coordinate space */}
          <div ref={hotspotLayerRef} className="absolute inset-0 z-10" style={{ opacity: 0, transition: "opacity 400ms var(--ease-cloth)" }}>
            {copy.hotspots.map((s) => (
              <Hotspot key={s.id} spot={s} open={openSpot === s.id} onOpen={setOpenSpot} onClose={() => setOpenSpot(null)} />
            ))}
          </div>
        </div>

        {/* the two statements frame the suit, above and below */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <p ref={(el) => { openRefs.current[0] = el; }} className={`${statementCls} top-[11vh]`}>
            {open.a} <em>{open.conn}</em>
          </p>
          <p ref={(el) => { openRefs.current[1] = el; }} className={`${statementCls} bottom-[10vh]`}>
            {open.b}
          </p>
          <p ref={(el) => { closeRefs.current[0] = el; }} className={`${statementCls} top-[11vh]`} style={{ opacity: 0 }}>
            {close.a} <em>{close.conn}</em>
          </p>
          <p ref={(el) => { closeRefs.current[1] = el; }} className={`${statementCls} bottom-[10vh]`} style={{ opacity: 0 }}>
            {close.b}
          </p>
        </div>

        {/* loader gate */}
        {!gateReady && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-[var(--color-ink)]">
            <div className="w-[min(60vw,320px)] text-center">
              <div className="h-px bg-[var(--color-bone)]/15 overflow-hidden">
                <div className="h-full bg-[var(--color-bone)]/60" style={{ width: `${Math.round(progress * 100)}%`, transition: "width 200ms linear" }} />
              </div>
              <p className="eyebrow mt-5">Preparing <em>the</em> CLOTH</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
