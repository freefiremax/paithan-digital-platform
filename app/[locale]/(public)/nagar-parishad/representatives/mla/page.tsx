"use client";

import Image from "next/image";
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { ButiOrnament } from "@/components/ui/HistoricMotifs";
import { electedRepresentatives } from "@/lib/mock-data";

const mla = electedRepresentatives.find((r) => r.id === "rep-mla")!;

export default function MlaPage() {
  const t = useTranslations("nagarParishad");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  return (
    <>
      <Breadcrumb
        items={[
          { label: tNav("home"), href: `/${locale}` },
          { label: tNav("nagarParishad"), href: `/${locale}/nagar-parishad` },
          { label: t("representativesTitle"), href: `/${locale}/nagar-parishad/representatives` },
          { label: "MLA — Paithan" },
        ]}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/paithani-bg.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.07]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--paithani-red)] via-[var(--paithani-red)]/95 to-[var(--portal-blue-900)]" />
        </div>

        <div className="relative mx-auto max-w-[1180px] px-4 py-14 lg:py-20">
          <div className="flex items-center gap-3">
            <ButiOrnament className="h-10 w-5 text-[var(--zari-gold-400)]" />
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--zari-gold-400)]">
              {locale === "mr" ? "विधानसभा प्रतिनिधी" : locale === "hi" ? "विधानसभा प्रतिनिधि" : "Legislative Representative"}
            </p>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-sm border-2 border-[var(--zari-gold-400)]/60 shadow-2xl lg:max-w-none">
                <Image
                  src="/images/mla-vilas-bhumre.jpeg"
                  alt={mla.name}
                  fill
                  sizes="(max-width: 1024px) 280px, 30vw"
                  className="object-cover object-top"
                  priority
                />
              </div>
              <div className="mt-4 flex justify-center">
                <DataStatusBadge status={mla.dataStatus} />
              </div>
            </div>

            <div className="lg:col-span-8">
              <h1 className="font-display text-[2rem] font-semibold leading-tight text-white sm:text-[2.5rem]">
                {mla.name}
              </h1>
              <p lang="mr" className="mt-1 font-display-deva text-lg text-[var(--zari-gold-400)]">
                {mla.nameMr}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-sm bg-[var(--zari-gold-400)]/20 px-3 py-1.5 text-xs font-bold text-[var(--zari-gold-400)]">
                  {mla.designation}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80">
                  {mla.constituency}
                </span>
              </div>

              <div className="mt-6 h-px w-full bg-gradient-to-r from-[var(--zari-gold-400)]/60 to-transparent" aria-hidden="true" />

              <p className="mt-6 max-w-[65ch] text-[0.95rem] leading-relaxed text-white/85">
                {mla.bio}
              </p>

              {mla.termNote ? (
                <p className="mt-4 inline-flex items-center gap-2 rounded-sm bg-white/10 px-3 py-2 text-xs font-semibold text-white/80">
                  <ShieldCheck className="h-4 w-4 text-[var(--zari-gold-400)]" aria-hidden="true" />
                  {mla.termNote}
                </p>
              ) : null}

              <dl className="mt-8 grid gap-px overflow-hidden rounded-sm border border-white/15 bg-white/10 sm:grid-cols-2">
                {mla.phone ? (
                  <div className="bg-[var(--paithani-red)]/80 px-4 py-3">
                    <dt className="flex items-center gap-1.5 text-xs text-white/60">
                      <Phone className="h-3.5 w-3.5 text-[var(--zari-gold-400)]" aria-hidden="true" />
                      {t("phone")}
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`tel:${mla.phone.replace(/-/g, "")}`}
                        className="text-sm font-bold text-white tabular-nums hover:text-[var(--zari-gold-400)] hover:underline"
                      >
                        {mla.phone}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {mla.email ? (
                  <div className="bg-[var(--paithani-red)]/80 px-4 py-3">
                    <dt className="flex items-center gap-1.5 text-xs text-white/60">
                      <Mail className="h-3.5 w-3.5 text-[var(--zari-gold-400)]" aria-hidden="true" />
                      {t("email")}
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${mla.email}`}
                        className="text-sm font-bold text-white hover:text-[var(--zari-gold-400)] hover:underline"
                      >
                        {mla.email}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {mla.officeAddress ? (
                  <div className="bg-[var(--paithani-red)]/80 px-4 py-3 sm:col-span-2">
                    <dt className="flex items-center gap-1.5 text-xs text-white/60">
                      <MapPin className="h-3.5 w-3.5 text-[var(--zari-gold-400)]" aria-hidden="true" />
                      {t("officeAddress")}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-white/90">
                      {mla.officeAddress}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {mla.sourceUrl ? (
                <a
                  href={mla.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--zari-gold-400)] hover:underline"
                >
                  <span>{mla.sourceNote}</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="paithani-band" aria-hidden="true" />
      </section>
    </>
  );
}
