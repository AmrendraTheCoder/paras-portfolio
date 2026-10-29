import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminHeader, Unconfigured, PageTitle, Field, Toggle, Btn, shell, card } from "@/components/admin/ui";
import { saveLink, deleteLink } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
type Row = Record<string, string | boolean | number | null>;

function LinkForm({ r }: { r?: Row }) {
  const v = (k: string) => (r?.[k] == null ? "" : String(r[k]));
  return (
    <form action={saveLink} className="grid gap-4">
      {r?.id ? <input type="hidden" name="id" defaultValue={String(r.id)} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Label" name="label" defaultValue={v("label")} placeholder="Instagram · Motion" required />
        <Field label="URL" name="href" defaultValue={v("href")} placeholder="https://instagram.com/…" />
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-[var(--fg-muted)]">Icon</span>
          <select name="icon" defaultValue={v("icon") || "instagram"} className="w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg-raised)] px-3.5 py-2.5 text-[15px]">
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="mail">Email</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-[var(--fg-muted)]">Which one</span>
          <select name="kind" defaultValue={v("kind") || "social"} className="w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg-raised)] px-3.5 py-2.5 text-[15px]">
            <option value="social">General</option>
            <option value="photography">Photography (gallery links here)</option>
          </select>
        </label>
        <Field label="Sort order" name="sort" type="number" defaultValue={v("sort") || "0"} />
      </div>
      <div className="flex items-center justify-between">
        <Toggle name="published" defaultChecked={r ? Boolean(r.published) : true} />
        <Btn>{r?.id ? "Save" : "Add link"}</Btn>
      </div>
    </form>
  );
}

export default async function LinksAdmin() {
  if (!isSupabaseConfigured) return <Unconfigured />;
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data } = (await supabase!.from("links").select("*").order("sort", { ascending: true })) as { data: Row[] | null };
  const rows = data ?? [];
  return (
    <>
      <AdminHeader email={user.email} />
      <main className={shell}>
        <PageTitle title="Links" />
        <details className={`${card} mb-6`}>
          <summary className="cursor-pointer text-[15px] font-medium text-[var(--accent-text)]">+ Add a link</summary>
          <div className="mt-5"><LinkForm /></div>
        </details>
        <div className="space-y-3">
          {rows.map((r) => (
            <details key={String(r.id)} className={card}>
              <summary className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-[15px] font-medium">{String(r.label)}</span>
                <span className="truncate text-[12px] text-[var(--fg-muted)]">{String(r.href) || "no URL"}</span>
              </summary>
              <div className="mt-5"><LinkForm r={r} /></div>
              <form action={deleteLink} className="mt-4 border-t border-[var(--line)] pt-4">
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
