import { test, expect } from '@playwright/test';

test('Google OAuth redirect trace', async ({ page }) => {
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('request', req => console.log('REQUEST:', req.method(), req.url()));
  page.on('response', res => console.log('RESPONSE:', res.status(), res.url()));
  
  await page.goto('http://localhost:3000/en/admin/login');
  console.log('At admin login page');
  
  const googleBtn = page.locator('button:has-text("Continue with Google")');
  await expect(googleBtn).toBeVisible();
  
  // Wait for CSRF token to be fetched and button to be enabled
  await expect(googleBtn).toBeEnabled({ timeout: 10000 });
  
  await Promise.all([
    page.waitForURL(/accounts\.google\.com|oauth/, { timeout: 15000 }),
    googleBtn.click()
  ]);
  
  console.log('After Google button click, URL:', page.url());
});