"use client";

import { useState } from "react";
import { PlayIcon } from "./Icons";
import { Button } from "./Button";
import { hero, CAL_LINK } from "@/lib/content";

// Hero CTAs: "Book a Demo" (primary) + "Hear It Live" (secondary), which dials the
// agent. No live backend yet - the pending state is a stub.
export function HeroActions() {
  const [calling, setCalling] = useState(false);

  function initiateCall() {
    // TODO: wire live agent line
    setCalling(true);
    setTimeout(() => setCalling(false), 2200);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 md:justify-end">
      <a href={CAL_LINK} target="_blank" rel="noopener noreferrer">
        <Button variant="light">{hero.cta}</Button>
      </a>
      <Button variant="ghost" onClick={initiateCall} disabled={calling}>
        <PlayIcon className="size-3.5" />
        {calling ? hero.ctaSecondaryPending : hero.ctaSecondary}
      </Button>
    </div>
  );
}
