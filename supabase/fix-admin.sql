-- Fixes "edits don't save": sets who is allowed to write.
--
-- The admin signs in fine, but every write is also checked in the database by
-- is_admin(), which only lets through the emails listed here. If your email is
-- not in this list, an edit changes zero rows and looks like it did nothing.
--
-- Replace the address below with the email you sign in with (the same one in
-- ADMIN_EMAILS), then run this in the Supabase SQL editor. List several with a
-- comma between the quoted lines.
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select coalesce(
    (auth.jwt() ->> 'email') in (
      'your-admin-email@example.com'
    ), false);
$$;

-- Check it worked: this should return your email, confirming the rule can read it.
-- select auth.jwt() ->> 'email';
