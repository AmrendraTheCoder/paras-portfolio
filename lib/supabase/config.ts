/**
 * Whether Supabase is wired up. The whole site is designed to run with these
 * unset — it then reads the seed content in lib/content.ts and the /admin
 * routes show a "connect Supabase" screen rather than erroring. Set the three
 * variables (see SETUP-SUPABASE.md) and the site starts reading the database.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** The public base of the storage bucket, for building <img> src URLs. */
export const STORAGE_BUCKET = "media";
export function publicAsset(path: string): string {
  if (!path) return path;
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}
