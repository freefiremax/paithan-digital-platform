import type { Metadata } from "next";
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
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  councilProfile,
  developmentWorks,
  paithanDemographics,
  paithanEmergencyDirectory,
} from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "About Paithan Municipal Council",
  description:
    "Official civic administration profile, municipal departments, history since 1854, and governance of Paithan Municipal Council.",
};

export default function AboutNagarParishadPage() {
  const ongoingCount = developmentWorks.filter((w) => w.status === "ONGOING").length;
  const completedCount = developmentWorks.filter((w) => w.status === "COMPLETED").length;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Nagar Parishad", href: "/nagar-parishad" },
          { label: "About Council" },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title="About Paithan Municipal Council"
          description={`Established in ${councilProfile.establishedYear}, Paithan Municipal Council (पैठण नगर परिषद) provides essential civic infrastructure, public sanitation, drinking water supply, and urban planning services to the historical town of Paithan across its ${councilProfile.wardCount} administrative wards.`}
        />

        {/* 1. KEY AT-A-GLANCE METRICS */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="border border-[var(--border-subtle)] bg-white p-4">
            <span className="text-[0.75rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
              Establishment
            </span>
            <p className="mt-1 text-2xl font-bold text-[var(--gov-navy-900)] font-serif">
              {councilProfile.establishedYear}
            </p>
            <p className="text-[0.75rem] text-[var(--civic-slate-500)]">170+ years of civic service</p>
          </div>

          <div className="border border-[var(--border-subtle)] bg-white p-4">
            <span className="text-[0.75rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
              Civic Wards
            </span>
            <p className="mt-1 text-2xl font-bold text-[var(--gov-navy-900)] font-serif">
              {councilProfile.wardCount} Wards
            </p>
            <p className="text-[0.75rem] text-[var(--civic-slate-500)]">23 Delimited Seats</p>
          </div>

          <div className="border border-[var(--border-subtle)] bg-white p-4">
            <span className="text-[0.75rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
              Active Works
            </span>
            <p className="mt-1 text-2xl font-bold text-amber-700 font-serif">
              {ongoingCount} Ongoing
            </p>
            <p className="text-[0.75rem] text-[var(--civic-slate-500)]">{completedCount} Recently Completed</p>
          </div>

          <div className="border border-[var(--border-subtle)] bg-white p-4">
            <span className="text-[0.75rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
              Council Class
            </span>
            <p className="mt-1 text-2xl font-bold text-[var(--gov-navy-900)] font-serif">
              Class B / C
            </p>
            <p className="text-[0.75rem] text-[var(--civic-slate-500)]">Chhatrapati Sambhajinagar</p>
          </div>
        </div>

        {/* 2. ADMINISTRATIVE STRUCTURE & DEPARTMENTS */}
        <section className="mt-12" aria-labelledby="departments-heading">
          <SectionHeading
            id="departments-heading"
            title="Municipal Departments & Citizen Services"
            description="The administrative machinery of the Council is organized into specialized municipal departments operating under the Chief Officer."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border border-[var(--border-subtle)] bg-white p-5">
              <div className="flex items-center gap-2.5 text-[var(--gov-navy-900)] font-semibold text-[0.9375rem]">
                <Building2 className="w-5 h-5 text-[var(--zari-gold-600)]" />
                <span>General Administration</span>
              </div>
              <p className="mt-2 text-xs text-[var(--civic-slate-700)] leading-relaxed">
                Council board meetings, municipal establishment, citizen grievance coordination, RTI disclosures, and public relations.
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-5">
              <div className="flex items-center gap-2.5 text-[var(--gov-navy-900)] font-semibold text-[0.9375rem]">
                <ShieldCheck className="w-5 h-5 text-[var(--zari-gold-600)]" />
                <span>Public Health & Sanitation</span>
              </div>
              <p className="mt-2 text-xs text-[var(--civic-slate-700)] leading-relaxed">
                Daily door-to-door solid waste collection across 17 wards, drain desilting, vector control, and public toilet maintenance.
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-5">
              <div className="flex items-center gap-2.5 text-[var(--gov-navy-900)] font-semibold text-[0.9375rem]">
                <Award className="w-5 h-5 text-[var(--zari-gold-600)]" />
                <span>Water Supply & Sewerage</span>
              </div>
              <p className="mt-2 text-xs text-[var(--civic-slate-700)] leading-relaxed">
                Operation of the Godavari River water intake well, municipal filtration plant, pipeline distribution, and clean water ATMs.
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-5">
              <div className="flex items-center gap-2.5 text-[var(--gov-navy-900)] font-semibold text-[0.9375rem]">
                <FileText className="w-5 h-5 text-[var(--zari-gold-600)]" />
                <span>Town Planning & Public Works</span>
              </div>
              <p className="mt-2 text-xs text-[var(--civic-slate-700)] leading-relaxed">
                Construction and maintenance of municipal cement concrete roads, storm water drainage, street lighting, and building permissions.
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-5">
              <div className="flex items-center gap-2.5 text-[var(--gov-navy-900)] font-semibold text-[0.9375rem]">
                <Users className="w-5 h-5 text-[var(--zari-gold-600)]" />
                <span>Revenue & Property Tax</span>
              </div>
              <p className="mt-2 text-xs text-[var(--civic-slate-700)] leading-relaxed">
                Assessment of property tax, water usage billing, shop licenses, and integration with the state MahaULB digital payment gateway.
              </p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-5">
              <div className="flex items-center gap-2.5 text-[var(--gov-navy-900)] font-semibold text-[0.9375rem]">
                <CheckCircle2 className="w-5 h-5 text-[var(--zari-gold-600)]" />
                <span>Pilgrim & Tourism Welfare</span>
              </div>
              <p className="mt-2 text-xs text-[var(--civic-slate-700)] leading-relaxed">
                Special arrangements for the annual Nath Shashti fair, Godavari riverfront cleaning, visitor guidance, and cultural heritage support.
              </p>
            </div>
          </div>
        </section>

        {/* 3. VERIFIED DEMOGRAPHICS & CENSUS INDICATORS */}
        <section className="mt-14" aria-labelledby="demographics-heading">
          <SectionHeading
            id="demographics-heading"
            title="Town Demographics & Civic Indicators"
            description="Official Census of India and Directorate of Municipal Administration statistics for Paithan Municipal Council."
          />

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="border border-[var(--border-subtle)] bg-white p-4">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                Total Population
              </span>
              <p className="mt-1 text-xl font-bold text-[var(--gov-navy-900)] font-serif">
                {paithanDemographics.totalPopulation.toLocaleString("en-IN")}
              </p>
              <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">Census of India baseline</p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-4">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                Male Population
              </span>
              <p className="mt-1 text-xl font-bold text-[var(--gov-navy-900)] font-serif">
                {paithanDemographics.malePopulation.toLocaleString("en-IN")}
              </p>
              <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">51.2% of total</p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-4">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                Female Population
              </span>
              <p className="mt-1 text-xl font-bold text-[var(--gov-navy-900)] font-serif">
                {paithanDemographics.femalePopulation.toLocaleString("en-IN")}
              </p>
              <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">48.8% of total</p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-4">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                Sex Ratio
              </span>
              <p className="mt-1 text-xl font-bold text-emerald-800 font-serif">
                {paithanDemographics.sexRatio}
              </p>
              <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">Females per 1,000 males</p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-4">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                Total Households
              </span>
              <p className="mt-1 text-xl font-bold text-[var(--gov-navy-900)] font-serif">
                {paithanDemographics.totalHouseholds.toLocaleString("en-IN")}
              </p>
              <p className="text-[0.6875rem] text-[var(--civic-slate-500)]">Occupied residential units</p>
            </div>

            <div className="border border-[var(--border-subtle)] bg-white p-4">
              <span className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--civic-slate-500)]">
                Literacy Rate
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
            title="Emergency & Civic Helpline Directory"
            description="Verified contacts for essential municipal, public safety, medical, and utility helplines serving Paithan."
          />

          <div className="mt-6 overflow-hidden border border-[var(--border-subtle)] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--gov-navy-900)] text-white font-serif uppercase tracking-wider text-[0.6875rem]">
                    <th className="py-3 px-4">Department / Facility</th>
                    <th className="py-3 px-4">Officer Role / Section</th>
                    <th className="py-3 px-4">Direct Telephone</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4 text-center">Service Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {paithanEmergencyDirectory.map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[var(--gov-navy-900)] block">
                          {contact.departmentEn}
                        </span>
                        <span className="text-[0.6875rem] text-[var(--zari-gold-600)] font-medium">
                          {contact.departmentMr}
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
                            24×7 Available
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                            Office Hours
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 5. COUNCIL OFFICE LOCATION & CONTACT */}
        <section className="mt-14" aria-labelledby="contact-heading">
          <SectionHeading
            id="contact-heading"
            title="Council Secretariat & Helplines"
            description="Citizens and visitors may contact the municipal administrative offices during government working hours."
          />

          <div className="mt-6 border border-[var(--border-subtle)] bg-white p-6 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-semibold text-[var(--gov-navy-900)] font-serif">
                Paithan Municipal Council
              </h3>
              <p className="text-xs text-[var(--zari-gold-600)] font-medium">पैठण नगर परिषद कार्यालय</p>
              <div className="mt-4 space-y-2.5 text-xs text-[var(--civic-slate-700)]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[var(--zari-gold-600)] shrink-0 mt-0.5" />
                  <span>{councilProfile.addressLine}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--zari-gold-600)] shrink-0" />
                  <span>Working Hours: 09:45 AM – 06:15 PM (Monday through Saturday)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--zari-gold-600)] shrink-0" />
                  <span>Main Office Telephone: {councilProfile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--zari-gold-600)] shrink-0" />
                  <span>Official Email: {councilProfile.email}</span>
                </div>
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-[var(--border-subtle)] pt-6 md:pt-0 md:pl-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gov-navy-900)] mb-3">
                Quick Portal Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    href="/nagar-parishad/representatives"
                    className="text-[var(--gov-navy-700)] font-medium hover:underline flex items-center justify-between"
                  >
                    <span>Elected Representatives (MLA, MP, CEO)</span>
                    <span className="text-[var(--civic-slate-500)]">→</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nagar-parishad/ward-map"
                    className="text-[var(--gov-navy-700)] font-medium hover:underline flex items-center justify-between"
                  >
                    <span>17 Wards Directory & Locality Map</span>
                    <span className="text-[var(--civic-slate-500)]">→</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nagar-parishad/development-works"
                    className="text-[var(--gov-navy-700)] font-medium hover:underline flex items-center justify-between"
                  >
                    <span>Ward Development Works Registry</span>
                    <span className="text-[var(--civic-slate-500)]">→</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nagar-parishad/notifications"
                    className="text-[var(--gov-navy-700)] font-medium hover:underline flex items-center justify-between"
                  >
                    <span>Tenders & Official Gazette Notices</span>
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
