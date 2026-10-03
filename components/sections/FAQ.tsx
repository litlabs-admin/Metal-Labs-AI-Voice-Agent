import { faq } from "@/lib/content";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { WordRevealGroup, Words } from "@/components/ui/WordReveal";
import { AskAiButtons } from "./faq/AskAiButtons";
import { FaqItem } from "./faq/FaqItem";
import styles from "./FAQ.module.css";

// §12c - FAQ: a centered title block (Inter eyebrow + blur word-reveal heading + Ask-AI pills) over a
// hairline-ruled list. Answers start collapsed and open on hover (pointer devices) or tap (touch) - see FaqItem.
// All responsive sizing lives in FAQ.module.css, mirroring Compliance.module.css breakpoints.

export function FAQ() {
  return (
    <section id="faq" data-nav-theme="light" className={`${styles.section} w-full bg-white`}>
      <div className={styles.inner}>
        <WordRevealGroup className={styles.titleBlock}>
          <span className="flex items-center justify-center">
            <span className="font-illustration text-[14px] font-medium uppercase leading-[16.5px] text-text">
              {faq.eyebrow}
            </span>
          </span>

          <h2 className={`${styles.heading} font-light text-text`}>
            <Words text={faq.headline} />
          </h2>

          <Reveal delay={0.25} className="mt-2 w-full">
            <AskAiButtons />
          </Reveal>
        </WordRevealGroup>

        <RevealGroup className={`${styles.list} border-t border-black/10`} stagger={0.07}>
          {faq.items.map((item) => (
            <FaqItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
