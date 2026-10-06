const fs = require('fs');

const en = JSON.parse(fs.readFileSync('./messages/en.json', 'utf8'));
const mr = JSON.parse(fs.readFileSync('./messages/mr.json', 'utf8'));
const hi = JSON.parse(fs.readFileSync('./messages/hi.json', 'utf8'));

// Common additions
en.common.category = "Category";
mr.common.category = "वर्ग / प्रकार";
hi.common.category = "श्रेणी";

en.common.subject = "Subject";
mr.common.subject = "विषय";
hi.common.subject = "विषय";

// Heritage museum additions
en.heritage.closedMondays = "Closed Mondays";
mr.heritage.closedMondays = "सोमवारी बंद";
hi.heritage.closedMondays = "सोमवार को बंद";

en.heritage.locationAddress = "Sant Dnyaneshwar Udyan Campus";
mr.heritage.locationAddress = "संत ज्ञानेश्वर उद्यान परिसर";
hi.heritage.locationAddress = "संत ज्ञानेश्वर उद्यान परिसर";

en.heritage.archaeologyDept = "Directorate of Archaeology";
mr.heritage.archaeologyDept = "पुरातत्व संचालनालय";
hi.heritage.archaeologyDept = "पुरातत्व निदेशालय";

// Nagar Parishad works hint
en.nagarParishad.noWorksHint = "Try clearing your search query or selecting all wards.";
mr.nagarParishad.noWorksHint = "शोध क्वेरी साफ करण्याचा किंवा सर्व प्रभाग निवडण्याचा प्रयत्न करा.";
hi.nagarParishad.noWorksHint = "खोज क्वेरी साफ़ करने या सभी वार्ड चुनने का प्रयास करें।";

// Services sector page progress
en.services.progress = "Progress";
mr.services.progress = "प्रगती";
hi.services.progress = "प्रगति";

// Tourism additions
en.tourism.augustToFeb = "August to February";
mr.tourism.augustToFeb = "ऑगस्ट ते फेब्रुवारी";
hi.tourism.augustToFeb = "अगस्त से फरवरी";

en.tourism.googleMapsNavigation = "Google Maps Navigation";
mr.tourism.googleMapsNavigation = "गुगल मॅप्स नेव्हिगेशन";
hi.tourism.googleMapsNavigation = "गूगल मैप्स नेविगेशन";

en.tourism.novToMarch = "November to March";
mr.tourism.novToMarch = "नोव्हेंबर ते मार्च";
hi.tourism.novToMarch = "नवंबर से मार्च";

en.tourism.forestDeptPass = "Forest Dept Pass";
mr.tourism.forestDeptPass = "वन विभाग परवाना";
hi.tourism.forestDeptPass = "वन विभाग पास";

en.tourism.guidelineSpillway = "Dam Spillway Canal Perimeter - Raptors and waders.";
mr.tourism.guidelineSpillway = "धरण सांडवा कालवा परिसर - शिकारी व दलदलीचे पक्षी.";
hi.tourism.guidelineSpillway = "बांध स्पिलवे नहर परिधि - शिकारी और जलीय पक्षी।";

en.tourism.guidelineZeroPlastic = "Strictly Zero Plastic Zone.";
mr.tourism.guidelineZeroPlastic = "कडक प्लास्टिक-मुक्त क्षेत्र.";
hi.tourism.guidelineZeroPlastic = "सख्ती से शून्य प्लास्टिक क्षेत्र।";

en.tourism.guidelineQuiet = "Maintain quiet and avoid disturbance to wildlife.";
mr.tourism.guidelineQuiet = "शांतता राखा व वन्यजीवांना त्रास देणे टाळा.";
hi.tourism.guidelineQuiet = "शांति बनाए रखें और वन्यजीवों को परेशानी न पहुंचाएं।";

// Admin additions
en.admin.refNo = "Ref No.";
mr.admin.refNo = "संदर्भ क्र.";
hi.admin.refNo = "संदर्भ सं.";

// Grievances form additions
en.grievance.optimizingPhoto = "Optimizing and saving photo...";
mr.grievance.optimizingPhoto = "फोटो अनुकूलित करून जतन करत आहे...";
hi.grievance.optimizingPhoto = "फ़ोटो अनुकूलित और सहेजा जा रहा है...";

// Sitemap additions
en.sitemap.xmlSitemap = "XML Sitemap";
mr.sitemap.xmlSitemap = "XML साइटमॅप";
hi.sitemap.xmlSitemap = "XML साइटमैप";

// Chatbot additions
en.chatbot.aiEngine = "Paithan AI Knowledge Engine";
mr.chatbot.aiEngine = "पैठण एआय ज्ञान प्रणाली";
hi.chatbot.aiEngine = "पैठन एआई ज्ञान प्रणाली";

fs.writeFileSync('./messages/en.json', JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync('./messages/mr.json', JSON.stringify(mr, null, 2), 'utf8');
fs.writeFileSync('./messages/hi.json', JSON.stringify(hi, null, 2), 'utf8');

console.log('Successfully added detailed polish translation keys.');
