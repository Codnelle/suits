"use client";

import { useState } from "react";
import { copy, defaultConfiguration } from "@/lib/copy";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import RevealText from "@/components/ui/RevealText";
import StitchLine from "@/components/ui/StitchLine";
import ChalkMark from "@/components/ui/ChalkMark";

// 03 — The Architecture of Detail.
// A feature plate, then details strung down the spine. Four of them, and every
// one of them is selectable — so the section itself is the configurator.
export default function Detail() {
  const { label, tag, title, lead, plates, closer } = copy.detail;
  const [feature, ...rest] = plates;
  const [chosen, setChosen] = useState<Record<string, string>>(defaultConfiguration);

  return (
    <section id="detail" className="relative isolate bg-[var(--color-ink)] px-[clamp(20px,5vw,80px)] pt-[14vh] pb-[10vh] overflow-hidden">
      <StitchLine />

      <Reveal className="relative z-10 max-w-3xl mx-auto text-center mb-[11vh]">
        <SectionLabel n={label}>{tag}</SectionLabel>
        <h2 className="display text-[clamp(38px,5vw,76px)] mt-7 mb-6 text-[var(--color-bone)]">{title}</h2>
        <p className="body-copy mx-auto !text-center !max-w-[44ch]">{lead}</p>
      </Reveal>

      {/* feature plate — the lapel, held up to the light */}
      <Reveal className="relative z-10 max-w-6xl mx-auto mb-[16vh]">
        <figure className="group relative w-full aspect-[16/10] md:aspect-[16/9] overflow-hidden mask-edges">
          <img
            src={`/media/${feature.media}`}
            alt={feature.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-[var(--ease-cloth)] group-hover:scale-[1.04]"
          />
          <span aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(23,24,28,0.72) 100%)" }} />
          <ChalkMark kind="circle" className="top-[10%] right-[13%]" label="roll" width={104} height={104} />
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
        {feature.configKey && (
          <Picker
            options={copy.configure[feature.configKey]}
            activeId={chosen[feature.configKey]}
            label={feature.selectable}
            onPick={(id) => setChosen((c) => ({ ...c, [feature.configKey!]: id }))}
            className="mt-8"
          />
        )}
      </Reveal>

      {/* the remaining details, alternating along the spine */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-[15vh] md:gap-[21vh]">
        {rest.map((p, i) => {
          const imageFirst = i % 2 === 0;
          const group = p.configKey;
          const options = group ? copy.configure[group] : undefined;
          const activeId = group ? chosen[group] : undefined;

          const Img = (
            <figure className="group relative w-full aspect-[4/5] mask-edges overflow-hidden">
              <img
                src={`/media/${p.media}`}
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

              {options && group && (
                <Picker
                  options={options}
                  activeId={activeId}
                  label={p.selectable}
                  onPick={(id) => setChosen((c) => ({ ...c, [group]: id }))}
                  className={`mt-7 ${imageFirst ? "" : "md:flex md:justify-end"}`}
                />
              )}

              <div className={imageFirst ? "" : "md:flex md:justify-end"}>
                <Note text={p.note} />
              </div>
            </div>
          );

          return (
            <Reveal key={p.k}>
              <div className="relative grid md:grid-cols-2 items-center gap-y-8 gap-x-[12vw]">
                <span aria-hidden className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-[var(--color-brass)] bg-[var(--color-ink)] z-10" />
                {imageFirst ? (
                  <>
                    {Img}
                    {Txt}
                  </>
                ) : (
                  <>
                    <div className="md:order-2">{Img}</div>
                    <div className="md:order-1">{Txt}</div>
                  </>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="relative z-10 pt-[22vh] pb-[6vh] grid place-items-center text-center">
        <RevealText
          as="div"
          className="max-w-[46rem] display text-[clamp(30px,5vw,72px)] leading-[1.06] text-[var(--color-bone)]"
          lines={[closer]}
        />
      </div>
    </section>
  );
}

function Picker({
  options,
  activeId,
  label,
  onPick,
  className = "",
}: {
  options: readonly { id: string; title: string; note: string }[];
  activeId?: string;
  label: string;
  onPick: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="inline-block text-left">
        <span className="label !text-[var(--color-ash)]/60 mb-3 block">{label}</span>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => {
            const active = activeId === o.id;
            return (
              <button
                type="button"
                key={o.id}
                onClick={() => onPick(o.id)}
                aria-pressed={active}
                title={o.note}
                className="label !tracking-[0.14em] px-4 py-2 rounded-full border transition-colors"
                style={active
                  ? { backgroundColor: "var(--color-bone)", borderColor: "var(--color-bone)", color: "#fff" }
                  : { borderColor: "var(--color-line)", color: "var(--color-ash)" }}
              >
                {o.title}
              </button>
            );
          })}
        </div>
        <p className="text-[12px] text-[var(--color-ash)] mt-3 max-w-[42ch]">
          {options.find((o) => o.id === activeId)?.note}
        </p>
      </div>
    </div>
  );
}

// the cutter's note, written in the margin
function Note({ text }: { text: string }) {
  return (
    <blockquote className="mt-6 max-w-[36ch] border-l border-[var(--color-brass)] pl-5">
      <span className="label block !text-[var(--color-brass)] mb-2">Master&apos;s note</span>
      <p className="font-[family-name:var(--font-display)] italic text-[clamp(16px,1.3vw,19px)] leading-[1.5] text-[var(--color-graphite)]">
        “{text}”
      </p>
    </blockquote>
  );
}