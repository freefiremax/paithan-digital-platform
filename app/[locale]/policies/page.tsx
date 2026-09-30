import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n";
import Link from "next/link";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  return { title: messages.policies?.indexTitle || "Policies" };
}

export default async function PoliciesIndexPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  if (!messages.policies) notFound();

  const p = messages.policies;

  const policies = [
    { href: "/policies/privacy", titleKey: "privacyTitle", descKey: "privacyDesc" },
    { href: "/policies/terms", titleKey: "termsTitle", descKey: "termsDesc" },
    { href: "/policies/copyright", titleKey: "copyrightTitle", descKey: "copyrightDesc" },
    { href: "/policies/hyperlinking", titleKey: "hyperlinkingTitle", descKey: "hyperlinkingDesc" },
    { href: "/policies/disclaimer", titleKey: "disclaimerTitle", descKey: "disclaimerDesc" },
    { href: "/policies/accessibility", titleKey: "accessibilityTitle", descKey: "accessibilityDesc" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li>
            <Link href="/" className="hover:text-[var(--saffron-600)]">
              {p.home}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-900 font-medium" aria-current="page">
            {p.indexTitle}
          </li>
        </ol>
      </nav>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{p.indexTitle}</h1>
          <p className="text-slate-600">{p.indexSubtitle}</p>
        </header>

        <div className="space-y-6">
          {policies.map((policy) => (
            <Link
              key={policy.href}
              href={policy.href}
              className="block p-6 border border-slate-200 rounded-xl hover:border-[var(--saffron-300)] hover:bg-[var(--saffron-50)] transition"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{p[policy.titleKey]}</h2>
              <p className="text-slate-600">{p[policy.descKey]}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}