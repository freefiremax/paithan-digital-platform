# Paithan Digital Platform (पैठण डिजिटल प्लॅटफॉर्म)

### Chatbot knowledge upgrade — 2026-10-14

The chatbot now has a build-refreshed public website index instead of relying only on fixed keyword FAQs. It ingests public page copy/translations, approved public data, navigation and all ward profiles, and retrieves multiple relevant chunks with typo and multilingual matching. The exact `cluture of paithan` query has a grounded local culture answer in English, Marathi and Hindi. Requests have bounded timeouts, request IDs, safe source attribution and controlled history; reset/duplicate-submit races and floating-panel history loss are fixed.

Run `npm run chatbot:ingest` to refresh, `npm run chatbot:evaluate` for offline checks, and `npm run chatbot:verify-live` for explicit real-provider checks. Admins can use `/{locale}/admin/chatbot` for source metadata, diagnostics and protected Neon publishing. No new credentials are required for the bundled index. Semantic embeddings and live web search are not enabled automatically.

See [the architecture, validation and activation guide](docs/chatbot-architecture.md) for source coverage, settings, database safeguards, current limitations and build status.

Production verification: code commit `6fec173` passed GitHub CI and Vercel deployment, and the exact culture prompt works on the public live API. Inspection through the owning Vercel browser session found that the Paithan project has `GEMINI_CHAT_MODEL` and `GEMINI_EMBED_MODEL`, but no `GEMINI_API_KEY`. A Production/Secret form with that key name is prepared for the owner to enter and save the Google AI key. Redeploy after saving and verify a general question. The CLI is authenticated to a different account; further repair can use the owning browser session. General provider failures return HTTP 503 with a retry option; local knowledge answers continue to work.

Floating chat has a separate responsive language-control row for English, Marathi and Hindi. Language selection changes the reply language, title and composer. `lib/chatbot-heritage.ts` provides concise multilingual Sant Eknath, mandir and wada overviews and resolves explicit topic follow-ups using bounded conversation history; precise/current questions continue through grounded model retrieval. This is application knowledge coverage, not hosted-model fine-tuning or universal offline knowledge.

Chatbot regression coverage now includes personal introductions (`I am Prasanna`), acknowledgements, locality aliases, and Jayakwadi/Jaikwadi bird queries with singular/plural spelling normalization. These use local conversational or knowledge responses when the API is unavailable. The live fallback-model connectivity check returned HTTP 200 on 2026-10-14; deployed credentials and quota must also be valid. These are application knowledge and response controls, not a fine-tuned Google model.

Chatbot locality coverage: place-name aliases (including Islamapur/Islampur and Devanagari forms) are recognized locally. Overview questions work without Gemini, and all ward profiles feed the retrieval dataset. Detailed unverified locality facts are never invented. General questions still require an available model API; no prompt or dataset can guarantee answers during a provider outage. A model-specific 429 now tries the next configured fallback.

Ward content maintenance: `lib/ward-profiles.ts` supplies locality-specific descriptions and a shared image mapping for directory cards and detail pages. Photos without confirmed locality provenance are labeled illustrative. Public ward project summaries include only records marked `VERIFIED`; sample projects do not count as completed or ongoing work. Boundary assignments still require council confirmation.

> **Official Municipal, Heritage & Tourism Digital Platform for Paithan**  
> *Chhatrapati Sambhajinagar District, Maharashtra, India*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.1-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Government_Proprietary-gold?style=flat-square)](#)

---

## 📌 Executive Summary

The **Paithan Digital Platform** is an integrated civic, cultural, and tourism platform designed for the ancient town of Paithan (*ancient Pratishthana*). It bridges municipal administration, historical preservation, tourism promotion, and AI-driven citizen assistance into a unified digital ecosystem.

Built to comply with Maharashtra municipal portal standards (governed by information architecture reference `nppmodinagar.in`), the system features strict data governance, verified historical facts, interactive 3D antiquities exploration, e-procurement ledgers, and a bilingual AI Assistant powered by Google Gemini.

---

## 🏛️ System Pillars & Core Features

### 1. Civic Administration (`/nagar-parishad`)
* **Public Representatives Hierarchy:** Verified profiles for sitting MLA (Vilas Sandipanrao Bhumre), MP (Sandipanrao Bhumre), Chief Officer (Santosh Dagdu Agle), and Ward Nagar Sevaks.
* **17 Wards Directory & Map (`/nagar-parishad/ward-map`):** Ward boundary maps, demographic breakdowns, active development works count, and corporator contact ledgers.
* **Capital Development Works Registry (`/nagar-parishad/development-works`):** Interactive filterable ledger tracking civic infrastructure projects (AMRUT 2.0 Sewerage, PMAY Housing, Paithani Handloom Weavers Park, Solid Waste Processing) by status and budget.
* **Notifications & Tenders (`/nagar-parishad/notifications`):** Categorized public announcements, e-tenders, scheme updates, and Nath Shashti yatra advisories.

### 2. Heritage & Historical Preservation (`/heritage`)
* **Dr. Balasaheb Patil Archaeological Museum (`/heritage/museum`):** Virtual gallery of Satavahana punch-marked coins, Roman carnelian beads, Modi script Rajpatra, antique Paithani weaves, and ivory dice.
* **Interactive 3D Artifact Viewer (`/heritage/3d-models`):** 360° rotational WebGL 3D simulator featuring wireframe mode, lighting toggles, and archival accession data.
* **2,200-Year Chronological History (`/heritage/history`):** Detailed timeline spanning Satavahana Era (King Hala's *Gaha Sattasai*), Yadava Era, Sant Eknath Bhakti Movement, Maratha Empire, and Modern Paithan.
* **Cultural Traditions (`/heritage/cultural-heritage`):** Deep dives into GI-certified Paithani Silk Weaving (GI Tag #84), Sant Eknath Maharaj Samadhi & Nath Shashti, and Sant Dnyaneshwar Apegaon connection.

### 3. Tourism & Exploration (`/tourism`)
* **Jayakwadi Engineering Guide (`/tourism/jayakwadi`):** Specifications for Nath Sagar Dam (9,998m length, 102.7 TMC storage, 27 radial flood gates, Dnyaneshwar Udyan promenade).
* **Nath Sagar Bird Sanctuary (`/tourism/nath-sagar`):** Guide to 341 km² wetland sanctuary housing 200+ bird species including migratory Flamingos and Siberian Cranes.
* **Interactive Tourist Map (`/tourism/map`):** GPS-indexed interactive map plotting 10 verified landmarks with one-click Google Maps navigation routes.
* **Curated Travel Itineraries (`/tourism/routes`):** Step-by-step 1-day itineraries tailored for pilgrims, history enthusiasts, and nature lovers.

### 4. AI Citizen Assistant (`/chatbot`)
* **Multilingual Intelligence:** English, Marathi, and Hindi support for Paithan civic questions and general-purpose assistance.
* **Two Trust Modes:** Paithan-specific answers use the local verified knowledge base and show relevant source links; unrelated questions use Gemini's general knowledge without attaching misleading municipal citations.
* **Controlled Output:** Structured Gemini responses, concise-answer instructions, bounded conversation history, response length limits, and normalized plain-text formatting keep replies focused and readable.
* **Resilient Delivery:** Gemini 3.8 Flash with a 3.5 Flash-Lite fallback and a local Paithan fallback keep core municipal help available when the API key, quota, or upstream service is unavailable.
* **Stable Chat View:** New messages scroll only inside the conversation panel, keeping the chatbot section fixed in the browser viewport.
* **Focused Retrieval:** Conversational questions bypass civic search, town questions favor town records, and each local answer uses one strongest source. When Gemini is unavailable, short facts are selected from the matching record; unknown prices and general facts are never invented.
* **Integration Audit:** The latest checked Neon connection was healthy and contained live portal records. Gemini verification must use the current configured models; see the agent change log for the tested result and deployment status.
* **Rate-Limit Resilience:** The chatbot uses Upstash Redis through its REST pipeline. If that service is briefly unavailable, a bounded in-memory limiter protects the request path while the service recovers.
* **Ward Detail Flow:** Every map pin and ward directory card now opens its own `/nagar-parishad/ward-map/[ward]` page with a place profile, visible local-work status, a civic-information panel, and its supplied ward image as a full-width responsive hero.
* **Ward Map Navigation:** Ward links preserve the active language route (`/en`, `/mr`, or `/hi`), and the directory now includes a visual map lead-in plus image-backed ward cards so the map page has a clear starting point.
* **Map Pin Alignment:** Interactive hit areas are aligned to the numbered marker tips in the 1316×1195 source map, so the clickable points stay on the colored markers as the map scales.
* **White Point Anchors:** The numbered marker tips are anchored to the map's small white town points, including Nandalgaon, so the colored pin and underlying location mark stay together.
* **Sant Eknath Mandir Image:** Ward 2 uses the supplied Sant Eknath Mandir photograph rather than the generic upload-order image.
* **Floating Assistant:** The floating chatbot now fits the available viewport on mobile and desktop, keeps its panel inside the screen, supports Escape-to-close, and moves focus to the close control when opened.

### 5. Admin Governance CMS (`/admin`)
* **Role-Based Access Control (RBAC):** `SUPER_ADMIN`, `EDITOR`, and `WARD_EDITOR` tiers.
* **Tenders & Works Management:** Real-time CRUD interface for uploading official notices, updating progress %, and managing ward budgets with audit logging.

---

## 🎨 Visual Identity & Design System

The platform adopts the **Royal Pratishthana Civic** design direction (Option A):
* **Deep Maharashtra Navy (`#0C1E3C` / `#071224`):** Represents civic authority, security, and institutional governance.
* **Paithani Zari Gold (`#B8860B` / `#D97706`):** Highlights Paithan's 2,000-year-old silk weaving heritage and spiritual grandeur.
* **Institutional Slate Canvas (`#F8FAFC`):** Ensures high accessibility, contrast, and effortless readability for civic documents.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16.3.5 (App Router, Turbopack) | Modern SSR/SSG server infrastructure |
| **UI Library** | React 19.2.8 + TypeScript | Component architecture |
| **Styling** | Tailwind CSS v4 | Responsive utility styling system |
| **Icons** | Lucide React | Clean, scalable icon set |
| **Database ORM** | Prisma 6.4.1 | Type-safe database client and migrations |
| **Database** | PostgreSQL (Neon serverless ready) | Relational store for municipal & heritage entities |
| **Authentication** | NextAuth.js (v5 Beta) | Secure JWT-based session management |
| **Password Hashing** | Argon2 / Native Web Crypto | Enterprise password security |
| **AI Model** | Google Gemini API + Local RAG | Grounded citizen AI assistant |
| **Testing** | Vitest 3.0.0 | Unit and integration test runner |

---

## 📂 Codebase Architecture

```
Paithan-digital-platform/
├── app/                        # Next.js App Router Structure
│   ├── (public)/               # Public-facing application routes
│   │   ├── nagar-parishad/     # Civic administration & ward pages
│   │   ├── heritage/           # Museum, 3D models & historical pages
│   │   ├── tourism/            # Jayakwadi, bird sanctuary & map pages
│   │   └── chatbot/            # Dedicated AI assistant interface
│   ├── admin/                  # Governance CMS & Login portal
│   └── api/                    # RESTful Route Handlers & AI endpoint
├── components/                 # Reusable UI Components
│   ├── layout/                 # Header, Footer, NoticeTicker, MobileNav
│   ├── chatbot/                # AI Chatbot Floating Widget & Interface
│   └── ui/                     # Cards, badges, buttons, modal primitives
├── lib/                        # Core Utilities & Data Layer
│   ├── mock-data.ts            # Verified Paithan municipal & heritage dataset
│   ├── auth/                   # NextAuth configuration & guard helpers
│   ├── db.ts                   # Prisma client singleton instance
│   └── rate-limit.ts           # Security rate-limiting handlers
├── prisma/                     # Database Schema & Migrations
│   ├── schema.prisma           # 15 Data models (Wards, Tenders, Works, etc.)
│   └── seed.ts                 # Database seeder script
├── public/                     # Static assets & 3D WebGL assets
├── PROJECT_STATUS.md           # Granular milestone & handover log
├── rules.md                    # Project governance & data integrity rules
├── prd.md                      # Product Requirements Document
├── architecture.md             # Detailed technical architecture spec
└── techstack.md                # Technology choices justification
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v20.x` or higher
* **npm**: `v10.x` or higher
* **PostgreSQL**: Local instance or Neon connection URI

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/freefiremax/Paithan-digital-platform.git
   cd Paithan-digital-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and configure your credentials:
   ```bash
   cp .env.example .env
   ```
   *Required variables:*
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/paithan_db?schema=public"
   NEXTAUTH_SECRET="your-super-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Initialize Database:**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Launches the Next.js development server with Turbopack |
| `npm run build` | Compiles and validates production build output |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Executes ESLint static code analysis |
| `npm run test` | Executes unit tests via Vitest |
| `npm run db:generate` | Generates Prisma client types |
| `npm run db:migrate` | Runs database migrations |
| `npm run db:seed` | Seeds database with verified Paithan records |

---

## 🛡️ Data Integrity & Verification Standards

According to **[`rules.md`](./rules.md)** §2 & §8:
1. **Verified Real Facts:** All historical dates, geographic coordinates, museum accession records, Jayakwadi dam specifications, and gazetted leadership names (MLA/MP/CEO) use cross-verified primary sources.
2. **Sample Tagging:** Unconfirmed corporators or sample tenders are explicitly badged in the UI as `"Sample / TBD — Confirm with Nagar Parishad"` to maintain 100% public credibility.

---

## 🤝 Project Governance & Credits

* **Project Owner:** Mohan Kakani
* **Structural Reference:** `nppmodinagar.in`
* **Municipality:** Paithan Municipal Council (*पैठण नगर परिषद*), Chhatrapati Sambhajinagar District, Maharashtra.

---
*Maintained with care for the citizens and heritage of Paithan.*

---

## Agent Collaboration & Change Handoff

Codex and Antigravity may work on this repository at different times. After every implementation task, the acting agent must update this README when user-facing capabilities, setup, architecture, or operating behavior changes, and append a dated entry to [`docs/agent-change-log.md`](./docs/agent-change-log.md).

Before starting work, read the latest change-log entries and run `git status --short`. Preserve changes made by the other agent, avoid rewriting overlapping files without reviewing the current diff, and record the exact files changed, behavior added, validation performed, and any remaining limitations. The change log is a handoff record; Git remains the source of truth for the actual code.
