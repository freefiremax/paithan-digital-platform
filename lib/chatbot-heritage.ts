import type { ChatHistoryItem, ChatLanguage } from "@/lib/gemini";

const EKNATH = /(?:\b(?:eknath|ekanath|eknaath)\b|एकनाथ)/i;
const FOLLOW_UP = /^(?:and\b|what about\b|tell me more\b|where is it\b|how to (?:visit|reach)\b|its\b|his\b|त्यांच|त्याचे|त्याबद्दल|और|उनके|उसके)/i;

/** Carry a subject only for an explicit follow-up, never for a new question. */
export function resolveHeritageQuery(query: string, history: ChatHistoryItem[]): string {
  if (EKNATH.test(query) || !FOLLOW_UP.test(query.trim())) return query;
  const lastUser = [...history].reverse().find((item) => item.role === "user" && !FOLLOW_UP.test(item.content.trim()));
  if (!lastUser || !EKNATH.test(lastUser.content)) return query;
  return /^(?:and\b|what about\b|tell me more\b)/i.test(query.trim())
    ? `Tell me about Sant Eknath ${query}`
    : `Sant Eknath ${query}`;
}

export function heritageAnswer(query: string, language: ChatLanguage) {
  if (!EKNATH.test(query)) return null;
  const simpleTopic = /^(?:(?:sant|saint|shri)\s+)?(?:eknath|ekanath|eknaath)(?:\s+(?:maharaj|mandir|wada|vada|samadhi|temple))*[?.!\s]*$/i.test(query.trim());
  if (!simpleTopic && !/^(?:tell\s+(?:me\s+)?(?:about|more)|about\b|describe\b|what\s+is\b|who\s+is\b|.*बद्दल|.*के बारे|.*माहिती)/i.test(query.trim())) return null;
  // Leave precise/current questions to grounded model synthesis.
  if (/\b(?:price|cost|fee|hours|timings|open|phone|contact)\b|वेळ|शुल्क|समय/i.test(query)) return null;
  const wada = /\b(?:wada|vada|residence|home|house)\b|वाडा|वाड़ा/i.test(query);
  const mandir = /\b(?:mandir|temple|samadhi)\b|मंदिर|समाधी|समाधि/i.test(query);
  const overview = language === "mr"
    ? "संत एकनाथ हे पैठणशी संबंधित वारकरी संत, कवी आणि समाजसुधारक होते. एकनाथी भागवत आणि भावार्थ रामायण हे त्यांचे प्रमुख ग्रंथ आहेत. त्यांच्या शिकवणीत भक्ती आणि सामाजिक समतेला महत्त्व आहे."
    : language === "hi"
      ? "संत एकनाथ पैठण से जुड़े वारकरी संत, कवि और समाजसुधारक थे। एकनाथी भागवत और भावार्थ रामायण उनकी प्रमुख रचनाएँ हैं। उनकी शिक्षाओं में भक्ति और सामाजिक समानता का महत्व है।"
      : "Sant Eknath was a Varkari saint, poet and social reformer associated with Paithan. His major works include the Eknathi Bhagavata and Bhavarth Ramayana. His teachings emphasised devotion and social equality.";
  const wadaText = language === "mr"
    ? "संत एकनाथ वाडा हे पैठणमधील त्यांच्या जीवनाशी संबंधित ऐतिहासिक निवासस्थान आहे. वाडा आणि समाधी मंदिर ही दोन वेगळी स्थळे आहेत."
    : language === "hi"
      ? "संत एकनाथ वाडा पैठण में उनके जीवन से जुड़ा ऐतिहासिक निवासस्थान है। वाडा और समाधि मंदिर अलग-अलग स्थल हैं।"
      : "Sant Eknath Wada is the historic residence associated with his life in Paithan. The wada and the Samadhi Mandir are distinct places.";
  const mandirText = language === "mr"
    ? "संत एकनाथ समाधी मंदिर हे पैठणमध्ये गोदावरी नदीकाठी असलेले श्रद्धास्थान आहे. भक्त येथे संत एकनाथांच्या स्मृतीला वंदन करण्यासाठी येतात."
    : language === "hi"
      ? "संत एकनाथ समाधि मंदिर पैठण में गोदावरी नदी के किनारे स्थित श्रद्धास्थल है। श्रद्धालु यहाँ संत एकनाथ की स्मृति को नमन करने आते हैं।"
      : "Sant Eknath Samadhi Mandir is a pilgrimage site on the Godavari riverfront in Paithan, where devotees honour the saint’s memory.";
  return { answer: [overview, ...(wada ? [wadaText] : []), ...(mandir ? [mandirText] : [])].join("\n\n"), sourceUrl: "/heritage/cultural-heritage" };
}
