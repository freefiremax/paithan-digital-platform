import { test, expect } from '@playwright/test';
for (const locale of ['en', 'mr', 'hi']) {
  for (const mode of ['login', 'register', 'admin/login']) {
    for (const viewport of [{ width: 1366, height: 768 }, { width: 1280, height: 720 }, { width: 390, height: 844 }]) {
      test(`${locale} ${mode} fits ${viewport.width}x${viewport.height}`, async ({ page, context, baseURL }) => {
        await page.setViewportSize(viewport);
        await context.addCookies([{ name: 'paithan_consent', value: 'v1.a0', url: baseURL! }]);
        // Layout-only test: no real login or security challenge is submitted.
        await page.route('**/api/auth/session', route => route.fulfill({ contentType: 'application/json', body: 'null' }));
        await page.route('**/api/auth/csrf', route => route.fulfill({ contentType: 'application/json', body: '{"csrfToken":"layout-only"}' }));
        await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.fulfill({ contentType: 'application/javascript', body: 'window.turnstile={render:(el,o)=>{const box=document.createElement("div");box.style.height="65px";box.textContent="Cloudflare layout fixture";el.appendChild(box);setTimeout(()=>o.callback("layout-only-token"),0);return "fixture";},reset(){},remove(){}};' }));
        await page.goto(`/${locale}/${mode}`, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('[data-turnstile-status]')).toHaveAttribute('data-turnstile-status', 'verified');
        const dimensions = await page.evaluate(() => ({ page: document.documentElement.scrollHeight, height: innerHeight, width: document.documentElement.scrollWidth, viewport: innerWidth }));
        expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport);
        expect(dimensions.page).toBeLessThanOrEqual(dimensions.height + 1);
        const submit = page.locator('form[aria-busy] button[type="submit"]');
        await expect(submit).toBeInViewport();
        await expect(page.locator('[data-auth-slideshow] [data-active="true"] img')).toHaveCSS('object-fit', 'cover');
        const panel = await page.locator('main').boundingBox();
        expect(panel!.x).toBeGreaterThan(0);
        expect(panel!.y).toBeGreaterThan(0);
        expect(panel!.y + panel!.height).toBeLessThan(viewport.height);
      });
    }
  }
}
