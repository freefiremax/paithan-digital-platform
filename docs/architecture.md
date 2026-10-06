# Architecture — Paithan Digital Platform

Companion to `prd.md` (what to build) and `techstack.md` (what tools). This file defines how the pieces fit together.

---

## 1. High-Level Structure

```
PAITHAN DIGITAL PLATFORM
│
├── Public Web App (Next.js)
│   ├── Nagar Parishad
│   ├── Public Representatives
│   ├── Heritage
│   ├── Tourism
│   ├── Notifications
│   └── AI Chatbot widget
│
├── Admin Panel (same Next.js app, /admin, auth-gated)
│   └── CRUD for wards, representatives, works, projects,
│       notifications, heritage & tourism content
│
├── API layer (Next.js Route Handlers)
│   ├── Public read endpoints
│   ├── Admin write endpoints (role-checked)
│   └── Chatbot endpoint (RAG over content)
│
├── Database (PostgreSQL + pgvector)
│
├── Asset storage (images, 3D model files)
│
└── External APIs
    ├── Gemini API (chatbot generation)
    └── Map tiles (OpenStreetMap via Leaflet)
```

## 2. Application Structure (single Next.js app)

```
/app
  /(public)
    /page.tsx                    → Home
    /nagar-parishad
      /page.tsx                  → About
      /representatives/page.tsx  → Public representatives listing
      /representatives/[slug]    → Representative profile
      /ward-map/page.tsx
      /nagar-sevak/page.tsx
      /development-works/page.tsx
      /projects/page.tsx
      /notifications/page.tsx
    /heritage
      /museum/page.tsx
      /artifacts/page.tsx
      /artifacts/[slug]/page.tsx
      /3d-models/page.tsx
      /history/page.tsx
      /cultural-heritage/page.tsx
    /tourism
      /jayakwadi/page.tsx
      /nath-sagar/page.tsx
      /heritage-sites/page.tsx
      /places-to-visit/page.tsx
      /routes/page.tsx
      /map/page.tsx
    /chatbot  (or a persistent floating widget across all pages)

  /admin
    /login/page.tsx
    /dashboard/page.tsx
    /representatives/...
    /development-works/...
    /projects/...
    /notifications/...
    /heritage/...
    /tourism/...

  /api
    /representatives/route.ts
    /wards/route.ts
    /development-works/route.ts
    /projects/route.ts
    /notifications/route.ts
    /heritage/...
    /tourism/...
    /chatbot/route.ts
    /auth/[...nextauth]/route.ts

/lib
  /db.ts            → Prisma client
  /auth.ts          → NextAuth config
  /rag.ts           → embedding + retrieval helpers
  /gemini.ts        → Gemini API client wrapper

/prisma
  /schema.prisma
```

## 3. Data Model (core entities)

```
Ward
  id, number, name, boundaryGeoJSON, description

Representative        // covers President, VP, MLA, MP, CEO, other officers
  id, name, designation, photoUrl, contactInfo, wardId (nullable), bio, order

NagarSevak             // ward-elected; can extend Representative or be its own table
  id, name, wardId, photoUrl, contactInfo, developmentNotes

DevelopmentWork
  id, title, wardId, description, status(enum: completed/ongoing/planned),
  startDate, expectedCompletion, department, budget, progressPct, images[], locationLatLng

Project
  id, title, description, estimatedBudget, status, department,
  timeline, location, progressPct, attachments[]

Notification
  id, title, body, category(enum: announcement/scheme/tender/notice),
  publishedAt, isPinned

MuseumExhibit
  id, name, description, images[], significance

Artifact
  id, name, image, description, period, origin, significance

Model3D
  id, name, description, glbFileUrl, thumbnailUrl, relatedArtifactId (nullable)

HistoryEvent
  id, era(enum: ancient/historical/events/cultural/modern), title,
  description, order, images[]

CulturalHeritageItem
  id, category(enum: manuscript/monument/tradition/art/literature/personality),
  title, description, images[]

TouristPlace
  id, name, category(enum: jayakwadi/nathsagar/heritage-site/general),
  description, images[], locationLatLng, howToReach

Route              // itinerary
  id, name, type(enum: 1-day/family/heritage/nature/temple),
  stops: RouteStop[] (ordered)

RouteStop
  id, routeId, touristPlaceId, order, note

ChatbotChunk        // RAG knowledge base
  id, sourceType, sourceId, content, embedding(vector), updatedAt

AdminUser
  id, email, passwordHash, role(enum: super-admin/editor/ward-editor), wardId (nullable)
```

Most content tables (Representative, DevelopmentWork, Project, Notification, heritage & tourism entities) should carry `titleMr` / `descriptionMr` style optional fields if Marathi support is confirmed (see PRD open question) rather than a separate translation table — simpler to query and edit from the admin panel.

## 4. API Layer

- **Public GET endpoints** — one per resource above, support filtering (e.g. `/api/development-works?ward=4&status=ongoing`)
- **Admin CRUD endpoints** — same resources, POST/PATCH/DELETE, gated by `requireRole()` middleware checking the NextAuth session
- **`/api/chatbot`** — POST `{ query }` → embeds query → vector search over `ChatbotChunk` → builds context → calls Gemini → returns `{ answer, sources[] }`
- Input validation on every write endpoint via `zod` schemas shared between client forms and API handlers

## 5. Admin / CMS Panel

- Auth-gated at `/admin`, NextAuth credentials provider (email + password) to start; Google OAuth optional convenience login later
- Roles:
  - **super-admin** — full access to everything
  - **editor** — can manage heritage, tourism, notifications
  - **ward-editor** — can only edit their own ward's Nagar Sevak profile and development works
- Every content type above gets a simple list + create/edit form in the admin panel
- Image uploads go straight to the asset storage provider (see `techstack.md`) and store only the returned URL in Postgres

## 6. AI Chatbot (RAG) Flow

**Ingestion (runs whenever content is created/updated in admin):**
1. Take the record's text fields (title, description, etc.)
2. Chunk into ~300–500 token pieces
3. Generate embeddings (Gemini embedding model)
4. Upsert into `ChatbotChunk` (pgvector column) tagged with `sourceType`/`sourceId`

**Query (chatbot widget on any page):**
1. User asks a question
2. Embed the question
3. `pgvector` cosine-similarity search → top 5–8 chunks
4. Build a prompt: system instruction ("you are Paithan's civic/heritage/tourism assistant, answer only from the provided context, say you don't know if it's not covered") + retrieved chunks + user question
5. Call Gemini API → stream response back to the widget
6. Return chunk sources so the UI can show "based on: Development Works, Ward 4" style attribution

This keeps the chatbot's knowledge synced with whatever admins publish, without a separate content-duplication step.

## 7. Maps

- **Ward Map**: Leaflet map, ward boundaries as GeoJSON polygons (stored per `Ward` record or as static files if boundary data is hard to source), click a ward → shows Nagar Sevak + development works for that ward
- **Tourist Map**: Leaflet map with markers from `TouristPlace` (all categories), popup with photo + short description + link to detail page
- Tile provider: OpenStreetMap (no API key, no cost) — revisit if the senior wants Google Maps–style base tiles later

## 8. 3D Models

- Models stored as `.glb`/`.gltf` files in asset storage
- Rendered client-side with the `<model-viewer>` web component (Google) — gives rotate/zoom/AR-ready viewing with minimal code, no need to hand-roll Three.js scenes for a first version
- If richer custom interaction is needed later (guided tours, hotspots on the model), that's a Phase 2 upgrade to `react-three-fiber`

## 9. Deployment

- Frontend + API: Vercel (Next.js-native, generous free tier)
- Database: Neon (serverless Postgres with `pgvector` support)
- Assets (images, 3D models): Cloudinary
- CI: GitHub Actions → lint/typecheck on PR, Vercel auto-deploys `main`

## 10. Security Notes

- All admin write routes check session + role server-side, never trust client-side role display alone
- Rate-limit `/api/chatbot` (e.g. per-IP) to control Gemini API usage/cost
- Validate and re-encode uploaded images; restrict file types for 3D model uploads to `.glb`/`.gltf`
- CSRF protection via NextAuth defaults; sanitize any rich text stored for notifications/description fields before rendering
