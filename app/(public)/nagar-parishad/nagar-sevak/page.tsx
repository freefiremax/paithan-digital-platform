"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Phone,
  MapPin,
  ShieldAlert,
  Building2,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { 
  wardCorporators, 
  electedRepresentatives, 
  administrationRepresentatives, 
  councilProfile,
  wards,
} from "@/lib/mock-data";

export default function NagarSevakPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCorporators = wardCorporators.filter(
    (w) =>
      w.wardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.wardNameMr.includes(searchTerm) ||
      w.wardNumber.toString().includes(searchTerm) ||
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.nameMr || "").includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-[#071224] via-[#0C1E3C] to-[#122B54] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Paithan Municipal Council (Class &apos;C&apos; Council)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              नगरसेवक व लोकप्रतिनिधी निर्देशिका (Elected Representatives)
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Official public representative roster for Paithan Assembly, Parliamentary constituency, and 17 Municipal Ward divisions.
            </p>
          </div>
        </div>

        {/* SEC Gazette Advisory (Rules.md §2 & §8) */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 leading-relaxed space-y-1">
            <div className="font-bold text-amber-900 text-sm">
              State Election Commission (SEC) Maharashtra Advisory / वैधानिक सूचना
            </div>
            <p>
              Under Maharashtra Municipal Councils, Nagar Panchayats and Industrial Townships Act, 1965, the Paithan Municipal Council comprises 17 wards. Ward corporator entries marked with{" "}
              <span className="font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                Sample / TBD
              </span>{" "}
              are awaiting final gazette notification from the State Election Commission following recent ward delimitation. Contact the Council Administration directly at 02431-223010 for certified records.
            </p>
          </div>
        </div>

        {/* High-Level Parliamentary & Legislative Leadership */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-600" />
            <span>Parliamentary, Legislative & Executive Leadership</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {electedRepresentatives.map((rep) => (
              <div
                key={rep.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                    {rep.designation}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{rep.name}</h3>
                  <p className="text-xs text-slate-600 font-marathi">{rep.nameMr}</p>
                  <p className="text-xs text-amber-800 font-semibold mt-1">{rep.constituency}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{rep.termNote}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div><strong>Phone:</strong> {rep.phone}</div>
                  <div><strong>Office:</strong> {rep.officeAddress}</div>
                </div>
              </div>
            ))}

            {/* Chief Officer Card */}
            {administrationRepresentatives.slice(0, 1).map((rep) => (
              <div
                key={rep.id}
                className="bg-gradient-to-br from-[#071224] to-[#0C1E3C] text-white rounded-2xl border border-amber-500/30 p-6 shadow-md flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                    Executive Directorate
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{rep.name}</h3>
                  <p className="text-xs text-amber-200/80 font-marathi">{rep.nameMr}</p>
                  <p className="text-xs text-slate-300 font-semibold mt-1">{rep.designation}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{councilProfile.nameEn}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/80 text-xs text-slate-300 space-y-1">
                  <div><strong>Phone:</strong> {rep.phone}</div>
                  <div><strong>Email:</strong> {rep.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 17 Wards Directory */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                17 प्रभागांचे नगरसेवक (Ward-Wise Corporators)
              </h2>
              <p className="text-xs text-slate-500">
                Direct contacts for civic grievances, water supply, and local ward maintenance
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ward or corporator..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCorporators.map((ward) => {
              const wardInfo = wards.find((w) => w.number === ward.wardNumber);
              return (
                <div
                  key={ward.wardNumber}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-amber-400/80 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black bg-[#0C1E3C] text-white px-2.5 py-1 rounded-lg">
                        Ward {ward.wardNumber}
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Sample / TBD
                      </span>
                    </div>

                    <div className="mt-3">
                      <h3 className="font-bold text-base text-slate-900">{ward.wardName}</h3>
                      <p className="text-xs text-slate-500 font-marathi">{ward.wardNameMr}</p>
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[11px] text-slate-400 font-medium uppercase">Nagar Sevak / Corporator</div>
                      <div className="font-bold text-sm text-slate-900 mt-0.5">{ward.name}</div>
                      <div className="text-xs text-slate-600 font-marathi">{ward.nameMr}</div>

                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Paithan Municipal Council</span>
                        <a
                          href={`tel:${(ward.phone || "02431223010").replace(/[^0-9]/g, "")}`}
                          className="font-mono text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{ward.phone || "02431-223010"}</span>
                        </a>
                      </div>
                    </div>

                    {wardInfo && (
                      <div className="mt-3 text-xs text-slate-600">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>Locality: {wardInfo.locality}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Census Ward #{ward.wardNumber}</span>
                    <Link
                      href={`/nagar-parishad/development-works`}
                      className="text-amber-700 hover:underline font-semibold"
                    >
                      Ward Works →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
