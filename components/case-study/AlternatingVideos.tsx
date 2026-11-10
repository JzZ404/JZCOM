"use client";

import { useEffect, useRef, useState } from "react";
import { usePdfMode } from "./PdfMode";

type Side = "left" | "right";
type Clip = { src: string; side?: Side; caption?: string; playbackRate?: number; pdfStill?: string };

const SIDES: Side[] = ["left", "right"];
// Clips without a side alternate left, right, left, …
const sideOf = (clip: Clip, i: number): Side => clip.side ?? (i % 2 ? "right" : "left");

// In the PDF portfolio: sized so a demo feature fits a page with room to
// spare
export const PDF_VIDEO = "mx-auto max-h-[600px] w-auto!";

// Two columns of clips that take turns, playing in list order and looping.
// The playing column is bright; the other waits dimmed, frozen on the last
// frame it showed (or its first clip's first frame, before its first turn).
// A column with several clips switches to its next one when its turn comes.
// Every clip stays mounted (stacked, only one visible per column) so a switch
// never flashes an empty frame while the next clip loads.
export default function AlternatingVideos({ media }: { media: Clip[] }) {
  // The PDF portfolio shows both columns at full strength, at print size
  const pdf = usePdfMode();
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
            <div className={`grid transition-opacity duration-500 ${playing || pdf ? "opacity-100" : "opacity-40"}`}>
              {/* In the PDF, a column whose first clip has a still shows that
                  instead, at the video's exact size (its width and height
                  attributes give it the video's 620x1360 shape) */}
              {pdf && media[shown[side]]?.pdfStill ? (
                <img
                  src={media[shown[side]].pdfStill}
                  alt=""
                  width={620}
                  height={1360}
                  className={`col-start-1 row-start-1 w-full rounded-[1.4rem] object-cover shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)] ${PDF_VIDEO}`}
                />
              ) : media.map((clip, i) =>
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
                    } ${pdf ? PDF_VIDEO : ""}`}
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
