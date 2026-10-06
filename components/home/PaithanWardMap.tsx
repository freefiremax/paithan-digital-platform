"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

/**
 * The 17-ward constituency map for the homepage.
 */

// Pin centres, exactly as authored in the source SVG. Index + 1 === ward number.
const WARD_PINS = [
  { cx: 440, cy: 270 }, // Ward 1
  { cx: 658, cy: 243 }, // Ward 2
  { cx: 917, cy: 240 }, // Ward 3
  { cx: 371, cy: 355 }, // Ward 4
  { cx: 620, cy: 366 }, // Ward 5
  { cx: 811, cy: 353 }, // Ward 6
  { cx: 1077, cy: 408 }, // Ward 7
  { cx: 392, cy: 548 }, // Ward 8
  { cx: 612, cy: 489 }, // Ward 9
  { cx: 946, cy: 540 }, // Ward 10
  { cx: 349, cy: 672 }, // Ward 11
  { cx: 565, cy: 673 }, // Ward 12
  { cx: 801, cy: 675 }, // Ward 13
  { cx: 1128, cy: 697 }, // Ward 14
  { cx: 466, cy: 771 }, // Ward 15
  { cx: 950, cy: 751 }, // Ward 16
  { cx: 730, cy: 885 }, // Ward 17
] as const;

const wardHref = (wardNumber: number) =>
  `/nagar-parishad/ward-map#ward-${wardNumber}`;

export function PaithanWardMap() {
  const router = useRouter();
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

        <div className="mx-auto max-w-5xl overflow-hidden rounded-sm border border-[var(--border-subtle)] bg-white p-3 sm:p-4">
          <svg
            viewBox="0 0 1316 1195"
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
              href="/maps/paithan-17-wards-base.png"
              x="0"
              y="0"
              width="1316"
              height="1195"
              preserveAspectRatio="none"
            />

            <g fill="transparent" stroke="none">
              {WARD_PINS.map((pin, index) => {
                const wardNumber = index + 1;
                const href = wardHref(wardNumber);
                return (
                  <Link
                    key={wardNumber}
                    href={href}
                    aria-label={`Ward ${wardNumber}`}
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
                      cx={pin.cx}
                      cy={pin.cy}
                      r={40}
                    />
                    <title>{`Ward ${wardNumber}`}</title>
                  </Link>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

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

