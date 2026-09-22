import type { WorkStatus } from "@/lib/mock-data";
import { workStatusLabels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Readonly<Record<WorkStatus, string>> = {
  COMPLETED: "badge-completed",
  ONGOING: "badge-ongoing",
  PLANNED: "badge-planned",
};

interface WorkStatusBadgeProps {
  readonly status: WorkStatus;
  readonly className?: string;
}

/** Status marker for development works and projects (prd.md §6.2). */
export function WorkStatusBadge({ status, className }: WorkStatusBadgeProps) {
  return (
    <span className={cn("badge-civic", STATUS_CLASS[status], className)}>
      {workStatusLabels[status]}
    </span>
  );
}
