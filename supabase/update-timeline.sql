-- Experience timeline: five roles, orange only.
-- Adds DESPORTIVOS, fills in Imagination, and sets every tint to orange.
-- Safe to run more than once: it replaces the timeline rows in one transaction.
-- Note: this overwrites any dates you typed into the timeline in /admin.
-- Edit the period values below first if you already know them.

begin;

delete from public.timeline;

insert into public.timeline (org, role, period, line, tint, sort, published) values
  ('LNMHACKS 9.0', 'Creative Head', '[PLACEHOLDER dates]',
   'Creative direction for the hackathon’s vector-art identity: brand, motion, launch films.', '#ff6a1f', 1, true),
  ('VIVACITY', 'Creative Head', '[PLACEHOLDER dates]',
   'Leading the fest’s creative team. Edited the VIVACITY’25 Tela Indrae aftermovie and the theme reveal.', '#ff6a1f', 2, true),
  ('DESPORTIVOS', 'Editor · Motion', '2025',
   'Cut the DESPORTIVOS’25 Pixel Paradox aftermovie in Premiere Pro and After Effects.', '#ff6a1f', 3, true),
  ('Freelance', 'Motion design and graphic design', '[PLACEHOLDER dates]',
   'Edits and motion for creators, including an introductory reel for a client’s Instagram launch.', '#ff6a1f', 4, true),
  ('Imagination', 'Member', '[PLACEHOLDER dates]',
   'Worked across photography, cinematography and editing, and grew into a senior member and creative lead.', '#ff6a1f', 5, true);

commit;

select sort, org, role, period from public.timeline order by sort;
