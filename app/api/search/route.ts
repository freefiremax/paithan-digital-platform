import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/errors";

export const runtime = "nodejs";

interface SearchResult {
  type: string;
  id: string;
  title: string;
  titleMr?: string | null;
  titleHi?: string | null;
  description?: string | null;
  descriptionMr?: string | null;
  descriptionHi?: string | null;
  url: string;
  category?: string;
}

async function searchSectors(query: string): Promise<SearchResult[]> {
  const sectors = await prisma.civicSectorInfo.findMany({
    where: {
      OR: [
        { titleEn: { contains: query, mode: "insensitive" } },
        { titleMr: { contains: query, mode: "insensitive" } },
        { overviewEn: { contains: query, mode: "insensitive" } },
        { overviewMr: { contains: query, mode: "insensitive" } },
      ],
    },
  });

  return (sectors as Array<Record<string, any>>).map((s) => ({
    type: "sector",
    id: s.sector,
    title: s.titleEn,
    titleMr: s.titleMr,
    description: s.overviewEn,
    descriptionMr: s.overviewMr,
    url: `/services/${s.sector.toLowerCase().replace("_", "-")}`,
    category: "Civic Services",
  }));
}

async function searchDevelopmentWorks(query: string): Promise<SearchResult[]> {
  const works = await prisma.developmentWork.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { titleMr: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { descriptionMr: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { ward: { select: { number: true, name: true } } },
    take: 20,
  });

  return (works as Array<Record<string, any>>).map((w) => ({
    type: "development-work",
    id: w.id,
    title: w.title,
    titleMr: w.titleMr,
    description: w.description,
    descriptionMr: w.descriptionMr,
    url: `/nagar-parishad/development-works/${w.id}`,
    category: w.sector,
  }));
}

async function searchNotices(query: string): Promise<SearchResult[]> {
  const notices = await prisma.notification.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { titleMr: { contains: query, mode: "insensitive" } },
        { body: { contains: query, mode: "insensitive" } },
        { bodyMr: { contains: query, mode: "insensitive" } },
      ],
      publishedAt: { lte: new Date() },
    },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  return (notices as Array<Record<string, any>>).map((n) => ({
    type: "notice",
    id: n.id,
    title: n.title,
    titleMr: n.titleMr,
    description: n.body,
    descriptionMr: n.bodyMr,
    url: `/nagar-parishad/notifications/${n.id}`,
    category: n.category,
  }));
}

async function searchTouristPlaces(query: string): Promise<SearchResult[]> {
  const places = await prisma.touristPlace.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { nameMr: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { descriptionMr: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 20,
  });

  return (places as Array<Record<string, any>>).map((p) => ({
    type: "tourist-place",
    id: p.id,
    title: p.name,
    titleMr: p.nameMr,
    description: p.description,
    descriptionMr: p.descriptionMr,
    url: `/tourism/places-to-visit/${p.id}`,
    category: p.category,
  }));
}

async function searchHeritage(query: string): Promise<SearchResult[]> {
  const items = await prisma.culturalHeritageItem.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { titleMr: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { descriptionMr: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 20,
  });

  return (items as Array<Record<string, any>>).map((i) => ({
    type: "heritage",
    id: i.id,
    title: i.title,
    titleMr: i.titleMr,
    description: i.description,
    descriptionMr: i.descriptionMr,
    url: `/heritage/cultural-heritage/${i.id}`,
    category: i.category,
  }));
}

async function searchMuseum(query: string): Promise<SearchResult[]> {
  const exhibits = await prisma.museumExhibit.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { nameMr: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { descriptionMr: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 20,
  });

  return (exhibits as Array<Record<string, any>>).map((e) => ({
    type: "museum",
    id: e.id,
    title: e.name,
    titleMr: e.nameMr,
    description: e.description,
    descriptionMr: e.descriptionMr,
    url: `/heritage/museum/${e.id}`,
    category: "Museum",
  }));
}

async function searchHistory(query: string): Promise<SearchResult[]> {
  const events = await prisma.historyEvent.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { titleMr: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { descriptionMr: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 20,
  });

  return (events as Array<Record<string, any>>).map((e) => ({
    type: "history",
    id: e.id,
    title: e.title,
    titleMr: e.titleMr,
    description: e.description,
    descriptionMr: e.descriptionMr,
    url: `/heritage/history/${e.id}`,
    category: e.era,
  }));
}

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateLimit = await checkRateLimit(`search:${ip}`, RATE_LIMIT_CONFIGS.apiRead);
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." } },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const [sectors, works, notices, places, heritage, museum, history] = await Promise.all([
      searchSectors(q),
      searchDevelopmentWorks(q),
      searchNotices(q),
      searchTouristPlaces(q),
      searchHeritage(q),
      searchMuseum(q),
      searchHistory(q),
    ]);

    const allResults = [
      ...sectors,
      ...works,
      ...notices,
      ...places,
      ...heritage,
      ...museum,
      ...history,
    ];

    // Sort by relevance (simple: exact title match first, then partial)
    allResults.sort((a, b) => {
      const aExact = a.title?.toLowerCase() === q.toLowerCase();
      const bExact = b.title?.toLowerCase() === q.toLowerCase();
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });

    return NextResponse.json({
      results: allResults.slice(0, 50),
      total: allResults.length,
      query: q,
    });
  } catch (error) {
    return await handleApiError(error);
  }
}
