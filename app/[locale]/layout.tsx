import type { ReactNode } from "react";
import { ClientProviders } from "@/components/providers/ClientProviders";

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}