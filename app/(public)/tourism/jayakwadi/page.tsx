import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import {
  Waves,
  Clock,
  MapPin,
  Tag,
  Calendar,
  Compass,
  Droplets,
  Info,
} from "lucide-react";


export const metadata: Metadata = {
  title: "Jayakwadi Dam (Paithan Dam) | Asia's Largest Earthen Dam | Paithan Municipal Council",
  description:
    "Official visitor guide to Jayakwadi Dam (Nath Sagar): 9.99 km earthen dam, 27 radial gates, 102.7 TMC capacity, visiting hours, and sunset promenade.",
};

const DAM_SPECS = [
  { label: "Total Dam Length", value: "9,992 meters (9.99 km)", subtext: "Asia's largest earthen embankment" },
  { label: "Dam Height", value: "41.30 meters", subtext: "Above lowest foundation level" },
  { label: "Gross Storage Capacity", value: "102.7 TMC (2,909 MCM)", subtext: "Maharashtra's life-giving reservoir" },
  { label: "Water Spread Area", value: "350 sq. kilometers", subtext: "Forming the vast Nath Sagar lake" },
  { label: "Spillway Radial Gates", value: "27 Radial Gates", subtext: "12.50m × 7.90m size each" },
  { label: "Inauguration Date", value: "24 February 1976", subtext: "Inaugurated by PM Indira Gandhi" },
  { label: "Hydroelectric Capacity", value: "12 Megawatts (Reversible)", subtext: "Pumped-storage power generation" },
  { label: "Irrigation Command Area", value: "240,000+ Hectares", subtext: "Supplies 5 Marathwada districts" },
];

export default function JayakwadiPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner with Official Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30">
          <div className="relative h-72 sm:h-96 w-full">
            <Image
              src="/images/sites/jayakwadi-dam.jpg"
              alt="Jayakwadi Dam with 27 radial spillway gates across Godavari River in Paithan"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071224] via-[#071224]/70 to-transparent" />
            
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                शासकीय अधिकृत छायाचित्र (Official Photo)
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-500/40 mb-3 backdrop-blur-md">
                <Waves className="w-3.5 h-3.5 text-blue-400" />
                <span>Marathwada&apos;s Life Reservoir • Nath Sagar</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                जायकवाडी धरण — नाथ सागर (Jayakwadi Dam)
              </h1>
              <p className="text-sm sm:text-base text-slate-200 mt-2 leading-relaxed drop-shadow-sm">
                Constructed across the holy Godavari river at Paithan, Jayakwadi is one of Asia&apos;s most monumental civil engineering achievements, measuring 9.99 km with 27 radial gates.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Facts Strip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">Visiting Hours</div>
              <div className="text-xs text-slate-600">08:00 AM – 06:00 PM</div>
              <div className="text-[10px] text-slate-400">Open 7 days a week</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">Entry & Parking</div>
              <div className="text-xs text-slate-600">Free Public Entry</div>
              <div className="text-[10px] text-slate-400">Nominal vehicle parking fee</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">Ideal Season</div>
              <div className="text-xs text-slate-600">August to February</div>
              <div className="text-[10px] text-slate-400">Peak post-monsoon full reservoir</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">Distance</div>
              <div className="text-xs text-slate-600">3.5 km from Paithan Bus Stand</div>
              <div className="text-[10px] text-slate-400">Adjacent to Dnyaneshwar Udyan</div>
            </div>
          </div>
        </div>

        {/* Engineering Specifications Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">तांत्रिक वैशिष्ट्ये (Technical & Engineering Specifications)</h2>
            <p className="text-xs text-slate-500 mt-1">Verified hydrological metrics from Maharashtra Water Resources Department</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DAM_SPECS.map((spec, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{spec.label}</span>
                <div className="text-lg font-extrabold text-[#0C1E3C] mt-1">{spec.value}</div>
                <div className="text-[11px] text-slate-600 mt-1">{spec.subtext}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visitor Experience Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Waves className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Sunset Promenade & Dam Crest Overlook</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Walk along the designated public pedestrian viewpoint on the earthen crest. During evening hours, enjoy breathtaking panoramic sunsets over the 350 sq. km waters of Nath Sagar.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">27 Radial Spillway Gates</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              During peak monsoon, when the dam reaches 100% capacity, the simultaneous opening of its 27 radial gates creates a majestic water cascade that attracts visitors from across Maharashtra.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Adjacent Gardens & Bird Sanctuary</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Just below the spillway lies the 300-acre Sant Dnyaneshwar Botanical Garden, and further along the backwaters is the Jaikwadi Bird Sanctuary hosting thousands of Siberian flamingos.
            </p>
          </div>
        </div>

        {/* Safety & Security Advisory */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 leading-relaxed space-y-1">
            <div className="font-bold text-amber-900">Security & Safety Notice / सुरक्षा नियमावली</div>
            <p>
              Swimming or stepping into the deep waters of the reservoir or the spillway discharge channel is strictly prohibited by order of the District Magistrate and Paithan Police. Please adhere to security guidelines and keep to marked tourist viewpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
