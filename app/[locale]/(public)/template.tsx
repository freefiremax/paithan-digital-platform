import type { CSSProperties, ReactNode } from "react";

/*
 * Route transition wrapper. A `template.tsx` is remounted by the App Router on
 * every navigation to a new segment, so the enter animation re-runs each time the
 * reader changes screen — rather than a hard swap.
 *
 * Two layers:
 *  - `.page-transition` — the page itself, which fades and rises in.
 *  - `.page-cut` — a curtain of vertical Paithani-cloth panels laid OVER the
 *    page while it arrives, then withdrawn in a staggered sweep (left to right)
 *    so the new screen is "uncut" like cloth coming off the loom. Because the
 *    template is remounted per route, this overlay lives only for the duration of
 *    that page's entry and can never linger over a later route.
 *
 * The motion lives in globals.css and only plays under
 * `prefers-reduced-motion: no-preference`; with motion reduced the cut is a no-op
 * and the page is simply there.
 */
export default function PublicTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="page-transition">
      <div className="page-cut" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span
            key={i}
            className="page-cut__panel"
            style={{ "--cut-index": i } as CSSProperties}
          />
        ))}
      </div>
      {children}
    </div>
  );
}
