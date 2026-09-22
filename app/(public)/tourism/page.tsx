import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Clock,
  Waves,
  Feather,
  ArrowRight,
  Sparkles,
  Tag,
} from "lucide-react";
import { TOURIST_PLACES } from "@/lib/mock-data";


export const metadata: Metadata = {
  title: "Tourism & Pilgrimage Guide | Paithan Municipal Council (पैठण नगर परिषद)",
  description:
    "Explore Paithan: Jayakwadi Dam, Nath Sagar Bird Sanctuary, Sant Eknath Samadhi Mandir, Sant Dnyaneshwar Udyan, and ancient Satavahana heritage.",
};

export default function TourismLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#071224] via-[#0C1E3C] to-[#122B54] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Pratishthana Civic & Pilgrim Tourism</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              पैठण पर्यटन व तीर्थक्षेत्र दर्शन (Paithan Tourism)
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Discover Asia&apos;s largest earthen dam at Jayakwadi, Siberian flamingos in Nath Sagar, the sacred samadhi shrine of Sant Eknath, and the 2,000-year-old living art of Paithani silk.
            </p>
          </div>
        </div>

        {/* Quick Tourism Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/tourism/jayakwadi"
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition text-center group"
          >
            <Waves className="w-6 h-6 text-blue-600 mx-auto group-hover:scale-110 transition" />
            <div className="font-bold text-xs text-slate-900 mt-2">Jayakwadi Dam</div>
            <div className="text-[10px] text-slate-500">Asia&apos;s Earthen Marvel</div>
          </Link>

          <Link
            href="/tourism/nath-sagar"
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition text-center group"
          >
            <Feather className="w-6 h-6 text-emerald-600 mx-auto group-hover:scale-110 transition" />
            <div className="font-bold text-xs text-slate-900 mt-2">Nath Sagar Sanctuary</div>
            <div className="text-[10px] text-slate-500">200+ Migratory Birds</div>
          </Link>

          <Link
            href="/tourism/heritage-sites"
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition text-center group"
          >
            <Sparkles className="w-6 h-6 text-amber-600 mx-auto group-hover:scale-110 transition" />
            <div className="font-bold text-xs text-slate-900 mt-2">Sacred Shrines & Ghats</div>
            <div className="text-[10px] text-slate-500">Sant Eknath & Nagghat</div>
          </Link>

          <Link
            href="/tourism/map"
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition text-center group"
          >
            <MapPin className="w-6 h-6 text-purple-600 mx-auto group-hover:scale-110 transition" />
            <div className="font-bold text-xs text-slate-900 mt-2">Interactive Map</div>
            <div className="text-[10px] text-slate-500">GPS & Route Directions</div>
          </Link>
        </div>

        {/* Tourist Places Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Must-Visit Destinations in Paithan</h2>
              <p className="text-xs text-slate-500">Verified entry timings, distances, and seasonal highlights</p>
            </div>
            <Link
              href="/tourism/routes"
              className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1"
            >
              <span>View Day Itineraries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOURIST_PLACES.map((place) => (
              <div
                key={place.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-amber-400/80 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {place.category.replace("_", " ")}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {place.distanceFromBusStand}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{place.nameEn}</h3>
                    <p className="text-xs text-slate-500 font-marathi mt-0.5">{place.nameMr}</p>
                    <p className="text-xs text-amber-800 font-medium mt-1">{place.tagline}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {place.description}
                  </p>

                  <div className="space-y-1.5 pt-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{place.visitingHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Entry: {place.entryFee}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">{place.bestSeason}</span>
                  <Link
                    href={`/tourism/places-to-visit#${place.slug}`}
                    className="text-amber-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Full Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
