const fs = require("fs");
const path = require("path");

const enFile = path.join(__dirname, "../messages/en.json");
const mrFile = path.join(__dirname, "../messages/mr.json");
const hiFile = path.join(__dirname, "../messages/hi.json");

const en = JSON.parse(fs.readFileSync(enFile, "utf8"));
const mr = JSON.parse(fs.readFileSync(mrFile, "utf8"));
const hi = JSON.parse(fs.readFileSync(hiFile, "utf8"));

const grievanceEn = {
  submitSubtitle: "Submit municipal complaints online for quick resolution by Paithan Municipal Council.",
  sectorLabel: "Select Municipal Sector",
  sectorPlaceholder: "-- Choose relevant department --",
  sectorRoads: "Roads, Streetlights & Pavements",
  sectorWater: "Drinking Water & Pipeline Leakage",
  sectorEducation: "Municipal Schools & Anganwadis",
  sectorHealth: "Sanitation, Garbage & Public Health",
  sectorOther: "Other Civic & Town Infrastructure",
  titleLabel: "Grievance Title / Subject",
  titlePlaceholder: "Brief summary of the issue...",
  descriptionPlaceholder: "Provide detailed location, problem description, and landmarks...",
  citizenInfoTitle: "Citizen Contact Details",
  citizenInfoNote: "Your contact info will be used for SMS/Email status updates.",
  nameLabel: "Citizen Full Name",
  phoneLabel: "Mobile Phone Number",
  emailLabel: "Email Address (Optional)",
  photoLabel: "Attach Supporting Photo",
  uploadPhoto: "Upload Photo",
  changePhoto: "Change Photo",
  uploadingPhoto: "Uploading photo...",
  photoHelp: "JPG, PNG up to 5MB",
  submitGrievance: "Submit Official Grievance",
  submitting: "Submitting Grievance...",
  successTitle: "Grievance Registered Successfully!",
  ticketNumber: "Your Grievance Tracking Number",
  ticketNote: "Please save this tracking number to check resolution status.",
  submitAnother: "Submit Another Grievance",
  trackGrievance: "Track Grievance Status",
  errorRequired: "This field is required",
  errorMaxLength: "Maximum length exceeded",
  errorInvalidPhone: "Please enter a valid 10-digit mobile number",
  errorInvalidEmail: "Please enter a valid email address",
  submitError: "Failed to submit grievance. Please verify details and retry.",
  turnstileRequired: "Please complete the security verification",
};

const grievanceMr = {
  submitSubtitle: "पैठण नगरपरिषदेकडे त्वरित निवारणासाठी आपली नागरी तक्रार नोंदवा.",
  sectorLabel: "नगरपालिका विभाग निवडा",
  sectorPlaceholder: "-- संबंधित विभाग निवडा --",
  sectorRoads: "रस्ते, पथदिवे व पदपथ",
  sectorWater: "पिण्याचे पाणी व पाईपलाईन गळती",
  sectorEducation: "नगरपालिका शाळा व अंगणवाडी",
  sectorHealth: "स्वच्छता, कचरा व सार्वजनिक आरोग्य",
  sectorOther: "इतर नागरी व शहर पायाभूत सुविधा",
  titleLabel: "तक्रारीचे शीर्षक / विषय",
  titlePlaceholder: "समस्येचा संक्षिप्त सारांश...",
  descriptionPlaceholder: "तपशीलवार स्थान, समस्येचे स्वरूप व खुणा नमूद करा...",
  citizenInfoTitle: "नागरिक संपर्क माहिती",
  citizenInfoNote: "स्थिती अपडेट्ससाठी आपली संपर्क माहिती वापरली जाईल.",
  nameLabel: "नागरिकाचे पूर्ण नाव",
  phoneLabel: "मोबाईल क्रमांक",
  emailLabel: "ईमेल पत्ता (ऐच्छिक)",
  photoLabel: "समर्थक छायाचित्र जोडा",
  uploadPhoto: "छायाचित्र अपलोड करा",
  changePhoto: "छायाचित्र बदला",
  uploadingPhoto: "छायाचित्र अपलोड होत आहे...",
  photoHelp: "जेपीजी, पीएनजी कमाल ५ एमबी",
  submitGrievance: "अधिकृत तक्रार दाखल करा",
  submitting: "तक्रार दाखल होत आहे...",
  successTitle: "तक्रार यशस्वीरित्या नोंदवली गेली!",
  ticketNumber: "आपला तक्रार ट्रॅकिंग क्रमांक",
  ticketNote: "निवारण स्थिती तपासण्यासाठी हा क्रमांक सुरक्षित ठेवा.",
  submitAnother: "दुसरी तक्रार नोंदवा",
  trackGrievance: "तक्रार स्थिती तपासा",
  errorRequired: "हे फील्ड भरणे आवश्यक आहे",
  errorMaxLength: "कमाल मर्यादा ओलांडली आहे",
  errorInvalidPhone: "कृपया वैध १०-अंकी मोबाईल क्रमांक प्रविष्ट करा",
  errorInvalidEmail: "कृपया वैध ईमेल पत्ता प्रविष्ट करा",
  submitError: "तक्रार नोंदवण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.",
  turnstileRequired: "कृपया सुरक्षा पडताळणी पूर्ण करा",
};

const grievanceHi = {
  submitSubtitle: "पैठण नगर परिषद में त्वरित निवारण हेतु अपनी नागरिक शिकायत दर्ज करें।",
  sectorLabel: "नगरपालिका विभाग चुनें",
  sectorPlaceholder: "-- संबंधित विभाग चुनें --",
  sectorRoads: "सड़कें, स्ट्रीट लाइट एवं फुटपाथ",
  sectorWater: "पेयजल एवं पाइपलाइन रिसाव",
  sectorEducation: "नगरपालिका स्कूल एवं आंगनवाड़ी",
  sectorHealth: "स्वच्छता, कचरा एवं जन स्वास्थ्य",
  sectorOther: "अन्य नागरिक एवं नगर बुनियादी ढांचा",
  titleLabel: "शिकायत का शीर्षक / विषय",
  titlePlaceholder: "समस्या का संक्षिप्त विवरण...",
  descriptionPlaceholder: "विस्तृत स्थान, समस्या का विवरण एवं पहचान चिह्न दर्ज करें...",
  citizenInfoTitle: "नागरिक संपर्क विवरण",
  citizenInfoNote: "स्थिति अपडेट हेतु आपकी संपर्क जानकारी उपयोग की जाएगी।",
  nameLabel: "नागरिक का पूरा नाम",
  phoneLabel: "मोबाइल नंबर",
  emailLabel: "ईमेल पता (वैकल्पिक)",
  photoLabel: "समर्थक फोटो संलग्न करें",
  uploadPhoto: "फोटो अपलोड करें",
  changePhoto: "फोटो बदलें",
  uploadingPhoto: "फोटो अपलोड हो रहा है...",
  photoHelp: "जेपीजी, पीएनजी अधिकतम ५ एमबी",
  submitGrievance: "आधिकारिक शिकायत दर्ज करें",
  submitting: "शिकायत दर्ज हो रही है...",
  successTitle: "शिकायत सफलतापूर्वक दर्ज हुई!",
  ticketNumber: "आपकी शिकायत ट्रैकिंग संख्या",
  ticketNote: "निस्तारण स्थिति जांचने हेतु इस नंबर को सुरक्षित रखें।",
  submitAnother: "अन्य शिकायत दर्ज करें",
  trackGrievance: "शिकायत स्थिति ट्रैक करें",
  errorRequired: "यह फ़ील्ड भरना आवश्यक है",
  errorMaxLength: "अधिकतम सीमा पार हो गई",
  errorInvalidPhone: "कृपया वैध १०-अंकीय मोबाइल नंबर दर्ज करें",
  errorInvalidEmail: "कृपया वैध ईमेल पता दर्ज करें",
  submitError: "शिकायत दर्ज करने में त्रुटि। कृपया पुनः प्रयास करें।",
  turnstileRequired: "कृपया सुरक्षा सत्यापन पूरा करें",
};

Object.assign(en.grievance, grievanceEn);
Object.assign(mr.grievance, grievanceMr);
Object.assign(hi.grievance, grievanceHi);

fs.writeFileSync(enFile, JSON.stringify(en, null, 2), "utf8");
fs.writeFileSync(mrFile, JSON.stringify(mr, null, 2), "utf8");
fs.writeFileSync(hiFile, JSON.stringify(hi, null, 2), "utf8");

console.log("Added grievance keys successfully!");
