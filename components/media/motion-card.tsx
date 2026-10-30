"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { MotionGraphic } from "@/lib/content";
import { isPlaceholder } from "@/lib/content";
import { youtubeLoopEmbed } from "@/lib/video";
import { Poster } from "@/components/media/poster";
import { VideoModal } from "@/components/media/video-modal";
import { PlayIcon } from "@/components/icons";

/**
 * One motion-graphics tile. A video item hover-plays its YouTube link muted and
 * looping, and opens fullscreen on click; an image item just shows the still.
 * Touch and reduced motion keep the poster. Same visual language as the work
 * cards so the page reads as one system.
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

export function MotionCard({ item }: { item: MotionGraphic }) {
  const reduced = useReducedMotion();
  const canHover = useCanHover();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [w, h] = item.aspect;

  const isVideo = item.kind === "video";
  const yt = isVideo ? youtubeLoopEmbed(item.youtube) : null;
  const liveYt = canHover && !reduced && Boolean(yt);
  const poster = item.poster || item.src || "/posters/showreel.svg";
  const img = isVideo ? poster : item.src || poster;

  const Frame = (
    <figure
      className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-black transition-[border-color,box-shadow,transform] duration-[var(--duration-base)] ease-[var(--ease-out-quint)] group-hover:scale-[1.01] group-hover:border-[var(--accent)] group-hover:shadow-[var(--shadow-lift)]"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <Poster
        src={img}
        alt={`${item.title}${isPlaceholder(item.title) ? "" : " still"}`}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className={liveYt ? "transition-opacity duration-[var(--duration-slow)] group-hover:opacity-0" : ""}
      />
      {liveYt ? (
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-[var(--duration-slow)] group-hover:opacity-100">
          {hovered ? (
            <iframe src={yt!} title="" tabIndex={-1} allow="autoplay; encrypted-media" className="absolute inset-0 h-full w-full" referrerPolicy="strict-origin-when-cross-origin" />
          ) : null}
        </span>
      ) : null}
      {isVideo ? (
        <span className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur transition-colors group-hover:border-[var(--accent)]">
            <PlayIcon className="h-4 w-4" />
          </span>
        </span>
      ) : null}
    </figure>
  );

  return (
    <div
      className="group"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {isVideo ? (
        <button type="button" onClick={() => setOpen(true)} className="block w-full cursor-pointer text-left focus-visible:outline-none" aria-label={`Play ${item.title}`}>
          {Frame}
        </button>
      ) : (
        Frame
      )}

      <figcaption className="mt-3 flex items-baseline justify-between gap-3 px-0.5">
        <span className={`truncate text-[15px] font-medium text-[var(--fg)] ${isPlaceholder(item.title) ? "opacity-60" : ""}`}>{item.title}</span>
        {item.caption ? (
          <span className={`shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-muted)] ${isPlaceholder(item.caption) ? "opacity-60" : ""}`}>{item.caption}</span>
        ) : null}
      </figcaption>

      {open && isVideo ? (
        <VideoModal video={{ full: item.youtube, poster, aspect: item.aspect }} title={item.title} onClose={() => setOpen(false)} />
      ) : null}
    </div>
  );
}
