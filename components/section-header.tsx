"use client";

import { Reveal } from "@/components/reveal";

/**
 * Every section header on the page is this component.
 *
 * The old page mixed centred and left-aligned headings with no anchor, so each
 * section started from nothing and the eye had to re-find the left edge every
 * time. Here: an index number, a rule that runs to the gutter, the eyebrow, and
 * the title, always in the same place, so the page has a spine.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
}: {
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <Reveal className="mb-14 sm:mb-16">
      <div className="mb-6 flex items-center gap-4">
        <span className="font-mono text-[12px] font-medium tracking-[0.16em] text-[var(--accent-text)]">
          {index}
        </span>
        <span className="h-px flex-1 bg-[var(--line)]" aria-hidden />
        <span className="eyebrow">{eyebrow}</span>
      </div>

      <h2 className="max-w-[16ch] text-[clamp(2.1rem,4vw,3.1rem)] leading-[1.08] tracking-[-0.022em]">
        {title}
      </h2>

      {lede ? (
        <p className="mt-5 max-w-[54ch] text-[17px] leading-[1.6] text-[var(--fg-muted)]">
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}
