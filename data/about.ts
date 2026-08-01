// About page content. Structure confirmed with Joyce (2026-07-31); real
// copy/photos/links come from her directly — nothing here is invented.
// Fill in one section at a time as she supplies content, same pattern as
// the case study pages.

const PLACEHOLDER = "PLACEHOLDER — confirm with Joyce";

export type AboutData = {
  photo: string; // path under /public/images/about/
  introHeader: string;
  introBody: string;
  // Phrases within `introBody` to render bold, in the order they should be
  // matched — same "call out the key terms" treatment as the hero headline.
  introHighlights: string[];
  education: { degree: string; school: string; timeframe?: string }[];
  experience: { role: string; org: string; timeframe: string; location: string }[];
  leadership: { role: string; org: string; timeframe: string }[];
  certifications: string[];
  competitions: { name: string; result?: string; role: string; host: string; timeframe: string }[];
  socials: { label: string; href: string }[];
  hobbies: { label: string; image?: string; zoom?: number }[];
};

export const about: AboutData = {
  photo: "/images/about/photo.jpg",
  introHeader:
    "Hi, I'm Joyce Zhou, a design technologist with 3+ years in tech, moving across UX, product design, AI, and robotics.",
  introBody:
    "What grounds me is UX and product design, but I never stopped at the interface. Over the past couple of years I've pushed further into AI and robotics, not to collect skills, but to understand what's actually happening underneath, the logic behind an AI's response, the mechanics behind a robot's movement. I'm currently finishing a Master's in Technology Innovation at the University of Washington, focused on robotics, still chasing that same question.",
  introHighlights: ["UX and product design", "AI and robotics", "Master's in Technology Innovation"],
  education: [
    {
      degree: "MS in Technology Innovation, Robotics Concentration",
      school: "University of Washington, GIX",
      timeframe: "Expected Mar 2027",
    },
    {
      degree: "BA in Interdisciplinary Computing and the Arts",
      school: "University of California San Diego",
    },
    {
      degree: "BA in Communication",
      school: "University of California San Diego",
    },
    {
      degree: "Minor in Cognitive Science, Speculative Design",
      school: "University of California San Diego",
    },
  ],
  experience: [
    {
      role: "Design Technologist",
      org: "Aithreus",
      timeframe: "Jun 2026 – Sep 2026",
      location: "Las Vegas",
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
      name: "Helport AI Competition",
      result: "3rd Place",
      role: "UX/UI and AI Product Design",
      host: "Helport AI",
      timeframe: "2025",
    },
    {
      name: "Digital Puppet Competition",
      result: "1st Place",
      role: "Interactive Media Designer",
      host: "UC San Diego",
      timeframe: "2024",
    },
    {
      name: "Raccoon Simulator Competition",
      result: "2nd Place",
      role: "Game Designer",
      host: "UC San Diego",
      timeframe: "2024",
    },
    {
      name: "Stanford Center on Longevity Design Challenge",
      role: "UI/UX Designer, Nest",
      host: "Stanford University",
      timeframe: "2025 – 2026",
    },
    {
      name: "Gemma 4 Good Hackathon",
      role: "Co-founder, Product Manager and Frontend",
      host: "Google and Kaggle",
      timeframe: "Apr 2026 – May 2026",
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
