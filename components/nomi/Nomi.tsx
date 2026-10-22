"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  GROUND_FROM_BOTTOM,
  EYES_FROM_RIGHT,
  HEAD_TOP,
  PIXELS_PER_SECOND,
  TRACK_H,
  WALK_DISTANCE,
  WALK_END_RIGHT,
  WALK_EYE_FRACTION,
  WALK_W,
  sitRest,
  type Step,
} from "./clips";
import { entrySegment, nextSegment, wakeUp, type Segment } from "./nomiBrain";
import NomiSprite from "./NomiSprite";
import NomiBubble from "./NomiBubble";
import NomiChat from "./NomiChat";

// Nomi, the site's cat — mounted once in the root layout, so she keeps doing
// whatever she was doing as you move between pages. She walks in only when a
// visit *starts* on the homepage (once per browser session); otherwise she's
// already in the bottom-right corner in a random mood. Her bubble and the
// chat window are the entrance to the (future) "ask me about Joyce" agent.

const WALKED_KEY = "nomi-walked";
type Entry = { walk: boolean; settled: Segment | null };

// Decided once per page load, on the client (sessionStorage + the URL the
// visit started on). Cached in the module so every render agrees.
let entry: Entry | null = null;
function decideEntry(): Entry {
  if (entry) return entry;
  let walkedThisSession = false;
  try {
    walkedThisSession = sessionStorage.getItem(WALKED_KEY) === "1";
    sessionStorage.setItem(WALKED_KEY, "1");
  } catch {
    // Storage blocked (private mode etc.): she just walks on every homepage load.
  }
  const walk = window.location.pathname === "/" && !walkedThisSession;
  entry = { walk, settled: walk ? null : entrySegment(false, Math.random) };
  return entry;
}
const subscribeNever = () => () => {};
// null on the server and during hydration, then the client's decision — an
// explicit server snapshot keeps server and client markup in agreement.
const useEntry = () => useSyncExternalStore(subscribeNever, decideEntry, () => null);

// Not Framer's useReducedMotion: it returns null during server render and
// true in the browser, a hydration mismatch where React keeps the server's
// attributes — reduced-motion visitors got an invisible, frozen Nomi.
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}
const STILL: Segment = { mood: "sit", steps: sitRest(0) };
// No hover / click / chat for this long and she gets restless: makes her way
// to sitting, then gets up for a short stroll and back.
const RESTLESS_AFTER_MS = 60000;

export default function Nomi() {
  const reduceMotion = usePrefersReducedMotion();
  const start = useEntry();
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [segment, setSegment] = useState<Segment | null>(null); // null = still on the entry segment / walk
  const [index, setIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const chatOpenRef = useRef(false); // read when picking her next mood, without restarting timers
  const lastTouchRef = useRef(0); // last hover / click / chat; 0 = set on first timer tick
  const touched = useCallback(() => {
    lastTouchRef.current = Date.now();
  }, []);

  const walking = !reduceMotion && !!start?.walk && segment === null;
  const active: Segment | null = reduceMotion ? STILL : (segment ?? start?.settled ?? null);
  const step: Step | null = active ? active.steps[Math.min(index, active.steps.length - 1)] : null;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(([e]) => setTrackWidth(e.contentRect.width));
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || reduceMotion) return;
    const timer = setTimeout(() => {
      if (index + 1 < active.steps.length) {
        setIndex(index + 1);
        return;
      }
      const now = Date.now();
      if (!lastTouchRef.current) lastTouchRef.current = now;
      const restless = now - lastTouchRef.current > RESTLESS_AFTER_MS;
      // Keep the stroll on screen: walking left, the mirrored frame reaches
      // 87% of its width past her face.
      const restingFace = trackWidth - EYES_FROM_RIGHT;
      const maxStroll = restingFace - WALK_EYE_FRACTION * WALK_W - 8;
      const next = nextSegment(active.mood, Math.random, chatOpenRef.current, restless, maxStroll);
      if (next.strolls) lastTouchRef.current = now; // a stroll "uses up" the restlessness
      setSegment(next);
      setIndex(0);
    }, active.steps[index].ms);
    return () => clearTimeout(timer);
  }, [active, index, reduceMotion, trackWidth]);

  const openChat = useCallback(() => {
    touched();
    chatOpenRef.current = true;
    setChatOpen(true);
    // Asleep? Opening the chat wakes her up.
    if (step?.breathe) {
      setSegment(wakeUp(Math.random));
      setIndex(0);
    }
  }, [step, touched]);
  const closeChat = useCallback(() => {
    touched();
    chatOpenRef.current = false;
    setChatOpen(false);
  }, [touched]);

  const walkTo = trackWidth - WALK_END_RIGHT - WALK_W;
  const strolling = step?.walk ?? null;
  // A stroll step's face positions -> the walk frame's left edge.
  const restingFace = trackWidth - EYES_FROM_RIGHT;
  const frameLeft = (face: number, facingLeft: boolean) =>
    face - (facingLeft ? 1 - WALK_EYE_FRACTION : WALK_EYE_FRACTION) * WALK_W;
  const walk =
    trackWidth <= 0
      ? null
      : walking
        ? {
            id: "entry",
            from: walkTo - WALK_DISTANCE,
            to: walkTo,
            seconds: WALK_DISTANCE / PIXELS_PER_SECOND,
            onDone: () => {
              setSegment(entrySegment(true, Math.random));
              setIndex(0);
            },
          }
        : strolling && step
          ? {
              id: `stroll-${index}`,
              from: frameLeft(restingFace + strolling.from, strolling.to < strolling.from),
              to: frameLeft(restingFace + strolling.to, strolling.to < strolling.from),
              seconds: step.ms / 1000,
              facingLeft: strolling.to < strolling.from,
            }
          : null;
  const inCorner = !!step && !walking && !strolling;

  return (
    <>
      <div
        ref={trackRef}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[90]"
        style={{ height: TRACK_H }}
      >
        <div aria-hidden>
          <NomiSprite step={walking ? null : step} walk={walk} />
        </div>

        {/* Click / hover target over her in the corner (not while she's out
            on a stroll — she isn't there). */}
        {inCorner && step.layer !== "walk" && (
          <button
            type="button"
            onClick={openChat}
            onPointerEnter={touched}
            aria-label="Chat with Nomi about Joyce"
            className="pointer-events-auto absolute cursor-pointer rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            style={{ right: 24, bottom: 6, width: 170, height: HEAD_TOP[step.layer] + 12 }}
          />
        )}

        <div onPointerEnter={touched}>
          <NomiBubble
            enabled={inCorner && !chatOpen}
            asleep={!!step?.breathe}
            // Centered a little right of her face, so it sits over the corner.
            right={EYES_FROM_RIGHT - 14}
            bottom={GROUND_FROM_BOTTOM + (step && step.layer !== "walk" ? HEAD_TOP[step.layer] : 100) + 10}
            reduceMotion={reduceMotion}
            onOpen={openChat}
          />
        </div>
      </div>

      <NomiChat open={chatOpen} onClose={closeChat} />
    </>
  );
}
