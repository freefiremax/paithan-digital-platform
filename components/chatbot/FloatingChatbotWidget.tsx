"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bot, X, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { ChatInterface } from "./ChatInterface";

export function FloatingChatbotWidget() {
  const t = useTranslations("chatbot");
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Hide the floating widget on the dedicated chatbot page or inside admin
  if (pathname?.includes("/chatbot") || pathname?.includes("/admin")) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            aria-expanded={false}
            aria-label={t("title")}
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[var(--vangi-950)] to-[var(--vangi-850)] hover:from-[var(--vangi-850)] hover:to-[var(--vangi-950)] text-white pl-3.5 pr-4 py-3 rounded-full shadow-2xl border-2 border-amber-500/40 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--vangi-950)] rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--vangi-950)] rounded-full" />
            </div>

            <div className="text-left hidden xs:block">
              <div className="text-xs font-bold tracking-tight text-white flex items-center gap-1">
                <span>{t("askAi")}</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </div>
              <div className="text-[10px] text-amber-200/80 font-medium leading-none">
                {t("aiAssistantMarathi")}
              </div>
            </div>
          </button>
        ) : (
          <div className="flex flex-col items-end" role="dialog" aria-modal="false" aria-label={t("title")}>
            <button
              ref={closeButtonRef}
              onClick={() => setIsOpen(false)}
              aria-label={t("closeChatbot")}
              className="mb-2 h-9 w-9 rounded-full bg-slate-800 text-white shadow-lg transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-[calc(100vw-2rem)] max-w-[450px] overflow-hidden rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200 sm:w-[420px]">
              <ChatInterface fullPage={false} floating />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

