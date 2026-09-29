import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/errors";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { getSectorFromSlug } from "@/lib/auth/permissions";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sector: string }> }
): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(Role.ADMIN);
    const { user } = authResult;

    const { sector: sectorSlug } = await params;
    const sector = getSectorFromSlug(sectorSlug);

    if (!sector) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Sector not found" } },
        { status: 404 }
      );
    }

    const rateLimit = await checkRateLimit(
      `api:sectors:verify:${user.id}`,
      RATE_LIMIT_CONFIGS.apiMutation
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const existing = await prisma.civicSectorInfo.findUnique({
      where: { sector },
    });

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Sector info not found" } },
        { status: 404 }
      );
    }

    const before = { dataStatus: existing.dataStatus };

    const updated = await prisma.civicSectorInfo.update({
      where: { sector },
      data: { dataStatus: "VERIFIED" },
    });

    await createAuditLog({
      actorId: user.id,
      action: "VERIFY",
      entity: "CivicSectorInfo",
      entityId: updated.id,
      before,
      after: { dataStatus: updated.dataStatus },
      ip: request.headers.get("x-forwarded-for") ?? "unknown",
      userAgent: request.headers.get("user-agent") ?? "unknown",
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}