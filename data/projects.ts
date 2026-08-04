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
    chips: ["AI/ML", "UX/UI", "Product Strategy", "Hackathon"],
    summary:
      "On-device AI copilot connecting seniors, caregivers, and families through structured visit reports and symptom triage.",
    role: "Product strategy, frontend, and pipeline coordination — ML fine-tuning by Aaron Yeung.",
    coverImage: "/images/alio/cover.png",
  },
  {
    slug: "nest",
    title: "Nest: Gamified Habit-Building App for Real Life",
    tags: ["UX/Product"],
    category: "ux",
    chips: ["UX Research", "Interaction Design", "Product Design"],
    summary:
      "A gamified movement app that turns daily steps into a growing companion and social challenges, built around research on why people stop working out.",
    role: "UX research and product design.",
    coverImage: "/images/nest/cover.png",
  },
  {
    slug: "poopidex",
    title: "Poopidex: AI-Powered Scat Identification",
    tags: ["AI/ML"],
    category: "ai",
    chips: ["Computer Vision", "ML", "Fine-Tuned Vision Model"],
    summary:
      "A vision AI app that turns a scat photo into a species ID and a collectible card, powered by a fine-tuned vision model and Claude Vision.",
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
    chips: ["Project Owner", "Product Management", "Attention Detection"],
    summary:
      "A webcam-based focus app that rewards sustained attention with a growing pixel-art farm.",
    role: "Project Owner / PM — directed and defined the product (developed by Murphy Wei).",
    coverImage: "/images/focusfarm/cover.png",
    coverPosition: "left center",
    links: [{ label: "Live Demo", href: "https://focus-farm-nine.vercel.app/" }],
  },
  {
    slug: "drunky",
    title: "Drunky: Bimanual Bartending Robot",
    tags: ["Robotics"],
    category: "robotics",
    chips: ["Imitation Learning", "Bimanual Manipulation", "Computer Vision"],
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
    chips: ["Autonomous Systems", "Robot Navigation", "Computer Vision"],
    summary:
      "A pelican-inspired autonomous robot that collects waste using LiDAR-based perception and YOLO camera detection.",
    role: "Autonomous systems, perception, and controls.",
    coverImage: "/images/pelican/cover.jpg",
  },
];
