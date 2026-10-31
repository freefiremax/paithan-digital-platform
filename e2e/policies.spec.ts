import { test, expect } from '@playwright/test';
for (const locale of ['en', 'mr', 'hi']) {
  test(`${locale} policy pages have readable sections and preserve locale`, async ({ page, context, baseURL }) => {
    await page.setViewportSize({ width: locale === 'en' ? 1440 : 390, height: 900 });
    await context.addCookies([{ name: 'paithan_consent', value: 'v1.a0', url: baseURL! }]);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const kind of ['privacy', 'terms', 'copyright', 'hyperlinking', 'disclaimer', 'accessibility']) {
      const response = await page.goto(`/${locale}/policies/${kind}`, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('article time')).toHaveAttribute('datetime', '2026-10-31');
      await expect(page.locator('article section ul li').first()).toBeVisible();
      if (kind === 'privacy') await expect(page.locator('article section h2').first()).toHaveText(/^1\./);
      if (kind === 'terms') {
        const sections = page.locator('[data-policy-accordion]');
        await expect(sections.first()).toHaveAttribute('open', '');
        await sections.nth(1).locator('summary').click();
        await expect(sections.nth(1)).toHaveAttribute('open', '');
        await expect(sections.first()).not.toHaveAttribute('open', '');
        await sections.nth(1).locator('summary').press('Enter');
        await expect(sections.nth(1)).not.toHaveAttribute('open', '');
        // A contents link must reveal the corresponding closed terms section.
        await page.locator('article a[href="#section-2"]').click();
        await expect(sections.nth(1)).toHaveAttribute('open', '');
        await expect(page.locator('#section-2')).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
      await expect(page.locator(`article a[href="/${locale}/contact"]`)).toBeVisible();
      await expect(page.locator(`a[href="/${locale}/policies"]`)).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}
