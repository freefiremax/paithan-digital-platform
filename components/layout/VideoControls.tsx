"use client";

/*
 * Playback control and caption for the decorative home band footage.
 *
 * WHY THIS IS AN ISLAND. The band is a server component on purpose: the notice
 * loop is pure CSS so the page ships no JavaScript for it, and turning the whole
 * band client-side to add two buttons would give all of that away. The video
 * element is therefore reached by id instead of by ref — the control is rendered
 * after the video in the DOM, and it only touches the DOM node, never React
 * state above it.
 *
 * WHY IT EXISTS. The clip autoplays on an infinite loop with no way to stop it.
 * WCAG 2.2.2 requires any motion that lasts more than five seconds to be
 * pausable, and a municipal page that cannot be paused is not a page anyone can
 * sit and read. `prefers-reduced-motion` is handled twice over: CSS stops the
 * notice loop, and here the video is never started for those users, so honouring
 * the preference does not depend on a stylesheet that may load late.
 *
 * The video itself stays `aria-hidden`. It is scenery, not content, and the
 * button is the accessible affordance that stands in for it — a citizen who
 * cannot see the footage can still stop it moving.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const VIDEO_ID = "home-band-video";

export function VideoControls() {
  const t = useTranslations("common");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const el = document.getElementById(VIDEO_ID) as HTMLVideoElement | null;
    videoRef.current = el;
    if (!el) return;

    const sync = () => setPlaying(!el.paused);
    el.addEventListener("play", sync);
    el.addEventListener("pause", sync);
    el.addEventListener("ended", sync);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) el.pause();

    return () => {
      el.removeEventListener("play", sync);
      el.removeEventListener("pause", sync);
      el.removeEventListener("ended", sync);
    };
  }, []);

  const toggle = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  }, []);

  return (
    <div className="video-controls">
      <p className="video-controls__caption">
        <span lang="mr" className="font-display-deva">
          पाइथन
        </span>
        <span className="video-controls__coords tabular-nums">19.19&deg;N 75.75&deg;E</span>
      </p>

      <button
        type="button"
        onClick={toggle}
        className="video-controls__toggle"
        aria-label={playing ? t("pauseBg") : t("playBg")}
      >
        <span className="video-controls__glyph" aria-hidden="true">
          {playing ? "❙❙" : "▶"}
        </span>
        <span className="video-controls__label">{playing ? t("pause") : t("play")}</span>
      </button>
    </div>
  );
}

