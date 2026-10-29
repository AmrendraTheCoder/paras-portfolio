# Videos

Only small preview loops live here. Full videos are **unlisted YouTube
uploads**, referenced from `lib/content.ts` as `video.full` (paste the normal
watch URL, `https://www.youtube.com/watch?v=…` or `https://youtu.be/…`). The
site embeds them with the privacy-enhanced player, which is the only frame the
Content-Security-Policy allows.

## Preview loops (committed)

- 720p, H.264 `.mp4` plus a VP9 `.webm`, muted, 4–8 seconds, under ~2 MB each.
- Named after the project slug: `vivacity-25-preview.mp4` / `.webm`.
- The hero showreel loop is `showreel.mp4` / `showreel.webm`. Keep it under
  ~6 MB; if the full-quality reel is bigger, upload it to YouTube too and point
  `showreel.full` at that URL.

Suggested ffmpeg (from a trimmed master clip):

    ffmpeg -i in.mov -t 6 -an -vf "scale=-2:720,fps=24" -c:v libx264 -crf 28 -preset slow -movflags +faststart out.mp4
    ffmpeg -i in.mov -t 6 -an -vf "scale=-2:720,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 38 out.webm

## Posters

One still per video in `/public/posters`, 1280×720, `.jpg` or `.webp` under
150 KB. Replace the `.svg` placeholders and update the paths in `lib/content.ts`.

## Full videos (never committed)

Drop local masters in `public/videos/full/`; that folder is git-ignored.
