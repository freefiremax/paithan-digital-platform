/** Only allow public, same-site destinations after citizen authentication. */
export function citizenCallbackUrl(value: string | null, locale: string): string {
  const fallback = `/${locale}`;
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f]/.test(value)) return fallback;
  try {
    const url = new URL(value, 'https://portal.invalid');
    const path = decodeURIComponent(url.pathname);
    if (url.origin !== 'https://portal.invalid' || path.startsWith('//') || /[\\\u0000-\u001f]/.test(path) || /\/(admin|login|register|api)(\/|$)/.test(path)) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
