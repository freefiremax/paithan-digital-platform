"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Clock,
  Waves,
  Feather,
  ArrowRight,
  Sparkles,
  Tag,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { TOURIST_PLACES } from "@/lib/mock-data";

export default function TourismLandingPage() {
  const t = useTranslations("tourism");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMr = locale === "mr";

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner */}
        <div className="bg-gradient-to-r from-oxide-700 via-oxide-800 to-teal-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{t("title")}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t("placesTitle")}
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {t("placesSubtitle")}
            </p>
          </div>
        </div>

        {/* Quick Tourism Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/tourism/jayakwadi"
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition text-center group"
          >
            <Waves className="w-6 h-6 text-blue-600 mx-auto group-hover:scale-110 transition" />
            <div className="font-bold text-xs text-slate-900 mt-2">{t("jayakwadiTitle")}</div>
            <div className="text-[10px] text-slate-500">{t("damSpecsHeading")}</div>
          </Link>

          <Link
            href="/tourism/nath-sagar"
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition text-center group"
          >
            <Feather className="w-6 h-6 text-emerald-600 mx-auto group-hover:scale-110 transition" />
            <div className="font-bold text-xs text-slate-900 mt-2">{t("nathSagarTitle")}</div>
            <div className="text-[10px] text-slate-500">{t("birdSanctuaryHeading")}</div>
          </Link>

          <Link
            href="/tourism/heritage-sites"
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition text-center group"
          >
            <Sparkles className="w-6 h-6 text-amber-600 mx-auto group-hover:scale-110 transition" />
            <div className="font-bold text-xs text-slate-900 mt-2">{t("heritageSitesTitle")}</div>
            <div className="text-[10px] text-slate-500">{t("heritageSitesSubtitle")}</div>
          </Link>

          <Link
            href="/tourism/map"
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition text-center group"
          >
            <MapPin className="w-6 h-6 text-purple-600 mx-auto group-hover:scale-110 transition" />
            <div className="font-bold text-xs text-slate-900 mt-2">{t("mapTitle")}</div>
            <div className="text-[10px] text-slate-500">{t("transportHeading")}</div>
          </Link>
        </div>

        {/* Tourist Places Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t("placesHeading")}</h2>
              <p className="text-xs text-slate-500">{t("placesSubheading")}</p>
            </div>
            <Link
              href="/tourism/routes"
              className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1"
            >
              <span>{t("routesTitle")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOURIST_PLACES.map((place) => {
              const placeName = isMr && place.nameMr ? place.nameMr : place.nameEn;
              return (
                <div
                  key={place.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-amber-400/80 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        {place.category.replace("_", " ")}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {place.distanceFromBusStand}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{placeName}</h3>
                      {!isMr && place.nameMr ? (
                        <p className="text-xs text-slate-500 font-marathi mt-0.5">{place.nameMr}</p>
                      ) : null}
                      <p className="text-xs text-amber-800 font-medium mt-1">{place.tagline}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {place.description}
                    </p>

                    <div className="space-y-1.5 pt-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{t("timings")}: {place.visitingHours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{t("entryFee")}: {place.entryFee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">{t("bestTime")}: {place.bestSeason}</span>
                    <Link
                      href={`/tourism/places-to-visit#${place.slug}`}
                      className="text-amber-700 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>{tCommon("details")}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
