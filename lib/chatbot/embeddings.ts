/** Optional semantic search. Never enabled implicitly or sent to the browser. */
export async function embedText(text: string, taskType: "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT"): Promise<number[] | null> {
  const key = process.env.GEMINI_API_KEY;
  if (process.env.CHATBOT_SEMANTIC_SEARCH !== "true" || !key) return null;
  const model = process.env.GEMINI_EMBED_MODEL || "gemini-embedding-001";
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:embedContent`, {
      method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ model: `models/${model}`, content: { parts: [{ text: text.slice(0, 6000) }] }, taskType, outputDimensionality: 768 }),
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const data = await response.json() as { embedding?: { values?: number[] } };
    const values = data.embedding?.values;
    return values?.length === 768 && values.every(Number.isFinite) ? values : null;
  } catch { return null; }
}

export function cosineSimilarity(a: number[], b: number[]) {
  if (a.length !== b.length || !a.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] ** 2; nb += b[i] ** 2; }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}
