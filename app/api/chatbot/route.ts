import { NextRequest, NextResponse } from "next/server";
import { queryKnowledgeBase, type RetrievedChunk } from "@/lib/rag";
import {
  generateChatbotAnswer,
  normalizeAnswer,
  sanitizeChatHistory,
  type ChatLanguage,
} from "@/lib/gemini";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { localityOverview } from "@/lib/chatbot-localities";

export const runtime = "nodejs";
const MAX_QUERY_LENGTH = 2_000;

function deterministicReply(query: string, language: ChatLanguage): string | null {
  const normalized = query.toLowerCase().trim();

  if (/^(mala\s+)?(paithan|paithancha|paithanche)\s+(baddal|vishayi)\s+sanga[?.!\s]*$/i.test(normalized)) {
    return language === "mr"
      ? "पैठण हे महाराष्ट्रातील छत्रपती संभाजीनगर जिल्ह्यात गोदावरी नदीकाठी वसलेले ऐतिहासिक शहर आहे. प्राचीन काळात ते प्रतिष्ठान म्हणून ओळखले जात असे. पैठणी विणकाम, संत एकनाथ महाराजांचे वारसा आणि जायकवाडी धरण यांसाठी पैठण प्रसिद्ध आहे."
      : language === "hi"
        ? "पैठण महाराष्ट्र के छत्रपति संभाजीनगर जिले में गोदावरी नदी के किनारे स्थित एक ऐतिहासिक शहर है। प्राचीन काल में इसे प्रतिष्ठान कहा जाता था। यह पैठणी बुनाई, संत एकनाथ महाराज की विरासत और जायकवाड़ी बांध के लिए प्रसिद्ध है।"
        : "Paithan is a historic town on the Godavari River in Chhatrapati Sambhajinagar district, Maharashtra. Once known as Pratishthana, it is known for Paithani weaving, Sant Eknath's heritage, and the nearby Jayakwadi Dam.";
  }

  if (/^(mala\s+)?sanga[?.!\s]*$/i.test(normalized)) {
    return language === "mr" ? "नक्की. तुम्हाला पैठण, नागरी सेवा, पर्यटन, इतिहास किंवा इतर कोणत्या विषयाबद्दल जाणून घ्यायचे आहे?" : language === "hi" ? "ज़रूर। आप पैठण, नागरिक सेवाओं, पर्यटन, इतिहास या किसी अन्य विषय के बारे में क्या जानना चाहते हैं?" : "Certainly. What would you like to know?";
  }
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

  if (/^(will|can|could|would) you help me[?.!\s]*$/i.test(normalized)) {
    return language === "mr" ? "हो, नक्की. तुम्हाला कशाबद्दल मदत हवी आहे?" : language === "hi" ? "हाँ, ज़रूर। आपको किस बारे में मदद चाहिए?" : "Yes. What would you like help with?";
  }

  return null;
}

function localFallback(query: string, language: ChatLanguage, retrieved: RetrievedChunk[]): string {
  const primary = retrieved[0];
  const normalized = query.toLowerCase();
  if (primary) {
    if (/^(what|where|tell me about|describe|about)\s+(is\s+)?paithan[?.!\s]*$/i.test(normalized)) {
      return "Paithan is a historic town on the Godavari River in Chhatrapati Sambhajinagar district, Maharashtra. Once known as Pratishthana, it is known for Paithani weaving, Sant Eknath's heritage, and the nearby Jayakwadi Dam.";
    }
    if (/\b(cost|price|how much|rate)\b/i.test(normalized)) {
      return language === "mr" ? "या वस्तूची सध्याची सत्यापित किंमत माझ्याकडे नाही. कृपया विक्रेता किंवा सहकारी संस्थेकडून किंमत तपासा." : language === "hi" ? "मेरे पास इसकी सत्यापित वर्तमान कीमत नहीं है। कृपया विक्रेता या सहकारी संस्था से कीमत पूछें।" : "I don’t have a verified current price for that item. Please check with a seller or weavers’ cooperative; prices vary by material and workmanship.";
    }
    const lines = primary.content.split("\n").map((line) => line.trim()).filter(Boolean);
    if (/office|timing|hours|वेळ|समय/i.test(normalized) && /phone|contact|number|फोन|संपर्क/i.test(normalized)) {
      return normalizeAnswer(lines.filter((line) => /Working Hours|Official Phone/i.test(line)).join("\n"), 500);
    }
    const intent = normalized.includes("mla") || normalized.includes("आमदार") ? /\bMLA\b|आमदार/i
      : normalized.includes("mp") || normalized.includes("खासदार") ? /\bMP\b|खासदार/i
      : /office|timing|hours|वेळ|समय/i.test(normalized) ? /Working Hours/i
      : /phone|contact|number|फोन|संपर्क/i.test(normalized) ? /Official Phone|Control Room/i
      : /emergency|police|ambulance|fire/i.test(normalized) ? /Police|Hospital|Fire|Control Room/i
      : null;
    const matching = intent ? lines.filter((line) => intent.test(line)) : [];
    if (matching.length > 0) return normalizeAnswer(matching.slice(0, 3).join("\n"), 500);
    return normalizeAnswer(lines.slice(0, 2).join("\n"), 360);
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
    const locality = localityOverview(query, language);
    if (locality) {
      return NextResponse.json({ reply: locality.answer, sources: [{ title: "Paithan area map", url: `/${language}/nagar-parishad/ward-map` }], grounded: true, engine: "local-reliable" });
    }
    let contextText = "No verified Paithan record was retrieved for this question.";
    let sources: Array<{ title: string; url: string }> = [];
    let retrieved: RetrievedChunk[] = [];
    try {
      retrieved = queryKnowledgeBase(query, 1);
      if (retrieved[0]) {
        contextText = `[Source: ${retrieved[0].sourceTitle} (${retrieved[0].sourceUrl})]\n${retrieved[0].content}`;
        sources = [{ title: retrieved[0].sourceTitle, url: retrieved[0].sourceUrl }];
      }
    } catch (retrievalError) {
      console.error("[chatbot] Local knowledge retrieval failed; continuing without local context.", retrievalError);
    }

    const hasLocalContext = retrieved.length > 0;
    const generated = await generateChatbotAnswer({ query, language, history, contextText, isLocalQuestion: hasLocalContext });
    const reply = generated?.answer || localFallback(query, language, retrieved);

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
