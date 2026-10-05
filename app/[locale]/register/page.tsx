"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ShieldCheck, Lock, Mail, User, ArrowRight, Building2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const t = useTranslations("register");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("errorPasswordsMismatch"));
      return;
    }

    if (password.length < 12) {
      setError(t("errorPasswordTooShort"));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || t("submitError"));
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (signInResult?.error) {
        throw new Error(t("errorAutoLoginFailed"));
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("submitError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071224] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-xl shadow-amber-500/20 mb-4 border border-amber-300/40">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{t("officialPlatform")}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t("nameLabel")}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                  placeholder={t("namePlaceholder")}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t("emailLabel")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                  placeholder={t("emailPlaceholder")}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t("passwordLabel")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={12}
                  maxLength={128}
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-xl pl-9 pr-12 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                  placeholder={t("passwordPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-amber-400 transition"
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">{t("passwordHint")}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t("confirmPasswordLabel")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                  placeholder={t("confirmPasswordPlaceholder")}
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
                <span>{t("creatingAccount")}</span>
              ) : (
                <>
                  <span>{t("submitBtn")}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link
              href="/admin/login"
              className="text-xs text-slate-400 hover:text-amber-400 transition inline-flex items-center gap-1"
            >
              ← {t("backToLogin")}
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-400">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#071224] flex items-center justify-center">
          <div className="text-amber-400 animate-pulse text-sm">Loading...</div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}