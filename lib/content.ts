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
  name: "Paras Gupta",
  first: "Paras",
  last: "Gupta",
  /** Shown in the nav pill. */
  initials: "PG",
  role: "Motion designer and storyteller",
  /** The one-line positioning. */
  tagline: "Motion designer and storyteller.",
  /** Search metadata only. The city is deliberately not printed on the page. */
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
   Hero.

   There is no showreel yet, so the hero is built from what does exist: the
   name, a line that keeps changing its last word, a strip of the four event
   themes Paras has described, and a ticker of the work so far.
   ------------------------------------------------------------------------ */
export const heroLine = {
  before: "I make",
  words: ["stories", "motion", "stills", "vectors", "aftermovies", "fests"],
  after: "move.",
} as const;

export const ticker = [
  "VIVACITY ’25 aftermovie",
  "DESPORTIVOS ’25 aftermovie",
  "Creative Head · VIVACITY",
  "Creative Head · LNMHACKS 9.0",
  "Mentoring the Y25 and Y26 creative teams",
  "VIVACITY ’27 · coming soon",
] as const;

export type Theme = {
  slug: string;
  event: string;
  name: string;
  line: string;
  /** Painted by the hero strip; each one is its own small generative poster. */
  look: "melange" | "pixel" | "vector" | "neon";
  palette: [string, string, string];
  status: "done" | "live" | "soon";
};

export const themes: Theme[] = [
  {
    slug: "anachronic-melange",
    event: "VIVACITY ’26",
    name: "Anachronic Melange",
    line: "Desi maximalism, full of high colour.",
    look: "melange",
    palette: ["#ff2d87", "#ff8a00", "#1fb7a6"],
    status: "done",
  },
  {
    slug: "pixel-paradox",
    event: "DESPORTIVOS ’26",
    name: "Pixel Paradox",
    line: "Pixelated worlds and effects.",
    look: "pixel",
    palette: ["#22d3ee", "#a3e635", "#f472b6"],
    status: "done",
  },
  {
    slug: "vector-arts",
    event: "LNMHACKS 9.0",
    name: "Vector Arts",
    line: "Sharp, modern, all vectors.",
    look: "vector",
    palette: ["#c0fe04", "#1e60ff", "#f0ede8"],
    status: "live",
  },
  {
    slug: "neon-contrast",
    event: "VIVACITY ’27",
    name: "Neon Contrast",
    line: "Popping colour, modern with a touch of handmade.",
    look: "neon",
    palette: ["#ff3ec8", "#00f0ff", "#faff00"],
    status: "soon",
  },
];

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
  /** A YouTube link used as the hover preview instead of uploading mp4/webm. */
  previewYoutube?: string;
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
  /** Small uppercase tag in the card corner. */
  badge: string;
  /** Optional second still shown on hover when there is no preview loop yet. */
  hoverImage?: string;
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
    badge: "Aftermovie",
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
    badge: "Aftermovie",
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
    badge: "Coming soon",
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
    badge: "Client work",
    tint: "#ff8a4c",
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
    badge: "Client work",
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
   Photography is not listed here. Every image in /public/photos is picked up
   at build time by lib/photos.ts, with its real dimensions, so adding a photo
   is uploading a file, not editing code. See CONTENT.md.
   ------------------------------------------------------------------------ */
export type Photo = { src: string; width: number; height: number; alt: string };

/* ---------------------------------------------------------------------------
   Leadership and mentoring, told as a story in chapters.

   Every chapter marked `draft` is my wording of facts Paras has given; the
   facts are his, the sentences are not yet. Swap them for his own copy.
   ------------------------------------------------------------------------ */
export type Chapter = {
  n: string;
  kicker: string;
  title: string;
  body: string;
  tint: string;
  draft?: boolean;
};

export const leadership = {
  lede: "From cutting the aftermovie to running the room that makes it.",
  chapters: [
    {
      n: "01",
      kicker: "Behind the camera",
      title: "It started with the aftermovies.",
      body:
        "VIVACITY and DESPORTIVOS each got a film: the fest cut down to the minutes people wanted to relive. Shooting, selecting, cutting, grading, all of it from one seat.",
      tint: "#ff8a3d",
      draft: true,
    },
    {
      n: "02",
      kicker: "Creative Head · VIVACITY",
      title: "Then the brief became the whole fest.",
      body:
        "As Creative Head the job stopped being one film and became the look of everything: the theme, the posters, the motion, the team that makes them. VIVACITY ’26 was Anachronic Melange, desi maximalism full of high colour.",
      tint: "#ff2d87",
      draft: true,
    },
    {
      n: "03",
      kicker: "Creative Head · LNMHACKS 9.0",
      title: "A hackathon drawn entirely in vectors.",
      body:
        "LNMHACKS 9.0 took the opposite direction: sharp, modern, vector art from the identity down to the website, so a technical event looked as precise as the work inside it.",
      tint: "#1e60ff",
      draft: true,
    },
    {
      n: "04",
      kicker: "Mentoring",
      title: "Leading is the part I enjoy as much as making.",
      body:
        "The Y25 and Y26 creative teams are the next batches. The work now is collaborating with them, handing over briefs, and making sure what they ship carries their own touch, not mine.",
      tint: "#22d3ee",
      draft: true,
    },
    {
      n: "05",
      kicker: "Next · VIVACITY ’27",
      title: "Neon Contrast is coming.",
      body:
        "Popping colour, modern with a touch of handmade. The theme is set; the films are not shot yet.",
      tint: "#ff3ec8",
      draft: true,
    },
  ] as Chapter[],
} as const;

/* ---------------------------------------------------------------------------
   Experience. One or two lines each, most recent first.
   ------------------------------------------------------------------------ */
export type Role = { org: string; role: string; period: string; line: string; tint: string };

export const experience: Role[] = [
  {
    org: "LNMHACKS 9.0",
    role: "Creative Head",
    period: "[PLACEHOLDER dates]",
    line: "Creative direction for the hackathon’s vector-art identity: brand, motion, launch films.",
    tint: "#ff6a1f",
  },
  {
    org: "VIVACITY",
    role: "Creative Head",
    period: "[PLACEHOLDER dates]",
    line: "Leading the fest’s creative team. Edited the VIVACITY’25 Tela Indrae aftermovie and the theme reveal.",
    tint: "#ff6a1f",
  },
  {
    org: "DESPORTIVOS",
    role: "Editor · Motion",
    period: "2025",
    line: "Cut the DESPORTIVOS’25 Pixel Paradox aftermovie in Premiere Pro and After Effects.",
    tint: "#ff6a1f",
  },
  {
    org: "Freelance",
    role: "Motion design and graphic design",
    period: "[PLACEHOLDER dates]",
    line: "Edits and motion for creators, including an introductory reel for a client’s Instagram launch.",
    tint: "#ff6a1f",
  },
  {
    org: "Imagination",
    role: "Member",
    period: "[PLACEHOLDER dates]",
    line: "Worked across photography, cinematography and editing, and grew into a senior member and creative lead.",
    tint: "#ff6a1f",
  },
];

/* ---------------------------------------------------------------------------
   Tools. Names only: no bars, no percentages.
   ------------------------------------------------------------------------ */
export type Tool = {
  name: string;
  href: string;
  note: string;
  /** Which part of the work it does. */
  discipline: string;
  /** A colour from the site's own palette, used on hover (no third-party brand colours). */
  tint: string;
  /** An original geometric glyph — the site draws its own marks, not product logos. */
  shape: "blob" | "triangle" | "square" | "hex" | "disc";
  /** Optional: a logo image you add to /public/tools/ (e.g. the official SVG).
      When the file exists it shows instead of the glyph; otherwise the glyph
      stays. The site does not ship any third-party logos itself. */
  logo?: string;
};

export const tools: Tool[] = [
  { name: "After Effects", href: "https://www.adobe.com/products/aftereffects.html", note: "Where the motion happens: titles, transitions, the aftermovie's moving parts", discipline: "Motion", tint: "#ff8a4c", shape: "blob", logo: "/tools/after-effects.svg" },
  { name: "Premiere Pro", href: "https://www.adobe.com/products/premiere.html", note: "The edit: every aftermovie is cut here first", discipline: "Edit", tint: "#1e60ff", shape: "triangle", logo: "/tools/premiere-pro.svg" },
  { name: "Photoshop", href: "https://www.adobe.com/products/photoshop.html", note: "Stills, posters and the grade on photographs", discipline: "Image", tint: "#22d3ee", shape: "square", logo: "/tools/photoshop.svg" },
  { name: "Illustrator", href: "https://www.adobe.com/products/illustrator.html", note: "Vectors: the LNMHACKS 9.0 identity was drawn here", discipline: "Vector", tint: "#ff2d87", shape: "hex", logo: "/tools/illustrator.svg" },
  { name: "Figma", href: "https://www.figma.com", note: "Layouts, decks and anything the team edits together", discipline: "Design", tint: "#c0fe04", shape: "disc", logo: "/tools/figma.svg" },
]

/* ---------------------------------------------------------------------------
   Motion graphics. A gallery Paras uploads to from /admin: short motion pieces
   (a YouTube link that hover-plays and opens fullscreen) or stills. Until rows
   exist in the database the seed below shows, so the section is never empty.
   ------------------------------------------------------------------------ */
export type MotionGraphic = {
  id?: string;
  title: string;
  caption?: string;
  kind: "video" | "image";
  /** For a video item: a YouTube link, hover-plays and opens fullscreen. */
  youtube?: string;
  /** For an image item, or a video poster: a URL or /public path. */
  src?: string;
  poster?: string;
  aspect: readonly [number, number];
};

export const motionGraphics: MotionGraphic[] = [
  { title: "[PLACEHOLDER motion piece]", caption: "[PLACEHOLDER — title & type]", kind: "video", youtube: "[PLACEHOLDER YouTube link]", poster: "/posters/showreel.svg", aspect: [16, 9] },
  { title: "[PLACEHOLDER motion piece]", caption: "[PLACEHOLDER]", kind: "video", youtube: "[PLACEHOLDER YouTube link]", poster: "/posters/vivacity-25.svg", aspect: [16, 9] },
  { title: "[PLACEHOLDER motion piece]", caption: "[PLACEHOLDER]", kind: "video", youtube: "[PLACEHOLDER YouTube link]", poster: "/posters/desportivos-25.svg", aspect: [16, 9] },
  { title: "[PLACEHOLDER still]", caption: "[PLACEHOLDER]", kind: "image", src: "/posters/vivacity-26.svg", aspect: [16, 9] },
];

/* ---------------------------------------------------------------------------
   Site. The URL is provisional until the Vercel project exists.
   ------------------------------------------------------------------------ */
export const site = {
  title: "Paras Gupta, Motion Designer and Photographer in Jaipur",
  description:
    "Motion designer, photographer and storyteller in Jaipur. Aftermovies for VIVACITY and DESPORTIVOS; Creative Head of VIVACITY and LNMHACKS 9.0.",
  url: "https://paras-portfolio.vercel.app",
  footer: "Paras Gupta",
  keywords: [
    "Paras Gupta",
    "motion designer",
    "motion design intern",
    "motion graphics Jaipur",
    "motion graphics reel",
    "photographer Jaipur",
    "aftermovie",
    "After Effects",
    "Premiere Pro",
    "VIVACITY",
    "LNMHACKS",
  ],
} as const;
