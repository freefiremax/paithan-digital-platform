import { test, expect } from '@playwright/test';
for (const locale of ['en', 'mr', 'hi']) {
  test(`${locale} policy pages have readable sections and preserve locale`, async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: 'paithan_consent', value: 'v1.a0', url: baseURL! }]);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const kind of ['privacy', 'terms', 'copyright', 'hyperlinking', 'disclaimer', 'accessibility']) {
      const response = await page.goto(`/${locale}/policies/${kind}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('article time')).toHaveAttribute('datetime', '2026-10-31');
      await expect(page.locator('article section ul li').first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
      await expect(page.locator(`article a[href="/${locale}/contact"]`)).toBeVisible();
      await expect(page.locator(`a[href="/${locale}/policies"]`)).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}
