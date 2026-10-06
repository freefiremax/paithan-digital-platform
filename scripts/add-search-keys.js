const fs = require("fs");
const path = require("path");

const enFile = path.join(__dirname, "../messages/en.json");
const mrFile = path.join(__dirname, "../messages/mr.json");
const hiFile = path.join(__dirname, "../messages/hi.json");

const en = JSON.parse(fs.readFileSync(enFile, "utf8"));
const mr = JSON.parse(fs.readFileSync(mrFile, "utf8"));
const hi = JSON.parse(fs.readFileSync(hiFile, "utf8"));

const searchEn = {
  searchLabel: "Search portal records",
  clearSearch: "Clear search query",
  minChars: "Please enter at least 2 characters to search",
  searchError: "Failed to search records. Please retry.",
  searching: "Searching portal records...",
  resultsCount: "{count} results found",
  noResultsFound: "No records found matching your search query.",
  searchTypeSector: "Civic Sector",
  searchTypeWork: "Development Work",
  searchTypeNotice: "Tender / Notice",
  searchTypePlace: "Tourist Spot",
  searchTypeHeritage: "Heritage Site",
  searchTypeMuseum: "Museum Exhibit",
  searchTypeHistory: "Historical Timeline",
};

const searchMr = {
  searchLabel: "पोर्टल नोंदी शोधा",
  clearSearch: "शोध मजकूर पुसा",
  minChars: "शोधण्यासाठी किमान २ अक्षरे प्रविष्ट करा",
  searchError: "नोंदी शोधण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.",
  searching: "पोर्टल नोंदी शोधत आहे...",
  resultsCount: "{count} परिणाम आढळले",
  noResultsFound: "आपल्या शोध शब्दांशी जुळणाऱ्या नोंदी आढळल्या नाहीत.",
  searchTypeSector: "नागरी विभाग",
  searchTypeWork: "विकास काम",
  searchTypeNotice: "निविदा / सूचना",
  searchTypePlace: "पर्यटन स्थळ",
  searchTypeHeritage: "वारसा स्थळ",
  searchTypeMuseum: "वस्तुसंग्रहालय अवशेष",
  searchTypeHistory: "ऐतिहासिक काळ",
};

const searchHi = {
  searchLabel: "पोर्टल रिकॉर्ड खोजें",
  clearSearch: "खोज टेक्स्ट हटाएं",
  minChars: "खोजने हेतु कम से कम २ अक्षर दर्ज करें",
  searchError: "रिकॉर्ड खोजने में त्रुटि। कृपया पुनः प्रयास करें।",
  searching: "पोर्टल रिकॉर्ड खोज रहे हैं...",
  resultsCount: "{count} परिणाम मिले",
  noResultsFound: "आपके खोज शब्द से मेल खाते रिकॉर्ड नहीं मिले।",
  searchTypeSector: "नागरिक विभाग",
  searchTypeWork: "विकास कार्य",
  searchTypeNotice: "निविदा / सूचना",
  searchTypePlace: "पर्यटन स्थल",
  searchTypeHeritage: "विरासत स्थल",
  searchTypeMuseum: "संग्रहालय अवशेष",
  searchTypeHistory: "ऐतिहासिक काल",
};

Object.assign(en.search, searchEn);
Object.assign(mr.search, searchMr);
Object.assign(hi.search, searchHi);

fs.writeFileSync(enFile, JSON.stringify(en, null, 2), "utf8");
fs.writeFileSync(mrFile, JSON.stringify(mr, null, 2), "utf8");
fs.writeFileSync(hiFile, JSON.stringify(hi, null, 2), "utf8");

console.log("Added search keys successfully!");
