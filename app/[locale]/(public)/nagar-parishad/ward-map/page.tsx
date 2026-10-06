"use client";

import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { wards, getWardWorkSummary, councilProfile } from "@/lib/mock-data";

export default function WardMapPage() {
  const t = useTranslations("nagarParishad");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMr = locale === "mr";

  return (
    <>
      <Breadcrumb
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("nagarParishad"), href: "/nagar-parishad" },
          { label: t("wardMapTitle") },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title={t("wardMapTitle")}
          description={t("wardMapSubtitle")}
        />

        {/* DELIMITATION NOTICE */}
        <div className="mt-4 mb-8 border-l-[3px] border-[var(--zari-gold-500)] bg-[var(--zari-gold-100)]/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <DataStatusBadge status="SAMPLE_TBD" />
            <span className="text-xs font-semibold text-[var(--gov-navy-900)]">
              {t("secAdvisoryTitle")}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--civic-slate-700)] leading-relaxed">
            {t("secAdvisoryText")}
          </p>
        </div>

        {/* 17 WARDS DIRECTORY CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wards.map((ward) => {
            const summary = getWardWorkSummary(ward.number);
            const wardDisplayName = isMr ? ward.nameMr : ward.name;
            return (
              <article
                key={ward.number}
                id={`ward-${ward.number}`}
                className="scroll-mt-32 border border-[var(--border-subtle)] bg-white p-5 flex flex-col justify-between target:border-[var(--portal-blue-700)] target:ring-2 target:ring-[var(--zari-gold-500)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--zari-gold-600)] uppercase tracking-wider">
                      {tCommon("ward")} {ward.number}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      #{ward.number}
                    </span>
                  </div>

                  <h2 className="mt-2 text-base font-semibold text-[var(--gov-navy-900)] font-serif">
                    {wardDisplayName}
                  </h2>
                  {!isMr && ward.nameMr ? (
                    <p lang="mr" className="text-xs text-slate-500 mt-0.5">
                      {ward.nameMr}
                    </p>
                  ) : null}

                  <div className="mt-3 flex items-start gap-1.5 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{tCommon("address")}: {ward.locality}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {summary.total} {t("activeWorks")}{" "}
                    {summary.ongoing > 0 ? (
                      <strong className="text-amber-700">({summary.ongoing} {t("ongoingWorks")})</strong>
                    ) : null}
                  </span>
                  <Link
                    href={`/nagar-parishad/development-works`}
                    className="text-[var(--gov-navy-700)] font-medium hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>{t("viewDetails")}</span>
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
