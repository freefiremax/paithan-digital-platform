import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSectorFromSlug, SECTOR_LABELS_EN, FACILITY_TYPE_LABELS_EN, FACILITY_TYPE_LABELS_MR } from "@/lib/auth/permissions";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkStatusBadge } from "@/components/ui/WorkStatusBadge";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";

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

export async function generateMetadata({ params }: { params: Promise<{ sector: string }> }): Promise<Metadata> {
  const { sector: sectorSlug } = await params;
  const sector = getSectorFromSlug(sectorSlug);
  if (!sector) return { title: "Sector Not Found" };

  const data = await getSectorData(sectorSlug);
  const titleEn = data?.sectorInfo?.titleEn || SECTOR_LABELS_EN[sector];

  return {
    title: `${titleEn} | Paithan Municipal Council`,
    description: data?.sectorInfo?.taglineEn || `Information about ${titleEn} sector in Paithan`,
    openGraph: {
      title: `${titleEn} | Paithan Municipal Council`,
      description: data?.sectorInfo?.taglineEn || `Information about ${titleEn} sector in Paithan`,
    },
  };
}

export default async function SectorPage({ params }: { params: Promise<{ sector: string }> }) {
  const { sector: sectorSlug } = await params;
  const sector = getSectorFromSlug(sectorSlug);

  if (!sector) notFound();

  const data = await getSectorData(sectorSlug);
  if (!data?.sectorInfo) notFound();

  const { sectorInfo, works, facilities } = data;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: SECTOR_LABELS_EN[sector] },
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
          title={sectorInfo.titleEn}
          description={sectorInfo.taglineEn}
        />

        <div className="prose prose-sm max-w-none text-slate-700 mb-12">
          <p>{sectorInfo.overviewEn}</p>
          <p className="font-marathi text-slate-500 mt-4">{sectorInfo.overviewMr}</p>
        </div>

        {/* Department & Contact Info */}
        <div className="mb-12 p-5 bg-slate-50 border border-slate-200 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Department & Contact</h3>
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
            title="Development Works"
            description={`Ongoing, planned, and completed ${SECTOR_LABELS_EN[sector].toLowerCase()} projects across Paithan's wards.`}
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
                      {work.title}
                    </h2>
                    {work.titleMr && (
                      <p lang="mr" className="text-xs text-slate-500 mt-0.5">
                        {work.titleMr}
                      </p>
                    )}

                    <p className="mt-2.5 text-xs text-slate-700 leading-relaxed">
                      {work.description}
                    </p>
                    {work.descriptionMr && (
                      <p lang="mr" className="mt-2 text-xs text-slate-500 font-marathi leading-relaxed">
                        {work.descriptionMr}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200 space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                        <span>Progress</span>
                        <span>{work.progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-800 h-full rounded-full transition-all duration-300"
                          style={{ width: `${work.progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                      {work.budget !== null && (
                        <span className="font-semibold text-slate-800">
                          Budget: ₹{work.budget.toFixed(1)} Lakhs
                        </span>
                      )}
                      <span>Dept: {work.department}</span>
                    </div>

                    {(work.startDate || work.expectedCompletion) && (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span>
                          Timeline:{" "}
                          {work.startDate ? work.startDate.toLocaleDateString("en-IN") : "—"} to{" "}
                          {work.expectedCompletion
                            ? work.expectedCompletion.toLocaleDateString("en-IN")
                            : "—"}
                        </span>
                      </div>
                    )}

                    <DataStatusBadge status={work.dataStatus as "VERIFIED" | "SAMPLE_TBD"} showVerified />
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
            title="Public Facilities"
            description={`Schools, health centers, water works, and community facilities in the ${SECTOR_LABELS_EN[sector].toLowerCase()} sector.`}
          />

          {facilities.length === 0 ? (
            <div className="border border-slate-200 bg-white p-12 text-center">
              <DataStatusBadge status={sectorInfo.dataStatus as "VERIFIED" | "SAMPLE_TBD"} showVerified />
              <p className="mt-3 text-sm font-semibold text-slate-700">No facilities published yet.</p>
              <p className="mt-1 text-xs text-slate-500">
                Facility records will appear here once verified by the Nagar Parishad.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility) => (
                <article
                  key={facility.id}
                  className="border border-slate-200 bg-white p-5 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        facility.isOperational
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-red-50 text-red-800"
                      }`}
                    >
                      {facility.isOperational ? "Operational" : "Non-Operational"}
                    </span>
                    <DataStatusBadge status={facility.dataStatus as "VERIFIED" | "SAMPLE_TBD"} showVerified />
                  </div>

                  <h3 className="font-semibold text-slate-900">{facility.nameEn}</h3>
                  {facility.nameMr && (
                    <p lang="mr" className="text-xs text-slate-500 font-marathi mt-0.5">
                      {facility.nameMr}
                    </p>
                  )}

                  <div className="mt-3 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-slate-800">Type:</span>
                      <span>
                        {FACILITY_TYPE_LABELS_EN[facility.type] || facility.type}
                        {facility.type && FACILITY_TYPE_LABELS_MR[facility.type] && (
                          <span className="font-marathi text-slate-400 ml-1">
                            ({FACILITY_TYPE_LABELS_MR[facility.type]})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-slate-800">Address:</span>
                      <span>{facility.address}</span>
                    </div>
                    {facility.ward && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-slate-800">Ward:</span>
                        <span>Ward {facility.ward.number} — {facility.ward.name}</span>
                      </div>
                    )}
                    {facility.contactJson && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-slate-500 hover:text-slate-700">
                          Contact Details
                        </summary>
                        <pre className="mt-1 text-[10px] text-slate-600 font-mono bg-slate-50 p-2 rounded border border-slate-200 overflow-x-auto">
                          {JSON.stringify(facility.contactJson, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}