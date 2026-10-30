import { test, expect } from '@playwright/test';

for (const locale of ['en', 'mr', 'hi']) {
  for (const mode of ['login', 'register']) {
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
