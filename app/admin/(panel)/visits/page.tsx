import { crm, VISIT_STATUSES, type Customer, type Visit } from "@/lib/crm";
import { setVisitStatus } from "../../actions";
import StatusSelect from "../../StatusSelect";
import { Board, Column, Contact, CustomerLink, Empty, Flash, PageHead, VISIT_LABEL, money, since, visitWhen } from "../../ui";

type Row = Visit & { customers: Pick<Customer, "id" | "name" | "phone" | "email"> };

// done columns only show the most recent, so the board stays readable
const DONE_LIMIT = 20;

export default async function Visits({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const db = crm()!;
  const { data } = await db
    .from("visits")
    .select("*, customers(id, name, phone, email)")
    .order("visit_date", { ascending: true, nullsFirst: false })
    .order("visit_time");
  const rows = (data ?? []) as Row[];

  return (
    <>
      <PageHead title={<>Home <em>visits</em></>} sub="Each booking from the site lands in Requested. Confirming a visit takes that window off Master G's diary." />
      <Flash error={error} />
      <Board>
        {VISIT_STATUSES.map((status) => {
          let col = rows.filter((r) => r.status === status);
          if (status === "delivered" || status === "cancelled") {
            col = col.sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, DONE_LIMIT);
          }
          return (
            <Column key={status} title={VISIT_LABEL[status]} count={rows.filter((r) => r.status === status).length}>
              {col.length ? (
                col.map((v) => (
                  <article key={v.id} className="rounded-[6px] border border-[var(--color-line)] bg-[#FBF9F6] p-4">
                    <CustomerLink id={v.customers.id} name={v.customers.name} />
                    <p className="text-[13px] text-[var(--color-bone)] mt-2">{visitWhen(v.visit_date, v.visit_time)}</p>
                    <p className="text-[12px] text-[var(--color-ash)] mt-1">
                      {v.zone} · {[v.address, v.pincode].filter(Boolean).join(", ") || "No address"}
                    </p>
                    {(v.occasion || v.cloth) && (
                      <p className="text-[12px] text-[var(--color-ash)] mt-1">{[v.occasion, v.cloth].filter(Boolean).join(" · ")}</p>
                    )}
                    <p className="text-[11px] text-[var(--color-ash)] mt-1">
                      {v.payment_id ? `Fee ${money(v.payment_amount)} paid` : "Fee unpaid"} · booked {since(v.created_at)}
                    </p>
                    <div className="mt-3"><Contact phone={v.customers.phone} email={null} /></div>
                    <div className="mt-3">
                      <StatusSelect action={setVisitStatus} id={v.id} value={v.status} options={VISIT_LABEL} back="/admin/visits" />
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
