"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Rotate3d,
  Layers,
  Eye,
  Info,
  ArrowRight,
} from "lucide-react";


interface ModelItem {
  id: string;
  titleEn: string;
  titleMr: string;
  era: string;
  category: string;
  description: string;
  dimensions: string;
  material: string;
  colorScheme: string;
  geometryType: string;
}

const MODELS_DATA: ModelItem[] = [
  {
    id: "satavahana-coin",
    titleEn: "Satavahana Imperial Potin Coin (Gautamiputra Satakarni)",
    titleMr: "सातवाहन राजमुद्रा नाणे (गौतमीपुत्र सातकर्णी)",
    era: "c. 106 – 130 CE",
    category: "Numismatics",
    description:
      "Interactive 3D photogrammetric reconstruction of a potin coin bearing the dynamic three-arched hill (Chaitya) with crescent and river symbol on obverse, and Ujjain symbol on reverse.",
    dimensions: "22 mm diameter, 3.4 mm thickness, 8.2 grams",
    material: "Potin (Copper-Lead-Zinc Alloy)",
    colorScheme: "from-amber-700 to-amber-900",
    geometryType: "Radial relief mesh with Brahmi inscriptions",
  },
  {
    id: "terracotta-goddess",
    titleEn: "Brahmapuri Excavated Terracotta Mother Goddess",
    titleMr: "ब्रह्मपुरी टेकडी उत्खनित मातका देवी मूर्ती",
    era: "1st Century BCE",
    category: "Terracotta Sculpture",
    description:
      "High-precision 3D scan of an archaic baked-clay mother goddess figurine excavated at the ancient Brahmapuri archaeological mound in Paithan.",
    dimensions: "14.2 cm height, 7.8 cm width",
    material: "Alluvial Godavari River Terracotta Clay",
    colorScheme: "from-orange-800 to-red-950",
    geometryType: "Anthropomorphic figurine with ornate headdress",
  },
  {
    id: "eknath-samadhi-model",
    titleEn: "Sant Eknath Maharaj Samadhi Mandir Architectural Dome",
    titleMr: "संत एकनाथ महाराज समाधी मंदिर घुमट रचना",
    era: "Reconstructed 1780 CE by Ahilyabai Holkar",
    category: "Temple Architecture",
    description:
      "Architectural 3D model of the black basalt stone mandap and riverfront ghat pavilion where Sant Eknath Maharaj entered Jalsamadhi in 1599 CE.",
    dimensions: "28m x 18m footprint, 24m spire height",
    material: "Deccan Basalt Stone & Teak Wood Beams",
    colorScheme: "from-slate-700 to-slate-900",
    geometryType: "Hemispherical shikhara with octagonal drum",
  },
  {
    id: "paithani-pallu-weave",
    titleEn: "Royal Paithani Bangadi Mor Zari Pallu (Tapestry Weave)",
    titleMr: "शाही पैठणी बांगडी मोर जरी पदर त्रि-आयामी विणकाम",
    era: "19th Century CE Royal Collection",
    category: "Textile Art",
    description:
      "Sub-millimeter micro-surface topology model illustrating the interlocking weft tapestry technique where pure silver thread electroplated with 24-carat gold intertwines with natural mulberry silk warp.",
    dimensions: "120 cm x 80 cm motif panel",
    material: "Pure Mulberry Silk & 24K Gold Plated Zari",
    colorScheme: "from-amber-500 to-yellow-600",
    geometryType: "Micro-fiber textile matrix with peacock medallion",
  },
];

export default function ThreeDModelsPage() {
  const [activeModel, setActiveModel] = useState<ModelItem>(MODELS_DATA[0]);
  const [rotationAngle, setRotationAngle] = useState(45);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [wireframeMode, setWireframeMode] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <Rotate3d className="w-4 h-4" />
              <span>Digital Heritage & 3D Photogrammetry</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              पैठण डिजिटल ३डी अवशेष दालन (3D Heritage Models)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore laser-scanned archaeological antiquities, numismatics, and temple architecture in full 360-degree interactive 3D.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-medium">
              WebXR / 3D Canvas Ready
            </span>
          </div>
        </div>

        {/* Main 3D Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 3D Interactive Viewer Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-4/3 sm:aspect-16/10 bg-[#071224] rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-6">
              {/* Viewer Controls Top Overlay */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-slate-200">{activeModel.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWireframeMode(!wireframeMode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      wireframeMode
                        ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                        : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                    }`}
                  >
                    {wireframeMode ? "Wireframe Active" : "Shaded Mesh"}
                  </button>
                  <button
                    onClick={() => {
                      setRotationAngle((prev) => (prev + 90) % 360);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    title="Rotate 90 deg"
                  >
                    <Rotate3d className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Central 3D Mesh Representation & Hologram */}
              <div className="flex-1 flex items-center justify-center relative my-4">
                {/* Simulated 3D Interactive Holographic Display */}
                <div
                  className={`relative w-48 h-48 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-tr ${activeModel.colorScheme} flex flex-col items-center justify-center p-6 text-center shadow-2xl transition-all duration-700 border-2 ${
                    wireframeMode ? "border-amber-400 border-dashed bg-transparent" : "border-amber-500/40"
                  }`}
                  style={{
                    transform: `perspective(600px) rotateY(${rotationAngle}deg) rotateX(15deg) scale(${zoomLevel})`,
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 border border-white/20">
                    <Rotate3d className="w-8 h-8 text-amber-300 animate-spin" style={{ animationDuration: "12s" }} />
                  </div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    {activeModel.titleEn}
                  </div>
                  <div className="text-[11px] text-amber-200 font-marathi mt-1">
                    {activeModel.titleMr}
                  </div>
                  <div className="text-[10px] text-white/70 mt-2 font-mono">
                    {activeModel.dimensions}
                  </div>
                </div>

                {/* Grid Overlay for 3D measurement */}
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
              </div>

              {/* Bottom Interactive Slider & Sliders */}
              <div className="z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-slate-400 font-medium">Rotation:</span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotationAngle}
                    onChange={(e) => setRotationAngle(Number(e.target.value))}
                    className="w-full sm:w-40 accent-amber-500"
                  />
                  <span className="font-mono text-slate-300 w-10">{rotationAngle}°</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <span className="text-slate-400 font-medium">Zoom:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setZoomLevel(Math.max(0.7, zoomLevel - 0.1))}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      -
                    </button>
                    <span className="font-mono text-slate-300 px-1">{(zoomLevel * 100).toFixed(0)}%</span>
                    <button
                      onClick={() => setZoomLevel(Math.min(1.4, zoomLevel + 0.1))}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Metadata Banner */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-2">
              <h2 className="text-lg font-bold text-white">{activeModel.titleEn}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{activeModel.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Historical Period</span>
                  <span className="font-semibold text-amber-300">{activeModel.era}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Material Composition</span>
                  <span className="font-semibold text-slate-200">{activeModel.material}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Mesh Topology</span>
                  <span className="font-semibold text-slate-200">{activeModel.geometryType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Model Selection Carousel (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Select Heritage Artifact:</span>
            </h2>

            <div className="space-y-3">
              {MODELS_DATA.map((model) => {
                const isSelected = activeModel.id === model.id;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      setActiveModel(model);
                      setRotationAngle(45);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-400 text-white shadow-lg shadow-amber-500/5"
                        : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-amber-400">{model.category}</span>
                      <span className="text-[10px] text-slate-400">{model.era}</span>
                    </div>
                    <div className="font-bold text-sm text-white line-clamp-1">{model.titleEn}</div>
                    <div className="text-xs text-slate-400 font-marathi line-clamp-1 mt-0.5">
                      {model.titleMr}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-300">
                <Info className="w-4 h-4 text-amber-400" />
                <span>Museum Scanning Project</span>
              </div>
              <p>
                Models digitized under the Maharashtra Digital Heritage Conservation Initiative in collaboration with the Directorate of Archaeology & Museums.
              </p>
              <Link
                href="/heritage/museum"
                className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold pt-1"
              >
                <span>Visit Museum Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
