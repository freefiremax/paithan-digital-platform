/**
 * RAG Helper functions for Paithan Digital Platform
 * Handles chunking, similarity retrieval via pgvector, and prompt building
 */

export interface RetrievedChunk {
  id: string;
  sourceType: string;
  sourceId: string;
  content: string;
  similarity: number;
}

export function chunkText(text: string, maxTokens = 400): string[] {
  // Simple paragraph and sentence aware chunker
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    if ((currentChunk + "\n\n" + para).length > maxTokens * 4) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = para;
    } else {
      currentChunk = currentChunk ? `${currentChunk}\n\n${para}` : para;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
