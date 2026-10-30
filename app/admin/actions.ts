"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-auth";
import { STORAGE_BUCKET } from "@/lib/supabase/config";

/**
 * Every mutation re-checks the admin, does its work inside a try, and on any
 * failure redirects back to its own page with ?error=… instead of throwing —
 * so a bad save shows a message rather than crashing the admin. On success it
 * redirects with ?saved=1. Writes go through the cookie-bound client so Row
 * Level Security also has to agree; affected public paths are revalidated so
 * the live site updates within moments.
 *
 * The redirect() calls sit OUTSIDE the try blocks: redirect throws a control
 * signal Next catches, and it must not be swallowed by our error handling.
 */
async function db() {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

/** Zero affected rows means the database's row rule blocked the write. */
async function commit<T>(query: PromiseLike<{ data: T[] | null; error: { message: string } | null }>, verb: string): Promise<T[]> {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error(
      `Nothing was ${verb}. You are signed in, but the database would not accept the change — your email is probably missing from is_admin(). Run supabase/fix-admin.sql with your email, then try again.`,
    );
  }
  return data;
}

function refreshPublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/work/[slug]", "page");
  if (slug) revalidatePath(`/work/${slug}`);
}

async function uploadFile(folder: string, f: File | null): Promise<string | null> {
  if (!f || f.size === 0) return null;
  const supabase = await db();
  const safe = f.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const path = `${folder}/${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, f, {
    cacheControl: "31536000",
    upsert: false,
    contentType: f.type || undefined,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return path;
}

const str = (f: FormDataEntryValue | null) => (typeof f === "string" ? f.trim() : "");
const file = (f: FormDataEntryValue | null) => (f instanceof File ? f : null);
const msg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");
const back = (section: string, e: unknown) => redirect(`${section}?error=${encodeURIComponent(msg(e))}`);

// ── Projects ───────────────────────────────────────────────────────────────
export async function saveProject(form: FormData) {
  const section = "/admin/projects";
  let slug = "";
  try {
    const supabase = await db();
    const id = str(form.get("id"));
    const poster = await uploadFile("posters", file(form.get("poster_file")));
    const previewMp4 = await uploadFile("videos", file(form.get("preview_mp4_file")));
    const previewWebm = await uploadFile("videos", file(form.get("preview_webm_file")));
    slug = str(form.get("slug")) || str(form.get("title")).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const row: Record<string, unknown> = {
      slug,
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
      preview_youtube: str(form.get("preview_youtube")) || null,
      sort: Number(str(form.get("sort")) || 0),
      published: form.get("published") === "on",
      updated_at: new Date().toISOString(),
    };
    if (poster) row.poster = poster;
    if (previewMp4) row.preview_mp4 = previewMp4;
    if (previewWebm) row.preview_webm = previewWebm;
    const q = id ? supabase.from("projects").update(row).eq("id", id).select("id") : supabase.from("projects").insert(row).select("id");
    await commit(q, id ? "saved" : "added");
  } catch (e) {
    back(section, e);
  }
  refreshPublic(slug);
  redirect(`${section}?saved=1`);
}

export async function deleteProject(form: FormData) {
  const section = "/admin/projects";
  try {
    const supabase = await db();
    await commit(supabase.from("projects").delete().eq("id", str(form.get("id"))).select("id"), "deleted");
  } catch (e) {
    back(section, e);
  }
  refreshPublic();
  redirect(`${section}?saved=1`);
}

// ── Links ──────────────────────────────────────────────────────────────────
export async function saveLink(form: FormData) {
  const section = "/admin/links";
  try {
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
    const q = id ? supabase.from("links").update(row).eq("id", id).select("id") : supabase.from("links").insert(row).select("id");
    await commit(q, id ? "saved" : "added");
  } catch (e) {
    back(section, e);
  }
  revalidatePath("/");
  redirect(`${section}?saved=1`);
}

export async function deleteLink(form: FormData) {
  const section = "/admin/links";
  try {
    const supabase = await db();
    await commit(supabase.from("links").delete().eq("id", str(form.get("id"))).select("id"), "deleted");
  } catch (e) {
    back(section, e);
  }
  revalidatePath("/");
  redirect(`${section}?saved=1`);
}

// ── Timeline ───────────────────────────────────────────────────────────────
export async function saveTimeline(form: FormData) {
  const section = "/admin/timeline";
  try {
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
    const q = id ? supabase.from("timeline").update(row).eq("id", id).select("id") : supabase.from("timeline").insert(row).select("id");
    await commit(q, id ? "saved" : "added");
  } catch (e) {
    back(section, e);
  }
  revalidatePath("/");
  redirect(`${section}?saved=1`);
}

export async function deleteTimeline(form: FormData) {
  const section = "/admin/timeline";
  try {
    const supabase = await db();
    await commit(supabase.from("timeline").delete().eq("id", str(form.get("id"))).select("id"), "deleted");
  } catch (e) {
    back(section, e);
  }
  revalidatePath("/");
  redirect(`${section}?saved=1`);
}

// ── Photos ─────────────────────────────────────────────────────────────────
export async function uploadPhotos(form: FormData) {
  const section = "/admin/photos";
  try {
    const supabase = await db();
    const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length === 0) throw new Error("No images were selected.");
    const base = Number(str(form.get("sort")) || 0);
    let i = 0;
    for (const f of files) {
      const path = await uploadFile("photos", f);
      if (!path) continue;
      await commit(
        supabase.from("photos").insert({
          path,
          alt: str(form.get("alt")) || f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          sort: base + i++,
          published: true,
        }).select("id"),
        "added",
      );
    }
  } catch (e) {
    back(section, e);
  }
  revalidatePath("/");
  redirect(`${section}?saved=1`);
}

export async function savePhoto(form: FormData) {
  const section = "/admin/photos";
  try {
    const supabase = await db();
    await commit(
      supabase.from("photos").update({
        alt: str(form.get("alt")),
        sort: Number(str(form.get("sort")) || 0),
        published: form.get("published") === "on",
        updated_at: new Date().toISOString(),
      }).eq("id", str(form.get("id"))).select("id"),
      "saved",
    );
  } catch (e) {
    back(section, e);
  }
  revalidatePath("/");
  redirect(`${section}?saved=1`);
}

export async function deletePhoto(form: FormData) {
  const section = "/admin/photos";
  try {
    const supabase = await db();
    const id = str(form.get("id"));
    const path = str(form.get("path"));
    if (path) await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    await commit(supabase.from("photos").delete().eq("id", id).select("id"), "deleted");
  } catch (e) {
    back(section, e);
  }
  revalidatePath("/");
  redirect(`${section}?saved=1`);
}

// ── Motion graphics ──────────────────────────────────────────────────────────
export async function saveMotion(form: FormData) {
  const section = "/admin/motion";
  try {
    const supabase = await db();
    const id = str(form.get("id"));
    const poster = await uploadFile("motion", file(form.get("poster_file")));
    const image = await uploadFile("motion", file(form.get("image_file")));
    const row: Record<string, unknown> = {
      title: str(form.get("title")),
      caption: str(form.get("caption")),
      kind: str(form.get("kind")) || "video",
      media_youtube: str(form.get("media_youtube")) || null,
      sort: Number(str(form.get("sort")) || 0),
      published: form.get("published") === "on",
      updated_at: new Date().toISOString(),
    };
    if (poster) row.poster = poster;
    if (image) row.media_path = image;
    const q = id
      ? supabase.from("motion_graphics").update(row).eq("id", id).select("id")
      : supabase.from("motion_graphics").insert(row).select("id");
    await commit(q, id ? "saved" : "added");
  } catch (e) {
    back(section, e);
  }
  revalidatePath("/");
  redirect(`${section}?saved=1`);
}

export async function deleteMotion(form: FormData) {
  const section = "/admin/motion";
  try {
    const supabase = await db();
    await commit(supabase.from("motion_graphics").delete().eq("id", str(form.get("id"))).select("id"), "deleted");
  } catch (e) {
    back(section, e);
  }
  revalidatePath("/");
  redirect(`${section}?saved=1`);
}

// ── Session ────────────────────────────────────────────────────────────────
export async function signOut() {
  const supabase = await createClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
