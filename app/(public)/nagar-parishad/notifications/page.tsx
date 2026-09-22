"use client";

import React, { useState, useMemo } from "react";
import { Search, Download, FileText, ExternalLink } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NotificationCategoryBadge } from "@/components/ui/NotificationCategoryBadge";
import { notifications, formatCivicDate, type NotificationCategory } from "@/lib/mock-data";

export default function NotificationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotices = useMemo(() => {
    return notifications.filter((item) => {
      const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Nagar Parishad", href: "/nagar-parishad" },
          { label: "Notifications & Tenders" },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title="Official Public Notices & E-Tenders"
          description="The official notification ledger of Paithan Municipal Council. Includes active e-procurement tenders, government welfare scheme beneficiary lists, and public health advisories."
        />

        {/* E-PROCUREMENT PORTAL BANNER */}
        <div className="mt-4 mb-8 border border-[var(--border-subtle)] bg-[var(--bg-surface-slate)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[var(--zari-gold-600)] shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[var(--gov-navy-900)]">
                Government of Maharashtra Official e-Tendering Portal
              </p>
              <p className="text-[11px] text-slate-600">
                Formal tender submissions and BOQ document downloads are processed through MahaTenders.
              </p>
            </div>
          </div>
          <a
            href="https://mahatenders.gov.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--gov-navy-700)] hover:underline shrink-0"
          >
            <span>Visit mahatenders.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* FILTER CONTROLS */}
        <div className="border border-[var(--border-subtle)] bg-white p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by keyword, reference no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-[var(--border-subtle)] rounded text-xs text-slate-800 focus:outline-hidden focus:border-[var(--gov-navy-700)]"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {(["ALL", "TENDER", "NOTICE", "SCHEME", "ANNOUNCEMENT"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    selectedCategory === cat
                      ? "bg-[var(--gov-navy-900)] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat === "ALL" ? "All Categories" : cat.charAt(0) + cat.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS TABLE LEDGER */}
        <div className="overflow-x-auto border border-[var(--border-subtle)] bg-white">
          <table className="gov-table min-w-[45rem]">
            <thead>
              <tr>
                <th scope="col" className="w-32">
                  Published
                </th>
                <th scope="col" className="w-32">
                  Category
                </th>
                <th scope="col">Title & Department</th>
                <th scope="col" className="w-36">
                  Reference No.
                </th>
                <th scope="col" className="w-28">
                  Closing Date
                </th>
                <th scope="col" className="w-20 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredNotices.map((item) => (
                <tr key={item.id}>
                  <td className="text-xs text-slate-600">
                    <time dateTime={item.publishedAt}>{formatCivicDate(item.publishedAt)}</time>
                  </td>
                  <td>
                    <NotificationCategoryBadge category={item.category} />
                  </td>
                  <td>
                    <p className="font-semibold text-xs text-[var(--gov-navy-900)]">{item.title}</p>
                    <p lang="mr" className="text-[11px] text-slate-500 mt-0.5">
                      {item.titleMr}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Issued by: {item.department}</p>
                  </td>
                  <td className="text-xs font-mono text-slate-600">{item.referenceNo}</td>
                  <td className="text-xs text-slate-600">
                    {item.closingAt ? (
                      <span className="text-amber-800 font-medium">
                        {formatCivicDate(item.closingAt)}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="text-center">
                    <button
                      title="Download official PDF copy"
                      className="inline-flex items-center justify-center p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-[var(--gov-navy-900)] transition-colors"
                      onClick={() => alert(`Downloading official notice document: ${item.referenceNo}`)}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
