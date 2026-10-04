import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { grievanceCreateSchema } from "@/lib/validation";
import { handleApiError } from "@/lib/errors";

export const runtime = "nodejs";

function generateTicketNo(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  return `PTN-${year}-${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateLimit = await checkRateLimit(`grievance-submit:${ip}`, RATE_LIMIT_CONFIGS.apiMutation);
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = grievanceCreateSchema.safeParse(body);
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

    const ticketNo = generateTicketNo();
    const grievance = await prisma.grievance.create({
      data: {
        ...data,
        ticketNo,
      },
    });

    await prisma.statusUpdate.create({
      data: {
        grievanceId: grievance.id,
        status: "SUBMITTED",
        note: "Grievance submitted by citizen",
      },
    });

    return NextResponse.json(
      {
        ticketNo: grievance.ticketNo,
        message: "Grievance submitted successfully. Please save your ticket number for tracking.",
      },
      { status: 201 }
    );
  } catch (error) {
    return await handleApiError(error);
  }
}
