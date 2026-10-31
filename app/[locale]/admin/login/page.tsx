"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { AuthFrame } from "@/components/auth/AuthFrame";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";
import { signInErrorMessage } from "@/lib/auth/error-message";
import { citizenCallbackUrl } from "@/lib/auth/redirect";
import styles from "@/components/auth/CitizenAuth.module.css";
import { useTranslations, useLocale } from "next-intl";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";

function AdminLoginForm() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const rawCallbackUrl = searchParams.get("callbackUrl");
  const targetCallbackUrl = citizenCallbackUrl(rawCallbackUrl, locale);
  const emailParam = searchParams.get("email") || "";
  const isRegistered = searchParams.get("registered") === "1";
  const errorParam = searchParams.get("error");
  const t = useTranslations("adminLogin");
  const tLogin = useTranslations("login");
  const common = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const initialError = signInErrorMessage(errorParam);
  const [error, setError] = useState(initialError ? common(initialError) : '');
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [challenge, setChallenge] = useState(0);
  const turnstileConfigured = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
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
    if (turnstileConfigured && !turnstileToken) { setError(tLogin("errorInvalidCredentials")); return; }
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        turnstileToken,
        redirect: false,
        callbackUrl: targetCallbackUrl,
      });

      if (result?.error) {
        setError(result.code === "account_not_found" ? common("staffAccountMissing") : t("errorInvalidCredentials"));
        return;
      }

      window.location.assign(targetCallbackUrl);
    } catch {
      setError(t("errorUnexpected"));
    } finally {
      setIsLoading(false);
      setTurnstileToken("");
      setChallenge(value => value + 1);
    }
  };

  return <AuthFrame mode="admin" title={t("title")} subtitle={t("subtitle")} footerNote={t("disclaimer")}>
    <section className={styles.card} aria-label={t("title")}>
      {isRegistered && <p className={styles.success} role="status">{tLogin("accountCreatedSuccess")}</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <GoogleSignIn callbackUrl={targetCallbackUrl} disabled={isLoading} onStart={() => { setError(''); setIsLoading(true); }} onFailure={key => setError(common(key))} onRetry={() => setError('')}/>
      <div className={styles.divider}>{common("orUseEmail")}</div>
      <form onSubmit={handleSubmit} className={styles.form} aria-busy={isLoading}>
        <div className={styles.field}><label htmlFor="auth-email">{t("emailLabel")}</label><div className={styles.inputWrap}><Mail size={17} className={styles.inputIcon} aria-hidden="true"/><input id="auth-email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className={styles.input} placeholder={t("emailPlaceholder")}/></div></div>
        <div className={styles.field}><label htmlFor="auth-password">{t("passwordLabel")}</label><div className={styles.inputWrap}><Lock size={17} className={styles.inputIcon} aria-hidden="true"/><input id="auth-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className={styles.input} placeholder={t("passwordPlaceholder")}/><button type="button" className={styles.toggle} onClick={() => setShowPassword(value => !value)} aria-label={common(showPassword ? "hidePassword" : "showPassword")} aria-pressed={showPassword}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></div>
        {turnstileConfigured && <TurnstileWidget key={challenge} theme="light" action="admin-login" onVerify={setTurnstileToken} />}
        <button type="submit" className={styles.submit} disabled={isLoading}>{isLoading ? t("signingIn") : t("submitBtn")}</button>
      </form>
      <p className={styles.switch}><Link href={`/${locale}/login`}>{common("citizenSignIn")}</Link></p>
    </section>
  </AuthFrame>;
}

export default function AdminLoginPage() {
  return <Suspense><AdminLoginForm /></Suspense>;
}
