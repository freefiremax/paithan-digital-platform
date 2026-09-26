"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { CouncilSeal } from "@/components/layout/CouncilSeal";
import { StateEmblem } from "@/components/ui/StateEmblem";

type Wing = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: { href: string; label: string }[];
};

const WINGS: Wing[] = [
  {
    id: "nagar-parishad",
    label: "Nagar Parishad",
    icon: Building2,
    items: [
      { href: "/nagar-parishad", label: "About the municipal council" },
      { href: "/nagar-parishad/representatives", label: "Public representatives (MLA, MP, CEO)" },
      { href: "/nagar-parishad/ward-map", label: "17 wards & corporator roster" },
      { href: "/nagar-parishad/nagar-sevak", label: "Ward-wise nagar sevaks" },
      { href: "/nagar-parishad/development-works", label: "Development works register" },
      { href: "/nagar-parishad/projects", label: "Major municipal projects" },
      { href: "/nagar-parishad/notifications", label: "Official notices & tenders" },
    ],
  },
  {
    id: "heritage",
    label: "Heritage & Culture",
    icon: Landmark,
    items: [
      { href: "/heritage/museum", label: "Dr. Balasaheb Patil Museum" },
      { href: "/heritage/artifacts", label: "Satavahana coins & artifacts" },
      { href: "/heritage/3d-models", label: "3D artifact models" },
      { href: "/heritage/history", label: "Ancient Pratishthana history" },
      { href: "/heritage/cultural-heritage", label: "Paithani sarees & Sant Eknath" },
    ],
  },
  {
    id: "tourism",
    label: "Tourism & Places",
    icon: Compass,
    items: [
      { href: "/tourism/jayakwadi", label: "Jayakwadi Dam" },
      { href: "/tourism/nath-sagar", label: "Nath Sagar & bird sanctuary" },
      { href: "/tourism/places-to-visit", label: "Places to visit in Paithan" },
      { href: "/tourism/heritage-sites", label: "Samadhi mandir & temples" },
      { href: "/tourism/routes", label: "1-day & pilgrim routes" },
      { href: "/tourism/map", label: "Tourist map & directions" },
    ],
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openWing, setOpenWing] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  /*
   * The dropdown panels open on hover *and* on click/Enter, because a hover-only
   * menu is unreachable by keyboard. Escape closes, and a click outside closes,
   * so the panel never strands focus.
   */
  useEffect(() => {
    if (!openWing) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenWing(null);
    };
    const onPointerDown = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenWing(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [openWing]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* 1. Utility bar — state helpline, DMA, language. The deepest madder, so
          the band below it steps lighter and the two read as separate. */}
      <div className="gov-top-bar border-b border-[var(--on-vangi-rule)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <StateEmblem size={16} invert />
                Government of Maharashtra
              </span>
              <span className="hidden text-[var(--on-vangi-rule)] sm:inline" aria-hidden="true">
                |
              </span>
              <span className="hidden text-[var(--on-vangi-muted)] sm:inline">
                Directorate of Municipal Administration
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[var(--on-vangi-muted)]">
              <a
                href="tel:02431223010"
                className="inline-flex items-center gap-1 hover:text-[var(--saffron-500)]"
              >
                <Phone className="h-3 w-3" aria-hidden="true" />
                <span className="tabular-nums">Helpline 02431-223010</span>
              </a>
              <a
                href="mailto:munptn@gmail.com"
                className="hidden items-center gap-1 hover:text-[var(--saffron-500)] md:inline-flex"
              >
                <Mail className="h-3 w-3" aria-hidden="true" />
                <span>munptn@gmail.com</span>
              </a>
              <span className="inline-flex items-center rounded-sm border border-[var(--on-vangi-rule)] px-1.5 py-0.5 text-[10px]">
                <span className="font-bold text-[var(--saffron-100)]">EN</span>
                <span className="mx-0.5 text-[var(--on-vangi-rule)]" aria-hidden="true">
                  /
                </span>
                <button type="button" className="hover:text-[var(--saffron-500)]" lang="mr">
                  मराठी
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Council identity on paper. The name is set in the display serif,
          because this is the one line on the page that names the institution. */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-white)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <CouncilSeal size={56} />
              <span>
                <span className="block text-[11px] font-medium text-[var(--civic-slate-500)] sm:text-xs">
                  Chhatrapati Sambhajinagar district, Maharashtra
                </span>
                <span className="block font-display text-xl font-semibold leading-tight tracking-tight text-[var(--portal-blue-900)] sm:text-[1.7rem]">
                  Paithan Municipal Council
                </span>
                <span
                  lang="mr"
                  className="block font-display-deva text-sm text-[var(--civic-slate-700)]"
                >
                  पैठण नगर परिषद · स्थापना १८५४
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/chatbot"
                className="hidden items-center gap-2 rounded-sm border border-[var(--portal-blue-700)] bg-[var(--bg-surface-white)] px-3.5 py-2 text-xs font-semibold text-[var(--portal-blue-800)] transition-colors hover:bg-[var(--portal-blue-800)] hover:text-[var(--saffron-100)] lg:inline-flex"
              >
                <Bot className="h-4 w-4" aria-hidden="true" />
                <span>Ask about Paithan</span>
              </Link>

              <a
                href="tel:02431223010"
                aria-label="Call the civic control room, 02431-223010"
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-[var(--border-strong)] bg-[var(--saffron-100)] text-[var(--saffron-700)] transition-colors hover:bg-[var(--saffron-500)] lg:hidden"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                href="/chatbot"
                aria-label="Ask about Paithan"
                className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--portal-blue-50)] text-[var(--portal-blue-800)] transition-colors hover:bg-[var(--portal-blue-100)] lg:hidden"
              >
                <Bot className="h-4 w-4" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center rounded-sm text-[var(--civic-slate-700)] transition-colors hover:bg-[var(--saffron-100)] lg:hidden"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
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

      {/* 3. Primary navigation. Peacock ground — the one cool band in the header,
          so the crimson identity row above it does not run together with the
          crimson notice panel further down the page — and a zari underline on
          hover, the accent marking the current position instead of flooding the
          whole band with it. */}
      <div ref={navRef} className="gov-nav-bar hidden lg:block">
        <nav aria-label="Primary" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm font-medium">
            <ul className="flex items-center">
              <li>
                <Link
                  href="/"
                  className="block border-b-2 border-transparent px-3.5 py-2.5 text-[var(--on-vangi)] transition-colors hover:border-[var(--saffron-500)] hover:bg-[var(--portal-blue-900)]"
                >
                  Home
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
                          ? "border-[var(--saffron-500)] bg-[var(--portal-blue-900)]"
                          : "border-transparent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{wing.label}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    <div
                      className={`absolute left-0 top-full w-64 overflow-hidden rounded-b-sm border border-t-0 border-[var(--border-strong)] bg-[var(--bg-surface-white)] py-1 shadow-lg ${
                        isOpen ? "block" : "hidden"
                      }`}
                    >
                      {wing.items.map((item, index) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenWing(null)}
                          className={`block border-l-2 px-4 py-2 text-[13px] text-[var(--civic-slate-700)] transition-colors hover:border-[var(--saffron-500)] hover:bg-[var(--portal-blue-50)] hover:text-[var(--portal-blue-900)] ${
                            index === 0
                              ? "border-l-[var(--portal-blue-700)] font-semibold text-[var(--portal-blue-900)]"
                              : "border-l-transparent"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </li>
                );
              })}

              <li>
                <Link
                  href="/nagar-parishad/notifications"
                  className="inline-flex items-center gap-1.5 border-b-2 border-transparent px-3.5 py-2.5 text-[var(--on-vangi)] transition-colors hover:border-[var(--saffron-500)] hover:bg-[var(--portal-blue-900)]"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  <span>Notices &amp; Tenders</span>
                </Link>
              </li>
            </ul>

            <Link
              href="/admin/login"
              className="rounded-sm border border-[var(--on-vangi-rule)] px-3 py-1.5 text-xs text-[var(--on-vangi-muted)] transition-colors hover:border-[var(--saffron-500)] hover:bg-[var(--saffron-500)] hover:text-[var(--portal-blue-900)]"
            >
              Council admin
            </Link>
          </div>
        </nav>
        {/* The zari thread along the foot of the navigation. */}
        <div className="zari-rule" aria-hidden="true" />
      </div>

      {/* 4. Mobile drawer */}
      {mobileMenuOpen ? (
        <div className="max-h-[70vh] overflow-y-auto border-t border-[var(--border-subtle)] bg-white lg:hidden">
          <nav aria-label="Mobile" className="px-4 py-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b border-[var(--border-subtle)] py-2.5 text-sm font-semibold text-[var(--portal-blue-900)]"
            >
              Home
            </Link>

            {WINGS.map((wing) => {
              const Icon = wing.icon;
              return (
                <div key={wing.id} className="border-b border-[var(--border-subtle)] py-2.5">
                  <p className="flex items-center gap-1.5 font-display text-base font-semibold text-[var(--portal-blue-900)]">
                    <Icon className="h-4 w-4 text-[var(--saffron-700)]" aria-hidden="true" />
                    {wing.label}
                  </p>
                  <ul className="mt-1 space-y-0.5 pl-5">
                    {wing.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 text-[13px] text-[var(--civic-slate-700)]"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <div className="flex items-center justify-between gap-3 pt-3">
              <Link
                href="/chatbot"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--saffron-700)]"
              >
                <Bot className="h-4 w-4" aria-hidden="true" />
                <span>Ask about Paithan</span>
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-[var(--portal-blue-700)]"
              >
                Council admin
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export { Header };
