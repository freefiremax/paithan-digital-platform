import type { ReactNode } from "react";

/*
 * Route transition wrapper. A `template.tsx` is remounted by the App Router on
 * every navigation to a new segment, so the `.page-transition` class re-runs its
 * enter animation each time the reader changes screen — a soft fade-and-rise
 * rather than a hard swap. The animation itself lives in globals.css and only
 * plays under `prefers-reduced-motion: no-preference`; with motion reduced this
 * is a plain wrapper with no visual effect.
 *
 * A template is used instead of a layout because a layout PERSISTS across
 * navigations and would only animate once, on first load.
 */
export default function PublicTemplate({ children }: { children: ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
