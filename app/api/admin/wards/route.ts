import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { handleApiError } from "@/lib/errors";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

export async function GET(): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(Role.EDITOR);
    const { user } = authResult;

    const rateLimit = await checkRateLimit(
      `api:wards:list:${user.id}`,
      RATE_LIMIT_CONFIGS.apiRead
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const wards = await prisma.ward.findMany({
      orderBy: { number: "asc" },
      select: { id: true, number: true, name: true },
    });

    return NextResponse.json(wards);
  } catch (error) {
    return handleApiError(error);
  }
}