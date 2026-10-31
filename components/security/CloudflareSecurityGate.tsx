"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { TurnstileWidget } from "./TurnstileWidget";

// This is a presentation gate, not authorization. Every protected mutation must
// independently validate its own fresh Turnstile token on the server.
export function CloudflareSecurityGate({ children }: { children: React.ReactNode }) {
  const t = useTranslations("security");
  const tHeader = useTranslations("header");
  const [verified, setVerified] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem("cf_portal_verified") === "true";
    } catch {
      return false;
    }
  });
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [canBypass, setCanBypass] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    return () => requestRef.current?.abort();
  }, []);

  useEffect(() => {
    // If verification takes longer than 2.5s, give user direct proceed option
    const bypassTimer = setTimeout(() => {
      setCanBypass(true);
    }, 2500);

    // Auto-proceed after 4.5s so user is never blocked by network latency or ad-blockers
    const autoPassTimer = setTimeout(() => {
      try {
        sessionStorage.setItem("cf_portal_verified", "true");
      } catch {}
      setVerified(true);
    }, 4500);

    return () => {
      clearTimeout(bypassTimer);
      clearTimeout(autoPassTimer);
    };
  }, [attempt]);

  async function verify(token: string) {
    if (!token) return;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setChecking(true); setError("");
    try {
      const response = await fetch("/api/security/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }), signal: controller.signal,
      });
      if (!response.ok) throw new Error("Security verification failed. Please retry the check.");
      try {
        sessionStorage.setItem("cf_portal_verified", "true");
      } catch {}
      setVerified(true);
    } catch (error) {
      if (controller.signal.aborted) return;
      setError(error instanceof Error ? error.message : "Security verification failed.");
      setAttempt(value => value + 1);
    } finally { if (!controller.signal.aborted) setChecking(false); }
  }

  // No simulated verification when the widget is not configured.
  if (!siteKey || verified) return <>{children}</>;
  return <div className="min-h-screen flex items-center justify-center bg-[#f1ece4] px-4 py-12">
    <section aria-labelledby="security-title" className="w-full max-w-md rounded-xl border border-[#d6c7b4] bg-white p-7 shadow-lg">
      <ShieldCheck className="mb-4 h-9 w-9 text-[#652b3d]" />
      <p className="mb-3 text-xs text-slate-600">{tHeader("topbarTagline")}</p>
      <h1 id="security-title" className="text-xl font-semibold text-[#652b3d]">{t("checkingConnection")}</h1>
      <p className="mt-2 text-sm text-slate-600">{t("verifyingBrowser")}</p>
      <TurnstileWidget key={attempt} appearance="interaction-only" onVerify={verify} />
      {checking && <p role="status" className="mt-3 text-sm">Validating the security check…</p>}
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      {canBypass && !verified && (
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">Taking too long?</p>
          <button
            type="button"
            onClick={() => {
              try { sessionStorage.setItem("cf_portal_verified", "true"); } catch {}
              setVerified(true);
            }}
            className="text-xs font-semibold text-[#652b3d] hover:underline cursor-pointer"
          >
            Proceed to website immediately &rarr;
          </button>
        </div>
      )}
    </section>
  </div>;
}
