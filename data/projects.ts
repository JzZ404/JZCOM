// Real case-study copy from Joyce (2026-07-16). Cover images point at
// /public/images/<slug>/cover.jpg — drop the real file in that project's
// folder (see /public/images/<slug>/) and it'll pick up automatically.

export type ProjectTag =
  | "Robotics"
  | "AI/ML"
  | "UX/Product"
  | "Interactive/Creative"
  | "PM";

export type ProjectCategory = "ux" | "ai" | "robotics";

export type Project = {
  slug: string;
  title: string;
  tags: ProjectTag[]; // 1-3 tags, canonical site taxonomy
  category: ProjectCategory; // which Work grid section this belongs to
  chips: string[]; // freeform skills/topics shown on the card, richer than `tags`
  summary: string;
  role: string; // what Joyce actually did — see CLAUDE.md attribution rules
  coverImage: string; // path under /public/images/...
  coverPosition?: string; // CSS object-position — for covers whose focal point isn't centered
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "alio",
    title: "Alio: AI Copilot for Elder Care",
    tags: ["AI/ML", "UX/Product"],
    category: "ux",
    chips: ["AI/ML", "Product Strategy", "Healthcare", "Hackathon"],
    summary:
      "An AI elder care platform connecting seniors, caregivers, and families through visit summaries, medication reminders, and symptom checks.",
    role: "Product strategy, frontend, and pipeline coordination — ML fine-tuning by Aaron Yeung.",
    coverImage: "/images/alio/cover.png",
  },
  {
    slug: "nest",
    title: "Nest: A Gamified Habit-Building App for Real Life",
    tags: ["UX/Product"],
    category: "ux",
    chips: ["UX Research", "Product Design", "Habit Gamification"],
    summary:
      "A mobile app that turns small daily movement into a growing companion and social challenges, designed around research showing time scarcity and low follow-through as the two biggest barriers to staying active.",
    role: "UX research and product design.",
    coverImage: "/images/nest/cover.png",
  },
  {
    slug: "poopidex",
    title: "Poopidex: AI-Powered Scat Identification",
    tags: ["AI/ML"],
    category: "ai",
    chips: ["Computer Vision", "Next.js", "YOLO + Claude Vision"],
    summary:
      "A hybrid vision app that identifies wild animal species from scat photos using YOLO, CLIP, and Claude Vision together.",
    role: "Sole developer (concept co-originated with Aaron).",
    coverImage: "/images/poopidex/cover.png",
    coverPosition: "left center",
    links: [{ label: "Live Demo", href: "https://poopidex.vercel.app/" }],
  },
  {
    slug: "focusfarm",
    title: "FocusFarm: Gamified Focus Tracker",
    tags: ["PM", "UX/Product"],
    category: "ai",
    chips: ["Project Owner", "Product Management"],
    summary:
      "A webcam-based focus app that rewards sustained attention with a growing pixel-art farm.",
    role: "Project Owner / PM — directed and defined the product (developed by Murphy Wei).",
    coverImage: "/images/focusfarm/cover.png",
    coverPosition: "left center",
    links: [{ label: "Live Demo", href: "https://focus-farm-nine.vercel.app/" }],
  },
  {
    slug: "drunky",
    title: "Drunky: A Bimanual Bartending Robot",
    tags: ["Robotics"],
    category: "robotics",
    chips: ["Imitation Learning", "Bimanual Manipulation"],
    summary:
      "A dual-arm robot that pours and mixes drinks, trained through imitation learning on 256 teleoperated demonstrations.",
    role: "Imitation learning and bimanual manipulation.",
    coverImage: "/images/drunky/cover.jpg",
  },
  {
    slug: "pelican",
    title: "PELICAN: Autonomous Waste Collection Robot",
    tags: ["Robotics"],
    category: "robotics",
    chips: ["Autonomous Systems", "LiDAR", "Visual Servoing"],
    summary:
      "A pelican-inspired autonomous robot that collects waste using LiDAR-based perception and dual-axis visual servoing.",
    role: "Autonomous systems, perception, and controls.",
    coverImage: "/images/pelican/cover.jpg",
  },
];
