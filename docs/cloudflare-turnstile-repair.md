# Cloudflare Turnstile repair review

Date: 2026-10-26. User approved committing and pushing the Cloudflare repair after successful live hostname verification.

## Confirmed code findings

- The site-wide gate previously treated widget errors, expiry, exceptions, a 4.5-second timer and a manual proceed button as successful verification. Tokens were never sent to Siteverify.
- The gate and forms loaded separate Turnstile script URLs. The forms used a single global onload callback that could be overwritten.
- Inline parent callbacks were effect dependencies, so typing could remove and recreate the form widget.
- Submitted tokens were not consistently replaced for subsequent attempts. Cloudflare tokens are single-use and expire after five minutes.

## Local changes

- One shared explicit-rendering widget with Next Script onReady, stable callback refs, cleanup, visible error codes, expiry reset and an explicit retry action.
- A rate-limited /api/security/verify endpoint validates the gate token server-side. The gate no longer uses fake Ray IDs, simulated success, bypass buttons or sessionStorage as proof of verification.
- The gate remains a presentation check, not a WAF or access-control boundary. Existing protected form APIs independently validate fresh tokens. No Cloudflare DNS/WAF settings are changed.
- Contact and grievance forms clear consumed tokens and remount the widget after submission attempts.
- Siteverify requests have a 10-second timeout, no caching, token length checks and rejection of failed HTTP responses or malformed results.

## Validation

- 14 focused server/endpoint tests passed (tests/turnstile.test.ts and tests/security-verify.test.ts).
- Browser harness with mocked Cloudflare: stable widget across parent rerenders, expiry clearing/reset, error retry, backend rejection staying blocked and backend success allowing content all passed.
- TypeScript and targeted ESLint checks passed.
- These are code and simulated-provider checks, not a successful live Cloudflare challenge.

## Live configuration still to confirm

The reported Troubleshoot message has not yet been mapped to an exact Cloudflare error code. Both keys are present in .env; presence alone does not confirm they are valid or that Vercel uses the same keys. Check the deployed site's NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY, widget key pairing and Cloudflare's allowed hostnames. Preview deployment hostnames may differ from the production hostname. Never publish the secret key. If a key or hostname setting is incorrect, that dashboard change is required in addition to these fixes.

No real challenge token was available for live Siteverify testing. Unrelated existing local edits are excluded from this repair.

## Official references

- Server validation, single-use tokens and expiry: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- Explicit widget rendering: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
- Client error codes and hostname mismatches: https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/

## Live verification, 2026-10-26

Opened https://paithan-digital-platform.vercel.app/en and /en/contact in a browser without submitting a form or interacting with a CAPTCHA. The contact widget logged `[Cloudflare Turnstile] Error: 110200.` from the deployed Turnstile script. Cloudflare documents 110200 as Domain not authorized: the current hostname is not in the widget allowed-hostname list.

Confirmed live configuration action: in the Cloudflare Turnstile widget matching the deployed public site key, add `paithan-digital-platform.vercel.app` as an allowed hostname (hostname only, no https:// or /en). Retest with a fresh page load. Local code fixes improve reliability but cannot repair an account-level hostname restriction. No Cloudflare account settings were changed, no CAPTCHA was solved, and nothing was pushed.

## Hostname update retest

After the user added the production hostname, a new browser tab at /en/contact no longer logged error 110200. The Turnstile iframe rendered the Verifying state. This confirms the previous immediate hostname rejection was no longer reproduced; it does not by itself prove a completed challenge or server-side verification. No form was submitted.

Final observation: the contact form subsequently displayed the green status "Verified by Cloudflare Turnstile" automatically, with no Turnstile warnings in the fresh tab. Client-side verification now succeeds after the hostname change. Backend form submission was not tested and no real contact message was sent. Code repairs remain uncommitted and unpushed pending user approval.
