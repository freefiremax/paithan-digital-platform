"use client";

import { BookOpen } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HISTORY_TIMELINE } from "@/lib/mock-data";

export default function HistoryPage() {
  const t = useTranslations("heritage");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isMr = locale === "mr";

  return (
    <>
      <Breadcrumb
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("heritage"), href: "/heritage/museum" },
          { label: t("historyTitle") },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title={t("historyHeading")}
          description={t("historySubtitle")}
        />

        {/* TIMELINE NARRATIVE */}
        <div className="mt-12 space-y-12">
          {HISTORY_TIMELINE.map((era) => {
            const eraTitle = isMr && era.titleMr ? era.titleMr : era.titleEn;
            return (
              <section
                key={era.eraId}
                className="border border-[var(--border-subtle)] bg-white p-6 sm:p-8"
                aria-labelledby={`era-${era.eraId}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[var(--border-subtle)] pb-4 gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--zari-gold-600)]">
                      {era.period}
                    </span>
                    <h2
                      id={`era-${era.eraId}`}
                      className="mt-1 text-lg sm:text-xl font-bold text-[var(--gov-navy-900)] font-serif"
                    >
                      {eraTitle}
                    </h2>
                  </div>
                  {!isMr && era.titleMr ? (
                    <span lang="mr" className="text-sm text-slate-500 font-medium">
                      {era.titleMr}
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {era.significance}
                </p>

                <div className="mt-5 bg-slate-50 border border-slate-200/80 p-4 rounded-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--gov-navy-900)] mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[var(--zari-gold-600)]" />
                    {tCommon("overview")}
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    {era.events.map((event, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--zari-gold-500)] mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
