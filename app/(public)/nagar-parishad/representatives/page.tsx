import type { Metadata } from "next";
import { CircleAlert } from "lucide-react";
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

export const metadata: Metadata = {
  title: "Public representatives",
  description:
    "Elected representatives, council administration and the ward corporator register of Paithan Municipal Council.",
};

export default function RepresentativesPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Nagar Parishad", href: "/nagar-parishad" },
          { label: "Public representatives" },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title="Public representatives"
          description={`Who holds which office at ${councilProfile.nameEn}, and who represents each of the ${councilProfile.wardCount} wards. Office holders change with elections and administrative transfers — every record below carries the date or source it was checked against.`}
        />

        <section className="mt-12" aria-labelledby="elected-heading">
          <SectionHeading
            id="elected-heading"
            title="Elected representatives"
            description="Representatives elected to the Maharashtra Legislative Assembly and the Parliament of India for constituencies covering Paithan."
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
            title="Council administration"
            description="The executive and presiding offices of the Municipal Council."
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
            title="Ward corporators"
            description={`One corporator (Nagar Sevak) represents each of the council's ${councilProfile.wardCount} wards. Until the official roster is published, contact the council office with any ward matter.`}
            action={{ label: "Ward-wise development activity", href: "/nagar-parishad/nagar-sevak" }}
          />
          <RosterPendingNotice />
          <WardCorporatorRoster corporators={wardCorporators} />
        </section>

        <section className="mt-14" aria-labelledby="verification-heading">
          <h2 id="verification-heading" className="sr-only">
            How this page is verified
          </h2>
          <div className="border border-[var(--border-subtle)] bg-white px-5 py-5">
            <p className="max-w-[80ch] text-[0.8125rem] leading-relaxed text-[var(--civic-slate-700)]">
              Elected representative records are drawn from the 2024 Lok Sabha and Maharashtra
              Legislative Assembly results. Council administration and ward corporator records are
              reconfirmed with the Nagar Parishad before publication, because these change with
              transfers and council terms. To report a correction, write to{" "}
              <a
                href={`mailto:${councilProfile.email}`}
                className="font-medium text-[var(--gov-navy-700)] underline underline-offset-4"
              >
                {councilProfile.email}
              </a>{" "}
              or call{" "}
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

/**
 * Whether the council currently sits under an elected body or a State-appointed
 * Administrator is unresolved (PROJECT_STATUS.md §4). The page states that openly rather
 * than picking one and presenting it as fact.
 */
function CouncilStatusNotice() {
  return (
    <div className="mb-6 flex gap-3 border-l-[3px] border-[var(--zari-gold-500)] bg-[var(--zari-gold-100)]/40 px-4 py-3.5">
      <CircleAlert size={17} aria-hidden className="mt-0.5 shrink-0 text-[var(--zari-gold-600)]" />
      <div>
        <p className="max-w-[80ch] text-[0.875rem] leading-relaxed text-[var(--civic-slate-700)]">
          Whether the council is presently governed by an elected general body or by a
          State-appointed Administrator is awaiting confirmation. The President and Vice-President
          entries below are listed as offices, without a named holder, until the council confirms
          its current status.
        </p>
        <DataStatusBadge status="SAMPLE_TBD" className="mt-2.5" />
      </div>
    </div>
  );
}

function RosterPendingNotice() {
  return (
    <div className="mb-6 flex gap-3 border-l-[3px] border-[var(--zari-gold-500)] bg-[var(--zari-gold-100)]/40 px-4 py-3.5">
      <CircleAlert size={17} aria-hidden className="mt-0.5 shrink-0 text-[var(--zari-gold-600)]" />
      <div>
        <p className="max-w-[80ch] text-[0.875rem] leading-relaxed text-[var(--civic-slate-700)]">
          All {councilProfile.wardCount} wards are listed, but corporator names, photographs and
          direct contact numbers have not been published here. No name is shown unless the Nagar
          Parishad supplies it — placeholder names would be indistinguishable from an official
          roster.
        </p>
        <DataStatusBadge status="SAMPLE_TBD" className="mt-2.5" />
      </div>
    </div>
  );
}
