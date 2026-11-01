"use client";

import { useEffect, useRef, useState } from "react";

type Side = "left" | "right";
type Clip = { src: string; side?: Side; caption?: string; playbackRate?: number };

const SIDES: Side[] = ["left", "right"];
// Clips without a side alternate left, right, left, …
const sideOf = (clip: Clip, i: number): Side => clip.side ?? (i % 2 ? "right" : "left");

// Two columns of clips that take turns, playing in list order and looping.
// The playing column is bright; the other waits dimmed, frozen on the last
// frame it showed (or its first clip's first frame, before its first turn).
// A column with several clips switches to its next one when its turn comes.
// Every clip stays mounted (stacked, only one visible per column) so a switch
// never flashes an empty frame while the next clip loads.
export default function AlternatingVideos({ media }: { media: Clip[] }) {
  const [active, setActive] = useState(0);
  // The clip each column is showing: the one playing, or the last one it played.
  const [shown, setShown] = useState<Record<Side, number>>(() => ({
    left: media.findIndex((clip, i) => sideOf(clip, i) === "left"),
    right: media.findIndex((clip, i) => sideOf(clip, i) === "right"),
  }));
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) {
        video.currentTime = 0;
        // The default rate too: loading a source resets the speed to it.
        video.defaultPlaybackRate = video.playbackRate = media[i].playbackRate ?? 1;
        video.play().catch(() => {}); // autoplay can be blocked (e.g. low-power mode)
      } else {
        video.pause();
        // A hidden clip rewinds now, so it shows its first frame (not its old
        // last frame) the moment its turn comes.
        if (i !== shown[sideOf(media[i], i)]) video.currentTime = 0;
      }
    });
  }, [active, shown, media]);

  const playNext = (i: number) => {
    const next = (i + 1) % media.length;
    setActive(next);
    setShown((s) => ({ ...s, [sideOf(media[next], next)]: next }));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {SIDES.map((side) => {
        const playing = sideOf(media[active], active) === side;
        const caption = media[shown[side]]?.caption;
        return (
          <figure
            key={side}
            // Hovering the playing column pauses it (mouse only, so a tap on a
            // phone doesn't freeze it); a paused clip never ends, so the turn
            // can't pass to the other column mid-hover.
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse" && playing) videos.current[active]?.pause();
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse" && playing) videos.current[active]?.play().catch(() => {});
            }}
          >
            <div className={`grid transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-40"}`}>
              {media.map((clip, i) =>
                sideOf(clip, i) !== side ? null : (
                  <video
                    key={clip.src}
                    ref={(el) => {
                      videos.current[i] = el;
                    }}
                    src={clip.src}
                    muted
                    playsInline
                    preload="auto"
                    onEnded={() => playNext(i)}
                    className={`col-start-1 row-start-1 w-full rounded-[1.4rem] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)] ${
                      i === shown[side] ? "" : "invisible"
                    }`}
                  />
                ),
              )}
            </div>
            {caption && (
              <figcaption className="mt-3 text-center text-[14px] leading-relaxed text-[var(--color-muted)] italic">
                {caption}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}
