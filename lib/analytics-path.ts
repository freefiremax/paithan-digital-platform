export function publicAnalyticsPath(path: string): string | null {
  if (path.length > 180 || /[?#%\\]/.test(path)) return null;
  const normalized = path.replace(/\/$/, '');
  if (!/^\/(en|mr|hi)(?:\/(?:heritage|tourism|nagar-parishad|services|policies)(?:\/[a-z0-9-]+)*|\/(?:contact|grievances\/new|sitemap|chatbot|search))?$/.test(normalized)) return null;
  return normalized;
}

export function visitorSource(referrer: string, hostname: string): string {
  if (!referrer) return 'direct';
  if (referrer === hostname) return 'internal';
  if (/(^|\.)(google\.[a-z.]+|bing.com|duckduckgo.com|yahoo.com)$/.test(referrer)) return 'search';
  if (/(^|\.)(facebook.com|instagram.com|linkedin.com|twitter.com|x.com|youtube.com|t.co)$/.test(referrer)) return 'social';
  return 'other';
}

export function visitorDevice(userAgent: string): string {
  if (/ipad|tablet/i.test(userAgent)) return 'tablet';
  return /mobile|iphone|android/i.test(userAgent) ? 'mobile' : 'desktop';
}
