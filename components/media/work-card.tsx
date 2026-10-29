"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Project } from "@/lib/content";
import { isPlaceholder } from "@/lib/content";
import { Poster } from "@/components/media/poster";

/**
 * One project card, in the register of the LNMHACKS sponsor grid: a flat,
 * square-cornered frame, a neon tag pinned to the corner, and an editorial
 * row underneath in mono caps. On hover the frame swaps to its second state:
 * the preview loop if one exists, else the hover still, else a slow push-in.
 * Touch screens get the still; so does reduced motion. The card is the link.
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

export function WorkCard({ project, index, wide = false }: { project: Project; index: number; wide?: boolean }) {
  const reduced = useReducedMotion();
  const canHover = useCanHover();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const n = String(index + 1).padStart(2, "0");
  const live = canHover && !reduced && !failed && Boolean(project.video.previewMp4);
  const swap = !live && Boolean(project.hoverImage);

  const play = () => videoRef.current?.play().catch(() => {});
  const stop = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block cursor-pointer focus-visible:outline-none"
      style={{ "--tint": project.tint } as React.CSSProperties}
      onPointerEnter={live ? play : undefined}
      onPointerLeave={live ? stop : undefined}
      onFocus={live ? play : undefined}
      onBlur={live ? stop : undefined}
    >
      <figure
        className={`relative overflow-hidden border border-[var(--line)] bg-black transition-[transform,border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-quint)] group-hover:scale-[1.01] group-hover:border-[var(--tint)] group-hover:shadow-[var(--shadow-lift)] group-focus-visible:border-[var(--tint)] ${
          wide ? "aspect-[16/9] sm:aspect-[16/10]" : "aspect-[4/3]"
        }`}
      >
        <Poster
          src={project.video.poster}
          alt={`${project.title} poster`}
          sizes={wide ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
          className={`transition-[opacity,transform] duration-[var(--duration-slow)] ease-[var(--ease-out-quint)] ${
            live || swap ? "group-hover:opacity-0" : "group-hover:scale-[1.04]"
          }`}
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
        ) : swap ? (
          <Poster
            src={project.hoverImage!}
            alt=""
            sizes={wide ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
            className="opacity-0 transition-opacity duration-[var(--duration-slow)] group-hover:opacity-100"
          />
        ) : null}

        {/* Neon tag, pinned to the corner with no radius: the LNMHACKS card’s signature. */}
        <span className="pointer-events-none absolute right-0 top-0 z-10 bg-[var(--accent)] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent-ink)]">
          {project.badge}
        </span>
      </figure>

      <figcaption className="mt-2.5 flex items-start justify-between gap-4 px-0.5">
        <span className="flex min-w-0 items-baseline gap-3">
          <span className="font-mono text-[11px] text-[var(--tint)]">{n}</span>
          <span
            className={`font-mono text-[12px] font-bold uppercase leading-[1.4] tracking-[0.12em] text-[var(--fg)] transition-colors duration-[var(--duration-micro)] group-hover:text-[var(--tint)] sm:text-[13px] ${
              isPlaceholder(project.title) ? "opacity-60" : ""
            }`}
          >
            {project.title}
          </span>
        </span>
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
          {project.year}
        </span>
      </figcaption>
    </Link>
  );
}
