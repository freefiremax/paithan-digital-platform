"use client";

import React, { useState } from "react";
import {
  BellRing,
  Plus,
  Search,
  Pin,
  Trash2,
  X,
  ExternalLink,
} from "lucide-react";
import { notifications as initialNotifications, NotificationItem, NotificationCategory } from "@/lib/mock-data";

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([...initialNotifications]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New item form state with static defaults
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
      item.titleMr.includes(searchTerm) ||
      item.referenceNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `notif-${Math.random().toString(36).substring(2, 9)}`;
    const newItem: NotificationItem = {
      id: newId,
      title: formData.title,
      titleMr: formData.titleMr || formData.title,
      category: formData.category,
      department: formData.department,
      referenceNo: formData.referenceNo,
      publishedAt: formData.publishedAt,
      closingAt: formData.closingAt,
      isPinned: formData.isPinned,
      downloadUrl: formData.downloadUrl,
    };

    setItems([newItem, ...items]);
    setIsModalOpen(false);
    // Reset form
    setFormData({
      title: "",
      titleMr: "",
      category: "TENDER",
      department: "General Administration",
      referenceNo: `MC-PTN/ETEND/2026/0${items.length + 2}`,
      publishedAt: "2026-04-01",
      closingAt: "2026-04-25",
      isPinned: false,
      downloadUrl: "https://mahatenders.gov.in",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to withdraw this notification/tender from the public portal?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleTogglePin = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <BellRing className="w-4 h-4" />
            <span>Procurement & Citizen Circulars</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071224] tracking-tight">
            निविदा व अधिसूचना व्यवस्थापन (Tenders & Notifications)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish, edit, and archive municipal tenders, e-auctions, and gazette notices.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#0C1E3C] hover:bg-[#071224] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Publish New Notice / e-Tender</span>
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
            placeholder="Search by tender title, Marathi text, or reference number..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {["ALL", "TENDER", "NOTICE", "SCHEME", "ANNOUNCEMENT"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                categoryFilter === cat
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "ALL" ? "All Records" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Ref Number & Category</th>
                <th className="py-3.5 px-4">Notice Title (EN / MR)</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Published / Closes</th>
                <th className="py-3.5 px-4 text-center">Pin</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900">{item.referenceNo}</div>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                    <div className="text-[11px] text-slate-500 font-marathi line-clamp-1 mt-0.5">
                      {item.titleMr}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    {item.department}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="text-slate-900 font-medium">Pub: {item.publishedAt}</div>
                    <div className="text-slate-500 text-[11px]">
                      Closes: {item.closingAt || "N/A"}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleTogglePin(item.id)}
                      title={item.isPinned ? "Unpin notice" : "Pin notice to top"}
                      className={`p-1.5 rounded-lg transition ${
                        item.isPinned
                          ? "bg-amber-100 text-amber-700"
                          : "text-slate-300 hover:text-slate-600"
                      }`}
                    >
                      <Pin className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={item.downloadUrl || "https://mahatenders.gov.in"}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                        title="Download / View Official PDF"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete Notice"
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
      </div>

      {/* Draft New Tender Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-base">
                Draft New Notice / e-Tender
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Supply of High-Efficiency Water Filtration Cartridges..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title (मराठी)
                </label>
                <input
                  type="text"
                  placeholder="उदा. पैठण पाणीपुरवठा गाळणी साहित्य खरेदी..."
                  value={formData.titleMr}
                  onChange={(e) => setFormData({ ...formData, titleMr: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as NotificationCategory })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="TENDER">TENDER (ई-निविदा)</option>
                    <option value="NOTICE">NOTICE (सार्वजनिक सूचना)</option>
                    <option value="SCHEME">SCHEME (शासकीय योजना)</option>
                    <option value="ANNOUNCEMENT">ANNOUNCEMENT (घोषणा)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={formData.referenceNo}
                    onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Closing Date
                  </label>
                  <input
                    type="date"
                    value={formData.closingAt}
                    onChange={(e) => setFormData({ ...formData, closingAt: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="isPinned" className="text-xs font-medium text-slate-700">
                  Pin to Top Notice Ticker & Homepage Spotlight
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0C1E3C] hover:bg-[#071224] text-white px-4 py-2 text-xs font-bold rounded-xl shadow-md transition"
                >
                  Publish to Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
