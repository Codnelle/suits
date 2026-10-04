import type { Metadata } from "next";
import OrderFlow from "@/components/order/OrderFlow";

export const metadata: Metadata = {
  title: "Order Made to Measure — Shahee Suits",
  description:
    "Not in Bengaluru? Choose your cloth, enter your measurements, select your design and have a made-to-measure Shahee suit delivered to your door anywhere in India.",
};

export default function OrderPage() {
  return (
    <main>
      <OrderFlow />
    </main>
  );
}