import { Metadata } from "next";
import Link from "next/link";
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

export default async function ServicesIndexPage() {
  const sectors = await getAllSectors();

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title="Civic Services & Sectors"
          description="Paithan Municipal Council delivers essential services across five key sectors. Each sector page shows live data on development works, public facilities, and departmental information."
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

            return (
              <Link
                key={sector}
                href={`/services/${slug}`}
                className="group border border-slate-200 bg-white p-5 rounded-2xl hover:border-amber-400 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                    {SECTOR_LABELS_EN[sector]}
                  </span>
                  <DataStatusBadge status={(sectorInfo?.dataStatus as "VERIFIED" | "SAMPLE_TBD") || "SAMPLE_TBD"} showVerified />
                </div>

                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-amber-700 transition-colors mb-1">
                  {sectorInfo?.titleEn || SECTOR_LABELS_EN[sector]}
                </h3>
                <p lang="mr" className="text-xs text-slate-500 font-marathi mb-3">
                  {sectorInfo?.titleMr || SECTOR_LABELS_MR[sector]}
                </p>

                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {sectorInfo?.taglineEn || "Sector information will be published once verified."}
                </p>
                <p lang="mr" className="text-xs text-slate-400 font-marathi mb-4">
                  {sectorInfo?.taglineMr || "माहिती अधिकृत पडताळनीनंतर प्रसिद्ध केली जाईल."}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700">Explore Sector →</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Data Integrity Notice */}
        <div className="mt-12 border-l-[3px] border-amber-500 bg-amber-50/40 px-4 py-4">
          <h4 className="text-xs font-semibold text-slate-900 mb-2">Data Integrity Commitment</h4>
          <ul className="text-xs text-slate-700 space-y-1">
            <li>• All sector data is sourced from official Nagar Parishad records.</li>
            <li>• Records marked <DataStatusBadge status="SAMPLE_TBD" /> are illustrative samples awaiting official verification.</li>
            <li>• Records marked <DataStatusBadge status="VERIFIED" /> have been confirmed against gazetted/departmental sources.</li>
            <li>• Empty sectors indicate no verified records have been published yet — never fabricated data.</li>
            <li>• Census 2011 statistics are explicitly labeled where used.</li>
          </ul>
        </div>
      </div>
    </>
  );
}