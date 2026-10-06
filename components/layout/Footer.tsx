"use client";

import React from "react";
import Link from "next/link";
import { Phone, MapPin, ExternalLink, Clock, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { StateEmblem } from "@/components/ui/StateEmblem";

export default function Footer() {
  const t = useTranslations("footer");
  const tHeader = useTranslations("header");

  return (
    <footer className="border-t-[3px] border-[var(--saffron-500)] bg-[var(--footer-bg)] text-[var(--on-vangi-muted)]">
      {/* 1. TOP STATUTORY BAR: Emergency Helplines */}
      <div className="border-b border-[var(--on-vangi-rule)] bg-[var(--vangi-850)] px-4 py-2.5 text-xs sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
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

      {/* 2. MAIN FOOTER GRID */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 text-xs md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Col 1: Council Address & Office Hours */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--saffron-500)] bg-[var(--portal-blue-800)] font-bold text-[var(--saffron-500)]"
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
          <p className="leading-relaxed text-[var(--on-vangi-muted)]">
            {t("councilDesc")}
          </p>
          <div className="space-y-1.5 pt-1 text-[var(--on-vangi-muted)]">
            <div className="flex items-start gap-2">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--saffron-500)]"
                aria-hidden="true"
              />
              <span>
                {t("address")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock
                className="h-3.5 w-3.5 shrink-0 text-[var(--saffron-500)]"
                aria-hidden="true"
              />
              <span>{t("officeHours")}</span>
            </div>
          </div>
        </div>

        {/* Col 2: Citizen Civic Services */}
        <nav className="space-y-3" aria-labelledby="footer-services">
          <h4
            id="footer-services"
            className="border-b border-[var(--on-vangi-rule)] pb-1.5 text-xs font-bold text-white"
          >
            {t("civicServicesTitle")}
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://paithanmahaulb.maharashtra.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--saffron-500)]"
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
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--saffron-500)]"
              >
                <span>{t("crsRegistration")}</span>
                <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            </li>
            <li>
              <Link
                href="/nagar-parishad/development-works"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                {t("devWorksStatus")}
              </Link>
            </li>
            <li>
              <Link
                href="/nagar-parishad/ward-map"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                {t("wardMapDir")}
              </Link>
            </li>
            <li>
              <Link
                href="/nagar-parishad/notifications"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                {t("eTenders")}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Col 3: Heritage & Tourism Wings */}
        <nav className="space-y-3" aria-labelledby="footer-heritage">
          <h4
            id="footer-heritage"
            className="border-b border-[var(--on-vangi-rule)] pb-1.5 text-xs font-bold text-white"
          >
            {t("heritagePortalsTitle")}
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/heritage/museum"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                {t("museumLink")}
              </Link>
            </li>
            <li>
              <Link
                href="/heritage/history"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                {t("historyLink")}
              </Link>
            </li>
            <li>
              <Link
                href="/heritage/cultural-heritage"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                {t("paithaniLink")}
              </Link>
            </li>
            <li>
              <Link
                href="/tourism/jayakwadi"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                {t("jayakwadiLink")}
              </Link>
            </li>
            <li>
              <Link
                href="/tourism/nath-sagar"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                {t("nathSagarLink")}
              </Link>
            </li>
            <li>
              <Link
                href="/tourism/routes"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                {t("routesLink")}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Col 4: Official State Portals */}
        <nav className="space-y-3" aria-labelledby="footer-gov">
          <h4
            id="footer-gov"
            className="flex items-center gap-2 border-b border-[var(--on-vangi-rule)] pb-1.5 text-xs font-bold text-white"
          >
            <StateEmblem size={16} invert />
            <span>{t("govLinksTitle")}</span>
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://aaplesarkar.mahaonline.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--saffron-500)]"
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
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--saffron-500)]"
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
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--saffron-500)]"
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
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--saffron-500)]"
              >
                <span>{t("mahaTenders")}</span>
                <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            </li>
            <li>
              <Link
                href="/chatbot"
                className="font-semibold text-[var(--saffron-500)] transition-colors hover:text-[var(--saffron-600)]"
              >
                {t("aiAssistant")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* 3. STATUTORY FOOTER: Disclaimers & Copyright */}
      <div className="border-t border-[var(--on-vangi-rule)] px-4 py-4 text-[11px] lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="flex items-center gap-3">
            <p>
              &copy; {new Date().getFullYear()} {t("copyrightText")}
            </p>
            <span className="inline-flex items-center gap-1 rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/30 font-medium">
              <ShieldCheck className="h-3 w-3" />
              {t("protectedBy")}
            </span>
          </div>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/policies/privacy" className="hover:text-[var(--saffron-500)]">{t("privacyPolicy")}</Link>
            <Link href="/policies/terms" className="hover:text-[var(--saffron-500)]">{t("termsConditions")}</Link>
            <Link href="/policies/copyright" className="hover:text-[var(--saffron-500)]">{t("copyrightPolicy")}</Link>
            <Link href="/policies/hyperlinking" className="hover:text-[var(--saffron-500)]">{t("hyperlinkingPolicy")}</Link>
            <Link href="/policies/disclaimer" className="hover:text-[var(--saffron-500)]">{t("disclaimer")}</Link>
            <Link href="/policies/accessibility" className="hover:text-[var(--saffron-500)]">{t("accessibilityStatement")}</Link>
            <span>{t("rti")}</span>
            <span>{t("citizenCharter")}</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export { Footer };

