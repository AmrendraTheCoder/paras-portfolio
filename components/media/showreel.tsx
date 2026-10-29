"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { VideoSource } from "@/lib/content";
import { Poster } from "@/components/media/poster";
import { VideoModal } from "@/components/media/video-modal";
import { PlayIcon } from "@/components/icons";

/**
 * The hero showreel.
 *
 * Muted, looping, inline, with its poster declared and its aspect ratio fixed
 * so the frame is reserved before a byte of video arrives. Under reduced motion
 * nothing autoplays: the poster stands in and the button still opens the
 * player, where playing is the person's own choice. If the preview file is
 * missing or unsupported the poster stays, so the hero never shows a black box.
 */
export function Showreel({ video, title }: { video: VideoSource; title: string }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const [w, h] = video.aspect;

  // Hold the loop while the modal plays so two copies never run at once.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (open) v.pause();
    else if (!reduced) v.play().catch(() => {});
  }, [open, reduced]);

  const autoplay = !reduced && !failed && Boolean(video.previewMp4);

  return (
    <figure
      className="relative overflow-hidden rounded-[var(--radius-bento)] border border-[var(--line)] bg-black shadow-[var(--shadow-lift)]"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      {autoplay ? (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={video.poster}
          aria-label={`${title}, muted preview`}
        >
          {video.previewWebm ? <source src={video.previewWebm} type="video/webm" /> : null}
          <source src={video.previewMp4} type="video/mp4" onError={() => setFailed(true)} />
        </video>
      ) : (
        <Poster src={video.poster} alt={`${title} poster`} priority />
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group absolute bottom-4 left-4 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-black/55 px-4 py-2.5 text-[14px] font-medium text-white backdrop-blur-md transition-colors duration-[var(--duration-base)] hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] sm:bottom-6 sm:left-6 sm:px-5 sm:py-3"
      >
        <PlayIcon className="h-4 w-4" />
        Play with sound
      </button>

      {open ? <VideoModal video={video} title={title} onClose={() => setOpen(false)} /> : null}
    </figure>
  );
}
