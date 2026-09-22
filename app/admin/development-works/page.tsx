"use client";

import React, { useState } from "react";
import {
  Pickaxe,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { developmentWorks as initialWorks, DevelopmentWork, WorkStatus } from "@/lib/mock-data";

export default function AdminDevelopmentWorksPage() {
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
    if (confirm("Are you sure you want to remove this project record?")) {
      setWorks(works.filter((w) => w.id !== id));
    }
  };

  const handleStatusChange = (id: string, newStatus: WorkStatus) => {
    setWorks(
      works.map((w) => (w.id === id ? { ...w, status: newStatus } : w))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <Pickaxe className="w-4 h-4" />
            <span>Civic Infrastructure Capital Works</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071224] tracking-tight">
            वॉर्ड विकास कामे व्यवस्थापन (Ward Development Works)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track expenditure, civil contractor allocations, and progress across all 17 municipal wards.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#0C1E3C] hover:bg-[#071224] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add New Development Work</span>
        </button>
      </div>

      {/* Financial Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Sanctioned Outlay</span>
          <div className="text-2xl font-extrabold text-[#071224] mt-1">₹{totalSanctioned.toFixed(2)} Lakhs</div>
          <div className="text-[11px] text-slate-500">Across {works.length} projects</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Active Works</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">
            {works.filter((w) => w.status === "ONGOING").length} In Execution
          </div>
          <div className="text-[11px] text-slate-500">
            {works.filter((w) => w.status === "COMPLETED").length} Completed
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Active Schemes</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">4 Grants</div>
          <div className="text-[11px] text-slate-500">AMRUT 2.0, DPDC, 15th FC, Municipal Fund</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Ward:</span>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
            >
              <option value="ALL">All 17 Wards</option>
              {Array.from({ length: 17 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  Ward {w}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="ONGOING">ONGOING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="PLANNED">PLANNED</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredWorks.length} projects
        </span>
      </div>

      {/* Works Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Ward & Work Name</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Cost (Sanctioned)</th>
                <th className="py-3.5 px-4">Progress Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorks.map((work) => (
                <tr key={work.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 max-w-sm">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 mb-1">
                      Ward {work.wardNumber} — {work.wardName}
                    </span>
                    <div className="font-bold text-slate-900">{work.title}</div>
                    <div className="text-[11px] text-slate-500 font-marathi mt-0.5">
                      {work.titleMr}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900">{work.department}</div>
                    <div className="text-slate-500 text-[11px]">{work.startDate} → {work.expectedCompletion}</div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                    <div className="font-bold text-slate-900">₹{work.budgetInLakhs} L</div>
                    <div className="text-[11px] text-slate-500">Progress: {work.progressPct}%</div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <select
                      value={work.status}
                      onChange={(e) => handleStatusChange(work.id, e.target.value as WorkStatus)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        work.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : work.status === "ONGOING"
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-slate-100 text-slate-700 border-slate-300"
                      }`}
                    >
                      <option value="PLANNED">PLANNED</option>
                      <option value="ONGOING">ONGOING</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(work.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      title="Delete Work"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Work Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-base">Add Ward Infrastructure Work</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Title (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Concrete Road & Underground Storm Drainage..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Title (मराठी)
                </label>
                <input
                  type="text"
                  placeholder="उदा. कॉंक्रीट रस्ता व भूमिगत गटार बांधकाम..."
                  value={formData.titleMr}
                  onChange={(e) => setFormData({ ...formData, titleMr: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ward Number (1-17)
                  </label>
                  <select
                    value={formData.wardNumber}
                    onChange={(e) => setFormData({ ...formData, wardNumber: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    {Array.from({ length: 17 }, (_, i) => i + 1).map((w) => (
                      <option key={w} value={w}>
                        Ward {w}
                      </option>
                    ))}
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
                    Sanctioned Budget (Lakhs INR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 45.00"
                    value={formData.budgetInLakhs}
                    onChange={(e) => setFormData({ ...formData, budgetInLakhs: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Progress Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progressPct}
                    onChange={(e) => setFormData({ ...formData, progressPct: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0C1E3C] hover:bg-[#071224] text-white px-4 py-2 text-xs font-bold rounded-xl shadow-md"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
