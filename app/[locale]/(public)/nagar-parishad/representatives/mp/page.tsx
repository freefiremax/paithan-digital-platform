"use client";

import Image from "next/image";
import { Phone, MapPin, ExternalLink, ShieldCheck, Landmark } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { ButiOrnament } from "@/components/ui/HistoricMotifs";
import { electedRepresentatives } from "@/lib/mock-data";

const mp = electedRepresentatives.find((r) => r.id === "rep-mp")!;

export default function MpPage() {
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
          { label: "MP — Lok Sabha" },
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
              {locale === "mr" ? "लोकसभा प्रतिनिधी" : locale === "hi" ? "लोकसभा प्रतिनिधि" : "Parliamentary Representative"}
            </p>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <div className="relative mx-auto flex aspect-[3/4] w-full max-w-[280px] items-center justify-center overflow-hidden rounded-sm border-2 border-[var(--zari-gold-400)]/60 bg-white/10 shadow-2xl lg:max-w-none">
                <div className="flex flex-col items-center gap-3 px-6 text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--zari-gold-400)]/20">
                    <Landmark className="h-9 w-9 text-[var(--zari-gold-400)]" aria-hidden="true" />
                  </span>
                  <p className="text-sm leading-snug text-white/70">
                    {locale === "mr"
                      ? "प्रतिनिधीचा फोटो लवकरच"
                      : locale === "hi"
                        ? "प्रतिनिधि का फोटो शीघ्र आ रहा है"
                        : "Portrait coming soon"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <DataStatusBadge status={mp.dataStatus} />
              </div>
            </div>

            <div className="lg:col-span-8">
              <h1 className="font-display text-[2rem] font-semibold leading-tight text-white sm:text-[2.5rem]">
                {mp.name}
              </h1>
              <p lang="mr" className="mt-1 font-display-deva text-lg text-[var(--zari-gold-400)]">
                {mp.nameMr}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-sm bg-[var(--zari-gold-400)]/20 px-3 py-1.5 text-xs font-bold text-[var(--zari-gold-400)]">
                  {mp.designation}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80">
                  {mp.constituency}
                </span>
              </div>

              <div className="mt-6 h-px w-full bg-gradient-to-r from-[var(--zari-gold-400)]/60 to-transparent" aria-hidden="true" />

              <p className="mt-6 max-w-[65ch] text-[0.95rem] leading-relaxed text-white/85">
                {mp.bio}
              </p>

              <p className="mt-4 flex gap-2.5 rounded-sm border-l-[3px] border-[var(--zari-gold-400)] bg-[var(--zari-gold-400)]/10 px-4 py-3 text-xs leading-relaxed text-white/80">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--zari-gold-400)]" aria-hidden="true" />
                <span>
                  {locale === "mr"
                    ? "टीप: पैठण विधानसभा क्षेत्र (क्रमांक 110) जालना लोकसभा मतदारसंघात आहे, छत्रपती संभाजीनगर (औरंगाबाद) लोकसभेत नाही."
                    : locale === "hi"
                      ? "नोट: पैठण विधानसभा क्षेत्र (संख्या 110) जालना लोकसभा क्षेत्र में आता है, छत्रपति संभाजीनगर (औरंगाबाद) लोकसभा में नहीं।"
                      : "Note: Paithan Assembly Constituency (No. 110) falls under the Jalna Lok Sabha constituency, not Chhatrapati Sambhajinagar (Aurangabad)."}
                </span>
              </p>

              {mp.termNote ? (
                <p className="mt-4 inline-flex items-center gap-2 rounded-sm bg-white/10 px-3 py-2 text-xs font-semibold text-white/80">
                  <ShieldCheck className="h-4 w-4 text-[var(--zari-gold-400)]" aria-hidden="true" />
                  {mp.termNote}
                </p>
              ) : null}

              <dl className="mt-8 grid gap-px overflow-hidden rounded-sm border border-white/15 bg-white/10 sm:grid-cols-2">
                {mp.officeAddress ? (
                  <div className="bg-[var(--paithani-red)]/80 px-4 py-3 sm:col-span-2">
                    <dt className="flex items-center gap-1.5 text-xs text-white/60">
                      <MapPin className="h-3.5 w-3.5 text-[var(--zari-gold-400)]" aria-hidden="true" />
                      {t("officeAddress")}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-white/90">
                      {mp.officeAddress}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {mp.sourceUrl ? (
                <a
                  href={mp.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--zari-gold-400)] hover:underline"
                >
                  <span>{mp.sourceNote}</span>
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
