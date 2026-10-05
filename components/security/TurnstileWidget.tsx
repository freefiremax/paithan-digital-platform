"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { ShieldCheck, Lock } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onTurnstileLoaded?: () => void;
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  theme?: "light" | "dark" | "auto";
  className?: string;
}

export function TurnstileWidget({
  onVerify,
  onError,
  theme = "light",
  className = "",
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      console.warn("Turnstile site key not configured. Widget will not render.");
      return;
    }
    const renderWidget = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          const id = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              setIsVerified(true);
              onVerify(token);
            },
            "error-callback": () => {
              setIsVerified(false);
              onError?.();
            },
            "expired-callback": () => {
              setIsVerified(false);
              onError?.();
            },
            theme,
            size: "normal",
          });
          widgetIdRef.current = id;
        } catch (e) {
          console.warn("Turnstile render note:", e);
        }
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      window.onTurnstileLoaded = () => {
        renderWidget();
      };
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onVerify, onError, theme]);

  return (
    <div className={`turnstile-wrapper my-3 ${className}`}>
      {!siteKey && (
        <div className="text-xs text-amber-600 p-2 bg-amber-50 border border-amber-200 rounded">
          Turnstile site key not configured. Please set NEXT_PUBLIC_TURNSTILE_SITE_KEY.
        </div>
      )}
      {siteKey && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoaded&render=explicit"
            strategy="afterInteractive"
          />
          <div className="flex flex-col gap-2">
            <div ref={containerRef} className="min-h-[65px] flex items-center" />
            
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              {isVerified ? (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified by Cloudflare Turnstile
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                  Protected by Cloudflare Turnstile Security
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
