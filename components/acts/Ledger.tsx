"use client";

import { copy } from "@/lib/copy";
import Reveal from "@/components/ui/Reveal";

// The Ledger — a living archive footer: house links, the journal, the ateliers.
export default function Ledger() {
  const { columns, journal, edition, copyright } = copy.colophon;
  const ateliers = copy.invitation.ateliers;

  return (
    <footer className="bg-[var(--color-ink)] px-[clamp(20px,5vw,80px)] pt-20 pb-12">
      <hr className="stitch-rule mb-16" />

      <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl">
        {/* the house */}
        <div>
          <span className="label mb-6 block">The House</span>
          {columns[0].links.map((l) => (
            <a key={l} href="#" className="stitch-link block w-fit text-[12px] text-[var(--color-ash)] py-1.5 hover:text-[var(--color-bone)] transition-colors">{l}</a>
          ))}
          <span className="label mb-5 block mt-8">The Craft</span>
          {columns[1].links.map((l) => (
            <a key={l} href="#" className="stitch-link block w-fit text-[12px] text-[var(--color-ash)] py-1.5 hover:text-[var(--color-bone)] transition-colors">{l}</a>
          ))}
        </div>

        {/* the journal */}
        <div>
          <span className="label mb-6 block">The Journal</span>
          {journal.map((j) => (
            <a key={j.slug} href="#" className="group block py-3 border-b border-[var(--color-ash)]/10 hover:border-[var(--color-brass)]/40 transition-colors">
              <p className="text-[13px] text-[var(--color-bone)] group-hover:text-[var(--color-brass)] transition-colors">{j.title}</p>
              <p className="text-[12px] text-[var(--color-ash)] mt-1">{j.excerpt}</p>
              <p className="label !tracking-[0.16em] mt-2">{j.date} · {j.author}</p>
            </a>
          ))}
        </div>

        {/* visit */}
        <div>
          <span className="label mb-6 block">Visit</span>
          {ateliers.map((a) => (
            <div key={a.city} className="py-3 border-b border-[var(--color-ash)]/10">
              <p className="text-[13px] text-[var(--color-bone)]">{a.city} — {a.address}</p>
              <p className="text-[12px] text-[var(--color-ash)] mt-1">{a.cutter} · {a.tenure}</p>
              <a href={`mailto:${a.email}`} className="stitch-link inline-block text-[12px] text-[var(--color-brass)] transition-colors">{a.email}</a>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-16 pt-8 border-t border-[var(--color-ash)]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-[12px] text-[var(--color-ash)]">{copyright}</p>
        <p className="text-[11px] text-[var(--color-ash)]/70 max-w-md">{edition}</p>
      </div>
    </footer>
  );
}
