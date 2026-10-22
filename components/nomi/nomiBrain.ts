// What Nomi does next — pure functions (no React), so the behavior can be
// read and checked on its own. Nomi.tsx plays whatever these return.
//
// Moods: sit, lie, sleep. She moves between them at random, but only along
// these edges, because those are the transitions there's art for:
//   sit <-> lie   (lie-down / the lie-down backwards)
//   lie <-> sleep (eyes closing / eyes opening)
// Sitting to sleeping always goes through lying first.

import { FALL_ASLEEP, GET_UP, LIE_DOWN, LIE_IDLE, SIT_DOWN, SIT_FIDGETS, sitRest, sleepHold, stroll, WAKE_UP, type Step } from "./clips";

export type Mood = "sit" | "lie" | "sleep";
export type Segment = { mood: Mood; steps: Step[]; strolls?: boolean };
type Rng = () => number;

const NEXT: Record<Mood, Mood[]> = { sit: ["lie"], lie: ["sit", "sleep"], sleep: ["lie"] };
const DWELL_MS: Record<Mood, [min: number, max: number]> = {
  sit: [15000, 30000],
  lie: [20000, 40000],
  sleep: [30000, 60000],
};
const SIT_REST_MS: [number, number] = [1400, 2600];

const between = ([min, max]: [number, number], rng: Rng) => min + rng() * (max - min);
const total = (steps: Step[]) => steps.reduce((sum, s) => sum + s.ms, 0);

// One stretch of a mood, roughly DWELL_MS long.
export function dwell(mood: Mood, rng: Rng): Step[] {
  const target = between(DWELL_MS[mood], rng);
  if (mood === "sleep") return sleepHold(target);
  if (mood === "lie") {
    const loops = Math.max(1, Math.round(target / total(LIE_IDLE)));
    return Array.from({ length: loops }, () => LIE_IDLE).flat();
  }
  // Sitting: rest, random fidget (never the same one twice in a row), rest...
  const steps: Step[] = [];
  const names = Object.keys(SIT_FIDGETS) as (keyof typeof SIT_FIDGETS)[];
  let last: string | null = null;
  while (total(steps) < target) {
    const options = names.filter((n) => n !== last);
    const pick = options[Math.floor(rng() * options.length)];
    steps.push(...sitRest(between(SIT_REST_MS, rng)), ...SIT_FIDGETS[pick]);
    last = pick;
  }
  steps.push(...sitRest(between(SIT_REST_MS, rng)));
  return steps;
}

function transition(from: Mood, to: Mood): Step[] {
  if (from === "sit" && to === "lie") return LIE_DOWN;
  if (from === "lie" && to === "sit") return GET_UP;
  if (from === "lie" && to === "sleep") return FALL_ASLEEP;
  if (from === "sleep" && to === "lie") return WAKE_UP;
  throw new Error(`No transition from ${from} to ${to}`);
}

// First thing she does on this page load: walk in and sit down, or (no walk)
// already be in the corner in a random mood.
export function entrySegment(walked: boolean, rng: Rng): Segment {
  if (walked) return { mood: "sit", steps: [...SIT_DOWN, ...dwell("sit", rng)] };
  const moods: Mood[] = ["sit", "lie", "sleep"];
  const mood = moods[Math.floor(rng() * moods.length)];
  return { mood, steps: dwell(mood, rng) };
}

const STROLL_PX: [number, number] = [90, 160];
const RESTLESS_PAUSE_MS: [number, number] = [2500, 4500];

// After a stretch ends: move to a random neighbouring mood — unless she's
// "talking" (chat open), in which case she stays put. Restless (nobody has
// touched her in a while): head for sitting with only short pauses, then get
// up and stroll a little way and back. `maxStroll` keeps the stroll on screen.
export function nextSegment(current: Mood, rng: Rng, chatOpen: boolean, restless = false, maxStroll = Infinity): Segment {
  if (chatOpen) return { mood: current, steps: dwell(current, rng) };
  if (restless) {
    const pause = (mood: Mood) => (mood === "sit" ? sitRest(between(RESTLESS_PAUSE_MS, rng)) : dwell(mood, rng).slice(0, 1));
    if (current === "sit") {
      const distance = Math.min(between(STROLL_PX, rng), maxStroll);
      if (distance >= 40) return { mood: "sit", steps: [...stroll(Math.round(distance)), ...dwell("sit", rng)], strolls: true };
    } else {
      const toward: Mood = current === "sleep" ? "lie" : "sit";
      return { mood: toward, steps: [...transition(current, toward), ...pause(toward)] };
    }
  }
  const options = NEXT[current];
  const mood = options[Math.floor(rng() * options.length)];
  return { mood, steps: [...transition(current, mood), ...dwell(mood, rng)] };
}

// Opening the chat while she's asleep wakes her up (to lying).
export function wakeUp(rng: Rng): Segment {
  return { mood: "lie", steps: [...WAKE_UP, ...dwell("lie", rng)] };
}
