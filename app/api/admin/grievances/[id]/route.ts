import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/auth";
import { Role } from "@prisma/client";
import { validateCsrfToken, getCsrfTokenFromRequest } from "@/lib/csrf";
import { grievanceStatusUpdateSchema } from "@/lib/validation";
import { handleApiError } from "@/lib/errors";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role: Role }).role !== "ADMIN") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Admin access required" } },
        { status: 403 }
      );
    }

    const csrfToken = getCsrfTokenFromRequest(req);
    if (!csrfToken || !(await validateCsrfToken(csrfToken))) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Invalid CSRF token" } },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = grievanceStatusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const { status, note } = parsed.data;

    const grievance = await prisma.grievance.findUnique({ where: { id } });
    if (!grievance) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Grievance not found" } },
        { status: 404 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedGrievance = await tx.grievance.update({
        where: { id },
        data: { status },
        include: {
          ward: { select: { number: true, name: true } },
        },
      });

      await tx.statusUpdate.create({
        data: {
          grievanceId: id,
          status,
          note: note || `Status changed to ${status}`,
        },
      });

      return updatedGrievance;
    });

    return NextResponse.json({
      id: updated.id,
      ticketNo: updated.ticketNo,
      status: updated.status,
      message: "Status updated successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}