import "server-only";
import { createClient as createJsClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/**
 * The service-role client, for writes made on the server after the admin is
 * authenticated and authorised. It bypasses RLS, so it is NEVER imported into
 * anything that reaches the browser, and the key is a server-only secret that
 * carries no NEXT_PUBLIC_ prefix. Returns null when unset.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) return null;
  return createJsClient(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
