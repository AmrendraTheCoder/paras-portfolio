"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { useBrand } from "@/components/use-brand";
import { readableFill } from "@/lib/readable";
import { tools, type Tool } from "@/lib/content";

/**
 * The rack from the old Garage: cards resting on a plank, each leaning a
 * little, each owning its brand colour. Hover straightens one, lifts it off
 * the plank and floods it with its colour, with the label switched to an ink
 * that stays readable. Five tools, one shelf, no bars and no percentages.
 */
const LEANS = [-4.5, 2.5, -1.5, 3.5, -3];

function Mark({ tool, className }: { tool: Tool; className: string }) {
  if (tool.mark.kind === "path") {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-hidden className={className}>
        <path d={tool.mark.d} />
      </svg>
    );
  }
  return (
    <span
      aria-hidden
      className="grid h-9 w-9 place-items-center rounded-[6px] font-display text-[15px] font-bold tracking-[-0.03em] sm:h-10 sm:w-10 sm:text-[16px]"
      style={{ background: tool.mark.bg, color: tool.mark.fg }}
    >
      {tool.mark.letters}
    </span>
  );
}

function ToolCard({ tool, lean, onHover }: { tool: Tool; lean: number; onHover: (t: Tool | null) => void }) {
  const reduced = useReducedMotion();
  const brand = useBrand(tool.brand, tool.brandDark);
  const { ink, fill } = readableFill(brand);

  return (
    <motion.a
      href={tool.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${tool.name}. ${tool.note}.`}
      onMouseEnter={() => onHover(tool)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(tool)}
      onBlur={() => onHover(null)}
      style={{ "--brand": brand, "--brand-fill": fill, "--on-brand": ink } as React.CSSProperties}
      initial={false}
      animate={reduced ? undefined : { rotate: lean }}
      whileHover={reduced ? undefined : { rotate: 0, y: -16, scale: 1.07 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
      className="group/tool relative flex w-[104px] shrink-0 flex-col items-center gap-3 rounded-[var(--radius-xl)] border border-[var(--line)] bg-[var(--bg-tile)] px-3 py-5 shadow-[var(--shadow-tile)] transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-quint)] will-change-transform hover:border-[var(--brand)] hover:shadow-[var(--shadow-lift)] sm:w-[120px] sm:px-4 sm:py-6"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-xl)] bg-[var(--brand-fill)] opacity-0 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-quint)] group-hover/tool:opacity-100"
      />
      <Mark
        tool={tool}
        className="relative h-9 w-9 fill-[var(--fg-muted)] transition-colors duration-[var(--duration-base)] group-hover/tool:fill-[var(--on-brand)] sm:h-10 sm:w-10"
      />
      <span className="relative text-center text-[12.5px] font-medium leading-tight text-[var(--fg-body)] transition-colors duration-[var(--duration-micro)] group-hover/tool:text-[var(--on-brand)]">
        {tool.name}
      </span>
    </motion.a>
  );
}

export function Tools() {
  const [active, setActive] = useState<Tool | null>(null);

  return (
    <section id="tools" className="relative section-rhythm-sm scroll-mt-24">
      <div className="shell">
        <SectionHeader index="05" eyebrow="Tools" title="What is on the shelf" lede="The tools are only half the story." />

        <Reveal>
          <div className="relative -mx-[clamp(20px,5vw,48px)] px-[clamp(20px,5vw,48px)]">
            <div className="-mt-10 overflow-x-auto pb-2 pt-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="relative w-fit min-w-full pb-5">
                <ul className="relative z-10 flex items-end justify-center gap-3 sm:gap-4">
                  {tools.map((tool, i) => (
                    <li key={tool.name}>
                      <ToolCard tool={tool} lean={LEANS[i % LEANS.length]} onHover={setActive} />
                    </li>
                  ))}
                </ul>
                <div
                  aria-hidden
                  className="absolute inset-x-5 bottom-2 h-2.5 rounded-full"
                  style={{ background: "linear-gradient(180deg, var(--accent) 0%, color-mix(in oklab, var(--accent) 55%, black) 100%)" }}
                />
                <div aria-hidden className="absolute inset-x-9 bottom-0 h-5 rounded-full opacity-25 blur-lg" style={{ background: "var(--accent)" }} />
              </div>
            </div>
          </div>
        </Reveal>

        <p
          aria-live="polite"
          className="mt-8 flex min-h-[3.25rem] items-start justify-center text-center text-[15.5px] leading-[1.5] text-[var(--fg-muted)] transition-opacity duration-[var(--duration-base)] sm:min-h-[2.5rem]"
        >
          {active ? (
            <span className="max-w-[52ch]">
              <span className="font-medium text-[var(--fg)]">{active.name}</span>
              {": "}
              {active.note}.
            </span>
          ) : (
            <span className="max-w-[52ch] opacity-70">Point at one to see what it is for.</span>
          )}
        </p>
      </div>
    </section>
  );
}
