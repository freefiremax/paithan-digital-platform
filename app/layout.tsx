import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { councilProfile } from "@/lib/mock-data";
import "./globals.css";

/*
 * One workhorse family for the whole platform. Personality comes from weight and tracking
 * discipline rather than a display face — a serif display would push an official municipal
 * site toward a heritage-brand microsite, which prd.md §9 explicitly rules out.
 * Noto Sans Devanagari is loaded only so the Marathi strings do not fall back to a
 * mismatched system face.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${councilProfile.shortNameEn} — Official Digital Platform`,
    template: `%s | ${councilProfile.shortNameEn}`,
  },
  description:
    "Official civic, heritage and tourism platform of Paithan Municipal Council, Chhatrapati Sambhajinagar district, Maharashtra.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansDevanagari.variable}`}>
      <body>{children}</body>
    </html>
  );
}
