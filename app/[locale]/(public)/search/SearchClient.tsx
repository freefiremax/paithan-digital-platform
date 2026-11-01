"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Search, X, FileText, Building2, Landmark, Compass, Clock, Sparkles } from "lucide-react";

interface SearchPageProps {
  locale: "en" | "mr" | "hi";
}

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  sector: Building2,
  "development-work": FileText,
  notice: FileText,
  "tourist-place": Compass,
  heritage: Landmark,
  museum: Landmark,
  history: Clock,
};

const TYPE_LABELS: Record<string, string> = {
  sector: "searchTypeSector",
  "development-work": "searchTypeWork",
  notice: "searchTypeNotice",
  "tourist-place": "searchTypePlace",
  heritage: "searchTypeHeritage",
  museum: "searchTypeMuseum",
  history: "searchTypeHistory",
};

export function SearchClient({ locale }: SearchPageProps) {
  const t = useTranslations("search");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<Array<{
    type: string;
    id: string;
    title: string;
    titleMr?: string | null;
    description?: string | null;
    descriptionMr?: string | null;
    url: string;
    category?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || t("searchError"));
      }

      setResults(data.results || []);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("searchError"));
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [locale, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      performSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    router.push("/search");
  };

  const getResultTitle = (result: typeof results[0]) => {
    if (locale === "mr" && result.titleMr) return result.titleMr;
    return result.title;
  };

  const getResultDescription = (result: typeof results[0]) => {
    if (locale === "mr" && result.descriptionMr) return result.descriptionMr;
    return result.description;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{t("title")}</h1>
        <p className="text-slate-600 mt-2">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="relative mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className="w-full pl-12 pr-12 py-4 text-lg border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
            autoFocus
            autoComplete="off"
            aria-label={t("searchLabel")}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              aria-label={t("clearSearch")}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {query.length > 0 && query.length < 2 && (
          <p className="mt-2 text-sm text-amber-600">{t("minChars")}</p>
        )}
      </form>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
          {error}
        </div>
      )}

      {showResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">
              {t("resultsCount", { count: results.length })}
            </p>
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
                {t("searching")}
              </div>
            )}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-lg">{t("noResults")}</p>
              <p className="text-sm mt-1">{t("noResultsHint")}</p>
            </div>
          ) : (
            <ul className="space-y-3" role="list">
              {results.map((result) => {
                const Icon = TYPE_ICONS[result.type] || FileText;
                return (
                  <li key={`${result.type}-${result.id}`}>
                    <Link
                      href={result.url}
                      className="block p-4 border border-slate-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900 truncate">{getResultTitle(result)}</h3>
                            <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full whitespace-nowrap">
                              {t(TYPE_LABELS[result.type] || result.type)}
                            </span>
                          </div>
                          {getResultDescription(result) && (
                            <p className="text-sm text-slate-600 line-clamp-2">{getResultDescription(result)}</p>
                          )}
                          {result.category && (
                            <p className="text-xs text-slate-400 mt-1">{result.category}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {!showResults && !query && (
        <div className="text-center py-12 text-slate-500">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-amber-300" />
          <p className="text-lg">{t("startSearch")}</p>
          <p className="text-sm mt-1">{t("startSearchHint")}</p>
        </div>
      )}
    </div>
  );
}