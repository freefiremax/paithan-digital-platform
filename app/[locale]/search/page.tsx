import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n";
import { SearchClient } from "./SearchClient";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  return { title: messages.search?.title || "Search" };
}

export default async function SearchPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  if (!messages.search) notFound();

  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-slate-400 animate-pulse text-sm">Loading search...</div>
        </div>
      }
    >
      <SearchClient locale={locale as "en" | "mr" | "hi"} />
    </Suspense>
  );
}