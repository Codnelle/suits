"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, SESSION_DAYS, createSession, passwordMatches, validSession } from "@/lib/admin-auth";
import { crm, ORDER_STATUSES, VISIT_STATUSES, type OrderStatus, type VisitStatus } from "@/lib/crm";

async function requireAdmin() {
  const jar = await cookies();
  if (!(await validSession(jar.get(SESSION_COOKIE)?.value))) redirect("/admin/login");
  const db = crm();
  if (!db) throw new Error("The CRM is not configured: set SUPABASE_URL and SUPABASE_SECRET_KEY.");
  return db;
}

// only ever send the browser back inside /admin
const back = (form: FormData, fallback: string) => {
  const to = String(form.get("back") ?? "");
  return to.startsWith("/admin") ? to : fallback;
};

const withFlag = (path: string, key: string, value: string) =>
  `${path}${path.includes("?") ? "&" : "?"}${key}=${encodeURIComponent(value)}`;

export async function login(form: FormData) {
  const next = String(form.get("next") ?? "/admin");
  const safeNext = next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin";
  if (!(await passwordMatches(String(form.get("password") ?? "")))) {
    await new Promise((r) => setTimeout(r, 700)); // slow down guessing
    redirect(`/admin/login?error=1&next=${encodeURIComponent(safeNext)}`);
  }
  const token = await createSession();
  if (!token) redirect("/admin/login?error=setup");
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_DAYS * 86_400,
  });
  redirect(safeNext);
}

export async function logout() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

export async function setVisitStatus(form: FormData) {
  const db = await requireAdmin();
  const id = String(form.get("id"));
  const status = String(form.get("status")) as VisitStatus;
  const to = back(form, "/admin/visits");
  if (!VISIT_STATUSES.includes(status)) redirect(withFlag(to, "error", "status"));

  // one Master G: only one visit can be confirmed for a window
  if (status === "confirmed") {
    const { data: visit } = await db.from("visits").select("visit_date, visit_time").eq("id", id).single();
    if (visit?.visit_date && visit.visit_time) {
      const { data: clash } = await db
        .from("visits")
        .select("id")
        .eq("visit_date", visit.visit_date)
        .eq("visit_time", visit.visit_time)
        .eq("status", "confirmed")
        .neq("id", id)
        .limit(1);
      if (clash?.length) redirect(withFlag(to, "error", "clash"));
    }
  }

  const { error } = await db.from("visits").update({ status }).eq("id", id);
  if (error) redirect(withFlag(to, "error", "save"));
  revalidatePath("/admin", "layout");
  redirect(to);
}

export async function setOrderStatus(form: FormData) {
  const db = await requireAdmin();
  const id = String(form.get("id"));
  const status = String(form.get("status")) as OrderStatus;
  const to = back(form, "/admin/orders");
  if (!ORDER_STATUSES.includes(status)) redirect(withFlag(to, "error", "status"));
  const { error } = await db.from("orders").update({ status }).eq("id", id);
  if (error) redirect(withFlag(to, "error", "save"));
  revalidatePath("/admin", "layout");
  redirect(to);
}

export async function addNote(form: FormData) {
  const db = await requireAdmin();
  const customerId = String(form.get("customer_id"));
  const body = String(form.get("body") ?? "").trim().slice(0, 4000);
  const to = back(form, `/admin/customers/${customerId}`);
  if (!body) redirect(to);
  const { error } = await db.from("notes").insert({ customer_id: customerId, body });
  if (error) redirect(withFlag(to, "error", "save"));
  revalidatePath(`/admin/customers/${customerId}`);
  redirect(to);
}
