import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { TestimonialTrust } from "@/components/sections/TestimonialTrust";
import { UnifiedPlatform } from "@/components/sections/UnifiedPlatform";
import { FeatureBlock } from "@/components/sections/FeatureBlock";
import { ChannelsStrip } from "@/components/sections/ChannelsStrip";
import { WhyMetalLabs } from "@/components/sections/WhyMetalLabs";
import { FeaturedCaseStudy } from "@/components/sections/FeaturedCaseStudy";
import { TwoCaseCards } from "@/components/sections/TwoCaseCards";
import { StatsBar } from "@/components/sections/StatsBar";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="flex w-full flex-col">
      {/* 1 */ <AnnouncementBar />}
      {/* 2 */ <Navbar />}
      {/* 3 */ <Hero />}
      {/* 4 */ <TestimonialTrust />}
      {/* 5 */ <UnifiedPlatform />}
      {/* 6 */ <FeatureBlock />}
      {/* 7 */ <ChannelsStrip />}
      {/* 8 */ <WhyMetalLabs />}
      {/* 9 */ <FeaturedCaseStudy />}
      {/* 10 */ <TwoCaseCards />}
      {/* 11 */ <StatsBar />}
      {/* 12 */ <ClosingCTA />}
      {/* 13 */ <Footer />}
    </main>
  );
}
