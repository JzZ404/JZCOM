// The FocusFarm playground's miniature island: a small patch of the app's
// world, drawn in code in its style. The palette is FocusFarm's own (COL in
// its scene.js) and the decor comes from its pixel sprite library
// (public/focusfarm/sprites.js, window.FF). Drawn once at art resolution;
// the canvas is scaled up on the page with crisp pixels.

export const ART = { w: 220, h: 96 };

const COL = {
  water: "#a8d8c6", waterD: "#94ccb6", waterL: "#c6e9da",
  grass: "#bfdc8e", grassD: "#a7cd73", grassDark: "#93bd63", grassL: "#d2e8a6",
  soil: "#d8b489", soilD: "#c3996a", soilDk: "#ab7e54",
};

// Where things are, in art pixels. The animals read these to stay on land.
export const ISLAND = { cx: 110, cy: 46, rx: 94, ry: 35 };
export const POND = { cx: 42, cy: 58, rx: 14, ry: 6 };
// How far the island's dirt cliff drops below its grass
const CLIFF = 6;

type FF = { raster: (name: string, scale: number) => HTMLCanvasElement };

// Seeded, so the island looks the same on every visit
function rng(seed: number) {
  let s = seed;
  const f = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return { f, i: (a: number, b: number) => Math.floor(a + f() * (b - a + 1)) };
}

// Which art pixels are grass, filled in when the island is drawn
let land: Uint8Array | null = null;
const onLand = (x: number, y: number) => {
  const px = Math.round(x);
  const py = Math.round(y);
  if (!land || px < 0 || py < 0 || px >= ART.w || py >= ART.h) return false;
  return land[py * ART.w + px] === 1;
};

// True for a point where an animal can stand: on the grass with a little
// room to spare, clear of the pond and the trees along the top. Before the island is drawn, a plain ellipse stands in for it.
export function walkable(x: number, y: number) {
  if (land) {
    if (![[0, 0], [-7, 0], [7, 0], [0, -3], [0, 3]].every(([dx, dy]) => onLand(x + dx, y + dy))) return false;
  } else {
    const dx = (x - ISLAND.cx) / (ISLAND.rx * 0.8);
    const dy = (y - ISLAND.cy) / (ISLAND.ry * 0.75);
    if (dx * dx + dy * dy > 1) return false;
  }
  if (y < 36) return false;
  const px = (x - POND.cx) / (POND.rx + 6);
  const py = (y - POND.cy) / (POND.ry + 4);
  return px * px + py * py >= 1;
}

export function drawScene(canvas: HTMLCanvasElement, FF: FF) {
  canvas.width = ART.w;
  canvas.height = ART.h;
  const c = canvas.getContext("2d");
  if (!c) return;
  c.imageSmoothingEnabled = false;
  const { f, i: ri } = rng(11);
  const ellipse = (cx: number, cy: number, rx: number, ry: number) => {
    c.beginPath();
    c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  };

  // The island's outline: an irregular ring of lobes and coves (several
  // overlapping waves plus a little noise), smoothed into one closed path
  const pts: [number, number][] = [];
  for (let n = 0; n < 26; n++) {
    const a = (n / 26) * Math.PI * 2;
    const w =
      1 +
      Math.sin(a * 2 + 0.6) * 0.09 +
      Math.sin(a * 3 + 2.1) * 0.08 +
      Math.sin(a * 5 + 0.9) * 0.06 +
      Math.sin(a * 7 + 1.7) * 0.035 +
      (f() - 0.5) * 0.08;
    pts.push([ISLAND.cx + Math.cos(a) * ISLAND.rx * w, ISLAND.cy + Math.sin(a) * ISLAND.ry * w]);
  }
  const island = new Path2D();
  pts.forEach(([x, y], n) => {
    const [nx, ny] = pts[(n + 1) % pts.length];
    const mx = (x + nx) / 2;
    const my = (y + ny) / 2;
    if (n === 0) island.moveTo(mx, my);
    else island.quadraticCurveTo(x, y, mx, my);
  });
  island.quadraticCurveTo(pts[0][0], pts[0][1], (pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
  island.closePath();

  land = new Uint8Array(ART.w * ART.h);
  for (let y = 0; y < ART.h; y++)
    for (let x = 0; x < ART.w; x++) if (c.isPointInPath(island, x + 0.5, y + 0.5)) land[y * ART.w + x] = 1;

  // The dirt cliff under the grass, so the island floats on the page: the
  // same outline dropped down, in two soil tones, with a few stones
  c.save();
  c.translate(0, CLIFF);
  c.fillStyle = COL.soilDk;
  c.fill(island);
  c.restore();
  c.save();
  c.translate(0, CLIFF / 2);
  c.fillStyle = COL.soilD;
  c.fill(island);
  c.restore();
  c.save();
  c.translate(0, CLIFF);
  c.clip(island);
  for (let n = 0; n < 60; n++) {
    c.fillStyle = f() < 0.5 ? COL.soil : COL.soilDk;
    c.fillRect(ri(0, ART.w), ri(0, ART.h), f() < 0.5 ? 2 : 1, 1);
  }
  c.restore();

  // Grass, mottled, with tufts and dot flowers, and a darker rim
  c.save();
  c.fillStyle = COL.grass;
  c.fill(island);
  c.clip(island);
  for (let n = 0; n < 900; n++) {
    c.fillStyle = f() < 0.5 ? COL.grassL : COL.grassD;
    c.fillRect(ri(0, ART.w), ri(0, ART.h), 1, 1);
  }
  for (let n = 0; n < 40; n++) {
    const x = ri(8, ART.w - 8);
    const y = ri(8, ART.h - 8);
    c.fillStyle = COL.grassDark;
    c.fillRect(x, y, 1, 2);
    c.fillRect(x - 1, y + 1, 1, 1);
    c.fillRect(x + 1, y + 1, 1, 1);
  }
  for (let n = 0; n < 26; n++) {
    c.fillStyle = f() < 0.5 ? "#fbf6e2" : "#f3e07a";
    c.fillRect(ri(10, ART.w - 10), ri(10, ART.h - 10), 1, 1);
  }
  c.strokeStyle = COL.grassDark;
  c.lineWidth = 2;
  c.stroke(island);
  c.restore();

  // Pond
  ellipse(POND.cx, POND.cy, POND.rx + 1.5, POND.ry + 1.5);
  c.fillStyle = COL.grassDark;
  c.fill();
  ellipse(POND.cx, POND.cy, POND.rx, POND.ry);
  c.fillStyle = COL.waterD;
  c.fill();
  ellipse(POND.cx, POND.cy - 0.5, POND.rx - 1, POND.ry - 1);
  c.fillStyle = COL.water;
  c.fill();
  c.fillStyle = COL.waterL;
  for (let n = 0; n < 10; n++) c.fillRect(ri(POND.cx - 10, POND.cx + 8), ri(POND.cy - 3, POND.cy + 3), 2, 1);

  // Sprites, drawn back to front by their base line
  const items: { name: string; x: number; y: number; flip?: boolean }[] = [
    { name: "tree", x: 30, y: 34 }, { name: "pine", x: 46, y: 28 }, { name: "apple", x: 66, y: 30, flip: true },
    { name: "tree", x: 94, y: 24 }, { name: "pine", x: 114, y: 22 }, { name: "tree", x: 198, y: 56, flip: true },
    { name: "apple", x: 140, y: 26 }, { name: "pine", x: 160, y: 22, flip: true }, { name: "tree", x: 180, y: 30 },
    { name: "bush", x: 80, y: 36 }, { name: "bush", x: 190, y: 68 }, { name: "bush", x: 18, y: 50, flip: true },
    { name: "bush", x: 196, y: 40 }, { name: "mushroom", x: 30, y: 72 }, { name: "rock", x: 150, y: 76 },
    { name: "flowers", x: 150, y: 40 }, { name: "flowers", x: 176, y: 72, flip: true },
    { name: "flowers", x: 64, y: 48 }, { name: "flowers", x: 124, y: 46, flip: true }, { name: "flowers", x: 60, y: 76 },
    { name: "flowers", x: 162, y: 58 }, { name: "tallgrass", x: 20, y: 60 }, { name: "tallgrass", x: 140, y: 68, flip: true },
    { name: "tallgrass", x: 86, y: 78 }, { name: "reeds", x: 28, y: 60 }, { name: "lily", x: 46, y: 59 },
  ];
  items.sort((a, b) => a.y - b.y);
  for (const it of items) {
    // Anything the irregular coastline left off the grass is skipped
    if (it.name !== "lily" && !onLand(it.x, it.y - 1)) continue;
    const s = FF.raster(it.name, 1);
    const x = Math.round(it.x - s.width / 2);
    const y = Math.round(it.y - s.height);
    c.save();
    c.globalAlpha = 0.12;
    c.fillStyle = "#46502f";
    ellipse(it.x, it.y - 1, s.width * 0.36, 1.8);
    c.fill();
    c.restore();
    if (it.flip) {
      c.save();
      c.translate(x + s.width, y);
      c.scale(-1, 1);
      c.drawImage(s, 0, 0);
      c.restore();
    } else c.drawImage(s, x, y);
  }
}
