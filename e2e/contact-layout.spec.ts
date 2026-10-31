import { test, expect } from '@playwright/test';
for (const locale of ['en', 'mr', 'hi']) {
  for (const width of [390, 1024]) {
    test(`${locale} contact details fit at ${width}px without untranslated keys`, async ({ page, context, baseURL }) => {
      await context.addCookies([{ name: 'paithan_consent', value: 'v1.a0', url: baseURL! }]);
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/contact`);
      await expect(page.locator('#helplines-heading')).toBeVisible();
      await expect(page.locator('#wim-heading')).toBeVisible();
      expect(await page.locator('main').innerText()).not.toMatch(/contact\.(?:nationalHelplines|localHelplines|webInfoManager|helpline)/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
      expect(await page.locator('a[href^="tel:"]').evaluateAll(nodes => nodes.every(node => { const bounds = node.getBoundingClientRect(); return bounds.left >= 0 && bounds.right <= innerWidth; }))).toBe(true);
    });
  }
}


for (const [locale, width] of [['en', 390], ['mr', 390], ['hi', 390], ['en', 1024]] as const) {
  test(`${locale} homepage masthead fits ${width}px and keeps navigation reachable`, async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: 'paithan_consent', value: 'v1.a0', url: baseURL! }]);
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.header-masthead')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    const branding = page.locator('.header-masthead a').first();
    const box = await branding.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    if (width < 1024) {
      const buttons = await page.locator('.header-masthead button[aria-expanded]').all();
      for (const button of buttons) if (await button.isVisible()) await expect(button).toBeInViewport();
    }
  });
}
