/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Phone,
  Menu,
  X,
  Bot,
  Building2,
  Landmark,
  Compass,
  FileText,
  ChevronDown,
  Globe,
  AlertCircle,
  LogOut,
  ShieldCheck,
  LogIn,
} from 'lucide-react';
import { CouncilSeal } from '@/components/layout/CouncilSeal';
import { HeaderGlobalSearch } from '@/components/search/HeaderGlobalSearch';
import { useTranslations, useLocale } from 'next-intl';
import { locales, localeNames, type Locale } from '@/i18n';

type Wing = {
  id: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  items: { href: string; labelKey: string }[];
};

const WINGS: Wing[] = [
  {
    id: 'nagar-parishad',
    labelKey: 'nagarParishad',
    icon: Building2,
    items: [
      { href: '/nagar-parishad', labelKey: 'aboutCouncil' },
      { href: '/nagar-parishad/representatives', labelKey: 'representatives' },
      { href: '/nagar-parishad/ward-map', labelKey: 'wards' },
      { href: '/nagar-parishad/nagar-sevak', labelKey: 'nagarSevaks' },
      { href: '/nagar-parishad/development-works', labelKey: 'developmentWorks' },
      { href: '/nagar-parishad/projects', labelKey: 'projects' },
      { href: '/nagar-parishad/notifications', labelKey: 'notifications' },
    ],
  },
  {
    id: 'grievances',
    labelKey: 'grievances',
    icon: AlertCircle,
    items: [
      { href: '/grievances/new', labelKey: 'submitGrievance' },
      { href: '/grievances/track', labelKey: 'trackGrievance' },
    ],
  },
  {
    id: 'heritage',
    labelKey: 'heritageCulture',
    icon: Landmark,
    items: [
      { href: '/heritage/museum', labelKey: 'museum' },
      { href: '/heritage/artifacts', labelKey: 'artifacts' },
      { href: '/heritage/3d-models', labelKey: 'models3d' },
      { href: '/heritage/history', labelKey: 'history' },
      { href: '/heritage/cultural-heritage', labelKey: 'culturalHeritage' },
    ],
  },
  {
    id: 'tourism',
    labelKey: 'tourismPlaces',
    icon: Compass,
    items: [
      { href: '/tourism/jayakwadi', labelKey: 'jayakwadi' },
      { href: '/tourism/nath-sagar', labelKey: 'nathSagar' },
      { href: '/tourism/places-to-visit', labelKey: 'placesToVisit' },
      { href: '/tourism/heritage-sites', labelKey: 'heritageSites' },
      { href: '/tourism/routes', labelKey: 'routes' },
      { href: '/tourism/map', labelKey: 'map' },
    ],
  },
];

export default function Header() {
  const t = useTranslations('nav');
  const tHeader = useTranslations('header');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openWing, setOpenWing] = useState<string | null>(null);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const handleLocaleChange = (newLocale: Locale) => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (locales.includes(pathSegments[0] as Locale)) {
      pathSegments[0] = newLocale;
    } else {
      pathSegments.unshift(newLocale);
    }
    router.push('/' + pathSegments.join('/'));
    setLocaleMenuOpen(false);
  };

  useEffect(() => {
    if (!openWing) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenWing(null);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenWing(null);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [openWing]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-white)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 lg:gap-6 py-3">
            <Link href={`/${locale}`} className="flex items-center gap-3 shrink-0">
              <CouncilSeal size={56} />
              <span>
                <span className="block text-[11px] font-medium text-[var(--civic-slate-500)] sm:text-xs">
                  {tHeader('district')}
                </span>
                <span className="block font-display text-xl font-semibold leading-tight tracking-tight text-[var(--portal-blue-900)] sm:text-[1.7rem]">
                  {tHeader('paithanMunicipalCouncil')}
                </span>
                <span lang="mr" className="block font-display-deva text-sm text-[var(--civic-slate-700)]">
                  {tHeader('paithanNagarParishad')}
                </span>
              </span>
            </Link>

            {/* GLOBAL CITIZEN SEARCH BAR + SATYAMEVA JAYATE ACCENT + ACTIONS */}
            <div className="flex items-center justify-end flex-1 gap-3 xl:gap-4 min-w-0">
              <HeaderGlobalSearch />

              {/*
                Language and the account controls used to live on a dark utility
                strip stacked above this row. That strip is gone — one header is
                enough — so they now sit here, beside the search field: picking a
                language and signing in are both ways of reaching your own corner
                of the site, and this is the row people already look at for that.
              */}
              <div className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setLocaleMenuOpen((open) => !open)}
                  className="inline-flex h-[44px] items-center gap-1.5 rounded-md border border-[var(--border-strong)] bg-white px-3 text-xs font-bold text-[var(--portal-blue-900)] shadow-xs transition-colors hover:bg-[var(--portal-blue-50)]"
                  aria-expanded={localeMenuOpen}
                  aria-haspopup="listbox"
                  aria-label={tHeader('language')}
                >
                  <Globe className="h-4 w-4 text-[var(--saffron-700)]" aria-hidden="true" />
                  <span>{localeNames[locale]}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${localeMenuOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {localeMenuOpen && (
                  <ul
                    role="listbox"
                    className="absolute right-0 top-full z-50 mt-1 min-w-[130px] rounded-md border border-[var(--border-strong)] bg-white py-1 shadow-lg"
                    aria-label={tHeader('language')}
                  >
                    {locales.map((loc) => (
                      <li key={loc}>
                        <button
                          role="option"
                          aria-selected={loc === locale}
                          onClick={() => handleLocaleChange(loc)}
                          className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm text-[var(--civic-slate-700)] hover:bg-[var(--portal-blue-50)] ${loc === locale ? 'font-semibold text-[var(--portal-blue-900)]' : ''}`}
                        >
                          {localeNames[loc]}
                          {loc === locale && (
                            <span className="ml-auto text-[var(--saffron-500)]">✓</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="hidden items-center gap-2 lg:flex">
                {session?.user ? (
                  <>
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="h-8 w-8 shrink-0 rounded-full border border-[var(--border-strong)] object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                    <span className="max-w-[120px] truncate text-xs font-semibold text-[var(--portal-blue-900)]">
                      {session.user.name || session.user.email}
                    </span>
                    {(session.user as { role?: string })?.role === 'ADMIN' ||
                    (session.user as { role?: string })?.role === 'EDITOR' ? (
                      <Link
                        href={`/${locale}/admin/dashboard`}
                        className="inline-flex items-center gap-1 rounded-sm border border-amber-500/50 bg-amber-500/15 px-2 py-1.5 text-[11px] font-semibold text-amber-700 transition-colors hover:bg-amber-500/30"
                      >
                        <span>{tHeader('adminPortal')}</span>
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: `/${locale}` })}
                      className="inline-flex items-center gap-1 rounded-sm border border-[var(--border-strong)] px-2 py-1.5 text-[11px] font-semibold text-[var(--civic-slate-700)] transition-colors hover:border-red-400 hover:text-red-700"
                      title={tHeader('logout')}
                    >
                      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{tHeader('logout')}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/${locale}/login`}
                      className="inline-flex h-[44px] items-center gap-1.5 rounded-md border border-[var(--border-strong)] px-3 text-xs font-bold text-[var(--portal-blue-900)] transition-colors hover:border-[var(--portal-blue-700)] hover:bg-[var(--portal-blue-50)]"
                    >
                      <LogIn className="h-4 w-4 text-[var(--saffron-700)]" aria-hidden="true" />
                      <span>{tHeader('signIn')}</span>
                    </Link>
                    <Link
                      href={`/${locale}/register`}
                      className="inline-flex h-[44px] items-center rounded-md border border-[var(--portal-blue-900)] bg-[var(--portal-blue-900)] px-3 text-xs font-bold text-white transition-colors hover:bg-[var(--portal-blue-800)]"
                    >
                      <span>{tHeader('register')}</span>
                    </Link>
                  </>
                )}
              </div>

              <Link
                href={`/${locale}/chatbot`}
                className="hidden items-center gap-2 rounded-md border border-[var(--portal-blue-800)] bg-white px-4 h-[44px] text-xs font-bold text-[var(--portal-blue-900)] shadow-xs transition-colors hover:bg-[var(--portal-blue-900)] hover:text-white lg:inline-flex shrink-0 whitespace-nowrap"
              >
                <Bot className="h-4 w-4" aria-hidden="true" />
                <span>{tHeader('aiAssistant')}</span>
              </Link>

              <a
                href="tel:02431223010"
                aria-label="Call 02431-223010"
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-[var(--border-strong)] bg-[var(--saffron-100)] text-[var(--saffron-700)] transition-colors hover:bg-[var(--saffron-500)] lg:hidden shrink-0"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                href={`/${locale}/chatbot`}
                aria-label={tHeader('aiAssistant')}
                className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--portal-blue-50)] text-[var(--portal-blue-800)] transition-colors hover:bg-[var(--portal-blue-100)] lg:hidden shrink-0"
              >
                <Bot className="h-4 w-4" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center rounded-sm text-[var(--civic-slate-700)] transition-colors hover:bg-[var(--saffron-100)] lg:hidden shrink-0"
                aria-label={mobileMenuOpen ? tHeader('closeMenu') : tHeader('openMenu')}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div ref={navRef} className="gov-nav-bar hidden lg:block">
        <nav aria-label="Primary" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm font-medium">
            <ul className="flex items-center">
              <li>
                <Link
                  href={`/${locale}`}
                  className="block border-b-2 border-transparent px-3.5 py-2.5 text-[var(--on-vangi)] transition-colors hover:border-[var(--saffron-500)] hover:bg-[var(--portal-blue-900)]"
                >
                  {t('home')}
                </Link>
              </li>

              {WINGS.map((wing) => {
                const Icon = wing.icon;
                const isOpen = openWing === wing.id;
                return (
                  <li
                    key={wing.id}
                    className="group relative"
                    onMouseEnter={() => setOpenWing(wing.id)}
                    onMouseLeave={() => setOpenWing(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenWing(isOpen ? null : wing.id)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className={`inline-flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-[var(--on-vangi)] transition-colors hover:bg-[var(--portal-blue-900)] ${
                        isOpen
                          ? 'border-[var(--saffron-500)] bg-[var(--portal-blue-900)]'
                          : 'border-transparent'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{t(wing.labelKey)}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>

                    <div
                      className={`absolute left-0 top-full w-64 overflow-hidden rounded-b-sm border border-t-0 border-[var(--border-strong)] bg-[var(--bg-surface-white)] py-1 shadow-lg ${
                        isOpen ? 'block' : 'hidden'
                      }`}
                    >
                      {wing.items.map((item, index) => (
                        <Link
                          key={item.href}
                          href={`/${locale}${item.href}`}
                          onClick={() => setOpenWing(null)}
                          className={`block border-l-2 px-4 py-2 text-[13px] text-[var(--civic-slate-700)] transition-colors hover:border-[var(--saffron-500)] hover:bg-[var(--portal-blue-50)] hover:text-[var(--portal-blue-900)] ${
                            index === 0
                              ? 'border-l-[var(--portal-blue-700)] font-semibold text-[var(--portal-blue-900)]'
                              : 'border-l-transparent'
                          }`}
                        >
                          {t(item.labelKey)}
                        </Link>
                      ))}
                    </div>
                  </li>
                );
              })}

              <li>
                <Link
                  href={`/${locale}/nagar-parishad/notifications`}
                  className="inline-flex items-center gap-1.5 border-b-2 border-transparent px-3.5 py-2.5 text-[var(--on-vangi)] transition-colors hover:border-[var(--saffron-500)] hover:bg-[var(--portal-blue-900)]"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  <span>{t('noticesTenders')}</span>
                </Link>
              </li>
            </ul>

            <div className="flex items-center gap-2">
              {session?.user && (session.user as { role?: string }).role !== 'PUBLIC' ? (
                <Link
                  href={`/${locale}/admin/dashboard`}
                  className="rounded-sm border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300 transition-colors hover:bg-amber-500 hover:text-slate-950 flex items-center gap-1.5 font-semibold"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{tHeader('adminDashboard')}</span>
                </Link>
              ) : (
                <Link
                  href={`/${locale}/admin/login`}
                  className="rounded-sm border border-[var(--on-vangi-rule)] px-3 py-1.5 text-xs text-[var(--on-vangi-muted)] transition-colors hover:border-[var(--saffron-500)] hover:bg-[var(--saffron-500)] hover:text-[var(--portal-blue-900)] flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{t('councilAdmin')}</span>
                </Link>
              )}
            </div>
          </div>
        </nav>
        <div className="zari-rule" aria-hidden="true" />
      </div>

      {mobileMenuOpen ? (
        <div className="max-h-[70vh] overflow-y-auto border-t border-[var(--border-subtle)] bg-white lg:hidden">
          <nav aria-label="Mobile" className="px-4 py-3">
            {/*
              Language. On desktop the switcher sits in the top row beside the
              search; a phone has no room up there, so it opens the menu instead
              as three direct taps rather than a nested dropdown.
            */}
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] py-2.5">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--portal-blue-900)]">
                <Globe className="h-4 w-4 text-[var(--saffron-700)]" aria-hidden="true" />
                {tHeader('language')}
              </span>
              <div className="flex items-center gap-1.5">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    aria-pressed={loc === locale}
                    onClick={() => {
                      handleLocaleChange(loc);
                      setMobileMenuOpen(false);
                    }}
                    className={`rounded-sm border px-2.5 py-1 text-xs font-bold transition-colors ${
                      loc === locale
                        ? 'border-[var(--portal-blue-900)] bg-[var(--portal-blue-900)] text-white'
                        : 'border-[var(--border-strong)] text-[var(--civic-slate-700)] hover:bg-[var(--portal-blue-50)]'
                    }`}
                  >
                    {localeNames[loc]}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href={`/${locale}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b border-[var(--border-subtle)] py-2.5 text-sm font-semibold text-[var(--portal-blue-900)]"
            >
              {t('home')}
            </Link>

            {WINGS.map((wing) => {
              const Icon = wing.icon;
              return (
                <div key={wing.id} className="border-b border-[var(--border-subtle)] py-2.5">
                  <p className="flex items-center gap-1.5 font-display text-base font-semibold text-[var(--portal-blue-900)]">
                    <Icon className="h-4 w-4 text-[var(--saffron-700)]" aria-hidden="true" />
                    {t(wing.labelKey)}
                  </p>
                  <ul className="mt-1 space-y-0.5 pl-5">
                    {wing.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={`/${locale}${item.href}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 text-[13px] text-[var(--civic-slate-700)]"
                        >
                          {t(item.labelKey)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border-subtle)] mt-2">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/${locale}/chatbot`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--saffron-700)]"
                >
                  <Bot className="h-4 w-4" aria-hidden="true" />
                  <span>{tHeader('aiAssistant')}</span>
                </Link>
                {session?.user && ((session.user as { role?: string })?.role === "ADMIN" || (session.user as { role?: string })?.role === "EDITOR") ? (
                  <Link
                    href={`/${locale}/admin/dashboard`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-semibold text-amber-600"
                  >
                    {tHeader('adminPortal')}
                  </Link>
                ) : (
                  <Link
                    href={`/${locale}/admin/login`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-semibold text-[var(--portal-blue-700)]"
                  >
                    {t('councilAdmin')}
                  </Link>
                )}
              </div>

              {!session?.user ? (
                <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
                  <Link
                    href={`/${locale}/login`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--portal-blue-700)]"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>{tHeader('signIn')}</span>
                  </Link>
                  <span className="text-slate-300">|</span>
                  <Link
                    href={`/${locale}/register`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600"
                  >
                    <span>{tHeader('register')}</span>
                  </Link>
                </div>
              ) : null}

              {session?.user ? (
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="h-6 w-6 rounded-full object-cover border border-amber-500/50"
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[var(--portal-blue-900)]">
                        {session.user.name || session.user.email}
                      </span>
                      <span className="text-[10px] text-[var(--civic-slate-500)]">
                        {session.user.email}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: `/${locale}` });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 p-1"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{tHeader('logout')}</span>
                  </button>
                </div>
              ) : null}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export { Header };