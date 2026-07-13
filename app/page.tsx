import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { UnifiedPlatform } from "@/components/sections/UnifiedPlatform";
import { Solutions } from "@/components/sections/Solutions";
import { FeatureBlock } from "@/components/sections/FeatureBlock";
import { ChannelsStrip } from "@/components/sections/ChannelsStrip";
import { Omnichannel } from "@/components/sections/Omnichannel";
import { WhyMetalLabs } from "@/components/sections/WhyMetalLabs";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="flex w-full flex-col">
      {/* 1 */ <AnnouncementBar />}
      {/* 2 */ <Navbar />}
      {/* 3 */ <Hero />}
      {/* 4 */ <Omnichannel />}
      {/* 5 */ <UnifiedPlatform />}
      {/* 6 */ <FeatureBlock />}
      {/* 7 */ <Solutions />}
      {/* 8 */ <ChannelsStrip />}
      {/* 9 */ <WhyMetalLabs />}
      {/* 13 */ <ClosingCTA />}
      {/* 14 */ <Footer />}
    </main>
  );
}
