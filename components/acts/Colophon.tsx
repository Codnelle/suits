import { copy } from "@/lib/copy";

export default function Colophon() {
  return (
    <footer className="bg-[var(--color-ink)] px-[clamp(20px,5vw,80px)] pt-16 pb-12">
      <div className="h-px bg-[var(--color-brass)]/40 mb-14" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl">
        {copy.colophon.columns.map((c) => (
          <div key={c.h}>
            <span className="label mb-5 block">{c.h}</span>
            {c.links.map((l) => (
              <a key={l} href="#" className="block text-[12px] text-[var(--color-ash)] py-1.5 hover:text-[var(--color-bone)] transition-colors">
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>
      <p className="text-[12px] text-[var(--color-ash)] mt-16">{copy.colophon.copyright}</p>
    </footer>
  );
}
