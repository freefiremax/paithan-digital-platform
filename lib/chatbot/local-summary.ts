import type { ChatLanguage } from "@/lib/gemini";
import type { RetrievedChunk } from "@/lib/rag";
import { searchTokens } from "./retrieval";

/** Culture overview is grounded in the cultural-heritage page, without its disputed dates/counts. */
export function cultureOverview(query: string, language: ChatLanguage, evidence: RetrievedChunk[]) {
  const tokens = searchTokens(query);
  if (!tokens.includes("culture") || !tokens.includes("paithan") || !evidence.some((source) => source.sourceUrl === "/heritage/cultural-heritage")) return null;
  if (/\b(?:fees?|dates?|deadline|price|when)\b|शुल्क|तारीख/i.test(query)) return null;
  return language === "mr"
    ? "पैठणच्या संस्कृतीत भक्ती, साहित्य आणि हस्तकलेचा समृद्ध वारसा आहे.\n\n- संत एकनाथ आणि वारकरी परंपरा: अभंग, भारुड, भजन आणि कीर्तन.\n- नाथ षष्ठी: संत एकनाथांच्या स्मृतीशी संबंधित यात्रा आणि धार्मिक परंपरा.\n- पैठणी: रेशीम आणि जरीच्या हातमाग विणकामासाठी प्रसिद्ध परंपरा.\n\nतुम्हाला सण, संत एकनाथ की पैठणी विणकाम याबद्दल अधिक जाणून घ्यायचे आहे?"
    : language === "hi"
      ? "पैठण की संस्कृति में भक्ति, साहित्य और हस्तशिल्प का समृद्ध इतिहास है।\n\n- संत एकनाथ और वारकरी परंपरा: अभंग, भारुड, भजन और कीर्तन।\n- नाथ षष्ठी: संत एकनाथ की स्मृति से जुड़ी यात्रा और धार्मिक परंपराएँ।\n- पैठणी: रेशम और ज़री के पारंपरिक हथकरघा वस्त्र।\n\nआप त्योहारों, संत एकनाथ या पैठणी बुनाई के बारे में अधिक जानना चाहेंगे?"
      : "Paithan’s culture brings together devotional traditions, Marathi literature and handloom craftsmanship.\n\n- Sant Eknath and the Varkari tradition: abhangs, bharuds, bhajans and kirtans.\n- Nath Shashti: pilgrimage traditions associated with Sant Eknath’s memory.\n- Paithani weaving: traditional silk textiles with zari and distinctive motifs.\n\nWould you like to explore its festivals, Sant Eknath, or Paithani weaving?";
}

export function extractRelevantSummary(query: string, chunks: RetrievedChunk[]): string {
  const tokens = searchTokens(query).filter((token) => token !== "paithan");
  const lines = chunks.flatMap((chunk) => chunk.content.split(/\n|(?<=[.!।])\s+/u).map((line) => line.trim()).filter((line) => line.length > 30 && !line.startsWith("Source status:")));
  const ranked = [...new Set(lines)].map((line) => ({ line, score: searchTokens(line).filter((token) => tokens.includes(token)).length })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
  return ranked.slice(0, 3).map((item) => item.line).join("\n\n").slice(0, 1000);
}
