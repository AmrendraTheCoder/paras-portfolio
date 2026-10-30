-- Adds a "Motion graphics" gallery that Paras uploads to from /admin.
-- ADDITIVE and non-conflicting: it reuses the existing public.is_admin() rule
-- and the existing "media" storage bucket. It does not touch any other table,
-- policy or bucket. Run once in the Supabase SQL editor. Safe to re-run.
create table if not exists public.motion_graphics (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  caption       text not null default '',
  kind          text not null default 'video',   -- video | image
  media_youtube text,                              -- YouTube link (video items)
  media_path    text,                              -- storage path (image items)
  poster        text,                              -- storage path / poster (video items)
  sort          int not null default 0,
  published     boolean not null default true,
  updated_at    timestamptz not null default now()
);

alter table public.motion_graphics enable row level security;

drop policy if exists "read published" on public.motion_graphics;
drop policy if exists "admin writes"   on public.motion_graphics;
create policy "read published" on public.motion_graphics
  for select using (published or public.is_admin());
create policy "admin writes" on public.motion_graphics
  for all using (public.is_admin()) with check (public.is_admin());
