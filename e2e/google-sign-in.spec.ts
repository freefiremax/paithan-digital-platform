import { test, expect } from '@playwright/test';
for (const mode of ['login', 'register', 'admin/login']) {
  test(`${mode} Google handoff uses native POST and prepared CSRF without provider discovery`, async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: 'paithan_consent', value: 'v1.a0', url: baseURL! }]);
    await page.route('**/api/auth/session', route => route.fulfill({ contentType: 'application/json', body: 'null' }));
    await page.route('**/api/auth/csrf', route => route.fulfill({ contentType: 'application/json', body: '{"csrfToken":"csrf-fixture"}' }));
    let providerRequests = 0;
    await page.route('**/api/auth/providers', route => { providerRequests++; return route.fulfill({ contentType: 'application/json', body: '{}' }); });
    let submitted: URLSearchParams | null = null;
    await page.route('**/api/auth/signin/google', route => {
      expect(route.request().method()).toBe('POST');
      submitted = new URLSearchParams(route.request().postData() || '');
      return route.fulfill({ contentType: 'text/html', body: '<h1>Isolated OAuth handoff fixture</h1>' });
    });
    await page.goto(`/en/${mode}`, { waitUntil: 'domcontentloaded' });
    const google = page.getByRole('button', { name: 'Continue with Google', exact: true });
    await expect(google).toBeEnabled();
    await google.click();
    await expect(page.getByRole('heading', { name: 'Isolated OAuth handoff fixture' })).toBeVisible();
    expect(submitted).not.toBeNull();
    expect(submitted!.get('csrfToken')).toBe('csrf-fixture');
    expect(submitted!.get('callbackUrl')).toBe('/en');
    expect(providerRequests).toBe(0);
  });
}

test('server preparation errors show an availability message and can recover on retry', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'paithan_consent', value: 'v1.a0', url: baseURL! }]);
  await page.route('**/api/auth/session', route => route.fulfill({ contentType: 'application/json', body: 'null' }));
  let ready = false;
  await page.route('**/api/auth/csrf', route => ready ? route.fulfill({ contentType: 'application/json', body: '{"csrfToken":"csrf-fixture"}' }) : route.fulfill({ status: 503, contentType: 'application/json', body: '{}' }));
  await page.goto('/en/login', { waitUntil: 'domcontentloaded' });
  const google = page.getByRole('button', { name: 'Continue with Google', exact: true });
  await expect(page.getByRole('alert').filter({ hasText: 'Sign-in is temporarily unavailable' })).toBeVisible();
  await expect(google).toBeDisabled();
  await expect(page.getByText('Google sign-in could not complete. Please try again.', { exact: true })).toHaveCount(0);
  ready = true;
  await page.getByRole('button', { name: 'Retry sign-in', exact: true }).click();
  await expect(google).toBeEnabled();
  await expect(page.getByRole('alert').filter({ hasText: 'Sign-in is temporarily unavailable' })).toHaveCount(0);
});
