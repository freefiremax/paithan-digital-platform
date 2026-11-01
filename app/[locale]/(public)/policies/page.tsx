import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n";
import Link from "next/link";
import { PolicyLayout } from "@/components/policies/PolicyLayout";
import styles from "@/components/policies/PolicyLayout.module.css";

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

  return <PolicyLayout titleKey="indexTitle" lastUpdated="2026-10-31">
    <div className={styles.indexGrid}>{policies.map(policy => <Link key={policy.href} href={`/${locale}${policy.href}`} className={styles.indexLink}><h2>{p[policy.titleKey]}</h2><p>{p[policy.descKey]}</p></Link>)}</div>
  </PolicyLayout>;
}
