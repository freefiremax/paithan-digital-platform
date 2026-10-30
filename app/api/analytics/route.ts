import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';
import { publicAnalyticsPath, visitorDevice, visitorSource } from '@/lib/analytics-path';

export const runtime = 'nodejs';
const eventSchema = z.object({ path: z.string().max(180), referrer: z.string().max(120).regex(/^[a-z0-9.-]*$/i).default('') }).strict();

export async function POST(request: NextRequest) {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') return new NextResponse(null, { status: 204 });
  if (request.headers.get('origin') !== request.nextUrl.origin) return new NextResponse(null, { status: 403 });
  if (Number(request.headers.get('content-length') || 0) > 1024) return new NextResponse(null, { status: 413 });
  if (request.headers.get('dnt') === '1' || request.headers.get('sec-gpc') === '1') return new NextResponse(null, { status: 204 });
  const agent = request.headers.get('user-agent') || '';
  if (/bot|crawler|spider|headless|lighthouse|playwright|monitor/i.test(agent)) return new NextResponse(null, { status: 204 });
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const limit = await checkRateLimit(`analytics:${ip}`, RATE_LIMIT_CONFIGS.apiRead);
  if (!limit.success) return new NextResponse(null, { status: 429 });
  let event;
  try {
    const text = await request.text();
    if (text.length > 1024) return new NextResponse(null, { status: 413 });
    event = eventSchema.safeParse(JSON.parse(text));
  } catch { return new NextResponse(null, { status: 400 }); }
  if (!event.success) return new NextResponse(null, { status: 400 });
  const path = publicAnalyticsPath(event.data.path);
  if (!path) return new NextResponse(null, { status: 400 });
  const day = new Date();
  day.setUTCHours(0, 0, 0, 0);
  const bucket = { day, path, locale: path.split('/')[1], device: visitorDevice(agent), source: visitorSource(event.data.referrer.toLowerCase(), request.nextUrl.hostname) };
  try {
    await prisma.visitorDailyMetric.upsert({ where: { day_path_locale_device_source: bucket }, create: bucket, update: { pageViews: { increment: 1 } } });
    return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Analytics unavailable' }, { status: 503 });
  }
}
