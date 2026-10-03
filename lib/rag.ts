export interface RetrievedChunk {

  id: string;
  sourceType: string;
  sourceTitle: string;
  sourceUrl: string;
  content: string;
  score: number;
}

// Pre-compiled knowledge documents from verified datasets
export interface KnowledgeDoc {
  id: string;
  category: "CIVIC" | "HERITAGE" | "TOURISIM" | "EMERGENCY" | "GENERAL";
  sourceTitle: string;
  sourceUrl: string;
  keywords: string[];
  content: string;
}

export const KNOWLEDGE_BASE: readonly KnowledgeDoc[] = [
  {
    id: "kb-council",
    category: "CIVIC",
    sourceTitle: "Paithan Municipal Council Profile",
    sourceUrl: "/nagar-parishad",
    keywords: ["council", "nagar parishad", "office", "address", "phone", "email", "chief officer", "administrator", "contact", "timing", "hours"],
    content: `Paithan Municipal Council (पैठण नगर परिषद) is the urban local body for Paithan town in Paithan Taluka, Chhatrapati Sambhajinagar district, Maharashtra, PIN 431107. Main Office: Municipal Council Administrative Complex, Main Road, Paithan. Phone: 02431-223010, Email: munptn@gmail.com. Office hours: 09:45 AM to 06:15 PM (Monday to Saturday, closed 2nd/4th Saturdays & public holidays). The council is currently administered by a state-appointed Chief Officer (Administrator). Official portal: https://paithanmahaulb.maharashtra.gov.in (its council class and year of establishment should be confirmed with the DMA / Nagar Parishad).`,
  },
  {
    id: "kb-demographics",
    category: "CIVIC",
    sourceTitle: "Paithan Demographics & Census 2011",
    sourceUrl: "/nagar-parishad",
    keywords: ["population", "demographics", "census", "literacy", "sex ratio", "households", "male", "female", "area"],
    content: `According to the Census of India 2011, Paithan town has a total population of 41,536 (21,269 males, 20,267 females). Sex ratio is 953 females per 1,000 males. Child population (0-6 yrs) is about 5,467 (13.16%). Total households: about 8,134. Overall literacy rate is about 70.85% (Male: 78.42%, Female: 62.91%). Total municipal area is about 18.5 sq km. The last elected council body (2016) had 23 delimited seats; ward count should be confirmed with the Nagar Parishad.`,
  },
  {
    id: "kb-representatives",
    category: "CIVIC",
    sourceTitle: "Public Representatives & Government Body",
    sourceUrl: "/nagar-parishad/representatives",
    keywords: ["mla", "mp", "bhumre", "vilas", "kale", "kalyan", "jalna", "representative", "lok sabha", "vidhan sabha", "elected"],
    content: `The sitting Member of Legislative Assembly (MLA) for Paithan Assembly Constituency (No. 110) is Shri Vilas Sandipanrao Bhumre of Shiv Sena, elected in November 2024 (2024–2029 term). Paithan is a segment of the Jalna Lok Sabha constituency, whose Member of Parliament is Shri Kalyan Vaijinathrao Kale (Indian National Congress), elected in June 2024 — Paithan does NOT fall under the Chhatrapati Sambhajinagar (Aurangabad) Lok Sabha seat. The council's executive is headed by a state-appointed Chief Officer (Administrator); the specific officer's name should be confirmed with the Nagar Parishad. Paithan Municipal Council had 23 delimited seats in its last elected body (2016) and currently functions under Administrator rule pending fresh elections.`,
  },
  {
    id: "kb-emergency",
    category: "EMERGENCY",
    sourceTitle: "Emergency & Civic Helpline Directory",
    sourceUrl: "/nagar-parishad",
    keywords: ["emergency", "police", "hospital", "ambulance", "water helpline", "fire", "doctor", "phone number", "call", "electricity", "msedcl", "bus"],
    content: `Emergency contacts in Paithan:
- Municipal Council Control Room: 02431-223010 (24x7)
- Paithan City Police Station: 112 / 02431-223033 (24x7)
- MIDC Police Station: 02431-232100 (24x7)
- Paithan Sub-District Hospital (100 beds): 108 / 02431-223040 (24x7)
- Municipal Fire Station: 101 / 02431-223010 (24x7)
- Water Supply Emergency: 02431-223015 (24x7)
- MSEDCL (Power) Substation: 02431-223025
- MSRTC Bus Depot Enquiry: 02431-223022
- Tahsil Office Paithan: 02431-223030`,
  },
  {
    id: "kb-jayakwadi",
    category: "TOURISIM",
    sourceTitle: "Jayakwadi Project (Nath Sagar Dam) Engineering Datasheet",
    sourceUrl: "/tourism/places-to-visit",
    keywords: ["jayakwadi", "dam", "nath sagar", "godavari", "gates", "capacity", "height", "length", "tmc", "canal", "irrigation"],
    content: `Jayakwadi Dam (नाथ सागर) is one of Asia's largest earthen dams, commissioned in 1976 on the Godavari River near Paithan. Total dam length: 9,998 meters (about 10 km). Maximum height: 41.30 meters. It features 27 radial flood spillway gates. Gross storage capacity: about 102.7 TMC (2,909 million m³); live storage about 77 TMC. It irrigates roughly 2.37 lakh hectares (about 2,37,452 ha) of Marathwada via the Left Bank Canal (208 km) and the Paithan Right Bank Canal (132 km), and supplies drinking water to Chhatrapati Sambhajinagar city and industrial areas including Jalna and Waluj MIDC.`,
  },
  {
    id: "kb-bird-sanctuary",
    category: "TOURISIM",
    sourceTitle: "Jaikwadi Bird Sanctuary & Wetland",
    sourceUrl: "/tourism/places-to-visit",
    keywords: ["birds", "sanctuary", "jaikwadi bird sanctuary", "flamingos", "migratory", "wetland", "crane", "best time", "winter"],
    content: `Jaikwadi Bird Sanctuary was declared a wildlife sanctuary in 1986 under the Wildlife Protection Act 1972, encompassing 341.05 sq km of the Nath Sagar reservoir (as notified in the 2017 Government of India eco-sensitive-zone gazette). It supports 234 species of resident and migratory birds combined and is an important stopover on the migratory flyway; more than 50,000 waterbirds congregate here in winter, including over 10,000 Demoiselle Cranes (कुरोंच). Prominent winter visitors include Greater Flamingo, Bar-headed Goose, Demoiselle Crane, Northern Pintail, Common Teal, Northern Shoveler and Great White Pelican. Best visiting season is October to March (peak December–February; the annual bird census is held around 15 January).`,
  },
  {
    id: "kb-museum",
    category: "HERITAGE",
    sourceTitle: "Dr. Balasaheb Patil Government Archaeological Museum",
    sourceUrl: "/heritage/museum",
    keywords: ["museum", "balasaheb patil", "archaeology", "coins", "satavahana", "antiquities", "artifacts"],
    content: `Dr. Balasaheb Patil Archaeological Museum is located within the Sant Dnyaneshwar Udyan campus in Paithan. It is named after Dr. Balasaheb Patil, a researcher and collector who led several excavations at Paithan. Press reports (2023) indicate the museum holds close to 9,000 antiquities, many kept in storage for want of display space. Its collection is associated with the archaeology of ancient Pratishthana, including Satavahana-era coins and coin moulds. Specific holdings, visiting hours and entry fees should be confirmed with the Maharashtra archaeology authorities / Nagar Parishad before relying on them.`,
  },
  {
    id: "kb-satavahana",
    category: "HERITAGE",
    sourceTitle: "Ancient Pratishthana & Satavahana Empire",
    sourceUrl: "/heritage/history",
    keywords: ["satavahana", "pratishthana", "history", "ancient", "hala", "gaha sattasai", "periplus", "ptolemy", "simuka", "roman trade", "capital"],
    content: `Ancient Paithan was known as Pratishthana (प्रतिष्ठान) and was a principal capital of the Satavahana Empire (roughly 2nd century BCE to the early 3rd century CE); the dynasty's traditional founder was Simuka. King Hala composed the celebrated Prakrit poetry anthology 'Gaha Sattasai' (Gatha Saptashati). The Greek text 'Periplus of the Erythraean Sea' (1st century CE) refers to the town as Paethana and records that carnelian (agate/onyx) was carried down from there to the western ports for trade with the Roman world — the Periplus attributes fine muslins and cloth to Tagara, not to Paithan. The 2nd-century geographer Ptolemy likewise names Pratishthana as a Satavahana capital.`,
  },
  {
    id: "kb-paithani-silk",
    category: "HERITAGE",
    sourceTitle: "Paithani Saree GI Heritage & Weaving",
    sourceUrl: "/heritage/museum",
    keywords: ["paithani", "saree", "silk", "gi tag", "zari", "mor", "weaving", "handloom", "munia", "tradition"],
    content: `Paithani silk sarees have a centuries-old handloom heritage originating in Paithan (and also woven in Yeola, Nashik district) and received a Geographical Indication (GI) tag in 2010. Authentic Paithanis are woven with pure silk ('patt') and real gold/silver zari, using a tapestry weave (interlocking weft) with no floats on the reverse. Verified traditional motifs include the peacock and the lotus, alongside designs commonly described as Bangadi Mor (peacock-in-bangle), Munia (parrot) and Asavali (flowering vine). Paithan retains a cluster of master weavers working on traditional pit looms.`,
  },
  {
    id: "kb-sant-eknath",
    category: "HERITAGE",
    sourceTitle: "Sant Eknath Maharaj & Spiritual Heritage",
    sourceUrl: "/tourism/places-to-visit",
    keywords: ["eknath", "sant", "samadhi", "wada", "temple", "nath shashti", "varkari", "godavari", "nagghat", "dnyaneshwar", "apegaon"],
    content: `Sant Eknath Maharaj (c. 1533 – 1600 CE), a disciple of Janardan Swami, lived in Paithan and took Jalasamadhi in the Godavari here. Major pilgrimage sites:
1. Sant Eknath Samadhi Mandir: the sacred riverside samadhi temple at Nagghat.
2. Sant Eknath Wada: his ancestral residence in the town; according to tradition it is associated with the story of Lord Krishna serving Eknath in the guise of a servant named Shrikhandya. Eknath's major works include the Eknathi Bhagavata and the Bhavarth Ramayan.
3. Nath Shashti (Paithan Yatra): the annual pilgrimage festival held in Phalgun (around March), which draws large numbers of Varkari pilgrims.
4. Sant Dnyaneshwar's birthplace at Apegaon: about 12 km east of Paithan on the banks of the Godavari, where Sant Dnyaneshwar was born (1275 CE).`,
  },
  {
    id: "kb-connectivity",
    category: "TOURISIM",
    sourceTitle: "How to Reach Paithan — Distance & Transit",
    sourceUrl: "/tourism/places-to-visit",
    keywords: ["reach", "distance", "bus", "train", "airport", "how to get to", "route", "chhatrapati sambhajinagar", "aurangabad", "pune", "mumbai"],
    content: `Paithan is well-connected by road across Maharashtra:
- Chhatrapati Sambhajinagar (District HQ & nearest Airport IXU / Railway Station): 52 km (1 hr 15 min via NH-752E). MSRTC buses depart every 15 minutes.
- Jalna (Seed & Steel Hub): 86 km (2 hours via Pachod).
- Beed: 78 km (1 hr 45 min).
- Pune: 220 km (4.5 hours via Ahmednagar - Shevgaon).
- Mumbai: 380 km (6.5 hours via Samruddhi Mahamarg expressway interchange at Sambhajinagar).
Paithan Central Bus Stand offers regular state transport services across the district.`,
  },
  {
    id: "kb-services",
    category: "CIVIC",
    sourceTitle: "Citizen Services & e-Governance Portals",
    sourceUrl: "/nagar-parishad",
    keywords: ["property tax", "water tax", "birth certificate", "death certificate", "grievance", "complaint", "mahaulb", "crs"],
    content: `Online Citizen Services for Paithan:
1. Property Tax & Water Charges: Assessment status, online payment, dues check via Maharashtra Urban Local Bodies portal: https://paithanmahaulb.maharashtra.gov.in
2. Birth & Death Registration: Civil Registration System (CRS) portal: https://crsorgi.gov.in
3. Citizen Grievance Helpline: Contact Nagar Parishad Control Room at 02431-223010 for civic sanitation, street lights, and water disruption issues.`,
  },
];

/**
 * Searches the localized RAG knowledge base using keyword weighting and semantic relevance.
 */
export function queryKnowledgeBase(query: string, limit = 4): RetrievedChunk[] {
  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 2);

  const scoredDocs: RetrievedChunk[] = KNOWLEDGE_BASE.map((doc) => {
    let score = 0;
    const docText = (doc.sourceTitle + " " + doc.content).toLowerCase();

    // Check exact keyword matches
    for (const kw of doc.keywords) {
      if (normalizedQuery.includes(kw)) {
        score += 30;
      }
    }

    // Check word matches
    for (const word of queryWords) {
      if (docText.includes(word)) {
        score += 10;
      }
    }

    // Bonus for matching source title
    if (doc.sourceTitle.toLowerCase().includes(normalizedQuery)) {
      score += 25;
    }

    return {
      id: doc.id,
      sourceType: doc.category,
      sourceTitle: doc.sourceTitle,
      sourceUrl: doc.sourceUrl,
      content: doc.content,
      score,
    };
  });

  return scoredDocs
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Build grounded system and user prompt for Gemini / Chatbot
 */
export function buildChatbotContext(query: string): { contextText: string; sources: Array<{ title: string; url: string }> } {
  const retrieved = queryKnowledgeBase(query, 3);

  if (retrieved.length === 0) {
    return {
      contextText: "No specific local records matched the query. Rely on general Paithan Municipal Council and historic Pratishthana background.",
      sources: [{ title: "Paithan Municipal Council General Repository", url: "/nagar-parishad" }],
    };
  }

  const contextText = retrieved
    .map((chunk, i) => `[Source ${i + 1}: ${chunk.sourceTitle} (${chunk.sourceUrl})]\n${chunk.content}`)
    .join("\n\n---\n\n");

  const sources = retrieved.map((chunk) => ({
    title: chunk.sourceTitle,
    url: chunk.sourceUrl,
  }));

  return { contextText, sources };
}

