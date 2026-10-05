"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { CloudflareSecurityGate } from "@/components/security/CloudflareSecurityGate";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CloudflareSecurityGate>
        {children}
      </CloudflareSecurityGate>
    </SessionProvider>
  );
}