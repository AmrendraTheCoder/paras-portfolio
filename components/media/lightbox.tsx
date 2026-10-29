"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Photo } from "@/lib/content";

/**
 * Photo lightbox. Arrow keys and the on-screen buttons move, Escape and the
 * backdrop close. The image is sized to the viewport and keeps its own ratio,
 * so a portrait never gets cropped to fit a landscape box.
 */
export function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo = photos[index];
  const count = photos.length;

  const step = useCallback(
    (d: number) => onIndex((index + d + count) % count),
    [index, count, onIndex],
  );

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, step]);

  const btn =
    "grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition-colors hover:bg-white hover:text-black";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${count}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-10"
      onClick={onClose}
    >
      <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className={`${btn} absolute right-4 top-4 z-10 sm:right-6 sm:top-6`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo" className={`${btn} absolute left-3 top-1/2 z-10 -translate-y-1/2 sm:left-6`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo" className={`${btn} absolute right-3 top-1/2 z-10 -translate-y-1/2 sm:right-6`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 5l7 7-7 7" /></svg>
      </button>

      <figure className="flex max-h-full max-w-full flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="max-h-[calc(100vh-7rem)] w-auto max-w-full rounded-[var(--radius-md)] object-contain"
          decoding="async"
        />
        <figcaption className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">
          {index + 1} / {count} <span aria-hidden>·</span> {photo.alt}
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
}
