"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
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
} from "lucide-react";
import { councilProfile } from "@/lib/mock-data";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: "PUBLIC" | "EDITOR" | "ADMIN";
  wardId: string | null;
}

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const isMr = locale === "mr";

  const pathname = usePathname();
  const router = useRouter();
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status ?? "loading";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentLocale = pathname?.split("/")[1] || "en";
  const isLoginPage = pathname?.includes("/admin/login") || pathname?.endsWith("/login");

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${currentLocale}/admin/login` });
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">
          {currentLocale === "mr" ? "लोड होत आहे..." : currentLocale === "hi" ? "लोड हो रहा है..." : "Loading..."}
        </div>
      </div>
    );
  }

  if (!session?.user) {
    router.push(`/${currentLocale}/admin/login?callbackUrl=${encodeURIComponent(pathname)}`);
    return null;
  }

  const user = session.user as AdminUser;
  const userRole = user.role;

  const navItems = [
    {
      label: t("dashboardTitle"),
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: t("tendersCirculars"),
      href: "/admin/notifications",
      icon: BellRing,
    },
    {
      label: t("developmentWorks"),
      href: "/admin/development-works",
      icon: Pickaxe,
    },
    {
      label: t("wardsCorporators"),
      href: "/admin/wards",
      icon: Map,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <div className="md:hidden bg-[#071224] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold leading-tight">{isMr ? councilProfile.nameMr : councilProfile.nameEn}</div>
            <div className="text-[10px] text-amber-400">{t("cmsHeading")}</div>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:flex flex-col w-full md:w-64 bg-[#071224] text-white border-r border-slate-800 shrink-0 z-40`}
      >
        <div className="p-5 border-b border-slate-800/80 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white">{isMr ? councilProfile.nameMr : councilProfile.nameEn}</h2>
              <div className="text-[11px] text-amber-400 font-medium">{t("cmsHeading")}</div>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 border border-slate-700">
            <User className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-white truncate">
              {user.name || user.email}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{userRole}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.endsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{t("viewPortal")}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t("logout")}</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}