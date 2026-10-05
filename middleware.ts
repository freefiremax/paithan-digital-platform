import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PATHS = ['/admin'];
const API_AUTH_PATHS = ['/api/auth'];

function isAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.some((p) => pathname.startsWith(p));
}

function isApiAuthPath(pathname: string): boolean {
  return API_AUTH_PATHS.some((p) => pathname.startsWith(p));
}


const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https: res.cloudinary.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://generativelanguage.googleapis.com https://*.upstash.io https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://challenges.cloudflare.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-src 'self' https://challenges.cloudflare.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let next-intl handle internationalization routing first
  const response = intlMiddleware(request);

  response.headers.set('Content-Security-Policy', CSP_DIRECTIVES);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Admin route authentication guard
  if (isAdminPath(pathname) && !pathname.includes('/admin/login')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "i1CFVlmHkFZmulYwQx9+lvmY1usQBpkEkGVHKiCh+wE=",
    });

    if (!token) {
      const signInUrl = new URL('/admin/login', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (token.role === 'PUBLIC') {
      return new NextResponse(null, { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/(en|mr|hi)/:path*',
    '/((?!_next|_vercel|api|static|favicon.ico|.*\\..*).*)',
  ],
};
