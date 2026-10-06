"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Phone,
  MapPin,
  ShieldAlert,
  Building2,
  UserCheck,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { 
  wardCorporators, 
  electedRepresentatives, 
  administrationRepresentatives, 
  councilProfile,
  wards,
} from "@/lib/mock-data";

export default function NagarSevakPage() {
  const t = useTranslations("nagarParishad");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMr = locale === "mr";

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCorporators = wardCorporators.filter(
    (w) =>
      w.wardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.wardNameMr.includes(searchTerm) ||
      w.wardNumber.toString().includes(searchTerm) ||
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.nameMr || "").includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-oxide-700 via-oxide-800 to-teal-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isMr ? councilProfile.nameMr : councilProfile.nameEn} ({t("councilClassValue")})</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t("representativesTitle")}
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {t("representativesSubtitle")}
            </p>
          </div>
        </div>

        {/* SEC Gazette Advisory */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 leading-relaxed space-y-1">
            <div className="font-bold text-amber-900 text-sm">
              {t("secAdvisoryTitle")}
            </div>
            <p>{t("secAdvisoryText")}</p>
          </div>
        </div>

        {/* High-Level Parliamentary & Legislative Leadership */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-600" />
            <span>{t("leadershipTitle")}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {electedRepresentatives.map((rep) => (
              <div
                key={rep.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                    {rep.designation}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    {isMr && rep.nameMr ? rep.nameMr : rep.name}
                  </h3>
                  {!isMr && rep.nameMr ? (
                    <p className="text-xs text-slate-600 font-marathi">{rep.nameMr}</p>
                  ) : null}
                  <p className="text-xs text-amber-800 font-semibold mt-1">{rep.constituency}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{rep.termNote}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div><strong>{tCommon("telephone")}:</strong> {rep.phone}</div>
                  <div><strong>{tCommon("address")}:</strong> {rep.officeAddress}</div>
                </div>
              </div>
            ))}

            {/* Chief Officer Card */}
            {administrationRepresentatives.slice(0, 1).map((rep) => (
              <div
                key={rep.id}
                className="bg-gradient-to-br from-oxide-800 to-teal-900 text-white rounded-2xl border border-amber-500/30 p-6 shadow-md flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                    {t("coTitle")}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">
                    {isMr && rep.nameMr ? rep.nameMr : rep.name}
                  </h3>
                  {!isMr && rep.nameMr ? (
                    <p className="text-xs text-amber-200/80 font-marathi">{rep.nameMr}</p>
                  ) : null}
                  <p className="text-xs text-slate-300 font-semibold mt-1">
                    {isMr && rep.designationMr ? rep.designationMr : rep.designation}
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {isMr ? councilProfile.nameMr : councilProfile.nameEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/80 text-xs text-slate-300 space-y-1">
                  <div><strong>{tCommon("telephone")}:</strong> {rep.phone}</div>
                  <div><strong>{tCommon("email")}:</strong> {rep.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 17 Wards Directory */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t("wardCorporatorsTitle")}
              </h2>
              <p className="text-xs text-slate-500">
                {t("wardCorporatorsSubtitle")}
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("searchRosterPlaceholder")}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCorporators.map((ward) => {
              const wardInfo = wards.find((w) => w.number === ward.wardNumber);
              const wardDisplayName = isMr ? ward.wardNameMr : ward.wardName;
              const corporatorDisplayName = isMr && ward.nameMr ? ward.nameMr : ward.name;
              return (
                <div
                  key={ward.wardNumber}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-amber-400/80 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black bg-teal-800 text-white px-2.5 py-1 rounded-lg">
                        {tCommon("ward")} {ward.wardNumber}
                      </span>
                      <DataStatusBadge status="SAMPLE_TBD" />
                    </div>

                    <div className="mt-3">
                      <h3 className="font-bold text-base text-slate-900">{wardDisplayName}</h3>
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[11px] text-slate-500 font-medium uppercase">{t("corporatorsTitle")}</div>
                      <div className="font-bold text-sm text-slate-900 mt-0.5">{corporatorDisplayName}</div>

                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500">{isMr ? councilProfile.nameMr : councilProfile.nameEn}</span>
                        <a
                          href={`tel:${(ward.phone || "02431223010").replace(/[^0-9]/g, "")}`}
                          className="font-mono text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{ward.phone || "02431-223010"}</span>
                        </a>
                      </div>
                    </div>

                    {wardInfo && (
                      <div className="mt-3 text-xs text-slate-600">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{tCommon("address")}: {wardInfo.locality}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{tCommon("ward")} #{ward.wardNumber}</span>
                    <Link
                      href={`/nagar-parishad/development-works`}
                      className="text-amber-700 hover:underline font-semibold"
                    >
                      {t("devWorksTitle")} →
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
