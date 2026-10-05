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
  const safeLocale = locales.includes(locale) ? locale : defaultLocale;
  try {
    return (await import(`./messages/${safeLocale}.json`)).default;
  } catch (err) {
    console.error(`Failed to load messages for locale: ${locale}`, err);
    return (await import(`./messages/en.json`)).default;
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: await getMessages(locale as Locale),
  };
});