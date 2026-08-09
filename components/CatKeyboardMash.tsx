"use client";

import { useEffect, useRef, useState } from "react";

// One continuous typed line, not two separate elements: it types out the
// real sentence first, then — with no pause or break — keeps going
// straight into endless "cat mashing the keyboard" gibberish, alternating
// bursts of typing and backspacing (a paw landing on a cluster of keys,
// then dragging back across them) rather than only ever growing forever.
// Runs forever — the interval is never cleared except on unmount.
const INTRO_TEXT = "My cat sat on the keyboard again.";
const MASH_CHARS = "asdfghjklqwertyuiopzxcvbnm[]{}\\|;:'\",.<>/?1234567890-=";
const TICK_MS = 55;
// Only the first ~60-90 characters of this line are ever visible before
// the screen-edge clip — everything past that is already invisible. This
// cap is just a memory safety net for a tab left open a long time.
const MAX_STORED_CHARS = 400;
// Odds that, once a typing burst ends, the NEXT burst is a delete instead
// of more typing.
const DELETE_CHANCE = 0.3;

function randomChar() {
  return MASH_CHARS[Math.floor(Math.random() * MASH_CHARS.length)];
}
function randomTypeRunLength() {
  return 4 + Math.floor(Math.random() * 14); // 4-17 keystrokes on the same key
}
function randomDeleteRunLength() {
  return 25 + Math.floor(Math.random() * 35); // 25-59 backspaces (was 10-29, before that 2-9)
}

type Mode = "type" | "delete";

export default function CatKeyboardMash() {
  const [text, setText] = useState("");
  // Refs, not state — these track progress between ticks but never need
  // to trigger a render themselves (only the accumulated text does).
  // Critically, they're only ever mutated here in the interval callback's
  // own body, NOT inside setText's updater function — React Strict Mode
  // deliberately double-invokes functional setState updaters to catch
  // impure ones, and mutating a ref inside one desyncs the ref from what
  // actually gets committed (this is exactly what produced garbled,
  // out-of-order letters in the intro sentence before this fix — the
  // index ref was advancing twice per real character typed).
  const introIndexRef = useRef(0);
  const modeRef = useRef<Mode>("type");
  const currentCharRef = useRef<string | null>(null);
  const remainingRef = useRef(0);
  // Mirrors text.length so the interval callback can check "are we at the
  // intro floor?" BEFORE calling setText, without reaching into state.
  const lengthRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      let charToAppend = "";
      let doDelete = false;

      if (introIndexRef.current < INTRO_TEXT.length) {
        charToAppend = INTRO_TEXT[introIndexRef.current];
        introIndexRef.current += 1;
      } else {
        if (remainingRef.current <= 0) {
          modeRef.current = modeRef.current === "delete" ? "type" : Math.random() < DELETE_CHANCE ? "delete" : "type";
          remainingRef.current = modeRef.current === "type" ? randomTypeRunLength() : randomDeleteRunLength();
          if (modeRef.current === "type") currentCharRef.current = randomChar();
        }
        // If a delete run would hit the intro-sentence floor before its
        // count runs out, snap straight into a fresh typing run right
        // now instead of burning through the rest of the delete run
        // doing nothing — that idle stretch (up to ~9 ticks, ~500ms) is
        // what read as the animation "stopping".
        if (modeRef.current === "delete" && lengthRef.current <= INTRO_TEXT.length) {
          modeRef.current = "type";
          remainingRef.current = randomTypeRunLength();
          currentCharRef.current = randomChar();
        }
        remainingRef.current -= 1;
        if (modeRef.current === "delete") {
          doDelete = true;
        } else {
          charToAppend = currentCharRef.current ?? randomChar();
        }
      }

      // Pure updater — only reads prev plus the values already computed
      // above, never mutates anything itself.
      setText((prev) => {
        const next = doDelete ? prev.slice(0, -1) : prev + charToAppend;
        // "My cat sat on the keyboard again." must always stay on screen,
        // no matter how much mash piles up behind it — so once trimming
        // to MAX_STORED_CHARS, only ever drop old MASH characters, never
        // the intro sentence itself. A plain next.slice(-MAX) would
        // eventually eat into the intro once total length ran past 400.
        let clamped = next;
        if (next.length > MAX_STORED_CHARS) {
          const mashPart = next.slice(INTRO_TEXT.length);
          const maxMash = MAX_STORED_CHARS - INTRO_TEXT.length;
          clamped = INTRO_TEXT + (mashPart.length > maxMash ? mashPart.slice(mashPart.length - maxMash) : mashPart);
        }
        lengthRef.current = clamped.length;
        return clamped;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    // Breaks out of whatever centered/max-width parent this sits in to
    // span the full viewport width — the point is that it runs off the
    // actual screen edge, not just its own container's edge. pl-[38%]
    // starts the sentence a bit left of dead-center (was 50%, per Joyce)
    // — and text-left (not center) keeps that start point FIXED as more
    // characters get typed: growth only ever extends rightward from
    // there, clipped at the right screen edge, instead of centered text
    // drifting the start point leftward as content is added on both
    // sides.
    <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
      <div className="pl-[38%] text-left font-mono text-[16px] whitespace-nowrap text-[var(--color-fg)] sm:text-[19px]">
        {text}
        <span
          aria-hidden
          className="ml-0.5 inline-block w-[2px] animate-pulse bg-current align-middle"
          style={{ height: "1em" }}
        />
      </div>
    </div>
  );
}
