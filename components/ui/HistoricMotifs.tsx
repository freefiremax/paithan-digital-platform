/**
 * Flat textile geometry for the Paithan identity.
 *
 * Everything here is hand-authored SVG rather than sourced artwork, for two
 * reasons. The subject matter is specific to Paithani weaving, and stock
 * illustration would get it wrong. And a municipal site cannot ship artwork it
 * has no rights to.
 *
 * What this file deliberately does NOT contain is a drawing.
 *
 * An earlier revision drew the town — stepwell, shikhara, peepal — as
 * "hand-sketched" line art. It read as machine-generated, and the reasons are
 * worth recording so the next pass does not retry it:
 *
 * - One uniform `strokeWidth` for every mark. Real pen-and-ink modulates; the
 *   line is heavier where the hand pressed. Bezier paths cannot do that.
 * - Dead-straight 300px runs (`H316` for the ground line). A hand does not
 *   hold a line true over that distance.
 * - Computed mirror symmetry: the shikhara was drawn at `centre ± 26` on both
 *   sides. A drawn temple leans.
 * - Machine-even spacing: stair treads at exactly 10px, sun rays at exactly
 *   20/60/218/264.
 * - Invented completeness — finial, niche, door, branches, roots, birds, rays
 *   and plants all ticked off. Real drawing is selective.
 *
 * Overshooting the joins on purpose, as an earlier comment here claimed to do,
 * fakes the *symptom* of drawing without the substance, and a wobble filter on
 * top would be a third pass at the same mistake.
 *
 * So the ornament is geometry instead, which is what a woven pallu border
 * actually is: repeating flat units, mathematically regular, never pretending to
 * be a picture. The main border is a CSS tile (`.paithani-band`) because a
 * seamless repeat wants `background-repeat`, not a component. What remains here
 * are the pieces that are legitimately single, flat, and symmetric.
 *
 * `currentColor` throughout, so a motif takes its colour from its container and
 * sits on parchment or madder without a second set of paths.
 */
import { cn } from "@/lib/utils";

/**
 * A buti — the calyx motif repeated up a Paithani pallu, and the unit the
 * main border tile is built from.
 *
 * Drawn here as one large calyx for a heading, where the tiled version would be
 * too fine to read. Symmetric and geometric on purpose: a buti is a woven unit,
 * not a sketched leaf, so it is *supposed* to be regular.
 */
export function ButiOrnament({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 24 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-auto w-5", className)}
    >
      {/* Outer calyx: a teardrop with a flat base, the standard buti outline. */}
      <path d="M12 1 C6.4 6.4 4.4 12.4 5.2 18.2 C5.8 23 8.4 26 12 26 C15.6 26 18.2 23 18.8 18.2 C19.6 12.4 17.6 6.4 12 1 Z" />
      {/* Two ribs and a central vein — the interior line a woven buti has. */}
      <path d="M12 6 C10 10.4 9.4 15 9.8 19.4" />
      <path d="M12 6 C14 10.4 14.6 15 14.2 19.4" />
      <path d="M12 6 V22.6" />
      {/* Base rule and the two beads that close the repeat. */}
      <path d="M7 26 H17" />
      <path d="M9 29 a1.6 1.6 0 1 0 .01 0" />
      <path d="M15 29 a1.6 1.6 0 1 0 .01 0" />
      <path d="M12 26 V27.4" />
    </svg>
  );
}

/**
 * The section finial: a flat lotus rosette between two rules.
 *
 * Used once per major boundary. A manuscript marks its divisions, and a rosette
 * on the centreline is the divider it uses. This is a stonemason's device rather
 * than a picture — concentric geometry — which is why it can be drawn
 * accurately at 20px where the townscape could not.
 */
export function SectionFinial({ className }: { readonly className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center gap-3 py-2", className)}
      aria-hidden="true"
    >
      <span className="h-px w-10 bg-[var(--border-strong)] sm:w-20" />
      <svg
        viewBox="0 0 40 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-10 text-[var(--portal-blue-700)]"
      >
        {/* Eight petals, two registers, on the centreline. */}
        <path d="M20 10 C20 10 15.6 6.4 15.6 3.4 C15.6 1.4 17.2 0 18.6 0 C20 0 20 10 20 10 Z" />
        <path d="M20 10 C20 10 24.4 6.4 24.4 3.4 C24.4 1.4 22.8 0 21.4 0 C20 0 20 10 20 10 Z" />
        <path d="M20 10 C20 10 13.4 8.6 11.6 6.2 C10.4 4.6 10.8 2.8 12 2 C13.6 1 20 10 20 10 Z" />
        <path d="M20 10 C20 10 26.6 8.6 28.4 6.2 C29.6 4.6 29.2 2.8 28 2 C26.4 1 20 10 20 10 Z" />
        <path d="M20 10 C20 10 13.4 11.4 11.6 13.8 C10.4 15.4 10.8 17.2 12 18 C13.6 19 20 10 20 10 Z" />
        <path d="M20 10 C20 10 26.6 11.4 28.4 13.8 C29.6 15.4 29.2 17.2 28 18 C26.4 19 20 10 20 10 Z" />
        <path d="M20 10 C20 10 15.6 13.6 15.6 16.6 C15.6 18.6 17.2 20 18.6 20 C20 20 20 10 20 10 Z" />
        <path d="M20 10 C20 10 24.4 13.6 24.4 16.6 C24.4 18.6 22.8 20 21.4 20 C20 20 20 10 20 10 Z" />
        {/* Centre boss, the knot every petal radiates from. */}
        <path d="M20 10 a2.2 2.2 0 1 0 .01 0" />
      </svg>
      <span className="h-px w-10 bg-[var(--border-strong)] sm:w-20" />
    </div>
  );
}

/**
 * A drawn plinth edge for the landmark figures.
 *
 * The photo plates elsewhere on the page are modern rectangular images, which
 * is the one place the hand-made language was breaking down. This gives those
 * figures a mount: a drawn rule with a zari bead at each end, the way a figure
 * is set into a manuscript panel. Pure geometry, so it cannot read as generated.
 */
export function FigureMount({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 120 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden="true"
      className={cn("h-auto w-full", className)}
    >
      <path d="M4 5 H116" opacity="0.5" />
      <path d="M4 5 a3 3 0 1 0 .01 0" />
      <path d="M116 5 a3 3 0 1 0 .01 0" />
      <path d="M60 5 a2 2 0 1 0 .01 0" opacity="0.6" />
    </svg>
  );
}
