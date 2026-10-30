-- ============================================================================
-- Paras Gupta portfolio — COMPLETE database setup.
-- Run this once in the Supabase SQL editor to put the whole backend into the
-- exact shape the site and the /admin dashboard expect: the admin rule with
-- your email, every content table with every column, Row Level Security, and
-- the media storage bucket. It is idempotent — safe to run again any time, and
-- running it will NOT delete any rows you have already added.
-- ============================================================================

-- ── 1. Who may edit (this is what makes Save work) ──────────────────────────
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select coalesce(
    (auth.jwt() ->> 'email') in (
      -- The email(s) you sign in to /admin with. Must match ADMIN_EMAILS.
      'parasgupta181205@gmail.com'
    ), false);
$$;

-- ── 2. Tables (create if missing, then add any missing columns) ─────────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  year text not null default '',
  role text not null default '',
  tools text[] not null default '{}',
  client text not null default '',
  story text not null default '',
  result text,
  theme text,
  badge text not null default 'Work',
  tint text not null default '#ff8a4c',
  status text not null default 'released',
  video_full text,
  preview_youtube text,
  poster text,
  preview_mp4 text,
  preview_webm text,
  hover_image text,
  sort int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);
-- add columns that older setups may not have
alter table public.projects add column if not exists preview_youtube text;
alter table public.projects add column if not exists hover_image text;

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null default '',
  icon text not null default 'mail',
  kind text not null default 'social',
  sort int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.timeline (
  id uuid primary key default gen_random_uuid(),
  org text not null,
  role text not null default '',
  period text not null default '',
  line text not null default '',
  tint text not null default '#ff8a4c',
  sort int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  alt text not null default '',
  width int not null default 1200,
  height int not null default 1200,
  sort int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.motion_graphics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text not null default '',
  kind text not null default 'video',
  media_youtube text,
  media_path text,
  poster text,
  sort int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ── 3. Row Level Security: anyone reads published rows; only an admin writes ─
do $$
declare t text;
begin
  foreach t in array array['projects','links','timeline','photos','motion_graphics'] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "read published" on public.%I;', t);
    execute format('drop policy if exists "admin writes"   on public.%I;', t);
    execute format($p$create policy "read published" on public.%I
      for select using (published or public.is_admin());$p$, t);
    execute format($p$create policy "admin writes" on public.%I
      for all using (public.is_admin()) with check (public.is_admin());$p$, t);
  end loop;
end $$;

-- ── 4. Storage: one public "media" bucket; public read, admin-only writes ───
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read" on storage.objects;
drop policy if exists "media admin write" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');
create policy "media admin write" on storage.objects
  for all using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

-- Done. Visit /admin, sign in with the email above, and Save will persist.
