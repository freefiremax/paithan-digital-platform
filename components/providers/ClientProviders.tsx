"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { AccessibilityToolbar } from "@/components/a11y/AccessibilityToolbar";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <AccessibilityToolbar />
    </SessionProvider>
  );
}