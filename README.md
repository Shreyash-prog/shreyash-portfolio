# Shreyash Kalal — Portfolio

A production-quality, single-page portfolio for an AI &amp; Data Engineer. Built with
Vite + React + TypeScript, Tailwind CSS, Framer Motion, and a canvas-rendered,
d3-force constellation of the tech stack.

## Stack

- **Vite + React + TypeScript** — fully static, no backend
- **Tailwind CSS** — theming via CSS variables, `class`-based dark mode
- **Framer Motion** — section reveals + hover lift (respects `prefers-reduced-motion`)
- **d3-force + canvas** — the interactive "Tech Stack" constellation
- **lucide-react** — icons
- **@fontsource** — Space Grotesk (headings), Inter (body), JetBrains Mono (labels)

## Run locally

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
```

## Build &amp; preview

```bash
npm run build    # type-check + bundle to dist/
npm run preview  # serve the production build locally
```

The production build outputs to `dist/`.

## Deploy to Vercel

This repo is Vercel-ready (`vercel.json` sets framework `vite`, build `npm run build`,
output `dist`).

- **Dashboard:** import the repo — Vercel auto-detects the settings.
- **CLI:** `npm i -g vercel && vercel` (or `vercel --prod`).

## Editing content

All copy, links, experience, projects, and the tech graph live in a single typed file:

```
src/data/content.ts
```

Change names, descriptions, button URLs, chips, and the constellation nodes/edges there —
no component edits required.

## Assets to add

These paths are referenced by the site; drop the files in to make them resolve.
Missing project screenshots are tolerated — those slots hide gracefully.

- **Résumés**
  - `public/resume/Shreyash-Kalal-AI-Engineer.pdf`
  - `public/resume/Shreyash-Kalal-Data-Engineer.pdf`
- **Project screenshots** (per card, in order)
  - `public/images/projects/ai-usage-scoring/` → `01-candidate.png`, `02-dashboard.png`, `03-scores.png`
  - `public/images/projects/tidewater/` → `01-findings.png`, `02-finding-detail.png`, `03-rules.png`
  - `public/images/projects/team-ai-memory/` → `01-artifacts.png`, `02-detail.png`, `03-search.png`

## Accessibility &amp; performance notes

- System theme preference is the default; the user's choice persists in `localStorage`.
- The constellation pauses when off-screen or when the tab is hidden, caps FPS/DPR, and
  falls back to a static, grouped chip layout on mobile and under reduced-motion.
- A screen-reader-only list enumerates the full stack by category.
- Semantic landmarks, keyboard navigation, visible focus rings, and a skip link are included.

## Project structure

```
src/
  data/content.ts        # single source of truth for all content
  hooks/                 # theme, active-section, media-query, image-probe helpers
  components/
    Nav, Hero, About, Experience,
    Projects, ProjectCard, Lightbox,
    TechConstellation, ConstellationCanvas, StaticStack,
    Contact, Footer, ThemeToggle, ResumeMenu, ...
public/
  favicon.svg, og-image.svg
  resume/                # drop résumé PDFs here
  images/projects/<id>/  # drop screenshots here
```
