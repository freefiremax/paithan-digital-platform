"use client";

import React from "react";
import Link from "next/link";
import {
  BellRing,
  Pickaxe,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  PlusCircle,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { notifications, developmentWorks, wards, councilProfile } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const tNagar = useTranslations("nagarParishad");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMr = locale === "mr";

  const activeTenders = notifications.filter((n) => n.category === "TENDER").length;
  const activeWorks = developmentWorks.length;
  const totalBudgetLakhs = developmentWorks.reduce((acc, curr) => acc + curr.budgetInLakhs, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>{isMr ? councilProfile.nameMr : councilProfile.nameEn} ({tNagar("councilClassValue")})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071224] tracking-tight">
            {t("dashboardTitle")}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t("dashboardSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/notifications"
            className="inline-flex items-center gap-1.5 bg-[#0C1E3C] hover:bg-[#071224] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{t("newTender")}</span>
          </Link>
          <Link
            href="/admin/development-works"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Pickaxe className="w-3.5 h-3.5" />
            <span>{t("updateWorks")}</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("activeTenders")}</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#071224]">{activeTenders}</div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>{t("tendersCirculars")}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("activeWorks")}</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Pickaxe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#071224]">{activeWorks}</div>
            <div className="text-[11px] text-blue-600 font-medium mt-1">
              {t("sanctionedBudget")}: ₹{(totalBudgetLakhs / 100).toFixed(2)} Cr
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("totalWards")}</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#071224]">{wards.length} {tNagar("civicWards")}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              {tNagar("totalPopulation")}: 41,536
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{tCommon("verified")}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-emerald-600">100%</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              {tCommon("verifiedRecord")}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Tenders Queue & Ward Works Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tenders Queue */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t("tendersCirculars")}</h2>
              <p className="text-xs text-slate-500">{tNagar("noticesSubtitle")}</p>
            </div>
            <Link
              href="/admin/notifications"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>{tCommon("viewAll")}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {notifications.slice(0, 4).map((notice) => (
              <div key={notice.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {notice.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{notice.referenceNo}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{isMr && notice.titleMr ? notice.titleMr : notice.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Ward Works Progress */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t("developmentWorks")}</h2>
              <p className="text-xs text-slate-500">{tNagar("devWorksSubtitle")}</p>
            </div>
            <Link
              href="/admin/development-works"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>{tCommon("viewAll")}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {developmentWorks.slice(0, 4).map((work) => (
              <div key={work.id} className="py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{isMr && work.titleMr ? work.titleMr : work.title}</span>
                  <span className="text-[10px] font-bold text-amber-700">{work.status}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{tCommon("ward")} #{work.wardNumber}</span>
                  <span>₹{work.budgetInLakhs} Lakhs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
