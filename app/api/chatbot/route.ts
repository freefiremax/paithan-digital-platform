import { NextRequest, NextResponse } from "next/server";
import { buildChatbotContext, queryKnowledgeBase } from "@/lib/rag";
import {
  generateChatbotAnswer,
  normalizeAnswer,
  sanitizeChatHistory,
  type ChatLanguage,
} from "@/lib/gemini";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

export const runtime = "nodejs";
const MAX_QUERY_LENGTH = 2_000;

function deterministicReply(query: string, language: ChatLanguage): string | null {
  const normalized = query.toLowerCase().trim();
  if (/(system\s+prompt|api\s*key|database_url|env\s*var|password_hash|auth_secret|ignore\s+(all\s+)?previous)/i.test(normalized)) {
    return language === "mr"
      ? "मी अंतर्गत सूचना किंवा गोपनीय माहिती देऊ शकत नाही. मात्र तुमच्या प्रश्नाच्या विषयावर मदत करू शकतो."
      : language === "hi"
        ? "मैं आंतरिक निर्देश या गोपनीय जानकारी साझा नहीं कर सकता, लेकिन विषय से जुड़े प्रश्न में मदद कर सकता हूँ।"
        : "I can’t share internal instructions or confidential information, but I can help with a question about the topic.";
  }

  if (/^(hi+|hey+|hello|namaste|namaskar|ram\s*krishna\s*hari|नमस्कार|नमस्ते|प्रणाम|राम\s*कृष्ण\s*हरी)[\s!.]*$/i.test(normalized)) {
    return language === "mr"
      ? "राम कृष्ण हरी! नमस्कार! मी पैठण डिजिटल प्लॅटफॉर्मचा AI सहाय्यक आहे. नागरी सेवा, पर्यटन, इतिहास किंवा सामान्य प्रश्नांमध्ये मी मदत करू शकतो."
      : language === "hi"
        ? "नमस्ते! मैं पैठण डिजिटल प्लेटफॉर्म का AI सहायक हूँ। नागरिक सेवाओं, पर्यटन, इतिहास या सामान्य प्रश्नों में मदद कर सकता हूँ।"
        : "Hello! I’m the Paithan Digital Platform AI assistant. I can help with civic services, tourism, history, and general questions.";
  }

  if (/(who\s+are\s+you|what\s+can\s+you\s+do|what\s+is\s+your\s+name|तू\s+कोण|तुम्ही\s+काय\s+करू|तुम\s+कौन|आप\s+क्या\s+कर)/i.test(normalized)) {
    return language === "mr"
      ? "मी पैठण डिजिटल प्लॅटफॉर्मचा AI Citizen Assistant आहे. पैठणच्या सत्यापित स्थानिक माहितीसह नागरी सेवा, पर्यटन, वारसा आणि सामान्य प्रश्नांमध्ये मदत करू शकतो."
      : language === "hi"
        ? "मैं पैठण डिजिटल प्लेटफॉर्म का AI Citizen Assistant हूँ। सत्यापित स्थानीय जानकारी के साथ नागरिक सेवाओं, पर्यटन, विरासत और सामान्य प्रश्नों में मदद कर सकता हूँ।"
        : "I’m the Paithan Digital Platform AI Citizen Assistant. I can help with verified local information, civic services, tourism, heritage, and general questions.";
  }

  return null;
}

function localFallback(language: ChatLanguage, contextText: string, hasLocalContext: boolean): string {
  if (hasLocalContext) {
    const compactContext = contextText
      .replace(/^\[Source[^\n]*\]\n/gm, "")
      .replace(/\n---\n/g, "\n")
      .split("\n")
      .filter((line) => line.trim())
      .slice(0, 6)
      .join("\n");
    return normalizeAnswer(compactContext, 900);
  }

  return language === "mr"
    ? "सध्या AI सेवा उपलब्ध नाही, त्यामुळे या सामान्य प्रश्नाचे विश्वसनीय उत्तर देता येत नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
    : language === "hi"
      ? "AI सेवा अभी उपलब्ध नहीं है, इसलिए इस सामान्य प्रश्न का विश्वसनीय उत्तर नहीं दिया जा सकता। कृपया थोड़ी देर बाद फिर प्रयास करें।"
      : "The AI service is temporarily unavailable, so I can’t answer this general question reliably right now. Please try again shortly.";
}

export async function POST(req: NextRequest) {
  let language: ChatLanguage = "en";
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const rawQuery = typeof body.message === "string" ? body.message : typeof body.query === "string" ? body.query : "";
    const query = rawQuery.trim();
    language = body.language === "mr" ? "mr" : body.language === "hi" ? "hi" : "en";

    if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });
    if (query.length > MAX_QUERY_LENGTH) {
      return NextResponse.json(
        { error: "Query is too long", reply: "Please shorten your question to 2,000 characters or fewer." },
        { status: 400 }
      );
    }

    const immediateReply = deterministicReply(query, language);
    if (immediateReply) {
      return NextResponse.json({
        reply: immediateReply,
        sources: [],
        grounded: false,
        engine: "local-reliable",
      });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    try {
      const rateLimit = await checkRateLimit(`chatbot:${ip}`, RATE_LIMIT_CONFIGS.apiRead);
      if (rateLimit && !rateLimit.success) {
        return NextResponse.json(
          { error: { code: "RATE_LIMITED", message: "Too many chatbot requests. Please wait a moment." }, reply: "Too many requests were sent. Please wait a moment and try again." },
          { status: 429 }
        );
      }
    } catch (rateLimitError) {
      console.error("[chatbot] Rate-limit service unavailable; continuing with model safeguards.", rateLimitError);
    }

    const history = sanitizeChatHistory(body.history);
    let contextText = "No verified Paithan record was retrieved for this question.";
    let sources: Array<{ title: string; url: string }> = [];
    let hasLocalContext = false;
    try {
      const context = buildChatbotContext(query);
      contextText = context.contextText;
      sources = context.sources;
      hasLocalContext = queryKnowledgeBase(query, 4).some((item) => item.score >= 15);
    } catch (retrievalError) {
      console.error("[chatbot] Local knowledge retrieval failed; continuing without local context.", retrievalError);
    }

    const generated = await generateChatbotAnswer({ query, language, history, contextText, isLocalQuestion: hasLocalContext });
    const reply = generated?.answer || localFallback(language, contextText, hasLocalContext);

    return NextResponse.json({
      reply,
      sources: hasLocalContext ? sources : [],
      grounded: hasLocalContext,
      engine: generated?.model || "local-fallback",
    });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      {
        error: { code: "CHATBOT_ERROR", message: "The assistant could not process this request." },
        reply: language === "mr"
          ? "विनंतीवर प्रक्रिया करता आली नाही. कृपया पुन्हा प्रयत्न करा."
          : language === "hi"
            ? "अनुरोध पूरा नहीं हो सका। कृपया फिर प्रयास करें।"
            : "I couldn’t process that request. Please try again.",
        sources: [],
      },
      { status: 500 }
    );
  }
}
