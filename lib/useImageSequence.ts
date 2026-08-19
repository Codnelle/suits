"use client";

import { useEffect, useRef, useState } from "react";

type Frame = ImageBitmap | HTMLImageElement;

async function decodeOne(url: string): Promise<Frame> {
  // Prefer createImageBitmap (off-main-thread decode); fall back to Image.decode().
  if (typeof createImageBitmap === "function") {
    const res = await fetch(url);
    const blob = await res.blob();
    return await createImageBitmap(blob);
  }
  const img = new Image();
  img.src = url;
  await img.decode();
  return img;
}

/**
 * Preloads a numbered frame sequence with a "gate": the first `gateCount`
 * frames resolve gateReady, then the rest stream in the background.
 * Frames are decoded once and stored in a plain array (never in the scroll path).
 */
export function useImageSequence(count: number, srcFor: (i: number) => string, gateCount = 15) {
  const framesRef = useRef<(Frame | undefined)[]>(new Array(count).fill(undefined));
  const [gateReady, setGateReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    framesRef.current = new Array(count).fill(undefined);
    setGateReady(false);
    setProgress(0);
    let done = 0;

    const load = async (i: number) => {
      try {
        const f = await decodeOne(srcFor(i));
        if (cancelled) {
          if (f instanceof ImageBitmap) f.close();
          return;
        }
        framesRef.current[i] = f;
      } catch {
        /* leave undefined; draw falls back to nearest loaded frame */
      } finally {
        done += 1;
        if (!cancelled) setProgress(done / count);
      }
    };

    (async () => {
      const gate = Math.min(gateCount, count);
      // load the gate window sequentially-ish (small, first paint priority)
      await Promise.all(Array.from({ length: gate }, (_, i) => load(i)));
      if (cancelled) return;
      setGateReady(true);
      // stream the remainder with limited concurrency
      const rest = Array.from({ length: count - gate }, (_, k) => gate + k);
      const CONC = 6;
      let cursor = 0;
      const worker = async () => {
        while (!cancelled && cursor < rest.length) {
          const idx = rest[cursor++];
          await load(idx);
        }
      };
      await Promise.all(Array.from({ length: CONC }, worker));
    })();

    return () => {
      cancelled = true;
      framesRef.current.forEach((f) => f instanceof ImageBitmap && f.close());
      framesRef.current = new Array(count).fill(undefined);
    };
  }, [count, srcFor, gateCount]);

  return { framesRef, gateReady, progress };
}

// nearest already-loaded frame, searching outward — avoids flicker on fast scroll
export function nearestLoaded(frames: (Frame | undefined)[], i: number): Frame | undefined {
  if (frames[i]) return frames[i];
  for (let d = 1; d < frames.length; d++) {
    if (frames[i - d]) return frames[i - d];
    if (frames[i + d]) return frames[i + d];
  }
  return undefined;
}
