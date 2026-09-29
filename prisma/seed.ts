import { PrismaClient, Role, DataStatus, CivicSector } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create 17 wards
  console.log("📍 Creating wards...");
  const wards = await Promise.all(
    [
      { number: 1, name: "Brahmapuri Archaeological Ward", description: "Brahmapuri Mound & Old Fort Area" },
      { number: 2, name: "Sant Eknath Mandir Ward", description: "Samadhi Mandir Complex & Temple Road" },
      { number: 3, name: "Godavari Nagghat Ward", description: "Historic Riverfront Ghats & Panchavad" },
      { number: 4, name: "Sant Eknath Wada Ward", description: "Eknath Wada & Brahmin Galli" },
      { number: 5, name: "Paithani Weavers Colony Ward", description: "Vinkar Colony & Handloom Clusters" },
      { number: 6, name: "Mahavir Chowk Central Ward", description: "Mahavir Chowk & Main Market" },
      { number: 7, name: "Chhatrapati Shivaji Chowk Ward", description: "Shivaji Maharaj Chowk & Court Road" },
      { number: 8, name: "Old Bazar Ward", description: "Juna Bazar & Gandhi Chowk" },
      { number: 9, name: "Dr. Ambedkar Nagar Ward", description: "Ambedkar Nagar & Primary School" },
      { number: 10, name: "Subhash Nagar Ward", description: "Subhash Nagar Residential Sector" },
      { number: 11, name: "Bus Stand Complex Ward", description: "MSRTC Bus Station & Naka Road" },
      { number: 12, name: "Sant Dnyaneshwar Udyan Ward", description: "Botanical Garden & Museum Campus" },
      { number: 13, name: "Balasaheb Patil Museum Ward", description: "Museum Complex & Irrigation Quarters" },
      { number: 14, name: "Jayakwadi Colony Ward", description: "Dam Staff Colony & Reservoir Overlook" },
      { number: 15, name: "Nath Sagar Gate Ward", description: "Dam Spillway Gate & Right Canal" },
      { number: 16, name: "Industrial & Handloom Ward", description: "Paithan Industrial Estate & Weaving Center" },
      { number: 17, name: "Kavi Kulguru Kalidas Ward", description: "Kalidas Nagar & Bypass Link" },
    ].map((w) =>
      prisma.ward.upsert({
        where: { number: w.number },
        update: { name: w.name, description: w.description },
        create: w,
      })
    )
  );
  console.log(`✅ Created ${wards.length} wards`);

  // Create CivicSectorInfo for all 5 sectors
  console.log("🏛️ Creating civic sector info...");
  const sectorsData = [
    {
      sector: CivicSector.ROADS_TRANSPORT,
      titleEn: "Roads & Transport",
      titleMr: "रस्ते व वाहतूक",
      taglineEn: "Connecting Paithan's 17 wards through durable, well-planned road infrastructure.",
      taglineMr: "पैठणचे १७ प्रभाग टिकाऊ, सुयोजित रस्ता बुनियादी सुविधेने जोडणे.",
      overviewEn: "The Roads & Transport sector manages the construction, maintenance, and upgrading of municipal roads, storm water drains, footpaths, and street lighting across all wards. Works include cement concrete roads, asphalt resurfacing, underground drainage integration, and pedestrian safety improvements. Funding sources include AMRUT 2.0, 15th Finance Commission, DPDC, and Municipal Fund allocations.",
      overviewMr: "रस्ते व वाहतूक क्षेत्र सर्व प्रभागांमध्ये नगरपालिका रस्तांचे बांधकाम, देखभाल व उन्नती, पावसाळी गटार, पायदाने व खांब दिवे व्यवस्थापते. यथार्थ कामात सिमेंट कॉन्क्रीट रस्ते, अस्फाल्ट रिसर्फेसिंग, भूमिगत गटार एकीकरण व पैदल चालक सुरक्षा सुधारणा समाविष्ट आहे. निधी स्रोत: AMRUT 2.0, १५व्या वित्त आयोग, DPDC व नगर परिषद निधी.",
      department: "Road Engineering Department / सार्वजनिक बांधकाम विभाग",
      contactJson: { phone: "02431-223010", email: "pwd@paithan.gov.in", office: "Municipal Engineering Section, Administrative Building" },
      dataStatus: DataStatus.SAMPLE_TBD,
    },
    {
      sector: CivicSector.WATER_SANITATION,
      titleEn: "Water & Sanitation",
      titleMr: "पाणी व स्वच्छता",
      taglineEn: "Safe drinking water and scientific sanitation for every household in Paithan.",
      taglineMr: "पैठणातील प्रत्येक कुटूंबासाठी सुरक्षित पिण्याचे पाणी व वैज्ञानिक स्वच्छता.",
      overviewEn: "The Water & Sanitation sector operates the municipal water supply network, sewage treatment, solid waste management, and public sanitation facilities. Key infrastructure includes the Old Godavari Pumping Station, water treatment plants, underground sewerage network, and door-to-door waste collection across 17 wards. The sector also manages digital water ATMs at pilgrim sites and the annual Nath Shashti water supply preparedness.",
      overviewMr: "पाणी व स्वच्छता क्षेत्र नगरपालिका पाणीपुरवठा नेटवर्क, मलनिर्मालन, ठोस कचरा व्यवस्थापन व सार्वजनिक स्वच्छता सुविधांचे संचालन करते. मुख्य बुनियादी सुविधा: जुना गोदावरी पंपिंग स्टेशन, पाणी शुद्धीकरण केंद्र, भूमिगत मलनिर्मालन नेटवर्क व १७ प्रभागांमध्ये घरोघरी कचरा संकलन. यथार्थ क्षेत्र डिजिटल पाणी एटीएम (तीर्थक्षेत्रे) व वार्षिक नाथषष्ठी पाणीपुरवठा तयारीही व्यवस्थापते.",
      department: "Water Supply & Sewerage Department / पाणीपुरवठा व गटार विभाग",
      contactJson: { phone: "02431-223015", email: "water@paithan.gov.in", emergency: "02431-223015 (24x7)", office: "Water Works Head, Old Godavari Pumping Station" },
      dataStatus: DataStatus.SAMPLE_TBD,
    },
    {
      sector: CivicSector.EDUCATION,
      titleEn: "Education",
      titleMr: "शिक्षण",
      taglineEn: "Modernizing municipal schools with digital classrooms and quality Marathi-medium education.",
      taglineMr: "डिजिटल वर्गखोल्या आणि गुणवत्तापूर्ण मराठी-माध्यम शिक्षणाबरोबरच नगरपालिका शाळांचे आधुनिकीकरण.",
      overviewEn: "The Education sector oversees municipal primary schools, smart classroom digital upgrades, teacher training, mid-day meal scheme implementation, and school infrastructure maintenance. Current focus includes interactive smart boards, high-speed Wi-Fi connectivity, and e-learning curriculum in Marathi & English for civic school students across wards. The sector coordinates with the Municipal Education Board and state education department.",
      overviewMr: "शिक्षण क्षेत्र नगरपालिका प्राथमिक शाळा, स्मार्ट वर्गखोली डिजिटल उन्नती, शिक्षक प्रशिक्षण, मध्याह्न भोजन योजना कार्यान्वयन व शाळा बुनियादी सुविधा देखभालाचे निरीक्षण करते. सध्याचे फोकस: इंटरैक्टिव स्मार्ट बोर्ड, उच्च गतीचे वाय-फाय, मराठी व इंग्रजीमध्ये ई-लर्निंग अभ्यासक्रम सर्व प्रभागातील नगरपालिका शाळेतील विद्यार्थ्यांसाठी. क्षेत्र नगरपालिका शिक्षण मंडळ व राज्य शिक्षण विभागाबरोबर समन्वय करते.",
      department: "Municipal Education Board / नगरपालिका शिक्षण मंडळ",
      contactJson: { phone: "02431-223010", email: "education@paithan.gov.in", office: "Education Section, Municipal Council Building" },
      dataStatus: DataStatus.SAMPLE_TBD,
    },
    {
      sector: CivicSector.HEALTH,
      titleEn: "Health",
      titleMr: "आरोग्य",
      taglineEn: "Accessible primary healthcare, disease surveillance, and epidemic preparedness for all citizens.",
      taglineMr: "सर्व नागरिकांसाठी सुलभ प्राथमिक आरोग्यसेवा, रोग निरीक्षण व महामारी तयारी.",
      overviewEn: "The Health sector manages Primary Health Centers (PHCs), municipal dispensaries, vaccination drives, vector control, and public health awareness campaigns. It coordinates with the Paithan Sub-District Civil Hospital (100-bed) for referral services. The sector also handles birth/death registration support, food safety inspections, and epidemic preparedness (especially during Nath Shashti Mahotsav and monsoon seasons).",
      overviewMr: "आरोग्य क्षेत्र प्राथमिक आरोग्य केंद्र (PHC), नगरपालिका औषधालय, लसीकरण मुहिम, वेक्टर नियंत्रण व जनआरोग्य जागरूकता मुहिमचे व्यवस्थापन करते. हे क्षेत्र पैठण उपजिल्हा रुग्णालय (१०० खाटा) बरोबर रेफरल सेवेसाठी समन्वय करते. यथार्थ क्षेत्र जन्म/मृत्यु नोंदणी सहाय्य, अन्न सुरक्षा तपासणी व महामारी तयारी (विशेषत: नाथषष्ठी महोत्सव व पावसाळा मौसमात)ही हाताळते.",
      department: "Public Health & Sanitation Department / सार्वजनिक आरोग्य व स्वच्छता विभाग",
      contactJson: { phone: "02431-223040", email: "health@paithan.gov.in", emergency: "02431-223040 (Hospital)", office: "Health Section, Municipal Council Building" },
      dataStatus: DataStatus.SAMPLE_TBD,
    },
    {
      sector: CivicSector.OTHER_CIVIC_WORKS,
      titleEn: "Other Civic Works",
      titleMr: "इतर नागरी कामे",
      taglineEn: "Community centers, markets, parks, and miscellaneous municipal infrastructure enhancing quality of life.",
      taglineMr: "समुदाय केंद्र, बाजार, उद्यान व विविध नगरपालिका बुनियादी सुविधा जीवनशैली सुधारित करणारे.",
      overviewEn: "This sector covers miscellaneous civic infrastructure not classified under the above sectors: community halls, vegetable markets, crematoriums, public parks & gardens, street furniture, municipal buildings maintenance, and heritage conservation works. It also includes the Paithani Weavers Common Facility Center, digital incubation centers, and tourist infrastructure at Jayakwadi Dam and Godavari ghats.",
      overviewMr: "हे क्षेत्र उपरोक्त क्षेत्रांमध्ये वर्गीकृत न झालेल्या विविध नागरी बुनियादी सुविधांचे समावेश करते: समुदाय सभागृहे, भाजी बाजार, श्मशानभूमी, सार्वजनिक उद्यान, रस्ता फर्निचर, नगरपालिका इमारत देखभाल व वारशाचा संरक्षण कार्य. यथार्थात पैठणी विणकर सामायिक सुविधा केंद्र, डिजिटल इन्क्यूबेशन केंद्र व जायकवाडी धरण व गोदावरी घाट येथील पर्यटन बुनियादी सुविधाही समाविष्ट आहे.",
      department: "General Administration & Town Planning / सामान्य प्रशासन व नगररचना",
      contactJson: { phone: "02431-223010", email: "admin@paithan.gov.in", office: "General Administration, Municipal Council Building" },
      dataStatus: DataStatus.SAMPLE_TBD,
    },
  ];

  for (const sectorData of sectorsData) {
    await prisma.civicSectorInfo.upsert({
      where: { sector: sectorData.sector },
      update: sectorData,
      create: sectorData,
    });
  }
  console.log("✅ Created 5 civic sector info records");

  // Create initial admin user if env vars provided
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;
  const adminName = process.env.INITIAL_ADMIN_NAME || "System Administrator";

  if (adminEmail && adminPassword) {
    console.log("👤 Creating initial admin user...");
    const passwordHash = await hash(adminPassword);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash, role: Role.ADMIN, name: adminName },
      create: { email: adminEmail, passwordHash, name: adminName, role: Role.ADMIN },
    });
    console.log("✅ Created initial admin user");
  } else {
    console.log("⚠️ INITIAL_ADMIN_EMAIL/PASSWORD not set, skipping admin user creation");
  }

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });