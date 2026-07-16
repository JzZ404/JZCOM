// PLACEHOLDER DATA — Archive is an image-only waterfall wall, no case study
// pages. Joyce will insert real images later; aspectRatio drives the
// masonry sizing until then (real images will use their natural ratio).

export type ArchiveItem = {
  id: string;
  image: string; // path under /public/images/archive/...
  aspectRatio: number; // width / height, used for placeholder block sizing
};

export const archiveItems: ArchiveItem[] = [
  { id: "archive-1", image: "/images/archive/placeholder-1.jpg", aspectRatio: 1 },
  { id: "archive-2", image: "/images/archive/placeholder-2.jpg", aspectRatio: 0.75 },
  { id: "archive-3", image: "/images/archive/placeholder-3.jpg", aspectRatio: 1.5 },
  { id: "archive-4", image: "/images/archive/placeholder-4.jpg", aspectRatio: 0.6 },
  { id: "archive-5", image: "/images/archive/placeholder-5.jpg", aspectRatio: 1.2 },
  { id: "archive-6", image: "/images/archive/placeholder-6.jpg", aspectRatio: 0.9 },
  { id: "archive-7", image: "/images/archive/placeholder-7.jpg", aspectRatio: 1.8 },
  { id: "archive-8", image: "/images/archive/placeholder-8.jpg", aspectRatio: 0.7 },
  { id: "archive-9", image: "/images/archive/placeholder-9.jpg", aspectRatio: 1.1 },
];
