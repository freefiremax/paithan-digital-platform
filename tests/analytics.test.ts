import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
vi.mock('@/lib/db', () => ({ prisma: { visitorDailyMetric: { upsert: vi.fn() } } }));
vi.mock('@/lib/rate-limit', () => ({ checkRateLimit: vi.fn(), RATE_LIMIT_CONFIGS: { apiRead: {} } }));
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { POST } from '@/app/api/analytics/route';
import { publicAnalyticsPath, visitorDevice, visitorSource } from '@/lib/analytics-path';

function event(body: unknown = { path: '/mr/tourism/jayakwadi', referrer: 'www.google.com' }, headers: Record<string, string> = {}) {
  return new NextRequest('https://portal.test/api/analytics', { method: 'POST', body: JSON.stringify(body), headers: { origin: 'https://portal.test', 'user-agent': 'Mozilla/5.0 (iPhone; Mobile)', ...headers } });
}
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(checkRateLimit).mockResolvedValue({ success: true, limit: 100, remaining: 99, reset: 0 });
});

describe('Aggregate visitor ingestion', () => {
  it('atomically increments the daily bucket without identities or query strings', async () => {
    expect((await POST(event())).status).toBe(204);
    const call = vi.mocked(prisma.visitorDailyMetric.upsert).mock.calls[0][0];
    expect(call.create).toMatchObject({ path: '/mr/tourism/jayakwadi', locale: 'mr', device: 'mobile', source: 'search' });
    expect(Object.keys(call.create).sort()).toEqual(['day','device','locale','path','source']);
    expect((call.create.day as Date).getUTCHours()).toBe(0);
    expect(call.update).toEqual({ pageViews: { increment: 1 } });
  });
  it('rejects cross-origin submissions before database access', async () => {
    expect((await POST(event(undefined, { origin: 'https://other.test' }))).status).toBe(403);
    expect(prisma.visitorDailyMetric.upsert).not.toHaveBeenCalled();
  });
  it.each(['/en/admin/dashboard','/en/login','/en/register','/en/grievances/track','/en/search?q=phone','/en/tourism#identity'])('rejects private or identifying paths: %s', async path => {
    expect((await POST(event({ path }))).status).toBe(400);
    expect(prisma.visitorDailyMetric.upsert).not.toHaveBeenCalled();
  });
  it('rejects unexpected identity fields', async () => {
    expect((await POST(event({ path: '/en', email: 'citizen@example.com' }))).status).toBe(400);
    expect(prisma.visitorDailyMetric.upsert).not.toHaveBeenCalled();
  });
  it.each([['dnt', '1'], ['sec-gpc', '1'], ['user-agent', 'HeadlessChrome']])('does not record opted-out or bot traffic %s', async (key, value) => {
    expect((await POST(event(undefined, { [key]: value }))).status).toBe(204);
    expect(prisma.visitorDailyMetric.upsert).not.toHaveBeenCalled();
  });
  it('rate limits before recording', async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({ success: false, limit: 100, remaining: 0, reset: 0 });
    expect((await POST(event())).status).toBe(429);
    expect(prisma.visitorDailyMetric.upsert).not.toHaveBeenCalled();
  });
  it('rejects oversized payloads', async () => {
    expect((await POST(event({ path: '/en', referrer: 'x'.repeat(1100) }))).status).toBe(413);
    expect(prisma.visitorDailyMetric.upsert).not.toHaveBeenCalled();
  });
  it('reports unavailable storage rather than claiming to record a view', async () => {
    vi.mocked(prisma.visitorDailyMetric.upsert).mockRejectedValue(new Error('unavailable'));
    expect((await POST(event())).status).toBe(503);
  });
});

describe('Bounded analytics dimensions', () => {
  it('normalizes public paths and keeps sources to broad categories', () => {
    expect(publicAnalyticsPath('/en/')).toBe('/en');
    expect(publicAnalyticsPath('/mr/heritage/history')).toBe('/mr/heritage/history');
    expect(visitorSource('portal.test','portal.test')).toBe('internal');
    expect(visitorSource('www.instagram.com','portal.test')).toBe('social');
    expect(visitorSource('unrecognized.example','portal.test')).toBe('other');
    expect(visitorDevice('iPad Tablet')).toBe('tablet');
  });
});
