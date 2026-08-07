"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProjectCategory } from "@/data/projects";

// Each Work category gets a visually distinct decorative backdrop — a
// hand-drawn UX sketch for UX, a code texture for AI, a Jarvis-style HUD
// ring for Robotics — so scrolling between sections reads as moving
// between distinct "spaces". UX originally had a plain radial-gradient
// blur wash here instead of UxSketch below (removed per Joyce — "remove
// the colored mask").

// ==================== UX category backdrop ====================
// RAPID PROTOTYPING PASS — duplicating a pasted reference sketch (browser
// wireframes, sticky notes, a checkmark bubble, a speech bubble, curved
// connector arrows) for the UX category only. Skipping the
// verification/cleanup ritual between rounds by design, same as the
// robotics ring's rapid pass earlier in this file — do not read this
// section's finish level as representative of the rest of the file.
// Literal colors lifted from the reference image (not site tokens) — this
// is a direct recreation of a specific pasted asset, same "explicit
// pasted-reference" exception already used for the robotics console/gauge
// elsewhere in this file, not a signal to start scattering new arbitrary
// colors generally. Everything below is one fixed hand-placed SVG (no
// randomness) since it's duplicating a specific static illustration, not
// procedurally generating a pattern.
const UX_LINE = "#2f5f8a";
const UX_FRAME_BLUE = "#8fc3ea";
const UX_NOTE_PINK = "#f3a68f";
const UX_NOTE_BLUE = "#bfe3f6";
const UX_RED = "#ef4b3d";
const UX_BUBBLE_BLUE = "#8fcdee";

// One browser-window wireframe: title-bar dots, an image placeholder
// (box with an X), and a few text-line bars.
// imgHeight/showBottomBars are overridable — the main frame in UxSketch
// also has an avatar card row + its own divider line placed below this
// card's image block, and the default height*0.42 image box plus the
// default bottom bars both landed ON TOP of that extra content (image
// box bottom edge past where the card row starts; bottom bars running
// straight through the card row). Fixed by shrinking the image box for
// that instance and turning its own bottom bars off, rather than by
// guessing at more coordinates — the small card keeps the defaults since
// it doesn't have anything else placed below it.
function UxWireframeCard({
  x,
  y,
  width,
  height,
  imgHeight,
  showBottomBars = true,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  imgHeight?: number;
  showBottomBars?: boolean;
}) {
  const imgW = width * 0.4;
  const imgH = imgHeight ?? height * 0.42;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0.75} y={0.75} width={width - 1.5} height={height - 1.5} rx={6} fill="white" stroke={UX_FRAME_BLUE} strokeWidth={1.5} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={11 + i * 9} cy={11} r={2.3} fill="none" stroke={UX_FRAME_BLUE} strokeWidth={1.2} />
      ))}
      <line x1={0} y1={20} x2={width} y2={20} stroke={UX_FRAME_BLUE} strokeWidth={1} />
      <rect x={10} y={30} width={imgW} height={imgH} fill="none" stroke={UX_LINE} strokeWidth={1.2} />
      <line x1={10} y1={30} x2={10 + imgW} y2={30 + imgH} stroke={UX_LINE} strokeWidth={1} />
      <line x1={10 + imgW} y1={30} x2={10} y2={30 + imgH} stroke={UX_LINE} strokeWidth={1} />
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={10 + imgW + 10}
          y1={38 + i * 9}
          x2={width - 12}
          y2={38 + i * 9}
          stroke={UX_LINE}
          strokeWidth={1.3}
          strokeLinecap="round"
        />
      ))}
      {showBottomBars && (
        <>
          <line x1={10} y1={30 + imgH + 14} x2={width - 10} y2={30 + imgH + 14} stroke={UX_LINE} strokeWidth={1.3} strokeLinecap="round" />
          <line x1={10} y1={30 + imgH + 24} x2={width - 40} y2={30 + imgH + 24} stroke={UX_LINE} strokeWidth={1.3} strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

// A small row of avatar-card placeholders (circle + two line bars each) —
// the "3 profile cards" row in the reference's main frame.
function UxCardRow({ x, y, width }: { x: number; y: number; width: number }) {
  const cardW = width / 3 - 6;
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${i * (cardW + 9)} 0)`}>
          <rect x={0.5} y={0.5} width={cardW} height={44} rx={4} fill="none" stroke={UX_FRAME_BLUE} strokeWidth={1.2} />
          <circle cx={cardW / 2} cy={16} r={8} fill="none" stroke={UX_LINE} strokeWidth={1.2} />
          <line x1={cardW * 0.2} y1={32} x2={cardW * 0.8} y2={32} stroke={UX_LINE} strokeWidth={1.1} strokeLinecap="round" />
          <line x1={cardW * 0.3} y1={38} x2={cardW * 0.7} y2={38} stroke={UX_LINE} strokeWidth={1.1} strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

// A rotated sticky note with a couple of wavy scribble lines standing in
// for handwritten text.
function UxStickyNote({ x, y, size, rotate, color }: { x: number; y: number; size: number; rotate: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={0} y={0} width={size} height={size} rx={3} fill={color} />
      <path d={`M ${size * 0.18} ${size * 0.4} Q ${size * 0.35} ${size * 0.28} ${size * 0.5} ${size * 0.4} T ${size * 0.82} ${size * 0.4}`} fill="none" stroke={UX_LINE} strokeWidth={1.4} strokeLinecap="round" />
      <path d={`M ${size * 0.18} ${size * 0.6} Q ${size * 0.35} ${size * 0.48} ${size * 0.5} ${size * 0.6} T ${size * 0.82} ${size * 0.6}`} fill="none" stroke={UX_LINE} strokeWidth={1.4} strokeLinecap="round" />
    </g>
  );
}

// Red circular checkmark bubble, overlapping the main frame's corner.
function UxCheckBubble({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={UX_RED} />
      <path
        d={`M ${cx - r * 0.45} ${cy} L ${cx - r * 0.1} ${cy + r * 0.35} L ${cx + r * 0.5} ${cy - r * 0.35}`}
        fill="none"
        stroke="white"
        strokeWidth={r * 0.22}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

// Rounded speech-bubble with a small tail.
function UxSpeechBubble({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={width} height={height} rx={height / 2} fill={UX_BUBBLE_BLUE} />
      <path d={`M ${width * 0.28} ${height * 0.88} L ${width * 0.18} ${height * 1.25} L ${width * 0.42} ${height * 0.92} Z`} fill={UX_BUBBLE_BLUE} />
    </g>
  );
}

// Curved connector arrow between two points, with an arrowhead at the end.
function UxArrow({ d, markerAt = "end" }: { d: string; markerAt?: "end" }) {
  const id = `ux-arrow-${d.length}`;
  return (
    <g>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 Z" fill={UX_LINE} />
        </marker>
      </defs>
      <path d={d} fill="none" stroke={UX_LINE} strokeWidth={1.6} markerEnd={markerAt === "end" ? `url(#${id})` : undefined} />
    </g>
  );
}

// The full composition, one fixed 340x270 illustration matching the
// reference's layout: a pink sticky note top-left feeding into a large
// main wireframe (with its own image placeholder, 3-card row, and bottom
// bar), a red checkmark bubble on the main frame's corner, a smaller
// wireframe bottom-left with a speech bubble, and a blue sticky note
// bottom-right feeding back into the main frame.
function UxSketch() {
  return (
    <svg width={340} height={270} viewBox="0 0 340 270">
      <UxArrow d="M 68 30 L 106 30" />
      <UxArrow d="M 60 145 C 90 165, 90 185, 118 215" />
      <UxArrow d="M 165 240 C 200 240, 210 225, 210 205" />
      <UxStickyNote x={8} y={4} size={54} rotate={-8} color={UX_NOTE_PINK} />
      <UxWireframeCard x={108} y={16} width={210} height={175} imgHeight={50} showBottomBars={false} />
      <UxCardRow x={122} y={110} width={182} />
      <line x1={122} y1={168} x2={304} y2={168} stroke={UX_LINE} strokeWidth={1.3} strokeLinecap="round" />
      <UxCheckBubble cx={303} cy={22} r={19} />
      <UxWireframeCard x={12} y={110} width={112} height={128} />
      <UxSpeechBubble x={92} y={214} width={58} height={30} />
      <UxStickyNote x={218} y={210} size={54} rotate={7} color={UX_NOTE_BLUE} />
    </svg>
  );
}

// Two instances, one large and one small/rotated for depth, both faint —
// this is a backdrop, not content. Positioned in the row's gutters like
// the AI category's clouds, not literally at 0%/100%.
// right-12/left-12 (fixed px, not %) — same reasoning as the AI category's
// gutter clouds: the card grid is mx-auto max-w-6xl inside a full-width
// row, so at anything below ~1184px viewport the cards touch the row's
// real edge with ZERO margin (a % inset here would've been computed
// against the wider expanded backdrop box anyway, same bug already fixed
// once). A fixed inset at least guarantees the sketch is mostly visible
// in the margin at typical wide-desktop widths (where that margin exists)
// and just ducks further behind the card as the window narrows — same
// "fine to duck behind cards" backdrop philosophy as everywhere else in
// this file, not a new problem.
// Typing-effect Lorem ipsum, centered in the gap between the two UX
// cards — a 3rd decorative element alongside the two UxSketch instances.
// Cycles through the same fixed paragraph forever, 4-8 words at a time
// per row (randomized per row, client-only via useEffect/setTimeout —
// never in the render path, so there's nothing for SSR/CSR to disagree
// on). Only 3 rows ever rendered: once a 4th would appear, the oldest is
// dropped from state and AnimatePresence plays its fade-up exit before
// it's actually gone from the DOM.
const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const LOREM_WORDS = LOREM.split(/\s+/);
const TYPING_MAX_ROWS = 10;
const TYPING_CHAR_MS = 45;
const TYPING_ROW_PAUSE_MS = 500;

// Pulls the next 4-8 words starting at `startIndex`, wrapping back to the
// start of LOREM_WORDS when it runs off the end — an endless loop over a
// fixed paragraph instead of a fixed number of rows.
function pickTypingRow(startIndex: number): { text: string; nextIndex: number } {
  const count = 6 + Math.floor(Math.random() * 5); // 6-10 words (was 4-8, +2 per Joyce)
  const words: string[] = [];
  let idx = startIndex;
  for (let i = 0; i < count; i++) {
    words.push(LOREM_WORDS[idx % LOREM_WORDS.length]);
    idx += 1;
  }
  return { text: words.join(" "), nextIndex: idx };
}

type TypingRow = { id: number; text: string };

function UxTypingLorem() {
  const [finishedRows, setFinishedRows] = useState<TypingRow[]>([]);
  // null = "hasn't started yet" (distinct from "" meaning a real empty
  // row), so the single effect below can own the mount-kickoff case too
  // instead of a separate effect that called setState synchronously in
  // its body (a real lint error, not just a style nit — react-hooks/
  // set-state-in-effect). Routing it through the same setTimeout the
  // row-transition case already uses avoids that without losing the
  // "nothing here runs during SSR" hydration-safety this was for in the
  // first place — setTimeout still only ever fires client-side.
  const [currentTarget, setCurrentTarget] = useState<string | null>(null);
  const [typedLength, setTypedLength] = useState(0);
  const [wordCursor, setWordCursor] = useState(0);
  const [nextRowId, setNextRowId] = useState(0);

  useEffect(() => {
    if (currentTarget === null) {
      const t = setTimeout(() => {
        const { text, nextIndex } = pickTypingRow(0);
        setCurrentTarget(text);
        setWordCursor(nextIndex);
      }, 0);
      return () => clearTimeout(t);
    }
    if (typedLength < currentTarget.length) {
      const t = setTimeout(() => setTypedLength((n) => n + 1), TYPING_CHAR_MS);
      return () => clearTimeout(t);
    }
    // Row's fully typed — pause, retire it into finishedRows (capped at
    // MAX_ROWS-1 so it plus the next in-progress row never exceeds 3
    // total), then start the next one.
    const t = setTimeout(() => {
      setFinishedRows((prev) => {
        const updated = [...prev, { id: nextRowId, text: currentTarget }];
        return updated.length > TYPING_MAX_ROWS - 1 ? updated.slice(updated.length - (TYPING_MAX_ROWS - 1)) : updated;
      });
      setNextRowId((n) => n + 1);
      const { text, nextIndex } = pickTypingRow(wordCursor);
      setCurrentTarget(text);
      setWordCursor(nextIndex);
      setTypedLength(0);
    }, TYPING_ROW_PAUSE_MS);
    return () => clearTimeout(t);
  }, [typedLength, currentTarget, nextRowId, wordCursor]);

  return (
    // whitespace-nowrap — at 6-10 words, wrapped rows would grow taller
    // right when the point is a tighter gap-1 between rows; nowrap keeps
    // each row a true single typed line (consistent with the rest of
    // this backdrop already letting content run past its own container
    // and duck behind cards, rather than reflowing).
    <div className="flex w-64 flex-col gap-1 font-mono text-[13px] leading-snug whitespace-nowrap text-[var(--color-muted)]">
      <AnimatePresence initial={false}>
        {finishedRows.map((row) => (
          <motion.div
            key={row.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {row.text}
          </motion.div>
        ))}
      </AnimatePresence>
      <div>
        {currentTarget?.slice(0, typedLength)}
        <span
          aria-hidden
          className="ml-0.5 inline-block w-[2px] animate-pulse bg-current align-middle"
          style={{ height: "1em" }}
        />
      </div>
    </div>
  );
}

function UxBackdrop() {
  return (
    <>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-[10%] right-12">
          <UxSketch />
        </div>
        <div className="absolute bottom-[8%] left-12 scale-75 opacity-70">
          <UxSketch />
        </div>
      </div>
      {/* Sibling of the opacity-20 sketch layer above, not a child of it —
          this is meant to actually be read as it types, not sit at
          backdrop-faint opacity. */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <UxTypingLorem />
      </div>
    </>
  );
}

// Cheap deterministic pseudo-random in [0, 1) — same seed always produces
// the same value, so server and client render identical output (a real
// Math.random() here would mismatch between SSR and hydration).
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Wrapped lines of binary/hash "code", like the reference photo — each
// row's WIDTH (not its text) varies to trace a silhouette. That silhouette
// used to be one fixed shared shape (narrow top, wide middle, tapering to a
// point — a "cloud"/speech-bubble outline) just rescaled per instance, so
// every cloud read as the same shape at a different size. generateShape
// below procedurally builds a new silhouette per seed instead: random
// row count (so some blocks are visibly longer than others), random max
// width, and a random blend between that cloud taper and a flatter
// rectangle — so shapes range anywhere from cloud-like to a plain block.
// Each row's text is a fixed sequence — it doesn't scramble character by
// character, it scrolls continuously at its own speed, so the
// "randomizing" reads as motion instead of flicker. Dense characters
// (#, @, 0, 1) up top fading to lighter ones (-, +, =, %) toward the bottom
// mirrors the reference's solid-to-faded gradient.
const DENSE_CHARS = ["#", "@", "0", "1"];
const LIGHT_CHARS = ["%", "=", "+", "-", ":", ".", "*"];
const ROW_TEXT_LENGTH = 60; // long enough to fill even the widest row twice over

// A low-cloudiness roll used to render as a near-hard-edged block (the
// "flat" envelope only jitters ±10%, so a low-cloudiness cloud started
// and ended at close to full width with no runway to taper down) —
// EDGE_TAPER_ROWS forces the first/last few rows to ramp in regardless of
// the cloud/flat blend, so every shape gets a soft lead-in and lead-out
// even the "rectangle" end of the spectrum.
const EDGE_TAPER_ROWS = 3;

// scale is CodeCloud's own instance scale (0.6-1) — maxWidth is computed
// in FINAL, POST-SCALE terms and then divided back out by scale, so every
// cloud's widest row lands in the same ~260-360px rendered range (≈39-55
// monospace chars at 11px/6.6px-per-char, comfortably over the "at least
// 30 chars" target) no matter how small that instance's scale is. Without
// this, a flat unscaled range meant the smallest-scale (0.6) clouds ended
// up with barely-readable ~10-char widest rows even though the same
// unscaled number looked fine on the scale=1 instance. The final range is
// also what keeps this from re-clipping at narrow viewports (see the
// fixed left-12/right-12 insets in CodeBackdrop) — capped at 360px, not
// left unbounded. widthMultiplier scales that final target up (or down)
// for one specific instance without touching the shared baseline every
// other cloud uses — the 65vw min() clamp on each row still backstops it
// regardless of how large a multiplier gets used.
function generateShape(seed: number, scale: number, widthMultiplier: number = 1): number[] {
  // Minimum bumped 7→10 so there's still a real body left after reserving
  // 3 rows on each end for the taper.
  const rowCount = 10 + Math.floor(pseudoRandom(seed) * 8); // 10-17 rows
  const maxWidth = ((260 + pseudoRandom(seed + 1) * 100) * widthMultiplier) / scale;
  // 0 = flat rectangle-ish block, 1 = full cloud taper (narrow ends, wide middle)
  const cloudiness = pseudoRandom(seed + 2);
  const widths: number[] = [];
  for (let i = 0; i < rowCount; i++) {
    const t = rowCount === 1 ? 0.5 : i / (rowCount - 1);
    const taper = Math.sin(t * Math.PI) ** 0.6; // 0 at both ends, 1 at the middle
    const flat = 0.8 + pseudoRandom(seed + 20 + i) * 0.2; // mild jitter, no shape
    const envelope = cloudiness * taper + (1 - cloudiness) * flat;
    const distFromEdge = Math.min(i, rowCount - 1 - i);
    const edgeRamp =
      distFromEdge >= EDGE_TAPER_ROWS ? 1 : (distFromEdge + 1) / (EDGE_TAPER_ROWS + 1);
    const jitter = 0.9 + pseudoRandom(seed + 40 + i) * 0.2;
    widths.push(Math.round(maxWidth * envelope * edgeRamp * jitter));
  }
  return widths;
}

// rowIndex/rowCount must be the row's position WITHIN ITS OWN cloud
// (0..rowCount-1) — textSeed is a separate value just for varying the
// actual characters between clouds. These used to be the same argument
// (rowIndex passed in as `i + seedOffset`), which meant every cloud past
// the first (seedOffset 45/97/150, all much bigger than any cloud's own
// ~7-15 rows) computed rowFrac way past 1.0 and always landed on
// LIGHT_CHARS — three of the four clouds were rendering as almost nothing
// but math symbols instead of the intended dense-binary-fading-to-light
// gradient every cloud is supposed to have.
function buildRowText(rowIndex: number, rowCount: number, textSeed: number): string {
  const rowFrac = rowIndex / (rowCount - 1);
  let s = "";
  for (let i = 0; i < ROW_TEXT_LENGTH; i++) {
    const seed = textSeed * 1000 + i;
    // Biased toward DENSE_CHARS throughout (was fading up to 90% light by
    // the last row) — reads as code/binary at a glance instead of drifting
    // into plain math symbols by the bottom of the shape.
    const pool = pseudoRandom(seed) < rowFrac * 0.4 + 0.05 ? LIGHT_CHARS : DENSE_CHARS;
    s += pool[Math.floor(pseudoRandom(seed + 0.5) * pool.length)];
  }
  return s;
}

// EXPERIMENTAL — per-character shading, ~1 in 4 characters rendered a shade
// darker than the rest of the row instead of one flat color throughout.
// Easy to pull back out (swap the call site back to plain `{text}`) if it
// doesn't actually read well once it's moving.
function ShadedText({ text, seed }: { text: string; seed: number }) {
  return (
    <>
      {text.split("").map((char, i) => {
        const isDark = pseudoRandom(seed + i * 7.7) < 0.25;
        return (
          <span
            key={i}
            style={isDark ? { color: "color-mix(in srgb, var(--color-primary) 60%, black)" } : undefined}
          >
            {char}
          </span>
        );
      })}
    </>
  );
}

// One cloud = one set of rows, its own procedurally generated shape
// (generateShape) rescaled by `scale` — no two clouds share a silhouette
// or a length anymore.
function CodeCloud({
  seedOffset,
  scale,
  widthMultiplier = 1,
}: {
  seedOffset: number;
  scale: number;
  widthMultiplier?: number;
}) {
  const widthProfile = generateShape(seedOffset, scale, widthMultiplier);
  const rowCount = widthProfile.length;
  // Rows used to be flush-left (marginLeft was a small 0-10px jitter with
  // no relation to the row's own width) — with widths tapering by up to
  // 180px between rows, that meant the LEFT edge stayed nearly straight
  // while only the RIGHT edge actually tapered, reading as a shape that's
  // "cut off" on one side rather than a complete cloud silhouette.
  // A first fix centered every row exactly 50/50 under the cloud's widest
  // row — but the underlying width envelope is a smooth sine taper, so a
  // fixed 50/50 split just mirrors that same smooth curve on both edges,
  // which reads as a geometric diamond, not an organic cloud. Instead each
  // row gets its OWN independently randomized split of the "missing"
  // width between its left and right side (see leftShare below) — edges
  // vary independently row to row instead of mirroring each other, while
  // still landing centered on average across the whole shape.
  const boundingWidth = Math.max(...widthProfile);
  return (
    <div className="font-mono text-[11px] leading-[1.6] text-[var(--color-primary)] opacity-15">
      {widthProfile.map((width, i) => {
        const seed = seedOffset + i;
        const text = buildRowText(i, rowCount, seed);
        // All rows roll the same direction now (was alternating per row,
        // which read as chaotic) — each still gets its own speed via
        // pseudoRandom, so it's not a flat scroll, just a consistent one.
        const duration = round(9 + pseudoRandom(seed + 2.5) * 10, 2);
        // Rounded to whole pixels — an unrounded float here (they used to
        // go in at full double precision, e.g. 1.7401773023811984) is a
        // known source of false-positive hydration mismatches: the browser
        // re-serializes long CSS float values with different precision
        // than what React wrote, so the post-hydration DOM value never
        // quite matches what React expects to find there.
        const rowWidth = Math.round(width * scale);
        // How much narrower this row is than the cloud's widest row — that
        // gap gets split between left/right margin per row. leftShare
        // ranges 0.25-0.75 (never 0 or 1, so a row never goes fully flush
        // to either side — that's the original bug) but is independently
        // randomized per row rather than a fixed 0.5, so which side gets
        // more of the gap varies row to row instead of both edges tracing
        // the exact same mirrored curve.
        const missingWidth = boundingWidth - width;
        const leftShare = 0.25 + pseudoRandom(seed + 3.5) * 0.5;
        const rowMarginLeft = Math.round(missingWidth * leftShare * scale);
        return (
          <div
            key={i}
            className="overflow-hidden whitespace-nowrap"
            // width is a CSS min(), not a bare px number — this cloud's
            // fixed left-12/right-12 anchor (in CodeBackdrop) only
            // guarantees a safe margin on the anchored side; the OTHER
            // edge grows however wide rowWidth says regardless of
            // viewport, and rowWidth can now be up to ~360px (bumped for
            // legibility — see generateShape). On a narrow/mobile
            // viewport that's wide enough to reach past the row's own
            // real edge and clip. Clamping to 65vw is a hard, CSS-level
            // backstop that can't be defeated by any of this file's own
            // px math being wrong — 65vw is ~208px even on a 320px-wide
            // phone, still comfortably over the 30-char/~198px target.
            style={{ width: `min(${rowWidth}px, 65vw)`, marginLeft: rowMarginLeft }}
          >
            <div
              className="inline-block"
              style={{
                animation: `marquee ${duration}s linear infinite`,
              }}
            >
              <ShadedText text={text} seed={seed} />
              <ShadedText text={text} seed={seed + 500} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function round(n: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

// Four clouds — three in the row's side-margin gutters, one dead-center
// behind the gap between the two cards instead of a fourth corner (fine
// for it to duck partly behind the cards, that's the point, it's a
// backdrop). Horizontal insets on the three gutter clouds are FIXED px
// (left-12/right-12), not %.
//
// Why: this backdrop wrapper (CategoryBackdrop's motion.div) is expanded
// -inset-x-6 (24px) wider than the row on both sides, but the actual clip
// boundary is the row's own narrower overflow-hidden box. A % inset here
// is computed against the wider backdrop box, so as the row narrows (a
// phone-width viewport, or just browser zoom shrinking the effective CSS
// px width) that margin shrinks FASTER than the row itself does, and can
// go negative — the cloud starts clipped before it even begins rendering.
// A fixed px inset doesn't have that problem: left-12/right-12 (48px from
// the backdrop's edge, so 48-24=24px from the row's REAL edge) stays a
// constant 24px margin no matter how narrow the row gets, and maxWidth
// was halved (generateShape, 90-180px not 130-310) so a cloud can never
// realistically out-run that fixed margin on any real viewport.
// Each cloud's own row-level min(px, 65vw) clamp (in CodeCloud) only
// guards against a SINGLE cloud overflowing the viewport — it says
// nothing about the four clouds' extents relative to EACH OTHER. At
// desktop-but-not-full-width windows (roughly the sm-lg range, where the
// two project cards are still side by side but have lost most of their
// breathing room), 65vw is still wide enough that the left cloud growing
// right and the center/right clouds growing left/outward can reach into
// the same horizontal territory — two marquee text blocks visibly
// overlapping, not just one cloud ducking behind a card (which is fine).
// vw alone can't fix this: it scales linearly with viewport width, but
// the shape we actually want (unclamped at wide desktop, sharply
// restricted in that mid-width squeeze, modest on mobile) isn't linear.
// So this caps each cloud's own bounding box with breakpoint-specific
// max-width + overflow-hidden instead — a real step function, not a
// proportional one. xl:max-w-none matches the "no extra cap" case
// already verified to look right at 1440px (including the doubled
// top-right cloud's 556px, which xl:max-w-none leaves untouched since
// 1440px is past the xl breakpoint).
const CLOUD_WRAPPER_CLAMP =
  "max-w-[130px] overflow-hidden sm:max-w-[150px] md:max-w-[220px] lg:max-w-[320px] xl:max-w-none";

function CodeBackdrop() {
  return (
    <div className="absolute inset-0">
      <div className={`absolute top-[24%] left-12 ${CLOUD_WRAPPER_CLAMP}`}>
        <CodeCloud seedOffset={0} scale={1} />
      </div>
      <div className={`absolute right-12 bottom-[10%] ${CLOUD_WRAPPER_CLAMP}`}>
        <CodeCloud seedOffset={97} scale={0.8} />
      </div>
      {/* widthMultiplier=2 — Joyce's call, this one's widest row should
          fit double the characters the others do. */}
      <div className={`absolute top-[8%] right-12 ${CLOUD_WRAPPER_CLAMP}`}>
        <CodeCloud seedOffset={45} scale={0.6} widthMultiplier={2} />
      </div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${CLOUD_WRAPPER_CLAMP}`}>
        <CodeCloud seedOffset={150} scale={0.75} />
      </div>
    </div>
  );
}

// Evenly spaced radial tick marks around a circle (every `longEvery`-th
// one drawn longer) — the clock-face/instrument-panel detail the simpler
// dashed-circle version didn't have.
function TickRing({
  cx,
  cy,
  radius,
  count,
  tickLength,
  color,
  longEvery,
}: {
  cx: number;
  cy: number;
  radius: number;
  count: number;
  tickLength: number;
  color: string;
  longEvery: number;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const isLong = i % longEvery === 0;
        const len = isLong ? tickLength * 1.8 : tickLength;
        // Rounded to 2 decimals — Math.cos/sin can differ in the last bit
        // between Node's V8 build (server) and Chrome's (client) for the
        // same input, which is exactly the kind of thing that trips the
        // hydration-mismatch check on SVG coordinate attributes. Same fix
        // as the earlier marginLeft/width issue: round before it becomes
        // part of the rendered output, don't ship full float precision.
        const x1 = round(cx + Math.cos(angle) * radius, 2);
        const y1 = round(cy + Math.sin(angle) * radius, 2);
        const x2 = round(cx + Math.cos(angle) * (radius - len), 2);
        const y2 = round(cy + Math.sin(angle) * (radius - len), 2);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={isLong ? 1.3 : 0.75} />
        );
      })}
    </>
  );
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: round(cx + Math.cos(rad) * r, 2), y: round(cy + Math.sin(rad) * r, 2) };
}

// A single partial arc (not a full circle) between two angles — the SVG
// path A-command, not strokeDasharray, since dasharray only ever produces
// evenly-spaced segments and this needs irregular hand-placed ones.
function ArcSegment({
  cx,
  cy,
  r,
  startAngle,
  endAngle,
  stroke,
  strokeWidth,
  cap = "butt",
}: {
  cx: number;
  cy: number;
  r: number;
  startAngle: number;
  endAngle: number;
  stroke: string;
  strokeWidth: number;
  cap?: "butt" | "square" | "round";
}) {
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, endAngle);
  const largeArc = ((endAngle - startAngle + 360) % 360) > 180 ? 1 : 0;
  return (
    <path
      d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={cap}
    />
  );
}

function ArcBand({
  cx,
  cy,
  r,
  segments,
  stroke,
  strokeWidth,
  cap = "butt",
}: {
  cx: number;
  cy: number;
  r: number;
  segments: [number, number][];
  stroke: string;
  strokeWidth: number;
  cap?: "butt" | "square" | "round";
}) {
  return (
    <>
      {segments.map(([start, end], i) => (
        <ArcSegment
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          startAngle={start}
          endAngle={end}
          stroke={stroke}
          strokeWidth={strokeWidth}
          cap={cap}
        />
      ))}
    </>
  );
}

function DotRing({
  cx,
  cy,
  r,
  count,
  dotRadius,
  color,
}: {
  cx: number;
  cy: number;
  r: number;
  count: number;
  dotRadius: number;
  color: string;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const p = polar(cx, cy, r, (i / count) * 360);
        return <circle key={i} cx={p.x} cy={p.y} r={dotRadius} fill={color} />;
      })}
    </>
  );
}

// Tamagotchi/status-readout gauge — Joyce's reference: a multi-ring dial
// with a stat readout centered inside, a column of icon+value rows down
// the side, a date line, and a percentage in the corner. Colors stay
// within the site's existing primary/accent tokens rather than the
// reference's literal cyan/pink — same "no new colors ahead of the final
// palette" rule the rest of this file already follows.
function StatusHud({ size }: { size: number }) {
  const ringSize = size * 0.62;
  const c = ringSize / 2;
  const sw = (frac: number) => ringSize * frac; // stroke width as a fraction of ring size

  // Irregular arc segments, hand-placed (not evenly divided) and offset
  // from each other layer to layer so the gaps never line up radially.
  const arcOuter: [number, number][] = [
    [15, 80],
    [150, 205],
    [260, 335],
  ];
  const arcMid: [number, number][] = [
    [50, 110],
    [190, 230],
    [300, 350],
  ];
  const arcInner: [number, number][] = [
    [0, 40],
    [95, 130],
    [170, 250],
    [290, 320],
  ];

  return (
    <div className="relative font-mono" style={{ width: size, height: size }}>
      {/* Ring dial, centered-right so the stat column has room on the left.
          ~13 independent layers (outline / tick / arc / dot / fine-dash,
          repeated at different radii, three of them — the orange
          quarter-circle plus the two new L0c/L0d layers — on their own
          oversized canvases so they can sit outside the main ringSize
          box) instead of a couple of rescaled circles — each layer has
          its own purpose, stroke weight, and (where it rotates) its own
          speed/direction. */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2" style={{ width: ringSize, height: ringSize }}>
        {/* L1 — outer thin outline, static */}
        <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`} className="absolute inset-0">
          <circle cx={c} cy={c} r={ringSize * 0.48} fill="none" stroke="var(--color-primary)" strokeWidth={sw(0.006)} />
        </svg>

        {/* Top-left quarter-circle accent — thick, orange, drawn OUTSIDE
            the main ring (r > 0.48). Own oversized SVG canvas (1.25x,
            centered on the same point) since a radius past 0.48 would
            otherwise clip against the other layers' ringSize-sized
            viewBox. */}
        <svg
          width={ringSize * 1.25}
          height={ringSize * 1.25}
          viewBox={`0 0 ${ringSize * 1.25} ${ringSize * 1.25}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <ArcSegment
            cx={(ringSize * 1.25) / 2}
            cy={(ringSize * 1.25) / 2}
            r={ringSize * 0.56}
            startAngle={180}
            endAngle={270}
            stroke="#e8722a"
            strokeWidth={sw(0.07)}
            cap="butt"
          />
        </svg>

        {/* L0c — new outermost dashed ring, past everything else. Own
            oversized 1.4x canvas, same "bigger canvas so r > 0.48 doesn't
            clip against the ringSize-sized viewBox" trick as the orange
            quarter-circle above. */}
        <svg
          width={ringSize * 1.4}
          height={ringSize * 1.4}
          viewBox={`0 0 ${ringSize * 1.4} ${ringSize * 1.4}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: "hud-spin 65s linear infinite reverse" }}
        >
          <circle
            cx={(ringSize * 1.4) / 2}
            cy={(ringSize * 1.4) / 2}
            r={ringSize * 0.62}
            fill="none"
            stroke="color-mix(in srgb, var(--color-primary) 35%, transparent)"
            strokeWidth={sw(0.01)}
            strokeDasharray={`${sw(0.012)} ${sw(0.03)}`}
          />
        </svg>

        {/* L0d — new outermost segmented arc band, further out still, own
            1.6x canvas. Blue now (was --color-accent amber) — same literal
            #3fd0ff used on AriaGauge's radar-sweep highlight, so both
            robotics gauges carry the same "bit of blue" accent note. */}
        <svg
          width={ringSize * 1.6}
          height={ringSize * 1.6}
          viewBox={`0 0 ${ringSize * 1.6} ${ringSize * 1.6}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: "hud-spin 24s linear infinite" }}
        >
          <ArcBand
            cx={(ringSize * 1.6) / 2}
            cy={(ringSize * 1.6) / 2}
            r={ringSize * 0.72}
            segments={arcOuter}
            stroke="#3fd0ff"
            strokeWidth={sw(0.02)}
            cap="round"
          />
        </svg>

        {/* L2 — fine dense tick ring, slow spin */}
        <svg
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          className="absolute inset-0"
          style={{ animation: "hud-spin 48s linear infinite" }}
        >
          <TickRing
            cx={c}
            cy={c}
            radius={ringSize * 0.44}
            count={72}
            tickLength={sw(0.02)}
            color="var(--color-primary)"
            longEvery={6}
          />
        </svg>

        {/* L3 — heavy segmented arc band, medium spin */}
        <svg
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          className="absolute inset-0"
          style={{ animation: "hud-spin 22s linear infinite reverse" }}
        >
          <ArcBand cx={c} cy={c} r={ringSize * 0.39} segments={arcOuter} stroke="var(--color-primary)" strokeWidth={sw(0.05)} cap="butt" />
        </svg>

        {/* L4 — dot ring, fast spin */}
        <svg
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          className="absolute inset-0"
          style={{ animation: "hud-spin 14s linear infinite" }}
        >
          <DotRing cx={c} cy={c} r={ringSize * 0.34} count={40} dotRadius={sw(0.007)} color="var(--color-accent)" />
        </svg>

        {/* L5 — second segmented arc band, offset from L3, opposite spin */}
        <svg
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          className="absolute inset-0"
          style={{ animation: "hud-spin 27s linear infinite" }}
        >
          <ArcBand cx={c} cy={c} r={ringSize * 0.29} segments={arcMid} stroke="var(--color-accent)" strokeWidth={sw(0.032)} cap="square" />
        </svg>

        {/* L6 — very fine dashed detail ring between major layers, static */}
        <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`} className="absolute inset-0">
          <circle
            cx={c}
            cy={c}
            r={ringSize * 0.25}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={sw(0.005)}
            strokeDasharray={`${sw(0.006)} ${sw(0.014)}`}
          />
        </svg>

        {/* L7 — sparser, longer/thicker tick ring, slow reverse spin */}
        <svg
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          className="absolute inset-0"
          style={{ animation: "hud-spin 60s linear infinite reverse" }}
        >
          <TickRing
            cx={c}
            cy={c}
            radius={ringSize * 0.21}
            count={24}
            tickLength={sw(0.028)}
            color="var(--color-accent)"
            longEvery={4}
          />
        </svg>

        {/* L8 — inner thin outline, static */}
        <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`} className="absolute inset-0">
          <circle cx={c} cy={c} r={ringSize * 0.17} fill="none" stroke="var(--color-primary)" strokeWidth={sw(0.006)} />
        </svg>

        {/* L9 — third, tighter segmented arc band, fast reverse spin */}
        <svg
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          className="absolute inset-0"
          style={{ animation: "hud-spin 18s linear infinite reverse" }}
        >
          <ArcBand cx={c} cy={c} r={ringSize * 0.135} segments={arcInner} stroke="var(--color-primary)" strokeWidth={sw(0.02)} cap="butt" />
        </svg>

        {/* L10 — dense fine dot ring, medium spin */}
        <svg
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          className="absolute inset-0"
          style={{ animation: "hud-spin 33s linear infinite" }}
        >
          <DotRing cx={c} cy={c} r={ringSize * 0.1} count={50} dotRadius={sw(0.004)} color="var(--color-primary)" />
        </svg>

        {/* L11 — targeting reticle ring: a static ring plus 4 cardinal
            crosshair alignment ticks, like a lock indicator, doesn't spin */}
        <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`} className="absolute inset-0">
          <circle cx={c} cy={c} r={ringSize * 0.07} fill="none" stroke="var(--color-primary)" strokeWidth={sw(0.005)} />
          {[0, 90, 180, 270].map((angle) => {
            const outer = polar(c, c, ringSize * 0.09, angle);
            const inner = polar(c, c, ringSize * 0.055, angle);
            return (
              <line key={angle} x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y} stroke="var(--color-accent)" strokeWidth={sw(0.008)} />
            );
          })}
        </svg>

        {/* Center reticle cluster — nested fine circles + center dot,
            behind the "00/00" readout text below */}
        <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`} className="absolute inset-0">
          <circle cx={c} cy={c} r={ringSize * 0.04} fill="none" stroke="var(--color-primary)" strokeWidth={sw(0.004)} />
          <circle cx={c} cy={c} r={ringSize * 0.02} fill="none" stroke="var(--color-primary)" strokeWidth={sw(0.004)} />
          <circle cx={c} cy={c} r={1.2} fill="var(--color-primary)" />
        </svg>
      </div>

      {/* Icon+value column, date, and percentage text readouts removed per
          Joyce — this instance is now just the ring dial itself, no text
          overlays. */}
    </div>
  );
}

// Gauge dial (internally still AriaGauge — rename deferred to the final
// cleanup pass) — converted from a pasted reference SVG snippet. Originally
// its own literal cyan/orange palette; recolored to the site's actual
// green tokens (var(--color-primary)/-light, plus color-mix against them
// for the fainter structural rings) so it matches the rest of the backdrop
// instead of standing out as a foreign blue dial. The thick arc originally
// used --color-primary-dark, which reads as flat near-black at this
// opacity instead of green — swapped to --color-primary at reduced
// strokeOpacity so it stays visibly part of the green family. Several
// rings spin at their own independent speed/direction off the shared
// hud-spin keyframe (mirrors StatusHud's multi-layer approach) so the dial
// reads as live instead of a static illustration; transformBox: "view-box"
// + a pixel transformOrigin is what keeps every ring's rotation centered
// on the dial regardless of whether the ring itself is a symmetric circle
// or an off-center arc path.
// Outer accent band, added past the original r=136 boundary — irregular
// hand-placed segments (not evenly divided), same idiom as StatusHud's
// arcOuter/arcMid/arcInner.
const ARIA_OUTER_BAND: [number, number][] = [
  [10, 75],
  [140, 195],
  [250, 330],
];

function AriaGauge({ size }: { size: number }) {
  return (
    <div className="relative" style={{ width: size, height: size, fontFamily: "'Saira', sans-serif" }}>
      {/* overflow: visible — the new outer layers below extend past the
          nominal 280x280 viewBox (up to r=210), which the SVG's default
          overflow:hidden would otherwise clip flush at the box edge. The
          dial now visually bleeds well past its own declared `size`,
          which is intentional — that's what "more layers outside it"
          means here. */}
      <svg
        viewBox="0 0 280 280"
        className="absolute inset-0"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        {/* Static cardinal "lock" frame — 4 short radial ticks at true
            N/E/S/W, the one layer in the whole dial that does NOT spin,
            so it reads as a fixed reference frame the rest of the rings
            rotate against, like the inner reticle's crosshair but scaled
            up to the outer edge. */}
        <TickRing cx={140} cy={140} radius={210} count={4} tickLength={14} color="color-mix(in srgb, var(--color-primary) 60%, transparent)" longEvery={1} />

        {/* Outermost dot ring — new, counter-rotating against the dashed
            ring just inside it */}
        <g style={{ transformBox: "view-box", transformOrigin: "140px 140px", animation: "hud-spin 44s linear infinite" }}>
          <DotRing cx={140} cy={140} r={195} count={54} dotRadius={1.4} color="color-mix(in srgb, var(--color-primary) 50%, transparent)" />
        </g>

        {/* Outermost dashed ring — slowest spin of the whole dial */}
        <g
          style={{ transformBox: "view-box", transformOrigin: "140px 140px", animation: "hud-spin 70s linear infinite reverse" }}
        >
          <circle
            cx={140}
            cy={140}
            r={178}
            fill="none"
            stroke="color-mix(in srgb, var(--color-primary) 30%, transparent)"
            strokeWidth={1}
            strokeDasharray="2 6"
          />
        </g>

        {/* New fine tick ring, outside the original boundary — reuses the
            same TickRing helper StatusHud's own tick layers are built
            from, rather than a bespoke one-off. */}
        <g style={{ transformBox: "view-box", transformOrigin: "140px 140px", animation: "hud-spin 55s linear infinite" }}>
          <TickRing cx={140} cy={140} radius={162} count={48} tickLength={6} color="color-mix(in srgb, var(--color-primary) 55%, transparent)" longEvery={8} />
        </g>

        {/* New outer segmented arc band — the one other accent-colored
            layer besides the inner tick arc, so the added outer shell
            doesn't read as pure green padding. */}
        <g style={{ transformBox: "view-box", transformOrigin: "140px 140px", animation: "hud-spin 26s linear infinite reverse" }}>
          <ArcBand cx={140} cy={140} r={148} segments={ARIA_OUTER_BAND} stroke="var(--color-accent)" strokeWidth={3} cap="round" />
        </g>

        <circle
          cx={140}
          cy={140}
          r={136}
          fill="none"
          stroke="color-mix(in srgb, var(--color-primary) 35%, transparent)"
          strokeWidth={1}
        />

        {/* dashed outer ring — slow spin */}
        <g
          style={{ transformBox: "view-box", transformOrigin: "140px 140px", animation: "hud-spin 40s linear infinite" }}
        >
          <circle
            cx={140}
            cy={140}
            r={124}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={16}
            strokeDasharray="4 3"
            opacity={0.55}
          />
        </g>

        {/* thick arc — medium spin, reverse direction from the ring above */}
        <g
          style={{
            transformBox: "view-box",
            transformOrigin: "140px 140px",
            animation: "hud-spin 16s linear infinite reverse",
          }}
        >
          <circle
            cx={140}
            cy={140}
            r={104}
            fill="none"
            stroke="var(--color-primary)"
            strokeOpacity={0.85}
            strokeWidth={14}
            strokeDasharray="300 480"
            strokeLinecap="round"
            transform="rotate(-100 140 140)"
          />
        </g>

        {/* accent tick arc — fastest spin, the one warm contrast note
            against the otherwise all-green dial */}
        <g style={{ transformBox: "view-box", transformOrigin: "140px 140px", animation: "hud-spin 9s linear infinite" }}>
          <circle
            cx={140}
            cy={140}
            r={104}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={4}
            strokeDasharray="60 600"
            transform="rotate(-108 140 140)"
          />
        </g>

        <circle
          cx={140}
          cy={140}
          r={86}
          fill="none"
          stroke="color-mix(in srgb, var(--color-primary) 45%, transparent)"
          strokeWidth={1.5}
        />
        {/* Inner center circle only — back to the exact literal colors
            from the original first-pasted reference (#071119 / #2aa5dd),
            per Joyce. Everything else on this dial stays on the green
            palette; this one circle is the deliberate exception. */}
        <circle
          cx={140}
          cy={140}
          r={76}
          fill="#071119"
          stroke="#2aa5dd"
          strokeWidth={2}
        />
        <circle
          cx={140}
          cy={140}
          r={60}
          fill="none"
          stroke="color-mix(in srgb, var(--color-primary) 40%, transparent)"
          strokeWidth={1}
        />

        {/* bright quarter highlight — its own spin, a radar-sweep accent.
            One literal blue note (from the original pasted reference,
            #3fd0ff — same literal-color exception used elsewhere in this
            file) reintroduced here per Joyce, not a full reversion off
            the green palette. */}
        <g style={{ transformBox: "view-box", transformOrigin: "140px 140px", animation: "hud-spin 6s linear infinite" }}>
          <path d="M140 24 A116 116 0 0 1 256 140" fill="none" stroke="#3fd0ff" strokeWidth={2} />
        </g>
      </svg>

      {/* Smaller font-size/letter-spacing ratio than the original ARIA
          text — ULTRON is 6 characters vs. ARIA's 4, so the same ratio
          would overflow the inner rings. Color flipped back to a light
          blue-white now that the core circle behind it is the restored
          literal #071119 dark fill — the dark-green label from the
          light-core era would be unreadable against a dark core. */}
      <div
        className="absolute inset-0 flex items-center justify-center font-bold"
        style={{
          fontSize: size * 0.085,
          letterSpacing: size * 0.02,
          color: "#dff1fb",
        }}
      >
        ULTRON
      </div>
    </div>
  );
}

// Robotics row backdrop: StatusHud (bottom-right ring dial), AriaGauge
// (centered behind the gap between the two project cards — fine for it to
// duck partly behind the cards, same reasoning as the AI category's
// center CodeCloud), and two of Joyce's own reference vectors used
// directly as images (bottom-left, top-right) rather than hand-coded SVG.
function HudBackdrop() {
  return (
    <div className="absolute inset-0 opacity-20">
      <div className="absolute right-[4%] bottom-[6%]">
        <StatusHud size={260} />
      </div>
      {/* Moved from the top-left corner to centered behind the gap between
          the two project cards — fine for it to duck partly behind the
          cards themselves, same reasoning as the AI category's center
          CodeCloud. */}
      <div className="absolute top-1/2 left-[47%] -translate-x-1/2 -translate-y-1/2">
        <AriaGauge size={130} />
      </div>
      {/* Bottom-left silhouette — Joyce's own reference vector (public/
          images/work/Vector 1.png, swapped for a new version of the same
          file), used directly instead of the hand-coded two-panel puzzle
          path (HudFrame, still defined above, unused — superseded, not
          deleted, per the deferred-cleanup rule for this backdrop). Sized
          at 1.2x the previous 380×74 (same ~0.195 aspect ratio the new
          file also happens to share). No extra opacity multiplier on top
          of this whole backdrop's own opacity-20 wrapper — an added
          opacity-40 here made it nearly invisible (0.4 × 0.2 = 0.08), so
          it sits at the same baseline visibility as every other element
          in this backdrop instead of fading out on its own. bottom-12
          (not a % offset) is deliberate: this backdrop's own wrapper is
          expanded by -inset-y-12 beyond the row's real box, so a matching
          bottom-12 here exactly cancels that expansion and lands the
          image's bottom edge flush with the row's actual bottom edge
          instead of eyeballing a percentage against the wrong box. */}
      <div className="absolute bottom-12 left-[2%]">
        <img src="/images/work/Vector%201.png" alt="" aria-hidden className="h-[410px] w-[80px] object-contain" />
      </div>
      {/* Top-right silhouette — Joyce's second reference vector (public/
          images/work/Group 45.png), same "use directly, no recoloring"
          treatment as the bottom-left one. top-12 mirrors that one's
          bottom-12: this backdrop's wrapper is expanded by -inset-y-12
          beyond the row's real box on BOTH edges, so top-12 cancels the
          top-side expansion the same way bottom-12 cancels the bottom
          one, landing this image's top edge flush with the row's actual
          top edge. */}
      <div className="absolute top-12 right-[2%]">
        <img src="/images/work/Group%2045.png" alt="" aria-hidden className="h-[300px] w-[34px] object-contain" />
      </div>
    </div>
  );
}

export default function CategoryBackdrop({ category }: { category: ProjectCategory }) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.35 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pointer-events-none absolute -inset-x-6 -inset-y-12 -z-10"
    >
      {/* No colored gradient wash behind the sketch — just the line art. */}
      {category === "ux" && <UxBackdrop />}
      {category === "ai" && <CodeBackdrop />}
      {category === "robotics" && <HudBackdrop />}
    </motion.div>
  );
}
