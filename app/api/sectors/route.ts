import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/errors";

export async function GET(): Promise<NextResponse> {
  try {
    const sectors = await prisma.civicSectorInfo.findMany({
      orderBy: { sector: "asc" },
    });

    const response = NextResponse.json(sectors);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    return response;
  } catch (error) {
    return await handleApiError(error);
  }
}
