import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, canAccessFacility, canVerifyContent } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { facilityUpdateSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/errors";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { Prisma } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(Role.EDITOR);
    const { user } = authResult;

    const { id } = await params;

    const rateLimit = await checkRateLimit(
      `api:facilities:read:${user.id}`,
      RATE_LIMIT_CONFIGS.apiRead
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const facility = await prisma.facility.findUnique({
      where: { id },
      include: {
        ward: { select: { number: true, name: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!facility) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Facility not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json(facility);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(Role.EDITOR);
    const { user } = authResult;

    const { id } = await params;

    const rateLimit = await checkRateLimit(
      `api:facilities:update:${user.id}`,
      RATE_LIMIT_CONFIGS.apiMutation
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const canAccess = await canAccessFacility(user, id);
    if (!canAccess) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Insufficient permissions to update this facility" } },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (body.dataStatus === "VERIFIED") {
      const canVerify = await canVerifyContent(user);
      if (!canVerify) {
        return NextResponse.json(
          { error: { code: "FORBIDDEN", message: "Only admins can verify records" } },
          { status: 403 }
        );
      }
    }

    const existing = await prisma.facility.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Facility not found" } },
        { status: 404 }
      );
    }

    if (body.wardId) {
      const ward = await prisma.ward.findUnique({ where: { id: body.wardId } });
      if (!ward) {
        return NextResponse.json(
          { error: { code: "NOT_FOUND", message: "Ward not found" } },
          { status: 404 }
        );
      }
    }

    const before = {
      nameEn: existing.nameEn,
      nameMr: existing.nameMr,
      sector: existing.sector,
      type: existing.type,
      address: existing.address,
      contactJson: existing.contactJson,
      wardId: existing.wardId,
      isOperational: existing.isOperational,
      dataStatus: existing.dataStatus,
    };

    const parsed = facilityUpdateSchema.safeParse(body);

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

    const updateData: Prisma.FacilityUpdateInput = {};

    if (parsed.data.nameEn !== undefined) updateData.nameEn = parsed.data.nameEn;
    if (parsed.data.nameMr !== undefined) updateData.nameMr = parsed.data.nameMr;
    if (parsed.data.sector !== undefined) updateData.sector = parsed.data.sector;
    if (parsed.data.type !== undefined) updateData.type = parsed.data.type;
    if (parsed.data.address !== undefined) updateData.address = parsed.data.address;
    if (parsed.data.contactJson !== undefined) updateData.contactJson = (parsed.data.contactJson ?? Prisma.JsonNull) as Prisma.InputJsonValue;
    if (parsed.data.wardId !== undefined) updateData.ward = parsed.data.wardId ? { connect: { id: parsed.data.wardId } } : { disconnect: true };
    if (parsed.data.isOperational !== undefined) updateData.isOperational = parsed.data.isOperational;
    if (parsed.data.dataStatus !== undefined) updateData.dataStatus = parsed.data.dataStatus;

    const updated = await prisma.facility.update({
      where: { id },
      data: updateData,
      include: {
        ward: { select: { number: true, name: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    const after = {
      nameEn: updated.nameEn,
      nameMr: updated.nameMr,
      sector: updated.sector,
      type: updated.type,
      address: updated.address,
      contactJson: updated.contactJson,
      wardId: updated.wardId,
      isOperational: updated.isOperational,
      dataStatus: updated.dataStatus,
    };

    await createAuditLog({
      actorId: user.id,
      action: "UPDATE",
      entity: "Facility",
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
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(Role.EDITOR);
    const { user } = authResult;

    const { id } = await params;

    const rateLimit = await checkRateLimit(
      `api:facilities:delete:${user.id}`,
      RATE_LIMIT_CONFIGS.apiMutation
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const canAccess = await canAccessFacility(user, id);
    if (!canAccess) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Insufficient permissions to delete this facility" } },
        { status: 403 }
      );
    }

    const existing = await prisma.facility.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Facility not found" } },
        { status: 404 }
      );
    }

    await prisma.facility.delete({ where: { id } });

    await createAuditLog({
      actorId: user.id,
      action: "DELETE",
      entity: "Facility",
      entityId: id,
      before: {
        nameEn: existing.nameEn,
        sector: existing.sector,
        type: existing.type,
        wardId: existing.wardId,
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