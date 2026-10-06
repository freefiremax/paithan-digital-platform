import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { prisma } from "@/lib/db";
import { getSlugFromSector, SECTOR_LABELS_EN, SECTOR_LABELS_MR } from "@/lib/auth/permissions";
import { CivicSector } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Civic Services | Paithan Municipal Council",
  description: "Explore civic services across Paithan's 5 sectors: Roads & Transport, Water & Sanitation, Education, Health, and Other Civic Works.",
};

async function getAllSectors() {
  const sectors = await prisma.civicSectorInfo.findMany({
    orderBy: { sector: "asc" },
  });
  return sectors;
}

export default async function ServicesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tServices = await getTranslations({ locale, namespace: "services" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const sectors = await getAllSectors();

  return (
    <>
      <Breadcrumb
        items={[
          { label: tNav("home"), href: `/${locale}` },
          { label: tNav("civicServices") },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title={tServices("title")}
          description={tServices("subtitle")}
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            CivicSector.ROADS_TRANSPORT,
            CivicSector.WATER_SANITATION,
            CivicSector.EDUCATION,
            CivicSector.HEALTH,
            CivicSector.OTHER_CIVIC_WORKS,
          ].map((sector) => {
            const sectorInfo = sectors.find((s) => s.sector === sector);
            const slug = getSlugFromSector(sector);
            const title = locale === "mr" 
              ? (sectorInfo?.titleMr || SECTOR_LABELS_MR[sector])
              : (sectorInfo?.titleEn || SECTOR_LABELS_EN[sector]);
            const tagline = locale === "mr"
              ? (sectorInfo?.taglineMr || "माहिती अधिकृत पडताळणीनंतर प्रसिद्ध केली जाईल.")
              : (sectorInfo?.taglineEn || "Sector information will be published once verified.");

            return (
              <Link
                key={sector}
                href={`/${locale}/services/${slug}`}
                className="group border border-slate-200 bg-white p-5 rounded-2xl hover:border-amber-400 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                    {locale === "mr" ? SECTOR_LABELS_MR[sector] : SECTOR_LABELS_EN[sector]}
                  </span>
                  <DataStatusBadge status={(sectorInfo?.dataStatus as "VERIFIED" | "SAMPLE_TBD") || "SAMPLE_TBD"} showVerified />
                </div>

                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-amber-700 transition-colors mb-1">
                  {title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {tagline}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700">{tServices("exploreSector")} →</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Data Integrity Notice */}
        <div className="mt-12 border-l-[3px] border-amber-500 bg-amber-50/40 px-4 py-4">
          <h4 className="text-xs font-semibold text-slate-900 mb-2">{tServices("dataIntegrityTitle")}</h4>
          <ul className="text-xs text-slate-700 space-y-1">
            <li>• {tServices("dataIntegrityPoint1")}</li>
            <li>• {tServices("dataIntegrityPoint2")}</li>
            <li>• {tServices("dataIntegrityPoint3")}</li>
            <li>• {tServices("dataIntegrityPoint4")}</li>
            <li>• {tServices("dataIntegrityPoint5")}</li>
          </ul>
        </div>
      </div>
    </>
  );
}