"use client";

/**
 * Home-page band: the town's two elected representatives, MLA and MP.
 *
 * Data comes from `electedRepresentatives` in lib/mock-data.ts and stays on the
 * VERIFIED-protocol path. The band only adds presentation.
 *
 * THE PALLU. These are not two dashboard cards. Paithan is a weaving town, and
 * the pallu is the ornamental end panel of a Paithani saree: one field of
 * cloth, motifs placed on it by hand, the two ends joined by a running zari
 * thread. That is the layout here — a single `.pallu-field` (globals.css) with
 * the MLA and MP set as `buti` figures at either end, joined by a `.pallu-seam`
 * thread, each with a woven `.buti-caption` border strip carrying constituency
 * and office. The two ends are deliberately NOT mirrored: the MLA sits flush,
 * the MP offset down the field, so it reads as a hand-placed woven panel rather
 * than a symmetric template.
 *
 * DELIBERATELY SHORT. This is a signpost, not a biography. The figures carry the
 * name, tier, constituency and one contact line, then hand off to the full MLA /
 * MP pages. The long-facing detail belongs on those pages, not here.
 *
 * The band sits directly under the video band as the home page's first civic
 * section (see `.reps-cover` in globals.css).
 */

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { electedRepresentatives, type Representative } from "@/lib/mock-data";

/** Portrait per representative id; a missing file at build time is a hard error. */
const PORTRAITS: Record<string, { src: string; alt: string }> = {
  "rep-mla": {
    src: "/images/mla-vilas-bhumre.jpeg",
    alt: "Portrait of Shri Vilas Sandipanrao Bhumre, MLA for Paithan",
  },
  "rep-mp": {
    src: "/images/mp-sandipan-bhumre.jpeg",
    alt: "Portrait of Shri Sandipanrao Bhumre, Member of Parliament",
  },
};

const ORDER = ["rep-mla", "rep-mp"] as const;

export function RepresentativesShowcase() {
  const t = useTranslations("home");

  const reps = ORDER.map((id) => electedRepresentatives.find((r) => r.id === id)).filter(
    (r): r is Representative => Boolean(r)
  );

  return (
    <section
      aria-labelledby="representatives-heading"
      className="reps-cover relative"
    >
      <div className="reps-ground">
        {/* Paithani ground: the real weave at a readable strength, under a graded
            madder veil. Opaque and full-bleed, so it covers the whole band. */}
        <Image
          src="/images/paithani-bg.png"
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
          className="reps-ground__weave"
        />
        <div className="reps-ground__veil" aria-hidden="true" />

        <div className="relative mx-auto max-w-[1120px] px-4 pb-14 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
          {/* Section head. The eyebrow is a woven thread label, not a tracked
              caps badge: a short zari stitch sits either side of it. */}
          <Reveal className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3">
              <span
                className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--zari-gold-400)]"
                aria-hidden="true"
              />
              <p className="font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--zari-gold-400)]">
                {t("repsEyebrow")}
              </p>
              <span
                className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--zari-gold-400)]"
                aria-hidden="true"
              />
            </div>
            <h2
              id="representatives-heading"
              className="mt-3 font-display text-[1.6rem] font-semibold leading-tight text-white sm:text-[2.05rem]"
            >
              {t("repsHeading")}
            </h2>
          </Reveal>

          {/* THE PALLU. One field of cloth, two ends joined by a running zari
              thread. Not two cards — see `.pallu-field` in globals.css. */}
          <Reveal delay={60} className="mt-10">
            <div className="pallu-field relative p-7 sm:p-9 lg:p-14">
              {/* The inner register hairline and the running zari thread that
                  joins the two ends. Decorative, both hidden on mobile. */}
              <span className="pallu-seam" aria-hidden="true" />
              <span className="pallu-divide" aria-hidden="true" />

              <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-16">
                {reps.map((rep) => {
                  const isMla = rep.id === "rep-mla";
                  const tierTag = isMla ? t("repsMlaTag") : t("repsMpTag");
                  const portrait = PORTRAITS[rep.id];

                  return (
                    <article
                      key={rep.id}
                      /* Both ends sit level on a shared baseline — the earlier
                         deliberate offset read as a mistake, not as the
                         hand-placed asymmetry it was meant to be. */
                      className="group flex flex-col"
                    >
                      <div className="flex items-start gap-5">
                        {/* The buti: the portrait in its woven border cell. */}
                        <Link
                          href={`/nagar-parishad/representatives/${isMla ? "mla" : "mp"}`}
                          className="buti-frame shrink-0 transition-transform duration-500 group-hover:-translate-y-1"
                        >
                          <div className="relative h-[8.5rem] w-[7rem] overflow-hidden sm:h-[9.5rem] sm:w-[7.75rem]">
                            <Image
                              src={portrait.src}
                              alt={portrait.alt}
                              fill
                              sizes="(max-width: 640px) 112px, 124px"
                              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                        </Link>

                        <div className="min-w-0 flex-1 pt-1">
                          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--zari-gold-400)]">
                            {tierTag}
                          </p>
                          <h3 className="mt-1.5 font-display text-xl font-semibold leading-tight text-white sm:text-[1.5rem]">
                            {rep.name}
                          </h3>
                          {rep.nameMr ? (
                            <p
                              lang="mr"
                              className="mt-1 font-display-deva text-base leading-snug text-white/75"
                            >
                              {rep.nameMr}
                            </p>
                          ) : null}

                          <Link
                            href={`/nagar-parishad/representatives/${isMla ? "mla" : "mp"}`}
                            className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--zari-gold-400)] underline-offset-4 transition-colors hover:text-white hover:underline"
                          >
                            <span>{t("repsViewProfile")}</span>
                            <ArrowRight
                              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </Link>
                        </div>
                      </div>

                      {/* A woven caption strip, like the border carrying the
                          maker's mark: constituency and the office line. */}
                      <dl className="buti-caption mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 px-4 py-2.5 text-[12.5px] text-white/80">
                        {rep.constituency ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin
                              className="h-3.5 w-3.5 shrink-0 text-[var(--zari-gold-400)]"
                              aria-hidden="true"
                            />
                            <dt className="sr-only">{t("repsConstituencyLabel")}</dt>
                            <dd>{rep.constituency}</dd>
                          </div>
                        ) : null}
                        {rep.phone ? (
                          <div className="flex items-center gap-1.5">
                            <Phone
                              className="h-3.5 w-3.5 shrink-0 text-[var(--zari-gold-400)]"
                              aria-hidden="true"
                            />
                            <dt className="sr-only">{t("officeHours")}</dt>
                            <dd className="tabular-nums">{rep.phone}</dd>
                          </div>
                        ) : null}
                      </dl>
                    </article>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* About Paithan block below cards removed */}
        </div>
      </div>

      <div className="paithani-band" aria-hidden="true" />
    </section>
  );
}
