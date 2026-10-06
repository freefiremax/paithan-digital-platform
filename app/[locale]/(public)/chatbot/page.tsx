"use client";

import React from "react";
import Link from "next/link";
import { ChatInterface } from "@/components/chatbot/ChatInterface";
import { useTranslations } from "next-intl";
import { 
  Bot, 
  ShieldCheck, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  ExternalLink 
} from "lucide-react";

export default function ChatbotPage() {
  const t = useTranslations("chatbot");
  const tHome = useTranslations("home");
  const tNav = useTranslations("nav");
  const tHeader = useTranslations("header");

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
              <Bot className="w-4 h-4" />
              <span>{t("civicAi")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1E3C] tracking-tight">
              {t("title")}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {t("subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t("disclaimer")}</span>
            </span>
          </div>
        </div>

        {/* Main Grid: Left Chatbot (8 cols), Right Council Info Panel (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Chat Interface */}
          <div className="lg:col-span-8">
            <ChatInterface fullPage={true} />
          </div>

          {/* Right Column: Grounding & Verification Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Grounding Scope Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h2 className="font-bold text-slate-900 text-base">{t("sourcesTitle")}</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("disclaimer")}
              </p>

              <ul className="mt-3 space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span><strong>{tNav("wards")}:</strong> {tHome("wardsOverviewSubtitle")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span><strong>{tNav("heritageSites")}:</strong> {tHome("wingHeritageBlurb")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span><strong>{tNav("tourismPlaces")}:</strong> {tHome("wingTourismBlurb")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span><strong>{tNav("culturalHeritage")}:</strong> {tHome("wingHeritageFacts")}</span>
                </li>
              </ul>
            </div>

            {/* Direct Official Escalation Card */}
            <div className="bg-gradient-to-br from-[#0C1E3C] to-[#071224] text-white rounded-2xl p-6 border border-amber-500/20 shadow-lg">
              <h2 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                <Building2Icon className="w-4 h-4 text-amber-400" />
                <span>{tHome("councilPanelTitle")}</span>
              </h2>
              <p className="text-xs text-slate-300 mb-4">
                {tHome("councilPanelSubtitle")}
              </p>

              <div className="space-y-3 text-xs text-slate-200">
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-400">{tHome("vitalsControlRoom")}</div>
                    <a href="tel:02431223010" className="font-semibold text-white hover:text-amber-300">
                      02431-223010
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-400">{tHeader("district")}</div>
                    <span>{tHome("councilPanelSubtitle")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs">
                <Link
                  href="/nagar-parishad"
                  className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
                >
                  <span>{tNav("nagarParishad")}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <Link
                  href="/nagar-parishad/development-works"
                  className="text-slate-300 hover:text-white font-medium inline-flex items-center gap-1"
                >
                  <span>{tNav("developmentWorks")}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Quick Emergency Call Buttons */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="text-xs font-bold text-red-900 mb-2 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                <span>{tHome("emergencyControl")}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <a
                  href="tel:112"
                  className="bg-white border border-red-200 text-red-800 font-bold py-2 rounded-xl text-xs hover:bg-red-100/60 transition shadow-2xs"
                >
                  Police: 112
                </a>
                <a
                  href="tel:108"
                  className="bg-white border border-red-200 text-red-800 font-bold py-2 rounded-xl text-xs hover:bg-red-100/60 transition shadow-2xs"
                >
                  Ambulance: 108
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Building2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
