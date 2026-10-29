"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { resolvePlayable } from "@/lib/video";
import type { VideoSource } from "@/lib/content";
import { Poster } from "@/components/media/poster";

/**
 * Fullscreen player, opened by "Play with sound" and by the work cards.
 *
 * Portalled to <body> so no ancestor transform or overflow can clip it. Escape
 * closes, focus lands on the close button, the page behind stops scrolling,
 * and the backdrop click closes too. Plays whatever `full` resolves to: an
 * embed for YouTube/Vimeo, a native player for a direct file, and an honest
 * placeholder when no full video has been linked yet.
 */
export function VideoModal({
  video,
  title,
  onClose,
}: {
  video: VideoSource;
  title: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const playable = resolvePlayable(video.full);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const [w, h] = video.aspect;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title}, video player`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition-colors hover:bg-white hover:text-black sm:right-6 sm:top-6"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div
        className="relative w-full max-w-[min(96vw,calc((100vh-6rem)*var(--ar)))] overflow-hidden rounded-[var(--radius-lg)] bg-black"
        style={{ aspectRatio: `${w} / ${h}`, ["--ar" as string]: `${w / h}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {playable?.kind === "iframe" ? (
          <iframe
            src={playable.src}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : playable?.kind === "file" ? (
          <video
            className="absolute inset-0 h-full w-full"
            src={playable.src}
            poster={video.poster}
            controls
            autoPlay
            playsInline
            preload="metadata"
          />
        ) : (
          <>
            <Poster src={video.poster} alt="" />
            <p className="absolute inset-x-0 bottom-0 bg-black/70 px-5 py-4 text-center font-mono text-[12px] uppercase tracking-[0.14em] text-white/80">
              [PLACEHOLDER: full video not linked yet]
            </p>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
