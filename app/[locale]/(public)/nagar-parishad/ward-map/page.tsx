"use client";

import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { wards, developmentWorks } from "@/lib/mock-data";
import { getWardProfile } from "@/lib/ward-profiles";
import {
  wardMapMarkers,
  wardMapMarkersMobile,
  ASSEMBLY_MAP_WIDTH,
  ASSEMBLY_MAP_HEIGHT,
  ASSEMBLY_MAP_MOBILE_WIDTH,
  ASSEMBLY_MAP_MOBILE_HEIGHT,
  ASSEMBLY_MAP_IMAGE,
  ASSEMBLY_MAP_MOBILE_IMAGE,
  type WardMapMarker,
} from "@/lib/ward-map-markers";

function WardMapOverlay({
  variant,
  width,
  height,
  markers,
  radius,
  label,
}: {
  variant: "mobile" | "desktop";
  width: number;
  height: number;
  markers: WardMapMarker[];
  radius: number;
  label: string;
}) {
  const locale = useLocale();
  const tCommon = useTranslations("common");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`ward-map-svg absolute inset-0 h-full w-full ${
        variant === "mobile" ? "sm:hidden" : "hidden sm:block"
      }`}
      role="group"
      aria-label={label}
    >
      {markers.map((marker) => (
        <a
          key={marker.number}
          href={`/${locale}/nagar-parishad/ward-map/${marker.number}`}
          aria-label={`${tCommon("ward")} ${marker.number} — ${marker.wardName}`}
          className="ward-map-svg__link"
        >
          <circle
            cx={marker.cx}
            cy={marker.cy}
            r={radius}
            className="ward-map-svg__marker"
          />
        </a>
      ))}
    </svg>
  );
}

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

      <div className="mx-auto max-w-[1180px] px-4 pt-11">
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
      </div>

      {/* INTERACTIVE WARD MAP — full-bleed, unframed */}
      <section className="mt-7 mb-8">
        <div className="mx-auto max-w-[1180px] px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--zari-gold-600)]">
                {t("interactiveMapTitle")}
              </p>
              <h2 className="mt-2 max-w-md font-display text-2xl font-semibold text-[var(--gov-navy-900)] sm:text-3xl">
                {t("interactiveMapHeading")}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--civic-slate-700)]">
                {t("interactiveMapHint")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold text-[var(--gov-navy-900)]">17</span>
              <span className="text-sm text-[var(--civic-slate-700)]">
                municipal wards
                <br />
                in this directory
              </span>
            </div>
          </div>
        </div>

        <figure className="ward-map-bleed relative mt-6 w-full">
          <picture className="block">
            <source
              media="(max-width: 39.98rem)"
              srcSet={ASSEMBLY_MAP_MOBILE_IMAGE}
              width={ASSEMBLY_MAP_MOBILE_WIDTH}
              height={ASSEMBLY_MAP_MOBILE_HEIGHT}
            />
            <img
              src={ASSEMBLY_MAP_IMAGE}
              alt="Paithan ward map showing all 17 wards along the Godavari river"
              width={ASSEMBLY_MAP_WIDTH}
              height={ASSEMBLY_MAP_HEIGHT}
              className="block h-auto w-full"
            />
          </picture>
          <WardMapOverlay
            variant="mobile"
            width={ASSEMBLY_MAP_MOBILE_WIDTH}
            height={ASSEMBLY_MAP_MOBILE_HEIGHT}
            markers={wardMapMarkersMobile}
            radius={60}
            label={t("interactiveMapTitle")}
          />
          <WardMapOverlay
            variant="desktop"
            width={ASSEMBLY_MAP_WIDTH}
            height={ASSEMBLY_MAP_HEIGHT}
            markers={wardMapMarkers}
            radius={36}
            label={t("interactiveMapTitle")}
          />
        </figure>
      </section>

        <div className="mx-auto max-w-[1180px] px-4 pb-11">
        {/* 17 WARDS DIRECTORY CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wards.map((ward) => {
            const confirmedWorks = developmentWorks.filter((work) => work.wardNumber === ward.number && work.dataStatus === "VERIFIED");
            const profile = getWardProfile(ward.number);
            const wardDisplayName = isMr ? ward.nameMr : ward.name;
            return (
              <article
                key={ward.number}
                id={`ward-${ward.number}`}
                className="scroll-mt-32 flex flex-col justify-between border border-[var(--border-subtle)] bg-white p-0 transition-shadow hover:shadow-md target:border-[var(--portal-blue-700)] target:ring-2 target:ring-[var(--zari-gold-500)]"
              >
                <img src={profile.image} alt="" className="h-44 w-full object-cover" />
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
                    {confirmedWorks.length ? `${confirmedWorks.length} confirmed works` : "Updates awaiting verification"}
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
