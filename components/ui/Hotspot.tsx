"use client";

import { useEffect, useRef } from "react";

export type Spot = { id: string; title: string; note: string; x: number; y: number };

export default function Hotspot({
  spot,
  open,
  onOpen,
  onClose,
}: {
  spot: Spot;
  open: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
}) {
  const pinRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const prevFocus = document.activeElement as HTMLElement | null;
    const focusables = drawer?.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
    focusables?.[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && focusables && focusables.length) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  return (
    <>
      <button
        ref={pinRef}
        onClick={() => onOpen(spot.id)}
        aria-label={`${spot.title} — detail`}
        aria-expanded={open}
        className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center"
        style={{ left: `${spot.x * 100}%`, top: `${spot.y * 100}%` }}
      >
        <span className="block w-[7px] h-[7px] rounded-full border border-[var(--color-brass)] hotspot-pulse" />
      </button>

      {/* right-side drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={spot.title}
        className="fixed top-0 right-0 h-full w-[min(420px,88vw)] bg-[var(--color-charcoal)] z-[60] border-l border-[var(--color-brass)]/30 flex flex-col justify-center px-10"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 480ms var(--ease-cloth)",
          visibility: open ? "visible" : "hidden",
        }}
      >
        <span className="label mb-6">Detail</span>
        <h3 className="display text-[clamp(26px,3vw,34px)] text-[var(--color-bone)] mb-5">{spot.title}</h3>
        <p className="body-copy">{spot.note}</p>
        <button onClick={onClose} className="label mt-10 self-start border-b border-[var(--color-brass)]/40 pb-1">
          Close
        </button>
      </div>
    </>
  );
}
