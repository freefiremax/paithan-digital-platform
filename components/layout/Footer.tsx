"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Clock,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const tHeader = useTranslations("header");

  return (
    <footer className="site-footer border-t-0 text-[var(--on-vangi-muted)]">
      {/* The selvedge: the woven edge that closes the page, in place of a plain
          coloured border. */}
      <span className="site-footer__selvedge block" aria-hidden="true" />

      {/* 1. STATUTORY BAR: Emergency Helplines — a ruled strip, not a band. */}
      <div className="border-b border-[color-mix(in_srgb,var(--saffron-500)_30%,transparent)] px-4 py-2 text-[11px] sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="flex items-center gap-2 font-semibold text-[var(--saffron-500)]">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t("emergencyServices")}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
            <span>
              {t("municipalOffice")}:{" "}
              <strong className="text-white tabular-nums">02431-223010</strong>
            </span>
            <span>
              {t("waterSupply")}:{" "}
              <strong className="text-white tabular-nums">02431-223015</strong>
            </span>
            <span>
              {t("police")}: <strong className="text-white tabular-nums">112 / 02431-223033</strong>
            </span>
            <span>
              {t("hospital")}: <strong className="text-white tabular-nums">108 / 02431-223040</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER GRID — ruled columns in the register grammar. */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-5 px-4 py-6 text-xs md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Col 1: Council Address & Office Hours */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--saffron-500)] bg-[var(--portal-blue-800)] font-bold text-[var(--saffron-500)]"
              aria-hidden="true"
            >
              <span lang="mr">पै</span>
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">{tHeader("paithanMunicipalCouncil")}</h3>
              <p lang="mr" className="text-[11px] text-[var(--saffron-500)]">
                {tHeader("paithanNagarParishad")}
              </p>
            </div>
          </div>
          <p className="leading-relaxed text-[var(--on-vangi-muted)]">{t("councilDesc")}</p>
          <p className="border-l-2 border-[var(--saffron-500)] pl-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--saffron-500)]">
            {tHeader("topbarTagline")}
          </p>
          <p className="-mt-1.5 text-[11px] text-[var(--on-vangi-muted)]">
            {tHeader("topbarSub")}
          </p>
          <div className="space-y-1.5 pt-1 text-[var(--on-vangi-muted)]">
            <div className="flex items-start gap-2">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--saffron-500)]"
                aria-hidden="true"
              />
              <span>{t("address")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock
                className="h-3.5 w-3.5 shrink-0 text-[var(--saffron-500)]"
                aria-hidden="true"
              />
              <span>{t("officeHours")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail
                className="h-3.5 w-3.5 shrink-0 text-[var(--saffron-500)]"
                aria-hidden="true"
              />
              <a
                href="mailto:munptn@gmail.com"
                className="site-footer__link"
              >
                {tHeader("email")}
              </a>
            </div>
          </div>
        </div>

        {/* Col 2: Citizen Civic Services */}
        <nav className="space-y-0" aria-labelledby="footer-services">
          <h4 id="footer-services" className="site-footer__heading">
            {t("civicServicesTitle")}
          </h4>
          <ul className="space-y-1.5">
            <li>
              <a
                href="https://paithanmahaulb.maharashtra.gov.in"
                target="_blank"
                rel="noreferrer"
                className="site-footer__link inline-flex items-center gap-1"
              >
                <span>{t("onlineTax")}</span>
                <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href="https://crsorgi.gov.in"
                target="_blank"
                rel="noreferrer"
                className="site-footer__link inline-flex items-center gap-1"
              >
                <span>{t("crsRegistration")}</span>
                <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            </li>
            <li>
              <Link href="/nagar-parishad/development-works" className="site-footer__link">
                {t("devWorksStatus")}
              </Link>
            </li>
            <li>
              <Link href="/nagar-parishad/ward-map" className="site-footer__link">
                {t("wardMapDir")}
              </Link>
            </li>
            <li>
              <Link href="/nagar-parishad/notifications" className="site-footer__link">
                {t("eTenders")}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Col 3: Heritage & Tourism Wings */}
        <nav className="space-y-0" aria-labelledby="footer-heritage">
          <h4 id="footer-heritage" className="site-footer__heading">
            {t("heritagePortalsTitle")}
          </h4>
          <ul className="space-y-1.5">
            <li>
              <Link href="/heritage/museum" className="site-footer__link">
                {t("museumLink")}
              </Link>
            </li>
            <li>
              <Link href="/heritage/history" className="site-footer__link">
                {t("historyLink")}
              </Link>
            </li>
            <li>
              <Link href="/heritage/cultural-heritage" className="site-footer__link">
                {t("paithaniLink")}
              </Link>
            </li>
            <li>
              <Link href="/tourism/jayakwadi" className="site-footer__link">
                {t("jayakwadiLink")}
              </Link>
            </li>
            <li>
              <Link href="/tourism/nath-sagar" className="site-footer__link">
                {t("nathSagarLink")}
              </Link>
            </li>
            <li>
              <Link href="/tourism/routes" className="site-footer__link">
                {t("routesLink")}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Col 4: External portal links. */}
        <nav className="space-y-0" aria-labelledby="footer-gov">
          <h4 id="footer-gov" className="site-footer__heading">
            {t("govLinksTitle")}
          </h4>
          <ul className="space-y-1.5">
            <li>
              <a
                href="https://aaplesarkar.mahaonline.gov.in"
                target="_blank"
                rel="noreferrer"
                className="site-footer__link inline-flex items-center gap-1"
              >
                <span>{t("aapleSarkar")}</span>
                <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href="https://maharashtra.gov.in"
                target="_blank"
                rel="noreferrer"
                className="site-footer__link inline-flex items-center gap-1"
              >
                <span>{t("mahaGov")}</span>
                <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href="https://aurangabad.gov.in"
                target="_blank"
                rel="noreferrer"
                className="site-footer__link inline-flex items-center gap-1"
              >
                <span>{t("districtPortal")}</span>
                <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href="https://mahatenders.gov.in"
                target="_blank"
                rel="noreferrer"
                className="site-footer__link inline-flex items-center gap-1"
              >
                <span>{t("mahaTenders")}</span>
                <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            </li>
            <li>
              <Link
                href="/chatbot"
                className="site-footer__link font-semibold text-[var(--saffron-500)]"
              >
                {t("aiAssistant")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* 3. THE COMMISSION PLATE — the one highlighted piece: an invitation to
          have a portal like this built, with the studio's contact details. */}
      <div className="mx-auto max-w-6xl px-4 pb-6 lg:px-8">
        <div className="commission-plate px-4 py-4 sm:px-6 sm:py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="commission-plate__eyebrow">{t("buildEyebrow")}</p>
              <h3 className="commission-plate__title mt-1.5">{t("buildTitle")}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--on-vangi-muted)]">
                {t("buildDesc")}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1.5 lg:justify-end">
              <a
                href="https://www.revenex.in"
                target="_blank"
                rel="noreferrer"
                className="commission-plate__contact"
              >
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t("buildCta")}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
              </a>
              <a href="mailto:team@revenex.in" className="commission-plate__contact">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t("buildEmail")}</span>
              </a>
              <a href="tel:+919021744355" className="commission-plate__contact">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="tabular-nums">{t("buildPhone")}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. STATUTORY FOOTER: Disclaimers & Copyright */}
      <div className="border-t border-[var(--on-vangi-rule)] px-4 py-3 text-[11px] lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="flex flex-wrap items-center gap-3">
            <p>
              &copy; {new Date().getFullYear()} {t("copyrightText")}
            </p>
            <p className="text-[var(--on-vangi-muted)]">
              {t("builtBy")}{" "}
              <a
                href="https://www.revenex.in"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[var(--saffron-500)] hover:text-[var(--saffron-600)]"
              >
                Revenex Ventures
              </a>
            </p>
          </div>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/policies/privacy" className="site-footer__link">{t("privacyPolicy")}</Link>
            <Link href="/policies/terms" className="site-footer__link">{t("termsConditions")}</Link>
            <Link href="/policies/copyright" className="site-footer__link">{t("copyrightPolicy")}</Link>
            <Link href="/policies/hyperlinking" className="site-footer__link">{t("hyperlinkingPolicy")}</Link>
            <Link href="/policies/disclaimer" className="site-footer__link">{t("disclaimer")}</Link>
            <Link href="/policies/accessibility" className="site-footer__link">{t("accessibilityStatement")}</Link>
            <span>{t("rti")}</span>
            <span>{t("citizenCharter")}</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export { Footer };

