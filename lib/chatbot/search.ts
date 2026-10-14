import snapshot from "@/lib/generated/chatbot-index.json";
import { queryKnowledgeBase, type RetrievedChunk } from "@/lib/rag";
import { safeSourceUrl, type KnowledgeLanguage, type KnowledgeSource } from "./knowledge-types";
import { getPublicKnowledge } from "./public-data";
import { rankSources } from "./retrieval";
import { prisma } from "@/lib/db";
import { cosineSimilarity, embedText } from "./embeddings";

export async function searchKnowledge(query: string, language: KnowledgeLanguage): Promise<RetrievedChunk[]> {
  if (/\b(?:google|alphabet|python|javascript|photosynthesis|quantum|bitcoin|cricket|football)\b|\d\s*[+*/=]\s*\d/i.test(query) && !/\b(?:paithan|website|portal|municipal|service|ward)\b|पैठण/i.test(query)) return [];
  const dynamic = await getPublicKnowledge();
  const ranked = rankSources(query, language, [...dynamic, ...snapshot.sources as KnowledgeSource[]]);
  const semantic: KnowledgeSource[] = [];
  if (process.env.CHATBOT_SEMANTIC_SEARCH === "true") {
    try {
      const [vector, rows] = await Promise.all([
        embedText(query, "RETRIEVAL_QUERY"),
        prisma.chatbotChunk.findMany({ where: { sourceType: "PUBLIC_WEBSITE_V1" }, take: 500, select: { content: true } }),
      ]);
      if (vector) {
        const validHashes = new Set([...snapshot.sources, ...dynamic].map((source) => source.hash));
        const candidates = rows.flatMap((row) => {
          try {
            const source = JSON.parse(row.content) as KnowledgeSource;
            if (!validHashes.has(source.hash) || !safeSourceUrl(source.url) || !Array.isArray(source.embedding)) return [];
            const similarity = cosineSimilarity(vector, source.embedding);
            return similarity >= 0.7 ? [{ source, similarity }] : [];
          } catch { return []; }
        }).sort((a, b) => b.similarity - a.similarity);
        semantic.push(...candidates.slice(0, 3).map((item) => item.source));
      }
    } catch { /* Lexical retrieval remains available if optional vectors fail. */ }
  }
  const legacy = queryKnowledgeBase(query, 3);
  const chunks: RetrievedChunk[] = ranked.map((source) => ({ id: source.id, sourceType: source.sourceType, sourceTitle: source.title, sourceUrl: source.url, content: `Source status: ${source.reliability}; indexed file/data timestamp: ${source.updatedAt} (not an official publication date). Website claims are not independently verified.\n${source.content}`, updatedAt: source.updatedAt, reliability: source.reliability, score: source.score }));
  // Existing focused civic answers remain available during the migration.
  const semanticChunks: RetrievedChunk[] = semantic.map((source) => ({ id: source.id, sourceType: source.sourceType, sourceTitle: source.title, sourceUrl: source.url, content: source.content, updatedAt: source.updatedAt, reliability: source.reliability, score: 1 }));
  const result = [...chunks.filter((chunk) => chunk.sourceType === "database"), ...legacy.slice(0, 2), ...chunks.filter((chunk) => chunk.sourceType !== "database").slice(0, semanticChunks.length ? 3 : 5), ...semanticChunks].filter((chunk) => safeSourceUrl(chunk.sourceUrl));
  const seen = new Set<string>();
  return result.filter((chunk) => { const key = chunk.id; if (seen.has(key)) return false; seen.add(key); return true; }).slice(0, 6);
}
