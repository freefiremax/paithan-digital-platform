'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  Search,
  X,
  FileText,
  Building2,
  Landmark,
  Compass,
  AlertCircle,
  Receipt,
  FileCheck2,
  Users,
  MapPin,
  ArrowRight,
  Loader2,
  Layers,
  ChevronRight,
} from 'lucide-react';
import type { Locale } from '@/i18n';

interface SearchResultItem {
  type: string;
  id: string;
  title: string;
  titleMr?: string | null;
  description?: string | null;
  descriptionMr?: string | null;
  url: string;
  category?: string;
}

interface CivicShortcut {
  id: string;
  titleEn: string;
  titleMr: string;
  titleHi: string;
  descEn: string;
  descMr: string;
  descHi: string;
  categoryKey: 'categoryServices' | 'categoryCouncil' | 'categoryGrievance' | 'categoryTourism' | 'categoryNotices';
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

const CIVIC_SHORTCUTS: CivicShortcut[] = [
  {
    id: 'prop-tax',
    titleEn: 'Property Tax Online Payment',
    titleMr: 'मालमत्ता कर ऑनलाइन भरणा',
    titleHi: 'संपत्ति कर ऑनलाइन भुगतान',
    descEn: 'Assessment, bill lookup & digital receipt',
    descMr: 'कर आकारणी, देयक तपासणी व पावती',
    descHi: 'कर निर्धारण, बिल जांच व रसीद',
    categoryKey: 'categoryServices',
    url: '/services/taxation',
    icon: Receipt,
    tags: ['tax', 'property', 'house', 'taxation', 'कर', 'मालमत्ता', 'घरपट्टी', 'संपत्ति'],
  },
  {
    id: 'water-tax',
    titleEn: 'Water Tax & New Connection',
    titleMr: 'पाणीपट्टी व नवीन नळ जोडणी',
    titleHi: 'जल कर एवं नया नल कनेक्शन',
    descEn: 'Water supply billing & pipeline services',
    descMr: 'पाणी पुरवठा देयक व पाईपलाईन सेवा',
    descHi: 'जल आपूर्ति बिल व पाइपलाइन सेवाएं',
    categoryKey: 'categoryServices',
    url: '/services/water-supply',
    icon: Receipt,
    tags: ['water', 'tap', 'connection', 'पाणी', 'नळ', 'पाणीपट्टी', 'जल', 'नल'],
  },
  {
    id: 'certificates',
    titleEn: 'Birth & Death Certificates',
    titleMr: 'जन्म व मृत्यू दाखला अर्ज',
    titleHi: 'जन्म एवं मृत्यु प्रमाण पत्र',
    descEn: 'Civil registration & digital verification',
    descMr: 'नागरी नोंदणी व डिजिटल प्रमाणपत्र',
    descHi: 'नागरिक पंजीकरण एवं डिजिटल प्रमाण पत्र',
    categoryKey: 'categoryServices',
    url: '/services/civil-registration',
    icon: FileCheck2,
    tags: ['birth', 'death', 'certificate', 'marriage', 'जन्म', 'मृत्यू', 'दाखला', 'प्रमाणपत्र'],
  },
  {
    id: 'trade-license',
    titleEn: 'Trade License & Commercial NOC',
    titleMr: 'व्यवसाय परवाना व नाहरकत प्रमाणपत्र',
    titleHi: 'व्यापार लाइसेंस एवं अनापत्ति प्रमाण पत्र',
    descEn: 'Shop establishment and municipal clearance',
    descMr: 'दुकान आस्थापना व महापालिका परवानगी',
    descHi: 'दुकान स्थापना एवं पालिका अनापत्ति',
    categoryKey: 'categoryServices',
    url: '/services/trade-license',
    icon: Building2,
    tags: ['trade', 'license', 'shop', 'business', 'परवाना', 'दुकान', 'व्यवसाय', 'व्यापार'],
  },
  {
    id: 'grievance-new',
    titleEn: 'File a Citizen Grievance',
    titleMr: 'नागरी तक्रार दाखल करा',
    titleHi: 'नागरिक शिकायत दर्ज करें',
    descEn: 'Submit complaints across all 17 wards',
    descMr: 'सर्व १७ प्रभागांसाठी तक्रार नोंदवा',
    descHi: 'सभी १७ वार्डों के लिए शिकायत दर्ज करें',
    categoryKey: 'categoryGrievance',
    url: '/grievances/new',
    icon: AlertCircle,
    tags: ['grievance', 'complaint', 'problem', 'drainage', 'road', 'तक्रार', 'समस्या', 'ड्रेनेज', 'शिकायत'],
  },
  {
    id: 'grievance-track',
    titleEn: 'Track Grievance Status',
    titleMr: 'तक्रारीची सद्यस्थिती तपासा',
    titleHi: 'शिकायत की स्थिति जांचें',
    descEn: 'Live status with complaint ticket number',
    descMr: 'तक्रार क्रमांकाद्वारे थेट स्थिती',
    descHi: 'शिकायत नंबर द्वारा लाइव स्थिति',
    categoryKey: 'categoryGrievance',
    url: '/grievances/track',
    icon: AlertCircle,
    tags: ['track', 'status', 'ticket', 'तपासा', 'स्थिती', 'ट्रॅक', 'जांचें'],
  },
  {
    id: 'notices-tenders',
    titleEn: 'Official Notices & Tenders',
    titleMr: 'अधिकृत सूचना व ई-निविदा',
    titleHi: 'आधिकारिक सूचनाएं व ई-निविदाएं',
    descEn: 'Municipal procurement & public circulars',
    descMr: 'परिषद खरेदी व सार्वजनिक परिपत्रके',
    descHi: 'पालिका खरीद एवं सार्वजनिक परिपत्र',
    categoryKey: 'categoryNotices',
    url: '/nagar-parishad/notifications',
    icon: FileText,
    tags: ['tender', 'notice', 'circular', 'निविदा', 'सूचना', 'परिपत्रक', 'टेंडर'],
  },
  {
    id: 'ward-map',
    titleEn: '17 Wards Map & Corporators',
    titleMr: '१७ प्रभाग नकाशा व नगरसेवक यादी',
    titleHi: '१७ वार्ड नक्शा व पार्षद सूची',
    descEn: 'Ward boundaries, amenities & local representatives',
    descMr: 'प्रभाग सीमा, नागरी सुविधा व लोकप्रतिनिधी',
    descHi: 'वार्ड सीमाएं, नागरिक सुविधाएं व प्रतिनिधि',
    categoryKey: 'categoryCouncil',
    url: '/nagar-parishad/ward-map',
    icon: MapPin,
    tags: ['ward', 'map', 'corporator', 'nagar sevak', 'प्रभाग', 'नकाशा', 'नगरसेवक', 'वार्ड'],
  },
  {
    id: 'representatives',
    titleEn: 'Elected Representatives & Officers',
    titleMr: 'लोकप्रतिनिधी व प्रशासकीय अधिकारी',
    titleHi: 'जनप्रतिनिधि एवं प्रशासनिक अधिकारी',
    descEn: 'MLA, MP, Council President & Chief Officer',
    descMr: 'आमदार, खासदार, नगराध्यक्ष व मुख्याधिकारी',
    descHi: 'विधायक, सांसद, अध्यक्ष व मुख्याधिकारी',
    categoryKey: 'categoryCouncil',
    url: '/nagar-parishad/representatives',
    icon: Users,
    tags: ['mla', 'mp', 'officer', 'ceo', 'president', 'प्रतिनिधी', 'मुख्याधिकारी', 'नगराध्यक्ष'],
  },
  {
    id: 'development-works',
    titleEn: 'Development Works Register',
    titleMr: 'विकास कामे नोंदवही',
    titleHi: 'विकास कार्य रजिस्टर',
    descEn: 'Ward-wise civil works & scheme progress',
    descMr: 'प्रभागनिहाय विकासकामे व योजना प्रगती',
    descHi: 'वार्ड अनुसार विकास कार्य व योजना प्रगति',
    categoryKey: 'categoryCouncil',
    url: '/nagar-parishad/development-works',
    icon: Layers,
    tags: ['development', 'work', 'road', 'civil', 'विकास', 'कामे', 'रस्ते', 'कार्य'],
  },
  {
    id: 'jayakwadi-dam',
    titleEn: 'Jayakwadi Dam & Bird Sanctuary',
    titleMr: 'जायकवाडी धरण व पक्षी अभयारण्य',
    titleHi: 'जायकवाड़ी बांध एवं पक्षी अभयारण्य',
    descEn: 'Nath Sagar reservoir & tourism guide',
    descMr: 'नाथसागर जलाशय व पर्यटन माहिती',
    descHi: 'नाथसागर जलाशय व पर्यटन जानकारी',
    categoryKey: 'categoryTourism',
    url: '/tourism/jayakwadi',
    icon: Compass,
    tags: ['jayakwadi', 'dam', 'nath sagar', 'bird', 'धरण', 'जायकवाडी', 'नाथसागर', 'पक्षी'],
  },
  {
    id: 'museum-heritage',
    titleEn: 'Dr. Balasaheb Patil Museum & Artifacts',
    titleMr: 'डॉ. बाळासाहेब पाटील संग्रहालय व पुरातन अवशेष',
    titleHi: 'डॉ. बालासाहेब पाटिल संग्रहालय व पुरावशेष',
    descEn: 'Satavahana coins, 3D models & ancient history',
    descMr: 'सातवाहन नाणी, ३D मॉडेल्स व प्राचीन इतिहास',
    descHi: 'सातवाहन सिक्के, 3D मॉडल व प्राचीन इतिहास',
    categoryKey: 'categoryTourism',
    url: '/heritage/museum',
    icon: Landmark,
    tags: ['museum', 'satavahana', 'coins', 'heritage', 'संग्रहालय', 'सातवाहन', 'नाणी', 'वारसा', 'इतिहास'],
  },
];

export function HeaderGlobalSearch() {
  const tHeader = useTranslations('header');
  const tSearch = useTranslations('search');
  const locale = useLocale() as Locale;
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [apiResults, setApiResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        if (window.innerWidth < 1024) {
          setIsMobileModalOpen(true);
          setTimeout(() => mobileInputRef.current?.focus(), 100);
        } else {
          inputRef.current?.focus();
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setIsMobileModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdown on desktop
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch API results with debounce
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setApiResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`);
        if (res.ok) {
          const data = await res.json();
          setApiResults(data.results || []);
        } else {
          setApiResults([]);
        }
      } catch {
        setApiResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [query, locale]);

  // Filter local shortcuts
  const matchedShortcuts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return CIVIC_SHORTCUTS.slice(0, 6);
    }
    return CIVIC_SHORTCUTS.filter((item) => {
      const title = locale === 'mr' ? item.titleMr : locale === 'hi' ? item.titleHi : item.titleEn;
      const desc = locale === 'mr' ? item.descMr : locale === 'hi' ? item.descHi : item.descEn;
      return (
        title.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [query, locale]);

  const handleSelectLink = (url: string) => {
    setIsOpen(false);
    setIsMobileModalOpen(false);
    setQuery('');
    router.push(`/${locale}${url}`);
  };

  const getLocalizedShortcutTitle = (item: CivicShortcut) => {
    return locale === 'mr' ? item.titleMr : locale === 'hi' ? item.titleHi : item.titleEn;
  };

  const getLocalizedShortcutDesc = (item: CivicShortcut) => {
    return locale === 'mr' ? item.descMr : locale === 'hi' ? item.descHi : item.descEn;
  };

  const getLocalizedApiTitle = (item: SearchResultItem) => {
    if (locale === 'mr' && item.titleMr) return item.titleMr;
    return item.title;
  };

  const getLocalizedApiDesc = (item: SearchResultItem) => {
    if (locale === 'mr' && item.descriptionMr) return item.descriptionMr;
    return item.description || '';
  };

  return (
    <>
      {/* DESKTOP SEARCH BAR + SATYAMEVA JAYATE CONTAINER */}
      <div className="hidden lg:flex items-center gap-3.5 flex-1 max-w-[440px] xl:max-w-[500px]">
        {/* Search Input Box */}
        <div ref={containerRef} className="relative flex-1">
          <div
            className={`flex items-center gap-2.5 rounded-md border bg-slate-50/80 px-3.5 h-[44px] transition-all shadow-sm ${
              isOpen
                ? 'border-[var(--portal-blue-800)] bg-white ring-2 ring-[var(--portal-blue-800)]/15 shadow-md'
                : 'border-slate-300 hover:border-slate-400 hover:bg-white'
            }`}
          >
            <Search className="h-4 w-4 text-[var(--portal-blue-900)] shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={tHeader('searchPlaceholder')}
              aria-label={tSearch('searchLabel')}
              className="w-full bg-transparent text-[13px] font-medium text-[var(--civic-slate-900)] placeholder:text-slate-500 placeholder:font-normal focus:outline-none"
            />

            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-slate-400 shrink-0" />}

            {query && !isLoading && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                title={tSearch('clearSearch')}
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {!query && (
              <kbd className="inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500 shadow-2xs select-none shrink-0">
                {tHeader('searchShortcut')}
              </kbd>
            )}
          </div>

          {/* DROPDOWN RESULTS OVERLAY */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 max-h-[480px] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="sticky top-0 bg-slate-50/95 backdrop-blur px-3.5 py-2 border-b border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span>{query.trim() ? tSearch('title') : tSearch('quickSearches')}</span>
                <span className="text-[10px] text-slate-400">{tSearch('pressEscToClose')}</span>
              </div>

              {matchedShortcuts.length > 0 && (
                <div className="p-1.5">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {query.trim() ? tSearch('categoryServices') : tSearch('quickSearches')}
                  </div>
                  {matchedShortcuts.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectLink(item.url)}
                        className="w-full flex items-center gap-3 px-2.5 py-2 text-left rounded-md hover:bg-slate-100/80 transition-colors group cursor-pointer"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-[var(--portal-blue-50)] text-[var(--portal-blue-900)] group-hover:bg-[var(--portal-blue-800)] group-hover:text-white transition-colors shrink-0">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-800 group-hover:text-[var(--portal-blue-900)] truncate">
                            {getLocalizedShortcutTitle(item)}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {getLocalizedShortcutDesc(item)}
                          </div>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}

              {apiResults.length > 0 && (
                <div className="p-1.5 border-t border-slate-100">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {tSearch('resultsCount', { count: apiResults.length })}
                  </div>
                  {apiResults.slice(0, 8).map((res) => (
                    <button
                      key={`${res.type}-${res.id}`}
                      type="button"
                      onClick={() => handleSelectLink(res.url)}
                      className="w-full flex items-start gap-2.5 px-2.5 py-2 text-left rounded-md hover:bg-slate-100/80 transition-colors group cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5 text-slate-400 group-hover:text-[var(--portal-blue-800)] shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-800 group-hover:text-[var(--portal-blue-900)] line-clamp-1">
                          {getLocalizedApiTitle(res)}
                        </div>
                        {getLocalizedApiDesc(res) && (
                          <div className="text-[10px] text-slate-500 line-clamp-1">
                            {getLocalizedApiDesc(res)}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                        {res.category || res.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {query.trim() && (
                <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => handleSelectLink(`/search?q=${encodeURIComponent(query)}`)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-[var(--portal-blue-900)] hover:text-amber-700 transition cursor-pointer"
                  >
                    <span>{tSearch('allResultsFor', { query })}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {query.trim() && !isLoading && matchedShortcuts.length === 0 && apiResults.length === 0 && (
                <div className="py-6 px-4 text-center">
                  <p className="text-xs font-medium text-slate-700">{tSearch('noResultsFound')}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{tSearch('noResultsPrompt')}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SUBTLE VERTICAL DIVIDER */}
        <div className="h-6 w-[1.5px] bg-slate-300 select-none shrink-0" aria-hidden="true" />

        {/* SATYAMEVA JAYATE OFFICIAL ACCENT (SAME HORIZONTAL ROW) */}
        <span
          className="inline-flex items-center text-[13px] font-semibold tracking-wider text-[var(--portal-blue-900)]/85 select-none whitespace-nowrap font-serif font-display-deva shrink-0"
          lang="mr"
          title="सत्यमेव जयते"
        >
          {tHeader('satyamevaJayate')}
        </span>
      </div>

      {/* MOBILE / TABLET COMPACT SEARCH BUTTON */}
      <button
        type="button"
        onClick={() => {
          setIsMobileModalOpen(true);
          setTimeout(() => mobileInputRef.current?.focus(), 150);
        }}
        aria-label={tHeader('searchOpen')}
        className="flex h-10 w-10 items-center justify-center rounded-sm border border-slate-300 bg-slate-50 text-[var(--portal-blue-900)] transition-colors hover:bg-slate-100 lg:hidden shrink-0"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* MOBILE / TABLET SEARCH MODAL */}
      {isMobileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden flex flex-col justify-start p-3 animate-in fade-in duration-150">
          <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-3 border-b border-slate-200 flex items-center gap-2 bg-slate-50">
              <Search className="h-4 w-4 text-slate-500 shrink-0" />
              <input
                ref={mobileInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tHeader('searchPlaceholder')}
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-slate-400 shrink-0" />}
              <button
                type="button"
                onClick={() => setIsMobileModalOpen(false)}
                className="p-1 rounded-md text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-slate-100/70 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-600 font-serif border-b border-slate-200/60">
              <span>{tSearch('title')}</span>
              <span className="font-bold text-[var(--portal-blue-900)]" lang="mr">
                {tHeader('satyamevaJayate')}
              </span>
            </div>

            <div className="overflow-y-auto p-2 flex-1 divide-y divide-slate-100">
              {matchedShortcuts.length > 0 && (
                <div className="py-2">
                  <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {tSearch('categoryServices')}
                  </div>
                  {matchedShortcuts.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={`m-${item.id}`}
                        type="button"
                        onClick={() => handleSelectLink(item.url)}
                        className="w-full flex items-center gap-3 px-2.5 py-2.5 text-left rounded-lg hover:bg-slate-100 transition cursor-pointer"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--portal-blue-50)] text-[var(--portal-blue-900)] shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-800 truncate">
                            {getLocalizedShortcutTitle(item)}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {getLocalizedShortcutDesc(item)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {apiResults.length > 0 && (
                <div className="py-2">
                  <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {tSearch('resultsCount', { count: apiResults.length })}
                  </div>
                  {apiResults.map((res) => (
                    <button
                      key={`m-${res.type}-${res.id}`}
                      type="button"
                      onClick={() => handleSelectLink(res.url)}
                      className="w-full flex items-start gap-2.5 px-2.5 py-2 text-left rounded-lg hover:bg-slate-100 transition cursor-pointer"
                    >
                      <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-800 line-clamp-1">
                          {getLocalizedApiTitle(res)}
                        </div>
                        {getLocalizedApiDesc(res) && (
                          <div className="text-[10px] text-slate-500 line-clamp-1">
                            {getLocalizedApiDesc(res)}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {query.trim() && (
              <div className="p-3 bg-slate-50 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => handleSelectLink(`/search?q=${encodeURIComponent(query)}`)}
                  className="w-full py-2 px-3 rounded-lg bg-[var(--portal-blue-900)] text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{tSearch('allResultsFor', { query })}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
