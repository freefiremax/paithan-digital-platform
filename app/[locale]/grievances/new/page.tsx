import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n";
import { GrievanceForm } from "./GrievanceForm";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  return { title: messages.grievance?.submitTitle || "Submit Grievance" };
}

export default async function GrievanceNewPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  if (!messages.grievance) notFound();

  return <GrievanceForm locale={locale as "en" | "mr" | "hi"} messages={messages.grievance} />;
}