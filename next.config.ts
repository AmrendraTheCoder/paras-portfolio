import type { NextConfig } from "next";

/**
 * Response headers and image policy. Almost everything on this site is static
 * files, so the hardening is all here.
 *
 * Full videos are hosted off-git. Each provider the content file may point at
 * needs its player (frame-src), its media files (media-src), its thumbnails
 * (img-src) and, for HLS players, its API (connect-src) allowed by name. Remove
 * the ones that end up unused once the host is chosen.
 */
const VIDEO_FRAME_HOSTS = ["https://www.youtube-nocookie.com", "https://player.vimeo.com"];
const VIDEO_MEDIA_HOSTS = ["https://res.cloudinary.com", "https://stream.mux.com"];
const VIDEO_IMAGE_HOSTS = [
  "https://i.ytimg.com",
  "https://i.vimeocdn.com",
  "https://res.cloudinary.com",
  "https://image.mux.com",
];

/**
 * `script-src` keeps `'unsafe-inline'` deliberately: Next emits inline
 * bootstrap and hydration scripts whose content changes every build, and a
 * nonce would force every page to render dynamically. External `<script src>`
 * stays blocked, which is how injected script is normally delivered.
 * `style-src` allows inline styles because Tailwind's arbitrary values and the
 * motion library both set style attributes at runtime.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  // React's dev tooling needs eval; production never does, so it is only
  // allowed while `next dev` is running.
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${VIDEO_IMAGE_HOSTS.join(" ")}`,
  `media-src 'self' blob: ${VIDEO_MEDIA_HOSTS.join(" ")}`,
  "font-src 'self'",
  `connect-src 'self' ${VIDEO_MEDIA_HOSTS.join(" ")}`,
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  `frame-src ${VIDEO_FRAME_HOSTS.join(" ")}`,
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Fullscreen is left on for the video modal; everything else the site never
  // uses is switched off so embedded players cannot reach for it either.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    // Photographs and posters are local. Only provider thumbnails are remote,
    // so the optimizer is scoped to exactly those hosts and 404s everything else.
    remotePatterns: VIDEO_IMAGE_HOSTS.map((h) => ({
      protocol: "https" as const,
      hostname: new URL(h).hostname,
    })),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
