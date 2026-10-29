import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminHeader, Unconfigured, PageTitle, Field, Area, Toggle, Btn, shell, card } from "@/components/admin/ui";
import { saveTimeline, deleteTimeline } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
type Row = Record<string, string | boolean | number | null>;

function TimelineForm({ r }: { r?: Row }) {
  const v = (k: string) => (r?.[k] == null ? "" : String(r[k]));
  return (
    <form action={saveTimeline} className="grid gap-4">
      {r?.id ? <input type="hidden" name="id" defaultValue={String(r.id)} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Organisation" name="org" defaultValue={v("org")} required />
        <Field label="Role" name="role" defaultValue={v("role")} />
        <Field label="Dates" name="period" defaultValue={v("period")} placeholder="2024 – present" />
        <Field label="Tint (hex)" name="tint" defaultValue={v("tint") || "#ff8a4c"} />
        <Field label="Sort order" name="sort" type="number" defaultValue={v("sort") || "0"} />
      </div>
      <Area label="One or two lines" name="line" defaultValue={v("line")} rows={2} />
      <div className="flex items-center justify-between">
        <Toggle name="published" defaultChecked={r ? Boolean(r.published) : true} />
        <Btn>{r?.id ? "Save" : "Add role"}</Btn>
      </div>
    </form>
  );
}

export default async function TimelineAdmin() {
  if (!isSupabaseConfigured) return <Unconfigured />;
  const user = await requireAdmin();
  const supabase = await createClient();
  const { data } = (await supabase!.from("timeline").select("*").order("sort", { ascending: true })) as { data: Row[] | null };
  const rows = data ?? [];
  return (
    <>
      <AdminHeader email={user.email} />
      <main className={shell}>
        <PageTitle title="Timeline" />
        <details className={`${card} mb-6`}>
          <summary className="cursor-pointer text-[15px] font-medium text-[var(--accent-text)]">+ Add a role</summary>
          <div className="mt-5"><TimelineForm /></div>
        </details>
        <div className="space-y-3">
          {rows.map((r) => (
            <details key={String(r.id)} className={card}>
              <summary className="flex cursor-pointer items-center justify-between gap-4">
                <span className="text-[15px] font-medium">{String(r.org)} · <span className="text-[var(--fg-muted)]">{String(r.role)}</span></span>
                <span className="text-[12px] text-[var(--fg-muted)]">{String(r.period)}</span>
              </summary>
              <div className="mt-5"><TimelineForm r={r} /></div>
              <form action={deleteTimeline} className="mt-4 border-t border-[var(--line)] pt-4">
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
