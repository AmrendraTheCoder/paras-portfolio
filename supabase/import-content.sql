-- ============================================================================
-- Import Paras Gupta's real work and motion graphics.
-- Run once in the Supabase SQL editor, AFTER setup-complete.sql. Idempotent:
-- re-running replaces these same entries rather than duplicating them. Posters
-- use each video's own YouTube thumbnail; the hover preview plays the clip.
-- Replace any poster later by uploading a still in /admin.
-- ============================================================================

-- Clear the placeholder projects (keeps anything you added with a real slug).
delete from public.projects
where title like '[PLACEHOLDER%'
   or slug in ('vivacity-25-aftermovie','desportivos-25-aftermovie','vivacity-26-aftermovie','client-project-1','client-project-2');

insert into public.projects
  (slug, title, year, role, tools, client, story, theme, badge, tint, status, video_full, preview_youtube, poster, sort, published)
values
  ('vivacity-25-tela-indrae', 'VIVACITY ’25 — Tela Indrae', '2025', 'Editor · After Effects · Premiere Pro', '{"Premiere Pro","After Effects"}', 'VIVACITY ’25', 'Step into the surreal realm of VIVACITY ’25: Tela Indrae, where melodies paint the sky, energy shakes the ground, and every moment feels like a dream stitched into reality.', 'Tela Indrae', 'Aftermovie', '#ff8a4c', 'released', 'https://youtu.be/1xyrpnRfusg', 'https://youtu.be/1xyrpnRfusg', 'https://i.ytimg.com/vi/1xyrpnRfusg/maxresdefault.jpg', 0, true),
  ('desportivos-25-pixel-paradox', 'DESPORTIVOS ’25 — Pixel Paradox', '2025', 'Editor · After Effects · Premiere Pro', '{"Premiere Pro","After Effects"}', 'DESPORTIVOS ’25', 'A world where reality glitched, pixels collided, and every moment became a memory.', 'Pixel Paradox', 'Aftermovie', '#22d3ee', 'released', 'https://youtu.be/9G0H9GHHCVo', 'https://youtu.be/9G0H9GHHCVo', 'https://i.ytimg.com/vi/9G0H9GHHCVo/maxresdefault.jpg', 1, true),
  ('vivacity-26', 'VIVACITY ’26', '2026', null, '{}', 'VIVACITY ’26', null, 'Anachronic Melange', 'Coming soon', '#ff2d87', 'coming-soon', null, null, null, 2, true),
  ('client-content-intro', 'Content Creator Intro', '', 'Editor · After Effects · Premiere Pro', '{"Premiere Pro","After Effects"}', 'Private client', 'A short introductory film for a client stepping into content creation, cut for his Instagram page.', null, 'Client work', '#1e60ff', 'released', 'https://youtube.com/shorts/S23lNUIyL_0', 'https://youtube.com/shorts/S23lNUIyL_0', 'https://i.ytimg.com/vi/S23lNUIyL_0/maxresdefault.jpg', 3, true),
  ('30dtg', '30DTG', '', 'Editor · After Effects', '{"After Effects"}', '', null, null, 'Reel', '#c0fe04', 'released', 'https://youtube.com/shorts/8Y0C33DsL8M', 'https://youtube.com/shorts/8Y0C33DsL8M', 'https://i.ytimg.com/vi/8Y0C33DsL8M/maxresdefault.jpg', 4, true),
  ('javed-ali-reveal', 'Javed Ali Reveal', '', 'Editor · After Effects', '{"After Effects"}', '', null, null, 'Reveal', '#ff3ec8', 'released', 'https://youtube.com/shorts/jnbLSuAXZXY', 'https://youtube.com/shorts/jnbLSuAXZXY', 'https://i.ytimg.com/vi/jnbLSuAXZXY/maxresdefault.jpg', 5, true),
  ('theme-reveal', 'Theme Reveal', '', 'Editor · After Effects · Premiere Pro', '{"Premiere Pro","After Effects"}', '', null, null, 'Reveal', '#ffb020', 'released', 'https://youtu.be/_raGxi9oMqo', 'https://youtu.be/_raGxi9oMqo', 'https://i.ytimg.com/vi/_raGxi9oMqo/maxresdefault.jpg', 6, true)
on conflict (slug) do update set
  title = excluded.title, year = excluded.year, role = excluded.role, tools = excluded.tools,
  client = excluded.client, story = excluded.story, theme = excluded.theme, badge = excluded.badge,
  tint = excluded.tint, status = excluded.status, video_full = excluded.video_full,
  preview_youtube = excluded.preview_youtube, poster = excluded.poster, sort = excluded.sort,
  published = excluded.published, updated_at = now();

-- ── Motion graphics ─────────────────────────────────────────────────────────
delete from public.motion_graphics
where title like '[PLACEHOLDER%'
   or media_youtube in ('https://youtu.be/je2ECwq5EWc', 'https://youtube.com/shorts/bP_o0UsWZdQ', 'https://youtube.com/shorts/s5np6EYVqO4', 'https://youtube.com/shorts/VZePYmkGnbY', 'https://youtube.com/shorts/S1ydZcvny-k');

insert into public.motion_graphics
  (title, caption, kind, media_youtube, poster, sort, published)
values
  ('Coca-Cola Motion Graphic', 'After Effects', 'video', 'https://youtu.be/je2ECwq5EWc', 'https://i.ytimg.com/vi/je2ECwq5EWc/maxresdefault.jpg', 0, true),
  ('Motion Graphic 01', 'After Effects', 'video', 'https://youtube.com/shorts/bP_o0UsWZdQ', 'https://i.ytimg.com/vi/bP_o0UsWZdQ/maxresdefault.jpg', 1, true),
  ('Motion Graphic 02', 'After Effects', 'video', 'https://youtube.com/shorts/s5np6EYVqO4', 'https://i.ytimg.com/vi/s5np6EYVqO4/maxresdefault.jpg', 2, true),
  ('Motion Graphic 03', 'After Effects', 'video', 'https://youtube.com/shorts/VZePYmkGnbY', 'https://i.ytimg.com/vi/VZePYmkGnbY/maxresdefault.jpg', 3, true),
  ('Motion Graphic 04', 'After Effects', 'video', 'https://youtube.com/shorts/S1ydZcvny-k', 'https://i.ytimg.com/vi/S1ydZcvny-k/maxresdefault.jpg', 4, true);
