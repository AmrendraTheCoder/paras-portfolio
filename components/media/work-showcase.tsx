"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
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
 * On a desktop with a fine pointer the section pins and the panels travel
 * sideways as you scroll down, skewing and springing with the scroll velocity
 * so the row feels like it has weight — the Jesper Landberg horizontal-scroll
 * idea, rebuilt on this site's motion stack so it coexists with the page's
 * smooth scroll. On touch and under reduced motion it is an ordinary
 * swipeable, snapping row with none of the pinning. Same cards either way, so
 * the hover previews and links are unchanged.
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

function Panel({ project, index, offset }: { project: Project; index: number; offset: string }) {
  return (
    <div className="flex w-[clamp(300px,34vw,560px)] shrink-0 items-center" style={{ transform: `translateY(${offset})` }}>
      <div className="w-full">
        <WorkCard project={project} index={index} />
      </div>
    </div>
  );
}

// Fixed vertical offsets give the row rhythm, like the reference's staggered slides.
const OFFSETS = ["-4%", "6%", "-2%", "8%", "0%", "4%"];

function Pinned({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({ travel: 0, height: 0 });

  // Measure how far the track must travel, and set the spacer height so that
  // horizontal travel maps 1:1 onto the vertical scroll while pinned.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const travel = Math.max(0, track.scrollWidth - vw);
      setMetrics({ travel, height: travel + vh });
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
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -metrics.travel]);
  const x = useSpring(xRaw, { stiffness: 140, damping: 28, restDelta: 0.5 });

  // Velocity drives a little skew and a vertical squash, the reference's feel.
  const vel = useVelocity(x);
  const skew = useSpring(useTransform(vel, [-3000, 0, 3000], [5, 0, -5]), { stiffness: 200, damping: 30 });
  const squash = useSpring(useTransform(vel, (v) => 1 - Math.min(Math.abs(v) * 0.00004, 0.06)), { stiffness: 200, damping: 30 });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="work" ref={sectionRef} className="relative" style={{ height: metrics.height || "100vh" }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <GhostWord align="right">Work</GhostWord>
        <div className="shell relative w-full">
          <SectionHeader index="01" eyebrow="Selected work" title="Films, aftermovies and motion" />
        </div>

        <motion.div
          ref={trackRef}
          style={{ x, skewX: skew, scaleY: squash }}
          className="flex origin-left items-center gap-6 pl-[clamp(20px,5vw,48px)] pr-[25vw] will-change-transform"
        >
          {projects.map((p, i) => (
            <Panel key={p.slug} project={p} index={i} offset={OFFSETS[i % OFFSETS.length]} />
          ))}
        </motion.div>

        {/* Progress rail, like the reference's scrollbar handle. */}
        <div className="shell mt-8 w-full">
          <div className="relative h-px w-full bg-[var(--line)]">
            <motion.div className="absolute inset-y-0 left-0 bg-[var(--accent)]" style={{ width: progress }} />
          </div>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-muted)]">
            Scroll · {projects.length} projects
          </p>
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
          <div key={p.slug} className="w-[78vw] shrink-0 snap-start sm:w-[46vw]">
            <WorkCard project={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
