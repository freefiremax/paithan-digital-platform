"use client";

/*
 * The home band's background footage, made mobile-aware.
 *
 * WHY THIS IS AN ISLAND. The clip is 26.6 MB. Autoplaying it on a phone burns
 * data and janks the page, so below the lg breakpoint we do NOT fetch or play
 * it: the video is rendered with `preload="none"` and no `autoPlay`, and the
 * band shows the static Paithani ground instead. Only at lg and up (and only
 * when the reader has not asked for reduced motion) does the clip load and run.
 *
 * The decision is made on the client because the breakpoint is a viewport fact
 * the server cannot know. The server renders the element without autoplay, so
 * the heavy file is never fetched during the initial paint; the effect then
 * upgrades it on large screens.
 */
import { useEffect, useRef } from "react";

const VIDEO_ID = "home-band-video";

export function BandVideo() {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      if (desktop.matches && !reduce.matches) {
        el.preload = "auto";
        void el.play().catch(() => {});
      } else {
        el.pause();
        el.preload = "none";
      }
    };

    apply();
    desktop.addEventListener("change", apply);
    reduce.addEventListener("change", apply);
    return () => {
      desktop.removeEventListener("change", apply);
      reduce.removeEventListener("change", apply);
    };
  }, []);

  return (
    <video
      id={VIDEO_ID}
      ref={ref}
      className="h-[54vh] max-h-[420px] w-full object-cover object-center lg:absolute lg:inset-0 lg:h-full lg:max-h-none"
      src="/videoclips/completepaithan.mp4"
      poster="/images/paithani-bg.png"
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
