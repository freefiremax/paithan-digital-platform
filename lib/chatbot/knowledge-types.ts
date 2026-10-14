export type KnowledgeLanguage = "en" | "mr" | "hi";
export interface KnowledgeSource {
  id: string;
  title: string;
  url: string;
  language: KnowledgeLanguage;
  category: string;
  sourceType: "page" | "public-data" | "document" | "database";
  reliability: "website" | "verified";
  updatedAt: string;
  content: string;
  hash: string;
  embedding?: number[];
}
export interface KnowledgeIndex {
  version: 1;
  generatedAt: string;
  sources: KnowledgeSource[];
  report: { discovered: number; indexed: number; updated: number; unchanged: number; removed: number; skipped: string[]; failed: string[] };
}

export function safeSourceUrl(value: string): boolean {
  if (/^\/(?!\/)[\w\-/.%]*(?:#[\w-]+)?$/.test(value)) {
    return !value.includes("..") && !/(?:^|\/)(?:admin|login|register|api)(?:\/|$)/.test(value);
  }
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}

export function chunkText(text: string, size = 1200): string[] {
  const lines = text.replace(/\r/g, "").split(/\n+/).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";
  for (const line of [...new Set(lines)]) {
    // Long paragraphs split on word boundaries instead of losing their tail.
    const parts = line.match(new RegExp(`.{1,${size}}(?:\\s|$)|\\S{1,${size}}`, "gu")) || [line];
    for (const part of parts) {
      if (current.length + part.length > size && current) { chunks.push(current.trim()); current = ""; }
      current += `${part.trim()}\n`;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
