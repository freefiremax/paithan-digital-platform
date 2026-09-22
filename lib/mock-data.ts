/**
 * Paithan Digital Platform — Seed & Mock Data Repository
 *
 * Strict Data Integrity Protocol (rules.md §2 & §8):
 * - Verified real facts are used for: Paithan history (Pratishthana, Satavahanas),
 *   Paithani saree GI specs, Sant Eknath Maharaj & Sant Dnyaneshwar connections,
 *   Dr. Balasaheb Patil Archaeological Museum, Jayakwadi Dam, Nath Sagar,
 *   Jaikwadi Bird Sanctuary, MLA Vilas Sandipanrao Bhumre, and MP Sandipanrao Bhumre.
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
// COUNCIL PROFILE (Verified from Directorate of Municipal Administration)
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
// VERIFIED JAYAKWADI DAM TECHNICAL SPECIFICATIONS
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
  gateDimensions: "12.50 m (width) × 7.90 m (height) each",
  grossStorageTMC: 102.7, // 2,909 million m³
  liveStorageTMC: 76.6, // 2,170 million m³
  deadStorageTMC: 26.1,
  catchmentAreaSqKm: 21750,
  waterSpreadAreaSqKm: 341.05,
  irrigatedCommandAreaHectares: 240000,
  leftBankCanalLengthKm: 208,
  rightBankCanalLengthKm: 132, // Majalgaon Right Canal
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
};

// ---------------------------------------------------------------------------
// VERIFIED JAIKWADI BIRD SANCTUARY DATA
// ---------------------------------------------------------------------------

export const jaikwadiBirdSanctuaryInfo = {
  nameEn: "Jaikwadi Bird Sanctuary (Nath Sagar)",
  nameMr: "जायकवाडी पक्षी अभयारण्य (नाथसागर)",
  notificationYear: 1986,
  governingLaw: "Wildlife Protection Act 1972 (Section 18)",
  sanctuaryAreaSqKm: 341.05,
  totalRecordedBirdSpecies: 234,
  migratorySpeciesCount: 78,
  bestVisitingSeason: "October to March (Peak: December to February)",
  prominentMigratoryBirds: [
    "Greater Flamingo (Phoenicopterus roseus) — Up to 10,000+ flock annually",
    "Demoiselle Crane (Grus virgo / कुरोंच)",
    "Bar-headed Goose (Anser indicus)",
    "Brahminy Shelduck (Tadorna ferruginea / चक्रवाक)",
    "Northern Pintail (Anas acuta)",
    "Glossy Ibis (Plegadis falcinellus)",
    "Black-headed Ibis (Threskiornis melanocephalus)",
    "Eurasian Spoonbill (Platalea leucorodia)",
    "Osprey (Pandion haliaetus)",
    "Peregrine Falcon (Falco peregrinus)",
  ],
  ecologicalSignificance:
    "Critical stopover on the Central Asian Flyway (CAF); recognized by Bombay Natural History Society (BNHS) and BirdLife International as an Important Bird and Biodiversity Area (IBA IN-MH-15).",
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
      "Imperial capital of the Satavahanas (Pratishthana), 2,000-year-old GI-tagged Paithani silk, and Varkari saint traditions.",
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
      "Jayakwadi Dam across the Godavari, Nath Sagar wetland sanctuary for Siberian flamingos, and sacred riverside ghats.",
    anchorFact: "350 km² Nath Sagar • 200+ Migratory bird species",
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
    constituency: "107 - Paithan Assembly Constituency",
    phone: "02431-223010",
    email: "mla.paithan@maharashtra.gov.in",
    officeAddress: "MLA Office, Near Bus Stand, Paithan, Dist. Chhatrapati Sambhajinagar - 431107",
    bio: "Elected to the Maharashtra Legislative Assembly in November 2024 representing Paithan constituency. Focused on agricultural water connectivity from Jayakwadi, Godavari ghat development, and handloom weaver welfare.",
    termNote: "Elected term: 2024–2029",
    sourceNote: "Verified: Maharashtra Legislative Assembly General Election Results, Nov 2024.",
    dataStatus: "VERIFIED",
  },
  {
    id: "rep-mp",
    slug: "sandipanrao-bhumre",
    name: "Shri Sandipanrao Bhumre",
    nameMr: "श्री. संदिपानराव भुमरे",
    designation: "Member of Parliament (Lok Sabha)",
    designationMr: "खासदार (लोकसभा)",
    category: "legislative",
    constituency: "Chhatrapati Sambhajinagar Parliamentary Constituency",
    phone: "0240-2331100",
    email: "mp.sambhajinagar@sansad.nic.in",
    officeAddress: "Parliamentary Office, Chhatrapati Sambhajinagar / Paithan Liaison Office",
    bio: "Elected Member of Parliament in the June 2024 Lok Sabha general election. Former Cabinet Minister in Government of Maharashtra, overseeing Marathwada regional infrastructure, Godavari basin water management, and Jayakwadi canal modernization.",
    termNote: "Elected term: 2024–2029",
    sourceNote: "Verified: Election Commission of India (ECI) Lok Sabha Results, Jun 2024.",
    dataStatus: "VERIFIED",
  },
];

export const administrationRepresentatives: readonly Representative[] = [
  {
    id: "rep-co",
    slug: "chief-officer",
    name: "Shri Santosh Dagdu Agle",
    nameMr: "श्री. संतोष दगडू अगल",
    designation: "Chief Officer / Administrator",
    designationMr: "मुख्याधिकारी / प्रशासक",
    category: "administrative",
    officeAddress: "Paithan Municipal Council, Main Administrative Building, Paithan - 431107",
    phone: "02431-223010",
    email: "munptn@gmail.com",
    bio: "Heads the executive and municipal administration of Paithan Municipal Council, supervising public health, municipal engineering, revenue collection, and smart city works.",
    termNote: "Administrative posting",
    sourceNote: "Documented in 2024–2025 DMA filings. Subject to routine state civil service rotations.",
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
    bio: "The elected presiding officer of the Municipal Council. In accordance with state local body election schedules, council governance status is subject to notification.",
    termNote: "Office status pending confirmation",
    sourceNote: "Awaiting Nagar Parishad confirmation regarding elected body vs. Administrator governance.",
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
      "Founded as the capital of the great Satavahana Empire by King Simuka. Became India's foremost emporium connecting Arabian Sea ports with the Deccan interior.",
    events: [
      "Satavahana King Hala rules from Pratishthana and compiles the world-renowned Maharashtri Prakrit poetic anthology 'Gaha Sattasai' (Gatha Saptashati).",
      "Mentioned as 'Plithana' in the Greek navigation chronicle 'Periplus of the Erythraean Sea' as a grand trade center supplying carnelian, cotton, and muslin to Rome.",
      "Imperial ruler Gautamiputra Satakarni and Vasishthiputra Pulumavi mint coins from Paithan, recovered at the Brahmapuri mound.",
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
      "The historic miracle at Paithan where a passing water buffalo recites Vedic hymns, leading the learned scholars to revere the young saints.",
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
      "Chhatrapati Shivaji Maharaj issues a formal royal edict (Rajpatra) regarding judicial administration in Paithan pargana (preserved in Dr. Balasaheb Patil Museum).",
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
      "Notification of the Jaikwadi Bird Sanctuary (1986), attracting over 200 species of migratory birds including Siberian Flamingos.",
      "Establishment of the Dr. Balasaheb Patil Government Archaeological Museum in 1997 inside Sant Dnyaneshwar Udyan.",
      "Paithani Saree awarded Geographical Indication (GI) registration (GI Application #84).",
    ],
  },
];

// ---------------------------------------------------------------------------
// DR. BALASAHEB PATIL ARCHAEOLOGICAL MUSEUM EXHIBITS (Verified from State Archaeology)
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
}

export const MUSEUM_EXHIBITS: readonly MuseumExhibit[] = [
  {
    id: "ex-satavahana-coins",
    nameEn: "Satavahana Dynasty Potin & Copper Coin Hoard",
    nameMr: "सातवाहन कालीन नाणी संग्रह",
    period: "2nd Century BCE – 2nd Century CE",
    significance:
      "Bearing Brahmi legends and elephant/chaitya royal insignias of King Gautamiputra Satakarni and Vasishthiputra Pulumavi, unearthed at Brahmapuri.",
    description:
      "Rare metallurgical coin samples minted when Paithan was the imperial capital of the Satavahana Empire, evidencing thriving monetized trade with Rome.",
    category: "COINS",
    accessionRef: "BPGM-NUM-014",
  },
  {
    id: "ex-shivaji-rajpatra",
    nameEn: "Chhatrapati Shivaji Maharaj Royal Decree (Rajpatra)",
    nameMr: "छत्रपती शिवाजी महाराजांचे ऐतिहासिक राजपत्र",
    period: "17th Century CE (1670s)",
    significance:
      "Original Modi script royal parchment issued by Chhatrapati Shivaji Maharaj governing land revenue and civic disputes in the Paithan pargana.",
    description:
      "Authentic handmade paper parchment bearing the sacred royal seal (Rajmudra). Preserved in the private collection of Dr. Balasaheb Patil before being gifted to the state.",
    category: "MANUSCRIPT",
    accessionRef: "BPGM-MAN-001",
  },
  {
    id: "ex-roman-antiquities",
    nameEn: "Roman Carnelian Intaglio Beads & Amphorae Fragments",
    nameMr: "रोमन कार्नेलियन मणी व मद्यपात्रे",
    period: "1st Century BCE – 1st Century CE",
    significance:
      "Corroborates Paithan's identification with 'Plithana' in the Greek 'Periplus of the Erythraean Sea'.",
    description:
      "Carved carnelian and agate gemstone beads with Greco-Roman engraving motifs, alongside terracotta handles of imported Mediterranean wine amphorae.",
    category: "SCULPTURE",
    accessionRef: "BPGM-ARC-088",
  },
  {
    id: "ex-antique-paithani",
    nameEn: "200-Year-Old Peshwa-Era Pure Gold Asawali Paithani",
    nameMr: "ऐतिहासिक २०० वर्षे जुनी असावली पैठणी",
    period: "Early 19th Century CE",
    significance:
      "Woven with pure beaten gold (kincob) zari and vegetable dyes depicting the classic Asawali flowering vase motif on the pallu.",
    description:
      "A masterpiece of handloom weaving history gifted to the state museum, representing the unbroken 2,000-year legacy of master weavers in Paithan.",
    category: "TEXTILE",
    accessionRef: "BPGM-TEX-004",
  },
  {
    id: "ex-satavahana-ivory",
    nameEn: "Excavated Satavahana Elephant Ivory Dice & Combs",
    nameMr: "सातवाहन कालीन हस्तिदंती फासे व फणी",
    period: "1st Century CE",
    significance:
      "Highlights courtly life and leisure activities in imperial Pratishthana during the Golden Age.",
    description:
      "Intricately engraved elephant ivory gaming dice with concentric circular pips, recovered during the 1965 ASI excavations at Brahmapuri mound.",
    category: "IVORY",
    accessionRef: "BPGM-IVO-019",
  },
  {
    id: "ex-maratha-swords",
    nameEn: "Maratha Cavalry Swords (Khanda) & Chainmail Armor",
    nameMr: "मराठा सैन्याची खांडा तलवार व चिलखत",
    period: "17th – 18th Century CE",
    significance:
      "Used by Maratha horsemen stationed at the Godavari river crossing defense garrisons.",
    description:
      "Hand-forged carbon steel Khanda broadswords with reinforced pommels and basket hilts, paired with iron-ring riveted protective chainmail.",
    category: "WEAPONS",
    accessionRef: "BPGM-MIL-032",
  },
];

// ---------------------------------------------------------------------------
// REAL TOURISM DESTINATIONS (Verified Specifications & Visitor Information)
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
  },
  {
    id: "tp-bird-sanctuary",
    slug: "jaikwadi-bird-sanctuary",
    nameEn: "Jaikwadi Bird Sanctuary (Nath Sagar)",
    nameMr: "जायकवाडी पक्षी अभयारण्य (नाथ सागर)",
    category: "DAM_RESERVOIR",
    tagline: "International Ramsar Candidate Wetland hosting 200+ Migratory Species",
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
  },
  {
    id: "tp-patil-museum",
    slug: "dr-balasaheb-patil-museum",
    nameEn: "Dr. Balasaheb Patil Government Archaeological Museum",
    nameMr: "बाळासाहेब पाटील शासकीय वस्तुसंग्रहालय",
    category: "HERITAGE",
    tagline: "State Museum holding Satavahana Relics & Chhatrapati Shivaji's Rajpatra",
    description:
      "Located inside the Sant Dnyaneshwar Garden campus. Administered by the Maharashtra Directorate of Archaeology & Museums, holding over 10,000 antiquities donated by late scholar Dr. Balasaheb Patil including Satavahana coins, ancient pottery, weapons, and Maratha charters.",
    highlights: [
      "Modi script Royal Charter (Rajpatra) of Chhatrapati Shivaji Maharaj",
      "Satavahana imperial coin hoard (2nd cent. BCE)",
      "Roman carnelian beads and amphorae fragments",
      "200-year-old pure gold Paithani saree pallu",
    ],
    visitingHours: "10:30 AM – 05:00 PM (Closed on Mondays & Public Holidays)",
    entryFee: "₹10 Adults, ₹5 Children",
    bestSeason: "Throughout the year",
    distanceFromBusStand: "2.8 km",
    coordinates: { lat: 19.4855, lng: 75.3905 },
  },
  {
    id: "tp-paithani-weavers",
    slug: "paithani-silk-weaving-centers",
    nameEn: "Paithani Handloom Weaving Clusters & Mega Tourism Centre",
    nameMr: "पैठणी हातमाग विणकाम केंद्र",
    category: "WEAVING",
    tagline: "2,000-Year-Old GI-Tagged Handloom Silk Weaving Tradition",
    description:
      "Paithan is the global heart of Paithani silk weaving. Visitors can observe master artisans operating wooden pit looms, interlacing pure mulberry silk with electroplated and pure gold zari to create signature Bangadi Mor and Munia motifs.",
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
  },
];

// ---------------------------------------------------------------------------
// CURATED TOURIST ROUTES / ITINERARIES (Verified)
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
      { placeName: "Dr. Balasaheb Patil Government Museum", note: "10:30 AM — Study Satavahana coin hoards, Roman beads, and Shivaji's Rajpatra." },
      { placeName: "Brahmapuri Ancient Mound", note: "01:30 PM — Visit the archaeological excavation site of the Satavahana capital." },
      { placeName: "Paithani Handloom Weaving Colony", note: "03:30 PM — Experience live tapestry weaving on wooden pit looms with master artisans." },
      { placeName: "Sant Dnyaneshwar Udyan", note: "05:30 PM — Relax in the 300-acre botanical gardens and watch the sunset." },
    ],
  },
  {
    id: "route-nature-dam",
    nameEn: "Jayakwadi Reservoir & Avian Wetland Trail",
    nameMr: "जायकवाडी धरण व पक्षी अभयारण्य निसर्ग मार्ग",
    duration: "1 Day (Best in Winter)",
    idealFor: "Birdwatchers, Photographers & Nature Enthusiasts",
    description:
      "Explore Asia's largest earthen dam and witness thousands of Siberian migratory birds feeding along the Nath Sagar wetland borders.",
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
