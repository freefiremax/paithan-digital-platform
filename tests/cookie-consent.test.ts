import { describe, expect, it } from 'vitest';
import { parseConsent, serverConsent } from '@/lib/cookie-consent';
describe('Cookie choices', () => {
  it('requires an explicit supported choice', () => {
    expect(parseConsent('v1.a1')).toBe('accepted');
    expect(parseConsent('v1.a0')).toBe('essential');
    for (const value of [undefined, null, '', 'true', 'v2.a1']) expect(parseConsent(value)).toBe('unset');
  });
  it('does not invent consent during server rendering', () => { expect(serverConsent()).toBe('pending'); });
});
