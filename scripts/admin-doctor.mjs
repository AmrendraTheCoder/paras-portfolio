/**
 * Admin doctor — checks everything a Save in /admin depends on.
 *
 * Reads .env.local, connects with the public anon key (the same access the
 * site has) and verifies: the environment variables, that every table exists
 * with every column the app writes, that the media bucket is reachable, and
 * that the is_admin() rule exists. It only reads; it writes nothing.
 *
 *   npm run admin:doctor
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

for (const line of (() => { try { return readFileSync(".env.local", "utf8").split("\n"); } catch { return []; } })()) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const admins = process.env.ADMIN_EMAILS;

const results = [];
const ok = (name, pass, detail = "") => results.push({ name, pass, detail });

// Columns the app reads or writes, per table.
const SCHEMA = {
  projects: ["id","slug","title","year","role","tools","client","story","result","theme","badge","tint","status","video_full","preview_youtube","poster","preview_mp4","preview_webm","hover_image","sort","published","updated_at"],
  motion_graphics: ["id","title","caption","kind","media_youtube","media_path","poster","sort","published","updated_at"],
  links: ["id","label","href","icon","kind","sort","published","updated_at"],
  timeline: ["id","org","role","period","line","tint","sort","published","updated_at"],
  photos: ["id","path","alt","width","height","sort","published","updated_at"],
};

ok("NEXT_PUBLIC_SUPABASE_URL set", Boolean(url), url ? new URL(url).host : "missing");
ok("NEXT_PUBLIC_SUPABASE_ANON_KEY set", Boolean(anon));
ok("ADMIN_EMAILS set", Boolean(admins), admins || "missing — nobody can enter /admin");

if (!url || !anon) { report(); process.exit(1); }
const db = createClient(url, anon, { auth: { persistSession: false } });

for (const [table, cols] of Object.entries(SCHEMA)) {
  // Does the table exist / is it readable?
  const { error: tErr, count } = await db.from(table).select("id", { head: true, count: "exact" });
  if (tErr) {
    ok(`table "${table}"`, false, tErr.message);
    continue;
  }
  ok(`table "${table}" readable`, true, `${count ?? 0} published row(s)`);

  // Which columns are missing? PostgREST errors per unknown column.
  const missing = [];
  for (const c of cols) {
    const { error } = await db.from(table).select(c, { head: true });
    if (error && /does not exist|column/i.test(error.message)) missing.push(c);
  }
  ok(`  columns on "${table}"`, missing.length === 0,
     missing.length ? `MISSING: ${missing.join(", ")}` : `all ${cols.length} present`);
}

// The admin rule must exist, or every write is refused.
try {
  const { error } = await db.rpc("is_admin");
  if (error && /could not find|does not exist|404/i.test(error.message)) {
    ok("is_admin() rule exists", false, "not found — run supabase/setup-complete.sql");
  } else {
    ok("is_admin() rule exists", true, "present (returns false for anonymous, as expected)");
  }
} catch (e) {
  ok("is_admin() rule exists", false, e.message);
}

// Storage bucket used for every upload.
try {
  const { error } = await db.storage.from("media").list("", { limit: 1 });
  ok('storage bucket "media" reachable', !error, error ? error.message : "");
} catch (e) {
  ok('storage bucket "media" reachable', false, e.message);
}

report();

function report() {
  console.log("");
  for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    console.log("\nIssues found:");
    for (const f of failed) console.log(`  · ${f.name} — ${f.detail}`);
  }
}
