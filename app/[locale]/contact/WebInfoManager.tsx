"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { User, Mail, Phone, Building2, AlertTriangle } from "lucide-react";

interface WebInfoManagerProps {
  locale: "en" | "mr" | "hi";
  messages: Record<string, string>;
}

export function WebInfoManager(_props: WebInfoManagerProps) {
  const t = useTranslations("contact");

  return (
    <section aria-labelledby="wim-heading" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <h2 id="wim-heading" className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Building2 className="w-6 h-6 text-[var(--saffron-600)]" />
        {t("webInfoManagerTitle")}
      </h2>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
        <p className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {t("webInfoManagerPlaceholder")}
        </p>
        <p className="text-amber-700 mb-4">{t("webInfoManagerNote")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-[var(--saffron-600)]" />
            {t("webInfoManagerName")}
          </h3>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-500 w-32">{t("webInfoManagerFieldName")}:</span>
              <span className="text-amber-600">[To be appointed]</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-500 w-32">{t("webInfoManagerFieldDesignation")}:</span>
              <span className="text-amber-600">[Web Information Manager]</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-500 w-32">{t("webInfoManagerFieldDepartment")}:</span>
              <span className="text-amber-600">[Paithan Municipal Council]</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[var(--saffron-600)]" />
            {t("webInfoManagerContact")}
          </h3>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-500 w-32">{t("webInfoManagerFieldEmail")}:</span>
              <span className="text-amber-600">[wim@paithan.gov.in]</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-500 w-32">{t("webInfoManagerFieldPhone")}:</span>
              <span className="text-amber-600">[02431-223010 Ext. XX]</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-500 w-32">{t("webInfoManagerFieldAddress")}:</span>
              <span className="text-amber-600">[Municipal Council Office, Main Road, Paithan]</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-sm text-slate-600 text-center">{t("webInfoManagerLegalNote")}</p>
      </div>
    </section>
  );
}