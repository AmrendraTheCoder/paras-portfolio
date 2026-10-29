/**
 * Guaranteeing a readable label on top of an arbitrary brand colour.
 *
 * Picking black-or-white from the fill's luminance is not enough on its own.
 * Mid-luminance brands sit in a band where *neither* ink clears 4.5:1 against
 * the raw colour: Postman orange measured 2.82:1 with white, Claude clay 3.12,
 * Node green 3.17. On a 92px tile that is the difference between a label you
 * can read and one you cannot.
 *
 * So the fill itself moves. The ink is chosen first, then the brand is stepped
 * toward black (behind white ink) or toward white (behind dark ink) until the
 * pair clears the threshold. Hue is preserved, so the tile still reads as the
 * brand; only the value shifts, and only as far as it has to.
 */

type RGB = [number, number, number];

function toRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
}

function toHex([r, g, b]: RGB) {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

function luminance([r, g, b]: RGB) {
  const [R, G, B] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrast(a: string, b: string) {
  const l1 = luminance(toRgb(a));
  const l2 = luminance(toRgb(b));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const INK_DARK = "#141413";
const INK_LIGHT = "#ffffff";

/**
 * Returns the ink to print on this brand, and the fill to actually paint,
 * which may be a darkened or lightened step of the brand.
 *
 * @param target minimum contrast ratio. 4.5 is AA for normal text.
 */
export function readableFill(brand: string, target = 4.5) {
  const rgb = toRgb(brand);
  // Choose the ink that already has more room to work with.
  const ink = contrast(brand, INK_LIGHT) >= contrast(brand, INK_DARK) ? INK_LIGHT : INK_DARK;
  const toward: RGB = ink === INK_LIGHT ? [0, 0, 0] : [255, 255, 255];

  if (contrast(brand, ink) >= target) return { ink, fill: brand };

  // Step in 2% increments. 50 steps reaches the endpoint, which always passes.
  for (let i = 1; i <= 50; i++) {
    const t = i / 50;
    const moved = toHex([
      rgb[0] + (toward[0] - rgb[0]) * t,
      rgb[1] + (toward[1] - rgb[1]) * t,
      rgb[2] + (toward[2] - rgb[2]) * t,
    ]);
    if (contrast(moved, ink) >= target) return { ink, fill: moved };
  }

  return { ink, fill: toHex(toward) };
}
