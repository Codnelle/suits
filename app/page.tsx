import Hero from "@/components/acts/Hero";
import AssemblyCanvas from "@/components/acts/AssemblyCanvas";
import FittingRoom from "@/components/acts/FittingRoom";
import ClothLibrary from "@/components/acts/ClothLibrary";
import Detail from "@/components/acts/Detail";
import About from "@/components/acts/About";
import Ledger from "@/components/acts/Ledger";
import Booking from "@/components/ui/Booking";

export default function Page() {
  return (
    <main>
      <Hero />
      <AssemblyCanvas />
      <FittingRoom />
      <ClothLibrary />
      <Detail />
      <About />
      <Ledger />
      <Booking />
    </main>
  );
}