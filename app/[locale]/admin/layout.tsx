"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BellRing,
  Pickaxe,
  Map,
  LogOut,
  Building2,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  User,
  BadgeAlert,
} from "lucide-react";
import { AdminUser, DEMO_ADMIN_USERS } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser>(() => DEMO_ADMIN_USERS.superadmin);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on /admin/login, don't show admin navigation chrome
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage && typeof window !== "undefined") {
      const stored = localStorage.getItem("paithan_admin_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          queueMicrotask(() => setCurrentUser(parsed));
        } catch {
          // fallback remains default
        }
      }
    }
  }, [isLoginPage]);


  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("paithan_admin_user");
      document.cookie = "paithan_admin_role=; path=/; max-age=0;";
    }
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    {
      label: "Dashboard & KPIs",
      mr: "डॅशबोर्ड व आढावा",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Tenders & Circulars",
      mr: "निविदा व अधिसूचना",
      href: "/admin/notifications",
      icon: BellRing,
    },
    {
      label: "Development Works",
      mr: "वॉर्ड विकास कामे",
      href: "/admin/development-works",
      icon: Pickaxe,
    },
    {
      label: "Wards & Corporators",
      mr: "प्रभाग व नगरसेवक",
      href: "/admin/wards",
      icon: Map,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#071224] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold leading-tight">पैठण नगर परिषद</div>
            <div className="text-[10px] text-amber-400">Admin Governance CMS</div>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:flex flex-col w-full md:w-64 bg-[#071224] text-white border-r border-slate-800 shrink-0 z-40`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white">पैठण नगर परिषद</h2>
              <div className="text-[11px] text-amber-400 font-medium">Administration CMS</div>
            </div>
          </div>
        </div>

        {/* Current User Role Pill */}
        <div className="px-5 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 border border-slate-700">
            <User className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-white truncate">
              {currentUser?.name || "Santosh Dagdu Agle"}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{currentUser?.roleTitle || "Chief Officer"}</span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                <div className="flex flex-col">
                  <span>{item.label}</span>
                  <span className="text-[10px] opacity-75">{item.mr}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>View Public Portal</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Top Notification Warning banner for unconfirmed records (rules.md §2) */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Official Compliance Mode:</strong> Content updates directly publish to the public Paithan Digital Portal. Ensure all tenders adhere to Maharashtra Nagar Parishad Act 1965.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 hidden sm:inline-block">
            Audit Active
          </span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
