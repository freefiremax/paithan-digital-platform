"use client";

import React, { useState, useMemo } from "react";
import { Search, Download, ExternalLink } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NotificationCategoryBadge } from "@/components/ui/NotificationCategoryBadge";
import { notifications, formatCivicDate, type NotificationCategory } from "@/lib/mock-data";

export default function NotificationsPage() {
  const t = useTranslations("nagarParishad");
  const tNav = useTranslations("nav");
  const tHome = useTranslations("home");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMr = locale === "mr";

  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotices = useMemo(() => {
    return notifications.filter((item) => {
      const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.titleMr && item.titleMr.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categoryLabels: Record<string, string> = {
    ALL: tCommon("allCategories"),
    TENDER: t("categoryTender"),
    NOTICE: t("categoryNotice"),
    SCHEME: t("categoryScheme"),
    ANNOUNCEMENT: t("categoryAnnouncement"),
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("nagarParishad"), href: "/nagar-parishad" },
          { label: t("noticesTitle") },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title={t("noticesTitle")}
          description={t("noticesSubtitle")}
        />

        {/* E-PROCUREMENT PORTAL REFERENCE — the state tender site, kept as a
            single ruled line of the register rather than a second banner that
            repeats the heading. */}
        <div className="mt-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-y border-[var(--border-subtle)] bg-[var(--canvas-bg)] px-4 py-2.5">
          <p className="text-[11px] text-[var(--civic-slate-700)]">
            {t("noticesSubtitle")}
          </p>
          <a
            href="https://mahatenders.gov.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--portal-blue-800)] hover:text-[var(--zari-gold-600)] shrink-0"
          >
            <span>mahatenders.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="reg-sheet">
          <div className="reg-sheet__head">
            <span className="gaz-col__title">{t("noticesTitle")}</span>
            <span className="reg-sheet__count tabular-nums">
              {filteredNotices.length.toLocaleString()} / {notifications.length.toLocaleString()}
            </span>
          </div>

          <div className="reg-search">
            <Search className="reg-search__icon w-4 h-4" aria-hidden="true" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={t("searchPlaceholder")}
            />
          </div>

          <div className="reg-tabs" role="group" aria-label={tCommon("filterBy")}>
            {(["ALL", "TENDER", "NOTICE", "SCHEME", "ANNOUNCEMENT"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className="reg-tab"
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>

          <table className="portal-register portal-register--wide min-w-full">
            <thead>
              <tr>
                <th scope="col">{tHome("publishedOn")}</th>
                <th scope="col">{tCommon("filterBy")}</th>
                <th scope="col">{t("noticesTitle")}</th>
                <th scope="col">{tHome("refNo")}</th>
                <th scope="col">{tHome("closingDate")}</th>
                <th scope="col" className="text-right">
                  {tHome("downloadNotice")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredNotices.map((item) => {
                const titleText = isMr && item.titleMr ? item.titleMr : item.title;
                return (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap">
                      <time dateTime={item.publishedAt}>{formatCivicDate(item.publishedAt)}</time>
                    </td>
                    <td className="whitespace-nowrap">
                      <NotificationCategoryBadge category={item.category} />
                    </td>
                    <td>
                      <p className="font-semibold text-xs text-[var(--portal-blue-900)]">{titleText}</p>
                      {!isMr && item.titleMr ? (
                        <p lang="mr" className="text-[11px] text-[var(--civic-slate-500)] mt-0.5">
                          {item.titleMr}
                        </p>
                      ) : null}
                      <p className="text-[10px] text-[var(--civic-slate-500)] mt-1">
                        {tCommon("department")}: {item.department}
                      </p>
                    </td>
                    <td className="whitespace-nowrap tabular-nums">{item.referenceNo}</td>
                    <td className="whitespace-nowrap">
                      {item.closingAt ? (
                        <span className="font-semibold text-[var(--portal-blue-700)] tabular-nums">
                          {formatCivicDate(item.closingAt)}
                        </span>
                      ) : (
                        <span className="text-[var(--civic-slate-500)]">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap text-right">
                      <button
                        type="button"
                        title={tHome("downloadNotice")}
                        aria-label={`${tHome("downloadNotice")} - ${titleText}`}
                        className="inline-flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--canvas-bg)] p-2 text-[var(--portal-blue-800)] transition-colors hover:bg-[var(--portal-blue-800)] hover:text-white"
                        onClick={() => alert(`${tHome("downloadNotice")}: ${item.referenceNo}`)}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Small screens: the register unrolls into stacked entries. */}
          <div className="reg-entries">
            {filteredNotices.map((item) => {
              const titleText = isMr && item.titleMr ? item.titleMr : item.title;
              return (
                <div key={item.id} className="reg-entry">
                  <div className="reg-entry__top">
                    <span className="reg-entry__date">
                      <time dateTime={item.publishedAt}>{formatCivicDate(item.publishedAt)}</time>
                    </span>
                    <NotificationCategoryBadge category={item.category} />
                  </div>
                  <p className="reg-entry__title">
                    {titleText}
                    {!isMr && item.titleMr ? (
                      <span lang="mr" className="reg-entry__mr">
                        {item.titleMr}
                      </span>
                    ) : null}
                  </p>
                  <div className="reg-entry__meta">
                    <span className="reg-entry__ref">
                      {tHome("refNo")} {item.referenceNo}
                    </span>
                    {item.closingAt ? (
                      <span className="reg-entry__due">
                        {tHome("closingDate")}: {formatCivicDate(item.closingAt)}
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="reg-entry__action"
                    onClick={() => alert(`${tHome("downloadNotice")}: ${item.referenceNo}`)}
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    {tHome("downloadNotice")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
