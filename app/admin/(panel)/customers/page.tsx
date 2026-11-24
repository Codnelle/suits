import { crm, type Customer } from "@/lib/crm";
import { Contact, CustomerLink, Empty, PageHead, since } from "../../ui";

type Row = Customer & { visits: { count: number }[]; orders: { count: number }[] };

export default async function Customers({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  // PostgREST filter syntax uses , ( ) and * — keep them out of the search term
  const term = q.replace(/[,()*%\\]/g, " ").trim().slice(0, 80);

  const db = crm()!;
  let query = db
    .from("customers")
    .select("*, visits(count), orders(count)")
    .order("updated_at", { ascending: false })
    .limit(200);
  if (term) query = query.or(`name.ilike.*${term}*,email.ilike.*${term}*,phone.ilike.*${term}*,pincode.ilike.*${term}*`);
  const { data } = await query;
  const rows = (data ?? []) as Row[];

  return (
    <>
      <PageHead title={<>The <em>clients</em></>} sub="Everyone who has booked a visit or placed an order, most recent first.">
        <form className="flex gap-2" role="search">
          <label htmlFor="q" className="sr-only">Search customers</label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Name, phone, email or pincode"
            className="w-[260px] rounded-[4px] border border-[var(--color-line)] bg-white px-3 py-2 text-[13px] text-[var(--color-bone)] outline-none focus:border-[var(--color-bone)]"
          />
          <button className="pill !py-2 !px-4 !text-[13px]">Search</button>
        </form>
      </PageHead>

      {rows.length ? (
        <div className="overflow-x-auto" data-lenis-prevent>
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--color-line)] text-[11px] uppercase tracking-[0.1em] text-[var(--color-ash)]">
                <th className="py-3 pr-4 font-normal">Client</th>
                <th className="py-3 pr-4 font-normal">Contact</th>
                <th className="py-3 pr-4 font-normal">Where</th>
                <th className="py-3 pr-4 font-normal text-right">Visits</th>
                <th className="py-3 pr-4 font-normal text-right">Orders</th>
                <th className="py-3 font-normal">Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {rows.map((c) => (
                <tr key={c.id} className="align-top">
                  <td className="py-4 pr-4"><CustomerLink id={c.id} name={c.name} /></td>
                  <td className="py-4 pr-4"><Contact phone={c.phone} email={c.email} /></td>
                  <td className="py-4 pr-4 text-[var(--color-ash)]">{[c.city, c.pincode].filter(Boolean).join(" · ") || "—"}</td>
                  <td className="py-4 pr-4 text-right tabular-nums">{c.visits[0]?.count ?? 0}</td>
                  <td className="py-4 pr-4 text-right tabular-nums">{c.orders[0]?.count ?? 0}</td>
                  <td className="py-4 text-[var(--color-ash)] whitespace-nowrap">{since(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty>{term ? `No one matches “${term}”.` : "No customers yet. They appear here with their first booking or order."}</Empty>
      )}
    </>
  );
}
