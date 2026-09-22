import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";


export const metadata: Metadata = {
  title: "Historic Temples, Ghats & Archaeological Sites | Paithan Municipal Council",
  description:
    "Pilgrim guide to Paithan's sacred sites: Sant Eknath Samadhi Mandir, Nagghat, Sant Eknath Wada, Apegaon Temple, and Brahmapuri archaeological mound.",
};

const HERITAGE_SITES = [
  {
    id: "site-eknath-samadhi",
    titleEn: "Sant Eknath Maharaj Samadhi Mandir & Nagghat",
    titleMr: "संत एकनाथ महाराज समाधी मंदिर व नागघाट",
    category: "Varkari Pilgrim Shrine",
    era: "Reconstructed 1780 CE by Ahilyabai Holkar",
    location: "Godavari Riverfront, Paithan Town (1.2 km from Bus Stand)",
    visitingHours: "05:00 AM – 09:30 PM",
    aartiTimings: "Kakad Aarti: 05:30 AM • Sandhya Aarti: 07:00 PM • Shej Aarti: 09:30 PM",
    imageUrl: "/images/sites/sant-eknath-mandir.jpg",
    imageAlt: "Sant Eknath Samadhi Mandir and historic Nagghat stone steps with pilgrims on Godavari river",
    description:
      "The holy spiritual sanctum sanctorum of Paithan, enshrining the divine Jalsamadhi of Sant Eknath Maharaj who entered the Godavari river here in 1599 CE. Beautiful black stone architecture with expansive stepped bathing ghats.",
    highlights: [
      "Sacred Jalsamadhi memorial and perpetual flame (Nandadeep)",
      "Ancient Nagghat stone steps for holy Godavari bath and Pitru Tarpan",
      "Daily community Mahaprasad (Annachhatra) served to all devotees",
      "Epicenter of the world-famous Nath Shashti Fair in Phalguna month",
    ],
  },
  {
    id: "site-eknath-wada",
    titleEn: "Sant Eknath Ancestral Wada (संत एकनाथ वाडा)",
    titleMr: "संत एकनाथ महाराज यांचे मूळ निवासस्थान (वाडा)",
    category: "Historic Residence",
    era: "16th Century CE",
    location: "Brahmin Galli / Eknath Wada Lane (400m from Samadhi Mandir)",
    visitingHours: "07:00 AM – 08:00 PM",
    aartiTimings: "Morning Puja: 08:00 AM • Evening Bhajan: 06:30 PM",
    imageUrl: "/images/sites/sant-eknath-wada.jpg",
    imageAlt: "Historic interior courtyard of Sant Eknath Maharaj Wada showing carved teakwood pillars and sacred Shrikhandya pillar",
    description:
      "The preserved two-story ancestral residence of Sant Eknath Maharaj. Here, according to tradition, Lord Krishna lived in disguise as the servant 'Shrikhandya' to fill water and grind sandalwood for the saint for twelve years.",
    highlights: [
      "The sacred wooden pillar (Shrikhandya Khamb) touched by the divine",
      "Sant Eknath's personal study room and wooden manuscript boxes",
      "Authentic Peshwa-era wooden timber framing and courtyard architecture",
      "Daily display of rare Eknathi Bhagavata pothis (manuscripts)",
    ],
  },
  {
    id: "site-apegaon",
    titleEn: "Apegaon — Sant Dnyaneshwar Birthplace Shrine",
    titleMr: "आपगाव — संत ज्ञानेश्वर महाराज जन्मस्थान मंदिर",
    category: "Ancestral Birthplace Temple",
    era: "13th Century CE Origins",
    location: "Apegaon Village (12 km East of Paithan on Godavari banks)",
    visitingHours: "05:30 AM – 09:00 PM",
    aartiTimings: "Kakad Aarti: 06:00 AM • Mahapooja: 11:30 AM • Aarti: 07:30 PM",
    imageUrl: "/images/sites/apegaon-temple.jpg",
    imageAlt: "Sant Dnyaneshwar Birthplace Temple at Apegaon on the picturesque banks of the Godavari River",
    description:
      "The serene, peaceful birthplace of the four divine siblings: Sant Dnyaneshwar, Sant Nivruttinath, Sant Sopandev, and Sant Muktabai. Overlooking a picturesque bend of the Godavari river with gardens and ghats.",
    highlights: [
      "Birthplace sanctum of Sant Dnyaneshwar and memorial to parents Vitthalpant and Rukminibai",
      "Origin point of the annual Apegaon-to-Alandi Dindi Palkhi procession",
      "Tranquil rural river atmosphere ideal for meditation and prayer",
      "Spacious pilgrim dharamshala with community boarding facilities",
    ],
  },
  {
    id: "site-brahmapuri",
    titleEn: "Brahmapuri Ancient Archaeological Mound",
    titleMr: "ब्रह्मपुरी प्राचीन ऐतिहासिक टेकडी (सातवाहन राजधानी)",
    category: "Archaeological Excavation Site",
    era: "2nd Century BCE – 3rd Century CE",
    location: "Western periphery of Paithan near Godavari bend",
    visitingHours: "Sunrise to Sunset (06:00 AM – 06:30 PM)",
    aartiTimings: "Open Archaeological Area",
    imageUrl: "/images/sites/brahmapuri-mound.jpg",
    imageAlt: "Archaeological excavation trenches at Brahmapuri mound exposing Satavahana brick foundations and terracotta ring wells",
    description:
      "The ancient stratified citadel mound of imperial Pratishthana, capital of the Satavahana Empire. Excavations by the Archaeological Survey of India (ASI) revealed Roman pottery, potin coins, terracotta beads, and brick structures.",
    highlights: [
      "Historical heart of Indo-Roman sea-and-river trade route mentioned in Periplus of the Erythraean Sea",
      "Stratified layers of Satavahana, Vakataka, and Yadava urban civil planning",
      "Excavated antiquities now preserved in the Dr. Balasaheb Patil Museum",
    ],
  },
];

export default function HeritageSitesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#071224] via-[#0C1E3C] to-[#122B54] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sacred Shrines & Historic Pratishthana</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              ऐतिहासिक मंदिरे, समाधी व घाट (Heritage Sites & Temples)
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Complete pilgrim directory to the sanctified temples, riverside ghats, and archaeological excavation mounds of Paithan on the holy Godavari with official location photography.
            </p>
          </div>
        </div>

        {/* Sites List */}
        <div className="space-y-8">
          {HERITAGE_SITES.map((site) => (
            <div
              key={site.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-amber-400/80 transition-all flex flex-col lg:flex-row"
            >
              {/* Official Photo Column */}
              <div className="relative w-full lg:w-80 h-64 lg:h-auto shrink-0 bg-slate-100">
                <Image
                  src={site.imageUrl}
                  alt={site.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 320px"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-emerald-950/80 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  अधिकृत छायाचित्र
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {site.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {site.era}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900 leading-snug">{site.titleEn}</h2>
                    <p className="text-sm text-slate-600 font-marathi mt-0.5">{site.titleMr}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {site.description}
                  </p>

                  <div className="pt-2">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Key Highlights & Shrines:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {site.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Visiting & Aarti Card */}
                <div className="w-full lg:w-72 bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between space-y-4 shrink-0">
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] font-medium uppercase block">Darshan Timings</span>
                      <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{site.visitingHours}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] font-medium uppercase block">Aarti & Worship Schedule</span>
                      <div className="text-slate-700 mt-0.5 leading-relaxed font-medium">
                        {site.aartiTimings}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] font-medium uppercase block">Location & Distance</span>
                      <div className="text-slate-700 mt-0.5 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{site.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <Link
                      href={`/tourism/map`}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-[#0C1E3C] hover:bg-[#071224] text-white py-2.5 rounded-xl text-xs font-semibold shadow-xs transition"
                    >
                      <span>View on Tourist Map</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
