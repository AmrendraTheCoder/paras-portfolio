import type { Metadata, Viewport } from "next";
import { Archivo, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { profile, site, socials, isPlaceholder } from "@/lib/content";
import "./globals.css";
import { jsonLdScript } from "@/lib/json-ld";

/**
 * Space Grotesk carries the display: geometric, a little odd, the right voice
 * for vector art and motion. Archivo does the reading. Both are variable fonts,
 * so one file each covers every weight used.
 */
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${profile.name}` },
  description: site.description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  publisher: profile.name,
  keywords: [...site.keywords],
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: profile.name,
    locale: "en_IN",
    type: "profile",
    firstName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1 },
  },
  category: "design",
};

/**
 * Person + WebSite structured data, read from the content file so it can never
 * disagree with the page. Placeholder links are left out rather than published.
 */
function structuredData() {
  const sameAs = socials.map((s) => s.href).filter((h) => h.startsWith("http") && !isPlaceholder(h));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.url}#person`,
        name: profile.name,
        url: site.url,
        ...(isPlaceholder(profile.email) ? {} : { email: `mailto:${profile.email}` }),
        jobTitle: "Motion Designer",
        description: site.description,
        knowsAbout: ["Motion design", "Motion graphics", "Video editing", "Photography", "Graphic design", "Storytelling"],
        address: { "@type": "PostalAddress", addressLocality: profile.city, addressCountry: "IN" },
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}#website`,
        url: site.url,
        name: profile.name,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": `${site.url}#person` },
      },
    ],
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
};

/**
 * Dark is the default: the page is served with the class already on <html>, and
 * this only removes it for someone who chose light earlier. Runs before paint so
 * the canvas is never wrong for a frame.
 */
const themeBootstrap = `(function(){try{var s=localStorage.getItem("paras-theme");if(s==="light")document.documentElement.classList.remove("dark");}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${archivo.variable} ${grotesk.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(structuredData()) }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-[var(--accent-ink)]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
