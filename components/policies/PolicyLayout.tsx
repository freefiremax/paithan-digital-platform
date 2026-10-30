"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

interface PolicyLayoutProps {
  children: React.ReactNode;
  titleKey: string;
  lastUpdated: string;
  backHref?: string;
}

export function PolicyLayout({ children, titleKey, lastUpdated, backHref }: PolicyLayoutProps) {
  const t = useTranslations("policies");
  const locale = useLocale();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-[var(--paper-600)]">
          <li>
            <Link href={backHref || `/${locale}`} className="hover:text-[var(--saffron-600)]">
              {t("home")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/${locale}/policies`} className="hover:text-[var(--saffron-600)]">
              {t("policiesIndex")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--portal-blue-900)] font-medium" aria-current="page">
            {t(titleKey)}
          </li>
        </ol>
      </nav>

      <article className="bg-[#fffdf9] rounded-xl border border-[var(--border-subtle)] p-6 sm:p-8">
        <header className="mb-8 pb-6 border-b border-[var(--border-subtle)]">
          <h1 className="text-3xl font-bold text-[var(--portal-blue-900)] mb-2">{t(titleKey)}</h1>
          <p className="text-sm text-[var(--paper-600)]">
            {t("lastUpdated")}: <time dateTime={lastUpdated}>{lastUpdated}</time>
          </p>
        </header>

        <div className="prose prose-slate max-w-none text-[var(--paper-800)]">
          {children}
        </div>
      </article>
    </div>
  );
}