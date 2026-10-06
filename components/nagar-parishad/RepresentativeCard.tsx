"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Representative } from "@/lib/mock-data";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { RepresentativePortrait } from "./RepresentativePortrait";
import { useLocale } from "next-intl";

interface RepresentativeCardProps {
  readonly representative: Representative;
}

/**
 * Profile card for one office holder. Links to the detail page at
 * /nagar-parishad/representatives/[slug].
 */
export function RepresentativeCard({ representative }: RepresentativeCardProps) {
  const locale = useLocale();
  const hasNamedHolder = representative.dataStatus === "VERIFIED";
  const isMr = locale === "mr";

  const displayName = isMr && representative.nameMr ? representative.nameMr : representative.name;
  const displayDesignation = isMr && representative.designationMr ? representative.designationMr : representative.designation;

  return (
    <article className="flex h-full flex-col border border-[var(--border-subtle)] bg-white">
      <div className="flex gap-4 border-b border-[var(--border-subtle)] p-5">
        <RepresentativePortrait name={representative.name} hasNamedHolder={hasNamedHolder} />
        <div className="min-w-0">
          <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-tight text-[var(--gov-navy-900)]">
            <Link
              href={`/nagar-parishad/representatives/${representative.slug}`}
              className="hover:underline"
            >
              {displayName}
            </Link>
          </h3>
          {!isMr && representative.nameMr ? (
            <p lang="mr" className="text-sm text-[var(--civic-slate-500)]">
              {representative.nameMr}
            </p>
          ) : null}
          <p className="mt-1.5 text-sm font-medium leading-snug text-[var(--gov-navy-700)]">
            {displayDesignation}
          </p>
          {!isMr && representative.designationMr ? (
            <p lang="mr" className="text-[0.8125rem] text-[var(--civic-slate-500)]">
              {representative.designationMr}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {representative.constituency ? (
          <p className="flex items-start gap-2 text-[0.8125rem] text-[var(--civic-slate-700)]">
            <MapPin size={14} aria-hidden className="mt-0.5 shrink-0 text-[var(--zari-gold-600)]" />
            {representative.constituency}
          </p>
        ) : null}

        <p className="max-w-[58ch] text-[0.875rem] leading-relaxed text-[var(--civic-slate-700)]">
          {representative.bio}
        </p>

        {representative.phone || representative.email ? (
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[0.8125rem]">
            {representative.phone ? (
              <a
                href={`tel:${representative.phone}`}
                className="flex items-center gap-1.5 font-medium text-[var(--gov-navy-700)] hover:underline"
              >
                <Phone size={13} aria-hidden />
                <span className="civic-figure">{representative.phone}</span>
              </a>
            ) : null}
            {representative.email ? (
              <a
                href={`mailto:${representative.email}`}
                className="flex items-center gap-1.5 font-medium text-[var(--gov-navy-700)] hover:underline"
              >
                <Mail size={13} aria-hidden />
                {representative.email}
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="mt-auto space-y-2 border-t border-[var(--border-subtle)] pt-3">
          <div className="flex flex-wrap items-center gap-2">
            {representative.termNote ? (
              <span className="text-[0.75rem] font-medium text-[var(--civic-slate-700)]">
                {representative.termNote}
              </span>
            ) : null}
            <DataStatusBadge status={representative.dataStatus} />
          </div>
          <p className="max-w-[62ch] text-[0.75rem] leading-relaxed text-[var(--civic-slate-500)]">
            {representative.sourceNote}
          </p>
        </div>
      </div>
    </article>
  );
}
