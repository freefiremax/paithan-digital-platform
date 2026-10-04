import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { createUserSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/errors";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { hash } from "@node-rs/argon2";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(Role.ADMIN);
    const { user } = authResult;

    const rateLimit = await checkRateLimit(
      `api:users:list:${user.id}`,
      RATE_LIMIT_CONFIGS.apiRead
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "20", 10), 100);
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          wardId: true,
          createdAt: true,
          updatedAt: true,
          ward: { select: { id: true, number: true, name: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    return await handleApiError(error);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(Role.ADMIN);
    const { user } = authResult;

    const rateLimit = await checkRateLimit(
      `api:users:create:${user.id}`,
      RATE_LIMIT_CONFIGS.apiMutation
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);

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

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      return NextResponse.json(
        { error: { code: "CONFLICT", message: "User with this email already exists" } },
        { status: 409 }
      );
    }

    const passwordHash = await hash(parsed.data.password);

    const newUser = await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name,
        passwordHash,
        role: parsed.data.role,
        wardId: parsed.data.wardId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        wardId: true,
        createdAt: true,
        ward: { select: { id: true, number: true, name: true } },
      },
    });

    await createAuditLog({
      actorId: user.id,
      action: "CREATE",
      entity: "User",
      entityId: newUser.id,
      after: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        wardId: newUser.wardId,
      },
      ip: request.headers.get("x-forwarded-for") ?? "unknown",
      userAgent: request.headers.get("user-agent") ?? "unknown",
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return await handleApiError(error);
  }
}
