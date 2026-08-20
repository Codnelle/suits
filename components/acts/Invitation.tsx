"use client";

import RevealText from "@/components/ui/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import { copy } from "@/lib/copy";
import { openBooking } from "@/lib/booking";
import Magnetic from "@/components/ui/Magnetic";

// The closing invitation — a full-viewport restatement of the commission,
// the last door before the footer.
export default function Invitation() {
  // locations are derived from the ateliers so there's no duplicated copy
  const locations = copy.invitation.ateliers.map((a) => `${a.city} — ${a.address}`);

  return (
    <section id="appointment" className="relative min-h-[100svh] grid place-items-center bg-[var(--color-ink)] py-28 overflow-hidden">
      <img
        src="/media/suit-complete.webp"
        alt=""
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[80svh] w-auto max-w-none object-contain"
        style={{ opacity: 0.16 }}
      />
      {/* light bloom lifts the copy off the watermark */}
      <span aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(52% 40% at 50% 46%, var(--color-ink) 0%, rgba(235,229,219,0.7) 45%, transparent 72%)" }} />
      <span aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(120% 88% at 50% 45%, transparent 58%, var(--color-ink))" }} />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <SectionLabel n="10">{copy.invitation.tag}</SectionLabel>
        <RevealText
          as="h2"
          className="display text-[clamp(38px,6vw,84px)] mt-6 mb-8 text-[var(--color-bone)]"
          lines={[copy.invitation.title]}
        />
        <p className="body-copy mx-auto mb-12 !text-center">{copy.invitation.body}</p>

        <Magnetic strength={0.25}>
          <button
            onClick={openBooking}
            className="inline-block label border border-[var(--color-brass)] px-10 py-[18px] text-[var(--color-brass)] transition-colors duration-[260ms] ease-[var(--ease-cloth)] hover:bg-[var(--color-bone)] hover:!text-white hover:border-[var(--color-bone)]"
          >
            {copy.invitation.cta}
          </button>
        </Magnetic>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
          {locations.map((l) => (
            <span key={l} className="text-[12px] text-[var(--color-ash)]">{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
