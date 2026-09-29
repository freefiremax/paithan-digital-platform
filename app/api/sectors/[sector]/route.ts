import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSectorFromSlug } from "@/lib/auth/permissions";
import { civicSectorInfoUpdateSchema } from "@/lib/validation";
import { requireAuth } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/errors";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { Prisma } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sector: string }> }
): Promise<NextResponse> {
  try {
    const { sector: sectorSlug } = await params;
    const sector = getSectorFromSlug(sectorSlug);

    if (!sector) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Sector not found" } },
        { status: 404 }
      );
    }

    const sectorInfo = await prisma.civicSectorInfo.findUnique({
      where: { sector },
    });

    if (!sectorInfo) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Sector info not found" } },
        { status: 404 }
      );
    }

    const response = NextResponse.json(sectorInfo);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sector: string }> }
): Promise<NextResponse> {
  try {
    const { sector: sectorSlug } = await params;
    const sector = getSectorFromSlug(sectorSlug);

    if (!sector) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Sector not found" } },
        { status: 404 }
      );
    }

    const authResult = await requireAuth(Role.ADMIN);
    const { user } = authResult;

    const rateLimit = await checkRateLimit(
      `api:sectors:update:${user.id}`,
      RATE_LIMIT_CONFIGS.apiMutation
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = civicSectorInfoUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input",
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
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

    const before = {
      titleEn: existing.titleEn,
      titleMr: existing.titleMr,
      taglineEn: existing.taglineEn,
      taglineMr: existing.taglineMr,
      overviewEn: existing.overviewEn,
      overviewMr: existing.overviewMr,
      department: existing.department,
      contactJson: existing.contactJson,
      dataStatus: existing.dataStatus,
    };

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (updateData.contactJson !== undefined) {
      updateData.contactJson = (updateData.contactJson ?? Prisma.JsonNull) as Prisma.InputJsonValue;
    }

    const updated = await prisma.civicSectorInfo.update({
      where: { sector },
      data: updateData,
    });

    const after = {
      titleEn: updated.titleEn,
      titleMr: updated.titleMr,
      taglineEn: updated.taglineEn,
      taglineMr: updated.taglineMr,
      overviewEn: updated.overviewEn,
      overviewMr: updated.overviewMr,
      department: updated.department,
      contactJson: updated.contactJson,
      dataStatus: updated.dataStatus,
    };

    await createAuditLog({
      actorId: user.id,
      action: "UPDATE",
      entity: "CivicSectorInfo",
      entityId: updated.id,
      before,
      after,
      ip: request.headers.get("x-forwarded-for") ?? "unknown",
      userAgent: request.headers.get("user-agent") ?? "unknown",
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}