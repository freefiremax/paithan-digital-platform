"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { publicAnalyticsPath } from '@/lib/analytics-path';

export function VisitorAnalytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  useEffect(() => {
    const path = publicAnalyticsPath(pathname);
    if (!path || lastPath.current === path || navigator.doNotTrack === '1' || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
    lastPath.current = path;
    let referrer = '';
    try { referrer = document.referrer ? new URL(document.referrer).hostname : ''; } catch { /* No referrer. */ }
    void fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path, referrer }), keepalive: true }).catch(() => { /* Analytics never blocks the portal. */ });
  }, [pathname]);
  return null;
}
