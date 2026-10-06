const fs = require('fs');

const en = JSON.parse(fs.readFileSync('./messages/en.json', 'utf8'));
const mr = JSON.parse(fs.readFileSync('./messages/mr.json', 'utf8'));
const hi = JSON.parse(fs.readFileSync('./messages/hi.json', 'utf8'));

// Header keys
en.header.searchPlaceholder = 'Search services, notices, taxes & more…';
mr.header.searchPlaceholder = 'सेवा, सूचना, कर आणि अधिक शोधा…';
hi.header.searchPlaceholder = 'सेवाएं, सूचनाएं, कर और अधिक खोजें…';

en.header.satyamevaJayate = 'सत्यमेव जयते';
mr.header.satyamevaJayate = 'सत्यमेव जयते';
hi.header.satyamevaJayate = 'सत्यमेव जयते';

en.header.searchShortcut = 'Ctrl+K';
mr.header.searchShortcut = 'Ctrl+K';
hi.header.searchShortcut = 'Ctrl+K';

en.header.searchOpen = 'Search portal';
mr.header.searchOpen = 'पोर्टल शोधा';
hi.header.searchOpen = 'पोर्टल खोजें';

// Search namespace keys
en.search.quickSearches = 'Popular Civic Searches';
mr.search.quickSearches = 'लोकप्रिय नागरी शोध';
hi.search.quickSearches = 'लोकप्रिय नागरिक खोज';

en.search.allResultsFor = 'View all results for "{query}"';
mr.search.allResultsFor = '"{query}" चे सर्व निकाल पहा';
hi.search.allResultsFor = '"{query}" के सभी परिणाम देखें';

en.search.pressEscToClose = 'Press ESC to close';
mr.search.pressEscToClose = 'बंद करण्यासाठी ESC दाबा';
hi.search.pressEscToClose = 'बंद करने के लिए ESC दबाएं';

en.search.noResultsPrompt = 'Try searching for taxes, certificates, ward map, or notices';
mr.search.noResultsPrompt = 'कर, दाखले, प्रभाग नकाशा किंवा सूचना शोधून पहा';
hi.search.noResultsPrompt = 'कर, प्रमाणपत्र, वार्ड नक्शा या सूचनाएं खोजकर देखें';

en.search.categoryServices = 'Civic Services & Taxes';
mr.search.categoryServices = 'नागरी सेवा व कर';
hi.search.categoryServices = 'नागरिक सेवाएं व कर';

en.search.categoryCouncil = 'Council & Administration';
mr.search.categoryCouncil = 'नगर परिषद व प्रशासन';
hi.search.categoryCouncil = 'नगर परिषद व प्रशासन';

en.search.categoryGrievance = 'Grievances & Redressal';
mr.search.categoryGrievance = 'नागरिक तक्रारी व निवारण';
hi.search.categoryGrievance = 'नागरिक शिकायतें व निवारण';

en.search.categoryTourism = 'Tourism & Heritage';
mr.search.categoryTourism = 'पर्यटन, संस्कृती व वारसा';
hi.search.categoryTourism = 'पर्यटन, संस्कृति व विरासत';

en.search.categoryNotices = 'Official Notices & Tenders';
mr.search.categoryNotices = 'अधिकृत सूचना व निविदा';
hi.search.categoryNotices = 'आधिकारिक सूचनाएं व निविदाएं';

fs.writeFileSync('./messages/en.json', JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync('./messages/mr.json', JSON.stringify(mr, null, 2) + '\n');
fs.writeFileSync('./messages/hi.json', JSON.stringify(hi, null, 2) + '\n');

console.log('Successfully updated messages for en, mr, hi');
