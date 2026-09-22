"use client";

import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Compass,
  ExternalLink,
  Clock,
  Waves,
} from "lucide-react";


interface MapPoint {
  id: string;
  nameEn: string;
  nameMr: string;
  category: "PILGRIM" | "DAM_NATURE" | "GARDEN" | "WEAVING" | "CIVIC";
  lat: number;
  lng: number;
  distanceFromBusStand: string;
  timings: string;
  description: string;
}

const MAP_POINTS: MapPoint[] = [
  {
    id: "p-eknath-mandir",
    nameEn: "Sant Eknath Maharaj Samadhi Mandir & Nagghat",
    nameMr: "संत एकनाथ महाराज समाधी मंदिर व नागघाट",
    category: "PILGRIM",
    lat: 19.482,
    lng: 75.387,
    distanceFromBusStand: "1.2 km",
    timings: "05:00 AM – 09:30 PM",
    description: "Sacred Jalsamadhi shrine of Sant Eknath on the Godavari banks.",
  },
  {
    id: "p-eknath-wada",
    nameEn: "Sant Eknath Ancestral Wada",
    nameMr: "संत एकनाथ वाडा (श्रीखंड्या खांब)",
    category: "PILGRIM",
    lat: 19.4815,
    lng: 75.3855,
    distanceFromBusStand: "1.0 km",
    timings: "07:00 AM – 08:00 PM",
    description: "16th-century wooden residence with the sacred Shrikhandya pillar.",
  },
  {
    id: "p-jayakwadi-dam",
    nameEn: "Jayakwadi Dam Crest & Sunset Viewpoint",
    nameMr: "जायकवाडी धरण व सूर्यास्त दर्शन",
    category: "DAM_NATURE",
    lat: 19.4883,
    lng: 75.3892,
    distanceFromBusStand: "3.5 km",
    timings: "08:00 AM – 06:00 PM",
    description: "Asia's largest earthen dam wall overlooking 350 sq. km Nath Sagar.",
  },
  {
    id: "p-bird-sanctuary",
    nameEn: "Jaikwadi Bird Sanctuary (Flamingo Point)",
    nameMr: "जायकवाडी पक्षी अभयारण्य (फ्लेमिंगो पॉइंट)",
    category: "DAM_NATURE",
    lat: 19.495,
    lng: 75.375,
    distanceFromBusStand: "4.0 km",
    timings: "06:30 AM – 05:30 PM",
    description: "Wetland haven hosting 200+ migratory bird species including flamingos.",
  },
  {
    id: "p-dnyaneshwar-udyan",
    nameEn: "Sant Dnyaneshwar Udyan & Fountains",
    nameMr: "संत ज्ञानेश्वर उद्यान व संगीत कारंजे",
    category: "GARDEN",
    lat: 19.486,
    lng: 75.391,
    distanceFromBusStand: "2.8 km",
    timings: "10:00 AM – 07:00 PM",
    description: "300-acre botanical garden with illuminated musical fountains.",
  },
  {
    id: "p-patil-museum",
    nameEn: "Dr. Balasaheb Patil State Museum",
    nameMr: "बाळासाहेब पाटील शासकीय वस्तुसंग्रहालय",
    category: "CIVIC",
    lat: 19.4855,
    lng: 75.3905,
    distanceFromBusStand: "2.8 km",
    timings: "10:30 AM – 05:00 PM (Closed Mondays)",
    description: "Rare Satavahana imperial coins and Shivaji Maharaj's Modi Rajpatra.",
  },
  {
    id: "p-paithani-weavers",
    nameEn: "Paithani Handloom Weavers Colony",
    nameMr: "पैठणी हातमाग विणकर वसाहत",
    category: "WEAVING",
    lat: 19.479,
    lng: 75.382,
    distanceFromBusStand: "1.0 km",
    timings: "09:30 AM – 07:30 PM",
    description: "Traditional pit-loom workshops weaving genuine GI-tagged Paithani silk.",
  },
  {
    id: "p-apegaon-temple",
    nameEn: "Apegaon Sant Dnyaneshwar Birthplace",
    nameMr: "आपगाव संत ज्ञानेश्वर जन्मस्थान",
    category: "PILGRIM",
    lat: 19.512,
    lng: 75.495,
    distanceFromBusStand: "12 km (Paithan-Apegaon Rd)",
    timings: "05:30 AM – 09:00 PM",
    description: "Tranquil riverside shrine where Sant Dnyaneshwar and siblings were born.",
  },
  {
    id: "p-bus-stand",
    nameEn: "Paithan MSRTC Central Bus Stand",
    nameMr: "पैठण मध्यवर्ती बस स्थानक (एस.टी.)",
    category: "CIVIC",
    lat: 19.4795,
    lng: 75.386,
    distanceFromBusStand: "0.0 km",
    timings: "24/7 Public Transport",
    description: "Connecting buses to Chhatrapati Sambhajinagar, Pune, Ahmednagar, Jalna.",
  },
  {
    id: "p-council-office",
    nameEn: "Paithan Municipal Council Complex",
    nameMr: "पैठण नगर परिषद मुख्य प्रशासकीय इमारत",
    category: "CIVIC",
    lat: 19.481,
    lng: 75.3865,
    distanceFromBusStand: "0.5 km",
    timings: "09:45 AM – 06:15 PM (Mon–Sat)",
    description: "Main municipal headquarters, civic facilitation counter, and helpline.",
  },
];

export default function TouristMapPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedPoint, setSelectedPoint] = useState<MapPoint>(MAP_POINTS[0]);

  const filteredPoints = MAP_POINTS.filter(
    (p) => activeCategory === "ALL" || p.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Geographic Information & Navigation</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#071224] tracking-tight">
              पैठण पर्यटन नकाशा व दिशानिर्देश (Interactive Tourist Map)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Explore key pilgrimage temples, Jayakwadi reservoir viewpoints, museums, and handloom clusters with GPS coordinates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full border border-blue-200">
              10 Verified Geographic Coordinates
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: "ALL", label: "All Landmarks" },
            { id: "PILGRIM", label: "Pilgrim Shrines" },
            { id: "DAM_NATURE", label: "Dam & Wetlands" },
            { id: "GARDEN", label: "Gardens & Parks" },
            { id: "WEAVING", label: "Paithani Handlooms" },
            { id: "CIVIC", label: "Civic & Transport" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Map Layout Grid: Left Stylized Interactive Map Canvas (8 cols), Right Point Inspector (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Interactive Map Simulation */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 overflow-hidden">
            {/* Map Area */}
            <div className="relative aspect-4/3 sm:aspect-16/10 bg-[#0C1E3C] rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between p-4 sm:p-6">
              {/* Godavari River Blue Gradient Flow Vector */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 70% 30%, #38bdf8 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, #0284c7 0%, transparent 70%)",
                }}
              />

              {/* Waterway Vector Curve */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <path
                  d="M 0,200 Q 250,150 450,280 T 900,220"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="32"
                  strokeLinecap="round"
                />
              </svg>

              {/* Map Title Tag */}
              <div className="z-10 flex items-center justify-between text-xs text-white">
                <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2">
                  <Waves className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-semibold">Godavari River Basin & Nath Sagar</span>
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-lg">
                  Click a pin to view details
                </div>
              </div>

              {/* Interactive Map Pins Canvas */}
              <div className="relative flex-1 my-4">
                {filteredPoints.map((point) => {
                  const isSelected = selectedPoint.id === point.id;

                  // Normalized positioning based on lat/lng range in Paithan
                  const topPercent = Math.max(15, Math.min(85, ((19.515 - point.lat) / 0.04) * 100));
                  const leftPercent = Math.max(12, Math.min(88, ((point.lng - 75.37) / 0.13) * 100));

                  return (
                    <button
                      key={point.id}
                      onClick={() => setSelectedPoint(point)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-20 ${
                        isSelected ? "scale-125 z-30" : "hover:scale-110"
                      }`}
                      style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                      title={point.nameEn}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg border-2 transition ${
                          isSelected
                            ? "bg-amber-500 border-white text-slate-950 shadow-amber-500/50"
                            : "bg-[#071224] border-amber-400 text-amber-300 hover:bg-amber-500 hover:text-slate-950"
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] font-bold whitespace-nowrap px-2 py-0.5 rounded-md shadow-md transition ${
                          isSelected
                            ? "bg-amber-400 text-slate-950"
                            : "bg-slate-900/90 text-white opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {point.nameEn.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Legend */}
              <div className="z-10 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Selected Pin
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-sky-400" /> Godavari River
                  </span>
                </div>
                <span className="text-slate-400">Map Center: 19.48° N, 75.38° E</span>
              </div>
            </div>
          </div>

          {/* Right: Selected Landmark Inspector (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                  {selectedPoint.category}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {selectedPoint.distanceFromBusStand}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedPoint.nameEn}
                </h2>
                <p className="text-xs text-slate-600 font-marathi mt-0.5">
                  {selectedPoint.nameMr}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedPoint.description}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{selectedPoint.timings}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-mono text-[11px]">
                  <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Lat: {selectedPoint.lat.toFixed(4)}°, Lng: {selectedPoint.lng.toFixed(4)}°</span>
                </div>
              </div>

              {/* Google Maps Directions Action */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.lat},${selectedPoint.lng}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0C1E3C] hover:bg-[#071224] text-white py-3 rounded-xl text-xs font-bold shadow-md transition"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>Navigate in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>

            {/* Quick Distance Guide */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-xs space-y-2">
              <h3 className="font-bold text-slate-900">Transit & Distance Reference</h3>
              <p className="text-slate-600">
                All distances calculated from <strong>Paithan Central Bus Stand</strong>. Auto-rickshaws and municipal e-rickshaws operate along the Main Road to Jayakwadi and Nagghat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
