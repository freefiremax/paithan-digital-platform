import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context, baseURL }) => {
  await context.addCookies([{ name: 'paithan_consent', value: 'v1.a0', url: baseURL! }]);
});

for (const locale of ['en', 'mr', 'hi']) {
  for (const mode of ['login', 'register', 'admin/login']) {
    test(`${locale} ${mode} stays light and readable on mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/${locale}/${mode}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('#auth-email')).toBeVisible();
      await expect(page.locator('#auth-password')).toBeVisible();
      await expect(page.locator('#auth-password')).toHaveAttribute('type', 'password');
      const visibility = page.locator('button[aria-pressed]');
      await visibility.click();
      await expect(page.locator('#auth-password')).toHaveAttribute('type', 'text');
      await visibility.click();
      const appearance = await page.evaluate(() => {
        const main = document.querySelector('main')!;
        const surface = main.parentElement!;
        return { scheme: getComputedStyle(surface).colorScheme, background: getComputedStyle(surface).backgroundColor, overflow: document.documentElement.scrollWidth > innerWidth, rawKeys: /(?:login|register|auth)\.(?:emailLabel|submitBtn|passwordLabel)/.test(document.body.innerText) };
      });
      expect(appearance.scheme).toBe('light');
      expect(appearance.background).toBe('rgb(253, 247, 238)');
      expect(appearance.overflow).toBe(false);
      expect(appearance.rawKeys).toBe(false);
    });
  }
}

test('registration success displays a confirmation on the sign-in page', async ({ page }) => {
  await page.goto('/en/login?registered=1&email=citizen%40example.com');
  await expect(page.getByRole('status').filter({ hasText: 'Account created successfully' })).toBeVisible();
  await expect(page.locator('#auth-email')).toHaveValue('citizen@example.com');
});

test('desktop auth pages show the heritage poster and civic guide', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/en/register');
  await expect(page.getByRole('complementary', { name: 'Paithan heritage' })).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'Portal guide' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Find a municipal service/ })).toHaveAttribute('href', '/en/services');
});

test('a missing account shows a registration action and carries the email forward', async ({ page }) => {
  // Isolated UI test: stub both the challenge and auth response; no live credentials are sent.
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.fulfill({ contentType: 'application/javascript', body: 'window.turnstile={render:(el,o)=>{setTimeout(()=>o.callback("ui-test-token"),0);return "test";},reset(){},remove(){}};' }));
  await page.route('**/api/auth/callback/credentials*', route => route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ url: 'https://paithan-digital-platform.vercel.app/en/login?error=CredentialsSignin&code=account_not_found' }) }));
  await page.goto('/en/login');
  await page.locator('#auth-email').fill('missing@example.com');
  await page.locator('#auth-password').fill('a-test-password');
  await expect(page.getByRole('status').filter({ hasText: 'Security check complete.' })).toBeVisible();
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  const notice = page.getByRole('region', { name: 'Citizen Sign In' }).getByRole('alert');
  await expect(notice).toContainText('No account was found');
  await notice.getByRole('link', { name: 'Register as a citizen' }).click();
  await expect(page.locator('#auth-email')).toHaveValue('missing@example.com');
});
