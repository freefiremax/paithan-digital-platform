import { NextRequest, NextResponse } from "next/server";
import { buildChatbotContext } from "@/lib/rag";

export const runtime = "nodejs";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query: string = body.message || body.query || "";
    const language: "en" | "mr" = body.language === "mr" ? "mr" : "en";


    if (!query.trim()) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // 1. Retrieve grounded municipal knowledge base chunks
    const { contextText, sources } = buildChatbotContext(query);

    // 2. Check for Gemini API key
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const systemPrompt = `You are the official AI Citizen Assistant for Paithan Municipal Council (पैठण नगर परिषद), Chhatrapati Sambhajinagar district, Maharashtra.
You provide accurate, courteous, and grounded information to citizens, pilgrims, and tourists.
Language requested: ${language === "mr" ? "Marathi (मराठी)" : "English"}.
If responding in Marathi, use respectful, clear Marathi. If in English, keep it professional and accessible.
Always rely FIRST on the verified council knowledge base provided below.
DO NOT hallucinate emergency numbers, office hours, corporator names, or tender deadlines.
If a detail is not in the knowledge base, state that the citizen should verify directly with the Paithan Municipal Council office at 02431-223010 or munptn@gmail.com.

Verified Knowledge Base Context:
${contextText}`;

        const prompt = `User Query: ${query}

Provide a structured, helpful response. Mention any relevant official contacts, locations, or source references from the verified context if applicable.`;

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
                temperature: 0.3,
                maxOutputTokens: 800,
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
              grounded: true,
              engine: "gemini-1.5-flash",
            });
          }
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local grounded synthesis:", geminiError);
      }
    }

    // 3. Fallback: Grounded deterministic response synthesized from verified RAG database
    let synthesizedReply = "";

    if (language === "mr") {
      synthesizedReply = `पैठण नगर परिषद अधिकृत माहिती:\n\n${contextText}\n\nअधिक माहितीसाठी पैठण नगर परिषद मुख्य कार्यालय (फोन: 02431-223010 / ई-मेल: munptn@gmail.com) येथे संपर्क साधा.`;
    } else {
      synthesizedReply = `Official Paithan Municipal Information:\n\n${contextText}\n\nFor official assistance or inquiries, visit the Paithan Municipal Council Administrative Complex, Main Road, Paithan or contact 02431-223010 / munptn@gmail.com.`;
    }

    return NextResponse.json({
      reply: synthesizedReply,
      sources,
      grounded: true,
      engine: "rag-verified-local",
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
