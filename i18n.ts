import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'mr', 'hi'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  mr: 'मराठी',
  hi: 'हिंदी',
};

export const localeNativeNames: Record<Locale, string> = {
  en: 'English',
  mr: 'मराठी',
  hi: 'हिंदी',
};

export async function getMessages(locale: Locale) {
  try {
    return (await import(`./messages/${locale}.json`)).default;
  } catch {
    notFound();
  }
}

export default getRequestConfig(async ({ locale }) => {
  const messages = await getMessages(locale as Locale);
  return { locale: locale as string, messages };
});