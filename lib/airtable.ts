/* =========================================================================
   Reusable Airtable REST client.
   -------------------------------------------------------------------------
   Deliberately generic: this module knows nothing about blogs. Domain
   mapping lives in lib/blog.ts so a second table (careers, case studies)
   can reuse airtableSelect() without touching this file.

   Why raw REST instead of the `airtable` npm SDK: the SDK ships its own
   HTTP layer (node-fetch + abort-controller), which bypasses Next's fetch
   cache entirely. `revalidate` and `revalidateTag` would silently do
   nothing, and every request would hit Airtable's 5 req/sec limit. Going
   through global `fetch` is ~40 lines and composes natively with ISR.

   SERVER ONLY. Every caller is a Server Component or generateMetadata, so
   AIRTABLE_TOKEN never reaches the browser bundle. Do not import this from
   a "use client" module.
   ========================================================================= */

const AIRTABLE_API = "https://api.airtable.com/v0";

// Airtable caps a page at 100 records. 50 pages = 5000 posts, which is far
// past anything this site will hold - it exists purely so a malformed
// `offset` response can never spin forever.
const MAX_PAGES = 50;

export type AirtableThumbnail = {
  url: string;
  width: number;
  height: number;
};

/** Shape of a single item in an Attachment field's array. */
export type AirtableAttachment = {
  id: string;
  url: string;
  filename: string;
  size?: number;
  type?: string;
  width?: number;
  height?: number;
  thumbnails?: {
    small?: AirtableThumbnail;
    large?: AirtableThumbnail;
    full?: AirtableThumbnail;
  };
};

/**
 * `fields` is Partial because Airtable omits empty cells from the response
 * entirely - a blank column is an absent key, not null. Forcing callers
 * through Partial is what makes the "handle missing fields" requirement a
 * compile-time guarantee rather than a convention.
 */
export type AirtableRecord<TFields> = {
  id: string;
  createdTime: string;
  fields: Partial<TFields>;
};

type AirtableListResponse<TFields> = {
  records: AirtableRecord<TFields>[];
  offset?: string;
};

export type AirtableSelectParams = Record<string, string | string[] | undefined>;

export type AirtableCacheOptions = {
  /** Seconds before Next re-fetches. Passed straight to `fetch`'s next option. */
  revalidate: number;
  /** Cache tags, so a future revalidateTag() call can flush this data on demand. */
  tags?: string[];
};

/** Carries Airtable's HTTP status so callers can distinguish 401 from 422 from 5xx. */
export class AirtableError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(`Airtable request failed (${status}): ${message}`);
    this.name = "AirtableError";
    this.status = status;
  }
}

/**
 * Read a required env var. Called lazily inside the request path rather than
 * at module scope so that importing this file (e.g. for its types) can never
 * crash an unrelated build step.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Add it to .env.local for local dev and to your hosting provider's environment for production. See .env.example.`,
    );
  }
  return value;
}

/** The blog table id/name, from env so the table can be renamed without a code change. */
export function blogTable(): string {
  return requireEnv("AIRTABLE_TABLE_ID");
}

/**
 * Escape a value for safe interpolation into a double-quoted filterByFormula
 * string literal. Without this, a slug containing a quote would break the
 * formula - or inject arbitrary formula logic into the query.
 */
export function escapeFormulaValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildSearchParams(
  params: AirtableSelectParams,
  offset: string | undefined,
): URLSearchParams {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      // Airtable expects list params as repeated keys: fields[]=A&fields[]=B
      for (const item of value) search.append(key, item);
    } else {
      search.append(key, value);
    }
  }

  if (offset) search.set("offset", offset);
  return search;
}

/** Pull the most useful message out of an Airtable error body without throwing again. */
async function readAirtableError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      error?: string | { type?: string; message?: string };
    };
    const error = body?.error;
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    if (error?.type) return error.type;
  } catch {
    // Non-JSON body (gateway HTML, empty response) - fall through to statusText.
  }
  return response.statusText || "unknown error";
}

/**
 * GET every record matching `params`, following Airtable's `offset` pagination
 * so callers never see pages.
 *
 * @param table  Table id (tblXXXX) or table name.
 * @param params Query params, e.g. { filterByFormula: '{Status} = "Published"' }.
 * @param cache  Next cache behavior - this is why we use fetch directly.
 */
export async function airtableSelect<TFields>(
  table: string,
  params: AirtableSelectParams,
  cache: AirtableCacheOptions,
): Promise<AirtableRecord<TFields>[]> {
  const token = requireEnv("AIRTABLE_TOKEN");
  const baseId = requireEnv("AIRTABLE_BASE_ID");

  const records: AirtableRecord<TFields>[] = [];
  let offset: string | undefined;
  let page = 0;

  do {
    const search = buildSearchParams(params, offset);
    const url = `${AIRTABLE_API}/${baseId}/${encodeURIComponent(table)}?${search.toString()}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: cache.revalidate, tags: cache.tags },
    });

    if (!response.ok) {
      throw new AirtableError(response.status, await readAirtableError(response));
    }

    const body = (await response.json()) as AirtableListResponse<TFields>;
    records.push(...body.records);
    offset = body.offset;
    page += 1;
  } while (offset && page < MAX_PAGES);

  return records;
}
