import type { MetadataRoute } from "next";
import { projects, site, isPlaceholder } from "@/lib/content";

/** The home page and every real case study. Placeholder projects are not listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...projects
      .filter((p) => !isPlaceholder(p.title))
      .map((p) => ({
        url: `${site.url}/work/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.7,
      })),
  ];
}
