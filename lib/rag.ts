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
    keywords: ["council", "nagar parishad", "office", "address", "phone", "email", "established", "1854", "chief officer", "santosh dagdu agle", "contact", "timing", "hours"],
    content: `Paithan Municipal Council (पैठण नगर परिषद) was established in 1854 (Class 'C' council). It is situated in Paithan Taluka, Chhatrapati Sambhajinagar district, Maharashtra, PIN 431107. Main Office: Municipal Council Administrative Complex, Main Road, Paithan. Phone: 02431-223010, Email: munptn@gmail.com. Office hours: 09:45 AM to 06:15 PM (Monday to Saturday, closed 2nd/4th Saturdays & public holidays). Chief Officer: Shri Santosh Dagdu Agle. Official portal: https://paithanmahaulb.maharashtra.gov.in`,
  },
  {
    id: "kb-demographics",
    category: "CIVIC",
    sourceTitle: "Paithan Demographics & Census 2011",
    sourceUrl: "/nagar-parishad",
    keywords: ["population", "demographics", "census", "literacy", "sex ratio", "households", "male", "female", "area"],
    content: `According to the Census of India, Paithan Municipal Council has a total population of 41,536 (21,269 males, 20,267 females). Sex ratio is 953 females per 1,000 males. Child population (0-6 yrs) is 5,467 (13.16%). Total households: 8,134. Overall literacy rate is 70.85% (Male literacy: 78.42%, Female literacy: 62.91%). Total municipal area: 18.5 sq km with 17 administrative wards.`,
  },
  {
    id: "kb-representatives",
    category: "CIVIC",
    sourceTitle: "Public Representatives & Government Body",
    sourceUrl: "/nagar-parishad/representatives",
    keywords: ["mla", "mp", "bhumre", "vilas", "sandipanrao", "representative", "lok sabha", "vidhan sabha", "elected"],
    content: `Sitting Member of Legislative Assembly (MLA) for Paithan Assembly Constituency (No. 107) is Shri Vilas Sandipanrao Bhumre (elected Nov 2024 for 2024-2029 term). Sitting Member of Parliament (MP) for Jalna/Chhatrapati Sambhajinagar Lok Sabha is Shri Sandipanrao Bhumre (elected June 2024 for 2024-2029 term). Chief Officer is Santosh Dagdu Agle. Paithan has 17 administrative wards represented by municipal corporators (Nagar Sevaks).`,
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
    keywords: ["jayakwadi", "dam", "nath sagar", "godavari", "gates", "capacity", "height", "length", "tmc", "canal", "irrigation", "indira gandhi"],
    content: `Jayakwadi Dam (नाथ सागर) is one of Asia's largest earthen dams, commissioned in 1976 by Prime Minister Indira Gandhi on the sacred Godavari River. Total dam length: 9,998 meters (9.998 km). Maximum height: 41.30 meters. It features 27 radial flood spillway gates (each 12.5m x 7.9m). Gross storage capacity: 102.7 TMC (2,909 million m³); live storage: 76.6 TMC. Irrigates 2,40,000 hectares across 5 Marathwada districts via Left Bank Canal (208 km) and Majalgaon Right Canal (132 km). It provides drinking water to Chhatrapati Sambhajinagar City, Jalna MIDC, Waluj MIDC, and AURIC DMIC Mega City.`,
  },
  {
    id: "kb-bird-sanctuary",
    category: "TOURISIM",
    sourceTitle: "Jaikwadi Bird Sanctuary & Wetland",
    sourceUrl: "/tourism/places-to-visit",
    keywords: ["birds", "sanctuary", "jaikwadi bird sanctuary", "flamingos", "migratory", "wetland", "crane", "best time", "winter"],
    content: `Jaikwadi Bird Sanctuary was declared a wildlife sanctuary in 1986 under the Wildlife Protection Act 1972, encompassing 341.05 sq km of the Nath Sagar reservoir. It hosts over 234 bird species, including 78 migratory species arriving via the Central Asian Flyway. Prominent winter visitors: Greater Flamingo (flocks of up to 10,000+), Demoiselle Crane (कुरोंच), Bar-headed Goose, Brahminy Shelduck (चक्रवाक), Northern Pintail, Glossy Ibis, and Osprey. Best visiting season is October to March (peak in December-February).`,
  },
  {
    id: "kb-museum",
    category: "HERITAGE",
    sourceTitle: "Dr. Balasaheb Patil Government Archaeological Museum",
    sourceUrl: "/heritage/museum",
    keywords: ["museum", "balasaheb patil", "archaeology", "coins", "satavahana", "antiquities", "artifacts", "shivaji rajpatra", "terracotta"],
    content: `Dr. Balasaheb Patil Government Archaeological Museum is located inside the Sant Dnyaneshwar Udyan campus in Paithan. Inaugurated in 1997, it houses over 9,000 antiquities collected by Dr. Balasaheb Patil (1950-1987) and donated to the Maharashtra State Directorate of Archaeology. Highlights include: ancient Satavahana lead, potin and copper coins (King Simuka, Satakarni I, Gautamiputra Satakarni); Roman amphorae fragments demonstrating Greco-Roman trade with ancient Pratishthana; Megalithic carnelian beads; terracotta mother goddesses; an original 17th-century Rajpatra (royal edict) of Chhatrapati Shivaji Maharaj; and Maratha weaponry. Open 10:30 AM to 05:00 PM (closed Mondays). Entry: ₹10 (adults), ₹5 (children).`,
  },
  {
    id: "kb-satavahana",
    category: "HERITAGE",
    sourceTitle: "Ancient Pratishthana & Satavahana Empire",
    sourceUrl: "/heritage/history",
    keywords: ["satavahana", "pratishthana", "history", "ancient", "hala", "gaha sattasai", "periplus", "roman trade", "capital"],
    content: `Ancient Paithan was known as Pratishthana (प्रतिष्ठान). From the 2nd century BCE to 2nd century CE, it served as the glorious imperial capital of the Satavahana Empire (Andhrabhrityas). King Hala composed the celebrated Prakrit poetry anthology 'Gaha Sattasai' (गाथा सप्तशती) here. Greek geographical text 'Periplus of the Erythraean Sea' (1st century CE) mentions Pratishthana as a premier inland trade metropolis exporting onyx, fine muslins, and silks to Rome via ports at Kalyan, Sopara, and Bharuch.`,
  },
  {
    id: "kb-paithani-silk",
    category: "HERITAGE",
    sourceTitle: "Paithani Saree GI Heritage & Weaving",
    sourceUrl: "/heritage/museum",
    keywords: ["paithani", "saree", "silk", "gi tag", "zari", "mor", "weaving", "handloom", "munia", "tradition"],
    content: `Paithani Silk Sarees have a 2,000-year-old unbroken handloom heritage originating in Paithan and received Geographical Indication (GI Tag #84, Class 24 & 25) in 2010. Authentic Paithanis are woven with pure mulberry silk ('patt') and pure silver/gold electroplated zari. They use a unique tapestry weave (interlocking weft technique) without floats on the reverse side. Traditional motifs include: Bangadi Mor (peacock in bangle), Munia (parrot), Asavali (flowering vine), Kamal (lotus), Koyari (paisley/mango), and Narali (coconut) border. Paithan has a master weavers cluster with pit looms in Weavers Colony.`,
  },
  {
    id: "kb-sant-eknath",
    category: "HERITAGE",
    sourceTitle: "Sant Eknath Maharaj & Spiritual Heritage",
    sourceUrl: "/tourism/places-to-visit",
    keywords: ["eknath", "sant", "samadhi", "wada", "temple", "nath shashti", "varkari", "godavari", "nagghat", "dnyaneshwar", "apegaon"],
    content: `Sant Eknath Maharaj (1533–1599 CE) lived and attained Jalsamadhi in Paithan on the banks of Godavari River. Major pilgrimage sites:
1. Sant Eknath Samadhi Mandir: Sacred riverside samadhi temple at Nagghat.
2. Sant Eknath Wada: Ancestral 400-year-old wooden residence in town; houses the pillar touched by Lord Krishna (in disguise as Shrikhandya), sacred manuscripts of Eknathi Bhagavata and Bhavartha Ramayana.
3. Nath Shashti Mahotsav: Annual 3-day pilgrimage festival on Phalguna Vadya Shashti (March) attracting 500,000+ Varkari pilgrims.
4. Sant Dnyaneshwar Birthplace at Apegaon: 12 km east of Paithan on the Godavari banks; where Dnyaneshwar Maharaj was born, later receiving his Shuddhipatra from Paithan's learned Brahmins.`,
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

