"use client";

import React, { ReactNode, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { useLocale } from "next-intl";
import { VisitorAnalytics } from "./VisitorAnalytics";
import { CookiePreferences } from "@/components/privacy/CookiePreferences";

export function ClientProviders({ children }: { children: ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    if (typeof document !== "undefined" && locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return (
    <SessionProvider>
      <VisitorAnalytics />
      {children}
      <CookiePreferences />
    </SessionProvider>
  );
}