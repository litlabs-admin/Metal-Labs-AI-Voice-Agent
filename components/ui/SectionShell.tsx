import { cn } from "@/lib/cn";

type Theme = "cream" | "cream-2" | "white" | "dark" | "black";

const themeBg: Record<Theme, string> = {
  cream: "bg-cream",
  "cream-2": "bg-cream-2",
  white: "bg-white",
  dark: "bg-ink text-text-on-dark",
  black: "bg-black text-text-on-dark",
};

// Full-bleed section with per-theme background and nav-theme hook; inner content
// is capped at the 1296px container.
export function SectionShell({
  children,
  theme = "cream",
  navTheme,
  className,
  innerClassName,
  id,
}: {
  children: React.ReactNode;
  theme?: Theme;
  navTheme?: "light" | "dark";
  className?: string;
  innerClassName?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      data-nav-theme={navTheme ?? (theme === "dark" || theme === "black" ? "dark" : "light")}
      className={cn("w-full px-6 md:px-14 xl:px-18", themeBg[theme], className)}
    >
      <div className={cn("mx-auto w-full max-w-[var(--container-site)]", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
