/**
 * Single source of truth for every word, link and asset on the site.
 * Sections render from this file; no copy lives inside a component.
 *
 * Anything Paras has not supplied yet is marked with [PLACEHOLDER] so the gaps
 * are easy to find. Nothing here is invented: when a fact is missing it is a
 * placeholder, not a guess.
 */

export const PLACEHOLDER = "[PLACEHOLDER]";

export const isPlaceholder = (s: string) => s.includes("[PLACEHOLDER") || s.includes("[EMAIL]") || s.includes("[URL]");

export const profile = {
  name: "Paras",
  /** Shown in the nav pill and the footer. */
  initials: "P",
  role: "Motion designer and storyteller",
  /** The one-line positioning under the name. */
  tagline: "Motion designer and storyteller.",
  location: "Jaipur, India",
  city: "Jaipur",
  email: "[EMAIL]",
  /** Supplied copy, used exactly as written. */
  bio: [
    "I am Paras, a fun, mischief and the someone who looks at things a little differently, I am a motion designer who loves to work on stories and themes, hinged to photography too.",
    "I have worked across motion design, photography and graphic designing, making things look lovely and lively, giving them my touch,  I’ve created the aftermovies for VIVACITY and DESPORTIVOS, and now, as Creative Head for VIVACITY and LNMHACKS 9.0, I get to do something I enjoy just as much as creating: leading, collaborating with, and mentoring the next batches of our creative team.",
    "My toolkit includes After Effects, Premiere Pro, Figma, Photoshop and Illustrator but I’ve always believed that the tools are only half the story.",
  ],
} as const;

/* ---------------------------------------------------------------------------
   Links. Every href that is still a placeholder renders as a disabled-looking
   link so the gap is visible on the page itself.
   ------------------------------------------------------------------------ */
export type Social = {
  label: string;
  href: string;
  icon: "instagram" | "linkedin" | "mail";
  /** Brand colour on hover, per theme. */
  brand: string;
  brandDark: string;
  note?: string;
};

export const socials: Social[] = [
  {
    label: "Instagram · Motion",
    href: "[URL]",
    icon: "instagram",
    brand: "#E1306C",
    brandDark: "#FF5F8F",
    note: "motion design",
  },
  {
    label: "Instagram · Photography",
    href: "[URL]",
    icon: "instagram",
    brand: "#E1306C",
    brandDark: "#FF5F8F",
    note: "photography",
  },
  {
    label: "LinkedIn",
    href: "[URL]",
    icon: "linkedin",
    brand: "#0A66C2",
    brandDark: "#4CA3F5",
  },
  {
    label: "Email",
    href: "mailto:[EMAIL]",
    icon: "mail",
    brand: "#EA4335",
    brandDark: "#F2695C",
  },
];

export const photographyInstagram = socials[1];

/* ---------------------------------------------------------------------------
   Video.

   Full videos are never committed to git. `full` is the URL of an unlisted
   YouTube upload (youtube.com/watch?v=… or youtu.be/…); the case-study page
   and the modal embed it with the privacy-enhanced player.
   Previews are the only video files in /public/videos: 720p, H.264 mp4 plus a
   webm, under ~2 MB each, muted loops of a few seconds.
   ------------------------------------------------------------------------ */
export type VideoSource = {
  /** Unlisted YouTube URL. A direct .mp4 path also works for a local file. */
  full?: string;
  /** Small muted loop for the card hover and the hero. */
  previewMp4?: string;
  previewWebm?: string;
  /** Always present, so there is never an empty black box. */
  poster: string;
  /** Intrinsic ratio, so the frame reserves its space before anything loads. */
  aspect: readonly [number, number];
};

export const showreel: VideoSource = {
  // "Play with sound" opens this. The brief keeps the showreel at
  // /videos/showreel.mp4; swap in a YouTube URL if the file ends up large.
  full: "/videos/showreel.mp4",
  previewMp4: "/videos/showreel.mp4",
  previewWebm: "/videos/showreel.webm",
  poster: "/posters/showreel.svg",
  aspect: [16, 9],
};

/* ---------------------------------------------------------------------------
   Selected work.

   `tint` is the one colour a project owns, taken from the event's own theme
   where Paras has described it (Step 6 of the brief). It colours the index
   numeral, the hover ring and the case-study rule, nothing else: the video is
   the colour.
   ------------------------------------------------------------------------ */
export type Project = {
  slug: string;
  title: string;
  year: string;
  role: string;
  tools: string[];
  /** Client or event. */
  client: string;
  /** Two to three sentences. */
  story: string;
  /** One result or number, only if supplied. */
  result?: string;
  status: "released" | "coming-soon";
  /** The event theme the piece was made for, when described. */
  theme?: string;
  tint: string;
  video: VideoSource;
};

export const projects: Project[] = [
  {
    slug: "vivacity-25-aftermovie",
    title: "VIVACITY ’25 Aftermovie",
    year: "2025",
    role: "[PLACEHOLDER role]",
    tools: ["[PLACEHOLDER tools]"],
    client: "VIVACITY ’25",
    story: "[PLACEHOLDER one-line story]",
    status: "released",
    tint: "#ff8a3d",
    video: {
      full: "[PLACEHOLDER YouTube unlisted URL]",
      previewMp4: "/videos/vivacity-25-preview.mp4",
      previewWebm: "/videos/vivacity-25-preview.webm",
      poster: "/posters/vivacity-25.svg",
      aspect: [16, 9],
    },
  },
  {
    slug: "desportivos-25-aftermovie",
    title: "DESPORTIVOS ’25 Aftermovie",
    year: "2025",
    role: "[PLACEHOLDER role]",
    tools: ["[PLACEHOLDER tools]"],
    client: "DESPORTIVOS ’25",
    story: "[PLACEHOLDER one-line story]",
    status: "released",
    tint: "#22d3ee",
    video: {
      full: "[PLACEHOLDER YouTube unlisted URL]",
      previewMp4: "/videos/desportivos-25-preview.mp4",
      previewWebm: "/videos/desportivos-25-preview.webm",
      poster: "/posters/desportivos-25.svg",
      aspect: [16, 9],
    },
  },
  {
    slug: "vivacity-26-aftermovie",
    title: "VIVACITY ’26 Aftermovie",
    year: "2026",
    role: "[PLACEHOLDER role]",
    tools: ["[PLACEHOLDER tools]"],
    client: "VIVACITY ’26",
    story: "[PLACEHOLDER one-line story]",
    status: "coming-soon",
    theme: "Anachronic Melange: desi maximalism, full of high colour.",
    tint: "#ff2d87",
    video: {
      full: "[PLACEHOLDER YouTube unlisted URL]",
      previewMp4: "/videos/vivacity-26-preview.mp4",
      previewWebm: "/videos/vivacity-26-preview.webm",
      poster: "/posters/vivacity-26.svg",
      aspect: [16, 9],
    },
  },
  {
    slug: "client-project-1",
    title: "[PLACEHOLDER client project]",
    year: "[PLACEHOLDER year]",
    role: "[PLACEHOLDER role]",
    tools: ["[PLACEHOLDER tools]"],
    client: "[PLACEHOLDER client]",
    story: "[PLACEHOLDER one-line story]",
    status: "released",
    tint: "#c0fe04",
    video: {
      full: "[PLACEHOLDER YouTube unlisted URL]",
      previewMp4: "/videos/client-1-preview.mp4",
      previewWebm: "/videos/client-1-preview.webm",
      poster: "/posters/client-1.svg",
      aspect: [16, 9],
    },
  },
  {
    slug: "client-project-2",
    title: "[PLACEHOLDER client project]",
    year: "[PLACEHOLDER year]",
    role: "[PLACEHOLDER role]",
    tools: ["[PLACEHOLDER tools]"],
    client: "[PLACEHOLDER client]",
    story: "[PLACEHOLDER one-line story]",
    status: "released",
    tint: "#1e60ff",
    video: {
      full: "[PLACEHOLDER YouTube unlisted URL]",
      previewMp4: "/videos/client-2-preview.mp4",
      previewWebm: "/videos/client-2-preview.webm",
      poster: "/posters/client-2.svg",
      aspect: [16, 9],
    },
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

/* ---------------------------------------------------------------------------
   Photography. Width and height are the real pixel dimensions of each file so
   the masonry reserves exact space and nothing shifts as images arrive.
   ------------------------------------------------------------------------ */
export type Photo = { src: string; width: number; height: number; alt: string };

export const photos: Photo[] = [
  { src: "/photos/photo-01.svg", width: 1200, height: 1600, alt: "[PLACEHOLDER photo 01]" },
  { src: "/photos/photo-02.svg", width: 1600, height: 1067, alt: "[PLACEHOLDER photo 02]" },
  { src: "/photos/photo-03.svg", width: 1200, height: 1200, alt: "[PLACEHOLDER photo 03]" },
  { src: "/photos/photo-04.svg", width: 1200, height: 1500, alt: "[PLACEHOLDER photo 04]" },
  { src: "/photos/photo-05.svg", width: 1600, height: 900, alt: "[PLACEHOLDER photo 05]" },
  { src: "/photos/photo-06.svg", width: 1200, height: 1800, alt: "[PLACEHOLDER photo 06]" },
  { src: "/photos/photo-07.svg", width: 1600, height: 1200, alt: "[PLACEHOLDER photo 07]" },
  { src: "/photos/photo-08.svg", width: 1200, height: 1500, alt: "[PLACEHOLDER photo 08]" },
  { src: "/photos/photo-09.svg", width: 1200, height: 1200, alt: "[PLACEHOLDER photo 09]" },
  { src: "/photos/photo-10.svg", width: 1600, height: 1000, alt: "[PLACEHOLDER photo 10]" },
];

/* ---------------------------------------------------------------------------
   Leadership and mentoring.
   ------------------------------------------------------------------------ */
export const leadership = {
  lede: "Leading, collaborating with, and mentoring the next batches of our creative team.",
  items: [
    {
      title: "Creative Head, VIVACITY",
      body: "Leading the creative team behind the fest, from theme to aftermovie.",
    },
    {
      title: "Creative Head, LNMHACKS 9.0",
      body: "Leading the hackathon’s creative direction: vector art, sharp and modern.",
    },
    {
      title: "Mentoring the Y25 and Y26 creative teams",
      body: "Working alongside the next two batches as they take on their own briefs.",
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
   Experience. One or two lines each, most recent first.
   ------------------------------------------------------------------------ */
export type Role = { org: string; role: string; period: string; line: string };

export const experience: Role[] = [
  {
    org: "LNMHACKS 9.0",
    role: "Creative Head",
    period: "[PLACEHOLDER dates]",
    line: "Creative direction for the hackathon’s vector-art identity.",
  },
  {
    org: "VIVACITY",
    role: "Creative Head",
    period: "[PLACEHOLDER dates]",
    line: "Leading the fest’s creative team; previously made the VIVACITY and DESPORTIVOS aftermovies.",
  },
  {
    org: "Freelance",
    role: "Motion design and graphic design",
    period: "[PLACEHOLDER dates]",
    line: "[PLACEHOLDER client names and what was made for them]",
  },
  {
    org: "Imagination",
    role: "[PLACEHOLDER role]",
    period: "[PLACEHOLDER dates]",
    line: "[PLACEHOLDER one line on the work]",
  },
];

/* ---------------------------------------------------------------------------
   Tools. Names only: no bars, no percentages.
   ------------------------------------------------------------------------ */
export const tools = ["After Effects", "Premiere Pro", "Photoshop", "Illustrator", "Figma"] as const;

/* ---------------------------------------------------------------------------
   Site. The URL is provisional until the Vercel project exists.
   ------------------------------------------------------------------------ */
export const site = {
  title: "Paras, Motion Designer and Photographer in Jaipur",
  description:
    "Motion designer, photographer and storyteller in Jaipur. Aftermovies for VIVACITY and DESPORTIVOS; Creative Head of VIVACITY and LNMHACKS 9.0.",
  url: "https://paras-portfolio.vercel.app",
  footer: "Paras",
  keywords: [
    "Paras",
    "motion designer",
    "motion design intern",
    "motion graphics Jaipur",
    "photographer Jaipur",
    "aftermovie",
    "After Effects",
    "Premiere Pro",
    "VIVACITY",
    "LNMHACKS",
  ],
} as const;
