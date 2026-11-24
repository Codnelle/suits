import Link from "next/link";
import type { OrderStatus, VisitStatus } from "@/lib/crm";

export const VISIT_LABEL: Record<VisitStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  measured: "Measured",
  trial: "Trial",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_LABEL: Record<OrderStatus, string> = {
  placed: "Placed — unpaid",
  paid: "Paid",
  cutting: "In cutting",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const TONE: Record<string, string> = {
  requested: "#B8894B",
  placed: "#B8894B",
  confirmed: "#2F5D8A",
  paid: "#2F5D8A",
  measured: "#5B6B3A",
  cutting: "#5B6B3A",
  trial: "#7A4E8A",
  dispatched: "#7A4E8A",
  delivered: "#2E6B4F",
  cancelled: "#8B9099",
};

export function Badge({ status, label }: { status: string; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.06em] uppercase whitespace-nowrap"
      style={{ color: TONE[status] ?? "var(--color-ash)" }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: TONE[status] ?? "var(--color-ash)" }} />
      {label}
    </span>
  );
}

export const money = (n: number | null | undefined) => (n == null ? "—" : `₹${n.toLocaleString("en-IN")}`);

export function visitWhen(date: string | null, time: string | null) {
  if (!date) return time ? `Date not set · ${time}` : "Date not set";
  const d = new Date(`${date}T00:00:00`);
  const label = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  return time ? `${label} · ${time}` : label;
}

export const since = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** The day in Bengaluru, as YYYY-MM-DD. */
export const istToday = (offsetDays = 0) =>
  new Date(Date.now() + 330 * 60_000 + offsetDays * 86_400_000).toISOString().slice(0, 10);

const digits = (phone: string) => phone.replace(/[^\d]/g, "");
export function whatsapp(phone: string) {
  const d = digits(phone);
  return `https://wa.me/${d.length === 10 ? `91${d}` : d}`;
}

export function Contact({ phone, email }: { phone: string | null; email: string | null }) {
  return (
    <span className="inline-flex flex-wrap gap-x-3 gap-y-1 text-[12px]">
      {phone && (
        <>
          <a href={whatsapp(phone)} target="_blank" rel="noreferrer" className="stitch-link text-[#2E6B4F]">WhatsApp</a>
          <a href={`tel:${phone}`} className="stitch-link text-[var(--color-bone)]">{phone}</a>
        </>
      )}
      {email && <a href={`mailto:${email}`} className="stitch-link text-[var(--color-ash)]">{email}</a>}
    </span>
  );
}

const ERRORS: Record<string, string> = {
  clash: "Another visit is already confirmed for that window. Move one of them first.",
  save: "That change could not be saved. Try again.",
  status: "That status isn't one the CRM knows.",
};

export function Flash({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="mb-6 rounded-[4px] border border-[#9A4B3C]/30 bg-[#9A4B3C]/[0.06] px-4 py-3 text-[13px] text-[#9A4B3C]">
      {ERRORS[error] ?? "Something went wrong."}
    </p>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] text-[var(--color-ash)] py-6">{children}</p>;
}

export function PageHead({ title, sub, children }: { title: React.ReactNode; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,3vw,40px)] leading-none text-[var(--color-bone)]">{title}</h1>
        {sub && <p className="text-[13px] text-[var(--color-ash)] mt-2">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function CustomerLink({ id, name }: { id: string; name: string }) {
  return (
    <Link href={`/admin/customers/${id}`} className="font-[family-name:var(--font-display)] text-[17px] text-[var(--color-bone)] hover:underline underline-offset-4">
      {name}
    </Link>
  );
}

export function Board({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 snap-x" data-lenis-prevent>
      {children}
    </div>
  );
}

export function Column({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="flex-1 min-w-[200px] snap-start">
      <h2 className="flex items-baseline justify-between border-b border-[var(--color-line)] pb-2 mb-3">
        <span className="font-[family-name:var(--font-display)] text-[17px] text-[var(--color-bone)]">{title}</span>
        <span className="text-[12px] text-[var(--color-ash)] tabular-nums">{count}</span>
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
