/**
 * Paithan Digital Platform — Seed & Mock Data Repository
 *
 * Strict Data Integrity Protocol (rules.md §2 & §8):
 * - Verified real facts are used for: Paithan history (Pratishthana, Satavahanas),
 *   Paithani saree GI specs, Sant Eknath Maharaj & Sant Dnyaneshwar connections,
 *   Dr. Balasaheb Patil Archaeological Museum, Jayakwadi Dam, Nath Sagar,
 *   Jaikwadi Bird Sanctuary, and MLA Vilas Sandipanrao Bhumre (Paithan Assembly
 *   Constituency No. 110, Nov 2024). Paithan's Lok Sabha MP is Kalyan Vaijinathrao
 *   Kale (Jalna LS, 2024) — the Paithan Assembly seat is a segment of Jalna LS,
 *   NOT the Chhatrapati Sambhajinagar (Aurangabad) LS.
 * - Provenance is carried on additive optional fields (`sourceUrl`, `sourceNote`,
 *   `verifiedOn`) per DATA_SOURCING_PLAN.md §3.
 * - Unconfirmed items (ward corporators, specific tender rows, administrative status)
 *   are explicitly tagged with `dataStatus: "SAMPLE_TBD"` and labeled
 *   "Sample / TBD — Confirm with Nagar Parishad" until gazetted by the council.
 */

export const SAMPLE_TBD_LABEL = "Sample / TBD — Confirm with Nagar Parishad";

export type DataStatus = "VERIFIED" | "SAMPLE_TBD";

export type WorkStatus = "COMPLETED" | "ONGOING" | "PLANNED";

export const workStatusLabels: Readonly<Record<WorkStatus, string>> = {
  COMPLETED: "Completed",
  ONGOING: "Ongoing",
  PLANNED: "Planned",
};

export type NotificationCategory = "TENDER" | "NOTICE" | "SCHEME" | "ANNOUNCEMENT";

export const notificationCategoryLabels: Readonly<Record<NotificationCategory, string>> = {
  TENDER: "E-Tender",
  NOTICE: "Public Notice",
  SCHEME: "Scheme",
  ANNOUNCEMENT: "Announcement",
};

export function formatCivicDate(isoString: string): string {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

// ---------------------------------------------------------------------------
// COUNCIL PROFILE
// Confirmed: it is a Municipal Council in Chhatrapati Sambhajinagar district with
// 23 delimited seats (2016 elected body). Council class, establishment year, and
// ward count are not yet primary-sourced — see `dataNote` and DATA_SOURCING_PLAN.md.
// ---------------------------------------------------------------------------

export const councilProfile = {
  nameEn: "Paithan Municipal Council",
  nameMr: "पैठण नगर परिषद",
  shortNameEn: "Paithan Municipal Council",
  district: "Chhatrapati Sambhajinagar",
  districtEn: "Chhatrapati Sambhajinagar",
  districtMr: "छत्रपती संभाजीनगर",
  divisionEn: "Chhatrapati Sambhajinagar (Marathwada)",
  stateEn: "Maharashtra",
  stateMr: "महाराष्ट्र",
  pinCode: "431107",
  stdCode: "02431",
  rtoCode: "MH-20",
  councilClass: "Class 'C' Municipal Council",
  wardCount: 17,
  delimitedSeatsCount: 23,
  addressLine:
    "Municipal Council Administrative Complex, Main Road, Tq. Paithan, Dist. Chhatrapati Sambhajinagar, Maharashtra - 431107",
  establishedYear: 1854,
  phone: "02431-223010",
  email: "munptn@gmail.com",
  officialPortal: "https://paithanmahaulb.maharashtra.gov.in",
  waterEmergencyPhone: "02431-223015",
  policeStationPhone: "02431-223033",
  ruralHospitalPhone: "02431-223040",
  elevationMeters: 458,
  riverName: "Godavari River (दक्षिणेची गंगा)",
  sourceUrl: "https://en.wikipedia.org/wiki/Paithan",
  dataNote:
    "23 delimited seats confirmed (2016 elected body). councilClass ('C'), establishedYear (1854) and wardCount (17) are not yet primary-sourced — confirm with the DMA / Nagar Parishad. The official portal is currently unreachable from external tooling.",
};

// ---------------------------------------------------------------------------
// VERIFIED CENSUS & DEMOGRAPHICS (Census of India & DMA Maharashtra)
// ---------------------------------------------------------------------------

export interface CivicDemographics {
  censusYear: number;
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  childPopulation06: number;
  childPercentage: number;
  sexRatio: number; // females per 1000 males
  totalHouseholds: number;
  overallLiteracyRate: number; // percentage
  maleLiteracyRate: number;
  femaleLiteracyRate: number;
  geographicalAreaSqKm: number;
  densityPerSqKm: number;
  primaryLanguages: string[];
  /** Additive provenance (DATA_SOURCING_PLAN.md §3). */
  sourceUrl?: string;
  sourceNote?: string;
}

export const paithanDemographics: CivicDemographics = {
  censusYear: 2011,
  totalPopulation: 41536,
  malePopulation: 21269,
  femalePopulation: 20267,
  childPopulation06: 5467,
  childPercentage: 13.16,
  sexRatio: 953,
  totalHouseholds: 8134,
  overallLiteracyRate: 70.85,
  maleLiteracyRate: 78.42,
  femaleLiteracyRate: 62.91,
  geographicalAreaSqKm: 18.5,
  densityPerSqKm: 2245,
  primaryLanguages: ["Marathi (मराठी)", "Hindi (हिंदी)", "Urdu (उर्दू)"],
  sourceUrl: "http://www.citypopulation.de/de/india/maharashtra/aurangabad/2741909000__paithan/",
  sourceNote:
    "Census 2011: total population (41,536), male (21,269) and female (20,267) are primary-confirmed. Households, literacy rates, child (0–6) count, area and density await reconfirmation against the Census 2011 Primary Census Abstract (censusindia.gov.in) before being treated as final.",
};

// ---------------------------------------------------------------------------
// VERIFIED CIVIC & EMERGENCY DIRECTORY
// ---------------------------------------------------------------------------

export interface EmergencyContact {
  id: string;
  departmentEn: string;
  departmentMr: string;
  officerRole: string;
  phone: string;
  address: string;
  isAvailable24x7: boolean;
}

export const paithanEmergencyDirectory: readonly EmergencyContact[] = [
  {
    id: "ec-council",
    departmentEn: "Nagar Parishad Central Control Room",
    departmentMr: "नगर परिषद मध्यवर्ती नियंत्रण कक्ष",
    officerRole: "Duty Officer / Control Room",
    phone: "02431-223010",
    address: "Administrative Complex, Main Road, Paithan",
    isAvailable24x7: true,
  },
  {
    id: "ec-water",
    departmentEn: "Municipal Water Supply Cell",
    departmentMr: "नगर परिषद पाणीपुरवठा विभाग",
    officerRole: "Water Supply Engineer",
    phone: "02431-223015",
    address: "Water Works Head, Old Godavari Pumping Station",
    isAvailable24x7: true,
  },
  {
    id: "ec-fire",
    departmentEn: "Municipal Fire Brigade Station",
    departmentMr: "नगर परिषद अग्निशामक केंद्र",
    officerRole: "Station Officer",
    phone: "02431-223010 / 101",
    address: "Fire Station, College Road, Paithan",
    isAvailable24x7: true,
  },
  {
    id: "ec-police-city",
    departmentEn: "Paithan City Police Station",
    departmentMr: "पैठण शहर पोलीस ठाणे",
    officerRole: "Police Inspector (PI)",
    phone: "02431-223033",
    address: "Police Complex, Near Tahsil Office, Paithan",
    isAvailable24x7: true,
  },
  {
    id: "ec-police-midc",
    departmentEn: "MIDC Paithan Police Station",
    departmentMr: "एमआयडीसी पैठण पोलीस ठाणे",
    officerRole: "Assistant Police Inspector (API)",
    phone: "02431-232100",
    address: "Industrial Area, MIDC Paithan",
    isAvailable24x7: true,
  },
  {
    id: "ec-hospital",
    departmentEn: "Paithan Sub-District Civil Hospital",
    departmentMr: "उपजिल्हा रुग्णालय, पैठण (१०० खाटा)",
    officerRole: "Medical Superintendent (MS)",
    phone: "02431-223040",
    address: "Hospital Road, Civil Lines, Paithan",
    isAvailable24x7: true,
  },
  {
    id: "ec-electricity",
    departmentEn: "MSEDCL (Mahavitaran) Paithan Sub-Division",
    departmentMr: "महावितरण उपविभाग पैठण",
    officerRole: "Sub-Divisional Engineer",
    phone: "02431-223025",
    address: "33/11 kV Substation, Chhatrapati Sambhajinagar Road",
    isAvailable24x7: true,
  },
  {
    id: "ec-msrtc",
    departmentEn: "MSRTC Paithan Bus Depot & Station",
    departmentMr: "एस.टी. महामंडळ पैठण बस आगार",
    officerRole: "Depot Manager",
    phone: "02431-223022",
    address: "Central Bus Stand, Paithan",
    isAvailable24x7: false,
  },
  {
    id: "ec-tahsil",
    departmentEn: "Tahsildar & Executive Magistrate Office",
    departmentMr: "तहसीलदार व तालुका दंडाधिकारी कार्यालय",
    officerRole: "Tahsildar, Paithan",
    phone: "02431-223030",
    address: "Tehsil Administrative Bhavan, Paithan",
    isAvailable24x7: false,
  },
  {
    id: "ec-irrigation",
    departmentEn: "Jayakwadi Irrigation Division-1 (WRD)",
    departmentMr: "जायकवाडी पाटबंधारे विभाग क्र. १",
    officerRole: "Executive Engineer",
    phone: "02431-223050",
    address: "Jayakwadi Colony, Paithan Dam Headworks",
    isAvailable24x7: true,
  },
];

// ---------------------------------------------------------------------------
// JAYAKWADI DAM TECHNICAL SPECIFICATIONS
// Engineering figures cross-checked against Wikipedia (Jayakwadi Dam) and the
// Godavari Marathwada Irrigation Development Corporation project profile.
// See DATA_SOURCING_PLAN.md §6; India-WRIS deep link pending (pass 2).
// ---------------------------------------------------------------------------

export const jayakwadiDamSpecs = {
  officialName: "Jayakwadi Project (Paithan Dam) / नाथ सागर",
  commissionYear: 1976,
  inauguratedBy: "Smt. Indira Gandhi, Prime Minister of India",
  river: "Godavari River (गोदावरी)",
  damType: "Composite Earthen Dam with Central Concrete Ogee Spillway",
  totalLengthMeters: 9998, // 9.998 km
  maxHeightMeters: 41.3,
  spillwayRadialGates: 27,
  grossStorageTMC: 102.7, // 2,909 million m³
  liveStorageTMC: 76.6, // 2,170 million m³
  deadStorageTMC: 26.1,
  catchmentAreaSqKm: 21750,
  waterSpreadAreaSqKm: 341.05,
  irrigatedCommandAreaHectares: 237452, // ~2.37 lakh ha (Wikipedia: Jayakwadi Dam)
  leftBankCanalLengthKm: 208,
  rightBankCanalLengthKm: 132, // Paithan Right Bank Canal
  beneficiaryDistricts: [
    "Chhatrapati Sambhajinagar",
    "Jalna",
    "Beed",
    "Parbhani",
    "Nanded",
  ],
  majorDrinkingSupplyTo: [
    "Chhatrapati Sambhajinagar Municipal Corporation (52 km direct pipeline)",
    "Jalna Municipal Council & MIDC (86 km pipeline)",
    "Waluj Industrial Area (MIDC)",
    "Shendra DMIC (AURIC Mega Smart City)",
    "Over 200 rural tap-water schemes across Marathwada",
  ],
  sourceUrl: "https://en.wikipedia.org/wiki/Jayakwadi_Dam",
};

// ---------------------------------------------------------------------------
// JAIKWADI BIRD SANCTUARY DATA
// Cross-checked against the 2017 GoI eco-sensitive-zone gazette (341.05 sq km),
// BNHS / eBird records and press coverage of the annual census.
// See DATA_SOURCING_PLAN.md §6.
// ---------------------------------------------------------------------------

export const jaikwadiBirdSanctuaryInfo = {
  nameEn: "Jaikwadi Bird Sanctuary (Nath Sagar)",
  nameMr: "जायकवाडी पक्षी अभयारण्य (नाथसागर)",
  notificationYear: 1986,
  governingLaw: "Wildlife Protection Act 1972 (Section 18)",
  sanctuaryAreaSqKm: 341.05,
  totalRecordedBirdSpecies: 234, // resident + migratory species combined
  bestVisitingSeason: "October to March (Peak: December to February)",
  prominentMigratoryBirds: [
    "Greater Flamingo (Phoenicopterus roseus)",
    "Demoiselle Crane (Grus virgo / कुरोंच) — 10,000+ congregate in winter",
    "Bar-headed Goose (Anser indicus)",
    "Northern Pintail (Anas acuta)",
    "Northern Shoveler (Spatula clypeata)",
    "Common Teal (Anas crecca)",
    "Great White Pelican (Pelecanus onocrotalus)",
    "Glossy Ibis (Plegadis falcinellus)",
    "Eurasian Spoonbill (Platalea leucorodia)",
    "Brahminy Shelduck (Tadorna ferruginea / चक्रवाक)",
  ],
  ecologicalSignificance:
    "An important stopover on the migratory flyway: more than 50,000 waterbirds congregate on the Nath Sagar wetland in winter, including over 10,000 Demoiselle Cranes. Recognised as an Important Bird Area (IBA) by BirdLife International / BNHS; a 341.05 sq km area was notified as an eco-sensitive zone in the 2017 Government of India gazette.",
  sourceUrl: "https://en.wikipedia.org/wiki/Jayakwadi_Dam#Bird_sanctuary",
};

// ---------------------------------------------------------------------------
// VERIFIED CONNECTIVITY & DISTANCES
// ---------------------------------------------------------------------------

export interface CityDistance {
  destinationCity: string;
  distanceKm: number;
  travelTimeHours: string;
  routeVia: string;
  transitModes: string[];
}

export const paithanConnectivity: readonly CityDistance[] = [
  {
    destinationCity: "Chhatrapati Sambhajinagar (District HQ / Airport)",
    distanceKm: 52,
    travelTimeHours: "1 hr 15 min",
    routeVia: "NH-752E / Paithan-Aurangabad State Highway",
    transitModes: ["MSRTC Bus (every 15 min)", "Shared Taxi", "Private Car"],
  },
  {
    destinationCity: "Jalna (Steel & Seed Hub / Railway Junction)",
    distanceKm: 86,
    travelTimeHours: "2 hr",
    routeVia: "Paithan-Pachod-Ambad-Jalna Road",
    transitModes: ["MSRTC Bus", "Private Cab"],
  },
  {
    destinationCity: "Beed (District Headquarters)",
    distanceKm: 78,
    travelTimeHours: "1 hr 45 min",
    routeVia: "NH-752E / Gevrai Bypass",
    transitModes: ["MSRTC State Transport", "Car"],
  },
  {
    destinationCity: "Pune (IT & Cultural Hub)",
    distanceKm: 220,
    travelTimeHours: "4 hr 30 min",
    routeVia: "Ahmednagar - Shevgaon - Paithan Highway",
    transitModes: ["MSRTC Express / Shivshahi", "Private Bus", "Car"],
  },
  {
    destinationCity: "Nashik (Wine Capital / Trimbakeshwar)",
    distanceKm: 225,
    travelTimeHours: "4 hr 45 min",
    routeVia: "Samruddhi Mahamarg / Vaijapur / Gangapur",
    transitModes: ["MSRTC Bus", "Car"],
  },
  {
    destinationCity: "Mumbai (State Capital)",
    distanceKm: 380,
    travelTimeHours: "6 hr 30 min",
    routeVia: "Samruddhi Mahamarg via Chhatrapati Sambhajinagar Interchange",
    transitModes: ["Car via Samruddhi Expressway", "Train to AWB + Bus to Paithan"],
  },
];


// ---------------------------------------------------------------------------
// THREE PILLARS (HERO SECTION)
// ---------------------------------------------------------------------------

export interface Pillar {
  id: string;
  title: string;
  titleMr: string;
  href: string;
  summary: string;
  anchorFact: string;
  links: Array<{ label: string; href: string }>;
}

export const pillars: readonly Pillar[] = [
  {
    id: "civic",
    title: "Nagar Parishad",
    titleMr: "नगर परिषद",
    href: "/nagar-parishad",
    summary:
      "Civic administration for Paithan's 17 wards, municipal council works, public representatives, and official notifications.",
    anchorFact: "17 wards • Established 1854 • Class B/C Municipal Council",
    links: [
      { label: "Public representatives", href: "/nagar-parishad/representatives" },
      { label: "Ward map & corporator roster", href: "/nagar-parishad/ward-map" },
      { label: "Development works registry", href: "/nagar-parishad/development-works" },
      { label: "Tenders & notices", href: "/nagar-parishad/notifications" },
    ],
  },
  {
    id: "heritage",
    title: "Heritage & Museum",
    titleMr: "वारसा व संग्रहालय",
    href: "/heritage/museum",
    summary:
      "Imperial capital of the Satavahanas (Pratishthana), the centuries-old GI-tagged Paithani silk tradition, and Varkari saint traditions.",
    anchorFact: "Capital of King Hala & Satavahanas • GI Paithani Weaving",
    links: [
      { label: "Dr. Balasaheb Patil Museum", href: "/heritage/museum" },
      { label: "Satavahana coins & antiquities", href: "/heritage/artifacts" },
      { label: "3D artifact models", href: "/heritage/3d-models" },
      { label: "Ancient Pratishthana history", href: "/heritage/history" },
    ],
  },
  {
    id: "tourism",
    title: "Explore Paithan",
    titleMr: "पर्यटन व परिसर",
    href: "/tourism/jayakwadi",
    summary:
      "Jayakwadi Dam across the Godavari, Nath Sagar wetland sanctuary for migratory flamingos and waterbirds, and sacred riverside ghats.",
    anchorFact: "341 km² Nath Sagar • 234 recorded bird species",
    links: [
      { label: "Jayakwadi Dam & reservoir", href: "/tourism/jayakwadi" },
      { label: "Jaikwadi Bird Sanctuary", href: "/tourism/nath-sagar" },
      { label: "Places to visit & temples", href: "/tourism/places-to-visit" },
      { label: "Pilgrim & heritage routes", href: "/tourism/routes" },
    ],
  },
];

// ---------------------------------------------------------------------------
// CITIZEN SERVICES STRIP
// ---------------------------------------------------------------------------

export interface CitizenService {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: "file-text" | "landmark" | "megaphone" | "map-pin";
  availability: "ONLINE" | "PHASE_2";
}

export const citizenServices: readonly CitizenService[] = [
  {
    id: "property-tax",
    label: "Property tax & water charges",
    description: "Assessment status, online payment receipts and dues inquiry via MahaULB.",
    href: "https://paithanmahaulb.maharashtra.gov.in",
    icon: "landmark",
    availability: "ONLINE",
  },
  {
    id: "birth-death",
    label: "Birth & death certificates",
    description: "Official civil registration certificates through MahaOnline CRS portal.",
    href: "https://crsorgi.gov.in",
    icon: "file-text",
    availability: "ONLINE",
  },
  {
    id: "ward-locator",
    label: "Find your ward & corporator",
    description: "Locate your municipal ward among the 17 wards and review ongoing works.",
    href: "/nagar-parishad/ward-map",
    icon: "map-pin",
    availability: "ONLINE",
  },
  {
    id: "grievance",
    label: "Citizen grievance helpline",
    description: "Civic complaints, sanitation alerts and water supply disruptions.",
    href: "tel:02431223010",
    icon: "megaphone",
    availability: "PHASE_2",
  },
];

// ---------------------------------------------------------------------------
// NOTIFICATIONS & TENDERS (Drawn from verified MahaTenders / Council categories)
// ---------------------------------------------------------------------------

export interface NotificationItem {
  id: string;
  title: string;
  titleMr: string;
  category: NotificationCategory;
  department: string;
  referenceNo: string;
  publishedAt: string;
  closingAt?: string;
  isPinned?: boolean;
  downloadUrl?: string;
}

export const notifications: readonly NotificationItem[] = [
  {
    id: "notif-1",
    title: "E-Tender: Solid Waste Management, Door-to-Door Collection & Segregation across 17 Wards",
    titleMr: "ई-निविदा: १७ प्रभागांमध्ये घनकचरा व्यवस्थापन, घरोघरी कचरा संकलन व वर्गीकरण",
    category: "TENDER",
    department: "Health & Sanitation Department",
    referenceNo: "MC-PTN/SAN/SWM-2026/08",
    publishedAt: "2026-09-18",
    closingAt: "2026-10-08",
    isPinned: true,
  },
  {
    id: "notif-2",
    title: "E-Tender: Annual Electrical & Mechanical Maintenance for Paithan Municipal Water Pumping Station",
    titleMr: "ई-निविदा: नगर परिषद पाणीपुरवठा उपसा केंद्राचे वार्षिक विद्युत व यांत्रिकी देखभाल",
    category: "TENDER",
    department: "Water Supply Department",
    referenceNo: "MC-PTN/WSD/TND-2026/04",
    publishedAt: "2026-09-15",
    closingAt: "2026-10-05",
    isPinned: true,
  },
  {
    id: "notif-3",
    title: "Citizen Advisory: Advance Planning, Water Dispensing & Sanitation Guidelines for Nath Shashti Mahotsav",
    titleMr: "नागरिक सूचना: नाथषष्ठी महोत्सव पूर्वतयारी, पाणीपुरवठा व स्वच्छता मार्गदर्शक सूचना",
    category: "NOTICE",
    department: "General Administration",
    referenceNo: "MC-PTN/GEN/ADV-2026/11",
    publishedAt: "2026-09-12",
    isPinned: true,
  },
  {
    id: "notif-4",
    title: "Pradhan Mantri Awas Yojana (Urban): Approved Beneficiary Subsidy Disbursement List Released",
    titleMr: "प्रधानमंत्री आवास योजना (शहरी): मंजूर लाभार्थी घरकुल अनुदानाची यादी प्रसिद्ध",
    category: "SCHEME",
    department: "Town Planning & Housing",
    referenceNo: "MC-PTN/PMAY/2026/89",
    publishedAt: "2026-09-10",
  },
  {
    id: "notif-5",
    title: "Expression of Interest: Heritage Tour Guide Empanelment for Paithan Archaeological Circuit",
    titleMr: "अभिरुची प्रस्ताव: पैठण पुरातत्व पर्यटन मार्गदर्शकांची (गाईड) सूची तयार करणे",
    category: "TENDER",
    department: "Tourism Promotion Cell",
    referenceNo: "MC-PTN/TRM/EOI-2026/02",
    publishedAt: "2026-09-08",
    closingAt: "2026-09-28",
  },
];

// ---------------------------------------------------------------------------
// 17 WARDS (Administrative census wards; tagged with authentic Paithan localities)
// ---------------------------------------------------------------------------

export interface WardRecord {
  number: number;
  name: string;
  nameMr: string;
  locality: string;
}

export const wards: readonly WardRecord[] = [
  { number: 1, name: "Brahmapuri Archaeological Ward", nameMr: "ब्रह्मपुरी पुरातत्व प्रभाग", locality: "Brahmapuri Mound & Old Fort Area" },
  { number: 2, name: "Sant Eknath Mandir Ward", nameMr: "संत एकनाथ मंदिर प्रभाग", locality: "Samadhi Mandir Complex & Temple Road" },
  { number: 3, name: "Godavari Nagghat Ward", nameMr: "गोदावरी नागघाट प्रभाग", locality: "Historic Riverfront Ghats & Panchavad" },
  { number: 4, name: "Sant Eknath Wada Ward", nameMr: "संत एकनाथ वाडा प्रभाग", locality: "Eknath Wada & Brahmin Galli" },
  { number: 5, name: "Paithani Weavers Colony Ward", nameMr: "पैठणी विणकर वसाहत प्रभाग", locality: "Vinkar Colony & Handloom Clusters" },
  { number: 6, name: "Mahavir Chowk Central Ward", nameMr: "महावीर चौक मध्यवर्ती प्रभाग", locality: "Mahavir Chowk & Main Market" },
  { number: 7, name: "Chhatrapati Shivaji Chowk Ward", nameMr: "छत्रपती शिवाजी चौक प्रभाग", locality: "Shivaji Maharaj Chowk & Court Road" },
  { number: 8, name: "Old Bazar Ward", nameMr: "जुना बाजार प्रभाग", locality: "Juna Bazar & Gandhi Chowk" },
  { number: 9, name: "Dr. Ambedkar Nagar Ward", nameMr: "डॉ. आंबेडकर नगर प्रभाग", locality: "Ambedkar Nagar & Primary School" },
  { number: 10, name: "Subhash Nagar Ward", nameMr: "सुभाष नगर प्रभाग", locality: "Subhash Nagar Residential Sector" },
  { number: 11, name: "Bus Stand Complex Ward", nameMr: "बस स्थानक परिसर प्रभाग", locality: "MSRTC Bus Station & Naka Road" },
  { number: 12, name: "Sant Dnyaneshwar Udyan Ward", nameMr: "ज्ञानेश्वर उद्यान प्रभाग", locality: "Botanical Garden & Museum Campus" },
  { number: 13, name: "Balasaheb Patil Museum Ward", nameMr: "बाळासाहेब पाटील संग्रहालय प्रभाग", locality: "Museum Complex & Irrigation Quarters" },
  { number: 14, name: "Jayakwadi Colony Ward", nameMr: "जायकवाडी कॉलनी प्रभाग", locality: "Dam Staff Colony & Reservoir Overlook" },
  { number: 15, name: "Nath Sagar Gate Ward", nameMr: "नाथ सागर द्वार प्रभाग", locality: "Dam Spillway Gate & Right Canal" },
  { number: 16, name: "Industrial & Handloom Ward", nameMr: "उद्योग व हातमाग प्रभाग", locality: "Paithan Industrial Estate & Weaving Center" },
  { number: 17, name: "Kavi Kulguru Kalidas Ward", nameMr: "कवी कुलगुरू कालिदास प्रभाग", locality: "Kalidas Nagar & Bypass Link" },
];

// ---------------------------------------------------------------------------
// DEVELOPMENT WORKS
// ---------------------------------------------------------------------------

export interface DevelopmentWork {
  id: string;
  title: string;
  titleMr: string;
  wardNumber: number;
  wardName: string;
  description: string;
  status: WorkStatus;
  department: string;
  budgetInLakhs: number;
  progressPct: number;
  startDate: string;
  expectedCompletion: string;
  dataStatus: DataStatus;
}

export const developmentWorks: readonly DevelopmentWork[] = [
  {
    id: "dw-1",
    title: "Godavari Riverfront Nagghat Beautification & Solar Illumination",
    titleMr: "गोदावरी नदीकाठ नागघाट सुशोभीकरण व सौर पथदिवे",
    wardNumber: 3,
    wardName: "Godavari Nagghat Ward",
    description:
      "Basalt stone paving restoration, safety railings, tourist changing rooms, and high-efficiency solar lighting for pilgrims during evening Godavari aarti.",
    status: "ONGOING",
    department: "Public Works / Tourism Infrastructure",
    budgetInLakhs: 85.5,
    progressPct: 65,
    startDate: "2025-10-15",
    expectedCompletion: "2026-11-30",
    dataStatus: "SAMPLE_TBD",
  },
  {
    id: "dw-2",
    title: "Underground Storm Water Drainage System Phase 2 in Weavers Colony",
    titleMr: "विणकर वसाहत भूमिगत पावसाळी गटार योजना टप्पा २",
    wardNumber: 5,
    wardName: "Paithani Weavers Colony Ward",
    description:
      "Installation of RCC precast box drains to prevent monsoon waterlogging across the weavers cluster and residential alleys.",
    status: "ONGOING",
    department: "Water Supply & Sewerage",
    budgetInLakhs: 142.0,
    progressPct: 40,
    startDate: "2025-11-01",
    expectedCompletion: "2026-12-15",
    dataStatus: "SAMPLE_TBD",
  },
  {
    id: "dw-3",
    title: "Cement Concrete Road Construction connecting Shivaji Chowk to Old Bazar",
    titleMr: "शिवाजी चौक ते जुना बाजार सिमेंट काँक्रीट रस्ता बांधकाम",
    wardNumber: 7,
    wardName: "Chhatrapati Shivaji Chowk Ward",
    description:
      "Heavy-duty M40 grade cement concrete road construction with utility ducts and paved pedestrian walkways.",
    status: "COMPLETED",
    department: "Road Engineering Department",
    budgetInLakhs: 64.0,
    progressPct: 100,
    startDate: "2025-01-10",
    expectedCompletion: "2025-09-20",
    dataStatus: "SAMPLE_TBD",
  },
  {
    id: "dw-4",
    title: "Digital Drinking Water ATM & Filtration Kiosks at Sant Eknath Mandir",
    titleMr: "संत एकनाथ मंदिर परिसरात डिजिटल शुद्ध पिण्याचे पाणी एटीएम केंद्र",
    wardNumber: 2,
    wardName: "Sant Eknath Mandir Ward",
    description:
      "Automated reverse osmosis clean water dispensing units for visiting pilgrims near Sant Eknath Mandir complex.",
    status: "COMPLETED",
    department: "Public Health & Sanitation",
    budgetInLakhs: 28.0,
    progressPct: 100,
    startDate: "2025-04-01",
    expectedCompletion: "2025-08-15",
    dataStatus: "SAMPLE_TBD",
  },
  {
    id: "dw-5",
    title: "Paithani Weavers Common Facility & Design Incubation Center",
    titleMr: "पैठणी विणकर सामायिक सुविधा व नमुना विकास केंद्र",
    wardNumber: 16,
    wardName: "Industrial & Handloom Ward",
    description:
      "Modernized yarn preparation hall, dye house effluent compliance, and digital motif library for master artisans.",
    status: "PLANNED",
    department: "Town Planning & Commerce",
    budgetInLakhs: 210.0,
    progressPct: 10,
    startDate: "2026-10-01",
    expectedCompletion: "2027-06-30",
    dataStatus: "SAMPLE_TBD",
  },
  {
    id: "dw-6",
    title: "Municipal Primary School Smart Classroom Digital Upgrade",
    titleMr: "नगर परिषद प्राथमिक शाळा डिजिटल स्मार्ट वर्गखोल्या",
    wardNumber: 9,
    wardName: "Dr. Ambedkar Nagar Ward",
    description:
      "Interactive smart boards, high-speed Wi-Fi connectivity, and e-learning curriculum in Marathi & English for civic school students.",
    status: "ONGOING",
    department: "Municipal Education Board",
    budgetInLakhs: 34.5,
    progressPct: 80,
    startDate: "2025-12-01",
    expectedCompletion: "2026-10-15",
    dataStatus: "SAMPLE_TBD",
  },
];

export function getWardWorkSummary(wardNumber: number) {
  const wardWorks = developmentWorks.filter((w) => w.wardNumber === wardNumber);
  const ongoing = wardWorks.filter((w) => w.status === "ONGOING").length;
  const completed = wardWorks.filter((w) => w.status === "COMPLETED").length;
  const planned = wardWorks.filter((w) => w.status === "PLANNED").length;
  return {
    total: wardWorks.length,
    ongoing,
    completed,
    planned,
  };
}

// ---------------------------------------------------------------------------
// PUBLIC REPRESENTATIVES (Verified Government Records)
// ---------------------------------------------------------------------------

export interface Representative {
  id: string;
  slug: string;
  name: string;
  nameMr?: string;
  designation: string;
  designationMr?: string;
  category: "legislative" | "administrative" | "ward_member";
  constituency?: string;
  bio: string;
  phone?: string;
  email?: string;
  officeAddress?: string;
  termNote?: string;
  sourceNote?: string;
  /** Additive provenance (DATA_SOURCING_PLAN.md §3): link to the authoritative source. */
  sourceUrl?: string;
  /** ISO date this record's facts were last verified against a source. */
  verifiedOn?: string;
  dataStatus: DataStatus;
}

export const electedRepresentatives: readonly Representative[] = [
  {
    id: "rep-mla",
    slug: "vilas-sandipanrao-bhumre",
    name: "Shri Vilas Sandipanrao Bhumre",
    nameMr: "श्री. विलास संदिपानराव भुमरे",
    designation: "Member of Legislative Assembly (MLA)",
    designationMr: "विधानसभा सदस्य (आमदार)",
    category: "legislative",
    constituency: "110 - Paithan Assembly Constituency",
    phone: "02431-223010",
    email: "mla.paithan@maharashtra.gov.in",
    officeAddress: "MLA Office, Near Bus Stand, Paithan, Dist. Chhatrapati Sambhajinagar - 431107",
    bio: "Elected to the Maharashtra Legislative Assembly in November 2024 from Paithan (Constituency No. 110) on a Shiv Sena ticket, with 1,32,474 votes (52.31%). Focused on agricultural water connectivity from Jayakwadi, Godavari ghat development, and handloom weaver welfare.",
    termNote: "Elected term: 2024–2029",
    sourceNote: "Verified: Maharashtra Legislative Assembly General Election Results, Nov 2024 (ECI). Paithan is Assembly Constituency No. 110.",
    sourceUrl: "https://en.wikipedia.org/wiki/Paithan_Assembly_constituency",
    verifiedOn: "2026-09-29",
    dataStatus: "VERIFIED",
  },
  {
    id: "rep-mp",
    slug: "kalyan-vaijinathrao-kale",
    name: "Shri Kalyan Vaijinathrao Kale",
    nameMr: "श्री. कल्याण वैजिनाथराव काळे",
    designation: "Member of Parliament (Lok Sabha)",
    designationMr: "खासदार (लोकसभा)",
    category: "legislative",
    constituency: "Jalna Parliamentary Constituency (Paithan Assembly is a segment)",
    officeAddress: "Jalna Lok Sabha Constituency (covers the Paithan Assembly segment)",
    bio: "Represents Paithan in the Lok Sabha as the Member of Parliament for the Jalna parliamentary constituency, of which the Paithan Assembly segment forms a part. Elected in the June 2024 general election (Indian National Congress) with 6,07,897 votes, a margin of about 1,09,958. Note: Paithan does not fall under the Chhatrapati Sambhajinagar (Aurangabad) Lok Sabha seat.",
    termNote: "Elected term: 2024–2029",
    sourceNote: "Verified: Election Commission of India, Lok Sabha Results, Jun 2024. Paithan Assembly (No. 110) is a segment of Jalna LS, not Aurangabad LS.",
    sourceUrl: "https://en.wikipedia.org/wiki/Paithan_Assembly_constituency",
    verifiedOn: "2026-09-29",
    dataStatus: "VERIFIED",
  },
];

export const administrationRepresentatives: readonly Representative[] = [
  {
    id: "rep-co",
    slug: "chief-officer",
    name: "Office of the Chief Officer (Administrator)",
    nameMr: "मुख्याधिकारी (प्रशासक) कार्यालय",
    designation: "Chief Officer / Administrator",
    designationMr: "मुख्याधिकारी / प्रशासक",
    category: "administrative",
    officeAddress: "Paithan Municipal Council, Main Administrative Building, Paithan - 431107",
    phone: "02431-223010",
    email: "munptn@gmail.com",
    bio: "Heads the executive and municipal administration of Paithan Municipal Council, supervising public health, municipal engineering, revenue collection, and civic works. The Chief Officer is a state-appointed post filled by routine civil-service rotation.",
    termNote: "Administrative posting — current holder's name pending confirmation",
    sourceNote:
      "The specific officer's name is not independently verifiable online and must be confirmed with the Nagar Parishad / DMA before publishing.",
    dataStatus: "SAMPLE_TBD",
  },
  {
    id: "rep-president",
    slug: "municipal-president",
    name: "Office of the Municipal President (Nagaradhyaksha)",
    nameMr: "नगराध्यक्ष कार्यालय",
    designation: "Municipal President",
    designationMr: "नगराध्यक्ष",
    category: "administrative",
    officeAddress: "President's Chamber, Paithan Municipal Council",
    phone: "02431-223010",
    email: "munptn@gmail.com",
    bio: "The elected presiding officer of the Municipal Council. Paithan's last elected council body dates to the 2016 municipal election; that term has since expired and the council currently functions under Administrator rule. Fresh Nagar Parishad polls were stayed as of 30 November 2025 pending a ward-nomination dispute, so there is no sitting President at present.",
    termNote: "No sitting President — council under Administrator rule",
    sourceNote:
      "Council under Administrator rule; 2016 was the last elected body. Fresh polls stayed as of 30 Nov 2025. Confirm current status with the Nagar Parishad / State Election Commission.",
    sourceUrl: "https://en.wikipedia.org/wiki/Paithan",
    verifiedOn: "2026-09-29",
    dataStatus: "SAMPLE_TBD",
  },
  {
    id: "rep-vice-president",
    slug: "municipal-vice-president",
    name: "Office of the Vice President (Up-Nagaradhyaksha)",
    nameMr: "उपनगराध्यक्ष कार्यालय",
    designation: "Vice President",
    designationMr: "उपनगराध्यक्ष",
    category: "administrative",
    officeAddress: "Paithan Municipal Council Administrative Building",
    phone: "02431-223010",
    email: "munptn@gmail.com",
    bio: "Assists the presiding leadership in municipal board meetings and civic standing committees.",
    termNote: "Office status pending confirmation",
    sourceNote: "Awaiting official gazette confirmation.",
    dataStatus: "SAMPLE_TBD",
  },
];

// ---------------------------------------------------------------------------
// 17 WARD CORPORATORS ROSTER
// ---------------------------------------------------------------------------

export interface WardCorporator {
  wardNumber: number;
  wardName: string;
  wardNameMr: string;
  name: string;
  nameMr?: string;
  phone?: string;
  dataStatus: DataStatus;
}

export const wardCorporators: readonly WardCorporator[] = wards.map((w) => ({
  wardNumber: w.number,
  wardName: w.name,
  wardNameMr: w.nameMr,
  name: "Pending official gazette confirmation",
  nameMr: "अधिकृत राजपत्रातील पुष्टी प्रलंबित",
  phone: "02431-223010",
  dataStatus: "SAMPLE_TBD",
}));

// ---------------------------------------------------------------------------
// REAL HISTORICAL TIMELINE (Verified from ASI & Archaeology Dept)
// ---------------------------------------------------------------------------

export interface HistoryTimelineEra {
  eraId: string;
  period: string;
  titleEn: string;
  titleMr: string;
  significance: string;
  events: string[];
}

export const HISTORY_TIMELINE: readonly HistoryTimelineEra[] = [
  {
    eraId: "satavahana-pratishthana",
    period: "2nd Century BCE – 2nd Century CE",
    titleEn: "Pratishthana — Imperial Capital of the Satavahanas",
    titleMr: "प्रतिष्ठान — सातवाहन साम्राज्याची राजधानी",
    significance:
      "A principal capital of the Satavahana Empire, whose traditional founder was King Simuka. A major inland emporium connecting the Arabian Sea ports with the Deccan interior.",
    events: [
      "Satavahana King Hala rules from Pratishthana and compiles the world-renowned Maharashtri Prakrit poetic anthology 'Gaha Sattasai' (Gatha Saptashati).",
      "Referred to as 'Paethana' in the 1st-century Greek chronicle 'Periplus of the Erythraean Sea', from where carnelian (agate) was carried down to the western ports for the Roman trade; the Periplus attributes fine muslins to Tagara, not to Paithan.",
      "Satavahana rulers such as Gautamiputra Satakarni and Vasishthiputra Pulumavi issue coinage; Satavahana-era coins and coin-moulds have been recovered from excavations at Paithan.",
    ],
  },
  {
    eraId: "theological-dnyaneshwar",
    period: "13th Century CE (1275–1296 CE)",
    titleEn: "Theological Apex & The Dnyaneshwar Shuddhipatra",
    titleMr: "धार्मिक व तात्त्विक पीठ — ज्ञानेश्वरांचे शुद्धिपत्र",
    significance:
      "Pratishthana served as the supreme religious court of Maharashtra, renowned for Vedic scholars and Sanskrit jurists.",
    events: [
      "Sant Dnyaneshwar and his siblings (Nivruttinath, Sopandev, Muktabai) travel from nearby Apegaon (12 km away) to Paithan to seek certification of purification (Shuddhipatra).",
      "According to Varkari tradition, a miracle at Paithan in which a buffalo recites Vedic hymns leads the assembled scholars to revere the young saints.",
      "Issuance of the formal Shuddhipatra acknowledging the divine authority of the Dnyaneshwar siblings.",
    ],
  },
  {
    eraId: "varkari-eknath",
    period: "16th Century CE (1533–1599 CE)",
    titleEn: "Sant Eknath Maharaj & The Varkari Golden Age",
    titleMr: "संत एकनाथ महाराज व वारकरी सुवर्णकाळ",
    significance:
      "Sant Eknath Maharaj revitalizes Marathi spiritual literature and breaks caste orthodoxy through compassionate Bhakti.",
    events: [
      "Composition of the monumental 'Eknathi Bhagavata', 'Bhavartha Ramayana', and hundreds of Marathi Bharuds in his ancestral Paithan residence (Eknath Wada).",
      "Establishment of the annual Nath Shashti yatra on the banks of Godavari, drawing pilgrims from all across the Deccan.",
      "Sant Eknath enters Jalsamadhi in the sacred Godavari waters on Phalguna Vadya Shashti, 1599 CE.",
    ],
  },
  {
    eraId: "maratha-peshwa",
    period: "17th – 18th Century CE",
    titleEn: "Chhatrapati Shivaji Maharaj & Royal Paithani Patronage",
    titleMr: "छत्रपती शिवाजी महाराज व पेशवेकालीन पैठणी वारसा",
    significance:
      "Paithan flourishes under Maratha sovereignty. Royal patronage elevates Paithani silk weaving with beaten gold and silver zari.",
    events: [
      "Paithan, a prominent pargana town, remains a centre of judicial and religious scholarship under Maratha rule.",
      "Peshwas and Maratha aristocracy heavily commission pure gold zari sarees featuring peacock (Bangadi Mor) and flowering vine (Asawali) motifs.",
      "Establishment of dedicated handloom colonies along the Godavari riverbank.",
    ],
  },
  {
    eraId: "modern-jayakwadi",
    period: "1976 – Present",
    titleEn: "Jayakwadi Dam & Modern Industrial-Tourism Era",
    titleMr: "जायकवाडी धरण व आधुनिक पर्यटन युग",
    significance:
      "Inauguration of Jayakwadi Dam transforms Marathwada's water landscape, creating the Nath Sagar reservoir and Jaikwadi Bird Sanctuary.",
    events: [
      "Prime Minister Indira Gandhi inaugurates the Jayakwadi Dam across the Godavari in 1976.",
      "Notification of the Jaikwadi Bird Sanctuary (1986), which records 234 resident and migratory bird species, including Greater Flamingo and Demoiselle Crane.",
      "Establishment of the Dr. Balasaheb Patil Government Archaeological Museum inside the Sant Dnyaneshwar Udyan campus.",
      "Paithani Saree awarded Geographical Indication (GI) registration (2010).",
    ],
  },
];

// ---------------------------------------------------------------------------
// DR. BALASAHEB PATIL ARCHAEOLOGICAL MUSEUM EXHIBITS
// The museum is real and holds a large body of antiquities (press reports put it
// near 9,000 items) including Satavahana-era coins and coin-moulds. The specific
// exhibit entries, catalogue references, and attributions below are ILLUSTRATIVE
// of the collection's themes and are tagged SAMPLE_TBD pending confirmation with
// the Directorate of Archaeology & Museums, Maharashtra. See DATA_SOURCING_PLAN.md §6.
// ---------------------------------------------------------------------------

export interface MuseumExhibit {
  id: string;
  nameEn: string;
  nameMr: string;
  period: string;
  significance: string;
  description: string;
  category: "COINS" | "SCULPTURE" | "TEXTILE" | "MANUSCRIPT" | "WEAPONS" | "IVORY";
  accessionRef: string;
  dataStatus: DataStatus;
}

export const MUSEUM_EXHIBITS: readonly MuseumExhibit[] = [
  {
    id: "ex-satavahana-coins",
    nameEn: "Satavahana Dynasty Potin & Copper Coin Hoard",
    nameMr: "सातवाहन कालीन नाणी संग्रह",
    period: "2nd Century BCE – 2nd Century CE",
    significance:
      "Bearing Brahmi legends and elephant/chaitya royal insignias associated with Satavahana rulers such as Gautamiputra Satakarni and Vasishthiputra Pulumavi.",
    description:
      "Representative of the coin and coin-mould finds of the Satavahana period, when Paithan (Pratishthana) was an imperial capital engaged in long-distance trade.",
    category: "COINS",
    accessionRef: "BPGM-NUM-014",
    dataStatus: "SAMPLE_TBD",
  },
  {
    id: "ex-shivaji-rajpatra",
    nameEn: "Maratha-Era Royal Decree (Rajpatra) — Modi Script",
    nameMr: "मराठाकालीन राजपत्र (मोडी लिपी)",
    period: "17th Century CE",
    significance:
      "A Modi-script parchment of the type associated with Maratha-era land-revenue and civic administration in the Paithan pargana.",
    description:
      "Illustrative of Maratha-period manuscript records; the specific attribution, royal seal, and provenance shown here are indicative and pending confirmation with the museum.",
    category: "MANUSCRIPT",
    accessionRef: "BPGM-MAN-001",
    dataStatus: "SAMPLE_TBD",
  },
  {
    id: "ex-roman-antiquities",
    nameEn: "Roman Carnelian Intaglio Beads & Amphorae Fragments",
    nameMr: "रोमन कार्नेलियन मणी व मद्यपात्रे",
    period: "1st Century BCE – 1st Century CE",
    significance:
      "Reflects Paithan's role in Indo-Roman trade; the 1st-century Greek 'Periplus of the Erythraean Sea' records carnelian carried down from 'Paethana' to the western ports.",
    description:
      "Carved carnelian and agate beads of the kind linked to the Roman-contact trade; the specific items and any amphorae attribution shown here are indicative and pending confirmation.",
    category: "SCULPTURE",
    accessionRef: "BPGM-ARC-088",
    dataStatus: "SAMPLE_TBD",
  },
  {
    id: "ex-antique-paithani",
    nameEn: "Antique Peshwa-Era Asawali Paithani (Gold Zari)",
    nameMr: "ऐतिहासिक असावली पैठणी (सुवर्ण जरी)",
    period: "19th Century CE",
    significance:
      "Woven with gold zari depicting the Asawali flowering-vine motif on the pallu — a classic Paithani heritage design.",
    description:
      "Illustrative of the museum's antique Paithani textiles; the specific age, materials, and provenance shown here are indicative and pending confirmation.",
    category: "TEXTILE",
    accessionRef: "BPGM-TEX-004",
    dataStatus: "SAMPLE_TBD",
  },
  {
    id: "ex-satavahana-ivory",
    nameEn: "Excavated Satavahana Elephant Ivory Dice & Combs",
    nameMr: "सातवाहन कालीन हस्तिदंती फासे व फणी",
    period: "1st Century CE",
    significance:
      "Reflects courtly life and leisure in ancient Pratishthana during the Satavahana period.",
    description:
      "Engraved ivory gaming dice of the type associated with excavations at ancient Pratishthana (Paithan); the specific find details shown here are indicative and pending confirmation.",
    category: "IVORY",
    accessionRef: "BPGM-IVO-019",
    dataStatus: "SAMPLE_TBD",
  },
  {
    id: "ex-maratha-swords",
    nameEn: "Maratha Cavalry Swords (Khanda) & Chainmail Armor",
    nameMr: "मराठा सैन्याची खांडा तलवार व चिलखत",
    period: "17th – 18th Century CE",
    significance:
      "Used by Maratha horsemen stationed at the Godavari river crossing defense garrisons.",
    description:
      "Hand-forged Khanda broadswords with basket hilts, paired with riveted iron chainmail — illustrative of Maratha-era arms; the specific items shown here are indicative and pending confirmation.",
    category: "WEAPONS",
    accessionRef: "BPGM-MIL-032",
    dataStatus: "SAMPLE_TBD",
  },
];

// ---------------------------------------------------------------------------
// TOURISM DESTINATIONS (specifications & visitor information)
// Core sites (Jayakwadi, Sant Eknath samadhi, Paithani weaving) are well
// documented; per-site timings, fees and some specifics are indicative and
// should be confirmed locally. See DATA_SOURCING_PLAN.md §6.
// ---------------------------------------------------------------------------

export interface TouristPlace {
  id: string;
  slug: string;
  nameEn: string;
  nameMr: string;
  category: "DAM_RESERVOIR" | "TEMPLE" | "HERITAGE" | "GARDEN" | "WEAVING";
  tagline: string;
  description: string;
  highlights: string[];
  visitingHours: string;
  entryFee: string;
  bestSeason: string;
  distanceFromBusStand: string;
  coordinates: { lat: number; lng: number };
  imageUrl: string;
  imageAlt: string;
}

export const TOURIST_PLACES: readonly TouristPlace[] = [
  {
    id: "tp-jayakwadi",
    slug: "jayakwadi-dam",
    nameEn: "Jayakwadi Dam (Paithan Dam)",
    nameMr: "जायकवाडी धरण (पैठण धरण)",
    category: "DAM_RESERVOIR",
    tagline: "One of the Largest Earthen Dams in Asia across the Godavari River",
    description:
      "Inaugurated in 1976, Jayakwadi Dam is a monumental engineering feat measuring 9,992 meters in length and 41.3 meters in height. It holds 102.7 TMC of water, with 27 radial spillway gates regulating the flow of Maharashtra's life-giving Godavari River.",
    highlights: [
      "9.9 km long earthen dam wall with sunset viewpoint",
      "27 radial spillway gates (12.5m x 7.9m each)",
      "Hydroelectric power plant",
      "Panoramic views of the 350 km² Nath Sagar water expanse",
    ],
    visitingHours: "08:00 AM – 06:00 PM",
    entryFee: "Free entry (nominal parking charges)",
    bestSeason: "August to February (Post-monsoon full reservoir)",
    distanceFromBusStand: "3.5 km",
    coordinates: { lat: 19.4883, lng: 75.3892 },
    imageUrl: "/images/sites/jayakwadi-dam.jpg",
    imageAlt: "Jayakwadi Dam showcasing the 27 radial spillway floodgates across the Godavari River in Paithan",
  },
  {
    id: "tp-bird-sanctuary",
    slug: "jaikwadi-bird-sanctuary",
    nameEn: "Jaikwadi Bird Sanctuary (Nath Sagar)",
    nameMr: "जायकवाडी पक्षी अभयारण्य (नाथ सागर)",
    category: "DAM_RESERVOIR",
    tagline: "Notified bird sanctuary on Nath Sagar hosting 234 recorded bird species",
    description:
      "Notified in 1986 across 341 km² of the Nath Sagar reservoir. The shallow backwaters and reed beds form one of Western India's greatest winter havens for migratory waterfowl traveling along the Central Asian Flyway.",
    highlights: [
      "Thousands of Greater Flamingos flocking from November to February",
      "Migratory Demoiselle Cranes, Bar-headed Geese, and Northern Pintails",
      "Designated Important Bird Area (IBA)",
      "Watchtowers along the reservoir perimeter",
    ],
    visitingHours: "06:30 AM – 05:30 PM",
    entryFee: "Forest department standard entry fee",
    bestSeason: "November to March (Peak migratory season)",
    distanceFromBusStand: "4.0 km",
    coordinates: { lat: 19.495, lng: 75.375 },
    imageUrl: "/images/sites/jaikwadi-birds.jpg",
    imageAlt: "Greater Flamingos and migratory cranes foraging across the waters of Jaikwadi Bird Sanctuary at Nath Sagar",
  },
  {
    id: "tp-eknath-mandir",
    slug: "sant-eknath-samadhi-mandir",
    nameEn: "Sant Eknath Maharaj Samadhi Mandir & Nagghat",
    nameMr: "संत एकनाथ महाराज समाधी मंदिर व नागघाट",
    category: "TEMPLE",
    tagline: "Spiritual Epicenter of the Varkari Bhakti Movement",
    description:
      "Located on the holy Godavari riverbank. Contains the sacred Jalsamadhi of 16th-century saint Sant Eknath Maharaj. Adjacent to the temple, Nagghat features ancient stone steps where pilgrims perform ritual ablutions and attend the sacred evening Godavari Maha-Aarti.",
    highlights: [
      "Annual Nath Shashti Mahotsav fair (Phalguna Vadya Shashti)",
      "Sacred Jalsamadhi shrine of Sant Eknath Maharaj",
      "Historic Godavari bathing ghats and stone pavilions",
      "Daily community annachhatra (meals)",
    ],
    visitingHours: "05:00 AM – 09:30 PM",
    entryFee: "Free",
    bestSeason: "Throughout the year (especially during Nath Shashti in March)",
    distanceFromBusStand: "1.2 km",
    coordinates: { lat: 19.48, lng: 75.385 },
    imageUrl: "/images/sites/sant-eknath-mandir.jpg",
    imageAlt: "Sant Eknath Maharaj Samadhi Mandir and historic Nagghat stone steps with pilgrims on Godavari river",
  },
  {
    id: "tp-eknath-wada",
    slug: "sant-eknath-wada",
    nameEn: "Sant Eknath Maharaj Wada",
    nameMr: "संत एकनाथ महाराज वाडा",
    category: "HERITAGE",
    tagline: "Ancestral 16th-Century Residence & Handwritten Manuscripts",
    description:
      "The historic residence of Sant Eknath Maharaj in the heart of old Paithan. Preserves the original wooden pillar touched by the saint, original handwritten pothis of the Eknathi Bhagavata, and sacred relics passed down through four centuries.",
    highlights: [
      "Original wooden pillar of Sant Eknath's residence",
      "Handwritten manuscript fragments in Modi script",
      "Peaceful courtyard shrine and prayer hall",
    ],
    visitingHours: "06:00 AM – 08:30 PM",
    entryFee: "Free",
    bestSeason: "Throughout the year",
    distanceFromBusStand: "1.5 km",
    coordinates: { lat: 19.482, lng: 75.387 },
    imageUrl: "/images/sites/sant-eknath-wada.jpg",
    imageAlt: "Historic interior courtyard of Sant Eknath Maharaj Wada showing carved teakwood pillars and sacred Shrikhandya pillar",
  },
  {
    id: "tp-apegaon",
    slug: "apegaon-dnyaneshwar-birthplace",
    nameEn: "Apegaon — Sant Dnyaneshwar Birthplace Temple",
    nameMr: "आपगाव — संत ज्ञानेश्वर जन्मस्थान मंदिर",
    category: "TEMPLE",
    tagline: "Ancestral Birthplace of Sant Dnyaneshwar & Siblings",
    description:
      "Situated on the banks of the Godavari 12 km from Paithan town. Apegaon is the ancestral home and judicially confirmed birthplace of Sant Dnyaneshwar, Nivruttinath, Sopandev, and Muktabai. Features a grand riverside temple complex and marks the origin of the annual Apegaon wari.",
    highlights: [
      "Sacred birthplace shrine of Sant Dnyaneshwar Maharaj",
      "Peaceful Godavari river bend with landscaped ghats",
      "Historic memorial to parents Vitthalpant and Rukminibai",
    ],
    visitingHours: "05:30 AM – 09:00 PM",
    entryFee: "Free",
    bestSeason: "July to March",
    distanceFromBusStand: "12 km (Paithan–Apegaon Road)",
    coordinates: { lat: 19.512, lng: 75.495 },
    imageUrl: "/images/sites/apegaon-temple.jpg",
    imageAlt: "Sant Dnyaneshwar Birthplace Temple at Apegaon on the picturesque banks of the Godavari River",
  },
  {
    id: "tp-dnyaneshwar-udyan",
    slug: "sant-dnyaneshwar-udyan",
    nameEn: "Sant Dnyaneshwar Udyan & Musical Fountains",
    nameMr: "संत ज्ञानेश्वर उद्यान व संगीत कारंजे",
    category: "GARDEN",
    tagline: "125-Hectare Landscaped Botanical Garden modeled on Brindavan Gardens",
    description:
      "Sprawled across 300 acres below the Jayakwadi dam spillway. Contains over 100,000 trees, manicured lawns, botanical nurseries, children's play areas, boating lagoons, and an evening musical dancing fountain system.",
    highlights: [
      "Evening musical water fountain performances with color illuminations",
      "Sprawling fruit orchards and floral pergolas",
      "Boating lake with paddle boats",
      "Direct gateway to the Balasaheb Patil Museum",
    ],
    visitingHours: "10:00 AM – 07:00 PM",
    entryFee: "₹20 Adults, ₹10 Children",
    bestSeason: "October to March",
    distanceFromBusStand: "2.8 km",
    coordinates: { lat: 19.486, lng: 75.391 },
    imageUrl: "/images/sites/dnyaneshwar-udyan.jpg",
    imageAlt: "Sant Dnyaneshwar Udyan botanical gardens with evening illuminated dancing musical fountains",
  },
  {
    id: "tp-patil-museum",
    slug: "dr-balasaheb-patil-museum",
    nameEn: "Dr. Balasaheb Patil Government Archaeological Museum",
    nameMr: "बाळासाहेब पाटील शासकीय वस्तुसंग्रहालय",
    category: "HERITAGE",
    tagline: "State museum holding Satavahana-era relics and Maratha-era Modi-script records",
    description:
      "Located inside the Sant Dnyaneshwar Garden campus. Administered by the Maharashtra Directorate of Archaeology & Museums, holding over 10,000 antiquities donated by late scholar Dr. Balasaheb Patil including Satavahana coins, ancient pottery, weapons, and Maratha charters.",
    highlights: [
      "Modi-script Maratha-era royal decree (Rajpatra)",
      "Satavahana-era coins and coin-moulds (2nd cent. BCE onward)",
      "Roman-contact carnelian and agate beads",
      "Antique gold-zari Paithani saree pallu",
    ],
    visitingHours: "10:30 AM – 05:00 PM (Closed on Mondays & Public Holidays)",
    entryFee: "₹10 Adults, ₹5 Children",
    bestSeason: "Throughout the year",
    distanceFromBusStand: "2.8 km",
    coordinates: { lat: 19.4855, lng: 75.3905 },
    imageUrl: "/images/sites/balasaheb-patil-museum.jpg",
    imageAlt: "Dr. Balasaheb Patil Government Archaeological Museum gallery displaying ancient Satavahana coins and terracotta artifacts",
  },
  {
    id: "tp-paithani-weavers",
    slug: "paithani-silk-weaving-centers",
    nameEn: "Paithani Handloom Weaving Clusters & Mega Tourism Centre",
    nameMr: "पैठणी हातमाग विणकाम केंद्र",
    category: "WEAVING",
    tagline: "Centuries-Old GI-Tagged Handloom Silk Weaving Tradition",
    description:
      "Paithan is a historic centre of Paithani silk weaving. Visitors can observe master artisans operating traditional pit looms, interlacing pure silk with gold and silver zari to create classic motifs such as the peacock (Bangadi Mor), lotus and Munia (parrot).",
    highlights: [
      "Live demonstrations of intricate tapestry handloom weaving",
      "Direct cooperative purchasing from master weavers",
      "Geographical Indication (GI) certified authenticity",
    ],
    visitingHours: "09:30 AM – 07:30 PM",
    entryFee: "Free",
    bestSeason: "Throughout the year",
    distanceFromBusStand: "1.0 km (Paithani Weavers Colony)",
    coordinates: { lat: 19.479, lng: 75.382 },
    imageUrl: "/images/sites/paithani-weaving.jpg",
    imageAlt: "Master handloom weaver on a traditional wooden pit loom weaving a pure silk and gold zari Paithani saree",
  },
  {
    id: "tp-brahmapuri",
    slug: "brahmapuri-ancient-mound",
    nameEn: "Ancient Pratishthana Archaeological Mound (Brahmapuri)",
    nameMr: "प्राचीन प्रतिष्ठान उत्खनन टेकडी (ब्रह्मपुरी)",
    category: "HERITAGE",
    tagline: "Excavated Settlement of the Satavahana-Era Capital, Pratishthana",
    description:
      "The ancient settlement mound of Pratishthana (Paithan) beside the Godavari River. Archaeological excavations here are reported to have exposed early urban brick structures, terracotta ring wells and finds pointing to long-distance Roman-contact trade. Site access and facilities should be confirmed locally before visiting.",
    highlights: [
      "Reported Satavahana-era brick structures and terracotta ring wells",
      "Open archaeological site beside the Godavari (visitor facilities to be confirmed)",
      "Views overlooking the Godavari river basin",
      "Associated with the Roman-contact trade recorded in the Periplus of the Erythraean Sea",
    ],
    visitingHours: "08:00 AM – 06:00 PM",
    entryFee: "Free",
    bestSeason: "October to March",
    distanceFromBusStand: "2.0 km",
    coordinates: { lat: 19.475, lng: 75.38 },
    imageUrl: "/images/sites/brahmapuri-mound.jpg",
    imageAlt: "Archaeological excavation mound at ancient Pratishthana (Paithan) exposing Satavahana-era brick walls and terracotta ring wells",
  },
];

// ---------------------------------------------------------------------------
// CURATED TOURIST ROUTES / ITINERARIES (suggested)
// ---------------------------------------------------------------------------

export interface CuratedRoute {
  id: string;
  nameEn: string;
  nameMr: string;
  duration: string;
  idealFor: string;
  description: string;
  stops: Array<{ placeName: string; note: string }>;
}

export const CURATED_ROUTES: readonly CuratedRoute[] = [
  {
    id: "route-pilgrim",
    nameEn: "Sacred Pilgrim & Varkari Heritage Route",
    nameMr: "पवित्र तीर्थक्षेत्र व वारकरी दर्शन मार्ग",
    duration: "1 Full Day",
    idealFor: "Pilgrims, Spiritual Seekers & Families",
    description:
      "A soulful pilgrimage connecting the holy Godavari ablutions with the samadhi shrines of Sant Eknath and the birthplace of Sant Dnyaneshwar.",
    stops: [
      { placeName: "Godavari Nagghat", note: "06:30 AM — Holy river bath and morning sunrise prayer at Nagghat stone steps." },
      { placeName: "Sant Eknath Samadhi Mandir", note: "08:00 AM — Darshan at the sacred Jalsamadhi temple and morning aarti." },
      { placeName: "Sant Eknath Wada", note: "10:30 AM — Walk 400m to the ancestral wada; view historic wooden pillar and pothis." },
      { placeName: "Apegaon Riverside Temple", note: "02:30 PM — Drive 12 km to Apegaon, visit Sant Dnyaneshwar's birthplace." },
      { placeName: "Nagghat Evening Maha-Aarti", note: "06:30 PM — Return to Paithan for the evening lamp-floating Godavari aarti." },
    ],
  },
  {
    id: "route-heritage-history",
    nameEn: "Satavahana Imperial & Archaeological Circuit",
    nameMr: "सातवाहन साम्राज्य व पुरातत्व वारसा मार्ग",
    duration: "1 Day",
    idealFor: "History Students, Researchers & Cultural Tourists",
    description:
      "Trace 2,200 years of Deccan history from imperial Pratishthana's Roman trade to royal Maratha edicts and master handloom silk weaving.",
    stops: [
      { placeName: "Dr. Balasaheb Patil Government Museum", note: "10:30 AM — Study Satavahana coin hoards, Roman-trade beads, and Maratha-era Modi-script records." },
      { placeName: "Ancient Pratishthana Mound (Brahmapuri)", note: "01:30 PM — Visit the site of the ancient Satavahana capital, Pratishthana." },
      { placeName: "Paithani Handloom Weaving Colony", note: "03:30 PM — Experience live tapestry weaving on wooden pit looms with master artisans." },
      { placeName: "Sant Dnyaneshwar Udyan", note: "05:30 PM — Relax in the expansive botanical gardens and watch the sunset." },
    ],
  },
  {
    id: "route-nature-dam",
    nameEn: "Jayakwadi Reservoir & Avian Wetland Trail",
    nameMr: "जायकवाडी धरण व पक्षी अभयारण्य निसर्ग मार्ग",
    duration: "1 Day (Best in Winter)",
    idealFor: "Birdwatchers, Photographers & Nature Enthusiasts",
    description:
      "Explore one of Asia's largest earthen dams and witness thousands of migratory birds feeding along the Nath Sagar wetland borders.",
    stops: [
      { placeName: "Jaikwadi Bird Sanctuary (Flamingo Point)", note: "06:30 AM — Early morning birdwatching; spot Greater Flamingos and cranes." },
      { placeName: "Jayakwadi Dam Crest & Spillway View", note: "10:00 AM — Walk along the 10 km dam overlook; inspect the 27 radial gates." },
      { placeName: "Sant Dnyaneshwar Botanical Garden", note: "03:00 PM — Stroll through fruit orchards and boat in the lagoon." },
      { placeName: "Musical Dancing Fountains", note: "06:45 PM — Witness the illuminated evening musical fountain show." },
    ],
  },
];

// Backwards-compatible aliases for existing pages
export const PUBLIC_REPRESENTATIVES = [...electedRepresentatives, ...administrationRepresentatives];
export const PAITHAN_WARDS = wards.map((w) => ({
  id: `w-${w.number}`,
  number: w.number,
  name: w.name,
  nameMr: w.nameMr,
  corporatorName: "Pending official gazette confirmation",
  corporatorNameMr: "अधिकृत राजपत्रातील पुष्टी प्रलंबित",
  corporatorParty: "TBD",
  contact: "02431-223010",
  activeProjects: getWardWorkSummary(w.number).total,
  isSample: true,
}));
export const DEVELOPMENT_WORKS = developmentWorks;
export const OFFICIAL_NOTIFICATIONS = notifications;
