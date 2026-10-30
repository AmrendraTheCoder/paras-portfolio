-- Adds the "hover preview via YouTube link" field to an existing database.
-- Run once in the Supabase SQL editor. Safe to re-run.
alter table public.projects add column if not exists preview_youtube text;
