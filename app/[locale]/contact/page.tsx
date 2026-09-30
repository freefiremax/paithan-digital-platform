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
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <ContactForm locale={locale as "en" | "mr" | "hi"} />
      <Helplines locale={locale as "en" | "mr" | "hi"} messages={messages.contact} />
      <WebInfoManager locale={locale as "en" | "mr" | "hi"} messages={messages.contact} />
    </div>
  );
}