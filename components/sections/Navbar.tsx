"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { nav, CAL_LINK } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

// §2 - sticky nav: transparent over the dark hero, solid + blurred once scrolled.
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <a href="#" className="flex items-center gap-3 text-white">
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
          </a>

          <div className="hidden items-center gap-10 xl:flex">
            {nav.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[15px] text-white/80 transition-colors hover:text-white"
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
            <Button variant="light">{nav.cta}</Button>
          </a>
        </div>
      </nav>
    </header>
  );
}
