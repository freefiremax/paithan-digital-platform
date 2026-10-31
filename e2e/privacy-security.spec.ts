import { test, expect } from '@playwright/test';

test('cookie choices gate analytics and can be changed later', async ({ page, context }) => {
  let events = 0;
  await page.route('**/api/analytics', route => { events++; return route.fulfill({ status: 204 }); });
  await page.goto('/en/contact', { waitUntil: 'domcontentloaded' });
  const banner = page.getByRole('complementary', { name: 'Cookie choices' });
  await expect(banner).toBeVisible();
  expect(events).toBe(0);
  await banner.getByRole('button', { name: 'Accept cookies', exact: true }).click();
  await expect(banner).toBeHidden();
  await expect.poll(() => events).toBe(1);
  expect((await context.cookies()).find(cookie => cookie.name === 'paithan_consent')?.value).toBe('v1.a1');
  await page.getByRole('button', { name: 'Cookie preferences', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Cookie preferences' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel('Optional visitor analytics')).toBeChecked();
  await dialog.getByLabel('Optional visitor analytics').uncheck();
  await dialog.getByRole('button', { name: 'Save preferences' }).click();
  expect((await context.cookies()).find(cookie => cookie.name === 'paithan_consent')?.value).toBe('v1.a0');
  const before = events;
  await page.reload();
  await expect(page.getByRole('button', { name: 'Cookie preferences', exact: true })).toBeVisible();
  await expect(banner).toBeHidden();
  expect(events).toBe(before);
});

test('rejecting optional cookies does not disable Cloudflare', async ({ page }) => {
  let renderCount = 0;
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => {
    renderCount++;
    return route.fulfill({ contentType: 'application/javascript', body: 'window.turnstile={render:(el,o)=>{el.innerHTML="<div>Cloudflare test widget</div>";setTimeout(()=>o.callback("isolated-test-token"),0);return "test";},reset(){},remove(){}};' });
  });
  await page.goto('/en/login', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Reject optional cookies', exact: true }).click();
  const panel = page.locator('[data-turnstile-status]');
  await expect(panel).toHaveAttribute('data-turnstile-status', 'verified');
  await expect(panel).toContainText('Cloudflare Turnstile');
  await expect(panel).toContainText('Security check complete.');
  expect(renderCount).toBeGreaterThanOrEqual(1);
  await expect(panel.getByText("Cloudflare test widget", { exact: true })).toHaveCount(1);
});

test('a blocked Cloudflare script shows an error and retry recovers', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'paithan_consent', value: 'v1.a0', url: baseURL! }]);
  let loads = 0;
  let allowScript = false;
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => {
    loads++;
    if (!allowScript) return route.abort('failed');
    return route.fulfill({ contentType: 'application/javascript', body: 'window.turnstile={render:(el,o)=>{el.innerHTML="<div>Cloudflare test widget</div>";setTimeout(()=>o.callback("isolated-test-token"),0);return "test";},reset(){},remove(){}};' });
  });
  await page.goto('/en/login', { waitUntil: 'domcontentloaded' });
  const panel = page.locator('[data-turnstile-status]');
  await expect(panel).toHaveAttribute('data-turnstile-status', 'error');
  await expect(panel.getByRole('alert')).toContainText('could not finish');
  allowScript = true;
  await panel.getByRole('button', { name: 'Retry security check' }).click();
  await expect(panel).toHaveAttribute('data-turnstile-status', 'verified');
  expect(loads).toBeGreaterThanOrEqual(2);
});

test('slow verification stays pending and can still complete after the retry appears', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'paithan_consent', value: 'v1.a0', url: baseURL! }]);
  await page.clock.install();
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.fulfill({ contentType: 'application/javascript', body: `window.challengeRenders=0;window.challengeRemovals=0;window.challengeResets=0;window.turnstile={render:(el,o)=>{window.challengeRenders++;window.challengeOptions=o;return 'slow-test';},reset(){window.challengeResets++;},remove(){window.challengeRemovals++;}};` }));
  await page.goto('/en/login', { waitUntil: 'domcontentloaded' });
  const panel = page.locator('[data-turnstile-status]');
  await expect(panel).toHaveAttribute('data-turnstile-status', 'checking');
  await page.clock.fastForward(31000);
  await expect(panel).toHaveAttribute('data-turnstile-status', 'checking');
  await expect(panel.getByRole('alert')).toHaveCount(0);
  await expect(panel.getByRole('button', { name: 'Retry security check' })).toBeVisible();
  await expect(panel).not.toContainText('Security check complete.');
  // Returning to a tab must not restart a legitimate in-flight challenge.
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  const counters = await page.evaluate(() => { const w = window as unknown as { challengeRenders: number; challengeRemovals: number; challengeResets: number }; return [w.challengeRenders, w.challengeRemovals, w.challengeResets]; });
  expect(counters).toEqual([1, 0, 0]);
  await page.evaluate(() => (window as unknown as { challengeOptions: { callback: (token: string) => void } }).challengeOptions.callback('late-but-genuine-fixture-token'));
  await expect(panel).toHaveAttribute('data-turnstile-status', 'verified');
  await expect(panel.getByRole('button', { name: 'Retry security check' })).toHaveCount(0);
});

test('mobile cookie preferences fit the screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en/register', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Cookie preferences', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Cookie preferences' });
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await dialog.getByRole('button', { name: 'Reject optional cookies' }).click();
  await expect(dialog).toBeHidden();
});


test('cookie banner waits for the complete entry animation', async ({ page }) => {
  await page.clock.install();
  await page.goto('/en', { waitUntil: 'domcontentloaded' });
  const intro = page.locator('.paithan-intro');
  await expect(intro).toBeVisible();
  await page.waitForFunction(() => document.documentElement.classList.contains('paithan-intro-locked'));
  const banner = page.getByRole('complementary', { name: 'Cookie choices' });
  await expect(banner).toBeHidden();
  await page.clock.fastForward(6000);
  await expect(intro).toHaveCount(0);
  await expect(banner).toBeVisible();
  await banner.getByRole('button', { name: 'Accept cookies', exact: true }).click();
  const icon = page.getByRole('button', { name: 'Cookie preferences', exact: true });
  await expect(icon).toBeVisible();
  await expect(icon).toHaveText('');
});


test('Cloudflare renews expired tokens and recovers when the connection returns', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'paithan_consent', value: 'v1.a0', url: baseURL! }]);
  await page.clock.install();
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.fulfill({ contentType: 'application/javascript', body: `window.testChallengeOptions=null;window.challengeResets=0;window.turnstile={render:(el,o)=>{window.testChallengeOptions=o;setTimeout(()=>o.callback('isolated-token'),0);return 'widget';},reset(){window.challengeResets++;setTimeout(()=>window.testChallengeOptions.callback('fresh-isolated-token'),0);},remove(){}};` }));
  await page.goto('/en/login', { waitUntil: 'domcontentloaded' });
  const panel = page.locator('[data-turnstile-status]');
  await expect(panel).toHaveAttribute('data-turnstile-status', 'verified');
  await page.clock.fastForward(240001);
  await expect.poll(() => page.evaluate(() => (window as unknown as { challengeResets: number }).challengeResets)).toBeGreaterThan(0);
  await page.clock.fastForward(100);
  await expect(panel).toHaveAttribute('data-turnstile-status', 'verified');
  await page.evaluate(() => (window as unknown as { testChallengeOptions: { 'error-callback': (code: string) => void } }).testChallengeOptions['error-callback']('network-error'));
  await expect(panel).toHaveAttribute('data-turnstile-status', 'error');
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await page.clock.fastForward(100);
  await expect(panel).toHaveAttribute('data-turnstile-status', 'verified');
});


test('cookie notice is a right-hand card and dismissal never grants analytics consent', async ({ page, context }) => {
  let events = 0;
  await page.route('**/api/analytics', route => { events++; return route.fulfill({ status: 204 }); });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/en/login', { waitUntil: 'domcontentloaded' });
  const banner = page.getByRole('complementary', { name: 'Cookie choices' });
  await expect(banner).toBeVisible();
  const box = await banner.boundingBox();
  expect(box!.width).toBeLessThanOrEqual(360);
  expect(box!.x).toBeGreaterThan(640);
  expect(box!.x + box!.width).toBeLessThan(1280);
  await banner.getByRole('button', { name: 'Close cookie notice' }).click();
  await expect(banner).toBeHidden();
  const icon = page.getByRole('button', { name: 'Cookie preferences', exact: true });
  await expect(icon).toBeFocused();
  expect((await context.cookies()).some(cookie => cookie.name === 'paithan_consent')).toBe(false);
  expect(events).toBe(0);
  await icon.click();
  const dialog = page.getByRole('dialog', { name: 'Cookie preferences' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel('Optional visitor analytics')).not.toBeChecked();
  await dialog.getByRole('button', { name: 'Reject optional cookies', exact: true }).click();
  await expect(dialog).toBeHidden();
});
