"use client";

import { motion } from "framer-motion";
import type { ArchiveProject } from "@/data/archive";

// Hover-to-play video preview — temporarily disabled, bring back later.
// (Extracted live top/bottom edge colors from the playing frame to fill
// the object-contain letterbox instead of blurring a second copy of the
// video underneath. Logic worked, just parking the whole feature for now.)
//
// function averageRgb(data: Uint8ClampedArray): string {
//   let r = 0;
//   let g = 0;
//   let b = 0;
//   const count = data.length / 4;
//   for (let i = 0; i < data.length; i += 4) {
//     r += data[i];
//     g += data[i + 1];
//     b += data[i + 2];
//   }
//   return `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`;
// }

export default function ArchiveProjectCard({
  project,
  className = "",
  delay = 0,
}: {
  project: ArchiveProject;
  className?: string;
  delay?: number;
}) {
  const [first, ...rest] = project.images;
  // const fgVideoRef = useRef<HTMLVideoElement>(null);
  // // Offscreen, never appended to the DOM — just used to read pixels off
  // // the currently-playing frame.
  // const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const rafRef = useRef<number | null>(null);
  // const [playing, setPlaying] = useState(false);
  // // A click "pins" the video playing even after the mouse leaves — a second
  // // click un-pins it and stops it right away, back to the default image.
  // const [locked, setLocked] = useState(false);
  // // Colors sampled live off the video's own top/bottom edge pixels, used to
  // // fill the letterbox gap so it blends by matching color instead of by
  // // blurring a second copy of the video underneath.
  // const [edgeColors, setEdgeColors] = useState<{ top: string; bottom: string } | null>(null);
  //
  // function sampleEdgeColors() {
  //   const video = fgVideoRef.current;
  //   if (video && video.videoWidth > 0) {
  //     if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
  //     const canvas = canvasRef.current;
  //     const w = 24;
  //     const h = 24;
  //     canvas.width = w;
  //     canvas.height = h;
  //     const ctx = canvas.getContext("2d");
  //     if (ctx) {
  //       ctx.drawImage(video, 0, 0, w, h);
  //       const top = ctx.getImageData(0, 0, w, 2).data;
  //       const bottom = ctx.getImageData(0, h - 2, w, 2).data;
  //       setEdgeColors({ top: averageRgb(top), bottom: averageRgb(bottom) });
  //     }
  //   }
  //   rafRef.current = requestAnimationFrame(sampleEdgeColors);
  // }
  //
  // function startPlaying() {
  //   if (!project.video) return;
  //   setPlaying(true);
  //   fgVideoRef.current?.play();
  //   if (rafRef.current === null) rafRef.current = requestAnimationFrame(sampleEdgeColors);
  // }
  //
  // function stopPlaying() {
  //   if (!project.video) return;
  //   setPlaying(false);
  //   fgVideoRef.current?.pause();
  //   if (fgVideoRef.current) fgVideoRef.current.currentTime = 0;
  //   if (rafRef.current !== null) {
  //     cancelAnimationFrame(rafRef.current);
  //     rafRef.current = null;
  //   }
  //   setEdgeColors(null);
  // }
  //
  // function handleEnter() {
  //   startPlaying();
  // }
  //
  // // Plain hover (never clicked) stops on mouse-out same as before — a
  // // locked card ignores this and keeps playing regardless of the mouse.
  // function handleLeave() {
  //   if (locked) return;
  //   stopPlaying();
  // }
  //
  // function handleClick() {
  //   if (!project.video) return;
  //   if (locked) {
  //     setLocked(false);
  //     stopPlaying();
  //   } else {
  //     setLocked(true);
  //     if (!playing) startPlaying();
  //   }
  // }

  const isClaw = project.interactive === "claw";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      // "Interactive claw machine": grab cursor invites the hover, whileTap
      // gives a little squeeze-down-and-release like actually pressing the
      // machine's button — a small, real nod to the theme instead of a
      // generic hover state.
      whileTap={isClaw ? { scale: 0.96 } : undefined}
      className={`overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.12),0px_1px_2px_0px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.30),0px_4px_8px_3px_rgba(0,0,0,0.15)] ${isClaw ? "cursor-grab active:cursor-grabbing" : ""} ${className}`}
      // onMouseEnter={handleEnter}
      // onMouseLeave={handleLeave}
      // onClick={handleClick}
    >
      <div className="relative">
        {project.layout === "stack" ? (
          <div className="flex flex-col gap-0.5">
            {project.images.map((img, i) => (
              <img
                key={img.src}
                src={img.src}
                alt={`${project.title} — photo ${i + 1}`}
                style={{ aspectRatio: img.aspectRatio }}
                className="w-full object-cover"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            <img
              src={first.src}
              alt={`${project.title} — photo 1`}
              style={{ aspectRatio: first.aspectRatio }}
              className="w-full object-cover"
            />
            {/* Even split regardless of each photo's own aspect ratio — cropped
                to match via object-cover, so the row reads as one balanced
                line instead of one photo dominating over a squeezed other. */}
            <div className="flex h-48 gap-0.5 sm:h-56">
              {rest.map((img, i) => (
                <div key={img.src} className="flex-1 overflow-hidden">
                  <img
                    src={img.src}
                    alt={`${project.title} — photo ${i + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hover-to-play video preview — temporarily disabled, bring back later.
        {project.video && (
          <div
            className={`absolute inset-0 overflow-hidden transition-opacity duration-150 ${
              playing ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={{
              background: edgeColors
                ? `linear-gradient(to bottom, ${edgeColors.top}, transparent 25%, transparent 75%, ${edgeColors.bottom})`
                : undefined,
            }}
          >
            <video
              ref={fgVideoRef}
              src={project.video}
              muted
              loop
              playsInline
              style={project.videoScale ? { transform: `scale(${project.videoScale})` } : undefined}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        )}
        */}
      </div>
      <div className="p-5">
        <h3 className="font-serif text-[19px] font-bold text-[var(--color-fg)]">{project.title}</h3>
        {project.caption && (
          <p className="mt-1 text-[14px] text-[var(--color-muted)]">{project.caption}</p>
        )}
      </div>
    </motion.div>
  );
}
