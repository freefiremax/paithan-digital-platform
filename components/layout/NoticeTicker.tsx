import React from "react";
import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";
import { OFFICIAL_NOTIFICATIONS } from "@/lib/mock-data";

export default function NoticeTicker() {
  const pinnedNotices = OFFICIAL_NOTIFICATIONS.filter((n) => n.isPinned);

  return (
    <aside aria-label="Official announcements ticker" className="bg-[#071224] text-slate-100 border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-9">
        <div className="flex items-center gap-1.5 shrink-0 pr-3 font-semibold uppercase tracking-wider text-amber-400 border-r border-slate-700">
          <Bell className="w-3.5 h-3.5 animate-pulse" />
          <span>Notice Ticker</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap flex-1 px-3">
          <div className="inline-flex gap-8 items-center">
            {pinnedNotices.map((notice) => (
              <Link
                key={notice.id}
                href="/nagar-parishad/notifications"
                className="inline-flex items-center gap-2 hover:text-amber-300 transition-colors"
              >
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-medium border border-amber-500/40">
                  {notice.category}
                </span>
                <span className="truncate max-w-md sm:max-w-xl">{notice.title}</span>
                <span className="text-slate-400 text-[11px] font-mono">[{notice.referenceNo}]</span>
              </Link>
            ))}
          </div>
        </div>
        <Link
          href="/nagar-parishad/notifications"
          className="shrink-0 pl-3 border-l border-slate-700 text-amber-400 hover:text-amber-300 inline-flex items-center gap-0.5 font-medium transition-colors"
        >
          <span>All Notices</span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}

export { NoticeTicker };

