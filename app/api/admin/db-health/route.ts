import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/guard";
import { handleApiError } from "@/lib/errors";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Only allow authorized Administrators or dev/test environments
    if (process.env.NODE_ENV === "production") {
      await requireAuth("ADMIN");
    }

    // Safe DB ping
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;

    // Retrieve safe counts
    const [
      userCount,
      grievanceCount,
      wardCount,
      sectorCount,
      notificationCount,
      workCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.grievance.count(),
      prisma.ward.count(),
      prisma.civicSectorInfo.count(),
      prisma.notification.count(),
      prisma.developmentWork.count(),
    ]);

    return NextResponse.json({
      status: "healthy",
      database: {
        connected: true,
        provider: "postgresql",
        serverReachable: true,
        latencyMs,
      },
      counts: {
        users: userCount,
        grievances: grievanceCount,
        wards: wardCount,
        sectors: sectorCount,
        notifications: notificationCount,
        developmentWorks: workCount,
      },
      prismaVersion: "6.4.1",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return await handleApiError(error);
  }
}
