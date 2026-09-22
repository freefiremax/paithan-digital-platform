import Link from "next/link";
import { FileText, Landmark, MapPin, Megaphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DataStatusBadge } from "@/components/ui/DataStatusBadge";
import { NotificationCategoryBadge } from "@/components/ui/NotificationCategoryBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkStatusBadge } from "@/components/ui/WorkStatusBadge";
import {
  citizenServices,
  councilProfile,
  developmentWorks,
  electedRepresentatives,
  formatCivicDate,
  getWardWorkSummary,
  notifications,
  pillars,
  wards,
  type CitizenService,
} from "@/lib/mock-data";

const SERVICE_ICONS: Readonly<Record<CitizenService["icon"], LucideIcon>> = {
  "file-text": FileText,
  landmark: Landmark,
  megaphone: Megaphone,
  "map-pin": MapPin,
};

/** Newest notices first — the ledger reads like a register, most recent at the top. */
const ledgerEntries = [...notifications].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export default function HomePage() {
  return (
    <>
      <PillarsHero />
      <CitizenServicesStrip />

      <div className="mx-auto max-w-[1180px] px-4 py-14">
        <div className="grid gap-12 lg:grid-cols-12">
          <section className="lg:col-span-8" aria-labelledby="notices-heading">
            <SectionHeading
              id="notices-heading"
              title="Tenders and public notices"
              description="Every announcement, scheme, tender and public notice the council issues is published here in one register, with its reference number and closing date."
              action={{ label: "All notifications", href: "/nagar-parishad/notifications" }}
            />
            <SampleDataBand>
              The register below is illustrative. Live tenders and notices will replace these rows
              once the Nagar Parishad supplies its notice file.
            </SampleDataBand>
            <NoticeLedger />
          </section>

          <aside className="lg:col-span-4" aria-labelledby="council-heading">
            <SectionHeading id="council-heading" title="The council" />
            <CouncilPanel />
          </aside>
        </div>
      </div>

      <WardsOverview />
    </>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Three-pillar hero.
 *
 * Paithan is simultaneously a municipal council, a 2,000-year-old Satavahana capital and a
 * reservoir destination — that three-way split is the most characteristic thing about the
 * town, so the split itself carries the hero rather than a photograph or a stat row. The
 * gold hairlines bounding a deep navy field are a direct reference to the zari border
 * (kinari) that frames a Paithani weave.
 */
function PillarsHero() {
  return (
    <section className="bg-[var(--gov-navy-900)] text-white" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-[1180px] px-4 pb-0 pt-12">
        <h1
          id="hero-heading"
          className="max-w-[20ch] text-3xl font-semibold leading-[1.15] tracking-tight sm:text-[2.75rem]"
        >
          Civic, heritage and tourism information for Paithan
        </h1>
        <p className="mt-5 max-w-[72ch] text-[1.0625rem] leading-relaxed text-slate-300">
          Paithan is a municipal town of{" "}
          <span className="civic-figure font-semibold text-white">{councilProfile.wardCount} wards</span> in{" "}
          {councilProfile.district} district, and the ancient Pratishthana, capital of the Satavahanas.
          The council publishes its records, the town&rsquo;s heritage and its visitor information here.
        </p>
      </div>

      <div className="mx-auto mt-11 max-w-[1180px] border-t border-[var(--zari-gold-500)] px-4">
        <div className="grid divide-y divide-white/15 md:grid-cols-3 md:divide-x md:divide-y-0 md:divide-[var(--zari-gold-500)]/45">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.id}
              className={[
                "flex flex-col py-8",
                index === 0 ? "md:pr-8" : "md:px-8",
                index === pillars.length - 1 ? "md:pr-0 md:pl-8" : "",
              ].join(" ")}
            >
              <h2 className="text-xl font-semibold tracking-tight text-white">
                <Link href={pillar.href} className="hover:text-[var(--zari-gold-400)]">
                  {pillar.title}
                </Link>
                <span lang="mr" className="ml-2.5 text-base font-normal text-[var(--zari-gold-400)]">
                  {pillar.titleMr}
                </span>
              </h2>
              <p className="mt-3 max-w-[42ch] text-[0.9375rem] leading-relaxed text-slate-300">
                {pillar.summary}
              </p>
              <ul className="mt-5 space-y-2">
                {pillar.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-200 underline decoration-white/25 underline-offset-4 hover:decoration-[var(--zari-gold-400)] hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-auto border-t border-white/15 pt-4 text-[0.8125rem] text-slate-400 md:mt-8">
                {pillar.anchorFact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Citizen services. Rendered as one bordered unit split by internal rules rather than four
 * detached cards — closer to a row of service counters at the council office, and it keeps
 * the page from turning into a grid of identical tiles.
 */
function CitizenServicesStrip() {
  return (
    <section className="border-b border-[var(--border-subtle)] bg-white" aria-labelledby="services-heading">
      <div className="mx-auto max-w-[1180px] px-4 py-10">
        <h2 id="services-heading" className="mb-5 text-lg font-semibold tracking-tight text-[var(--gov-navy-900)]">
          Citizen services
        </h2>
        <div className="grid border border-[var(--border-subtle)] sm:grid-cols-2 lg:grid-cols-4">
          {citizenServices.map((service) => {
            const Icon = SERVICE_ICONS[service.icon];
            return (
              <Link
                key={service.id}
                href={service.href}
                className="group flex flex-col gap-2 border-b border-[var(--border-subtle)] p-5 last:border-b-0 hover:bg-[var(--bg-surface-ash)] sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:last:border-b-0 sm:[&:nth-child(-n+2)]:border-b lg:border-b-0 lg:border-r lg:last:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(-n+2)]:border-b-0"
              >
                <Icon size={19} aria-hidden className="text-[var(--zari-gold-600)]" />
                <span className="text-[0.9375rem] font-semibold text-[var(--gov-navy-900)] group-hover:underline">
                  {service.label}
                </span>
                <span className="text-[0.8125rem] leading-relaxed text-[var(--civic-slate-700)]">
                  {service.description}
                </span>
                {service.availability === "PHASE_2" ? (
                  <span className="mt-1 text-[0.75rem] text-[var(--civic-slate-500)]">
                    Counter service — online application not yet available
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function NoticeLedger() {
  return (
    <div className="overflow-x-auto border border-[var(--border-subtle)] bg-white">
      <table className="gov-table min-w-[40rem]">
        <caption className="sr-only">
          Council notice register, most recently published first
        </caption>
        <thead>
          <tr>
            <th scope="col" className="w-[7.5rem]">
              Published
            </th>
            <th scope="col" className="w-[8.5rem]">
              Category
            </th>
            <th scope="col">Subject</th>
            <th scope="col" className="w-[7.5rem]">
              Closes
            </th>
          </tr>
        </thead>
        <tbody>
          {ledgerEntries.map((entry) => (
            <tr key={entry.id}>
              <td>
                <time dateTime={entry.publishedAt}>{formatCivicDate(entry.publishedAt)}</time>
              </td>
              <td>
                <NotificationCategoryBadge category={entry.category} />
              </td>
              <td>
                <Link
                  href="/nagar-parishad/notifications"
                  className="font-medium text-[var(--gov-navy-900)] hover:underline"
                >
                  {entry.title}
                </Link>
                <span className="mt-1 block text-[0.75rem] text-[var(--civic-slate-500)]">
                  Reference {entry.referenceNo}
                </span>
              </td>
              <td>
                {entry.closingAt ? (
                  <time dateTime={entry.closingAt}>{formatCivicDate(entry.closingAt)}</time>
                ) : (
                  <span className="text-[var(--civic-slate-500)]">&mdash;</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CouncilPanel() {
  const ongoingWorks = developmentWorks.filter((work) => work.status === "ONGOING");

  return (
    <div className="space-y-6">
      <div className="border border-[var(--border-subtle)] bg-white">
        <h3 className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-slate)] px-4 py-2.5 text-sm font-semibold text-[var(--gov-navy-900)]">
          Elected representatives
        </h3>
        <ul className="divide-y divide-[var(--border-subtle)]">
          {electedRepresentatives.map((representative) => (
            <li key={representative.slug} className="px-4 py-3.5">
              <p className="text-[0.9375rem] font-semibold text-[var(--gov-navy-900)]">
                {representative.name}
              </p>
              <p className="mt-0.5 text-[0.8125rem] leading-snug text-[var(--civic-slate-700)]">
                {representative.designation}
              </p>
              {representative.termNote ? (
                <p className="mt-1 text-[0.75rem] text-[var(--civic-slate-500)]">
                  {representative.termNote}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="border-t border-[var(--border-subtle)] px-4 py-3">
          <Link
            href="/nagar-parishad/representatives"
            className="text-sm font-semibold text-[var(--gov-navy-700)] underline decoration-[var(--zari-gold-500)] decoration-2 underline-offset-4 hover:text-[var(--gov-navy-900)]"
          >
            All public representatives
          </Link>
        </div>
      </div>

      <div className="border border-[var(--border-subtle)] bg-white">
        <h3 className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-slate)] px-4 py-2.5 text-sm font-semibold text-[var(--gov-navy-900)]">
          Work in progress
        </h3>
        <ul className="divide-y divide-[var(--border-subtle)]">
          {ongoingWorks.map((work) => (
            <li key={work.id} className="px-4 py-3.5">
              <p className="text-sm font-medium text-[var(--gov-navy-900)]">{work.title}</p>
              <p className="mt-1.5 flex items-center gap-2 text-[0.75rem] text-[var(--civic-slate-500)]">
                <span className="civic-figure">Ward {work.wardNumber}</span>
                <WorkStatusBadge status={work.status} />
                <span className="civic-figure">{work.progressPct}% done</span>
              </p>
            </li>
          ))}
        </ul>
        <div className="border-t border-[var(--border-subtle)] px-4 py-3">
          <DataStatusBadge status="SAMPLE_TBD" />
        </div>
      </div>

      <div className="border border-[var(--border-subtle)] bg-white px-4 py-4">
        <h3 className="text-sm font-semibold text-[var(--gov-navy-900)]">Council office</h3>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-[var(--civic-slate-700)]">
          {councilProfile.addressLine}
        </p>
        <p className="mt-2 text-[0.8125rem]">
          <a href={`tel:${councilProfile.phone}`} className="civic-figure font-semibold text-[var(--gov-navy-700)] hover:underline">
            {councilProfile.phone}
          </a>
        </p>
      </div>
    </div>
  );
}

/** 17 wards at a glance. The numbering here is the wards' own, not a decorative sequence. */
function WardsOverview() {
  return (
    <section className="border-t border-[var(--border-subtle)] bg-white" aria-labelledby="wards-heading">
      <div className="mx-auto max-w-[1180px] px-4 py-14">
        <SectionHeading
          id="wards-heading"
          title={`${councilProfile.wardCount} wards at a glance`}
          description="Paithan Municipal Council is divided into 17 wards. Ward names, boundaries and the sitting corporator for each ward are pending publication by the council."
          action={{ label: "Open the ward map", href: "/nagar-parishad/ward-map" }}
        />

        <div className="grid grid-cols-2 border-l border-t border-[var(--border-subtle)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {wards.map((ward) => {
            const summary = getWardWorkSummary(ward.number);
            return (
              <div
                key={ward.number}
                className="border-b border-r border-[var(--border-subtle)] px-4 py-3.5"
              >
                <p className="flex items-baseline gap-2">
                  <span className="civic-figure text-xl font-semibold text-[var(--gov-navy-900)]">
                    {ward.number}
                  </span>
                  <span lang="mr" className="text-[0.8125rem] text-[var(--civic-slate-500)]">
                    {ward.nameMr}
                  </span>
                </p>
                <p className="mt-1.5 text-[0.75rem] leading-snug text-[var(--civic-slate-700)]">
                  {summary.total === 0 ? (
                    "No works listed"
                  ) : (
                    <>
                      <span className="civic-figure">{summary.total}</span>
                      {summary.total === 1 ? " work listed" : " works listed"}
                      {summary.ongoing > 0 ? (
                        <span className="block text-[var(--zari-gold-600)]">
                          <span className="civic-figure">{summary.ongoing}</span> ongoing
                        </span>
                      ) : null}
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5">
          <DataStatusBadge status="SAMPLE_TBD" />
          <p className="mt-2 max-w-[70ch] text-[0.8125rem] leading-relaxed text-[var(--civic-slate-700)]">
            The ward count of {councilProfile.wardCount} is confirmed. Work counts shown above come
            from illustrative records and do not reflect the council&rsquo;s actual works register.
          </p>
        </div>
      </div>
    </section>
  );
}

function SampleDataBand({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 border-l-[3px] border-[var(--zari-gold-500)] bg-[var(--zari-gold-100)]/40 px-4 py-3">
      <DataStatusBadge status="SAMPLE_TBD" />
      <p className="mt-2 max-w-[80ch] text-[0.8125rem] leading-relaxed text-[var(--civic-slate-700)]">
        {children}
      </p>
    </div>
  );
}
