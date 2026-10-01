import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { OG_IMAGE, TRUST_EMAIL, brand, trust, type TrustBlock } from "@/lib/content";

export const metadata: Metadata = {
  title: `${trust.title} | ${brand.name}`,
  description: trust.metaDescription,
  alternates: { canonical: "/trust" },
  openGraph: {
    type: "website",
    title: `${trust.title} | ${brand.name}`,
    description: trust.metaDescription,
    url: "/trust",
    images: [OG_IMAGE],
  },
};

/** "01", "02", ... from a zero-based section index. */
const sectionNumber = (i: number) => String(i + 1).padStart(2, "0");

// Reference document for a compliance reviewer, built on the same frame as
// /privacy: centred masthead, then a sticky numbered contents beside the
// sections on desktop. The one addition is the highlights strip - a reviewer
// scanning for four answers should find them before scrolling.
export default function TrustPage() {
  return (
    <article data-nav-theme="light" className="w-full bg-white">
      <section className="w-full px-6 pt-28 pb-14 text-center md:px-14 md:pt-36 md:pb-16 xl:px-18">
        <Reveal className="mx-auto flex w-full max-w-[820px] flex-col items-center gap-5">
          <Eyebrow>{trust.eyebrow}</Eyebrow>
          <h1 className="font-heading text-headline-xs font-light text-text md:text-headline-sm">
            {trust.title}
          </h1>
          <p className="max-w-[560px] text-[17px] leading-[1.6] text-muted">{trust.intro}</p>
          <p className="font-illustration text-[13px] text-muted">
            Last updated <time dateTime={trust.updatedAt}>{trust.updatedLabel}</time>
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-12 grid w-full max-w-[1040px] gap-px overflow-hidden rounded-card bg-hairline text-left sm:grid-cols-2 lg:grid-cols-4">
          {trust.highlights.map((h) => (
            <div key={h.term} className="flex flex-col gap-2 bg-white px-6 py-7">
              <span className="font-heading text-[16px] font-medium leading-[1.3] text-text">
                {h.term}
              </span>
              <span className="text-[14px] leading-[1.55] text-muted">{h.detail}</span>
            </div>
          ))}
        </Reveal>
      </section>

      <div className="w-full border-t border-hairline px-6 pt-14 pb-24 md:px-14 md:pt-20 md:pb-32 xl:px-18">
        <div className="mx-auto grid w-full max-w-[1040px] gap-12 md:grid-cols-[220px_minmax(0,1fr)] md:gap-16">
          <nav aria-label="Trust Center sections" className="hidden md:block">
            <div className="sticky top-28">
              <Eyebrow>On this page</Eyebrow>
              <ol className="mt-5 flex list-none flex-col gap-3 p-0">
                {trust.sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex gap-2 text-[14px] leading-[1.4] text-muted transition-colors duration-200 hover:text-text"
                    >
                      <span className="font-illustration tabular-nums">{sectionNumber(i)}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="min-w-0">
            {trust.sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className={i > 0 ? "mt-12 scroll-mt-28 border-t border-hairline pt-12" : "scroll-mt-28"}
              >
                <Reveal>
                  <span className="font-illustration text-[13px] font-medium tabular-nums text-muted">
                    {sectionNumber(i)}
                  </span>
                  <h2 className="mt-2 font-heading text-[26px] font-light leading-[1.25] text-text md:text-display-sm">
                    {section.title}
                  </h2>
                  <div className="mt-5 flex flex-col gap-4 text-[16px] leading-[1.7] text-text/80">
                    {section.blocks.map((block, j) => (
                      <TrustBlockView key={j} block={block} />
                    ))}
                  </div>
                </Reveal>
              </section>
            ))}

            <Reveal className="mt-14 flex flex-col items-start gap-3 rounded-card bg-ink px-7 py-8 md:px-9">
              <span className="font-illustration text-eyebrow font-medium uppercase text-mint">Contact</span>
              <p className="font-heading text-[22px] font-light leading-[1.3] text-text-on-dark">
                Reviewing Metal Labs? We answer security questionnaires.
              </p>
              <p className="max-w-[520px] text-[15px] leading-[1.6] text-text-on-dark/70">
                Ask us for the current subprocessor list, architecture detail, or a completed
                questionnaire in your own format.
              </p>
              <a
                href={`mailto:${TRUST_EMAIL}`}
                className="break-all text-[16px] text-white underline decoration-mint decoration-2 underline-offset-4"
              >
                {TRUST_EMAIL}
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </article>
  );
}

function TrustBlockView({ block }: { block: TrustBlock }) {
  if (block.type === "p") return <p>{block.text}</p>;

  if (block.type === "facts") {
    // A term/detail pair per row. Reads as a table on desktop without being
    // one, so it still reflows sensibly on a phone.
    return (
      <dl className="my-1 flex flex-col gap-0">
        {block.items.map((item) => (
          <div
            key={item.term}
            className="flex flex-col gap-1 border-t border-hairline py-4 first:border-t-0 first:pt-0 md:grid md:grid-cols-[200px_minmax(0,1fr)] md:gap-6"
          >
            <dt className="font-heading text-[15px] font-medium leading-[1.4] text-text">
              {item.term}
            </dt>
            <dd className="m-0 text-[15px] leading-[1.65] text-text/75">{item.detail}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <ul className="flex list-none flex-col gap-2.5 p-0">
      {block.items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
