import { cn } from "@/lib/utils";

interface CouncilSealProps {
  readonly size?: number;
  readonly className?: string;
}

/**
 * Placeholder council crest.
 *
 * Deliberately not a rendition of the State Emblem or the council's own seal —
 * reproducing an official emblem from memory would put an unauthorised mark on a
 * government page. Replace with the official crest supplied by the Nagar
 * Parishad before launch.
 *
 * An earlier version was a madder disc with a gold double ring, a cream lotus and
 * a gold `पैठण` — which is the construction of a festival badge, and it was one
 * of the main reasons the site read as Diwali. Crimson ground plus metallic gold
 * plus a lotus is a celebratory object, not a civic one.
 *
 * It is now an engraved roundel and nothing else: one colour, oxide, on the
 * paper ground. No disc, no gold, no fill. A seal that is only an outline and a
 * letterpress initial belongs on a letterhead; a seal rendered in flat festive
 * colour belongs on a wedding card. Same five petals, but cut rather than
 * painted.
 *
 * The double ring is the one piece of geometry kept from the old version, because
 * a ruled ring around a mark is how a die is cut and is not a festive signal.
 */
export function CouncilSeal({ size = 56, className }: CouncilSealProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      role="img"
      aria-label="Paithan Municipal Council crest (placeholder)"
      className={cn("shrink-0", className)}
    >
      {/* Paper ground, so the mark sits on the page rather than floating on a
          coloured disc. */}
      <circle cx="28" cy="28" r="27" fill="var(--surface-card)" />

      {/* The cut ring, and a lighter inner one. Stone, not metal: the strokes
          are oxide and a border-subtle grey rather than two golds. */}
      <circle
        cx="28"
        cy="28"
        r="25.4"
        fill="none"
        stroke="var(--portal-blue-800)"
        strokeWidth="1.7"
      />
      <circle
        cx="28"
        cy="28"
        r="22.2"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth="0.8"
      />

      {/* Five petals in one colour, outline only. A ring of five is a lotus to
          anyone who needs it to be, and it is also just a rosette — which is
          what keeps it off the greeting card. */}
      <g
        fill="none"
        stroke="var(--portal-blue-800)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M28 15.5 C31.4 19.6 31.4 23.4 28 26.2 C24.6 23.4 24.6 19.6 28 15.5 Z" />
        <path d="M21.6 18.4 C26.1 20.2 27.6 23.4 26.6 27.1 C22.7 26.6 20.3 23.4 21.6 18.4 Z" />
        <path d="M34.4 18.4 C35.7 23.4 33.3 26.6 29.4 27.1 C28.4 23.4 29.9 20.2 34.4 18.4 Z" />
        <path d="M17.4 23.8 C21.6 23.4 24.5 25.4 25.1 29.1 C21.4 30.5 17.9 28.6 17.4 23.8 Z" />
        <path d="M38.6 23.8 C38.1 28.6 34.6 30.5 30.9 29.1 C31.5 25.4 34.4 23.4 38.6 23.8 Z" />
        {/* The rule the petals stand on. */}
        <path d="M19.5 31.2 H36.5" />
      </g>

      <text
        x="28"
        y="41.5"
        textAnchor="middle"
        fill="var(--portal-blue-800)"
        fontSize="9"
        fontWeight="500"
        fontFamily="var(--font-display-deva)"
      >
        पैठण
      </text>
    </svg>
  );
}
