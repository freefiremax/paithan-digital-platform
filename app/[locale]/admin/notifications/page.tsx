"use client";

import React, { useState } from "react";
import {
  BellRing,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { notifications as initialNotifications, NotificationItem, NotificationCategory } from "@/lib/mock-data";

export default function AdminNotificationsPage() {
  const t = useTranslations("admin");
  const tNagar = useTranslations("nagarParishad");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMr = locale === "mr";

  const [items, setItems] = useState<NotificationItem[]>([...initialNotifications]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<{
    title: string;
    titleMr: string;
    category: NotificationCategory;
    department: string;
    referenceNo: string;
    publishedAt: string;
    closingAt: string;
    isPinned: boolean;
    downloadUrl: string;
  }>({
    title: "",
    titleMr: "",
    category: "TENDER",
    department: "General Administration",
    referenceNo: "MC-PTN/ETEND/2026/06",
    publishedAt: "2026-04-01",
    closingAt: "2026-04-20",
    isPinned: false,
    downloadUrl: "https://mahatenders.gov.in",
  });

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.titleMr && item.titleMr.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.referenceNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <BellRing className="w-4 h-4" />
            <span>{t("tendersCirculars")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071224] tracking-tight">
            {t("manageTenders")}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {tNagar("noticesSubtitle")}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#0C1E3C] hover:bg-[#071224] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>{t("newTender")}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={tNagar("searchPlaceholder")}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">{t("tableTitle")}</th>
                <th className="py-3.5 px-4">{tCommon("filterBy")}</th>
                <th className="py-3.5 px-4">{t("refNo")}</th>
                <th className="py-3.5 px-4">{t("tableDate")}</th>
                <th className="py-3.5 px-4 text-right">{t("tableAction")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const titleText = isMr && item.titleMr ? item.titleMr : item.title;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{titleText}</div>
                      <div className="text-[11px] text-slate-500">{item.department}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-amber-700">{item.category}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {item.referenceNo}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {item.publishedAt}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
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
