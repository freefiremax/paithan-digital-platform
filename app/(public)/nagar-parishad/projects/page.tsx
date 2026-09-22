import React from "react";
import type { Metadata } from "next";
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


export const metadata: Metadata = {
  title: "Major Infrastructure Projects | Paithan Municipal Council (पैठण नगर परिषद)",
  description:
    "Flagship civic development schemes in Paithan: AMRUT 2.0 Underground Sewerage, PMAY Urban, Paithani Weavers Park, and Godavari Riverfront.",
};

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
  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#071224] via-[#0C1E3C] to-[#122B54] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/20 mb-10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Paithan Municipal Council (Est. 1854)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              महत्त्वाचे विकास प्रकल्प (Major Infrastructure Projects)
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Transparent tracking of central and state-assisted mega development works transforming Paithan&apos;s civic infrastructure, public sanitation, river rejuvenation, and handloom economy.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="space-y-6">
          {MAJOR_PROJECTS.map((project) => {
            const Icon = project.icon;
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
                          Fully Operational
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          In Execution (Target: {project.completionTarget})
                        </span>
                      )}
                    </div>

                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug flex items-center gap-2">
                        <Icon className="w-5 h-5 text-amber-600 shrink-0" />
                        <span>{project.titleEn}</span>
                      </h2>
                      <p className="text-sm text-slate-600 font-marathi mt-1">

                        {project.titleMr}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {project.summary}
                    </p>

                    <div className="pt-2 text-xs text-slate-500">
                      <strong>Executing Agency:</strong> {project.contractor}
                    </div>
                  </div>

                  {/* Right: Financial & Progress Gauges */}
                  <div className="w-full lg:w-72 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between space-y-4 shrink-0">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="text-[10px] text-slate-400 font-medium uppercase">Sanctioned</div>
                        <div className="text-base font-extrabold text-[#0C1E3C] mt-0.5">{project.budgetCr}</div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="text-[10px] text-slate-400 font-medium uppercase">Disbursed</div>
                        <div className="text-base font-extrabold text-blue-700 mt-0.5">{project.expenditureCr}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">Physical Progress:</span>
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
                        <span className="font-semibold text-slate-700">Financial Utilization:</span>
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
          For project tenders, bids, and technical estimates, consult the{" "}
          <Link href="/nagar-parishad/notifications" className="text-amber-700 font-bold hover:underline">
            Tenders & Circulars Portal
          </Link>{" "}
          or contact the Municipal Engineering Department at 02431-223010.
        </div>
      </div>
    </div>
  );
}
