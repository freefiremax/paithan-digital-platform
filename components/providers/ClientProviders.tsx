"use client";

import React, { ReactNode } from "react";
import { AccessibilityToolbar } from "@/components/a11y/AccessibilityToolbar";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AccessibilityToolbar />
    </>
  );
}