import { afterEach, describe, expect, it, vi } from 'vitest';
import { SignJWT } from 'jose';
import { generateCsrfToken, validateCsrfToken, getCsrfTokenFromRequest } from '@/lib/csrf';
afterEach(() => vi.unstubAllEnvs());
describe('CSRF signing and request proof', () => {
  it('fails closed if signing secrets are missing', async () => {
    for (const key of ['CSRF_SECRET', 'AUTH_SECRET', 'NEXTAUTH_SECRET']) vi.stubEnv(key, '');
    await expect(generateCsrfToken()).rejects.toThrow('not configured');
    expect(await validateCsrfToken('anything')).toBe(false);
  });
  it('requires the CSRF claim and rejects tampering', async () => {
    const secret = 'test-only-secret-with-at-least-32-characters';
    vi.stubEnv('CSRF_SECRET', secret);
    const token = await generateCsrfToken();
    expect(await validateCsrfToken(token)).toBe(true);
    expect(await validateCsrfToken(token + 'changed')).toBe(false);
    const unrelated = await new SignJWT({ role: 'ADMIN' }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('1h').sign(new TextEncoder().encode(secret));
    expect(await validateCsrfToken(unrelated)).toBe(false);
  });
  it('does not accept an automatically attached cookie as request proof', () => {
    expect(getCsrfTokenFromRequest(new Request('https://portal.test', { headers: { cookie: 'paithan_csrf=token' } }))).toBeNull();
    expect(getCsrfTokenFromRequest(new Request('https://portal.test', { headers: { 'x-csrf-token': 'token' } }))).toBe('token');
  });
});
