// Eyedropper for the project-card sparkle: reads the cover image/video at
// the click and returns two colors from that spot — the nearest *colorful*
// pixel to the click, and a second colorful one around it that differs from
// it, so the sparkle gets a real two-color gradient. Greys, near-black and
// near-white are skipped: photos are full of them, and picking them made the
// sparkle read as grey. Returns null if there's no real color near the click
// or the pixels can't be read (media not loaded yet, or the browser blocks
// it), so the caller can fall back to its default colors.

// The cover's visible area is sampled on a grid this many cells wide (a cell
// is ~5px on a card) — fine enough that the picked color is what's really
// near the cursor, cheap enough to do on every click.
const GRID = 120;
// How far (in grid cells, ~100px) past the closest color to keep looking.
const RADIUS = 20;
// Minimum colorfulness (max−min channel, 0–255) for a pixel to count as a
// color rather than a grey.
const MIN_CHROMA = 45;

type RGB = [number, number, number];

export function pickColorsAt(
  media: HTMLImageElement | HTMLVideoElement,
  clientX: number,
  clientY: number,
): [string, string] | null {
  const isVideo = media instanceof HTMLVideoElement;
  const naturalW = isVideo ? media.videoWidth : media.naturalWidth;
  const naturalH = isVideo ? media.videoHeight : media.naturalHeight;
  if (!naturalW || !naturalH) return null;

  const rect = media.getBoundingClientRect();
  // A click outside the cover (on the title or tags) samples its nearest edge
  const localX = Math.min(Math.max(clientX - rect.left, 0), rect.width - 1);
  const localY = Math.min(Math.max(clientY - rect.top, 0), rect.height - 1);

  // The part of the source the object-cover box actually shows, so the
  // sampled spot matches what's on screen under the cursor.
  const scale = Math.max(rect.width / naturalW, rect.height / naturalH);
  const [posX, posY] = objectPosition(media);
  const srcW = rect.width / scale;
  const srcH = rect.height / scale;
  const srcX = (naturalW - srcW) * posX;
  const srcY = (naturalH - srcH) * posY;

  const cols = GRID;
  const rows = Math.max(1, Math.round((GRID * rect.height) / rect.width));
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  let data: Uint8ClampedArray;
  try {
    ctx.drawImage(media, srcX, srcY, srcW, srcH, 0, 0, cols, rows);
    data = ctx.getImageData(0, 0, cols, rows).data;
  } catch {
    return null;
  }

  const pixel = (x: number, y: number): RGB => {
    const i = (y * cols + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const cx = Math.round((localX / rect.width) * (cols - 1));
  const cy = Math.round((localY / rect.height) * (rows - 1));

  // Every colorful pixel on the cover, with how far it is from the click.
  // Colors come from around the click when there are any; on an area with
  // none (white UI, cream paper), from the nearest color anywhere on it.
  const colorful: { color: RGB; dist: number }[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const color = pixel(x, y);
      if (chroma(color) >= MIN_CHROMA) colorful.push({ color, dist: Math.hypot(x - cx, y - cy) });
    }
  }
  if (colorful.length === 0) return null;
  const closest = Math.min(...colorful.map((p) => p.dist));
  const nearby = colorful.filter((p) => p.dist <= closest + RADIUS);

  // First color: the closest colorful pixel (more colorful wins a near tie)
  const first = nearby.reduce((a, b) =>
    b.dist - chroma(b.color) / 40 < a.dist - chroma(a.color) / 40 ? b : a,
  ).color;

  // Second color: colorful and different from the first, favoring the most
  // vivid; with nothing different enough nearby, a lighter or darker shade
  // of the first so there's still a gradient.
  let second: RGB | null = null;
  let best = 0;
  for (const { color } of nearby) {
    const d = distance(color, first);
    const score = d * chroma(color);
    if (d >= 60 && score > best) {
      best = score;
      second = color;
    }
  }
  if (!second) {
    const light = (first[0] * 0.299 + first[1] * 0.587 + first[2] * 0.114) / 255 > 0.5;
    second = first.map((v) => Math.round(light ? v * 0.6 : v + (255 - v) * 0.5)) as RGB;
  }

  return [rgb(first), rgb(second)];
}

function chroma([r, g, b]: RGB) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function distance(a: RGB, b: RGB) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function rgb([r, g, b]: RGB) {
  return `rgb(${r} ${g} ${b})`;
}

// The media's object-position as 0–1 fractions (x, y). Covers set it as a
// percentage or keyword ("left center"); anything else counts as centered.
function objectPosition(el: HTMLElement): [number, number] {
  const [x = "50%", y = "50%"] = getComputedStyle(el).objectPosition.split(" ");
  const parse = (v: string) => {
    if (v.endsWith("%")) return parseFloat(v) / 100;
    if (v === "left" || v === "top") return 0;
    if (v === "right" || v === "bottom") return 1;
    return 0.5;
  };
  return [parse(x), parse(y)];
}
