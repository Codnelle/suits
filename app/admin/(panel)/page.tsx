import Link from "next/link";
import { crm, type Customer, type Order, type Visit } from "@/lib/crm";
import { setVisitStatus } from "../actions";
import StatusSelect from "../StatusSelect";
import { Badge, Contact, CustomerLink, Empty, Flash, ORDER_LABEL, PageHead, VISIT_LABEL, istToday, money, visitWhen } from "../ui";

type VisitRow = Visit & { customers: Pick<Customer, "id" | "name" | "phone" | "email"> };
type OrderRow = Order & { customers: Pick<Customer, "id" | "name" | "phone" | "email"> };

export default async function Today({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const db = crm()!;
  const today = istToday();
  const weekOut = istToday(7);

  const [upcoming, waiting, orders] = await Promise.all([
    db
      .from("visits")
      .select("*, customers(id, name, phone, email)")
      .in("status", ["requested", "confirmed", "measured", "trial"])
      .gte("visit_date", today)
      .lte("visit_date", weekOut)
      .order("visit_date")
      .order("visit_time"),
    db.from("visits").select("*, customers(id, name, phone, email)").eq("status", "requested").order("created_at"),
    db
      .from("orders")
      .select("*, customers(id, name, phone, email)")
      .in("status", ["placed", "paid", "cutting"])
      .order("created_at"),
  ]);

  const visits = (upcoming.data ?? []) as VisitRow[];
  const todays = visits.filter((v) => v.visit_date === today);
  // requests are listed on their own, so the week shows only what's settled
  const later = visits.filter((v) => v.visit_date !== today && v.status !== "requested");
  const requests = (waiting.data ?? []) as VisitRow[];
  const open = (orders.data ?? []) as OrderRow[];

  const when = new Date(`${today}T00:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <>
      <PageHead title={<><em>the</em> DAY</>} sub={when} />
      <Flash error={error} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        <Stat n={todays.length} label="visits today" />
        <Stat n={requests.length} label="requests to confirm" tone={requests.length ? "#B8894B" : undefined} />
        <Stat n={later.length} label="confirmed this week" />
        <Stat n={open.length} label="orders in progress" />
      </div>

      <Section title="Today's visits">
        {todays.length ? <VisitList rows={todays} back="/admin" /> : <Empty>No visits today.</Empty>}
      </Section>

      <Section title="Waiting for confirmation" link={{ href: "/admin/visits", label: "All visits" }}>
        {requests.length ? <VisitList rows={requests} back="/admin" /> : <Empty>Every request has been answered.</Empty>}
      </Section>

      <Section title="The rest of the week">
        {later.length ? <VisitList rows={later} back="/admin" /> : <Empty>Nothing else confirmed for the next seven days.</Empty>}
      </Section>

      <Section title="Orders in progress" link={{ href: "/admin/orders", label: "All orders" }}>
        {open.length ? (
          <ul className="divide-y divide-[var(--color-line)]">
            {open.map((o) => (
              <li key={o.id} className="py-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CustomerLink id={o.customers.id} name={o.customers.name} />
                  <p className="text-[12px] text-[var(--color-ash)] mt-1">
                    {o.lines.length} suit{o.lines.length === 1 ? "" : "s"} · {money(o.total)} · {[o.city, o.state].filter(Boolean).join(", ")}
                  </p>
                </div>
                <Badge status={o.status} label={ORDER_LABEL[o.status]} />
              </li>
            ))}
          </ul>
        ) : (
          <Empty>No orders waiting on the workshop.</Empty>
        )}
      </Section>
    </>
  );
}

function Stat({ n, label, tone }: { n: number; label: string; tone?: string }) {
  return (
    <div className="rounded-[6px] border border-[var(--color-line)] bg-[#FBF9F6] px-5 py-4">
      <p className="font-[family-name:var(--font-display)] text-[36px] leading-none" style={{ color: tone ?? "var(--color-bone)" }}>{n}</p>
      <p className="text-[12px] text-[var(--color-ash)] mt-2">{label}</p>
    </div>
  );
}

function Section({ title, link, children }: { title: string; link?: { href: string; label: string }; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="flex items-baseline justify-between border-b border-[var(--color-line)] pb-3 mb-1">
        <h2 className="font-[family-name:var(--font-display)] text-[20px] text-[var(--color-bone)]">{title}</h2>
        {link && <Link href={link.href} className="text-[12px] text-[var(--color-ash)] stitch-link">{link.label} →</Link>}
      </div>
      {children}
    </section>
  );
}

function VisitList({ rows, back }: { rows: VisitRow[]; back: string }) {
  return (
    <ul className="divide-y divide-[var(--color-line)]">
      {rows.map((v) => (
        <li key={v.id} className="py-4 grid md:grid-cols-[1.2fr_1.4fr_auto] gap-3 items-center">
          <div>
            <CustomerLink id={v.customers.id} name={v.customers.name} />
            <div className="mt-1"><Contact phone={v.customers.phone} email={v.customers.email} /></div>
          </div>
          <div className="text-[13px] text-[var(--color-bone)]">
            <p>{visitWhen(v.visit_date, v.visit_time)} · {v.zone}</p>
            <p className="text-[12px] text-[var(--color-ash)] mt-1">
              {[v.address, v.pincode].filter(Boolean).join(", ")}
              {v.occasion ? ` · ${v.occasion}` : ""}
              {v.payment_id ? ` · fee paid` : " · fee unpaid"}
            </p>
          </div>
          <StatusSelect action={setVisitStatus} id={v.id} value={v.status} options={VISIT_LABEL} back={back} />
        </li>
      ))}
    </ul>
  );
}
