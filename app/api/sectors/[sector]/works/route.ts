import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSectorFromSlug } from "@/lib/auth/permissions";
import { developmentWorkCreateSchema, developmentWorkQuerySchema } from "@/lib/validation";
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
    const parsedQuery = developmentWorkQuerySchema.safeParse(queryParams);

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

    const { page, pageSize, wardId, status, dataStatus, search } = parsedQuery.data;

    const where: Record<string, unknown> = { sector };

    if (wardId) where.wardId = wardId;
    if (status) where.status = status;
    if (dataStatus) where.dataStatus = dataStatus;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
      ];
    }

    const [works, total] = await Promise.all([
      prisma.developmentWork.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          ward: { select: { number: true, name: true } },
          createdBy: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.developmentWork.count({ where }),
    ]);

    const response = NextResponse.json({
      data: works,
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
      `api:works:create:${user.id}`,
      RATE_LIMIT_CONFIGS.apiMutation
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = developmentWorkCreateSchema.safeParse(body);

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

    const ward = await prisma.ward.findUnique({
      where: { id: parsed.data.wardId },
    });

    if (!ward) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Ward not found" } },
        { status: 404 }
      );
    }

    const createData: Prisma.DevelopmentWorkCreateInput = {
      title: parsed.data.title,
      titleMr: parsed.data.titleMr,
      ward: { connect: { id: parsed.data.wardId } },
      sector: parsed.data.sector,
      description: parsed.data.description,
      descriptionMr: parsed.data.descriptionMr,
      status: parsed.data.status,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      expectedCompletion: parsed.data.expectedCompletion ? new Date(parsed.data.expectedCompletion) : null,
      department: parsed.data.department,
      budget: parsed.data.budget,
      progressPct: parsed.data.progressPct,
      images: parsed.data.images,
      locationLatLng: (parsed.data.locationLatLng ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      dataStatus: parsed.data.dataStatus,
      createdBy: { connect: { id: user.id } },
    };

    const work = await prisma.developmentWork.create({
      data: createData,
      include: {
        ward: { select: { number: true, name: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    await createAuditLog({
      actorId: user.id,
      action: "CREATE",
      entity: "DevelopmentWork",
      entityId: work.id,
      after: {
        title: work.title,
        sector: work.sector,
        wardId: work.wardId,
        status: work.status,
        budget: work.budget,
        progressPct: work.progressPct,
        dataStatus: work.dataStatus,
      },
      ip: request.headers.get("x-forwarded-for") ?? "unknown",
      userAgent: request.headers.get("user-agent") ?? "unknown",
    });

    return NextResponse.json(work, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}