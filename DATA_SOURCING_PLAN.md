# Paithan Digital Platform — Data Sourcing & Integration Plan

**Created:** 2026-09-29
**Owner of record:** Mohan Kakani (per `prd.md` / `PROJECT_STATUS.md`)
**Governs:** how real Paithan data is sourced, verified, and merged into `lib/mock-data.ts`
**Reads with:** `rules.md` (§2 Research First, §8 Content & Data), `prd.md`, `architecture.md`

---

## 1. Purpose

Move the seed layer (`lib/mock-data.ts`) from a mostly hand-authored dataset to a
**sourced, verifiable** one: every civic / heritage / tourism fact traceable to an
authoritative source, with real document/PDF links **where they genuinely exist**.
No page or section changes — this is a data-quality and provenance pass only.

## 2. Method (research-first, per rules.md §2)

- Do the research pass *before* editing seed data (this document is that pass's output).
- Verify across four domains in parallel:
  1. Heritage / history / museum / Paithani GI
  2. Tourism / nature (Jayakwadi, Nath Sagar, bird sanctuary, gardens, connectivity)
  3. Governance / elected representatives / council / Census 2011
  4. Official portal + tenders/PDF landscape (done during recon)
- Split every finding into the two rules.md §2 buckets:
  - **VERIFIED** — commonly documented by a primary/authoritative source; safe to publish.
  - **SAMPLE_TBD** — needs a local source; keep the existing
    "Sample / TBD — Confirm with Nagar Parishad" badge. Never publish a guess as fact.
- **Additive changes only** (rules.md §3): may add *optional* provenance fields; will
  not rename/drop fields, change relations, or add/remove pages.

## 3. Data-integrity policy

- Keep the existing `DataStatus` union (`VERIFIED | SAMPLE_TBD`) and its discipline.
- Add optional, additive provenance on records where useful:
  `sourceUrl?`, `sourceLabel?`, `verifiedOn?` (ISO date).
- Hard rule: **do not fabricate** names, figures, reference numbers, or PDF URLs.
  If a document can't be verified, link the authoritative *landing page* and tag
  the record `SAMPLE_TBD`.
- Timestamp anything that changes with elections/postings (MLA, MP, Chief Officer).

## 4. Reality check — official portal & tender PDFs

This is the constraint that shapes the whole PDF strategy, so it is stated up front:

- `https://paithanmahaulb.maharashtra.gov.in` (Paithan Nagar Parishad's own portal) is
  **unreachable from this build environment** — the host refuses the connection
  (ECONNREFUSED). Its live notices, tenders, and downloads therefore **cannot be scraped
  here.** This is an environment/network limitation, not proof the portal is dead.
- `https://mahatenders.gov.in` (the state e-tender portal) exists and is real, but it is a
  **session-gated search application** — it does **not** expose stable, linkable
  per-tender PDF URLs to a fetch tool. Deep-linking an individual Paithan tender PDF is
  not reliably possible from here.

**Consequence (hard rule for this pass):**

- Do **not** invent tender / notice PDF URLs or reference numbers.
- Where a real, authoritative *destination* exists (a portal or a genuinely published
  PDF), link it and mark the record `VERIFIED` for the *source*, not for invented content.
- Any notice/tender row whose reference number or document we cannot verify stays
  `SAMPLE_TBD` and links the authoritative **landing page** (e.g. MahaTenders portal),
  never a fabricated `.pdf`.

## 5. Authoritative source registry

Confirmed-real destinations (reachability noted; "pass 2" = a verification agent is
confirming the exact deep link before we cite it):

| Source | URL | Type | Feeds |
| --- | --- | --- | --- |
| Census of India 2011 (+ citypopulation.de mirror) | censusindia.gov.in | primary | demographics |
| Election Commission of India | results.eci.gov.in | primary | MLA / MP |
| DMA Maharashtra — ULB Data Portal | ulbdataportal.in | primary | council class, wards, Act |
| MahaULB citizen services | mahaulb.in | primary | property tax / services |
| MahaTenders (portal only) | mahatenders.gov.in | primary | tenders (landing page) |
| Aaple Sarkar RTS | aaplesarkar.mahaonline.gov.in | primary | citizen services |
| Civil Registration (birth/death) | crsorgi.gov.in | primary | citizen services |
| Ministry of Tourism — Incredible India | incredibleindia.gov.in | primary | tourism / history |
| Maharashtra Tourism (MTDC) | maharashtratourism.gov.in | primary | tourism (pass 2) |
| Water Resources Dept / India-WRIS | indiawris.gov.in | primary | Jayakwadi dam (pass 2) |
| Archaeological Survey of India | asi.nic.in | primary | Brahmapuri / museum (pass 2) |
| GI Registry — IP India | search.ipindia.gov.in | primary | Paithani GI (pass 2) |
| BNHS / eBird | ebird.org | primary/secondary | bird sanctuary (pass 2) |
| Paithan NP portal | paithanmahaulb.maharashtra.gov.in | primary | **UNREACHABLE here** |
| Wikipedia (Paithan, Jayakwadi, Satavahana, Eknath) | en.wikipedia.org | secondary | cross-check |

## 6. Domain-by-domain integration map

Each row: target export in `lib/mock-data.ts` → source(s) → planned action.

- `councilProfile` → DMA/ULB portal, Census → verify class / established year / ward count;
  attach `officialPortal` + `sourceUrl`. (`established 1854`, `Class 'C'`, `17 wards` are
  under pass-2 verification — none confirmed yet, keep as-is until sourced.)
- `paithanDemographics` → Census 2011 → **population 41,536 / male 21,269 / female 20,267
  confirmed**; households, literacy %, and 0–6 child count need re-derivation from Census
  PCA before publishing — leave those tagged for confirmation. Add `sourceUrl`.
- `electedRepresentatives` → ECI 2024 → **MLA correct**: Vilas Sandipanrao Bhumre, Shiv
  Sena (Shinde), Paithan **constituency 110 (not 107)** — correct the number.
  **MP correction**: Paithan sits in **Jalna LS**, whose 2024 MP is **Kalyan Vaijinathrao
  Kale (INC)** — *not* Sandipan Bhumre (he is Aurangabad LS, which excludes Paithan).
  This is the highest-risk fix. Add `sourceUrl` + `verifiedOn`.
- `administrationRepresentatives` → DMA / news → council is under **administrator rule**
  (2016 term expired; polls stayed as of 30 Nov 2025). "Chief Officer Santosh Dagdu Agle"
  is **unverified** → keep `SAMPLE_TBD`.
- `wards` / `wardCorporators` → SEC Maharashtra → corporators stay `SAMPLE_TBD` (no elected
  body; note the administrator-rule reason + source). 23 seats confirmed (2016 body);
  "17 wards" unconfirmed.
- `developmentWorks` / projects → no public per-work dataset → keep `SAMPLE_TBD`, labelled.
- `notifications` → link real portals; `downloadUrl` only to genuine PDFs/landing pages;
  invented reference numbers stay `SAMPLE_TBD`.
- `HISTORY_TIMELINE` → Wikipedia / ASI / Incredible India → verify Satavahana capital
  (Pratishthana), Periplus/Ptolemy mentions, Sant Eknath & Dnyaneshwar links; add sources.
- `MUSEUM_EXHIBITS` → State Archaeology / ASI → verify museum + holdings; flag any specific
  accession we can't source as `SAMPLE_TBD`.
- Paithani GI (cultural heritage) → GI Registry → add real GI number/year + journal PDF.
- `TOURIST_PLACES` → Incredible India / MTDC / WRD → verify specs, timings, coords; sources.
- `jayakwadiDamSpecs` → WRD / India-WRIS → verify engineering figures; add `sourceUrl`.
- `jaikwadiBirdSanctuaryInfo` → Forest / BNHS / IBA → verify area, species, IBA code.
- `paithanConnectivity` → sanity-check distances against maps/official data.

## 7. PDF & document strategy

- Curate a small set of **real** PDFs (Census handbook, GI journal entry, relevant GRs,
  ASI/CAG where they exist) and attach them to the right records via `sourceUrl` /
  `downloadUrl`.
- **No fabricated PDFs.** Tender documents link the MahaTenders portal and stay
  `SAMPLE_TBD` per §4.

## 8. Execution phases

1. Verification pass (4 research streams + recon) — **done**.
2. This plan (`DATA_SOURCING_PLAN.md`) — **done / living doc**.
3. Apply verified corrections + provenance to `lib/mock-data.ts` (additive only) — **done**
   (see §10 for the full corrections log).
4. Wire real document/portal URLs into notifications / services / records — **partial**
   (`sourceUrl` added to Jayakwadi + bird-sanctuary records; notification/tender PDFs remain
   `SAMPLE_TBD` → authoritative landing pages only, per §4/§7).
5. `npm run lint` + `npm run build` green — **done** (lint clean; build compiled, TypeScript
   passed, all 29 routes generated, last run 2026-09-30).
6. List residual `SAMPLE_TBD` items needing local (Nagar Parishad) confirmation — **done**
   (see §9).

> Scope note: the pass also extended beyond `lib/mock-data.ts` into the page components that
> **hard-code** the same facts (tourism + heritage pages). Several false/overclaimed strings
> lived only in JSX, not in the data layer, so they are corrected there too (§10). `lib/rag.ts`
> (chatbot grounding) was corrected in the prior session and re-confirmed.

## 9. Needs local confirmation (not sourceable online)

- Ward corporator names (no elected body; SEC polls stayed).
- Live development-work status, budgets, and progress.
- Current Chief Officer / administrator posting (rotates).
- Exact live tender reference numbers & PDFs (own portal unreachable here).

---

## 10. Applied corrections log (for Mohan Kakani's review)

Every change below removes an unverifiable/overclaimed statement or corrects a factual
error. Nothing was fabricated; where a specific could not be sourced, wording was softened
and/or the record left `SAMPLE_TBD`.

**Governance (prior session, re-confirmed)**
- MLA constituency corrected to Paithan **110** (was 107). Source: ECI 2024.
- MP corrected: Paithan sits in **Jalna LS**, 2024 MP **Kalyan Vaijinathrao Kale (INC)**
  (was wrongly Sandipan Bhumre / Aurangabad LS).
- Council under **administrator rule**; Chief Officer name kept `SAMPLE_TBD`.

**Jayakwadi Dam (`jayakwadiDamSpecs` + tourism pages)**
- Irrigated command area set to **237,452 ha** (~2.37 lakh ha); removed the hard-coded
  "2.40 Lakh Ha" string (page now derives the figure from data).
- Canal named **Paithan Right Bank Canal** (was "Majalgaon feeder network").
- Removed unverifiable spillway **gate dimensions** ("12.5m × 7.9m each").
- Added `sourceUrl` (Wikipedia: Jayakwadi Dam) pending India-WRIS pass-2.
- "Asia's largest earthen dam" → "one of Asia's largest earthen dams" (hedged superlative).

**Nath Sagar / Jaikwadi Bird Sanctuary**
- Species figure reconciled to **234 recorded (resident + migratory)** across all pages;
  removed conflicting "78 migratory" and "200+ species" claims.
- **"Siberian" flamingos/birds corrected** to migratory flamingos / Central Asian migrants
  (species-origin factual error).
- Removed **"Ramsar candidate wetland"** (unverified) and the **"IBA IN-MH-15"** code (kept
  the generic, documented "Important Bird Area").
- Demoiselle Crane noted as "10,000+ congregate in winter".

**History / heritage**
- Periplus text corrected: Paithan = **"Paethana"** (was "Plithana"); fine muslins
  attributed to **Tagara, not Paithan**.
- Removed asserted **"Brahmapuri mound" ASI-excavation** attributions; reframed around the
  **ancient Pratishthana** (Satavahana capital) with hedged wording. Tourist-place slug
  `brahmapuri-ancient-mound` kept to avoid breaking routing.
- Museum manuscript relabelled **"Maratha-Era Royal Decree (Rajpatra)"**; removed the
  **Chhatrapati Shivaji Rajpatra / Royal Charter** attribution from the museum page,
  artifact catalog, tourist-place tagline, and heritage-trail itinerary.
- All 6 `MUSEUM_EXHIBITS` tagged **`SAMPLE_TBD`** with a visible `DataStatusBadge` +
  on-page disclaimer, pending Directorate of Archaeology confirmation.

**Paithani (GI)**
- Removed fabricated **"GI Application #84"**; replaced with the verified **GI tag (2010)**.
- "2,000 / 2,200-year-old lineage" → **"centuries-old"**; "mulberry silk" → "pure silk";
  "24K gold-plated zari" → "gold-toned zari"; motifs hedged (Bangadi Mor / lotus / Munia).

**3D models & photography**
- Reframed the CSS-simulated viewer from **"laser-scanned" / "photogrammetric" real scans**
  → "illustrative 3D reconstructions".
- **"Official Photo"** (शासकीय अधिकृत छायाचित्र) image badges softened to neutral
  photo/location labels (image provenance not confirmed).

**Misc**
- "300-acre" Sant Dnyaneshwar Udyan → "expansive" (unsourced figure).

**Verification:** `npm run lint` clean; `npm run build` green (TypeScript passed, 29/29
routes generated, 2026-09-30). No commits made.

