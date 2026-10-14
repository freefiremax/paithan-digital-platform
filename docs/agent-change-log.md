# Agent Change Log

## 2026-10-14 — Codex — Provider recovery and CI network resilience

- Live current production deployment answered English photosynthesis, arithmetic and Hindi science through `gemini-3.5-flash-lite`. Provider access is now working in these probes; no credential value was revealed or committed.
- A Marathi city overview reached the model but included an incorrect historical claim. Expanded the deterministic city overview to Devanagari Marathi, joined spellings, Hindi and English, with the existing local summary and a public heritage source link.
- Added `.github/scripts/install-dependencies.sh` and used it in all four CI jobs. It retries npm installation and Prisma generation only for recognized transient network errors, up to three attempts with short backoff, preserving postinstall scripts and final failure status. No dependency versions or database records changed.
- Validation: 167 tests across 11 suites passed; TypeScript, quiet ESLint and diff checks passed. Commit `76a0106` deployed successfully on Vercel. Live English science, Hindi science, Marathi city overview, Islamapur and Sant Eknath mandir/wada requests returned HTTP 200 with the expected local/provider engines. GitHub tests, lint/typecheck and security audit passed; the final Linux build was still running at this record's update.

## 2026-10-14 — Codex — Existing Gemini key diagnosis correction

- Refreshed and searched the owning Vercel project settings after a duplicate-variable error. `GEMINI_API_KEY` already exists as a Secret for Production and Preview, dated September 22. The earlier missing-key conclusion below was incorrect.
- Closed the unsaved duplicate form and opened Edit on the existing entry. The owner must enter/save the replacement credential; Codex did not save, reveal, or commit its value.
- Public production photosynthesis probe returned HTTP 503 with `AI_UNAVAILABLE`. No redeployment has been performed in this step; update the existing credential, redeploy, and retest before claiming recovery.
- Updated README and this handoff record only; application code is unchanged.

## 2026-10-14 — Codex — Production Gemini configuration diagnosis (superseded)

- CLI approval connected `revenex-ventures`, which does not own the Paithan project. The in-app browser is authenticated to the owning `pymohan-s-projects` team, so project settings were inspected there instead of requesting another blind login.
- The project's environment-variable list contains model settings but no `GEMINI_API_KEY`, explaining general-model failures despite a working local key.
- Prepared the add-variable dialog with key `GEMINI_API_KEY`, type Secret, environment Production. The value remains empty and nothing was saved. The owner must enter/save the credential, then the existing deployment can be redeployed and live general queries rechecked.
- Updated README. No application changes or secret values were committed.

## 2026-10-14 — Codex — Vercel access verification

- CLI authorization succeeded as `prasanna-cyber77`.
- The account's accessible projects do not include Paithan; its team list does not include `pymohan-s-projects`, which owns the deployment URL recorded by GitHub. An explicit scope lookup failed.
- No production environment values were read or modified, and no new Vercel project was created. General AI configuration repair remains dependent on access to the owning team/account.
- Updated README and operating guide. This was an access check and documentation update; application code was not changed.

## 2026-10-14 — Codex — Automated chatbot knowledge and reliability upgrade

- Implemented `scripts/ingest-chatbot-knowledge.ts`, a generated public index, shared knowledge types, ranked retrieval, public Prisma adapters, optional embedding/search interfaces, validated model settings and local culture synthesis under `lib/chatbot/`.
- Updated `app/api/chatbot/route.ts` for bounded bodies/history, multi-source context, source IDs, privacy-aware diagnostics, graceful fallback and request IDs. Updated Gemini timeouts, structured citations and token reporting.
- Added an ADMIN-only knowledge console/API and sidebar entry, transactional owned-prefix Neon publishing, build-triggered ingestion and explicit offline/live verification commands. No migrations or private-data indexing.
- Fixed client request cancellation, duplicate sends, reset races, safe Markdown, translated labels and persistence when the floating panel is closed/reopened. Restricted citation URLs and capped in-memory rate-limit storage.
- New evaluation files: `tests/chatbot-knowledge.test.ts` and `tests/chatbot-admin.test.ts`. Existing chatbot tests now disable live provider calls.
- Ingestion: 215 chunks, no extraction failures; repeated ingestion reported all 215 unchanged. Final full suite passed 162 tests across 11 files; targeted suite passed 70 tests. TypeScript, lint and whitespace checks passed. Published and read-verified 215 public chunks in Neon with embeddings disabled.
- Live culture/bird/science handler checks returned HTTP 200. Gemini 3.8 returned 503; 3.5 Flash-Lite fallback worked. Local Windows builds failed before compilation because of the existing SWC native binding/cache permission issue; Linux CI validation is required.
- Read `docs/chatbot-architecture.md` for activation, exact source adapters, optional embeddings, PDF sidecar support and known content limitations. These are RAG/application improvements, not hosted-model fine-tuning.
- Deployment verification: `6fec173` passed all GitHub checks and Vercel deployment; the culture question returned HTTP 200 on the public production API. General AI still fails there while succeeding locally. Vercel CLI is logged out, so production credentials/configuration cannot yet be repaired. User login is requested; no credentials should be posted in chat.
- Follow-up: general provider outages now return HTTP 503 and trigger the client retry UI, with a regression test, instead of appearing as successful answers.

## 2026-10-14 — Codex — Floating language controls and Eknath topic coverage

- Made the floating chat header stack its language controls so English, Marathi and Hindi remain visible in narrow panels; added selected-state accessibility labels and a shrinkable composer.
- Added shared multilingual Eknath overview responses, mandir/wada distinction and explicit follow-up subject resolution. Specific/current queries remain with the model and local source context.
- Eknath spelling variants now retrieve the heritage entry consistently; increased client history to the server's eight-message bound and preserved page locale in internal source links.
- Added three-language API regressions and a wada follow-up regression. README updated for Antigravity handoff. No model fine-tuning performed.

## 2026-10-14 — Codex — Introductions and bird-sanctuary regression fixes

- Added multilingual name-introduction acknowledgements and thank-you responses in `app/api/chatbot/route.ts` without an external model dependency.
- Normalized Jayakwadi spelling variants and bird/birds in `lib/rag.ts`, with specific bird-sanctuary routing rather than an unrelated dam or general fallback.
- Added concise English, Marathi and Hindi sanctuary fallback replies without unverified visitor counts or current access claims.
- Added API-level regression tests for the user's exact two failing prompts in `tests/chatbot.test.ts`.
- Live configured Google fallback check returned HTTP 200 with an answer. This confirms local credentials work; it does not certify the production environment's key or quota.
- This changes the retrieval dataset, conversational logic and regression coverage; no hosted-model fine-tuning was performed.

## 2026-10-14 — Codex — Chatbot locality coverage

- Added `lib/chatbot-localities.ts` with 15 place-name groups, spelling aliases, multilingual overview replies and whole-name matching.
- Islamapur overview requests now return local map context without requiring Google AI. Other locality questions retrieve context rather than being treated as unrelated general questions.
- All 17 ward profiles now feed the retrieval dataset through shared content. Municipal ward assignments remain unverified and are not inferred from the assembly map.
- Gemini tries the fallback model after a model-specific quota response (429); invalid credentials still stop requests.
- Added regression tests for Islamapur, Marathi aliases and unrelated substring matches. General question coverage remains dependent on the model API; no model fine-tuning was performed.

## 2026-10-14 — Codex — Ward content accuracy and layout

- Added `lib/ward-profiles.ts` with descriptions for all 17 localities and shared imagery used by directory and detail pages.
- Replaced repeating six-image card mapping and generic detail descriptions. Used existing named site assets where available; other supplied photographs are explicitly illustrative.
- Removed sample project records from public work summaries and provided useful service navigation and a clear confirmed-data empty state.
- Detail photography now spans the viewport width with constrained readable text and compact content below.
- Limitation: municipal ward numbering/boundaries and unpublished project data still need official confirmation; this update does not invent records or modify the database.
- Validation: TypeScript, ESLint, and whitespace checks run before commit.

This is the handoff record for work performed by Codex, ChatGPT, Antigravity, and other coding agents. Add the newest entry at the top. Each entry must state the owner, affected files, final behavior, validation, and known limitations. Always inspect the live Git diff because this document does not replace version control.

## 2026-10-14 — Codex — Backend integration audit and current Gemini model migration

### Changed files

- `lib/gemini.ts`, `app/api/chatbot/route.ts`
- `scripts/verify-gemini-key.ts`, `.env.example`
- `tests/chatbot.test.ts`, `README.md`

### Audit results

- Neon PostgreSQL passed a live read-only connection audit. It contains 17 wards, 4 users, 5 civic sectors, and 1 grievance.
- Cloudinary and Cloudflare Turnstile credentials are configured locally. Cloudinary storage needs a read-only account check; Turnstile cannot be confirmed without a browser-issued token.
- Gemini connectivity reached Google successfully, but the configured legacy model returned HTTP 404: this key cannot access Gemini 1.5 or 2.5 and must use Gemini 3.8 Flash. The old `text-embedding-004` model is also unavailable.

### Final behavior

- The chat client ignores legacy `GEMINI_CHAT_MODEL`/`GEMINI_MODEL` values and uses `gemini-3.8-flash`, then `gemini-3.5-flash-lite`.
- The verification script now uses the current text and embedding model defaults.
- Roman Marathi prompts such as “mala paithan baddal sanga” return a direct Marathi overview locally without depending on Gemini.
- Rate limiting now uses Upstash's REST pipeline directly. If Upstash is unavailable, requests use a bounded in-memory limiter instead of emitting an exception for every chatbot request.

## 2026-10-14 — Codex — Ward locator flow

- Changed `components/home/PaithanWardMap.tsx`, the ward-map directory, and added `app/[locale]/(public)/nagar-parishad/ward-map/[ward]/page.tsx`.
- Map pins and directory cards now route to a unique ward page instead of returning to the same anchored directory.
- Each ward page provides a civic-style place profile, location, visible work status, and a council-information notice.

## 2026-10-14 — Codex — Ward image gallery

- Added the 17 supplied ward/place images under `public/images/wards/`, mapped in order to wards 1 through 17.
- Updated the ward detail hero to use each ward's own image as a wide, responsive background with a navy readability gradient over the photograph.

## 2026-10-14 — Codex — Ward map navigation and visual hierarchy

- Preserved the active locale in map-pin, directory-card, breadcrumb, back, and contact links so navigation does not silently switch to English.
- Added a visual map lead-in and compact image-backed directory cards to make the ward index feel like a complete civic locator rather than a plain list.

## 2026-10-14 — Codex — Map marker alignment

- Re-measured the 17 interactive SVG hit areas against the numbered marker tips in `public/maps/paithan-17-wards-base.png`.
- Increased the hit target slightly and clarified accessible labels while preserving the map's embedded marker colors and branding.

## 2026-10-14 — Codex — White map-point anchors

- Repositioned all 17 interactive marker tips onto the small white town points in the source map. This corrects the visible offset shown at Nandalgaon and applies the same alignment to every marker.

## 2026-10-14 — Codex — Sant Eknath Mandir image correction

- Added `public/images/wards/sant-eknath-mandir.jpeg` from the supplied temple photograph.
- Ward 2 now uses the named Sant Eknath Mandir asset instead of relying on the upload-order mapping.

## 2026-10-14 — Codex — Floating chatbot stability

- Made the floating panel use viewport-aware height and width so it does not extend below the screen on mobile.
- Added dialog semantics, Escape-to-close, focus placement, and visible keyboard focus styling for the floating trigger and close control.

### Validation

- Pending current Gemini recheck, Cloudinary account read, and static checks.

## 2026-10-14 — Codex — Focused chatbot retrieval and answer fallbacks

### Changed files

- `lib/rag.ts`, `app/api/chatbot/route.ts`, `lib/gemini.ts`
- `tests/chatbot.test.ts`, `README.md`

### Final behavior

- Conversational offers such as “will you help me” receive a direct response with no emergency citation.
- “What is Paithan” retrieves the town record, not the similarly named Paithani textile.
- Local retrieval requires a stronger exact keyword match, and the route sends only the top record to Gemini.
- The offline fallback selects a short relevant line. Price questions without an actual verified price say that the price is unavailable.
- General questions without local evidence remain available to Gemini; if Gemini is unavailable, the assistant says so rather than presenting unrelated civic content.
- Gemini failure logs include the model and HTTP status without exposing the API key.

### Validation

- `npm test -- --run tests/chatbot.test.ts` — passed (21 tests).
- `npx tsc --noEmit` — passed.
- `npm run lint -- --quiet` — passed.
- Live Gemini access still depends on a valid production key and available quota; server logs now report upstream status codes for diagnosis.

## 2026-10-14 — Codex — Production chatbot recovery and contained scrolling

### Changed files

- `app/api/chatbot/route.ts`
- `lib/gemini.ts`
- `components/chatbot/ChatInterface.tsx`
- `tests/chatbot.test.ts`
- `.env.example`
- `README.md`

### Final behavior

- Greetings, assistant identity, and secret-extraction refusals are answered locally before Redis or Gemini is contacted.
- An unavailable Upstash rate-limit service is logged and bypassed for the request instead of causing every chatbot message to return HTTP 500.
- Local knowledge retrieval failures are isolated, logged, and allowed to fall back to general Gemini assistance.
- Both `GEMINI_MODEL` and the deployment's existing `GEMINI_CHAT_MODEL` variable are supported.
- Automatic message scrolling now targets the internal message panel with `scrollTo`; it no longer calls `scrollIntoView`, which moved the entire page.
- The internal panel has `min-h-0` so it remains the scroll container in the flex layout.

### Validation

- `npm test -- --run tests/chatbot.test.ts` — passed (15 tests).
- `npx tsc --noEmit` — passed.
- `npm run lint -- --quiet` — passed.
- `npm run build` — blocked before application compilation by the local Windows installation's missing `@swc/core` native binding and SWC cache ACL validation. The same host dependency failure occurred outside the sandbox and with a workspace-local cache; it is unrelated to the changed TypeScript and does not apply to Vercel's Linux builder.

## 2026-10-14 — Codex — Chatbot answer-quality and general-assistance upgrade

### Changed files

- `app/api/chatbot/route.ts`
- `lib/gemini.ts`
- `components/chatbot/ChatInterface.tsx`
- `messages/en.json`, `messages/mr.json`, `messages/hi.json`
- `tests/chatbot.test.ts`
- `.env.example`
- `README.md`

### Final behavior

- The assistant can answer general questions through Gemini in addition to Paithan questions.
- Paithan/local questions remain grounded in the repository knowledge base and receive local source links.
- General answers do not receive misleading Paithan source links.
- Gemini is instructed to answer directly in 40–120 words by default and return a structured JSON object containing one answer string.
- Responses are whitespace-normalized and capped before they reach the UI.
- Up to eight valid recent messages are retained for conversational continuity; invalid roles and oversized history are discarded.
- The route uses `gemini-2.5-flash` and `gemini-2.5-flash-lite`, with optional `GEMINI_MODEL` override.
- When Gemini is unavailable, local Paithan questions still receive a compact knowledge-base response. General questions receive an honest temporary-unavailability message rather than fabricated content.

### Important limitations

- This is prompt, retrieval, validation, and orchestration work; it does not fine-tune or retrain Google's foundation model.
- No model can guarantee a correct answer to every possible question. General answers do not have live web search and can be outdated.
- Free-tier keys may have lower quotas or rate limits, but free-tier access does not inherently cause badly formatted responses.
- Local factual quality still depends on the accuracy of `lib/rag.ts`; conflicting civic facts must be verified before production publication.

### Validation

- `npm test -- --run tests/chatbot.test.ts` — passed (14 tests).
- `npx tsc --noEmit` — passed.
- `npm run lint -- --quiet` — passed.
- A live Gemini request was not executed during validation, so deployed API-key permissions and quota must still be confirmed in the target environment.
