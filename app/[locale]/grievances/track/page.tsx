import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n";
import { GrievanceTrack } from "./GrievanceTrack";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  return { title: messages.grievance?.trackTitle || "Track Grievance" };
}

export default async function GrievanceTrackPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  if (!messages.grievance) notFound();

  return <GrievanceTrack locale={locale as "en" | "mr" | "hi"} messages={messages.grievance} />;
}