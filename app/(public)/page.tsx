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
  councilProfile,
  developmentWorks,
  electedRepresentatives,
  formatCivicDate,
  getWardWorkSummary,
  notifications,
  wards,
  TOURIST_PLACES,
} from "@/lib/mock-data";

/** Newest notices first — the ledger reads like a register, most recent at the top. */
const ledgerEntries = [...notifications].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt)
);

export default function HomePage() {
  return (
    <>
      <PillarsHero />
      <CitizenServicesSection />

      {/* Official Landmarks Showcase */}
      <OfficialLandmarksShowcase />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* LEFT: TENDERS & PUBLIC NOTICES */}
          <section className="lg:col-span-8 flex flex-col" aria-labelledby="notices-heading">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 id="notices-heading" className="text-2xl sm:text-[1.75rem] font-bold text-[#0C1E3C] font-serif tracking-tight">
                  Tenders and public notices
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Every announcement, scheme, tender and public notice the council issues is published here in one register, with its reference number and closing date.
                </p>
              </div>
              <Link
                href="/nagar-parishad/notifications"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#B45309] hover:underline whitespace-nowrap self-start sm:self-auto shrink-0"
              >
                <span>All notifications</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Sample Disclaimer Banner */}
            <div className="mb-5 rounded-lg border-l-4 border-[#D97706] bg-[#FEF3C7]/60 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B45309] block">
                    Sample / TBD — Confirm with Nagar Parishad
                  </span>
                  <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                    The register below is illustrative. Live tenders and notices will replace these rows once the Nagar Parishad supplies its notice file.
                  </p>
                </div>
              </div>
            </div>

            <NoticeLedger />
          </section>

          {/* RIGHT: THE COUNCIL SIDEBAR */}
          <aside className="lg:col-span-4 flex flex-col gap-6" aria-labelledby="council-heading">
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
 * Three-pillar hero featuring subtle Godavari River wave geometry and Stitch card styling.
 */
function PillarsHero() {
  return (
    <section className="relative w-full bg-[#071224] text-white overflow-hidden pb-16 pt-10 sm:pt-14">
      {/* Subtle Architectural & Godavari River Ripple Geometry Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg className="w-full h-full object-cover" fill="none" viewBox="0 0 1440 600" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 200 C300 120 450 320 800 210 C1150 100 1300 260 1600 180" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-100 260 C280 180 430 380 820 270 C1210 160 1320 320 1600 240" stroke="currentColor" strokeWidth="1" />
          <circle cx="950" cy="180" r="140" stroke="currentColor" strokeDasharray="4 6" strokeWidth="1" />
          <circle cx="950" cy="180" r="220" stroke="currentColor" strokeWidth="0.75" />
          <path d="M0 450 H1440 M0 490 H1440" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Institutional Context Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-[#FEF3C7] px-3.5 py-1 rounded-full backdrop-blur-md mb-4">
          <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Statutory Urban Local Body • Chhatrapati Sambhajinagar
          </span>
        </div>

        {/* Main Civic Headline */}
        <div className="max-w-4xl mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white tracking-tight leading-[1.15] font-serif">
            Civic, heritage and tourism information for Paithan
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Paithan is a municipal town of{" "}
            <span className="text-[#D97706] font-bold">17 wards</span> in Chhatrapati Sambhajinagar district, and the ancient Pratishthana, capital of the Satavahanas. The council publishes its records, the town’s heritage and its visitor information here.
          </p>
        </div>

        {/* 3 Pillar Triptych Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Nagar Parishad */}
          <div className="group relative bg-white text-slate-900 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0C1E3C]" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-[#0C1E3C] group-hover:bg-[#0C1E3C] group-hover:text-white transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#B45309] bg-[#FFFBEB] px-2 py-0.5 rounded uppercase tracking-wider border border-[#FEF3C7]">
                  MUNICIPAL GOV
                </span>
              </div>
              <div className="mb-2 flex items-baseline gap-2">
                <h2 className="text-xl font-bold text-[#0C1E3C] font-serif">Nagar Parishad</h2>
                <span lang="mr" className="text-sm text-slate-500 font-medium">नगर परिषद</span>
              </div>
              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Civic administration for Paithan&apos;s 17 wards, municipal council works, public representatives, and official notifications.
              </p>
              <ul className="flex flex-col gap-1 mb-6 text-xs">
                <li>
                  <Link href="/nagar-parishad/representatives" className="text-slate-800 hover:text-[#D97706] font-medium flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span>Public representatives</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/nagar-parishad/ward-map" className="text-slate-800 hover:text-[#D97706] font-medium flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span>Ward map & corporator roster</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/nagar-parishad/development-works" className="text-slate-800 hover:text-[#D97706] font-medium flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span>Development works registry</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/nagar-parishad/notifications" className="text-slate-800 hover:text-[#D97706] font-medium flex items-center justify-between py-1.5">
                    <span>Tenders & notices</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="pt-3 bg-slate-50 -mx-6 -mb-6 px-6 pb-4 border-t border-slate-100">
              <span className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                17 wards • Established 1854 • Class B/C Council
              </span>
            </div>
          </div>

          {/* Pillar 2: Heritage & Museum */}
          <div className="group relative bg-white text-slate-900 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#D97706] z-10" />
            <div>
              {/* Photo Preview */}
              <div className="relative h-32 w-full -mx-6 -mt-6 mb-4 overflow-hidden bg-slate-900">
                <Image
                  src="/images/sites/balasaheb-patil-museum.jpg"
                  alt="Dr. Balasaheb Patil Museum gallery"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <span className="absolute top-3 right-3 text-[10px] font-bold text-amber-900 bg-amber-100/90 backdrop-blur-xs px-2 py-0.5 rounded uppercase tracking-wider border border-amber-300">
                  ARCHAEOLOGY & ARTS
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#B45309] shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0C1E3C] font-serif leading-tight">Heritage & Museum</h2>
                  <span lang="mr" className="text-xs text-slate-500 font-medium">वारसा व संग्रहालय</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Imperial capital of the Satavahanas (Pratishthana), 2,000-year-old GI-tagged Paithani silk, and Varkari saint traditions.
              </p>
              <ul className="flex flex-col gap-1 mb-6 text-xs">
                <li>
                  <Link href="/heritage/museum" className="text-slate-800 hover:text-[#D97706] font-medium flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span>Dr. Balasaheb Patil Museum</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/heritage/museum" className="text-slate-800 hover:text-[#D97706] font-medium flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span>Satavahana coins & antiquities</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/heritage/history" className="text-slate-800 hover:text-[#D97706] font-medium flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span>Ancient Pratishthana history</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/tourism/places-to-visit" className="text-slate-800 hover:text-[#D97706] font-medium flex items-center justify-between py-1.5">
                    <span>Paithani Weavers & Eknath Wada</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="pt-3 bg-[#FFFBEB] -mx-6 -mb-6 px-6 pb-4 border-t border-[#FEF3C7]">
              <span className="text-[11px] text-[#B45309] flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D97706]" />
                Capital of King Hala • GI Paithani Weaving
              </span>
            </div>
          </div>

          {/* Pillar 3: Explore Paithan */}
          <div className="group relative bg-white text-slate-900 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0369A1] z-10" />
            <div>
              {/* Photo Preview */}
              <div className="relative h-32 w-full -mx-6 -mt-6 mb-4 overflow-hidden bg-slate-900">
                <Image
                  src="/images/sites/jayakwadi-dam.jpg"
                  alt="Jayakwadi Dam reservoir"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <span className="absolute top-3 right-3 text-[10px] font-bold text-sky-900 bg-sky-100/90 backdrop-blur-xs px-2 py-0.5 rounded uppercase tracking-wider border border-sky-300">
                  NATURE & RESERVOIR
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] flex items-center justify-center text-[#0369A1] shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0C1E3C] font-serif leading-tight">Explore Paithan</h2>
                  <span lang="mr" className="text-xs text-slate-500 font-medium">पर्यटन व परिसर</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Jayakwadi Dam across the Godavari, Nath Sagar wetland sanctuary for Siberian flamingos, and sacred riverside ghats.
              </p>
              <ul className="flex flex-col gap-1 mb-6 text-xs">
                <li>
                  <Link href="/tourism/places-to-visit" className="text-slate-800 hover:text-[#D97706] font-medium flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span>Jayakwadi Dam & reservoir</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/tourism/places-to-visit" className="text-slate-800 hover:text-[#D97706] font-medium flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span>Jaikwadi Bird Sanctuary</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/tourism/places-to-visit" className="text-slate-800 hover:text-[#D97706] font-medium flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span>Sant Eknath Samadhi & Temples</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
                <li>
                  <Link href="/tourism/routes" className="text-slate-800 hover:text-[#D97706] font-medium flex items-center justify-between py-1.5">
                    <span>Curated 1-day travel routes</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="pt-3 bg-[#F0F9FF] -mx-6 -mb-6 px-6 pb-4 border-t border-[#BAE6FD]">
              <span className="text-[11px] text-[#0369A1] flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0369A1]" />
                341 km² Sanctuary • 200+ Migratory Birds
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Citizen Services deck.
 * Mobile: Quick Emergency 3-tap action strip + 2x2 touch grid.
 * Desktop: Overlapping floating card deck (-mt-8) with styled themed cards.
 */
function CitizenServicesSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full mb-10">
      {/* Mobile Emergency Quick Bar (Visible on mobile only) */}
      <div className="sm:hidden rounded-xl bg-white p-2.5 shadow-sm border border-slate-200 mb-4 flex items-center justify-between gap-1">
        <a
          href="tel:02431223010"
          className="flex-1 min-h-[44px] flex flex-col items-center justify-center p-1 rounded hover:bg-slate-50 transition-colors text-center"
        >
          <span className="flex items-center gap-1 text-[11px] text-[#0C1E3C] font-bold">
            <Building2 className="w-3.5 h-3.5 text-[#D97706]" />
            नगर परिषद
          </span>
          <span className="text-[10px] text-slate-500 font-medium">02431-223010</span>
        </a>
        <div className="w-px h-6 bg-slate-200 shrink-0" />
        <a
          href="tel:112"
          className="flex-1 min-h-[44px] flex flex-col items-center justify-center p-1 rounded hover:bg-slate-50 transition-colors text-center"
        >
          <span className="flex items-center gap-1 text-[11px] text-red-700 font-bold">
            <Phone className="w-3.5 h-3.5 text-red-600" />
            पोलीस कक्ष
          </span>
          <span className="text-[10px] text-slate-500 font-medium">112 / 223033</span>
        </a>
        <div className="w-px h-6 bg-slate-200 shrink-0" />
        <a
          href="tel:108"
          className="flex-1 min-h-[44px] flex flex-col items-center justify-center p-1 rounded hover:bg-slate-50 transition-colors text-center"
        >
          <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            रुग्णालय
          </span>
          <span className="text-[10px] text-slate-500 font-medium">108 / 223040</span>
        </a>
      </div>

      {/* Citizen Services Card Container */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
              Fast Citizen Gateway
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0C1E3C] font-serif">
              Citizen services
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>24/7 Digital Self-Assessment & Unified Records</span>
          </div>
        </div>

        {/* 4 Polished Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Service 1: Property Tax */}
          <div className="group bg-slate-50 hover:bg-[#EFF4FF] rounded-lg p-4 transition-all duration-200 flex flex-col justify-between border border-slate-100">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#B45309] mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0C1E3C] mb-1">
                Property tax & water charges
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Assessment status, online payment receipts and dues inquiry via MahaULB.
              </p>
            </div>
            <a
              href="https://paithanmahaulb.maharashtra.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between text-[#B45309] text-[11px] uppercase tracking-wider hover:text-[#0C1E3C] pt-2 font-bold border-t border-slate-200"
            >
              <span>Pay / Inquire Online</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Service 2: Birth & Death */}
          <div className="group bg-slate-50 hover:bg-[#EFF4FF] rounded-lg p-4 transition-all duration-200 flex flex-col justify-between border border-slate-100">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0369A1] mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0C1E3C] mb-1">
                Birth & death certificates
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Official civil registration certificates through MahaOnline CRS portal.
              </p>
            </div>
            <a
              href="https://crsorgi.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between text-[#0369A1] text-[11px] uppercase tracking-wider hover:text-[#0C1E3C] pt-2 font-bold border-t border-slate-200"
            >
              <span>Apply / Download (CRS)</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Service 3: Find Ward */}
          <div className="group bg-slate-50 hover:bg-[#EFF4FF] rounded-lg p-4 transition-all duration-200 flex flex-col justify-between border border-slate-100">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#D3E4FE] flex items-center justify-center text-[#0C1E3C] mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0C1E3C] mb-1">
                Find your ward & corporator
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Locate your municipal ward among the 17 wards and review ongoing works.
              </p>
            </div>
            <Link
              href="/nagar-parishad/ward-map"
              className="inline-flex items-center justify-between text-[#0C1E3C] text-[11px] uppercase tracking-wider hover:text-[#D97706] pt-2 font-bold border-t border-slate-200"
            >
              <span>Explore Wards</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Service 4: Grievance Helpline */}
          <div className="group bg-slate-50 hover:bg-[#EFF4FF] rounded-lg p-4 transition-all duration-200 flex flex-col justify-between border border-slate-100">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#B91C1C] mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0C1E3C] mb-1">
                Citizen grievance helpline
              </h3>
              <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                Civic complaints, sanitation alerts and water supply disruptions.
              </p>
              <span className="text-[10px] text-slate-400 italic block mb-3">
                Counter service — online application not yet available
              </span>
            </div>
            <a
              href="tel:02431223010"
              className="inline-flex items-center justify-between text-[#B91C1C] text-[11px] uppercase tracking-wider hover:text-[#0C1E3C] pt-2 font-bold border-t border-slate-200"
            >
              <span>Call 02431-223010</span>
              <Phone className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function NoticeLedger() {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-xs border-collapse">
        <caption className="sr-only">
          Council notice register, most recently published first
        </caption>
        <thead>
          <tr className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <th scope="col" className="py-3.5 px-4 whitespace-nowrap">Published</th>
            <th scope="col" className="py-3.5 px-3 whitespace-nowrap">Category</th>
            <th scope="col" className="py-3.5 px-4 min-w-[16rem]">Subject</th>
            <th scope="col" className="py-3.5 px-4 whitespace-nowrap">Closes</th>
            <th scope="col" className="py-3.5 px-3 text-right whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-800">
          {ledgerEntries.map((entry) => (
            <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-600">
                <time dateTime={entry.publishedAt}>{formatCivicDate(entry.publishedAt)}</time>
              </td>
              <td className="py-3.5 px-3 whitespace-nowrap">
                <NotificationCategoryBadge category={entry.category} />
              </td>
              <td className="py-3.5 px-4">
                <Link
                  href="/nagar-parishad/notifications"
                  className="font-medium text-[#0C1E3C] hover:text-[#B45309] hover:underline block leading-snug"
                >
                  {entry.title}
                </Link>
                <span className="mt-0.5 block text-[11px] text-slate-400 font-mono">
                  Reference {entry.referenceNo}
                </span>
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">
                {entry.closingAt ? (
                  <time dateTime={entry.closingAt} className="text-[#B91C1C] font-semibold">
                    {formatCivicDate(entry.closingAt)}
                  </time>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="py-3.5 px-3 text-right whitespace-nowrap">
                <Link
                  href="/nagar-parishad/notifications"
                  className="inline-flex items-center justify-center p-1.5 rounded bg-slate-100 hover:bg-[#0C1E3C] hover:text-white text-slate-700 transition-colors"
                  title="View Notice Details"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function CouncilPanel() {
  const ongoingWorks = developmentWorks.filter((work) => work.status === "ONGOING");

  return (
    <div className="space-y-6">
      {/* Elected Representatives */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0C1E3C]">
            Elected representatives
          </h3>
          <span className="text-[10px] bg-[#FEF3C7] text-[#B45309] font-bold px-2 py-0.5 rounded">
            Gazetted
          </span>
        </div>
        <div className="p-4 space-y-3">
          {electedRepresentatives.map((representative) => (
            <div key={representative.slug} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-sm font-bold text-[#0C1E3C] block font-serif">
                {representative.name}
              </span>
              <span className="text-xs text-slate-600 block mt-0.5">
                {representative.designation}
              </span>
              {representative.termNote && (
                <span className="text-[11px] text-[#B45309] font-semibold block mt-1">
                  Elected term: {representative.termNote}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50/50">
          <Link
            href="/nagar-parishad/representatives"
            className="text-xs font-semibold text-[#0C1E3C] hover:text-[#D97706] hover:underline flex items-center justify-between"
          >
            <span>All public representatives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Work in Progress */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0C1E3C]">
            Work in progress
          </h3>
          <span className="text-[10px] text-slate-500 font-medium">17 Wards</span>
        </div>
        <div className="p-4 space-y-3">
          {ongoingWorks.slice(0, 3).map((work) => (
            <div key={work.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-xs font-semibold text-[#0C1E3C] leading-snug">{work.title}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Ward {work.wardNumber}</span>
                <span className="font-bold text-[#B45309]">{work.progressPct}% done</span>
              </div>
              <div className="mt-1.5 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#D97706] h-full rounded-full transition-all"
                  style={{ width: `${work.progressPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50/50 flex items-center justify-between">
          <Link
            href="/nagar-parishad/development-works"
            className="text-xs font-semibold text-[#0C1E3C] hover:text-[#D97706] hover:underline flex items-center gap-1"
          >
            <span>All development works</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Council Office Contact Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0C1E3C] mb-2">
          Council office
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {councilProfile.addressLine}
        </p>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Phone:</span>
          <a
            href={`tel:${councilProfile.phone}`}
            className="font-bold text-[#0C1E3C] hover:text-[#D97706] hover:underline"
          >
            {councilProfile.phone}
          </a>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** 17 wards at a glance */
function WardsOverview() {
  return (
    <section className="border-t border-slate-200 bg-slate-50 py-14" aria-labelledby="wards-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 id="wards-heading" className="text-2xl sm:text-[1.75rem] font-bold text-[#0C1E3C] font-serif">
              {councilProfile.wardCount} wards at a glance
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
              Paithan Municipal Council is divided into 17 wards. Ward names, boundaries and the sitting corporator for each ward are pending publication by the council.
            </p>
          </div>
          <Link
            href="/nagar-parishad/ward-map"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#B45309] hover:underline self-start sm:self-auto shrink-0"
          >
            <span>Open the ward map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {wards.map((ward) => {
            const summary = getWardWorkSummary(ward.number);
            return (
              <div
                key={ward.number}
                className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-xs hover:border-[#D97706]/50 transition-colors"
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xl font-bold text-[#0C1E3C] font-serif">
                    {ward.number}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                    Ward {ward.number}
                  </span>
                </div>
                <p lang="mr" className="text-xs font-semibold text-slate-800 leading-snug line-clamp-1">
                  {ward.nameMr}
                </p>
                <p className="mt-2 text-[11px] text-slate-500">
                  {summary.total === 0 ? (
                    "No works listed"
                  ) : (
                    <>
                      <span className="font-semibold text-slate-700">{summary.total}</span> works
                      {summary.ongoing > 0 ? (
                        <span className="block text-[#B45309] font-medium">
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

        <div className="mt-6 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-slate-700">
          <span className="font-bold text-[#B45309] uppercase tracking-wider text-[10px] block mb-1">
            Provenance Note:
          </span>
          The ward count of {councilProfile.wardCount} is confirmed. Work counts shown above come from illustrative records and do not reflect the council’s actual works register.
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Official Visual Tour of Paithan: showcasing authentic photography of all
 * major landmarks, shrines, reservoir and archaeological excavation sites.
 */
function OfficialLandmarksShowcase() {
  return (
    <section className="bg-slate-100/70 border-y border-slate-200 py-12 lg:py-16" aria-labelledby="sites-showcase-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
              <Camera className="w-3.5 h-3.5 text-amber-700" />
              <span>अधिकृत स्थळ दर्शन • Verified Official Site Imagery</span>
            </div>
            <h2 id="sites-showcase-heading" className="text-2xl sm:text-3xl font-bold text-[#0C1E3C] font-serif tracking-tight">
              Official Sites & Landmarks of Paithan
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Authentic visual reference for tourists, pilgrims, and scholars visiting the spiritual and ancient capital on the Godavari.
            </p>
          </div>

          <Link
            href="/tourism/places-to-visit"
            className="inline-flex items-center gap-2 bg-[#0C1E3C] hover:bg-[#071224] text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition self-start md:self-auto"
          >
            <span>Explore All 9 Sites</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>

        {/* 9 Sites Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOURIST_PLACES.map((place) => (
            <article
              key={place.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Official Image Container */}
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={place.imageUrl}
                    alt={place.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-[#0C1E3C]/90 text-[var(--zari-gold-300)] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-xs">
                      {place.category.replace("_", " ")}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs border border-emerald-500/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      अधिकृत
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-mono text-[11px] bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {place.distanceFromBusStand}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-[#0C1E3C] font-serif group-hover:text-amber-700 transition-colors">
                    {place.nameEn}
                  </h3>
                  <p lang="mr" className="text-xs text-slate-500 font-medium mt-0.5">
                    {place.nameMr}
                  </p>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {place.tagline}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    {place.visitingHours.split("(")[0]}
                  </span>
                  <Link
                    href="/tourism/places-to-visit"
                    className="inline-flex items-center gap-1 font-semibold text-[#0C1E3C] hover:text-[#D97706]"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

