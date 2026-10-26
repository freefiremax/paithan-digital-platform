import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = await checkRateLimit(`turnstile:${ip}`, { limit: 20, window: "1 m" });
  if (!limit.success) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const token = body && typeof body === "object" && "token" in body ? body.token : undefined;
  if (typeof token !== "string" || !await verifyTurnstileToken(token)) {
    return NextResponse.json({ error: "Security verification failed." }, { status: 400 });
  }
  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
}
