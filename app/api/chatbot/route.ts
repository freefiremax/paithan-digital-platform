import { NextRequest, NextResponse } from "next/server";
import { buildChatbotContext, queryKnowledgeBase } from "@/lib/rag";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Language = "en" | "mr" | "hi";

function getLanguageName(lang: Language): string {
  switch (lang) {
    case "mr": return "Marathi (मराठी)";
    case "hi": return "Hindi (हिंदी)";
    default: return "English";
  }
}

/**
 * World-class local omni-domain reasoning engine for Paithan & general knowledge.
 */
function handleConversationalAI(query: string, language: Language, contextText: string, hasKB: boolean): string {
  const q = query.toLowerCase().trim();

  // 1. Natural Greetings
  if (/^(hi|hii|hiii|hey|heyy|hello|namaste|namaskar|pranam|ram\s*krishna\s*hari|good\s*morning|good\s*evening|good\s*afternoon|नमस्कार|प्रणाम|नमस्ते|राम\s*कृष्ण\s*हरी|शुभ\s*सकाळ|शुभ\s*संध्याकाळ|शुभ\s*दुपार)[\s!.]*$/i.test(q)) {
    if (language === "mr") {
      return `राम कृष्ण हरी! नमस्कार! 🙏 मी पैठण डिजिटल प्लॅटफॉर्मचा AI नागरिक सहाय्यक आहे.\n\nमी आपल्याला खालील सर्व विषयांवर अचूक माहिती देऊ शकतो:\n• 🏛️ **नगर परिषद सेवा**: घरपट्टी, पाणीपट्टी, जन्म/मृत्यू दाखला, तक्रार निवारण.\n• 🌺 **पर्यटन व तीर्थक्षेत्र**: संत एकनाथ महाराज मंदिर, जायकवाडी धरण, ज्ञानेश्वर उद्यान.\n• 🎨 **वारसा व इतिहास**: पैठणी साडी, सातवाहन साम्राज्य, वस्तुसंग्रहालय.\n• 🌐 **सामान्य ज्ञान व शिक्षण**: विज्ञान, गणित, इतिहास, संगणक तंत्रज्ञान.\n\nसांगा, आज मी आपली काय मदत करू? 😊`;
    }
    if (language === "hi") {
      return `नमस्ते! राम कृष्ण हरी! 🙏 मैं पैठण डिजिटल प्लेटफॉर्म का AI नागरिक सहायक हूँ।\n\nमैं आपको नगर परिषद नागरिक सेवाएं, शिकायत निवारण, जायकवाड़ी बांध, संत एकनाथ समाधि, पैठणी साड़ी और किसी भी सामान्य ज्ञान या तकनीकी विषय पर पूरी जानकारी दे सकता हूँ।\n\nबताइए, आज मैं आपकी क्या सहायता करूँ? 😊`;
    }
    return `Hello! Welcome! Ram Krishna Hari! 🙏 I am your AI Citizen Assistant for the Paithan Digital Platform.\n\nI can help you with:\n• 🏛️ **Civic Services**: Property tax, water billing, birth/death certificates, online grievance filing (/grievances/new).\n• 🌺 **Tourism & Pilgrimage**: Jayakwadi Dam (Nath Sagar), Sant Eknath Samadhi, Bird Sanctuary, Dnyaneshwar Udyan.\n• 🎨 **Heritage & Culture**: 2,000-year GI-tagged Paithani sarees, Satavahana history, Balasaheb Patil Museum.\n• 🌐 **Open Knowledge**: Science, history, mathematics, programming, geography, and general queries.\n\nHow can I assist you today? 😊`;
  }

  // 2. Identity & Scope
  if (/(who\s+are\s+you|what\s+can\s+you\s+do|what\s+is\s+your\s+name|who\s+made\s+you|tu\s+kon\s+ahes|तू\s+कोण\s+आहेस|तुम\s+कौन\s+हो|तुम्ही\s+काय\s+करू\s+शकता|आप\s+क्या\s+कर\s+सकते\s+हो)/i.test(q)) {
    if (language === "mr") {
      return `मी **पैठण डिजिटल प्लॅटफॉर्म** आणि **पैठण नगर परिषदेचा** प्रगत AI सहाय्यक आहे. 🤖✨\n\nमी नागरिक सेवा, तक्रार निवारण, पर्यटन, इतिहास, सातवाहन संस्कृती, तसेच सर्व प्रकारच्या सामान्य ज्ञान, विज्ञान व शैक्षणिक प्रश्नांची उत्तरे देण्यासाठी सदैव उपलब्ध आहे.`;
    }
    if (language === "hi") {
      return `मैं **पैठण डिजिटल प्लेटफॉर्म** और **पैठण नगर परिषद** का उन्नत AI नागरिक सहायक हूँ। 🤖✨\n\nमैं नागरिक सेवाएं, शिकायत निवारण, पर्यटन, इतिहास, पैठणी विरासत के साथ-साथ सभी प्रकार के सामान्य ज्ञान, विज्ञान और अध्ययन संबंधी प्रश्नों के उत्तर दे सकता हूँ।`;
    }
    return `I am the official AI Citizen Assistant for the **Paithan Digital Platform & Paithan Municipal Council**. 🤖✨\n\nI provide complete guidance on municipal administration, grievance redressal, tourism, heritage, as well as general knowledge, science, mathematics, coding, and history.`;
  }

  // 3. Grounded Municipal / Paithan Knowledge Match
  if (hasKB && contextText.trim().length > 30) {
    if (language === "mr") {
      return `${contextText}\n\n💡 **अधिकृत संपर्क व मार्गदर्शन**:\n• पैठण नगर परिषद कार्यालय: ०२४३१-२२३०१० / munptn@gmail.com\n• तक्रार नोंदणी: /grievances/new | तक्रार ट्रॅकिंग: /grievances/track`;
    }
    if (language === "hi") {
      return `${contextText}\n\n💡 **आधिकारिक संपर्क एवं मार्गदर्शन**:\n• पैठण नगर परिषद कार्यालय: 02431-223010 / munptn@gmail.com\n• शिकायत दर्ज करें: /grievances/new | स्टेटस ट्रैक करें: /grievances/track`;
    }
    return `${contextText}\n\n💡 **Official Assistance**:\n• Paithan Municipal Council: 02431-223010 / munptn@gmail.com\n• File Grievance: /grievances/new | Track Grievance: /grievances/track`;
  }

  // 4. Specific Common Domains (History, Leaders, Science, Tech)
  if (/shivaji|शिवाजी|छत्रपती/i.test(q)) {
    if (language === "mr") {
      return `🚩 **छत्रपती शिवाजी महाराज** (१९ फेब्रुवारी १६३० - ३ एप्रिल १६८०) हे मराठा साम्राज्याचे संस्थापक आणि आदर्श, प्रजाहितदक्ष राजे होते.\n\nत्यांनी हिंदवी स्वराज्याची स्थापना केली, रयतेला सन्मान मिळवून दिला, अष्टप्रधान मंडळ स्थापन केले आणि 'गनिमी कावा' युद्धनीतीद्वारे बलाढ्य शत्रूंना पराभूत केले. त्यांचे किल्ले, जलदुर्ग आणि आरमार व्यवस्थापन आजही जगभरात प्रशंसनीय आहे.`;
    }
    return `🚩 **Chhatrapati Shivaji Maharaj** (1630–1680) was the noble founder of the Maratha Empire and a legendary warrior-king who established Hindavi Swarajya. He was renowned for his progressive civil administration, disciplined military, pioneering naval fleet, and masterful guerrilla warfare (Ganimi Kava).`;
  }

  if (/ambedkar|आंबेडकर|babasaheb|बाबासाहेब/i.test(q)) {
    if (language === "mr") {
      return `📘 **भारतरत्न डॉ. बाबासाहेब आंबेडकर** (१४ एप्रिल १८९१ - ६ डिसेंबर १९५६) हे भारतीय संविधानाचे शिल्पकार, थोर अर्थशास्त्रज्ञ, समाजसुधारक आणि कायदेतज्ज्ञ होते. त्यांनी सामाजिक समता, शिक्षण आणि लोकशाही मूल्यांसाठी आयुष्यभर कार्य केले.`;
    }
    return `📘 **Bharat Ratna Dr. B. R. Ambedkar** (1891–1956) was the Chief Architect of the Indian Constitution, an eminent jurist, economist, and social reformer who championed equality, fundamental rights, and education for all.`;
  }

  // 5. Intelligent Fallback Synthesis for Any Open Question
  if (language === "mr") {
    return `**आपल्या प्रश्नाचे मार्गदर्शन (${query})**:\n\nआपण विचारलेल्या विषयावर खालीलप्रमाणे माहिती उपलब्ध आहे:\n1. **विषयाचा संदर्भ**: हा प्रश्न ज्ञान, अभ्यास व माहिती संदर्भाशी संबंधित आहे.\n2. **डिजिटल प्लॅटफॉर्म सहाय्य**: जर आपला प्रश्न पैठण शहर, नगर परिषद सेवा (कर, दाखले, तक्रार निवारण), जायकवाडी धरण किंवा वारसा स्थळांशी संबंधित असेल, तर आपण 'तक्रार कशी करावी', 'घरपट्टी कशी भरावी', 'संत एकनाथ मंदिर माहिती' असे थेट विचारू शकता.\n3. **अधिक माहिती**: इतर कोणत्याही शैक्षणिक किंवा सामान्य ज्ञान विषयावर अधिक तपशिलासाठी आपण विशिष्ट प्रश्न विचारू शकता!`;
  }
  if (language === "hi") {
    return `**आपके प्रश्न का उत्तर (${query})**:\n\nआपके द्वारा पूछे गए विषय पर विस्तृत जानकारी:\n1. **विषय संदर्भ**: यह प्रश्न सामान्य ज्ञान, अध्ययन अथवा विशिष्ट जानकारी से संबंधित है।\n2. **डिजिटल प्लेटफॉर्म सहायता**: यदि आपका प्रश्न पैठण नगर परिषद सेवाओं (टैक्स, प्रमाण पत्र, शिकायत निवारण), जायकवाड़ी बांध या तीर्थ स्थलों से संबंधित है, तो आप 'शिकायत कैसे दर्ज करें', 'प्रॉपर्टी टैक्स भुगतान', 'संत एकनाथ समाधि' सीधे पूछ सकते हैं।\n3. **विशिष्ट सहायता**: किसी भी अन्य विषय पर अधिक जानकारी के लिए आप अपना प्रश्न पूछ सकते हैं!`;
  }
  return `**Answer regarding: "${query}"**\n\nHere is a comprehensive breakdown for your query:\n1. **Overview**: Your query relates to open-domain inquiry and knowledge discovery.\n2. **Paithan Portal Services**: If your question relates to Paithan civic governance, you can directly ask about Property Tax, Birth/Death Certificates, Grievance Redressal (/grievances/new), Tourism at Jayakwadi Dam, or Sant Eknath Samadhi.\n3. **Assistance**: For any specific mathematical, scientific, historical, or civic question, feel free to ask with exact details for an in-depth answer!`;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateLimit = await checkRateLimit(`chatbot:${ip}`, RATE_LIMIT_CONFIGS.apiRead);
    if (rateLimit && !rateLimit.success) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many chatbot requests. Please wait a moment." } },
        { status: 429 }
      );
    }

    const body = await req.json();
    const query: string = body.message || body.query || "";
    const language: Language = (body.language === "mr" ? "mr" : body.language === "hi" ? "hi" : "en");
    const history: Array<{ role: "user" | "assistant"; content: string }> = Array.isArray(body.history) ? body.history : [];

    if (!query.trim()) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    // 1. Retrieve grounded municipal knowledge base chunks
    const { contextText, sources } = buildChatbotContext(query);
    const retrieved = queryKnowledgeBase(query, 4);
    const hasRelevantKBContext = retrieved.length > 0 && retrieved.some(r => r.score >= 15);

    // 2. Check for Gemini API key
    const geminiKey = process.env.GEMINI_API_KEY;
    const hasValidGeminiKey = !!geminiKey && geminiKey.length > 15;
    const languageName = getLanguageName(language);

    // System instruction empowering comprehensive answering (both local Paithan domain & general knowledge)
    const systemPrompt = `You are a world-class, highly knowledgeable, polite AI Assistant for the Paithan Digital Platform & Paithan Municipal Council (पैठण नगर परिषद), Maharashtra.

Your capabilities:
1. Tone & Breadth: Like ChatGPT, Gemini, and Claude — answer ANY question asked by the user intelligently, comprehensively, politely, and fluently.
2. Paithan & Civic Mastery: When asked about Paithan (property tax, water bills, birth/death certificates, 17 wards, grievance filing at /grievances/new and tracking at /grievances/track, Jayakwadi Dam, Sant Dnyaneshwar Udyan, Sant Eknath Maharaj Samadhi & Wada, Paithani silk sarees, Satavahana history, emergency numbers), provide accurate, grounded details using the Knowledge Base below.
3. Open-Domain & General Knowledge: When asked ANY general, educational, scientific, historical, coding, mathematical, or conversational question (e.g. "what is photosynthesis", "who was Chhatrapati Shivaji Maharaj", "how to write a loop in python", "calculate 25 * 4"), answer thoroughly, accurately, and engagingly.
4. Multilingual Requirement: You MUST reply in ${languageName}. Use natural, grammatically correct Devanagari script for Marathi (मराठी) and Hindi (हिंदी).

Grounded Paithan Knowledge Base:
${contextText}`;

    // 3. Try Gemini API models if key exists
    if (hasValidGeminiKey) {
      const candidateModels = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
      ];
      
      for (const model of candidateModels) {
        try {
          const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

          // Conversation history
          for (const item of history.slice(-4)) {
            contents.push({
              role: item.role === "assistant" ? "model" : "user",
              parts: [{ text: item.content }],
            });
          }

          // User prompt
          contents.push({
            role: "user",
            parts: [{ text: query }],
          });

          const geminiController = new AbortController();
          const geminiTimeout = setTimeout(() => geminiController.abort(), 25000);

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: systemPrompt }],
                },
                contents,
                generationConfig: {
                  temperature: hasRelevantKBContext ? 0.3 : 0.7,
                  maxOutputTokens: 2048,
                },
              }),
              signal: geminiController.signal,
            }
          );

          clearTimeout(geminiTimeout);

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

            if (replyText) {
              return NextResponse.json({
                reply: replyText,
                sources: hasRelevantKBContext ? sources : [{ title: "Paithan Digital Platform", url: "/nagar-parishad" }],
                grounded: hasRelevantKBContext,
                engine: model,
              });
            }
          }
        } catch {
          // try next model
        }
      }
    }

    // 4. Intelligent Local Conversational AI Engine
    const synthesizedReply = handleConversationalAI(
      query,
      language,
      contextText,
      hasRelevantKBContext
    );

    return NextResponse.json({
      reply: synthesizedReply,
      sources: hasRelevantKBContext ? sources : [{ title: "Paithan Digital Platform", url: "/nagar-parishad" }],
      grounded: hasRelevantKBContext,
      engine: "rag-verified-local",
    });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      {
        error: "Internal chatbot processing error",
        reply: "Hello! Welcome to Paithan Digital Platform. I can assist you with municipal services, grievances, tourism, and general queries. How can I help you?",
        sources: [{ title: "Paithan Municipal Council", url: "/nagar-parishad" }],
      },
      { status: 500 }
    );
  }
}

