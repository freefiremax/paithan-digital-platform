import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSectorFromSlug, SECTOR_LABELS_EN, SECTOR_LABELS_MR, FACILITY_TYPE_LABELS_EN } from "@/lib/auth/permissions";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkStatusBadge } from "@/components/ui/WorkStatusBadge";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

async function getSectorData(sectorSlug: string) {
  const sector = getSectorFromSlug(sectorSlug);
  if (!sector) return null;

  const [sectorInfo, works, facilities] = await Promise.all([
    prisma.civicSectorInfo.findUnique({ where: { sector } }),
    prisma.developmentWork.findMany({
      where: { sector },
      orderBy: { createdAt: "desc" },
      include: {
        ward: { select: { number: true, name: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.facility.findMany({
      where: { sector },
      orderBy: { createdAt: "desc" },
      include: {
        ward: { select: { number: true, name: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    }),
  ]);

  return { sector, sectorInfo, works, facilities };
}

export async function generateMetadata({ params }: { params: Promise<{ sector: string; locale: string }> }): Promise<Metadata> {
  const { sector: sectorSlug, locale } = await params;
  const sector = getSectorFromSlug(sectorSlug);
  if (!sector) return { title: "Sector Not Found" };

  const data = await getSectorData(sectorSlug);
  const title = locale === "mr" 
    ? (data?.sectorInfo?.titleMr || SECTOR_LABELS_MR[sector])
    : (data?.sectorInfo?.titleEn || SECTOR_LABELS_EN[sector]);

  return {
    title: `${title} | Paithan Municipal Council`,
    description: data?.sectorInfo?.taglineEn || `Information about ${title} sector in Paithan`,
  };
}

export default async function SectorPage({ params }: { params: Promise<{ sector: string; locale: string }> }) {
  const { sector: sectorSlug, locale } = await params;
  const sector = getSectorFromSlug(sectorSlug);

  if (!sector) notFound();

  const data = await getSectorData(sectorSlug);
  if (!data?.sectorInfo) notFound();

  const { sectorInfo, works, facilities } = data;
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tNagar = await getTranslations({ locale, namespace: "nagarParishad" });

  const sectorTitle = locale === "mr" ? (sectorInfo.titleMr || SECTOR_LABELS_MR[sector]) : sectorInfo.titleEn;
  const sectorTagline = locale === "mr" ? (sectorInfo.taglineMr || sectorInfo.taglineEn) : sectorInfo.taglineEn;

  return (
    <>
      <Breadcrumb
        items={[
          { label: tNav("home"), href: `/${locale}` },
          { label: tNav("civicServices"), href: `/${locale}/services` },
          { label: locale === "mr" ? SECTOR_LABELS_MR[sector] : SECTOR_LABELS_EN[sector] },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        {/* PROVENANCE NOTICE */}
        <div className="mb-8 border-l-[3px] border-amber-500 bg-amber-50/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <DataStatusBadge status={sectorInfo.dataStatus as "VERIFIED" | "SAMPLE_TBD"} />
            <span className="text-xs font-semibold text-slate-900">
              {sectorInfo.dataStatus === "VERIFIED" ? "Verified Official Record" : "Illustrative Sector Overview"}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-700 leading-relaxed">
            {sectorInfo.dataStatus === "VERIFIED"
              ? "This sector information has been verified against official Nagar Parishad records."
              : "The information below illustrates the sector framework. Live data will be populated once the Nagar Parishad technical department publishes its verified records."}
          </p>
        </div>

        <SectionHeading
          as="h1"
          title={sectorTitle}
          description={sectorTagline}
        />

        <div className="prose prose-sm max-w-none text-slate-700 mb-12">
          <p>{locale === "mr" && sectorInfo.overviewMr ? sectorInfo.overviewMr : sectorInfo.overviewEn}</p>
          {locale !== "mr" && sectorInfo.overviewMr && (
            <p className="font-marathi text-slate-500 mt-4">{sectorInfo.overviewMr}</p>
          )}
        </div>

        {/* Department & Contact Info */}
        <div className="mb-12 p-5 bg-slate-50 border border-slate-200 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Department &amp; Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-slate-900">Department:</span>{" "}
              <span className="text-slate-700">{sectorInfo.department}</span>
            </div>
            {sectorInfo.contactJson && (
              <div>
                <span className="font-semibold text-slate-900">Contact:</span>
                <pre className="mt-1 text-xs text-slate-600 font-mono bg-white p-2 rounded border border-slate-200 overflow-x-auto">
                  {JSON.stringify(sectorInfo.contactJson, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Development Works */}
        <section className="mb-12">
          <SectionHeading
            as="h2"
            title={tNagar("devWorksTitle")}
            description={tNagar("devWorksSubtitle")}
          />

          {works.length === 0 ? (
            <div className="border border-slate-200 bg-white p-12 text-center">
              <DataStatusBadge status={sectorInfo.dataStatus as "VERIFIED" | "SAMPLE_TBD"} showVerified />
              <p className="mt-3 text-sm font-semibold text-slate-700">No development works published yet.</p>
              <p className="mt-1 text-xs text-slate-500">
                Records will appear here once verified by the Nagar Parishad engineering department.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {works.map((work) => (
                <article
                  key={work.id}
                  className="border border-slate-200 bg-white p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      {work.ward && (
                        <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                          Ward {work.ward.number} • {work.ward.name}
                        </span>
                      )}
                      <WorkStatusBadge status={work.status as "PLANNED" | "ONGOING" | "COMPLETED"} />
                    </div>

                    <h2 className="mt-2 text-[0.9375rem] font-semibold text-slate-900 leading-snug">
                      {locale === "mr" && work.titleMr ? work.titleMr : work.title}
                    </h2>
                    {locale !== "mr" && work.titleMr && (
                      <p lang="mr" className="text-xs text-slate-500 mt-0.5">
                        {work.titleMr}
                      </p>
                    )}

                    <p className="mt-2.5 text-xs text-slate-700 leading-relaxed">
                      {locale === "mr" && work.descriptionMr ? work.descriptionMr : work.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200 space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                        <span>{tNagar("stage")}</span>
                        <span>{work.progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full"
                          style={{ width: `${work.progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{tNagar("projectBudget")}: {work.budget ? `₹${work.budget} ${locale === "mr" ? "लाख" : locale === "hi" ? "लाख" : "Lakhs"}` : "—"}</span>
                      {work.department && <span>{tNagar("department")}: {work.department}</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Facilities */}
        <section>
          <SectionHeading
            as="h2"
            title="Public Facilities &amp; Infrastructure"
            description={`Key municipal facilities and assets in the ${SECTOR_LABELS_EN[sector].toLowerCase()} sector.`}
          />

          {facilities.length === 0 ? (
            <div className="border border-slate-200 bg-white p-12 text-center">
              <DataStatusBadge status={sectorInfo.dataStatus as "VERIFIED" | "SAMPLE_TBD"} showVerified />
              <p className="mt-3 text-sm font-semibold text-slate-700">No public facilities published yet.</p>
              <p className="mt-1 text-xs text-slate-500">
                Facility directory will be populated following departmental survey verification.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility) => (
                <div
                  key={facility.id}
                  className="border border-slate-200 bg-white p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                        {FACILITY_TYPE_LABELS_EN[facility.type] || facility.type}
                      </span>
                      {facility.ward && (
                        <span className="text-[10px] font-semibold text-slate-600">
                          Ward {facility.ward.number}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 mb-1">
                      {locale === "mr" && facility.nameMr ? facility.nameMr : facility.nameEn}
                    </h4>
                    {locale !== "mr" && facility.nameMr && (
                      <p lang="mr" className="text-xs text-slate-500 font-marathi mb-2">
                        {facility.nameMr}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 mb-2">
                      {facility.address}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{facility.isOperational ? "Operational" : "Under Maintenance"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}