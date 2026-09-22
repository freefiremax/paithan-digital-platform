"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";


import Link from "next/link";
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw, 
  ExternalLink, 
  ShieldCheck, 
  HelpCircle,
  Building2,
  Clock,
  Compass,
  PhoneCall
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ title: string; url: string }>;
  engine?: string;
  timestamp: string;
}

const PROMPT_SUGGESTIONS = [
  {
    en: "What are Paithan Municipal Council's office hours and contact numbers?",
    mr: "पैठण नगर परिषदेची कार्यालयीन वेळ आणि संपर्क क्रमांक काय आहेत?",
    category: "Civic",
    icon: Building2,
  },
  {
    en: "Tell me about Sant Eknath Maharaj Samadhi Mandir and Paithani sarees.",
    mr: "संत एकनाथ महाराज समाधी मंदिर आणि पैठणी साडीबद्दल माहिती द्या.",
    category: "Heritage",
    icon: Compass,
  },
  {
    en: "Jayakwadi Dam and Nath Sagar Bird Sanctuary visiting timings?",
    mr: "जायकवाडी धरण आणि नाथसागर पक्षी अभयारण्य भेटीची वेळ काय आहे?",
    category: "Tourism",
    icon: Clock,
  },
  {
    en: "What are the emergency numbers for Paithan Fire, Police, and Hospital?",
    mr: "पैठण अग्निशामक, पोलीस आणि रुग्णालय आपत्कालीन क्रमांक कोणते?",
    category: "Emergency",
    icon: PhoneCall,
  },
];

export function ChatInterface({ fullPage = false }: { fullPage?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content:
        "Namaskar! I am the AI Citizen & Pilgrim Assistant for Paithan Municipal Council (पैठण नगर परिषद). How can I assist you with municipal services, pilgrimage information, Jayakwadi tourism, or heritage archives today?",
      timestamp: "10:00 AM",
      sources: [
        { title: "Paithan Municipal Council Directory", url: "/nagar-parishad" },
        { title: "Tourism & Heritage Guide", url: "/tourism" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<"en" | "mr">("en");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(1);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = useCallback(
    async (textToSend?: string) => {
      const query = (textToSend || input).trim();
      if (!query || isLoading) return;

      messageCounterRef.current += 1;
      const userMsgId = `user-${messageCounterRef.current}`;
      const userMessage: Message = {
        id: userMsgId,
        role: "user",
        content: query,
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, userMessage]);
      if (!textToSend) setInput("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: query,
            language,
            history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        const data = await response.json();

        messageCounterRef.current += 1;
        const assistantMessage: Message = {
          id: `assistant-${messageCounterRef.current}`,
          role: "assistant",
          content: data.reply || "Sorry, I could not process your query at this moment.",
          sources: data.sources || [],
          engine: data.engine || "rag-verified-local",
          timestamp: "Just now",
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        messageCounterRef.current += 1;
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${messageCounterRef.current}`,
            role: "assistant",
            content:
              "A temporary network error occurred. Please contact Paithan Municipal Council helpline at 02431-223010.",
            timestamp: "Just now",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, language, messages]
  );

  const handleReset = () => {

    setMessages([
      {
        id: "welcome-msg",
        role: "assistant",
        content:
          language === "mr"
            ? "नमस्कार! मी पैठण नगर परिषदेचा AI नागरिक सहाय्यक आहे. मी आपणास पालिका सेवा, तीर्थक्षेत्र दर्शन, जायकवाडी पर्यटन किंवा वारसा माहितीबद्दल कशी मदत करू शकतो?"
            : "Namaskar! I am the AI Citizen & Pilgrim Assistant for Paithan Municipal Council (पैठण नगर परिषद). How can I assist you with municipal services, pilgrimage information, Jayakwadi tourism, or heritage archives today?",
        timestamp: "10:00 AM",
        sources: [
          { title: "Paithan Municipal Council Directory", url: "/nagar-parishad" },
          { title: "Tourism & Heritage Guide", url: "/tourism" },
        ],
      },
    ]);
  };


  return (
    <div
      className={`flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden ${
        fullPage ? "h-[750px] max-h-[85vh] w-full" : "h-[560px] w-full"
      }`}
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-[#071224] to-[#0C1E3C] text-white px-5 py-4 flex items-center justify-between border-b border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-base tracking-wide text-white">
                {language === "mr" ? "पैठण AI नागरिक सहाय्यक" : "Paithan AI Assistant"}
              </h2>
              <span className="flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-300 font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Civic RAG
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {language === "mr"
                ? "अधिकृत पालिका व पर्यटन माहिती प्रणाली"
                : "Official Municipal & Cultural Knowledge Base"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 text-xs font-semibold rounded ${
                language === "en" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("mr")}
              className={`px-2 py-1 text-xs font-semibold rounded ${
                language === "mr" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
              }`}
            >
              मराठी
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset conversation"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#0C1E3C] text-white rounded-br-none"
                  : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pratishthana Knowledge Base</span>
                </div>
              )}

              <div className="whitespace-pre-line">{msg.content}</div>

              {/* Grounded Source Citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Sources:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((src, i) => (
                      <Link
                        key={i}
                        href={src.url}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/70 px-2 py-0.5 rounded transition"
                      >
                        <span>{src.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm rounded-bl-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="text-xs text-slate-500 font-medium">
                {language === "mr"
                  ? "माहिती शोधत आहे..."
                  : "Retrieving official council records..."}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pill Deck (when starting or after reset) */}
      {messages.length <= 2 && (
        <div className="px-4 py-2.5 bg-amber-50/50 border-t border-slate-100">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 mb-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === "mr" ? "नेहमी विचारले जाणारे प्रश्न:" : "Popular Citizen Queries:"}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_SUGGESTIONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(language === "mr" ? item.mr : item.en)}
                  className="text-left text-xs bg-white hover:bg-amber-100/60 border border-slate-200 hover:border-amber-400 text-slate-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Icon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate max-w-[240px] sm:max-w-xs">
                    {language === "mr" ? item.mr : item.en}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Tray */}
      <div className="p-3.5 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === "mr"
                ? "पैठण पालिका, कर, पाणीपुरवठा, पर्यटन विषयी विचारा..."
                : "Ask about municipal services, water supply, tax, pilgrimage..."
            }
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-[#0C1E3C] hover:bg-[#071224] disabled:opacity-40 disabled:hover:bg-[#0C1E3C] text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-1.5 shadow-sm transition shrink-0"
          >
            <span>{language === "mr" ? "पाठवा" : "Send"}</span>
            <Send className="w-4 h-4 text-amber-400" />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-600 mt-2">
          Grounded with verified Paithan Municipal Council records (Est. 1854). Not a replacement for emergency 112 / 108.
        </p>
      </div>
    </div>
  );
}
