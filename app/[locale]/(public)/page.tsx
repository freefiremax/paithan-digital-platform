"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Phone,
  ArrowRight,
  CheckCircle2,
  Eye,
  ArrowUpRight,
  MapPin,
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
  TOURIST_PLACES,
} from "@/lib/mock-data";

/** Newest notices first — the ledger reads like a register, most recent at the top. */
const ledgerEntries = [...notifications].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt)
);

/*
 * The covering cloth between the welcome plate and the map: seven vertical
 * strips. They rise from the MIDDLE outward, the two strips either side of the
 * centre leading. `order` is the rise position (0 = first), fixed here rather
 * than by DOM index so the middle-out, slightly-random stagger is deterministic
 * and never re-shuffles between renders.
 *
 * Each strip takes an equal share of the row width, and from it the geometry
 * needed to show its own slice of ONE continuous pallu: the image is drawn at the
 * full row width (`row = 100 / w`, as a % of the strip) and shifted so the strip's
 * left edge lands on its true place in the cloth (`shift = -left / w`). The seven
 * windows therefore tile edge to edge into a single unbroken pallu.
 */
const WARD_MAP_STRIP_ORDER = [3, 4, 2, 5, 1, 6, 0];
const STRIP_COUNT = 7;

const CUT_STRIPS = WARD_MAP_STRIP_ORDER.map((index, order) => {
  const w = 1 / STRIP_COUNT;
  const leftFraction = index / STRIP_COUNT;
  return { index, order, row: 100 / w, shift: (-leftFraction / w) * 100 };
});

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
        <div className="plate-pin">
          <div className="plate-pin__sticky">
            <Masthead />
          </div>
          <div className="plate-pin__over">
            <Reveal variant="cut" reversible>
              <div className="cut-layer">
                <PaithanWardMap />
                {/* The covering cloth: seven strips spanning from the top of the
                    map block up over the welcome plate. The plate is visible
                    before, the map after; the strips are the seam between them,
                    cut away as the map rises. */}
                <span className="cut-layer__strips" aria-hidden="true">
                  {CUT_STRIPS.map((strip) => (
                    <span
                      key={strip.index}
                      className="cut-layer__strip"
                      style={
                        {
                          "--strip-row": `${strip.row}%`,
                          "--strip-shift": `${strip.shift}%`,
                          "--strip-order": strip.order,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
        <Reveal>
          <WingsSection />
        </Reveal>
        <Reveal>
          <CitizenServicesSection />
        </Reveal>

        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
            <SectionFinial className="-mt-6 mb-6 lg:-mt-8 lg:mb-8" />
            <div className="grid gap-10 lg:grid-cols-12">
              {/* LEFT: TENDERS & PUBLIC NOTICES */}
              <section className="lg:col-span-8 flex flex-col" aria-labelledby="notices-heading">
                <div className="rec-head">
                  <div>
                    <h2
                      id="notices-heading"
                      className="rec-head__title flex items-center gap-2.5"
                    >
                      <ButiOrnament className="h-6 w-3.5 shrink-0 text-[var(--saffron-700)]" />
                      {tHome("noticesHeading")}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--civic-slate-700)] max-w-2xl leading-relaxed">
                      {tHome("noticesSubtitle")}
                    </p>
                  </div>
                  <Link
                    href="/nagar-parishad/notifications"
                    className="gaz-col__meta inline-flex items-center gap-1.5 self-start text-[var(--portal-blue-800)] hover:text-[var(--zari-gold-600)] sm:self-auto"
                  >
                    <span>{tHome("allNotifications")}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
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
          <OfficialLandmarksShowcase />
        </Reveal>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Masthead() {
  const locale = useLocale();

  return (
    <section className="portal-masthead">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
        <Reveal variant="weave">
          <div className="welcome-plate">
            <span className="welcome-plate__border" aria-hidden="true" />

            <span
              className="pointer-events-none absolute right-3 top-3 opacity-40 sm:right-5 sm:top-5"
              aria-hidden="true"
            >
              <ButiOrnament className="h-10 w-6 text-[var(--zari-gold-500)] sm:h-14 sm:w-8" />
            </span>
            <span
              className="pointer-events-none absolute bottom-3 left-3 rotate-180 opacity-40 sm:bottom-5 sm:left-5"
              aria-hidden="true"
            >
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
  );
}

/* -------------------------------------------------------------------------- */

function WingsSection() {
  const tHome = useTranslations("home");

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="wing-index">
          {WINGS.map((wing, i) => (
            <article
              key={wing.key}
              className={`wing-col ${
                wing.key === "heritage"
                  ? "wing-col--heritage"
                  : wing.key === "tourism"
                    ? "wing-col--tourism"
                    : ""
              }`}
            >
              <span className="wing-col__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="wing-col__weft" aria-hidden="true" />

              <h2 className="wing-col__title">
                {wing.title}
                <span lang="mr" className="wing-col__title-mr">
                  {wing.titleMr}
                </span>
              </h2>

              <p className="wing-col__blurb">{wing.blurb}</p>

              <ul className="wing-col__links">
                {wing.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="wing-col__link">
                      <span>{link.label}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="wing-col__foot">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                {wing.facts}
              </p>
            </article>
          ))}
        </div>
      </div>
  );
}

/* -------------------------------------------------------------------------- */

function CitizenServicesSection() {
  const tHome = useTranslations("home");
  const tHeader = useTranslations("header");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full mt-12 mb-14">
      <div className="rec-head">
        <div>
          <h2 className="rec-head__title flex items-center gap-2.5">
            <ButiOrnament className="h-6 w-3.5 shrink-0 text-[var(--zari-gold-600)]" />
            {tHome("servicesHeading")}
          </h2>
          <p className="mt-2 text-sm text-[var(--civic-slate-700)]">
            {tHome("servicesSubtitle")}
          </p>
        </div>
      </div>

      <div className="counter-board">
        <CounterRow
          index={1}
          title={tHome("propertyTaxTitle")}
          body={tHome("propertyTaxDesc")}
          href="https://paithanmahaulb.maharashtra.gov.in"
          action={tHome("payOnline")}
          external
        />
        <CounterRow
          index={2}
          title={tHome("certificatesTitle")}
          body={tHome("certificatesDesc")}
          href="https://crsorgi.gov.in"
          action={tHome("applyOnline")}
          external
        />
        <CounterRow
          index={3}
          title={tHome("wardsOverviewHeading")}
          body={tHome("wardsOverviewSubtitle")}
          href="/nagar-parishad/ward-map"
          action={tHome("openWardMap")}
        />
        <CounterRow
          index={4}
          title={tHome("grievancesTitle")}
          body={tHome("grievancesDesc")}
          href="/grievances/new"
          action={tHome("fileComplaint")}
        />
      </div>

      {/* Emergency quick contacts — a ruled strip below the counter board,
          always present (the numbers are the same three the old mobile bar
          carried, but set as a register row rather than a card). */}
      <div className="mt-1 grid grid-cols-1 gap-px border-t border-[var(--border-subtle)] sm:grid-cols-3 sm:gap-0">
        <a
          href="tel:02431223010"
          className="flex items-center gap-2 py-3 pr-3 text-sm hover:text-[var(--zari-gold-600)]"
        >
          <Building2 className="h-4 w-4 text-[var(--zari-gold-600)]" aria-hidden="true" />
          <span className="font-semibold text-[var(--portal-blue-900)]">
            {tHeader("paithanNagarParishad")}
          </span>
          <span className="ml-auto tabular-nums text-[var(--civic-slate-500)]">02431-223010</span>
        </a>
        <a
          href="tel:112"
          className="flex items-center gap-2 py-3 text-sm hover:text-[var(--zari-gold-600)] sm:border-l sm:border-[var(--border-subtle)] sm:pl-6"
        >
          <Phone className="h-4 w-4 text-[var(--portal-blue-700)]" aria-hidden="true" />
          <span className="font-semibold text-[var(--portal-blue-900)]">112</span>
          <span className="ml-auto tabular-nums text-[var(--civic-slate-500)]">112 / 223033</span>
        </a>
        <a
          href="tel:108"
          className="flex items-center gap-2 py-3 text-sm hover:text-[var(--zari-gold-600)] sm:border-l sm:border-[var(--border-subtle)] sm:pl-6"
        >
          <Phone className="h-4 w-4 text-[var(--morpanhki)]" aria-hidden="true" />
          <span className="font-semibold text-[var(--portal-blue-900)]">108</span>
          <span className="ml-auto tabular-nums text-[var(--civic-slate-500)]">108 / 223040</span>
        </a>
      </div>
    </div>
  );
}

function CounterRow({
  index,
  title,
  body,
  href,
  action,
  external,
}: {
  index: number;
  title: string;
  body: string;
  href: string;
  action: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className="counter-row__num" aria-hidden="true">
        {String(index).padStart(2, "0")}
      </span>
      <span className="counter-row__body">
        <span className="counter-row__title">{title}</span>
        <span className="counter-row__desc block">{body}</span>
      </span>
      <span className="counter-row__action">
        {action}
        {external ? (
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        ) : (
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        )}
      </span>
    </>
  );

  if (href.startsWith("tel:") || external) {
    return (
      <a
        href={href}
        className="counter-row"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className="counter-row">
      {inner}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */

function NoticeLedger() {
  const tHome = useTranslations("home");
  const tCommon = useTranslations("common");
  const recent = ledgerEntries.slice(0, 5);

  return (
    <div className="reg-sheet">
      <div className="reg-sheet__head">
        <span className="gaz-col__title">{tHome("noticesHeading")}</span>
        <Link
          href="/nagar-parishad/notifications"
          className="reg-sheet__count hover:text-[var(--portal-blue-800)]"
        >
          {ledgerEntries.length.toLocaleString()} &#8594;
        </Link>
      </div>

      <table className="portal-register portal-register--wide">
        <caption className="sr-only">{tHome("noticesHeading")}</caption>
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
          {recent.map((entry) => (
            <tr key={entry.id}>
              <td className="whitespace-nowrap font-medium">
                <time dateTime={entry.publishedAt}>{formatCivicDate(entry.publishedAt)}</time>
              </td>
              <td className="whitespace-nowrap">
                <NotificationCategoryBadge category={entry.category} />
              </td>
              <td>
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
                  <time dateTime={entry.closingAt} className="font-bold text-[var(--portal-blue-700)]">
                    {formatCivicDate(entry.closingAt)}
                  </time>
                ) : (
                  <span className="text-[var(--civic-slate-500)]">—</span>
                )}
              </td>
              <td className="whitespace-nowrap text-right">
                <Link
                  href="/nagar-parishad/notifications"
                  className="inline-flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--canvas-bg)] p-2 text-[var(--portal-blue-800)] transition-colors hover:bg-[var(--portal-blue-800)] hover:text-white"
                  aria-label={`View notice: ${entry.title}`}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="reg-entries">
        {recent.map((entry) => (
          <div key={entry.id} className="reg-entry">
            <div className="reg-entry__top">
              <span className="reg-entry__date">
                <time dateTime={entry.publishedAt}>{formatCivicDate(entry.publishedAt)}</time>
              </span>
              <NotificationCategoryBadge category={entry.category} />
            </div>
            <Link href="/nagar-parishad/notifications" className="reg-entry__title block">
              {entry.title}
            </Link>
            <div className="reg-entry__meta">
              <span className="reg-entry__ref">
                {tHome("refNo")} {entry.referenceNo}
              </span>
              {entry.closingAt ? (
                <span className="reg-entry__due">
                  {tHome("closingDate")}: {formatCivicDate(entry.closingAt)}
                </span>
              ) : null}
            </div>
          </div>
        ))}
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
      <section className="gaz-col" aria-labelledby="council-heading">
        <div className="gaz-col__head">
          <h2 id="council-heading" className="gaz-col__title">
            {tNagar("representativesTitle")}
          </h2>
          <span className="gaz-col__meta">{tHome("councilPanelTitle")}</span>
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {electedRepresentatives.map((representative) => (
            <Link
              key={representative.slug}
              href={`/${locale}/nagar-parishad/representatives/${representative.id === "rep-mla" ? "mla" : "mp"}`}
              className="block py-3 transition-colors hover:bg-[color-mix(in_srgb,var(--paithani-red)_4%,transparent)]"
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
        <div className="gaz-col__foot">
          <Link href="/nagar-parishad/representatives">
            <span>{tHome("wingCivicLink1")}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="gaz-col" aria-labelledby="progress-heading">
        <div className="gaz-col__head">
          <h2 id="progress-heading" className="gaz-col__title">
            {tHome("activeProjects")}
          </h2>
          <span className="gaz-col__meta">
            {councilProfile.wardCount} {tHome("vitalsWards")}
          </span>
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {ongoingWorks.slice(0, 3).map((work) => (
            <div key={work.id} className="py-3">
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
                className="mt-1.5 h-1.5 w-full overflow-hidden bg-[var(--border-subtle)]"
                role="progressbar"
                aria-valuenow={work.progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${work.title} progress`}
              >
                <div
                  className="h-full bg-[var(--zari-gold-500)]"
                  style={{ width: `${work.progressPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="gaz-col__foot">
          <Link href="/nagar-parishad/development-works">
            <span>{tHome("viewAllWorks")}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="gaz-col" aria-labelledby="office-heading">
        <div className="gaz-col__head">
          <h2 id="office-heading" className="gaz-col__title">
            {tHome("councilPanelTitle")}
          </h2>
          <span className="gaz-col__meta">{tHome("vitalsControlRoom")}</span>
        </div>
        <div className="gaz-col__body">
          <p className="text-xs leading-relaxed text-[var(--civic-slate-700)]">
            {councilProfile.addressLine}
          </p>
          <a
            href={`tel:${councilProfile.phone}`}
            className="mt-3 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-xs font-bold tabular-nums text-[var(--portal-blue-800)] hover:text-[var(--zari-gold-600)]"
          >
            <span className="font-medium text-[var(--civic-slate-500)]">
              {tHome("vitalsControlRoom")}
            </span>
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
        <div className="rec-head">
          <div>
            <h2 id="sites-showcase-heading" className="rec-head__title flex items-center gap-2.5">
              <Camera className="h-4 w-4 text-[var(--zari-gold-600)]" aria-hidden="true" />
              {tHome("landmarksHeading")}
            </h2>
            <p className="mt-2 text-sm text-[var(--civic-slate-700)] max-w-2xl">
              {tHome("landmarksSubtitle")}
            </p>
          </div>

          <Link
            href="/tourism/places-to-visit"
            className="gaz-col__meta inline-flex items-center gap-1.5 self-start text-[var(--portal-blue-800)] hover:text-[var(--zari-gold-600)] md:self-auto"
          >
            <span>{tHome("viewDetails")}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <LandmarkFeature place={TOURIST_PLACES[0]} />

          <ul className="grid gap-px overflow-hidden border border-[var(--border-subtle)] bg-[var(--border-subtle)] sm:grid-cols-2 lg:col-span-7">
            {TOURIST_PLACES.slice(1).map((place) => (
              <li key={place.id} className="bg-white">
                <Link
                  href="/tourism/places-to-visit"
                  className="flex h-full items-start gap-3 p-3 transition-colors hover:bg-[var(--canvas-bg)]"
                >
                  <span className="relative h-16 w-20 shrink-0 overflow-hidden bg-[var(--portal-blue-900)]">
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
    <article className="flex flex-col overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-card)] lg:col-span-5">
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

        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden border border-[var(--border-subtle)] bg-[var(--border-subtle)] text-xs">
          <div className="bg-[var(--canvas-bg)] px-3 py-2">
            <dt className="text-[var(--civic-slate-500)]">
              {locale === "mr" ? "बस स्थानकापासून" : locale === "hi" ? "बस स्टैंड से" : "From bus stand"}
            </dt>
            <dd className="mt-0.5 font-bold tabular-nums text-[var(--portal-blue-900)]">
              {place.distanceFromBusStand}
            </dd>
          </div>
          <div className="bg-[var(--canvas-bg)] px-3 py-2">
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
