const fs = require('fs');

const en = JSON.parse(fs.readFileSync('./messages/en.json', 'utf8'));
const mr = JSON.parse(fs.readFileSync('./messages/mr.json', 'utf8'));
const hi = JSON.parse(fs.readFileSync('./messages/hi.json', 'utf8'));

// Admin Facilities keys
const adminFacilitiesEn = {
  title: "Facilities Management",
  description: "Manage public facilities across all civic sectors: schools, health centers, water works, community centers, and more.",
  addFacility: "+ Add Facility",
  searchPlaceholder: "Search facilities by name, address...",
  allSectors: "All Sectors",
  allTypes: "All Types",
  allStatus: "All Status",
  allWards: "All Wards",
  verified: "Verified",
  sampleTbd: "Sample / TBD",
  loading: "Loading facilities...",
  noMatch: "No facilities match your filter criteria.",
  noMatchHint: "Try adjusting your filters or add a new facility.",
  colFacility: "Facility",
  colSector: "Sector",
  colType: "Type",
  colWard: "Ward",
  colStatus: "Status",
  colDataStatus: "Data Status",
  colActions: "Actions",
  operational: "Operational",
  nonOperational: "Non-Operational",
  modalAddTitle: "Add New Facility",
  modalEditTitle: "Edit Facility",
  fieldNameEn: "Facility Name (English) *",
  fieldNameMr: "Facility Name (मराठी)",
  fieldSector: "Sector *",
  fieldType: "Type *",
  fieldAddress: "Address *",
  fieldContact: "Contact Info (JSON)",
  fieldWard: "Ward",
  noWard: "No Ward",
  fieldOperational: "Operational",
  fieldDataStatus: "Data Status",
  cancel: "Cancel",
  save: "Save Facility",
  update: "Update Facility",
  saving: "Saving...",
  deleteConfirm: "Are you sure you want to delete this facility?",
  typeSchool: "School",
  typePhc: "Primary Health Center",
  typeWaterWorks: "Water Works",
  typeCommunityCenter: "Community Center",
  typeAnganwadi: "Anganwadi",
  typeOther: "Other"
};

const adminFacilitiesMr = {
  title: "नागरी सुविधा व्यवस्थापन",
  description: "सर्व नागरी क्षेत्रांतील सार्वजनिक सुविधा व्यवस्थापित करा: शाळा, आरोग्य केंद्र, जलशुद्धीकरण, समाज मंदिर व इतर.",
  addFacility: "+ नवीन सुविधा जोडा",
  searchPlaceholder: "सुविधेचे नाव, पत्ता यानुसार शोधा...",
  allSectors: "सर्व क्षेत्रे",
  allTypes: "सर्व प्रकार",
  allStatus: "सर्व स्थिती",
  allWards: "सर्व प्रभाग",
  verified: "सत्यापित",
  sampleTbd: "नमुना / निश्चित करणे बाकी",
  loading: "सुविधांची माहिती लोड होत आहे...",
  noMatch: "आपल्या निकषांनुसार कोणतीही सुविधा आढळली नाही.",
  noMatchHint: "कृपया फिल्टर तपासा किंवा नवीन सुविधा जोडा.",
  colFacility: "सुविधा",
  colSector: "नागरी क्षेत्र",
  colType: "प्रकार",
  colWard: "प्रभाग",
  colStatus: "सक्रिय स्थिती",
  colDataStatus: "माहिती स्थिती",
  colActions: "क्रिया",
  operational: "सुरू / कार्यरत",
  nonOperational: "बंद / अकार्यरत",
  modalAddTitle: "नवीन सुविधा जोडा",
  modalEditTitle: "सुविधा संपादित करा",
  fieldNameEn: "सुविधेचे नाव (इंग्रजी) *",
  fieldNameMr: "सुविधेचे नाव (मराठी)",
  fieldSector: "नागरी क्षेत्र *",
  fieldType: "सुविधा प्रकार *",
  fieldAddress: "पत्ता *",
  fieldContact: "संपर्क माहिती (JSON)",
  fieldWard: "प्रभाग",
  noWard: "प्रभाग नाही",
  fieldOperational: "कार्यरत आहे",
  fieldDataStatus: "माहिती स्थिती",
  cancel: "रद्द करा",
  save: "सुविधा जतन करा",
  update: "सुविधा अद्यतनित करा",
  saving: "जतन होत आहे...",
  deleteConfirm: "आपण नक्की ही सुविधा हटवू इच्छिता का?",
  typeSchool: "शाळा",
  typePhc: "प्राथमिक आरोग्य केंद्र",
  typeWaterWorks: "जल प्रक्रिया केंद्र",
  typeCommunityCenter: "समाज मंदिर",
  typeAnganwadi: "अंगणवाडी",
  typeOther: "इतर"
};

const adminFacilitiesHi = {
  title: "नागरिक सुविधा प्रबंधन",
  description: "सभी नागरिक क्षेत्रों की सार्वजनिक सुविधाओं का प्रबंधन करें: स्कूल, स्वास्थ्य केंद्र, जल कार्य, सामुदायिक केंद्र आदि।",
  addFacility: "+ नई सुविधा जोड़ें",
  searchPlaceholder: "सुविधा का नाम, पता खोजें...",
  allSectors: "सभी क्षेत्र",
  allTypes: "सभी प्रकार",
  allStatus: "सभी स्थितियां",
  allWards: "सभी वार्ड",
  verified: "सत्यापित",
  sampleTbd: "नमूना / तय होना बाकी",
  loading: "सुविधाएं लोड हो रही हैं...",
  noMatch: "आपके फ़िल्टर से कोई सुविधा मेल नहीं खाती।",
  noMatchHint: "फ़िल्टर बदलें या नई सुविधा जोड़ें।",
  colFacility: "सुविधा",
  colSector: "क्षेत्र",
  colType: "प्रकार",
  colWard: "वार्ड",
  colStatus: "स्थिति",
  colDataStatus: "डेटा स्थिति",
  colActions: "कार्रवाई",
  operational: "सक्रिय / चालू",
  nonOperational: "निष्क्रिय / बंद",
  modalAddTitle: "नई सुविधा जोड़ें",
  modalEditTitle: "सुविधा संपादित करें",
  fieldNameEn: "सुविधा का नाम (अंग्रेजी) *",
  fieldNameMr: "सुविधा का नाम (मराठी)",
  fieldSector: "क्षेत्र *",
  fieldType: "प्रकार *",
  fieldAddress: "पता *",
  fieldContact: "संपर्क जानकारी (JSON)",
  fieldWard: "वार्ड",
  noWard: "कोई वार्ड नहीं",
  fieldOperational: "सक्रिय है",
  fieldDataStatus: "डेटा स्थिति",
  cancel: "रद्द करें",
  save: "सुविधा सहेजें",
  update: "सुविधा अपडेट करें",
  saving: "सहेजा जा रहा है...",
  deleteConfirm: "क्या आप वाकई इस सुविधा को हटाना चाहते हैं?",
  typeSchool: "स्कूल",
  typePhc: "प्राथमिक स्वास्थ्य केंद्र",
  typeWaterWorks: "जल उपचार केंद्र",
  typeCommunityCenter: "सामुदायिक केंद्र",
  typeAnganwadi: "आंगनवाड़ी",
  typeOther: "अन्य"
};

// Admin Sectors keys
const adminSectorsEn = {
  title: "Civic Sector Management",
  description: "Edit sector titles, taglines, overviews, and department information. Only Admins can verify sectors as official records.",
  loading: "Loading sectors...",
  verifyRecord: "Verify Record",
  editDetails: "Edit Details",
  fieldTitleEn: "Title (English)",
  fieldTitleMr: "Title (मराठी)",
  fieldTaglineEn: "Tagline (English)",
  fieldTaglineMr: "Tagline (मराठी)",
  fieldOverviewEn: "Overview (English)",
  fieldOverviewMr: "Overview (मराठी)",
  fieldDepartment: "Department",
  fieldContact: "Contact Info (JSON)",
  fieldDataStatus: "Data Status",
  cancel: "Cancel",
  save: "Save Changes",
  saving: "Saving...",
  labelDepartment: "Department:",
  labelContact: "Contact:"
};

const adminSectorsMr = {
  title: "नागरी क्षेत्र व्यवस्थापन",
  description: "नागरी विभागांचे शीर्षक, माहिती, विहंगावलोकन आणि संपर्क व्यवस्थापित करा. केवळ प्रशासक अधिकृत अभिलेख सत्यापित करू शकतात.",
  loading: "क्षेत्रांची माहिती लोड होत आहे...",
  verifyRecord: "अभिलेख सत्यापित करा",
  editDetails: "तपशील संपादित करा",
  fieldTitleEn: "शीर्षक (इंग्रजी)",
  fieldTitleMr: "शीर्षक (मराठी)",
  fieldTaglineEn: "घोषवाक्य (इंग्रजी)",
  fieldTaglineMr: "घोषवाक्य (मराठी)",
  fieldOverviewEn: "विहंगावलोकन (इंग्रजी)",
  fieldOverviewMr: "विहंगावलोकन (मराठी)",
  fieldDepartment: "विभाग",
  fieldContact: "संपर्क माहिती (JSON)",
  fieldDataStatus: "माहिती स्थिती",
  cancel: "रद्द करा",
  save: "बदल जतन करा",
  saving: "जतन होत आहे...",
  labelDepartment: "विभाग:",
  labelContact: "संपर्क:"
};

const adminSectorsHi = {
  title: "नागरिक क्षेत्र प्रबंधन",
  description: "क्षेत्र शीर्षक, टैगलाइन, विवरण और विभाग की जानकारी संपादित करें। केवल व्यवस्थापक ही रिकॉर्ड सत्यापित कर सकते हैं।",
  loading: "क्षेत्र लोड हो रहे हैं...",
  verifyRecord: "रिकॉर्ड सत्यापित करें",
  editDetails: "विवरण संपादित करें",
  fieldTitleEn: "शीर्षक (अंग्रेजी)",
  fieldTitleMr: "शीर्षक (मराठी)",
  fieldTaglineEn: "टैगलाइन (अंग्रेजी)",
  fieldTaglineMr: "टैगलाइन (मराठी)",
  fieldOverviewEn: "अवलोकन (अंग्रेजी)",
  fieldOverviewMr: "अवलोकन (मराठी)",
  fieldDepartment: "विभाग",
  fieldContact: "संपर्क विवरण (JSON)",
  fieldDataStatus: "डेटा स्थिति",
  cancel: "रद्द करें",
  save: "परिवर्तन सहेजें",
  saving: "सहेजा जा रहा है...",
  labelDepartment: "विभाग:",
  labelContact: "संपर्क:"
};

// Admin Users keys
const adminUsersEn = {
  title: "User Management",
  description: "Manage admin users, editors, and ward officers. Only Admins can create, edit, or delete users and change roles.",
  addUser: "Add User",
  searchPlaceholder: "Search users by email, name...",
  allRoles: "All Roles",
  roleAdmin: "Administrator",
  roleEditor: "Editor",
  rolePublic: "Public",
  loading: "Loading users...",
  noMatch: "No users match your filter criteria.",
  noMatchHint: "Try adjusting your filters or add a new user.",
  colUser: "User",
  colRole: "Role",
  colWard: "Ward",
  colCreated: "Created",
  colActions: "Actions",
  modalAddTitle: "Add New User",
  modalEditTitle: "Edit User",
  fieldEmail: "Email *",
  fieldFullName: "Full Name",
  fieldNewPassword: "New Password (leave blank to keep current)",
  fieldPassword: "Password *",
  passwordMinLength: "Minimum 12 characters required",
  fieldRole: "Role *",
  fieldAssignedWard: "Assigned Ward",
  noWardAssignment: "No Ward Assignment",
  rolePublicDesc: "Public (Read Only)",
  roleEditorDesc: "Editor (Create/Update)",
  roleAdminDesc: "Administrator (Full Access)",
  cancel: "Cancel",
  save: "Create User",
  update: "Update User",
  saving: "Saving...",
  deleteConfirm: "Are you sure you want to delete this user?"
};

const adminUsersMr = {
  title: "वापरकर्ता व्यवस्थापन",
  description: "प्रशासकीय वापरकर्ते, संपादक आणि प्रभाग अधिकाऱ्यांचे व्यवस्थापन करा. केवळ प्रशासक वापरकर्ते तयार किंवा संपादित करू शकतात.",
  addUser: "वापरकर्ता जोडा",
  searchPlaceholder: "ईमेल, नाव याद्वारे वापरकर्ता शोधा...",
  allRoles: "सर्व भूमिका",
  roleAdmin: "प्रशासक",
  roleEditor: "संपादक",
  rolePublic: "सार्वजनिक वापरकर्ता",
  loading: "वापरकर्त्यांची माहिती लोड होत आहे...",
  noMatch: "कोणतेही वापरकर्ते आढळले नाहीत.",
  noMatchHint: "कृपया शोध निकष बदला किंवा नवीन वापरकर्ता जोडा.",
  colUser: "वापरकर्ता",
  colRole: "भूमिका",
  colWard: "प्रभाग",
  colCreated: "नोंदणी तारीख",
  colActions: "क्रिया",
  modalAddTitle: "नवीन वापरकर्ता जोडा",
  modalEditTitle: "वापरकर्ता संपादित करा",
  fieldEmail: "ईमेल *",
  fieldFullName: "पूर्ण नाव",
  fieldNewPassword: "नवीन पासवर्ड (बदलायचा नसल्यास रिकामा ठेवा)",
  fieldPassword: "पासवर्ड *",
  passwordMinLength: "किमान १२ वर्ण आवश्यक",
  fieldRole: "भूमिका *",
  fieldAssignedWard: "नेमलेला प्रभाग",
  noWardAssignment: "कोणताही प्रभाग नेमलेला नाही",
  rolePublicDesc: "सार्वजनिक (केवळ वाचन)",
  roleEditorDesc: "संपादक (तयार/अद्यतन)",
  roleAdminDesc: "प्रशासक (पूर्ण प्रवेश)",
  cancel: "रद्द करा",
  save: "वापरकर्ता तयार करा",
  update: "वापरकर्ता अद्यतनित करा",
  saving: "जतन होत आहे...",
  deleteConfirm: "आपण नक्की हा वापरकर्ता हटवू इच्छिता का?"
};

const adminUsersHi = {
  title: "उपयोगकर्ता प्रबंधन",
  description: "व्यवस्थापक, संपादक और वार्ड अधिकारियों का प्रबंधन करें। केवल व्यवस्थापक ही उपयोगकर्ता बना या हटा सकते हैं।",
  addUser: "उपयोगकर्ता जोड़ें",
  searchPlaceholder: "ईमेल या नाम से उपयोगकर्ता खोजें...",
  allRoles: "सभी भूमिकाएं",
  roleAdmin: "प्रशासक",
  roleEditor: "संपादक",
  rolePublic: "सार्वजनिक उपयोगकर्ता",
  loading: "उपयोगकर्ता लोड हो रहे हैं...",
  noMatch: "कोई उपयोगकर्ता नहीं मिला।",
  noMatchHint: "फ़िल्टर बदलें या नया उपयोगकर्ता जोड़ें।",
  colUser: "उपयोगकर्ता",
  colRole: "भूमिका",
  colWard: "वार्ड",
  colCreated: "बनाया गया",
  colActions: "कार्रवाई",
  modalAddTitle: "नया उपयोगकर्ता जोड़ें",
  modalEditTitle: "उपयोगकर्ता संपादित करें",
  fieldEmail: "ईमेल *",
  fieldFullName: "पूरा नाम",
  fieldNewPassword: "नया पासवर्ड (वर्तमान रखने के लिए खाली छोड़ें)",
  fieldPassword: "पासवर्ड *",
  passwordMinLength: "कम से कम 12 अक्षर आवश्यक",
  fieldRole: "भूमिका *",
  fieldAssignedWard: "आवंटित वार्ड",
  noWardAssignment: "कोई वार्ड नहीं",
  rolePublicDesc: "सार्वजनिक (केवल पढ़ने योग्य)",
  roleEditorDesc: "संपादक (बनाएं/संशोधित करें)",
  roleAdminDesc: "प्रशासक (पूर्ण अधिकार)",
  cancel: "रद्द करें",
  save: "उपयोगकर्ता बनाएं",
  update: "उपयोगकर्ता अपडेट करें",
  saving: "सहेजा जा रहा है...",
  deleteConfirm: "क्या आप वाकई इस उपयोगकर्ता को हटाना चाहते हैं?"
};

// Add to namespaces
en.adminFacilities = adminFacilitiesEn;
mr.adminFacilities = adminFacilitiesMr;
hi.adminFacilities = adminFacilitiesHi;

en.adminSectors = adminSectorsEn;
mr.adminSectors = adminSectorsMr;
hi.adminSectors = adminSectorsHi;

en.adminUsers = adminUsersEn;
mr.adminUsers = adminUsersMr;
hi.adminUsers = adminUsersHi;

// Login additions
en.login.accountCreatedSuccess = "Account created successfully! Please enter your password to sign in.";
mr.login.accountCreatedSuccess = "खाते यशस्वीरित्या तयार झाले! साइन इन करण्यासाठी कृपया आपला पासवर्ड टाका.";
hi.login.accountCreatedSuccess = "खाता सफलतापूर्वक बन गया! साइन इन करने के लिए कृपया अपना पासवर्ड दर्ज करें।";

en.login.loading = "Loading...";
mr.login.loading = "लोड होत आहे...";
hi.login.loading = "लोड हो रहा है...";

// Register additions
en.register.signUpWithGoogle = "Sign up with Google";
mr.register.signUpWithGoogle = "गुगलसह नोंदणी करा";
hi.register.signUpWithGoogle = "गूगल से साइन अप करें";

en.register.orRegisterWithEmail = "Or register with email";
mr.register.orRegisterWithEmail = "किंवा ईमेलसह नोंदणी करा";
hi.register.orRegisterWithEmail = "या ईमेल से पंजीकरण करें";

en.register.backToPublic = "Back to Public Portal";
mr.register.backToPublic = "सार्वजनिक पोर्टलवर परत जा";
hi.register.backToPublic = "सार्वजनिक पोर्टल पर वापस जाएं";

en.register.loading = "Loading...";
mr.register.loading = "लोड होत आहे...";
hi.register.loading = "लोड हो रहा है...";

fs.writeFileSync('./messages/en.json', JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync('./messages/mr.json', JSON.stringify(mr, null, 2), 'utf8');
fs.writeFileSync('./messages/hi.json', JSON.stringify(hi, null, 2), 'utf8');

console.log('Successfully updated messages for adminFacilities, adminSectors, adminUsers, login, and register.');
