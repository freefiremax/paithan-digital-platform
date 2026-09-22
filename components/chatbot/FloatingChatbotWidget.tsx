"use client";

import React, { useState } from "react";
import { Bot, X, Sparkles } from "lucide-react";
import { ChatInterface } from "./ChatInterface";

import { usePathname } from "next/navigation";

export function FloatingChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide the floating widget on the dedicated chatbot page or inside admin
  if (pathname === "/chatbot" || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Paithan AI Civic Assistant"
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#071224] to-[#0C1E3C] hover:from-[#0C1E3C] hover:to-[#071224] text-white pl-3.5 pr-4 py-3 rounded-full shadow-2xl border-2 border-amber-500/40 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#071224] rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#071224] rounded-full" />
            </div>

            <div className="text-left hidden xs:block">
              <div className="text-xs font-bold tracking-tight text-white flex items-center gap-1">
                <span>Ask Paithan AI</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </div>
              <div className="text-[10px] text-amber-200/80 font-medium leading-none">
                नागरिक AI सहाय्यक
              </div>
            </div>
          </button>
        ) : (
          <div className="flex flex-col items-end">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Chatbot"
              className="mb-2 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center shadow-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-[94vw] sm:w-[420px] max-w-[450px] shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
              <ChatInterface fullPage={false} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
