"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Landmark, MapPin, Route, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { developmentWorks, getWardWorkSummary, wards } from "@/lib/mock-data";

const placeNotes: Record<number, string> = {
  1: "Historic settlement area around the Brahmapuri mound and old fort precinct.",
  2: "Pilgrim-facing area centred on the Sant Eknath Samadhi Mandir complex.",
  3: "Godavari riverfront precinct with ghats, public access routes and heritage activity.",
  5: "Residential and artisan locality associated with Paithani handloom clusters.",
  14: "Residential area adjoining the Jayakwadi reservoir and staff colony approach.",
  15: "Infrastructure gateway around Nath Sagar and the dam-side access corridor.",
  16: "Employment and artisan-support area including industrial and handloom activity.",
};

const wardImages: Record<number, string> = {
  1: "/images/wards/ward-01.jpeg",
  2: "/images/wards/ward-02.jpeg",
  3: "/images/wards/ward-03.jpeg",
  4: "/images/wards/ward-04.jpeg",
  5: "/images/wards/ward-05.jpeg",
  6: "/images/wards/ward-06.jpeg",
  7: "/images/wards/ward-07.jpeg",
  8: "/images/wards/ward-08.jpeg",
  9: "/images/wards/ward-09.jpeg",
  10: "/images/wards/ward-10.webp",
  11: "/images/wards/ward-11.jpeg",
  12: "/images/wards/ward-12.jpg",
  13: "/images/wards/ward-13.jpeg",
  14: "/images/wards/ward-14.jpeg",
  15: "/images/wards/ward-15.jpeg",
  16: "/images/wards/ward-16.jpeg",
  17: "/images/wards/ward-17.webp",
};

export default function WardDetailPage() {
  const params = useParams<{ ward: string }>();
  const wardNumber = Number(params.ward);
  const ward = wards.find((item) => item.number === wardNumber);
  const locale = useLocale();
  const t = useTranslations("nagarParishad");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  if (!ward) notFound();

  const isMr = locale === "mr";
  const summary = getWardWorkSummary(ward.number);
  const works = developmentWorks.filter((work) => work.wardNumber === ward.number);
  const placeNote = placeNotes[ward.number] || "Local civic area within Paithan Municipal Council's ward administration.";

  return (
    <>
      <Breadcrumb items={[
        { label: tNav("home"), href: `/${locale}` },
        { label: tNav("nagarParishad"), href: `/${locale}/nagar-parishad` },
        { label: t("wardMapTitle"), href: `/${locale}/nagar-parishad/ward-map` },
        { label: `${tCommon("ward")} ${ward.number}` },
      ]} />

      <main className="mx-auto max-w-[1180px] px-4 py-8 pb-14 sm:py-11">
        <Link href={`/${locale}/nagar-parishad/ward-map`} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--gov-navy-800)] hover:text-[var(--portal-blue-700)]">
          <ArrowLeft className="h-4 w-4" /> {t("wardMapTitle")}
        </Link>

        <section className="relative mt-5 min-h-[360px] overflow-hidden border border-[var(--gov-navy-800)] bg-[var(--gov-navy-900)] text-white shadow-lg sm:min-h-[430px]">
          <img src={wardImages[ward.number]} alt={`${ward.name} place view`} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(3,20,43,.94)] via-[rgba(3,20,43,.7)] to-[rgba(3,20,43,.18)]" />
          <div className="relative flex min-h-[360px] items-end px-6 py-9 sm:min-h-[430px] sm:px-9 sm:py-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--zari-gold-300)]">Paithan Municipal Council · {tCommon("ward")} {ward.number}</p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-5xl">{isMr ? ward.nameMr : ward.name}</h1>
            {!isMr && <p lang="mr" className="mt-2 text-base text-white/85">{ward.nameMr}</p>}
            <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-white/90"><MapPin className="mt-1 h-4 w-4 shrink-0 text-[var(--zari-gold-300)]" />{ward.locality}</p>
          </div>
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_.8fr]">
          <section className="border border-[var(--border-subtle)] bg-white p-6 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--zari-gold-700)]">Place profile</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--gov-navy-900)]">About this ward</h2>
            <p className="mt-4 leading-7 text-[var(--civic-slate-700)]">{placeNote}</p>
            <div className="mt-6 grid gap-3 border-t border-[var(--border-subtle)] pt-5 sm:grid-cols-3">
              <div><p className="text-2xl font-semibold text-[var(--gov-navy-900)]">{summary.total}</p><p className="text-xs text-[var(--civic-slate-600)]">Recorded works</p></div>
              <div><p className="text-2xl font-semibold text-amber-700">{summary.ongoing}</p><p className="text-xs text-[var(--civic-slate-600)]">In progress</p></div>
              <div><p className="text-2xl font-semibold text-emerald-700">{summary.completed}</p><p className="text-xs text-[var(--civic-slate-600)]">Completed</p></div>
            </div>
          </section>

          <aside className="border border-[var(--zari-gold-300)] bg-[var(--zari-gold-100)]/30 p-6">
            <ShieldCheck className="h-6 w-6 text-[var(--zari-gold-700)]" />
            <h2 className="mt-3 font-display text-xl font-semibold text-[var(--gov-navy-900)]">Ward information</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--civic-slate-700)]">Ward boundaries, elected-member information and local work records are published as they are confirmed by the Municipal Council.</p>
            <Link href={`/${locale}/contact`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--gov-navy-800)] hover:underline"><Route className="h-4 w-4" />Contact the council</Link>
          </aside>
        </div>

        <section className="mt-7 border border-[var(--border-subtle)] bg-white p-6 sm:p-7">
          <div className="flex items-center gap-3"><Landmark className="h-5 w-5 text-[var(--zari-gold-700)]" /><h2 className="font-display text-2xl font-semibold text-[var(--gov-navy-900)]">Works and local updates</h2></div>
          {works.length ? <div className="mt-5 divide-y divide-[var(--border-subtle)]">{works.map((work) => <article key={work.id} className="py-4 first:pt-0"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-[var(--gov-navy-900)]">{isMr ? work.titleMr : work.title}</h3><span className="border border-[var(--border-subtle)] px-2 py-1 text-xs font-bold text-[var(--civic-slate-700)]">{work.status.replace("_", " ")}</span></div><p className="mt-2 text-sm leading-6 text-[var(--civic-slate-700)]">{work.description}</p></article>)}</div> : <p className="mt-4 text-sm leading-6 text-[var(--civic-slate-700)]">No ward-specific works are currently published in this demonstration record.</p>}
        </section>
      </main>
    </>
  );
}
