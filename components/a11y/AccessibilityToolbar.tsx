"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Minus, Plus, Sun, Moon, RefreshCw, RotateCcw } from "lucide-react";

type A11ySettings = {
  fontSize: number;
  highContrast: boolean;
};

const STORAGE_KEY = "paithan-a11y-settings";
const DEFAULT_SETTINGS: A11ySettings = { fontSize: 100, highContrast: false };

function applySettingsToDom(settings: A11ySettings) {
  const root = document.documentElement;
  root.style.fontSize = `${settings.fontSize}%`;
  if (settings.highContrast) {
    root.classList.add("high-contrast");
  } else {
    root.classList.remove("high-contrast");
  }
}

function loadSettings(): A11ySettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_SETTINGS;
}

export function AccessibilityToolbar() {
  const t = useTranslations("a11y");
  const [settings, setSettings] = useState<A11ySettings>(() => loadSettings());

  // Apply settings on mount and when settings change
  useEffect(() => {
    applySettingsToDom(settings);
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<A11ySettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  }, [settings]);

  const increaseFont = () => updateSettings({ fontSize: Math.min(settings.fontSize + 25, 200) });
  const decreaseFont = () => updateSettings({ fontSize: Math.max(settings.fontSize - 25, 75) });
  const resetFont = () => updateSettings({ fontSize: 100 });
  const toggleContrast = () => updateSettings({ highContrast: !settings.highContrast });
  const resetAll = () => {
    updateSettings(DEFAULT_SETTINGS);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--saffron-600)] focus:text-white focus:rounded-lg focus:font-medium focus:outline-none focus:ring-2 focus:ring-[var(--saffron-500)] focus:ring-offset-2"
      >
        {t("skipToContent")}
      </a>

      <div
        className="fixed bottom-4 right-4 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-3 sm:p-4 flex flex-col gap-2"
        role="region"
        aria-label={t("toolbarLabel")}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">{t("toolbarTitle")}</h3>
          <button
            onClick={resetAll}
            className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            aria-label={t("resetAll")}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-200 pt-2">
          <button
            onClick={decreaseFont}
            disabled={settings.fontSize <= 75}
            className="p-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label={t("decreaseFont")}
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-sm font-mono text-slate-900 min-w-[3rem] text-center">
            {settings.fontSize}%
          </span>
          <button
            onClick={increaseFont}
            disabled={settings.fontSize >= 200}
            className="p-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label={t("increaseFont")}
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={resetFont}
            className="ml-1 p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            aria-label={t("resetFont")}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-2">
          <span className="text-sm text-slate-700">{t("highContrast")}</span>
          <button
            onClick={toggleContrast}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.highContrast
                ? "bg-[var(--saffron-600)]"
                : "bg-slate-300"
            }`}
            role="switch"
            aria-checked={settings.highContrast}
            aria-label={t("highContrast")}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                settings.highContrast ? "translate-x-6" : "translate-x-1"
              }`}
            >
              {settings.highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        html.high-contrast {
          filter: contrast(150%);
        }
        html.high-contrast * {
          border-color: currentColor !important;
        }
        html.high-contrast a {
          text-decoration: underline !important;
        }
        html.high-contrast button,
        html.high-contrast input,
        html.high-contrast select,
        html.high-contrast textarea {
          border: 2px solid currentColor !important;
        }
      `}</style>
    </>
  );
}