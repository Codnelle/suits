"use client";

import { copy } from "@/lib/copy";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import StitchLine from "@/components/ui/StitchLine";

export default function DetailRail() {
  const { label, title, lead, plates, closer } = copy.detail;

  return (
    <section id="detail" className="relative bg-[var(--color-ink)] px-[clamp(20px,5vw,80px)] pt-[16vh] pb-[10vh] overflow-hidden">
      {/* the thread that sews itself down the whole section */}
      <StitchLine />

      {/* header */}
      <Reveal className="relative z-10 max-w-2xl mx-auto text-center mb-[14vh]">
        <SectionLabel n={label}>{title}</SectionLabel>
        <p className="display text-[clamp(30px,4.4vw,60px)] mt-6 text-[var(--color-bone)]">{lead}</p>
      </Reveal>

      {/* details strung along the thread, alternating sides */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-[16vh] md:gap-[22vh]">
        {plates.map((p, i) => {
          const imageFirst = i % 2 === 0;
          const Img = (
            <figure className="group relative w-full aspect-[4/5] mask-edges overflow-hidden">
              <img
                src={`/media/${p.media}.webp`}
                alt={p.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-cloth)] group-hover:scale-[1.05]"
              />
            </figure>
          );
          const Txt = (
            <div className={imageFirst ? "md:pl-[6%]" : "md:pr-[6%] md:text-right md:ml-auto"}>
              <span className="label">{`0${i + 1} — ${p.k}`}</span>
              <h3 className="display text-[clamp(28px,3.4vw,48px)] mt-5 mb-5 text-[var(--color-bone)]">{p.title}</h3>
              <p className={`body-copy ${imageFirst ? "" : "md:ml-auto"}`}>{p.caption}</p>
            </div>
          );
          return (
            <Reveal key={p.k}>
              <div className="relative grid md:grid-cols-2 items-center gap-y-8 gap-x-[12vw]">
                {/* node: this detail, strung on the thread */}
                <span aria-hidden className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-[var(--color-brass)] bg-[var(--color-ink)] z-10" />
                {imageFirst ? (<>{Img}{Txt}</>) : (<><div className="md:order-2">{Img}</div><div className="md:order-1">{Txt}</div></>)}
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* closer — where the thread ties off */}
      <div className="relative z-10 pt-[24vh] pb-[8vh] grid place-items-center text-center">
        <Reveal className="max-w-[46rem]">
          <p className="display text-[clamp(30px,5vw,72px)] leading-[1.06] text-[var(--color-bone)]">{closer}</p>
        </Reveal>
      </div>
    </section>
  );
}
