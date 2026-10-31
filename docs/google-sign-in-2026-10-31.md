# Google sign-in follow-up — 31 October 2026

Read-only production checks returned HTTP 500 at /api/auth/providers, /api/auth/csrf and /api/auth/session before OAuth starts. This is a deployment authentication configuration failure, not evidence that Cloudflare rejected a user. The available refreshed Vercel CLI account (revenex-ventures) has no Paithan project; the owner project link is https://vercel.com/pymohan-s-projects/paithan-digital-platform. The browser-control runtime failed to initialise. A Vercel integration was discovered and suggested as another authenticated access path; connection is not assumed.

## Code changes

All three auth routes now prepare a CSRF token in parallel with page/security-widget loading, then use the existing Auth.js native Google POST endpoint. This removes client provider-discovery and on-click CSRF round trips while retaining the framework's CSRF/state/PKCE handling. Failed preparation keeps the Google action disabled with a translated availability notice and retry; it never submits an empty token. Server Configuration errors no longer display a misleading Google-only error, and arbitrary URL error text is not reflected on council sign-in pages. Existing-email account-linking conflicts explain how to use the existing method; unsafe automatic linking remains disabled.

## Owner configuration and required live verification

Using the correct Vercel project/account, confirm a newly generated private AUTH_SECRET (or NEXTAUTH_SECRET), Google OAuth client ID and secret, the canonical application URL, database connectivity and the matching production/preview settings. Google Console must authorise https://paithan-digital-platform.vercel.app/api/auth/callback/google for this deployment. Redeploy after changing runtime settings. Do not restore the formerly published signing fallback, commit credentials, or paste secret values into chat. Once access is available, inspect safe server error codes and retest the auth endpoints before performing a real account sign-in and database-persistence check.

Primary references: [Auth.js React client](https://authjs.dev/reference/nextjs/react), [Google provider](https://authjs.dev/reference/core/providers/google), [OAuth provider configuration](https://authjs.dev/guides/configuring-oauth-providers). The local installed next-auth/react implementation was also inspected to verify the extra discovery/CSRF round trips.

The native POST browser tests use isolated CSRF and redirect fixtures and do not represent a real Google sign-in or a successful production session. Cloudflare has already been confirmed by the user to show a genuine checkbox/success in their normal browser; challenge duration remains provider-controlled and no success state is fabricated.
