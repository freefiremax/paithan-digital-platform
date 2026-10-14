/** Names printed on the constituency map or supplied with the place images.
 * These must not be equated with municipal ward boundaries.
 */
const localities = [
  { name: "Islamapur (Islampur)", aliases: ["islamapur", "islampur", "islam pur", "इस्लामपूर", "इस्लामपुर"] },
  { name: "Abdulapur", aliases: ["abdulapur", "abdullapur", "अब्दुलापूर"] },
  { name: "Adgaon", aliases: ["adgaon", "adegaon", "आडगाव"] },
  { name: "Apegaon", aliases: ["apegaon", "आपेगाव"] },
  { name: "Balanagar", aliases: ["balanagar", "बालानगर"] },
  { name: "Chitegaon", aliases: ["chitegaon", "chitgaon", "चितेगाव"] },
  { name: "Dhangaon", aliases: ["dhangaon", "ढणगाव", "धनगाव"] },
  { name: "Dhupkheda", aliases: ["dhupkheda", "धुपखेडा"] },
  { name: "Khodegaon", aliases: ["khodegaon", "खोडेगाव"] },
  { name: "Kutub Kheda", aliases: ["kutub kheda", "kutu kheda", "kutubkheda", "कुतुबखेडा"] },
  { name: "Nandalgaon", aliases: ["nandalgaon", "nandegaon", "नांदलगाव"] },
  { name: "Pachod", aliases: ["pachod", "pachor", "पाचोड"] },
  { name: "Pimpalwadi", aliases: ["pimpalwadi", "पिंपळवाडी"] },
  { name: "Shevata", aliases: ["shevata", "शेवता"] },
  { name: "Sultanpur", aliases: ["sultanpur", "सुलतानपूर"] },
];

export function findChatbotLocality(query: string) {
  const normalized = query.toLowerCase().normalize("NFKC");
  return localities.find((place) => place.aliases.some((alias) => {
    const start = normalized.indexOf(alias);
    if (start < 0) return false;
    const before = normalized[start - 1];
    const after = normalized[start + alias.length];
    return (!before || !/[\p{L}\p{N}]/u.test(before)) && (!after || !/[\p{L}\p{N}]/u.test(after));
  }));
}

export function localityOverview(query: string, language: "en" | "mr" | "hi") {
  const place = findChatbotLocality(query);
  if (!place || !/^(tell\s+me\s+about|tell\s+about|about|what\s+is|where\s+is|describe|mala|.*बद्दल|.*के बारे)/i.test(query.trim())) return null;
  const introduction = language === "mr"
    ? `${place.name} हे पैठण परिसराच्या नकाशावर दाखवलेले ठिकाण आहे. हा विधानसभा मतदारसंघाचा नकाशा आहे; यावरून नगर परिषदेचा प्रभाग क्रमांक ठरवता येत नाही.`
    : language === "hi"
      ? `${place.name} पैठण क्षेत्र के नक्शे में दिखाया गया स्थान है। यह विधानसभा क्षेत्र का नक्शा है; इससे नगर परिषद का वार्ड नंबर तय नहीं किया जा सकता।`
      : `${place.name} is a locality shown on the Paithan area map. This map covers the assembly constituency; it does not establish municipal ward boundaries.`;
  const followup = language === "mr" ? "तुम्हाला येथे जाण्याचा मार्ग, इतिहास किंवा नागरी सेवांबद्दल माहिती हवी आहे? तपशीलवार स्थानिक नोंदी अद्याप सत्यापित नाहीत."
    : language === "hi" ? "आप रास्ते, इतिहास या नागरिक सेवाओं के बारे में जानना चाहते हैं? विस्तृत स्थानीय रिकॉर्ड अभी सत्यापित नहीं हैं."
    : "Would you like help with directions, history, or civic services? Detailed local records are not yet verified.";
  return { answer: `${introduction}\n\n${followup}`, name: place.name };
}
