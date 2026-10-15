"use client";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Landmark, MapPin, ShieldCheck, MessageSquare, Compass, FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { developmentWorks, wards } from "@/lib/mock-data";
import { getWardProfile } from "@/lib/ward-profiles";
import styles from "./ward.module.css";

const copy = {
  en: { directory: "Paithan locality directory", about: "Life in this locality", help: "Your civic service desk", report: "Report a civic concern", reportDetail: "Water, drainage, roads or streetlights — describe the issue and include a nearby landmark.", explore: "Explore the heritage", exploreDetail: "Find visitor information and discover Paithan's cultural places.", services: "Municipal services", servicesDetail: "Find service information and the right department for your enquiry.", records: "Local records", pending: "Ward boundaries and representative details await council confirmation.", updates: "Works & local updates", empty: "No confirmed project updates are published for this locality yet.", contact: "Contact the council", guidance: "When requesting assistance", steps: ["Mention this locality and the nearest street or landmark.", "Describe the issue clearly and attach a relevant photograph where requested.", "Keep your reference number to follow up on the request."], previous: "Previous ward", next: "Next ward", photo: "Photograph supplied for the directory; some images are illustrative.", area: "Locality", note: "Directory information is not a certified ward-boundary record." },
  mr: { directory: "पैठण परिसर निर्देशिका", about: "या परिसराची ओळख", help: "नागरी सेवा मदत कक्ष", report: "नागरी समस्या नोंदवा", reportDetail: "पाणी, गटार, रस्ते किंवा पथदिवे — समस्या आणि जवळची खूण नमूद करा.", explore: "वारसा जाणून घ्या", exploreDetail: "पैठणमधील सांस्कृतिक स्थळे आणि पर्यटक माहिती पहा.", services: "नगरपालिका सेवा", servicesDetail: "सेवांची माहिती आणि संबंधित विभाग जाणून घ्या.", records: "स्थानिक नोंदी", pending: "प्रभाग सीमा आणि प्रतिनिधींच्या तपशिलांना नगर परिषदेची पुष्टी आवश्यक आहे.", updates: "कामे आणि स्थानिक सूचना", empty: "या परिसरासाठी पुष्टी केलेल्या प्रकल्प सूचना अद्याप प्रसिद्ध नाहीत.", contact: "नगर परिषद संपर्क", guidance: "मदत मागताना", steps: ["परिसर, रस्ता किंवा जवळची खूण नमूद करा.", "समस्या स्पष्ट लिहा आणि आवश्यक असल्यास संबंधित छायाचित्र जोडा.", "पाठपुराव्यासाठी संदर्भ क्रमांक जतन करा."], previous: "मागील प्रभाग", next: "पुढील प्रभाग", photo: "निर्देशिकेसाठी दिलेले छायाचित्र; काही चित्रे प्रातिनिधिक आहेत.", area: "परिसर", note: "ही निर्देशिका प्रमाणित प्रभाग सीमा नोंद नाही." },
  hi: { directory: "पैठण क्षेत्र निर्देशिका", about: "इस क्षेत्र का परिचय", help: "नागरिक सेवा सहायता", report: "नागरिक समस्या दर्ज करें", reportDetail: "पानी, नाली, सड़क या स्ट्रीट लाइट — समस्या और पास का स्थान बताएं।", explore: "विरासत जानें", exploreDetail: "पैठण के सांस्कृतिक स्थलों और यात्रा की जानकारी देखें।", services: "नगरपालिका सेवाएं", servicesDetail: "सेवाओं और संबंधित विभाग की जानकारी पाएं।", records: "स्थानीय अभिलेख", pending: "वार्ड सीमाओं और प्रतिनिधियों के विवरण के लिए परिषद की पुष्टि आवश्यक है।", updates: "कार्य और स्थानीय सूचनाएं", empty: "इस क्षेत्र के लिए पुष्टि की गई परियोजना सूचनाएं अभी प्रकाशित नहीं हैं।", contact: "परिषद से संपर्क", guidance: "सहायता मांगते समय", steps: ["क्षेत्र और निकट की सड़क या पहचान बताएं।", "समस्या स्पष्ट लिखें और मांगे जाने पर संबंधित तस्वीर जोड़ें।", "अनुवर्ती कार्रवाई के लिए संदर्भ संख्या सुरक्षित रखें।"], previous: "पिछला वार्ड", next: "अगला वार्ड", photo: "निर्देशिका के लिए दी गई तस्वीर; कुछ चित्र प्रतिनिधिक हैं।", area: "क्षेत्र", note: "यह निर्देशिका प्रमाणित वार्ड सीमा अभिलेख नहीं है।" }
};

export default function WardDetailPage() {
  const params = useParams<{ ward: string }>();
  const ward = wards.find(item => item.number === Number(params.ward));
  const locale = useLocale();
  const t = useTranslations("nagarParishad");
  const nav = useTranslations("nav");
  const common = useTranslations("common");
  if (!ward) notFound();
  const c = copy[locale as keyof typeof copy] || copy.en;
  const profile = getWardProfile(ward.number);
  const works = developmentWorks.filter(w => w.wardNumber === ward.number && w.dataStatus === "VERIFIED");
  const base = `/${locale}/nagar-parishad/ward-map`;
  const links = [
    { href: "/grievances/new", title: c.report, detail: c.reportDetail, Icon: MessageSquare },
    { href: "/services", title: c.services, detail: c.servicesDetail, Icon: Landmark },
    { href: "/tourism", title: c.explore, detail: c.exploreDetail, Icon: Compass },
  ];
  return <>
    <Breadcrumb items={[{label:nav("home"),href:`/${locale}`},{label:nav("nagarParishad"),href:`/${locale}/nagar-parishad`},{label:t("wardMapTitle"),href:base},{label:`${common("ward")} ${ward.number}`}]}/>
    <div className={styles.page} data-theme={profile.identity.theme}>
      <div className={styles.topline}><Link href={base}><ArrowLeft size={16}/>{t("wardMapTitle")}</Link><span>{c.directory}</span></div>
      <section className={styles.hero}>
        <img src={profile.image} alt={profile.imageNote} className={styles.photo}/>
        <div className={styles.shade}/>
        <div className={styles.heroInner}>
          <div className={styles.identity}><Landmark size={20}/><span>{nav("nagarParishad")}</span><span className={styles.wardTag}>{common("ward")} {ward.number}</span></div>
          <h1>{locale === "mr" ? ward.nameMr : ward.name}</h1>
          {locale !== "mr" && <p className={styles.marathi} lang="mr">{ward.nameMr}</p>}
          <p className={styles.location}><MapPin size={18}/>{ward.locality}</p>
          <Link href={`/${locale}/grievances/new`} className={styles.heroAction}>{c.report}<ArrowRight size={17}/></Link>
        </div>
      </section>
      <div className={styles.content}>
        <p className={styles.caption}>{c.photo}</p>
        <div className={styles.layout}>
          <div>
            <section className={styles.profile}>
              <div className={styles.sectionTitle}><span className={styles.smallSeal}><MapPin size={22}/></span><h2>{c.about}</h2></div>
              <p className={styles.speciality}>{profile.identity[locale === 'mr' ? 'mr' : locale === 'hi' ? 'hi' : 'en']}</p>
              <p lang="en" className={styles.description}>{profile.description}</p>
              <dl className={styles.details}><div><dt>{common("ward")}</dt><dd>{ward.number.toString().padStart(2,"0")}</dd></div><div><dt>{c.area}</dt><dd>{ward.locality}</dd></div></dl>
              <div className={styles.recordNote}><ShieldCheck size={18}/><p>{c.pending}</p></div>
            </section>
            <section className={styles.serviceSection}>
              <h2>{c.help}</h2>
              <nav aria-label={c.help} className={styles.serviceList}>{links.map(({href,title,detail,Icon})=><Link key={href} href={`/${locale}${href}`} className={styles.service}><Icon size={24}/><div><h3>{title}</h3><p>{detail}</p></div><ArrowRight size={19}/></Link>)}</nav>
            </section>
          </div>
          <aside className={styles.aside}>
            <div className={styles.guide}><FileText size={25}/><h2>{c.guidance}</h2><ol>{c.steps.map(step=><li key={step}>{step}</li>)}</ol><Link href={`/${locale}/contact`}>{c.contact}<ArrowRight size={17}/></Link></div>
            <div className={styles.updates}><h2>{c.updates}</h2>{works.length ? works.map(work=><article key={work.id}><span>{work.status.replaceAll("_"," ")}</span><h3>{locale==="mr"?work.titleMr:work.title}</h3><p>{work.description}</p></article>):<><p>{c.empty}</p><Link href={`/${locale}/contact`}>{c.contact}<ArrowRight size={16}/></Link></>}</div>
          </aside>
        </div>
        <nav className={styles.neighbours} aria-label={c.directory}>
          {ward.number>1 ? <Link href={`${base}/${ward.number-1}`}><ArrowLeft size={18}/><div><small>{c.previous}</small><strong>{wards[ward.number-2].name}</strong></div></Link>:<span/>}
          <Link className={styles.directoryLink} href={base}><MapPin size={19}/>{t("wardMapTitle")}</Link>
          {ward.number<17 ? <Link href={`${base}/${ward.number+1}`}><div><small>{c.next}</small><strong>{wards[ward.number].name}</strong></div><ArrowRight size={18}/></Link>:<span/>}
        </nav>
        <p className={styles.boundaryNote}>{c.note}</p>
      </div>
    </div>
  </>;
}
