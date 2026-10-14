# Agent Change Log

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
