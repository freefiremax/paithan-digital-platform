"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Clock,
  Droplets,
  Home,
  Sparkles,
  Recycle,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { councilProfile } from "@/lib/mock-data";

const MAJOR_PROJECTS = [
  {
    id: "amrut-drainage",
    titleEn: "AMRUT 2.0 Godavari River Underground Sewerage & 4.5 MLD STP",
    titleMr: "अमृत २.० गोदावरी नदी प्रदूषण नियंत्रण, भूमिगत गटार योजना व ४.५ एमएलडी सांडपाणी प्रक्रिया केंद्र",
    category: "Sanitation & Water Ecology",
    scheme: "AMRUT 2.0 (MoHUA & Govt of Maharashtra)",
    budgetCr: "₹48.50 Cr",
    expenditureCr: "₹31.20 Cr",
    physicalProgress: 68,
    financialProgress: 64,
    status: "IN_PROGRESS",
    completionTarget: "December 2026",
    contractor: "Maharashtra Jeevan Pradhikaran (MJP) Executing Wing",
    summary:
      "Comprehensive interception of 8 natural stormwater drains flowing into the sacred Godavari river, laying 42 km of HDPE sewerage network, and commissioning a state-of-the-art 4.5 MLD SBR Sewage Treatment Plant to protect Jayakwadi reservoir.",
    icon: Droplets,
    badgeColor: "bg-blue-100 text-blue-900 border-blue-200",
  },
  {
    id: "weavers-cluster",
    titleEn: "Paithani Mega Handloom Cluster & Artisan Resource Center",
    titleMr: "पैठणी महा हातमाग क्लस्टर व विणकर संसाधन केंद्र (अहमदनगर रोड)",
    category: "Heritage & Local Industry",
    scheme: "Textiles Ministry & DPDC Chhatrapati Sambhajinagar",
    budgetCr: "₹14.20 Cr",
    expenditureCr: "₹8.90 Cr",
    physicalProgress: 75,
    financialProgress: 62,
    status: "IN_PROGRESS",
    completionTarget: "August 2026",
    contractor: "Maharashtra State Handlooms Corp & PMC",
    summary:
      "Modernized weaving shed with 60 pit looms, natural dye processing laboratory, computerized jacquard design studio, and direct artisan-to-tourist sales promenade honoring 2,000 years of Pratishthana silk weaving heritage.",
    icon: Sparkles,
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
  },
  {
    id: "pmay-housing",
    titleEn: "Pradhan Mantri Awas Yojana (PMAY Urban) Affordable Housing",
    titleMr: "प्रधानमंत्री आवास योजना (शहरी) - आर्थिकदृष्ट्या दुर्बल घटकांसाठी ४२० पक्की घरे",
    category: "Urban Housing",
    scheme: "PMAY (Urban) Mission",
    budgetCr: "₹22.75 Cr",
    expenditureCr: "₹19.40 Cr",
    physicalProgress: 88,
    financialProgress: 85,
    status: "IN_PROGRESS",
    completionTarget: "May 2026",
    contractor: "PMC Town Planning & Empanelled Builders",
    summary:
      "Construction of 420 earthquake-resistant G+2 residential units across Ward 7 and Ward 14 with dedicated solar street lighting, underground water connection, and paved arterial roads.",
    icon: Home,
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
  },
  {
    id: "solid-waste-plant",
    titleEn: "Scientific Solid Waste Processing & Bio-Methanation Facility",
    titleMr: "स्वच्छ भारत २.० वैज्ञानिक घनकचरा व्यवस्थापन व खत प्रकल्प (पैठण-शेवगाव रस्ता)",
    category: "Civic Sanitation",
    scheme: "Swachh Bharat Mission (Urban) 2.0",
    budgetCr: "₹8.80 Cr",
    expenditureCr: "₹8.80 Cr",
    physicalProgress: 100,
    financialProgress: 100,
    status: "COMPLETED",
    completionTarget: "Commissioned Nov 2024",
    contractor: "PMC Solid Waste Management Department",
    summary:
      "100% door-to-door segregated municipal waste collection across 17 wards processing 18 metric tons/day with mechanical compost screening and Refuse Derived Fuel (RDF) briquette generation.",
    icon: Recycle,
    badgeColor: "bg-teal-100 text-teal-900 border-teal-200",
  },
];

export default function ProjectsPage() {
  const t = useTranslations("nagarParishad");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMr = locale === "mr";

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-oxide-700 via-oxide-800 to-teal-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/20 mb-10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isMr ? councilProfile.nameMr : councilProfile.nameEn} ({t("establishedYear")} {councilProfile.establishedYear})</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t("majorProjectsTitle")}
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {t("majorProjectsSubtitle")}
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="space-y-6">
          {MAJOR_PROJECTS.map((project) => {
            const Icon = project.icon;
            const projectTitle = isMr && project.titleMr ? project.titleMr : project.titleEn;
            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 hover:border-amber-400/80 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left: Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${project.badgeColor}`}>
                        {project.category}
                      </span>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {project.scheme}
                      </span>
                      {project.status === "COMPLETED" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t("statusCompleted")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          {t("statusOngoing")} ({t("completionDate")}: {project.completionTarget})
                        </span>
                      )}
                    </div>

                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug flex items-center gap-2">
                        <Icon className="w-5 h-5 text-amber-600 shrink-0" />
                        <span>{projectTitle}</span>
                      </h2>
                      {!isMr && project.titleMr ? (
                        <p className="text-sm text-slate-500 font-marathi mt-1">
                          {project.titleMr}
                        </p>
                      ) : null}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {project.summary}
                    </p>

                    <div className="pt-2 text-xs text-slate-500">
                      <strong>{t("projectAgency")}:</strong> {project.contractor}
                    </div>
                  </div>

                  {/* Right: Financial & Progress Gauges */}
                  <div className="w-full lg:w-72 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between space-y-4 shrink-0">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="text-[10px] text-slate-500 font-medium uppercase">{t("projectBudget")}</div>
                        <div className="text-base font-extrabold text-teal-700 mt-0.5">{project.budgetCr}</div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="text-[10px] text-slate-500 font-medium uppercase">{t("sanctionedAmount")}</div>
                        <div className="text-base font-extrabold text-blue-700 mt-0.5">{project.expenditureCr}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{t("stage")}:</span>
                        <span className="font-bold text-slate-900">{project.physicalProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            project.physicalProgress === 100 ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${project.physicalProgress}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{t("projectTimeline")}:</span>
                        <span className="font-bold text-slate-900">{project.financialProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${project.financialProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-slate-600">
          <Link href="/nagar-parishad/notifications" className="text-amber-700 font-bold hover:underline">
            {t("noticesTitle")}
          </Link>{" "}
          | {tCommon("telephone")}: 02431-223010
        </div>
      </div>
    </div>
  );
}
