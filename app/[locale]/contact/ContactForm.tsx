"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";

interface ContactFormProps {
  locale?: "en" | "mr" | "hi";
}

const SUBJECT_OPTIONS = [
  { value: "general", labelKey: "subjectGeneral" },
  { value: "grievance", labelKey: "subjectGrievance" },
  { value: "service", labelKey: "subjectService" },
  { value: "suggestion", labelKey: "subjectSuggestion" },
  { value: "other", labelKey: "subjectOther" },
];

export function ContactForm({ locale: _locale }: ContactFormProps = {}) {
  const t = useTranslations("contact");

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    turnstileToken: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    switch (name) {
      case "name":
        if (!value.trim()) newErrors.name = t("errorRequired");
        else if (value.length > 100) newErrors.name = t("errorMaxLength", { max: 100 });
        break;
      case "email":
        if (!value.trim()) newErrors.email = t("errorRequired");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = t("errorInvalidEmail");
        break;
      case "phone":
        if (value && !/^[\d\s\-\+\(\)]{10,15}$/.test(value)) newErrors.phone = t("errorInvalidPhone");
        break;
      case "subject":
        if (!value) newErrors.subject = t("errorRequired");
        break;
      case "message":
        if (!value.trim()) newErrors.message = t("errorRequired");
        else if (value.length > 5000) newErrors.message = t("errorMaxLength", { max: 5000 });
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
    setStatus("idle");

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t("errorRequired");
    if (!formData.email.trim()) newErrors.email = t("errorRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t("errorInvalidEmail");
    if (formData.phone && !/^[\d\s\-\+\(\)]{10,15}$/.test(formData.phone)) newErrors.phone = t("errorInvalidPhone");
    if (!formData.subject) newErrors.subject = t("errorRequired");
    if (!formData.message.trim()) newErrors.message = t("errorRequired");
    else if (formData.message.length > 5000) newErrors.message = t("errorMaxLength", { max: 5000 });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || t("submitError"));
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        turnstileToken: "",
      });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : t("submitError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
          <p className="text-slate-600 mt-2">{t("subtitle")}</p>
        </div>

        {status === "success" && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3 text-emerald-700" role="alert">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{t("successMessage")}</p>
          </div>
        )}

        {status === "error" && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700" role="alert">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error || t("submitError")}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              {t("nameLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
              className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition ${
                errors.name ? "border-red-500" : "border-slate-300"
              }`}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
              placeholder={t("namePlaceholder")}
            />
            {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              {t("emailLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition ${
                errors.email ? "border-red-500" : "border-slate-300"
              }`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              placeholder={t("emailPlaceholder")}
            />
            {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
              {t("phoneLabel")}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={15}
              className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition ${
                errors.phone ? "border-red-500" : "border-slate-300"
              }`}
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              placeholder={t("phonePlaceholder")}
            />
            {errors.phone && <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
              {t("subjectLabel")} <span className="text-red-500">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition ${
                errors.subject ? "border-red-500" : "border-slate-300"
              }`}
              aria-invalid={errors.subject ? "true" : "false"}
              aria-describedby={errors.subject ? "subject-error" : undefined}
            >
              <option value="">{t("subjectPlaceholder")}</option>
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
            {errors.subject && <p id="subject-error" className="mt-1 text-sm text-red-600" role="alert">{errors.subject}</p>}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
              {t("messageLabel")} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              maxLength={5000}
              className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition ${
                errors.message ? "border-red-500" : "border-slate-300"
              }`}
              aria-invalid={errors.message ? "true" : "false"}
              aria-describedby={errors.message ? "message-error" : undefined}
              placeholder={t("messagePlaceholder")}
            />
            {errors.message && <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">{errors.message}</p>}
            <p className="mt-1 text-xs text-slate-500">{formData.message.length}/5000</p>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
              <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-slate-900">{t("turnstileLabel")}</p>
                <p className="text-sm text-slate-600 mb-2">{t("turnstileNote")}</p>
                <TurnstileWidget
                  onVerify={(token) => {
                    setFormData((prev) => ({ ...prev, turnstileToken: token }));
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.turnstileToken;
                      return next;
                    });
                  }}
                />
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
              <>
                {t("submitBtn")}
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}