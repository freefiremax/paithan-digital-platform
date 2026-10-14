import snapshot from "@/lib/generated/chatbot-index.json";
import type { KnowledgeLanguage, KnowledgeSource } from "./knowledge-types";
import type { ChatHistoryItem } from "@/lib/gemini";

const STOP = new Set("a an the is are was were will would could can me my you your i do does how what when where who why which tell about please help know knwo of in at to for with and or it this that मला मला तुम्ही मला सांगा काय आहे मला मुझे क्या है आप बताओ mala sanga kay ahe aahe baddal mujhe kya hai batao kaise bhai".split(/\s+/));
const ALIASES: Record<string, string> = { cluture: "culture", culuture: "culture", cultural: "culture", संस्कृती: "culture", संस्कृति: "culture", sanskruti: "culture", sanskriti: "culture", sanskrutiबद्दल: "culture", jaikwadi: "jayakwadi", jaikawadi: "jayakwadi", bird: "birds", mandir: "temple", मंदिर: "temple", प्रभाग: "ward", wards: "ward", घरपट्टी: "property tax", पाणी: "water", तक्रार: "complaint", shikayat: "complaint", complaint: "grievance", complaints: "grievance", विणकाम: "weaving", पैठणी: "paithani", पैठण: "paithan", एकनाथ: "eknath", vada: "wada", वाडा: "wada" };

export function searchTokens(text: string): string[] {
  return [...new Set(text.toLowerCase().normalize("NFKC").split(/[^\p{L}\p{M}\p{N}]+/u).filter(Boolean).flatMap((token) => (ALIASES[token] || token).split(" ")).filter((token) => token.length > 1 && !STOP.has(token)))];
}

export function resolveConversationQuery(query: string, history: ChatHistoryItem[]): string {
  if (!/^(?:it\b|its\b|that place\b|tell me more\b|what (?:services|about)\b|how do i use\b|and\b|the (?:first|second|third)\b|त्याबद्दल|और|उसके)/i.test(query.trim())) return query;
  const previous = [...history].reverse().find((item) => item.role === "user" && !/^(?:and|tell me more|what about)\b/i.test(item.content));
  const lastAnswer = [...history].reverse().find((item) => item.role === "assistant");
  if (!previous) return query;
  const ordinal = /\b(first|second|third)\b/i.exec(query);
  if (ordinal && lastAnswer) {
    const list = lastAnswer.content.split("\n").filter((line) => /^\s*(?:\d+[.)]|[-*])\s+/.test(line));
    const selected = list[{ first: 0, second: 1, third: 2 }[ordinal[1].toLowerCase() as "first" | "second" | "third"]];
    if (selected) return `${selected.slice(0, 200)} ${query}`;
  }
  return `${previous.content.slice(0, 300)} ${query}`;
}

function similar(left: string, right: string) {
  if (left.length < 5 || Math.abs(left.length - right.length) > 1) return false;
  // One edit or an adjacent transposition; never fuzzy-match short names.
  if (left.length === right.length) {
    const mismatch = [...left].map((char, i) => char === right[i] ? -1 : i).filter((i) => i >= 0);
    return mismatch.length <= 1 || (mismatch.length === 2 && mismatch[1] === mismatch[0] + 1 && left[mismatch[0]] === right[mismatch[1]] && left[mismatch[1]] === right[mismatch[0]]);
  }
  const [short, long] = left.length < right.length ? [left, right] : [right, left];
  let i = 0, j = 0, skipped = 0;
  while (i < short.length && j < long.length) { if (short[i] === long[j]) { i++; j++; } else { j++; if (++skipped > 1) return false; } }
  return true;
}

export interface RankedSource extends KnowledgeSource { score: number }
const bundled = snapshot.sources as KnowledgeSource[];

/** Hybrid title, term-frequency, inverse-frequency, typo and language scoring. */
export function rankSources(query: string, language: KnowledgeLanguage, sources: KnowledgeSource[] = bundled, limit = 5): RankedSource[] {
  const tokens = searchTokens(query);
  if (!tokens.length) return [];
  const docs = sources.map((source) => ({ source, title: searchTokens(source.title), body: searchTokens(source.content) }));
  const frequency = new Map(tokens.map((token) => [token, docs.filter((doc) => doc.body.includes(token) || doc.title.includes(token)).length]));
  const scored = docs.map(({ source, title, body }) => {
    let score = 0, specificMatches = 0;
    for (const token of tokens) {
      const exact = body.includes(token) || title.includes(token);
      const fuzzy = !exact && body.some((word) => similar(token, word));
      if (!exact && !fuzzy) continue;
      if (token !== "paithan") specificMatches++;
      const idf = Math.log(1 + sources.length / (1 + (frequency.get(token) || 0)));
      score += idf * (title.includes(token) ? 3 : exact ? 1 : 0.5);
    }
    if (tokens.some((token) => token !== "paithan") && !specificMatches) score = 0;
    if (score > 0) {
      const ageDays = (Date.now() - Date.parse(source.updatedAt)) / 86_400_000;
      const freshness = source.reliability === "verified" && ageDays >= 0 && ageDays < 30 ? 0.2 : 0;
      score += (source.language === language ? 1.2 : 0) + (source.reliability === "verified" ? 0.5 : 0) + freshness;
    }
    return { ...source, score };
  }).filter((source) => source.score >= 2.5).sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const perUrl = new Map<string, number>();
  return scored.filter((source) => {
    const key = `${source.url}:${source.hash}`;
    if (seen.has(key) || (perUrl.get(source.url) || 0) >= 2) return false;
    seen.add(key); perUrl.set(source.url, (perUrl.get(source.url) || 0) + 1); return true;
  }).slice(0, limit);
}

export function indexStatus() {
  return { version: snapshot.version, generatedAt: snapshot.generatedAt, report: snapshot.report, sourceCount: bundled.length, sources: bundled.map(({ id, title, url, language, category, sourceType, updatedAt, reliability }) => ({ id, title, url, language, category, sourceType, updatedAt, reliability })) };
}
