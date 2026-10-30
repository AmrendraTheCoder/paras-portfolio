# Tool logos

Drop an official logo file here named after the tool and it appears on the
shelf instead of the placeholder glyph. Expected filenames (SVG preferred, PNG
works):

- after-effects.svg
- premiere-pro.svg
- photoshop.svg
- illustrator.svg
- figma.svg

Use the brands' own official assets (Adobe and Figma publish logo downloads).
Nothing is shipped here by default; until a file exists, the card shows the
site's own geometric glyph. To add another tool, add it to `tools` in
lib/content.ts with a matching `logo` path.
