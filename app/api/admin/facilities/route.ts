import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { facilityCreateSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/errors";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { Prisma } from "@prisma/client";

export async function GET(): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(Role.EDITOR);
    const { user } = authResult;

    const rateLimit = await checkRateLimit(
      `api:facilities:list:${user.id}`,
      RATE_LIMIT_CONFIGS.apiRead
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const facilities = await prisma.facility.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        ward: { select: { number: true, name: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(facilities);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(Role.EDITOR);
    const { user } = authResult;

    const rateLimit = await checkRateLimit(
      `api:facilities:create:${user.id}`,
      RATE_LIMIT_CONFIGS.apiMutation
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = facilityCreateSchema.safeParse(body);

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

    if (parsed.data.wardId) {
      const ward = await prisma.ward.findUnique({
        where: { id: parsed.data.wardId },
      });
      if (!ward) {
        return NextResponse.json(
          { error: { code: "NOT_FOUND", message: "Ward not found" } },
          { status: 404 }
        );
      }
    }

    const createData: Prisma.FacilityCreateInput = {
      nameEn: parsed.data.nameEn,
      nameMr: parsed.data.nameMr,
      sector: parsed.data.sector,
      type: parsed.data.type,
      address: parsed.data.address,
      contactJson: (parsed.data.contactJson ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      isOperational: parsed.data.isOperational,
      dataStatus: parsed.data.dataStatus,
      createdBy: { connect: { id: user.id } },
      ward: parsed.data.wardId ? { connect: { id: parsed.data.wardId } } : undefined,
    };

    const facility = await prisma.facility.create({
      data: createData,
      include: {
        ward: { select: { number: true, name: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    await createAuditLog({
      actorId: user.id,
      action: "CREATE",
      entity: "Facility",
      entityId: facility.id,
      after: {
        nameEn: facility.nameEn,
        nameMr: facility.nameMr,
        sector: facility.sector,
        type: facility.type,
        wardId: facility.wardId,
        isOperational: facility.isOperational,
        dataStatus: facility.dataStatus,
      },
      ip: request.headers.get("x-forwarded-for") ?? "unknown",
      userAgent: request.headers.get("user-agent") ?? "unknown",
    });

    return NextResponse.json(facility, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}