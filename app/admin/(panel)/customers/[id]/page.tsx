import Link from "next/link";
import { notFound } from "next/navigation";
import { copy } from "@/lib/copy";
import { crm, type Customer, type Note, type Order, type Visit } from "@/lib/crm";
import { addNote, setOrderStatus, setVisitStatus } from "../../../actions";
import StatusSelect from "../../../StatusSelect";
import { Contact, Empty, Flash, ORDER_LABEL, VISIT_LABEL, money, since, visitWhen } from "../../../ui";

const UUID = /^[0-9a-f-]{36}$/i;

export default async function CustomerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  if (!UUID.test(id)) notFound();

  const db = crm()!;
  const [c, v, o, n] = await Promise.all([
    db.from("customers").select("*").eq("id", id).maybeSingle(),
    db.from("visits").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
    db.from("orders").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
    db.from("notes").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
  ]);
  const customer = c.data as Customer | null;
  if (!customer) notFound();
  const visits = (v.data ?? []) as Visit[];
  const orders = (o.data ?? []) as Order[];
  const notes = (n.data ?? []) as Note[];
  const back = `/admin/customers/${id}`;
  const spent = orders.filter((x) => x.payment_id).reduce((s, x) => s + (x.payment_amount ?? 0), 0);

  const measured = copy.measure.fields.filter((f) => customer.measurements?.[f.id]);

  return (
    <>
      <Link href="/admin/customers" className="text-[12px] text-[var(--color-ash)] stitch-link">← All clients</Link>
      <div className="flex flex-wrap items-end justify-between gap-6 mt-4 mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(30px,3.4vw,46px)] leading-none text-[var(--color-bone)]">{customer.name}</h1>
          <div className="mt-3"><Contact phone={customer.phone} email={customer.email} /></div>
          <p className="text-[12px] text-[var(--color-ash)] mt-2">
            {[customer.address, customer.city, customer.state, customer.pincode].filter(Boolean).join(", ") || "No address yet"}
          </p>
        </div>
        <dl className="flex gap-8 text-right">
          <Fig n={String(visits.length)} label="visits" />
          <Fig n={String(orders.length)} label="orders" />
          <Fig n={money(spent)} label="paid online" />
          <Fig n={since(customer.created_at)} label="client since" />
        </dl>
      </div>
      <Flash error={error} />

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10">
        <div>
          <Block title="Home visits">
            {visits.length ? (
              <ul className="divide-y divide-[var(--color-line)]">
                {visits.map((x) => (
                  <li key={x.id} className="py-4 flex flex-wrap items-start justify-between gap-3">
                    <div className="text-[13px]">
                      <p className="text-[var(--color-bone)]">{visitWhen(x.visit_date, x.visit_time)} · {x.zone}</p>
                      <p className="text-[12px] text-[var(--color-ash)] mt-1">
                        {[x.address, x.pincode].filter(Boolean).join(", ")}
                        {x.occasion ? ` · ${x.occasion}` : ""}
                      </p>
                      {x.notes && <p className="text-[12px] text-[var(--color-ash)] mt-1 italic">“{x.notes}”</p>}
                      <p className="text-[11px] text-[var(--color-ash)] mt-1">
                        {x.payment_id ? `Fee ${money(x.payment_amount)} paid (${x.payment_id})` : "Fee unpaid"} · booked {since(x.created_at)}
                      </p>
                    </div>
                    <StatusSelect action={setVisitStatus} id={x.id} value={x.status} options={VISIT_LABEL} back={back} />
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No home visits.</Empty>
            )}
          </Block>

          <Block title="Orders">
            {orders.length ? (
              <ul className="divide-y divide-[var(--color-line)]">
                {orders.map((x) => (
                  <li key={x.id} className="py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="text-[13px]">
                        <p className="text-[var(--color-bone)]">{money(x.total)} · placed {since(x.created_at)}</p>
                        <p className="text-[11px] text-[var(--color-ash)] mt-1">
                          {x.payment_id ? `Paid ${money(x.payment_amount)} (${x.payment_id})` : "Not paid online"}
                          {" · "}{[x.address, x.city, x.state, x.pincode].filter(Boolean).join(", ")}
                        </p>
                      </div>
                      <StatusSelect action={setOrderStatus} id={x.id} value={x.status} options={ORDER_LABEL} back={back} />
                    </div>
                    <ul className="mt-3 flex flex-col gap-2">
                      {x.lines.map((l, i) => (
                        <li key={i} className="rounded-[4px] border border-[var(--color-line)] bg-white px-3 py-2 text-[12px]">
                          <p className="text-[var(--color-bone)]">{[l.fabric, l.house, l.blend].filter(Boolean).join(" · ")} — {money(l.price)}</p>
                          {l.configuration && (
                            <p className="text-[var(--color-ash)] mt-1">
                              {Object.entries(l.configuration)
                                .map(([group, choice]) =>
                                  copy.configure[group as keyof typeof copy.configure]?.find((opt) => opt.id === choice)?.title ?? choice
                                )
                                .join(" · ")}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No orders.</Empty>
            )}
          </Block>
        </div>

        <div>
          <Block title="Measurements">
            {measured.length ? (
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
                {measured.map((f) => (
                  <div key={f.id} className="flex justify-between border-b border-[var(--color-line)] py-1.5">
                    <dt className="text-[var(--color-ash)]">{f.label}</dt>
                    <dd className="tabular-nums text-[var(--color-bone)]">
                      {customer.measurements[f.id]}{f.id === "build" ? "" : ` ${copy.measure.unit}`}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <Empty>None on file. Measurements arrive with an order, or after Master G&apos;s visit.</Empty>
            )}
          </Block>

          <Block title="Notes">
            <form action={addNote} className="mb-4">
              <input type="hidden" name="customer_id" value={customer.id} />
              <input type="hidden" name="back" value={back} />
              <label htmlFor="note" className="sr-only">Add a note</label>
              <textarea
                id="note"
                name="body"
                rows={3}
                required
                placeholder="Preferences, fit notes, what was said on the phone…"
                className="w-full rounded-[4px] border border-[var(--color-line)] bg-white px-3 py-2 text-[13px] text-[var(--color-bone)] outline-none focus:border-[var(--color-bone)]"
              />
              <button className="pill !py-2 !px-4 !text-[13px] mt-2">Add <em>note</em></button>
            </form>
            {notes.length ? (
              <ul className="flex flex-col gap-3">
                {notes.map((x) => (
                  <li key={x.id} className="text-[13px]">
                    <p className="text-[var(--color-bone)] whitespace-pre-wrap">{x.body}</p>
                    <p className="text-[11px] text-[var(--color-ash)] mt-1">
                      {new Date(x.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No notes yet.</Empty>
            )}
          </Block>
        </div>
      </div>
    </>
  );
}

function Fig({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <dt className="font-[family-name:var(--font-display)] text-[22px] leading-none text-[var(--color-bone)]">{n}</dt>
      <dd className="text-[11px] text-[var(--color-ash)] mt-1">{label}</dd>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-[family-name:var(--font-display)] text-[19px] text-[var(--color-bone)] border-b border-[var(--color-line)] pb-2 mb-2">{title}</h2>
      {children}
    </section>
  );
}
