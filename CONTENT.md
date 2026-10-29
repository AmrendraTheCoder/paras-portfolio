# Where things go

Everything on the site comes from three places. No admin panel, no database:
the GitHub repository is the storage, and every push redeploys on Vercel.

## 1. Words and links: `lib/content.ts`

One file. Search it for `[PLACEHOLDER` to find every gap. The main spots:

| What | Where in the file |
|---|---|
| Name, role, bio, email | `profile` |
| Instagram (motion), Instagram (photography), LinkedIn, email | `socials` — replace `[URL]` and `[EMAIL]` |
| Each project’s role, tools, client, 2–3 sentence story, result | `projects` |
| Full video link per project | `projects[].video.full` — paste the unlisted YouTube URL |
| Experience dates and the Imagination role | `experience` |
| Leadership story | `leadership.chapters` — chapters marked `draft: true` are my wording; replace with yours |

### What to send for each project

- Role (e.g. “Director and editor”)
- Tools (e.g. “After Effects, Premiere Pro”)
- Client or event
- Two or three sentences: what the brief was, what you did, what made it work
- One result or number, only if there is one (views, reach, a quote from the client)
- The unlisted YouTube link
- A 1280×720 still for the poster, and if you have it a 4–8 second muted loop

## 2. Photographs: `public/photos/`

Drop image files in this folder (`.jpg`, `.webp`, `.png`). They appear in the
gallery automatically, in filename order, sized from the file itself. To
control the order, number them: `01-vivacity-stage.jpg`, `02-crowd.jpg`.

- Export at about 1600px on the long edge, under ~400 KB each.
- Delete the `photo-*.svg` placeholders once real photos are in.
- Optional alt text: edit `public/photos/captions.json`
  (`"01-vivacity-stage.jpg": "Main stage, VIVACITY ’25"`). Without it the
  filename becomes the caption.

Uploading from the browser: open the folder on GitHub → **Add file → Upload
files** → commit to `main`. Vercel rebuilds in about a minute.

## 3. Video stills and loops: `public/posters/` and `public/videos/`

- Posters: one 1280×720 `.jpg` or `.webp` per project, path set in
  `projects[].video.poster`.
- Preview loops: `public/videos/<slug>-preview.mp4` and `.webm`, 720p, muted,
  under ~2 MB. See `public/videos/README.md` for ffmpeg commands.
- Full films: never in the repo. Unlisted YouTube only.
