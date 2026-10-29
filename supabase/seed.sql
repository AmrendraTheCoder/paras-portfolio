-- One-time seed: loads the five projects, the timeline and the links that the
-- site currently shows from code into the database, so the admin lists them and
-- you edit instead of retyping. Run once in the Supabase SQL editor.
--
-- Safe to run: projects skip any slug that already exists; the timeline and
-- links seed only when their tables are still empty, so it won't duplicate.

-- ── Projects ────────────────────────────────────────────────────────────────
insert into public.projects
  (slug, title, year, role, tools, client, story, result, theme, badge, tint, status, video_full, poster, preview_mp4, preview_webm, sort, published)
values
  ('vivacity-25-aftermovie', 'VIVACITY ’25 Aftermovie', '2025', '[PLACEHOLDER role]', '{"[PLACEHOLDER tools]"}', 'VIVACITY ’25', '[PLACEHOLDER one-line story]', null, null, 'Aftermovie', '#ff8a3d', 'released', '[PLACEHOLDER YouTube unlisted URL]', '/posters/vivacity-25.svg', '/videos/vivacity-25-preview.mp4', '/videos/vivacity-25-preview.webm', 0, true),
  ('desportivos-25-aftermovie', 'DESPORTIVOS ’25 Aftermovie', '2025', '[PLACEHOLDER role]', '{"[PLACEHOLDER tools]"}', 'DESPORTIVOS ’25', '[PLACEHOLDER one-line story]', null, null, 'Aftermovie', '#22d3ee', 'released', '[PLACEHOLDER YouTube unlisted URL]', '/posters/desportivos-25.svg', '/videos/desportivos-25-preview.mp4', '/videos/desportivos-25-preview.webm', 1, true),
  ('vivacity-26-aftermovie', 'VIVACITY ’26 Aftermovie', '2026', '[PLACEHOLDER role]', '{"[PLACEHOLDER tools]"}', 'VIVACITY ’26', '[PLACEHOLDER one-line story]', null, 'Anachronic Melange: desi maximalism, full of high colour.', 'Coming soon', '#ff2d87', 'coming-soon', '[PLACEHOLDER YouTube unlisted URL]', '/posters/vivacity-26.svg', '/videos/vivacity-26-preview.mp4', '/videos/vivacity-26-preview.webm', 2, true),
  ('client-project-1', '[PLACEHOLDER client project]', '[PLACEHOLDER year]', '[PLACEHOLDER role]', '{"[PLACEHOLDER tools]"}', '[PLACEHOLDER client]', '[PLACEHOLDER one-line story]', null, null, 'Client work', '#ff8a4c', 'released', '[PLACEHOLDER YouTube unlisted URL]', '/posters/client-1.svg', '/videos/client-1-preview.mp4', '/videos/client-1-preview.webm', 3, true),
  ('client-project-2', '[PLACEHOLDER client project]', '[PLACEHOLDER year]', '[PLACEHOLDER role]', '{"[PLACEHOLDER tools]"}', '[PLACEHOLDER client]', '[PLACEHOLDER one-line story]', null, null, 'Client work', '#1e60ff', 'released', '[PLACEHOLDER YouTube unlisted URL]', '/posters/client-2.svg', '/videos/client-2-preview.mp4', '/videos/client-2-preview.webm', 4, true)
on conflict (slug) do nothing;

-- ── Timeline (only if empty) ────────────────────────────────────────────────
insert into public.timeline (org, role, period, line, tint, sort, published)
select * from (values
  ('LNMHACKS 9.0', 'Creative Head', '[PLACEHOLDER dates]', 'Creative direction for the hackathon’s vector-art identity.', '#1e60ff', 0, true),
  ('VIVACITY', 'Creative Head', '[PLACEHOLDER dates]', 'Leading the fest’s creative team; previously made the VIVACITY and DESPORTIVOS aftermovies.', '#ff2d87', 1, true),
  ('Freelance', 'Motion design and graphic design', '[PLACEHOLDER dates]', '[PLACEHOLDER client names and what was made for them]', '#22d3ee', 2, true),
  ('Imagination', '[PLACEHOLDER role]', '[PLACEHOLDER dates]', '[PLACEHOLDER one line on the work]', '#ff8a3d', 3, true)
) as v(org, role, period, line, tint, sort, published)
where not exists (select 1 from public.timeline);

-- ── Links (only if empty) ───────────────────────────────────────────────────
insert into public.links (label, href, icon, kind, sort, published)
select * from (values
  ('Instagram · Motion', '[URL]', 'instagram', 'social', 0, true),
  ('Instagram · Photography', '[URL]', 'instagram', 'photography', 1, true),
  ('LinkedIn', '[URL]', 'linkedin', 'social', 2, true),
  ('Email', 'mailto:[EMAIL]', 'mail', 'social', 3, true)
) as v(label, href, icon, kind, sort, published)
where not exists (select 1 from public.links);
