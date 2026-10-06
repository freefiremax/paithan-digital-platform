"use client";

import React from "react";
import Image from "next/image";
import { Clock, Tag, Calendar, CheckCircle2, MapPin } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  TOURIST_PLACES,
  jayakwadiDamSpecs,
  jaikwadiBirdSanctuaryInfo,
  paithanConnectivity,
} from "@/lib/mock-data";

export default function PlacesToVisitPage() {
  const t = useTranslations("tourism");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMr = locale === "mr";

  return (
    <>
      <Breadcrumb
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("tourism"), href: "/tourism" },
          { label: t("placesTitle") },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title={t("placesTitle")}
          description={t("placesSubtitle")}
        />

        {/* DESTINATIONS GRID */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {TOURIST_PLACES.map((place) => {
            const placeName = isMr && place.nameMr ? place.nameMr : place.nameEn;
            return (
              <article
                key={place.id}
                id={place.slug}
                className="border border-[var(--border-subtle)] bg-white overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Official Landmark Image */}
                  <div className="relative w-full h-56 bg-slate-100 overflow-hidden group">
                    <Image
                      src={place.imageUrl}
                      alt={place.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    
                    {/* Category & Badge overlay */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-[var(--gov-navy-900)]/90 text-[var(--zari-gold-300)] text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider backdrop-blur-xs">
                        {place.category.replace("_", " ")}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="flex items-center gap-1 font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded">
                        <MapPin className="w-3 h-3 text-[var(--zari-gold-400)]" />
                        {place.distanceFromBusStand}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-[var(--gov-navy-900)] font-serif">
                      {placeName}
                    </h2>
                    {!isMr && place.nameMr ? (
                      <p lang="mr" className="text-sm text-slate-500 mt-0.5 font-medium">
                        {place.nameMr}
                      </p>
                    ) : null}

                    <p className="mt-2 text-xs font-semibold text-[var(--gov-navy-700)]">
                      {place.tagline}
                    </p>

                    <p className="mt-3 text-xs text-slate-700 leading-relaxed">
                      {place.description}
                    </p>

                    {/* Highlights */}
                    <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                        {tCommon("overview")}:
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {place.highlights.map((hl, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Practical Info Strip */}
                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] p-6 bg-slate-50/50 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{t("timings")}: {place.visitingHours}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{t("entryFee")}: {place.entryFee}</span>
                  </div>
                  <div className="flex items-start gap-1.5 col-span-2 text-[10px] text-slate-500">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    <span>{t("bestTime")}: {place.bestSeason}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* JAYAKWADI DAM ENGINEERING DATASHEET */}
        <section className="mt-14" aria-labelledby="dam-datasheet-heading">
          <SectionHeading
            id="dam-datasheet-heading"
            title={t("damSpecsHeading")}
            description={t("damSpecsSubtitle")}
          />

          <div className="mt-6 border border-[var(--border-subtle)] bg-white p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="border border-[var(--border-subtle)] p-3.5 bg-slate-50/50">
                <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                  {t("damLength")}
                </span>
                <p className="mt-1 text-xl font-bold text-[var(--gov-navy-900)] font-serif">
                  {jayakwadiDamSpecs.totalLengthMeters.toLocaleString(isMr ? "mr-IN" : "en-IN")} m
                </p>
                <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">9.998 km</p>
              </div>

              <div className="border border-[var(--border-subtle)] p-3.5 bg-slate-50/50">
                <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                  {t("damStorage")}
                </span>
                <p className="mt-1 text-xl font-bold text-[var(--gov-navy-900)] font-serif">
                  {jayakwadiDamSpecs.grossStorageTMC} TMC
                </p>
                <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">2,909 M m³</p>
              </div>

              <div className="border border-[var(--border-subtle)] p-3.5 bg-slate-50/50">
                <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                  {t("damGates")}
                </span>
                <p className="mt-1 text-xl font-bold text-[var(--zari-gold-600)] font-serif">
                  {jayakwadiDamSpecs.spillwayRadialGates}
                </p>
                <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">
                  {locale === "mr" ? "ओजी सांडवा" : locale === "hi" ? "ओगी स्पिलवे" : "Ogee Spillway"}
                </p>
              </div>

              <div className="border border-[var(--border-subtle)] p-3.5 bg-slate-50/50">
                <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                  {t("damIrrigation")}
                </span>
                <p className="mt-1 text-xl font-bold text-emerald-800 font-serif">
                  {(jayakwadiDamSpecs.irrigatedCommandAreaHectares / 100000).toFixed(2)} {locale === "mr" ? "लाख हे." : locale === "hi" ? "लाख हे." : "Lakh Ha"}
                </p>
                <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">
                  {locale === "mr" ? "मराठवाडा" : locale === "hi" ? "मराठवाड़ा" : "Marathwada"}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] bg-emerald-50/50 p-4 rounded-sm">
              <h4 className="font-semibold text-emerald-900 text-xs font-serif mb-1">
                {isMr ? jaikwadiBirdSanctuaryInfo.nameMr : jaikwadiBirdSanctuaryInfo.nameEn}
              </h4>
              <p className="text-[11px] text-emerald-800 leading-relaxed mb-2">
                {t("birdSanctuarySubtitle")}
              </p>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {jaikwadiBirdSanctuaryInfo.prominentMigratoryBirds.slice(0, 5).map((bird, bIdx) => (
                  <span key={bIdx} className="bg-white/80 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded">
                    {bird}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO REACH PAITHAN */}
        <section className="mt-14" aria-labelledby="reach-heading">
          <SectionHeading
            id="reach-heading"
            title={t("transportHeading")}
            description={t("transportSubtitle")}
          />

          <div className="mt-6 overflow-hidden border border-[var(--border-subtle)] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--gov-navy-900)] text-white font-serif uppercase tracking-wider text-[0.6875rem]">
                    <th className="py-3 px-4">{tCommon("address")}</th>
                    <th className="py-3 px-4">{t("distance")}</th>
                    <th className="py-3 px-4">{t("timings")}</th>
                    <th className="py-3 px-4">{t("howToReach")}</th>
                    <th className="py-3 px-4">{tCommon("overview")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {paithanConnectivity.map((city, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[var(--gov-navy-900)]">
                        {city.destinationCity}
                      </td>
                      <td className="py-3 px-4 font-bold text-[var(--zari-gold-600)]">
                        {city.distanceKm} km
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {city.travelTimeHours}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {city.routeVia}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {city.transitModes.join(" • ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
