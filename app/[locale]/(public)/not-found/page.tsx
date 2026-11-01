import { getMessages } from "@/i18n";
import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function NotFoundPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          {messages.common?.pageNotFound || "Page Not Found"}
        </h2>
        <p className="text-slate-600 mb-6">
          {messages.common?.pageNotFoundDesc || "The requested page is unavailable."}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 bg-[var(--gov-navy-900)] hover:bg-[var(--gov-navy-800)] text-white px-6 py-3 rounded-lg font-medium transition"
        >
          <Home className="w-5 h-5" />
          {messages.nav?.home || "Home"}
        </Link>
      </div>
    </div>
  );
}