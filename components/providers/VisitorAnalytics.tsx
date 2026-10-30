"use client";

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { publicAnalyticsPath } from '@/lib/analytics-path';
import { readConsent, subscribeConsent, serverConsent } from '@/lib/cookie-consent';

export function VisitorAnalytics() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeConsent, readConsent, serverConsent);
  const lastPath = useRef<string | null>(null);
  useEffect(() => {
    if (consent !== 'accepted') { lastPath.current = null; return; }
    const path = publicAnalyticsPath(pathname);
    if (!path || lastPath.current === path || navigator.doNotTrack === '1' || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
    lastPath.current = path;
    let referrer = '';
    try { referrer = document.referrer ? new URL(document.referrer).hostname : ''; } catch { /* No referrer. */ }
    void fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path, referrer }), keepalive: true }).catch(() => { /* Analytics never blocks the portal. */ });
  }, [pathname, consent]);
  return null;
}
