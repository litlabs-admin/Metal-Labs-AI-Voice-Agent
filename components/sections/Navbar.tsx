"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, CAL_LINK } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

// useLayoutEffect flips topIsDark before the browser paints, so there is no
// visible flash - but React warns if it runs during SSR (no DOM to measure
// against there), so fall back to a plain effect server-side.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// §2 - sticky nav: transparent over the page's top section, solid + blurred
// once scrolled. While transparent, its foreground follows the top section's
// data-nav-theme (see globals.css) so it stays legible over both the dark
// homepage hero and a light page like /blog.
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // Guess from the route before the DOM is measured, so the very first paint
  // - server-rendered HTML included - already has the right colors instead of
  // defaulting to "dark" and correcting a frame later. /blog and its posts
  // open light; every other route (including /blog's own error/not-found,
  // which are dark) is corrected by the layout effect below.
  const [topIsDark, setTopIsDark] = useState(() => !pathname.startsWith("/blog"));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Re-read on every navigation - BlogLayout persists across /blog ->
  // /blog/[slug], so the Navbar never remounts on that transition and a
  // mount-only read would go stale.
  useIsomorphicLayoutEffect(() => {
    const syncTopTheme = () => {
      const top = document.querySelector("[data-nav-theme]");
      setTopIsDark(top?.getAttribute("data-nav-theme") !== "light");
    };
    syncTopTheme();
  }, [pathname]);

  const light = !scrolled && !topIsDark;

  return (
    <header className="sticky top-0 z-50 h-0 w-full">
      <nav
        className={cn(
          "w-full transition-colors duration-300",
          scrolled
            ? "border-b border-white/10 bg-ink/80 backdrop-blur-2xl"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[var(--container-site)] items-center justify-between px-6 md:px-14 xl:px-18">
          <Link
            href="/"
            aria-label="Metal Labs home"
            className={cn(
              "flex items-center gap-3 transition-colors duration-300",
              light ? "text-text" : "text-white",
            )}
          >
            <Image
              src="/brand/logo.png"
              alt=""
              width={28}
              height={28}
              priority
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
            <span className="font-heading text-[18px] font-bold leading-none tracking-[0.02em]">
              Metal Labs
            </span>
          </Link>

          <div className="hidden items-center gap-10 xl:flex">
            {nav.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={cn(
                  "text-[15px] transition-colors duration-300",
                  light
                    ? "text-text/70 hover:text-text"
                    : "text-white/80 hover:text-white",
                )}
              >
                {l.label}
              </a>
            ))}
          </div>

          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button variant={light ? "primary" : "light"}>{nav.cta}</Button>
          </a>
        </div>
      </nav>
    </header>
  );
}
