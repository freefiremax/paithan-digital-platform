"use client";

import React from "react";
import Image from "next/image";
import {
  Feather,
  Clock,
  MapPin,
  Tag,
  ShieldCheck,
  Calendar,
  Compass,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const BIRD_SPECIES = [
  {
    commonNameEn: "Greater Flamingo",
    commonNameMr: "रोहित (मोठा फ्लेमिंगो)",
    scientificName: "Phoenicopterus roseus",
    season: "November to March",
    status: "Winter Migrant",
    notes: "Flocks of thousands feeding on algae in shallow brackish backwater bays.",
  },
  {
    commonNameEn: "Demoiselle Crane",
    commonNameMr: "कुरंग (क्रौंच पक्षी)",
    scientificName: "Anthropoides virgo",
    season: "December to February",
    status: "Long-distance Migrant",
    notes: "Elegant long-legged cranes congregating along open sandy river spits.",
  },
  {
    commonNameEn: "Bar-headed Goose",
    commonNameMr: "पट्टेरी हंस",
    scientificName: "Anser indicus",
    season: "December to February",
    status: "Himalayan Migrant",
    notes: "High-altitude migrants resting on Nath Sagar reservoir islands.",
  },
  {
    commonNameEn: "Painted Stork",
    commonNameMr: "चित्रबलाक",
    scientificName: "Mycteria leucocephala",
    season: "Resident & Local Migrant",
    status: "Breeding Colony",
    notes: "Nesting in acacia and babool trees along the lakeside periphery.",
  },
  {
    commonNameEn: "Osprey (Fish Eagle)",
    commonNameMr: "मत्स्य गरुड",
    scientificName: "Pandion haliaetus",
    season: "October to March",
    status: "Winter Raptor",
    notes: "Hunting freshwater fish by diving feet-first into the deep reservoir waters.",
  },
  {
    commonNameEn: "Glossy Ibis & Black-headed Ibis",
    commonNameMr: "काळा अवाक व पांढरा अवाक",
    scientificName: "Plegadis falcinellus",
    season: "Year-round",
    status: "Resident Wader",
    notes: "Foraging in muddy reed beds around the wetland edges.",
  },
];

export default function NathSagarPage() {
  const t = useTranslations("tourism");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMr = locale === "mr";

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner with Official Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30">
          <div className="relative h-72 sm:h-96 w-full">
            <Image
              src="/images/sites/jaikwadi-birds.jpg"
              alt="Greater Flamingos and migratory waterbirds at Jaikwadi Bird Sanctuary Nath Sagar"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-oxide-950 via-oxide-950/70 to-transparent" />

            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {t("nathSagarTitle")}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 mb-3 backdrop-blur-md">
                <Feather className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t("sanctuaryArea")}: 341 sq. km</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                {t("nathSagarTitle")}
              </h1>
              <p className="text-sm sm:text-base text-slate-200 mt-2 leading-relaxed drop-shadow-sm">
                {t("nathSagarSubtitle")}
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
              <div className="text-xs text-slate-600">06:30 AM – 10:00 AM</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">{t("migratorySeason")}</div>
              <div className="text-xs text-slate-600">{t("novToMarch")}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">{t("entryFee")}</div>
              <div className="text-xs text-slate-600">{t("forestDeptPass")}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">{t("distance")}</div>
              <div className="text-xs text-slate-600">4.0 km (Flamingo Point)</div>
            </div>
          </div>
        </div>

        {/* Avian Biodiversity Catalog */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {t("birdSanctuaryHeading")}
              </h2>
              <p className="text-xs text-slate-500">
                {t("birdSanctuarySubtitle")}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full self-start sm:self-auto">
              {t("speciesCount")}: 234+
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BIRD_SPECIES.map((bird, i) => {
              const birdName = isMr && bird.commonNameMr ? bird.commonNameMr : bird.commonNameEn;
              return (
                <div
                  key={i}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2 hover:border-emerald-400 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {bird.status}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{bird.season}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{birdName}</h3>
                    {!isMr && bird.commonNameMr ? (
                      <div className="text-xs text-slate-600 font-marathi">{bird.commonNameMr}</div>
                    ) : null}
                    <div className="text-[11px] text-slate-400 italic font-serif">{bird.scientificName}</div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {bird.notes}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Birdwatching Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>{t("routesTitle")}</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{locale === "mr" ? "फ्लेमिंगो पॉईंट (पैठण काठ) - सूर्योदय दर्शन केंद्र." : locale === "hi" ? "फ्लेमिंगो पॉइंट (पैठन तट) - सूर्योदय दृश्य।" : "Flamingo Point (Paithan Bank) - Sunrise viewpoint."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{locale === "mr" ? "आपेगाव जलाशय फुगवटा (१२ किमी) - कुरव व हंसांच्या प्रजाती." : locale === "hi" ? "आपेगांव जलाशय (12 किमी) - क्रेन और कलहंस।" : "Apegaon Reservoir Backwaters (12 km) - Demoiselle Cranes and Geese."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{t("guidelineSpillway")}</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-sm space-y-3 border border-emerald-800">
            <h3 className="font-bold text-emerald-300 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{tCommon("verified")}</span>
            </h3>
            <ul className="space-y-2 text-xs text-emerald-100/90">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{t("guidelineZeroPlastic")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{t("guidelineQuiet")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
