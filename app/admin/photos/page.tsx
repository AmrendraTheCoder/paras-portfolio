import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, publicAsset } from "@/lib/supabase/config";
import { AdminHeader, Unconfigured, PageTitle, Alert, Field, Toggle, Btn, shell, card } from "@/components/admin/ui";
import { uploadPhotos, savePhoto, deletePhoto } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
type Row = Record<string, string | boolean | number | null>;

export default async function PhotosAdmin({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const sp = await searchParams;
  if (!isSupabaseConfigured) return <Unconfigured />;
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data } = (await supabase!.from("photos").select("*").order("sort", { ascending: true })) as { data: Row[] | null };
  const rows = data ?? [];

  return (
    <>
      <AdminHeader email={user.email} />
      <main className={shell}>
        <PageTitle title="Photography" />
        <Alert error={sp.error} saved={sp.saved === "1"} />
        <form action={uploadPhotos} className={`${card} mb-8 grid gap-4`}>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--fg-muted)]">Upload photos (select several at once)</span>
            <input name="photos" type="file" accept="image/*" multiple required className="w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg-raised)] px-3.5 py-2.5 text-[15px] file:mr-3 file:rounded file:border-0 file:bg-[var(--bg-tile-hover)] file:px-3 file:py-1 file:text-[var(--fg)]" />
          </label>
          <div className="flex items-end justify-between gap-4">
            <div className="w-32"><Field label="Start sort at" name="sort" type="number" defaultValue={String(rows.length)} /></div>
            <Btn pendingLabel="Uploading…">Upload</Btn>
          </div>
        </form>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((r) => (
            <div key={String(r.id)} className={card}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={publicAsset(String(r.path))} alt={String(r.alt)} className="mb-3 aspect-square w-full rounded object-cover" />
              <form action={savePhoto} className="grid gap-2.5">
                <input type="hidden" name="id" defaultValue={String(r.id)} />
                <Field label="Alt text" name="alt" defaultValue={String(r.alt)} />
                <Field label="Sort" name="sort" type="number" defaultValue={String(r.sort)} />
                <div className="flex items-center justify-between">
                  <Toggle name="published" defaultChecked={Boolean(r.published)} />
                  <Btn variant="ghost">Save</Btn>
                </div>
              </form>
              <form action={deletePhoto} className="mt-2 border-t border-[var(--line)] pt-2">
                <input type="hidden" name="id" defaultValue={String(r.id)} />
                <input type="hidden" name="path" defaultValue={String(r.path)} />
                <button className="text-[12px] text-[var(--color-error)] hover:underline">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
