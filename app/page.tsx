import Hero from "@/components/acts/Hero";
import AssemblyCanvas from "@/components/acts/AssemblyCanvas";
import Detail from "@/components/acts/Detail";
import FittingRoom from "@/components/acts/FittingRoom";
import ClothLibrary from "@/components/acts/ClothLibrary";
import Commission from "@/components/acts/Commission";
// import Process from "@/components/acts/Process"; // temporarily disabled
import Invitation from "@/components/acts/Invitation";
import Ledger from "@/components/acts/Ledger";
import Booking from "@/components/ui/Booking";

export default function Page() {
  return (
    <main>
      <Hero />
      <AssemblyCanvas />
      <Detail />
      <FittingRoom />
      <ClothLibrary />
      <Commission />
      {/* <Process /> */}
      <Invitation />
      <Ledger />
      <Booking />
    </main>
  );
}
