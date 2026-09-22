import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { wards, getWardWorkSummary, councilProfile } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "17 Wards & Ward Map",
  description:
    "Ward directory and locality map of Paithan Municipal Council covering all 17 administrative wards.",
};

export default function WardMapPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Nagar Parishad", href: "/nagar-parishad" },
          { label: "17 Wards Map" },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title={`${councilProfile.wardCount} Wards Directory`}
          description={`Paithan Municipal Council is structured into ${councilProfile.wardCount} administrative census wards across key historic neighborhoods including Brahmapuri, Nagghat, the Weavers Colony, Mahavir Chowk, and the Jayakwadi dam perimeter.`}
        />

        {/* DELIMITATION NOTICE */}
        <div className="mt-4 mb-8 border-l-[3px] border-[var(--zari-gold-500)] bg-[var(--zari-gold-100)]/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <DataStatusBadge status="SAMPLE_TBD" />
            <span className="text-xs font-semibold text-[var(--gov-navy-900)]">
              Ward Delimitation & Gazette Status
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--civic-slate-700)] leading-relaxed">
            Paithan comprises {councilProfile.wardCount} primary census administrative wards, while the recent state delimitation proposal features {councilProfile.delimitedSeatsCount} seats.
            Individual corporator names and final boundary polygons remain subject to the forthcoming Municipal Council election gazette.
          </p>
        </div>

        {/* 17 WARDS DIRECTORY CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wards.map((ward) => {
            const summary = getWardWorkSummary(ward.number);
            return (
              <article
                key={ward.number}
                className="border border-[var(--border-subtle)] bg-white p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--zari-gold-600)] uppercase tracking-wider">
                      Ward No. {ward.number}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      Prabhag {ward.number}
                    </span>
                  </div>

                  <h2 className="mt-2 text-base font-semibold text-[var(--gov-navy-900)] font-serif">
                    {ward.name}
                  </h2>
                  <p lang="mr" className="text-xs text-slate-500 mt-0.5">
                    {ward.nameMr}
                  </p>

                  <div className="mt-3 flex items-start gap-1.5 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>Locality: {ward.locality}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {summary.total} {summary.total === 1 ? "project" : "projects"}{" "}
                    {summary.ongoing > 0 ? (
                      <strong className="text-amber-700">({summary.ongoing} ongoing)</strong>
                    ) : null}
                  </span>
                  <Link
                    href={`/nagar-parishad/development-works`}
                    className="text-[var(--gov-navy-700)] font-medium hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>View works</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
