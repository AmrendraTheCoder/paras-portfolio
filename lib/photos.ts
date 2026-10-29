import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import type { Photo } from "@/lib/content";

/**
 * The photography gallery is a folder, not a list.
 *
 * Every image in /public/photos is picked up at build time, in filename order,
 * with its real pixel size read from the file so the masonry can reserve each
 * slot before the image arrives. Adding a photograph is therefore an upload
 * (GitHub's "Upload files" button works) followed by a redeploy; no code
 * changes hands. An optional captions.json in the same folder maps a filename
 * to its alt text; otherwise the filename is turned into words.
 */
const DIR = path.join(process.cwd(), "public", "photos");
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);

function humanize(name: string) {
  const base = name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export async function getPhotos(): Promise<Photo[]> {
  let names: string[];
  try {
    names = await fs.readdir(DIR);
  } catch {
    return [];
  }

  let captions: Record<string, string> = {};
  try {
    captions = JSON.parse(await fs.readFile(path.join(DIR, "captions.json"), "utf8"));
  } catch {
    /* no captions file, filenames will do */
  }

  const files = names
    .filter((n) => !n.startsWith(".") && EXT.has(path.extname(n).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

  return Promise.all(
    files.map(async (name) => {
      const meta = await sharp(path.join(DIR, name)).metadata();
      return {
        src: `/photos/${name}`,
        width: meta.width ?? 1200,
        height: meta.height ?? 1200,
        alt: captions[name] ?? humanize(name),
      };
    }),
  );
}
