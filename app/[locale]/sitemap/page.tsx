import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n";
import Link from "next/link";
import { FileText, Building2, Landmark, Compass, Gavel, Sparkles } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  return { title: messages.sitemap?.title || "Sitemap" };
}

export default async function SitemapPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  if (!messages.sitemap) notFound();

  const sitemapSections = [
    {
      title: messages.sitemap?.sectionMain || "Main Pages",
      icon: Sparkles,
      links: [
        { href: "/", label: messages.sitemap?.home || "Home" },
        { href: "/search", label: messages.sitemap?.search || "Search" },
        { href: "/chatbot", label: messages.sitemap?.chatbot || "AI Citizen Assistant" },
        { href: "/sitemap", label: messages.sitemap?.sitemap || "Sitemap" },
        { href: "/contact", label: messages.sitemap?.contact || "Contact & Feedback" },
      ],
    },
    {
      title: messages.sitemap?.sectionPolicies || "Policies & Legal",
      icon: FileText,
      links: [
        { href: "/policies", label: messages.sitemap?.policiesIndex || "All Policies" },
        { href: "/policies/privacy", label: messages.sitemap?.privacy || "Privacy Policy" },
        { href: "/policies/terms", label: messages.sitemap?.terms || "Terms & Conditions" },
        { href: "/policies/copyright", label: messages.sitemap?.copyright || "Copyright Policy" },
        { href: "/policies/hyperlinking", label: messages.sitemap?.hyperlinking || "Hyperlinking Policy" },
        { href: "/policies/disclaimer", label: messages.sitemap?.disclaimer || "Disclaimer" },
        { href: "/policies/accessibility", label: messages.sitemap?.accessibility || "Accessibility Statement" },
      ],
    },
    {
      title: messages.sitemap?.sectionGrievances || "Grievances & Complaints",
      icon: Gavel,
      links: [
        { href: "/grievances/new", label: messages.sitemap?.submitGrievance || "Submit Grievance" },
        { href: "/grievances/track", label: messages.sitemap?.trackGrievance || "Track Grievance" },
      ],
    },
    {
      title: messages.sitemap?.sectionCivic || "Civic Services (Nagar Parishad)",
      icon: Building2,
      links: [
        { href: "/nagar-parishad", label: messages.sitemap?.aboutCouncil || "About the Council" },
        { href: "/nagar-parishad/representatives", label: messages.sitemap?.representatives || "Public Representatives" },
        { href: "/nagar-parishad/ward-map", label: messages.sitemap?.wards || "17 Wards & Map" },
        { href: "/nagar-parishad/nagar-sevak", label: messages.sitemap?.nagarSevaks || "Ward-wise Nagar Sevaks" },
        { href: "/nagar-parishad/development-works", label: messages.sitemap?.developmentWorks || "Development Works Register" },
        { href: "/nagar-parishad/projects", label: messages.sitemap?.projects || "Major Municipal Projects" },
        { href: "/nagar-parishad/notifications", label: messages.sitemap?.notifications || "Official Notices & Tenders" },
        { href: "/services", label: messages.sitemap?.services || "All Civic Services" },
      ],
    },
    {
      title: messages.sitemap?.sectionHeritage || "Heritage & Culture",
      icon: Landmark,
      links: [
        { href: "/heritage/museum", label: messages.sitemap?.museum || "Dr. Balasaheb Patil Museum" },
        { href: "/heritage/artifacts", label: messages.sitemap?.artifacts || "Satavahana Coins & Artifacts" },
        { href: "/heritage/3d-models", label: messages.sitemap?.models3d || "3D Artifact Models" },
        { href: "/heritage/history", label: messages.sitemap?.history || "Ancient Pratishthana History" },
        { href: "/heritage/cultural-heritage", label: messages.sitemap?.culturalHeritage || "Paithani Sarees & Sant Eknath" },
      ],
    },
    {
      title: messages.sitemap?.sectionTourism || "Tourism & Places",
      icon: Compass,
      links: [
        { href: "/tourism/jayakwadi", label: messages.sitemap?.jayakwadi || "Jayakwadi Dam" },
        { href: "/tourism/nath-sagar", label: messages.sitemap?.nathSagar || "Nath Sagar & Bird Sanctuary" },
        { href: "/tourism/places-to-visit", label: messages.sitemap?.placesToVisit || "Places to Visit in Paithan" },
        { href: "/tourism/heritage-sites", label: messages.sitemap?.heritageSites || "Samadhi Mandir & Temples" },
        { href: "/tourism/routes", label: messages.sitemap?.routes || "1-Day & Pilgrim Routes" },
        { href: "/tourism/map", label: messages.sitemap?.map || "Tourist Map & Directions" },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li>
            <Link href={`/${locale}`} className="hover:text-[var(--saffron-600)]">
              {messages.sitemap?.home || "Home"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-900 font-medium" aria-current="page">
            {messages.sitemap?.title || "Sitemap"}
          </li>
        </ol>
      </nav>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{messages.sitemap?.title || "Sitemap"}</h1>
          <p className="text-slate-600">{messages.sitemap?.subtitle || "Complete list of all pages on this portal."}</p>
        </header>

        <div className="space-y-8">
          {sitemapSections.map((section, sectionIndex) => (
            <section key={sectionIndex} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <section.icon className="w-6 h-6 text-[var(--saffron-600)]" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition"
                    >
                      <span className="w-5 h-5 text-slate-300" aria-hidden="true">→</span>
                      <span className="text-slate-700 hover:text-slate-900 font-medium">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <div className="pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center">
              <a href="/sitemap.xml" className="text-[var(--saffron-600)] hover:underline">
                {messages.sitemap?.xmlSitemap || "XML Sitemap"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}