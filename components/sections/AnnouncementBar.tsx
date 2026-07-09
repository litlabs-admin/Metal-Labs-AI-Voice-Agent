import { announcement } from "@/lib/content";
import { ArrowRight } from "@/components/ui/Icons";

// §1 — slim green-tinted top announcement bar.
export function AnnouncementBar() {
  return (
    <div className="relative w-full overflow-hidden bg-ink text-text-on-dark">
      {/* green-tinted flowing top strip */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "linear-gradient(90deg, #0e0e13 0%, #123a2a 30%, #1c5c40 55%, #123a2a 78%, #0e0e13 100%)",
        }}
      />
      <div className="relative mx-auto flex max-w-[var(--container-site)] items-center justify-center gap-3 px-6 py-2 text-center text-[13px]">
        <span className="text-white/90">{announcement.text}</span>
        <a
          href="#about"
          className="group inline-flex items-center gap-1 whitespace-nowrap font-[family-name:var(--font-gridnik)] text-[11px] uppercase tracking-wide text-mint underline-offset-2 hover:underline"
        >
          {announcement.cta}
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
