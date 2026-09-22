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
  Clock,
} from "lucide-react";
import { notifications, developmentWorks, wards } from "@/lib/mock-data";


export default function AdminDashboardPage() {
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
            <span>Paithan Municipal Council (Class &apos;C&apos; Council)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071224] tracking-tight">
            प्रशासकीय डॅशबोर्ड (Administrative Dashboard)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Executive oversight of tenders, public infrastructure expenditures, and ward governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/notifications"
            className="inline-flex items-center gap-1.5 bg-[#0C1E3C] hover:bg-[#071224] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>New Tender / Notice</span>
          </Link>
          <Link
            href="/admin/development-works"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Pickaxe className="w-3.5 h-3.5" />
            <span>Update Works</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Tenders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#071224]">{activeTenders}</div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>e-Tendering portal live</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ward Projects</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Pickaxe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#071224]">{activeWorks}</div>
            <div className="text-[11px] text-blue-600 font-medium mt-1">
              Sanctioned Value: ₹{(totalBudgetLakhs / 100).toFixed(2)} Cr
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Wards & Electors</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#071224]">{wards.length} Wards</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Pop: 41,536 | 18.5 sq.km
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">RAG Knowledge Sync</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-emerald-600">100%</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Grounding & Zero Hallucination
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Tenders Queue & Ward Works Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tenders Queue (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Active Public Tenders & Notifications</h2>
              <p className="text-xs text-slate-500">Official notices currently live on public portal</p>
            </div>
            <Link
              href="/admin/notifications"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>Manage All</span>
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
                  <h3 className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {notice.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-marathi line-clamp-1">
                    {notice.titleMr}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Closes: {notice.closingAt || "Open"}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                    Published
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Ward Development Status (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ward Infrastructure Tracker</h2>
              <p className="text-xs text-slate-500">AMRUT 2.0 & Municipal capital works</p>
            </div>
            <Link
              href="/admin/development-works"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View Ledger</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 mt-3">
            {developmentWorks.map((work) => (
              <div key={work.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 line-clamp-1">{work.title}</span>
                  <span className="font-extrabold text-[#0C1E3C] shrink-0">₹{work.budgetInLakhs} L</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Ward {work.wardNumber} ({work.wardName})</span>
                  <span className="font-semibold text-amber-700">{work.status}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{
                      width: work.status === "COMPLETED" ? "100%" : work.status === "ONGOING" ? "65%" : "15%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

