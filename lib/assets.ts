// Centralized asset paths - swap these in ONE place to replace Vapi reference imagery
// with real Metal Labs assets. Files live in /public/design (copied on-disk assets +
// CDN assets pulled by scripts/fetch-assets.mjs).

export const assets = {
  hero: {
    videoWebm: "/design/hero/metal-labs-hero.webm",
    videoMp4: "/design/hero/metal-labs-hero.mp4",
    poster: "/design/hero/metal-labs-hero-poster.jpg",
    ctaTexture: "/design/hero/cta-bg.jpeg", // closing CTA band
  },

  // Product "screenshots". TODO: replace with Metal Labs screenshots.
  product: {
    // Lottie animations that stand in as the platform/agents visuals (as on Vapi).
    agentsLottie: "/design/lottie/product-0.json", // §5 - "Agents" dashboard
    reschedulerLottie: "/design/lottie/product-1.json", // §6 - appointment rescheduler
    waveformIcon: "/design/logos/icon-waveform.svg",
    thermometerIcon: "/design/icons/thermometer.svg",
  },

  // §4 trust logo wall. TODO: replace with real US-lender logos.
  trustLogos: [
    "/design/logos/trust-0.svg",
    "/design/logos/trust-1.svg",
    "/design/logos/trust-2.svg",
    "/design/logos/trust-3.svg",
  ],
  quoteCompanyLogo: "/design/logos/quote-company.svg",

  // §7b omnichannel card icons (order matches content.omnichannel.cards). Ported from
  // the reference template's isometric vector set, recoloured to the mint accent; the
  // reference reuses the same art for cards 1 and 3, so we do too.
  omnichannelIcons: [
    "/design/icons/omnichannel-a.svg",
    "/design/icons/omnichannel-b.svg",
    "/design/icons/omnichannel-a.svg",
  ],

  // §8 icon-tile backgrounds - the reference template's blue silk art, reused in its own
  // repeating order (a, a, b, c, c, d) so the six tiles vary the same way the original does.
  enterpriseTiles: [
    "/design/tiles/tile-a.png",
    "/design/tiles/tile-a.png",
    "/design/tiles/tile-b.png",
    "/design/tiles/tile-c.png",
    "/design/tiles/tile-c.png",
    "/design/tiles/tile-d.png",
  ],

  // §8 enterprise-capability icons (order matches content.why.cells).
  enterpriseIcons: [
    "/design/icons/enterprise-0-headphone.svg",
    "/design/icons/enterprise-1-handshake.svg",
    "/design/icons/enterprise-2-lock.svg",
    "/design/icons/enterprise-3-trend-up.svg",
    "/design/icons/enterprise-4-select-area.png",
    "/design/icons/enterprise-5-shield-check.svg",
  ],

  // §12b compliance card icons (order matches content.compliance.cards). Pixel-art glyphs
  // lifted verbatim from the reference template's Compliance section and rendered as CSS
  // masks so they take the section's ink colour rather than shipping a baked-in fill.
  complianceIcons: [
    "/design/icons/compliance-0-check.svg",
    "/design/icons/compliance-1-lock.svg",
    "/design/icons/compliance-2-server.svg",
  ],

  // §9 featured case study (Kavak reference). TODO: replace with Metal Labs case study.
  featuredCase: {
    video: "/design/case/case-study-hero-video.webm",
    logo: "/design/case/hero-logo.svg",
  },

  // §10 two case-study cards. TODO: replace with Metal Labs case studies.
  caseCards: [
    { bg: "/design/case/card-0-bg.png", logo: "/design/case/card-0-logo.png" },
    { bg: "/design/case/card-1-bg.png", logo: "/design/case/card-1-logo.svg" },
  ],
} as const;

/**
 * One integration mark. `w`/`h` are the file's TRUE intrinsic pixel dimensions - they
 * drive both the optical-sizing math in IntegrationMarquee and the width/height attributes
 * that reserve layout box (no CLS). Read them off the file; never guess.
 */
export type IntegrationLogo = {
  name: string;
  src: string;
  w: number;
  h: number;
};

/**
 * §7 integration marks, keyed by content.integrations.categories[].id.
 *
 * `name` is the img alt text verbatim. Adding a logo is one line here - the grid
 * re-flows on its own, no layout work.
 *
 * Within each list the most recognizable marks lead, and the extreme-aspect outliers
 * (Arive 7.3:1, The Work Number 7.6:1) sit lower so a column never opens on a
 * hairline-thin wordmark.
 *
 * Every mark renders on a cream cell in its true brand colors. Marks are NEVER
 * recolored, inverted, or filtered - see req.md: using a logo outside its sanctioned
 * color rules is itself a trademark-usage violation, separate from whether the
 * integration exists.
 */
export const integrationLogos: Record<string, readonly IntegrationLogo[]> = {
  los: [
    { name: "ICE Mortgage Technology", src: "/design/integrations/los/ice-mortgage-technology.svg", w: 50, h: 50 },
    { name: "MeridianLink", src: "/design/integrations/los/meridianlink.svg", w: 844, h: 177 },
    { name: "nCino", src: "/design/integrations/los/ncino.svg", w: 93, h: 24 },
    { name: "LendingPad", src: "/design/integrations/los/lendingpad.webp", w: 2445, h: 570 },
    { name: "Mortgage Cadence", src: "/design/integrations/los/mortgage-cadence.png", w: 600, h: 190 },
    { name: "Arive", src: "/design/integrations/los/arive.png", w: 580, h: 80 },
    // BLOCKED - finastra.svg is the reverse (white) lockup: its only path is filled by a
    // gradient whose stops are both #fff, so it is invisible on a light cell. Re-download
    // the light-background variant from finastra.com, then uncomment.
    // { name: "Finastra", src: "/design/integrations/los/finastra.svg", w: 130, h: 19 },
  ],
  pos: [
    { name: "Cloudvirga", src: "/design/integrations/pos/cloudvirga.png", w: 1441, h: 300 },
    { name: "Floify", src: "/design/integrations/pos/floify.webp", w: 400, h: 167 },
    { name: "BeSmartee", src: "/design/integrations/pos/besmartee.svg", w: 137, h: 36 },
    { name: "Loanzify", src: "/design/integrations/pos/loanzify.png", w: 800, h: 219 },
    // BLOCKED - maxwell.svg is the reverse lockup: 7 of its 8 paths are fill="white"
    // (the 8th is the mint mark), so it renders as a blank cell. Re-download the
    // light-background variant from himaxwell.com, then uncomment.
    // { name: "Maxwell", src: "/design/integrations/pos/maxwell.svg", w: 1203, h: 216 },
  ],
  crm: [
    { name: "BNTouch", src: "/design/integrations/crm/bntouch.svg", w: 490, h: 84 },
    { name: "Bonzo", src: "/design/integrations/crm/bonzo.svg", w: 183, h: 58 },
    // Low-res source (200x55). Renders soft on 2x displays - request an SVG.
    { name: "Insellerate", src: "/design/integrations/crm/insellerate.png", w: 200, h: 55 },
    { name: "Usherpa", src: "/design/integrations/crm/usherpa.png", w: 1156, h: 221 },
  ],
  verification: [
    { name: "Snapdocs", src: "/design/integrations/verification/snapdocs.svg", w: 800, h: 109 },
    { name: "Truv", src: "/design/integrations/verification/truv.svg", w: 69, h: 25 },
    { name: "TrustEngine", src: "/design/integrations/verification/trustengine.webp", w: 1200, h: 250 },
    { name: "The Work Number", src: "/design/integrations/verification/the-work-number.png", w: 512, h: 67 },
  ],
  dialers: [
    { name: "Five9", src: "/design/integrations/dialers/five9.svg", w: 1205, h: 401 },
    { name: "Dialpad", src: "/design/integrations/dialers/dialpad.svg", w: 94, h: 33 },
    { name: "Convoso", src: "/design/integrations/dialers/convoso.webp", w: 640, h: 143 },
    { name: "Kixie", src: "/design/integrations/dialers/kixie.png", w: 1912, h: 703 },
    { name: "PhoneBurner", src: "/design/integrations/dialers/phoneburner.svg", w: 160, h: 40 },
  ],
};
