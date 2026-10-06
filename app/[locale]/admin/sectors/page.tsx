"use client";

import React, { useState, useEffect } from "react";
import { Edit, ShieldCheck } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";

interface SectorInfo {
  id: string;
  sector: string;
  titleEn: string;
  titleMr: string;
  taglineEn: string;
  taglineMr: string;
  overviewEn: string;
  overviewMr: string;
  department: string;
  contactJson?: Record<string, unknown> | null;
  dataStatus: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSectorsPage() {
  const t = useTranslations("adminSectors");
  const tNav = useTranslations("nav");
  const tSector = useTranslations("services");
  const locale = useLocale();

  const CIVIC_SECTOR_LABELS: Record<string, string> = {
    ROADS_TRANSPORT: tSector("roads"),
    WATER_SANITATION: tSector("water"),
    EDUCATION: tSector("education"),
    HEALTH: tSector("health"),
    OTHER_CIVIC_WORKS: tSector("otherCivic"),
  };

  const [sectors, setSectors] = useState<SectorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSector, setEditingSector] = useState<SectorInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    titleEn: "",
    titleMr: "",
    taglineEn: "",
    taglineMr: "",
    overviewEn: "",
    overviewMr: "",
    department: "",
    contactJson: "",
    dataStatus: "SAMPLE_TBD",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sectors");
      if (res.ok) setSectors(await res.json());
    } catch (err) {
      console.error("Failed to fetch sectors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      await fetchData();
      if (!mounted) return;
    };
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleEdit = (sector: SectorInfo) => {
    setEditingSector(sector);
    setFormData({
      titleEn: sector.titleEn,
      titleMr: sector.titleMr,
      taglineEn: sector.taglineEn,
      taglineMr: sector.taglineMr,
      overviewEn: sector.overviewEn,
      overviewMr: sector.overviewMr,
      department: sector.department,
      contactJson: sector.contactJson ? JSON.stringify(sector.contactJson, null, 2) : "",
      dataStatus: sector.dataStatus,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSector) return;
    setError("");
    setIsSubmitting(true);

    try {
      const body = {
        ...formData,
        contactJson: formData.contactJson ? JSON.parse(formData.contactJson) : undefined,
      };

      const res = await fetch(`/api/admin/sectors/${editingSector.sector}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Failed to update sector");
      }

      setEditingSector(null);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update sector");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (sectorId: string) => {
    try {
      const res = await fetch(`/api/admin/sectors/${sectorId}/verify`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to verify sector");
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify sector");
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: tNav("home"), href: `/${locale}` },
          { label: tNav("adminDashboard"), href: `/${locale}/admin/dashboard` },
          { label: t("title") },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title={t("title")}
          description={t("description")}
        />

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">{t("loading")}</div>
        ) : (
          <div className="space-y-6">
            {sectors.map((sector) => (
              <div
                key={sector.id}
                className="border border-slate-200 bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                        {CIVIC_SECTOR_LABELS[sector.sector] || sector.sector}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {locale === "mr" && sector.titleMr ? sector.titleMr : sector.titleEn}
                    </h2>
                    {sector.titleMr && locale !== "mr" && (
                      <p className="text-sm text-slate-500 font-marathi mt-0.5">{sector.titleMr}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <DataStatusBadge status={sector.dataStatus as "VERIFIED" | "SAMPLE_TBD"} showVerified />
                    {sector.dataStatus === "SAMPLE_TBD" && (
                      <button
                        onClick={() => handleVerify(sector.sector)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t("verifyRecord")}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="prose prose-sm max-w-none text-slate-700 mb-4">
                  <p className="text-sm">
                    {locale === "mr" && sector.taglineMr ? sector.taglineMr : sector.taglineEn}
                  </p>
                  {sector.taglineMr && locale !== "mr" && (
                    <p className="text-sm text-slate-500 font-marathi mt-1">{sector.taglineMr}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-900">{t("labelDepartment")}</span>{" "}
                    {sector.department}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{t("labelContact")}</span>{" "}
                    {sector.contactJson ? JSON.stringify(sector.contactJson) : "—"}
                  </div>
                </div>

                <button
                  onClick={() => handleEdit(sector)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>{t("editDetails")}</span>
                </button>

                {editingSector?.id === sector.id && (
                  <div className="mt-4 border-t border-slate-200 pt-4 space-y-3">
                    {error && (
                      <div className="flex items-center gap-2 text-xs text-red-400 bg-red-50 border border-red-200 p-2.5 rounded-xl">
                        <span>{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            {t("fieldTitleEn")}
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.titleEn}
                            onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            {t("fieldTitleMr")}
                          </label>
                          <input
                            type="text"
                            value={formData.titleMr}
                            onChange={(e) => setFormData({ ...formData, titleMr: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            {t("fieldTaglineEn")}
                          </label>
                          <input
                            type="text"
                            value={formData.taglineEn}
                            onChange={(e) => setFormData({ ...formData, taglineEn: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            {t("fieldTaglineMr")}
                          </label>
                          <input
                            type="text"
                            value={formData.taglineMr}
                            onChange={(e) => setFormData({ ...formData, taglineMr: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t("fieldOverviewEn")}
                        </label>
                        <textarea
                          value={formData.overviewEn}
                          onChange={(e) => setFormData({ ...formData, overviewEn: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t("fieldOverviewMr")}
                        </label>
                        <textarea
                          value={formData.overviewMr}
                          onChange={(e) => setFormData({ ...formData, overviewMr: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{t("fieldDepartment")}</label>
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t("fieldContact")}
                        </label>
                        <textarea
                          value={formData.contactJson}
                          onChange={(e) => setFormData({ ...formData, contactJson: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{t("fieldDataStatus")}</label>
                        <select
                          value={formData.dataStatus}
                          onChange={(e) => setFormData({ ...formData, dataStatus: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                        >
                          <option value="SAMPLE_TBD">{locale === "mr" ? "नमुना / निश्चित करणे बाकी" : locale === "hi" ? "नमूना / तय होना बाकी" : "Sample / TBD"}</option>
                          <option value="VERIFIED">{locale === "mr" ? "सत्यापित" : locale === "hi" ? "सत्यापित" : "Verified"}</option>
                        </select>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingSector(null)}
                          className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                          {t("cancel")}
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 text-xs font-bold rounded-xl shadow-md disabled:opacity-60"
                        >
                          {isSubmitting ? t("saving") : t("save")}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}