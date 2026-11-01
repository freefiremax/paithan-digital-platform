import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { encode } from 'next-auth/jwt';
vi.mock('next-intl/middleware', () => ({ default: () => () => NextResponse.next() }));
import middleware from '@/middleware';

const secret = 'admin-session-cookie-regression-secret-2026';
afterEach(() => vi.unstubAllEnvs());

async function request(protocol: 'https' | 'http', role = 'ADMIN') {
  vi.stubEnv('AUTH_SECRET', secret);
  const cookie = `${protocol === 'https' ? '__Secure-' : ''}authjs.session-token`;
  const jwt = await encode({ secret, salt: cookie, token: { sub: 'admin-test', role } });
  return new NextRequest(`${protocol}://portal.test/en/admin/dashboard`, { headers: { cookie: `${cookie}=${jwt}` } });
}

describe('Admin session cookies', () => {
  it('accepts the encrypted HTTPS session cookie issued by Auth.js', async () => {
    const result = await middleware(await request('https'));
    expect(result.headers.get('location')).toBeNull();
    expect(result.status).toBe(200);
  });
  it('accepts the development HTTP session cookie', async () => {
    expect((await middleware(await request('http'))).status).toBe(200);
  });
  it('rejects citizens even when the HTTPS session is valid', async () => {
    expect((await middleware(await request('https', 'PUBLIC'))).status).toBe(403);
  });
  it('redirects unauthenticated requests back to login', async () => {
    const response = await middleware(new NextRequest('https://portal.test/en/admin/dashboard'));
    expect(response.headers.get('location')).toContain('/en/admin/login?callbackUrl=');
  });
});
