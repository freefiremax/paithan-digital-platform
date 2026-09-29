import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/errors";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(Role.ADMIN);
    const { user } = authResult;

    const { id } = await params;

    const rateLimit = await checkRateLimit(
      `api:facilities:verify:${user.id}`,
      RATE_LIMIT_CONFIGS.apiMutation
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const existing = await prisma.facility.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Facility not found" } },
        { status: 404 }
      );
    }

    const before = { dataStatus: existing.dataStatus };

    const updated = await prisma.facility.update({
      where: { id },
      data: { dataStatus: "VERIFIED" },
    });

    await createAuditLog({
      actorId: user.id,
      action: "VERIFY",
      entity: "Facility",
      entityId: id,
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