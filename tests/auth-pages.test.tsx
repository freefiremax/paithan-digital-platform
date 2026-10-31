import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import AdminLoginPage from "@/app/[locale]/admin/login/page";
import { CitizenAuth } from "@/components/auth/CitizenAuth";
import en from "@/messages/en.json";
import mr from "@/messages/mr.json";
import hi from "@/messages/hi.json";

const navigation = vi.hoisted(() => ({ query: "" }));
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(navigation.query), useRouter: () => ({ push: vi.fn() }) }));
vi.mock("next-auth/react", () => ({ signIn: vi.fn(), useSession: () => ({ data: null, status: "unauthenticated" }), getCsrfToken: vi.fn(async () => "test-token") }));

// Render with real dictionaries: any missing key is a regression, not a fallback.
for (const [locale, messages] of Object.entries({ en, mr, hi })) {
  describe(`${locale} citizen authentication pages`, () => {
    for (const mode of ["login", "register"] as const) {
      it(`renders ${mode} with translated, labelled form controls`, () => {
        const errors: unknown[] = [];
        const markup = renderToStaticMarkup(<NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Kolkata" onError={error => errors.push(error)}><CitizenAuth mode={mode} /></NextIntlClientProvider>);
        expect(errors).toEqual([]);
        expect(markup).toContain(messages[mode].title);
        expect(markup).toContain('for="auth-email"');
        expect(markup).toContain('autoComplete="email"');
        expect(markup).toContain('for="auth-password"');
        expect(markup).toContain('aria-label="' + messages.auth.showPassword + '"');
        expect(markup).toContain('href="/' + locale + '/policies/privacy"');
        expect(markup).not.toMatch(/(?:login|register|auth)\.(?:emailLabel|submitBtn|passwordPlaceholder)/);
        if (mode === "register") expect(markup).toContain('autoComplete="new-password"');
      });
    }
  });
}

for (const [locale, messages] of Object.entries({ en, mr, hi })) {
  it(`renders the ${locale} council sign-in with translated photo descriptions`, () => {
    const errors: unknown[] = [];
    const markup = renderToStaticMarkup(<NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Kolkata" onError={error => errors.push(error)}><AdminLoginPage /></NextIntlClientProvider>);
    expect(errors).toEqual([]);
    expect(markup).toContain('data-auth-page="admin"');
    expect(markup).toContain(messages.authPhotos.photo0);
    expect(markup).toContain('name="csrfToken"');
  });
}


it('identifies a server configuration failure instead of blaming Google', () => {
  navigation.query = 'error=Configuration';
  try {
    const html = renderToStaticMarkup(<NextIntlClientProvider locale="en" messages={en} timeZone="Asia/Kolkata"><CitizenAuth mode="login"/></NextIntlClientProvider>);
    expect(html).toContain(en.auth.signInUnavailable);
    expect(html).not.toContain(en.auth.googleError);
    expect(html).toContain('action="/api/auth/signin/google"');
  } finally { navigation.query = ''; }
});

it('does not reflect arbitrary authentication error text from a URL', () => {
  navigation.query = 'error=Untrusted-message-not-from-the-council';
  try {
    const html = renderToStaticMarkup(<NextIntlClientProvider locale="en" messages={en} timeZone="Asia/Kolkata"><AdminLoginPage/></NextIntlClientProvider>);
    expect(html).toContain(en.auth.signInError);
    expect(html).not.toContain('Untrusted-message-not-from-the-council');
  } finally { navigation.query = ''; }
});
