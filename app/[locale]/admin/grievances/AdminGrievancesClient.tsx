"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Search, Filter, Loader2, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";

interface AdminGrievancesClientProps {
  locale: "en" | "mr" | "hi";
  messages: Record<string, string>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  SUBMITTED: { label: "statusSubmitted", color: "text-blue-700", bgColor: "bg-blue-50" },
  ACKNOWLEDGED: { label: "statusAcknowledged", color: "text-amber-700", bgColor: "bg-amber-50" },
  IN_PROGRESS: { label: "statusInProgress", color: "text-violet-700", bgColor: "bg-violet-50" },
  RESOLVED: { label: "statusResolved", color: "text-emerald-700", bgColor: "bg-emerald-50" },
  REJECTED: { label: "statusRejected", color: "text-red-700", bgColor: "bg-red-50" },
};

const SECTOR_LABELS: Record<string, string> = {
  ROADS_TRANSPORT: "sectorRoads",
  WATER_SANITATION: "sectorWater",
  EDUCATION: "sectorEducation",
  HEALTH: "sectorHealth",
  OTHER_CIVIC_WORKS: "sectorOther",
};

const STATUS_OPTIONS = [
  { value: "SUBMITTED", labelKey: "statusSubmitted" },
  { value: "ACKNOWLEDGED", labelKey: "statusAcknowledged" },
  { value: "IN_PROGRESS", labelKey: "statusInProgress" },
  { value: "RESOLVED", labelKey: "statusResolved" },
  { value: "REJECTED", labelKey: "statusRejected" },
];

export function AdminGrievancesClient({ locale }: AdminGrievancesClientProps) {
  const t = useTranslations("grievance");

  const [grievances, setGrievances] = useState<Array<{
    id: string;
    ticketNo: string;
    title: string;
    sector: string;
    ward: { number: number; name: string } | null;
    status: string;
    citizenName: string;
    citizenPhone: string;
    citizenEmail: string | null;
    photoUrl: string | null;
    createdAt: string;
    updatedAt: string;
    latestUpdate: { status: string; note: string | null; createdAt: string } | null;
  }>>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    sector: "",
    wardId: "",
    search: "",
  });

  const [selectedGrievance, setSelectedGrievance] = useState<typeof grievances[0] | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchGrievances = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        pageSize: String(pagination.pageSize),
        ...(filters.status && { status: filters.status }),
        ...(filters.sector && { sector: filters.sector }),
        ...(filters.wardId && { wardId: filters.wardId }),
        ...(filters.search && { search: filters.search }),
      });
      const res = await fetch(`/api/admin/grievances?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || t("fetchError"));
      setGrievances(data.grievances);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("fetchError"));
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.pageSize, filters, t]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGrievances();
  }, [fetchGrievances]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleStatusUpdate = async (grievanceId: string, newStatus: string, note: string) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const csrfRes = await fetch("/api/auth/csrf");
      const { csrfToken } = await csrfRes.json();

      const res = await fetch(`/api/admin/grievances/${grievanceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ status: newStatus, note }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || t("updateError"));

      fetchGrievances();
      setSelectedGrievance(null);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : t("updateError"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewDetails = (grievance: typeof grievances[0]) => {
    setSelectedGrievance(grievance);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t("adminTitle")}</h1>
        <p className="text-slate-600 mt-1">{t("adminSubtitle")}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">{t("searchLabel")}</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  id="search"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-slate-700 mb-1">{t("statusFilterLabel")}</label>
              <select
                id="statusFilter"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              >
                <option value="">{t("allStatuses")}</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sectorFilter" className="block text-sm font-medium text-slate-700 mb-1">{t("sectorFilterLabel")}</label>
              <select
                id="sectorFilter"
                value={filters.sector}
                onChange={(e) => handleFilterChange("sector", e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              >
                <option value="">{t("allSectors")}</option>
                {Object.entries(SECTOR_LABELS).map(([value, labelKey]) => (
                  <option key={value} value={value}>{t(labelKey)}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">{t("clearFilters")}</label>
              <button
                onClick={() => {
                  setFilters({ status: "", sector: "", wardId: "", search: "" });
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
              >
                <Filter className="w-4 h-4 inline mr-2" />
                {t("clearFilters")}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="grid">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("ticketNo")}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("title")}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("sector")}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("ward")}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("status")}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("citizen")}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("submitted")}</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
                  </td>
                </tr>
              ) : grievances.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">{t("noGrievances")}</td>
                </tr>
              ) : (
                grievances.map((g) => {
                  const config = STATUS_CONFIG[g.status] || { color: "text-slate-600", bgColor: "bg-slate-100" };
                  return (
                    <tr key={g.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-mono font-medium text-slate-900">{g.ticketNo}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 max-w-xs truncate">{g.title}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{t(SECTOR_LABELS[g.sector] || g.sector)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {g.ward ? `W${g.ward.number} - ${g.ward.name}` : t("notSpecified")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                          {t(config.label || g.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-900">{g.citizenName}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{formatDate(g.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(g)}
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            aria-label={t("viewDetails")}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="px-4 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {t("showing", { start: (pagination.page - 1) * pagination.pageSize + 1, end: Math.min(pagination.page * pagination.pageSize, pagination.total), total: pagination.total })}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-sm text-slate-700">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedGrievance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedGrievance(null)} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 id="modal-title" className="text-xl font-bold text-slate-900">{selectedGrievance.title}</h2>
              <button onClick={() => setSelectedGrievance(null)} className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">{t("ticketNo")}</p>
                  <p className="font-mono font-medium text-slate-900">{selectedGrievance.ticketNo}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t("status")}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[selectedGrievance.status]?.bgColor} ${STATUS_CONFIG[selectedGrievance.status]?.color}`}>
                    {t(STATUS_CONFIG[selectedGrievance.status]?.label || selectedGrievance.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t("sector")}</p>
                  <p className="font-medium text-slate-900">{t(SECTOR_LABELS[selectedGrievance.sector] || selectedGrievance.sector)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t("ward")}</p>
                  <p className="font-medium text-slate-900">{selectedGrievance.ward ? `W${selectedGrievance.ward.number} - ${selectedGrievance.ward.name}` : t("notSpecified")}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-slate-500">{t("citizenNameLabel")}</p>
                  <p className="font-medium text-slate-900">{selectedGrievance.citizenName}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-slate-500">{t("phoneLabel")}</p>
                  <p className="font-medium text-slate-900">{selectedGrievance.citizenPhone}</p>
                </div>
                {selectedGrievance.citizenEmail && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-slate-500">{t("emailLabel")}</p>
                    <p className="font-medium text-slate-900">{selectedGrievance.citizenEmail}</p>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <p className="text-sm text-slate-500">{t("submittedOn")}</p>
                  <p className="font-medium text-slate-900">{formatDate(selectedGrievance.createdAt)}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-slate-500">{t("lastUpdated")}</p>
                  <p className="font-medium text-slate-900">{formatDate(selectedGrievance.updatedAt)}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("descriptionLabel")}</h3>
                <p className="text-slate-700 whitespace-pre-wrap">{selectedGrievance.title}</p>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("timelineTitle")}</h3>
                <div className="space-y-4">
                  {[
                    { status: "SUBMITTED", note: t("submittedNote"), createdAt: selectedGrievance.createdAt },
                    ...(selectedGrievance.latestUpdate ? [selectedGrievance.latestUpdate] : []),
                  ].map((update, index) => {
                    const config = STATUS_CONFIG[update.status] || { color: "text-slate-600", bgColor: "bg-slate-100" };
                    return (
                      <div key={index} className="flex gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${config.color} flex-shrink-0`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${config.color}`}>{t(config.label || update.status)}</span>
                            <span className="text-xs text-slate-500">{formatDate(update.createdAt)}</span>
                          </div>
                          {update.note && <p className="text-sm text-slate-600 mt-1">{update.note}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("updateStatus")}</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="newStatus" className="block text-sm font-medium text-slate-700 mb-2">{t("newStatusLabel")}</label>
                    <select
                      id="newStatus"
                      value={selectedGrievance.status}
                      onChange={(e) => setSelectedGrievance({ ...selectedGrievance, status: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="updateNote" className="block text-sm font-medium text-slate-700 mb-2">{t("noteLabel")}</label>
                    <textarea
                      id="updateNote"
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                      placeholder={t("notePlaceholder")}
                    />
                  </div>
                  {updateError && <p className="text-sm text-red-600" role="alert">{updateError}</p>}
                  <button
                    onClick={() => handleStatusUpdate(selectedGrievance.id, selectedGrievance.status, (document.getElementById("updateNote") as HTMLTextAreaElement)?.value || "")}
                    disabled={isUpdating}
                    className="w-full bg-[var(--vangi-850)] hover:bg-[var(--vangi-950)] disabled:opacity-50 disabled:hover:bg-[var(--vangi-850)] text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    {t("updateStatusBtn")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}