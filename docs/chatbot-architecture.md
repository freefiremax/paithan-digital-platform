# Chatbot implementation and operating guide

## Why the previous failures occurred

The existing bot searched a small manually maintained list using exact keywords, usually passed just one document to Gemini, and had no automatic connection to most public page copy. `cluture` did not match culture. Devanagari vowel marks were also being separated during tokenization. General AI answers were unavailable when the primary provider returned 503; the fallback model was verified to work locally. Previous fixed FAQs helped individual examples but did not address coverage.

The client had no request cancellation or submission lock, reset could race an in-flight reply, closing the floating panel discarded its conversation, and Markdown was displayed as raw text. The old unit tests sometimes called the live provider, making exact-answer assertions nondeterministic.

## Implemented architecture

`npm run chatbot:ingest` discovers eligible `app/[locale]` pages and extracts public JSX copy, local editorial data, and referenced translations without executing routes. Structured adapters add approved `lib/mock-data.ts` collections, navigation and all ward profiles. Private/auth/admin paths and records marked `SAMPLE_TBD` are excluded. Unknown static claims remain website claims, not verified official facts.

The generated `lib/generated/chatbot-index.json` contains chunks with stable IDs, text hashes, original URLs, language, category, reliability, source type and file/data timestamps. Hashes support idempotent refreshes. Replacing the snapshot removes deleted sources. The ingestion report lists updated, unchanged, removed, skipped and failed items. The build runs ingestion automatically, so changing website content and deploying refreshes the bundled index. File timestamps are not official publication dates.

At request time, retrieval combines title matching, term matching with inverse document frequency, typo normalization, multilingual aliases, language preference, and optional cosine semantic retrieval. It collects up to six relevant chunks, removes duplicate IDs and limits repeated pages. Existing curated civic references remain a complementary source. Unrelated educational questions bypass municipal evidence. General and ordinal follow-ups use bounded recent history; the model receives the original question plus relevant evidence.

The public database adapter reads only approved fields from verified civic-sector, facility and development-work records, plus published notifications. It never reads citizen grievances, users, accounts, sessions, private submissions, creator details or audit logs. A 60-second per-instance cache and a 2.5-second foreground deadline keep retrieval bounded. Database failures produce an empty dynamic result rather than presenting an old cache as current.

Gemini uses configurable server-side model IDs, two bounded attempts, a structured answer and source-index schema, and instructions against invented current official facts. Only source indexes returned by the model are shown as citations. Local reference summaries remain available during an outage and are labeled in the UI. Stable culture, locality, greeting and heritage overviews can answer locally. General knowledge still requires an available model; this is not model fine-tuning.

## Public content covered

| Content | Adapter |
| --- | --- |
| Public homepage, heritage, tourism, council, services and contact pages | Page copy and referenced translations |
| Policies, sitemap and grievance form instructions | Public page/translation extraction; no submitted values |
| Wards and locality descriptions | Shared ward profiles, all 17 detail URLs |
| Tourist places, visitor routes, history, eligible museum material | Approved public export collections |
| Navigation and service links | Navigation/citizen-service adapters |
| Notices, sectors, facilities and works | Explicit public Prisma selects; verified records where supported |
| Local public PDF text | Optional `.pdf.txt` sidecar; no PDFs currently present under `public/` |

This is source-aware extraction, not a browser rendering crawler. Copy computed by an unsupported component or data source needs an explicit adapter. Dynamic ward and sector templates are not crawled as literal bracket URLs. Sector data is covered through the public database adapter; sample sectors are not treated as official records. The generated skip report makes exclusions visible.

## Refresh, administration and diagnostics

1. Run `npm run chatbot:ingest` after editorial changes, or deploy normally: the build runs it.
2. Run `npm run chatbot:evaluate` for offline regression checks.
3. Sign in as an administrator and open `/{locale}/admin/chatbot`. The sidebar includes this page for admins. Inspect source metadata, run a small retrieval evaluation, or check live provider connectivity.
4. Use **Refresh public index** to publish an owned snapshot to the existing Neon `ChatbotChunk` table. The authenticated API requires the ADMIN role, a same-origin POST and rate limiting. It replaces only rows with `sourceType = PUBLIC_WEBSITE_V1` in a transaction.
5. Alternatively run `npm run chatbot:publish` locally with `.env` configured. It uses the same restricted adapters and ownership prefix. No database migration is needed.

Structured logs include request ID, status, engine, retrieval counts, retrieval/generation/total latency and provider token counts when returned. They do not include query text, conversation history, IP addresses, credentials or retrieved document bodies. Public responses include a request ID for troubleshooting. Admin status reports configured credentials as a boolean only; use the live check to verify actual availability.

## Optional semantic retrieval

Lexical retrieval works immediately without new credentials. Semantic search is off by default. Set `CHATBOT_SEMANTIC_SEARCH=true` only when you intend to send public chunks and query text to the Google embedding API and have appropriate quota. `GEMINI_EMBED_MODEL` defaults to `gemini-embedding-001`; the adapter requests 768-dimensional vectors and normalizes similarity with cosine scoring. See [Google's embedding documentation](https://ai.google.dev/gemini-api/docs/embeddings).

Use the CLI publisher to populate vectors in bounded batches (up to eight new successful embeddings per invocation); repeated publishing reuses unchanged vectors and progresses through missing vectors. Embedded snapshots live in existing `ChatbotChunk.content` JSON. Retrieval considers only hashes still present in the current bundle/live data, so deleted or changed sources are not resurrected. No pgvector schema change or paid vector service is introduced. The admin serverless refresh rejects embedding mode to avoid a long-running job. Vector scans are capped at 500 rows; this implementation is designed for this portal's small corpus, not an unbounded corpus.

No live web-search account is configured. `external-search.ts` defines a provider-neutral interface but returns no external evidence. The assistant does not claim live browsing, official source verification or current-event coverage.

## Environment and production activation

Existing `GEMINI_API_KEY` and database credentials remain server-side. New settings are optional and safely documented in `.env.example`: `CHATBOT_MODEL`, `CHATBOT_FALLBACK_MODEL`, `CHATBOT_TIMEOUT_MS`, `CHATBOT_MAX_OUTPUT_TOKENS`, and `CHATBOT_SEMANTIC_SEARCH`. Defaults work with the locally verified models. Legacy retired model IDs are migrated; explicit new overrides are validated.

Normal Vercel deployment activates the bundled public index with no manual action. To enable optional database snapshot storage, use the admin refresh or CLI publisher. Optional embeddings need explicit opt-in and publishing. Production general answers require the deployed Gemini key to be valid and have quota; local connectivity does not prove production credentials.

## Validation and remaining limits

The evaluation suite covers greetings, introductions, ward/site navigation, culture and tourism, English/Marathi/Hindi and Romanized aliases, typos, follow-ups, multi-page retrieval, general educational answers, missing evidence, malformed/oversized requests, unsafe URLs, secret requests, provider outages and admin authorization. Model responses are mocked in offline tests. `npm run chatbot:verify-live` separately exercises representative real handler requests and provider connectivity.

The final local full suite passed 162 tests across 11 files, and TypeScript, lint and whitespace checks passed. The targeted chatbot suite passed 70 tests. Live handler checks returned HTTP 200 for English/Marathi/Hindi culture, birds and science. Primary Gemini 3.8 returned 503 during live checks and Gemini 3.5 Flash-Lite successfully answered the science question. Neon publishing created 215 owned public chunks, and a read-only count confirmed 215 stored rows; embeddings remained off.

The local Windows production build was attempted both inside and outside the sandbox. Both stopped before app compilation because the installed SWC native binding/cache failed its Windows permission validation. Linux GitHub/Vercel builds must verify the production compilation.

Remaining content limits are visible rather than filled with guesses: official ward boundaries remain unconfirmed; some published website facts conflict or lack authoritative dates; image content/OCR and arbitrary external PDFs are not extracted; no external live search is configured; embeddings remain optional and inactive by default; source language coverage follows existing translations, with model translation required for other indexed prose. No system can guarantee an accurate answer for every question or during a provider outage.
