import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Award,
  Users,
  Feather,
  ArrowRight,
} from "lucide-react";


export const metadata: Metadata = {
  title: "Cultural Heritage & Traditions | Paithan Municipal Council (पैठण नगर परिषद)",
  description:
    "Living cultural traditions of Paithan: Sant Eknath Bhakti movement, Nath Shashti Fair, GI-tagged Paithani Silk Handlooms, and Sanskrit scholarship.",
};

const TRADITIONS = [
  {
    id: "sant-eknath-bhakti",
    titleEn: "Sant Eknath Maharaj & The Varkari Bhakti Revolution",
    titleMr: "संत एकनाथ महाराज आणि वारकरी भक्ती परंपरा",
    era: "1533 – 1599 CE",
    category: "Spiritual Literature",
    icon: BookOpen,
    summary:
      "Sant Eknath bridged orthodox Sanskrit philosophy with everyday Prakrit Marathi, democratizing spiritual knowledge through immortal compositions like Eknathi Bhagavata, Rukmini Swayamvar, and socially awakened Bharuds.",
    keyPoints: [
      "Composed the landmark Eknathi Bhagavata, completing it on the banks of the Godavari river in 1573 CE.",
      "Pioneered the 'Bharud' folk drama genre — writing over 300 allegorical compositions in common rural dialects.",
      "Practiced radical social compassion: fed hungry outcastes, served a dying donkey with holy Ganga water.",
      "Entered Jalsamadhi in the sacred Godavari River on Phalguna Vadya Shashti (March 1599 CE).",
    ],
  },
  {
    id: "nath-shashti-yatra",
    titleEn: "Nath Shashti Pilgrimage & Varkari Mahotsav",
    titleMr: "नाथ षष्ठी यात्रा व वारकरी महामहोत्सव",
    era: "Annually in Phalguna Month (March)",
    category: "Pilgrim Assembly",
    icon: Users,
    summary:
      "One of Maharashtra's largest annual spiritual gatherings. Over 500,000 Varkari pilgrims walk hundreds of kilometers with Palkhis singing abhangas to converge at Paithan's Nagghat and Sant Eknath Samadhi Mandir.",
    keyPoints: [
      "Three-day celebration featuring continuous Bhajan, Kirtan, and Annadana across 100+ community pandals.",
      "Ceremonial arrival of dindis from Alandi, Dehu, Pandharpur, and Apegaon.",
      "Holy dip in Godavari at sunrise followed by Mahapooja and Godavari Maha-Aarti.",
      "Paithan Municipal Council deploys 24/7 medical camps, water tankers, and temporary sanitary infrastructure.",
    ],
  },
  {
    id: "paithani-silk-tradition",
    titleEn: "Paithani Handloom Silk Weaving (GI Application #84)",
    titleMr: "अस्सल पैठणी रेशमी हातमाग विणकाम (भौगोलिक मानांकन)",
    era: "200 BCE to Present Day",
    category: "Intangible Craft & GI",
    icon: Award,
    summary:
      "Known as the 'Queen of Silks' (महावस्त्र), Paithani represents an unbroken 2,200-year lineage of tapestry weaving using fine mulberry silk warp and pure gold and silver electroplated zari weft.",
    keyPoints: [
      "Woven entirely by hand on traditional wooden pit looms without mechanical jacquards.",
      "Signature motifs: Bangadi Mor (peacock in bangle ring), Munia (parrot), Asavali (flowering vine), and Tota-Maina.",
      "Awarded Geographical Indication (GI) tag by the Government of India under Application #84.",
      "A genuine heirloom Paithani requires between 1 to 6 months of painstaking handcrafting.",
    ],
  },
  {
    id: "sanskrit-dharmashastra",
    titleEn: "Pratishthana Sanskrit Academy & Legal Scholarly Assembly",
    titleMr: "प्रतिष्ठान धर्मशास्त्र व संस्कृत विद्वत्सभा",
    era: "Ancient to Medieval Era",
    category: "Intellectual Heritage",
    icon: Feather,
    summary:
      "Paithan was historically recognized as the supreme theological court and intellectual capital of the Deccan. Scholar assemblies (Pandit Parishads) at Paithan adjudicated complex legal, philosophical, and social codes.",
    keyPoints: [
      "Site where the young saint-siblings Dnyaneshwar, Nivruttinath, Sopandev, and Muktabai presented their spiritual defense.",
      "Legendary episode of Sant Dnyaneshwar demonstrating non-dual Brahman consciousness by having a water buffalo chant Vedic hymns.",
      "Center of Vedic astronomy, Ayurveda, and Mimamsa philosophy patronized by the Satavahana emperors.",
    ],
  },
];

export default function CulturalHeritagePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#071224] via-[#0C1E3C] to-[#122B54] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Living Culture & Sacred Traditions of Pratishthana</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              पैठणची सांस्कृतिक व आध्यात्मिक परंपरा (Cultural Heritage)
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Explore the rich spiritual literature of Sant Eknath, the vibrant devotion of the annual Nath Shashti fair, and the exquisite craftsmanship of GI-tagged Paithani silk.
            </p>
          </div>
        </div>

        {/* Traditions Grid */}
        <div className="space-y-6">
          {TRADITIONS.map((tradition) => {
            const Icon = tradition.icon;
            return (
              <div
                key={tradition.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-amber-400/80 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
                    <Icon className="w-7 h-7" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                        {tradition.category}
                      </span>
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        {tradition.era}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-900 leading-snug">
                        {tradition.titleEn}
                      </h2>
                      <p className="text-sm text-slate-600 font-marathi mt-1">
                        {tradition.titleMr}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {tradition.summary}
                    </p>

                    <div className="pt-2">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Key Historical & Cultural Pillars:
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                        {tradition.keyPoints.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tourism Route Callout */}
        <div className="bg-gradient-to-br from-[#071224] to-[#0C1E3C] text-white rounded-2xl p-6 sm:p-8 border border-amber-500/20 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold text-white">Experience Living Paithan Heritage In Person</h2>
            <p className="text-xs text-slate-300 mt-1">
              Follow our curated 1-Day Pilgrim & Varkari Heritage Route to visit all historic shrines and weaving ateliers.
            </p>
          </div>
          <Link
            href="/tourism/routes"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs transition shadow-md shrink-0"
          >
            <span>View Curated Tourist Routes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
