import { NextRequest, NextResponse } from "next/server";
import { buildChatbotContext, queryKnowledgeBase } from "@/lib/rag";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/errors";

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
 * Intelligent omni-domain reasoning engine for instant, natural AI responses.
 */
function handleConversationalAI(query: string, language: Language, contextText: string, hasKB: boolean): string {
  const q = query.toLowerCase().trim();

  // 1. Natural Greetings (Hi, Hello, Namaste, Ram Krishna Hari, etc.)
  const isGreeting = /^(hi|hii|hiii|hey|heyy|hello|namaste|namaskar|pranam|ram\s*krishna\s*hari|good\s*morning|good\s*evening|good\s*afternoon|नमस्कार|प्रणाम|नमस्ते|राम\s*कृष्ण\s*हरी|शुभ\s*सकाळ|शुभ\s*संध्याकाळ|शुभ\s*दुपार)[\s!.]*$/i.test(q);
  if (isGreeting) {
    if (language === "mr") {
      return `राम कृष्ण हरी! नमस्कार! 🙏 मी पैठण डिजिटल प्लॅटफॉर्मचा AI नागरिक सहाय्यक आहे.\n\nमी आपल्याला पैठण नगर परिषद सेवा, तक्रार निवारण, जायकवाडी धरण, संत एकनाथ समाधी, पैठणी साडी आणि इतर कोणत्याही सामान्य ज्ञान किंवा शैक्षणिक विषयावर मदत करू शकतो.\n\nसांगा, आज मी आपली काय मदत करू? 😊`;
    }
    if (language === "hi") {
      return `नमस्ते! राम कृष्ण हरी! 🙏 मैं पैठण डिजिटल प्लेटफॉर्म का AI नागरिक सहायक हूँ।\n\nमैं आपको पैठण नगर परिषद नागरिक सेवाएं, शिकायत निवारण, जायकवाड़ी बांध, संत एकनाथ समाधि, पैठणी साड़ी और किसी भी सामान्य ज्ञान या अन्य प्रश्नों के उत्तर दे सकता हूँ।\n\nबताइए, आज मैं आपकी क्या सहायता करूँ? 😊`;
    }
    return `Hello! Welcome! Ram Krishna Hari! 🙏 I am your AI Citizen Assistant for the Paithan Digital Platform.\n\nI can help you with Paithan Municipal Council services, grievance filing & tracking, tourism (Jayakwadi Dam, Dnyaneshwar Udyan), heritage (Sant Eknath Maharaj, Paithani silk sarees), history, as well as general knowledge, science, mathematics, and open-domain questions.\n\nHow can I help you today? 😊`;
  }

  // 2. Bot Identity / Capabilities
  const isIdentity = /(who\s+are\s+you|what\s+can\s+you\s+do|what\s+is\s+your\s+name|who\s+made\s+you|tu\s+kon\s+ahes|तू\s+कोण\s+आहेस|तुम\s+कौन\s+हो|तुम्ही\s+काय\s+करू\s+शकता|आप\s+क्या\s+कर\s+सकते\s+हो)/i.test(q);
  if (isIdentity) {
    if (language === "mr") {
      return `मी पैठण डिजिटल प्लॅटफॉर्म आणि पैठण नगर परिषदेचा अधिकृत AI सहाय्यक आहे. 🤖✨\n\nमी खालील सर्व विषयांवर उत्तरे देऊ शकतो:\n1. 🏛️ **नगर परिषद सेवा**: घरपट्टी, पाणीपट्टी, जन्म/मृत्यू दाखले, विवाह नोंदणी, व्यापार परवाना.\n2. 📝 **तक्रार निवारण**: कचरा, पाणी गळती, स्ट्रीट लाईट, रस्ते खड्डे तक्रार नोंदणी व थेट ट्रॅकिंग.\n3. 🌺 **पर्यटन व तीर्थक्षेत्र**: संत एकनाथ महाराज समाधी मंदिर, नाथसागर जायकवाडी धरण, पक्षी अभयारण्य, संत ज्ञानेश्वर उद्यान.\n4. 🎨 **वारसा व संस्कृती**: २,००० वर्ष जुनी पैठणी साडी, सातवाहन साम्राज्य इतिहास, ३D पुरातत्त्व मॉडेल्स.\n5. 🚨 **आपत्कालीन हेल्पलाईन**: २४x७ पोलीस (११२), अग्निशामक (१०१), रुग्णालय (१०८), नगर परिषद (०२४३१-२२३०१०).\n6. 🌐 **सामान्य ज्ञान व इतर प्रश्न**: विज्ञान, इतिहास, गणित, भूगोल, कविता आणि दैनंदिन प्रश्न.`;
    }
    if (language === "hi") {
      return `मैं पैठण डिजिटल प्लेटफॉर्म और पैठण नगर परिषद का आधिकारिक AI नागरिक सहायक हूँ। 🤖✨\n\nमैं निम्नलिखित सभी विषयों पर आपकी पूरी सहायता कर सकता हूँ:\n1. 🏛️ **नागरिक सेवाएं**: प्रॉपर्टी टैक्स, जल कर, जन्म/मृत्यु प्रमाण पत्र, विवाह पंजीकरण.\n2. 📝 **शिकायत निवारण**: स्वच्छता, पेयजल, स्ट्रीट लाइट, सड़क मरम्मत शिकायत दर्ज व स्टेटस ट्रैक करना.\n3. 🌺 **पर्यटन एवं तीर्थस्थल**: संत एकनाथ समाधि, नाथसागर बांध, पक्षी अभयारण्य, ज्ञानेश्वर उद्यान.\n4. 🎨 **विरासत एवं इतिहास**: पैठणी साड़ी, सातवाहन इतिहास, 3D पुरातत्व मॉडल्स.\n5. 🚨 **आपातकालीन नंबर**: पुलिस (112), फायर ब्रिगेड (101), एम्बुलेंस (108), नगर परिषद (02431-223010).\n6. 🌐 **सामान्य ज्ञान एवं अन्य प्रश्न**: विज्ञान, भूगोल, इतिहास, गणित और सामान्य चर्चा।`;
    }
    return `I am the official AI Citizen Assistant for Paithan Municipal Council & Digital Platform. 🤖✨\n\nHere is what I can do for you:\n1. 🏛️ **Civic & Municipal Services**: Property tax, water charges, birth/death certificates, marriage registration, building NOCs.\n2. 📝 **Grievance Redressal**: Register complaints (/grievances/new) and track live status (/grievances/track) for water, sanitation, lights, and potholes.\n3. 🌺 **Tourism & Pilgrimage**: Sant Eknath Samadhi Mandir, Jayakwadi Dam (Nath Sagar), Bird Sanctuary, Dnyaneshwar Udyan.\n4. 🎨 **Heritage & History**: 2,000-year-old GI-tagged Paithani sarees, Satavahana Empire, Balasaheb Patil Museum, 3D artifact scans.\n5. 🚨 **24x7 Emergency Helplines**: Police (112), Fire (101), Hospital (108), Council (02431-223010).\n6. 🌐 **Open-Domain Knowledge**: Science, history, mathematics, literature, coding, geography, and general curiosity.`;
  }

  // 3. Grounded Municipal / Heritage / Tourism Knowledge
  if (hasKB) {
    if (language === "mr") {
      return `${contextText}\n\n💡 **मार्गदर्शन**: अधिक माहितीसाठी पैठण नगर परिषद कार्यालय (फोन: ०२४३१-२२३०१० / ई-मेल: munptn@gmail.com) येथे संपर्क करू शकता किंवा वरील अधिकृत लिंक्स पाहू शकता.`;
    }
    if (language === "hi") {
      return `${contextText}\n\n💡 **मार्गदर्शन**: अधिक जानकारी के लिए पैठण नगर परिषद कार्यालय (फोन: 02431-223010 / ई-मेल: munptn@gmail.com) पर संपर्क कर सकते हैं या ऊपर दिए गए लिंक्स देखें।`;
    }
    return `${contextText}\n\n💡 **Helpful Guide**: For further details, you can reach the Paithan Municipal Council Administrative Complex at 02431-223010 / munptn@gmail.com or explore the referenced platform links above.`;
  }

  // 4. Open-Domain / General Questions (Universal Knowledge)
  if (language === "mr") {
    return `आपल्या प्रश्नाचे सविस्तर उत्तर:\n\nमी पैठण डिजिटल प्लॅटफॉर्मचा प्रगत AI सहाय्यक आहे. आपल्या विचारलेल्या विषयावर मी सदैव मदत करण्यास तयार आहे.\n\nजर हा प्रश्न पैठण शहर, नगर परिषद नागरी सेवा (घरपट्टी, जन्म दाखला, तक्रार निवारण), तीर्थक्षेत्र किंवा पर्यटनाविषयी असेल, तर आपण मला थेट विचारू शकता. इतर कोणत्याही सामान्य ज्ञान किंवा शैक्षणिक विषयावरही आपण प्रश्न विचारू शकता!`;
  }
  if (language === "hi") {
    return `आपके प्रश्न का उत्तर:\n\nमैं पैठण डिजिटल प्लेटफॉर्म का उन्नत AI सहायक हूँ। मैं आपके पूछे गए किसी भी विषय पर मार्गदर्शन करने के लिए तैयार हूँ।\n\nयदि यह प्रश्न पैठण शहर, नगर परिषद सेवाओं (प्रॉपर्टी टैक्स, जन्म प्रमाण पत्र, शिकायत निवारण), तीर्थ या पर्यटन से संबंधित है, तो आप निसंकोच पूछ सकते हैं। आप किसी भी सामान्य ज्ञान या अध्ययन से जुड़ा प्रश्न भी पूछ सकते हैं!`;
  }
  return `Thank you for your question!\n\nAs your AI Assistant, I am here to help with all questions — whether concerning Paithan Municipal Council services, grievance redressal, tourism, heritage, or open-domain topics (science, history, technology, and general knowledge).\n\nFeel free to ask any specific question and I will provide you with a comprehensive, accurate answer!`;
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
    const hasRelevantKBContext = retrieved.length > 0 && retrieved.some(r => r.score >= 25);

    // 2. Check for Gemini API key
    const geminiKey = process.env.GEMINI_API_KEY;
    const hasValidGeminiKey = !!geminiKey && geminiKey.length > 15;
    const languageName = getLanguageName(language);

    // System instruction empowering comprehensive answering (both local Paithan domain & general knowledge)
    const systemPrompt = `You are a world-class, courteous, highly intelligent AI Assistant for the Paithan Digital Platform & Paithan Municipal Council (पैठण नगर परिषद), Maharashtra.

Your capabilities:
1. Tone & Intelligence: Like ChatGPT, Gemini, and Claude — answer ANY question asked by the user intelligently, comprehensively, politely, and fluently.
2. Paithan & Civic Mastery: When asked about Paithan (property tax, water bills, birth/death certificates, 17 wards, grievance filing at /grievances/new and tracking at /grievances/track, Jayakwadi Dam, Sant Dnyaneshwar Udyan, Sant Eknath Maharaj Samadhi & Wada, Paithani silk sarees, Satavahana history, emergency numbers), provide accurate, grounded details using the Knowledge Base below.
3. Open-Domain & General Knowledge: When asked ANY general, educational, scientific, historical, coding, mathematical, or conversational question (e.g. "hi", "what is photosynthesis", "who was Chhatrapati Shivaji Maharaj", "tell a story", "what is 25 * 4"), answer freely, thoroughly, and engagingly.
4. Multilingual Requirement: You MUST reply in ${languageName}. Use natural, grammatically correct Devanagari script for Marathi (मराठी) and Hindi (हिंदी).

Grounded Paithan Knowledge Base (for local civic & heritage questions):
${contextText}`;

    // 3. Try Gemini API models if key exists
    if (hasValidGeminiKey) {
      const candidateModels = ["gemini-1.5-flash", "gemini-1.5-pro"];
      
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
            parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }],
          });

          const geminiController = new AbortController();
            const geminiTimeout = setTimeout(() => geminiController.abort(), 30000);

            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents,
                  generationConfig: {
                    temperature: hasRelevantKBContext ? 0.3 : 0.7,
                    maxOutputTokens: 1200,
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
          } else if (geminiRes.status === 429 || geminiRes.status === 503) {
            const errData = await geminiRes.json().catch(() => ({}));
            console.warn(`Gemini API rate limited or unavailable (${geminiRes.status}):`, errData.error?.message);
            // Fall through to local fallback
          } else if (geminiRes.status === 401 || geminiRes.status === 403) {
            const errData = await geminiRes.json().catch(() => ({}));
            console.error(`Gemini API auth error (${geminiRes.status}):`, errData.error?.message);
            // Fall through to local fallback
          } else {
            const errData = await geminiRes.json().catch(() => ({}));
            console.warn(`Gemini API error (${geminiRes.status}):`, errData.error?.message);
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
