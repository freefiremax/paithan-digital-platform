"use client";

import { useLocale } from "next-intl";
import { RepresentativeProfile } from "@/components/representatives/RepresentativeProfile";
import { electedRepresentatives } from "@/lib/mock-data";

const mp = electedRepresentatives.find((r) => r.id === "rep-mp")!;

export default function MpPage() {
  const locale = useLocale();
  const eyebrow =
    locale === "mr"
      ? "लोकसभा प्रतिनिधी"
      : locale === "hi"
        ? "लोकसभा प्रतिनिधि"
        : "Parliamentary Representative";

  return (
    <RepresentativeProfile
      rep={mp}
      portraitSrc="/images/mp-sandipan-bhumre.jpeg"
      crumb="MP — Lok Sabha"
      eyebrow={eyebrow}
    />
  );
}
