"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, Building2, AlertCircle } from "lucide-react";

import { DEMO_ADMIN_USERS } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("chief.officer@paithan.gov.in");
  const [password, setPassword] = useState("••••••••");
  const [selectedRole, setSelectedRole] = useState("superadmin");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (roleKey: string) => {
    setSelectedRole(roleKey);
    const user = DEMO_ADMIN_USERS[roleKey];
    if (user) {
      setEmail(user.email);
      setPassword("paithan@2025");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      // Set session cookie or localStorage
      const user = DEMO_ADMIN_USERS[selectedRole] || DEMO_ADMIN_USERS.superadmin;
      if (typeof window !== "undefined") {
        localStorage.setItem("paithan_admin_user", JSON.stringify(user));
        document.cookie = `paithan_admin_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
      }
      setIsLoading(false);
      router.push("/admin/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#071224] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Golden Ambient Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Council Emblem & Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-xl shadow-amber-500/20 mb-4 border border-amber-300/40">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Government Administration</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            पैठण नगर परिषद CMS पोर्टल
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Paithan Municipal Council Internal Governance & Content Management System
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Demo Role Selector Bar */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Demo Staff Profile:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect("superadmin")}
                className={`p-2 rounded-xl text-xs font-medium border text-center transition ${
                  selectedRole === "superadmin"
                    ? "bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md"
                    : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-850 hover:text-white"
                }`}
              >
                Chief Officer
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("editor")}
                className={`p-2 rounded-xl text-xs font-medium border text-center transition ${
                  selectedRole === "editor"
                    ? "bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md"
                    : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-850 hover:text-white"
                }`}
              >
                Tender Editor
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("wardofficer")}
                className={`p-2 rounded-xl text-xs font-medium border text-center transition ${
                  selectedRole === "wardofficer"
                    ? "bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md"
                    : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-850 hover:text-white"
                }`}
              >
                Ward Officer
              </button>
            </div>
            {selectedRole && (
              <p className="text-[11px] text-amber-300/90 mt-2 font-medium">
                Active Role: {DEMO_ADMIN_USERS[selectedRole]?.roleTitle} ({DEMO_ADMIN_USERS[selectedRole]?.department})
              </p>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Official Email / Officer ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Security Password / Token
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-800/50 p-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Authenticating Officer...</span>
              ) : (
                <>
                  <span>Sign In to Municipal Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-amber-400 transition inline-flex items-center gap-1"
            >
              ← Back to Paithan Public Platform
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-400">
            For authorized municipal council officers only. Audit logging is active under IT Act 2000.
          </p>
        </div>
      </div>
    </div>
  );
}
