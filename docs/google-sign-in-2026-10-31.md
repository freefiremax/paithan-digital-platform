# Google sign-in follow-up — 31 October 2026

Read-only production checks returned HTTP 500 at /api/auth/providers, /api/auth/csrf and /api/auth/session before OAuth starts. This is a deployment authentication configuration failure, not evidence that Cloudflare rejected a user. The available refreshed Vercel CLI account (revenex-ventures) has no Paithan project; the owner project link is https://vercel.com/pymohan-s-projects/paithan-digital-platform. The browser-control runtime failed to initialise. The Vercel connector was subsequently authorised for the owner team and used to inspect and repair the production configuration.

## Code changes

All three auth routes now prepare a CSRF token in parallel with page/security-widget loading, then use the existing Auth.js native Google POST endpoint. This removes client provider-discovery and on-click CSRF round trips while retaining the framework's CSRF/state/PKCE handling. Failed preparation keeps the Google action disabled with a translated availability notice and retry; it never submits an empty token. Server Configuration errors no longer display a misleading Google-only error, and arbitrary URL error text is not reflected on council sign-in pages. Existing-email account-linking conflicts explain how to use the existing method; unsafe automatic linking remains disabled.

## Owner configuration and required live verification

Using the correct Vercel project/account, confirm a newly generated private AUTH_SECRET (or NEXTAUTH_SECRET), Google OAuth client ID and secret, the canonical application URL, database connectivity and the matching production/preview settings. Google Console must authorise https://paithan-digital-platform.vercel.app/api/auth/callback/google for this deployment. Redeploy after changing runtime settings. Do not restore the formerly published signing fallback, commit credentials, or paste secret values into chat. Once access is available, inspect safe server error codes and retest the auth endpoints before performing a real account sign-in and database-persistence check.

Primary references: [Auth.js React client](https://authjs.dev/reference/nextjs/react), [Google provider](https://authjs.dev/reference/core/providers/google), [OAuth provider configuration](https://authjs.dev/guides/configuring-oauth-providers). The local installed next-auth/react implementation was also inspected to verify the extra discovery/CSRF round trips.

The native POST browser tests use isolated CSRF and redirect fixtures and do not represent a real Google sign-in or a successful production session. Cloudflare has already been confirmed by the user to show a genuine checkbox/success in their normal browser; challenge duration remains provider-controlled and no success state is fabricated.

## Production repair and verified results

The first diagnostic deployment returned the safe Auth.js error code `MissingSecret`. An old `NEXTAUTH_SECRET` entry appeared in the project settings, but the running application had no usable signing secret. Created a cryptographically random 48-byte `AUTH_SECRET` as a sensitive Production environment variable, plus an independently generated sensitive Preview key, without storing either in this repository. Redeployed main commit `ce2ea071bd9fcf958029208becec2cc5247550f3` as production deployment `dpl_5gDFbHasMstrQUEmchTwtWNJKUre`.

Verified on the canonical production origin after that deployment became READY:

- `/api/auth/providers`, `/api/auth/csrf`, `/api/auth/session`: HTTP 200. An anonymous session returns null.
- Native Google sign-in POST with an actual server-issued CSRF token: HTTP 302 to `accounts.google.com/o/oauth2/v2/auth`, with a configured client ID, PKCE challenge and the canonical `/api/auth/callback/google` redirect URI.
- Real browser handoff reached Google's `/v3/signin/identifier` page, without invalid-client or redirect-URI-mismatch errors and without a page JavaScript exception. No credentials were entered.
- All four Google browser regression tests passed (three page variants plus failed-CSRF retry).
- Local lint and TypeScript passed; 266 unit tests passed. GitHub CI run `41183403118` passed Security Audit, Lint & TypeCheck, Tests and Build, including backend tests against its isolated PostgreSQL fixture.

A real user must still complete Google's consent/sign-in to verify the final provider callback, production account creation/linking and database persistence. The handoff checks do not establish that boundary. Existing-email accounts deliberately require the existing sign-in method rather than automatic linking.

Cloudflare script loading is prioritised and runs in parallel with CSRF preparation; pending challenges are preserved rather than replaced with a local timeout error. Cloudflare controls challenge duration and whether interaction is required. No fixed completion-time guarantee or simulated verification is used.
