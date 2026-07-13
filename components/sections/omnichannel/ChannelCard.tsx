"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";

// The reference card's whole motion budget is one MotionConfig value: a spring with
// no overshoot, 0.6s, no delay. It drives both the description's opacity fade AND
// the layout reflow that pushes the title up to make room for it.
const cardSpring = { type: "spring", bounce: 0, duration: 0.6 } as const;

// Pain-point card, ported from the reference template.
//
// At rest the card shows only the icon (top) and the kicker + title (bottom) — the
// content column is `justify-between` inside a fixed 362px box. On hover the
// description *mounts*, growing the text group, so the title slides up and the copy
// fades in beneath it. Below xl the reference falls back to its "Phone" variant:
// the card auto-heights and the description is always visible, since touch devices
// have no hover state.
export function ChannelCard({
  icon,
  kicker,
  title,
  body,
  className,
}: {
  icon: string;
  kicker: string;
  title: string;
  body: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      transition={cardSpring}
      className={cn(
        "relative flex flex-col items-start justify-start overflow-clip border-l border-t border-black/10 p-5 md:p-[30px] xl:h-[362px] xl:justify-center xl:p-10",
        className,
      )}
    >
      {/* The icon is pinned to the top by `justify-between` and never moves, and this
          column's own height never changes — so neither needs a layout animation. */}
      <div className="relative flex w-full flex-none flex-col items-start justify-center gap-9 xl:h-px xl:flex-1 xl:justify-between xl:gap-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- local static SVG, same as SmartImage */}
        <img
          src={icon}
          alt=""
          className="size-[70px] flex-none select-none xl:size-[100px]"
        />

        {/* Only this group resizes, so it is the only element that gets a full `layout`
            animation. Its children use `layout="position"`: a size-animating parent is
            rendered with a scale transform, and position-only children opt out of the
            inverse-scale correction that would otherwise smear the type mid-flight. */}
        <motion.div
          layout={!reduce}
          transition={cardSpring}
          className="flex w-full flex-none flex-col items-start gap-3"
        >
          <motion.div layout={reduce ? false : "position"} transition={cardSpring}>
            <Eyebrow>{kicker}</Eyebrow>
          </motion.div>

          <motion.h3
            layout={reduce ? false : "position"}
            transition={cardSpring}
            className="font-heading text-[20px] font-normal leading-[32px] text-text md:text-[22px] xl:text-[24px]"
          >
            {title}
          </motion.h3>

          {/* Below xl (and under reduced motion) the copy is simply always there. */}
          <p className="text-[16px] leading-[26px] text-text opacity-70 xl:hidden">
            {body}
          </p>

          {/* popLayout takes the exiting paragraph out of flow immediately, so on
              hover-out the title springs back at once instead of waiting for the fade. */}
          <AnimatePresence mode="popLayout">
            {hovered && (
              <motion.p
                key="body"
                layout={reduce ? false : "position"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={cardSpring}
                className="hidden text-[16px] leading-[26px] text-text will-change-[opacity,transform] xl:block"
              >
                {body}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
