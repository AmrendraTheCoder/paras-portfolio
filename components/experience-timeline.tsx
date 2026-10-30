"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { isPlaceholder, type Role } from "@/lib/content";

/**
 * The Experience timeline. Two colours only: black and orange.
 *
 * Desktop: a sticky readout on the left (the live index, the organisation and
 * the role you are reading) and the roles on the right, threaded on a rail that
 * fills with orange as you scroll. The row at the centre of the viewport is in
 * the spotlight; the others step back. Hovering a name wipes it orange.
 *
 * Phone: no sticky readout, just the rail and the rows.
 * Reduced motion: every row at full strength, the rail drawn solid.
 */
const ORANGE = "#ff6a1f";
const INK = "#0a0a0a";

export function ExperienceTimeline({ roles }: { roles: Role[] }) {
  const reduced = useReducedMotion();
  const list = useRef<HTMLOListElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: list, offset: ["start 60%", "end 50%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, [roles.length]);

  const total = String(roles.length).padStart(2, "0");
  const current = roles[active] ?? roles[0];
  if (!current) return null;

  const jump = (i: number) => rows.current[i]?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="relative scroll-mt-24 px-3 py-6 sm:px-4"
      style={{ ["--o" as string]: ORANGE, ["--ink" as string]: INK }}
    >
      <div className="relative overflow-hidden rounded-[28px] bg-[var(--ink)] text-white">
        {/* a single orange glow, low and off-centre, so the black has depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full opacity-[0.18] blur-[120px]"
          style={{ background: ORANGE }}
        />
        {/* fine grid, white at 4% */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="shell relative !max-w-[1380px] py-20 sm:py-28">
          {/* header */}
          <div className="mb-14 flex items-center gap-4 sm:mb-20">
            <span className="font-mono text-[12px] font-medium tracking-[0.16em] text-[var(--o)]">05</span>
            <span className="h-px flex-1 bg-white/15" aria-hidden />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">Experience</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* sticky readout */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <h2
                  id="experience-title"
                  className="max-w-[12ch] font-display text-[clamp(2.4rem,5vw,4.2rem)] font-bold leading-[0.98] tracking-[-0.03em]"
                >
                  Where the <span className="text-[var(--o)]">work</span> has been
                </h2>

                <div className="mt-12 hidden lg:block">
                  <div className="flex items-end gap-3 font-display font-bold leading-none tracking-[-0.04em]">
                    <span className="relative inline-block h-[clamp(5rem,9vw,8rem)] overflow-hidden text-[clamp(5rem,9vw,8rem)] text-[var(--o)] tabular-nums">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={active}
                          initial={reduced ? false : { y: "100%" }}
                          animate={{ y: "0%" }}
                          exit={reduced ? undefined : { y: "-100%" }}
                          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                          className="block"
                        >
                          {String(active + 1).padStart(2, "0")}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span
                      className="pb-3 text-[clamp(1.6rem,2.6vw,2.2rem)] text-transparent"
                      style={{ WebkitTextStroke: "1px rgba(255,255,255,0.35)" }}
                    >
                      /{total}
                    </span>
                  </div>

                  <div className="mt-6 h-[4.5rem] overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={active}
                        initial={reduced ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduced ? undefined : { opacity: 0, y: -14 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">Now reading</p>
                        <p className="mt-2 text-[20px] font-medium">
                          {current.org} <span className="text-white/40">·</span>{" "}
                          <span className="text-[var(--o)]">{current.role}</span>
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* index: one tick per role, the active one orange */}
                  <ul className="mt-8 space-y-1 border-t border-white/10 pt-6">
                    {roles.map((r, i) => (
                      <li key={`${r.org}-${i}`}>
                        <button
                          type="button"
                          onClick={() => jump(i)}
                          className="group flex w-full items-center gap-4 py-1.5 text-left"
                        >
                          <span
                            className="h-px transition-all duration-500"
                            style={{
                              width: i === active ? 40 : 16,
                              background: i === active ? ORANGE : "rgba(255,255,255,0.25)",
                            }}
                          />
                          <span
                            className={`font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                              i === active ? "text-white" : "text-white/40 group-hover:text-white/75"
                            }`}
                          >
                            {r.org}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* the rail and the roles */}
            <div className="relative lg:col-span-7">
              <span aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-white/12" />
              <motion.span
                aria-hidden
                className="absolute bottom-0 left-[7px] top-0 w-px origin-top"
                style={{
                  background: `linear-gradient(to bottom, ${ORANGE}, ${ORANGE})`,
                  boxShadow: `0 0 12px ${ORANGE}`,
                  scaleY: reduced ? 1 : fill,
                }}
              />

              <ol ref={list} className="relative">
                {roles.map((job, i) => {
                  const on = reduced || i === active;
                  const passed = reduced || i <= active;
                  return (
                    <li
                      key={`${job.org}-${job.role}-${i}`}
                      ref={(el) => {
                        rows.current[i] = el;
                      }}
                      data-i={i}
                      className="group relative pb-16 pl-12 last:pb-0 sm:pl-16 sm:pb-24"
                    >
                      {/* node */}
                      <span
                        aria-hidden
                        className="absolute left-0 top-[0.55rem] grid h-[15px] w-[15px] place-items-center rotate-45 border transition-all duration-500"
                        style={{
                          borderColor: passed ? ORANGE : "rgba(255,255,255,0.3)",
                          background: passed ? ORANGE : INK,
                          boxShadow: on ? `0 0 0 6px rgba(255,106,31,0.15), 0 0 24px ${ORANGE}` : "none",
                        }}
                      />

                      <div
                        className="transition-[opacity,filter] duration-500"
                        style={{ opacity: on ? 1 : 0.32, filter: on ? "none" : "blur(0.4px)" }}
                      >
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span className="font-mono text-[11px] tracking-[0.16em] text-white/45">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--o)] ${
                              isPlaceholder(job.period) ? "opacity-50" : ""
                            }`}
                          >
                            {job.period}
                          </span>
                        </div>

                        <h3 className="relative mt-4 font-display text-[clamp(2.2rem,5.2vw,4.4rem)] font-bold uppercase leading-[0.92] tracking-[-0.035em]">
                          <span className="block text-white">{job.org}</span>
                          {/* the orange wipe on hover */}
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 block text-[var(--o)] transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0%_0_0)]"
                          >
                            {job.org}
                          </span>
                        </h3>

                        <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--o)]/60 px-3.5 py-1.5 text-[13px] font-medium text-white">
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--o)]" aria-hidden />
                          {job.role}
                        </span>

                        <p
                          className={`mt-5 max-w-[52ch] text-[15.5px] leading-[1.65] text-white/60 ${
                            isPlaceholder(job.line) ? "opacity-60" : ""
                          }`}
                        >
                          {job.line}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
