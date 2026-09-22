import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Tag, ShieldCheck, Sparkles } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MUSEUM_EXHIBITS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Dr. Balasaheb Patil Government Museum",
  description:
    "Official guide to the Dr. Balasaheb Patil Government Archaeological Museum in Paithan, housing Satavahana coin hoards and Chhatrapati Shivaji Maharaj's royal decree.",
};

export default function MuseumPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Heritage", href: "/heritage/museum" },
          { label: "Dr. Balasaheb Patil Museum" },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title="Dr. Balasaheb Patil Government Archaeological Museum"
          description="Located within the Sant Dnyaneshwar Garden campus in Paithan, this state museum is administered by the Directorate of Archaeology and Museums, Government of Maharashtra. It preserves rare antiquities donated by late scholar Dr. Balasaheb Patil."
        />

        {/* Official Museum Gallery Photography */}
        <div className="mt-8 relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-lg">
          <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-900">
            <Image
              src="/images/sites/balasaheb-patil-museum.jpg"
              alt="Dr. Balasaheb Patil Archaeological Museum gallery displaying Satavahana coins, terracotta figurines and ancient beads"
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1180px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                शासकीय वस्तुसंग्रहालय — अधिकृत छायाचित्र
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Satavahana Imperial Gallery
              </span>
              <p className="text-sm sm:text-base font-semibold text-slate-100">
                Showcasing 2,200-year-old coin hoards, terracotta Roman-contact figurines, and Chhatrapati Shivaji Maharaj&apos;s Royal Charter
              </p>
            </div>
          </div>
        </div>

        {/* 1. VISITING INFO BAR */}
        <div className="mt-6 border border-[var(--border-subtle)] bg-white p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[var(--zari-gold-600)] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[var(--gov-navy-900)]">Visiting Hours</p>
              <p className="text-xs text-slate-600">10:30 AM – 05:00 PM</p>
              <p className="text-[10px] text-slate-400">Closed on Mondays & Public Holidays</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Tag className="w-4 h-4 text-[var(--zari-gold-600)] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[var(--gov-navy-900)]">Admission Fee</p>
              <p className="text-xs text-slate-600">₹10 (Adults) • ₹5 (Children)</p>
              <p className="text-[10px] text-slate-400">Free for school student groups</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[var(--zari-gold-600)] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[var(--gov-navy-900)]">Location</p>
              <p className="text-xs text-slate-600">Sant Dnyaneshwar Udyan Campus</p>
              <p className="text-[10px] text-slate-400">Main Road, Paithan - 431107</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[var(--zari-gold-600)] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[var(--gov-navy-900)]">Authority</p>
              <p className="text-xs text-slate-600">Directorate of Archaeology</p>
              <p className="text-[10px] text-slate-400">Government of Maharashtra</p>
            </div>
          </div>
        </div>

        {/* 2. BACKGROUND STORY */}
        <section className="mt-12 border border-[var(--border-subtle)] bg-[var(--bg-surface-slate)] p-6">
          <h2 className="text-base font-semibold text-[var(--gov-navy-900)] font-serif">
            The Vision of Late Dr. Balasaheb Patil
          </h2>
          <p className="mt-2 text-xs text-slate-700 leading-relaxed max-w-4xl">
            Established in 1997 on land allocated near the Jayakwadi dam, the museum honors the tireless lifetime research of local dignitary and antiquarian <strong>Dr. Balasaheb Patil</strong>.
            Over several decades, Dr. Patil retrieved thousands of artifacts from surface explorations around the ancient Brahmapuri mound and the Godavari riverbed.
            Recognizing their national historical value, he generously transferred this priceless collection to the Maharashtra State Archaeology Department so that future generations could study Paithan&apos;s 2,200-year civilizational heritage.
          </p>
        </section>

        {/* 3. PERMANENT EXHIBITS GALLERY */}
        <section className="mt-12" aria-labelledby="exhibits-heading">
          <SectionHeading
            id="exhibits-heading"
            title="Featured Permanent Gallery Exhibits"
            description="Artifacts from ancient Pratishthana's Satavahana era, Roman trade emporium period, and Maratha historical records."
          />

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MUSEUM_EXHIBITS.map((exhibit) => (
              <article
                key={exhibit.id}
                className="border border-[var(--border-subtle)] bg-white p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[var(--zari-gold-600)] uppercase tracking-wider">
                      {exhibit.category} • Ref: {exhibit.accessionRef}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {exhibit.period}
                    </span>
                  </div>

                  <h3 className="mt-3 text-[0.9375rem] font-semibold text-[var(--gov-navy-900)] leading-snug">
                    {exhibit.nameEn}
                  </h3>
                  <p lang="mr" className="text-xs text-slate-500 mt-0.5">
                    {exhibit.nameMr}
                  </p>

                  <p className="mt-3 text-xs text-slate-700 leading-relaxed">
                    {exhibit.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
                  <p className="text-[11px] text-[var(--gov-navy-800)] font-medium">
                    Historical Value:
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {exhibit.significance}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4. 3D MODELS PREVIEW CALLOUT */}
        <div className="mt-14 border-2 border-amber-600/30 bg-amber-50/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[var(--zari-gold-600)] shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-[var(--gov-navy-900)]">
                Interactive 3D Artifact Virtual Viewer
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Rotate, inspect, and examine high-fidelity 3D digital scans of Satavahana sculptures and coins using your mobile or desktop browser.
              </p>
            </div>
          </div>
          <Link
            href="/heritage/3d-models"
            className="px-4 py-2 bg-[var(--gov-navy-900)] hover:bg-[var(--gov-navy-800)] text-white text-xs font-semibold rounded shrink-0 transition-colors"
          >
            Launch 3D Models
          </Link>
        </div>
      </div>
    </>
  );
}
