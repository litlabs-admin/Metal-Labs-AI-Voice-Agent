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

  // §7 integration/channel logos (top + bottom marquee rows).
  integrations: {
    top: Array.from({ length: 13 }, (_, i) => `/design/integrations/top-${i}.png`),
    bottom: Array.from({ length: 18 }, (_, i) => `/design/integrations/bottom-${i}.png`),
  },

  // §7 channel carousel - vector app icons that slide behind the Metal Labs hub tile.
  channels: {
    icons: [
      "/design/channels/hubspot.svg",
      "/design/channels/claude.svg",
      "/design/channels/salesforce.svg",
      "/design/channels/google-calendar.svg",
      "/design/channels/whatsapp.svg",
      "/design/channels/crm.svg",
    ],
  },

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
