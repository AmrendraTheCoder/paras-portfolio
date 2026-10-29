"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import { STORAGE_BUCKET } from "@/lib/supabase/config";

/**
 * Every mutation re-checks the admin on the server before it runs; the
 * middleware gate and the UI are conveniences, this is the control. Writes go
 * through the cookie-bound client so Row Level Security also has to agree.
 * After a change the affected public paths are revalidated so the live site
 * updates within moments, not on the next deploy.
 */
async function db() {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

function refreshPublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/work/[slug]", "page");
  if (slug) revalidatePath(`/work/${slug}`);
}

/** Upload one file into the media bucket under a folder; returns its path. */
async function uploadFile(folder: string, file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const supabase = await db();
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const path = `${folder}/${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return path;
}

const str = (f: FormDataEntryValue | null) => (typeof f === "string" ? f.trim() : "");
const file = (f: FormDataEntryValue | null) => (f instanceof File ? f : null);

// ── Projects ───────────────────────────────────────────────────────────────
export async function saveProject(form: FormData) {
  const supabase = await db();
  const id = str(form.get("id"));
  const poster = await uploadFile("posters", file(form.get("poster_file")) as File);
  const previewMp4 = await uploadFile("videos", file(form.get("preview_mp4_file")) as File);
  const previewWebm = await uploadFile("videos", file(form.get("preview_webm_file")) as File);

  const row: Record<string, unknown> = {
    slug: str(form.get("slug")) || str(form.get("title")).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    title: str(form.get("title")),
    year: str(form.get("year")),
    role: str(form.get("role")),
    tools: str(form.get("tools")).split(",").map((t) => t.trim()).filter(Boolean),
    client: str(form.get("client")),
    story: str(form.get("story")),
    result: str(form.get("result")) || null,
    theme: str(form.get("theme")) || null,
    badge: str(form.get("badge")) || "Work",
    tint: str(form.get("tint")) || "#ff8a4c",
    status: str(form.get("status")) || "released",
    video_full: str(form.get("video_full")) || null,
    sort: Number(str(form.get("sort")) || 0),
    published: form.get("published") === "on",
    updated_at: new Date().toISOString(),
  };
  if (poster) row.poster = poster;
  if (previewMp4) row.preview_mp4 = previewMp4;
  if (previewWebm) row.preview_webm = previewWebm;

  const q = id ? supabase.from("projects").update(row).eq("id", id) : supabase.from("projects").insert(row);
  const { error } = await q;
  if (error) throw new Error(error.message);
  refreshPublic(row.slug as string);
  redirect("/admin/projects");
}

export async function deleteProject(form: FormData) {
  const supabase = await db();
  const { error } = await supabase.from("projects").delete().eq("id", str(form.get("id")));
  if (error) throw new Error(error.message);
  refreshPublic();
  redirect("/admin/projects");
}

// ── Links ──────────────────────────────────────────────────────────────────
export async function saveLink(form: FormData) {
  const supabase = await db();
  const id = str(form.get("id"));
  const row = {
    label: str(form.get("label")),
    href: str(form.get("href")),
    icon: str(form.get("icon")) || "mail",
    kind: str(form.get("kind")) || "social",
    sort: Number(str(form.get("sort")) || 0),
    published: form.get("published") === "on",
    updated_at: new Date().toISOString(),
  };
  const q = id ? supabase.from("links").update(row).eq("id", id) : supabase.from("links").insert(row);
  const { error } = await q;
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/links");
}

export async function deleteLink(form: FormData) {
  const supabase = await db();
  const { error } = await supabase.from("links").delete().eq("id", str(form.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/links");
}

// ── Timeline ───────────────────────────────────────────────────────────────
export async function saveTimeline(form: FormData) {
  const supabase = await db();
  const id = str(form.get("id"));
  const row = {
    org: str(form.get("org")),
    role: str(form.get("role")),
    period: str(form.get("period")),
    line: str(form.get("line")),
    tint: str(form.get("tint")) || "#ff8a4c",
    sort: Number(str(form.get("sort")) || 0),
    published: form.get("published") === "on",
    updated_at: new Date().toISOString(),
  };
  const q = id ? supabase.from("timeline").update(row).eq("id", id) : supabase.from("timeline").insert(row);
  const { error } = await q;
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/timeline");
}

export async function deleteTimeline(form: FormData) {
  const supabase = await db();
  const { error } = await supabase.from("timeline").delete().eq("id", str(form.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/timeline");
}

// ── Photos ─────────────────────────────────────────────────────────────────
export async function uploadPhotos(form: FormData) {
  const supabase = await db();
  const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  const base = Number(str(form.get("sort")) || 0);
  let i = 0;
  for (const f of files) {
    const path = await uploadFile("photos", f);
    if (!path) continue;
    const { error } = await supabase.from("photos").insert({
      path,
      alt: str(form.get("alt")) || f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      sort: base + i++,
      published: true,
    });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/");
  redirect("/admin/photos");
}

export async function savePhoto(form: FormData) {
  const supabase = await db();
  const { error } = await supabase
    .from("photos")
    .update({
      alt: str(form.get("alt")),
      sort: Number(str(form.get("sort")) || 0),
      published: form.get("published") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", str(form.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/photos");
}

export async function deletePhoto(form: FormData) {
  const supabase = await db();
  const id = str(form.get("id"));
  const path = str(form.get("path"));
  if (path) await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin/photos");
}

// ── Session ────────────────────────────────────────────────────────────────
export async function signOut() {
  const supabase = await createClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
