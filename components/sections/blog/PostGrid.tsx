"use client";

import { useMemo, useState } from "react";
import { BlogCard } from "@/components/sections/blog/BlogCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { BlogPost } from "@/lib/blog";
import { blog } from "@/lib/content";

// "All Posts" grid with a category filter row. Categories are derived from
// whatever posts actually carry, so the chip row disappears entirely for a
// blog that isn't using Category yet rather than showing a lone "All".
export function PostGrid({ posts }: { posts: BlogPost[] }) {
  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const post of posts) {
      if (post.category) seen.add(post.category);
    }
    return Array.from(seen);
  }, [posts]);

  const [active, setActive] = useState<string | null>(null);

  const visible = active ? posts.filter((post) => post.category === active) : posts;

  return (
    <div className="flex flex-col gap-10">
      {categories.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Filter by category">
          <FilterChip label={blog.filterAll} active={active === null} onClick={() => setActive(null)} />
          {categories.map((category) => (
            <FilterChip
              key={category}
              label={category}
              active={active === category}
              onClick={() => setActive(category)}
            />
          ))}
        </div>
      ) : null}

      <RevealGroup className="grid w-full grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3" stagger={0.06}>
        {visible.map((post) => (
          <RevealItem key={post.id} className="h-full">
            <BlogCard post={post} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 font-illustration text-[13px] font-medium transition-colors duration-200",
        active ? "bg-ink text-text-on-dark" : "bg-cream-2 text-muted hover:text-text",
      )}
    >
      {label}
    </button>
  );
}
