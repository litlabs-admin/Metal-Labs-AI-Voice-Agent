// Single source of truth for ALL Metal Labs homepage copy (verbatim from the brief).
// Bracketed [placeholder] strings are intentional and render as marked, swappable blocks.

export const brand = {
  name: "Metal Labs",
  tagline: "Every borrower conversation. Fully handled.",
} as const;

// §1 — Top announcement bar
export const announcement = {
  text: "Metal Labs handles every borrower conversation — from first lead call to final payment.",
  cta: "LEARN MORE",
} as const;

// §2 — Navigation
export const nav = {
  links: [
    { label: "Solutions", href: "#solutions" },
    { label: "Product", href: "#product" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "About", href: "#about" },
  ],
  cta: "Book a Demo",
} as const;

// §3 — Hero
export const hero = {
  headline: ["The only AI agent platform", "mortgage lenders will ever need."],
  cta: "Book a Demo",
  ctaSecondary: "Hear It Live",
  ctaSecondaryPending: "Connecting…",
  caption: "Built for US home lenders · Voice · Text · Email · TCPA compliant",
} as const;

// §4 — Featured testimonial + trust logos
export const testimonial = {
  // Bold spans are marked with **…** and rendered as <strong>.
  quote:
    "We were running three tools to do one job. With Metal Labs, **every inbound lead now gets contacted in seconds**, and our team finally works one platform instead of switching tabs. **Fewer applications stall, and fewer payments slip through the cracks.**",
  attribution: "[Attribution placeholder — Name, Title, Lender]",
  eyebrow: "TRUSTED BY US MORTGAGE LENDERS",
} as const;

// §5 — Unified platform
export const unified = {
  eyebrow: "ONE PLATFORM",
  headline: ["Built for the full", "borrower lifecycle."],
  subhead:
    "Two sides of your business, one platform. Metal Labs covers origination through servicing across every channel your borrowers actually use.",
  subFeature: {
    heading: "One agent. Every channel. Full context — always.",
    body:
      "Metal Labs agents work across voice, text, and email at once. Every conversation is remembered and every channel connected — so when a borrower calls after receiving a text, the agent picks up exactly where it left off.",
  },
} as const;

// §6 — Feature block
export const feature = {
  headline: ["Purpose-built agents for", "every step of the journey."],
  body:
    "Not a generic AI — agents trained on how mortgage actually works. From the first lead call to compliant collections, every agent is built for the exact conversation it handles.",
} as const;

// §7 — Channels strip (dark)
export const channels = {
  eyebrow: "EVERY CHANNEL",
  headline: ["Voice, text, and email", "connected by design."],
} as const;

// §4 — Omnichannel (eyebrow + scroll-revealed headline + 3 hover cards)
export const omnichannel = {
  // Not "Every Channel" — §7 ChannelsStrip already uses that label further down the page.
  eyebrow: "Omnichannel",
  headline: "One agent. Every channel. Full context, always.",
  subhead:
    "Metal Labs agents work across voice, text, and email simultaneously. Every conversation is remembered. Every channel is connected. When a borrower calls after receiving a text, the agent picks up exactly where it left off.",
  cards: [
    {
      kicker: "Voice",
      title: "Natural borrower calls",
      body: "Inbound and outbound. Local presence dialing. Warm transfers to LOs with full conversation context.",
    },
    {
      kicker: "Text",
      title: "SMS follow-ups that convert",
      body: "Document reminders, payment nudges, appointment confirmations. Delivered when borrowers actually respond.",
    },
    {
      kicker: "Email",
      title: "Automated outreach that doesn't feel automated",
      body: "Personalized emails triggered by borrower behavior, not a blast schedule. Every message in context.",
    },
  ],
} as const;

// §8 — Why Metal Labs (6-cell grid)
export const why = {
  eyebrow: "BUILT FOR MORTGAGE",
  headline: ["Why the best lenders", "choose Metal Labs."],
  subhead:
    "Everything a modern lender needs to run origination and servicing on one platform.",
  cells: [
    {
      label: "One platform. Not three.",
      body:
        "Origination and servicing in one place — one integration, one dashboard, one team to call. Stop stitching tools together.",
    },
    {
      label: "Built for mortgage.",
      body:
        "Every call flow, objection handler, and compliance guardrail is designed for home lending, not repurposed from a generic AI platform.",
    },
    {
      label: "Compliant by design.",
      body:
        "TCPA and FDCPA compliance built into every interaction. Every call logged, every conversation auditable.",
    },
    {
      label: "Full context, every channel.",
      body:
        "Voice, text, and email work as one. Every conversation is remembered, so the agent always picks up where it left off.",
    },
    {
      label: "Purpose-built agents.",
      body:
        "Agents for every step of the journey — from AI Loan Officer to AI Collections — trained on how mortgage actually works.",
    },
    {
      label: "Around-the-clock coverage.",
      body:
        "Inbound calls and texts handled 24/7. After-hours, weekends, and overflow — no lead left behind.",
    },
  ],
} as const;

// §9 — Featured case study
export const featuredCase = {
  logo: "[Customer logo placeholder]",
  category: "[Category label placeholder — e.g. leading US mortgage lender]",
  quote: "[Featured quote placeholder — 2–3 sentences, KAVAK-style]",
  attribution: "[Attribution placeholder — Name, Title]",
  button: "Watch the case study",
  tags: ["OUTBOUND CALLING", "INBOUND SUPPORT"],
} as const;

// §10 — Two case study cards
export const caseCards = [
  {
    logo: "[logo]",
    result: "[one-line result placeholder — speed-to-lead / applications recovered]",
    button: "Read the case study",
    tags: ["CONSUMER DIRECT"],
  },
  {
    logo: "[logo]",
    result: "[one-line result placeholder — payments collected / delinquency reduced]",
    button: "Read the case study",
    tags: ["SERVICING", "COLLECTIONS"],
  },
] as const;

// §11 — Outcomes / stats bar
export const stats = {
  headline: "Every Borrower Conversation. Fully Handled.",
  // Mock values for now. Numeric `value` animates a count-up; `value:null` renders `display` as-is.
  // TODO: replace with real metrics
  items: [
    { value: 8, suffix: "s", display: "8s", label: "speed-to-lead" },
    { value: 3, display: "3", label: "channels covered" },
    { value: null, display: "1M+", label: "calls handled" },
    { value: null, display: "24/7", label: "coverage" },
    { value: 100, suffix: "%", display: "100%", label: "borrower lifecycle" },
  ] as { value: number | null; display: string; label: string; suffix?: string }[],
} as const;

// §12 — Closing CTA
export const closing = {
  headline: "Your competitors are still dialing manually.",
  subline:
    "See how Metal Labs handles every borrower conversation — from first call to final payment — in a live demo.",
  buttons: ["Book a Demo", "Call Our Agent →"],
} as const;

// §13 — Footer content is inlined in components/sections/Footer.tsx (ported
// verbatim from the reference footer).
