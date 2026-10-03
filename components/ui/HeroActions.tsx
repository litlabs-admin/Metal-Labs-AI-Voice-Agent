import { Button } from "./Button";
import { HearItLive } from "./HearItLive";
import { hero, CAL_LINK } from "@/lib/content";

// Hero CTAs: "Hear it live" (the agent calls you) beside "Book a Demo".
export function HeroActions() {
  return (
    <div className="flex flex-wrap items-center gap-3 md:justify-end">
      <HearItLive />
      <a href={CAL_LINK} target="_blank" rel="noopener noreferrer">
        <Button variant="light">{hero.cta}</Button>
      </a>
    </div>
  );
}
