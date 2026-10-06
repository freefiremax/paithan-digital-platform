# Tech Stack — Paithan Digital Platform

Defaults below lean on tools you've already used (Next.js, Node/Prisma/PostgreSQL, Gemini API) so Claude Code has a consistent, familiar stack to build against. Swap anything you or your senior disagree with — flag it and I'll update `architecture.md` to match.

## Frontend
- **Next.js 14+ (App Router, TypeScript)** — single app serves public site + admin panel + API routes
- **Tailwind CSS** — fast, consistent styling; pairs well with a dark-mode-capable, official-but-modern theme
- **shadcn/ui** — accessible component primitives (cards, dialogs, forms) so the admin panel and public UI don't need everything built from scratch
- **next-intl** — only if Marathi/English bilingual support is confirmed as in-scope (see PRD open questions); otherwise skip for v1

## Backend
- **Next.js Route Handlers** — no separate Express server needed; keeps one deployable app
- **Prisma ORM** — matches your SilverTrack stack, type-safe DB access
- **Zod** — request/response validation shared between forms and API handlers

## Database
- **PostgreSQL** with the **pgvector** extension (for chatbot embeddings)
- **Neon** as the hosting provider — serverless Postgres, free tier, pgvector supported

## Auth
- **NextAuth.js (Auth.js)** — credentials provider (email/password) for admin login; role field on `AdminUser` drives RBAC (super-admin / editor / ward-editor)

## Maps
- **Leaflet.js + OpenStreetMap tiles** — free, no API key, sufficient for ward boundaries and tourist-place markers
- (Google Maps API only if the senior specifically wants Street View/Directions later — adds billing requirement)

## 3D Models
- **`<model-viewer>`** (Google's web component) for glTF/GLB rotate-and-zoom viewing — minimal code, good performance on modest devices
- Upgrade path: `react-three-fiber` / Three.js if custom hotspot interactions are needed in a later phase

## AI Chatbot
- **Gemini API** (you already have experience with this) for both:
  - embeddings (content ingestion + query embedding)
  - generation (answering from retrieved context)
- Retrieval via **pgvector** cosine similarity — no separate vector DB service needed

## Asset Storage
- **Cloudinary** — image + 3D model file hosting, free tier, direct upload from the admin panel, automatic image optimization/resizing for mobile

## Hosting & Deployment
- **Vercel** — frontend + API routes, native Next.js support, free tier
- **Neon** — database
- **Cloudinary** — assets
- **GitHub** — source control (matches your existing GitHub setup); GitHub Actions for lint/typecheck on PRs, Vercel auto-deploy on merge to `main`

## Dev Tooling
- **ESLint + Prettier** — consistent formatting for Claude Code to follow
- **TypeScript strict mode**
- Optional, if time allows: **Vitest** for unit tests on the RAG helpers and API validation logic (not a v1 blocker given the weekend design-direction deadline)

## Why this stack (not something heavier)
- Everything here runs fine on your current dev machine (Linux Mint, modest specs) — no local GPU/DB server required, since Postgres/vector search/AI all run via free-tier hosted services
- Single Next.js app = one deploy target, simpler for a solo-plus-senior-review workflow
- Every piece (Gemini, GitHub, Vercel-style deploys) overlaps with tools you've already used, so Claude Code has less unfamiliar surface area to get wrong

## Open Decisions
- Confirm Marathi/English bilingual requirement before wiring up `next-intl` (adds routing complexity if added later)
- Confirm whether the senior wants Google Maps instead of Leaflet/OSM for brand-familiarity reasons
- Confirm real vs placeholder data source for wards/representatives/development works before writing seed scripts
