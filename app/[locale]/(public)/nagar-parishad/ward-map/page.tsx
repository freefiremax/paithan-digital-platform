"use client";

import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { wards, getWardWorkSummary } from "@/lib/mock-data";

export default function WardMapPage() {
  const t = useTranslations("nagarParishad");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMr = locale === "mr";
  const wardImages = ["ward-01.jpeg", "ward-02.jpeg", "ward-03.jpeg", "ward-04.jpeg", "ward-05.jpeg", "ward-06.jpeg"];

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

        <section className="mt-7 overflow-hidden border border-[var(--gov-navy-800)] bg-[var(--gov-navy-900)] text-white shadow-lg">
          <div className="grid items-stretch lg:grid-cols-[1.15fr_.85fr]">
            <div className="relative min-h-[260px] overflow-hidden">
              <img src="/maps/paithan-17-wards-base.png" alt="Paithan municipal 17 ward map" className="absolute inset-0 h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(3,20,43,.8)] via-[rgba(3,20,43,.35)] to-transparent" />
              <div className="relative flex h-full min-h-[260px] items-end p-6 sm:p-8">
                <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--zari-gold-300)]">Interactive ward directory</p><h2 className="mt-2 max-w-md font-display text-2xl font-semibold sm:text-3xl">Choose a ward to see its place profile and local updates.</h2></div>
              </div>
            </div>
            <div className="flex flex-col justify-center border-t border-white/15 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <p className="text-sm leading-6 text-white/75">The directory below is the reliable way to open a ward page. Every card is linked to its own address, so the selected location does not fall back to the directory.</p>
              <div className="mt-5 flex items-center gap-3"><span className="text-3xl font-semibold text-[var(--zari-gold-300)]">17</span><span className="text-sm text-white/75">municipal wards<br />in this directory</span></div>
            </div>
          </div>
        </section>

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
                className="scroll-mt-32 flex flex-col justify-between border border-[var(--border-subtle)] bg-white p-0 transition-shadow hover:shadow-md target:border-[var(--portal-blue-700)] target:ring-2 target:ring-[var(--zari-gold-500)]"
              >
                <img src={`/images/wards/${wardImages[(ward.number - 1) % wardImages.length]}`} alt="" className="h-32 w-full object-cover" />
                <div className="p-5">
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

                <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-xs">
                  <span className="text-slate-500">
                    {summary.total} {t("activeWorks")}{" "}
                    {summary.ongoing > 0 ? (
                      <strong className="text-amber-700">({summary.ongoing} {t("ongoingWorks")})</strong>
                    ) : null}
                  </span>
                  <Link
                    href={`/${locale}/nagar-parishad/ward-map/${ward.number}`}
                    className="text-[var(--gov-navy-700)] font-medium hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>{t("viewDetails")}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
