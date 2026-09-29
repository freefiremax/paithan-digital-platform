# Paithan Digital Platform — Security Documentation

## Threat Model

The Paithan Digital Platform is a civic portal for Paithan Municipal Council, Chhatrapati Sambhajinagar, Maharashtra. It serves two primary user groups:

1. **Public Citizens** — Read-only access to civic information, development works, facilities, heritage, and tourism data
2. **Authorized Municipal Staff** — Authenticated access to manage content (EDITOR) or administer the system (ADMIN)

### Assets to Protect

| Asset | Classification | Impact if Compromised |
|-------|---------------|----------------------|
| Civic data (works, facilities, sectors) | Public / Official Record | Misinformation to citizens, loss of trust |
| User credentials (email, argon2id hashes) | Confidential | Account takeover, privilege escalation |
| Session tokens (JWT) | Confidential | Session hijacking, unauthorized actions |
| Audit logs | Integrity-critical | Non-repudiation failure, compliance violation |
| Database (PostgreSQL) | Confidential + Integrity | Data breach, data corruption |

### Threat Actors

| Actor | Motivation | Capability |
|-------|------------|------------|
| External attacker | Defacement, data theft, disruption | Network access, automated tools |
| Malicious insider (compromised editor account) | Data manipulation, privilege escalation | Valid credentials, authorized access |
| Script kiddie | Defacement, DoS | Basic tools, no deep knowledge |

---

## Authentication & Authorization

### Auth Stack
- **NextAuth.js v5** (Auth.js) with **Credentials Provider**
- **Password Hashing**: Argon2id via `@node-rs/argon2` (memory-hard, side-channel resistant)
- **Session Strategy**: JWT with 7-day expiry, httpOnly Secure SameSite=Lax cookies
- **Session Rotation**: New JWT issued on every sign-in; password change invalidates all sessions

### Role-Based Access Control (RBAC)

| Role | Description | Permissions |
|------|-------------|-------------|
| `PUBLIC` | Unauthenticated citizens | Read all public APIs (`/api/sectors/*`, `/api/chatbot`) |
| `EDITOR` | Municipal staff creating/updating content | Create/Update/Delete works & facilities in assigned wards; Read all |
| `ADMIN` | System administrators | Full CRUD on all entities; User management; Verify records (`dataStatus=VERIFIED`) |

### Authorization Enforcement

- **Single Guard**: `lib/auth/guard.ts::requireAuth(requiredRole)` — used by **every** mutating route and server action
- **Deny by Default**: No permission → 403 Forbidden
- **IDOR Prevention**: Object-level access checks (`canAccessWork`, `canAccessFacility`) verify ownership/ward assignment before any operation
- **Verification Gate**: Only `ADMIN` can set `dataStatus=VERIFIED` (audited)

### Permission Matrix

| Resource | Read | Create | Update | Delete | Verify |
|----------|------|--------|--------|--------|--------|
| CivicSectorInfo | PUBLIC, EDITOR, ADMIN | — | ADMIN | — | ADMIN |
| DevelopmentWork | PUBLIC, EDITOR, ADMIN | EDITOR, ADMIN | EDITOR*, ADMIN | EDITOR*, ADMIN | ADMIN |
| Facility | PUBLIC, EDITOR, ADMIN | EDITOR, ADMIN | EDITOR*, ADMIN | EDITOR*, ADMIN | ADMIN |
| User | ADMIN | ADMIN | ADMIN | ADMIN | — |

*EDITOR: only own records or records in assigned ward

---

## Input Validation & Output Safety

### Validation Layer
- **Zod schemas** for every input boundary (route params, query, body, form data)
- `.strict()` — rejects unexpected fields
- Constraints: max lengths, enum values, numeric ranges (e.g., `progressPct 0–100`), URL format
- Parse at boundary → `400` with safe error shape on failure

### Database Access
- **Prisma ORM only** — parameterized queries, no raw SQL interpolation
- If `$queryRaw` needed: tagged-template parameterization only

### Output Encoding
- React auto-escapes — **no `dangerouslySetInnerHTML` with user data**
- Rich text (if introduced): strict allowlist sanitizer (DOMPurify)

### File Uploads
- Accept URLs or validated uploads only
- Validate content-type, size limits
- Store outside web root / object storage (Cloudinary)
- Never execute uploads

---

## Transport & Platform Hardening

### Security Headers (via Middleware)
| Header | Value |
|--------|-------|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'nonce-{NONCE}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` (production only) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

### CSRF Protection
- **Double-submit cookie pattern** with signed JWT (HS256, 1h expiry)
- Middleware validates `x-csrf-token` header or `paithan_csrf` cookie on **all mutating API requests** (POST/PUT/PATCH/DELETE)
- Server Actions: protected by Next.js built-in CSRF (origin check)

### CORS
- API routes locked to app origin(s)
- No wildcard on authenticated endpoints
- Auth endpoints (`/api/auth/*`) rate-limited separately

### Rate Limiting (Upstash Redis)
| Endpoint Class | Limit | Window |
|----------------|-------|--------|
| Auth (login, etc.) | 5 req | 1 min |
| API Mutations | 30 req | 1 min |
| API Reads | 100 req | 1 min |
| Returns `429 Too Many Requests` with `Retry-After` header |

### Bot/Abuse Protection
- Login: 5 attempts/min → lockout/backoff
- Same IP rate-limited across auth endpoints

---

## Secrets & Configuration

### Environment Variables (`.env.example` documented)
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Pooled PostgreSQL (Neon) with `sslmode=require` |
| `DIRECT_URL` | Yes | Direct PostgreSQL for migrations |
| `NEXTAUTH_SECRET` | Yes | ≥32 chars, high entropy |
| `NEXTAUTH_URL` | Yes | Canonical app URL |
| `CSRF_SECRET` | Yes | ≥32 chars for CSRF token signing |
| `UPSTASH_REDIS_REST_URL` | No | Redis for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | No | Redis token |
| `INITIAL_ADMIN_EMAIL/PASSWORD` | No | Bootstrap admin user |

### Boot-time Validation
- `lib/env.ts` parses all env with Zod — **fails fast** if missing/invalid
- No secrets in code, committed files, or logs

### Database Security
- **Least-privilege role**: App user has `SELECT/INSERT/UPDATE/DELETE` on app tables only
- **SSL enforced**: `sslmode=require` on all connections
- **Separate URLs**: `DATABASE_URL` (pooled) for app, `DIRECT_URL` for migrations
- **Migrations only via `prisma migrate`** — never `db push` in production
- **Row-Level Security** considered for multi-editor scoping; currently enforced in query layer

---

## Audit Logging

### Model
```prisma
model AuditLog {
  id        String      @id @default(cuid())
  actorId   String
  actor     User        @relation(fields: [actorId], references: [id])
  action    AuditAction // CREATE, UPDATE, DELETE, VERIFY
  entity    String      // e.g., "DevelopmentWork"
  entityId  String
  before    Json?       // pre-change snapshot
  after     Json?       // post-change snapshot
  ip        String?
  userAgent String?
  createdAt DateTime    @default(now())
}
```

### Guarantees
- Written **in same transaction** as the mutation (via `createAuditLog` helper)
- Cannot be bypassed — all mutating routes/actions call it
- Immutable (no update/delete endpoints for audit logs)
- Captures: actor, action, entity, entityId, before/after diff, IP, User-Agent, timestamp

---

## Error Handling & Information Leakage Prevention

### Uniform Error Contract
```json
{ "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }
```

### HTTP Status Codes
- `200` OK, `201` Created, `204` No Content
- `400` Validation Error, `401` Unauthenticated, `403` Forbidden
- `404` Not Found, `409` Conflict, `422` Unprocessable
- `429` Rate Limited, `500` Internal Error

### No Leakage Rules
- **Never** return stack traces, SQL, Prisma internals, or field-level auth failures
- **Login**: Same message for "user not found" and "wrong password" (prevents user enumeration)
- **Server-side logging only** for debug details (structured, no PII)

---

## Data Integrity (Core Principle)

> **Never fabricate civic data.** This is the project's foundational rule.

### Enforcement
- `dataStatus` enum: `VERIFIED` (checked against gazetted/dept source) or `SAMPLE_TBD` (illustrative)
- Default: `SAMPLE_TBD`
- UI **must** show "Sample / TBD — Confirm with Nagar Parishad" badge for non-VERIFIED
- Empty sectors render honest "records to be published from verified official sources" state
- Census 2011 statistics explicitly labeled
- No AI-generated imagery — image fields hold real URLs or stay empty with placeholder tag

---

## Deployment Security Checklist

- [ ] All env vars set in production (Vercel/Platform)
- [ ] `NEXTAUTH_SECRET` ≥32 chars, rotated periodically
- [ ] `CSRF_SECRET` ≥32 chars, rotated periodically
- [ ] Database: least-privilege role, SSL enforced, automated backups
- [ ] Upstash Redis: TLS enabled, ACLs configured
- [ ] CSP nonce generated per-request (middleware)
- [ ] HSTS preload submitted (after verification)
- [ ] `npm audit` clean (no high/critical)
- [ ] Dependencies pinned in `package-lock.json`
- [ ] CI pipeline passing (lint, typecheck, test, build, audit)

---

## Incident Response

1. **Detect**: Audit log anomalies, rate limit spikes, auth failures
2. **Contain**: Revoke compromised sessions (rotate `NEXTAUTH_SECRET`), disable affected user
3. **Investigate**: Audit log query for affected entity/timeframe
4. **Recover**: Restore from backup if data tampered; re-verify affected records
5. **Post-mortem**: Document timeline, root cause, mitigations

---

## Security Contacts

- **Primary**: Chief Officer, Paithan Municipal Council
- **Technical**: Platform maintainers (see `package.json` repository field)
- **Vulnerability Disclosure**: Email `security@paithan.gov.in` (or create `SECURITY.txt`)

---

## Compliance References

- **Maharashtra Nagar Parishad Act, 1965** — civic data governance
- **IT Act, 2000 (India)** — electronic records, audit trails
- **OWASP ASVS 4.0** — application security verification standard
- **CERT-In Guidelines** — incident reporting, secure configuration

---

*Last updated: 2026-09-29*
*Version: 1.0*