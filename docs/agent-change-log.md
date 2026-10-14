# Agent Change Log

This is the handoff record for work performed by Codex, ChatGPT, Antigravity, and other coding agents. Add the newest entry at the top. Each entry must state the owner, affected files, final behavior, validation, and known limitations. Always inspect the live Git diff because this document does not replace version control.

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
