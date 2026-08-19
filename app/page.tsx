import Hero from "@/components/acts/Hero";
import AssemblyCanvas from "@/components/acts/AssemblyCanvas";
import DetailRail from "@/components/acts/DetailRail";
import Wearer from "@/components/acts/Wearer";
import ClothPicker from "@/components/acts/ClothPicker";
import Invitation from "@/components/acts/Invitation";
import Colophon from "@/components/acts/Colophon";
import Booking from "@/components/ui/Booking";

export default function Page() {
  return (
    <main>
      <Hero />
      <AssemblyCanvas />
      <DetailRail />
      <Wearer />
      <ClothPicker />
      <Invitation />
      <Colophon />
      <Booking />
    </main>
  );
}
