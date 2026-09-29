# Paithan Digital Platform (पैठण डिजिटल प्लॅटफॉर्म)

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
* **Bilingual Intelligence:** English & Marathi support for civic FAQs, ward contacts, museum hours, and travel routes.
* **Zero-Hallucination Fallback:** Integrated Google Gemini API coupled with a local RAG knowledge base. Every response provides clickable source route citations.

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
