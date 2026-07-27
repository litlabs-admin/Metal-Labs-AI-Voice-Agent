import { BlogPostSkeleton } from "@/components/ui/BlogSkeleton";

// Shown while a post that was not prerendered (published after the last build)
// is fetched on first request.
export default function BlogPostLoading() {
  return <BlogPostSkeleton />;
}
