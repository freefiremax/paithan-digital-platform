import { test, expect } from '@playwright/test';

test.describe('Production deployment accessibility', () => {
  const publicPages = [
    { path: '/', titleContains: 'Paithan' },
    { path: '/chatbot', titleContains: 'AI' },
    { path: '/contact', titleContains: 'Contact' },
    { path: '/grievances/new', titleContains: 'Grievance' },
    { path: '/grievances/track', titleContains: 'Track' },
    { path: '/search', titleContains: 'Search' },
    { path: '/tourism', titleContains: 'Tourism' },
    { path: '/heritage/cultural-heritage', titleContains: 'Heritage' },
    { path: '/heritage/history', titleContains: 'History' },
    { path: '/heritage/museum', titleContains: 'Museum' },
    { path: '/tourism/jayakwadi', titleContains: 'Jayakwadi' },
    { path: '/tourism/nath-sagar', titleContains: 'Nath Sagar' },
    { path: '/nagar-parishad', titleContains: 'Nagar Parishad' },
    { path: '/admin/login', titleContains: 'Sign In' },
    { path: '/admin/dashboard', titleContains: 'Dashboard' },
  ];

  for (const page of publicPages) {
    test(`page ${page.path} loads and has expected title`, async ({ page: pwPage }) => {
      const response = await pwPage.goto(page.path);
      expect(response?.status()).toBeLessThan(400);
      if (page.titleContains) {
        await expect(pwPage).toHaveTitle(new RegExp(page.titleContains, 'i'));
      }
    });
  }
});

test.describe('API health checks on production', () => {
  test('chatbot API responds', async ({ request }) => {
    const response = await request.post('/api/chatbot', {
      data: { message: 'Hello', language: 'en' },
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('reply');
    // Production uses local RAG fallback
    expect(data.engine).toBe('rag-verified-local');
  });

  test('sectors API - not in production build', async ({ request }) => {
    const response = await request.get('/api/sectors');
    // Not deployed in production build
    expect([404, 200]).toContain(response.status());
  });

  test('grievance track requires params', async ({ request }) => {
    const response = await request.get('/api/grievances/track');
    expect([400, 404]).toContain(response.status());
  });
});

test.describe('Static assets loading', () => {
  test('CSS and JS assets load', async ({ page }) => {
    await page.goto('/');
    const failedRequests: string[] = [];
    page.on('response', response => {
      if (response.status() >= 400 && (response.url().includes('.js') || response.url().includes('.css'))) {
        failedRequests.push(response.url());
      }
    });
    await page.waitForLoadState('networkidle');
    expect(failedRequests.length).toBe(0);
  });
});