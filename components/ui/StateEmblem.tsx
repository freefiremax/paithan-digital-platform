import Image from "next/image";

/**
 * The Government of Maharashtra emblem.
 *
 * This is a STATE mark. It is deliberately not used as the council's own seal --
 * `CouncilSeal` holds that, and swapping a state emblem into the council's
 * identity slot would attribute the state mark to a municipal body. It appears
 * only where the page is already attributing something to the state: the
 * "Government of Maharashtra" utility bar and the footer's government-links
 * column.
 *
 * The source is a JPEG with a flat white field, so it was converted once to a
 * transparent PNG (`public/images/sites/Maharashtra-logo.png`). Without that
 * conversion the white square shows as a hard box against the warm ivory
 * ground. The emblem is black ink, so `invert` is what puts it on a dark band --
 * it flips the colour channels and leaves the alpha channel alone, which keeps
 * the anti-aliased edges intact where a second recoloured asset would not.
 */
export function StateEmblem({
  size = 20,
  invert = false,
  className = "",
}: {
  /** Rendered height in px. The source is square, so width follows height. */
  size?: number;
  /** Flip black ink to white, for placement on a dark band. */
  invert?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/images/sites/Maharashtra-logo.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`shrink-0 ${invert ? "invert" : ""} ${className}`}
    />
  );
}

export default StateEmblem;
