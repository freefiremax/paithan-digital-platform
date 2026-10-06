"use client";

import type { NotificationCategory } from "@/lib/mock-data";
import { notificationCategoryLabels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const CATEGORY_CLASS: Readonly<Record<NotificationCategory, string>> = {
  TENDER: "badge-tender",
  NOTICE: "badge-notice",
  SCHEME: "badge-scheme",
  ANNOUNCEMENT: "badge-announcement",
};

interface NotificationCategoryBadgeProps {
  readonly category: NotificationCategory;
  readonly className?: string;
}

/** Categorisation marker for the official notice register. */
export function NotificationCategoryBadge({ category, className }: NotificationCategoryBadgeProps) {
  const t = useTranslations("nagarParishad");

  const categoryLabel =
    category === "TENDER"
      ? t("categoryTender")
      : category === "NOTICE"
      ? t("categoryNotice")
      : category === "SCHEME"
      ? t("categoryScheme")
      : category === "ANNOUNCEMENT"
      ? t("categoryAnnouncement")
      : notificationCategoryLabels[category];

  return (
    <span className={cn("badge-civic", CATEGORY_CLASS[category], className)}>
      {categoryLabel}
    </span>
  );
}
