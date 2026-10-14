"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

/**
 * The 17-ward constituency map for the homepage.
 */

// Pin centres, exactly as authored in the source SVG. Index + 1 === ward number.
const WARD_PINS = [
  // These coordinates are the small white town points in the source map
  // (1316 x 1195). Keeping the numbered marker tips on those points makes
  // the map remain accurate when the image scales responsively.
  { cx: 514, cy: 259 }, // Ward 1 — Jambhali
  { cx: 748, cy: 277 }, // Ward 2 — Khodegaon
  { cx: 1092, cy: 232 }, // Ward 3 — Kolghar
  { cx: 313, cy: 388 }, // Ward 4 — Islampur
  { cx: 499, cy: 434 }, // Ward 5 — Nandalgaon
  { cx: 859, cy: 396 }, // Ward 6 — Abdullapur
  { cx: 1083, cy: 462 }, // Ward 7 — Adgaon
  { cx: 441, cy: 519 }, // Ward 8 — Dhupkheda
  { cx: 708, cy: 555 }, // Ward 9 — Balanagar
  { cx: 862, cy: 551 }, // Ward 10 — Sultanpur
  { cx: 255, cy: 720 }, // Ward 11 — Shevata
  { cx: 558, cy: 764 }, // Ward 12 — Pimpalwadi
  { cx: 718, cy: 632 }, // Ward 13 — Kasarpadli
  { cx: 1090, cy: 684 }, // Ward 14 — Pachod
  { cx: 658, cy: 808 }, // Ward 15 — Karanj Kheda
  { cx: 870, cy: 815 }, // Ward 16 — Kutub Kheda
  { cx: 780, cy: 976 }, // Ward 17 — Apegaon
] as const;

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
                const href = `/${locale}/nagar-parishad/ward-map/${wardNumber}`;
                return (
                  <Link
                    key={wardNumber}
                    href={href}
                    aria-label={`Open Ward ${wardNumber} details`}
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
                      r={44}
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

