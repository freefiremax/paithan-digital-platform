"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        callback?: (token: string) => void;
        "error-callback"?: (code?: string) => void;
        "expired-callback"?: () => void;
        theme?: "light" | "dark" | "auto";
        size?: "normal" | "compact" | "flexible";
      }) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  theme?: "light" | "dark" | "auto";
  className?: string;
}

export function TurnstileWidget({ onVerify, onError, theme = "light", className = "" }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const callbacks = useRef({ onVerify, onError });
  useEffect(() => { callbacks.current = { onVerify, onError }; }, [onVerify, onError]);
  const [status, setStatus] = useState<"loading" | "verified" | "error">("loading");
  const [errorCode, setErrorCode] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const fail = useCallback((code = "") => {
    setStatus("error");
    setErrorCode(code);
    callbacks.current.onVerify("");
    callbacks.current.onError?.();
  }, []);

  const renderWidget = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile || widgetIdRef.current !== null) return;
    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey, theme, size: "flexible",
        callback: token => { setStatus("verified"); setErrorCode(""); callbacks.current.onVerify(token); },
        "error-callback": code => fail(code),
        "expired-callback": () => {
          setStatus("loading");
          callbacks.current.onVerify("");
          if (widgetIdRef.current !== null) window.turnstile?.reset(widgetIdRef.current);
        },
      });
    } catch { fail("render-failed"); }
  }, [siteKey, theme, fail]);

  useEffect(() => {
    const frame = requestAnimationFrame(renderWidget);
    return () => {
      cancelAnimationFrame(frame);
      if (widgetIdRef.current !== null) {
        try { window.turnstile?.remove(widgetIdRef.current); } catch { /* Already removed. */ }
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  return <div className={`my-3 ${className}`}>
    {siteKey ? <>
      <Script id="cloudflare-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive" onReady={renderWidget} onError={() => fail("script-load-failed")} />
      <div ref={containerRef} className="min-h-[65px] w-full" />
      <p role="status" className="mt-2 text-xs">{status === "verified" ? "Security check complete." : status === "error" ? "Security check could not complete. Allow challenges.cloudflare.com and try again." : "Complete the security check to continue."}</p>
      {status === "error" && <>
        {errorCode && <p className="mt-1 text-xs">Verification error: {errorCode}</p>}
        <button type="button" className="mt-2 text-sm underline" onClick={() => {
          setStatus("loading"); setErrorCode(""); callbacks.current.onVerify("");
          if (widgetIdRef.current !== null) window.turnstile?.reset(widgetIdRef.current);
          else if (window.turnstile) renderWidget();
          else window.location.reload();
        }}>Retry security check</button>
      </>}
    </> : <p role="alert" className="text-sm">Security verification is unavailable. Please contact the council.</p>}
  </div>;
}
