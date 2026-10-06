const fs = require("fs");
const path = require("path");

const enFile = path.join(__dirname, "../messages/en.json");
const mrFile = path.join(__dirname, "../messages/mr.json");
const hiFile = path.join(__dirname, "../messages/hi.json");

const en = JSON.parse(fs.readFileSync(enFile, "utf8"));
const mr = JSON.parse(fs.readFileSync(mrFile, "utf8"));
const hi = JSON.parse(fs.readFileSync(hiFile, "utf8"));

const trackEn = {
  trackSubtitle: "Check live investigation and resolution status of your filed municipal complaint.",
  ticketNoLabel: "Grievance Ticket Number",
  phonePlaceholder: "10-digit mobile number",
  phoneNote: "Enter the mobile number provided when filing the grievance.",
  errorTicketRequired: "Please enter your grievance ticket number",
  errorPhoneRequired: "Please enter your mobile phone number",
  trackError: "Grievance not found or mobile number mismatch. Please verify details.",
  searching: "Searching grievance records...",
  statusSubmitted: "Submitted / Registered",
  statusAcknowledged: "Acknowledged by Department",
  statusInProgress: "Investigation in Progress",
  statusResolved: "Resolved & Closed",
  statusRejected: "Rejected / Invalid",
  updatesHistory: "Investigation & Action History",
  noUpdatesYet: "No updates recorded yet for this grievance.",
};

const trackMr = {
  trackSubtitle: "आपण दाखल केलेल्या नागरी तक्रारीची सद्यस्थिती व निवारण प्रगती तपासा.",
  ticketNoLabel: "तक्रार तिकीट क्रमांक",
  phonePlaceholder: "१०-अंकी मोबाईल क्रमांक",
  phoneNote: "तक्रार दाखल करताना दिलेला मोबाईल क्रमांक प्रविष्ट करा.",
  errorTicketRequired: "कृपया आपला तक्रार तिकीट क्रमांक प्रविष्ट करा",
  errorPhoneRequired: "कृपया आपला मोबाईल क्रमांक प्रविष्ट करा",
  trackError: "तक्रार आढळली नाही किंवा मोबाईल क्रमांक जुळत नाही. कृपया तपशील तपासा.",
  searching: "तक्रार शोधत आहे...",
  statusSubmitted: "नोंदणीकृत / दाखल",
  statusAcknowledged: "विभागाने स्वीकारली",
  statusInProgress: "चौकशी व काम प्रगतीपथावर",
  statusResolved: "निवारण पूर्ण व बंद",
  statusRejected: "नाकारली / अवैध",
  updatesHistory: "चौकशी व कारवाईचा इतिहास",
  noUpdatesYet: "या तक्रारीवर अद्याप कोणतीही नोंद उपलब्ध नाही.",
};

const trackHi = {
  trackSubtitle: "अपनी दर्ज की गई नागरिक शिकायत की जांच एवं निस्तारण स्थिति जांचें।",
  ticketNoLabel: "शिकायत टिकट संख्या",
  phonePlaceholder: "१०-अंकीय मोबाइल नंबर",
  phoneNote: "शिकायत दर्ज करते समय दिया गया मोबाइल नंबर दर्ज करें।",
  errorTicketRequired: "कृपया अपनी शिकायत टिकट संख्या दर्ज करें",
  errorPhoneRequired: "कृपया अपना मोबाइल नंबर दर्ज करें",
  trackError: "शिकायत नहीं मिली या मोबाइल नंबर मेल नहीं खा रहा। कृपया विवरण जांचें।",
  searching: "शिकायत रिकॉर्ड खोज रहे हैं...",
  statusSubmitted: "पंजीकृत / दर्ज",
  statusAcknowledged: "विभाग द्वारा स्वीकृत",
  statusInProgress: "जांच एवं कार्य प्रगति पर",
  statusResolved: "निस्तारित एवं बंद",
  statusRejected: "अस्वीकृत / अमान्य",
  updatesHistory: "जांच एवं कार्रवाई इतिहास",
  noUpdatesYet: "इस शिकायत पर अभी तक कोई अपडेट दर्ज नहीं है।",
};

Object.assign(en.grievance, trackEn);
Object.assign(mr.grievance, trackMr);
Object.assign(hi.grievance, trackHi);

fs.writeFileSync(enFile, JSON.stringify(en, null, 2), "utf8");
fs.writeFileSync(mrFile, JSON.stringify(mr, null, 2), "utf8");
fs.writeFileSync(hiFile, JSON.stringify(hi, null, 2), "utf8");

console.log("Added track keys successfully!");
