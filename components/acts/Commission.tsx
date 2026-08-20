"use client";

import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import { copy } from "@/lib/copy";
import { openBooking } from "@/lib/booking";
import Magnetic from "@/components/ui/Magnetic";

// VI — The Commission. Exclusivity made concrete: a running availability ring
// and the three ateliers as destinations, not footnote addresses.
export default function Commission() {
  const { label, tag, title, body, cta, season, availability, ateliers } = copy.invitation;
  const remaining = availability.total - availability.taken;
  const frac = availability.taken / availability.total;

  return (
    <section id="commission" className="relative bg-[var(--color-ink)] py-32 overflow-hidden">
      {/* watermark */}
      <img
        src="/media/suit-complete.webp"
        alt=""
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[80svh] w-auto max-w-none object-contain"
        style={{ opacity: 0.1 }}
      />
      <span aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(52% 40% at 50% 46%, var(--color-ink) 0%, rgba(235,229,219,0.7) 45%, transparent 72%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* header */}
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <SectionLabel n={label}>{tag}</SectionLabel>
          <RevealText
            as="h2"
            className="display text-[clamp(38px,6vw,84px)] mt-6 mb-8 text-[var(--color-bone)]"
            lines={[title]}
          />
          <p className="body-copy mx-auto !text-center">{body}</p>
        </Reveal>

        {/* availability ring */}
        <Reveal className="flex justify-center mb-16">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left border border-[var(--color-line)] rounded-[6px] px-8 py-6 bg-[var(--color-cloud)]/60">
            <AvailabilityRing frac={frac} />
            <div>
              <p className="display text-[clamp(26px,3vw,40px)] text-[var(--color-bone)] leading-none">{remaining} slots left</p>
              <p className="label mt-2 !tracking-[0.2em]">for {season} · {availability.taken} of {availability.total} home visits booked</p>
            </div>
          </div>
        </Reveal>

        {/* atelier windows */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {ateliers.map((a) => (
            <Reveal key={a.city}>
              <article className="group relative overflow-hidden rounded-[6px] border border-[var(--color-line)] bg-[var(--color-cloud)]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={`/media/${a.media}.webp`}
                    alt={`${a.city} atelier`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-cloth)] group-hover:scale-[1.06]"
                  />
                  <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(23,24,28,0.66) 100%)" }} />
                  <span className="absolute left-4 bottom-3 label !text-white">{a.city}</span>
                </div>
                <div className="p-6">
                  <p className="text-[13px] text-[var(--color-bone)] mb-1">{a.address}</p>
                  <p className="text-[13px] text-[var(--color-ash)]">{a.cutter}</p>
                  <p className="label !tracking-[0.16em] mt-2 mb-4">{a.tenure}</p>
                  <a href={`mailto:${a.email}`} className="stitch-link inline-block text-[12px] text-[var(--color-brass)]">
                    {a.email}
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal className="text-center">
          <Magnetic strength={0.25}>
            <button
              onClick={openBooking}
              className="inline-block label border border-[var(--color-brass)] px-10 py-[18px] text-[var(--color-brass)] transition-colors duration-[260ms] ease-[var(--ease-cloth)] hover:bg-[var(--color-bone)] hover:!text-white hover:border-[var(--color-bone)]"
            >
              {cta}
            </button>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}

function AvailabilityRing({ frac }: { frac: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden className="shrink-0 -rotate-90">
      <circle cx="48" cy="48" r={r} fill="none" stroke="var(--color-line)" strokeWidth="3" />
      <circle
        cx="48" cy="48" r={r} fill="none" stroke="var(--color-brass)" strokeWidth="3"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - frac)}
        style={{ transition: "stroke-dashoffset 1.2s var(--ease-cloth)" }}
      />
    </svg>
  );
}
