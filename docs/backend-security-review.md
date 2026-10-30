# Backend security review - 14 October 2026

30 October follow-up: registration now rejects role/ward input, JWT reads refresh database authorization, credential login enforces configured Turnstile and IP/email limits, and public/admin credential forms provide matching widgets. Actual callback and registration regression tests were added. The numbered findings below describe the original review; upload deletion ownership and the additional hardening findings remain open. Google account storage was confirmed using aggregate read-only counts, not a fresh sign-in.

Verdict: functional protections exist, but the backend cannot currently be considered secure for sensitive citizen data. This is a focused code review and read-only production check, not a penetration test or certification. No application code, accounts or assets were changed during this review.

## Priority findings

1. **Critical: public registration accepts privileged roles.** `app/api/auth/register/route.ts` parses the shared `createUserSchema` and persists `parsed.data.role` and `wardId`. The schema in `lib/validation/index.ts` accepts PUBLIC, EDITOR and ADMIN. The registration route has no authentication guard; middleware excludes API routes. Restrict public registration to PUBLIC with no assigned ward, using a dedicated schema; reserve elevated roles for database-authorized administrators. This was confirmed in source, not exercised against production.
2. **Critical: session updates can change authorization claims.** The JWT update callback in `lib/auth/auth.ts` copies client session `role` and `wardId`. Some routes/actions trust these claims directly: admin grievance GET/PATCH and `adminResetUserPassword`. Most other routes use the safer `requireAuth` database role lookup. Remove client-controlled authorization updates and use database-backed checks consistently. No forged session or password reset was attempted.
3. **High: upload deletion lacks ownership authorization.** `app/api/upload/[publicId]/route.ts` authenticates the caller but performs no asset ownership check before deletion. Use tracked ownership or a deliberately limited administrator-only policy until ownership exists. No production deletion was performed.
4. **High: credential login bot protection can be skipped.** `lib/auth/auth.ts` checks Turnstile only when a token is supplied, even when protection is enabled. Missing tokens must fail when enabled. No login-specific rate limiting is present in that authorize function; registration/chatbot limits do not cover password attempts. Add bounded distributed credential-login limits and tests.
5. **Additional hardening:** `lib/csrf.ts` has a known fallback signing secret and accepts cookie-only tokens; mutation origin/CSRF controls vary across APIs. Password changes claim session invalidation in comments but only revalidate a page; no session-version enforcement is shown. Upload JSON is decoded before the 5 MB file check, so a request-body cap should precede decoding. Grievance tracking puts phone numbers in GET URLs and returns personal details after ticket/phone matching; minimise exposure and use stronger access verification. Review public media delivery for grievance photographs. CSP allows unsafe-eval, unsafe-inline and unrestricted form destinations; tighten with appropriate framework compatibility testing.

## Controls observed

- Password hashing/verification uses Argon2; input validation uses Zod.
- Most protected APIs use database-backed role checks, and facility/work helpers implement ownership/ward checks.
- Cloudinary upload validation enforces a 5 MB decoded-file limit and checks supported image signatures.
- Rate limiting uses Upstash with a bounded per-instance fallback. Fallback protection is not globally shared across serverless instances.
- Chatbot database retrieval explicitly selects public content and excludes users, grievances and authentication records.
- Anonymous production GETs to `/api/admin/users`, `/api/admin/db-health` and `/api/admin/chatbot/knowledge` returned HTTP 401. `/api/auth/session` returned HTTP 200 with null.
- Existing backend suites passed: 58 tests across auth guard, auth flow, backend services, API routes and rate limiting. Passing these tests does not negate the uncovered findings; some auth-flow tests simulate logic rather than exercising actual callbacks.

## Limits and next work

No privileged account, real citizen record, registration, deletion, load test or destructive probe was used. Provider account policies, backup restoration, live role manipulation, full endpoint coverage and complete dependency auditing remain unverified. Rotate the API credential previously pasted into chat through the owner-controlled provider/Vercel flow. Fix the critical/high findings, add negative authorization regressions, deploy and recheck before claiming security readiness. There is no evidence from this review alone that an attacker has exploited these issues; account/role and audit-log review is appropriate after remediation.
