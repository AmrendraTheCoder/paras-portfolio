"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Project } from "@/lib/content";
import { isPlaceholder } from "@/lib/content";
import { Poster } from "@/components/media/poster";

/**
 * One project in the Selected Work grid.
 *
 * The preview loop is only mounted for a fine pointer that can hover, and only
 * fetched (preload="none") once the pointer actually arrives, so a page of six
 * cards costs six posters and nothing else until someone shows interest. Touch
 * screens get the still; so does anyone who asked for reduced motion. The
 * whole card is the link to the case study.
 */
function useCanHover() {
  const [can, setCan] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const read = () => setCan(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  return can;
}

export function WorkCard({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedMotion();
  const canHover = useCanHover();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [w, h] = project.video.aspect;
  const n = String(index + 1).padStart(2, "0");
  const live = canHover && !reduced && !failed && Boolean(project.video.previewMp4);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  };
  const stop = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block focus-visible:outline-none"
      style={{ "--tint": project.tint } as React.CSSProperties}
      onPointerEnter={live ? play : undefined}
      onPointerLeave={live ? stop : undefined}
      onFocus={live ? play : undefined}
      onBlur={live ? stop : undefined}
    >
      <figure
        className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-black
                   transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-quint)]
                   group-hover:border-[var(--tint)] group-hover:shadow-[var(--shadow-lift)]
                   group-focus-visible:border-[var(--tint)]"
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        <Poster
          src={project.video.poster}
          alt={`${project.title} poster`}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={live ? "transition-opacity duration-[var(--duration-slow)] group-hover:opacity-0" : ""}
        />
        {live ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[var(--duration-slow)] group-hover:opacity-100"
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            tabIndex={-1}
          >
            {project.video.previewWebm ? <source src={project.video.previewWebm} type="video/webm" /> : null}
            <source src={project.video.previewMp4} type="video/mp4" onError={() => setFailed(true)} />
          </video>
        ) : null}

        {project.status === "coming-soon" ? (
          <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-white backdrop-blur">
            Coming soon
          </span>
        ) : null}
      </figure>

      <figcaption className="mt-4 flex items-baseline gap-4">
        <span className="font-mono text-[12px] font-medium tracking-[0.16em] text-[var(--tint)]">{n}</span>
        <div className="min-w-0 flex-1">
          <h3
            className={`font-display text-[clamp(1.35rem,2.2vw,1.7rem)] leading-[1.15] tracking-[-0.015em] text-[var(--fg)] ${
              isPlaceholder(project.title) ? "opacity-60" : ""
            }`}
          >
            {project.title}
          </h3>
          <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-muted)]">
            {project.year} <span aria-hidden>·</span> {project.role}
          </p>
        </div>
      </figcaption>
    </Link>
  );
}
