// Centralized asset paths — swap these in ONE place to replace Vapi reference imagery
// with real Metal Labs assets. Files live in /public/design (copied on-disk assets +
// CDN assets pulled by scripts/fetch-assets.mjs).

export const assets = {
  hero: {
    videoWebm: "/design/hero/metal-labs-hero.webm",
    videoMp4: "/design/hero/metal-labs-hero.mp4",
    poster: "/design/hero/metal-labs-hero-poster.jpg",
    greenTexture: "/design/hero/green-texture.jpg", // closing CTA band
  },

  // Product "screenshots". TODO: replace with Metal Labs screenshots.
  product: {
    // Lottie animations that stand in as the platform/agents visuals (as on Vapi).
    agentsLottie: "/design/lottie/product-0.json", // §5 — "Agents" dashboard
    reschedulerLottie: "/design/lottie/product-1.json", // §6 — appointment rescheduler
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

  // §8 enterprise-capability icons (order matches content.why.cells).
  enterpriseIcons: [
    "/design/icons/enterprise-0-headphone.svg",
    "/design/icons/enterprise-1-handshake.svg",
    "/design/icons/enterprise-2-lock.svg",
    "/design/icons/enterprise-3-trend-up.svg",
    "/design/icons/enterprise-4-select-area.png",
    "/design/icons/enterprise-5-shield-check.svg",
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
