"use client";

import { copy } from "@/lib/copy";
import { openBooking } from "@/lib/booking";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import RevealText from "@/components/ui/RevealText";
import Magnetic from "@/components/ui/Magnetic";

// 04 — About Shahee. The founder's own words, the one percent we set aside
// before anyone is paid, and the three zones Master G works.
export default function About() {
  const a = copy.about;

  return (
    <section id="about" className="relative bg-[var(--color-ink)] py-[clamp(96px,16vh,190px)] overflow-hidden">
      <span className="warp" aria-hidden />
      <span className="hush" aria-hidden />

      <div className="relative z-10 px-[clamp(20px,5vw,80px)] max-w-5xl mx-auto">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <SectionLabel n={a.label}>{a.tag}</SectionLabel>
          <RevealText
            as="h2"
            className="display text-center text-[clamp(34px,4.8vw,64px)] leading-[1.04] mt-7 mb-10 text-[var(--color-bone)]"
            lines={[<>A NOTE <em className="italic">from</em></>, <>the FOUNDER</>]}
          />
        </Reveal>

        <Reveal className="max-w-2xl mx-auto">
          {a.letter.map((p) => (
            <p
              key={p.slice(0, 24)}
              className="font-[family-name:var(--font-display)] text-[clamp(18px,1.5vw,23px)] leading-[1.62] text-[var(--color-graphite)] mb-7"
            >
              {p}
            </p>
          ))}
          <div className="pt-6 border-t border-[var(--color-ash)]/20">
            <p className="font-[family-name:var(--font-display)] italic text-[clamp(22px,2vw,30px)] text-[var(--color-bone)]">
              {a.signature}
            </p>
            <p className="label mt-2 !text-[var(--color-ash)]">{a.role}</p>
          </div>
        </Reveal>

        <Reveal className="flex justify-center mt-12">
          <Magnetic strength={0.25}>
            <button
              onClick={() => openBooking()}
              className="inline-block label border border-[var(--color-brass)] px-10 py-[18px] text-[var(--color-brass)] transition-colors duration-[260ms] ease-[var(--ease-cloth)] hover:bg-[var(--color-bone)] hover:!text-white hover:border-[var(--color-bone)]"
            >
              {a.cta}
            </button>
          </Magnetic>
        </Reveal>

        {/* One percent, always */}
        <Reveal className="mt-[14vh]">
          <div className="border-y border-[var(--color-ash)]/20 py-14 grid md:grid-cols-[auto_1fr] gap-y-10 gap-x-[8vw] items-start">
            <div className="shrink-0">
              <span className="block font-[family-name:var(--font-display)] text-[clamp(64px,9vw,132px)] leading-none text-[var(--color-line)] select-none">
                1%
              </span>
            </div>
            <div>
              <span className="label">{a.onePercent.kicker}</span>
              <h3 className="display text-[clamp(26px,3vw,42px)] mt-4 mb-6 text-[var(--color-bone)]">
                {a.onePercent.title}
              </h3>
              {a.onePercent.body.map((p) => (
                <p key={p.slice(0, 24)} className="body-copy !text-[14px] mb-4 max-w-[54ch]">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        {/* where Master G works */}
        <Reveal className="mt-[12vh]">
          <div className="text-center mb-10">
            <span className="label">{copy.zones.title}</span>
            <p className="body-copy mx-auto mt-4 !text-center">{copy.zones.lead}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {copy.booking.zones.map((z) => (
              <article
                key={z.id}
                className="p-6 rounded-[6px] border border-[var(--color-line)] bg-[var(--color-cloud)]/60"
              >
                <span className="label">{z.name}</span>
                <p className="text-[14px] text-[var(--color-bone)] mt-3 leading-snug">{z.areas}</p>
                <p className="mono text-[10px] tracking-[0.14em] text-[var(--color-ash)] mt-2">{z.pincodes}</p>
                <p className="label !text-[var(--color-ash)]/70 !tracking-[0.16em] mt-4">{z.note}</p>
              </article>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Magnetic strength={0.2}>
              <button
                onClick={() => openBooking()}
                className="inline-block label border border-[var(--color-brass)] px-8 py-4 text-[var(--color-brass)] transition-colors duration-[260ms] hover:bg-[var(--color-bone)] hover:!text-white hover:border-[var(--color-bone)]"
              >
                {copy.zones.cta}
              </button>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}