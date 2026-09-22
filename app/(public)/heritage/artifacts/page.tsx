"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { MUSEUM_EXHIBITS } from "@/lib/mock-data";


export default function ArtifactsCatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredExhibits = MUSEUM_EXHIBITS.filter((exhibit) => {
    const matchesSearch =
      exhibit.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibit.nameMr.includes(searchTerm) ||
      exhibit.accessionRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || exhibit.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ["ALL", "COINS", "MANUSCRIPT", "SCULPTURE", "TEXTILE", "WEAPONS", "IVORY"];

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-[#071224] via-[#0C1E3C] to-[#122B54] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Dr. Balasaheb Patil State Archaeological Repository</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              पुरातन वस्तू व अवशेष (Antiquities & Artifacts Catalog)
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Curated register of Satavahana numismatics, Roman Indo-Pacific trade relics, Modi script royal decrees, and historic Paithani golden textiles excavated from imperial Pratishthana.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search artifacts by name, accession number, or period..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "ALL" ? "All Collections" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Artifacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExhibits.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    {item.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {item.accessionRef}
                  </span>
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-snug">
                    {item.nameEn}
                  </h2>
                  <p className="text-xs text-slate-600 font-marathi mt-0.5">
                    {item.nameMr}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.period}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <strong className="text-slate-900">Historical Significance:</strong>{" "}
                  {item.significance}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Sant Dnyaneshwar Udyan</span>
                <Link
                  href="/heritage/museum"
                  className="text-amber-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Museum Gallery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
