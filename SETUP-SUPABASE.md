# Connecting Supabase (one-time, ~10 minutes)

The site works without this — it shows the seed content and the admin says
"connect Supabase". These steps turn on sign-in, the editable database and
file uploads so the `/admin` dashboard can change the live site.

## 1. Create the project
1. Go to supabase.com, create a project (free tier is fine). Pick a region
   close to your audience.
2. Project Settings → API. Copy **Project URL** and the **anon public** key.

## 2. Create the database and storage
1. Open SQL → New query, paste all of `supabase/schema.sql`, and run it.
2. In that file, edit the `is_admin()` function so the email list contains the
   address you will sign in with. Re-run the query after editing.
3. It creates the tables, the security rules, and a public `media` bucket for
   posters, preview loops and photos.

## 3. Create your login
1. Authentication → Users → Add user → create one with your email and a
   password. (Or enable email sign-ups, then disable them again.)
2. Use the same email in `is_admin()` above and in `ADMIN_EMAILS` below.

## 4. Set the environment variables
Local: copy `.env.example` to `.env.local` and fill in the three values.
Vercel: Settings → Environment Variables, add the same three for Production,
then redeploy.

| Variable | Where it comes from |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `ADMIN_EMAILS` | your login email(s), comma-separated |

There is deliberately **no service-role key** here: every admin write goes
through your signed-in session and is checked again by the database's own rules,
so there is no all-powerful key to leak.

## 5. Use it
Visit `/admin`, sign in, and start adding. Changes appear on the live site
within a minute (the pages revalidate automatically).

## Moving the seed content into the database
The five seed projects and the timeline live in `lib/content.ts`. Until you add
rows in the admin, the site shows those. Once you add a project in the admin,
the database takes over for that section. You can recreate the five there, or
leave them as the seed and only add new work.

## Security
- Only emails in `is_admin()` can read drafts or write anything, enforced in
  Postgres, not just in the app.
- `/admin` is gated by middleware and re-checked in every action.
- The security headers and a bounded self-test live in `next.config.ts` and
  `scripts/security-check.mjs` (`npm run security -- https://your-site`).
