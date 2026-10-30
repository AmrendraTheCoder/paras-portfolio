"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import type { Project } from "@/lib/content";
import { SectionHeader } from "@/components/section-header";
import { GhostWord } from "@/components/ghost-word";
import { WorkCard } from "@/components/media/work-card";

/**
 * Selected work as a horizontal reel.
 *
 * Desktop with a fine pointer: the section pins and the panels travel sideways
 * as you scroll, with a gentle velocity skew and a progress rail. Touch and
 * reduced motion get a swipeable snapping row. Same cards either way.
 */
export function WorkShowcase({ projects }: { projects: Project[] }) {
  const reduced = useReducedMotion();
  const [pin, setPin] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const read = () => setPin(mq.matches && !reduced);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, [reduced]);

  return pin ? <Pinned projects={projects} /> : <Swipe projects={projects} />;
}

function Panel({ project, index }: { project: Project; index: number }) {
  return (
    <div className="w-[clamp(300px,30vw,440px)] shrink-0">
      <WorkCard project={project} index={index} />
    </div>
  );
}

function Pinned({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({ travel: 0, height: 0 });

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const travel = Math.max(0, track.scrollWidth - vw);
      // Pad the scroll distance a little so the ends breathe before release.
      setMetrics({ travel, height: travel + vh * 1.1 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [projects.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const xRaw = useTransform(scrollYProgress, [0.04, 0.96], [0, -metrics.travel]);
  const x = useSpring(xRaw, { stiffness: 160, damping: 30, restDelta: 0.5 });

  const vel = useVelocity(x);
  const skew = useSpring(useTransform(vel, [-3000, 0, 3000], [3.5, 0, -3.5]), { stiffness: 200, damping: 34 });
  const progress = useTransform(scrollYProgress, [0.04, 0.96], ["0%", "100%"]);

  return (
    <section id="work" ref={sectionRef} className="relative bg-[var(--bg)]" style={{ height: metrics.height || "100vh" }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-24">
        <div className="shell relative w-full shrink-0">
          <GhostWord align="right">Work</GhostWord>
          <SectionHeader index="01" eyebrow="Selected work" title="Films, aftermovies and motion" />
        </div>

        {/* The reel, vertically centred in the space left under the header. */}
        <div className="flex min-h-0 flex-1 items-center">
          <motion.div
            ref={trackRef}
            style={{ x, skewX: skew }}
            className="flex origin-left items-center gap-10 pl-[clamp(20px,5vw,48px)] pr-[32vw] will-change-transform"
          >
            {projects.map((p, i) => (
              <Panel key={p.slug} project={p} index={i} />
            ))}
          </motion.div>
        </div>

        <div className="shell w-full shrink-0 pb-10">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]">
              Scroll to move <span aria-hidden>→</span>
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]">
              {projects.length} projects
            </p>
          </div>
          <div className="relative mt-3 h-px w-full bg-[var(--line)]">
            <motion.div className="absolute inset-y-0 left-0 bg-[var(--accent)]" style={{ width: progress }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Swipe({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className="relative overflow-hidden section-rhythm scroll-mt-24">
      <GhostWord align="right">Work</GhostWord>
      <div className="shell relative">
        <SectionHeader
          index="01"
          eyebrow="Selected work"
          title="Films, aftermovies and motion"
          lede="Swipe through, or open any one for the full film and the story behind it."
        />
      </div>
      <div className="-mx-[clamp(20px,5vw,48px)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(20px,5vw,48px)] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {projects.map((p, i) => (
          <div key={p.slug} className="w-[80vw] shrink-0 snap-start sm:w-[48vw]">
            <WorkCard project={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
