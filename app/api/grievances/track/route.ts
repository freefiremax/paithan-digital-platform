import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { grievanceTrackSchema } from "@/lib/validation";
import { handleApiError } from "@/lib/errors";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateLimit = await checkRateLimit(`grievance-track:${ip}`, RATE_LIMIT_CONFIGS.grievanceTrack);
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." } },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const ticketNo = searchParams.get("ticketNo");
    const phone = searchParams.get("phone");

    const parsed = grievanceTrackSchema.safeParse({ ticketNo, phone });
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const { ticketNo: validatedTicketNo, phone: validatedPhone } = parsed.data;

    const grievance = await prisma.grievance.findUnique({
      where: { ticketNo: validatedTicketNo },
      include: {
        updates: {
          orderBy: { createdAt: "asc" },
        },
        ward: {
          select: { number: true, name: true },
        },
      },
    });

    // Generic message for both "not found" and "phone mismatch" to prevent enumeration
    if (!grievance || grievance.citizenPhone !== validatedPhone) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "No matching grievance found for the provided ticket number and phone." } },
        { status: 404 }
      );
    }

    // Phone matched - return full details including PII
    return NextResponse.json({
      ticketNo: grievance.ticketNo,
      title: grievance.title,
      sector: grievance.sector,
      ward: grievance.ward ? { number: grievance.ward.number, name: grievance.ward.name } : null,
      status: grievance.status,
      citizenName: grievance.citizenName,
      citizenPhone: grievance.citizenPhone,
      citizenEmail: grievance.citizenEmail,
      createdAt: grievance.createdAt,
      updatedAt: grievance.updatedAt,
      updates: grievance.updates.map((u) => ({
        status: u.status,
        note: u.note,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    return await handleApiError(error);
  }
}
