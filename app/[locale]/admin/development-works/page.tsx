"use client";

import React, { useState } from "react";
import {
  Pickaxe,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { developmentWorks as initialWorks, DevelopmentWork, WorkStatus } from "@/lib/mock-data";

export default function AdminDevelopmentWorksPage() {
  const t = useTranslations("admin");
  const tNagar = useTranslations("nagarParishad");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMr = locale === "mr";

  const [works, setWorks] = useState<DevelopmentWork[]>([...initialWorks]);
  const [selectedWard, setSelectedWard] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    titleMr: "",
    wardNumber: 1,
    wardName: "Brahmapuri Archaeological Ward",
    description: "",
    department: "Civil Works & Roads",
    budgetInLakhs: "",
    progressPct: "40",
    status: "ONGOING" as WorkStatus,
    startDate: "2026-03-01",
    expectedCompletion: "2026-09-30",
  });

  const filteredWorks = works.filter((w) => {
    const matchesWard = selectedWard === "ALL" || w.wardNumber === Number(selectedWard);
    const matchesStatus = selectedStatus === "ALL" || w.status === selectedStatus;
    return matchesWard && matchesStatus;
  });

  const totalSanctioned = works.reduce((sum, w) => sum + w.budgetInLakhs, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `dev-${Math.random().toString(36).substring(2, 9)}`;
    const newWork: DevelopmentWork = {
      id: newId,
      wardNumber: Number(formData.wardNumber),
      wardName: formData.wardName || `Ward ${formData.wardNumber}`,
      title: formData.title,
      titleMr: formData.titleMr || formData.title,
      description: formData.description || formData.title,
      department: formData.department,
      budgetInLakhs: Number(formData.budgetInLakhs || 0),
      progressPct: Number(formData.progressPct || 0),
      status: formData.status,
      startDate: formData.startDate,
      expectedCompletion: formData.expectedCompletion,
      dataStatus: "SAMPLE_TBD",
    };

    setWorks([newWork, ...works]);
    setIsModalOpen(false);
    setFormData({
      title: "",
      titleMr: "",
      wardNumber: 1,
      wardName: "Brahmapuri Archaeological Ward",
      description: "",
      department: "Civil Works & Roads",
      budgetInLakhs: "",
      progressPct: "40",
      status: "ONGOING",
      startDate: "2026-03-01",
      expectedCompletion: "2026-09-30",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      setWorks(works.filter((w) => w.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <Pickaxe className="w-4 h-4" />
            <span>{t("developmentWorks")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071224] tracking-tight">
            {t("manageWorks")}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {tNagar("devWorksSubtitle")}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#0C1E3C] hover:bg-[#071224] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>{t("addRecord")}</span>
        </button>
      </div>

      {/* Financial Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">{t("sanctionedBudget")}</span>
          <div className="text-2xl font-extrabold text-[#071224] mt-1">₹{totalSanctioned.toFixed(2)} Lakhs</div>
          <div className="text-[11px] text-slate-500">{works.length} {t("activeWorks")}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">{t("activeWorks")}</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">
            {works.filter((w) => w.status === "ONGOING").length} {tNagar("ongoingWorks")}
          </div>
          <div className="text-[11px] text-slate-500">
            {works.filter((w) => w.status === "COMPLETED").length} {tNagar("completedWorks")}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">{tNagar("civicWards")}</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">17 {tNagar("civicWards")}</div>
          <div className="text-[11px] text-slate-500">AMRUT 2.0, DPDC, 15th FC</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">{tCommon("ward")}:</span>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
            >
              <option value="ALL">{tNagar("allWards")}</option>
              {Array.from({ length: 17 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  {tCommon("ward")} {w}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Works Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">{t("tableTitle")}</th>
                <th className="py-3.5 px-4">{t("tableWard")}</th>
                <th className="py-3.5 px-4">{t("tableStatus")}</th>
                <th className="py-3.5 px-4">{tNagar("sanctionedAmount")}</th>
                <th className="py-3.5 px-4 text-right">{t("tableAction")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorks.map((work) => {
                const workTitle = isMr && work.titleMr ? work.titleMr : work.title;
                return (
                  <tr key={work.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{workTitle}</div>
                      <div className="text-[11px] text-slate-500">{work.department}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium">
                      {tCommon("ward")} #{work.wardNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-amber-700">{work.status}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{work.budgetInLakhs} L
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(work.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                        title={t("deleteRecord")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
