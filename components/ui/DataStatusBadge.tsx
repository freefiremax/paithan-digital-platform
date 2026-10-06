"use client";

import type { DataStatus } from "@/lib/mock-data";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface DataStatusBadgeProps {
  readonly status: DataStatus;
  /** Set on records where the reader benefits from seeing the positive confirmation too. */
  readonly showVerified?: boolean;
  readonly className?: string;
}

export function DataStatusBadge({ status, showVerified = false, className }: DataStatusBadgeProps) {
  const t = useTranslations("common");

  if (status === "VERIFIED") {
    if (!showVerified) {
      return null;
    }
    return (
      <span className={cn("badge-civic badge-completed", className)}>{t("verifiedRecord")}</span>
    );
  }

  return (
    <span className={cn("badge-civic badge-sample", className)} title={t("sampleTbd")}>
      {t("sampleTbd")}
    </span>
  );
}

