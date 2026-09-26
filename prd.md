# PRD — Paithan Digital Platform

**Status:** Draft v1 — for review before build
**Owner:** Mohan Kakani
**Reference site:** nppmodinagar.in (structure reference only, not visual reference)

---

## 1. Overview

Paithan Digital Platform is a single digital ecosystem for the town of Paithan that brings together:

- **Nagar Parishad** — civic administration, wards, elected representatives, development works, official notifications
- **Heritage** — museum, artifacts, 3D models, history, cultural heritage
- **Tourism** — Jayakwadi, Nath Sagar, heritage sites, places to visit, routes, tourist map
- **AI Chatbot** — a single assistant that can answer questions across all of the above

This is **not** a tourism-only site. It is meant to function as the town's official digital presence — civic transparency, heritage preservation, and tourism promotion in one platform.

## 2. Background

A senior stakeholder (via WhatsApp) shared `nppmodinagar.in` as a structural reference and asked for:
1. A "complete body" page — CEO, President, MLA, Nagar Sevaks, etc.
2. The reference site's information architecture kept largely intact, since it reflects an expected/required order for an official municipal site
3. Theme/visual design to be substantially improved — "itna bhangar UI nahi, but existing structure rakho"
4. A first design direction ready by the coming weekend

## 3. Goals

- Give citizens a transparent view of civic administration, representatives, and development work in their ward
- Digitally preserve and present Paithan's heritage (museum, artifacts, history, culture)
- Promote Paithan as a tourist destination with practical, usable trip-planning tools
- Provide one AI chatbot that can answer questions across civic, heritage, and tourism content
- Look and feel like a legitimate, modern government platform — not a hackathon demo, not a generic AI-generated template

## 4. Non-Goals (Phase 1)

- Online payments (property tax, fees, etc.) — flag as a possible Phase 2
- Citizen complaint/grievance ticketing system — Phase 2 candidate
- Full multi-vendor tourism marketplace (bookings, guides for hire) — Phase 2 candidate
- Native mobile app — responsive web only for now

## 5. Users & Personas

| Persona | Needs |
|---|---|
| **Resident of Paithan** | Find their ward's Nagar Sevak, see development work status, read official notices |
| **Visitor / Tourist** | Discover heritage sites, plan a route/itinerary, see Jayakwadi & Nath Sagar info |
| **Researcher / Student** | Explore Paithan's history, culture, museum artifacts, 3D models |
| **Nagar Parishad staff (Admin)** | Publish notifications, update development work status, manage representative profiles |
| **Senior / Stakeholder** | Review that structure matches the required civic-site format and looks credible |

## 6. Scope — Site Sections

### 6.1 Home
Landing page introducing the three pillars (Nagar Parishad / Heritage / Tourism) with entry points into each, plus the AI chatbot launcher and latest notifications.

### 6.2 Nagar Parishad
- **About Nagar Parishad** — introduction, overview, departments, administrative structure, key officials, contact info
- **Public Representatives** — dedicated page/hierarchy: Administrative Officer / CEO, President, Vice President, MLA, MP, Nagar Sevaks, Administrative Officers, other representatives. Each has a profile card (photo, name, designation, ward/constituency) linking to a detail page (bio, contact, responsibilities)
- **Ward Map** — interactive map of all wards, boundaries, ward number, ward-wise info, key locations, representative per ward
- **Nagar Sevak (ward-wise)** — name, ward number, photo, designation, contact, ward represented, development activities
- **Development Works** — list/grid filterable by ward and by status (Completed / Ongoing / Planned); each entry: project name, ward, description, status, start date, expected completion, department, budget, progress %, images, location
- **Projects** — larger project-level records: title, description, estimated budget, status, department, timeline, location, progress, images/documents
- **Notifications** — official public notices: announcements, schemes, tenders, public notices, updates. Must read as an official notification system, not a blog

### 6.3 Heritage
- **Paithan Museum** — introduction, location, visiting info, exhibits, images, historical significance
- **Artifacts** — individual records: name, image, description, historical period, origin, significance, related info
- **3D Models** — interactive rotate/zoom models of structures, sculptures, artifacts, monuments
- **History** — chronological narrative: Ancient Paithan → Historical Era → Important Events → Cultural Development → Modern Paithan
- **Cultural Heritage** — manuscripts, monuments, traditions, art, literature, cultural practices, important personalities, historical records

### 6.4 Tourism — Explore Paithan
- **Jayakwadi** — dam info, nearby attractions, things to do, location, photos, tourist info
- **Nath Sagar** — water body, activities, nearby attractions, visitor info
- **Heritage Sites** — temples, monuments, historical structures with photos, description, history, location, directions
- **Places to Visit** — curated list: name, photo, short description, location, significance, how to reach
- **Routes & Itineraries** — suggested routes (e.g. 1-day, family, heritage, nature, temple route) chaining places together
- **Tourist Map View** — all tourist places, heritage sites, museum, Jayakwadi, Nath Sagar plotted on one map

### 6.5 AI Chatbot — "Ask about Paithan"
Single chatbot, not scoped to tourism only. Must answer across:
- Nagar Parishad (departments, representatives, wards, development works)
- Heritage (museum, artifacts, history, culture, 3D models)
- Tourism (places, Jayakwadi, Nath Sagar, routes)
- Government info (schemes, notifications, announcements)
- General Paithan-related queries

## 7. Functional Requirements Summary

- Public users can browse all sections without login
- Admin users can log in to a CMS/admin panel to create/edit/publish: notifications, development works, projects, representative profiles, heritage/tourism content
- Content should support images for every record type listed above (representatives, development works, artifacts, tourist places, etc.)
- Ward Map and Tourist Map must show real, clickable markers tied to database records, not static images
- Development Works and Projects must be filterable by ward and status
- Chatbot must cite/point to the section its answer is drawn from where possible, and gracefully say "I don't have that information yet" rather than hallucinate
- Notifications section must support categorization (announcement / scheme / tender / notice) and a "reaches till villages" framing — i.e. written to be understandable by a general public audience, not just urban readers

## 8. Non-Functional Requirements

- **Official & trustworthy tone** — every page should look like it belongs to a real municipal body
- **Accessibility** — usable by non-technical residents; reasonable color contrast, readable type sizes, keyboard navigable
- **Performance** — fast load on average mobile data speeds (most residents will access via phone)
- **Responsive** — mobile-first, since most citizen and tourist traffic will be mobile
- **Bilingual-ready** — content model should support Marathi + English at minimum (confirm with senior whether Marathi is required at launch or Phase 2)
- **Maintainable by non-developers** — Nagar Parishad staff should be able to update notifications/development works without touching code

## 9. Design Direction

- Keep the reference site's information architecture (sections, order, hierarchy) — that structure reflects an expected format for this kind of civic site
- Rebuild the **visual theme**: modern typography, consistent spacing, card-based layouts, clean navigation
- Should read as a **modern government digital platform**, not an "AI-generated futuristic website" and not an old-style bare-bones government portal
- Should not look like a tourism-brand microsite — administration and public-service content need to feel just as prominent as heritage/tourism content

### 9.1 Decisions taken during the visual rebuild

Recorded here so the rejected directions are not re-litigated. These were settled
with the client, not inferred.

**Palette.** A madder crimson ground with marigold and zari gold against deep
peacock, on warm silk ivory. Every hue in it is a Paithani dye or thread colour:
madder root gives the crimson field, marigold petals give the yellow, zari is the
gold thread laid along the border, and the peacock buti supplies the one cool note.
Ajanta pairs ochre with green-blue, and Paithani pairs a red field with a peacock
border, so the pair is locally authentic rather than borrowed.

Three directions were tried, and the record matters because the first rejection
was later reversed:

- *Saturated crimson, marigold and metallic gold.* Rejected at first on the
  grounds that it read as Diwali/festive merchandise rather than a civic archive.
  **This rejection was wrong and has been reversed by the client.** See below.
- *A fully desaturated warm-grey palette.* Correctly avoided the festive reading
  but read as unfinished and cheap, and the client rejected it as boring.
- *The first oxide/bronze/paper build, held at low chroma.* The same mistake as the
  desaturated palette in a different key: "not festive" had been read as "not
  saturated". Delivered, reviewed, and rejected as boring.

**What the reversal actually turned on.** The hues were never the problem. Crimson,
marigold and gold are how a Paithani pallu is dyed, and flattening marigold into a
dull bronze measurably *passed* contrast while still looking like dust, because a
yellow with the chroma removed is not a softer yellow, it is a different and
lifeless one. What made the first attempt read as Diwali merchandise was the
**technique** applied to those hues: gold used as a large fill, glow, gradient
marigold, ornament. So the rule now is:

> Keep the dye colours. Earn them with technique, not with hue. Saturation is
> authentic; glitter, glow and gold-as-fill are not.

Restraint is expressed by *how* a colour is used — zari gold is a hairline and never
a block, accents live only in the notice loop — not by desaturating the palette.
Madder also leans magenta rather than orange; getting that lean right is the whole
difference between "Paithani silk" and "Diwali poster", and the earlier
red-orange `oxide` ramp had it wrong.

**The notice accents.** The home notice loop is the one place allowed six
deliberately high-chroma colours, because there they do a job rather than decorate:
each row's bar and badge take one, so a citizen can separate rows while the loop is
moving. The six are saffron, rose, zari, peacock, fuchsia and leaf. The peacock is
kept on purpose as the single cool note; without it the panel collapses into one
warm field. Two of them had to be lightened once already — at their first values
rose and fuchsia measured 2.3-2.6:1 as a bar against the row chip and disappeared
into it.

**Typography.** A display serif (Besley) with a Devanagari companion
(Tiro Devanagari Hindi) for headings, and Inter retained for body and UI. Display
faces are for headings and numerals only; the civic body text stays neutral and
legible at small sizes.

**Ornament.** Flat Paithani textile geometry — butis, lotus rosettes, woven
borders — drawn as inline SVG and CSS. An illustrated townscape was built and
rejected: it read as AI-generated, which directly violates the line above about
not looking AI-generated. Ornament is applied to structure (borders, finsials,
dividers), never to content.

**Motion.** The home notice loop pauses on hover *and* on focus-within, because a
hover-only pause fails a keyboard user, and WCAG 2.2.2 requires any motion over
five seconds to be pausable. The duplicated list copy is hidden from assistive
technology, and `prefers-reduced-motion` replaces the loop with a static
scrollable list.

### 9.2 Known gaps in the design system

- The public palette migration is complete: all public pages and shared components
  resolve to the four ramps (`paper`, `bronze`, `teal`, `oxide`) with no hex
  literals, via utility redirects in `globals.css` rather than a call-site rewrite.
  Those redirects are intentionally semantically dishonest - `slate-*` renders
  silk, `amber-*` renders marigold, `blue-*` renders peacock - so a future
  contributor reading `bg-slate-900` will not guess the colour from the name. The
  comment above the block in `globals.css` says so; this line is the second copy
  of that warning.
- `app/admin` is deliberately **not** on these ramps. It is a separate internal
  product surface and still carries its own navy; migrating it was scoped out by
  decision, not overlooked.
- The council crest in `components/layout/CouncilSeal.tsx` is a non-official
  placeholder and must be replaced with the authorised emblem before launch.
- The home video is 848x424 at roughly 125 kbps and is visibly soft when scaled to
  a full-width band. This needs a re-encode, not a CSS change; no encoder is
  available in the current environment.
- The home video autoplay for `prefers-reduced-motion` users is now **closed**.
  `components/layout/VideoControls.tsx` is a small client island that pauses the
  clip when the media query matches, and it also exposes a pause/play control
  because the clip loops indefinitely and WCAG 2.2.2 requires motion past five
  seconds to be pausable. Verified `prefers-reduced-motion` in that file.
- `/heritage` has no index page, so the route itself 404s even though the
  individual heritage pages exist.
- The four ramp *names* are now historical: `paper` is a warm silk ivory, `bronze`
  is marigold, and `oxide` is madder crimson. The values moved, the identifiers did
  not, so the redirect block in `globals.css` still reads as if `amber-*` were
  bronze. Renaming the identifiers is a separate sweep and was deliberately left
  out of a values-only change to keep the diff reviewable.

## 10. Milestones

1. Finalize structure/sitemap (this doc)
2. Public representatives / government body page — content model + design
3. Finalize content requirements per section (real data vs placeholder — open question, see below)
4. Review reference site structure once more against this PRD
5. **Design direction / first visual design — due this weekend**
6. Build out sections in Claude Code against `architecture.md` / `techstack.md`

## 11. Open Questions (confirm with senior before/while building)

- Is real data available for wards, Nagar Sevaks, development works, and notifications, or should Phase 1 ship with placeholder/sample content?
- Who are the actual admin users (Nagar Parishad staff?) and how many roles are needed (e.g. super admin vs ward-level editor)?
- Is Marathi language support required for the first version or a later phase?
- Is there a hosting/domain budget, or should the stack default to free-tier services?
- Does the chatbot need to reflect live data (e.g. "is my ward's road work done yet?") or is a static knowledge base (site content only) sufficient for v1?
