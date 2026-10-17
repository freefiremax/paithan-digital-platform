"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  wardMapMarkers,
  ASSEMBLY_MAP_WIDTH,
  ASSEMBLY_MAP_HEIGHT,
} from "@/lib/ward-map-markers";

/**
 * The 17-ward constituency map for the homepage.
 */

// Pin centres come from the pastel constituency map (1672 x 941). Index + 1 === ward number.

export function PaithanWardMap() {
  const router = useRouter();
  const locale = useLocale();
  const tNagar = useTranslations("nagarParishad");

  return (
    <section
      className="border-t border-[var(--border-subtle)] bg-white py-12 lg:py-14"
      aria-labelledby="ward-map-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2
            id="ward-map-heading"
            className="portal-rule font-display text-2xl font-semibold text-[var(--portal-blue-900)]"
          >
            {tNagar("wardMapTitle")}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--civic-slate-700)]">
            {tNagar("wardMapSubtitle")}
          </p>
        </div>
      </div>

      <figure className="ward-map-bleed relative mt-6 w-full">
        <svg
            viewBox={`0 0 ${ASSEMBLY_MAP_WIDTH} ${ASSEMBLY_MAP_HEIGHT}`}
            className="paithan-ward-map h-auto w-full"
            role="img"
            aria-labelledby="ward-map-svg-title ward-map-svg-desc"
          >
            <title id="ward-map-svg-title">
              {tNagar("wardMapTitle")}
            </title>
            <desc id="ward-map-svg-desc">
              {tNagar("wardMapSubtitle")}
            </desc>

            <image
              href="/maps/paithan-wards-godavari-map.png"
              x="0"
              y="0"
              width={ASSEMBLY_MAP_WIDTH}
              height={ASSEMBLY_MAP_HEIGHT}
              preserveAspectRatio="xMidYMid meet"
            />

            <g fill="transparent" stroke="none">
              {wardMapMarkers.map((marker) => {
                const wardNumber = marker.number;
                const href = `/${locale}/nagar-parishad/ward-map/${wardNumber}`;
                return (
                  <Link
                    key={wardNumber}
                    href={href}
                    aria-label={`Open Ward ${wardNumber} — ${marker.wardName} details`}
                    className="ward-pin"
                    onKeyDown={(event) => {
                      if (event.key === " " || event.key === "Spacebar") {
                        event.preventDefault();
                        router.push(href);
                      }
                    }}
                  >
                    <circle
                      className="ward-pin__halo"
                      cx={marker.cx}
                      cy={marker.cy}
                      r={44}
                    />
                    <title>{`Ward ${wardNumber}`}</title>
                  </Link>
                );
              })}
            </g>
        </svg>
      </figure>

      <style>{`
        .paithan-ward-map .ward-pin { cursor: pointer; }
        .paithan-ward-map .ward-pin:focus { outline: none; }
        .paithan-ward-map .ward-pin__halo {
          fill: transparent;
          stroke: transparent;
          stroke-width: 3;
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 150ms ease, stroke 150ms ease, fill 150ms ease;
        }
        .paithan-ward-map .ward-pin:hover .ward-pin__halo {
          fill: color-mix(in srgb, var(--zari-gold-500) 20%, transparent);
          stroke: var(--zari-gold-600);
          transform: scale(1.12);
        }
        .paithan-ward-map .ward-pin:focus-visible .ward-pin__halo {
          fill: color-mix(in srgb, var(--portal-blue-700) 15%, transparent);
          stroke: var(--portal-blue-700);
          stroke-width: 3.5;
          transform: scale(1.12);
        }
        @media (prefers-reduced-motion: reduce) {
          .paithan-ward-map .ward-pin__halo { transition: stroke 150ms ease, fill 150ms ease; }
          .paithan-ward-map .ward-pin:hover .ward-pin__halo,
          .paithan-ward-map .ward-pin:focus-visible .ward-pin__halo { transform: none; }
        }
      `}</style>
    </section>
  );
}

