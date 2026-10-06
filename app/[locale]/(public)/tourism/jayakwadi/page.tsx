"use client";

import React from "react";
import Image from "next/image";
import {
  Waves,
  Clock,
  MapPin,
  Tag,
  Calendar,
  Compass,
  Droplets,
  Info,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function JayakwadiPage() {
  const t = useTranslations("tourism");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMr = locale === "mr";

  const damSpecs = [
    { label: t("damLength"), value: "9,992 m (9.99 km)", subtext: "Asia's largest earthen dam" },
    { label: t("damHeight"), value: "41.30 m", subtext: "Above foundation level" },
    { label: t("damStorage"), value: "102.7 TMC (2,909 MCM)", subtext: "Nath Sagar reservoir" },
    { label: t("sanctuaryArea"), value: "350 sq km", subtext: "Godavari River basin" },
    { label: t("damGates"), value: "27 Gates", subtext: "12.50m × 7.90m size" },
    { label: tCommon("date"), value: "1976", subtext: "Commissioned" },
    { label: t("damIrrigation"), value: "240,000+ Ha", subtext: "5 Marathwada districts" },
    { label: t("speciesCount"), value: "200+ Species", subtext: "Migratory winter birds" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner with Official Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30">
          <div className="relative h-72 sm:h-96 w-full">
            <Image
              src="/images/sites/jayakwadi-dam.jpg"
              alt="Jayakwadi Dam with 27 radial spillway gates across Godavari River in Paithan"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-oxide-950 via-oxide-950/70 to-transparent" />
            
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {t("jayakwadiTitle")}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-500/40 mb-3 backdrop-blur-md">
                <Waves className="w-3.5 h-3.5 text-blue-400" />
                <span>{t("title")}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                {t("jayakwadiTitle")}
              </h1>
              <p className="text-sm sm:text-base text-slate-200 mt-2 leading-relaxed drop-shadow-sm">
                {t("jayakwadiSubtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Facts Strip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">{t("timings")}</div>
              <div className="text-xs text-slate-600">08:00 AM – 06:00 PM</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">{t("entryFee")}</div>
              <div className="text-xs text-slate-600">{locale === "mr" ? "मोफत / खुले" : locale === "hi" ? "निःशुल्क / खुला" : "Free / Open"}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">{t("bestTime")}</div>
              <div className="text-xs text-slate-600">{t("augustToFeb")}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">{t("distance")}</div>
              <div className="text-xs text-slate-600">3.5 km</div>
            </div>
          </div>
        </div>

        {/* Engineering Specifications Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t("damSpecsHeading")}</h2>
            <p className="text-xs text-slate-500 mt-1">{t("damSpecsSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {damSpecs.map((spec, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{spec.label}</span>
                <div className="text-lg font-extrabold text-teal-700 mt-1">{spec.value}</div>
                <div className="text-[11px] text-slate-600 mt-1">{spec.subtext}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visitor Experience Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Waves className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t("jayakwadiTitle")}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t("jayakwadiSubtitle")}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t("damGates")} (27)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t("damSpecsSubtitle")}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{t("nathSagarTitle")}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t("nathSagarSubtitle")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
