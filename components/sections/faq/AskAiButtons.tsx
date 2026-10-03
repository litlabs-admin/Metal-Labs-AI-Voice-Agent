import Image from "next/image";
import { faq } from "@/lib/content";
import { cn } from "@/lib/cn";

// "Ask ChatGPT / Ask Claude" pills under the FAQ heading. Plain links: each opens the assistant in
// a new tab with faq.askPrompt pre-filled via its ?q= parameter (ChatGPT sends it automatically,
// Claude waits for the visitor to press Enter).

export function AskAiButtons({ className }: { className?: string }) {
  const q = encodeURIComponent(faq.askPrompt);
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
      {faq.askAi.map((ai) => (
        <a
          key={ai.name}
          href={`${ai.href}${q}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ask ${ai.name} about Metal Labs (opens in a new tab)`}
          className="group inline-flex min-w-[220px] items-center gap-3 rounded-full border border-black/10 bg-white py-3 pl-5 pr-4 text-[17px] leading-none text-text shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.04)] outline-none transition-[transform,box-shadow,border-color] duration-300 ease-(--ease-out-ml) hover:-translate-y-0.5 hover:border-black/15 hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_10px_24px_rgba(0,0,0,0.08)] focus-visible:shadow-[0_0_0_2px_#4e87fc] active:translate-y-0 active:scale-[0.97]"
        >
          <Image
            src={ai.icon}
            alt=""
            width={20}
            height={20}
            className={cn(
              "size-5 flex-none transition-transform duration-500 ease-(--ease-out-ml) group-hover:scale-[1.08]",
              ai.name === "Claude" && "group-hover:rotate-45",
            )}
          />
          <span className="whitespace-nowrap">
            Ask <span className="font-semibold">{ai.name}</span>
          </span>
          <svg
            aria-hidden
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="ml-auto flex-none text-muted-2 transition-[transform,color] duration-300 ease-(--ease-out-ml) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-text"
          >
            <path
              d="M3.5 8.5l5-5M4 3.5h4.5V8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      ))}
    </div>
  );
}
