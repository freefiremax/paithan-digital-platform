import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { locales, defaultLocale, getMessages, type Locale } from "@/i18n";
import { ClientProviders } from "@/components/providers/ClientProviders";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const safeLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

  setRequestLocale(safeLocale);
  const messages = await getMessages(safeLocale);

  return (
    <NextIntlClientProvider locale={safeLocale} messages={messages}>
      <ClientProviders>{children}</ClientProviders>
    </NextIntlClientProvider>
  );
}