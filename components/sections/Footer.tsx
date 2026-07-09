import { footer } from "@/lib/content";
import { LogoMark, LinkedInIcon, XIcon } from "@/components/ui/Icons";

// §13 — dark footer grid.
export function Footer() {
  return (
    <footer
      data-nav-theme="dark"
      className="w-full bg-black px-6 py-14 text-white md:px-14 xl:px-18 xl:pb-12"
    >
      <div className="mx-auto grid max-w-[var(--container-site)] grid-cols-2 gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <LogoMark className="h-5 w-6" />
            <span className="text-[17px] font-semibold tracking-tight">Metal Labs</span>
          </div>
          <p className="mt-4 max-w-[220px] text-[14px] text-white/50">{footer.tagline}</p>
        </div>

        {/* Link columns */}
        {footer.columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-[family-name:var(--font-gridnik)] text-[11px] uppercase tracking-wide text-white/40">
              {col.title}
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[14px] text-white/70 transition-colors hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 flex max-w-[var(--container-site)] flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
        <p className="text-[13px] text-white/40">{footer.copyright}</p>
        <div className="flex items-center gap-4 text-white/50">
          <a href="#" aria-label="LinkedIn" className="hover:text-white">
            <LinkedInIcon className="size-4" />
          </a>
          <a href="#" aria-label="X" className="hover:text-white">
            <XIcon className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
