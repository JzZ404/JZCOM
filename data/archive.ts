// Archive: grouped photo sets for older/miscellaneous projects. Each entry
// is a full shoot (2-3 photos) for one project, rendered as a single card
// with a title/caption instead of a flat single-image wall.

export type ArchiveProjectImage = { src: string; aspectRatio: number };

export type ArchiveProject = {
  id: string;
  title: string;
  caption: string; // one-phrase description
  // "stack": images shown one above another at full width, each at its own
  // natural aspect ratio — used for straightforward 2-photo sets.
  // "featured": first image full-width on top, the rest in a row below
  // sized proportionally to their own aspect ratios (wide photos get more
  // width, tall ones less) — used when a set mixes landscape and portrait.
  layout: "stack" | "featured";
  images: ArchiveProjectImage[];
  // Optional demo/process video — plays on hover over the card in place of
  // the static images, pauses and hides back to the images on mouse-leave
  // (or on click, while it's playing).
  video?: string;
  // Zoom on the foreground (object-contain, uncropped) video — 1 = exact
  // fit with full letterbox, >1 trims some of the blurred-fill margin by
  // zooming in slightly. Per-project since it depends on how far the
  // video's own aspect ratio is from the card's image area.
  videoScale?: number;
  // Playful per-card touch, opt-in — right now just "claw" (grab/grabbing
  // cursor + a press animation on click, nodding at the actual claw
  // machine in the photos instead of a generic hover state).
  interactive?: "claw";
  // Pins this card to a specific desktop masonry column (0-2) instead of
  // letting the height-balancing algorithm place it — set when Joyce wants
  // an exact reading order in a column. Leave unset to let a card fall
  // wherever balances the columns.
  column?: 0 | 1 | 2;
};

export const archiveProjects: ArchiveProject[] = [
  {
    id: "ouroboros",
    title: "Ouroboros",
    caption: "",
    layout: "stack",
    images: [
      { src: "/images/archive/ouroborous1.jpg", aspectRatio: 6000 / 4000 },
      { src: "/images/archive/ouroborous2.jpg", aspectRatio: 5360 / 3644 },
    ],
    video: "/images/archive/ourobous.mov",
    videoScale: 1.3,
    column: 0,
  },
  {
    id: "momento",
    title: "Momento",
    caption: "",
    layout: "featured",
    images: [
      { src: "/images/archive/momento.jpg", aspectRatio: 6000 / 4000 },
      { src: "/images/archive/momento2.jpg", aspectRatio: 6000 / 4000 },
      { src: "/images/archive/momento3.jpg", aspectRatio: 4000 / 6000 },
    ],
    column: 1,
  },
  {
    id: "safetrack",
    title: "SafeTrack",
    caption: "",
    layout: "stack",
    images: [{ src: "/images/archive/safetrack-poster.png", aspectRatio: 1728 / 2592 }],
    column: 2,
  },
  {
    id: "helport",
    title: "Helport AI Agent",
    caption: "",
    layout: "stack",
    images: [{ src: "/images/archive/helport.png", aspectRatio: 1736 / 1068 }],
    column: 0,
  },
  {
    id: "claw",
    title: "Claw",
    caption: "",
    layout: "stack",
    images: [
      { src: "/images/archive/claw1.png", aspectRatio: 1108 / 1446 },
      { src: "/images/archive/claw2.png", aspectRatio: 1060 / 1474 },
    ],
    interactive: "claw",
    column: 1,
  },
  {
    id: "godzilla",
    title: "G-Spikes",
    caption: "",
    layout: "stack",
    images: [
      { src: "/images/archive/godzilla.JPG", aspectRatio: 2811 / 3828 },
      { src: "/images/archive/godzilla2.JPG", aspectRatio: 4032 / 3024 },
    ],
    video: "/images/archive/godzilla-video.mov",
    column: 2,
  },
  {
    id: "branding",
    title: "Branding",
    caption: "",
    layout: "stack",
    images: [
      { src: "/images/archive/branding.jpg", aspectRatio: 4032 / 3024 },
      { src: "/images/archive/branding2.jpg", aspectRatio: 5712 / 4284 },
    ],
    column: 0,
  },
  {
    id: "sticker-ucsd",
    title: "Branding",
    caption: "",
    layout: "stack",
    images: [{ src: "/images/archive/stickerucsd.png", aspectRatio: 1402 / 1122 }],
    column: 1,
  },
  {
    id: "octodesk",
    title: "Octopus Desk",
    caption: "",
    layout: "stack",
    images: [{ src: "/images/archive/octodesk.png", aspectRatio: 2380 / 3570 }],
    column: 2,
  },
  {
    id: "grubhub",
    title: "Grubhub Merchant Redesign",
    caption: "",
    layout: "stack",
    images: [{ src: "/images/archive/grubhub.png", aspectRatio: 1924 / 1080 }],
    column: 0,
  },
];
