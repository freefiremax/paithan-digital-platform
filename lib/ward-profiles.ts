/** Editorial locality descriptions; ward boundaries still require council confirmation. */
const descriptions = [
  "Explore the Brahmapuri mound and old fort precinct, a locality associated with Paithan’s archaeological heritage. Confirm access and conservation restrictions before planning a visit.",
  "This locality centres on the Sant Eknath Samadhi Mandir and its approach road. Visitors can use the tourism directory to plan a temple visit and the civic services pages for local assistance.",
  "The Nagghat locality connects the Godavari riverfront with Paithan’s historic public ghats. Check local conditions before approaching the water, particularly during the monsoon.",
  "The Sant Eknath Wada locality includes the historic wada precinct and surrounding lanes. Find heritage information through the tourism directory and contact the council for civic issues in the area.",
  "The weavers’ locality brings together residential lanes and Paithani handloom activity. Contact workshops directly to confirm visits, availability and prices.",
  "Mahavir Chowk and the main market form the focus of this directory entry. Use the civic service links for sanitation, road maintenance and other concerns around the market approaches.",
  "This directory entry covers the Shivaji Chowk and Court Road locality. For a road, drainage or streetlight concern, include the nearest junction and a clear landmark when reporting it.",
  "The Old Bazar entry brings together Juna Bazar and the Gandhi Chowk locality. When asking for civic assistance, include the street name or nearby shop landmark to help locate the issue.",
  "The Ambedkar Nagar entry identifies the residential locality and its primary-school surroundings. Education and civic service information are available through the portal’s service directories.",
  "Subhash Nagar is represented here as a residential locality. Residents can access municipal services and report water, sanitation, drainage or road concerns through the portal.",
  "The bus stand entry centres on the MSRTC station and Naka Road approaches. Check journey times with the transport operator and use the civic directory for local assistance.",
  "This entry identifies the Sant Dnyaneshwar Udyan garden precinct and nearby visitor facilities. Confirm opening times and access before travel through the tourism directory or the venue.",
  "The museum locality includes the Balasaheb Patil Museum precinct and nearby irrigation quarters. The heritage directory provides further context for planning a museum visit.",
  "The Jayakwadi Colony entry identifies the dam staff colony and reservoir-side locality. Follow posted access restrictions around operational infrastructure and reservoir approaches.",
  "The Nath Sagar entry identifies the dam gate and right-canal locality. Dam and canal access may be restricted; follow site instructions and keep clear of operational structures.",
  "This entry focuses on Paithan’s industrial estate and handloom-related locality. Use the council contact page for municipal enquiries and contact individual businesses for visiting arrangements.",
  "The Kalidas Nagar entry identifies the residential locality and bypass connection. Include the nearest road or landmark when submitting a civic concern for this area.",
];

const photographs: Record<number, string> = {
  1: "brahmapuri-mound.jpg", 2: "sant-eknath-mandir.jpg",
  4: "sant-eknath-wada.jpg", 5: "paithani-weaving.jpg",
  12: "dnyaneshwar-udyan.jpg", 13: "balasaheb-patil-museum.jpg",
  14: "jayakwadi-dam.jpg", 15: "jayakwadi-dam.jpg", 16: "paithani-weaving.jpg",
};

// Themes follow the locality's directory subject, never political affiliation.
const identities = [
  { theme: 'heritage', en: 'Archaeology & the old fort', mr: 'पुरातत्व आणि जुना किल्ला', hi: 'पुरातत्व और पुराना किला' },
  { theme: 'heritage', en: 'Sant Eknath pilgrimage', mr: 'संत एकनाथ तीर्थक्षेत्र', hi: 'संत एकनाथ तीर्थस्थल' },
  { theme: 'water', en: 'Godavari riverfront & ghats', mr: 'गोदावरी नदीकाठ आणि घाट', hi: 'गोदावरी नदी तट और घाट' },
  { theme: 'heritage', en: 'The historic wada precinct', mr: 'ऐतिहासिक वाडा परिसर', hi: 'ऐतिहासिक वाडा परिसर' },
  { theme: 'craft', en: 'Paithani handloom tradition', mr: 'पैठणी हातमाग परंपरा', hi: 'पैठणी हथकरघा परंपरा' },
  { theme: 'market', en: 'The central market', mr: 'मध्यवर्ती बाजारपेठ', hi: 'केंद्रीय बाजार' },
  { theme: 'market', en: 'Chowk & Court Road', mr: 'चौक आणि कोर्ट रोड', hi: 'चौक और कोर्ट रोड' },
  { theme: 'market', en: 'Old Bazar & Gandhi Chowk', mr: 'जुना बाजार आणि गांधी चौक', hi: 'पुराना बाजार और गांधी चौक' },
  { theme: 'community', en: 'Neighbourhood & school surroundings', mr: 'वस्ती आणि शाळेचा परिसर', hi: 'मोहल्ला और विद्यालय परिसर' },
  { theme: 'community', en: 'A residential neighbourhood', mr: 'निवासी परिसर', hi: 'आवासीय क्षेत्र' },
  { theme: 'market', en: 'The town’s bus station', mr: 'शहराचे बस स्थानक', hi: 'शहर का बस स्थानक' },
  { theme: 'nature', en: 'Gardens & green spaces', mr: 'उद्यान आणि हरित परिसर', hi: 'उद्यान और हरित क्षेत्र' },
  { theme: 'heritage', en: 'Museum & local history', mr: 'संग्रहालय आणि स्थानिक इतिहास', hi: 'संग्रहालय और स्थानीय इतिहास' },
  { theme: 'water', en: 'Jayakwadi reservoir surroundings', mr: 'जायकवाडी जलाशय परिसर', hi: 'जायकवाड़ी जलाशय परिसर' },
  { theme: 'water', en: 'Nath Sagar & the canal', mr: 'नाथसागर आणि कालवा', hi: 'नाथ सागर और नहर' },
  { theme: 'craft', en: 'Industry & handloom', mr: 'उद्योग आणि हातमाग', hi: 'उद्योग और हथकरघा' },
  { theme: 'community', en: 'Kalidas Nagar neighbourhood', mr: 'कालिदास नगर परिसर', hi: 'कालिदास नगर क्षेत्र' },
];

export function getWardProfile(number: number) {
  const extension = number === 10 || number === 17 ? "webp" : number === 12 ? "jpg" : "jpeg";
  return {
    identity: identities[number - 1] || identities[9],
    description: descriptions[number - 1] || "Locality information is awaiting confirmation.",
    image: photographs[number]
      ? `/images/sites/${photographs[number]}`
      : `/images/wards/ward-${String(number).padStart(2, "0")}.${extension}`,
    imageNote: photographs[number] ? "Locality photograph" : "Illustrative photograph supplied for this directory",
  };
}
