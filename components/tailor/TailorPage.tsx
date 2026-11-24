"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { copy } from "@/lib/copy";
import { openBooking } from "@/lib/booking";
import type { Day } from "@/lib/slots";
import Reveal from "@/components/ui/Reveal";
import Words from "@/components/ui/Words";

type Diary = { open: number; days: Day[] };

/**
 * Master G's own page:
 *   1. the man — statement, portrait, how he works
 *   2. the visit — four photographs, one line each
 *   3. his diary — live windows from /api/slots, one tap opens the booking
 */
export default function TailorPage() {
  const t = copy.tailor;
  const zones = copy.booking.zones;

  return (
    <>
      {/* a quiet top row: home, and the one call to action */}
      <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-[clamp(20px,4vw,54px)] py-6">
        <Link href="/" aria-label={copy.hero.brand}>
          <img src="/media/shahee-logo.png" alt={copy.hero.brand} className="h-[18px] w-auto" />
        </Link>
        <a href="#diary" className="pill !py-2.5 !px-5 !text-[13px]">
          Book <em>a</em> WINDOW
        </a>
      </header>

      {/* 1 — the man */}
      <section className="relative bg-[var(--color-ink)] px-6 pt-[22vh] pb-[12vh] text-center">
        <p className="eyebrow mb-7"><Words parts={t.eyebrow} /></p>
        <h1 className="statement">
          <span className="block"><Words parts={t.line1} /></span>
          <span className="block"><Words parts={t.line2} /></span>
        </h1>
      </section>

      <section className="relative bg-[var(--color-ink)] px-[clamp(20px,5vw,80px)] pb-[18vh]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1.05fr_1fr] gap-[clamp(40px,7vw,120px)] items-center">
          <Reveal>
            <figure className="relative aspect-[4/5] overflow-hidden">
              <img src="/media/process-door.webp" alt="Master G at a client's door, swatch books under his arm" className="absolute inset-0 w-full h-full object-cover" />
            </figure>
          </Reveal>
          <div>
            <Reveal>
              <p className="lead max-w-[22ch]">{t.lead}</p>
            </Reveal>
            {t.body.map((para) => (
              <Reveal key={para.slice(0, 16)}>
                <p className="body-serif mt-7 max-w-[46ch] !text-[var(--color-bone)]/80">{para}</p>
              </Reveal>
            ))}
            <Reveal>
              <dl className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-[var(--color-line)]">
                {t.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="font-[family-name:var(--font-display)] text-[clamp(36px,4vw,56px)] leading-none text-[var(--color-bone)]">{f.n}</dt>
                    <dd className="body-serif !text-[13px] mt-2 !text-[var(--color-ash)]">{f.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2 — the visit */}
      <section className="relative bg-[var(--color-ink)] px-[clamp(20px,5vw,80px)] pb-[18vh]">
        <Reveal>
          <p className="eyebrow text-center mb-[8vh]"><Words parts={t.visitEyebrow} /></p>
        </Reveal>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {t.visit.map((v, i) => (
            <Reveal key={v.word}>
              <figure>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={`/media/${v.media}`} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                </div>
                <figcaption className="mt-5">
                  <p className="font-[family-name:var(--font-display)] text-[clamp(20px,1.7vw,26px)] text-[var(--color-bone)]">
                    <em className="text-[var(--color-ash)]">{`0${i + 1}`}</em> {v.word}
                  </p>
                  <p className="body-serif !text-[15px] mt-2 !text-[var(--color-bone)]/75">{v.line}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3 — his diary */}
      <section id="diary" className="relative bg-[var(--color-ink)] px-[clamp(20px,5vw,80px)] pb-[16vh] scroll-mt-10">
        <div className="text-center mb-12">
          <p className="eyebrow mb-6"><Words parts={t.diaryEyebrow} /></p>
          <h2 className="statement !text-[clamp(40px,6vw,96px)]"><Words parts={t.diaryLine} /></h2>
          <p className="body-serif max-w-[52ch] mx-auto mt-7 !text-[var(--color-bone)]/80">{t.diaryLead}</p>
        </div>
        <DiaryPicker zones={zones} />
        <p className="body-serif text-center !text-[13px] mt-10 !text-[var(--color-ash)]">{t.fee}</p>
      </section>

      {/* close */}
      <section className="relative bg-[var(--color-ink)] px-6 pb-[14vh] text-center">
        <p className="statement !text-[clamp(40px,6.4vw,104px)]">
          <span className="block"><Words parts={t.closeA} /></span>
          <span className="block"><Words parts={t.closeB} /></span>
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <button onClick={() => openBooking()} className="pill">
            Book <em>Master</em> G
          </button>
          <Link href="/order" className="body-serif !text-[14px] stitch-link">
            {copy.booking.notInBangalore}
          </Link>
        </div>
        <Link href="/" className="body-serif !text-[13px] stitch-link inline-block mt-16 !text-[var(--color-ash)]">
          ← Back to Shahee
        </Link>
      </section>
    </>
  );
}

function DiaryPicker({ zones }: { zones: typeof copy.booking.zones }) {
  const t = copy.tailor;
  const [zone, setZone] = useState<string>(zones[0].id);
  const [diary, setDiary] = useState<Diary | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    setDiary(null);
    setFailed(false);
    fetch(`/api/slots?zone=${zone}&days=14`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: Diary) => setDiary(d))
      .catch((e) => {
        if ((e as Error)?.name !== "AbortError") setFailed(true);
      });
    return () => ctrl.abort();
  }, [zone]);

  const active = zones.find((z) => z.id === zone)!;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Zone">
        {zones.map((z) => (
          <button
            key={z.id}
            type="button"
            role="tab"
            aria-selected={z.id === zone}
            onClick={() => setZone(z.id)}
            className="px-5 py-2.5 rounded-full border text-[13px] font-[family-name:var(--font-display)] transition-colors"
            style={z.id === zone
              ? { background: "var(--color-bone)", borderColor: "var(--color-bone)", color: "#fff" }
              : { borderColor: "var(--color-line)", color: "var(--color-bone)" }}
          >
            {z.name.charAt(0) + z.name.slice(1).toLowerCase()} <span className="opacity-60">· {z.areas}</span>
          </button>
        ))}
      </div>

      {failed && (
        <div className="text-center">
          <p className="body-serif !text-[15px] mb-6">{t.diaryError}</p>
          <button onClick={() => openBooking({ zone })} className="pill">Book <em>a</em> VISIT</button>
        </div>
      )}

      {!failed && !diary && (
        <div className="flex gap-3 overflow-hidden" aria-busy="true" aria-label="Loading Master G's diary">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="shrink-0 w-[150px] h-[300px] rounded-[4px] bg-[var(--color-bone)]/[0.04] animate-pulse" />
          ))}
        </div>
      )}

      {diary && diary.open === 0 && (
        <p className="body-serif text-center !text-[15px]">{t.diaryEmpty}</p>
      )}

      {diary && diary.open > 0 && (
        <div
          className="flex gap-3 overflow-x-auto pb-4 -mx-[clamp(20px,5vw,80px)] px-[clamp(20px,5vw,80px)] snap-x"
          style={{ scrollbarWidth: "none" }}
          data-lenis-prevent
        >
          {diary.days.map((d) => (
            <div key={d.date} className="shrink-0 w-[150px] snap-start">
              <p className="font-[family-name:var(--font-display)] text-[17px] text-[var(--color-bone)]">
                <em>{d.weekday}</em> {d.label.toUpperCase()}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {d.slots.map((s) => (
                  <li key={s.time}>
                    <button
                      type="button"
                      disabled={!s.open}
                      onClick={() => openBooking({ zone: active.id, date: d.date, time: s.time })}
                      aria-label={`${d.weekday} ${d.label}, ${s.time}${s.open ? "" : " — taken"}`}
                      className="w-full py-2.5 rounded-[4px] border text-[13px] tabular-nums transition-colors enabled:hover:bg-[var(--color-bone)] enabled:hover:text-white enabled:hover:border-[var(--color-bone)] disabled:cursor-not-allowed"
                      style={s.open
                        ? { borderColor: "var(--color-line)", background: "#FBF9F6", color: "var(--color-bone)" }
                        : { borderColor: "transparent", color: "var(--color-ash)", opacity: 0.35, textDecoration: "line-through" }}
                    >
                      {s.time}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
