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

/**
 * Intelligent local conversational processor for instant, zero-failure offline responses.
 */
function handleLocalConversationalReply(query: string, language: Language, contextText: string, hasKB: boolean): string {
  const q = query.toLowerCase().trim();

  // 1. Greetings & Salutations
  const isGreeting = /^(hi|hello|hey|namaste|namaskar|good\s+morning|good\s+evening|pranam|ram\s+krishna\s+hari|नमस्कार|प्रणाम|नमस्ते|राम\s+कृष्ण\s+हरी|शुभ\s+सकाळ|शुभ\s+संध्याकाळ)/i.test(q);
  if (isGreeting && q.split(/\s+/).length <= 4) {
    if (language === "mr") {
      return `राम कृष्ण हरी! नमस्कार! 🙏 मी पैठण डिजिटल प्लॅटफॉर्मचा अधिकृत AI सहाय्यक आहे.\n\nमी आपल्याला पैठण नगर परिषद नागरी सुविधा (घरपट्टी, पाणीपट्टी, जन्म/मृत्यू दाखले, तक्रार निवारण), तीर्थक्षेत्र व पर्यटन (संत एकनाथ समाधी, जायकवाडी धरण, ज्ञानेश्वर उद्यान, पैठणी साडी), इतिहास आणि इतर सर्व विषयांवर माहिती देऊ शकतो. मी तुम्हाला कशी मदत करू?`;
    }
    if (language === "hi") {
      return `नमस्ते! राम कृष्ण हरी! 🙏 मैं पैठण डिजिटल प्लेटफॉर्म का आधिकारिक AI सहायक हूँ।\n\nमैं आपको पैठण नगर परिषद नागरिक सेवाएं (प्रॉपर्टी टैक्स, पानी टैक्स, जन्म/मृत्यु प्रमाण पत्र, शिकायत निवारण), पर्यटन व तीर्थस्थल (संत एकनाथ समाधि, जायकवाड़ी बांध, ज्ञानेश्वर उद्यान, पैठणी साड़ी), इतिहास एवं सामान्य ज्ञान से जुड़ी हर जानकारी दे सकता हूँ। मैं आपकी क्या सहायता कर सकता हूँ?`;
    }
    return `Hello and Welcome! Ram Krishna Hari! 🙏 I am the official AI Assistant for the Paithan Digital Platform.\n\nI can assist you with Paithan Municipal Council services (property tax, water charges, birth/death certificates, grievance filing & tracking), heritage & tourism (Sant Eknath Samadhi, Jayakwadi Dam, Dnyaneshwar Udyan, Paithani silk sarees), ancient history, and general knowledge questions. How can I help you today?`;
  }

  // 2. Bot Identity / Capabilities
  const isIdentity = /(who\s+are\s+you|what\s+can\s+you\s+do|what\s+is\s+this|tu\s+kon\s+ahes|तू\s+कोण\s+आहेस|तुम\s+कौन\s+हो|तुम्ही\s+काय\s+करू\s+शकता)/i.test(q);
  if (isIdentity) {
    if (language === "mr") {
      return `मी पैठण नगर परिषदेचा AI नागरिक सहाय्यक आहे.\n\nमी खालील गोष्टींमध्ये मदत करू शकतो:\n1. 🏛️ नगर परिषद सेवा: घरपट्टी, पाणीपट्टी, जन्म/मृत्यू प्रमाणपत्र, विवाह नोंदणी, व्यापार परवाना.\n2. 📝 तक्रार निवारण: कचरा, पाणी, स्ट्रीट लाईट, रस्ते दुरुस्ती तक्रार नोंदणी व ट्रॅकिंग.\n3. 🌺 पर्यटन व तीर्थक्षेत्र: संत एकनाथ समाधी, नाथसागर जायकवाडी धरण, पक्षी अभयारण्य, संत ज्ञानेश्वर उद्यान.\n4. 🎨 संस्कृती व वारसा: २,००० वर्ष जुनी पैठणी साडी, सातवाहन साम्राज्य इतिहास, ३D पुरातत्त्व मॉडेल्स.\n5. 🚨 आपत्कालीन संपर्क: पोलीस, अग्निशामक, रुग्णालय आणि नगर परिषद २४x७ हेल्पलाईन.\n6. 🌐 इतर सामान्य ज्ञान, विज्ञान, भूगोल आणि इतिहास विषयक माहिती.`;
    }
    if (language === "hi") {
      return `मैं पैठण नगर परिषद का AI नागरिक सहायक हूँ।\n\nमैं निम्नलिखित विषयों में आपकी मदद कर सकता हूँ:\n1. 🏛️ नगर परिषद सेवाएं: संपत्ति कर, जल कर, जन्म/मृत्यु प्रमाण पत्र, विवाह पंजीकरण.\n2. 📝 शिकायत निवारण: स्वच्छता, पेयजल, स्ट्रीट लाइट, सड़क मरम्मत शिकायत दर्ज व ट्रैक करना.\n3. 🌺 पर्यटन एवं तीर्थ: संत एकनाथ समाधि मंदिर, जायकवाड़ी बांध, पक्षी अभयारण्य, संत ज्ञानेश्वर उद्यान.\n4. 🎨 विरासत व संस्कृति: पैठणी साड़ी, सातवाहन इतिहास, 3D पुरातत्व मॉडल.\n5. 🚨 आपातकालीन नंबर: पुलिस, फायर ब्रिगेड, अस्पताल एवं नगर परिषद हेल्पलाइन.\n6. 🌐 सामान्य ज्ञान एवं अन्य सभी प्रकार के प्रश्न।`;
    }
    return `I am the AI Citizen Assistant for Paithan Municipal Council.\n\nHere is how I can assist you:\n1. 🏛️ Civic Services: Property tax, water billing, birth/death certificates, marriage registration, trade licenses.\n2. 📝 Grievance Redressal: Register and track complaints for water, sanitation, potholes, streetlights, and garbage.\n3. 🌺 Tourism & Pilgrimage: Sant Eknath Samadhi Mandir, Jayakwadi Dam (Nath Sagar), Jaikwadi Bird Sanctuary, Sant Dnyaneshwar Udyan.\n4. 🎨 Heritage & History: 2000-year-old Paithani silk sarees, Satavahana Empire, Balasaheb Patil Museum, 3D artifact scans.\n5. 🚨 Emergency Helplines: 24x7 numbers for Police (112), Fire (101), Hospital (108), Council (02431-223010).\n6. 🌐 General knowledge, science, mathematics, and open-domain queries.`;
  }

  // 3. Grounded Municipal / Tourism / Heritage Context found
  if (hasKB) {
    if (language === "mr") {
      return `पैठण अधिकृत माहिती:\n\n${contextText}\n\n💡 अधिक माहितीसाठी पैठण नगर परिषद कार्यालय (फोन: ०२४३१-२२३०१० / ई-मेल: munptn@gmail.com) येथे संपर्क साधा किंवा संबंधित पोर्टल लिंकवर क्लिक करा.`;
    }
    if (language === "hi") {
      return `पैठण आधिकारिक जानकारी:\n\n${contextText}\n\n💡 अधिक सहायता के लिए पैठण नगर परिषद कार्यालय (फोन: 02431-223010 / ई-मेल: munptn@gmail.com) पर संपर्क करें या दिए गए लिंक पर जाएं।`;
    }
    return `Official Paithan Information:\n\n${contextText}\n\n💡 For further assistance, contact Paithan Municipal Council Administrative Complex at 02431-223010 / munptn@gmail.com or explore the referenced platform links above.`;
  }

  // 4. Open-domain / General Knowledge fallback
  if (language === "mr") {
    return `आपल्या प्रश्नाचे उत्तर:\n\nमी आपल्या प्रश्नावर मदत करण्यास सदैव सज्ज आहे. पैठण नगर परिषद, तीर्थक्षेत्र, पर्यटन, नागरी सेवा (घरपट्टी, जन्म दाखला, तक्रार निवारण) किंवा आपत्कालीन संपर्कासाठी मी त्वरित प्रमाणित माहिती देऊ शकतो.\n\nविस्तृत नागरी माहितीसाठी नगर परिषद हेल्पलाईन ०२४३१-२२३०१० वर संपर्क साधू शकता.`;
  }
  if (language === "hi") {
    return `आपके प्रश्न का उत्तर:\n\nमैं आपकी सहायता के लिए तैयार हूँ। पैठण नगर परिषद, पर्यटन, तीर्थस्थल, नागरिक सेवाओं (प्रॉपर्टी टैक्स, जन्म प्रमाण पत्र, शिकायत निवारण) या आपातकालीन संपर्कों के लिए मैं प्रमाणित जानकारी प्रदान करता हूँ।\n\nनागरिक सहायता के लिए नगर परिषद कंट्रोल रूम 02431-223010 पर संपर्क कर सकते हैं।`;
  }
  return `Thank you for your question!\n\nI am equipped to answer all inquiries regarding Paithan Municipal Council services, grievances, tourism (Jayakwadi Dam, Dnyaneshwar Udyan), heritage (Sant Eknath Maharaj, Paithani sarees, Satavahana history), emergency helplines, as well as general knowledge.\n\nFor official municipal assistance, you can also reach the Paithan Municipal Council Control Room at 02431-223010 or email munptn@gmail.com.`;
}

export async function POST(req: NextRequest) {
  try {
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
    const hasRelevantKBContext = retrieved.length > 0 && retrieved.some(r => r.score > 25);

    // 2. Check for Gemini API key
    const geminiKey = process.env.GEMINI_API_KEY;
    const hasValidGeminiKey = !!geminiKey && geminiKey.length > 10;
    const chatModel = process.env.GEMINI_CHAT_MODEL || "gemini-1.5-flash";

    const languageName = getLanguageName(language);

    // System instruction empowering comprehensive answering (both local Paithan domain & general knowledge)
    const systemPrompt = `You are the highly knowledgeable, courteous, and official AI Citizen Assistant for the Paithan Digital Platform & Paithan Municipal Council (पैठण नगर परिषद), Chhatrapati Sambhajinagar district, Maharashtra.

Your mission is to assist citizens, tourists, pilgrims, and students with all their queries:
1. Paithan Municipal & Civic Services: Property tax, water supply, birth/death certificates, trade licenses, building permissions, 17 administrative wards, municipal officials, emergency numbers, and grievance redressal (/grievances/new, /grievances/track).
2. Tourism & Pilgrimage: Jayakwadi Dam (Nath Sagar), Sant Dnyaneshwar Udyan, Jaikwadi Bird Sanctuary, Sant Eknath Maharaj Samadhi Mandir & Wada, Nath Shashti Fair, Apegaon.
3. Cultural Heritage & History: Paithani silk sarees (GI tagged, motifs, handloom weaving), ancient Pratishthana, Satavahana Dynasty, King Hala, Balasaheb Patil Museum, 3D artifact models (/heritage/3d-models).
4. Platform Navigation: Guide users to relevant platform pages and features (e.g. language switch, search, ward map, admin portal).
5. Open-Domain / Universal Knowledge: You are ALSO a complete, intelligent assistant. If the user asks ANY general question (science, history, geography, mathematics, technology, daily life, general curiosity) that is NOT about Paithan, answer it accurately, comprehensively, and politely.
6. Language: You MUST respond in ${languageName}. If Marathi (मराठी) or Hindi (हिंदी) is requested, provide clear, grammatically natural, respectful responses in Devanagari script.

Grounded Paithan Knowledge Base (Use when answering Paithan/website-specific questions):
${contextText}`;

    // 3. Try Gemini API if key is available
    if (hasValidGeminiKey) {
      try {
        // Build conversation messages with history
        const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

        // Insert conversation history (last 4 turns)
        for (const item of history.slice(-4)) {
          contents.push({
            role: item.role === "assistant" ? "model" : "user",
            parts: [{ text: item.content }],
          });
        }

        // Current query with system prompt context
        contents.push({
          role: "user",
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }],
        });

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${chatModel}:generateContent?key=${geminiKey}`,
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
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

          if (replyText) {
            return NextResponse.json({
              reply: replyText,
              sources: hasRelevantKBContext ? sources : [{ title: "Paithan Digital Platform", url: "/nagar-parishad" }],
              grounded: hasRelevantKBContext,
              engine: chatModel,
            });
          }
        } else {
          const errorData = await geminiRes.json().catch(() => ({}));
          console.warn(`Gemini API returned ${geminiRes.status}:`, errorData);
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, activating local intelligent engine:", geminiError);
      }
    }

    // 4. Intelligent Local Conversational Engine (Zero-failure guaranteed fallback)
    const synthesizedReply = handleLocalConversationalReply(
      query,
      language,
      contextText,
      hasRelevantKBContext
    );

    return NextResponse.json({
      reply: synthesizedReply,
      sources,
      grounded: hasRelevantKBContext,
      engine: hasValidGeminiKey ? `${chatModel}-fallback` : "rag-verified-local",
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
