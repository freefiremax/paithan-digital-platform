/*
 * Full-bleed background video sitting directly under the three-band header, with
 * the council's live notices running up the right-hand side and a short welcome
 * card for visitors and residents running down the left.
 *
 * The video itself is plain on purpose: one clip, `object-cover`, no scrim over
 * the footage, no blur backdrop, no mask. The `.video-fade-bottom` dissolve and
 * the blurred second layer were both added to hide the trim on a 2:1 clip in a
 * much wider band, and neither was the look that was wanted. The only darkening
 * anywhere in this band is LOCAL: the notice panel's own head bar, the per-row
 * chips, and the welcome card. Each sits on the frame as its own chip rather
 * than being stretched across the image, so the footage still reads through.
 *
 * `muted` + `playsInline` are not optional: without them every mobile browser
 * blocks autoplay and the band renders as an empty rectangle. The clip is
 * swapped by replacing the single file in /public/videoclips.
 *
 * LAYOUT. On desktop the notices float over the right of the frame on a
 * deliberately TRANSPARENT panel, and the welcome card mirrors them on the left
 * over the part of the frame the notices never reach. Legibility therefore
 * cannot come from a panel-coloured backdrop: each notice row carries its own
 * translucent dark chip, and the accent cycle in ACCENTS gives every notice a
 * different bright bar; the welcome card carries one chip of its own, at the
 * same 0.68 dark, so the two sides read as one family. On mobile the video
 * stops being full-bleed and BOTH blocks become ordinary solid blocks stacked
 * under it — welcome card first, then notices — because floating either one
 * over a phone screen would cover the footage entirely and clip the longest
 * titles mid-word. `.notice-panel` and `.band-welcome` keep that split in CSS
 * at the lg boundary so the two layouts cannot drift apart.
 *
 * The section's `lg:h-[82vh] lg:min-h-[380px] lg:max-h-[860px]` is the single
 * most fragile line in this file. Above the lg breakpoint BOTH the video and
 * the notice panel are absolutely positioned, so neither contributes any height
 * to the section; without those three classes the section collapses to zero and
 * `overflow-hidden` clips the video out of existence. That is not hypothetical —
 * it is exactly what happened when the notice panel was first added, and the
 * video vanished. Below lg the video is an in-flow block and gives the section
 * its own height, so the utilities are desktop-only on purpose.
 *
 * THE LOOP. Pure CSS, no client JS, so the page keeps its zero-JavaScript
 * property and the browser owns the timing. The list is rendered twice and the
 * track is translated up by exactly half its height, so copy two arrives where
 * copy one left off. Two copies is load-bearing, not redundancy — one copy plus
 * a -50% keyframe makes the loop jump.
 *
 * The second copy is aria-hidden so the notices are not announced twice, and it
 * carries `data-loop-copy` so the reduced-motion rule can drop it and leave a
 * plain scrollable list. Pausing, the mask and the reduced-motion behaviour all
 * live in globals.css under `.notice-loop`; see the note there for why hover
 * alone is not enough to satisfy WCAG 2.2.2.
 */
import Link from "next/link";
import { useTranslations } from "next-intl";
import { notifications, formatCivicDate } from "@/lib/mock-data";
import { NotificationCategoryBadge } from "@/components/ui/NotificationCategoryBadge";
import { VideoControls } from "@/components/layout/VideoControls";

/** Newest first, which is the order the register itself is kept in. */
const LEDGER = [...notifications].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt)
);

/** How long one full pass takes. Overridable per-instance via inline style. */
const LOOP_SECONDS = 52;

/**
 * The notice accent cycle, referenced rather than spelled out so this file stays
 * free of colour literals. The values themselves live in globals.css next to the
 * rationale for picking bright-but-not-festive hues.
 */
const ACCENTS = [
  "var(--notice-accent-1)",
  "var(--notice-accent-2)",
  "var(--notice-accent-3)",
  "var(--notice-accent-4)",
  "var(--notice-accent-5)",
  "var(--notice-accent-6)",
] as const;

/**
 * Notice and accent paired up ONCE, so the duplicated half of the loop cannot
 * drift out of step with the first. If the accent were chosen from the render
 * index instead, the copy would be offset by however many rows the sort moved.
 */
const ROWS = LEDGER.map((notice, i) => ({
  notice,
  accent: ACCENTS[i % ACCENTS.length],
}));

/**
 * The four doors out of the welcome card: two for the visitor planning a day in
 * Paithan, two for the resident who came for the council itself. Keys rather
 * than labels so the whole card is translated like the rest of the page.
 */
const WELCOME_LINKS = [
  { key: "bandLinkPlaces", href: "/tourism/places-to-visit" },
  { key: "bandLinkRoutes", href: "/tourism/routes" },
  { key: "bandLinkServices", href: "/services" },
  { key: "bandLinkWards", href: "/nagar-parishad/ward-map" },
] as const;

export default function HomeVideoBand() {
  const t = useTranslations("home");

  return (
    <section
      className="
        relative isolate w-full overflow-hidden bg-[var(--paithani-red)]
        lg:h-[82vh] lg:min-h-[380px] lg:max-h-[860px]
        motion-reduce:h-auto motion-reduce:overflow-visible
      "
      aria-label="Welcome to Paithan, with scenic footage of the town and the council's current notices"
    >
      {/*
        Desktop: absolutely positioned so the footage runs edge to edge behind
        the panel. Mobile: an ordinary block, because `absolute` here would
        collapse the section's height and take the notices with it.
      */}
      <video
        id="home-band-video"
        className="h-[54vh] max-h-[420px] w-full object-cover object-center lg:absolute lg:inset-0 lg:h-full lg:max-h-none"
        src="/videoclips/completepaithan.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/*
        The caption and the playback controls sit bottom-LEFT, in the footage
        neither the notice panel nor the welcome card covers — the card's bottom
        padding in globals.css reserves this corner for them. Controls rather
        than a mute-only switch, because this clip autoplays on a loop forever
        and WCAG 2.2.2 requires any motion that runs past five seconds to be
        pausable. See VideoControls for why this is an island instead of the
        whole band becoming client-side.
      */}
      <VideoControls />

      {/*
        The left-hand welcome card: what Paithan is and the four doors a visitor
        or a resident usually wants first. Mobile: an ordinary block under the
        video, above the notices, so it reads as the band's opening paragraph.
        Desktop: absolutely pinned to the left of the frame, mirrored against the
        notice panel, on the same per-block chip that makes the notices legible.
        `.band-welcome` owns that split in globals.css.
      */}
      <div className="band-welcome">
        <div className="band-welcome__card">
          <p className="band-welcome__eyebrow">{t("bandEyebrow")}</p>
          <h2 className="band-welcome__title">{t("bandTitle")}</h2>
          <p className="band-welcome__blurb">{t("bandBlurb")}</p>
          <ul className="band-welcome__links">
            {WELCOME_LINKS.map((link) => (
              <li key={link.key}>
                <Link href={link.href} className="band-welcome__link">
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <aside
        className="
          notice-panel relative z-10 w-full border-t-2 border-[var(--zari-gold-400)]
          text-[var(--on-vangi)]
          lg:absolute lg:inset-y-0 lg:right-0 lg:w-[19rem] lg:border-l lg:border-t-0
          xl:w-[21rem]
        "
        aria-labelledby="notice-loop-heading"
      >
        {/* Panel head. A zari-gold hairline, the way a Paithani border catches
            light. It is deliberately the only continuous line on the panel: the
            six notice accents carry all the colour below it, and a second
            competing rule would make the heading stop being the anchor. */}
        <div className="notice-panel__head flex items-baseline justify-between gap-3 border-b border-[var(--zari-gold-400)] px-4 py-3">
          <h2
            id="notice-loop-heading"
            className="font-display text-base font-semibold text-[var(--surface-card)]"
          >
            <span lang="mr" className="font-display-deva">
              सूचना
            </span>
            <span className="mx-1.5 text-[var(--on-vangi)]" aria-hidden="true">
              &middot;
            </span>
            Current notices
          </h2>
          <Link
            href="/nagar-parishad/notifications"
            className="shrink-0 text-[11px] font-medium text-[var(--on-vangi)] underline-offset-2 hover:text-[var(--surface-card)] hover:underline"
          >
            All {notifications.length}
          </Link>
        </div>

        <div className="notice-loop h-[19rem] sm:h-[22rem] lg:h-[calc(100%-3.5rem)] lg:min-h-0">
          <ul
            className="notice-loop__track"
            style={{ "--notice-loop-duration": `${LOOP_SECONDS}s` } as React.CSSProperties}
          >
            {ROWS.map((row) => (
              <li key={row.notice.id}>
                <NoticeRow notice={row.notice} accent={row.accent} />
              </li>
            ))}

            {/*
              The second copy. aria-hidden so it is not announced twice, and
              data-loop-copy so the reduced-motion rule can remove it. It must
              be an exact duplicate of the first — the -50% translate assumes
              the two halves are identical to the pixel.
            */}
            {ROWS.map((row) => (
              <li key={`copy-${row.notice.id}`} aria-hidden="true" data-loop-copy>
                <NoticeRow notice={row.notice} accent={row.accent} />
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </section>
  );
}

/**
 * One row of the loop. A link, not a div, so the whole row is reachable by
 * keyboard and the panel is genuinely navigable rather than decorative motion.
 */
function NoticeRow({
  notice,
  accent,
}: {
  notice: (typeof notifications)[number];
  accent: string;
}) {
  return (
    <Link
      href="/nagar-parishad/notifications"
      className="notice-item block"
      style={{ "--notice-accent": accent } as React.CSSProperties}
    >
      <span className="notice-item__meta">
        <NotificationCategoryBadge category={notice.category} />
        <span className="tabular-nums">{notice.referenceNo}</span>
        {notice.closingAt ? (
          <span className="tabular-nums">Closes {formatCivicDate(notice.closingAt)}</span>
        ) : (
          <span className="tabular-nums">{formatCivicDate(notice.publishedAt)}</span>
        )}
      </span>
      <span className="notice-item__title">{notice.title}</span>
    </Link>
  );
}

export { HomeVideoBand };
