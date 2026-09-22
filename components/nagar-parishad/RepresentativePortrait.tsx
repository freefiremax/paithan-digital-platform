import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface RepresentativePortraitProps {
  readonly name: string;
  /** False for offices listed without a confirmed holder — shows a neutral glyph, not initials. */
  readonly hasNamedHolder: boolean;
  readonly size?: "sm" | "md";
  readonly className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "";
  }
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return `${first}${last}`.toUpperCase();
}

/**
 * Stands in for an official photograph until the Nagar Parishad supplies portraits.
 * A flat monogram plate rather than a rounded avatar — this is a personnel record on an
 * official page, not a social profile.
 */
export function RepresentativePortrait({
  name,
  hasNamedHolder,
  size = "md",
  className,
}: RepresentativePortraitProps) {
  const dimension = size === "sm" ? "h-11 w-11" : "h-[4.5rem] w-[4.5rem]";

  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center border border-[var(--border-strong)] bg-[var(--bg-surface-slate)]",
        dimension,
        className,
      )}
    >
      {hasNamedHolder ? (
        <span
          className={cn(
            "font-semibold tracking-tight text-[var(--gov-navy-800)]",
            size === "sm" ? "text-sm" : "text-xl",
          )}
        >
          {initialsOf(name)}
        </span>
      ) : (
        <UserRound size={size === "sm" ? 18 : 26} className="text-[var(--civic-slate-500)]" />
      )}
    </span>
  );
}
