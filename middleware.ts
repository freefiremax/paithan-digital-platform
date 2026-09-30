import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { auth } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';
import { Role } from '@prisma/client';
import { validateCsrfToken, getCsrfTokenFromRequest } from '@/lib/csrf';

const ADMIN_PATHS = ['/admin'];
const API_AUTH_PATHS = ['/api/auth'];
const PUBLIC_PATHS = ['/', '/api/chatbot'];
const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

function isAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.some((p) => pathname.startsWith(p));
}

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function isApiAuthPath(pathname: string): boolean {
  return API_AUTH_PATHS.some((p) => pathname.startsWith(p));
}

function isApiMutationPath(pathname: string): boolean {
  return pathname.startsWith('/api/') && !isApiAuthPath(pathname);
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

const isDev = process.env.NODE_ENV !== 'production';

const CSP_DIRECTIVES = [
  "default-src 'self'",
  `script-src 'self' 'nonce-{NONCE}'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://generativelanguage.googleapis.com https://*.upstash.io https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://challenges.cloudflare.com",
  "frame-src 'self' https://challenges.cloudflare.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const ip = getClientIp(request);

  const response = intlMiddleware(request);
  if (response.status === 307 || response.status === 308) {
    return response;
  }

  response.headers.set('x-nonce', nonce);

  const csp = CSP_DIRECTIVES.replace('{NONCE}', nonce);
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  if (isApiAuthPath(pathname)) {
    const rateLimit = await checkRateLimit(`auth:${ip}`, RATE_LIMIT_CONFIGS.auth);
    if (rateLimit && !rateLimit.success) {
      return new NextResponse(
        JSON.stringify({ error: { code: 'RATE_LIMITED', message: 'Too many requests' } }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return response;
  }

  if (isApiMutationPath(pathname) && MUTATING_METHODS.includes(method)) {
    const csrfToken = getCsrfTokenFromRequest(request);
    if (!csrfToken || !(await validateCsrfToken(csrfToken))) {
      return new NextResponse(
        JSON.stringify({ error: { code: 'FORBIDDEN', message: 'Invalid CSRF token' } }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  if (isPublicPath(pathname)) {
    return response;
  }

  if (isAdminPath(pathname)) {
    const session = await auth();
    if (!session?.user) {
      const signInUrl = new URL('/admin/login', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    const userRole = (session.user as { role: Role }).role;
    if (userRole === 'PUBLIC') {
      return new NextResponse(null, { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$|.*\\.webp$|.*\\.html$).*)',
  ],
};

export const runtime = 'nodejs';