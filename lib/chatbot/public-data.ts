import { prisma } from "@/lib/db";
import { createHash } from "node:crypto";
import { chunkText, type KnowledgeSource } from "./knowledge-types";
import { embedText } from "./embeddings";
import snapshot from "@/lib/generated/chatbot-index.json";

let cache: KnowledgeSource[] = [];
let expires = 0;
let active: Promise<KnowledgeSource[]> | null = null;
export const publicDataHealth = { lastRefresh: null as string | null, unavailable: false, records: 0 };

function recordsToSources(records: unknown[], category: string, url: string): KnowledgeSource[] {
  return records.flatMap((value) => {
    const record = value as Record<string, unknown>;
    const content = Object.entries(record).filter(([key]) => !["id", "updatedAt"].includes(key)).map(([key, item]) => `${key}: ${typeof item === "object" ? JSON.stringify(item) : item}`).join("\n");
    return chunkText(content).map((chunk, i) => ({
      id: `db-${category}-${record.id}-${i}`, title: String(record.title || record.titleEn || record.nameEn || category),
      url, content: chunk, category, sourceType: "database" as const, reliability: "verified" as const, language: "en" as const,
      updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : new Date().toISOString(),
      hash: createHash("sha256").update(chunk).digest("hex"),
    }));
  });
}

/** Explicit public-field selects. No user, grievance, audit, auth or session data. */
async function loadPublicData(): Promise<KnowledgeSource[]> {
  if (!process.env.DATABASE_URL || process.env.NODE_ENV === "test") return [];
  const [sectors, facilities, works, notices] = await Promise.all([
    prisma.civicSectorInfo.findMany({ where: { dataStatus: "VERIFIED" }, take: 30, select: { id: true, sector: true, titleEn: true, titleMr: true, overviewEn: true, overviewMr: true, department: true, updatedAt: true } }),
    prisma.facility.findMany({ where: { dataStatus: "VERIFIED", isOperational: true }, take: 150, select: { id: true, sector: true, nameEn: true, nameMr: true, address: true, type: true, updatedAt: true } }),
    prisma.developmentWork.findMany({ where: { dataStatus: "VERIFIED" }, take: 150, select: { id: true, title: true, titleMr: true, description: true, descriptionMr: true, department: true, status: true, progressPct: true, updatedAt: true } }),
    prisma.notification.findMany({ where: { publishedAt: { lte: new Date() }, category: { not: "TENDER" } }, take: 100, orderBy: { publishedAt: "desc" }, select: { id: true, title: true, titleMr: true, body: true, bodyMr: true, category: true, publishedAt: true, updatedAt: true } }),
  ]);
  return [...recordsToSources(sectors, "services", "/services"), ...recordsToSources(facilities, "facilities", "/services"), ...recordsToSources(works, "works", "/nagar-parishad/development-works"), ...recordsToSources(notices, "notices", "/nagar-parishad/notifications")];
}

export async function getPublicKnowledge(force = false): Promise<KnowledgeSource[]> {
  if (!force && Date.now() < expires) return cache;
  if (!active) {
    active = loadPublicData().then((sources) => {
      cache = sources; expires = Date.now() + 60_000;
      Object.assign(publicDataHealth, { lastRefresh: new Date().toISOString(), unavailable: false, records: sources.length });
      return sources;
    }).catch(() => {
      publicDataHealth.unavailable = true; expires = Date.now() + 15_000;
      return []; // Never serve old official records as current when refresh fails.
    }).finally(() => { active = null; });
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([active, new Promise<KnowledgeSource[]>((resolve) => { timer = setTimeout(() => { publicDataHealth.unavailable = true; resolve([]); }, 2500); })]);
  } finally { clearTimeout(timer); }
}

/** Protected admin refresh replaces only this integration's own rows. */
export async function persistPublicKnowledge() {
  const sources = [...snapshot.sources as KnowledgeSource[], ...await getPublicKnowledge(true)];
  const previous = await prisma.chatbotChunk.findMany({ where: { sourceType: "PUBLIC_WEBSITE_V1" }, select: { sourceId: true, content: true } });
  const old = new Map<string, KnowledgeSource>();
  for (const row of previous) { try { old.set(row.sourceId, JSON.parse(row.content)); } catch { /* invalid prior row is replaced */ } }
  let embedded = 0;
  for (const source of sources) {
    if (embedded >= 8) break; // Keep each CLI refresh bounded; repeat to complete embeddings.
    const prior = old.get(source.id);
    if (prior?.hash === source.hash && prior.embedding) source.embedding = prior.embedding;
    else if (process.env.CHATBOT_SEMANTIC_SEARCH === "true") {
      const vector = await embedText(source.content, "RETRIEVAL_DOCUMENT");
      if (vector) { source.embedding = vector; embedded++; }
    }
  }
  // A failed DB read must not wipe the existing dynamic index.
  if (publicDataHealth.unavailable) throw new Error("Public knowledge refresh unavailable");
  await prisma.$transaction(async (tx) => {
    await tx.chatbotChunk.deleteMany({ where: { sourceType: "PUBLIC_WEBSITE_V1" } });
    await tx.chatbotChunk.createMany({ data: sources.map((source) => ({ sourceType: "PUBLIC_WEBSITE_V1", sourceId: source.id, content: JSON.stringify(source) })) });
  }, { timeout: 20_000 });
  return { indexed: sources.length, updated: sources.filter((source) => old.get(source.id)?.hash !== source.hash).length, removed: previous.filter((row) => !sources.some((source) => source.id === row.sourceId)).length, embedded };
}
