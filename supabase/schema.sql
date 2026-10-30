-- Paras Gupta portfolio — database schema, Row Level Security and storage.
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
-- Safe to re-run: every object uses "if not exists" or "create or replace".

-- ───────────────────────────────────────────────────────────────────────────
-- Who is allowed to edit. Add the admin's auth email here; nobody else can
-- write, even with a valid login. This is the single source of authority.
-- ───────────────────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select coalesce(
    (auth.jwt() ->> 'email') in (
      -- ▼▼▼ EDIT THIS: the email(s) that may sign in to /admin. ▼▼▼
      -- One quoted email per line, comma-separated. Must match ADMIN_EMAILS.
      'CHANGE_ME@example.com'
    ), false);
$$;

-- ───────────────────────────────────────────────────────────────────────────
-- Content tables. "sort" orders them on the page; "published" hides a row
-- from the public site without deleting it.
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  year        text not null default '',
  role        text not null default '',
  tools       text[] not null default '{}',
  client      text not null default '',
  story       text not null default '',
  result      text,
  theme       text,
  badge       text not null default 'Work',
  tint        text not null default '#ff8a4c',
  status      text not null default 'released',   -- released | coming-soon
  video_full  text,                               -- unlisted YouTube URL
  preview_youtube text,                           -- YouTube link used as the hover preview
  poster      text,                               -- storage path or /public path
  preview_mp4 text,
  preview_webm text,
  hover_image text,
  sort        int not null default 0,
  published   boolean not null default true,
  updated_at  timestamptz not null default now()
);

create table if not exists public.links (
  id        uuid primary key default gen_random_uuid(),
  label     text not null,
  href      text not null default '',
  icon      text not null default 'mail',         -- instagram | linkedin | mail
  kind      text not null default 'social',       -- social | photography
  sort      int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.timeline (
  id        uuid primary key default gen_random_uuid(),
  org       text not null,
  role      text not null default '',
  period    text not null default '',
  line      text not null default '',
  tint      text not null default '#ff8a4c',
  sort      int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.photos (
  id        uuid primary key default gen_random_uuid(),
  path      text not null,                        -- storage path
  alt       text not null default '',
  width     int not null default 1200,
  height    int not null default 1200,
  sort      int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ───────────────────────────────────────────────────────────────────────────
-- Row Level Security: anyone may READ published rows; only an admin may write.
-- ───────────────────────────────────────────────────────────────────────────
alter table public.projects enable row level security;
alter table public.links    enable row level security;
alter table public.timeline enable row level security;
alter table public.photos   enable row level security;

do $$
declare t text;
begin
  foreach t in array array['projects','links','timeline','photos'] loop
    execute format('drop policy if exists "read published" on public.%I;', t);
    execute format('drop policy if exists "admin writes"   on public.%I;', t);
    execute format($p$create policy "read published" on public.%I
      for select using (published or public.is_admin());$p$, t);
    execute format($p$create policy "admin writes" on public.%I
      for all using (public.is_admin()) with check (public.is_admin());$p$, t);
  end loop;
end $$;

-- ───────────────────────────────────────────────────────────────────────────
-- Storage: one public bucket "media" for posters, preview loops and photos.
-- Public READ (the site shows them); only an admin may upload, change, delete.
-- ───────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read"  on storage.objects;
drop policy if exists "media admin write"   on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');
create policy "media admin write" on storage.objects
  for all using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
