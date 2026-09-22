import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbTrailItem {
  readonly label: string;
  readonly href?: string;
}

interface BreadcrumbProps {
  readonly items: readonly BreadcrumbTrailItem[];
}

/** Trail back up the section hierarchy. The last item is the current page and is not a link. */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-[var(--border-subtle)] bg-white">
      <ol className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-1.5 px-4 py-2.5 text-[0.8125rem] text-[var(--civic-slate-500)]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-[var(--gov-navy-900)] hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-[var(--gov-navy-900)]" aria-current="page">
                  {item.label}
                </span>
              )}
              {isLast ? null : <ChevronRight size={13} aria-hidden className="text-[var(--border-strong)]" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
