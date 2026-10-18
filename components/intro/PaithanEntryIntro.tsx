"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { councilProfile } from "@/lib/mock-data";

/*
 * The first-entry wordmark sequence.
 *
 * Names for the town — set in every script a Paithan resident reads — take
 * their turn one title card at a time: each appears at its own scattered spot,
 * drifting forward out of soft focus, holding for a beat at full clarity,
 * then easing away as the next arrives elsewhere on the frame. The pacing is a
 * title sequence, not a swarm — a handful of names on screen at once, never
 * crowding each other. Each name owns its own little lens, which is why it
 * grows where it is planted instead of being dragged toward a shared vanishing
 * point.
 *
 * It plays on every full page load (every refresh). The module-level
 * `playedThisLoad` guard stops it re-running when a person navigates between
 * in-app routes, because those are soft navigations that remount this layout
 * without reloading the page — the intro is for arriving, not for clicking
 * around inside the site.
 *
 * WCAG 2.2.2 applies to any motion past five seconds, so there are two escapes:
 * `prefers-reduced-motion` drops the travel and the names simply sit sharp in
 * the field, and a visible Skip control dismisses the overlay immediately.
 *
 * Timing lives in these constants and is handed to CSS as custom properties, so
 * the keyframes and the JS dismissal timer cannot drift apart.
 */

/**
 * One page load, one play. This is module scope on purpose: it survives the
 * layout unmounting and remounting during client-side navigation, but is reset
 * by any real reload, which is exactly the boundary we want.
 */
let playedThisLoad = false;

/**
 * When the one play began. A remount mid-sequence — a dev double-mount, or a
 * soft navigation landing while the overlay is still up — rejoins the play
 * already running rather than dropping it, and its timers use what is left
 * instead of starting four fresh seconds.
 */
let introStartedAt = 0;

/** Locks page scroll while the overlay covers the viewport. */
const LOCK_FLAG = "paithan-intro-locked";

/* The whole screen time is fixed; this is how long an individual name lives. */
const FLY_MS = 3400;        // each word lifecycle: arrive→fly out
/* Gap between one name launching and the next. */
const STAGGER_MS = 70;       // tighter launch chain
/* Pre-roll so the frame is already alive on the very first frame. */
const PRE_ROLL_MS = 300;     // faster pre-roll
const LEAVE_MS = 900;        // single overlay fade shorter
/** Whole screen time, closing fade included. */
const TOTAL_MS = 5200;       // overall shorter run
const REDUCED_HOLD_MS = 2000;

type ScriptKind =
  | "latin"
  | "deva"
  | "deva-noto"
  | "deva-mangal"
  | "deva-kokila"
  | "gu"
  | "kn"
  | "ta"
  | "te"
  | "bn"
  | "ur"
  | "ml"
  | "pa"
  | "or";

const GLYPHS: ReadonlyArray<{
  text: string;
  script: ScriptKind;
  lang: string;
  rtl?: boolean;
}> = [
  { text: "Paithan", script: "latin", lang: "en" },
  { text: "पैठण", script: "deva", lang: "mr" },
  { text: "પૈઠણ", script: "gu", lang: "gu" },
  { text: "ಪೈಥಾಣ್", script: "kn", lang: "kn" },
  { text: "பைத்தான்", script: "ta", lang: "ta" },
  { text: "పైథాన్", script: "te", lang: "te" },
  { text: "পৈথান", script: "bn", lang: "bn" },
  { text: "پیتھن", script: "ur", lang: "ur", rtl: true },
  { text: "प्रतिष्ठान", script: "deva", lang: "sa" },
  { text: "पैठण", script: "deva-noto", lang: "hi" },
  { text: "पैठण", script: "deva-mangal", lang: "hi" },
  { text: "पैठण", script: "deva-kokila", lang: "hi" },
  { text: "प्रतिष्ठान", script: "deva-noto", lang: "sa" },
  { text: "पैठण", script: "deva", lang: "ne" },
  { text: "പൈത്താൻ", script: "ml", lang: "ml" },
  { text: "ਪੈਥਾਨ", script: "pa", lang: "pa" },
  { text: "ପୈଥାନ", script: "or", lang: "or" },
  { text: "পৈথান", script: "bn", lang: "as" },
  { text: "पैंठण", script: "deva-mangal", lang: "mr" },
  { text: "पैठाण", script: "deva", lang: "mr" },
  { text: "Paiṭhaṇ", script: "latin", lang: "en" },
  { text: "Paithana", script: "latin", lang: "en" },
  { text: "ಪೈಥಣ", script: "kn", lang: "kn" },
  { text: "పైథణ", script: "te", lang: "te" },
  { text: "پَیتھن", script: "ur", lang: "ur", rtl: true },
  { text: "ପୈଥଣ", script: "or", lang: "or" },
];

/*
 * Every name flies exactly once plus a couple of repeats, woven so no two
 * Devanagari names launch back to back: the field stays mixed start to finish.
 */
const SWARM_ORDER = [
  0, 1, 2, 8, 10, 13, 3, 9, 11, 4, 14, 5, 15, 12, 6, 17, 16, 7, 10, 3,
  18, 20, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29,
];

const COUNT = 36;

/*
 * Scattered, not arranged. The spots are drawn once from a fixed seed with
 * rejection sampling — a name may land anywhere, as long as it keeps clear of
 * the names already placed — so the frame reads as loosened and random while
 * still never letting two names collide. The fixed seed means server and
 * client draw the same layout, so there is no hydration mismatch and no
 * reshuffle between loads.
 */
const SPAN_X = 56; // vw
const SPAN_Y = 40; // vh
const GAP_X = 14; // vw of minimum clearance between two names
const GAP_Y = 8;  // vh

function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WORDS = (() => {
  const rand = mulberry32(0x5ead);
  const taken: { x: number; y: number }[] = [];
  return Array.from({ length: COUNT }, (_, i) => {
    let x = 0;
    let y = 0;
    for (let attempt = 0; attempt < 200; attempt++) {
      x = (rand() * 2 - 1) * SPAN_X;
      y = (rand() * 2 - 1) * SPAN_Y;
      if (taken.every((p) => Math.abs(p.x - x) > GAP_X || Math.abs(p.y - y) > GAP_Y)) {
        break;
      }
    }
    taken.push({ x, y });
    return {
      ...GLYPHS[SWARM_ORDER[i % SWARM_ORDER.length]],
      x: `${x.toFixed(2)}vw`,
      y: `${y.toFixed(2)}vh`,
      // A touch of size and clock variance, so the run never looks ruled.
      // Roughly one name in five is drawn much smaller — a whisper set deep in
      // the scatter — so the field keeps a real size spread instead of one
      // flat weight.
      scale: (
        rand() < 0.5 ? 0.07 + rand() * 0.15 : 0.48 + rand() * 0.52
      ).toFixed(3),
      jitterMs: Math.round((rand() - 0.5) * 320),
    };
  });
})();

type Phase = "show" | "leaving" | "done";

export function PaithanEntryIntro() {
  const t = useTranslations("common");
  // Lazy initialiser: on a fresh load (SSR and first client render) it is
  // "show", so server and client agree and there is no hydration mismatch. A
  // remount sees the guard already set — if the play is still within its four
  // seconds it rejoins it, and once it has finished it starts finished, so the
  // overlay never appears twice for the same load.
  const [phase, setPhase] = useState<Phase>(() => {
    if (!playedThisLoad) return "show";
    return introStartedAt && performance.now() - introStartedAt < TOTAL_MS
      ? "show"
      : "done";
  });
  const skippedAtMount = useRef(phase === "done");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (skippedAtMount.current) return;

    playedThisLoad = true;
    if (!introStartedAt) introStartedAt = performance.now();
    document.documentElement.classList.add(LOCK_FLAG);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The fade starts while the last names are still flying, so the screen is
    // never left empty — the overlay dissolves the ending instead of holding on
    // a blank field.
    const hold = reduced ? REDUCED_HOLD_MS : TOTAL_MS - LEAVE_MS;
    const elapsed = Math.max(0, performance.now() - introStartedAt);
    const leaveAt = Math.max(0, hold - elapsed);

    const t1 = window.setTimeout(() => setPhase("leaving"), leaveAt);
    const t2 = window.setTimeout(() => {
      document.documentElement.classList.remove(LOCK_FLAG);
      setPhase("done");
    }, leaveAt + LEAVE_MS);
    timers.current = [t1, t2];

    return () => {
      timers.current.forEach((id) => clearTimeout(id));
      document.documentElement.classList.remove(LOCK_FLAG);
    };
  }, []);

  const dismiss = () => {
    timers.current.forEach((id) => clearTimeout(id));
    document.documentElement.classList.remove(LOCK_FLAG);
    setPhase("leaving");
    window.setTimeout(() => setPhase("done"), LEAVE_MS);
  };

  if (phase === "done") return null;

  return (
    <div
      className={`paithan-intro${phase === "leaving" ? " paithan-intro--leaving" : ""}`}
      role="region"
      aria-label={councilProfile.nameEn}
      style={
        {
          "--paithan-fly-ms": `${FLY_MS}ms`,
          "--paithan-stagger-ms": `${STAGGER_MS}ms`,
          "--paithan-preroll-ms": `${PRE_ROLL_MS}ms`,
          "--paithan-leave-ms": `${LEAVE_MS}ms`,
        } as React.CSSProperties
      }
    >
      {/* Torn-edge ink filter: roughens each glyph's outline so the names read
          as letterpress pressed into rag paper rather than screen type. */}
      <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
        <filter id="paithan-torn">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="2"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="2.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div
        className="paithan-intro__frame paithan-intro__frame--top paithani-band"
        aria-hidden="true"
      />

      <div className="paithan-intro__stage">
        <div className="paithan-intro__words" aria-hidden="true">
          {WORDS.map((word, index) => (
            <span
              key={`${word.text}-${index}`}
              className="paithan-intro__word"
              style={
                {
                  "--fly-index": index,
                  "--fx": word.x,
                  "--fy": word.y,
                  "--scale": word.scale,
                  "--fly-jitter": `${word.jitterMs}ms`,
                } as React.CSSProperties
              }
            >
              <span
                className={`paithan-intro__glyph is-${word.script}`}
                lang={word.lang}
                dir={word.rtl ? "rtl" : undefined}
              >
                {word.text}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div
        className="paithan-intro__frame paithan-intro__frame--bottom paithani-band"
        aria-hidden="true"
      />

      <button type="button" className="paithan-intro__skip" onClick={dismiss}>
        {t("skipIntro")}
      </button>
    </div>
  );
}
