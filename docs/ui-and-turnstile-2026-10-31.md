# Contact, policy and Turnstile follow-up — 31 October 2026

## Contact and policy presentation

The contact page was rendering translation keys because the helpline and website-manager components referenced missing dictionary entries. All displayed labels are now available in English, Marathi and Hindi. Responsive cards use available container space instead of forcing four local numbers into a narrow section. Fabricated officer names, an unconfigured wim@ address and extension placeholders have been removed; the page uses the existing published council contact directory and explicitly identifies unconfirmed local entries.

All six policy documents now use section headings and bullet points, with an anchored contents sidebar, a related-policy navigation row, an update date and council contact links. The index uses the same light paper, burgundy and teal design. A missing hyperlinking title was found by rendering all six policy kinds against all three real dictionaries. Locale time zones are explicitly configured to prevent environment fallback warnings. The source documents remain consistent with the prior researched policy content; presentation changes do not create a legal certification.

## Turnstile lifecycle

- Tokens are renewed before their five-minute lifetime expires, and invalidated before resetting the widget.
- Returning from a background tab rechecks stale verified/checking state. Browser online events remount failed widgets, including script-loading failures.
- Interactive challenges have a bounded timeout; users are never left in an indefinite interactive state without a retry action.
- Native provider refresh/retry is enabled. The custom token callback is the single source of form state, rather than a second automatically inserted form field.
- Missing or partial provider configuration cannot silently disable server verification in production.
- Loader tests cover a previously resolved API disappearing during navigation or network recovery.

Primary reference: [Cloudflare widget configuration](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/). Widget appearance settings cannot override an Invisible-mode key: if a visible checkbox is required, the account owner must configure the key in Managed mode and include the deployed hostname. Domain/provider outages and network-blocked scripts cannot be repaired by pretending a token was verified.

The independent Vercel authentication-secret/access blocker recorded in backend-security-review.md remains separate from these widget/UI fixes. No successful real sign-in is asserted without resolving and rechecking that deployment configuration.

## Compact authentication layout

Citizen sign-in, registration and council sign-in now share a centered card with outer margins, smaller vertical gaps, a two-column registration form and full-photo containment rather than cropping. Compact-height views retain password guidance for assistive technology while the input placeholder still gives the minimum length. The page can grow when space is genuinely insufficient (for example browser zoom, an on-screen keyboard or additional error text); controls are never hidden with overflow clipping. Viewport checks cover all three languages and all three auth routes at 1366×768, 1280×720 and 390×844 using an explicitly isolated security fixture, not a real login or challenge.

## Photo fill and visible-widget follow-up

The latest user direction supersedes photo containment: slideshow images now use cover to fill the left panel edge-to-edge, accepting cropping instead of beige bands. The compact form dimensions are preserved. The custom security wrapper no longer draws a second oversized box around the provider UI or reserves a blank 65px placeholder when no provider content has appeared. Technical errors can be expanded separately; the retry action remains visible.

Read-only live diagnostics confirmed that the production key reports Managed mode and creates a genuine Cloudflare challenge iframe. This is not evidence that a real human verification completed. Standard normal/compact sizes replace flexible sizing; the provider script is preloaded and its origin preconnected during server rendering. A no-progress message offers retry after 15 seconds without removing or falsifying the live challenge. Provider decisions, network restrictions and the separate deployment authentication configuration still govern real end-to-end success.

Live follow-up diagnostics with the real production key measured an interactive, visible 300×65px Cloudflare iframe after standard sizing. No human challenge was clicked or solved by automation. Full real-user completion remains subject to normal-browser confirmation. The security preload is high priority; only the active and next photo request eager loading, while the remaining images stay low priority until needed. Layout tests wait for DOM readiness and the security state rather than waiting for all noncritical slideshow image downloads.
