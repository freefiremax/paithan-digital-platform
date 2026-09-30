import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getMessages } from "@/i18n";
import { auth } from "@/lib/auth/auth";
import { Role } from "@prisma/client";
import { AdminGrievancesClient } from "./AdminGrievancesClient";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  return { title: messages.grievance?.adminTitle || "Admin Grievances" };
}

export default async function AdminGrievancesPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user || (session.user as { role: Role }).role !== "ADMIN") {
    redirect("/admin/login");
  }

  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  if (!messages.grievance) notFound();

  return <AdminGrievancesClient locale={locale as "en" | "mr" | "hi"} messages={messages.grievance} />;
}