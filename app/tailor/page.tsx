import type { Metadata } from "next";
import TailorPage from "@/components/tailor/TailorPage";
import Booking from "@/components/ui/Booking";

export const metadata: Metadata = {
  title: "Master G — Shahee Suits",
  description:
    "Master G, Shahee's tailor of thirty years, comes to your home in Bengaluru with the full cloth catalogue and his measuring kit. Pick an open window from his diary.",
};

export default function Tailor() {
  return (
    <main>
      <TailorPage />
      <Booking />
    </main>
  );
}
