import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, publicAsset } from "@/lib/supabase/config";
import { AdminHeader, Unconfigured, PageTitle, Alert, Field, Area, FileField, Toggle, Btn, shell, card } from "@/components/admin/ui";
import { saveProject, deleteProject } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type Row = Record<string, string | string[] | boolean | number | null>;

function ProjectForm({ p }: { p?: Row }) {
  const v = (k: string) => (p?.[k] == null ? "" : String(p[k]));
  const tools = Array.isArray(p?.tools) ? (p!.tools as string[]).join(", ") : "";
  return (
    <form action={saveProject} className="grid gap-4">
      {p?.id ? <input type="hidden" name="id" defaultValue={String(p.id)} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" name="title" defaultValue={v("title")} required />
        <Field label="Slug (URL, auto from title if blank)" name="slug" defaultValue={v("slug")} placeholder="vivacity-25-aftermovie" />
        <Field label="Year" name="year" defaultValue={v("year")} />
        <Field label="Client or event" name="client" defaultValue={v("client")} />
        <Field label="Role" name="role" defaultValue={v("role")} placeholder="Director and editor" />
        <Field label="Tools (comma-separated)" name="tools" defaultValue={tools} placeholder="After Effects, Premiere Pro" />
        <Field label="Badge" name="badge" defaultValue={v("badge") || "Work"} />
        <Field label="Tint (hex)" name="tint" defaultValue={v("tint") || "#ff8a4c"} />
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-[var(--fg-muted)]">Status</span>
          <select name="status" defaultValue={v("status") || "released"} className="w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg-raised)] px-3.5 py-2.5 text-[15px]">
            <option value="released">Released</option>
            <option value="coming-soon">Coming soon</option>
          </select>
        </label>
        <Field label="Sort order" name="sort" type="number" defaultValue={v("sort") || "0"} />
      </div>
      <Area label="Story (2–3 sentences)" name="story" defaultValue={v("story")} rows={3} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Result (optional)" name="result" defaultValue={v("result")} />
        <Field label="Theme (optional)" name="theme" defaultValue={v("theme")} />
      </div>
      <Field label="Full video — unlisted YouTube URL" name="video_full" defaultValue={v("video_full")} placeholder="https://youtu.be/…" />
      <Field label="Hover preview — YouTube link (optional, instead of uploading clips)" name="preview_youtube" defaultValue={v("preview_youtube")} placeholder="https://youtu.be/…  — plays muted & looping on hover" />
      <div className="grid gap-4 sm:grid-cols-3">
        <FileField label="Poster (1280×720)" name="poster_file" accept="image/*" hint={v("poster") ? "replace current" : "jpg / webp"} />
        <FileField label="Preview .mp4" name="preview_mp4_file" accept="video/mp4" hint="720p, muted, <2MB" />
        <FileField label="Preview .webm" name="preview_webm_file" accept="video/webm" hint="optional" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <Toggle name="published" defaultChecked={p ? Boolean(p.published) : true} />
        <Btn>{p?.id ? "Save changes" : "Add project"}</Btn>
      </div>
    </form>
  );
}

export default async function ProjectsAdmin({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const sp = await searchParams;
  if (!isSupabaseConfigured) return <Unconfigured />;
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data } = (await supabase!.from("projects").select("*").order("sort", { ascending: true })) as { data: Row[] | null };
  const rows = data ?? [];

  return (
    <>
      <AdminHeader email={user.email} />
      <main className={shell}>
        <PageTitle title="Projects" />
        <Alert error={sp.error} saved={sp.saved === "1"} />
        <details className={`${card} mb-6`}>
          <summary className="cursor-pointer text-[15px] font-medium text-[var(--accent-text)]">+ Add a new project</summary>
          <div className="mt-5"><ProjectForm /></div>
        </details>

        <div className="space-y-3">
          {rows.length === 0 ? <p className="text-[14px] text-[var(--fg-muted)]">No projects yet. Add the first one above.</p> : null}
          {rows.map((p) => (
            <details key={String(p.id)} className={card}>
              <summary className="flex cursor-pointer items-center gap-4">
                {p.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={publicAsset(String(p.poster))} alt="" className="h-12 w-20 shrink-0 rounded object-cover" />
                ) : <span className="grid h-12 w-20 shrink-0 place-items-center rounded bg-[var(--bg-raised)] text-[10px] text-[var(--fg-muted)]">no poster</span>}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">{String(p.title)}</span>
                  <span className="block text-[12px] text-[var(--fg-muted)]">{String(p.year)} · {String(p.client)}{p.published ? "" : " · hidden"}</span>
                </span>
              </summary>
              <div className="mt-5"><ProjectForm p={p} /></div>
              <form action={deleteProject} className="mt-4 border-t border-[var(--line)] pt-4">
                <input type="hidden" name="id" defaultValue={String(p.id)} />
                <Btn variant="danger">Delete project</Btn>
              </form>
            </details>
          ))}
        </div>
      </main>
    </>
  );
}
