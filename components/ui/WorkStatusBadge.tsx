"use client";

import type { WorkStatus } from "@/lib/mock-data";
import { workStatusLabels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const STATUS_CLASS: Readonly<Record<WorkStatus, string>> = {
  COMPLETED: "badge-completed",
  ONGOING: "badge-ongoing",
  PLANNED: "badge-planned",
};

interface WorkStatusBadgeProps {
  readonly status: WorkStatus;
  readonly className?: string;
}

/** Status marker for development works and projects. */
export function WorkStatusBadge({ status, className }: WorkStatusBadgeProps) {
  const t = useTranslations("nagarParishad");

  const statusLabel =
    status === "COMPLETED"
      ? t("statusCompleted")
      : status === "ONGOING"
      ? t("statusOngoing")
      : status === "PLANNED"
      ? t("statusPlanned")
      : workStatusLabels[status];

  return (
    <span className={cn("badge-civic", STATUS_CLASS[status], className)}>
      {statusLabel}
    </span>
  );
}
