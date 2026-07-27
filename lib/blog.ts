import { cache } from "react";
import {
  airtableSelect,
  blogTable,
  escapeFormulaValue,
  type AirtableAttachment,
  type AirtableRecord,
} from "@/lib/airtable";

/* =========================================================================
   Blog domain layer: Airtable records in, typed BlogPost objects out.
   -------------------------------------------------------------------------
   Everything Airtable-shaped stops here. Components and routes only ever
   see BlogPost, whose fields are all non-optional or explicitly nullable -
   so a blank cell in Airtable can never surface as `undefined` in the DOM.
   ========================================================================= */

/** 1 hour. Also keeps Airtable's ~2h signed attachment URLs fresh - see the cover note below. */
export const BLOG_REVALIDATE = 3600;

/** Cache tag, so a future on-demand revalidateTag("blog") route can flush the blog only. */
export const BLOG_CACHE_TAG = "blog";

/**
 * Short cache for the by-slug fallback query in getPostBySlug. Deliberately far
 * shorter than BLOG_REVALIDATE: its whole job is to make a just-published post
 * reachable at its URL without waiting out the hourly listing cache.
 */
const SLUG_LOOKUP_REVALIDATE = 60;

/** The one Status value that renders. Case-sensitive - must match the Airtable option exactly. */
const PUBLISHED_STATUS = "Published";

const DEFAULT_AUTHOR = "Metal Labs";
const EXCERPT_LENGTH = 160;

/** Words per minute for the reading-time estimate shown on cards. */
const READING_WPM = 225;

/**
 * next/image needs intrinsic dimensions to reserve space and avoid layout
 * shift. Airtable usually supplies them, but omits them for some upload
 * paths - this 16:9 fallback keeps the aspect box stable either way.
 */
const FALLBACK_COVER_WIDTH = 1600;
const FALLBACK_COVER_HEIGHT = 900;

/**
 * The ONLY place Airtable column names appear. Renaming a column in Airtable
 * means editing exactly one line here.
 */
const FIELDS = {
  title: "Blog title",
  author: "Author",
  body: "Body",
  category: "Category",
  cover: "Cover Image",
  coverAlt: "Cover Image Alt Text",
  excerpt: "Excerpt",
  fullUrl: "Full Blog URL",
  keyword: "Keyword",
  slug: "Slug",
  status: "Status",
  tags: "Tags",
  /** Optional. Absent bases fall back to the record's createdTime. */
  publishedDate: "Published Date",
} as const;

/** Raw Airtable cell types, keyed by the literal column names above. */
type BlogFields = {
  [FIELDS.title]: string;
  [FIELDS.author]: string;
  [FIELDS.body]: string;
  [FIELDS.category]: string;
  [FIELDS.cover]: AirtableAttachment[];
  [FIELDS.coverAlt]: string;
  [FIELDS.excerpt]: string;
  [FIELDS.fullUrl]: string;
  [FIELDS.keyword]: string[];
  [FIELDS.slug]: string;
  [FIELDS.status]: string;
  [FIELDS.tags]: string[];
  [FIELDS.publishedDate]: string;
};

export type BlogCover = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export type BlogPost = {
  /** Airtable record id. Stable across edits - the key for any future image-proxy route. */
  id: string;
  /** Always present: derived from the title when the Slug cell is blank. */
  slug: string;
  title: string;
  /** Always present: derived from the body when the Excerpt cell is blank. */
  excerpt: string;
  /** Markdown source. May be "" - the renderer handles that. */
  body: string;
  author: string;
  category: string | null;
  tags: string[];
  /** SEO target phrases from the Keyword multi-select. Never rendered as UI. */
  keywords: string[];
  cover: BlogCover | null;
  /** From "Full Blog URL", only when it parses as an absolute http(s) URL. */
  canonicalUrl: string | null;
  /** ISO date. Falls back to the Airtable record's createdTime when no date field exists. */
  publishedAt: string;
  readingMinutes: number;
};

/* ---------------------------------------------------------------- helpers */

/** "Why AI Agents Win" -> "why-ai-agents-win". Used when the Slug cell is blank. */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining accents left by NFKD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Strip Markdown syntax down to readable prose, for excerpts and meta descriptions. */
function toPlainText(markdown: string): string {
  return markdown
    // Airtable richText escapes literally-typed markdown punctuation as "\#",
    // "\*" etc. Strip those first so derived excerpts never show backslashes.
    .replace(/\\([!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~])/g, "$1")
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> their text
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // headings
    .replace(/^\s{0,3}>\s?/gm, "") // blockquotes
    .replace(/^\s{0,3}[-*+]\s+/gm, "") // bullets
    .replace(/^\s{0,3}\d+[.)]\s+/gm, "") // ordered items
    .replace(/[*_`]/g, "") // inline emphasis markers
    .replace(/\s+/g, " ")
    .trim();
}

/** Truncate on a word boundary so excerpts never cut mid-word. */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

function readingMinutes(markdown: string): number {
  const words = toPlainText(markdown).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / READING_WPM));
}

/**
 * Map an Attachment cell to a cover image.
 *
 * Airtable attachment URLs are signed and expire ~2h after the API call that
 * produced them. That is safe here because (a) pages revalidate hourly, so the
 * URL is always replaced with an hour of headroom, and (b) next/image fetches
 * and re-encodes the file server-side once, so browsers request /_next/image
 * rather than Airtable directly.
 */
function toCover(
  attachments: AirtableAttachment[] | undefined,
  alt: string,
): BlogCover | null {
  const first = attachments?.[0];
  if (!first?.url) return null;

  const large = first.thumbnails?.large;
  return {
    url: first.url,
    width: first.width ?? large?.width ?? FALLBACK_COVER_WIDTH,
    height: first.height ?? large?.height ?? FALLBACK_COVER_HEIGHT,
    alt,
  };
}

/** Only accept an absolute http(s) URL as a canonical override; ignore junk. */
function toCanonicalUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Airtable Date cells arrive as "2026-07-27" or a full ISO string; normalize both. */
function toIsoDate(value: string | undefined, fallback: string): string {
  const parsed = value ? new Date(value) : null;
  if (parsed && !Number.isNaN(parsed.getTime())) return parsed.toISOString();
  return fallback;
}

/** Multi-selects come back as arrays, but are absent when empty. Always return an array. */
function toStringArray(value: string[] | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => item.trim()).filter(Boolean);
}

/**
 * Human-readable post date. Pinned to en-US/UTC so the string is identical
 * whether it is produced at build time, during ISR, or on a request.
 */
export function formatPostDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/* ---------------------------------------------------------------- mapping */

/**
 * Airtable record -> BlogPost, applying every missing-field fallback.
 * Returns null for records with no usable title: one malformed row should
 * drop out of the listing, not take the whole page down.
 */
function mapRecord(record: AirtableRecord<BlogFields>): BlogPost | null {
  const fields = record.fields;

  const title = fields[FIELDS.title]?.trim();
  if (!title) return null;

  const slug = fields[FIELDS.slug]?.trim() || slugify(title);
  if (!slug) return null; // title was punctuation-only and slugified to ""

  const body = fields[FIELDS.body] ?? "";
  const excerpt =
    fields[FIELDS.excerpt]?.trim() || truncate(toPlainText(body), EXCERPT_LENGTH);

  return {
    id: record.id,
    slug,
    title,
    excerpt,
    body,
    author: fields[FIELDS.author]?.trim() || DEFAULT_AUTHOR,
    category: fields[FIELDS.category]?.trim() || null,
    tags: toStringArray(fields[FIELDS.tags]),
    keywords: toStringArray(fields[FIELDS.keyword]),
    // Alt text falls back to the title so the image is never unlabeled.
    cover: toCover(fields[FIELDS.cover], fields[FIELDS.coverAlt]?.trim() || title),
    canonicalUrl: toCanonicalUrl(fields[FIELDS.fullUrl]),
    publishedAt: toIsoDate(fields[FIELDS.publishedDate], record.createdTime),
    readingMinutes: readingMinutes(body),
  };
}

/* ---------------------------------------------------------------- queries */

/**
 * Every published post, newest first.
 *
 * Wrapped in React's cache() so generateStaticParams, generateMetadata and the
 * page component share a single Airtable round-trip per render pass.
 *
 * Two deliberate choices for schema resilience:
 *  - No `fields[]` param. Requesting a column that does not exist returns 422
 *    and would take the whole blog down; fetching whole records cannot.
 *  - No `sort` param, for the same reason - "Published Date" is optional.
 *    Sorting happens below, on data we have already normalized.
 */
export const getPublishedPosts = cache(async (): Promise<BlogPost[]> => {
  const records = await airtableSelect<BlogFields>(
    blogTable(),
    {
      filterByFormula: `{${FIELDS.status}} = "${escapeFormulaValue(PUBLISHED_STATUS)}"`,
    },
    { revalidate: BLOG_REVALIDATE, tags: [BLOG_CACHE_TAG] },
  );

  const posts = records
    .map(mapRecord)
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  // Airtable enforces no uniqueness on Slug, and duplicating a row is a single
  // keyboard shortcut - so two published records can easily share one slug.
  // Left alone that means duplicate cards in the listing, duplicate entries from
  // generateStaticParams, and a post URL that resolves to whichever record
  // happens to sort first. Keep the newest, drop the rest, and log loudly so the
  // cause is obvious in the server logs.
  const seen = new Set<string>();
  const unique: BlogPost[] = [];
  for (const post of posts) {
    if (seen.has(post.slug)) {
      console.warn(
        `[blog] Duplicate slug "${post.slug}": ignoring record ${post.id} ("${post.title}"). Give each published post a unique Slug in Airtable.`,
      );
      continue;
    }
    seen.add(post.slug);
    unique.push(post);
  }

  return unique;
});

/**
 * One published post by slug, or null. Two-step lookup.
 */
export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  // 1. Fast path - the hourly list is already fetched for the listing page and
  //    generateStaticParams, so a hit here costs zero extra requests. It is also
  //    the only path that can match a post whose Slug cell is blank, because
  //    that slug is derived from the title and exists nowhere in Airtable.
  const posts = await getPublishedPosts();
  const cached = posts.find((post) => post.slug === slug);
  if (cached) return cached;

  // 2. Miss. Either the slug genuinely does not exist, or the post was
  //    published within the last hour and the cached list predates it. Ask
  //    Airtable directly on a short cache so a newly published post's URL works
  //    immediately rather than 404ing for up to an hour.
  //
  //    This matters more than it looks: social platforms scrape and cache Open
  //    Graph data the first time a link is shared, so a post announced right
  //    after publishing could keep a broken preview card even once it goes live.
  //
  //    The 60s cache also means repeated hits on nonexistent slugs (bots, stale
  //    links) are served from cache instead of spending Airtable's 5 req/sec budget.
  const records = await airtableSelect<BlogFields>(
    blogTable(),
    {
      filterByFormula: `AND({${FIELDS.status}} = "${escapeFormulaValue(PUBLISHED_STATUS)}", {${FIELDS.slug}} = "${escapeFormulaValue(slug)}")`,
      maxRecords: "1",
    },
    { revalidate: SLUG_LOOKUP_REVALIDATE, tags: [BLOG_CACHE_TAG] },
  );

  const record = records[0];
  return record ? mapRecord(record) : null;
});
