import { NextResponse } from "next/server";

export const runtime = "nodejs";

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: Request) {
  let body: { amount?: number; receipt?: string; notes?: Record<string, string> } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const amount = Math.round(Number(body.amount));
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  if (!KEY_ID || !KEY_SECRET) {
    return NextResponse.json({ configured: false });
  }

  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");

  try {
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: body.receipt ?? `shahee_${Date.now()}`,
        notes: { source: "shahee.in", ...(body.notes ?? {}) },
        payment_capture: 1,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ configured: true, error: "Razorpay declined" }, { status: 502 });
    }

    const order = (await res.json()) as { id: string; amount: number; currency: string };
    return NextResponse.json({
      configured: true,
      orderId: order.id,
      key: KEY_ID,
      amount: order.amount,
      currency: order.currency,
    });
  } catch {
    return NextResponse.json({ configured: true, error: "Razorpay unreachable" }, { status: 502 });
  }
}