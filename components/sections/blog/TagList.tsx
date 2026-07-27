import { cn } from "@/lib/cn";

// Tag chips. Renders nothing when the source field is empty in Airtable, so a
// post with no Tags simply omits the block rather than leaving a stray empty
// row in the layout.

export function TagChips({ tags, className }: { tags: string[]; className?: string }) {
  if (tags.length === 0) return null;

  return (
    <ul className={cn("flex list-none flex-wrap gap-2 p-0", className)}>
      {tags.map((tag) => (
        <li key={tag}>
          <span className="inline-flex items-center rounded-chip border border-hairline px-3 py-1.5 text-[13px] leading-none text-muted">
            {tag}
          </span>
        </li>
      ))}
    </ul>
  );
}
