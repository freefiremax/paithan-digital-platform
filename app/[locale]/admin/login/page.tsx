"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, useSession, getCsrfToken } from "next-auth/react";
import { ShieldCheck, Lock, Mail, ArrowRight, Building2, AlertCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

function AdminLoginForm() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const rawCallbackUrl = searchParams.get("callbackUrl");
  const homePageUrl = `/${locale}`;
  const targetCallbackUrl =
    rawCallbackUrl && !rawCallbackUrl.includes("/admin") && !rawCallbackUrl.includes("/login")
      ? rawCallbackUrl
      : homePageUrl;
  const emailParam = searchParams.get("email") || "";
  const isRegistered = searchParams.get("registered") === "1";
  const errorParam = searchParams.get("error");
  const t = useTranslations("adminLogin");

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    errorParam
      ? errorParam === "OAuthCallback" || errorParam === "Callback"
        ? "Google sign-in encountered an issue. Please try again."
        : `Authentication error: ${errorParam}`
      : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    getCsrfToken().then((token) => {
      if (token) setCsrfToken(token);
    });
  }, []);

  // If already authenticated, redirect immediately away from login page
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userRole = (session.user as { role?: string })?.role;
      if (userRole === "ADMIN" || userRole === "EDITOR") {
        router.replace(`/${locale}/admin/dashboard`);
      } else {
        router.replace(targetCallbackUrl);
      }
    }
  }, [status, session, locale, targetCallbackUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: targetCallbackUrl,
      });

      if (result?.error) {
        setError(t("errorInvalidCredentials"));
        return;
      }

      window.location.assign(targetCallbackUrl);
    } catch {
      setError(t("errorUnexpected"));
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
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/90 px-2 text-slate-500 font-medium">
                {t("orContinueWith")}
              </span>
            </div>
          </div>

          <form action="/api/auth/signin/google" method="POST" className="w-full mb-4">
            <input type="hidden" name="callbackUrl" value={targetCallbackUrl} />
            <input type="hidden" name="csrfToken" value={csrfToken || ""} />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-xl py-3 px-4 text-sm font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z" />
                <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/90 px-3 text-slate-400 font-medium">
                Or sign in with email
              </span>
            </div>
          </div>

          <div>
            {isRegistered && (
              <div className="mb-4 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-xl">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Account created successfully! Please enter your password to sign in.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t("emailLabel")}
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
                  {t("passwordLabel")}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/70 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                    placeholder={t("passwordPlaceholder")}
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
                  <span>{t("signingIn")}</span>
                ) : (
                  <>
                    <span>{t("submitBtn")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col gap-2 text-center">
            <Link
              href={`/${locale}/register`}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium transition"
            >
              Need a citizen account? Register here →
            </Link>
            <Link
              href={`/${locale}`}
              className="text-xs text-slate-400 hover:text-white transition inline-flex items-center justify-center gap-1 mt-1"
            >
              ← {t("backToPublic")}
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

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#071224] flex items-center justify-center">
          <div className="text-amber-400 animate-pulse text-sm">Loading...</div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}