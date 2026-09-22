import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CURATED_ROUTES } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Curated Tour Routes & Itineraries",
  description:
    "Planned 1-day travel itineraries in Paithan: Sacred Pilgrim Route, Satavahana Archaeological Trail, and Jayakwadi Wetland Tour.",
};

export default function RoutesPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Tourism", href: "/tourism/jayakwadi" },
          { label: "Routes & Itineraries" },
        ]}
      />

      <div className="mx-auto max-w-[1180px] px-4 py-11">
        <SectionHeading
          as="h1"
          title="Curated Paithan Travel Itineraries"
          description="Carefully planned single-day itineraries to experience the best of Paithan — whether you are arriving for spiritual darshan, historical research, or birdwatching at Nath Sagar."
        />

        {/* ROUTES CONTAINER */}
        <div className="mt-10 space-y-10">
          {CURATED_ROUTES.map((route, rIdx) => (
            <section
              key={route.id}
              className="border border-[var(--border-subtle)] bg-white p-6 sm:p-8"
              aria-labelledby={`route-title-${route.id}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-subtle)] pb-4 gap-2">
                <div>
                  <span className="text-[10px] font-bold text-[var(--zari-gold-600)] uppercase tracking-wider">
                    Itinerary 0{rIdx + 1} • {route.duration}
                  </span>
                  <h2
                    id={`route-title-${route.id}`}
                    className="mt-1 text-lg sm:text-xl font-bold text-[var(--gov-navy-900)] font-serif"
                  >
                    {route.nameEn}
                  </h2>
                  <p lang="mr" className="text-xs text-slate-500 mt-0.5">
                    {route.nameMr}
                  </p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded font-medium shrink-0">
                  Ideal for: {route.idealFor}
                </span>
              </div>

              <p className="mt-4 text-xs text-slate-700 leading-relaxed max-w-3xl">
                {route.description}
              </p>

              {/* TIMELINE OF STOPS */}
              <div className="mt-6 border-t border-[var(--border-subtle)] pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--gov-navy-900)] mb-4">
                  Step-by-Step Schedule:
                </h3>
                <div className="space-y-4">
                  {route.stops.map((stop, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[var(--gov-navy-900)] text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {sIdx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[var(--gov-navy-900)]">
                          {stop.placeName}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {stop.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
