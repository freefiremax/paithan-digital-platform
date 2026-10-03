export interface RetrievedChunk {
  id: string;
  sourceType: string;
  sourceTitle: string;
  sourceUrl: string;
  content: string;
  score: number;
}

export interface KnowledgeDoc {
  id: string;
  category: "CIVIC" | "HERITAGE" | "TOURISIM" | "EMERGENCY" | "SERVICES" | "WEBSITE" | "GENERAL";
  sourceTitle: string;
  sourceUrl: string;
  keywords: string[];
  content: string;
}

export const KNOWLEDGE_BASE: readonly KnowledgeDoc[] = [
  // 1. Council & Administration
  {
    id: "kb-council",
    category: "CIVIC",
    sourceTitle: "Paithan Municipal Council Profile & Office",
    sourceUrl: "/nagar-parishad",
    keywords: [
      "council", "nagar parishad", "office", "address", "phone", "email", "chief officer", 
      "administrator", "contact", "timing", "hours", "headquarters", "administrative complex",
      "नगर परिषद", "कार्यालय", "पत्ता", "फोन", "वेळ", "मुख्याधिकारी", "प्रशासक"
    ],
    content: `Paithan Municipal Council (पैठण नगर परिषद) is the urban local government body governing Paithan town in Chhatrapati Sambhajinagar district, Maharashtra (PIN: 431107).
- Main Office: Municipal Council Administrative Complex, Main Road, Paithan - 431107.
- Official Phone: 02431-223010 / 02431-223033
- Official Email: munptn@gmail.com
- Working Hours: 09:45 AM to 06:15 PM (Monday to Saturday; Closed on 2nd & 4th Saturdays, Sundays, and public gazetted holidays).
- Administrative Status: The council's executive administration is currently headed by a state-appointed Chief Officer (Administrator).
- Official State Portal: https://paithanmahaulb.maharashtra.gov.in`,
  },

  // 2. Representatives & Governance
  {
    id: "kb-representatives",
    category: "CIVIC",
    sourceTitle: "Elected Public Representatives & Constituency",
    sourceUrl: "/nagar-parishad/representatives",
    keywords: [
      "mla", "mp", "bhumre", "vilas", "kale", "kalyan", "jalna", "representative", 
      "lok sabha", "vidhan sabha", "constituency", "elected", "nagar sevak", "corporator",
      "आमदार", "खासदार", "भुमरे", "काळे", "लोकसभा", "विधानसभा", "नगरसेवक"
    ],
    content: `Elected Representatives for Paithan:
1. Member of Legislative Assembly (MLA): Shri Vilas Sandipanrao Bhumre (Shiv Sena), representing Paithan Vidhan Sabha Constituency No. 110 (elected in November 2024 for the 2024–2029 term).
2. Member of Parliament (MP): Shri Kalyan Vaijinathrao Kale (Indian National Congress), representing the Jalna Lok Sabha Constituency (Paithan is an assembly segment of Jalna Lok Sabha seat, not Sambhajinagar Lok Sabha).
3. Local Municipal Body: Paithan Municipal Council comprises 17 wards (delimited seats). Pending municipal general elections, day-to-day governance is managed by the Chief Officer / Administrator.`,
  },

  // 3. Demographics & Geography
  {
    id: "kb-demographics",
    category: "CIVIC",
    sourceTitle: "Paithan Demographics, Wards & Census Data",
    sourceUrl: "/nagar-parishad",
    keywords: [
      "population", "demographics", "census", "literacy", "sex ratio", "households", 
      "wards", "area", "geography", "pin code", "लोकसंख्या", "प्रभाग", "क्षेत्रफळ", "साक्षरता"
    ],
    content: `Paithan Demographics & Geographical Highlights:
- District: Chhatrapati Sambhajinagar (formerly Aurangabad), Marathwada region, Maharashtra.
- PIN Code: 431107 | STD Code: 02431
- Population (Census of India): 41,536 residents (21,269 males, 20,267 females).
- Total Households: ~8,134.
- Sex Ratio: 953 females per 1,000 males.
- Literacy Rate: 70.85% (Male: 78.42%, Female: 62.91%).
- Municipal Geographic Area: 18.5 sq km situated on the banks of the sacred Godavari River.
- Municipal Wards: Divided into 17 administrative wards including Nagghat, Eknath Samadhi Area, Bazar Peth, Shivaji Chowk, Datta Nagar, Kazi Mohalla, and Jayakwadi Colony.`,
  },

  // 4. Online Citizen Services (Taxes, Certificates, Licenses)
  {
    id: "kb-services",
    category: "SERVICES",
    sourceTitle: "Citizen Services & Online Municipal Portals",
    sourceUrl: "/services",
    keywords: [
      "property tax", "water tax", "birth certificate", "death certificate", "marriage certificate",
      "trade license", "building permission", "noc", "tax payment", "online service", "mahaulb", "crs",
      "घरपट्टी", "पाणीपट्टी", "जन्म दाखला", "मृत्यू दाखला", "विवाह नोंदणी", "कर भरणा", "दाखले"
    ],
    content: `Municipal Citizen Services available for Paithan residents:
1. Property Tax & Water Bill Payment: Check assessments and pay taxes online via the Maharashtra Urban Local Bodies portal: https://paithanmahaulb.maharashtra.gov.in
2. Birth & Death Certificates: Apply for and download verified digital certificates through the Civil Registration System (CRS): https://crsorgi.gov.in or visit the Paithan Municipal Council Suvidha Kendra.
3. Marriage Registration: Register marriages at the municipal council office with required affidavits and witness proof.
4. Trade Licenses & Building NOCs: Submit online building sanction plans and shop establishment licenses via the MahaULB portal.
5. Suvidha Citizen Facilitation Center: Located at Municipal Council Ground Floor, Open Mon-Sat 10:00 AM - 05:00 PM.`,
  },

  // 5. Citizen Grievance Portal
  {
    id: "kb-grievances",
    category: "SERVICES",
    sourceTitle: "Citizen Grievance Redressal & Complaint Tracking",
    sourceUrl: "/grievances/new",
    keywords: [
      "grievance", "complaint", "track complaint", "pothole", "garbage", "drainage", 
      "street light", "water disruption", "sanitation", "तक्रार", "तक्रार नोंदणी", "कचरा", "रस्ते", "पाणी समस्या"
    ],
    content: `Citizen Grievance Portal on Paithan Digital Platform:
- Register a Complaint: Go to '/grievances/new' to log issues regarding Sanitation, Water Supply, Street Lighting, Drainage/Sewage, Road Potholes, or Garbage Collection.
- Track Complaint Status: Visit '/grievances/track' and enter your grievance tracking token number.
- Resolution Timeline: Civic issues are categorized by priority with standard resolution targets between 24 and 72 hours.
- Emergency Grievance Helpline: Call the Municipal Control Room 24x7 at 02431-223010.`,
  },

  // 6. Emergency Helpline Directory
  {
    id: "kb-emergency",
    category: "EMERGENCY",
    sourceTitle: "24x7 Emergency Helplines & Health Directory",
    sourceUrl: "/nagar-parishad",
    keywords: [
      "emergency", "police", "hospital", "ambulance", "fire", "doctor", "helpline", 
      "electricity", "msedcl", "bus", "disaster", "आपत्कालीन", "पोलीस", "रुग्णालय", "अग्निशामक", "रुग्णवाहिका"
    ],
    content: `Paithan 24x7 Emergency Directory:
- Municipal Control Room: 02431-223010
- Paithan City Police Station: 112 / 02431-223033
- MIDC Police Station: 02431-232100
- Paithan Sub-District Hospital (100 Beds): 108 / 02431-223040
- Municipal Fire Brigade: 101 / 02431-223010
- Water Supply Emergency: 02431-223015
- MSEDCL (Power / Mahavitaran): 02431-223025 / 1912
- MSRTC Paithan Bus Depot: 02431-223022
- Tahsil Office Paithan: 02431-223030
- Women Helpline: 1091 | Child Helpline: 1098`,
  },

  // 7. Jayakwadi Dam (Nath Sagar)
  {
    id: "kb-jayakwadi",
    category: "TOURISIM",
    sourceTitle: "Jayakwadi Project (Nath Sagar Dam) Engineering & Tourism",
    sourceUrl: "/tourism/jayakwadi",
    keywords: [
      "jayakwadi", "dam", "nath sagar", "godavari", "gates", "capacity", "height", "length", 
      "tmc", "canal", "irrigation", "water reservoir", "धरण", "जायकवाडी", "नाथसागर", "गोदावरी"
    ],
    content: `Jayakwadi Dam (नाथ सागर जलाशय) — Engineering Marvel on the Godavari:
- Commissioned: 1976 (Inaugurated by Prime Minister Indira Gandhi).
- Scale: One of Asia's largest earthen dams with a total length of 9,998 meters (~10 km) and a height of 41.30 meters.
- Spillway: 27 massive radial flood spillway gates.
- Storage: Gross capacity of 102.7 TMC (2,909 million m³), live storage 77 TMC.
- Purpose: Irrigates over 2.37 lakh hectares across Marathwada via Left Bank Canal (208 km) and Right Bank Canal (132 km), and supplies drinking water to Chhatrapati Sambhajinagar, Jalna, and major industrial hubs (Waluj & Shendra MIDC).
- Visitor Attraction: Offers breathtaking panoramic sunset views over the reservoir and scenic walking pathways.`,
  },

  // 8. Jaikwadi Bird Sanctuary
  {
    id: "kb-bird-sanctuary",
    category: "TOURISIM",
    sourceTitle: "Jaikwadi Bird Sanctuary & Wetland",
    sourceUrl: "/tourism/places-to-visit",
    keywords: [
      "birds", "sanctuary", "jaikwadi bird sanctuary", "flamingos", "migratory", "wetland", 
      "crane", "best time", "winter", "birdwatching", "पक्षी", "अभयारण्य", "फ्लेमिंगो", "कुरुंच"
    ],
    content: `Jaikwadi Bird Sanctuary (नाथसागर पक्षी अभयारण्य):
- Notification: Declared a Wildlife Sanctuary in 1986 under the Wildlife Protection Act, covering 341.05 sq km of the Nath Sagar reservoir.
- Avian Diversity: Home to over 234 resident and migratory bird species. In winter, over 50,000 waterbirds congregate here.
- Prominent Migratory Visitors: Greater Flamingos, Demoiselle Cranes (कुरोंच - over 10,000 birds), Bar-headed Geese, Northern Pintails, Common Teals, Northern Shovelers, and Great White Pelicans.
- Best Time to Visit: October to March (peak bird activity in December to February). The annual bird census is conducted every year around January 15.`,
  },

  // 9. Sant Dnyaneshwar Udyan & Musical Garden
  {
    id: "kb-dnyaneshwar-udyan",
    category: "TOURISIM",
    sourceTitle: "Sant Dnyaneshwar Udyan & Musical Fountains",
    sourceUrl: "/tourism/places-to-visit",
    keywords: [
      "dnyaneshwar udyan", "garden", "musical fountain", "fountain", "park", "kids", 
      "boating", "vrindavan", "light show", "ज्ञानदेव उद्यान", "संत ज्ञानेश्वर उद्यान", "कारंजे", "बगीचा"
    ],
    content: `Sant Dnyaneshwar Udyan (संत ज्ञानेश्वर उद्यान):
- Description: Sprawling garden located at the foot of Jayakwadi Dam, modeled along the lines of the famous Brindavan Gardens of Mysore.
- Area: Spread across more than 124 hectares of lush landscaped flora, tree avenues, and colorful flowerbeds.
- Highlights: Musical color-lit dancing fountains, evening laser illumination shows, recreational boating pond, expansive children's amusement park, and green nursery.
- Timings: Open daily from 10:00 AM to 08:00 PM. Evening musical fountain shows typically run from 06:30 PM to 07:45 PM.`,
  },

  // 10. Sant Eknath Maharaj & Spiritual Heritage
  {
    id: "kb-sant-eknath",
    category: "HERITAGE",
    sourceTitle: "Sant Eknath Maharaj, Samadhi Mandir & Spiritual Sites",
    sourceUrl: "/heritage/cultural-heritage",
    keywords: [
      "eknath", "sant", "samadhi", "wada", "temple", "nath shashti", "varkari", "godavari", 
      "nagghat", "dnyaneshwar", "apegaon", "bhagavata", "राम कृष्ण हरी", "संत एकनाथ", "समाधी", "वाडा", "नाथषष्ठी"
    ],
    content: `Spiritual Legacy of Sant Eknath Maharaj (1533–1600 CE):
- Life & Legacy: Celebrated Varkari saint, scholar, and social reformer who preached equality and composed the monumental 'Eknathi Bhagavata' and 'Bhavarth Ramayana'.
- Major Sacred Sites in Paithan:
  1. Sant Eknath Samadhi Mandir: The holy riverside shrine at Nagghat on the banks of Godavari, where Sant Eknath took Jalasamadhi.
  2. Sant Eknath Wada: His ancestral 400-year-old residence containing sacred artifacts, including the historic stone water trough linked with Lord Krishna serving as 'Shrikhandya'.
  3. Nath Shashti Mahotsav (Paithan Yatra): Major annual pilgrimage festival held during Phalgun Vadya Shashti (February/March), drawing hundreds of thousands of Varkari pilgrims.
  4. Sant Dnyaneshwar Birthplace (Apegaon): Situated 12 km east of Paithan on the Godavari banks, where Sant Dnyaneshwar, Nivruttinath, Sopandev, and Muktabai were born in 1275 CE.`,
  },

  // 11. Ancient Pratishthana & Satavahana History
  {
    id: "kb-satavahana",
    category: "HERITAGE",
    sourceTitle: "Ancient Pratishthana & Satavahana Empire History",
    sourceUrl: "/heritage/history",
    keywords: [
      "satavahana", "pratishthana", "history", "ancient", "hala", "gaha sattasai", "periplus", 
      "ptolemy", "simuka", "gautamiputra", "roman trade", "capital", "इतिहास", "सातवाहन", "प्रतिष्ठान"
    ],
    content: `Ancient Pratishthana (Paithan) — Imperial Capital of the Satavahanas:
- Capital of Empire: From the 2nd century BCE to 3rd century CE, Pratishthana served as the grand imperial capital of the powerful Satavahana Dynasty founded by King Simuka and ruled by legendary monarchs such as Gautamiputra Satakarni and King Hala.
- Literature & Culture: King Hala compiled the famous Maharashtri Prakrit poetic masterpiece 'Gaha Sattasai' (Gatha Saptashati) here.
- Global Maritime Trade: Greek maritime text 'Periplus of the Erythraean Sea' (1st century CE) and geographer Ptolemy document Paethana (Pratishthana) as a flourishing global trade emporium exporting carnelian stones, agates, onyx, and beads to ancient Rome and the Mediterranean world.`,
  },

  // 12. Paithani Silk Sarees & Handloom Weaving
  {
    id: "kb-paithani-silk",
    category: "HERITAGE",
    sourceTitle: "Paithani Saree GI Heritage, Weaving Art & Motifs",
    sourceUrl: "/heritage/cultural-heritage",
    keywords: [
      "paithani", "saree", "silk", "gi tag", "zari", "mor", "weaving", "handloom", "munia", 
      "tradition", "narali", "asavali", "पैठणी", "साडी", "रेशीम", "हातमाग", "जरी"
    ],
    content: `Paithani Silk Saree — 'Queen of Silks' (GI Tagged Heritage):
- Geographical Indication: Awarded official GI Tag protection in 2010 recognizing Paithan's 2,000-year-old weaving lineage.
- Craftsmanship: Woven by master artisans on traditional handlooms using 100% pure natural silk threads ('patt') and authentic gold/silver metallic zari.
- Signature Technique: Uses interlocking tapestry weave (dobby/interlocking weft) ensuring the design is completely identical on both the front and reverse sides with zero hanging floats.
- Iconic Motifs: Bangadi Mor (peacock in bangle), Munia (parrot), Asavali (flowering vine), Kamal (lotus), and Narali (coconut border).
- Purchasing Authentic Paithani: Available directly from master weaver cooperative workshops and government handloom centers in Paithan.`,
  },

  // 13. Dr. Balasaheb Patil Archaeological Museum
  {
    id: "kb-museum",
    category: "HERITAGE",
    sourceTitle: "Dr. Balasaheb Patil Government Archaeological Museum",
    sourceUrl: "/heritage/museum",
    keywords: [
      "museum", "balasaheb patil", "archaeology", "coins", "satavahana", "antiquities", 
      "artifacts", "terracotta", "वस्तुसंग्रहालय", "नाणी", "पुरातत्त्व"
    ],
    content: `Dr. Balasaheb Patil Archaeological Museum (पुरातत्त्व संग्रहालय):
- Location: Within the Sant Dnyaneshwar Udyan complex, Paithan.
- Collection: Houses an extraordinary repository of over 9,000 ancient antiquities excavated from the soil of ancient Pratishthana.
- Exhibits: Satavahana lead, potin, and copper coins; Satavahana coin moulds; Roman clay bullae; terracotta figurines; Kaolin pottery; Megalithic weapons; semi-precious carnelian and agate beads; and medieval stone sculptures.
- Exploration on Platform: Explore interactive 3D virtual models of excavated artifacts directly at '/heritage/3d-models'.`,
  },

  // 14. Travel, Distance & Connectivity
  {
    id: "kb-connectivity",
    category: "TOURISIM",
    sourceTitle: "How to Reach Paithan — Routes, Distance & Transit",
    sourceUrl: "/tourism/routes",
    keywords: [
      "reach", "distance", "bus", "train", "airport", "route", "chhatrapati sambhajinagar", 
      "aurangabad", "pune", "mumbai", "jalna", "कसे जावे", "अंतर", "बस", "रेल्वे", "विमानतळ"
    ],
    content: `How to Reach Paithan (Travel & Transit Guide):
- From Chhatrapati Sambhajinagar (District HQ): 52 km (1 hr 15 min via NH-752E). MSRTC state transport buses operate every 15 minutes from Sambhajinagar Central Bus Stand.
- Nearest Airport: Chhatrapati Sambhajinagar Airport (IXU) - 55 km away with direct flights to Mumbai, Delhi, Hyderabad, and Bengaluru.
- Nearest Railway Station: Chhatrapati Sambhajinagar Railway Station (CSN) - 52 km.
- From Jalna: 86 km (approx 2 hours via Pachod).
- From Beed: 78 km (approx 1 hr 45 min).
- From Pune: 220 km (approx 4.5 hours via Ahmednagar - Shevgaon).
- From Mumbai: 380 km (approx 6.5 hours via Samruddhi Mahamarg Expressway).
- Local Transit: Auto rickshaws, town taxis, and municipal buses connect all major ghats, temples, and gardens.`,
  },

  // 15. Platform Features & Website Guide
  {
    id: "kb-website",
    category: "WEBSITE",
    sourceTitle: "Paithan Digital Platform Navigation & Features",
    sourceUrl: "/sitemap",
    keywords: [
      "website", "portal", "platform", "features", "3d models", "map", "ward map", "language",
      "marathi", "hindi", "english", "admin", "search", "sitemap", "वेबसाईट", "वैशिष्ट्ये"
    ],
    content: `Paithan Digital Platform Web Portal Guide:
- Language Switching: Change language between English, Marathi (मराठी), and Hindi (हिंदी) anytime using the top navigation bar language toggle.
- 3D Heritage Artifacts: Experience interactive 3D scans of ancient Satavahana coins, sculptures, and terracotta relics at '/heritage/3d-models'.
- 17-Ward Interactive Map: View ward boundaries, council amenities, and local development works at '/nagar-parishad/ward-map'.
- Citizen Grievances: File complaints at '/grievances/new' and track live resolution status at '/grievances/track'.
- Municipal Projects & Works: Explore real-time infrastructure, water, and road works at '/nagar-parishad/development-works'.
- Comprehensive Search: Use the global search bar in the header or navigate to '/search' to find any municipal document or tourist destination.
- Admin Portal: Municipal administrators can log in at '/admin/login' to manage public notices, tenders, and verify grievance resolutions.`,
  },
];

/**
 * Normalizes query string for enhanced multilingual (English, Marathi, Hindi) search.
 */
function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

/**
 * Searches the localized RAG knowledge base using multi-keyword semantic and lexical scoring.
 */
export function queryKnowledgeBase(query: string, limit = 4): RetrievedChunk[] {
  const normalizedQuery = query.toLowerCase().trim();
  const tokens = tokenizeQuery(query);

  const scoredDocs: RetrievedChunk[] = KNOWLEDGE_BASE.map((doc) => {
    let score = 0;
    const docText = (doc.sourceTitle + " " + doc.content).toLowerCase();

    // 1. Exact phrase match in source title or content
    if (doc.sourceTitle.toLowerCase().includes(normalizedQuery)) {
      score += 40;
    }
    if (docText.includes(normalizedQuery)) {
      score += 25;
    }

    // 2. Keyword matches
    for (const kw of doc.keywords) {
      const kwLower = kw.toLowerCase();
      if (normalizedQuery.includes(kwLower)) {
        score += 35;
      }
      for (const token of tokens) {
        if (kwLower === token || (token.length > 3 && kwLower.includes(token))) {
          score += 15;
        }
      }
    }

    // 3. Token matches in document text
    for (const token of tokens) {
      if (docText.includes(token)) {
        score += 8;
      }
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
  const retrieved = queryKnowledgeBase(query, 4);

  if (retrieved.length === 0) {
    return {
      contextText: "No specific local municipal chunks matched this exact keyword. Provide helpful municipal or general assistance.",
      sources: [
        { title: "Paithan Municipal Council Portal", url: "/nagar-parishad" },
        { title: "Tourism & Heritage Guide", url: "/tourism" },
      ],
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
