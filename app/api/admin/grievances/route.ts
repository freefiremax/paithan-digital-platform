import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/auth";
import { Role } from "@prisma/client";
import { grievanceQuerySchema } from "@/lib/validation";
import { handleApiError } from "@/lib/errors";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role: Role }).role !== "ADMIN") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Admin access required" } },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const parsed = grievanceQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid query parameters", details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const { page, pageSize, status, sector, wardId, search } = parsed.data;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (sector) where.sector = sector;
    if (wardId) where.wardId = wardId;
    if (search) {
      where.OR = [
        { ticketNo: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { citizenName: { contains: search, mode: "insensitive" } },
        { citizenPhone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [grievances, total] = await Promise.all([
      prisma.grievance.findMany({
        where,
        include: {
          ward: { select: { number: true, name: true } },
          updates: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.grievance.count({ where }),
    ]);

    return NextResponse.json({
      grievances: grievances.map((g) => ({
        id: g.id,
        ticketNo: g.ticketNo,
        title: g.title,
        sector: g.sector,
        ward: g.ward ? { number: g.ward.number, name: g.ward.name } : null,
        status: g.status,
        citizenName: g.citizenName,
        citizenPhone: g.citizenPhone,
        citizenEmail: g.citizenEmail,
        photoUrl: g.photoUrl,
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
        latestUpdate: g.updates[0] || null,
      })),
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    return await handleApiError(error);
  }
}
