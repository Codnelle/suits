"use client";

import { copy } from "@/lib/copy";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import RevealText from "@/components/ui/RevealText";
import StitchLine from "@/components/ui/StitchLine";
import ChalkMark from "@/components/ui/ChalkMark";

// III — The Architecture of Detail.
// A feature plate, then details strung down the spine, each carrying its
// time-to-make and the cutter's note written in the margin.
export default function Detail() {
  const { label, tag, title, lead, plates, closer } = copy.detail;
  const [feature, ...rest] = plates;

  return (
    <section id="detail" className="relative bg-[var(--color-ink)] px-[clamp(20px,5vw,80px)] pt-[16vh] pb-[10vh] overflow-hidden">
      <StitchLine />

      {/* header */}
      <Reveal className="relative z-10 max-w-3xl mx-auto text-center mb-[12vh]">
        <SectionLabel n={label}>{tag}</SectionLabel>
        <h2 className="display text-[clamp(38px,5vw,76px)] mt-7 mb-6 text-[var(--color-bone)]">{title}</h2>
        <p className="body-copy mx-auto !text-center !max-w-[44ch]">{lead}</p>
      </Reveal>

      {/* feature plate — the Surgeon's Cuff, held up to the light */}
      <Reveal className="relative z-10 max-w-6xl mx-auto mb-[18vh]">
        <figure className="group relative w-full aspect-[16/10] md:aspect-[16/9] overflow-hidden mask-edges">
          <img
            src={`/media/${feature.media}.webp`}
            alt={feature.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-cloth)] group-hover:scale-[1.04]"
          />
          <span aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(23,24,28,0.72) 100%)" }} />
          {/* the house thinking out loud on the cloth */}
          <ChalkMark kind="circle" className="top-[10%] right-[13%]" label="here" width={104} height={104} />
          <ChalkMark kind="arrow" className="top-[42%] left-[8%] rotate-[8deg]" width={96} height={96} />
          <figcaption className="absolute left-0 right-0 bottom-0 p-[clamp(20px,3vw,40px)] text-white flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="label !text-[var(--color-brass)]">01 — {feature.k}</span>
              <h3 className="display text-[clamp(28px,3.6vw,52px)] mt-3 text-white">{feature.title}</h3>
            </div>
            <span className="label !text-white/70 border border-white/30 px-4 py-2 rounded-full backdrop-blur-sm">{feature.time}</span>
          </figcaption>
        </figure>
        <div className="mt-8 grid md:grid-cols-[1fr_auto] gap-6 items-start">
          <p className="body-copy !max-w-[46ch]">{feature.caption}</p>
          <Note text={feature.note} />
        </div>
      </Reveal>

      {/* the remaining details, alternating along the spine */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-[16vh] md:gap-[22vh]">
        {rest.map((p, i) => {
          const imageFirst = i % 2 === 0;
          const Img = (
            <figure className="group relative w-full aspect-[4/5] mask-edges overflow-hidden">
              <img
                src={`/media/${p.media}.webp`}
                alt={p.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-cloth)] group-hover:scale-[1.05]"
              />
              <span className="absolute top-4 left-4 label !text-[var(--color-brass)] bg-[var(--color-cloud)]/80 px-3 py-1.5 rounded-full backdrop-blur-sm">
                {p.time}
              </span>
            </figure>
          );
          const Txt = (
            <div className={imageFirst ? "md:pl-[6%]" : "md:pr-[6%] md:text-right md:ml-auto"}>
              <span className="label">{`0${i + 2} — ${p.k}`}</span>
              <h3 className="display text-[clamp(26px,3.2vw,44px)] mt-5 mb-5 text-[var(--color-bone)]">{p.title}</h3>
              <p className={`body-copy ${imageFirst ? "" : "md:ml-auto"}`}>{p.caption}</p>
              <div className={imageFirst ? "" : "md:flex md:justify-end"}>
                <Note text={p.note} />
              </div>
            </div>
          );
          return (
            <Reveal key={p.k}>
              <div className="relative grid md:grid-cols-2 items-center gap-y-8 gap-x-[12vw]">
                <span aria-hidden className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-[var(--color-brass)] bg-[var(--color-ink)] z-10" />
                {imageFirst ? (<>{Img}{Txt}</>) : (<><div className="md:order-2">{Img}</div><div className="md:order-1">{Txt}</div></>)}
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* closer — where the thread ties off */}
      <div className="relative z-10 pt-[24vh] pb-[8vh] grid place-items-center text-center">
        <RevealText
          as="div"
          className="max-w-[46rem] display text-[clamp(30px,5vw,72px)] leading-[1.06] text-[var(--color-bone)]"
          lines={[closer]}
        />
      </div>
    </section>
  );
}

// the cutter's note, written in the margin
function Note({ text }: { text: string }) {
  return (
    <blockquote className="mt-6 max-w-[36ch] border-l border-[var(--color-brass)] pl-5">
      <span className="label block !text-[var(--color-brass)] mb-2">Master's note</span>
      <p className="font-[family-name:var(--font-display)] italic text-[clamp(16px,1.3vw,19px)] leading-[1.5] text-[var(--color-graphite)]">
        “{text}”
      </p>
    </blockquote>
  );
}
