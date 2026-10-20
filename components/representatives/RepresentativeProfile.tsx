"use client";

/**
 * Shared profile layout for the MLA and MP pages.
 *
 * Both pages are the same document — a citizen looking up their representative —
 * so they share one component rather than two near-copies that drift. The
 * differences (tier label, portrait, constituency caveat) are data on the
 * `Representative` record, not layout forks.
 *
 * DESIGN. This is the "proper" version of the home-page teaser: a Paithani ground
 * with the faint weave tile, a framed portrait that floats over a zari rule, and
 * two stacked panels — an "at a glance" facts block and a contact/office block —
 * so the page has real structure instead of one long column. The verification
 * note and source link are kept as a first-class element, because the whole point
 * of these records is that they are sourced.
 */

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Landmark,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { ButiOrnament, FigureMount } from "@/components/ui/HistoricMotifs";
import { Reveal } from "@/components/ui/Reveal";
import type { Representative } from "@/lib/mock-data";

interface RepresentativeProfileProps {
  readonly rep: Representative;
  /** Portrait source, passed in so the page owns its own asset path. */
  readonly portraitSrc: string;
  /** Breadcrumb leaf, e.g. "MLA — Paithan". */
  readonly crumb: string;
  /** Tier eyebrow, resolved by the page from the record's category. */
  readonly eyebrow: string;
}

export function RepresentativeProfile({
  rep,
  portraitSrc,
  crumb,
  eyebrow,
}: RepresentativeProfileProps) {
  const t = useTranslations("nagarParishad");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  return (
    <>
      <Breadcrumb
        items={[
          { label: tNav("home"), href: `/${locale}` },
          { label: tNav("nagarParishad"), href: `/${locale}/nagar-parishad` },
          {
            label: t("representativesTitle"),
            href: `/${locale}/nagar-parishad/representatives`,
          },
          { label: crumb },
        ]}
      />

      <section className="rep-profile relative flex min-h-[calc(100vh-var(--home-header-h,52px))] flex-col overflow-hidden bg-[var(--paithani-red)]">
        {/* Paithani ground — the real weave at a readable strength under a
            graded madder veil. Kept in the reds only: the old gradient faded to
            a navy/madder that read as a blank purple field at the foot of the
            page. This is opaque and fills the section, so there is no bare body
            colour showing through above or below. */}
        <div className="absolute inset-0">
          <Image
            src="/images/paithani-bg.png"
            alt=""
            fill
            sizes="100vw"
            className="reps-ground__weave"
            aria-hidden="true"
          />
          <div className="reps-ground__veil" />
        </div>

        <div className="relative m-auto w-full max-w-[1140px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link
            href={`/${locale}/nagar-parishad/representatives`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--zari-gold-400)] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {t("repBackToReps")}
          </Link>

          {/* Masthead: portrait + identity */}
          <Reveal className="mt-7 grid gap-9 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <div className="relative mx-auto w-64 sm:w-72 lg:mx-0 lg:w-full">
                {/* zari keystone behind the plate */}
                <span
                  className="absolute -inset-2 rounded-sm border border-[var(--zari-gold-400)]/40"
                  aria-hidden="true"
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm border-2 border-[var(--zari-gold-400)] shadow-2xl">
                  <Image
                    src={portraitSrc}
                    alt={rep.name}
                    fill
                    sizes="(max-width: 1024px) 288px, 28rem"
                    className="object-cover object-top"
                    priority
                  />
                  <span
                    className="absolute inset-0 bg-gradient-to-t from-[var(--paithani-red)]/55 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                </div>
                <FigureMount className="mt-3 text-[var(--zari-gold-400)]" />
                <div className="mt-3 flex justify-center lg:justify-start">
                  <DataStatusBadge status={rep.dataStatus} showVerified />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="flex items-center gap-3">
                <ButiOrnament className="h-9 w-5 text-[var(--zari-gold-400)]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--zari-gold-400)]">
                  {eyebrow}
                </p>
              </div>

              {/* NAME — its own block, so the artifact of a person is separated
                  from the office they hold. */}
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                  {t("repNameLabel")}
                </p>
                <h1 className="mt-1.5 font-display text-[2rem] font-semibold leading-tight text-white sm:text-[2.5rem]">
                  {rep.name}
                </h1>
                {rep.nameMr ? (
                  <p lang="mr" className="mt-1 font-display-deva text-lg text-[var(--zari-gold-400)]">
                    {rep.nameMr}
                  </p>
                ) : null}
              </div>

              {/* ROLE — set off by a zari rule between name and office. */}
              <div className="mt-6 border-t border-[var(--zari-gold-400)]/30 pt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                  {t("repRoleLabel")}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-sm bg-[var(--zari-gold-400)]/20 px-3 py-1.5 text-xs font-bold text-[var(--zari-gold-400)]">
                    <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
                    {rep.designation}
                  </span>
                  {rep.designationMr ? (
                    <span
                      lang="mr"
                      className="font-display-deva text-sm font-semibold text-white/85"
                    >
                      {rep.designationMr}
                    </span>
                  ) : null}
                </div>
                {rep.constituency ? (
                  <p className="mt-3 flex items-start gap-2 text-sm text-white/80">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--zari-gold-400)]" aria-hidden="true" />
                    {rep.constituency}
                  </p>
                ) : null}
              </div>

              {/* ABOUT — labelled and separated, not one more line under the name. */}
              <div className="mt-6 border-t border-[var(--zari-gold-400)]/30 pt-5">
                <div className="flex items-center gap-2">
                  <ButiOrnament className="h-5 w-3 text-[var(--zari-gold-400)]" />
                  <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-[var(--zari-gold-400)]">
                    {t("repAboutHeading")}
                  </h2>
                </div>
                <p className="mt-3 max-w-[68ch] text-[0.95rem] leading-relaxed text-white/85">
                  {rep.bio}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Two structured panels */}
          <Reveal delay={120} className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* At a glance */}
            <div className="rounded-sm border border-[var(--zari-gold-400)]/30 bg-white/[0.06] p-6 backdrop-blur-sm">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-white">
                <ButiOrnament className="h-6 w-3.5 text-[var(--zari-gold-400)]" />
                {t("repQuickFacts")}
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-white/55">{t("repConstituencyLabel")}</dt>
                  <dd className="text-right font-medium text-white/90">{rep.constituency ?? "—"}</dd>
                </div>
                {rep.termNote ? (
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                    <dt className="text-white/55">{t("repTerm")}</dt>
                    <dd className="text-right font-medium text-white/90">{rep.termNote}</dd>
                  </div>
                ) : null}
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-white/55">{tCommon("designation")}</dt>
                  <dd className="text-right font-medium text-white/90">{rep.designation}</dd>
                </div>
              </dl>
            </div>

            {/* Contact & office */}
            <div className="rounded-sm border border-[var(--zari-gold-400)]/30 bg-white/[0.06] p-6 backdrop-blur-sm">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-white">
                <ButiOrnament className="h-6 w-3.5 text-[var(--zari-gold-400)]" />
                {t("repContactHeading")}
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                {rep.phone ? (
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--zari-gold-400)]" aria-hidden="true" />
                    <div>
                      <dt className="text-xs text-white/55">{t("repPhone")}</dt>
                      <dd className="mt-0.5">
                        <a
                          href={`tel:${rep.phone.replace(/-/g, "")}`}
                          className="font-bold text-white tabular-nums hover:text-[var(--zari-gold-400)] hover:underline"
                        >
                          {rep.phone}
                        </a>
                      </dd>
                    </div>
                  </div>
                ) : null}
                {rep.email ? (
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--zari-gold-400)]" aria-hidden="true" />
                    <div>
                      <dt className="text-xs text-white/55">{t("repEmail")}</dt>
                      <dd className="mt-0.5">
                        <a
                          href={`mailto:${rep.email}`}
                          className="break-all font-bold text-white hover:text-[var(--zari-gold-400)] hover:underline"
                        >
                          {rep.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                ) : null}
                {rep.officeAddress ? (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--zari-gold-400)]" aria-hidden="true" />
                    <div>
                      <dt className="text-xs text-white/55">{t("repOfficeAddress")}</dt>
                      <dd className="mt-0.5 font-medium text-white/90">{rep.officeAddress}</dd>
                    </div>
                  </div>
                ) : null}
              </dl>
            </div>
          </Reveal>

          {/* Provenance */}
          {rep.sourceUrl ? (
            <div className="mt-6 flex flex-wrap items-center gap-2 rounded-sm border-l-[3px] border-[var(--zari-gold-400)] bg-[var(--zari-gold-400)]/10 px-4 py-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--zari-gold-400)]" aria-hidden="true" />
              <span className="text-xs font-semibold text-[var(--zari-gold-400)]">
                {t("repSourceLabel")}:
              </span>
              <a
                href={rep.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-white/85 hover:text-[var(--zari-gold-400)] hover:underline"
              >
                <span>{rep.sourceNote}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>
          ) : null}
        </div>

        <div className="paithani-band" aria-hidden="true" />
      </section>
    </>
  );
}
