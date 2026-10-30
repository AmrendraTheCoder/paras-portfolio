import { createPublicClient } from "@/lib/supabase/public";
import { publicAsset } from "@/lib/supabase/config";
import {
  projects as seedProjects,
  socials as seedSocials,
  experience as seedExperience,
  type Project,
  type Social,
  type Role,
  type Photo,
  type VideoSource,
} from "@/lib/content";
import { getPhotos as seedPhotos } from "@/lib/photos";

/**
 * The reading layer.
 *
 * Every public section reads through here, never straight from the database or
 * the seed. When Supabase is connected these return the admin's rows; when it
 * is not, they return the committed seed content, so the site is fully working
 * before anyone sets up a backend and never shows an empty page.
 *
 * Rows from the database are the admin's own data, not untrusted input, but
 * they are still shaped into the exact types the components expect here, so a
 * missing column can never reach a component as undefined.
 */

function rowToVideo(r: Record<string, unknown>): VideoSource {
  return {
    full: (r.video_full as string) || undefined,
    previewMp4: r.preview_mp4 ? publicAsset(r.preview_mp4 as string) : undefined,
    previewWebm: r.preview_webm ? publicAsset(r.preview_webm as string) : undefined,
    previewYoutube: (r.preview_youtube as string) || undefined,
    poster: r.poster ? publicAsset(r.poster as string) : "/posters/showreel.svg",
    aspect: [16, 9],
  };
}

export async function getProjects(): Promise<Project[]> {
  const supabase = createPublicClient();
  if (!supabase) return seedProjects;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort", { ascending: true });
  if (error || !data?.length) return seedProjects;
  return data.map((r) => ({
    slug: r.slug,
    title: r.title,
    year: r.year ?? "",
    role: r.role ?? "",
    tools: Array.isArray(r.tools) ? r.tools : [],
    client: r.client ?? "",
    story: r.story ?? "",
    result: r.result ?? undefined,
    theme: r.theme ?? undefined,
    tint: r.tint ?? "#ff8a4c",
    badge: r.badge ?? "Work",
    status: (r.status as Project["status"]) ?? "released",
    hoverImage: r.hover_image ? publicAsset(r.hover_image) : undefined,
    video: rowToVideo(r),
  }));
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.slug === slug);
}

export async function getSocials(): Promise<Social[]> {
  const supabase = createPublicClient();
  if (!supabase) return seedSocials;
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("published", true)
    .order("sort", { ascending: true });
  if (error || !data?.length) return seedSocials;
  const brandFor = (icon: string) =>
    icon === "linkedin" ? ["#0A66C2", "#4CA3F5"] : icon === "mail" ? ["#EA4335", "#F2695C"] : ["#E1306C", "#FF5F8F"];
  return data.map((r) => {
    const [brand, brandDark] = brandFor(r.icon);
    return { label: r.label, href: r.href || "[URL]", icon: r.icon as Social["icon"], brand, brandDark, note: r.kind };
  });
}

export async function getPhotographyLink(): Promise<Social> {
  const socials = await getSocials();
  return socials.find((s) => s.note === "photography" || s.label.toLowerCase().includes("photograph")) ?? socials[1] ?? socials[0];
}

export async function getTimeline(): Promise<Role[]> {
  const supabase = createPublicClient();
  if (!supabase) return seedExperience;
  const { data, error } = await supabase
    .from("timeline")
    .select("*")
    .eq("published", true)
    .order("sort", { ascending: true });
  if (error || !data?.length) return seedExperience;
  return data.map((r) => ({ org: r.org, role: r.role ?? "", period: r.period ?? "", line: r.line ?? "", tint: r.tint ?? "#ff8a4c" }));
}

export async function getGalleryPhotos(): Promise<Photo[]> {
  const supabase = createPublicClient();
  if (!supabase) return seedPhotos();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("published", true)
    .order("sort", { ascending: true });
  if (error || !data?.length) return seedPhotos();
  return data.map((r) => ({ src: publicAsset(r.path), width: r.width ?? 1200, height: r.height ?? 1200, alt: r.alt ?? "" }));
}
