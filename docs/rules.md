# Rules — Paithan Digital Platform (for Claude Code)

Read this before making any change. This file governs *how* work gets done here; `prd.md` says *what* to build, `architecture.md` says *how it's structured*, `techstack.md` says *which tools*.

## 1. Team & Review Model

- Two people touch this repo: Mohan (primary) and a senior stakeholder who also reviews and may code directly
- Prefer small, reviewable commits over large sweeping changes
- Before a large rewrite of an existing file, check recent git history — don't assume you're the only one who touched it

## 2. Research First

Before writing any page content or seed data, do a research pass on **Paithan itself** (the actual town in Chhatrapati Sambhajinagar district, Maharashtra) — not just the reference site's structure:

- **Nagar Parishad specifics**: how many wards actually exist, who currently holds which office (President, CEO/Chief Officer, MLA, sitting Nagar Sevaks). Elected terms change — timestamp what's found and flag it for reconfirmation before publishing
- **Heritage facts**: Paithan's real history (ancient Pratishthana, Paithani sarees, Sant Eknath/Dnyaneshwar connections), any real museum details, genuine cultural heritage points
- **Tourism facts**: verified info on Jayakwadi Dam, Nath Sagar, existing heritage sites and tourist spots
- Cross-check findings against `prd.md`'s section list — flag anything the PRD assumes that doesn't match reality (e.g. no real museum yet, ward count different from what was assumed)

Split findings into two buckets:
- **Verified / commonly documented** — safe to use as real content
- **Unconfirmed / needs a local source** — mark clearly as "TBD — confirm with Nagar Parishad," especially for named officials and live development-work status; never publish a guess as fact

Do this research once at project start, and again before publishing anything in the Nagar Parishad / Public Representatives sections, since officials change with elections.

## 3. Strict Mode — Confirm Before Major Changes

This project runs strict: don't deviate from `prd.md` without checking first. **Stop and ask before:**
- Adding/removing a page or section not already in `prd.md`'s sitemap
- Changing a tech stack choice from `techstack.md` (swapping a library, adding a new service/dependency)
- Any non-additive data model change (renaming/dropping fields, changing relations)
- Resolving anything listed under "Open Questions" (prd.md) / "Open Decisions" (techstack.md) — these need the senior's input, not an assumption

**No check-in needed** for small, reversible, clearly-in-scope work: building a page already defined in the sitemap, a component for an already-specified feature, an obvious bug fix. When genuinely unsure which bucket something falls in, treat it as "ask first" — better to move a little slower than undo work that didn't match expectations.

## 4. Coding Conventions

- TypeScript everywhere, no plain `.js` files
- Naming: components PascalCase (`WardMap.tsx`); files/folders kebab-case (`development-works/`); Prisma fields camelCase; API routes kebab-case, resource-named (`/api/development-works`)
- Prettier + ESLint config in the repo is the source of truth for formatting — run it, don't hand-format
- One component/module = one responsibility; don't mix admin and public logic in the same file
- Comment *why*, not *what*, for anything non-obvious (RAG chunking, RBAC checks, ward-boundary geometry handling)
- Follow the folder structure in `architecture.md` — flag it before introducing a different pattern

## 5. Git Workflow

- Branch naming: `feature/<short-name>`, `fix/<short-name>`, `content/<short-name>`
- No direct commits to `main` — always a branch + PR, even solo, so the senior has something to review
- Commit style (Conventional Commits): `feat: add ward map component`, `fix: chatbot embedding null check`, `content: seed sample wards`
- Small, focused commits over one giant commit per feature
- No force-push / history rewrite on `main` or any branch the senior might also be using

## 6. Design Reference Handling

- `nppmodinagar.in` is the **structural** reference (see `prd.md` §2/§9) — it defines expected information architecture, not visual style
- Pull it up directly (browser/fetch) when making layout/IA decisions rather than guessing from the PRD description alone
- Never copy its visual theme — the brief is "official, clean, modern, trustworthy, not AI-generated-looking," not "looks like the reference site"
- If it's genuinely unreachable, ask Mohan for screenshots instead of guessing the layout

## 7. UI Skill & Visual Design Rules

- This repo ships a `frontend-design` skill (Apache-2.0, from Anthropic) — unzip it to `.claude/skills/frontend-design/` at the repo root. Claude Code should read `frontend-design/SKILL.md` before any layout, typography, or color decision and follow its plan → review-against-brief → build → self-critique process, not jump straight to code
- Project-specific brief for that skill's "ground designs in the subject" step: this is an **official municipal/civic platform**, not a startup or consumer product. Distinctive-but-professional here means it should read as belonging to a real government body — not a flashy dark/cinematic portfolio piece, and not a generic SaaS template either
- Explicitly avoid the AI-tell patterns the skill itself calls out (warm-cream+serif+terracotta, near-black+neon-accent, ALL-CAPS eyebrow labels, arrow-suffixed buttons, identical rounded SaaS cards) — none of these read as "official government," so they're doubly wrong here
- One deliberate accent color on a restrained, high-contrast, accessible palette; typography should read institutional/legible over trendy
- Every new page or component that involves layout/styling goes through the skill's full loop — plan, check it against `prd.md`'s design direction (§9), build, self-critique — before being considered done

## 8. Content & Data

- Don't invent placeholder data that looks like real government data (real-sounding names, fake budgets, real-looking ward numbers) without clearly marking it as placeholder (e.g. "Sample Ward 1", "TBD")
- Real vs. placeholder data source is an open question in `prd.md` — don't quietly decide this
- Where the Section 2 research surfaced verified real facts, prefer those over invented placeholders (e.g. real history/heritage facts over a made-up museum description)

## 9. Don't Touch Without Asking

- Prisma migrations that drop or alter existing columns
- Auth/role logic (NextAuth config, RBAC checks) — security-sensitive, always flag
- Anything already reviewed/approved by the senior — don't silently "improve" it

## 10. Definition of Done (per task)

- Matches the relevant section of `prd.md`
- Follows `architecture.md`'s structure and `techstack.md`'s chosen tools
- Any UI/layout work went through the `frontend-design` skill loop (§7)
- Lint/typecheck passes
- No "Open Decision" was resolved silently — it was flagged instead
