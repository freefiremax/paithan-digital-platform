"use client";

import { useEffect, useState } from "react";

/**
 * PaithanMapEmbed
 * Renders the stylized interactive "Find your place on the map" experience
 * (map -> per-place dashboards -> government portals strip) served as a
 * self-contained page at /paithan-map-embed.html in public/. Embedded via an
 * iframe so its bespoke styling/animations stay identical and never collide
 * with the site's Tailwind globals. The embed reports its own content height
 * via postMessage and we size the iframe to match (no inner scrollbar).
 */
export default function PaithanMapEmbed() {
  const [height, setHeight] = useState(1600);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data as { type?: string; height?: number } | null;
      if (
        data &&
        data.type === "paithan-embed-height" &&
        typeof data.height === "number" &&
        data.height > 200 &&
        data.height < 100000
      ) {
        setHeight(Math.ceil(data.height));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section
      aria-label="Interactive map of Paithan and connected government portals"
      className="border-t border-[var(--border-subtle)]"
    >
      <iframe
        src="/paithan-map-embed.html"
        title="Find your place on the map — Paithan interactive map and government portals"
        loading="lazy"
        scrolling="no"
        style={{
          width: "100%",
          height: `${height}px`,
          border: "0",
          display: "block",
        }}
      />
    </section>
  );
}