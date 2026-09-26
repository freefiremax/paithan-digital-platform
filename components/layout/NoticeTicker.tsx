import React from "react";
import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";
import { OFFICIAL_NOTIFICATIONS } from "@/lib/mock-data";

export default function NoticeTicker() {
  const pinnedNotices = OFFICIAL_NOTIFICATIONS.filter((n) => n.isPinned);

  return (
    <aside
      aria-label="Official announcements ticker"
      className="border-b border-[var(--border-subtle)] bg-[var(--ticker-bg)] text-xs text-[var(--portal-blue-800)]"
    >
      <div className="mx-auto flex h-9 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-1.5 border-r border-[var(--border-strong)] pr-3 text-[11px] font-bold tracking-wider text-[var(--portal-blue-900)]">
          <Bell className="h-3.5 w-3.5 text-[var(--saffron-700)]" aria-hidden="true" />
          <span>Notice Ticker</span>
        </div>
        <div className="flex-1 overflow-hidden whitespace-nowrap px-3">
          <div className="inline-flex items-center gap-8">
            {pinnedNotices.map((notice) => (
              <Link
                key={notice.id}
                href="/nagar-parishad/notifications"
                className="inline-flex items-center gap-2 hover:underline"
              >
                <span className="rounded-sm bg-[var(--portal-blue-800)] px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {notice.category}
                </span>
                <span className="max-w-md truncate font-medium text-[var(--portal-blue-900)] sm:max-w-xl">
                  {notice.title}
                </span>
                <span className="font-mono text-[11px] text-[var(--civic-slate-500)]">
                  [{notice.referenceNo}]
                </span>
              </Link>
            ))}
          </div>
        </div>
        <Link
          href="/nagar-parishad/notifications"
          className="inline-flex shrink-0 items-center gap-0.5 border-l border-[var(--border-strong)] pl-3 font-semibold text-[var(--saffron-700)] hover:underline"
        >
          <span>All Notices</span>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}

export { NoticeTicker };

