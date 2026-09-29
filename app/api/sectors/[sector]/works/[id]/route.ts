import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSectorFromSlug } from "@/lib/auth/permissions";
import { developmentWorkUpdateSchema } from "@/lib/validation";
import { requireAuth, canAccessWork, canVerifyContent } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/errors";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { Prisma } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sector: string; id: string }> }
): Promise<NextResponse> {
  try {
    const { sector: sectorSlug, id } = await params;
    const sector = getSectorFromSlug(sectorSlug);

    if (!sector) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Sector not found" } },
        { status: 404 }
      );
    }

    const work = await prisma.developmentWork.findFirst({
      where: { id, sector },
      include: {
        ward: { select: { number: true, name: true, boundaryGeoJSON: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!work) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Development work not found" } },
        { status: 404 }
      );
    }

    const response = NextResponse.json(work);
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
  { params }: { params: Promise<{ sector: string; id: string }> }
): Promise<NextResponse> {
  try {
    const { sector: sectorSlug, id } = await params;
    const sector = getSectorFromSlug(sectorSlug);

    if (!sector) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Sector not found" } },
        { status: 404 }
      );
    }

    const authResult = await requireAuth(Role.EDITOR);
    const { user } = authResult;

    const rateLimit = await checkRateLimit(
      `api:works:update:${user.id}`,
      RATE_LIMIT_CONFIGS.apiMutation
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const canAccess = await canAccessWork(user, id);
    if (!canAccess) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Insufficient permissions to update this work" } },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (body.sector && body.sector !== sector) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Sector in body does not match route" } },
        { status: 400 }
      );
    }

    if (body.dataStatus === "VERIFIED") {
      const canVerify = await canVerifyContent(user);
      if (!canVerify) {
        return NextResponse.json(
          { error: { code: "FORBIDDEN", message: "Only admins can verify records" } },
          { status: 403 }
        );
      }
    }

    const existing = await prisma.developmentWork.findFirst({
      where: { id, sector },
    });

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Development work not found" } },
        { status: 404 }
      );
    }

    const before = {
      title: existing.title,
      titleMr: existing.titleMr,
      wardId: existing.wardId,
      sector: existing.sector,
      description: existing.description,
      descriptionMr: existing.descriptionMr,
      status: existing.status,
      startDate: existing.startDate?.toISOString() ?? null,
      expectedCompletion: existing.expectedCompletion?.toISOString() ?? null,
      department: existing.department,
      budget: existing.budget,
      progressPct: existing.progressPct,
      images: existing.images,
      locationLatLng: existing.locationLatLng,
      dataStatus: existing.dataStatus,
    };

    const parsed = developmentWorkUpdateSchema.safeParse(body);

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

    const updateData: Prisma.DevelopmentWorkUpdateInput = {};
    
    if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
    if (parsed.data.titleMr !== undefined) updateData.titleMr = parsed.data.titleMr;
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.descriptionMr !== undefined) updateData.descriptionMr = parsed.data.descriptionMr;
    if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
    if (parsed.data.startDate !== undefined) updateData.startDate = parsed.data.startDate ? new Date(parsed.data.startDate) : null;
    if (parsed.data.expectedCompletion !== undefined) updateData.expectedCompletion = parsed.data.expectedCompletion ? new Date(parsed.data.expectedCompletion) : null;
    if (parsed.data.department !== undefined) updateData.department = parsed.data.department;
    if (parsed.data.budget !== undefined) updateData.budget = parsed.data.budget;
    if (parsed.data.progressPct !== undefined) updateData.progressPct = parsed.data.progressPct;
    if (parsed.data.images !== undefined) updateData.images = parsed.data.images;
    if (parsed.data.locationLatLng !== undefined) updateData.locationLatLng = (parsed.data.locationLatLng ?? Prisma.JsonNull) as Prisma.InputJsonValue;
    if (parsed.data.dataStatus !== undefined) updateData.dataStatus = parsed.data.dataStatus;
    if (parsed.data.wardId !== undefined) updateData.ward = { connect: { id: parsed.data.wardId } };

    const updated = await prisma.developmentWork.update({
      where: { id },
      data: updateData,
      include: {
        ward: { select: { number: true, name: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    const after = {
      title: updated.title,
      titleMr: updated.titleMr,
      wardId: updated.wardId,
      sector: updated.sector,
      description: updated.description,
      descriptionMr: updated.descriptionMr,
      status: updated.status,
      startDate: updated.startDate?.toISOString() ?? null,
      expectedCompletion: updated.expectedCompletion?.toISOString() ?? null,
      department: updated.department,
      budget: updated.budget,
      progressPct: updated.progressPct,
      images: updated.images,
      locationLatLng: updated.locationLatLng,
      dataStatus: updated.dataStatus,
    };

    await createAuditLog({
      actorId: user.id,
      action: "UPDATE",
      entity: "DevelopmentWork",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sector: string; id: string }> }
): Promise<NextResponse> {
  try {
    const { sector: sectorSlug, id } = await params;
    const sector = getSectorFromSlug(sectorSlug);

    if (!sector) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Sector not found" } },
        { status: 404 }
      );
    }

    const authResult = await requireAuth(Role.EDITOR);
    const { user } = authResult;

    const rateLimit = await checkRateLimit(
      `api:works:delete:${user.id}`,
      RATE_LIMIT_CONFIGS.apiMutation
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const canAccess = await canAccessWork(user, id);
    if (!canAccess) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Insufficient permissions to delete this work" } },
        { status: 403 }
      );
    }

    const existing = await prisma.developmentWork.findFirst({
      where: { id, sector },
    });

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Development work not found" } },
        { status: 404 }
      );
    }

    await prisma.developmentWork.delete({ where: { id } });

    await createAuditLog({
      actorId: user.id,
      action: "DELETE",
      entity: "DevelopmentWork",
      entityId: id,
      before: {
        title: existing.title,
        sector: existing.sector,
        wardId: existing.wardId,
        status: existing.status,
        budget: existing.budget,
        dataStatus: existing.dataStatus,
      },
      ip: request.headers.get("x-forwarded-for") ?? "unknown",
      userAgent: request.headers.get("user-agent") ?? "unknown",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}