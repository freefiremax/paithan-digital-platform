import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { Role } from "@prisma/client";
import { handleApiError } from "@/lib/errors";
import { indexStatus } from "@/lib/chatbot/retrieval";
import { persistPublicKnowledge, publicDataHealth } from "@/lib/chatbot/public-data";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { generateChatbotAnswer } from "@/lib/gemini";
import { rankSources } from "@/lib/chatbot/retrieval";
import { chatbotSettings } from "@/lib/chatbot/settings";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  try {
    await requireAuth(Role.ADMIN);
    return NextResponse.json({ ...indexStatus(), publicDataHealth, providerConfigured: Boolean(process.env.GEMINI_API_KEY), settings: chatbotSettings(), semanticEnabled: process.env.CHATBOT_SEMANTIC_SEARCH === "true", liveSearchConfigured: false }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth(Role.ADMIN);
    if (!req.headers.get("origin") || req.headers.get("origin") !== req.nextUrl.origin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    const limit = await checkRateLimit(`knowledge-refresh:${user.id}`, RATE_LIMIT_CONFIGS.auth);
    if (limit && !limit.success) return NextResponse.json({ error: "Wait before refreshing again" }, { status: 429 });
    const payload = await req.json().catch(() => null);
    if (!payload || typeof payload !== "object" || Array.isArray(payload) || !["health", "evaluate", "refresh"].includes(payload.action)) return NextResponse.json({ error: "Choose a valid knowledge operation" }, { status: 400 });
    if (payload.action === "health") {
      const result = await generateChatbotAnswer({ query: "What is 2 + 2?", language: "en", history: [], contextText: "", isLocalQuestion: false });
      return NextResponse.json({ available: Boolean(result), model: result?.model || null });
    }
    if (payload.action === "evaluate") {
      const cases = [
        ["cluture of paithan", "/heritage/cultural-heritage"],
        ["Subhash Nagar", "/nagar-parishad/ward-map/10"],
        ["privacy information", "/policies/privacy"],
      ];
      return NextResponse.json({ results: cases.map(([query, url]) => ({ query, passed: rankSources(query, "en").some((source) => source.url === url) })) });
    }
    if (process.env.CHATBOT_SEMANTIC_SEARCH === "true") return NextResponse.json({ error: "Embedding ingestion requires the CLI workflow; use lexical refresh in the serverless endpoint." }, { status: 409 });
    return NextResponse.json(await persistPublicKnowledge(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return handleApiError(error); }
}
