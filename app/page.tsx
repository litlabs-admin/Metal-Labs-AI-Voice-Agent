import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Solutions } from "@/components/sections/Solutions";
import { IntegrationsStrip } from "@/components/sections/IntegrationsStrip";
import { Omnichannel } from "@/components/sections/Omnichannel";
import { WhyMetalLabs } from "@/components/sections/WhyMetalLabs";
import { Compliance } from "@/components/sections/Compliance";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="flex w-full flex-col">
      {/* 2 */ <Navbar />}
      {/* 3 */ <Hero />}
      {/* 4 */ <Omnichannel />}
      {/* 7 */ <Solutions />}
      {/* 8 */ <IntegrationsStrip />}
      {/* 9 */ <WhyMetalLabs />}
      {/* 12b */ <Compliance />}
      {/* 13 */ <ClosingCTA />}
      {/* 14 */ <Footer />}
    </main>
  );
}
