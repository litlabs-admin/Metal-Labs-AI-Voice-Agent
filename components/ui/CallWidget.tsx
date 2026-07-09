"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, PlayIcon, PhoneIcon } from "./Icons";
import { hero } from "@/lib/content";
import { easeOut } from "@/lib/animations";
import { cn } from "@/lib/cn";

// Interactive call widget: scenario dropdown + "Initiate Call" with visual open/hover/
// pressed states. No live backend yet.
const SCENARIOS = [
  "Inbound Lead Qualification",
  "Outbound Speed-to-Lead",
  "Appointment Scheduling",
  "Compliant Collections",
];

export function CallWidget() {
  const [open, setOpen] = useState(false);
  const [scenario, setScenario] = useState<string>(hero.widget.scenario);
  const [calling, setCalling] = useState(false);

  function initiateCall() {
    // TODO: wire live agent line
    setCalling(true);
    setTimeout(() => setCalling(false), 2200);
  }

  return (
    <div className="w-full max-w-[440px]">
      {/* Single dark pill: scenario dropdown + divider + Initiate Call (matches Vapi) */}
      <div className="flex flex-col overflow-hidden rounded-btn border border-white/10 bg-black/40 backdrop-blur-md sm:flex-row">
        {/* Scenario dropdown */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left text-[15px] text-white transition-colors duration-150 hover:bg-white/[.08]"
          >
            <span className="truncate">{scenario}</span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </button>
          <AnimatePresence>
            {open && (
              <motion.ul
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: easeOut }}
                className="absolute z-20 mt-1 w-full overflow-hidden rounded-btn border border-white/10 bg-[#141416] p-1 shadow-[0_12px_32px_#00000073]"
              >
                {SCENARIOS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => {
                        setScenario(s);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-[6px] px-3 py-2 text-left text-[14px] text-white/80 transition-colors hover:bg-white/10",
                        s === scenario && "bg-white/5 text-white",
                      )}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="hidden w-px self-stretch bg-white/10 sm:block" />

        {/* Initiate Call — transparent/white, integrated into the pill (matches Vapi) */}
        <button
          type="button"
          onClick={initiateCall}
          disabled={calling}
          className="inline-flex items-center justify-center gap-2.5 border-t border-white/10 px-5 py-3.5 text-[15px] font-medium text-white transition-colors duration-150 hover:bg-white/[.22] active:bg-white/30 sm:border-t-0"
        >
          <PlayIcon className="size-3.5" />
          {calling ? "Connecting…" : hero.widget.button}
        </button>
      </div>

      {/* Microcopy */}
      <div className="mt-3 flex items-center gap-2 px-1 text-[13px] text-white/70">
        <PhoneIcon className="size-3.5" />
        <span>
          {hero.widget.microcopy} ·{" "}
          <span className="font-[family-name:var(--font-gridnik)] text-white/50">
            {hero.widget.phonePlaceholder}
          </span>
        </span>
      </div>
    </div>
  );
}
