import { test, expect } from '@playwright/test';

test('cookie choices gate analytics and can be changed later', async ({ page, context }) => {
  let events = 0;
  await page.route('**/api/analytics', route => { events++; return route.fulfill({ status: 204 }); });
  await page.goto('/en/contact');
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
  await page.goto('/en/login');
  await page.getByRole('button', { name: 'Reject optional cookies', exact: true }).click();
  const panel = page.locator('[data-turnstile-status]');
  await expect(panel).toHaveAttribute('data-turnstile-status', 'verified');
  await expect(panel).toContainText('Cloudflare Turnstile');
  await expect(panel).toContainText('Security check complete.');
  expect(renderCount).toBe(1);
});

test('a blocked Cloudflare script shows an error and retry recovers', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'paithan_consent', value: 'v1.a0', url: baseURL! }]);
  let loads = 0;
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => {
    loads++;
    if (loads === 1) return route.abort('failed');
    return route.fulfill({ contentType: 'application/javascript', body: 'window.turnstile={render:(el,o)=>{el.innerHTML="<div>Cloudflare test widget</div>";setTimeout(()=>o.callback("isolated-test-token"),0);return "test";},reset(){},remove(){}};' });
  });
  await page.goto('/en/login');
  const panel = page.locator('[data-turnstile-status]');
  await expect(panel).toHaveAttribute('data-turnstile-status', 'error');
  await expect(panel.getByRole('alert')).toContainText('could not finish');
  await panel.getByRole('button', { name: 'Retry security check' }).click();
  await expect(panel).toHaveAttribute('data-turnstile-status', 'verified');
  expect(loads).toBe(2);
});

test('a silent blank challenge becomes an actionable timeout, never a fake success', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'paithan_consent', value: 'v1.a0', url: baseURL! }]);
  await page.clock.install();
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.fulfill({ contentType: 'application/javascript', body: 'window.turnstile={render:()=>"silent-test",reset(){},remove(){}};' }));
  await page.goto('/en/login');
  const panel = page.locator('[data-turnstile-status]');
  await expect(panel).toHaveAttribute('data-turnstile-status', 'checking');
  await page.clock.fastForward(31000);
  await expect(panel).toHaveAttribute('data-turnstile-status', 'error');
  await expect(panel).toContainText('verification-timeout');
  await expect(panel.getByRole('button', { name: 'Retry security check' })).toBeVisible();
  await expect(panel).not.toContainText('Security check complete.');
});

test('mobile cookie preferences fit the screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en/register');
  await page.getByRole('button', { name: 'Cookie preferences', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Cookie preferences' });
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await dialog.getByRole('button', { name: 'Reject optional cookies' }).click();
  await expect(dialog).toBeHidden();
});


test('cookie banner waits for the complete entry animation', async ({ page }) => {
  await page.goto('/en');
  const intro = page.locator('.paithan-intro');
  await expect(intro).toBeVisible();
  const banner = page.getByRole('complementary', { name: 'Cookie choices' });
  await expect(banner).toBeHidden();
  await expect(intro).toHaveCount(0);
  await expect(banner).toBeVisible();
  await banner.getByRole('button', { name: 'Accept cookies', exact: true }).click();
  const icon = page.getByRole('button', { name: 'Cookie preferences', exact: true });
  await expect(icon).toBeVisible();
  await expect(icon).toHaveText('');
});
