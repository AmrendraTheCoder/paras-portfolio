"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/lib/content";
import { Lightbox } from "@/components/media/lightbox";
import { StaggerGrid, StaggerItem } from "@/components/reveal";

/**
 * Masonry by CSS columns: no measuring, no layout script, and because every
 * photo declares its real width and height the browser reserves each slot
 * before the file arrives. Everything is lazy; the first row is the only thing
 * near the fold and even that is below the showreel and the work grid.
 */
function Thumb({ photo, onOpen }: { photo: Photo; onOpen: () => void }) {
  const common =
    "block h-auto w-full rounded-[var(--radius-lg)] transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-quint)] group-hover:scale-[1.015]";
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--bg-tile)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
      aria-label={`Open photo: ${photo.alt}`}
    >
      {photo.src.endsWith(".svg") ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" className={common} />
      ) : (
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          loading="lazy"
          className={common}
        />
      )}
    </button>
  );
}

export function MasonryGallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <StaggerGrid className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {photos.map((photo, i) => (
          <StaggerItem key={photo.src}>
            <Thumb photo={photo} onOpen={() => setOpen(i)} />
          </StaggerItem>
        ))}
      </StaggerGrid>
      {open !== null ? (
        <Lightbox photos={photos} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
      ) : null}
    </>
  );
}
