"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Phone, Shield, HeartPulse, Flame, AlertTriangle, HelpCircle } from "lucide-react";

interface HelplinesProps {
  locale: "en" | "mr" | "hi";
  messages: Record<string, string>;
}

const NATIONAL_HELPLINES = [
  { key: "police", labelKey: "helplinePolice", number: "112 / 100", icon: Shield, color: "bg-blue-100 text-blue-700" },
  { key: "fire", labelKey: "helplineFire", number: "101", icon: Flame, color: "bg-red-100 text-red-700" },
  { key: "ambulance", labelKey: "helplineAmbulance", number: "108", icon: HeartPulse, color: "bg-emerald-100 text-emerald-700" },
  { key: "disaster", labelKey: "helplineDisaster", number: "1077", icon: AlertTriangle, color: "bg-amber-100 text-amber-700" },
  { key: "women", labelKey: "helplineWomen", number: "181", icon: HelpCircle, color: "bg-pink-100 text-pink-700" },
  { key: "child", labelKey: "helplineChild", number: "1098", icon: HelpCircle, color: "bg-violet-100 text-violet-700" },
];

const LOCAL_HELPLINES = [
  { key: "municipal", labelKey: "helplineMunicipal", number: "02431-223010", icon: Phone, color: "bg-slate-100 text-slate-700", noteKey: "helplineMunicipalNote" },
  { key: "water", labelKey: "helplineWater", number: "02431-223015", icon: Phone, color: "bg-slate-100 text-slate-700", noteKey: "helplineWaterNote" },
  { key: "policeLocal", labelKey: "helplinePoliceLocal", number: "02431-223033", icon: Phone, color: "bg-slate-100 text-slate-700", noteKey: "helplinePoliceLocalNote" },
  { key: "hospital", labelKey: "helplineHospital", number: "02431-223040", icon: Phone, color: "bg-slate-100 text-slate-700", noteKey: "helplineHospitalNote" },
];

export function Helplines() {
  const t = useTranslations("contact");

  return (
    <section aria-labelledby="helplines-heading" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <h2 id="helplines-heading" className="text-2xl font-bold text-slate-900 mb-6">{t("helplinesTitle")}</h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">{t("nationalHelplinesTitle")}</h3>
        <p className="text-sm text-slate-600 mb-4">{t("nationalHelplinesNote")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NATIONAL_HELPLINES.map((helpline) => (
            <a
              key={helpline.key}
              href={`tel:${helpline.number.split("/")[0].trim()}`}
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition"
            >
              <div className={`p-3 rounded-lg ${helpline.color}`}>
                <helpline.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{t(helpline.labelKey)}</p>
                <p className="text-sm font-mono text-slate-600">{helpline.number}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">{t("localHelplinesTitle")}</h3>
        <p className="text-sm text-slate-600 mb-4">{t("localHelplinesNote")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LOCAL_HELPLINES.map((helpline) => (
            <div key={helpline.key} className="p-4 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${helpline.color}`}>
                  <helpline.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{t(helpline.labelKey)}</p>
                  <a
                    href={`tel:${helpline.number}`}
                    className="text-sm font-mono text-slate-600 hover:text-[var(--saffron-600)]"
                  >
                    {helpline.number}
                  </a>
                </div>
              </div>
              {helpline.noteKey && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                  ⚠️ {t(helpline.noteKey)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <p className="text-sm text-slate-600 text-center">{t("helplinesDisclaimer")}</p>
      </div>
    </section>
  );
}