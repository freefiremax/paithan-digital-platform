import React from "react";
import Link from "next/link";
import { Phone, MapPin, ExternalLink, Clock } from "lucide-react";
import { StateEmblem } from "@/components/ui/StateEmblem";

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-[var(--saffron-500)] bg-[var(--footer-bg)] text-[var(--on-vangi-muted)]">
      {/* 1. TOP STATUTORY BAR: Emergency Helplines. One step off the footer
          ground, so the bar reads as a separate band rather than the page
          running on. Saffron is the only warm note down here. */}
      <div className="border-b border-[var(--on-vangi-rule)] bg-[var(--vangi-850)] px-4 py-2.5 text-xs sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold text-[var(--saffron-500)]">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Emergency Services &amp; Helplines (Paithan)</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
            <span>
              Municipal Office:{" "}
              <strong className="text-white tabular-nums">02431-223010</strong>
            </span>
            <span>
              Water Supply:{" "}
              <strong className="text-white tabular-nums">02431-223015</strong>
            </span>
            <span>
              Police: <strong className="text-white tabular-nums">112 / 02431-223033</strong>
            </span>
            <span>
              Hospital: <strong className="text-white tabular-nums">108 / 02431-223040</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER GRID */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 text-xs md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Col 1: Council Address & Office Hours */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--saffron-500)] bg-[var(--portal-blue-800)] font-bold text-[var(--saffron-500)]"
              aria-hidden="true"
            >
              <span lang="mr">पै</span>
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">Paithan Municipal Council</h3>
              <p lang="mr" className="text-[11px] text-[var(--saffron-500)]">
                पैठण नगर परिषद
              </p>
            </div>
          </div>
          <p className="leading-relaxed text-[var(--on-vangi-muted)]">
            Local self-government urban local body providing civic amenities, infrastructure,
            and heritage preservation for the historic town of Paithan.
          </p>
          <div className="space-y-1.5 pt-1 text-[var(--on-vangi-muted)]">
            <div className="flex items-start gap-2">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--saffron-500)]"
                aria-hidden="true"
              />
              <span>
                Municipal Council Administrative Complex, Main Road, Tq. Paithan, Dist.
                Chhatrapati Sambhajinagar, Maharashtra - 431107
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock
                className="h-3.5 w-3.5 shrink-0 text-[var(--saffron-500)]"
                aria-hidden="true"
              />
              <span>Office Hours: 09:45 AM to 06:15 PM (Mon&ndash;Sat)</span>
            </div>
          </div>
        </div>

        {/* Col 2: Citizen Civic Services */}
        <nav className="space-y-3" aria-labelledby="footer-services">
          <h4
            id="footer-services"
            className="border-b border-[var(--on-vangi-rule)] pb-1.5 text-xs font-bold text-white"
          >
            Civic Services &amp; e-Governance
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://paithanmahaulb.maharashtra.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--saffron-500)]"
              >
                <span>Online Property Tax Payment</span>
                <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href="https://crsorgi.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--saffron-500)]"
              >
                <span>Birth &amp; Death Registration (CRS)</span>
                <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            </li>
            <li>
              <Link
                href="/nagar-parishad/development-works"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                Ward-wise Development Works Status
              </Link>
            </li>
            <li>
              <Link
                href="/nagar-parishad/ward-map"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                Paithan 17 Wards Directory &amp; Map
              </Link>
            </li>
            <li>
              <Link
                href="/nagar-parishad/notifications"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                E-Tenders &amp; Municipal Notices
              </Link>
            </li>
          </ul>
        </nav>

        {/* Col 3: Heritage & Tourism Wings */}
        <nav className="space-y-3" aria-labelledby="footer-heritage">
          <h4
            id="footer-heritage"
            className="border-b border-[var(--on-vangi-rule)] pb-1.5 text-xs font-bold text-white"
          >
            Heritage &amp; Tourism Portals
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/heritage/museum"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                Dr. Balasaheb Patil Archaeological Museum
              </Link>
            </li>
            <li>
              <Link
                href="/heritage/history"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                Ancient Pratishthana &amp; Satavahana Dynasty
              </Link>
            </li>
            <li>
              <Link
                href="/heritage/cultural-heritage"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                Paithani Sarees GI Weaving Legacy
              </Link>
            </li>
            <li>
              <Link
                href="/tourism/jayakwadi"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                Jayakwadi Dam &amp; Reservoir Engineering
              </Link>
            </li>
            <li>
              <Link
                href="/tourism/nath-sagar"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                Nath Sagar &amp; Jaikwadi Bird Sanctuary
              </Link>
            </li>
            <li>
              <Link
                href="/tourism/routes"
                className="transition-colors hover:text-[var(--saffron-500)]"
              >
                Pilgrim &amp; Heritage Tourist Itineraries
              </Link>
            </li>
          </ul>
        </nav>

        {/* Col 4: Official State Portals */}
        <nav className="space-y-3" aria-labelledby="footer-gov">
          <h4
            id="footer-gov"
            className="flex items-center gap-2 border-b border-[var(--on-vangi-rule)] pb-1.5 text-xs font-bold text-white"
          >
            <StateEmblem size={16} invert />
            <span>Government Links</span>
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://aaplesarkar.mahaonline.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--saffron-500)]"
              >
                <span>Aaple Sarkar Citizen Services</span>
                <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href="https://maharashtra.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--saffron-500)]"
              >
                <span>Government of Maharashtra</span>
                <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href="https://aurangabad.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--saffron-500)]"
              >
                <span>Chhatrapati Sambhajinagar District Portal</span>
                <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href="https://mahatenders.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-[var(--saffron-500)]"
              >
                <span>MahaTenders e-Procurement</span>
                <ExternalLink className="h-3 w-3 opacity-50" aria-hidden="true" />
              </a>
            </li>
            <li>
              <Link
                href="/chatbot"
                className="font-semibold text-[var(--saffron-500)] transition-colors hover:text-[var(--saffron-600)]"
              >
                AI Citizen Assistant
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* 3. STATUTORY FOOTER: Disclaimers & Copyright */}
      <div className="border-t border-[var(--on-vangi-rule)] px-4 py-4 text-[11px] lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Paithan Municipal Council (पैठण नगर परिषद).
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Right to Information (RTI)</span>
            <span>Citizen Charter</span>
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
