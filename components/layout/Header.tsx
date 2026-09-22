"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  Menu,
  X,
  Bot,
  Building2,
  Landmark,
  Compass,
  FileText,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* 1. TOP TIER: Government of Maharashtra & Citizen Assistance Bar */}
      <div className="gov-top-bar px-4 sm:px-6 lg:px-8 py-1.5 text-xs text-slate-300 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Government of Maharashtra
            </span>
            <span className="text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-300">
              Directorate of Municipal Administration (DMA)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="tel:02431223010"
              className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>Helpline: 02431-223010</span>
            </a>
            <span className="text-slate-600 hidden md:inline">|</span>
            <a
              href="mailto:munptn@gmail.com"
              className="hidden md:flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <Mail className="w-3 h-3 text-amber-400" />
              <span>munptn@gmail.com</span>
            </a>
            <span className="text-slate-600">|</span>
            <div className="inline-flex items-center rounded border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 text-[10px]">
              <span className="font-bold text-amber-400 mr-1">EN</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-300 ml-1 hover:text-amber-300 cursor-pointer">मराठी</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BRAND TIER: Paithan Municipal Council Header */}
      <div className="bg-white px-4 sm:px-6 lg:px-8 py-3.5 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#0C1E3C] text-amber-400 flex items-center justify-center font-serif text-xl sm:text-2xl font-bold shadow-inner border-2 border-amber-500/40 shrink-0">
              <span>प</span>
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 font-sans">
                Chhatrapati Sambhajinagar District, Maharashtra
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-[#0C1E3C] leading-tight font-serif tracking-tight">
                Paithan Municipal Council
              </h1>
              <div className="text-xs sm:text-sm font-medium text-amber-700">
                पैठण नगर परिषद • स्थापना १८५४
              </div>
            </div>
          </Link>

          {/* Chatbot Quick Trigger in Header */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/chatbot"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded border border-amber-600 bg-amber-50 hover:bg-amber-100/80 text-[#0C1E3C] text-xs font-semibold transition-all shadow-xs"
            >
              <Bot className="w-4 h-4 text-amber-600" />
              <span>Ask Paithan AI</span>
              <span className="bg-amber-600 text-white text-[9px] px-1.5 py-0.5 rounded font-mono uppercase">
                Citizen Bot
              </span>
            </Link>
          </div>

          {/* Mobile Actions: Emergency Call + Menu Toggle */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <a
              href="tel:02431223010"
              aria-label="Emergency Civic Helpline"
              className="w-9 h-9 rounded bg-[#FEF3C7] text-[#B45309] hover:bg-[#FDE68A] flex items-center justify-center transition-colors shrink-0"
              title="Civic Helpline: 02431-223010"
            >
              <Phone className="w-4 h-4" />
            </a>
            <Link
              href="/chatbot"
              aria-label="Ask Paithan AI"
              className="w-9 h-9 rounded bg-slate-100 text-[#0C1E3C] hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0"
              title="Citizen AI Bot"
            >
              <Bot className="w-4 h-4 text-[#D97706]" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-slate-700 hover:text-[#0C1E3C] hover:bg-slate-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION BAR: Institutional 4 Wings */}
      <nav className="gov-nav-bar hidden lg:block border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm font-medium">
          <div className="flex items-center space-x-1">
            <Link
              href="/"
              className="px-3.5 py-2.5 hover:bg-[#162B4E] hover:text-amber-300 transition-colors text-slate-100"
            >
              Home
            </Link>

            {/* Wing 1: Nagar Parishad */}
            <div className="relative group">
              <button
                className="px-3.5 py-2.5 hover:bg-[#162B4E] hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-100"
                onClick={() => toggleDropdown("nagar-parishad")}
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Nagar Parishad</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-64 bg-white text-slate-800 shadow-xl rounded-b border border-slate-200 py-2 z-50">
                <Link
                  href="/nagar-parishad"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-900 border-b border-slate-100"
                >
                  About Paithan Municipal Council
                </Link>
                <Link
                  href="/nagar-parishad/representatives"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  Public Representatives (MLA, MP, CEO)
                </Link>
                <Link
                  href="/nagar-parishad/ward-map"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  17 Wards & Ward Map
                </Link>
                <Link
                  href="/nagar-parishad/nagar-sevak"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  Ward-wise Nagar Sevaks
                </Link>
                <Link
                  href="/nagar-parishad/development-works"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  Development Works Registry
                </Link>
                <Link
                  href="/nagar-parishad/projects"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  Major Municipal Projects
                </Link>
                <Link
                  href="/nagar-parishad/notifications"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  Official Notices & Tenders
                </Link>
              </div>
            </div>

            {/* Wing 2: Heritage */}
            <div className="relative group">
              <button
                className="px-3.5 py-2.5 hover:bg-[#162B4E] hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-100"
                onClick={() => toggleDropdown("heritage")}
              >
                <Landmark className="w-4 h-4 text-amber-400" />
                <span>Heritage & Culture</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-64 bg-white text-slate-800 shadow-xl rounded-b border border-slate-200 py-2 z-50">
                <Link
                  href="/heritage/museum"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-900 border-b border-slate-100"
                >
                  Dr. Balasaheb Patil Museum
                </Link>
                <Link
                  href="/heritage/artifacts"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  Satavahana Coins & Artifacts
                </Link>
                <Link
                  href="/heritage/3d-models"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  3D Interactive Artifact Models
                </Link>
                <Link
                  href="/heritage/history"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  Ancient Pratishthana History
                </Link>
                <Link
                  href="/heritage/cultural-heritage"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  Paithani Sarees & Sant Eknath Tradition
                </Link>
              </div>
            </div>

            {/* Wing 3: Tourism */}
            <div className="relative group">
              <button
                className="px-3.5 py-2.5 hover:bg-[#162B4E] hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-100"
                onClick={() => toggleDropdown("tourism")}
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Tourism & Places</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-64 bg-white text-slate-800 shadow-xl rounded-b border border-slate-200 py-2 z-50">
                <Link
                  href="/tourism/jayakwadi"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-900 border-b border-slate-100"
                >
                  Jayakwadi Dam
                </Link>
                <Link
                  href="/tourism/nath-sagar"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  Nath Sagar & Jaikwadi Bird Sanctuary
                </Link>
                <Link
                  href="/tourism/places-to-visit"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  Places to Visit in Paithan
                </Link>
                <Link
                  href="/tourism/heritage-sites"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  Sant Eknath Samadhi & Temples
                </Link>
                <Link
                  href="/tourism/routes"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  1-Day & Pilgrim Tour Routes
                </Link>
                <Link
                  href="/tourism/map"
                  className="block px-4 py-2 hover:bg-slate-50 text-xs text-slate-700"
                >
                  Interactive Tourist Map
                </Link>
              </div>
            </div>

            {/* Direct Link: Notifications */}
            <Link
              href="/nagar-parishad/notifications"
              className="px-3.5 py-2.5 hover:bg-[#162B4E] hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-100"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Public Notices & Tenders</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/login"
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded border border-slate-700 hover:border-slate-500 transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0C1E3C] text-white border-t border-slate-800 px-4 py-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm border-b border-slate-800"
          >
            Home
          </Link>
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold py-1">
              Nagar Parishad
            </div>
            <div className="pl-3 space-y-1 text-sm text-slate-200">
              <Link
                href="/nagar-parishad"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1"
              >
                About Municipal Council
              </Link>
              <Link
                href="/nagar-parishad/representatives"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1"
              >
                Public Representatives (MLA, MP, CEO)
              </Link>
              <Link
                href="/nagar-parishad/ward-map"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1"
              >
                17 Wards Map
              </Link>
              <Link
                href="/nagar-parishad/development-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1"
              >
                Development Works
              </Link>
              <Link
                href="/nagar-parishad/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1"
              >
                Notices & Tenders
              </Link>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold py-1">
              Heritage & Tourism
            </div>
            <div className="pl-3 space-y-1 text-sm text-slate-200">
              <Link
                href="/heritage/museum"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1"
              >
                Dr. Balasaheb Patil Museum
              </Link>
              <Link
                href="/heritage/artifacts"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1"
              >
                Satavahana Antiquities
              </Link>
              <Link
                href="/tourism/jayakwadi"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1"
              >
                Jayakwadi Dam & Nath Sagar
              </Link>
              <Link
                href="/tourism/places-to-visit"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1"
              >
                Places to Visit
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <Link
              href="/chatbot"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Paithan AI</span>
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-slate-300"
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export { Header };

