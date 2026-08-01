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
    "An AI elder care platform connecting seniors, caregivers, and families through visit summaries, medication reminders, and symptom checks.",
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
