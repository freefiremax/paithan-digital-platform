import { NextRequest, NextResponse } from "next/server";
import { buildChatbotContext, queryKnowledgeBase } from "@/lib/rag";

export const runtime = "nodejs";

type Language = "en" | "mr" | "hi";

function getLanguageName(lang: Language): string {
  switch (lang) {
    case "mr": return "Marathi (मराठी)";
    case "hi": return "Hindi (हिंदी)";
    default: return "English";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query: string = body.message || body.query || "";
    const language: Language = (body.language === "mr" ? "mr" : body.language === "hi" ? "hi" : "en");

    if (!query.trim()) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // 1. Retrieve grounded municipal knowledge base chunks
    const { contextText, sources } = buildChatbotContext(query);
    const retrieved = queryKnowledgeBase(query, 3);
    const hasRelevantKBContext = retrieved.length > 0 && retrieved.some(r => r.score > 30);

    // 2. Check for Gemini API key
    const geminiKey = process.env.GEMINI_API_KEY;
    const hasValidGeminiKey = !!geminiKey && geminiKey.length > 10;

    if (!hasValidGeminiKey) {
      console.warn("Gemini API key not configured or invalid, using local grounded fallback");
    }

    const languageName = getLanguageName(language);

    // Build system prompt with guardrails
    const systemPrompt = `You are the official AI Citizen Assistant for Paithan Municipal Council (पैठण नगर परिषद), Chhatrapati Sambhajinagar district, Maharashtra.
You provide accurate, courteous, and grounded information to citizens, pilgrims, and tourists.
Language requested: ${languageName}.
If responding in Marathi or Hindi, use respectful, clear language. If in English, keep it professional and accessible.

IMPORTANT GUARDRAILS:
- If the user asks for a *Paithan-specific civic fact* (ward stats, scheme details, officials, local figures, emergency numbers, office hours, corporator names, tender deadlines, population, literacy rates, etc.) that is NOT in the retrieved KB context below, you MUST say you don't have that in verified official records rather than guessing. Do NOT invent Paithan civic data.
- For general/world knowledge questions (definitions, math, science, history, geography, etc.) that are NOT Paithan-specific, answer freely from your own knowledge.
- KB civic facts stay verbatim/grounded; only the surrounding response is localized to the requested language.
- Always cite sources from the KB when using KB information.

Verified Knowledge Base Context:
${contextText}`;

    const prompt = `User Query: ${query}

Provide a structured, helpful response. Mention any relevant official contacts, locations, or source references from the verified context if applicable.`;

    // 3. Try Gemini API if key is valid
    if (hasValidGeminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${systemPrompt}\n\n${prompt}` }],
                },
              ],
              generationConfig: {
                temperature: hasRelevantKBContext ? 0.3 : 0.7,
                maxOutputTokens: 1000,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const replyText =
            data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

          if (replyText) {
            return NextResponse.json({
              reply: replyText,
              sources,
              grounded: hasRelevantKBContext,
              engine: "gemini-1.5-flash",
            });
          }
        } else {
          const errorData = await geminiRes.json().catch(() => ({}));
          console.warn(`Gemini API returned ${geminiRes.status}:`, errorData);
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local grounded synthesis:", geminiError);
      }
    }

    // 4. Fallback: Grounded deterministic response synthesized from verified RAG database
    let synthesizedReply = "";

    if (hasRelevantKBContext) {
      if (language === "mr") {
        synthesizedReply = `पैठण नगर परिषद अधिकृत माहिती:\n\n${contextText}\n\nअधिक माहितीसाठी पैठण नगर परिषद मुख्य कार्यालय (फोन: 02431-223010 / ई-मेल: munptn@gmail.com) येथे संपर्क साधा.`;
      } else if (language === "hi") {
        synthesizedReply = `पैठण नगर परिषद आधिकारिक जानकारी:\n\n${contextText}\n\nअधिक जानकारी के लिए पैठण नगर परिषद मुख्य कार्यालय (फोन: 02431-223010 / ई-मेल: munptn@gmail.com) पर संपर्क करें।`;
      } else {
        synthesizedReply = `Official Paithan Municipal Information:\n\n${contextText}\n\nFor official assistance or inquiries, visit the Paithan Municipal Council Administrative Complex, Main Road, Paithan or contact 02431-223010 / munptn@gmail.com.`;
      }
    } else {
      // No relevant KB context - general knowledge fallback (only if we have a valid key, otherwise local fallback)
      if (language === "mr") {
        synthesizedReply = `मला या विषयी पैठण नगर परिषदेच्या प्रमाणित अभिलेखात कोणतीही माहिती सापडली नाही. कृपया अधिकृत कार्यालय (०२४३१-२२३०१०) येथे संपर्क करा.`;
      } else if (language === "hi") {
        synthesizedReply = `मुझे पैठण नगर परिषद के प्रमाणित अभिलेखों में इस विषय पर कोई जानकारी नहीं मिली। कृपया अधिकृत कार्यालय (०२४३१-२२३०१०) पर संपर्क करें।`;
      } else {
        synthesizedReply = `I don't have verified Paithan Municipal Council records on this topic. Please contact the official office at 02431-223010 or munptn@gmail.com for assistance.`;
      }
    }

    return NextResponse.json({
      reply: synthesizedReply,
      sources,
      grounded: hasRelevantKBContext,
      engine: hasValidGeminiKey ? "gemini-1.5-flash-fallback" : "rag-verified-local",
    });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      {
        error: "Internal chatbot processing error",
        reply: "We are currently experiencing high request volume. Please reach out to Paithan Municipal Council Helpline at 02431-223010 or emergency 112.",
        sources: [{ title: "Paithan Municipal Council", url: "/nagar-parishad" }],
      },
      { status: 500 }
    );
  }
}
