"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Clock,
  Compass,
  Smartphone,
  Monitor,
  RefreshCw,
  Globe2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
  TreePine,
  Landmark,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

interface AnalyticsData {
  status: string;
  database: string;
  connection: string;
  latencyMs: number;
  totalRecords: number;
  summary: {
    totalPageViews: number;
    todayPageViews: number;
    uniquePagesTracked: number;
    estimatedAvgTimeSpentSec: number;
  };
  sectors: {
    tourism: number;
    heritage: number;
    civic: number;
    services: number;
    home: number;
    policies: number;
  };
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
    other: number;
  };
  sources: {
    direct: number;
    search: number;
    internal: number;
    other: number;
  };
  topPages: Array<{
    path: string;
    views: number;
    locale: string;
    sector: string;
  }>;
  dailyTrend: Record<string, number>;
}

export default function AdminAnalyticsPage() {
  const locale = useLocale();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch analytics from Neon`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  };

  const totalSectorViews = data
    ? Math.max(
        1,
        data.sectors.tourism +
          data.sectors.heritage +
          data.sectors.civic +
          data.sectors.services +
          data.sectors.home +
          data.sectors.policies
      )
    : 1;

  const totalDeviceViews = data
    ? Math.max(1, data.devices.mobile + data.devices.desktop + data.devices.tablet)
    : 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Neon Database Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071224] tracking-tight">
            Visitor Engagement &amp; Traffic Insights
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live visitor counts, time spent, and areas of citizen interest stored securely in Neon PostgreSQL.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAnalytics}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-[#0C1E3C] hover:bg-[#071224] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-400" : "text-amber-400"}`} />
          <span>{loading ? "Refreshing..." : "Refresh Live Data"}</span>
        </button>
      </div>

      {/* Neon Live Health Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-emerald-900">Neon Database Analytics Status:</span>
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ACTIVE &amp; CONNECTED
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-slate-600">
          <span>Engine: <strong className="text-slate-800">PostgreSQL (Neon)</strong></span>
          <span>&bull;</span>
          <span>Table: <code className="bg-white px-1.5 py-0.5 rounded text-[11px] font-mono border border-emerald-200">VisitorDailyMetric</code></span>
          <span>&bull;</span>
          <span>Latency: <strong className="text-emerald-700">{data?.latencyMs ?? 0} ms</strong></span>
          <span>&bull;</span>
          <span>Raw Database Rows: <strong className="text-slate-800">{data?.totalRecords ?? 0}</strong></span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Page Views */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Page Views</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#071224]">
            {loading ? "..." : (data?.summary.totalPageViews ?? 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <span>+{data?.summary.todayPageViews ?? 0} views today</span>
          </p>
        </div>

        {/* Metric 2: Estimated Avg Time Spent */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Avg Time Spent</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#071224]">
            {loading ? "..." : formatDuration(data?.summary.estimatedAvgTimeSpentSec ?? 150)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Per active visitor browsing session
          </p>
        </div>

        {/* Metric 3: Unique Pages Tracked */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Unique Pages Tracked</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#071224]">
            {loading ? "..." : data?.summary.uniquePagesTracked ?? 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Across Civic, Tourism, Heritage &amp; Policies
          </p>
        </div>

        {/* Metric 4: Mobile vs Desktop */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Mobile Traffic Share</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#071224]">
            {loading
              ? "..."
              : `${Math.round(((data?.devices.mobile ?? 0) / totalDeviceViews) * 100)}%`}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {(data?.devices.desktop ?? 0)} desktop vs {(data?.devices.mobile ?? 0)} mobile views
          </p>
        </div>
      </div>

      {/* Main Section: On Which Part They Are Taking Interest */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#071224]">
            Citizen Interest by Sector
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Breakdown showing which parts of the Paithan Digital Platform attract the highest visitor interest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tourism & Nature Card */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <TreePine className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Tourism &amp; Nature</h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {Math.round(((data?.sectors.tourism ?? 0) / totalSectorViews) * 100)}%
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Jayakwadi Dam, Nath Sagar Bird Sanctuary, Dnyaneshwar Udyan &amp; Tour Itineraries.
            </p>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(((data?.sectors.tourism ?? 0) / totalSectorViews) * 100)}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {data?.sectors.tourism ?? 0} views recorded
            </div>
          </div>

          {/* Cultural Heritage Card */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Landmark className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Cultural Heritage</h3>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {Math.round(((data?.sectors.heritage ?? 0) / totalSectorViews) * 100)}%
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Dr. Balasaheb Patil Museum, Satavahana Antiquities, 3D Models &amp; Sant Eknath.
            </p>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(((data?.sectors.heritage ?? 0) / totalSectorViews) * 100)}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {data?.sectors.heritage ?? 0} views recorded
            </div>
          </div>

          {/* Civic Governance Card */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Civic Governance</h3>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {Math.round(((data?.sectors.civic ?? 0) / totalSectorViews) * 100)}%
              </span>
            </div>
            <p className="text-xs text-slate-600">
              17 Municipal Wards, Nagar Sevaks, Development Works, Tenders &amp; Projects.
            </p>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(((data?.sectors.civic ?? 0) / totalSectorViews) * 100)}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {data?.sectors.civic ?? 0} views recorded
            </div>
          </div>

          {/* Public Services & Redressal */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Citizen Services &amp; AI</h3>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {Math.round(((data?.sectors.services ?? 0) / totalSectorViews) * 100)}%
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Grievance Submission &amp; Tracking, Municipal Helplines, AI Chatbot Desk.
            </p>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(((data?.sectors.services ?? 0) / totalSectorViews) * 100)}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {data?.sectors.services ?? 0} views recorded
            </div>
          </div>

          {/* Portal Homepage */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
                  <Globe2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Main Portal Landing</h3>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                {Math.round(((data?.sectors.home ?? 0) / totalSectorViews) * 100)}%
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Three-pillar entrance plate, notice ticker, and quick civic services strip.
            </p>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-slate-700 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(((data?.sectors.home ?? 0) / totalSectorViews) * 100)}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {data?.sectors.home ?? 0} views recorded
            </div>
          </div>

          {/* Transparency & Policy Documents */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Policies &amp; Disclaimers</h3>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {Math.round(((data?.sectors.policies ?? 0) / totalSectorViews) * 100)}%
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Citizen Privacy Charter, Terms &amp; Conditions, RTI and Accessibility.
            </p>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(((data?.sectors.policies ?? 0) / totalSectorViews) * 100)}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {data?.sectors.policies ?? 0} views recorded
            </div>
          </div>
        </div>
      </div>

      {/* Top Visited Pages Ledger */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#071224]">
              Top Pages Ranked by Citizen Views
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live ranking of specific pages visited, stored directly in Neon PostgreSQL.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing top {data?.topPages.length ?? 0} pages
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Page Route</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Locale</th>
                <th className="py-3 px-4 text-right">Views</th>
                <th className="py-3 px-4">Engagement Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {data?.topPages && data.topPages.length > 0 ? (
                data.topPages.map((item, index) => {
                  const sharePct = Math.round(
                    (item.views / Math.max(1, data.summary.totalPageViews)) * 100
                  );
                  return (
                    <tr key={item.path} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-bold text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        <Link
                          href={item.path}
                          target="_blank"
                          className="hover:text-amber-600 hover:underline inline-flex items-center gap-1"
                        >
                          <span>{item.path}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium text-[11px]">
                          {item.sector}
                        </span>
                      </td>
                      <td className="py-3 px-4 uppercase font-semibold text-slate-500">
                        {item.locale}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-slate-900 text-sm">
                        {item.views.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 w-44">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-amber-500 h-1.5 rounded-full"
                              style={{ width: `${Math.min(100, Math.max(5, sharePct))}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-slate-500 w-8 text-right">
                            {sharePct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No page views recorded yet in Neon.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Traffic Sources & Devices Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Device Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-[#071224] flex items-center gap-2">
            <Monitor className="w-4 h-4 text-blue-600" />
            <span>Device Types</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Desktop Browsers</span>
                <span>{data?.devices.desktop ?? 0} views</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.round(((data?.devices.desktop ?? 0) / totalDeviceViews) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Mobile Phones</span>
                <span>{data?.devices.mobile ?? 0} views</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${Math.round(((data?.devices.mobile ?? 0) / totalDeviceViews) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-[#071224] flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-amber-600" />
            <span>Traffic Acquisition Channels</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
              <span className="font-medium text-slate-700">Internal Site Navigation</span>
              <strong className="text-slate-900">{data?.sources.internal ?? 0} views</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
              <span className="font-medium text-slate-700">Direct Portal Access (Bookmarks / URL)</span>
              <strong className="text-slate-900">{data?.sources.direct ?? 0} views</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
              <span className="font-medium text-slate-700">Search Engines (Google, Bing)</span>
              <strong className="text-slate-900">{data?.sources.search ?? 0} views</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
