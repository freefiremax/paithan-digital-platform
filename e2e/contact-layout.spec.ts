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
