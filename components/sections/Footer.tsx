"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CAL_LINK } from "@/lib/content";

// §13 - dark footer with brand block, 5 link columns, and a giant clipped
// "metal labs" watermark. Ported from the reference footer (framer-motion
// entrance) into this project's Tailwind v4 conventions.

const PRODUCT_LINKS = [
  { label: "Omnichannel", href: "#omnichannel" },
  { label: "Solutions", href: "#solutions" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Compliance", href: "#compliance" },
];

const COMPANY_LINKS = [{ label: "Request Demo", href: "#about" }];

const SOCIAL_LINKS = [{ label: "LinkedIn", href: "https://www.linkedin.com/company/metal-labs-ai/" }];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Legal", href: "#" },
];

const COLUMNS = [
  { head: "Product", links: PRODUCT_LINKS },
  { head: "Company", links: COMPANY_LINKS },
  { head: "Social", links: SOCIAL_LINKS },
  { head: "Legal", links: LEGAL_LINKS },
];

const EXTERNAL_HEADS = new Set(["Social"]);

const EASE = [0.44, 0, 0.56, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, ease: EASE },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export function Footer() {
  return (
    <footer data-nav-theme="dark" className="relative w-full overflow-hidden bg-black">
      <motion.div
        className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-12 pb-[88px] md:px-9 md:pt-16 md:pb-[112px] xl:px-10 xl:pt-[84px] xl:pb-[128px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        <div className="grid grid-cols-1 items-start gap-12 xl:grid-cols-[minmax(280px,1.3fr)_3fr] xl:gap-16">
          {/* Brand block */}
          <motion.div className="flex flex-col items-start gap-5" variants={itemVariants}>
            <a href="#" className="inline-flex items-center gap-3 no-underline" aria-label="Metal Labs home">
              <span className="inline-flex h-7 w-7 shrink-0 overflow-hidden rounded-full">
                <Image src="/brand/logo.png" alt="" width={28} height={28} className="h-full w-full object-cover" />
              </span>
              <span className="font-heading text-[22px] font-bold leading-none tracking-[0.02em] text-white">
                Metal Labs
              </span>
            </a>

            <p className="max-w-[260px] font-[family-name:var(--font-inter)] text-[15px] leading-[1.5] text-white/55">
              Every borrower conversation, handled across voice, text, and email.
            </p>

            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-[13px] font-[family-name:var(--font-switzer)] text-[14px] font-medium leading-none text-black transition-[transform,opacity] duration-200 hover:-translate-y-px hover:opacity-[0.88]"
            >
              Book a Demo
            </a>
          </motion.div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-9 md:grid-cols-4 md:gap-x-8 md:gap-y-10 xl:gap-8">
            {COLUMNS.map((col) => {
              const external = EXTERNAL_HEADS.has(col.head);
              return (
                <motion.nav
                  key={col.head}
                  className="flex flex-col gap-5"
                  variants={itemVariants}
                  aria-label={`${col.head} navigation`}
                >
                  <p className="font-[family-name:var(--font-inter)] text-[14px] text-white/50">{col.head}</p>
                  <ul className="flex list-none flex-col gap-3 p-0">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="font-[family-name:var(--font-inter)] text-[15px] leading-[1.4] text-white/70 transition-colors duration-200 hover:text-white"
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.nav>
              );
            })}
          </div>
        </div>

        <motion.p
          className="mt-12 font-[family-name:var(--font-inter)] text-[13px] leading-[1.5] text-white/40 xl:mt-16"
          variants={itemVariants}
        >
          © 2026 Metal Labs. All rights reserved.
        </motion.p>
      </motion.div>

      {/* Oversized lowercase wordmark watermark, clipped by the footer's bottom edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-0.24em] z-0 select-none whitespace-nowrap text-center font-[family-name:var(--font-switzer)] text-[clamp(120px,22vw,340px)] font-bold leading-[0.8] tracking-[-0.04em] text-white/[0.16] [word-spacing:0.2em]"
      >
        metal labs
      </div>
    </footer>
  );
}
