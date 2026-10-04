export type PayResult = {
  status: "paid" | "dismissed" | "unconfigured";
  paymentId?: string;
  orderId?: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color: string };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

let loader: Promise<boolean> | null = null;

export function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (loader) return loader;
  loader = new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-ra="1"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.dataset.ra = "1";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
  return loader;
}

export async function payWithRazorpay(opts: {
  amount: number;
  receipt: string;
  description: string;
  prefill?: RazorpayOptions["prefill"];
  notes?: Record<string, string>;
  onSuccess: (r: { paymentId: string; orderId: string }) => void;
  onDismiss?: () => void;
}): Promise<PayResult> {
  const res = await fetch("/api/razorpay/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: opts.amount, receipt: opts.receipt, notes: opts.notes }),
  });

  if (!res.ok) return { status: "unconfigured" };
  const data = (await res.json()) as {
    configured: boolean;
    orderId?: string;
    key?: string;
    amount?: number;
    currency?: string;
  };

  if (!data.configured || !data.orderId || !data.key) return { status: "unconfigured" };
  const orderId = data.orderId;
  const key = data.key;
  const amount = data.amount ?? opts.amount;
  const currency = data.currency ?? "INR";

  if (!(await loadRazorpay()) || !window.Razorpay) return { status: "unconfigured" };

  return new Promise<PayResult>((resolve) => {
    let settled = false;
    const done = (result: PayResult) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const rzp = new window.Razorpay!({
      key,
      amount,
      currency,
      name: "Shahee Suits",
      description: opts.description,
      order_id: orderId,
      prefill: opts.prefill,
      notes: opts.notes ?? undefined,
      theme: { color: "#B8894B" },
      handler: (response) => {
        opts.onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
        });
        done({ status: "paid", paymentId: response.razorpay_payment_id, orderId: response.razorpay_order_id });
      },
      modal: {
        ondismiss: () => {
          opts.onDismiss?.();
          done({ status: "dismissed" });
        },
      },
    });

    rzp.open();
  });
}