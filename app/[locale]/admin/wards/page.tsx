"use client";

import React, { useState } from "react";
import {
  MapPin,
  Search,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  ShieldAlert,
  X,
} from "lucide-react";
import { PAITHAN_WARDS } from "@/lib/mock-data";

type WardItem = (typeof PAITHAN_WARDS)[number];

export default function AdminWardsPage() {
  const [wardList, setWardList] = useState<WardItem[]>([...PAITHAN_WARDS]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingWard, setEditingWard] = useState<WardItem | null>(null);

  const filteredWards = wardList.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.nameMr.includes(searchTerm) ||
      w.number.toString().includes(searchTerm) ||
      w.corporatorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleVerification = (wardNumber: number) => {
    setWardList((prev) =>
      prev.map((w) => {
        if (w.number === wardNumber) {
          return {
            ...w,
            isSample: !w.isSample,
            corporatorParty: !w.isSample ? "Sample / TBD" : "Elected Representative",
          };
        }
        return w;
      })
    );
  };

  const handleSaveCorporator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWard) return;

    setWardList((prev) =>
      prev.map((w) => (w.number === editingWard.number ? editingWard : w))
    );
    setEditingWard(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>Paithan 17 Administrative Divisions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071224] tracking-tight">
            प्रभाग व नगरसेवक व्यवस्थापन (Wards & Corporators)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain gazette verification flags, boundaries, and public representative contact listings.
          </p>
        </div>
      </div>

      {/* Gazette Caution Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 leading-relaxed">
          <strong>SEC Maharashtra Verification Policy:</strong> Pending official State Election Commission (SEC) local body gazette notification, representative records marked as &quot;Sample / TBD&quot; are displayed with an advisory banner on the public portal to prevent citizen misinformation.
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ward number, area, or corporator..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Total 17 Wards | Population: 41,536
        </span>
      </div>

      {/* Wards Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Ward # & Area</th>
                <th className="py-3.5 px-4">Active Projects</th>
                <th className="py-3.5 px-4">Nagar Sevak / Corporator</th>
                <th className="py-3.5 px-4">Gazette Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWards.map((ward) => (
                <tr key={ward.number} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 text-sm">Ward {ward.number}</span>
                    <div className="font-semibold text-slate-700">{ward.name}</div>
                    <div className="text-[11px] text-slate-500 font-marathi">{ward.nameMr}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium">
                    {ward.activeProjects} Active Works
                  </td>

                  <td className="py-3.5 px-4">
                    <div>
                      <div className="font-bold text-slate-900">{ward.corporatorName}</div>
                      <div className="text-[11px] text-slate-500 font-marathi">
                        {ward.corporatorNameMr}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {ward.contact}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {ward.isSample ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Sample / Unconfirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Gazette Verified
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleVerification(ward.number)}
                        className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition"
                        title="Toggle verification flag"
                      >
                        Toggle Flag
                      </button>
                      <button
                        onClick={() => setEditingWard({ ...ward })}
                        className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"
                        title="Edit Ward Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Ward Modal */}
      {editingWard && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-base">
                Edit Ward {editingWard.number} - {editingWard.name}
              </h2>
              <button
                onClick={() => setEditingWard(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCorporator} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corporator Name (English)
                </label>
                <input
                  type="text"
                  value={editingWard.corporatorName}
                  onChange={(e) =>
                    setEditingWard({
                      ...editingWard,
                      corporatorName: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corporator Name (मराठी)
                </label>
                <input
                  type="text"
                  value={editingWard.corporatorNameMr}
                  onChange={(e) =>
                    setEditingWard({
                      ...editingWard,
                      corporatorNameMr: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={editingWard.contact}
                    onChange={(e) =>
                      setEditingWard({
                        ...editingWard,
                        contact: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Political Affiliation / Tag
                  </label>
                  <input
                    type="text"
                    value={editingWard.corporatorParty}
                    onChange={(e) =>
                      setEditingWard({
                        ...editingWard,
                        corporatorParty: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingWard(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0C1E3C] hover:bg-[#071224] text-white px-4 py-2 text-xs font-bold rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
