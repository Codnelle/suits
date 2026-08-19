export default function ChapterRule({ n, label, right }: { n: string; label: string; right?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-t border-[var(--color-ash)]/20 pt-5 mb-14">
      <span className="label inline-flex items-baseline gap-[0.9em]">
        <span className="text-[var(--color-brass)]">{n}</span>
        <span>{label}</span>
      </span>
      {right && <span className="label !text-[var(--color-ash)]/55">{right}</span>}
    </div>
  );
}
