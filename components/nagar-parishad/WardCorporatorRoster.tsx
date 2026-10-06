"use client";

import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import type { WardCorporator } from "@/lib/mock-data";
import { RepresentativePortrait } from "./RepresentativePortrait";

interface WardCorporatorRosterProps {
  readonly corporators: readonly WardCorporator[];
}

export function WardCorporatorRoster({ corporators }: WardCorporatorRosterProps) {
  const t = useTranslations("nagarParishad");

  return (
    <>
      <div className="hidden overflow-x-auto border border-[var(--border-subtle)] bg-white md:block">
        <table className="gov-table">
          <caption className="sr-only">
            {t("corporatorsTitle")}
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-20">
                {t("wardTableWard")}
              </th>
              <th scope="col" className="w-44">
                {t("wardTableWardName")}
              </th>
              <th scope="col">{t("wardTableCorporator")}</th>
              <th scope="col" className="w-52">
                {t("wardTableContact")}
              </th>
            </tr>
          </thead>
          <tbody>
            {corporators.map((corporator) => (
              <tr key={corporator.wardNumber}>
                <th scope="row" className="text-base font-semibold text-[var(--gov-navy-900)]">
                  {corporator.wardNumber}
                </th>
                <td>
                  {corporator.wardName}
                  <span lang="mr" className="ml-2 text-[0.8125rem] text-[var(--civic-slate-500)]">
                    {corporator.wardNameMr}
                  </span>
                </td>
                <td>
                  <span className="flex items-center gap-3">
                    <RepresentativePortrait name={corporator.name} hasNamedHolder={false} size="sm" />
                    <span className="text-[var(--civic-slate-500)]">{corporator.name}</span>
                  </span>
                </td>
                <td>
                  {corporator.phone ? (
                    <a
                      href={`tel:${corporator.phone}`}
                      className="civic-figure font-medium text-[var(--gov-navy-700)] hover:underline"
                    >
                      {corporator.phone}
                    </a>
                  ) : (
                    <span className="text-[var(--civic-slate-500)]">&mdash;</span>
                  )}
                  <span className="mt-0.5 block text-[0.75rem] text-[var(--civic-slate-500)]">
                    {t("wardTableOffice")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-[var(--border-subtle)] border border-[var(--border-subtle)] bg-white md:hidden">
        {corporators.map((corporator) => (
          <li key={corporator.wardNumber} className="flex items-center gap-3.5 px-4 py-3.5">
            <span className="civic-figure w-8 shrink-0 text-lg font-semibold text-[var(--gov-navy-900)]">
              {corporator.wardNumber}
            </span>
            <RepresentativePortrait name={corporator.name} hasNamedHolder={false} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-[var(--gov-navy-900)]">
                {corporator.wardName}
                <span lang="mr" className="ml-1.5 font-normal text-[var(--civic-slate-500)]">
                  {corporator.wardNameMr}
                </span>
              </span>
              <span className="block text-[0.8125rem] text-[var(--civic-slate-500)]">
                {corporator.name}
              </span>
            </span>
            {corporator.phone ? (
              <a
                href={`tel:${corporator.phone}`}
                className="shrink-0 border border-[var(--border-strong)] p-2 text-[var(--gov-navy-700)]"
              >
                <Phone size={15} aria-hidden />
                <span className="sr-only">Call the council office about ward {corporator.wardNumber}</span>
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
