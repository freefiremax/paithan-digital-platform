import type { NotificationCategory } from "@/lib/mock-data";
import { notificationCategoryLabels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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

/** Categorisation marker for the official notice register (prd.md §7). */
export function NotificationCategoryBadge({ category, className }: NotificationCategoryBadgeProps) {
  return (
    <span className={cn("badge-civic", CATEGORY_CLASS[category], className)}>
      {notificationCategoryLabels[category]}
    </span>
  );
}
