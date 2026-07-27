import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/* =========================================================================
   Minimal Markdown renderer for Airtable's rich-text Long text fields.
   -------------------------------------------------------------------------
   Airtable returns Markdown from a Long text field that has "Enable rich
   text formatting" turned on. This module renders that subset directly to
   JSX, styled with the project's own type tokens.

   Why not react-markdown: it and remark pull in ~15 transitive packages for
   a grammar this content does not use. This is the same approach as
   components/ui/BoldText.tsx, which already parses **bold** markers out of
   lib/content.ts - just a wider grammar.

   Security: output is always React elements built from captured substrings.
   dangerouslySetInnerHTML is never used, so Airtable content cannot inject
   markup or script.

   Supported: headings, paragraphs, ordered/unordered lists, blockquotes,
   fenced code, horizontal rules, images, and inline bold/italic/code/links.
   Not supported: tables, footnotes, nested lists, inline HTML.
   ========================================================================= */

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "code"; code: string }
  | { kind: "hr" }
  | { kind: "image"; alt: string; src: string };

const RE_FENCE_OPEN = /^\s{0,3}```/;
const RE_FENCE_CLOSE = /^\s{0,3}```\s*$/;
const RE_HR = /^\s{0,3}([-*_])\s*(?:\1\s*){2,}$/;
const RE_HEADING = /^\s{0,3}(#{1,6})\s+(.*)$/;
const RE_IMAGE = /^\s*!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*$/;
const RE_QUOTE = /^\s{0,3}>/;
const RE_BULLET = /^\s{0,3}[-*+]\s+(.*)$/;
const RE_ORDERED = /^\s{0,3}\d+[.)]\s+(.*)$/;

/** True when a line opens a new block, so paragraph accumulation stops at it. */
function startsBlock(line: string): boolean {
  return (
    RE_FENCE_OPEN.test(line) ||
    RE_HR.test(line) ||
    RE_HEADING.test(line) ||
    RE_IMAGE.test(line) ||
    RE_QUOTE.test(line) ||
    RE_BULLET.test(line) ||
    RE_ORDERED.test(line)
  );
}

/**
 * Undo Airtable's rich-text escaping.
 *
 * A richText field escapes any markdown punctuation the author typed as literal
 * characters, so a pasted "## Heading" comes back from the API as "\## Heading"
 * and would otherwise render as visible "## Heading" text.
 *
 * Stripping these escapes makes all three authoring styles produce the same
 * result: pasting markdown into a rich-text field, using Airtable's formatting
 * toolbar, or turning rich text off and writing raw markdown.
 *
 * Trade-off: an author cannot force a literal "#" at the start of a line. Wrap
 * it in backticks if that is ever genuinely needed.
 */
function unescapeAirtableMarkdown(source: string): string {
  return source.replace(/\\([!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~])/g, "$1");
}

function parseBlocks(source: string): Block[] {
  const lines = unescapeAirtableMarkdown(source).replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank lines only separate blocks.
    if (!line.trim()) {
      i += 1;
      continue;
    }

    // Fenced code. Consume to the closing fence, or to EOF if it is unbalanced.
    if (RE_FENCE_OPEN.test(line)) {
      const buffer: string[] = [];
      i += 1;
      while (i < lines.length && !RE_FENCE_CLOSE.test(lines[i])) {
        buffer.push(lines[i]);
        i += 1;
      }
      i += 1; // step past the closing fence
      blocks.push({ kind: "code", code: buffer.join("\n") });
      continue;
    }

    if (RE_HR.test(line)) {
      blocks.push({ kind: "hr" });
      i += 1;
      continue;
    }

    const heading = RE_HEADING.exec(line);
    if (heading) {
      blocks.push({
        kind: "heading",
        level: heading[1].length,
        text: heading[2].trim(),
      });
      i += 1;
      continue;
    }

    // An image alone on its line becomes a figure; inline images stay inline.
    const image = RE_IMAGE.exec(line);
    if (image) {
      blocks.push({ kind: "image", alt: image[1], src: image[2] });
      i += 1;
      continue;
    }

    // Blockquote: join consecutive "> " lines into one quote.
    if (RE_QUOTE.test(line)) {
      const buffer: string[] = [];
      while (i < lines.length && RE_QUOTE.test(lines[i])) {
        buffer.push(lines[i].replace(/^\s{0,3}>\s?/, ""));
        i += 1;
      }
      blocks.push({ kind: "quote", text: buffer.join(" ").trim() });
      continue;
    }

    // Lists: consume consecutive items of the same kind.
    const isOrdered = RE_ORDERED.test(line);
    if (isOrdered || RE_BULLET.test(line)) {
      const pattern = isOrdered ? RE_ORDERED : RE_BULLET;
      const items: string[] = [];
      while (i < lines.length) {
        const item = pattern.exec(lines[i]);
        if (!item) break;
        items.push(item[1].trim());
        i += 1;
      }
      blocks.push({ kind: "list", ordered: isOrdered, items });
      continue;
    }

    // Paragraph: soft-wrapped lines join with a space, stopping at a blank
    // line or at anything that opens a new block.
    const buffer: string[] = [];
    while (i < lines.length && lines[i].trim() && !startsBlock(lines[i])) {
      buffer.push(lines[i].trim());
      i += 1;
    }
    if (buffer.length === 0) {
      // Defensive: no rule matched and nothing was consumed. Skip the line
      // rather than loop forever on it.
      i += 1;
      continue;
    }
    blocks.push({ kind: "paragraph", text: buffer.join(" ") });
  }

  return blocks;
}

/* --------------------------------------------------------------- inline */

// Order matters: ** before *, __ before _. The \w guards stop snake_case
// identifiers and mid-word asterisks from being read as emphasis.
const RE_INLINE =
  /\*\*(.+?)\*\*|__(.+?)__|(?<!\w)\*(.+?)\*(?!\w)|(?<!\w)_(.+?)_(?!\w)|`(.+?)`|\[(.+?)\]\((\S+?)\)/g;

function MarkdownLink({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      className="text-text underline decoration-mint decoration-2 underline-offset-4 transition-colors hover:text-muted"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

/** Render inline emphasis, code and links inside one block of text. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let count = 0;
  let match: RegExpExecArray | null;

  RE_INLINE.lastIndex = 0;
  while ((match = RE_INLINE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const key = `${keyPrefix}-i${count}`;
    count += 1;

    const strong = match[1] ?? match[2];
    const emphasis = match[3] ?? match[4];
    const code = match[5];
    const linkText = match[6];
    const linkHref = match[7];

    if (strong !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-text">
          {strong}
        </strong>,
      );
    } else if (emphasis !== undefined) {
      nodes.push(<em key={key}>{emphasis}</em>);
    } else if (code !== undefined) {
      nodes.push(
        <code
          key={key}
          className="rounded-chip bg-cream-2 px-1.5 py-0.5 font-mono text-[0.9em] text-text"
        >
          {code}
        </code>,
      );
    } else if (linkText !== undefined && linkHref !== undefined) {
      nodes.push(
        <MarkdownLink key={key} href={linkHref}>
          {linkText}
        </MarkdownLink>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

/* --------------------------------------------------------------- blocks */

const HEADING_CLASS: Record<number, string> = {
  2: "mt-12 text-display-sm font-light text-text md:text-headline-xs",
  3: "mt-10 text-[24px] font-light leading-[1.3] tracking-[-0.3px] text-text md:text-[28px]",
  4: "mt-8 text-[20px] font-normal leading-[1.35] text-text",
};

function renderBlock(block: Block, index: number): ReactNode {
  const key = `b${index}`;

  switch (block.kind) {
    case "heading": {
      // h1 is reserved for the post title in PostHeader, so body headings are
      // floored at h2 and clamped at h4. Authors typing "##" for sections (the
      // natural habit) therefore get a real <h2> and the outline never skips a
      // level - "#" collapses to h2 rather than competing with the title.
      const level = Math.min(Math.max(block.level, 2), 4);
      const Tag = `h${level}` as "h2" | "h3" | "h4";
      return (
        <Tag key={key} className={HEADING_CLASS[level]}>
          {renderInline(block.text, key)}
        </Tag>
      );
    }

    case "paragraph":
      return (
        <p key={key} className="mt-6 text-[17px] leading-[1.75] text-text/85">
          {renderInline(block.text, key)}
        </p>
      );

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          key={key}
          className={cn(
            "mt-6 flex list-outside flex-col gap-2 pl-6 text-[17px] leading-[1.75] text-text/85",
            block.ordered ? "list-decimal" : "list-disc",
          )}
        >
          {block.items.map((item, itemIndex) => (
            <li key={`${key}-${itemIndex}`} className="pl-1 marker:text-muted">
              {renderInline(item, `${key}-${itemIndex}`)}
            </li>
          ))}
        </Tag>
      );
    }

    case "quote":
      return (
        <blockquote
          key={key}
          className="mt-8 border-l-2 border-mint pl-6 text-[19px] font-light italic leading-[1.6] text-text"
        >
          {renderInline(block.text, key)}
        </blockquote>
      );

    case "code":
      return (
        <pre
          key={key}
          className="mt-8 overflow-x-auto rounded-card bg-ink p-5 text-[14px] leading-[1.6] text-text-on-dark"
        >
          <code className="font-mono">{block.code}</code>
        </pre>
      );

    case "hr":
      return <hr key={key} className="mt-10 border-hairline" />;

    case "image":
      // Plain <img> rather than next/image: body images can point at any host
      // an author pastes in, and next/image would throw for hosts missing from
      // images.remotePatterns. Matches components/ui/SmartImage.tsx precedent.
      return (
        <figure key={key} className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary author-supplied host, see note above */}
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            className="w-full rounded-media"
          />
          {block.alt ? (
            <figcaption className="mt-3 text-[14px] text-muted">{block.alt}</figcaption>
          ) : null}
        </figure>
      );

    default:
      return null;
  }
}

/**
 * Render a Markdown string. Safe to call with "" - renders nothing.
 * Server component: no "use client", so this ships zero JS.
 */
export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = parseBlocks(source ?? "");
  if (blocks.length === 0) return null;

  // first:mt-0 keeps the block from adding a leading gap under the cover image.
  return (
    <div className={cn("[&>*:first-child]:mt-0", className)}>
      {blocks.map(renderBlock)}
    </div>
  );
}
