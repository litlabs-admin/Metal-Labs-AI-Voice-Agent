import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { LeadCall } from "@/components/sections/LeadCall";
import { Solutions } from "@/components/sections/Solutions";
import { IntegrationsStrip } from "@/components/sections/IntegrationsStrip";
import { Omnichannel } from "@/components/sections/Omnichannel";
import { OldLeads } from "@/components/sections/OldLeads";
import { WhyMetalLabs } from "@/components/sections/WhyMetalLabs";
import { Compliance } from "@/components/sections/Compliance";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="flex w-full flex-col">
      {/* 2 */ <Navbar />}
      {/* 3 */ <Hero />}
      {/* 3b */ <LeadCall />}
      {/* 4 */ <Omnichannel />}
      {/* 4b */ <OldLeads />}
      {/* 7 */ <Solutions />}
      {/* 8 */ <IntegrationsStrip />}
      {/* 9 */ <WhyMetalLabs />}
      {/* 12b */ <Compliance />}
      {/* 12b2 */ <Pricing />}
      {/* 12c */ <FAQ />}
      {/* 13 */ <ClosingCTA />}
      {/* 14 */ <Footer />}
    </main>
  );
}
