import { cn } from "@/lib/utils";

interface CouncilSealProps {
  readonly size?: number;
  readonly className?: string;
}

/**
 * Placeholder council crest.
 *
 * Deliberately a neutral geometric roundel, not a rendition of the State Emblem or the
 * council's own seal — reproducing an official emblem from memory would put an
 * unauthorised mark on a government page. The zari-gold double ring references the
 * Paithani border (kinari) that bounds a woven field. Replace with the official crest
 * supplied by the Nagar Parishad before launch.
 */
export function CouncilSeal({ size = 52, className }: CouncilSealProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      role="img"
      aria-label="Paithan Municipal Council crest (placeholder)"
      className={cn("shrink-0", className)}
    >
      <circle cx="26" cy="26" r="25" fill="var(--gov-navy-900)" />
      <circle cx="26" cy="26" r="23.25" fill="none" stroke="var(--zari-gold-500)" strokeWidth="1.5" />
      <circle cx="26" cy="26" r="20" fill="none" stroke="var(--zari-gold-500)" strokeWidth="0.75" opacity="0.55" />
      <text
        x="26"
        y="26"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--zari-gold-400)"
        fontSize="19"
        fontWeight="600"
        fontFamily="var(--font-devanagari)"
      >
        पै
      </text>
    </svg>
  );
}
