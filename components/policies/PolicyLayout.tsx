"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface PolicyLayoutProps {
  children: React.ReactNode;
  titleKey: string;
  lastUpdated: string;
  backHref?: string;
}

export function PolicyLayout({ children, titleKey, lastUpdated, backHref = "/" }: PolicyLayoutProps) {
  const t = useTranslations("policies");

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li>
            <Link href={backHref} className="hover:text-[var(--saffron-600)]">
              {t("home")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/policies" className="hover:text-[var(--saffron-600)]">
              {t("policiesIndex")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-900 font-medium" aria-current="page">
            {t(titleKey)}
          </li>
        </ol>
      </nav>

      <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <header className="mb-8 pb-6 border-b border-slate-200">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{t(titleKey)}</h1>
          <p className="text-sm text-slate-500">
            {t("lastUpdated")}: <time dateTime={lastUpdated}>{lastUpdated}</time>
          </p>
        </header>

        <div className="prose prose-slate max-w-none text-slate-700">
          {children}
        </div>
      </article>
    </div>
  );
}