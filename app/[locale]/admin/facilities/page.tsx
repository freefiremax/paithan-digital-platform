"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, ShieldCheck, Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { cn } from "@/lib/utils";

interface Facility {
  id: string;
  nameEn: string;
  nameMr?: string | null;
  sector: string;
  type: string;
  address: string;
  contactJson?: Record<string, unknown> | null;
  wardId?: string | null;
  ward?: { number: number; name: string } | null;
  isOperational: boolean;
  dataStatus: string;
  createdBy: { id: string; name?: string | null; email?: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

interface Ward {
  id: string;
  number: number;
  name: string;
}

export default function AdminFacilitiesPage() {
  const t = useTranslations("adminFacilities");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const tSector = useTranslations("services");
  const locale = useLocale();

  const FACILITY_TYPE_LABELS: Record<string, string> = {
    SCHOOL: t("typeSchool"),
    PHC: t("typePhc"),
    WATER_WORKS: t("typeWaterWorks"),
    COMMUNITY_CENTER: t("typeCommunityCenter"),
    ANGANWADI: t("typeAnganwadi"),
    OTHER: t("typeOther"),
  };

  const CIVIC_SECTOR_LABELS: Record<string, string> = {
    ROADS_TRANSPORT: tSector("roads"),
    WATER_SANITATION: tSector("water"),
    EDUCATION: tSector("education"),
    HEALTH: tSector("health"),
    OTHER_CIVIC_WORKS: tSector("otherCivic"),
  };

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedDataStatus, setSelectedDataStatus] = useState<string>("ALL");
  const [selectedWard, setSelectedWard] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nameEn: "",
    nameMr: "",
    sector: "ROADS_TRANSPORT",
    type: "SCHOOL",
    address: "",
    contactJson: "",
    wardId: "",
    isOperational: true,
    dataStatus: "SAMPLE_TBD",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [facilitiesRes, wardsRes] = await Promise.all([
        fetch("/api/sectors/facilities/all"),
        fetch("/api/admin/wards"),
      ]);
      if (facilitiesRes.ok) setFacilities(await facilitiesRes.json());
      if (wardsRes.ok) setWards(await wardsRes.json());
    } catch (err) {
      console.error("Failed to fetch data:", err);
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

  const filteredFacilities = facilities.filter((f) => {
    const matchesSector = selectedSector === "ALL" || f.sector === selectedSector;
    const matchesType = selectedType === "ALL" || f.type === selectedType;
    const matchesDataStatus = selectedDataStatus === "ALL" || f.dataStatus === selectedDataStatus;
    const matchesWard = selectedWard === "ALL" || f.wardId === selectedWard;
    const matchesSearch =
      searchQuery === "" ||
      f.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.nameMr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesType && matchesDataStatus && matchesWard && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const action = editingFacility
        ? `/api/admin/facilities/${editingFacility.id}`
        : "/api/admin/facilities";
      const method = editingFacility ? "PATCH" : "POST";

      const body = {
        ...formData,
        contactJson: formData.contactJson ? JSON.parse(formData.contactJson) : undefined,
        wardId: formData.wardId || undefined,
      };

      const res = await fetch(action, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Failed to save facility");
      }

      setIsModalOpen(false);
      setEditingFacility(null);
      resetForm();
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save facility");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (facility: Facility) => {
    setEditingFacility(facility);
    setFormData({
      nameEn: facility.nameEn,
      nameMr: facility.nameMr || "",
      sector: facility.sector,
      type: facility.type,
      address: facility.address,
      contactJson: facility.contactJson ? JSON.stringify(facility.contactJson, null, 2) : "",
      wardId: facility.wardId || "",
      isOperational: facility.isOperational,
      dataStatus: facility.dataStatus,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      const res = await fetch(`/api/admin/facilities/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete facility");
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete facility");
    }
  };

  const handleVerify = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/facilities/${id}/verify`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to verify facility");
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify facility");
    }
  };

  const resetForm = () => {
    setFormData({
      nameEn: "",
      nameMr: "",
      sector: "ROADS_TRANSPORT",
      type: "SCHOOL",
      address: "",
      contactJson: "",
      wardId: "",
      isOperational: true,
      dataStatus: "SAMPLE_TBD",
    });
  };

  const openCreateModal = () => {
    setEditingFacility(null);
    resetForm();
    setIsModalOpen(true);
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

        {/* Filters */}
        <div className="border border-slate-200 bg-white p-4 sm:p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 bg-white"
              >
                <option value="ALL">{t("allSectors")}</option>
                {Object.entries(CIVIC_SECTOR_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 bg-white"
              >
                <option value="ALL">{t("allTypes")}</option>
                {Object.entries(FACILITY_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                value={selectedDataStatus}
                onChange={(e) => setSelectedDataStatus(e.target.value)}
                className="border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 bg-white"
              >
                <option value="ALL">{t("allStatus")}</option>
                <option value="VERIFIED">{t("verified")}</option>
                <option value="SAMPLE_TBD">{t("sampleTbd")}</option>
              </select>

              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 bg-white"
              >
                <option value="ALL">{t("allWards")}</option>
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {locale === "mr" ? `प्रभाग ${w.number} — ${w.name}` : locale === "hi" ? `वार्ड ${w.number} — ${w.name}` : `Ward ${w.number} — ${w.name}`}
                  </option>
                ))}
              </select>

              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("addFacility")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Facilities Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">{t("loading")}</div>
          ) : filteredFacilities.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm font-semibold text-slate-700">{t("noMatch")}</p>
              <p className="mt-1 text-xs text-slate-500">{t("noMatchHint")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">{t("colFacility")}</th>
                    <th className="py-3.5 px-4">{t("colSector")}</th>
                    <th className="py-3.5 px-4">{t("colType")}</th>
                    <th className="py-3.5 px-4">{t("colWard")}</th>
                    <th className="py-3.5 px-4">{t("colStatus")}</th>
                    <th className="py-3.5 px-4">{t("colDataStatus")}</th>
                    <th className="py-3.5 px-4 text-right">{t("colActions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFacilities.map((facility) => (
                    <tr key={facility.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900">
                          {locale === "mr" && facility.nameMr ? facility.nameMr : facility.nameEn}
                        </div>
                        {facility.nameMr && locale !== "mr" && (
                          <div className="text-[11px] text-slate-500 font-marathi">{facility.nameMr}</div>
                        )}
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">{facility.address}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                          {CIVIC_SECTOR_LABELS[facility.sector] || facility.sector}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-purple-50 text-purple-800">
                          {FACILITY_TYPE_LABELS[facility.type] || facility.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {facility.ward ? (
                          <span className="text-[11px] font-semibold text-slate-700">
                            {locale === "mr" ? `प्रभाग ${facility.ward.number} — ${facility.ward.name}` : locale === "hi" ? `वार्ड ${facility.ward.number} — ${facility.ward.name}` : `Ward ${facility.ward.number} — ${facility.ward.name}`}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold",
                            facility.isOperational
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-red-50 text-red-800"
                          )}
                        >
                          {facility.isOperational ? t("operational") : t("nonOperational")}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <DataStatusBadge status={facility.dataStatus as "VERIFIED" | "SAMPLE_TBD"} showVerified />
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(facility)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                            title={t("modalEditTitle")}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {facility.dataStatus === "SAMPLE_TBD" && (
                            <button
                              onClick={() => handleVerify(facility.id)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50"
                              title={tCommon("verifyRecord")}
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(facility.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title={tCommon("delete")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Facility Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-base">
                  {editingFacility ? t("modalEditTitle") : t("modalAddTitle")}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingFacility(null);
                    resetForm();
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mt-4 mb-4 flex items-center gap-2 text-xs text-red-400 bg-red-50 border border-red-200 p-2.5 rounded-xl">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t("fieldNameEn")}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Primary Health Center Brahmapuri"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t("fieldNameMr")}</label>
                    <input
                      type="text"
                      placeholder="उदा. प्राथमिक आरोग्य केंद्र ब्रह्मपुरी"
                      value={formData.nameMr}
                      onChange={(e) => setFormData({ ...formData, nameMr: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t("fieldSector")}</label>
                    <select
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    >
                      {Object.entries(CIVIC_SECTOR_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t("fieldType")}</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    >
                      {Object.entries(FACILITY_TYPE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t("fieldAddress")}</label>
                  <input
                    type="text"
                    required
                    placeholder="Full address with landmark"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t("fieldContact")}</label>
                  <textarea
                    placeholder='{"phone": "02431-223040", "email": "phc@paithan.gov.in"}'
                    value={formData.contactJson}
                    onChange={(e) => setFormData({ ...formData, contactJson: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t("fieldWard")}</label>
                    <select
                      value={formData.wardId}
                      onChange={(e) => setFormData({ ...formData, wardId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="">{t("noWard")}</option>
                      {wards.map((w) => (
                        <option key={w.id} value={w.id}>
                          {locale === "mr" ? `प्रभाग ${w.number} — ${w.name}` : locale === "hi" ? `वार्ड ${w.number} — ${w.name}` : `Ward ${w.number} — ${w.name}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isOperational"
                      checked={formData.isOperational}
                      onChange={(e) => setFormData({ ...formData, isOperational: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="isOperational" className="text-xs font-medium text-slate-700 cursor-pointer">
                      {t("fieldOperational")}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t("fieldDataStatus")}</label>
                  <select
                    value={formData.dataStatus}
                    onChange={(e) => setFormData({ ...formData, dataStatus: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="SAMPLE_TBD">{t("sampleTbd")}</option>
                    <option value="VERIFIED">{t("verified")}</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingFacility(null);
                      resetForm();
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 text-xs font-bold rounded-xl shadow-md disabled:opacity-60"
                  >
                    {isSubmitting ? t("saving") : editingFacility ? t("update") : t("save")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}