// Cloth swatch chip — a slightly rotated fabric square with a mono code
// beneath (W-1408 · 14OZ). Used for tags and small flourishes throughout.
export default function SwatchChip({
  hex,
  code,
  rotate = -4,
  tone = "dark",
  className = "",
}: {
  hex: string;
  code: string;
  rotate?: number;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span className={`inline-flex flex-col items-center gap-1.5 ${className}`}>
      <span
        className={`block w-9 h-9 rounded-[2px] border ${tone === "light" ? "border-white/50" : "border-[var(--color-line)]"}`}
        style={{ backgroundColor: hex, transform: `rotate(${rotate}deg)`, boxShadow: "0 6px 14px -8px rgba(20,22,26,0.5)" }}
        aria-hidden
      />
      <span className={`mono text-[9px] tracking-[0.16em] uppercase whitespace-nowrap ${tone === "light" ? "text-white/85" : "text-[var(--color-ash)]"}`}>{code}</span>
    </span>
  );
}
