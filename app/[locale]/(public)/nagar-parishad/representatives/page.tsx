"use client";

import { CircleAlert } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RepresentativeCard } from "@/components/nagar-parishad/RepresentativeCard";
import { WardCorporatorRoster } from "@/components/nagar-parishad/WardCorporatorRoster";
import {
  administrationRepresentatives,
  councilProfile,
  electedRepresentatives,
  wardCorporators,
} from "@/lib/mock-data";

export default function RepresentativesPage() {
  const t = useTranslations("nagarParishad");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return (
    <>
      <Breadcrumb
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("nagarParishad"), href: "/nagar-parishad" },
          { label: t("representativesTitle") },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title={t("representativesTitle")}
          description={t("representativesSubtitle")}
        />

        <section className="mt-12" aria-labelledby="elected-heading">
          <SectionHeading
            id="elected-heading"
            title={t("representativesTitle")}
            description={t("representativesSubtitle")}
          />
          <div className="grid gap-5 md:grid-cols-2">
            {electedRepresentatives.map((representative) => (
              <RepresentativeCard key={representative.slug} representative={representative} />
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="administration-heading">
          <SectionHeading
            id="administration-heading"
            title={t("coTitle")}
            description={t("departmentsSubtitle")}
          />
          <CouncilStatusNotice />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {administrationRepresentatives.map((representative) => (
              <RepresentativeCard key={representative.slug} representative={representative} />
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="corporators-heading">
          <SectionHeading
            id="corporators-heading"
            title={t("corporatorsTitle")}
            description={t("wardMapSubtitle")}
            action={{ label: t("wardMapTitle"), href: "/nagar-parishad/ward-map" }}
          />
          <RosterPendingNotice />
          <WardCorporatorRoster corporators={wardCorporators} />
        </section>

        <section className="mt-14" aria-labelledby="verification-heading">
          <h2 id="verification-heading" className="sr-only">
            {tCommon("verified")}
          </h2>
          <div className="border border-[var(--border-subtle)] bg-white px-5 py-5">
            <p className="max-w-[80ch] text-[0.8125rem] leading-relaxed text-[var(--civic-slate-700)]">
              {t("secAdvisoryText")}{" "}
              <a
                href={`mailto:${councilProfile.email}`}
                className="font-medium text-[var(--gov-navy-700)] underline underline-offset-4"
              >
                {councilProfile.email}
              </a>{" "}
              /{" "}
              <a
                href={`tel:${councilProfile.phone}`}
                className="civic-figure font-medium text-[var(--gov-navy-700)] underline underline-offset-4"
              >
                {councilProfile.phone}
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

function CouncilStatusNotice() {
  const t = useTranslations("nagarParishad");
  return (
    <div className="mb-6 flex gap-3 border-l-[3px] border-[var(--zari-gold-500)] bg-[var(--zari-gold-100)]/40 px-4 py-3.5">
      <CircleAlert size={17} aria-hidden className="mt-0.5 shrink-0 text-[var(--zari-gold-600)]" />
      <div>
        <p className="max-w-[80ch] text-[0.875rem] leading-relaxed text-[var(--civic-slate-700)]">
          {t("secAdvisoryText")}
        </p>
        <DataStatusBadge status="SAMPLE_TBD" className="mt-2.5" />
      </div>
    </div>
  );
}

function RosterPendingNotice() {
  const t = useTranslations("nagarParishad");
  return (
    <div className="mb-6 flex gap-3 border-l-[3px] border-[var(--zari-gold-500)] bg-[var(--zari-gold-100)]/40 px-4 py-3.5">
      <CircleAlert size={17} aria-hidden className="mt-0.5 shrink-0 text-[var(--zari-gold-600)]" />
      <div>
        <p className="max-w-[80ch] text-[0.875rem] leading-relaxed text-[var(--civic-slate-700)]">
          {t("secAdvisoryText")}
        </p>
        <DataStatusBadge status="SAMPLE_TBD" className="mt-2.5" />
      </div>
    </div>
  );
}
