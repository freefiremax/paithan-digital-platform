import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSectorFromSlug } from "@/lib/auth/permissions";
import { facilityCreateSchema, facilityQuerySchema } from "@/lib/validation";
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

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const parsedQuery = facilityQuerySchema.safeParse(queryParams);

    if (!parsedQuery.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid query parameters",
            details: parsedQuery.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { page, pageSize, wardId, type, dataStatus, isOperational, search } = parsedQuery.data;

    const where: Record<string, unknown> = { sector };

    if (wardId) where.wardId = wardId;
    if (type) where.type = type;
    if (dataStatus) where.dataStatus = dataStatus;
    if (isOperational !== undefined) where.isOperational = isOperational;
    if (search) {
      where.OR = [
        { nameEn: { contains: search, mode: "insensitive" } },
        { nameMr: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    const [facilities, total] = await Promise.all([
      prisma.facility.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          ward: { select: { number: true, name: true } },
          createdBy: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.facility.count({ where }),
    ]);

    const response = NextResponse.json({
      data: facilities,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
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

    if (parsed.data.sector !== sector) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Sector in body does not match route" } },
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