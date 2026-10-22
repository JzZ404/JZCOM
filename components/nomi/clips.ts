// Nomi's frames, sizes and animation clips — the "what can she do" data.
// nomiBrain.ts decides what plays when; Nomi.tsx / NomiSprite.tsx render it.

const img = (name: string) => `/images/cat-widget/${name}.png`;
export const WALK_FRAMES = Array.from({ length: 7 }, (_, i) => img(`walk-${String(i + 1).padStart(2, "0")}`));

// --- Size --------------------------------------------------------------------
// All sheets sized off one number: render px per source px of the walk sheet.
// Relative scales were measured from eye size, like with like at each hand-off:
//   walk sheet      — source canvas 558x365 — 1x
//   sit-down frames — the sit-down sheet's 706x367 canvas at 1x (profile eye
//                     17px like the walk).
//   sit-idle frames — shared 263x214 canvas (2x), pre-scaled to the head/body
//                     size of the tail-right pose they take over from (matching
//                     the taller sit-down-06/07 made her zoom in ~5% there).
//   lie-down frames — mixed from two sheets, so they're pre-scaled onto one
//                     shared 310x200 canvas (exported at 2x for WALK_H = 112),
//                     faces matched at every hand-off: 0.7735x for the turn,
//                     crouch and loaf; 0.5639x for the crawl and tuck, which
//                     were drawn much bigger.
//   lie-idle frames — shared 262x145 canvas (2x), 0.786x, face matched to the
//                     loaf they follow. Pinned by the nose, not the eyes, since
//                     some frames have them closed.
export const WALK_H = 112;
const SCALE = WALK_H / 365;
export const WALK_W = Math.round(558 * SCALE);
const SIT_H = Math.round(367 * SCALE);
const SIT_W = Math.round(706 * SCALE);
const SIT_IDLE_H = Math.round((107 * WALK_H) / 112);
const SIT_IDLE_W = Math.round((131.5 * WALK_H) / 112);
const LIE_H = Math.round((100 * WALK_H) / 112);
const LIE_W = Math.round((155 * WALK_H) / 112);
const LIE_IDLE_H = Math.round((72.5 * WALK_H) / 112);
const LIE_IDLE_W = Math.round((131 * WALK_H) / 112);

// --- Alignment ---------------------------------------------------------------
// Every frame is pinned by its face (eye midpoint / head center / nose, all
// within ~1px of each other) and its paws, so the head stays put from the end
// of the walk through sitting and lying — the body moves under/behind it.
// Fractions are where the face / paws land on each layer's canvas.
export const GROUND_FROM_BOTTOM = 14; // where the paws touch, px above the viewport bottom
export const EYES_FROM_RIGHT = 114; // where Nomi's face ends up, px from the right edge
export const WALK_END_RIGHT = EYES_FROM_RIGHT - (1 - 0.873) * WALK_W;
export const bottomFor = (height: number, groundFraction: number) => GROUND_FROM_BOTTOM - (1 - groundFraction) * height;

export type Layer = "sit" | "sitIdle" | "lie" | "lieIdle";
export const LAYERS: Record<Layer, { right: number; bottom: number; width: number; height: number }> = {
  sit: { right: EYES_FROM_RIGHT - (1 - 0.637) * SIT_W, bottom: bottomFor(SIT_H, 0.94), width: SIT_W, height: SIT_H },
  sitIdle: {
    right: EYES_FROM_RIGHT - (1 - 0.368) * SIT_IDLE_W, // pinned by head center
    bottom: bottomFor(SIT_IDLE_H, 0.918),
    width: SIT_IDLE_W,
    height: SIT_IDLE_H,
  },
  lie: { right: EYES_FROM_RIGHT - (1 - 0.224) * LIE_W, bottom: bottomFor(LIE_H, 0.945), width: LIE_W, height: LIE_H },
  lieIdle: {
    right: EYES_FROM_RIGHT - (1 - 0.265) * LIE_IDLE_W, // idle-01's eye midpoint
    bottom: bottomFor(LIE_IDLE_H, 0.925),
    width: LIE_IDLE_W,
    height: LIE_IDLE_H,
  },
};
export const TRACK_H = Math.max(WALK_H, ...Object.values(LAYERS).map((l) => l.height)) + GROUND_FROM_BOTTOM;
// Roughly where the top of her head is, per pose — the bubble floats above it.
export const HEAD_TOP: Record<Layer, number> = { sit: 100, sitIdle: 100, lie: 70, lieIdle: 62 };

// --- Walk timing -------------------------------------------------------------
// How far Nomi walks before sitting, in px. A fixed distance (not a fraction
// of screen width) so the walk is the same length on a laptop and a big monitor.
export const WALK_DISTANCE = 100;
export const WALK_FRAME_MS = 170;
// A planted paw slides back ~9px per frame on the 240px-tall export — the
// cycle's own ground speed, so the paws don't skate if size or timing change.
export const PIXELS_PER_SECOND = ((9 / 240) * WALK_H) / (WALK_FRAME_MS / 1000);

// --- Clips -------------------------------------------------------------------
// Every in-place animation is a clip: frames on one layer, each held `ms`.
// Frames always cut, never cross-fade — two frames mid-fade are both
// see-through, which read as a flash (~45% opacity at the dip).
// A "walk" step moves her instead of holding a pose: `walk` is where her face
// goes, in px from her resting spot (negative = left). Walking left is the
// right-facing walk cycle mirrored.
export type WalkMove = { from: number; to: number };
export type Step = { layer: Layer | "walk"; src: string; ms: number; breathe?: boolean; walk?: WalkMove };
export const WALK_EYE_FRACTION = 0.873; // eye position across the walk frames' canvas, facing right
const clip = (layer: Layer, frames: [name: string, ms: number][]): Step[] =>
  frames.map(([name, ms]) => ({ layer, src: img(name), ms }));

// Walk -> sit. (There's also a tail-wrapped-in-front ending: sit-down-end-tail-front.)
export const SIT_DOWN = clip("sit", [
  ["sit-down-01", 180],
  ["sit-down-02", 180],
  ["sit-down-03", 200],
  ["sit-down-04", 380], // turns to look at you — a beat longer
  ["sit-down-05", 220],
  ["sit-down-06", 260],
  ["sit-down-07", 300], // tail tucked behind, mid-swish to the right
  ["sit-down-end-tail-right", 600],
]);

// Sitting: a neutral rest pose between fidgets, plus the sub-movements. Each
// sub-movement's first frame on the sheet is that same neutral pose, so the
// clips start from its second frame. Blink / ears / yawn go out to their peak
// and come back the same way, easing back into rest.
export const sitRest = (ms: number) => clip("sitIdle", [["sit-tail-01", ms]]);
export const SIT_FIDGETS = {
  tailSwing: clip("sitIdle", [
    ["sit-tail-02", 240], // tail lifts
    ["sit-tail-03", 240],
    ["sit-tail-04", 280], // settles
  ]),
  // A slow, readable cat blink — at ~0.2s closed it was easy to miss at this size.
  blink: clip("sitIdle", [
    ["sit-blink-02", 120], // half closed
    ["sit-blink-03", 300], // closed
    ["sit-blink-02", 120],
  ]),
  ears: clip("sitIdle", [
    ["sit-ears-02", 300],
    ["sit-ears-03", 450], // ears turned out
    ["sit-ears-02", 250],
  ]),
  yawn: clip("sitIdle", [
    ["sit-yawn-02", 300], // mouth opening
    ["sit-yawn-03", 1000], // full yawn
    ["sit-yawn-02", 300],
  ]),
};

// Sit -> lie, and the same frames backwards for lie -> sit (getting up).
export const LIE_DOWN = clip("lie", [
  ["lie-down-01", 260], // starting to turn
  ["lie-down-02", 300], // crouching & turning
  ["lie-down-03", 320], // full crawl crouch
  ["lie-down-04", 280], // tucking paws
  ["lie-down-05", 1200], // loafing, before the lying loop starts
]);
export const GET_UP = [...LIE_DOWN].reverse().map((s, i) => ({ ...s, ms: i === 0 ? 300 : s.ms }));

// Lying: plays 1 -> 9 in order and repeats (drowsy, doze, wake, tail flick).
// Frame 9 matches frame 1, so the wrap-around is seamless.
export const LIE_IDLE = clip("lieIdle", [
  ["idle-01", 2600], // looking at you
  ["idle-02", 220], // eyes lowering
  ["idle-03", 600], // sleepy squint
  ["idle-04", 1800], // eyes closed, dozing
  ["idle-05", 300], // eyes opening
  ["idle-06", 1600], // awake again
  ["idle-07", 260], // tail flicks up
  ["idle-08", 260], // tail coming down
  ["idle-09", 2200], // settled
]);

// Lying -> sleeping and back: the lying loop's eyes-closing frames, forwards
// to fall asleep, backwards to wake up. Sleep itself holds the eyes-closed
// frame with a slow breathing scale so she doesn't look frozen.
export const FALL_ASLEEP = clip("lieIdle", [
  ["idle-01", 600],
  ["idle-02", 300],
  ["idle-03", 900],
]);
export const sleepHold = (ms: number): Step[] => [{ ...clip("lieIdle", [["idle-04", ms]])[0], breathe: true }];
export const WAKE_UP = clip("lieIdle", [
  ["idle-04", 250],
  ["idle-03", 450],
  ["idle-02", 220],
  ["idle-01", 400],
]);

// A stretch when she gets restless: stand up (the sit-down backwards), walk a
// little way left, turn, walk back to her spot, sit down again.
const STAND_UP = [...SIT_DOWN].reverse().map((s, i) => ({ ...s, ms: i === 0 ? 300 : s.ms }));
const walkStep = (from: number, to: number): Step => ({
  layer: "walk",
  src: "",
  ms: Math.round((Math.abs(to - from) / PIXELS_PER_SECOND) * 1000),
  walk: { from, to },
});
export const stroll = (distance: number): Step[] => [
  ...STAND_UP,
  walkStep(0, -distance),
  walkStep(-distance, 0),
  ...SIT_DOWN,
];

// Every frame a layer can show, so each layer's stack can mount them all up front.
const ALL_STEPS = [
  ...SIT_DOWN,
  ...sitRest(0),
  ...Object.values(SIT_FIDGETS).flat(),
  ...LIE_DOWN,
  ...LIE_IDLE,
];
export const framesOn = (layer: Layer) => [...new Set(ALL_STEPS.filter((s) => s.layer === layer).map((s) => s.src))];
