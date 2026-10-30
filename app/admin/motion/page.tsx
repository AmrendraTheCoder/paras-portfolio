import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, publicAsset } from "@/lib/supabase/config";
import { AdminHeader, Unconfigured, PageTitle, Field, FileField, Toggle, Btn, shell, card } from "@/components/admin/ui";
import { saveMotion, deleteMotion } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
type Row = Record<string, string | boolean | number | null>;

function MotionForm({ r }: { r?: Row }) {
  const v = (k: string) => (r?.[k] == null ? "" : String(r[k]));
  return (
    <form action={saveMotion} className="grid gap-4">
      {r?.id ? <input type="hidden" name="id" defaultValue={String(r.id)} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" name="title" defaultValue={v("title")} required />
        <Field label="Caption (optional)" name="caption" defaultValue={v("caption")} placeholder="Title design · 2026" />
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-[var(--fg-muted)]">Type</span>
          <select name="kind" defaultValue={v("kind") || "video"} className="w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg-raised)] px-3.5 py-2.5 text-[15px]">
            <option value="video">Video (YouTube)</option>
            <option value="image">Image / still</option>
          </select>
        </label>
        <Field label="Sort order" name="sort" type="number" defaultValue={v("sort") || "0"} />
      </div>
      <Field label="Video — YouTube link (for a video item)" name="media_youtube" defaultValue={v("media_youtube")} placeholder="https://youtu.be/…" />
      <div className="grid gap-4 sm:grid-cols-2">
        <FileField label="Image (for an image item)" name="image_file" accept="image/*" hint="jpg / webp / png" />
        <FileField label="Poster (for a video item)" name="poster_file" accept="image/*" hint="1280×720 still" />
      </div>
      <div className="flex items-center justify-between">
        <Toggle name="published" defaultChecked={r ? Boolean(r.published) : true} />
        <Btn>{r?.id ? "Save" : "Add piece"}</Btn>
      </div>
    </form>
  );
}

export default async function MotionAdmin() {
  if (!isSupabaseConfigured) return <Unconfigured />;
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data } = (await supabase!.from("motion_graphics").select("*").order("sort", { ascending: true })) as { data: Row[] | null };
  const rows = data ?? [];
  return (
    <>
      <AdminHeader email={user.email} />
      <main className={shell}>
        <PageTitle title="Motion graphics" />
        <details className={`${card} mb-6`}>
          <summary className="cursor-pointer text-[15px] font-medium text-[var(--accent-text)]">+ Add a motion piece</summary>
          <div className="mt-5"><MotionForm /></div>
        </details>
        <div className="space-y-3">
          {rows.length === 0 ? <p className="text-[14px] text-[var(--fg-muted)]">Nothing yet. Add your first piece above.</p> : null}
          {rows.map((r) => (
            <details key={String(r.id)} className={card}>
              <summary className="flex cursor-pointer items-center gap-4">
                {r.poster || r.media_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={publicAsset(String(r.poster || r.media_path))} alt="" className="h-12 w-20 shrink-0 rounded object-cover" />
                ) : <span className="grid h-12 w-20 shrink-0 place-items-center rounded bg-[var(--bg-raised)] text-[10px] text-[var(--fg-muted)]">{String(r.kind)}</span>}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">{String(r.title)}</span>
                  <span className="block text-[12px] text-[var(--fg-muted)]">{String(r.kind)}{r.published ? "" : " · hidden"}</span>
                </span>
              </summary>
              <div className="mt-5"><MotionForm r={r} /></div>
              <form action={deleteMotion} className="mt-4 border-t border-[var(--line)] pt-4">
                <input type="hidden" name="id" defaultValue={String(r.id)} />
                <Btn variant="danger">Delete</Btn>
              </form>
            </details>
          ))}
        </div>
      </main>
    </>
  );
}
