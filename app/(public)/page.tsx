import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Landmark,
  Compass,
  FileText,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  ArrowUpRight,
  MapPin,
  CreditCard,
  Camera,
} from "lucide-react";
import { NotificationCategoryBadge } from "@/components/ui/NotificationCategoryBadge";
import {
  ButiOrnament,
  SectionFinial,
  FigureMount,
} from "@/components/ui/HistoricMotifs";
import { HomeVideoBand } from "@/components/layout/HomeVideoBand";
import PaithanMapEmbed from "@/components/PaithanMapEmbed";
import {
  councilProfile,
  developmentWorks,
  electedRepresentatives,
  formatCivicDate,
  getWardWorkSummary,
  notifications,
  paithanDemographics,
  wards,
  TOURIST_PLACES,
} from "@/lib/mock-data";

/** Newest notices first — the ledger reads like a register, most recent at the top. */
const ledgerEntries = [...notifications].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt)
);

/** The three wings of the platform, declared once so the hero and nav cannot drift. */
const WINGS = [
  {
    key: "civic",
    title: "Nagar Parishad",
    titleMr: "नगर परिषद",
    blurb:
      "Council administration for all 17 wards: elected representatives, the corporator roster, development works and official notices.",
    facts: "17 wards · Class C council · Established 1854",
    links: [
      { label: "Public representatives", href: "/nagar-parishad/representatives" },
      { label: "Ward directory & corporators", href: "/nagar-parishad/ward-map" },
      { label: "Development works register", href: "/nagar-parishad/development-works" },
      { label: "Tenders & public notices", href: "/nagar-parishad/notifications" },
    ],
  },
  {
    key: "heritage",
    title: "Heritage & Museum",
    titleMr: "वारसा व संग्रहालय",
    blurb:
      "Pratishthana, capital of the Satavahanas, the state archaeological museum, and two thousand years of Paithani silk weaving.",
    facts: "King Hala's Gaha Sattasai · GI-tagged Paithani silk",
    links: [
      { label: "Dr. Balasaheb Patil Museum", href: "/heritage/museum" },
      { label: "Satavahana coins & antiquities", href: "/heritage/artifacts" },
      { label: "History of ancient Pratishthana", href: "/heritage/history" },
      { label: "Sant Eknath & Paithani weaving", href: "/heritage/cultural-heritage" },
    ],
  },
  {
    key: "tourism",
    title: "Explore Paithan",
    titleMr: "पर्यटन व परिसर",
    blurb:
      "Jayakwadi Dam on the Godavari, the Nath Sagar wetland sanctuary, and the riverside ghats of the Sant Eknath pilgrimage circuit.",
    facts: "341 km² sanctuary · Winter migratory season",
    links: [
      { label: "Jayakwadi Dam & reservoir", href: "/tourism/jayakwadi" },
      { label: "Jaikwadi Bird Sanctuary", href: "/tourism/nath-sagar" },
      { label: "Temples & heritage sites", href: "/tourism/heritage-sites" },
      { label: "Suggested day routes", href: "/tourism/routes" },
    ],
  },
] as const;

export default function HomePage() {
  return (
    <>
      <HomeVideoBand />
      <Masthead />
      <CitizenServicesSection />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        {/*
          One finial per page, at the single structural break between the wing
          cards and the working sections. A manuscript marks its divisions too,
          and adding one here means the rest of the page can stay plain.
        */}
        <SectionFinial className="-mt-6 mb-6 lg:-mt-8 lg:mb-8" />
        <div className="grid gap-10 lg:grid-cols-12">
          {/* LEFT: TENDERS & PUBLIC NOTICES */}
          <section className="lg:col-span-8 flex flex-col" aria-labelledby="notices-heading">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <ButiOrnament className="h-8 w-4 shrink-0 text-[var(--saffron-700)]" />
                  <h2
                    id="notices-heading"
                    className="portal-rule font-display text-2xl font-semibold text-[var(--portal-blue-900)]"
                  >
                    Tenders and public notices
                  </h2>
                </div>
                <p className="mt-1.5 text-sm text-[var(--civic-slate-700)] max-w-2xl leading-relaxed">
                  Every announcement, scheme, tender and public notice the council issues is
                  published in one register, with its reference number and closing date.
                </p>
              </div>
              <Link
                href="/nagar-parishad/notifications"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--portal-blue-700)] hover:underline shrink-0"
              >
                <span>All notifications</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <NoticeLedger />
          </section>

          {/* RIGHT: THE COUNCIL SIDEBAR */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <CouncilPanel />
          </aside>
        </div>
      </div>

      <WardsOverview />
      <OfficialLandmarksShowcase />
      <PaithanMapEmbed />
    </>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Masthead. The memorable element is the vitals strip — the council's own vital
 * statistics set in a bordered block, the way a gazette opens. It replaces the
 * gradient-and-three-cards hero this page used to carry, which said nothing a
 * citizen did not already know.
 *
 * Paper, not colour. The full-bleed video closes immediately above this band, and
 * a saturated ground here would put two loud fields edge to edge; on white the
 * video ends on a clean line and the navy type needs no halo. The saffron that
 * used to fill this band now appears once, as the gazette rule under the title.
 *
 * The band is deliberately slim and ends at the vitals. The three wings then
 * straddle the paper/canvas boundary below, so the page opens calm and the
 * cards carry the only edges.
 */
function Masthead() {
  return (
    <>
      <section className="portal-masthead">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[var(--civic-slate-500)]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--portal-blue-800)]">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--saffron-700)]" aria-hidden="true" />
              Statutory Urban Local Body
            </span>
            <span className="text-[var(--border-strong)]" aria-hidden="true">
              |
            </span>
            <span>{councilProfile.districtEn} district, Maharashtra</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              {/*
                The illuminated initial. A manuscript opens on a painted capital
                and a municipal masthead is the same gesture, so the first letter
                is dropped into a madder square with a zari thread around it.
              */}
              <h1 className="font-display text-[2.1rem] font-semibold leading-[1.18] tracking-tight text-[var(--portal-blue-900)] sm:text-[2.6rem] lg:text-[3rem]">
                <span className="illuminated-cap" aria-hidden="true">
                  R
                </span>
                <span className="sr-only">R</span>ecords, services and information for the{" "}
                {councilProfile.wardCount} wards of Paithan
              </h1>

              <div className="gazette-rule mt-6" aria-hidden="true" />

              <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-[var(--civic-slate-700)]">
                Paithan is a municipal town of {councilProfile.wardCount} wards in
                Chhatrapati Sambhajinagar district, and the ancient Pratishthana &mdash; capital
                of the Satavahanas, and home of the Paithani weavers. The council publishes
                its records, the town&apos;s heritage and its visitor information here.
              </p>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--civic-slate-500)]">
                Pratishthana was the capital of the Satavahanas, and King Hala&apos;s
                <cite className="font-display-deva not-italic text-[var(--civic-slate-700)]">
                  {" "}Gaha Sattasai
                </cite>{" "}
                is still sung here after two thousand years. The cloth woven in this town carries
                the GI tag, and the peepal at the kund has not moved since the Satavahanas.
              </p>
            </div>

            <div className="lg:col-span-5 lg:pt-1">
              <dl className="portal-vitals">
                <div className="portal-vital">
                  <dt>Wards</dt>
                  <dd>{councilProfile.wardCount}</dd>
                </div>
                <div className="portal-vital">
                  <dt>Established</dt>
                  <dd>{councilProfile.establishedYear}</dd>
                </div>
                <div className="portal-vital">
                  <dt>Population</dt>
                  <dd>
                    {paithanDemographics.totalPopulation.toLocaleString("en-IN")}
                    <small> / Census {paithanDemographics.censusYear}</small>
                  </dd>
                </div>
                <div className="portal-vital">
                  <dt>Control room</dt>
                  <dd className="text-[1.05rem]">{councilProfile.phone}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/*
          The woven border closes the masthead. An earlier revision had the wing
          cards straddle the bottom edge on a negative margin, which would have
          covered this — so the straddle is gone and the border sits above the
          cards, where a pallu border actually is. The band is decorative and
          carries no information, so it is hidden from assistive technology.
        */}
        <div className="paithani-band mt-12" aria-hidden="true" />
      </section>

      {/*
        The three wings, sitting below the woven border rather than straddling
        the masthead's foot. The top rule on each card encodes the wing, so the
        colour carries meaning rather than ornament. Link rows are plain text —
        no chevron per row, which at four stacked rows per card read as machine
        output.
      */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid gap-5 md:grid-cols-3">
          {WINGS.map((wing) => (
            <article
              key={wing.key}
              className={`portal-card ${
                wing.key === "heritage"
                  ? "portal-card--heritage"
                  : wing.key === "tourism"
                    ? "portal-card--tourism"
                    : ""
              }`}
            >
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[var(--portal-blue-50)] text-[var(--portal-blue-800)]">
                    {wing.key === "civic" ? (
                      <Building2 className="h-4 w-4" aria-hidden="true" />
                    ) : wing.key === "heritage" ? (
                      <Landmark className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Compass className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold leading-tight text-[var(--portal-blue-900)]">
                      {wing.title}
                    </h2>
                    <span lang="mr" className="text-xs text-[var(--civic-slate-500)]">
                      {wing.titleMr}
                    </span>
                  </div>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-[var(--civic-slate-700)]">
                  {wing.blurb}
                </p>

                <ul className="mt-auto">
                  {wing.links.map((link) => (
                    <li
                      key={link.href + link.label}
                      className="border-t border-[var(--border-subtle)]"
                    >
                      <Link
                        href={link.href}
                        className="block py-2 text-sm font-medium text-[var(--portal-blue-800)] hover:text-[var(--zari-gold-600)] hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="flex items-center gap-1.5 border-t border-[var(--border-subtle)] bg-[var(--portal-blue-50)] px-5 py-2.5 text-xs font-medium text-[var(--civic-slate-700)]">
                <CheckCircle2
                  className="h-3.5 w-3.5 shrink-0 text-[var(--saffron-700)]"
                  aria-hidden="true"
                />
                {wing.facts}
              </p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Citizen services. On mobile this collapses to a three-tap emergency bar —
 * the one thing a citizen on a phone in a ward actually needs first.
 */
function CitizenServicesSection() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full mt-12 mb-14">
      {/* Mobile emergency quick bar */}
      <div className="sm:hidden mb-4 grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-[var(--border-subtle)] bg-[var(--border-subtle)]">
        <a
          href="tel:02431223010"
          className="flex min-h-[56px] flex-col items-center justify-center gap-0.5 bg-white px-1 py-2 text-center hover:bg-[var(--portal-blue-50)]"
        >
          <span className="flex items-center gap-1 text-xs font-bold text-[var(--portal-blue-900)]">
            <Building2 className="h-3.5 w-3.5 text-[var(--zari-gold-600)]" aria-hidden="true" />
            नगर परिषद
          </span>
          <span className="text-[11px] text-[var(--civic-slate-500)] tabular-nums">02431-223010</span>
        </a>
        <a
          href="tel:112"
          className="flex min-h-[56px] flex-col items-center justify-center gap-0.5 bg-white px-1 py-2 text-center hover:bg-[var(--portal-blue-50)]"
        >
          <span className="flex items-center gap-1 text-xs font-bold text-red-800">
            <Phone className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />
            पोलीस
          </span>
          <span className="text-[11px] text-[var(--civic-slate-500)] tabular-nums">112 / 223033</span>
        </a>
        <a
          href="tel:108"
          className="flex min-h-[56px] flex-col items-center justify-center gap-0.5 bg-white px-1 py-2 text-center hover:bg-[var(--portal-blue-50)]"
        >
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-800">
            <Phone className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            रुग्णालय
          </span>
          <span className="text-[11px] text-[var(--civic-slate-500)] tabular-nums">108 / 223040</span>
        </a>
      </div>

      <div className="rounded-sm border border-[var(--border-subtle)] bg-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <h2 className="portal-rule font-display text-xl font-semibold text-[var(--portal-blue-900)]">
            Citizen services
          </h2>
          <p className="text-xs text-[var(--civic-slate-500)]">
            Payment and certificate services run on state government portals
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceCard
            icon={<CreditCard className="h-5 w-5" aria-hidden="true" />}
            iconClass="bg-[var(--zari-gold-100)] text-[var(--zari-gold-600)]"
            title="Property tax & water charges"
            body="Assessment status, online payment receipts and dues inquiry through MahaULB."
            href="https://paithanmahaulb.maharashtra.gov.in"
            action="Pay or inquire online"
            external
          />
          <ServiceCard
            icon={<FileText className="h-5 w-5" aria-hidden="true" />}
            iconClass="bg-[var(--portal-blue-50)] text-[var(--portal-blue-700)]"
            title="Birth & death certificates"
            body="Civil registration certificates issued through the MahaOnline CRS portal."
            href="https://crsorgi.gov.in"
            action="Apply or download"
            external
          />
          <ServiceCard
            icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
            iconClass="bg-[var(--portal-blue-50)] text-[var(--portal-blue-800)]"
            title="Find your ward & corporator"
            body="Locate your municipal ward among the 17 and review the works listed for it."
            href="/nagar-parishad/ward-map"
            action="Open ward directory"
          />
          <ServiceCard
            icon={<Phone className="h-5 w-5" aria-hidden="true" />}
            iconClass="bg-red-50 text-red-700"
            title="Citizen grievance helpline"
            body="Sanitation, street lighting and water supply complaints."
            href="tel:02431223010"
            action="Call 02431-223010"
            footnote="Counter service. Online application not yet available."
          />
        </div>
      </div>
    </div>
  );
}

function ServiceCard({
  icon,
  iconClass,
  title,
  body,
  href,
  action,
  footnote,
  external,
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  body: string;
  href: string;
  action: string;
  footnote?: string;
  external?: boolean;
}) {
  const classes =
    "flex flex-col justify-between rounded-sm border border-[var(--border-subtle)] bg-[var(--portal-blue-50)] p-4 transition-colors hover:border-[var(--portal-blue-300)] hover:bg-white";

  const inner = (
    <>
      <div>
        <span
          className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${iconClass}`}
        >
          {icon}
        </span>
        <h3 className="font-display text-base font-semibold text-[var(--portal-blue-900)] mb-1">{title}</h3>
        <p className="text-xs text-[var(--civic-slate-700)] leading-relaxed">{body}</p>
        {footnote ? (
          <p className="mt-2 text-[11px] text-[var(--civic-slate-500)]">{footnote}</p>
        ) : null}
      </div>
      <span className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-2.5 text-xs font-bold text-[var(--portal-blue-700)]">
        {action}
        {external ? (
          <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
      </span>
    </>
  );

  if (href.startsWith("tel:") || external) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */

function NoticeLedger() {
  return (
    <div>
      {/*
        Provenance notice (rules.md §8). Loud by design: the register below is
        illustrative and must never be mistaken for live procurement data.
      */}
      <div className="mb-4 flex items-start gap-3 rounded-sm border border-[var(--border-subtle)] border-l-4 border-l-[var(--portal-blue-700)] bg-[var(--saffron-100)] p-4">
        <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5 text-[var(--portal-blue-700)]" aria-hidden="true" />
        <div>
          <span className="block text-xs font-bold text-[var(--portal-blue-800)]">
            Sample / TBD — confirm with Nagar Parishad
          </span>
          <p className="mt-1 text-xs text-[var(--civic-slate-700)] leading-relaxed">
            The register below is illustrative. Live tenders and notices replace these rows
            once the Nagar Parishad supplies its notice file.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-sm border border-[var(--border-subtle)] bg-white">
        <table className="portal-register">
          <caption className="sr-only">
            Council notice register, most recently published first
          </caption>
          <thead>
            <tr>
              <th scope="col">Published</th>
              <th scope="col">Category</th>
              <th scope="col">Subject</th>
              <th scope="col">Closes</th>
              <th scope="col" className="text-right">
                Notice
              </th>
            </tr>
          </thead>
          <tbody>
            {ledgerEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="whitespace-nowrap font-medium">
                  <time dateTime={entry.publishedAt}>{formatCivicDate(entry.publishedAt)}</time>
                </td>
                <td className="whitespace-nowrap">
                  <NotificationCategoryBadge category={entry.category} />
                </td>
                <td className="min-w-[16rem]">
                  <Link
                    href="/nagar-parishad/notifications"
                    className="block font-semibold text-[var(--portal-blue-800)] leading-snug hover:text-[var(--zari-gold-600)] hover:underline"
                  >
                    {entry.title}
                  </Link>
                  <span className="mt-0.5 block text-[11px] text-[var(--civic-slate-500)]">
                    Reference {entry.referenceNo}
                  </span>
                </td>
                <td className="whitespace-nowrap font-medium">
                  {entry.closingAt ? (
                    <time dateTime={entry.closingAt} className="font-bold text-red-700">
                      {formatCivicDate(entry.closingAt)}
                    </time>
                  ) : (
                    <span className="text-[var(--civic-slate-500)]">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap text-right">
                  <Link
                    href="/nagar-parishad/notifications"
                    className="inline-flex items-center justify-center rounded-sm border border-[var(--border-subtle)] bg-[var(--portal-blue-50)] p-2 text-[var(--portal-blue-800)] transition-colors hover:bg-[var(--portal-blue-800)] hover:text-white"
                    aria-label={`View notice: ${entry.title}`}
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function CouncilPanel() {
  const ongoingWorks = developmentWorks.filter((work) => work.status === "ONGOING");

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-sm border border-[var(--border-subtle)] bg-white" aria-labelledby="council-heading">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--portal-blue-50)] px-4 py-2.5">
          <h2 id="council-heading" className="font-display text-base font-semibold text-[var(--portal-blue-900)]">
            Elected representatives
          </h2>
          <span className="badge-tender badge-civic">Gazetted</span>
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {electedRepresentatives.map((representative) => (
            <div key={representative.slug} className="px-4 py-3">
              <span className="block text-sm font-bold text-[var(--portal-blue-900)]">
                {representative.name}
              </span>
              <span className="mt-0.5 block text-xs text-[var(--civic-slate-700)]">
                {representative.designation}
              </span>
              {representative.termNote ? (
                <span className="mt-1 block text-[11px] font-semibold text-[var(--zari-gold-600)]">
                  Elected term: {representative.termNote}
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--border-subtle)] bg-[var(--portal-blue-50)] px-4 py-2.5">
          <Link
            href="/nagar-parishad/representatives"
            className="flex items-center justify-between text-xs font-semibold text-[var(--portal-blue-800)] hover:text-[var(--zari-gold-600)]"
          >
            <span>All public representatives</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-sm border border-[var(--border-subtle)] bg-white" aria-labelledby="progress-heading">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--portal-blue-50)] px-4 py-2.5">
          <h2 id="progress-heading" className="font-display text-base font-semibold text-[var(--portal-blue-900)]">
            Work in progress
          </h2>
          <span className="text-[11px] font-medium text-[var(--civic-slate-500)]">
            {councilProfile.wardCount} wards
          </span>
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {ongoingWorks.slice(0, 3).map((work) => (
            <div key={work.id} className="px-4 py-3">
              <p className="text-xs font-semibold leading-snug text-[var(--portal-blue-900)]">
                {work.title}
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--civic-slate-500)]">
                <span className="font-semibold text-[var(--civic-slate-700)]">
                  Ward {work.wardNumber}
                </span>
                <span className="font-bold tabular-nums text-[var(--zari-gold-600)]">
                  {work.progressPct}% complete
                </span>
              </div>
              <div
                className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border-subtle)]"
                role="progressbar"
                aria-valuenow={work.progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${work.title} progress`}
              >
                <div
                  className="h-full rounded-full bg-[var(--zari-gold-500)]"
                  style={{ width: `${work.progressPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--border-subtle)] bg-[var(--portal-blue-50)] px-4 py-2.5">
          <Link
            href="/nagar-parishad/development-works"
            className="flex items-center justify-between text-xs font-semibold text-[var(--portal-blue-800)] hover:text-[var(--zari-gold-600)]"
          >
            <span>All development works</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="rounded-sm border border-[var(--border-subtle)] bg-white p-4" aria-labelledby="office-heading">
        <h2 id="office-heading" className="text-sm font-bold text-[var(--portal-blue-900)] mb-2">
          Council office
        </h2>
        <p className="text-xs text-[var(--civic-slate-700)] leading-relaxed">
          {councilProfile.addressLine}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-xs">
          <span className="text-[var(--civic-slate-500)]">Phone</span>
          <a
            href={`tel:${councilProfile.phone}`}
            className="font-bold tabular-nums text-[var(--portal-blue-800)] hover:text-[var(--zari-gold-600)] hover:underline"
          >
            {councilProfile.phone}
          </a>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** 17 wards at a glance */
function WardsOverview() {
  return (
    <section
      className="border-y border-[var(--border-subtle)] bg-[var(--portal-blue-50)] py-12"
      aria-labelledby="wards-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <h2
              id="wards-heading"
                className="portal-rule font-display text-2xl font-semibold text-[var(--portal-blue-900)]"
            >
              {councilProfile.wardCount} wards at a glance
            </h2>
            <p className="mt-1.5 text-sm text-[var(--civic-slate-700)] max-w-2xl">
              The council is divided into {councilProfile.wardCount} wards. Ward names,
              boundaries and the sitting corporator for each ward await publication by the
              council.
            </p>
          </div>
          <Link
            href="/nagar-parishad/ward-map"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--portal-blue-700)] hover:underline shrink-0"
          >
            <span>Open the ward directory</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {wards.map((ward) => {
            const summary = getWardWorkSummary(ward.number);
            return (
              <div
                key={ward.number}
                className="rounded-sm border border-[var(--border-subtle)] border-l-[3px] border-l-[var(--zari-gold-500)] bg-white p-3.5 transition-colors hover:border-[var(--portal-blue-300)] hover:border-l-[var(--portal-blue-700)]"
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xl font-bold tabular-nums text-[var(--portal-blue-900)]">
                    {ward.number}
                  </span>
                  <span className="rounded-sm bg-[var(--portal-blue-50)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--civic-slate-500)]">
                    Ward
                  </span>
                </div>
                <p
                  lang="mr"
                  className="text-xs font-semibold leading-snug text-[var(--civic-slate-900)] line-clamp-1"
                >
                  {ward.nameMr}
                </p>
                <p className="mt-2 text-[11px] text-[var(--civic-slate-500)]">
                  {summary.total === 0 ? (
                    "No works listed"
                  ) : (
                    <>
                      <span className="font-semibold tabular-nums text-[var(--civic-slate-700)]">
                        {summary.total}
                      </span>{" "}
                      works
                      {summary.ongoing > 0 ? (
                        <span className="block font-medium text-[var(--zari-gold-600)]">
                          {summary.ongoing} ongoing
                        </span>
                      ) : null}
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-6 rounded-sm border border-[var(--border-subtle)] bg-white p-3.5 text-xs text-[var(--civic-slate-700)]">
          <span className="font-bold text-[var(--zari-gold-600)]">Provenance note. </span>
          The ward count of {councilProfile.wardCount} is confirmed. Work counts above come
          from illustrative records and do not reflect the council&apos;s actual works register.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/** Visual tour of the town's landmarks. */
function OfficialLandmarksShowcase() {
  return (
    <section
      className="border-t border-[var(--border-subtle)] bg-white py-12 lg:py-14"
      aria-labelledby="sites-showcase-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--saffron-700)]">
              <Camera className="h-3.5 w-3.5" aria-hidden="true" />
              <span lang="mr">अधिकृत स्थळ दर्शन</span>
              <span className="font-normal text-[var(--civic-slate-500)]">
                Verified site imagery
              </span>
            </p>
            <h2
              id="sites-showcase-heading"
                className="portal-rule text-2xl font-bold tracking-tight text-[var(--portal-blue-900)]"
            >
              Official sites and landmarks of Paithan
            </h2>
            <p className="mt-1.5 text-sm text-[var(--civic-slate-700)] max-w-2xl">
              A visual reference for tourists, pilgrims and scholars visiting the spiritual
              and ancient capital on the Godavari.
            </p>
          </div>

          <Link
            href="/tourism/places-to-visit"
            className="inline-flex items-center gap-2 self-start rounded-sm border border-[var(--portal-blue-800)] bg-[var(--portal-blue-800)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--portal-blue-900)] md:self-auto"
          >
            <span>Explore all {TOURIST_PLACES.length} sites</span>
            <ArrowRight className="h-4 w-4 text-[var(--saffron-500)]" aria-hidden="true" />
          </Link>
        </div>

        {/*
          Asymmetric on purpose. Nine identical photo cards is the card-kit
          pattern the design brief warns against, so the lead site gets a wide
          feature and the remaining eight become a compact thumbnail ledger —
          a different rhythm rather than nine repeats of one component.
        */}
        <div className="grid gap-5 lg:grid-cols-12">
          <LandmarkFeature place={TOURIST_PLACES[0]} />

          <ul className="grid gap-px overflow-hidden rounded-sm border border-[var(--border-subtle)] bg-[var(--border-subtle)] sm:grid-cols-2 lg:col-span-7">
            {TOURIST_PLACES.slice(1).map((place) => (
              <li key={place.id} className="bg-white">
                <Link
                  href="/tourism/places-to-visit"
                  className="flex h-full items-start gap-3 p-3 transition-colors hover:bg-[var(--portal-blue-50)]"
                >
                  <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-sm bg-[var(--portal-blue-900)]">
                    <Image
                      src={place.imageUrl}
                      alt={place.imageAlt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold leading-snug text-[var(--portal-blue-900)]">
                      {place.nameEn}
                    </span>
                    <span lang="mr" className="mt-0.5 block text-[11px] text-[var(--civic-slate-500)]">
                      {place.nameMr}
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[var(--civic-slate-500)]">
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <MapPin className="h-3 w-3 text-[var(--zari-gold-600)]" aria-hidden="true" />
                        {place.distanceFromBusStand}
                      </span>
                      <span className="tabular-nums">{place.visitingHours}</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Lead landmark: the one site that gets the full-bleed treatment. */
function LandmarkFeature({ place }: { place: (typeof TOURIST_PLACES)[number] }) {
  return (
    <article className="portal-card overflow-hidden lg:col-span-5">
      <div className="relative h-60 w-full bg-[var(--portal-blue-900)] lg:h-full lg:min-h-[26rem]">
        <Image
          src={place.imageUrl}
          alt={place.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-cover"
        />
          <span className="absolute left-0 top-4 bg-[var(--portal-blue-900)]/90 px-3 py-1 text-xs font-semibold text-[var(--saffron-500)]">

          {place.category.replace(/_/g, " ").toLowerCase()}
        </span>
        {/* The drawn mount, so the photograph sits in a frame rather than
            floating as a modern rectangle inside a hand-drawn page. */}
        <span className="absolute inset-x-3 bottom-3 text-[var(--saffron-100)]">
          <FigureMount className="opacity-70" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-tight text-[var(--portal-blue-900)]">
          {place.nameEn}
        </h3>
        <p lang="mr" className="mt-0.5 text-sm font-medium text-[var(--civic-slate-500)]">
          {place.nameMr}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--civic-slate-700)]">
          {place.tagline}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-[var(--border-subtle)] bg-[var(--border-subtle)] text-xs">
          <div className="bg-[var(--portal-blue-50)] px-3 py-2">
            <dt className="text-[var(--civic-slate-500)]">From bus stand</dt>
            <dd className="mt-0.5 font-bold tabular-nums text-[var(--portal-blue-900)]">
              {place.distanceFromBusStand}
            </dd>
          </div>
          <div className="bg-[var(--portal-blue-50)] px-3 py-2">
            <dt className="text-[var(--civic-slate-500)]">Open</dt>
            <dd className="mt-0.5 font-bold tabular-nums text-[var(--portal-blue-900)]">
              {place.visitingHours}
            </dd>
          </div>
        </dl>

        <Link
          href="/tourism/places-to-visit"
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[var(--portal-blue-700)] hover:text-[var(--zari-gold-600)]"
        >
          <span>Open the site directory</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
