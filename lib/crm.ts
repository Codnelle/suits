import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// The Shahee CRM lives in Supabase. Only the server talks to it, with the
// secret key; the tables have row-level security on and no policies, so the
// public key can read nothing.

export const VISIT_STATUSES = ["requested", "confirmed", "measured", "trial", "delivered", "cancelled"] as const;
export const ORDER_STATUSES = ["placed", "paid", "cutting", "dispatched", "delivered", "cancelled"] as const;
export type VisitStatus = (typeof VISIT_STATUSES)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];

// a visit in one of these states still holds Master G's window
export const HOLDING: VisitStatus[] = ["requested", "confirmed"];

export type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  measurements: Record<string, string>;
  created_at: string;
  updated_at: string;
};

export type Visit = {
  id: string;
  customer_id: string;
  status: VisitStatus;
  zone: string | null;
  areas: string | null;
  visit_date: string | null;
  visit_time: string | null;
  address: string | null;
  pincode: string | null;
  occasion: string | null;
  cloth: string | null;
  notes: string | null;
  payment_id: string | null;
  payment_amount: number | null;
  created_at: string;
  updated_at: string;
};

export type OrderLine = {
  fabric?: string;
  house?: string;
  blend?: string;
  price?: number;
  configuration?: Record<string, string>;
  measurements?: Record<string, string>;
};

export type Order = {
  id: string;
  customer_id: string;
  status: OrderStatus;
  total: number | null;
  lines: OrderLine[];
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  notes: string | null;
  payment_id: string | null;
  payment_amount: number | null;
  created_at: string;
  updated_at: string;
};

export type Note = {
  id: string;
  customer_id: string;
  visit_id: string | null;
  order_id: string | null;
  body: string;
  created_at: string;
};

let client: SupabaseClient | null | undefined;

/** The server's Supabase client, or null when the CRM isn't configured. */
export function crm(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return client;
}

const blank = (v?: string | null) => (v && v.trim() ? v.trim() : null);

/**
 * Find the customer by email (else phone) and fill in anything new, or create
 * them. Measurements merge, so a later order never wipes an earlier one.
 */
export async function upsertCustomer(
  db: SupabaseClient,
  c: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    measurements?: Record<string, string>;
  }
): Promise<string> {
  const email = blank(c.email)?.toLowerCase() ?? null;
  const phone = blank(c.phone);

  let existing: Customer | null = null;
  if (email) {
    const { data } = await db.from("customers").select("*").eq("email", email).maybeSingle();
    existing = data as Customer | null;
  }
  if (!existing && phone) {
    const { data } = await db.from("customers").select("*").eq("phone", phone).limit(1).maybeSingle();
    existing = data as Customer | null;
  }

  const fields = {
    name: c.name.trim(),
    email,
    phone,
    address: blank(c.address),
    city: blank(c.city),
    state: blank(c.state),
    pincode: blank(c.pincode),
  };

  if (existing) {
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fields)) if (v) patch[k] = v;
    const measured = Object.fromEntries(Object.entries(c.measurements ?? {}).filter(([, v]) => blank(v)));
    if (Object.keys(measured).length) patch.measurements = { ...existing.measurements, ...measured };
    const { error } = await db.from("customers").update(patch).eq("id", existing.id);
    if (error) throw error;
    return existing.id;
  }

  const { data, error } = await db
    .from("customers")
    .insert({ ...fields, measurements: c.measurements ?? {} })
    .select("id")
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
}

/** "YYYY-MM-DD HH:MM" for every future visit still holding Master G's diary. */
export async function heldWindows(db: SupabaseClient): Promise<string[]> {
  const today = new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10);
  const { data, error } = await db
    .from("visits")
    .select("visit_date, visit_time")
    .in("status", HOLDING)
    .gte("visit_date", today);
  if (error) throw error;
  return (data ?? [])
    .filter((v) => v.visit_date && v.visit_time)
    .map((v) => `${v.visit_date} ${v.visit_time}`);
}
