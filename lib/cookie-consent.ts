export const CONSENT_COOKIE = 'paithan_consent';
export const CONSENT_ACCEPTED = 'v1.a1';
export const CONSENT_ESSENTIAL = 'v1.a0';
export const CONSENT_EVENT = 'paithan:consent';
export type Consent = 'pending' | 'unset' | 'accepted' | 'essential';

export function parseConsent(value: string | undefined | null): Consent {
  return value === CONSENT_ACCEPTED ? 'accepted' : value === CONSENT_ESSENTIAL ? 'essential' : 'unset';
}
export function readConsent(): Consent {
  if (typeof document === 'undefined') return 'pending';
  const value = document.cookie.split(';').map(item => item.trim()).find(item => item.startsWith(`${CONSENT_COOKIE}=`))?.split('=')[1];
  return parseConsent(value);
}
export function saveConsent(analytics: boolean): boolean {
  const value = analytics ? CONSENT_ACCEPTED : CONSENT_ESSENTIAL;
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=15552000; SameSite=Lax${secure}`;
  try { localStorage.setItem(CONSENT_COOKIE, `${value}:${Date.now()}`); } catch { /* Cookie still works without localStorage. */ }
  window.dispatchEvent(new Event(CONSENT_EVENT));
  return readConsent() === (analytics ? 'accepted' : 'essential');
}
export function subscribeConsent(listener: () => void) {
  window.addEventListener(CONSENT_EVENT, listener);
  window.addEventListener('storage', listener);
  return () => { window.removeEventListener(CONSENT_EVENT, listener); window.removeEventListener('storage', listener); };
}
export const serverConsent = (): Consent => 'pending';
