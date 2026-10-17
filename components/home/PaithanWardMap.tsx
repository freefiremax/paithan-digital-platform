"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  wardMapMarkers,
  wardMapMarkersMobile,
  ASSEMBLY_MAP_WIDTH,
  ASSEMBLY_MAP_HEIGHT,
  ASSEMBLY_MAP_MOBILE_WIDTH,
  ASSEMBLY_MAP_MOBILE_HEIGHT,
  ASSEMBLY_MAP_IMAGE,
  ASSEMBLY_MAP_MOBILE_IMAGE,
  type WardMapMarker,
} from "@/lib/ward-map-markers";

/**
 * The 17-ward constituency map for the homepage.
 */

function WardPinLayer({
  variant,
  width,
  height,
  markers,
  radius,
  title,
  desc,
}: {
  variant: "mobile" | "desktop";
  width: number;
  height: number;
  markers: WardMapMarker[];
  radius: number;
  title: string;
  desc: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const titleId = `ward-map-svg-title-${variant}`;
  const descId = `ward-map-svg-desc-${variant}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`paithan-ward-map absolute inset-0 h-full w-full ${
        variant === "mobile" ? "sm:hidden" : "hidden sm:block"
      }`}
      role="group"
      aria-labelledby={`${titleId} ${descId}`}
    >
      <title id={titleId}>{title}</title>
      <desc id={descId}>{desc}</desc>

      <g fill="transparent" stroke="none">
        {markers.map((marker) => {
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
                r={radius}
              />
              <title>{`Ward ${wardNumber}`}</title>
            </Link>
          );
        })}
      </g>
    </svg>
  );
}

export function PaithanWardMap() {
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
        <picture className="block">
          <source
            media="(max-width: 39.98rem)"
            srcSet={ASSEMBLY_MAP_MOBILE_IMAGE}
            width={ASSEMBLY_MAP_MOBILE_WIDTH}
            height={ASSEMBLY_MAP_MOBILE_HEIGHT}
          />
          <img
            src={ASSEMBLY_MAP_IMAGE}
            alt=""
            width={ASSEMBLY_MAP_WIDTH}
            height={ASSEMBLY_MAP_HEIGHT}
            className="block h-auto w-full"
          />
        </picture>

        <WardPinLayer
          variant="mobile"
          width={ASSEMBLY_MAP_MOBILE_WIDTH}
          height={ASSEMBLY_MAP_MOBILE_HEIGHT}
          markers={wardMapMarkersMobile}
          radius={60}
          title={tNagar("wardMapTitle")}
          desc={tNagar("wardMapSubtitle")}
        />
        <WardPinLayer
          variant="desktop"
          width={ASSEMBLY_MAP_WIDTH}
          height={ASSEMBLY_MAP_HEIGHT}
          markers={wardMapMarkers}
          radius={44}
          title={tNagar("wardMapTitle")}
          desc={tNagar("wardMapSubtitle")}
        />
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
