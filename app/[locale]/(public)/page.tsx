"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Landmark,
  Compass,
  FileText,
  Phone,
  ArrowRight,
  CheckCircle2,
  Eye,
  ArrowUpRight,
  MapPin,
  CreditCard,
  Camera,


} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { NotificationCategoryBadge } from "@/components/ui/NotificationCategoryBadge";
import {
  ButiOrnament,
  SectionFinial,
  FigureMount,
} from "@/components/ui/HistoricMotifs";
import { HomeVideoBand } from "@/components/layout/HomeVideoBand";
import { RepresentativesShowcase } from "@/components/home/RepresentativesShowcase";
import { PaithanWardMap } from "@/components/home/PaithanWardMap";
import { Reveal } from "@/components/ui/Reveal";
import {
  councilProfile,
  developmentWorks,
  electedRepresentatives,
  formatCivicDate,
  notifications,
  paithanDemographics,
  TOURIST_PLACES,
} from "@/lib/mock-data";

/** Newest notices first — the ledger reads like a register, most recent at the top. */
const ledgerEntries = [...notifications].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt)
);

export default function HomePage() {
  const tHome = useTranslations("home");

  return (
    <div className="home-page">
      {/* The hero video band pins on a sticky rail; the civic content sheet then
          scrolls up over it as a plain overlay. No cut effect here — the
          slice/reveal treatment is reserved for the representatives (MLA/MP)
          pages. See `.home-hero-rail` and `.home-sheet` in globals.css. */}
      <div className="home-hero-rail">
        <HomeVideoBand />
      </div>

      <div className="home-sheet">
        <span className="home-sheet__edge" aria-hidden="true" />
        <RepresentativesShowcase />
        <Reveal>
          <Masthead />
        </Reveal>
        <Reveal>
          <CitizenServicesSection />
        </Reveal>

        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
            <SectionFinial className="-mt-6 mb-6 lg:-mt-8 lg:mb-8" />
            <div className="grid gap-10 lg:grid-cols-12">
              {/* LEFT: TENDERS & PUBLIC NOTICES */}
              <section className="lg:col-span-8 flex flex-col" aria-labelledby="notices-heading">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <ButiOrnament className="h-8 w-4 shrink-0 text-[var(--saffron-700)]" />
                      <h2
                        id="notices-heading"
                        className="portal-rule font-display text-2xl font-semibold text-[var(--portal-blue-900)]"
                      >
                        {tHome("noticesHeading")}
                      </h2>
                    </div>
                    <p className="mt-1.5 text-sm text-[var(--civic-slate-700)] max-w-2xl leading-relaxed">
                      {tHome("noticesSubtitle")}
                    </p>
                  </div>
                  <Link
                    href="/nagar-parishad/notifications"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--portal-blue-700)] hover:underline shrink-0"
                  >
                    <span>{tHome("allNotifications")}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>

                <NoticeLedger />
              </section>

              {/* RIGHT: THE COUNCIL SIDEBAR */}
              <aside className="lg:col-span-4 flex flex-col gap-6">
                <CouncilPanel />
              </aside>
            </div>
        </Reveal>

        <Reveal>
          <PaithanWardMap />
        </Reveal>
        <Reveal>
          <OfficialLandmarksShowcase />
        </Reveal>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Masthead() {
  const tHome = useTranslations("home");
  const locale = useLocale();

  const WINGS = [
    {
      key: "civic",
      title: tHome("wingCivicTitle"),
      titleMr: tHome("wingCivicTitleMr"),
      blurb: tHome("wingCivicBlurb"),
      facts: tHome("wingCivicFacts"),
      links: [
        { label: tHome("wingCivicLink1"), href: "/nagar-parishad/representatives" },
        { label: tHome("wingCivicLink2"), href: "/nagar-parishad/ward-map" },
        { label: tHome("wingCivicLink3"), href: "/nagar-parishad/development-works" },
        { label: tHome("wingCivicLink4"), href: "/nagar-parishad/notifications" },
      ],
    },
    {
      key: "heritage",
      title: tHome("wingHeritageTitle"),
      titleMr: tHome("wingHeritageTitleMr"),
      blurb: tHome("wingHeritageBlurb"),
      facts: tHome("wingHeritageFacts"),
      links: [
        { label: tHome("wingHeritageLink1"), href: "/heritage/museum" },
        { label: tHome("wingHeritageLink2"), href: "/heritage/artifacts" },
        { label: tHome("wingHeritageLink3"), href: "/heritage/history" },
        { label: tHome("wingHeritageLink4"), href: "/heritage/cultural-heritage" },
      ],
    },
    {
      key: "tourism",
      title: tHome("wingTourismTitle"),
      titleMr: tHome("wingTourismTitleMr"),
      blurb: tHome("wingTourismBlurb"),
      facts: tHome("wingTourismFacts"),
      links: [
        { label: tHome("wingTourismLink1"), href: "/tourism/jayakwadi" },
        { label: tHome("wingTourismLink2"), href: "/tourism/nath-sagar" },
        { label: tHome("wingTourismLink3"), href: "/tourism/heritage-sites" },
        { label: tHome("wingTourismLink4"), href: "/tourism/routes" },
      ],
    },
  ];

  return (
    <>
      <section className="portal-masthead">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
          <Reveal variant="weave">
          <div className="welcome-plate">
            <span className="welcome-plate__border" aria-hidden="true" />

            <span className="pointer-events-none absolute right-3 top-3 opacity-40 sm:right-5 sm:top-5" aria-hidden="true">
              <ButiOrnament className="h-10 w-6 text-[var(--zari-gold-500)] sm:h-14 sm:w-8" />
            </span>
            <span className="pointer-events-none absolute bottom-3 left-3 rotate-180 opacity-40 sm:bottom-5 sm:left-5" aria-hidden="true">
              <ButiOrnament className="h-10 w-6 text-[var(--zari-gold-500)] sm:h-14 sm:w-8" />
            </span>

            <div className="relative">
              <header className="welcome-plate__head">
                <p className="welcome-plate__eyebrow">
                  {locale === "mr" ? "पैठण" : locale === "hi" ? "पैठण" : "Welcome to Paithan"}
                </p>
                <span className="welcome-plate__ornament" aria-hidden="true">
                  <ButiOrnament className="h-7 w-4 text-[var(--zari-gold-500)]" />
                </span>
              </header>

              <p className="welcome-plate__lede">
                <span className="welcome-plate__dropcap" aria-hidden="true">P</span>
                aithan is a municipal town of 17 wards in Chhatrapati Sambhajinagar district, and the ancient Pratishthana — capital of the Satavahanas, and home of the Paithani weavers. The council publishes its records, the town&apos;s heritage and its visitor information here.
              </p>

              <aside className="welcome-plate__aside">
                <p className="welcome-plate__aside-title">
                  {locale === "mr"
                    ? "दोन हजार वर्षांचा वारसा"
                    : locale === "hi"
                      ? "दो हज़ार वर्षों की विरासत"
                      : "A town of two thousand years"}
                </p>
                <p className="welcome-plate__lore-text">
                  Pratishthana was the capital of the Satavahanas, and King Hala&apos;s Gaha Sattasai is still sung here after two thousand years. The cloth woven in this town carries the GI tag, and the peepal at the kund has not moved since the Satavahanas.
                </p>
              </aside>
            </div>
          </div>
          </Reveal>
        </div>
        <div className="paithani-band mt-12" aria-hidden="true" />
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid gap-5 md:grid-cols-3">
          {WINGS.map((wing) => (
            <article
              key={wing.key}
              className={`portal-card ${
                wing.key === "heritage"
                  ? "portal-card--heritage"
                  : wing.key === "tourism"
                    ? "portal-card--tourism"
                    : ""
              }`}
            >
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm ${
                      wing.key === "civic"
                        ? "bg-[var(--portal-blue-50)] text-[var(--portal-blue-800)]"
                        : wing.key === "heritage"
                          ? "bg-[var(--zari-gold-100)] text-[var(--zari-gold-600)]"
                          : "bg-[var(--paithani-red-light)] text-[var(--paithani-red)]"
                    }`}
                  >
                    {wing.key === "civic" ? (
                      <Building2 className="h-4 w-4" aria-hidden="true" />
                    ) : wing.key === "heritage" ? (
                      <Landmark className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Compass className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold leading-tight text-[var(--portal-blue-900)]">
                      {wing.title}
                    </h2>
                    <span lang="mr" className="text-xs text-[var(--civic-slate-500)]">
                      {wing.titleMr}
                    </span>
                  </div>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-[var(--civic-slate-700)]">
                  {wing.blurb}
                </p>

                <ul className="mt-auto">
                  {wing.links.map((link) => (
                    <li
                      key={link.href + link.label}
                      className="border-t border-[var(--border-subtle)]"
                    >
                      <Link
                        href={link.href}
                        className="block py-2 text-sm font-medium text-[var(--portal-blue-800)] hover:text-[var(--zari-gold-600)] hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="flex items-center gap-1.5 border-t border-[var(--border-subtle)] bg-[var(--zari-gold-100)]/40 px-5 py-2.5 text-xs font-medium text-[var(--civic-slate-700)]">
                <CheckCircle2
                  className="h-3.5 w-3.5 shrink-0 text-[var(--zari-gold-600)]"
                  aria-hidden="true"
                />
                {wing.facts}
              </p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function CitizenServicesSection() {
  const tHome = useTranslations("home");
  const tHeader = useTranslations("header");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full mt-12 mb-14">
      {/* Mobile emergency quick bar */}
      <div className="sm:hidden mb-4 grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-[var(--border-subtle)] bg-[var(--border-subtle)]">
        <a
          href="tel:02431223010"
          className="flex min-h-[56px] flex-col items-center justify-center gap-0.5 bg-white px-1 py-2 text-center hover:bg-[var(--portal-blue-50)]"
        >
          <span className="flex items-center gap-1 text-xs font-bold text-[var(--portal-blue-900)]">
            <Building2 className="h-3.5 w-3.5 text-[var(--zari-gold-600)]" aria-hidden="true" />
            {tHeader("paithanNagarParishad")}
          </span>
          <span className="text-[11px] text-[var(--civic-slate-500)] tabular-nums">02431-223010</span>
        </a>
        <a
          href="tel:112"
          className="flex min-h-[56px] flex-col items-center justify-center gap-0.5 bg-white px-1 py-2 text-center hover:bg-[var(--portal-blue-50)]"
        >
          <span className="flex items-center gap-1 text-xs font-bold text-red-800">
            <Phone className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />
            112
          </span>
          <span className="text-[11px] text-[var(--civic-slate-500)] tabular-nums">112 / 223033</span>
        </a>
        <a
          href="tel:108"
          className="flex min-h-[56px] flex-col items-center justify-center gap-0.5 bg-white px-1 py-2 text-center hover:bg-[var(--portal-blue-50)]"
        >
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-800">
            <Phone className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            108
          </span>
          <span className="text-[11px] text-[var(--civic-slate-500)] tabular-nums">108 / 223040</span>
        </a>
      </div>

      <div className="rounded-sm border border-[var(--border-subtle)] bg-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2.5">
            <ButiOrnament className="h-7 w-4 shrink-0 text-[var(--zari-gold-600)]" />
            <h2 className="portal-rule font-display text-xl font-semibold text-[var(--portal-blue-900)]">
              {tHome("servicesHeading")}
            </h2>
          </div>
          <p className="text-xs text-[var(--civic-slate-500)]">
            {tHome("servicesSubtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceCard
            icon={<CreditCard className="h-5 w-5" aria-hidden="true" />}
            iconClass="bg-[var(--zari-gold-100)] text-[var(--zari-gold-600)]"
            title={tHome("propertyTaxTitle")}
            body={tHome("propertyTaxDesc")}
            href="https://paithanmahaulb.maharashtra.gov.in"
            action={tHome("payOnline")}
            external
          />
          <ServiceCard
            icon={<FileText className="h-5 w-5" aria-hidden="true" />}
            iconClass="bg-[var(--portal-blue-50)] text-[var(--portal-blue-700)]"
            title={tHome("certificatesTitle")}
            body={tHome("certificatesDesc")}
            href="https://crsorgi.gov.in"
            action={tHome("applyOnline")}
            external
          />
          <ServiceCard
            icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
            iconClass="bg-[var(--portal-blue-50)] text-[var(--portal-blue-800)]"
            title={tHome("wardsOverviewHeading")}
            body={tHome("wardsOverviewSubtitle")}
            href="/nagar-parishad/ward-map"
            action={tHome("openWardMap")}
          />
          <ServiceCard
            icon={<Phone className="h-5 w-5" aria-hidden="true" />}
            iconClass="bg-red-50 text-red-700"
            title={tHome("grievancesTitle")}
            body={tHome("grievancesDesc")}
            href="/grievances/new"
            action={tHome("fileComplaint")}
          />
        </div>
      </div>
    </div>
  );
}

function ServiceCard({
  icon,
  iconClass,
  title,
  body,
  href,
  action,
  footnote,
  external,
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  body: string;
  href: string;
  action: string;
  footnote?: string;
  external?: boolean;
}) {
  const classes =
    "flex flex-col justify-between rounded-sm border border-[var(--border-subtle)] bg-[var(--portal-blue-50)] p-4 transition-colors hover:border-[var(--portal-blue-300)] hover:bg-white";

  const inner = (
    <>
      <div>
        <span
          className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${iconClass}`}
        >
          {icon}
        </span>
        <h3 className="font-display text-base font-semibold text-[var(--portal-blue-900)] mb-1">{title}</h3>
        <p className="text-xs text-[var(--civic-slate-700)] leading-relaxed">{body}</p>
        {footnote ? (
          <p className="mt-2 text-[11px] text-[var(--civic-slate-500)]">{footnote}</p>
        ) : null}
      </div>
      <span className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-2.5 text-xs font-bold text-[var(--portal-blue-700)]">
        {action}
        {external ? (
          <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
      </span>
    </>
  );

  if (href.startsWith("tel:") || external) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */

function NoticeLedger() {
  const tHome = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <div>
      <div className="overflow-x-auto rounded-sm border border-[var(--border-subtle)] bg-white">
        <table className="portal-register">
          <caption className="sr-only">
            {tHome("noticesHeading")}
          </caption>
          <thead>
            <tr>
              <th scope="col">{tHome("publishedOn")}</th>
              <th scope="col">{tCommon("category")}</th>
              <th scope="col">{tCommon("subject")}</th>
              <th scope="col">{tHome("closingDate")}</th>
              <th scope="col" className="text-right">
                {tHome("downloadNotice")}
              </th>
            </tr>
          </thead>
          <tbody>
            {ledgerEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="whitespace-nowrap font-medium">
                  <time dateTime={entry.publishedAt}>{formatCivicDate(entry.publishedAt)}</time>
                </td>
                <td className="whitespace-nowrap">
                  <NotificationCategoryBadge category={entry.category} />
                </td>
                <td className="min-w-[16rem]">
                  <Link
                    href="/nagar-parishad/notifications"
                    className="block font-semibold text-[var(--portal-blue-800)] leading-snug hover:text-[var(--zari-gold-600)] hover:underline"
                  >
                    {entry.title}
                  </Link>
                  <span className="mt-0.5 block text-[11px] text-[var(--civic-slate-500)]">
                    {tHome("refNo")} {entry.referenceNo}
                  </span>
                </td>
                <td className="whitespace-nowrap font-medium">
                  {entry.closingAt ? (
                    <time dateTime={entry.closingAt} className="font-bold text-red-700">
                      {formatCivicDate(entry.closingAt)}
                    </time>
                  ) : (
                    <span className="text-[var(--civic-slate-500)]">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap text-right">
                  <Link
                    href="/nagar-parishad/notifications"
                    className="inline-flex items-center justify-center rounded-sm border border-[var(--border-subtle)] bg-[var(--portal-blue-50)] p-2 text-[var(--portal-blue-800)] transition-colors hover:bg-[var(--portal-blue-800)] hover:text-white"
                    aria-label={`View notice: ${entry.title}`}
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function CouncilPanel() {
  const tHome = useTranslations("home");
  const tNagar = useTranslations("nagarParishad");
  const locale = useLocale();
  const ongoingWorks = developmentWorks.filter((work) => work.status === "ONGOING");

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-sm border border-[var(--border-subtle)] bg-white" aria-labelledby="council-heading">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--zari-gold-100)]/50 px-4 py-2.5">
          <h2 id="council-heading" className="font-display text-base font-semibold text-[var(--portal-blue-900)]">
            {tNagar("representativesTitle")}
          </h2>
        </div>
        <div className="border-b border-[var(--border-subtle)] px-4 py-3 space-y-2">
          <p className="text-xs leading-relaxed text-[var(--civic-slate-700)]">
            Paithan is a municipal town of 17 wards in Chhatrapati Sambhajinagar district, and the ancient Pratishthana — capital of the Satavahanas, and home of the Paithani weavers. The council publishes its records, the town's heritage and its visitor information here.
          </p>
          <p className="text-xs leading-relaxed text-[var(--civic-slate-700)]">
            Pratishthana was the capital of the Satavahanas, and King Hala's Gaha Sattasai is still sung here after two thousand years. The cloth woven in this town carries the GI tag, and the peepal at the kund has not moved since the Satavahanas.
          </p>
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {electedRepresentatives.map((representative) => (
            <Link
              key={representative.slug}
              href={`/${locale}/nagar-parishad/representatives/${representative.id === "rep-mla" ? "mla" : "mp"}`}
              className="block px-4 py-3 transition-colors hover:bg-[var(--zari-gold-100)]/30"
            >
              <span className="block text-sm font-bold text-[var(--portal-blue-900)]">
                {representative.name}
              </span>
              <span className="mt-0.5 block text-xs text-[var(--civic-slate-700)]">
                {representative.designation}
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--zari-gold-600)]">
                {locale === "mr" ? "पूर्ण माहिती" : locale === "hi" ? "पूरी जानकारी" : "Full profile"}
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
        <div className="border-t border-[var(--border-subtle)] bg-[var(--zari-gold-100)]/40 px-4 py-2.5">
          <Link
            href="/nagar-parishad/representatives"
            className="flex items-center justify-between text-xs font-semibold text-[var(--portal-blue-800)] hover:text-[var(--zari-gold-600)]"
          >
            <span>{tHome("wingCivicLink1")}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-sm border border-[var(--border-subtle)] bg-white" aria-labelledby="progress-heading">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--paithani-red-light)]/50 px-4 py-2.5">
          <h2 id="progress-heading" className="font-display text-base font-semibold text-[var(--portal-blue-900)]">
            {tHome("activeProjects")}
          </h2>
          <span className="text-[11px] font-medium text-[var(--civic-slate-500)]">
            {councilProfile.wardCount} {tHome("vitalsWards")}
          </span>
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {ongoingWorks.slice(0, 3).map((work) => (
            <div key={work.id} className="px-4 py-3">
              <p className="text-xs font-semibold leading-snug text-[var(--portal-blue-900)]">
                {work.title}
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--civic-slate-500)]">
                <span className="font-semibold text-[var(--civic-slate-700)]">
                  Ward {work.wardNumber}
                </span>
                <span className="font-bold tabular-nums text-[var(--zari-gold-600)]">
                  {work.progressPct}%
                </span>
              </div>
              <div
                className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]"
                role="progressbar"
                aria-valuenow={work.progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${work.title} progress`}
              >
                <div
                  className="h-full rounded-full bg-[var(--zari-gold-500)]"
                  style={{ width: `${work.progressPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--border-subtle)] bg-[var(--paithani-red-light)]/40 px-4 py-2.5">
          <Link
            href="/nagar-parishad/development-works"
            className="flex items-center justify-between text-xs font-semibold text-[var(--portal-blue-800)] hover:text-[var(--zari-gold-600)]"
          >
            <span>{tHome("viewAllWorks")}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="rounded-sm border border-[var(--border-subtle)] bg-white p-4" aria-labelledby="office-heading">
        <h2 id="office-heading" className="text-sm font-bold text-[var(--portal-blue-900)] mb-2">
          {tHome("councilPanelTitle")}
        </h2>
        <p className="text-xs text-[var(--civic-slate-700)] leading-relaxed">
          {councilProfile.addressLine}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-xs">
          <span className="text-[var(--civic-slate-500)]">{tHome("vitalsControlRoom")}</span>
          <a
            href={`tel:${councilProfile.phone}`}
            className="font-bold tabular-nums text-[var(--portal-blue-800)] hover:text-[var(--zari-gold-600)] hover:underline"
          >
            {councilProfile.phone}
          </a>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** Visual tour of the town's landmarks. */
function OfficialLandmarksShowcase() {
  const tHome = useTranslations("home");

  return (
    <section
      className="border-t border-[var(--border-subtle)] bg-white py-12 lg:py-14"
      aria-labelledby="sites-showcase-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--zari-gold-600)]">
              <Camera className="h-3.5 w-3.5" aria-hidden="true" />
              <span lang="mr">अधिकृत स्थळ दर्शन</span>
            </p>
            <h2
              id="sites-showcase-heading"
              className="portal-rule text-2xl font-bold tracking-tight text-[var(--portal-blue-900)]"
            >
              {tHome("landmarksHeading")}
            </h2>
            <p className="mt-1.5 text-sm text-[var(--civic-slate-700)] max-w-2xl">
              {tHome("landmarksSubtitle")}
            </p>
          </div>

          <Link
            href="/tourism/places-to-visit"
            className="inline-flex items-center gap-2 self-start rounded-sm border border-[var(--portal-blue-800)] bg-[var(--portal-blue-800)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--portal-blue-900)] md:self-auto"
          >
            <span>{tHome("viewDetails")} ({TOURIST_PLACES.length})</span>
            <ArrowRight className="h-4 w-4 text-[var(--saffron-500)]" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <LandmarkFeature place={TOURIST_PLACES[0]} />

          <ul className="grid gap-px overflow-hidden rounded-sm border border-[var(--border-subtle)] bg-[var(--border-subtle)] sm:grid-cols-2 lg:col-span-7">
            {TOURIST_PLACES.slice(1).map((place) => (
              <li key={place.id} className="bg-white">
                <Link
                  href="/tourism/places-to-visit"
                  className="flex h-full items-start gap-3 p-3 transition-colors hover:bg-[var(--portal-blue-50)]"
                >
                  <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-sm bg-[var(--portal-blue-900)]">
                    <Image
                      src={place.imageUrl}
                      alt={place.imageAlt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold leading-snug text-[var(--portal-blue-900)]">
                      {place.nameEn}
                    </span>
                    <span lang="mr" className="mt-0.5 block text-[11px] text-[var(--civic-slate-500)]">
                      {place.nameMr}
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[var(--civic-slate-500)]">
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <MapPin className="h-3 w-3 text-[var(--zari-gold-600)]" aria-hidden="true" />
                        {place.distanceFromBusStand}
                      </span>
                      <span className="tabular-nums">{place.visitingHours}</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function LandmarkFeature({ place }: { place: (typeof TOURIST_PLACES)[number] }) {
  const tHome = useTranslations("home");
  const locale = useLocale();

  return (
    <article className="portal-card overflow-hidden lg:col-span-5">
      <div className="relative h-60 w-full bg-[var(--portal-blue-900)] lg:h-full lg:min-h-[26rem]">
        <Image
          src={place.imageUrl}
          alt={place.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-cover"
        />
        <span className="absolute left-0 top-4 bg-[var(--portal-blue-900)]/90 px-3 py-1 text-xs font-semibold text-[var(--saffron-500)]">
          {place.category.replace(/_/g, " ").toLowerCase()}
        </span>
        <span className="absolute inset-x-3 bottom-3 text-[var(--saffron-100)]">
          <FigureMount className="opacity-70" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-tight text-[var(--portal-blue-900)]">
          {place.nameEn}
        </h3>
        <p lang="mr" className="mt-0.5 text-sm font-medium text-[var(--civic-slate-500)]">
          {place.nameMr}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--civic-slate-700)]">
          {place.tagline}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-[var(--border-subtle)] bg-[var(--border-subtle)] text-xs">
          <div className="bg-[var(--portal-blue-50)] px-3 py-2">
            <dt className="text-[var(--civic-slate-500)]">
              {locale === "mr" ? "बस स्थानकापासून" : locale === "hi" ? "बस स्टैंड से" : "From bus stand"}
            </dt>
            <dd className="mt-0.5 font-bold tabular-nums text-[var(--portal-blue-900)]">
              {place.distanceFromBusStand}
            </dd>
          </div>
          <div className="bg-[var(--portal-blue-50)] px-3 py-2">
            <dt className="text-[var(--civic-slate-500)]">
              {locale === "mr" ? "वेळ" : locale === "hi" ? "समय" : "Visiting Hours"}
            </dt>
            <dd className="mt-0.5 font-bold tabular-nums text-[var(--portal-blue-900)]">
              {place.visitingHours}
            </dd>
          </div>
        </dl>

        <Link
          href="/tourism/places-to-visit"
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[var(--portal-blue-700)] hover:text-[var(--zari-gold-600)]"
        >
          <span>{tHome("viewDetails")}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
