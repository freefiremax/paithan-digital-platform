import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  readonly title: string;
  readonly description?: string;
  /** Rendered next to the heading on wide screens, below it on mobile. */
  readonly action?: { readonly label: string; readonly href: string };
  readonly as?: "h1" | "h2";
  readonly id?: string;
  readonly children?: ReactNode;
  readonly className?: string;
}

/**
 * Section header used across public pages: title, a zari-gold rule that marks the start of
 * an official section, and an optional link to the section's full index.
 */
export function SectionHeading({
  title,
  description,
  action,
  as = "h2",
  id,
  children,
  className,
}: SectionHeadingProps) {
  const Heading = as;

  return (
    <div className={cn("mb-7", className)}>
      <div className="section-rule flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <Heading
          id={id}
          className={cn(
            "font-semibold tracking-tight text-[var(--gov-navy-900)]",
            as === "h1" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-[1.75rem]",
          )}
        >
          {title}
        </Heading>
        {action ? (
          <Link
            href={action.href}
            className="text-sm font-semibold text-[var(--gov-navy-700)] underline decoration-[var(--zari-gold-500)] decoration-2 underline-offset-4 hover:text-[var(--gov-navy-900)]"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
      {description ? (
        <p className="mt-4 max-w-[68ch] text-[0.9375rem] leading-relaxed text-[var(--civic-slate-700)]">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
