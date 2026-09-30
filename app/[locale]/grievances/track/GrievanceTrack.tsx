"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, AlertCircle, CheckCircle, Clock, FileText, MapPin, Phone, Mail } from "lucide-react";

interface GrievanceTrackProps {
  locale: "en" | "mr" | "hi";
  messages: Record<string, string>;
}

const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  SUBMITTED: FileText,
  ACKNOWLEDGED: CheckCircle,
  IN_PROGRESS: Loader2,
  RESOLVED: CheckCircle,
  REJECTED: AlertCircle,
};

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

export function GrievanceTrack({ locale }: GrievanceTrackProps) {
  const t = useTranslations("grievance");

  const [ticketNo, setTicketNo] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grievance, setGrievance] = useState<{
    ticketNo: string;
    title: string;
    sector: string;
    ward: { number: number; name: string } | null;
    status: string;
    citizenName: string;
    citizenPhone?: string;
    citizenEmail?: string | null;
    createdAt: string;
    updatedAt: string;
    updates: Array<{ status: string; note: string | null; createdAt: string }>;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGrievance(null);

    if (!ticketNo.trim()) {
      setError(t("errorTicketRequired"));
      return;
    }
    if (!phone.trim()) {
      setError(t("errorPhoneRequired"));
      return;
    }

    setIsLoading(true);

    try {
      const params = new URLSearchParams({ ticketNo });
      if (phone.trim()) params.append("phone", phone);

      const res = await fetch(`/api/grievances/track?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || t("trackError"));
      }

      setGrievance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("trackError"));
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t("trackTitle")}</h1>
          <p className="text-slate-600 mt-2">{t("trackSubtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label htmlFor="ticketNo" className="block text-sm font-medium text-slate-700 mb-2">
              {t("ticketNoLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="ticketNo"
              value={ticketNo}
              onChange={(e) => setTicketNo(e.target.value.toUpperCase())}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
              placeholder="PTN-2026-000123"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
              {t("phoneLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
              placeholder={t("phonePlaceholder")}
              autoComplete="tel"
              required
            />
            <p className="mt-1 text-xs text-slate-500">{t("phoneNote")}</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--vangi-850)] hover:bg-[var(--vangi-950)] disabled:opacity-50 disabled:hover:bg-[var(--vangi-850)] text-white py-3 px-6 rounded-lg font-medium text-base flex items-center justify-center gap-2 transition"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("tracking")}
              </>
            ) : (
              t("trackBtn")
            )}
          </button>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700" role="alert">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {grievance && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{grievance.title}</h2>
                  <p className="text-sm text-slate-500 mt-1 font-mono tracking-wider">{grievance.ticketNo}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${STATUS_CONFIG[grievance.status]?.bgColor || "bg-slate-100"}`}>
                  {(() => {
                    const Icon = STATUS_ICONS[grievance.status] || FileText;
                    return <Icon className={`w-4 h-4 ${STATUS_CONFIG[grievance.status]?.color || "text-slate-600"}`} />;
                  })()}
                  <span className={`text-sm font-medium ${STATUS_CONFIG[grievance.status]?.color || "text-slate-600"}`}>
                    {t(STATUS_CONFIG[grievance.status]?.label || grievance.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">{t("sectorLabel")}</p>
                  <p className="font-medium text-slate-900">{t(SECTOR_LABELS[grievance.sector] || grievance.sector)}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t("wardLabel")}</p>
                  <p className="font-medium text-slate-900">
                    {grievance.ward ? `${t("ward")} ${grievance.ward.number} - ${grievance.ward.name}` : t("notSpecified")}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">{t("citizenNameLabel")}</p>
                  <p className="font-medium text-slate-900">{grievance.citizenName}</p>
                </div>
                {grievance.citizenPhone && (
                  <div>
                    <p className="text-slate-500">{t("phoneLabel")}</p>
                    <p className="font-medium text-slate-900">{grievance.citizenPhone}</p>
                  </div>
                )}
                {grievance.citizenEmail && (
                  <div>
                    <p className="text-slate-500">{t("emailLabel")}</p>
                    <p className="font-medium text-slate-900">{grievance.citizenEmail}</p>
                  </div>
                )}
                <div>
                  <p className="text-slate-500">{t("submittedOn")}</p>
                  <p className="font-medium text-slate-900">{formatDate(grievance.createdAt)}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-slate-500">{t("lastUpdated")}</p>
                  <p className="font-medium text-slate-900">{formatDate(grievance.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                {t("timelineTitle")}
              </h3>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />
                {grievance.updates.map((update, index) => {
                    const statusConfig = STATUS_CONFIG[update.status] || { color: "text-slate-600", bgColor: "bg-slate-100" };
                    const Icon = STATUS_ICONS[update.status] || FileText;
                    return (
                    <div key={index} className="relative pl-14 pb-8 last:pb-0">
                      <div className="absolute left-0 top-1">
                        <div className={`w-3 h-3 rounded-full border-4 ${statusConfig.bgColor} ${statusConfig.color} relative z-10`} />
                      </div>
                      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
                            <Icon className={`w-5 h-5 ${statusConfig.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-medium ${statusConfig.color}`}>
                                {t(statusConfig.label || update.status)}
                              </span>
                              <span className="text-xs text-slate-500 whitespace-nowrap">
                                {formatDate(update.createdAt)}
                              </span>
                            </div>
                            {update.note && (
                              <p className="text-sm text-slate-600 mt-1">{update.note}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("contactInfoTitle")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <a
                  href="tel:02431223010"
                  className="flex items-center gap-2 text-slate-600 hover:text-[var(--saffron-600)]"
                >
                  <Phone className="w-5 h-5" />
                  <span>02431-223010</span>
                </a>
                <a
                  href="mailto:munptn@gmail.com"
                  className="flex items-center gap-2 text-slate-600 hover:text-[var(--saffron-600)]"
                >
                  <Mail className="w-5 h-5" />
                  <span>munptn@gmail.com</span>
                </a>
                <span className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-5 h-5" />
                  <span>{t("officeAddress")}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}