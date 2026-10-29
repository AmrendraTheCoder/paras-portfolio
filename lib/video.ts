/**
 * Works out how to play a "full" video from its URL alone, so the content file
 * can point at whichever host Paras settles on without any component changing.
 *
 *   youtube.com/watch?v=ID, youtu.be/ID   →  privacy-enhanced YouTube embed (the chosen host)
 *   vimeo.com/ID, player.vimeo.com/video/ID →  Vimeo embed (kept in case a client file lives there;
 *                                              player.vimeo.com would need adding to the CSP)
 *   anything else, e.g. /videos/x.mp4        →  a native <video>
 */
export type Playable =
  | { kind: "iframe"; src: string; provider: "youtube" | "vimeo" }
  | { kind: "file"; src: string };

/** The canonical watch URL for a YouTube video, for structured data. */
export function youtubeId(url: string | undefined): string | null {
  const p = resolvePlayable(url);
  if (!p || p.kind !== "iframe" || p.provider !== "youtube") return null;
  return new URL(p.src).pathname.split("/").pop() ?? null;
}

export function resolvePlayable(url: string | undefined): Playable | null {
  // A slot that still reads "[PLACEHOLDER …]" is a gap, not a URL.
  if (!url || /\[(PLACEHOLDER|URL)/i.test(url)) return null;
  let u: URL;
  try {
    u = new URL(url, "https://local.invalid");
  } catch {
    return { kind: "file", src: url };
  }
  const host = u.hostname.replace(/^www\.|^m\./, "");
  const last = () => u.pathname.split("/").filter(Boolean).pop() ?? "";

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const id = u.searchParams.get("v") ?? last();
    return {
      kind: "iframe",
      provider: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
    };
  }
  if (host === "youtu.be") {
    return {
      kind: "iframe",
      provider: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${last()}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
    };
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    return {
      kind: "iframe",
      provider: "vimeo",
      src: `https://player.vimeo.com/video/${last()}?autoplay=1&title=0&byline=0&portrait=0`,
    };
  }
  return { kind: "file", src: url };
}
