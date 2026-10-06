"use client";

import React, { useState } from "react";
import {
  MapPin,
  Search,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { PAITHAN_WARDS } from "@/lib/mock-data";

type WardItem = (typeof PAITHAN_WARDS)[number];

export default function AdminWardsPage() {
  const t = useTranslations("admin");
  const tNagar = useTranslations("nagarParishad");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMr = locale === "mr";

  const [wardList, setWardList] = useState<WardItem[]>([...PAITHAN_WARDS]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWards = wardList.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.nameMr.includes(searchTerm) ||
      w.number.toString().includes(searchTerm) ||
      w.corporatorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>{tNagar("civicWards")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071224] tracking-tight">
            {t("manageWards")}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {tNagar("wardMapSubtitle")}
          </p>
        </div>
      </div>

      {/* Gazette Caution Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 leading-relaxed">
          {tNagar("secAdvisoryText")}
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={tNagar("searchRosterPlaceholder")}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {tNagar("totalWards")} | {tNagar("totalPopulation")}: 41,536
        </span>
      </div>

      {/* Wards Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">{t("tableWard")}</th>
                <th className="py-3.5 px-4">{t("activeWorks")}</th>
                <th className="py-3.5 px-4">{tNagar("corporatorsTitle")}</th>
                <th className="py-3.5 px-4">{t("tableStatus")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWards.map((ward) => {
                const wardName = isMr && ward.nameMr ? ward.nameMr : ward.name;
                const corpName = isMr && ward.corporatorNameMr ? ward.corporatorNameMr : ward.corporatorName;
                return (
                  <tr key={ward.number} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 text-sm">{tCommon("ward")} {ward.number}</span>
                      <div className="font-semibold text-slate-700">{wardName}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium">
                      {ward.activeProjects} {t("activeWorks")}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-slate-900">{corpName}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {ward.contact}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {ward.isSample ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          {tCommon("sampleTbd")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {tCommon("verified")}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
