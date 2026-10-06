"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkStatusBadge } from "@/components/ui/WorkStatusBadge";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { developmentWorks, wards, type WorkStatus } from "@/lib/mock-data";

export default function DevelopmentWorksPage() {
  const t = useTranslations("nagarParishad");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const [selectedWard, setSelectedWard] = useState<number | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<WorkStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorks = useMemo(() => {
    return developmentWorks.filter((work) => {
      const matchesWard = selectedWard === "ALL" || work.wardNumber === selectedWard;
      const matchesStatus = selectedStatus === "ALL" || work.status === selectedStatus;
      const matchesSearch =
        searchQuery === "" ||
        work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        work.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        work.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesWard && matchesStatus && matchesSearch;
    });
  }, [selectedWard, selectedStatus, searchQuery]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("nagarParishad"), href: "/nagar-parishad" },
          { label: t("devWorksTitle") },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title={t("devWorksTitle")}
          description={t("devWorksSubtitle")}
        />

        {/* PROVENANCE NOTICE */}
        <div className="mt-4 mb-8 border-l-[3px] border-[var(--zari-gold-500)] bg-[var(--zari-gold-100)]/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <DataStatusBadge status="SAMPLE_TBD" />
            <span className="text-xs font-semibold text-[var(--gov-navy-900)]">
              {t("devWorksTitle")}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--civic-slate-700)] leading-relaxed">
            {t("devWorksSubtitle")}
          </p>
        </div>

        {/* FILTER & SEARCH CONTROLS */}
        <div className="border border-[var(--border-subtle)] bg-white p-4 sm:p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[var(--border-subtle)] rounded text-xs text-slate-800 focus:outline-hidden focus:border-[var(--gov-navy-700)]"
              />
            </div>

            {/* Ward Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="ward-select" className="text-xs font-medium text-slate-700 shrink-0">
                {t("filterWard")}:
              </label>
              <select
                id="ward-select"
                value={selectedWard}
                onChange={(e) =>
                  setSelectedWard(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
                }
                className="border border-[var(--border-subtle)] rounded px-2.5 py-1.5 text-xs text-slate-800 bg-white"
              >
                <option value="ALL">{t("allWards")}</option>
                {wards.map((w) => (
                  <option key={w.number} value={w.number}>
                    Ward {w.number} — {w.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5">
              {(["ALL", "ONGOING", "COMPLETED", "PLANNED"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-2.5 py-1.5 text-[11px] font-medium rounded transition-colors ${
                    selectedStatus === status
                      ? "bg-[var(--gov-navy-900)] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {status === "ALL" ? tCommon("all") : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* WORKS RESULTS GRID */}
        {filteredWorks.length === 0 ? (
          <div className="border border-[var(--border-subtle)] bg-white p-12 text-center">
            <p className="text-sm font-semibold text-slate-700">{t("noWorksFound")}</p>
            <p className="mt-1 text-xs text-slate-400">{t("noWorksHint")}</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredWorks.map((work) => (
              <article
                key={work.id}
                className="border border-[var(--border-subtle)] bg-white p-5 flex flex-col justify-between hover:shadow-xs transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-bold text-[var(--zari-gold-600)] uppercase tracking-wider">
                      Ward {work.wardNumber} • {work.locality}
                    </span>
                    <WorkStatusBadge status={work.status} />
                  </div>

                  <h2 className="mt-2 text-[0.9375rem] font-semibold text-[var(--gov-navy-900)] leading-snug font-serif">
                    {work.title}
                  </h2>
                  <p lang="mr" className="text-xs text-slate-500 mt-0.5">
                    {work.titleMr}
                  </p>

                  <p className="mt-2.5 text-xs text-[var(--civic-slate-700)] leading-relaxed">
                    {work.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-[var(--civic-slate-500)] mb-1">
                      <span>{t("stage")}</span>
                      <span className="civic-figure font-bold text-[var(--gov-navy-900)]">
                        {work.progressPct}%
                      </span>
                    </div>
                    <div className="w-full bg-[var(--bg-surface-slate)] rounded-full h-1.5">
                      <div
                        className="bg-[var(--zari-gold-500)] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${work.progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--civic-slate-500)]">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase">{t("sanctionedAmount")}</span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        ₹{work.budgetInLakhs.toFixed(2)} Lakhs
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase">{t("completionDate")}</span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {work.completionTarget}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span>{t("contractor")}: <strong className="text-slate-800">{work.contractor}</strong></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
