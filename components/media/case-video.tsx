import { resolvePlayable } from "@/lib/video";
import type { VideoSource } from "@/lib/content";
import { Poster } from "@/components/media/poster";

/**
 * The full video at the top of a case study. Server-rendered: an embed when
 * the host is YouTube or Vimeo, a native player with controls for a direct
 * file, and the poster with a visible placeholder note when nothing is linked.
 * Nothing autoplays here; this page is for watching on purpose.
 */
export function CaseVideo({ video, title }: { video: VideoSource; title: string }) {
  const playable = resolvePlayable(video.full);
  const [w, h] = video.aspect;

  return (
    <figure
      className="relative overflow-hidden rounded-[var(--radius-bento)] border border-[var(--line)] bg-black shadow-[var(--shadow-lift)]"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      {playable?.kind === "iframe" ? (
        <iframe
          src={playable.src.replace("autoplay=1", "autoplay=0")}
          title={title}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : playable?.kind === "file" ? (
        <video
          className="absolute inset-0 h-full w-full"
          src={playable.src}
          poster={video.poster}
          controls
          playsInline
          preload="metadata"
        />
      ) : (
        <>
          <Poster src={video.poster} alt={`${title} poster`} priority />
          <p className="absolute inset-x-0 bottom-0 bg-black/70 px-5 py-4 text-center font-mono text-[12px] uppercase tracking-[0.14em] text-white/80">
            [PLACEHOLDER: full video not linked yet]
          </p>
        </>
      )}
    </figure>
  );
}
