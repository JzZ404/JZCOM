"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ART, drawScene, walkable } from "./farmPlaygroundScene";
import { usePdfMode } from "./PdfMode";

export type FarmAnimal = "dog" | "sheep" | "chicken" | "deer" | "bee";

// The animal sheet (public/images/focusfarm/world/animals.webp), cut from
// FocusFarm's own atlas: one row per animal, eight frames each, every frame
// on the same cell (812x708 sheet / 8x5) so the animals stay planted as
// they animate.
const SHEET = { src: "/images/focusfarm/world/animals.webp", cellW: 101.5, cellH: 141.6 };
const ROWS: FarmAnimal[] = ["dog", "sheep", "chicken", "deer", "bee"];
const FRAMES = ["frontIdle", "frontStep", "leftIdle", "leftWalk", "rightIdle", "rightWalk", "backIdle", "backWalk"];
// Where each frame's feet are (px from the cell's top, measured from the
// sheet, in FRAMES order), so every pose stands right on its spot; and each
// animal's size on the island (art px per sheet px)
const FEET: Record<FarmAnimal, number[]> = {
  dog: [95, 95, 95, 95, 95, 95, 93, 99],
  sheep: [135, 140, 135, 135, 135, 135, 135, 137],
  chicken: [131, 132, 132, 133, 132, 133, 131, 132],
  deer: [132, 132, 132, 133, 133, 133, 133, 133],
  bee: [78, 82, 80, 80, 80, 80, 80, 83],
};
const SIZE: Record<FarmAnimal, number> = { dog: 0.17, sheep: 0.145, chicken: 0.12, deer: 0.15, bee: 0.11 };
// Where each animal's head is in its front frame (the pose it holds while
// carried), in sheet px: a picked-up animal's reaction appears there
const HEAD: Record<FarmAnimal, { x: number; y: number }> = {
  dog: { x: 86, y: 4 },
  sheep: { x: 94, y: 42 },
  chicken: { x: 84, y: 40 },
  deer: { x: 92, y: 20 },
  bee: { x: 88, y: 6 },
};
const FLIES: Record<FarmAnimal, boolean> = { dog: false, sheep: false, chicken: false, deer: false, bee: true };

// FocusFarm's wandering, scaled to this smaller island: walk to a random
// spot, pause, pick another; step frames swap every quarter second
const SPEED = [5, 8];
const PAUSE = [0.6, 2.6];
const STEP_TIME = 0.25;

// In the PDF portfolio the animals stand still, spread across the island so
// none overlap, each facing a way that shows off its sprite
const PRINT_POSE: Record<FarmAnimal, { x: number; y: number; facing: Facing }> = {
  dog: { x: 66, y: 46, facing: "right" },
  sheep: { x: 96, y: 68, facing: "front" },
  chicken: { x: 124, y: 52, facing: "left" },
  deer: { x: 154, y: 66, facing: "front" },
  bee: { x: 182, y: 54, facing: "left" },
};

type Facing = "front" | "left" | "right" | "back";
type Animal = {
  kind: FarmAnimal;
  x: number;
  y: number;
  tx: number;
  ty: number;
  speed: number;
  wait: number;
  facing: Facing;
  walking: boolean;
  stepT: number;
  step: boolean;
  held: boolean;
  // How it feels about being picked up, shown by its head while carried
  reaction?: "sweat" | "heart";
  // A hop in progress (after a tap, a drop, or being carried back to land)
  hop?: { t: number; dur: number; fromX: number; fromY: number; toX: number; toY: number; height: number };
};

function randomSpot(r = Math.random) {
  for (let n = 0; n < 200; n++) {
    const x = 20 + r() * (ART.w - 40);
    const y = 38 + r() * (ART.h - 44);
    if (walkable(x, y)) return { x, y };
  }
  return { x: ART.w / 2, y: ART.h * 0.65 };
}

// The closest standable point to (x, y), searching outward in rings
function nearestLand(x: number, y: number) {
  if (walkable(x, y)) return { x, y };
  for (let r = 2; r < 140; r += 2) {
    for (let a = 0; a < 24; a++) {
      const px = x + Math.cos((a / 24) * Math.PI * 2) * r;
      const py = y + Math.sin((a / 24) * Math.PI * 2) * r * 0.6;
      if (walkable(px, py)) return { x: px, y: py };
    }
  }
  return randomSpot();
}

function loadSprites(): Promise<void> {
  const w = window as unknown as { FF?: unknown; __ffSprites?: Promise<void> };
  if (w.FF) return Promise.resolve();
  w.__ffSprites ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "/focusfarm/sprites.js";
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return w.__ffSprites;
}

// The playground: a miniature FocusFarm island where the animals wander on
// their own. Pick one up and drop it anywhere (dropped in the water, it
// hops back to shore); tap or press Enter on one to make it hop.
export default function FarmPlayground({ animals }: { animals: FarmAnimal[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const effects = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const state = useRef<Animal[]>([]);
  const drag = useRef<{ index: number; dx: number; dy: number; moved: boolean; startX: number; startY: number } | null>(null);
  const pdf = usePdfMode();

  // Starting spots: spread across the island
  if (!state.current.length) {
    const seeded = [0.21, 0.67, 0.43, 0.89, 0.35, 0.12, 0.78];
    let k = 0;
    const r = () => seeded[k++ % seeded.length];
    state.current = animals.map((kind, n) => {
      const spot = nearestLand(40 + n * 34, 52 + (n % 2) * 18);
      const t = randomSpot(r);
      return {
        kind, ...spot, tx: t.x, ty: t.y, speed: SPEED[0] + (n % 3), wait: 0.4 + n * 0.5,
        facing: "front", walking: false, stepT: 0, step: false, held: false,
      };
    });
  }

  useEffect(() => {
    let cancelled = false;
    loadSprites().then(() => {
      const FF = (window as unknown as { FF: Parameters<typeof drawScene>[1] }).FF;
      if (!cancelled && canvasRef.current) {
        drawScene(canvasRef.current, FF);
        // Now that the real coastline is known, settle everyone onto it
        state.current.forEach((a) => {
          if (pdf) {
            const pose = PRINT_POSE[a.kind];
            Object.assign(a, FLIES[a.kind] ? { x: pose.x, y: pose.y } : nearestLand(pose.x, pose.y), {
              facing: pose.facing,
            });
            return;
          }
          Object.assign(a, nearestLand(a.x, a.y));
          const t = randomSpot();
          a.tx = t.x;
          a.ty = t.y;
        });
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // One loop moves every animal and writes its position, frame, and pose
  // straight to the DOM (no re-render per frame)
  useEffect(() => {
    const still = pdf || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let clock = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      state.current.forEach((a, n) => {
        if (a.hop) {
          a.hop.t += dt;
          const p = Math.min(1, a.hop.t / a.hop.dur);
          a.x = a.hop.fromX + (a.hop.toX - a.hop.fromX) * p;
          a.y = a.hop.fromY + (a.hop.toY - a.hop.fromY) * p;
          if (p >= 1) {
            a.hop = undefined;
            puff(a.x, a.y);
            a.wait = 0.8;
          }
        } else if (!a.held && !still) {
          if (a.wait > 0) {
            a.wait -= dt;
            a.walking = false;
          } else {
            const dx = a.tx - a.x;
            const dy = a.ty - a.y;
            const d = Math.hypot(dx, dy);
            if (d < 0.6) {
              const t = randomSpot();
              Object.assign(a, { tx: t.x, ty: t.y, wait: PAUSE[0] + Math.random() * (PAUSE[1] - PAUSE[0]) });
              a.speed = SPEED[0] + Math.random() * (SPEED[1] - SPEED[0]);
              a.walking = false;
            } else {
              const nx = a.x + (dx / d) * a.speed * dt;
              const ny = a.y + (dy / d) * a.speed * dt;
              if (FLIES[a.kind] || walkable(nx, ny)) {
                a.x = nx;
                a.y = ny;
                a.walking = true;
                a.facing = Math.abs(dx) > Math.abs(dy) * 1.2 ? (dx > 0 ? "right" : "left") : dy > 0 ? "front" : "back";
              } else {
                const t = randomSpot();
                a.tx = t.x;
                a.ty = t.y;
              }
            }
          }
        }
        if (a.walking || a.held || FLIES[a.kind]) {
          a.stepT += dt * (a.held ? 2.5 : 1);
          if (a.stepT >= STEP_TIME) {
            a.stepT = 0;
            a.step = !a.step;
          }
        } else a.step = false;
        render(a, n, clock, still);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // render/puff only read refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function render(a: Animal, n: number, clock: number, still: boolean) {
    const el = els.current[n];
    if (!el) return;
    const scale = SIZE[a.kind];
    const w = SHEET.cellW * scale;
    const h = SHEET.cellH * scale;
    const facing = a.held ? "front" : a.facing;
    const frame = FRAMES.indexOf(`${facing}${a.step ? (facing === "front" ? "Step" : "Walk") : "Idle"}`);
    // Lift: held animals float up; hops arc; bees hover; idle animals breathe
    let lift = 0;
    if (a.held) lift = 6;
    else if (a.hop) lift = Math.sin((a.hop.t / a.hop.dur) * Math.PI) * a.hop.height;
    else if (FLIES[a.kind]) lift = 7 + (still ? 0 : Math.sin(clock * 3 + n) * 1.5);
    else if (!a.walking && !still) lift = Math.max(0, Math.sin(clock * 2.4 + n * 1.7)) * 0.5;
    const left = ((a.x - w / 2) / ART.w) * 100;
    const feet = FEET[a.kind][frame] / SHEET.cellH;
    const top = ((a.y - feet * h) / ART.h) * 100;
    el.style.left = `${left}%`;
    el.style.top = `${top}%`;
    el.style.width = `${(w / ART.w) * 100}%`;
    el.style.zIndex = String(Math.round(a.y * 10) + (a.held ? 5000 : 0));
    const sprite = el.firstElementChild as HTMLElement;
    sprite.style.backgroundPosition = `${(frame / (FRAMES.length - 1)) * 100}% ${(ROWS.indexOf(a.kind) / (ROWS.length - 1)) * 100}%`;
    const wiggle = a.held ? Math.sin(clock * 18) * 6 : 0;
    sprite.style.transform = `translateY(${-(lift / h) * 100}%) rotate(${wiggle}deg) scale(${a.held ? 1.12 : 1})`;
    // The pick-up reaction: a sweat drop that drips and fades, again and
    // again, or a heart that floats up and pulses
    const reaction = sprite.firstElementChild as HTMLElement;
    reaction.style.display = a.held && a.reaction ? "block" : "none";
    if (a.held && a.reaction) {
      const sweat = a.reaction === "sweat";
      (reaction.children[0] as HTMLElement).style.display = sweat ? "block" : "none";
      (reaction.children[1] as HTMLElement).style.display = sweat ? "none" : "block";
      const phase = still ? 0.3 : (clock * (sweat ? 1.6 : 1.2)) % 1;
      reaction.style.transform = sweat
        ? `translateY(${phase * 35}%) rotate(${-wiggle}deg)`
        : `translateY(${-phase * 25}%) rotate(${-wiggle}deg) scale(${0.95 + Math.sin(clock * 9) * 0.1})`;
      reaction.style.opacity = String(1 - Math.max(0, phase - 0.6) * 1.5);
    }
    // The shadow stays on the ground under the feet, shrinking and fading
    // as the animal rises (so the hovering bee's floats below it)
    const shadow = el.lastElementChild as HTMLElement;
    shadow.style.top = `${feet * 100}%`;
    shadow.style.transform = `translate(-50%, -55%) scale(${1 - Math.min(0.45, lift / 30)})`;
    shadow.style.opacity = String(0.32 - Math.min(0.14, lift / 60));
  }

  // A small dust puff on landing
  function puff(x: number, y: number) {
    const layer = effects.current;
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let k = 0; k < 6; k++) {
      const p = document.createElement("span");
      const a = (k / 6) * Math.PI * 2;
      Object.assign(p.style, {
        position: "absolute", left: `${(x / ART.w) * 100}%`, top: `${(y / ART.h) * 100}%`,
        width: "6px", height: "6px", borderRadius: "1px", background: "#f6f8e4", opacity: "0.9",
        transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
      });
      layer.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${Math.cos(a) * 14}px, ${Math.sin(a) * 6 - 4}px) scale(0.4)`;
        p.style.opacity = "0";
      });
      setTimeout(() => p.remove(), 550);
    }
  }

  // A heart that floats up from an animal that was tapped
  function heart(a: Animal) {
    const layer = effects.current;
    if (!layer) return;
    const p = document.createElement("span");
    p.textContent = "♥";
    Object.assign(p.style, {
      position: "absolute", left: `${(a.x / ART.w) * 100}%`, top: `${((a.y - SHEET.cellH * SIZE[a.kind] * 0.9) / ART.h) * 100}%`,
      transform: "translate(-50%, 0)", color: "#e88575", fontSize: "18px", fontWeight: "700",
      transition: "transform 0.9s ease-out, opacity 0.9s ease-in", pointerEvents: "none",
    });
    layer.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = "translate(-50%, -28px)";
      p.style.opacity = "0";
    });
    setTimeout(() => p.remove(), 950);
  }

  function hop(a: Animal, toX: number, toY: number, height = 8, dur = 0.42) {
    a.hop = { t: 0, dur, fromX: a.x, fromY: a.y, toX, toY, height };
    a.walking = false;
  }

  const toArt = (e: { clientX: number; clientY: number }) => {
    const r = boxRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * ART.w, y: ((e.clientY - r.top) / r.height) * ART.h };
  };

  function onPointerDown(n: number, e: ReactPointerEvent<HTMLButtonElement>) {
    const a = state.current[n];
    if (a.hop) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Not a live pointer (e.g. a synthetic event); dragging still works
    }
    const p = toArt(e);
    drag.current = { index: n, dx: a.x - p.x, dy: a.y - p.y, moved: false, startX: e.clientX, startY: e.clientY };
  }

  function onPointerMove(n: number, e: ReactPointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    if (!d || d.index !== n) return;
    if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 4) return;
    d.moved = true;
    const a = state.current[n];
    if (!a.held) a.reaction = Math.random() < 0.5 ? "sweat" : "heart";
    a.held = true;
    const p = toArt(e);
    a.x = Math.max(4, Math.min(ART.w - 4, p.x + d.dx));
    a.y = Math.max(8, Math.min(ART.h - 1, p.y + d.dy));
  }

  function onPointerUp(n: number) {
    const d = drag.current;
    if (!d || d.index !== n) return;
    drag.current = null;
    const a = state.current[n];
    a.held = false;
    if (!d.moved) {
      // A tap: a happy hop on the spot
      hop(a, a.x, a.y, 9, 0.38);
      heart(a);
      return;
    }
    // Dropped: lands where it is, or hops back to the nearest shore
    const land = FLIES[a.kind] ? { x: a.x, y: Math.max(a.y, 30) } : nearestLand(a.x, a.y);
    const far = Math.hypot(land.x - a.x, land.y - a.y);
    hop(a, land.x, land.y, far > 2 ? 10 : 3, far > 2 ? 0.55 : 0.22);
    const t = randomSpot();
    Object.assign(a, { tx: t.x, ty: t.y });
  }

  return (
    // On narrow screens the island keeps a size you can play with (at
    // least 560px wide) and scrolls sideways, starting centered
    <div
      ref={(el) => {
        if (el && el.scrollLeft === 0) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      }}
      className="no-scrollbar w-full overflow-x-auto"
    >
    <div
      ref={boxRef}
      className="relative w-full min-w-[560px] select-none"
      style={{ aspectRatio: `${ART.w} / ${ART.h}` }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        style={{ imageRendering: "pixelated" }}
      />
      {state.current.map((a, n) => (
        <button
          key={a.kind}
          ref={(el) => {
            els.current[n] = el;
          }}
          type="button"
          aria-label={`${a.kind}: drag to move, or press Enter to make it hop`}
          onPointerDown={(e) => onPointerDown(n, e)}
          onPointerMove={(e) => onPointerMove(n, e)}
          onPointerUp={() => onPointerUp(n)}
          onPointerCancel={() => onPointerUp(n)}
          onKeyDown={(e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            hop(state.current[n], state.current[n].x, state.current[n].y, 9, 0.38);
            heart(state.current[n]);
          }}
          className="absolute cursor-grab touch-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-white active:cursor-grabbing"
          style={{ aspectRatio: `${SHEET.cellW} / ${SHEET.cellH}` }}
        >
          <span
            className="relative block h-full w-full"
            style={{
              backgroundImage: `url(${SHEET.src})`,
              backgroundSize: `${FRAMES.length * 100}% ${ROWS.length * 100}%`,
              transformOrigin: "50% 90%",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute hidden w-[30%]"
              style={{
                left: `${(HEAD[a.kind].x / SHEET.cellW) * 100 - 16}%`,
                top: `${(HEAD[a.kind].y / SHEET.cellH) * 100 - 8}%`,
              }}
            >
              <PixelIcon art={SWEAT} />
              <PixelIcon art={HEART} />
            </span>
          </span>
          <span aria-hidden className="pointer-events-none absolute left-1/2 -z-10 w-[58%]">
            <PixelIcon art={SHADOW} />
          </span>
        </button>
      ))}
      <div ref={effects} aria-hidden className="pointer-events-none absolute inset-0 z-[9999]" />
    </div>
    </div>
  );
}

// Pick-up reactions as pixel art, in the sprites' outlined style: one
// character per pixel (o outline, then fill, shade, and highlight)
const SWEAT = {
  rows: ["  oo  ", " obbo ", "obwbbo", "obbbbo", "obbsbo", " osso ", "  oo  "],
  colors: { o: "#3f5a78", b: "#9fd3f2", w: "#ffffff", s: "#6faed8" },
};
// A flat, stepped oval: the ground shadow, in pixels like everything else
const SHADOW = {
  rows: ["   ooooooo   ", " ooooooooooo ", "ooooooooooooo", " ooooooooooo ", "   ooooooo   "],
  colors: { o: "#46502f" },
};
const HEART = {
  rows: [" oo oo ", "ohhohho", "ohwhhho", "ohhhhho", " ohhho ", "  oho  ", "   o   "],
  colors: { o: "#7a3445", h: "#f2879f", w: "#ffffff" },
};

function PixelIcon({ art }: { art: { rows: string[]; colors: Record<string, string> } }) {
  const w = Math.max(...art.rows.map((r) => r.length));
  return (
    <svg viewBox={`0 0 ${w} ${art.rows.length}`} className="block h-auto w-full" shapeRendering="crispEdges">
      {art.rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          art.colors[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={art.colors[ch]} /> : null,
        ),
      )}
    </svg>
  );
}
