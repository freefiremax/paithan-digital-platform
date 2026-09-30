import { Metadata } from "next";
import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import { getMessages } from "@/i18n";
import { prisma } from "@/lib/db";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const locales = ["en", "mr", "hi"];
  const baseUrl = "https://paithan.gov.in";

  // Static pages that exist for all locales
  const staticPaths = [
    "",
    "/grievances/new",
    "/grievances/track",
    "/policies",
    "/policies/privacy",
    "/policies/terms",
    "/policies/copyright",
    "/policies/hyperlinking",
    "/policies/disclaimer",
    "/policies/accessibility",
    "/search",
    "/chatbot",
    "/nagar-parishad",
    "/nagar-parishad/representatives",
    "/nagar-parishad/ward-map",
    "/nagar-parishad/nagar-sevak",
    "/nagar-parishad/development-works",
    "/nagar-parishad/projects",
    "/nagar-parishad/notifications",
    "/heritage/museum",
    "/heritage/artifacts",
    "/heritage/3d-models",
    "/heritage/history",
    "/heritage/cultural-heritage",
    "/tourism/jayakwadi",
    "/tourism/nath-sagar",
    "/tourism/places-to-visit",
    "/tourism/heritage-sites",
    "/tourism/routes",
    "/tourism/map",
    "/services",
  ];

  // Fetch dynamic routes
  const [sectors, works, notices, places, heritageItems, museumExhibits, historyEvents] = await Promise.all([
    prisma.civicSectorInfo.findMany({ select: { sector: true, updatedAt: true } }),
    prisma.developmentWork.findMany({ select: { id: true, updatedAt: true } }),
    prisma.notification.findMany({
      where: { publishedAt: { lte: new Date() } },
      select: { id: true, updatedAt: true },
    }),
    prisma.touristPlace.findMany({ select: { id: true, updatedAt: true } }),
    prisma.culturalHeritageItem.findMany({ select: { id: true, updatedAt: true } }),
    prisma.museumExhibit.findMany({ select: { id: true, updatedAt: true } }),
    prisma.historyEvent.findMany({ select: { id: true, updatedAt: true } }),
  ]);

  const sitemapEntries: ISitemapField[] = [];

  // Add static pages for each locale
  for (const locale of locales) {
    for (const path of staticPaths) {
      const loc = `${baseUrl}/${locale}${path}`;
      sitemapEntries.push({
        loc,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: path === "" ? 1.0 : 0.8,
        alternateRefs: locales.map((l) => ({
          href: `${baseUrl}/${l}${path}`,
          hreflang: l,
        })),
      });
    }

    // Dynamic sector pages
    for (const sector of sectors) {
      const loc = `\${baseUrl}/${locale}/services/${sector.sector.toLowerCase().replace("_", "-")}`;
      sitemapEntries.push({
        loc,
        lastmod: sector.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: 0.7,
        alternateRefs: locales.map((l) => ({
          href: `${baseUrl}/${l}/services/${sector.sector.toLowerCase().replace("_", "-")}`,
          hreflang: l,
        })),
      });
    }

    // Dynamic development work pages
    for (const work of works) {
      const loc = `\${baseUrl}/${locale}/nagar-parishad/development-works/${work.id}`;
      sitemapEntries.push({
        loc,
        lastmod: work.updatedAt.toISOString(),
        changefreq: "weekly",
        priority: 0.6,
        alternateRefs: locales.map((l) => ({
          href: `${baseUrl}/${l}/nagar-parishad/development-works/${work.id}`,
          hreflang: l,
        })),
      });
    }

    // Dynamic notification pages
    for (const notice of notices) {
      const loc = `\${baseUrl}/${locale}/nagar-parishad/notifications/${notice.id}`;
      sitemapEntries.push({
        loc,
        lastmod: notice.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: 0.6,
        alternateRefs: locales.map((l) => ({
          href: `${baseUrl}/${l}/nagar-parishad/notifications/${notice.id}`,
          hreflang: l,
        })),
      });
    }

    // Dynamic tourist place pages
    for (const place of places) {
      const loc = `\${baseUrl}/${locale}/tourism/places-to-visit/${place.id}`;
      sitemapEntries.push({
        loc,
        lastmod: place.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: 0.7,
        alternateRefs: locales.map((l) => ({
          href: `${baseUrl}/${l}/tourism/places-to-visit/${place.id}`,
          hreflang: l,
        })),
      });
    }

    // Dynamic heritage item pages
    for (const item of heritageItems) {
      const loc = `\${baseUrl}/${locale}/heritage/cultural-heritage/${item.id}`;
      sitemapEntries.push({
        loc,
        lastmod: item.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: 0.7,
        alternateRefs: locales.map((l) => ({
          href: `${baseUrl}/${l}/heritage/cultural-heritage/${item.id}`,
          hreflang: l,
        })),
      });
    }

    // Dynamic museum exhibit pages
    for (const exhibit of museumExhibits) {
      const loc = `\${baseUrl}/${locale}/heritage/museum/${exhibit.id}`;
      sitemapEntries.push({
        loc,
        lastmod: exhibit.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: 0.6,
        alternateRefs: locales.map((l) => ({
          href: `${baseUrl}/${l}/heritage/museum/${exhibit.id}`,
          hreflang: l,
        })),
      });
    }

    // Dynamic history event pages
    for (const event of historyEvents) {
      const loc = `\${baseUrl}/${locale}/heritage/history/${event.id}`;
      sitemapEntries.push({
        loc,
        lastmod: event.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: 0.6,
        alternateRefs: locales.map((l) => ({
          href: `${baseUrl}/${l}/heritage/history/${event.id}`,
          hreflang: l,
        })),
      });
    }
  }

  return getServerSideSitemap(sitemapEntries);
}
