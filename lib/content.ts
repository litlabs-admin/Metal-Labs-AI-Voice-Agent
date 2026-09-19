// Single source of truth for ALL Metal Labs homepage copy (verbatim from the brief).
// Bracketed [placeholder] strings are intentional and render as marked, swappable blocks.

export const brand = {
  name: "Metal Labs",
  tagline: "Every borrower conversation. Fully handled.",
} as const;

// Cal.com scheduling link for all "Book a Demo" CTAs.
export const CAL_LINK = "https://cal.com/vandan-metallabs/30min";

// Canonical origin, used as metadataBase so relative canonical/OG URLs resolve
// to absolute ones. NEXT_PUBLIC_ because it is a public URL, not a secret.
// Trailing slashes are stripped so `${SITE_URL}/blog/x` can never double up.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/+$/, "");

// §1 - Top announcement bar
export const announcement = {
  text: "Metal Labs handles every borrower conversation, from first lead call to final payment.",
  cta: "LEARN MORE",
} as const;

// §2 - Navigation
// Hrefs are root-relative ("/#x", not "#x") so they resolve to the homepage
// section from any route. A bare "#x" resolves against the CURRENT path, so
// from /blog/a-post it would point at /blog/a-post#omnichannel and go nowhere.
// On the homepage these still behave as same-document fragment links, so the
// smooth scroll from globals.css is unaffected.
export const nav = {
  links: [
    { label: "Omnichannel", href: "/#omnichannel" },
    { label: "Solutions", href: "/#solutions" },
    { label: "Use Cases", href: "/#use-cases" },
    { label: "Compliance", href: "/#compliance" },
    { label: "Blog", href: "/blog" },
  ],
  cta: "Book a Demo",
} as const;

// §15 - Blog (content itself comes from Airtable; this is only the page chrome)
export const blog = {
  eyebrow: "Blog",
  // Only rendered when Airtable returns nothing - the listing's <h1> is
  // normally the featured post's own title.
  title: "Insights on AI for mortgage lending.",
  allTitle: "All Posts",
  allSubtitle: "Stories, announcements, and product updates.",
  /** Leading chip in the category filter row; shows every post. */
  filterAll: "All",
  morePostsTitle: "More Posts",
  viewAllLabel: "All posts",
  metaTitle: "Blog | Metal Labs",
  metaDescription:
    "Product news, industry insight, and compliance guidance on AI voice agents for mortgage lending, from the Metal Labs team.",
  emptyTitle: "No articles published yet.",
  emptyBody: "We're working on the first one. Check back shortly.",
  notFoundTitle: "We couldn't find that article.",
  notFoundBody: "It may have been unpublished or the link may be out of date.",
  errorTitle: "This page didn't load.",
  errorBody:
    "We couldn't reach the content service. This is usually temporary - try again in a moment.",
} as const;

// §3 - Hero
export const hero = {
  headline: ["The only AI agent platform", "mortgage lenders will ever need."],
  subhead:
    "Metal Labs helps lenders contact every lead in seconds and move loans forward without adding headcount.",
  cta: "Book a Demo",
  ctaSecondary: "Hear It Live",
  ctaSecondaryPending: "Connecting…",
  caption: "Built for US home lenders · Voice · Text · Email · TCPA compliant",
} as const;

// §4 - Featured testimonial + trust logos
export const testimonial = {
  // Bold spans are marked with **…** and rendered as <strong>.
  quote:
    "We were running three tools to do one job. With Metal Labs, **every inbound lead now gets contacted in seconds**, and our team finally works one platform instead of switching tabs. **Fewer applications stall, and fewer payments slip through the cracks.**",
  attribution: "[Attribution placeholder: Name, Title, Lender]",
  eyebrow: "TRUSTED BY US MORTGAGE LENDERS",
} as const;

// §5 - Unified platform
export const unified = {
  eyebrow: "ONE PLATFORM",
  headline: ["Built for the full", "borrower lifecycle."],
  subhead:
    "Two sides of your business, one platform. Metal Labs covers origination through servicing across every channel your borrowers actually use.",
  subFeature: {
    heading: "One agent. Every channel. Full context, always.",
    body:
      "Metal Labs agents work across voice, text, and email at once. Every conversation is remembered and every channel connected, so when a borrower calls after receiving a text, the agent picks up exactly where it left off.",
  },
} as const;

// §6 - Feature block
export const feature = {
  headline: ["Purpose-built agents for", "every step of the journey."],
  body:
    "Not a generic AI. These are agents trained on how mortgage actually works. From the first lead call to compliant collections, every agent is built for the exact conversation it handles.",
} as const;

// §7 - Integrations grid (dark). Category order here IS the render order.
// Category labels are copy and live here; the marks themselves are asset metadata
// in lib/assets.ts. The two halves join by `id`, not by array index.
export const integrations = {
  eyebrow: "INTEGRATIONS",
  headline: ["Plugs into the stack", "you already run."],
  subhead:
    "Metal Labs reads and writes to your LOS, POS, CRM, and dialer in real time. No rip-and-replace, no data migration, no new system for your team to learn.",
  // `short` is what renders in the dot-separated line above the logo strip; `label` is
  // the full name, kept for the accessible description and any future per-category view.
  categories: [
    { id: "los", short: "Loan origination", label: "Loan origination systems" },
    { id: "pos", short: "Point of sale", label: "Point of sale" },
    { id: "crm", short: "CRM", label: "CRM & marketing" },
    { id: "verification", short: "Verification", label: "Verification & documents" },
    { id: "dialers", short: "Dialers", label: "Dialers & telephony" },
  ],
} as const;

// §4 - Omnichannel (eyebrow + scroll-revealed headline + 3 hover cards)
export const omnichannel = {
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

// §8 - Why Metal Labs (6-cell grid)
export const why = {
  eyebrow: "BUILT FOR MORTGAGE",
  headline: ["Why the best lenders", "choose Metal Labs."],
  subhead:
    "Everything a modern lender needs to run origination and servicing on one platform.",
  cells: [
    {
      label: "One platform. Not three.",
      body:
        "Origination and servicing in one place: one integration, one dashboard, one team to call. Stop stitching tools together.",
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
        "Agents for every step of the journey, from AI Loan Officer to AI Collections, trained on how mortgage actually works.",
    },
    {
      label: "Around-the-clock coverage.",
      body:
        "Inbound calls and texts handled 24/7. After-hours, weekends, and overflow. No lead left behind.",
    },
  ],
} as const;

// §12b - Compliance (two-column: title + certification badges | 3 hairline cards)
export const compliance = {
  eyebrow: "COMPLIANCE",
  headline: "Enterprise-Grade Security Standards",
  badges: ["SOC 2", "GDPR", "HIPAA"],
  cards: [
    {
      title: "End-to-End Encryption",
      body: "All data encrypted in transit and at rest using AES-256",
    },
    {
      title: "Zero Data Retention",
      body: "Your data is never stored or used for model training",
    },
    {
      title: "Private Deployment",
      body: "Deploy in your own VPC for complete data sovereignty",
    },
  ],
} as const;

// §9 - Featured case study
export const featuredCase = {
  logo: "[Customer logo placeholder]",
  category: "[Category label placeholder: e.g. leading US mortgage lender]",
  quote: "[Featured quote placeholder: 2 to 3 sentences, KAVAK-style]",
  attribution: "[Attribution placeholder: Name, Title]",
  button: "Watch the case study",
  tags: ["OUTBOUND CALLING", "INBOUND SUPPORT"],
} as const;

// §10 - Two case study cards
export const caseCards = [
  {
    logo: "[logo]",
    result: "[one-line result placeholder: speed-to-lead / applications recovered]",
    button: "Read the case study",
    tags: ["CONSUMER DIRECT"],
  },
  {
    logo: "[logo]",
    result: "[one-line result placeholder: payments collected / delinquency reduced]",
    button: "Read the case study",
    tags: ["SERVICING", "COLLECTIONS"],
  },
] as const;

// §11 - Outcomes / stats bar
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

// §12 - Closing CTA
export const closing = {
  headline: "Your competitors are still dialing manually.",
  subline:
    "See how Metal Labs handles every borrower conversation, from first call to final payment, in a live demo.",
  buttons: ["Book a Demo", "Call Our Agent →"],
} as const;

// §13 - Footer content is inlined in components/sections/Footer.tsx (ported
// verbatim from the reference footer).

// §16 - Privacy policy (/privacy). Plain facts only: this is a marketing site
// with no cookies, forms, or accounts. Update this block (not the page) when
// those facts change, e.g. if a contact form or tracking script is added.
export const PRIVACY_EMAIL = "vandan@metallabs.io";

export type PolicyBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] };

export type PolicySection = {
  id: string;
  title: string;
  blocks: PolicyBlock[];
};

export const privacy = {
  eyebrow: "Legal",
  title: "Privacy Policy",
  intro: "How Metal Labs handles information when you visit our website or book a demo.",
  metaDescription:
    "How Metal Labs handles information on metallabs.io: no cookies, no forms, anonymous analytics, and demo bookings through Cal.com.",
  updatedAt: "2026-09-16",
  updatedLabel: "September 16, 2026",
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          type: "p",
          text: "This policy covers metallabs.io, the Metal Labs marketing website. The site is informational: it has no accounts, sign-ups, or contact forms, and it does not ask you for personal information.",
        },
      ],
    },
    {
      id: "what-we-collect",
      title: "What We Collect",
      blocks: [
        { type: "p", text: "We collect very little, and only in these cases:" },
        {
          type: "list",
          items: [
            "Anonymous page-view statistics, described under Analytics below",
            "The details you enter when you book a demo",
            "Any email you choose to send us",
          ],
        },
        {
          type: "p",
          text: "We do not use cookies, and we do not track your activity on other websites.",
        },
      ],
    },
    {
      id: "analytics",
      title: "Analytics",
      blocks: [
        {
          type: "p",
          text: "We use Vercel Analytics to understand which pages are visited and how the site performs. It reports aggregated, anonymous figures, does not use cookies, and does not identify individual visitors.",
        },
      ],
    },
    {
      id: "booking-a-demo",
      title: "Booking a Demo",
      blocks: [
        {
          type: "p",
          text: "The “Book a Demo” buttons take you to Cal.com, a scheduling service. The name, email address, and any notes you enter there are shared with us so we can prepare for and hold the meeting. Cal.com processes that booking under its own privacy policy.",
        },
        {
          type: "p",
          text: "Access to the Metal Labs platform is set up directly with customers after a demo. It is not available through this website.",
        },
      ],
    },
    {
      id: "how-we-use-it",
      title: "How We Use It",
      blocks: [
        { type: "p", text: "We use this information only to:" },
        {
          type: "list",
          items: [
            "Arrange and hold the demo you booked",
            "Reply to messages you send us",
            "Improve the content and performance of the website",
          ],
        },
      ],
    },
    {
      id: "no-selling-or-sharing",
      title: "No Selling or Sharing",
      blocks: [
        {
          type: "p",
          text: "We do not sell your information, and we do not share it with third parties for advertising or marketing. We only disclose it where the law requires us to.",
        },
      ],
    },
    {
      id: "your-choices",
      title: "Retention and Your Choices",
      blocks: [
        {
          type: "p",
          text: "We keep booking details and emails only for as long as we need them to talk with you about Metal Labs. You can ask what we hold about you, or ask us to delete it, by emailing us. We will reply within 30 days.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      blocks: [
        {
          type: "p",
          text: "If this policy changes, we will update the date at the top of this page.",
        },
      ],
    },
  ] satisfies PolicySection[],
};

// §17 - Trust Center (/trust). Written for a client's compliance, risk or
// infosec reviewer, not for a buyer. Two rules for editing this block:
//
//   1. Every claim must be true of the platform TODAY. A reviewer who finds
//      one overstatement stops believing the rest of the page.
//   2. Gaps are stated here, not hidden. "What we do not do" is the section a
//      reviewer trusts the page for; deleting it makes the page weaker, not
//      stronger.
//
// Update this block (not the page) when platform behaviour changes.
export const TRUST_EMAIL = "compliance@metallabs.io";

export type TrustBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "facts"; items: { term: string; detail: string }[] };

export type TrustSection = {
  id: string;
  title: string;
  blocks: TrustBlock[];
};

export const trust = {
  eyebrow: "Trust Center",
  title: "Security, Privacy & Compliance",
  intro:
    "How Metal Labs secures data, what we deliberately never handle, and how calling activity stays inside the rules. Written for compliance and security reviewers.",
  metaDescription:
    "Metal Labs Trust Center: encryption, tenant isolation, 90-day data retention, TCPA calling-window enforcement, DNC handling, and our subprocessor list.",
  updatedAt: "2026-09-19",
  updatedLabel: "September 19, 2026",

  // The four things a reviewer checks first, surfaced above the detail.
  highlights: [
    { term: "Encrypted throughout", detail: "TLS in transit. Encrypted at rest on GCP and Supabase." },
    { term: "90-day retention", detail: "Transcripts and recordings are deleted automatically." },
    { term: "TCPA enforced in code", detail: "Calling windows are checked before every dial, and fail closed." },
    { term: "Isolated per client", detail: "No pooled data. No model training on your data." },
  ],

  sections: [
    {
      id: "what-we-are",
      title: "What Metal Labs Is",
      blocks: [
        {
          type: "p",
          text: "Metal Labs places and receives phone calls for a lender or brokerage using an AI voice agent, and writes the outcome of each call back into that client's own CRM.",
        },
        {
          type: "p",
          text: "Your CRM stays the system of record. We do not replace it and we do not retain your contact database. We hold what is needed to place a call and report on it, for as long as your retention window allows.",
        },
        {
          type: "p",
          text: "For consumer information processed on your behalf, you are the controller and Metal Labs is the processor. We act on your documented instructions, and we do not sell or share consumer personal information.",
        },
      ],
    },
    {
      id: "security",
      title: "How Data Is Secured",
      blocks: [
        {
          type: "facts",
          items: [
            {
              term: "In transit",
              detail: "TLS on every external connection, with certificates renewed automatically. Internal service traffic does not cross the public internet.",
            },
            {
              term: "At rest",
              detail: "PostgreSQL on Supabase and object storage on Google Cloud, both encrypted at rest. Recording buckets are private with no public objects.",
            },
            {
              term: "Your credentials",
              detail: "CRM keys and telephony tokens are envelope-encrypted with Fernet, using a key held outside the database. The platform refuses to start without a valid key, so at-rest encryption cannot silently degrade.",
            },
            {
              term: "Access control",
              detail: "JWT authentication, server-side role-based access control, and row-level tenant isolation. One client cannot reach another client's calls, recordings or leads.",
            },
            {
              term: "Audit trail",
              detail: "Every change-making request is logged with actor, action, target, result and source IP.",
            },
            {
              term: "Outbound protection",
              detail: "Client-configured webhooks resolve DNS and reject private and internal address ranges at request time, with redirects disabled.",
            },
          ],
        },
      ],
    },
    {
      id: "what-we-never-handle",
      title: "What We Never Handle",
      blocks: [
        {
          type: "p",
          text: "Some of this is policy. Most of it is a design constraint: the platform has no field to put the data in.",
        },
        {
          type: "list",
          items: [
            "No Social Security numbers, dates of birth, or financial account numbers. The agent does not ask for them and no field stores them.",
            "No card or bank details. We take no consumer payments, so consumer data is outside PCI scope.",
            "No credit-report data. We are not a consumer reporting agency and do not pull, store or resell credit data.",
            "No protected health information. The platform is not designed for it and should not be used for it.",
          ],
        },
        {
          type: "p",
          text: "A hard deny-list stops sensitive CRM fields from ever being spoken aloud or reaching the language model, even when your CRM sends them to us. It covers loan amounts, property values, purchase prices, credit ratings, lead sources, consent tokens and internal record identifiers.",
        },
        {
          type: "p",
          text: "An optional guardrail prevents the agent from stating any rate, payment or APR at all, and instructs it to defer to your licensed staff. The agent does not underwrite, approve, deny, price or advise.",
        },
      ],
    },
    {
      id: "retention",
      title: "Retention and Deletion",
      blocks: [
        {
          type: "facts",
          items: [
            {
              term: "90 days",
              detail: "Call transcripts, AI summaries and audio recordings are deleted 90 days after the call. A scheduled sweeper removes the recording object from storage, not just the reference to it.",
            },
            {
              term: "Recordings are never public",
              detail: "Playback uses a short-lived signed link, generated on request and valid for one hour by default. There is no permanent URL, and an expired link grants no access.",
            },
            {
              term: "On termination",
              detail: "On written request, we delete your tenant data — calls, transcripts, recordings, agent configuration and stored credentials — within 30 days, and confirm in writing.",
            },
            {
              term: "Consumer requests",
              detail: "We support export and erasure for an individual consumer record, actioned through you as the controller.",
            },
          ],
        },
        {
          type: "p",
          text: "Call metadata — time, duration and outcome — is kept after the purge for billing and reporting integrity. It contains no conversation content.",
        },
      ],
    },
    {
      id: "calling-compliance",
      title: "Calling Compliance",
      blocks: [
        {
          type: "p",
          text: "Calling rules are enforced in code before a call is placed, not left to configuration or good intentions.",
        },
        {
          type: "facts",
          items: [
            {
              term: "Calling windows",
              detail: "Every outbound call is checked against the federal 8:00–21:00 window in the called party's own local time, derived from their number and state.",
            },
            {
              term: "The baseline cannot be relaxed",
              detail: "A client configuration cannot widen the federal window. Turning a workflow's own settings off falls back to the federal default, never to no restriction.",
            },
            {
              term: "It fails closed",
              detail: "If we cannot determine the contact's timezone, the call is allowed only when it is inside the legal window in both Eastern and Pacific time — the full span of the continental United States. Unknown never means permitted.",
            },
            {
              term: "Do-not-call handling",
              detail: "Contacts on your do-not-call and suppression lists are excluded, and we honour the stop-list stage in your CRM immediately before dialling. That check also fails closed: if your CRM cannot be reached, the call is held rather than placed.",
            },
            {
              term: "State licensing",
              detail: "Calling can be restricted to the states where you are licensed.",
            },
            {
              term: "Pacing",
              detail: "Per-account and per-campaign concurrency caps, configurable operating hours, and an optional weekend hold.",
            },
          ],
        },
      ],
    },
    {
      id: "ai-and-your-data",
      title: "AI and Your Data",
      blocks: [
        {
          type: "list",
          items: [
            "We do not train, fine-tune or improve any AI model on your data or your consumers' conversations.",
            "Our speech, language and voice providers are contracted on terms that exclude customer content from their training.",
            "We do not pool data across clients. There is no shared lead pool and no cross-client analytics.",
            "We do not sell, rent or broker consumer data. There is no advertising component to this platform.",
          ],
        },
      ],
    },
    {
      id: "infrastructure",
      title: "Infrastructure and Subprocessors",
      blocks: [
        {
          type: "p",
          text: "Metal Labs runs on Google Cloud Platform and Supabase, both independently certified to SOC 2 Type II. These providers process data on our behalf:",
        },
        {
          type: "facts",
          items: [
            { term: "Google Cloud Platform", detail: "Compute and encrypted object storage for recordings." },
            { term: "Supabase", detail: "Managed PostgreSQL and authentication." },
            { term: "LiveKit", detail: "Real-time audio transport during a call." },
            { term: "Twilio / Telnyx", detail: "Telephony carriage." },
            { term: "Deepgram", detail: "Speech-to-text." },
            { term: "OpenAI", detail: "Language understanding." },
            { term: "ElevenLabs", detail: "Text-to-speech." },
            { term: "Resend / Google Workspace", detail: "Notification email to your staff." },
          ],
        },
        {
          type: "p",
          text: "Clients are notified of material changes to this list. A current copy is available on request.",
        },
      ],
    },
    {
      id: "incidents",
      title: "Incident Response",
      blocks: [
        {
          type: "p",
          text: "Suspected incidents are triaged immediately. If a breach affects your data, we notify you without undue delay and within 72 hours of confirming it, with what is known, what is affected and what is being done. Audit and infrastructure logs support forensic reconstruction.",
        },
      ],
    },
  ] satisfies TrustSection[],
};
