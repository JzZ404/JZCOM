// Case study page content, keyed by project slug. Only projects with an
// entry here get the rich case-study template — everything else falls back
// to the plain summary layout in app/work/[slug]/page.tsx.
//
// Nest content below is transcribed from Joyce's research docs
// (public/images/nest/: Problem Statement, HMW, Competitive Audit,
// personas, journey maps). Her "Value Proposition" doc doesn't map to a
// section this template has, so it's intentionally left out rather than
// forced in. User flow, lo-fi/hi-fi prototypes, and design system assets
// haven't been supplied yet, so those stay PLACEHOLDER.

import type { CaseStudyLink } from "@/components/case-study/CaseStudyLinkIcons";

// Personas and journey maps are rendered as Joyce's actual research images
// (the full infographic already carries the name/bio/goals/pains), rather
// than text extracted out of them.
export type CaseStudyPersona = { name: string; image: string };
export type CaseStudyJourney = { persona: string; image: string };
// `value` is optional since not every finding anchors to a hard number — a
// ranking result gets a highlighted phrase instead, styled the same way as
// a numeral (bold, green) but smaller when `compact` is set, since a
// multi-word phrase at numeral size wraps to 3 lines and overpowers the row.
export type CaseStudyResearchStat = { value?: string; finding: string; compact?: boolean };

export type CaseStudy = {
  title: string; // short case-study header ("Nest") — independent of the Work card's full title
  subheading: string; // case-study-specific intro line — independent of the Work card's summary
  tldr: string;
  heroLabel: string;
  heroImage?: string;
  meta: { label: string; value: string }[];
  research: {
    intro: string;
    stats: CaseStudyResearchStat[];
    quotesTitle: string;
    quotes: string[];
    hypothesis: string;
  };
  personas: CaseStudyPersona[];
  journeys: CaseStudyJourney[];
  problem: string;
  goal: string;
  competitiveAuditImage: string;
  hmws: string[];
  userFlowImage: string;
  lofiImage: string;
  hifiImage: string;
  designSystemImage: string;
};

const PLACEHOLDER = "PLACEHOLDER — confirm with Joyce";

// A barebones case study: just the ordered section list (number/title/what
// goes there), rendered by CaseStudySkeletonPage with plain PlaceholderBlocks.
// Same shell as the built-out pages (Nest) — no bespoke section designs yet,
// those get built in one at a time once there's real content to shape them
// around, same as how Nest started out.
export type CaseStudySkeletonSection = {
  id: string;
  number: string;
  title: string;
  placeholder: string;
};

export type CaseStudySkeleton = {
  title: string;
  subheading: string;
  tldr: string;
  heroLabel: string;
  meta: { label: string; value: string }[];
  links?: CaseStudyLink[];
  sections: CaseStudySkeletonSection[];
};

export const caseStudySkeletons: Record<string, CaseStudySkeleton> = {};

// Alio has moved off the plain skeleton renderer — Research is now bespoke
// (real content below), while everything after it is still a placeholder,
// same incremental approach as Nest: convert one section at a time as real
// content arrives, renumbering the remaining skeleton sections to make room.
export type CaseStudyAlio = {
  title: string;
  subheading: string;
  tldr: string;
  heroLabel: string;
  heroVideo?: string;
  meta: { label: string; value: string }[];
  links?: CaseStudyLink[];
  whyWeBuiltThis: { image: string; story: string[] };
  researchResults: {
    stats: { value: string; finding: string }[];
    gapLabel: string;
    gap: string;
  };
  problem: string;
  competitive: {
    image: string;
    gapLabel: string;
    gap: string;
    positionLabel: string;
    position: string;
  };
  systemArchitecture: {
    image: string;
    blocks: { title: string; body: string }[];
  };
  technicalStackImage: string;
  prototypeDemo: {
    features: { title: string; body: string; media?: string[] }[];
  };
  businessModel: {
    // Each entry in topRow is one of the 5 canvas columns — either a single
    // tall block, or two stacked blocks (Key Activities/Resources,
    // Customer Relationships/Channels) sharing that column's width.
    topRow: { title: string; items: string[] }[][];
    bottomRow: { title: string; items: string[] }[];
  };
  aiRoadmap: {
    phases: { title: string; goal: string; steps: string[] }[];
  };
  responsibleAi: {
    rows: { risk: string; impact: string; safeguard: string }[];
  };
  sections: CaseStudySkeletonSection[];
};

export const alioCaseStudy: CaseStudyAlio = {
  title: "Alio",
  subheading:
    "On-device AI copilot connecting seniors, caregivers, and families through structured visit reports and symptom triage.",
  tldr: PLACEHOLDER,
  heroLabel: "hero screenshot — Alio",
  heroVideo: "/images/alio/alio-cover.mp4",
  meta: [
    { label: "Role", value: "AI PM, Frontend Designer & Engineer" },
    { label: "For", value: "Seniors, caregivers & families" },
    { label: "Team", value: "4 — Designers, AI Engineer, PM" },
    { label: "Timeline", value: "May 2026" },
  ],
  links: [
    {
      label: "GitHub",
      tooltip: "View the code",
      href: "https://github.com/JzZ404/Alio.git",
      icon: "github",
    },
    {
      label: "Kaggle write-up",
      tooltip: "Read the write-up",
      href: "https://www.kaggle.com/competitions/gemma-4-good-hackathon/writeups/new-writeup-1778799653202",
      icon: "kaggle",
    },
    {
      label: "Hugging Face model",
      tooltip: "Try the model",
      href: "https://huggingface.co/aarony630/alio-medical",
      icon: "huggingface",
    },
  ],
  whyWeBuiltThis: {
    image: "/images/alio/grandma.png",
    story: [
      "My grandmother's caregiver messaged my mom with a concern. It got lost in her inbox. A few days later, grandma fell and ended up in the hospital.",
      "That's the gap Alio was built to close.",
    ],
  },
  researchResults: {
    stats: [
      { value: "~59M", finding: "family caregivers in the US, up 40%+ in a decade" },
      {
        value: "1 in 3",
        finding: "patients 65+ bring family to appointments — the rest go alone",
      },
      {
        value: "#1",
        finding: 'confusion point: non-daily medication dosing ("once a week" becomes "every day")',
      },
    ],
    gapLabel: "The Gap",
    gap: "Home-based patients without formal caregivers have no one checking in between visits, no one catching a missed dose or a fall until it's too late. It's the same failure our research surfaced, information existing but never reaching the people who need it in time, and the gap Alio was built to close.",
  },
  problem:
    "Caregivers generate constant, valuable information, but almost none of it reaches family or becomes clinically useful. What does get through arrives unstructured, easy to miss, buried in a text or an inbox until it's too late. Alio needed to turn raw caregiver input into something actionable: interpreted labs, triage, structured logs, and visit reports, without adding more work for an already stretched caregiver.",
  competitive: {
    image: "/images/alio/competitive.png",
    gapLabel: "The Gap We Found",
    gap: "Coordination platforms solve who's involved but leave AI's role vague, still depending on someone checking an inbox. Platforms with real AI depth go deep on one function, companionship or medication, but none structure everyday caregiver input across the full picture.",
    positionLabel: "Alio's Position",
    position:
      "The only one combining structured, AI-generated caregiver-to-family communication with clinical-grade output (interpreted labs, triage, structured logs) in one lightweight tool, not a device, not a single-purpose reminder app.",
  },
  systemArchitecture: {
    image: "/images/alio/architecture.png",
    blocks: [
      {
        title: "Two Portals, One System",
        body: "Caregiver and Family are separate portals, connected by continuous shared updates.",
      },
      {
        title: "One Model, Both Sides",
        body: "The same AI core generates reports on the caregiver side, then translates and answers questions on the family side.",
      },
      {
        title: "Always in the Loop",
        body: "Reports and messages stay shared and up to date, so family is never catching up on what they missed.",
      },
    ],
  },
  technicalStackImage: "/images/alio/technical-stack.png",
  prototypeDemo: {
    features: [
      {
        title: "Real-Time Arrival & Status",
        body: "Caregivers keep patient details, address, and contact info on their portal. When a caregiver arrives, one tap marks the visit as started, and family receives an instant notification that care is underway.",
        media: ["/images/alio/feature1-caregiver.mp4", "/images/alio/feature1-family.mp4"],
      },
      {
        title: "Care Loop Messaging",
        body: "Family can message the caregiver directly with specific requests, everything kept as a permanent record. Multiple family members can join the same care loop, so a caregiver's response reaches everyone at once instead of getting relayed secondhand.",
        media: ["/images/alio/feature2-caregiver.mp4", "/images/alio/feature2-family.mp4"],
      },
      {
        title: "AI Visit Log & Post-Visit Report",
        body: "At the end of a visit, the caregiver records a voice memo. Alio's fine-tuned model turns that into a structured post-visit report, then flags anything that needs family's attention. Once the caregiver approves it, the report syncs to the family portal.",
        media: ["/images/alio/feature3.mp4"],
      },
      {
        title: "Family Q&A with AI",
        body: "After receiving a report, family can ask Alio follow-up questions directly. The model draws on the full patient history and logs to give specific, informed answers, general guidance and context, not diagnosis, especially useful when family has lost track of earlier details.",
        media: ["/images/alio/feature4.mp4"],
      },
    ],
  },
  businessModel: {
    topRow: [
      [
        {
          title: "Key Partners",
          items: [
            "Healthcare providers",
            "Insurance companies",
            "Pharmacies",
            "Cloud providers",
            "Senior communities",
          ],
        },
      ],
      [
        {
          title: "Key Activities",
          items: [
            "AI agent development",
            "Model training & evaluation",
            "Healthcare system integration",
            "User support operations",
          ],
        },
        {
          title: "Key Resources",
          items: ["Fine-tuned AI model", "Healthcare data", "Secure infrastructure"],
        },
      ],
      [
        {
          title: "Value Propositions",
          items: [
            "Real-time family visibility, no added caregiver burden",
            "Voice memo to AI-generated post-visit report",
            "Care loop messaging keeps every family member informed",
            "AI Q&A grounded in patient history",
          ],
        },
      ],
      [
        {
          title: "Customer Relationships",
          items: ["AI assistant support", "Guided onboarding", "Transparent AI disclosure"],
        },
        {
          title: "Channels",
          items: [
            "Mobile app",
            "In-app notifications",
            "Senior communities",
            "Healthcare partners",
            "Family referrals",
          ],
        },
      ],
      [
        {
          title: "Customer Segments",
          items: [
            "Older adults",
            "Family caregivers",
            "Family members",
            "Healthcare providers",
          ],
        },
      ],
    ],
    bottomRow: [
      {
        title: "Cost",
        items: [
          "AI inference cost",
          "Cloud infrastructure",
          "Compliance and security",
          "Engineering development",
          "Customer support",
        ],
      },
      {
        title: "Revenue Streams",
        items: ["User subscription", "Caregiver premium features", "Insurance partnerships"],
      },
    ],
  },
  aiRoadmap: {
    phases: [
      {
        title: "Phase 1 — MVP",
        goal: "Ship the core loop, caregiver to family",
        steps: [
          "Build caregiver and family portals",
          "Voice memo to AI-generated report",
          "Mandatory caregiver review before delivery",
        ],
      },
      {
        title: "Phase 2 — Near-Term",
        goal: "Make AI output something family can rely on",
        steps: ["Family Q&A grounded in patient history", "Push notifications for urgent flags"],
      },
      {
        title: "Phase 3 — Mid-Term",
        goal: "Support more complex care situations",
        steps: ["Multi-caregiver support", "Trend detection across visits"],
      },
      {
        title: "Phase 4 — Long-Term",
        goal: "Connect Alio to real clinical care",
        steps: ["Consent-based provider integration", "Deeper personalization over time"],
      },
    ],
  },
  responsibleAi: {
    rows: [
      {
        risk: "Sensitive health data exposure",
        impact:
          "Symptom, medication, and behavioral data leaving the device could expose vulnerable seniors to privacy breaches",
        safeguard: "On-device inference, data never leaves the device to generate a report",
      },
      {
        risk: "AI misdiagnosis or false reassurance",
        impact:
          "A wrong or overconfident AI read on a symptom could delay real care or cause unnecessary alarm",
        safeguard:
          "Flag-only outputs, the model surfaces concerns for a human to evaluate, never issues a diagnosis or standalone recommendation",
      },
      {
        risk: "Errors reaching family unchecked",
        impact:
          "A misread voice log or hallucinated detail could reach family as if it were verified fact",
        safeguard:
          "Mandatory caregiver review, no report reaches family without human approval first",
      },
      {
        risk: "Family over-relying on AI for medical guidance",
        impact:
          "Follow-up questions in the family portal could be mistaken for actual clinical advice",
        safeguard:
          "Scoped Q&A, responses stay general and history-grounded, explicitly not diagnostic",
      },
    ],
  },
  sections: [],
};

export const caseStudies: Record<string, CaseStudy> = {
  nest: {
    title: "Nest",
    subheading:
      "A gamified movement app that turns daily steps into a growing companion and social challenges, built around real research on why people stop working out.",
    tldr: PLACEHOLDER,
    heroLabel: "hero screenshot — Nest app",
    heroImage: "/images/nest/cover.png",
    meta: [
      { label: "Role", value: "UX Researcher, UI Designer" },
      { label: "For", value: "Urban, early-career professionals" },
      { label: "Team", value: "6 — Designers, Engineer, PM" },
      { label: "Timeline", value: "October 2025" },
    ],
    research: {
      intro:
        "We collected 146 survey responses and conducted 18 close interviews to understand what actually keeps people from staying active.",
      stats: [
        {
          value: "42%",
          finding: "said lack of time, not motivation, is what keeps them from staying active",
        },
        {
          value: "65%",
          finding: "would give a habit app just 5 to 30 minutes a day",
        },
        {
          value: "Daily Goals & Visible Progress",
          finding: "ranked highest as motivators — competing with others ranked lowest",
          compact: true,
        },
      ],
      quotesTitle: "What Motivates People",
      quotes: [
        "Daily goals, visible progress, and real rewards drove more motivation than competition ever did.",
        "People don't want a leaderboard. They want proof they're moving forward.",
      ],
      // Hypothesis Statement — the synthesis drawn from the findings above.
      hypothesis:
        "If we give users a low-effort daily habit loop that combines visible personal progress with optional, low-pressure social features, then they will sustain the habit longer than they have with past fitness or habit-tracking apps, regardless of whether their main barrier is time or motivation.",
    },
    personas: [
      { name: "Alex Chen", image: "/images/nest/persona-alex.png" },
      { name: "Marcus Reyes", image: "/images/nest/persona-marcus.png" },
    ],
    journeys: [
      { persona: "Alex Chen", image: "/images/nest/journey-alex.png" },
      { persona: "Marcus Reyes", image: "/images/nest/journey-marcus.png" },
    ],
    problem:
      "Urban, early-career professionals want to build a healthier movement habit, but limited time and inconsistent motivation get in the way. Their existing routines and attempts with fitness or habit-tracking apps have not been flexible or engaging enough to survive a busy, unpredictable schedule.",
    goal: "Our app will let users build a movement habit through small daily actions, visible progress systems, and optional social challenges, which will affect time-constrained and motivation-constrained users alike by meeting them at their specific point of friction rather than requiring a fixed routine or schedule. We will measure effectiveness by tracking habit retention past the 14-day mark, weekday engagement (independent of weekend plans), and participation in both solo and social features across user types.",
    competitiveAuditImage: "/images/nest/competitive-audit.png",
    hmws: [
      "How might we help users with limited time and energy integrate healthy habits into daily life? ⏳",
      "How might we balance competition and collaboration to fit different user motivations? 🤝",
      "How might we make rewards feel meaningful rather than superficial, so users feel genuine progress? 🌱",
    ],
    userFlowImage: "/images/nest/ia-user-flow.png",
    lofiImage: "/images/nest/lofi.png",
    hifiImage: "/images/nest/hifi.png",
    designSystemImage: "/images/nest/design-system.png",
  },
};

// A lighter case-study format for smaller/solo projects (Poopidex, FocusFarm)
// that don't warrant Alio/Nest's full research treatment: overview (handled
// by CaseStudyShell itself) + Why We Built This + Technical Stack + What's
// Next. Same shell/section components as Alio/Nest, just fewer of them.
export type CaseStudySimple = {
  title: string;
  subheading: string;
  tldr: string;
  heroLabel: string;
  heroImage?: string;
  meta: { label: string; value: string }[];
  links?: CaseStudyLink[];
  liveDemo?: { label: string; href: string };
  // `images` (plural) renders as a scattered photo layout instead of a
  // single rectangle — 4 photos become an irregular collage (Poopidex's
  // hiking/wildlife shots), 2 become a tilted side-by-side pair with an
  // optional `imageCaption` underneath. Falls back to the single `image`
  // (or a placeholder) otherwise.
  // Most entries are plain strings (regular muted body paragraph). A
  // `{ text, emphasis: true }` entry instead renders bold + primary-color
  // — an explicit opt-in per paragraph rather than always styling
  // whichever one happens to be last, so it doesn't silently restyle
  // every other project's story too.
  // Both whyWeBuiltThis and technicalStack are optional — a project without
  // one yet just skips that section (and its sidebar TOC entry) entirely
  // instead of showing an obvious empty PLACEHOLDER block.
  whyWeBuiltThis?: {
    image?: string;
    images?: string[];
    imageCaption?: string;
    story: (string | { text: string; emphasis: true })[];
  };
  // `categories` (grouped title + items) renders as a grid of labeled
  // blocks with real text hierarchy. Falls back to a flat bullet `items`
  // list when a project doesn't have grouped categories yet.
  technicalStack?: { image?: string; items?: string[]; categories?: { title: string; items: string[] }[] };
  whatsNext: string[];
};

export const poopidexCaseStudy: CaseStudySimple = {
  title: "Poopidex",
  subheading:
    "A vision AI app that turns a scat photo into a species ID and a collectible card, powered by a fine-tuned vision model and Claude Vision.",
  tldr: PLACEHOLDER,
  heroLabel: "hero screenshot — Poopidex",
  heroImage: "/images/poopidex/cover.png",
  meta: [
    { label: "Role", value: "Designer, Developer, and ML Engineer" },
    { label: "For", value: "Hikers, naturalists, wildlife trackers" },
    { label: "Team", value: "Solo Developer" },
    { label: "Timeline", value: "May 2026" },
  ],
  links: [
    {
      label: "GitHub",
      tooltip: "View on GitHub",
      href: "https://github.com/JzZ404/Poopidex",
      icon: "github",
    },
  ],
  liveDemo: { label: "Try Live Demo", href: "https://poopidex.vercel.app/" },
  whyWeBuiltThis: {
    images: [
      "/images/poopidex/deer.jpg",
      "/images/poopidex/marmot.jpg",
      "/images/poopidex/seals.jpg",
      "/images/poopidex/weasel.jpg",
    ],
    story: [
      "I'm always curious about the wildlife I run into on hikes. Sometimes it's something I can spot right away, sometimes it's just tracks or scat left behind, and I'm left wondering what animal was actually there. That curiosity is really where Poopidex started.",
      "Poopidex turns that into something you can use. Take a photo, get a real ID, start building a collection. There's a bigger point to it too. Enough sightings tracked over time start to look like real data, the kind that's normally hard to collect at any real scale, and could genuinely help with wildlife tracking.",
    ],
  },
  technicalStack: {
    categories: [
      {
        title: "Frontend",
        items: ["Next.js 16", "React 19", "Tailwind v4"],
      },
      {
        title: "Backend",
        items: ["Next.js API route", "Real-time streaming"],
      },
      {
        title: "AI Models",
        items: ["Claude Opus 4.7 — decider", "CLIP ViT-B/32 — fine-tuned", "Chain-of-thought reasoning"],
      },
      {
        title: "Training Data",
        items: ["AnimalClue (Shinoda et al., ICCV 2025)", "Feces-specific subset"],
      },
      {
        title: "Filtering",
        items: ["Size, habitat, contents", "Hard biological rules"],
      },
      {
        title: "Infrastructure",
        items: ["Vercel — frontend hosting", "Hugging Face Spaces — CLIP inference", "Local storage — no signup"],
      },
    ],
  },
  whatsNext: [
    "Expand past the initial 20 cataloged species",
    "Add community-verified sightings to strengthen the model",
    "Build the conservation map into a full citizen-science tool",
    "Explore broader indirect evidence types beyond feces — tracks, bones, feathers — since AnimalClue already covers them",
  ],
};

export const focusfarmCaseStudy: CaseStudySimple = {
  title: "FocusFarm",
  subheading: "A webcam-based focus app that rewards sustained attention with a growing pixel-art farm.",
  tldr: PLACEHOLDER,
  heroLabel: "hero screenshot — FocusFarm",
  heroImage: "/images/focusfarm/cover.png",
  meta: [
    { label: "Role", value: "Project Owner and Management" },
    { label: "For", value: "Students and professionals building focus habits" },
    { label: "Team", value: "Team of two, PM and Frontend" },
    { label: "Timeline", value: "June 2026" },
  ],
  links: [
    {
      label: "GitHub",
      tooltip: "View on GitHub",
      href: "https://github.com/JzZ404/FocusFarm",
      icon: "github",
    },
  ],
  liveDemo: { label: "Try Live Demo", href: "https://focus-farm-nine.vercel.app/" },
  whyWeBuiltThis: {
    images: ["/images/focusfarm/distracted1.jpg", "/images/focusfarm/distracted2.jpg"],
    imageCaption: "Caught mid-game of Plants vs. Zombies in class — exhibit A for why this app needed to exist.",
    story: [
      "I get distracted constantly when I'm supposed to be working, ADHD-adjacent, if not full ADHD. But somehow I can lock in for hours on a farm game where I'm just collecting stuff.",
      {
        text: "SO — why can't we just gamify boring work and study, and make it rewarding by the end of the day?",
        emphasis: true,
      },
    ],
  },
  technicalStack: {
    categories: [
      {
        title: "Frontend & Detection",
        items: ["React", "Next.js", "MediaPipe / TensorFlow.js", "Webcam-based attention tracking"],
      },
      {
        title: "Data & Progression",
        items: ["Coin economy", "Pixel farm rendering", "Local storage — MVP", "Supabase/Firebase — planned"],
      },
      {
        title: "Deployment & CI",
        items: ["Vercel — auto-deploy on push", "GitHub Actions — CI on every PR"],
      },
    ],
  },
  whatsNext: [
    "Unlockable farmland — new plots open up as focus hours accumulate",
    "Tiered animals and buildings gated behind farm level, not just coins",
    "A progression system with milestones, not just a flat shop",
    "Seasonal or rotating decorations to keep long-term use engaging",
    "Streak-based multipliers that reward consistency, not just single sessions",
    "A leaderboard, once there's a real progression system worth comparing",
  ],
};

export const drunkyCaseStudy: CaseStudySimple = {
  title: "Drunky",
  subheading:
    "A dual-arm robot that pours and mixes drinks, trained through imitation learning on 256 teleoperated demonstrations.",
  tldr: PLACEHOLDER,
  heroLabel: "hero screenshot — Drunky",
  heroImage: "/images/drunky/cover.jpg",
  meta: [
    { label: "Role", value: "Robotic Manipulation and HRI Design" },
    { label: "For", value: "Automated bartending and hospitality" },
    { label: "Team", value: "Team of three robotics students" },
    { label: "Timeline", value: "June 2026" },
  ],
  // No live demo for a physical robot — the repo stands in for it, same
  // embedded-in-the-hero treatment as Poopidex/FocusFarm's live demo link.
  liveDemo: { label: "View on GitHub", href: "https://github.com/tonyechen/drunky_ros" },
  whatsNext: [PLACEHOLDER],
};

export const pelicanCaseStudy: CaseStudySimple = {
  title: "PELICAN",
  subheading:
    "A pelican-inspired autonomous robot that collects waste using LiDAR-based perception and dual-axis visual servoing.",
  tldr: PLACEHOLDER,
  heroLabel: "hero screenshot — PELICAN",
  heroImage: "/images/pelican/cover.jpg",
  meta: [
    { label: "Role", value: "Robot Navigation, 3D Design and CAD" },
    { label: "For", value: "Autonomous waste collection in public spaces" },
    { label: "Team", value: "Team of two robotics students" },
    { label: "Timeline", value: "March 2026" },
  ],
  liveDemo: { label: "View on GitHub", href: "https://github.com/JzZ404/The_Pelican" },
  whatsNext: [PLACEHOLDER],
};
