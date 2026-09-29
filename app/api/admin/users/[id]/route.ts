import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { updateUserSchema } from "@/lib/validation";
import { createAuditLog } from "@/lib/audit";
import { handleApiError } from "@/lib/errors";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { hash } from "@node-rs/argon2";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(Role.ADMIN);
    const { user } = authResult;

    const { id } = await params;

    const rateLimit = await checkRateLimit(
      `api:users:read:${user.id}`,
      RATE_LIMIT_CONFIGS.apiRead
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
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
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "User not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json(targetUser);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(Role.ADMIN);
    const { user } = authResult;

    const { id } = await params;

    const rateLimit = await checkRateLimit(
      `api:users:update:${user.id}`,
      RATE_LIMIT_CONFIGS.apiMutation
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "User not found" } },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = updateUserSchema.safeParse(body);

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

    const before = {
      name: existing.name,
      role: existing.role,
      wardId: existing.wardId,
    };

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.password) {
      updateData.passwordHash = await hash(parsed.data.password);
      delete updateData.password;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
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
    });

    const after = {
      name: updated.name,
      role: updated.role,
      wardId: updated.wardId,
    };

    await createAuditLog({
      actorId: user.id,
      action: "UPDATE",
      entity: "User",
      entityId: id,
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
    const authResult = await requireAuth(Role.ADMIN);
    const { user } = authResult;

    const { id } = await params;

    const rateLimit = await checkRateLimit(
      `api:users:delete:${user.id}`,
      RATE_LIMIT_CONFIGS.apiMutation
    );
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests" } },
        { status: 429 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "User not found" } },
        { status: 404 }
      );
    }

    if (existing.id === user.id) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Cannot delete your own account" } },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });

    await createAuditLog({
      actorId: user.id,
      action: "DELETE",
      entity: "User",
      entityId: id,
      before: {
        email: existing.email,
        role: existing.role,
      },
      ip: request.headers.get("x-forwarded-for") ?? "unknown",
      userAgent: request.headers.get("user-agent") ?? "unknown",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}