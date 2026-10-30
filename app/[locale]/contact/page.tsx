import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n";
import { ContactForm } from "./ContactForm";
import { Helplines } from "./Helplines";
import { WebInfoManager } from "./WebInfoManager";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  return { title: messages.contact?.title || "Contact Us" };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  if (!messages.contact) notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <header><h1 className="text-3xl sm:text-4xl text-[var(--portal-blue-900)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>{messages.contact.title}</h1><p className="text-sm leading-7 text-[var(--paper-700)]">{messages.contact.subtitle}</p></header>
      <ContactForm locale={locale as "en" | "mr" | "hi"} />
      <Helplines locale={locale as "en" | "mr" | "hi"} messages={messages.contact} />
      <WebInfoManager locale={locale as "en" | "mr" | "hi"} messages={messages.contact} />
    </main>
  );
}