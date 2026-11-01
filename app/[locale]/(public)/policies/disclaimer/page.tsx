import type { Metadata } from 'next';
import { getMessages } from '@/i18n';
import { PolicyDocument } from '@/components/policies/PolicyDocument';

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale as 'en' | 'mr' | 'hi');
  return { title: messages.policies.disclaimerTitle };
}
export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <PolicyDocument kind="disclaimer" locale={locale} />;
}
