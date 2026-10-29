import type { MetadataRoute } from "next";
import { site, isPlaceholder } from "@/lib/content";
import { getProjects } from "@/lib/data";

/** The home page and every real case study. Placeholder projects are not listed. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
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
