"use client";

import { useLocale } from "next-intl";
import { RepresentativeProfile } from "@/components/representatives/RepresentativeProfile";
import { electedRepresentatives } from "@/lib/mock-data";

const mla = electedRepresentatives.find((r) => r.id === "rep-mla")!;

export default function MlaPage() {
  const locale = useLocale();
  const eyebrow =
    locale === "mr"
      ? "विधानसभा प्रतिनिधी"
      : locale === "hi"
        ? "विधानसभा प्रतिनिधि"
        : "Legislative Assembly Representative";

  return (
    <RepresentativeProfile
      rep={mla}
      portraitSrc="/images/mla-vilas-bhumre.jpeg"
      crumb="MLA — Paithan"
      eyebrow={eyebrow}
    />
  );
}
