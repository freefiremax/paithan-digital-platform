import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { contactFormSchema } from "@/lib/validation";
import { handleApiError } from "@/lib/errors";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateLimit = await checkRateLimit(`contact:${ip}`, RATE_LIMIT_CONFIGS.apiMutation);
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const { turnstileToken } = parsed.data;
    const turnstileOk = await verifyTurnstileToken(turnstileToken);
    if (!turnstileOk) {
      return NextResponse.json(
        { error: { code: "TURNSTILE_FAILED", message: "Security verification failed. Please try again." } },
        { status: 400 }
      );
    }

    // Email delivery is not configured yet. Never log citizen messages or
    // claim that a message was delivered when it was only validated.
    return NextResponse.json(
      { error: { code: 'SERVICE_UNAVAILABLE', message: 'Online message delivery is not available. Please use the council email or telephone listed on the contact page.' } },
      { status: 503 }
    );
  } catch (error) {
    return await handleApiError(error);
  }
}
