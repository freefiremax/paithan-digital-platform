"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

/**
 * The 17-ward constituency map for the homepage.
 */

// Pin centres, exactly as authored in the source SVG. Index + 1 === ward number.
const WARD_PINS = [
  // These coordinates are the tips of the numbered markers in the source map
  // (1316 x 1195). Keeping the hit targets on the marker tips makes the map
  // remain accurate when the image scales responsively.
  { cx: 443, cy: 282 }, // Ward 1 — Babhulgaon/Jambhali
  { cx: 664, cy: 282 }, // Ward 2 — Khodegaon
  { cx: 926, cy: 278 }, // Ward 3 — Kolghar
  { cx: 374, cy: 394 }, // Ward 4 — Islampur
  { cx: 626, cy: 404 }, // Ward 5 — Nandalgaon
  { cx: 820, cy: 396 }, // Ward 6 — Abdullapur
  { cx: 1085, cy: 445 }, // Ward 7 — Adgaon
  { cx: 397, cy: 582 }, // Ward 8 — Mankapur
  { cx: 620, cy: 534 }, // Ward 9 — Balanagar
  { cx: 956, cy: 575 }, // Ward 10 — Sultanpur
  { cx: 355, cy: 706 }, // Ward 11 — Shevata
  { cx: 576, cy: 715 }, // Ward 12 — Pimpalwadi
  { cx: 809, cy: 718 }, // Ward 13 — Kasarpadli
  { cx: 1140, cy: 734 }, // Ward 14 — Pachod
  { cx: 468, cy: 810 }, // Ward 15 — Karanj Kheda
  { cx: 959, cy: 791 }, // Ward 16 — Kutub Kheda
  { cx: 737, cy: 896 }, // Ward 17 — Apegaon
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

