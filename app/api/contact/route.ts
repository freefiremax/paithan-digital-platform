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

    const { turnstileToken, ...data } = parsed.data;
    const turnstileOk = await verifyTurnstileToken(turnstileToken);
    if (!turnstileOk) {
      return NextResponse.json(
        { error: { code: "TURNSTILE_FAILED", message: "Security verification failed. Please try again." } },
        { status: 400 }
      );
    }

    // In a real implementation, this would be saved to a database or sent via email
    // For now, we'll just log it and return success
    console.log("Contact form submission:", data);

    return NextResponse.json(
      {
        message: "Your message has been sent successfully. We will get back to you soon.",
      },
      { status: 201 }
    );
  } catch (error) {
    return await handleApiError(error);
  }
}
