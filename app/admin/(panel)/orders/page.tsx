import { crm, ORDER_STATUSES, type Customer, type Order } from "@/lib/crm";
import { setOrderStatus } from "../../actions";
import StatusSelect from "../../StatusSelect";
import { Board, Column, Contact, CustomerLink, Empty, Flash, ORDER_LABEL, PageHead, money, since } from "../../ui";

type Row = Order & { customers: Pick<Customer, "id" | "name" | "phone" | "email"> };

const DONE_LIMIT = 20;

export default async function Orders({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const db = crm()!;
  const { data } = await db.from("orders").select("*, customers(id, name, phone, email)").order("created_at");
  const rows = (data ?? []) as Row[];

  return (
    <>
      <PageHead title={<>Orders <em>from</em> AFAR</>} sub="Made-to-measure orders placed on /order, with the customer's own measurements." />
      <Flash error={error} />
      <Board>
        {ORDER_STATUSES.map((status) => {
          let col = rows.filter((r) => r.status === status);
          if (status === "delivered" || status === "cancelled") {
            col = col.sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, DONE_LIMIT);
          }
          return (
            <Column key={status} title={ORDER_LABEL[status]} count={rows.filter((r) => r.status === status).length}>
              {col.length ? (
                col.map((o) => (
                  <article key={o.id} className="rounded-[6px] border border-[var(--color-line)] bg-[#FBF9F6] p-4">
                    <CustomerLink id={o.customers.id} name={o.customers.name} />
                    <p className="text-[13px] text-[var(--color-bone)] mt-2">
                      {money(o.total)} · {o.lines.length} suit{o.lines.length === 1 ? "" : "s"}
                    </p>
                    <ul className="mt-1">
                      {o.lines.map((l, i) => (
                        <li key={i} className="text-[12px] text-[var(--color-ash)]">{[l.fabric, l.house].filter(Boolean).join(" — ")}</li>
                      ))}
                    </ul>
                    <p className="text-[12px] text-[var(--color-ash)] mt-1">{[o.city, o.state, o.pincode].filter(Boolean).join(", ")}</p>
                    <p className="text-[11px] text-[var(--color-ash)] mt-1">
                      {o.payment_id ? `Paid ${money(o.payment_amount)}` : "Not paid online"} · placed {since(o.created_at)}
                    </p>
                    <div className="mt-3"><Contact phone={o.customers.phone} email={null} /></div>
                    <div className="mt-3">
                      <StatusSelect action={setOrderStatus} id={o.id} value={o.status} options={ORDER_LABEL} back="/admin/orders" />
                    </div>
                  </article>
                ))
              ) : (
                <Empty>None.</Empty>
              )}
            </Column>
          );
        })}
      </Board>
    </>
  );
}
