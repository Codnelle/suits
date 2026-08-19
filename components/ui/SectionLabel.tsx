export default function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <span className="label inline-flex items-baseline gap-[0.7em]">
      <span>{n}</span>
      <span className="w-6 h-px bg-[var(--color-brass)] opacity-60 translate-y-[-3px]" aria-hidden />
      <span>{children}</span>
    </span>
  );
}
