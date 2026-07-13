import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Solutions } from "@/components/sections/Solutions";
import { ChannelsStrip } from "@/components/sections/ChannelsStrip";
import { Omnichannel } from "@/components/sections/Omnichannel";
import { WhyMetalLabs } from "@/components/sections/WhyMetalLabs";
import { Compliance } from "@/components/sections/Compliance";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="flex w-full flex-col">
      {/* 1 */ <AnnouncementBar />}
      {/* 2 */ <Navbar />}
      {/* 3 */ <Hero />}
      {/* 4 */ <Omnichannel />}
      {/* 7 */ <Solutions />}
      {/* 8 */ <ChannelsStrip />}
      {/* 9 */ <WhyMetalLabs />}
      {/* 12b */ <Compliance />}
      {/* 13 */ <ClosingCTA />}
      {/* 14 */ <Footer />}
    </main>
  );
}
