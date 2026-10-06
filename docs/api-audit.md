# API Completeness Audit - Paithan Digital Platform

## Current API Routes (24 routes)

| Route | Method(s) | Auth | Purpose | Status |
|-------|-----------|------|---------|--------|
| `/api/auth/[...nextauth]` | GET, POST | Public | NextAuth.js handlers | ✅ Implemented |
| `/api/auth/register` | POST | Public | Public user registration | ✅ Implemented |
| `/api/chatbot` | POST | Public (rate-limited) | AI chatbot | ✅ Implemented |
| `/api/contact` | POST | Public (rate-limited) | Contact form | ✅ Implemented |
| `/api/grievances` | POST | Public (rate-limited + Turnstile) | Submit grievance | ✅ Implemented |
| `/api/grievances/track` | GET | Public (rate-limited) | Track grievance | ✅ Implemented |
| `/api/search` | GET | Public (rate-limited) | Search across sectors | ✅ Implemented |
| `/api/sectors` | GET | Public (cached) | List all sectors | ✅ Implemented |
| `/api/sectors/[sector]` | GET, PATCH | GET: Public, PATCH: Editor/Admin | Sector details + update | ✅ Implemented |
| `/api/sectors/[sector]/works` | GET, POST | GET: Public, POST: Editor/Admin | Works in sector | ✅ Implemented |
| `/api/sectors/[sector]/works/[id]` | GET, PATCH, DELETE | Editor/Admin | Work CRUD | ✅ Implemented |
| `/api/sectors/[sector]/facilities` | GET, POST | GET: Public, POST: Editor/Admin | Facilities in sector | ✅ Implemented |
| `/api/sectors/[sector]/facilities/[id]` | GET, PATCH, DELETE | Editor/Admin | Facility CRUD | ✅ Implemented |
| `/api/admin/wards` | GET | Admin | List wards | ✅ Implemented |
| `/api/admin/users` | GET, POST | Admin | User management | ✅ Implemented |
| `/api/admin/users/[id]` | GET, PATCH, DELETE | Admin | User CRUD | ✅ Implemented |
| `/api/admin/sectors/[sector]` | GET, PATCH | Admin | Sector admin | ✅ Implemented |
| `/api/admin/sectors/[sector]/verify` | POST | Admin | Verify sector content | ✅ Implemented |
| `/api/admin/facilities` | GET, POST | Admin | Facility admin | ✅ Implemented |
| `/api/admin/facilities/[id]` | GET, PATCH, DELETE | Admin | Facility CRUD | ✅ Implemented |
| `/api/admin/facilities/[id]/verify` | POST | Admin | Verify facility | ✅ Implemented |
| `/api/admin/grievances` | GET | Admin | List grievances | ✅ Implemented |
| `/api/admin/grievances/[id]` | PATCH | Admin | Update grievance status | ✅ Implemented |
| `/api/upload` | POST | Authenticated | Cloudinary upload | ✅ Implemented |
| `/api/upload/[publicId]` | DELETE | Authenticated | Cloudinary delete | ✅ Implemented |
| `/api/sentry-test` | GET | Dev only | Sentry test endpoint | ✅ Implemented |

## Frontend Pages ↔ API Mapping

| Frontend Page | API Calls | Status |
|---------------|-----------|--------|
| `/register` | `POST /api/auth/register` | ✅ |
| `/admin/login` | NextAuth `signIn("credentials")` | ✅ |
| `/admin/dashboard` | Session check via `useSession()` | ✅ |
| `/grievances/new` | `POST /api/grievances`, `POST /api/upload` | ✅ |
| `/grievances/track` | `GET /api/grievances/track` | ✅ |
| `/contact` | `POST /api/contact` | ✅ |
| `/chatbot` | `POST /api/chatbot` | ✅ |
| `/search` | `GET /api/search` | ✅ |
| `/services/[sector]` | `GET /api/sectors/[sector]` | ✅ |
| `/admin/users` | `GET/POST /api/admin/users` | ✅ |
| `/admin/sectors` | `GET/PATCH /api/admin/sectors/[sector]` | ✅ |
| `/admin/facilities` | `GET/POST /api/admin/facilities` | ✅ |
| `/admin/grievances` | `GET /api/admin/grievances`, `PATCH /api/admin/grievances/[id]` | ✅ |
| `/admin/development-works` | `GET/POST /api/sectors/[sector]/works` | ✅ |

## Missing / Recommended Endpoints

| Endpoint | Reason | Priority |
|----------|--------|----------|
| `GET /api/auth/session` | Exposed via NextAuth automatically | N/A (NextAuth) |
| `GET /api/auth/csrf` | Exposed via NextAuth automatically | N/A (NextAuth) |
| `POST /api/auth/signout` | Exposed via NextAuth automatically | N/A (NextAuth) |
| `GET /api/admin/users/[id]/wards` | For editor ward filtering | Medium |
| `GET /api/sectors/[sector]/stats` | Dashboard stats per sector | Low |
| `GET /api/grievances/stats` | Admin dashboard stats | Low |
| `POST /api/auth/forgot-password` | Password reset flow | Medium |
| `POST /api/auth/reset-password` | Password reset flow | Medium |

## Security Coverage

| Endpoint | Rate Limit | Auth | CSRF | Turnstile |
|----------|------------|------|------|-----------|
| `/api/auth/register` | ✅ (5/min) | Public | N/A | No |
| `/api/auth/[...nextauth]` | ✅ (5/min) | Credentials | N/A | Yes (optional) |
| `/api/chatbot` | ✅ (100/min) | Public | N/A | No |
| `/api/contact` | ✅ (30/min) | Public | ✅ | Yes |
| `/api/grievances` | ✅ (30/min) | Public | ✅ | Yes |
| `/api/grievances/track` | ✅ (10/min) | Public | N/A | No |
| `/api/upload` | ✅ (30/min) | Auth | ✅ | No |
| `/api/upload/[publicId]` | ✅ (30/min) | Auth | ✅ | No |
| All `/api/admin/*` | ✅ (30/100/min) | Admin | ✅ | No |

## Areas for Future Enhancement

1. **Email verification** - Add `POST /api/auth/verify-email` and `POST /api/auth/resend-verification`
2. **Password reset** - Add `POST /api/auth/forgot-password` and `POST /api/auth/reset-password`
3. **Webhook endpoints** - For external integrations (e.g., payment, SMS)
4. **Bulk operations** - `POST /api/admin/users/bulk`, `POST /api/admin/grievances/bulk-update`
5. **Export endpoints** - `GET /api/admin/grievances/export`, `GET /api/admin/users/export`
6. **Real-time updates** - WebSocket/SSE for grievance status changes
7. **API versioning** - `/api/v1/...` for breaking changes