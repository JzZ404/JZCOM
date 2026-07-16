# Portfolio Website — Project Handoff

## Context
Rebuilding a personal portfolio site (currently at the-jz.com, hosted on Squarespace) as a vibe-coded, custom-built site. Domain will be migrated to the new site later — build and deploy to a Vercel preview URL first, do not worry about domain/DNS yet.

## Who this is for
Joyce (Jiayi) Zhou — design technologist working across UX/product design, AI, and robotics. Currently finishing an MS in Technology Innovation (Robotics concentration) at UW GIX. Background also includes a triple-credential undergrad in Interdisciplinary Computing & Arts, Communication, and Cognitive Science from UC San Diego.

Positioning: not "UX designer" or "engineer" — specifically a **design technologist** who works across the full stack of an idea, from interface to physical system.

## Tech Stack (explicit — do not substitute)
- Next.js
- Tailwind CSS
- Framer Motion (for animation/transitions)
- Deployed on Vercel

## Pre-Build Prep (do this before writing any code)
Before scaffolding anything, confirm the following are resolved. Several are marked "not yet provided" below — do not invent these; ask Joyce or use an obvious placeholder clearly marked as such (e.g. `[PLACEHOLDER — confirm with Joyce]`) rather than guessing real values.

1. **Design tokens.** Confirm color palette (hex values), type scale (font family + sizes for h1/h2/body/caption), and spacing scale before building any component. Do not default to generic Tailwind palette/typography without asking — this is a personal brand site, not a template.
2. **Content data file first.** Build `data/projects.ts` (or equivalent) with the full project list, even with placeholder summaries, before building the components that render it. This lets the grid/filter logic get built and tested against real structure immediately.
3. **Image assets.** Confirm what images exist for each project (screenshots, renders, photos) and where they'll live (`/public/images/...`). None have been supplied yet — see gaps below.
4. **Routing decision.** Confirm project detail pages are separate routes (`/work/[slug]`) vs. expandable sections on one page before building either — this affects the whole information architecture, not just one component.
5. **Responsive/accessibility baseline.** Confirm minimum support target (e.g. mobile-first, WCAG AA contrast) before styling, not after.

## Build Order
1. Scaffold project structure locally (routing, layout shell, nav, empty component stubs)
2. Deploy early to a Vercel preview URL, even with placeholder content
3. Build section by section: Hero → Project grid → Project detail template → About → Contact
4. Commit after each working section (meaningful commit messages, not "update")
5. Content and copy come from this doc — do not invent placeholder copy for sections listed below
6. Polish pass last: motion, responsive edge cases, image optimization, accessibility

## Code Organization Requirements (important — non-negotiable)
Joyce needs to retrieve and edit this codebase herself long after this session ends. Structure everything for future editability:
- **Separate content from components.** All project data (title, tags, summary, role, links, images) should live in a single structured data file (e.g. `data/projects.ts` or `.json`), not hardcoded inline in JSX. Adding/editing/removing a project should mean editing one data file, not touching component code.
- **Clear, consistent naming.** Component files named for what they render (`ProjectCard.tsx`, `HeroSection.tsx`, `ProjectGrid.tsx`), not generic (`Component1.tsx`).
- **Comment non-obvious logic**, especially filtering/tagging logic and any animation sequencing.
- **One component, one responsibility.** Avoid mega-components that mix layout, data-fetching, and content.
- **Consistent folder structure**: `/components`, `/data`, `/app` (or `/pages`), `/public` for images.
- **Design tokens centralized** in the Tailwind config (colors, type scale, spacing) rather than scattered arbitrary values in class names, so a future palette/type change is a config edit, not a find-and-replace.

## Site Structure
- Home (Hero + featured projects + intro to full grid)
- Work (flat grid of all projects, filterable by tag — see below)
- Individual project/case study pages /archive (or expandable sections — TBD, lean toward separate routes for clean URLs)
- About
- Contact

**No categories carried over from the old site.** The old site used UI/UX Product, Interactive Media, Game Dev/VR, and Graphic Design as top-level categories — these are dropped. New approach is a flat grid with filterable tags instead (see Categorization below). Graphic design gallery is excluded entirely from the new site.

## Categorization Approach
Flat project grid, each project tagged with 1-3 tags from this set:
- Robotics
- AI/ML
- UX/Product
- Interactive/Creative
- PM

Visitors filter by tag if they want; default view is the full grid, led by a featured row.

**Featured row (3-5 projects): not yet finalized — pick before building the featured section.**

## Full Project List
*(Compiled from live site + additions; final go/no-go on "sketchy"/weaker ones is Joyce's call, not yet finalized)*

Navia AI Copilot, SafeTrack, Nest, Helport AI Copilot, Alignerfy, CourseCrush, Interactive Smart Scale Kiosk, Grubhub Merchant Redesign, "MOMENTO", Ouroboros, "The Art of Safety", G-Spikes, Lost in Self, Interactive Jellyfish, Urban Forager, Urban Tail, Animal Farm, Alice in Wonderland, Drunky, PELICAN, VoiceGuard, Alio, Autonomous Maze Finder/TurtleBot4, SysDiagno, UCSD web UX internship project, Poopidex, FocusFarm

## Attribution Notes (critical — do not misrepresent role)
- **Poopidex**: Joyce is the sole developer. Concept originated with a collaborator (Aaron), but all development is hers. Frame as her build.
- **FocusFarm**: Joyce is Project Owner/PM only — NOT the developer. Murphy Wei is the developer. Case study copy must reflect PM work (requirements, phased check-ins, success criteria), not a coding credit. Use verbs like "directed," "defined," "managed" — not "built."
- **Alio**: Joyce did product strategy, frontend, pipeline coordination. Aaron Yeung (ML Lead) did model fine-tuning — do not claim ML work as Joyce's.
- General rule: every case study's role framing must match what Joyce actually did. When in doubt, ask her rather than assume.



## Design System Reference (not a strict system to follow — reference points only)
Not adopting Material Design or Apple HIG wholesale (both are OS/app design languages, not web portfolio conventions). Useful ideas to borrow:
- Token-based theming (name colors/spacing by role, not appearance) — apply this via Tailwind config
- Clear type scale with a small number of defined sizes, not ad hoc values
- Adaptive/semantic color naming if light + dark mode is in scope

**Design tokens (color palette, type scale, spacing scale) — not yet finalized.** Do not invent a full palette; use minimal defaults until Joyce confirms real values (from Figma or direct hex/font choices).


