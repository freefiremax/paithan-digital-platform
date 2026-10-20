"use client";

/*
 * Scroll reveal. Wraps a block and fades/slides it into place the first time it
 * enters the viewport, so the page assembles itself as the reader scrolls rather
 * than arriving all at once.
 *
 * WHY A CLIENT ISLAND. The pages are otherwise server components; this is the one
 * piece that needs an observer. It only toggles a class on its own wrapper, so
 * the cost is a single IntersectionObserver per instance and a compositor-only
 * transition — no scroll listener, no per-frame React work.
 *
 * ONE-SHOT. Once a block has been revealed it is unobserved: content that is
 * already read should not fade again on the way back up the page.
 *
 * REDUCED MOTION. The observer still runs, but the CSS only animates when motion
 * is welcome (`@media (prefers-reduced-motion: no-preference)`), and the element
 * is left at full opacity for everyone else. There is no way for the page to end
 * up blank if JavaScript never runs: the "hidden" state lives behind a class the
 * script adds, not in the base styles.
 *
 * Use `<Reveal>` for a whole section, or `<Reveal as="li">` / `stagger` for a
 * list whose children should arrive one after another.
 */

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

interface RevealProps {
  readonly children: ReactNode;
  /** Element to render. Defaults to a plain `div`. */
  readonly as?: ElementType;
  /** Extra classes merged onto the wrapper. */
  readonly className?: string;
  /** Delay before the block animates in, in ms. */
  readonly delay?: number;
  /**
   * Stagger the direct children instead of the block as a whole. Each child is
   * given an increasing delay via a CSS custom property.
   */
  readonly stagger?: boolean;
  /** Milliseconds between staggered children. */
  readonly staggerStep?: number;
  /**
   * Named treatment. `"weave"` replaces the plain fade with the Paithani
   * cloth-weaving reveal: the selvedges draw in from either side and a zari
   * pick-line sweeps across the panel as it settles. Use it only where that
   * extra motion is warranted, not on every section.
   */
  readonly variant?: "default" | "weave";
}

export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  stagger = false,
  staggerStep = 90,
  variant = "default",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced motion: reveal immediately, never observe.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.unobserve(entry.target);
          }
        }
      },
      // Start the reveal a little before the block is fully on screen, and treat
      // a block taller than the viewport as "arrived" as soon as its top shows.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${variant === "weave" ? "reveal--weave" : ""} ${
        stagger ? "reveal--stagger" : ""
      } ${shown ? "reveal--in" : ""} ${className}`.trim()}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-step": `${staggerStep}ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
