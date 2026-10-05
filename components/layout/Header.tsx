'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Phone,
  Mail,
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
import { StateEmblem } from '@/components/ui/StateEmblem';
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
      <div className="gov-top-bar border-b border-[var(--on-vangi-rule)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <StateEmblem size={16} invert />
                {tHeader('governmentOfMaharashtra')}
              </span>
              <span className="hidden text-[var(--on-vangi-rule)] sm:inline" aria-hidden="true">
                |
              </span>
              <span className="hidden text-[var(--on-vangi-muted)] sm:inline">
                {tHeader('dma')}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[var(--on-vangi-muted)]">
              <a
                href="tel:02431223010"
                className="inline-flex items-center gap-1 hover:text-[var(--saffron-500)]"
              >
                <Phone className="h-3 w-3" aria-hidden="true" />
                <span className="tabular-nums">{tHeader('helpline')}</span>
              </a>
              <a
                href="mailto:munptn@gmail.com"
                className="hidden items-center gap-1 hover:text-[var(--saffron-500)] md:inline-flex"
              >
                <Mail className="h-3 w-3" aria-hidden="true" />
                <span>{tHeader('email')}</span>
              </a>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLocaleMenuOpen((open) => !open)}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--on-vangi-rule)] px-2 py-0.5 text-[10px] hover:bg-[var(--portal-blue-50)]"
                  aria-expanded={localeMenuOpen}
                  aria-haspopup="listbox"
                  aria-label={tHeader('language')}
                >
                  <Globe className="h-3 w-3 text-[var(--saffron-500)]" aria-hidden="true" />
                  <span className="font-bold text-[var(--saffron-100)]">{localeNames[locale]}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${localeMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                {localeMenuOpen && (
                  <ul
                    role="listbox"
                    className="absolute right-0 top-full mt-1 min-w-[120px] rounded-sm border border-[var(--on-vangi-rule)] bg-[var(--bg-surface-white)] py-1 shadow-lg z-50"
                    aria-label={tHeader('language')}
                  >
                    {locales.map((loc) => (
                      <li key={loc}>
                        <button
                          role="option"
                          aria-selected={loc === locale}
                          onClick={() => handleLocaleChange(loc)}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--civic-slate-700)] hover:bg-[var(--portal-blue-50)] ${loc === locale ? 'font-semibold text-[var(--portal-blue-900)]' : ''}`}
                        >
                          {localeNames[loc]}
                          {loc === locale && <span className="ml-auto text-[var(--saffron-500)]">✓</span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {session?.user ? (
                <div className="flex items-center gap-2 border-l border-[var(--on-vangi-rule)] pl-3">
                  <span className="text-[11px] text-[var(--saffron-100)] font-medium truncate max-w-[120px]">
                    {session.user.name || session.user.email}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: `/${locale}` })}
                    className="inline-flex items-center gap-1 rounded-sm border border-red-500/40 bg-red-950/30 px-1.5 py-0.5 text-[10px] text-red-300 hover:bg-red-900/60 hover:border-red-400 transition"
                    title="Sign Out"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href={`/${locale}/admin/login`}
                  className="inline-flex items-center gap-1 rounded-sm border border-[var(--on-vangi-rule)] px-2 py-0.5 text-[10px] text-[var(--saffron-100)] hover:bg-[var(--portal-blue-50)] hover:text-white transition"
                >
                  <LogIn className="h-3 w-3 text-[var(--saffron-500)]" />
                  <span>Sign In / Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-white)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <CouncilSeal size={56} />
              <span>
                <span className="block text-[11px] font-medium text-[var(--civic-slate-500)] sm:text-xs">
                  Chhatrapati Sambhajinagar district, Maharashtra
                </span>
                <span className="block font-display text-xl font-semibold leading-tight tracking-tight text-[var(--portal-blue-900)] sm:text-[1.7rem]">
                  Paithan Municipal Council
                </span>
                <span lang="mr" className="block font-display-deva text-sm text-[var(--civic-slate-700)]">
                  पैठण नगर परिषद · स्थापना १८५४
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href={`/${locale}/chatbot`}
                className="hidden items-center gap-2 rounded-sm border border-[var(--portal-blue-700)] bg-[var(--bg-surface-white)] px-3.5 py-2 text-xs font-semibold text-[var(--portal-blue-800)] transition-colors hover:bg-[var(--portal-blue-800)] hover:text-[var(--saffron-100)] lg:inline-flex"
              >
                <Bot className="h-4 w-4" aria-hidden="true" />
                <span>Ask AI Assistant</span>
              </Link>

              <a
                href="tel:02431223010"
                aria-label="Call the civic control room, 02431-223010"
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-[var(--border-strong)] bg-[var(--saffron-100)] text-[var(--saffron-700)] transition-colors hover:bg-[var(--saffron-500)] lg:hidden"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                href={`/${locale}/chatbot`}
                aria-label="Ask about Paithan"
                className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--portal-blue-50)] text-[var(--portal-blue-800)] transition-colors hover:bg-[var(--portal-blue-100)] lg:hidden"
              >
                <Bot className="h-4 w-4" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center rounded-sm text-[var(--civic-slate-700)] transition-colors hover:bg-[var(--saffron-100)] lg:hidden"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
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
                  <span>Admin Dashboard</span>
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

            <div className="flex items-center justify-between gap-3 pt-3">
              <Link
                href={`/${locale}/chatbot`}
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--saffron-700)]"
              >
                <Bot className="h-4 w-4" aria-hidden="true" />
                <span>Ask AI Assistant</span>
              </Link>
              <Link
                href={`/${locale}/admin/login`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-[var(--portal-blue-700)]"
              >
                {t('councilAdmin')}
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export { Header };