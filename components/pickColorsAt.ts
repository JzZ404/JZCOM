// Eyedropper for the project-card sparkle: reads the cover image/video at
// the click and returns two colors from that spot — the color right under
// the click, and the most different color close around it, so the sparkle
// gets a real two-color gradient rather than one flat color. Returns null if
// the pixels can't be read (media not loaded yet, or the browser blocks it),
// so the caller can fall back to its default colors.

// The cover's visible area is sampled on a grid this many cells wide (a cell
// is ~5px on a card) — fine enough that the first color is what's really
// under the cursor, cheap enough to do on every click.
const GRID = 120;
// How far around the click (in grid cells, ~60px) to look for the second color.
const RADIUS = 12;

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

  // First color: the cell right under the click
  const first = pixel(cx, cy);

  // Second color: the most different one nearby
  let second = first;
  let best = 0;
  for (let y = Math.max(0, cy - RADIUS); y <= Math.min(rows - 1, cy + RADIUS); y++) {
    for (let x = Math.max(0, cx - RADIUS); x <= Math.min(cols - 1, cx + RADIUS); x++) {
      const p = pixel(x, y);
      const d = distance(p, first);
      if (d > best) {
        best = d;
        second = p;
      }
    }
  }

  // A flat area (one solid color) has no real second color — use a lighter
  // or darker shade of the first instead, so there's still a gradient.
  if (best < 40) {
    const light = (first[0] * 0.299 + first[1] * 0.587 + first[2] * 0.114) / 255 > 0.5;
    second = first.map((v) => Math.round(light ? v * 0.6 : v + (255 - v) * 0.5)) as RGB;
  }

  return [rgb(first), rgb(second)];
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
