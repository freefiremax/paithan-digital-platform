"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, CheckCircle, Loader2, Shield } from "lucide-react";

interface GrievanceFormProps {
  locale: "en" | "mr" | "hi";
  messages: Record<string, string>;
}

const SECTOR_OPTIONS = [
  { value: "ROADS_TRANSPORT", labelKey: "sectorRoads" },
  { value: "WATER_SANITATION", labelKey: "sectorWater" },
  { value: "EDUCATION", labelKey: "sectorEducation" },
  { value: "HEALTH", labelKey: "sectorHealth" },
  { value: "OTHER_CIVIC_WORKS", labelKey: "sectorOther" },
];

export function GrievanceForm({ }: GrievanceFormProps) {
  const t = useTranslations("grievance");

  const [step, setStep] = useState<"form" | "success">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketNo, setTicketNo] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    sector: "",
    wardId: "",
    title: "",
    description: "",
    citizenName: "",
    citizenPhone: "",
    citizenEmail: "",
    turnstileToken: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    switch (name) {
      case "sector":
        if (!value) newErrors.sector = t("errorRequired");
        break;
      case "title":
        if (!value.trim()) newErrors.title = t("errorRequired");
        else if (value.length > 200) newErrors.title = t("errorMaxLength", { max: 200 });
        break;
      case "description":
        if (!value.trim()) newErrors.description = t("errorRequired");
        else if (value.length > 5000) newErrors.description = t("errorMaxLength", { max: 5000 });
        break;
      case "citizenName":
        if (!value.trim()) newErrors.citizenName = t("errorRequired");
        else if (value.length > 100) newErrors.citizenName = t("errorMaxLength", { max: 100 });
        break;
      case "citizenPhone":
        if (!value.trim()) newErrors.citizenPhone = t("errorRequired");
        else if (!/^[\d\s\-\+\(\)]{10,15}$/.test(value)) newErrors.citizenPhone = t("errorInvalidPhone");
        break;
      case "citizenEmail":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.citizenEmail = t("errorInvalidEmail");
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const newErrors: Record<string, string> = {};
    if (!formData.sector) newErrors.sector = t("errorRequired");
    if (!formData.title.trim()) newErrors.title = t("errorRequired");
    if (!formData.description.trim()) newErrors.description = t("errorRequired");
    if (!formData.citizenName.trim()) newErrors.citizenName = t("errorRequired");
    if (!formData.citizenPhone.trim()) newErrors.citizenPhone = t("errorRequired");
    else if (!/^[\d\s\-\+\(\)]{10,15}$/.test(formData.citizenPhone)) newErrors.citizenPhone = t("errorInvalidPhone");
    if (formData.citizenEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.citizenEmail)) newErrors.citizenEmail = t("errorInvalidEmail");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || t("submitError"));
      }

      setTicketNo(data.ticketNo);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("submitError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewGrievance = () => {
    setFormData({
      sector: "",
      wardId: "",
      title: "",
      description: "",
      citizenName: "",
      citizenPhone: "",
      citizenEmail: "",
      turnstileToken: "",
    });
    setErrors({});
    setStep("form");
    setTicketNo(null);
  };

  if (step === "success") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">{t("successTitle")}</h1>
          <p className="text-slate-600 mb-6">{t("successMessage")}</p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-amber-800 font-semibold">{t("ticketNumber")}</p>
            <p className="text-2xl font-mono font-bold text-amber-700 tracking-wider select-all">{ticketNo}</p>
            <p className="text-xs text-amber-600 mt-2">{t("ticketNote")}</p>
          </div>
          <button
            onClick={handleNewGrievance}
            className="inline-flex items-center justify-center gap-2 bg-[var(--vangi-850)] hover:bg-[var(--vangi-950)] text-white px-6 py-3 rounded-lg font-medium transition"
          >
            {t("submitAnother")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t("submitTitle")}</h1>
          <p className="text-slate-600 mt-2">{t("submitSubtitle")}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700" role="alert">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="sector" className="block text-sm font-medium text-slate-700 mb-2">
              {t("sectorLabel")} <span className="text-red-500">*</span>
            </label>
            <select
              id="sector"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition ${
                errors.sector ? "border-red-500" : "border-slate-300"
              }`}
              aria-invalid={errors.sector ? "true" : "false"}
              aria-describedby={errors.sector ? "sector-error" : undefined}
            >
              <option value="">{t("sectorPlaceholder")}</option>
              {SECTOR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
            {errors.sector && <p id="sector-error" className="mt-1 text-sm text-red-600" role="alert">{errors.sector}</p>}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
              {t("titleLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={200}
              className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition ${
                errors.title ? "border-red-500" : "border-slate-300"
              }`}
              aria-invalid={errors.title ? "true" : "false"}
              aria-describedby={errors.title ? "title-error" : undefined}
              placeholder={t("titlePlaceholder")}
            />
            {errors.title && <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">{errors.title}</p>}
            <p className="mt-1 text-xs text-slate-500">{formData.title.length}/200</p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              {t("descriptionLabel")} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              maxLength={5000}
              className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition ${
                errors.description ? "border-red-500" : "border-slate-300"
              }`}
              aria-invalid={errors.description ? "true" : "false"}
              aria-describedby={errors.description ? "description-error" : undefined}
              placeholder={t("descriptionPlaceholder")}
            />
            {errors.description && <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">{errors.description}</p>}
            <p className="mt-1 text-xs text-slate-500">{formData.description.length}/5000</p>
          </div>

          <fieldset className="space-y-4 border-t border-slate-200 pt-6">
            <legend className="text-lg font-semibold text-slate-900">{t("citizenInfoTitle")}</legend>
            <p className="text-sm text-slate-600">{t("citizenInfoNote")}</p>

            <div>
              <label htmlFor="citizenName" className="block text-sm font-medium text-slate-700 mb-2">
                {t("nameLabel")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="citizenName"
                name="citizenName"
                value={formData.citizenName}
                onChange={handleChange}
                maxLength={100}
                className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition ${
                  errors.citizenName ? "border-red-500" : "border-slate-300"
                }`}
                aria-invalid={errors.citizenName ? "true" : "false"}
                aria-describedby={errors.citizenName ? "name-error" : undefined}
                placeholder={t("namePlaceholder")}
              />
              {errors.citizenName && <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">{errors.citizenName}</p>}
            </div>

            <div>
              <label htmlFor="citizenPhone" className="block text-sm font-medium text-slate-700 mb-2">
                {t("phoneLabel")} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="citizenPhone"
                name="citizenPhone"
                value={formData.citizenPhone}
                onChange={handleChange}
                maxLength={15}
                className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition ${
                  errors.citizenPhone ? "border-red-500" : "border-slate-300"
                }`}
                aria-invalid={errors.citizenPhone ? "true" : "false"}
                aria-describedby={errors.citizenPhone ? "phone-error" : undefined}
                placeholder={t("phonePlaceholder")}
              />
              {errors.citizenPhone && <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">{errors.citizenPhone}</p>}
            </div>

            <div>
              <label htmlFor="citizenEmail" className="block text-sm font-medium text-slate-700 mb-2">
                {t("emailLabel")}
              </label>
              <input
                type="email"
                id="citizenEmail"
                name="citizenEmail"
                value={formData.citizenEmail}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition ${
                  errors.citizenEmail ? "border-red-500" : "border-slate-300"
                }`}
                aria-invalid={errors.citizenEmail ? "true" : "false"}
                aria-describedby={errors.citizenEmail ? "email-error" : undefined}
                placeholder={t("emailPlaceholder")}
              />
              {errors.citizenEmail && <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">{errors.citizenEmail}</p>}
            </div>
          </fieldset>

          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">{t("turnstileLabel")}</p>
                <p className="text-sm text-slate-600">{t("turnstileNote")}</p>
                <div id="turnstile-container" className="mt-3" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--vangi-850)] hover:bg-[var(--vangi-950)] disabled:opacity-50 disabled:hover:bg-[var(--vangi-850)] text-white py-3 px-6 rounded-lg font-medium text-base flex items-center justify-center gap-2 transition"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              t("submitBtn")
            )}
          </button>

          <p className="text-center text-xs text-slate-500">
            {t("disclaimer")}
          </p>
        </form>
      </div>
    </div>
  );
}