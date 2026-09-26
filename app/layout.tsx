import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Noto_Sans_Devanagari, Besley, Tiro_Devanagari_Hindi } from "next/font/google";
import { councilProfile } from "@/lib/mock-data";
import "./globals.css";

/*
 * Four faces, each with one job.
 *
 * The earlier note here ruled out a display serif because prd.md §9 reads a
 * heritage-brand microsite as a risk to an official municipal site. That rule
 * was written against a generic heritage-brand serif; the brief has since
 * changed to a hand-drawn, nostalgic, Marathi-flavoured identity, and it is the
 * council's call to make. So the serif comes back — but as an OLD-STYLE one.
 *
 * Besley is an old-style serif, which is the letterform of a printed gazette
 * rather than of a fashion brand. Inter still sets all body and UI copy, because
 * a handwriting face at 14px would cost the legibility a tax or ward notice has
 * to have. Tiro Devanagari Hindi sets the Marathi display strings in a
 * traditional manuscript face rather than a UI sans, which is where the Marathi
 * character actually lands — and it ships at weight 400 only, so weight has to
 * come from size and colour rather than from a second file.
 *
 * Nostalgia is carried by the frame — ornament, ground, rules — not by making
 * the body text hard to read.
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

const besley = Besley({
  subsets: ["latin"],
  variable: "--font-besley",
  display: "swap",
});

const tiroDevanagari = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  variable: "--font-tiro",
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
    <html
      lang="en"
      className={`${inter.variable} ${notoSansDevanagari.variable} ${besley.variable} ${tiroDevanagari.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
