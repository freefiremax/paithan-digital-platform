"use client";

import Link from "next/link";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Users,
  FileText,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  councilProfile,
  developmentWorks,
  paithanDemographics,
  paithanEmergencyDirectory,
} from "@/lib/mock-data";

export default function AboutNagarParishadPage() {
  const t = useTranslations("nagarParishad");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const ongoingCount = developmentWorks.filter((w) => w.status === "ONGOING").length;
  const completedCount = developmentWorks.filter((w) => w.status === "COMPLETED").length;

  return (
    <>
      <Breadcrumb
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("nagarParishad"), href: "/nagar-parishad" },
          { label: t("aboutCouncil") },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title={t("title")}
          description={t("subtitle")}
        />

        {/* 1. KEY AT-A-GLANCE METRICS */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="border border-[var(--border-subtle)] bg-white p-4">
            <span className="text-[0.75rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
              {t("establishedYear")}
            </span>
            <p className="mt-1 text-2xl font-bold text-[var(--gov-navy-900)] font-serif">
              {councilProfile.establishedYear}
            </p>
            <p className="text-[0.75rem] text-[var(--civic-slate-500)]">{t("yearsOfService")}</p>
          </div>

          <div className="border border-[var(--border-subtle)] bg-white p-4">
            <span className="text-[0.75rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
              {t("civicWards")}
            </span>
            <p className="mt-1 text-2xl font-bold text-[var(--gov-navy-900)] font-serif">
              {t("wardsCount")}
            </p>
            <p className="text-[0.75rem] text-[var(--civic-slate-500)]">{t("delimitedSeats")}</p>
          </div>

          <div className="border border-[var(--border-subtle)] bg-white p-4">
            <span className="text-[0.75rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
              {t("activeWorks")}
            </span>
            <p className="mt-1 text-2xl font-bold text-amber-700 font-serif">
              {ongoingCount} {t("ongoingWorks")}
            </p>
            <p className="text-[0.75rem] text-[var(--civic-slate-500)]">{completedCount} {t("completedWorks")}</p>
          </div>

          <div className="border border-[var(--border-subtle)] bg-white p-4">
            <span className="text-[0.75rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
              {t("councilClass")}
            </span>
            <p className="mt-1 text-2xl font-bold text-[var(--gov-navy-900)] font-serif">
              {t("councilClassValue")}
            </p>
            <p className="text-[0.75rem] text-[var(--civic-slate-500)]">{t("districtName")}</p>
          </div>
        </div>

        {/* 2. ADMINISTRATIVE STRUCTURE & DEPARTMENTS */}
        <section className="mt-12" aria-labelledby="departments-heading">
          <SectionHeading
            id="departments-heading"
            title={t("departmentsHeading")}
            description={t("departmentsSubtitle")}
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border border-[var(--border-subtle)] bg-white p-5">
              <div className="flex items-center gap-2.5 text-[var(--gov-navy-900)] font-semibold text-[0.9375rem]">
                <Building2 className="w-5 h-5 text-[var(--zari-gold-600)]" />
                <span>{t("generalAdmin")}</span>
              </div>
              <p className="mt-2 text-xs text-[var(--civic-slate-700)] leading-relaxed">
                {t("generalAdminDesc")}
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-5">
              <div className="flex items-center gap-2.5 text-[var(--gov-navy-900)] font-semibold text-[0.9375rem]">
                <ShieldCheck className="w-5 h-5 text-[var(--zari-gold-600)]" />
                <span>{t("publicHealth")}</span>
              </div>
              <p className="mt-2 text-xs text-[var(--civic-slate-700)] leading-relaxed">
                {t("publicHealthDesc")}
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-5">
              <div className="flex items-center gap-2.5 text-[var(--gov-navy-900)] font-semibold text-[0.9375rem]">
                <Award className="w-5 h-5 text-[var(--zari-gold-600)]" />
                <span>{t("waterSupplyDept")}</span>
              </div>
              <p className="mt-2 text-xs text-[var(--civic-slate-700)] leading-relaxed">
                {t("waterSupplyDeptDesc")}
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-5">
              <div className="flex items-center gap-2.5 text-[var(--gov-navy-900)] font-semibold text-[0.9375rem]">
                <FileText className="w-5 h-5 text-[var(--zari-gold-600)]" />
                <span>{t("townPlanning")}</span>
              </div>
              <p className="mt-2 text-xs text-[var(--civic-slate-700)] leading-relaxed">
                {t("townPlanningDesc")}
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-5">
              <div className="flex items-center gap-2.5 text-[var(--gov-navy-900)] font-semibold text-[0.9375rem]">
                <Users className="w-5 h-5 text-[var(--zari-gold-600)]" />
                <span>{t("revenueTax")}</span>
              </div>
              <p className="mt-2 text-xs text-[var(--civic-slate-700)] leading-relaxed">
                {t("revenueTaxDesc")}
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-5">
              <div className="flex items-center gap-2.5 text-[var(--gov-navy-900)] font-semibold text-[0.9375rem]">
                <CheckCircle2 className="w-5 h-5 text-[var(--zari-gold-600)]" />
                <span>{t("pilgrimWelfare")}</span>
              </div>
              <p className="mt-2 text-xs text-[var(--civic-slate-700)] leading-relaxed">
                {t("pilgrimWelfareDesc")}
              </p>
            </div>
          </div>
        </section>

        {/* 3. VERIFIED DEMOGRAPHICS & CENSUS INDICATORS */}
        <section className="mt-14" aria-labelledby="demographics-heading">
          <SectionHeading
            id="demographics-heading"
            title={t("demographicsHeading")}
            description={t("demographicsSubtitle")}
          />

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="border border-[var(--border-subtle)] bg-white p-4">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                {t("totalPopulation")}
              </span>
              <p className="mt-1 text-xl font-bold text-[var(--gov-navy-900)] font-serif">
                {paithanDemographics.totalPopulation.toLocaleString(locale === "mr" ? "mr-IN" : "en-IN")}
              </p>
              <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">
                {locale === "mr" ? "जनगणना २०११" : locale === "hi" ? "जनगणना 2011" : "Census 2011"}
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-4">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                {t("malePopulation")}
              </span>
              <p className="mt-1 text-xl font-bold text-[var(--gov-navy-900)] font-serif">
                {paithanDemographics.malePopulation.toLocaleString(locale === "mr" ? "mr-IN" : "en-IN")}
              </p>
              <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">51.2%</p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-4">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                {t("femalePopulation")}
              </span>
              <p className="mt-1 text-xl font-bold text-[var(--gov-navy-900)] font-serif">
                {paithanDemographics.femalePopulation.toLocaleString(locale === "mr" ? "mr-IN" : "en-IN")}
              </p>
              <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">48.8%</p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-4">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                {t("sexRatio")}
              </span>
              <p className="mt-1 text-xl font-bold text-emerald-800 font-serif">
                {paithanDemographics.sexRatio}
              </p>
              <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">
                {locale === "mr" ? "स्त्री / १००० पुरुष" : locale === "hi" ? "महिला / 1000 पुरुष" : "F / 1000 M"}
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-4">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                {t("totalHouseholds")}
              </span>
              <p className="mt-1 text-xl font-bold text-[var(--gov-navy-900)] font-serif">
                {paithanDemographics.totalHouseholds.toLocaleString(locale === "mr" ? "mr-IN" : "en-IN")}
              </p>
              <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">
                {locale === "mr" ? "कुटुंबे" : locale === "hi" ? "इकाइयाँ" : "Units"}
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-4">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                {t("literacyRate")}
              </span>
              <p className="mt-1 text-xl font-bold text-[var(--zari-gold-600)] font-serif">
                {paithanDemographics.overallLiteracyRate}%
              </p>
              <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">M: {paithanDemographics.maleLiteracyRate}% | F: {paithanDemographics.femaleLiteracyRate}%</p>
            </div>
          </div>
        </section>

        {/* 4. EMERGENCY & PUBLIC UTILITY DIRECTORY */}
        <section className="mt-14" aria-labelledby="emergency-heading">
          <SectionHeading
            id="emergency-heading"
            title={t("emergencyHeading")}
            description={t("emergencySubtitle")}
          />

          <div className="mt-6 overflow-hidden border border-[var(--border-subtle)] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--gov-navy-900)] text-white font-serif uppercase tracking-wider text-[0.6875rem]">
                    <th className="py-3 px-4">{t("deptFacility")}</th>
                    <th className="py-3 px-4">{t("officerRole")}</th>
                    <th className="py-3 px-4">{t("directPhone")}</th>
                    <th className="py-3 px-4">{t("location")}</th>
                    <th className="py-3 px-4 text-center">{t("serviceAvailability")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {paithanEmergencyDirectory.map((contact) => {
                    const isMr = locale === "mr";
                    const isHi = locale === "hi";
                    const deptLabel = isMr ? contact.departmentMr : contact.departmentEn;
                    return (
                      <tr key={contact.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-[var(--gov-navy-900)] block">
                            {deptLabel}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[var(--civic-slate-700)] font-medium">
                          {contact.officerRole}
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}
                            className="inline-flex items-center gap-1.5 font-bold text-[var(--gov-navy-700)] hover:text-[var(--zari-gold-600)] hover:underline"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-[var(--zari-gold-600)]" />
                            <span>{contact.phone}</span>
                          </a>
                        </td>
                        <td className="py-3 px-4 text-[var(--civic-slate-500)]">
                          {contact.address}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {contact.isAvailable24x7 ? (
                            <span className="inline-block px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {t("available247")}
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                              {t("officeHours")}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 5. COUNCIL OFFICE LOCATION & CONTACT */}
        <section className="mt-14" aria-labelledby="contact-heading">
          <SectionHeading
            id="contact-heading"
            title={t("contactHeading")}
            description={t("contactSubtitle")}
          />

          <div className="mt-6 border border-[var(--border-subtle)] bg-white p-6 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-semibold text-[var(--gov-navy-900)] font-serif">
                {locale === "mr" ? councilProfile.nameMr : councilProfile.nameEn}
              </h3>
              <div className="mt-4 space-y-2.5 text-xs text-[var(--civic-slate-700)]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[var(--zari-gold-600)] shrink-0 mt-0.5" />
                  <span>{councilProfile.addressLine}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--zari-gold-600)] shrink-0" />
                  <span>{t("officeHours")}: 09:45 AM – 06:15 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--zari-gold-600)] shrink-0" />
                  <span>{t("directPhone")}: {councilProfile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--zari-gold-600)] shrink-0" />
                  <span>{tCommon("email")}: {councilProfile.email}</span>
                </div>
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-[var(--border-subtle)] pt-6 md:pt-0 md:pl-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gov-navy-900)] mb-3">
                {t("quickNavigation")}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/nagar-parishad/representatives"
                    className="text-[var(--gov-navy-700)] font-medium hover:underline flex items-center justify-between"
                  >
                    <span>{t("representativesTitle")}</span>
                    <span className="text-[var(--civic-slate-500)]">→</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nagar-parishad/ward-map"
                    className="text-[var(--gov-navy-700)] font-medium hover:underline flex items-center justify-between"
                  >
                    <span>{t("wardMapTitle")}</span>
                    <span className="text-[var(--civic-slate-500)]">→</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nagar-parishad/development-works"
                    className="text-[var(--gov-navy-700)] font-medium hover:underline flex items-center justify-between"
                  >
                    <span>{t("devWorksTitle")}</span>
                    <span className="text-[var(--civic-slate-500)]">→</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nagar-parishad/notifications"
                    className="text-[var(--gov-navy-700)] font-medium hover:underline flex items-center justify-between"
                  >
                    <span>{t("noticesTitle")}</span>
                    <span className="text-[var(--civic-slate-500)]">→</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
