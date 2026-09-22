import type { DataStatus } from "@/lib/mock-data";
import { SAMPLE_TBD_LABEL } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface DataStatusBadgeProps {
  readonly status: DataStatus;
  /** Set on records where the reader benefits from seeing the positive confirmation too. */
  readonly showVerified?: boolean;
  readonly className?: string;
}

/**
 * Provenance marker for every record rendered from `lib/mock-data`.
 *
 * rules.md §8 forbids publishing placeholder content that reads like real government data
 * without marking it. Routing that marking through one component means a new page cannot
 * accidentally ship an unbadged sample record.
 */
export function DataStatusBadge({ status, showVerified = false, className }: DataStatusBadgeProps) {
  if (status === "VERIFIED") {
    if (!showVerified) {
      return null;
    }
    return (
      <span className={cn("badge-civic badge-completed", className)}>Verified public record</span>
    );
  }

  return (
    <span className={cn("badge-civic badge-sample", className)} title={SAMPLE_TBD_LABEL}>
      {SAMPLE_TBD_LABEL}
    </span>
  );
}
