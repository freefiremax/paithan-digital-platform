import { afterEach, describe, expect, it, vi } from 'vitest';
const configuration = vi.hoisted(() => ({ NEXT_PUBLIC_TURNSTILE_SITE_KEY: undefined as string | undefined, TURNSTILE_SECRET_KEY: undefined as string | undefined }));
vi.mock('@/lib/env', () => ({ env: configuration }));
import { isTurnstileEnabled, verifyTurnstileToken } from '@/lib/turnstile';
afterEach(() => { vi.unstubAllEnvs(); configuration.NEXT_PUBLIC_TURNSTILE_SITE_KEY = undefined; configuration.TURNSTILE_SECRET_KEY = undefined; });
describe('Turnstile configuration must fail closed', () => {
  it('requires protection in production even if provider settings disappear', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(isTurnstileEnabled()).toBe(true);
  });
  it.each(['NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY'] as const)('does not disable protection when only %s remains', setting => {
    vi.stubEnv('NODE_ENV', 'development');
    configuration[setting] = 'configured';
    expect(isTurnstileEnabled()).toBe(true);
  });
  it('rejects a token when the server secret is absent', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    configuration.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'configured';
    expect(await verifyTurnstileToken('non-test-value')).toBe(false);
  });
});
