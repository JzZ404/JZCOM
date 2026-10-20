// About page content. Structure confirmed with Joyce (2026-07-31); real
// copy/photos/links come from her directly — nothing here is invented.
// Fill in one section at a time as she supplies content, same pattern as
// the case study pages.

const PLACEHOLDER = "PLACEHOLDER — confirm with Joyce";

export type AboutData = {
  photo: string; // path under /public/images/about/
  // Explicit per-line array, not one string — Joyce wants a specific,
  // guaranteed break between "...in tech," and "moving across...", not
  // whatever CSS happens to wrap at a given width. Rendered with a <br/>
  // between entries (see SquiggleHighlight in AboutPageContent.tsx).
  introHeaderLines: string[];
  // Phrases within introHeaderLines to draw a squiggle under + zoom on
  // hover — separate from introHighlights below, which uses a plainer
  // bold treatment on the body paragraph instead.
  introHeaderHighlights: string[];
  introBody: string;
  // Phrases within `introBody` to render bold, in the order they should be
  // matched — same "call out the key terms" treatment as the hero headline.
  introHighlights: string[];
  // logo is per-entry (not per-school) on purpose — three of these four
  // entries share the same UCSD seal, and the About page groups
  // consecutive entries with the same `school` under one shown logo (see
  // AboutPageContent.tsx), dropping the divider between them.
  education: { degree: string; school: string; timeframe?: string; logo?: string }[];
  experience: { role: string; org: string; timeframe: string; location: string }[];
  leadership: { role: string; org: string; timeframe: string }[];
  certifications: string[];
  competitions: { name: string; result?: string; role: string; host: string; timeframe: string }[];
  socials: { label: string; href: string }[];
  hobbies: { label: string; image?: string; zoom?: number; objectPosition?: string }[];
};

export const about: AboutData = {
  photo: "/images/about/photo.jpg",
  introHeaderLines: [
    "Hi, I'm Joyce Zhou 🍳,",
    "a design technologist with 3+ years in tech,",
    "moving across UX, product design, AI, and robotics.",
  ],
  introHeaderHighlights: ["design technologist", "3+ years", "UX", "product design", "AI", "robotics"],
  introBody:
    "What grounds me is UX and product design, but I never stopped at the interface. Over the past couple of years I've pushed further into AI and robotics, not to collect skills, but to understand what's actually happening underneath, the logic behind an AI's response, the mechanics behind a robot's movement. I'm currently finishing a Master's in Technology Innovation at the University of Washington, focused on robotics, still chasing that same question.",
  introHighlights: ["UX and product design", "AI and robotics", "Master's in Technology Innovation"],
  education: [
    {
      degree: "MS in Technology Innovation, Robotics Concentration",
      school: "University of Washington, GIX",
      timeframe: "Expected Mar 2027",
      logo: "/images/about/logos/uw.webp",
    },
    {
      degree: "BA in Interdisciplinary Computing and the Arts",
      school: "University of California San Diego",
      logo: "/images/about/logos/ucsd.png",
    },
    {
      degree: "BA in Communication",
      school: "University of California San Diego",
      logo: "/images/about/logos/ucsd.png",
    },
    {
      degree: "Minor in Cognitive Science, Speculative Design",
      school: "University of California San Diego",
      logo: "/images/about/logos/ucsd.png",
    },
  ],
  experience: [
    {
      role: "Design Technologist (Contract)",
      org: "DLAB Scientific Inc.",
      timeframe: "Nov 2025 – Feb 2026",
      location: "Riverside, CA",
    },
    {
      role: "UI/UX Intern",
      org: "UCSD Department of Communication",
      timeframe: "Sep 2024 – May 2025",
      location: "San Diego",
    },
    {
      role: "Product Designer",
      org: "SysDiagno Biotech",
      timeframe: "Jun 2023 – Sep 2023",
      location: "Nanjing, China",
    },
    {
      role: "Content Intern",
      org: "Shine Global",
      timeframe: "Aug 2024 – Jan 2025",
      location: "Remote",
    },
  ],
  leadership: [
    {
      role: "Event Assistant",
      org: "GIX, University of Washington",
      timeframe: "Sep 2026 – Mar 2027",
    },
    {
      role: "Design Chair",
      org: "IEEE UCSD",
      timeframe: "May 2023 – Jun 2024",
    },
  ],
  certifications: [
    "Google Project Management Certificate",
    "Google UX Design Certificate",
    "Stanford Supervised Machine Learning Certificate",
  ],
  competitions: [
    {
      name: "Helport AI Innovation Competition",
      result: "3rd Place",
      role: "UX/UI and AI Product Design",
      host: "Helport AI",
      timeframe: "2025",
    },
    {
      // Not actually a "competition" — an IEEE UCSD quarterly project.
      // Host corrected to match (was "UC San Diego").
      name: "IEEE Quarterly Project",
      result: "1st Place",
      role: "Interactive Media Designer",
      host: "IEEE UCSD",
      timeframe: "2024",
    },
    {
      name: "VGDC Unity Game Competition",
      result: "2nd Place",
      role: "Game Designer",
      host: "UC San Diego",
      timeframe: "2024",
    },
    {
      name: "Stanford Center on Longevity Design Challenge",
      role: "UI/UX Designer, Nest",
      host: "Stanford University",
      timeframe: "Sep 2025 – Dec 2025",
    },
    {
      name: "Google Gemma 4 Good Hackathon",
      role: "Co-founder, Product Manager and Frontend",
      host: "Google and Kaggle",
      timeframe: "Mar 2026 – May 2026",
    },
  ],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/joycez0317/" },
    { label: "Instagram", href: "https://www.instagram.com/zhou_uy/" },
    { label: "GitHub", href: "https://github.com/JzZ404" },
    { label: "Email", href: "mailto:jiayiz54@uw.edu" },
  ],
  hobbies: [
    {
      label: "The one that never pays rent and can't do anything about it. 🐱",
      image: "/images/about/cat.png",
    },
    { label: "Five countries down, more on the way. ✈️", image: "/images/about/travel.JPG" },
    {
      label: "Huge sci-fi fan, MCU especially, Loki most of all. 🐍",
      image: "/images/about/loki.jpg",
    },
    // The 4th of 7 hobbies — dead center. GradientCarousel defaults its
    // active index to the middle of whatever array it's given, so this is
    // what visitors see first when the gallery loads, same photo as
    // `about.photo` above.
    // objectPosition nudges the crop up a little — at a square aspect
    // ratio the default centered crop clipped the top of her head.
    { label: "Hi, I'm Joyce! 👋", image: "/images/about/photo.jpg", objectPosition: "center 30%" },
    {
      label: "Love nature and photography. 📸",
      image: "/images/about/IMG_6522.JPG",
      zoom: 1.3,
    },
    { label: "Food and boba are what keeps me alive. 🧋", image: "/images/about/boba.JPG" },
    {
      label: "And yes, a proper cocktail always has my attention. 🍸",
      image: "/images/about/cocktail.jpg",
    },
  ],
};
