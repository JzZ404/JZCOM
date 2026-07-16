# JZCOM — Portfolio Site

Personal portfolio for Joyce (Jiayi) Zhou — design technologist (UX/product, AI, robotics). Full context: [PORTFOLIO_HANDOFF.md](PORTFOLIO_HANDOFF.md). Ship checklist: [PORTFOLIO_TODO.md](PORTFOLIO_TODO.md).

## Tech stack (do not substitute)
Next.js · Tailwind CSS · Framer Motion · deployed on Vercel.

## Non-negotiable code organization
- **Content out of components.** All project data lives in `data/projects.ts` (or `.json`) — title, tags, summary, role, links, images. Adding/editing a project = editing one data file, never JSX.
- **Descriptive component names.** `ProjectCard.tsx`, `HeroSection.tsx` — never `Component1.tsx`.
- **Comment non-obvious logic only** — filtering/tagging logic, animation sequencing.
- **One component, one responsibility.** No mega-components mixing layout + data-fetching + content.
- **Folder structure:** `/components`, `/data`, `/app`, `/public` for images.
- **Design tokens live in `tailwind.config`** (colors, type scale, spacing) — never scattered arbitrary values in class names.

## Design tokens — not finalized
Do not invent a real palette/type scale. If you must scaffold before Joyce confirms values (from Figma or direct hex/font choices), use an obviously-fake placeholder token set and mark every placeholder value with a comment: `// PLACEHOLDER — confirm with Joyce`.

## Site IA
Home (hero + featured + intro to grid) · Work (flat grid, filterable) · Project detail pages at `/work/[slug]` · About · Contact. No categories carried over from the old site (UI/UX Product, Interactive Media, Game Dev/VR, Graphic Design are dropped — graphic design gallery excluded entirely).

## Tags (1–3 per project)
Robotics · AI/ML · UX/Product · Interactive/Creative · PM

## Attribution — critical, do not misrepresent role
- **Poopidex** — Joyce is sole developer (concept co-originated with Aaron, but all dev is hers). Frame as her build.
- **FocusFarm** — Joyce was Project Owner/PM only, NOT the developer (Murphy Wei built it). Copy must use "directed / defined / managed," never "built."
- **Alio** — Joyce did product strategy, frontend, pipeline coordination. Aaron Yeung did ML fine-tuning — never claim ML work as Joyce's.
- General rule: every case study's role framing must match what Joyce actually did. When unsure, ask her — don't assume.

## Copy source
Content and copy come from `PORTFOLIO_HANDOFF.md` and Joyce directly. Never invent placeholder copy for sections the handoff explicitly withholds (e.g. featured row picks, final go/no-go project list).
