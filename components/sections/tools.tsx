"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { readableFill } from "@/lib/readable";
import { tools, type Tool } from "@/lib/content";

/**
 * The tool rack: cards resting on a plank, each leaning a little. Hover
 * straightens one, lifts it off the plank and floods it with its colour, with
 * the glyph and labels switching to an ink that stays readable. The marks are
 * the site's own geometric glyphs in its own palette — no product logos.
 */
const LEANS = [-5, 2.5, -1.5, 3.5, -3];

function Glyph({ shape, className }: { shape: Tool["shape"]; className: string }) {
  const paths: Record<Tool["shape"], React.ReactNode> = {
    disc: <circle cx="12" cy="12" r="8.5" />,
    triangle: <path d="M12 3.5l8.5 15.5h-17z" />,
    square: <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="3.5" />,
    hex: <path d="M12 2.6l8.1 4.7v9.4L12 21.4 3.9 16.7V7.3z" />,
    blob: <path d="M12 3c4 0 7 2.2 7 6 0 2.4-1.4 3.4-1.4 5.4 0 2.2 1 2.9 1 4.3 0 1.4-1.6 2.3-4 2.3-3.6 0-9.6-1.9-9.6-9.1C5 6.3 8 3 12 3z" />,
  };
  return (
    <svg viewBox="0 0 24 24" role="img" aria-hidden className={className}>
      {paths[shape]}
    </svg>
  );
}

function ToolCard({ tool, lean, onHover }: { tool: Tool; lean: number; onHover: (t: Tool | null) => void }) {
  const reduced = useReducedMotion();
  const { ink, fill } = readableFill(tool.tint);

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
      style={{ "--brand": tool.tint, "--brand-fill": fill, "--on-brand": ink } as React.CSSProperties}
      initial={false}
      animate={reduced ? undefined : { rotate: lean }}
      whileHover={reduced ? undefined : { rotate: 0, y: -18, scale: 1.06 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
      className="group/tool relative flex w-[132px] shrink-0 flex-col items-center gap-3 rounded-[var(--radius-xl)] border border-[var(--line)] bg-[var(--bg-tile)] px-4 py-6 shadow-[var(--shadow-tile)] transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-quint)] will-change-transform hover:border-[var(--brand)] hover:shadow-[var(--shadow-lift)] sm:w-[156px] sm:py-7"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-xl)] bg-[var(--brand-fill)] opacity-0 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-out-quint)] group-hover/tool:opacity-100"
      />
      <span
        className="relative grid h-14 w-14 place-items-center rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg-raised)] transition-colors duration-[var(--duration-base)] group-hover/tool:border-transparent group-hover/tool:bg-black/10 sm:h-16 sm:w-16"
      >
        <Glyph
          shape={tool.shape}
          className="h-7 w-7 transition-colors duration-[var(--duration-base)] sm:h-8 sm:w-8"
        />
      </span>
      <span className="relative text-center">
        <span className="block text-[13.5px] font-medium leading-tight text-[var(--fg)] transition-colors duration-[var(--duration-micro)] group-hover/tool:text-[var(--on-brand)]">
          {tool.name}
        </span>
        <span className="mt-1 block font-mono text-[9.5px] uppercase tracking-[0.16em] text-[var(--fg-muted)] transition-colors group-hover/tool:text-[color-mix(in_oklab,var(--on-brand)_75%,transparent)]">
          {tool.discipline}
        </span>
      </span>
    </motion.a>
  );
}

export function Tools() {
  const [active, setActive] = useState<Tool | null>(null);

  return (
    <section id="tools" className="relative section-rhythm scroll-mt-24">
      <div className="shell">
        <SectionHeader index="06" eyebrow="Tools" title="What is on the shelf" lede="The toolkit behind the motion, the stills and the vectors. The tools are only half the story." />

        <Reveal>
          <div className="relative mx-auto max-w-[920px]">
            <div className="-mx-[clamp(20px,5vw,48px)] overflow-x-auto px-[clamp(20px,5vw,48px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="relative w-fit min-w-full pb-6 pt-12">
                <ul className="relative z-10 flex items-end justify-center gap-4 sm:gap-6">
                  {tools.map((tool, i) => (
                    <li key={tool.name}>
                      <ToolCard tool={tool} lean={LEANS[i % LEANS.length]} onHover={setActive} />
                    </li>
                  ))}
                </ul>
                <div
                  aria-hidden
                  className="absolute inset-x-2 bottom-3 h-3 rounded-full"
                  style={{ background: "linear-gradient(180deg, var(--accent) 0%, color-mix(in oklab, var(--accent) 50%, black) 100%)" }}
                />
                <div aria-hidden className="absolute inset-x-8 bottom-0 h-6 rounded-full opacity-30 blur-xl" style={{ background: "var(--accent)" }} />
              </div>
            </div>
          </div>
        </Reveal>

        <p
          aria-live="polite"
          className="mx-auto mt-8 flex min-h-[3.25rem] max-w-[56ch] items-start justify-center text-center text-[16px] leading-[1.55] text-[var(--fg-muted)] transition-opacity duration-[var(--duration-base)] sm:min-h-[2.5rem]"
        >
          {active ? (
            <span>
              <span className="font-medium text-[var(--fg)]">{active.name}</span>
              {" — "}
              {active.note}.
            </span>
          ) : (
            <span className="opacity-70">Point at one to see what it is for.</span>
          )}
        </p>
      </div>
    </section>
  );
}
