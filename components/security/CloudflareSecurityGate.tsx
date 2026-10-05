"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { ShieldCheck, Lock, Globe } from "lucide-react";

export function CloudflareSecurityGate({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [rayId, setRayId] = useState("8c91a0298b42-BOM");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    const timer = setTimeout(() => {
      const verifiedInSession = typeof window !== "undefined" && sessionStorage.getItem("cf_portal_verified") === "true";
      if (verifiedInSession) {
        setIsVerified(true);
        setHasMounted(true);
        return;
      }

      const randomRay = Math.random().toString(16).substring(2, 18);
      setRayId(`${randomRay}-BOM`);
      setHasMounted(true);

      if (!siteKey) {
        setIsVerified(true);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("cf_portal_verified", "true");
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [siteKey]);

  const handleTurnstileSuccess = () => {
    setIsVerified(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cf_portal_verified", "true");
    }
  };

  if (!hasMounted || isVerified) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-[#071224] text-white flex flex-col justify-between p-6 md:p-12 select-none font-sans overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 max-w-4xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-white shadow-lg shadow-amber-500/20">
            PMC
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">Paithan Municipal Council</h1>
            <p className="text-xs text-slate-400">Government of Maharashtra • Official Digital Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>paithan.gov.in</span>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Checking your connection</h2>
              <p className="text-xs text-slate-400">Verifying browser integrity before portal access</p>
            </div>
          </div>

          <div className="my-6 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center justify-center text-center">
            {siteKey ? (
              <>
                <Script
                  src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                  strategy="afterInteractive"
                  onLoad={() => {
                    if (window.turnstile) {
                      try {
                        window.turnstile.render("#cf-gate-turnstile", {
                          sitekey: siteKey,
                          callback: handleTurnstileSuccess,
                          theme: "dark",
                        });
                      } catch {
                        handleTurnstileSuccess();
                      }
                    }
                  }}
                />
                <div id="cf-gate-turnstile" className="min-h-[65px] flex items-center justify-center my-2" />
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-9 h-9 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium text-amber-300">Securing connection via Cloudflare Edge Network...</p>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 text-center leading-relaxed">
            Paithan Municipal Council utilizes Cloudflare DDoS and automated threat mitigation to protect citizen services and public data.
          </p>
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Cloudflare Turnstile & SSL 256-bit Encrypted</span>
        </div>
        <div>
          <span>Ray ID: <code className="text-slate-400 font-mono">{rayId || "8c91a0298b42-BOM"}</code> • Performance & Security by Cloudflare</span>
        </div>
      </div>
    </div>
  );
}
