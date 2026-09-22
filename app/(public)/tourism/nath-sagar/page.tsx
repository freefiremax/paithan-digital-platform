import React from "react";
import type { Metadata } from "next";
import {
  Feather,
  Clock,
  MapPin,
  Tag,
  ShieldCheck,
  Calendar,
  Compass,
} from "lucide-react";


export const metadata: Metadata = {
  title: "Jaikwadi Bird Sanctuary (Nath Sagar) | Migratory Birds & Wetlands | Paithan Municipal Council",
  description:
    "Visitor guide to Jaikwadi Bird Sanctuary on Nath Sagar reservoir: Greater Flamingos, Demoiselle Cranes, 200+ avian species, birdwatching spots, and visiting timings.",
};

const BIRD_SPECIES = [
  {
    commonNameEn: "Greater Flamingo",
    commonNameMr: "रोहित (मोठा फ्लेमिंगो)",
    scientificName: "Phoenicopterus roseus",
    season: "November to March",
    status: "Winter Migrant (Central Asian Flyway)",
    notes: "Flocks of thousands feeding on algae in shallow brackish backwater bays.",
  },
  {
    commonNameEn: "Demoiselle Crane",
    commonNameMr: "कुरंग (क्रौंच पक्षी)",
    scientificName: "Anthropoides virgo",
    season: "December to February",
    status: "Long-distance Siberian Migrant",
    notes: "Elegant long-legged cranes congregating along open sandy river spits.",
  },
  {
    commonNameEn: "Bar-headed Goose",
    commonNameMr: "पट्टेरी हंस",
    scientificName: "Anser indicus",
    season: "December to February",
    status: "High-altitude Himalayan Migrant",
    notes: "Known for flying over Everest, resting on Nath Sagar reservoir islands.",
  },
  {
    commonNameEn: "Painted Stork",
    commonNameMr: "चित्रबलाक",
    scientificName: "Mycteria leucocephala",
    season: "Resident & Local Migrant",
    status: "Breeding Colony",
    notes: "Nesting in acacia and babool trees along the lakeside periphery.",
  },
  {
    commonNameEn: "Osprey (Fish Eagle)",
    commonNameMr: "मत्स्य गरुड",
    scientificName: "Pandion haliaetus",
    season: "October to March",
    status: "Raptor / Winter Visitor",
    notes: "Hunting freshwater fish by diving feet-first into the deep reservoir waters.",
  },
  {
    commonNameEn: "Glossy Ibis & Black-headed Ibis",
    commonNameMr: "काळा अवाक व पांढरा अवाक",
    scientificName: "Plegadis falcinellus",
    season: "Year-round",
    status: "Resident Wader",
    notes: "Foraging in muddy reed beds around the wetland edges.",
  },
];

export default function NathSagarPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#071224] via-[#0C1E3C] to-[#122B54] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-3">
              <Feather className="w-3.5 h-3.5 text-emerald-400" />
              <span>International Ramsar Candidate Wetland</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              जायकवाडी पक्षी अभयारण्य — नाथ सागर (Bird Sanctuary)
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Encompassing 341 square kilometers of the Nath Sagar reservoir, this sanctuary is Western India&apos;s premier winter haven for over 200 species of migratory waterfowl travelling along the Central Asian Flyway.
            </p>
          </div>
        </div>

        {/* Quick Facts Strip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">Best Watching Hours</div>
              <div className="text-xs text-slate-600">06:30 AM – 10:00 AM</div>
              <div className="text-[10px] text-slate-400">& 04:30 PM – 06:00 PM (Sunset)</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">Peak Season</div>
              <div className="text-xs text-slate-600">November to March</div>
              <div className="text-[10px] text-slate-400">Peak Siberian flamingo arrival</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">Sanctuary Entry</div>
              <div className="text-xs text-slate-600">Nominal Forest Dept Fee</div>
              <div className="text-[10px] text-slate-400">Camera permits applicable</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">Prime Viewpoint</div>
              <div className="text-xs text-slate-600">Flamingo Point & Watchtower</div>
              <div className="text-[10px] text-slate-400">4.0 km from Paithan Town</div>
            </div>
          </div>
        </div>

        {/* Avian Biodiversity Catalog */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                प्रमुख पक्षी प्रजाती (Signature Avian Species of Nath Sagar)
              </h2>
              <p className="text-xs text-slate-500">
                Verified records documented by Bombay Natural History Society (BNHS) and Maharashtra Forest Department
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full self-start sm:self-auto">
              200+ Avian Species
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BIRD_SPECIES.map((bird, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-2 hover:border-emerald-400 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {bird.status}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">{bird.season}</span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{bird.commonNameEn}</h3>
                  <div className="text-xs text-slate-600 font-marathi">{bird.commonNameMr}</div>
                  <div className="text-[11px] text-slate-400 italic font-serif">{bird.scientificName}</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {bird.notes}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Birdwatching Guide & Code of Conduct */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>Recommended Birdwatching Trails</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Flamingo Point (Paithan Bank):</strong> Ideal for sunrise photography of pink flamingo murmurations in the shallow mudflats.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Apegaon Reservoir Backwaters (12 km):</strong> Peaceful riverside trail where Demoiselle Cranes and Bar-headed Geese feed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Dam Spillway Canal Perimeter:</strong> Excellent for spotting raptors like the Osprey and Crested Serpent Eagle.</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-sm space-y-3 border border-emerald-800">
            <h3 className="font-bold text-emerald-300 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Eco-Sanctuary Code of Conduct</span>
            </h3>
            <ul className="space-y-2 text-xs text-emerald-100/90">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>Strictly <strong>Zero Plastic Zone:</strong> Carry your trash back with you. Single-use plastics are banned.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>Maintain absolute silence; avoid sudden movements, drone flights, or honking near bird roosts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>Carry binoculars (8x42 or 10x50 recommended) or telephoto lenses (300mm+) for non-intrusive observation.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
