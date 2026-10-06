"use client";

import React, { ReactNode, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { useLocale } from "next-intl";
import { CloudflareSecurityGate } from "@/components/security/CloudflareSecurityGate";

export function ClientProviders({ children }: { children: ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    if (typeof document !== "undefined" && locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return (
    <SessionProvider>
      <CloudflareSecurityGate>
        {children}
      </CloudflareSecurityGate>
    </SessionProvider>
  );
}