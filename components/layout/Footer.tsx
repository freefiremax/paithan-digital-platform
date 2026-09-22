import React from "react";
import Link from "next/link";
import { Phone, MapPin, ExternalLink, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#071224] text-slate-300 border-t-4 border-amber-600">
      {/* 1. TOP STATUTORY BAR: Emergency Helplines */}
      <div className="bg-[#0C1E3C] border-b border-slate-800 text-xs py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2 font-semibold text-amber-400">
            <Phone className="w-3.5 h-3.5" />
            <span>Emergency Services & Helplines (Paithan):</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-200">
            <span>
              Municipal Office: <strong className="text-white">02431-223010</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span>
              Water Supply Emergency: <strong className="text-white">02431-223015</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span>
              Paithan Police Station: <strong className="text-white">112 / 02431-223033</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span>
              Rural Hospital Paithan: <strong className="text-white">108 / 02431-223040</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
        {/* Col 1: Council Address & Office Hours */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-serif font-bold text-sm">
              प
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-serif">
                Paithan Municipal Council
              </h3>
              <p className="text-[11px] text-amber-400">पैठण नगर परिषद</p>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Local self-government urban local body providing civic amenities, infrastructure, and heritage preservation for the historic town of Paithan.
          </p>
          <div className="space-y-1.5 pt-1 text-slate-300">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Municipal Council Administrative Complex, Main Road, Tq. Paithan, Dist. Chhatrapati Sambhajinagar, Maharashtra - 431107
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Office Hours: 09:45 AM to 06:15 PM (Mon–Sat)</span>
            </div>
          </div>
        </div>

        {/* Col 2: Citizen Civic Services */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1.5">
            Civic Services & e-Governance
          </h4>
          <ul className="space-y-2 text-slate-300">
            <li>
              <a
                href="https://paithanmahaulb.maharashtra.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
              >
                <span>Online Property Tax Payment</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a
                href="https://crsorgi.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
              >
                <span>Birth & Death Registration (CRS)</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <Link href="/nagar-parishad/development-works" className="hover:text-amber-300 transition-colors">
                Ward-wise Development Works Status
              </Link>
            </li>
            <li>
              <Link href="/nagar-parishad/ward-map" className="hover:text-amber-300 transition-colors">
                Paithan 17 Wards Directory & Map
              </Link>
            </li>
            <li>
              <Link href="/nagar-parishad/notifications" className="hover:text-amber-300 transition-colors">
                E-Tenders & Municipal Notices
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Heritage & Tourism Wings */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1.5">
            Heritage & Tourism Portals
          </h4>
          <ul className="space-y-2 text-slate-300">
            <li>
              <Link href="/heritage/museum" className="hover:text-amber-300 transition-colors">
                Dr. Balasaheb Patil Archaeological Museum
              </Link>
            </li>
            <li>
              <Link href="/heritage/history" className="hover:text-amber-300 transition-colors">
                Ancient Pratishthana & Satavahana Dynasty
              </Link>
            </li>
            <li>
              <Link href="/heritage/cultural-heritage" className="hover:text-amber-300 transition-colors">
                Paithani Sarees GI Weaving Legacy
              </Link>
            </li>
            <li>
              <Link href="/tourism/jayakwadi" className="hover:text-amber-300 transition-colors">
                Jayakwadi Dam & Reservoir Engineering
              </Link>
            </li>
            <li>
              <Link href="/tourism/nath-sagar" className="hover:text-amber-300 transition-colors">
                Nath Sagar & Jaikwadi Bird Sanctuary
              </Link>
            </li>
            <li>
              <Link href="/tourism/routes" className="hover:text-amber-300 transition-colors">
                Pilgrim & Heritage Tourist Itineraries
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Official State Portals */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1.5">
            Government Links
          </h4>
          <ul className="space-y-2 text-slate-300">
            <li>
              <a
                href="https://aaplesarkar.mahaonline.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
              >
                <span>Aaple Sarkar Citizen Services</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a
                href="https://maharashtra.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
              >
                <span>Government of Maharashtra</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a
                href="https://aurangabad.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
              >
                <span>Chhatrapati Sambhajinagar District Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a
                href="https://mahatenders.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
              >
                <span>MahaTenders e-Procurement</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <Link href="/chatbot" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
                AI Citizen Assistant (&ldquo;Ask Paithan AI&rdquo;)
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. STATUTORY FOOTER: Disclaimers & Copyright */}
      <div className="border-t border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            © {new Date().getFullYear()} Paithan Municipal Council (पैठण नगर परिषद). All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-slate-200 cursor-pointer">Right to Information (RTI)</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Citizen Charter</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };

