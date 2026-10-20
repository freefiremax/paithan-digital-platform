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
  FileText,
  ChevronDown,
  Globe,
  LogOut,
  ShieldCheck,
  LogIn,
} from 'lucide-react';
import { CouncilSeal } from '@/components/layout/CouncilSeal';
import { HeaderGlobalSearch } from '@/components/search/HeaderGlobalSearch';
import {
  WovenDiamond,
  ZariChevron,
  TempleArch,
  WovenLotus,
  ZariStar,
} from '@/components/ui/PaithanNavMarks';
import { useTranslations, useLocale } from 'next-intl';
import { locales, localeNames, type Locale } from '@/i18n';

type Wing = {
  id: string;
  labelKey: string;
  /** A woven Paithani mark, not a stock outline icon — see PaithanNavMarks. */
  mark: React.ComponentType<{ className?: string }>;
  items: { href: string; labelKey: string }[];
};

const WINGS: Wing[] = [
  {
    id: 'nagar-parishad',
    labelKey: 'nagarParishad',
    mark: WovenDiamond,
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
    mark: ZariStar,
    items: [
      { href: '/grievances/new', labelKey: 'submitGrievance' },
      { href: '/grievances/track', labelKey: 'trackGrievance' },
    ],
  },
  {
    id: 'heritage',
    labelKey: 'heritageCulture',
    mark: TempleArch,
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
    mark: WovenLotus,
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

/**
 * The site header.
 *
 * TWO STATES, ONE DOM. The header is deliberately NOT `position: sticky`. At the
 * top of the page it is a full, ornate Paithani masthead in normal flow and
 * scrolls away with the page. Once it has scrolled out, a slim fixed "tube"
 * appears at the top carrying only the essentials — crest, council name and the
 * primary nav — so the citizen keeps a way back to everything without the
 * masthead squatting over the content. See `isCompact` below.
 *
 * AUTHENTIC MARKS. Every nav wing is marked by a hand-authored Paithani textile
 * unit (PaithanNavMarks), not a stock outline icon. The zari chevron of the pallu
 * edge runs beneath the masthead and beneath the compact tube, so the identity is
 * carried by the ornament rather than by a logo image.
 */
export default function Header() {
  const t = useTranslations('nav');
  const tHeader = useTranslations('header');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openWing, setOpenWing] = useState<string | null>(null);
  const [openWingCompact, setOpenWingCompact] = useState<string | null>(null);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  /*
   * Swap to the compact tube once the masthead has scrolled past. Measured
   * against the header's own height rather than a fixed pixel value, so the two
   * states can never disagree when the masthead's padding or the seal size
   * changes. rAF-throttled, and read from the DOM node, so this never re-renders
   * more than the single boolean flip.
   */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    let ticking = false;
    const evaluate = () => {
      ticking = false;
      const threshold = el.offsetHeight * 0.75;
      setIsCompact(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(evaluate);
    };

    evaluate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

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

  const isStaff =
    !!session?.user &&
    ((session.user as { role?: string })?.role === 'ADMIN' ||
      (session.user as { role?: string })?.role === 'EDITOR');

  return (
    <>
      {/* Full, ornate masthead — in normal flow, scrolls away with the page. */}
      <header ref={headerRef} className="relative z-40 w-full">
        {/* The pallu crown: a woven ribbon of repeating butis along the very top
            edge of the page, the way a Paithani's border opens the cloth. */}
        <div className="loom-crown" aria-hidden="true" />

        <div className="header-masthead">
          <div className="loom-warp">
            <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
              <div className="flex items-center justify-between gap-6 py-6 lg:gap-10 lg:py-7">

                {/* Crest plate: the seal in a woven frame, joined by a zari rule
                    to the identity stack. The plate is the one ornament the eye
                    lands on first. */}
                <Link
                  href={`/${locale}`}
                  className="group flex shrink-0 items-center gap-5 lg:gap-6 lg:pl-4 xl:pl-6"
                >
                  <span className="crest-plate">
                    <CouncilSeal size={72} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--saffron-700)]">
                      {tHeader('district')}
                    </span>
                    <span className="mt-1 block font-display text-2xl font-semibold leading-[1.08] tracking-tight text-[var(--portal-blue-900)] sm:text-[2rem] lg:text-[2.4rem]">
                      {tHeader('paithanMunicipalCouncil')}
                    </span>
                    <span
                      lang="mr"
                      className="mt-1.5 flex items-center gap-2 font-display-deva text-base text-[var(--civic-slate-700)]"
                    >
                      <span
                        className="h-px w-8 bg-[var(--zari-gold-400)]/70"
                        aria-hidden="true"
                      />
                      तीर्थक्षेत्र पैठण
                    </span>
                  </span>
                </Link>

                {/* A woven divider between the identity and the actions, then the
                    action cluster. Clear breathing room on both sides so the
                    heading never crowds the controls. */}
                <span
                  className="hidden h-16 w-px shrink-0 bg-gradient-to-b from-transparent via-[var(--zari-gold-400)] to-transparent lg:block"
                  aria-hidden="true"
                />

                <div className="flex flex-1 flex-col items-stretch gap-2.5 min-w-0">
                {/* Top row: language, sign-in / register, AI assistant — the
                    account strip, held to the right within the same column as
                    the search beneath it. */}
                <div className="hidden lg:flex justify-end">
                  <div className="flex w-full max-w-[560px] items-stretch gap-3 xl:gap-4">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setLocaleMenuOpen((open) => !open)}
                      className="header-control"
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
                        className="absolute right-0 top-full z-50 mt-2 min-w-[140px] overflow-hidden rounded-sm border border-[var(--zari-gold-400)]/50 bg-white py-1 shadow-[0_20px_40px_-18px_rgba(26,8,14,0.55)]"
                        aria-label={tHeader('language')}
                      >
                        {locales.map((loc) => (
                          <li key={loc}>
                            <button
                              role="option"
                              aria-selected={loc === locale}
                              onClick={() => handleLocaleChange(loc)}
                              className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-[var(--civic-slate-700)] transition-colors hover:bg-[var(--saffron-100)] hover:text-[var(--portal-blue-900)] ${loc === locale ? 'font-semibold text-[var(--portal-blue-900)]' : ''}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rotate-45 ${loc === locale ? 'bg-[var(--zari-gold-400)]' : 'border border-[var(--zari-gold-400)]/50'}`}
                                aria-hidden="true"
                              />
                              {localeNames[loc]}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex flex-1 items-center gap-2">
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
                        {isStaff ? (
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
                          className="header-control flex-1"
                        >
                          <LogIn className="h-4 w-4 text-[var(--saffron-700)]" aria-hidden="true" />
                          <span>{tHeader('signIn')}</span>
                        </Link>
                        <Link
                          href={`/${locale}/register`}
                          className="header-control header-control--solid flex-1"
                        >
                          <span>{tHeader('register')}</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <Link
                    href={`/${locale}/chatbot`}
                    className="header-control header-control--chatbot flex-1 shrink-0 whitespace-nowrap"
                  >
                    <Bot className="h-4 w-4" aria-hidden="true" />
                    <span>{tHeader('aiAssistant')}</span>
                  </Link>
                  </div>
                </div>

                {/* Bottom row: the global search, seated at the right beneath the
                    account strip. */}
                <div className="hidden lg:flex justify-end">
                  <div className="w-full max-w-[560px]">
                    <HeaderGlobalSearch />
                  </div>
                </div>
              </div>

                {/* Mobile actions: phone, AI assistant and the menu — shown
                    until the account strip takes over at lg. */}
                <div className="flex items-center gap-2 lg:hidden shrink-0">
                <a
                  href="tel:02431223010"
                  aria-label="Call 02431-223010"
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-[var(--border-strong)] bg-[var(--saffron-100)] text-[var(--saffron-700)] transition-colors hover:bg-[var(--saffron-500)] shrink-0"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </a>
                <Link
                  href={`/${locale}/chatbot`}
                  aria-label={tHeader('aiAssistant')}
                  className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--portal-blue-50)] text-[var(--portal-blue-800)] transition-colors hover:bg-[var(--portal-blue-100)] shrink-0"
                >
                  <Bot className="h-4 w-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  className="flex h-10 w-10 items-center justify-center rounded-sm text-[var(--civic-slate-700)] transition-colors hover:bg-[var(--saffron-100)] shrink-0"
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
        </div>

        {/* The pallu foot border: the wide woven band that closes the masthead,
            carrying the same buti repeat as the crown so the header is framed
            top and bottom like a real pallu. */}
        <div className="loom-pallu-border" aria-hidden="true" />

        <div ref={navRef} className="loom-warp-nav hidden lg:block">
          <nav aria-label="Primary" className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
            <div className="flex items-stretch justify-between text-sm font-medium">
              <ul className="flex min-w-0 items-stretch">
                {WINGS.map((wing) => {
                  const Mark = wing.mark;
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
                        data-open={isOpen}
                        className="loom-thread inline-flex items-center gap-2 whitespace-nowrap px-3 py-3 text-[13px] font-medium text-[var(--on-vangi)]"
                      >
                        <Mark className="h-[18px] w-[18px]" />
                        <span>{t(wing.labelKey)}</span>
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>

                      <div
                        className={`absolute left-0 top-full z-40 w-64 overflow-hidden rounded-sm border border-[var(--zari-gold-400)]/45 bg-[var(--bg-surface-white)] py-1 shadow-[0_20px_40px_-18px_rgba(26,8,14,0.55)] ${
                          isOpen ? 'block' : 'hidden'
                        }`}
                      >
                        {wing.items.map((item, index) => (
                          <Link
                            key={item.href}
                            href={`/${locale}${item.href}`}
                            onClick={() => setOpenWing(null)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[var(--civic-slate-700)] transition-colors hover:bg-[var(--saffron-100)] hover:text-[var(--portal-blue-900)]"
                          >
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rotate-45 ${
                                index === 0
                                  ? 'bg-[var(--zari-gold-400)]'
                                  : 'border border-[var(--zari-gold-400)]/55'
                              }`}
                              aria-hidden="true"
                            />
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
                    className="loom-thread inline-flex items-center gap-2 whitespace-nowrap px-3 py-3 text-[13px] font-medium text-[var(--on-vangi)]"
                  >
                    <ZariChevron className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span>{t('noticesTenders')}</span>
                  </Link>
                </li>
              </ul>

              <div className="hidden shrink-0 items-center gap-2 pl-3 xl:flex">
                {isStaff ? (
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
        </div>
      </header>

      {/*
        The compact tube. Fixed to the top and revealed only once the masthead
        has scrolled away, so nothing squats over the content at rest. It keeps
        the essentials — crest, council name, primary nav — and drops search,
        language, account and chatbot. Same nav data as the masthead, rendered
        from the same WINGS, so the two can't drift.
      */}
      <div
        className={`header-tube ${isCompact ? 'header-tube--visible' : ''}`}
        aria-hidden={!isCompact}
      >
        <div className="loom-warp-tight">
          <div className="flex h-full w-full items-center gap-4 px-4 sm:px-6 lg:px-10 xl:px-14">
            <Link
              href={`/${locale}`}
              className="flex shrink-0 items-center gap-2.5"
              tabIndex={isCompact ? 0 : -1}
            >
              <CouncilSeal size={30} />
              <span className="whitespace-nowrap font-display text-sm font-semibold leading-tight text-white sm:text-base">
                PMC
              </span>
            </Link>

            <span
              className="hidden h-6 w-px shrink-0 bg-[var(--on-vangi)]/25 lg:block"
              aria-hidden="true"
            />

            <nav aria-label="Primary (compact)" className="hidden min-w-0 flex-1 lg:block">
              <ul className="flex h-full items-center gap-1">
                {WINGS.map((wing) => {
                  const Mark = wing.mark;
                  const isOpen = openWingCompact === wing.id;
                  return (
                    <li
                      key={wing.id}
                      className="relative h-full"
                      onMouseEnter={() => setOpenWingCompact(wing.id)}
                      onMouseLeave={() => setOpenWingCompact(null)}
                    >
                      <button
                        type="button"
                        tabIndex={isCompact ? 0 : -1}
                        onClick={() => setOpenWingCompact(isOpen ? null : wing.id)}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        data-open={isOpen}
                        className="loom-thread flex h-full items-center gap-2 whitespace-nowrap px-3 text-[13px] font-medium text-[var(--on-vangi)]"
                      >
                        <Mark className="h-[18px] w-[18px]" />
                        <span>{t(wing.labelKey)}</span>
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                      <div
                        className={`absolute left-0 top-full z-50 w-64 overflow-hidden rounded-b-sm border border-t-0 border-[var(--zari-gold-400)]/40 bg-[var(--bg-surface-white)] py-1 shadow-[0_20px_40px_-18px_rgba(26,8,14,0.6)] ${
                          isOpen ? 'block' : 'hidden'
                        }`}
                      >
                        {wing.items.map((item, index) => (
                          <Link
                            key={item.href}
                            href={`/${locale}${item.href}`}
                            tabIndex={isCompact ? 0 : -1}
                            onClick={() => setOpenWingCompact(null)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[var(--civic-slate-700)] transition-colors hover:bg-[var(--saffron-100)] hover:text-[var(--portal-blue-900)]"
                          >
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rotate-45 ${
                                index === 0
                                  ? 'bg-[var(--zari-gold-400)]'
                                  : 'border border-[var(--zari-gold-400)]/60'
                              }`}
                              aria-hidden="true"
                            />
                            {t(item.labelKey)}
                          </Link>
                        ))}
                      </div>
                    </li>
                  );
                })}
                <li className="h-full">
                  <Link
                    href={`/${locale}/nagar-parishad/notifications`}
                    tabIndex={isCompact ? 0 : -1}
                    className="loom-thread flex h-full items-center gap-2 whitespace-nowrap px-3 text-[13px] font-medium text-[var(--on-vangi)]"
                  >
                    <ZariChevron className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span>{t('noticesTenders')}</span>
                  </Link>
                </li>
              </ul>
            </nav>

            <a
              href="tel:02431223010"
              aria-label="Call 02431-223010"
              tabIndex={isCompact ? 0 : -1}
              className="ml-auto hidden shrink-0 items-center gap-2 text-xs font-semibold tracking-wide text-[var(--zari-gold-400)] transition-colors hover:text-white sm:inline-flex"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="tabular-nums">02431-223010</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              tabIndex={isCompact ? 0 : -1}
              className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center text-[var(--on-vangi)] transition-colors hover:text-[var(--zari-gold-400)] sm:ml-4 lg:hidden"
              aria-label={tHeader('openMenu')}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="loom-selvedge loom-selvedge--madder" aria-hidden="true" />
      </div>

      {mobileMenuOpen ? (
        <div className="fixed inset-x-0 top-0 bottom-0 z-[60] overflow-y-auto bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
            <span className="flex items-center gap-2">
              <CouncilSeal size={32} />
              <span className="font-display text-base font-semibold text-[var(--portal-blue-900)]">
                {tHeader('paithanMunicipalCouncil')}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-sm text-[var(--civic-slate-700)] transition-colors hover:bg-[var(--saffron-100)]"
              aria-label={tHeader('closeMenu')}
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="px-4 py-3">
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
              className="flex items-center gap-2 border-b border-[var(--border-subtle)] py-2.5 text-sm font-semibold text-[var(--portal-blue-900)]"
            >
              <WovenDiamond className="h-4 w-4 text-[var(--saffron-700)]" />
              {t('home')}
            </Link>

            {WINGS.map((wing) => {
              const Mark = wing.mark;
              return (
                <div key={wing.id} className="border-b border-[var(--border-subtle)] py-2.5">
                  <p className="flex items-center gap-1.5 font-display text-base font-semibold text-[var(--portal-blue-900)]">
                    <Mark className="h-4 w-4 text-[var(--saffron-700)]" />
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
                {isStaff ? (
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
                        alt={session.user.name || 'User'}
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
    </>
  );
}

export { Header };
