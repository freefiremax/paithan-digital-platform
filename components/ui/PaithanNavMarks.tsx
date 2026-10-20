/**
 * Navigation marks for the header, drawn as Paithani textile units.
 *
 * WHY THESE EXIST. The header previously marked each nav wing with a stock
 * outline icon — a generic building, a generic compass, a generic document.
 * Those read as "any app", not "Paithan", and they were the loudest tell that
 * the chrome was templated. A Paithani pallu does not draw a building to say
 * "civic affairs"; it repeats a woven unit and lets the border speak. These
 * marks follow that rule: each is a flat, symmetric textile motif, not a
 * picture, and `currentColor` lets them take the header's ink.
 *
 * WHAT EACH IS, in weaving terms:
 *   - `WovenDiamond` — the chauk (four-point) lozenge, the simplest repeat unit
 *     of a Paithani border; stands for the council itself.
 *   - `ZariChevron` — the drawn sawtooth of the pallu edge; stands for notices
 *     and the civic register.
 *   - `TempleArch` — the gavaksha (temple-window) arch, common in the woven
 *     borders around Paithan's own stepwells and shikharas; stands for heritage.
 *   - `WovenLotus` — the kamal rosette that closes a pallu; stands for tourism
 *     and the town's pilgrim places.
 *   - `ZariStar` — the eight-point star and its bead, a repeat that sits between
 *     the major border motifs; stands for grievances, the citizen's raised hand.
 *
 * All geometry, no drawing. The earlier note in HistoricMotifs.tsx about why a
 * hand-drawn townscape failed applies here too: a woven unit is *supposed* to be
 * regular, so regularity is correct rather than a tell.
 */
import { cn } from "@/lib/utils";

interface MarkProps {
  readonly className?: string;
}

const BASE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.4",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** The council: a chauk lozenge with a woven core. */
export function WovenDiamond({ className }: MarkProps) {
  return (
    <svg {...BASE} className={cn("h-4 w-4", className)}>
      <path d="M12 2.5 L21.5 12 L12 21.5 L2.5 12 Z" />
      <path d="M12 6.5 L17.5 12 L12 17.5 L6.5 12 Z" opacity="0.55" />
      <path d="M12 10 a2 2 0 1 0 .01 0" />
    </svg>
  );
}

/** Notices: the sawtooth pallu edge with its beads. */
export function ZariChevron({ className }: MarkProps) {
  return (
    <svg {...BASE} className={cn("h-4 w-4", className)}>
      <path d="M3 16 L7.5 9 L12 16 L16.5 9 L21 16" />
      <path d="M3 19.5 H21" opacity="0.5" />
      <path d="M7.5 12.2 a0.9 0.9 0 1 0 .01 0" />
      <path d="M16.5 12.2 a0.9 0.9 0 1 0 .01 0" />
    </svg>
  );
}

/** Heritage: the gavaksha temple arch. */
export function TempleArch({ className }: MarkProps) {
  return (
    <svg {...BASE} className={cn("h-4 w-4", className)}>
      <path d="M5 20 V11 C5 7.4 8.1 5 12 5 C15.9 5 19 7.4 19 11 V20" />
      <path d="M5 20 H19" />
      <path d="M12 5 V2.6" />
      <path d="M8.6 20 V13 C8.6 11 10.1 9.6 12 9.6 C13.9 9.6 15.4 11 15.4 13 V20" opacity="0.55" />
    </svg>
  );
}

/** Tourism: the kamal rosette. */
export function WovenLotus({ className }: MarkProps) {
  return (
    <svg {...BASE} className={cn("h-4 w-4", className)}>
      <path d="M12 4 C13.6 6.4 13.6 8.8 12 10.8 C10.4 8.8 10.4 6.4 12 4 Z" />
      <path d="M12 10.8 C9.2 9.8 7.6 7.6 8 4.8 C11 5.6 12 8 12 10.8 Z" />
      <path d="M12 10.8 C14.8 9.8 16.4 7.6 16 4.8 C13 5.6 12 8 12 10.8 Z" />
      <path d="M12 10.8 C9 11.6 6.6 14.2 6.4 17.4 C9.6 16.6 11.4 13.8 12 10.8 Z" />
      <path d="M12 10.8 C15 11.6 17.4 14.2 17.6 17.4 C14.4 16.6 12.6 13.8 12 10.8 Z" />
      <path d="M8 20 H16" />
    </svg>
  );
}

/** Grievances: the eight-point zari star. */
export function ZariStar({ className }: MarkProps) {
  return (
    <svg {...BASE} className={cn("h-4 w-4", className)}>
      <path d="M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z" />
      <path d="M12 8.4 a3.6 3.6 0 1 0 .01 0" opacity="0.55" />
    </svg>
  );
}
