import Link from 'next/link';
import en from '@/content/policies/en.json';
import mr from '@/content/policies/mr.json';
import hi from '@/content/policies/hi.json';
import { PolicyLayout } from './PolicyLayout';

export type PolicyKind = keyof typeof en;
export function PolicyDocument({ kind, locale }: { kind: PolicyKind; locale: string }) {
  const documents = locale === 'mr' ? mr : locale === 'hi' ? hi : en;
  const contact = locale === 'mr' ? 'परिषद संपर्क' : locale === 'hi' ? 'परिषद संपर्क' : 'Contact the council';
  return <PolicyLayout titleKey={`${kind}Title`} lastUpdated="2026-10-31">
    <nav aria-label={locale === 'en' ? 'On this page' : locale === 'mr' ? 'या पृष्ठावर' : 'इस पृष्ठ पर'} className="mb-9 border-b border-[var(--border-subtle)] pb-6">
      <ol className="space-y-2">{documents[kind].map(([title], i) => <li key={title}><a href={`#section-${i + 1}`} className="underline underline-offset-4">{title}</a></li>)}</ol>
    </nav>
    {documents[kind].map(([title, text], i) => <section key={title} aria-labelledby={`section-${i + 1}`} className="mb-8"><h2 id={`section-${i + 1}`} className="mb-3 text-xl font-semibold text-[var(--portal-blue-900)] scroll-mt-6">{title}</h2><p className="leading-8">{text}</p></section>)}
    {kind === 'privacy' && <p className="mb-8 flex flex-wrap gap-x-5 gap-y-2"><a href="https://www.cloudflare.com/turnstile-privacy-policy/" className="underline">Cloudflare Turnstile</a><a href="https://policies.google.com/privacy" className="underline">Google</a><a href="https://ai.google.dev/gemini-api/terms" className="underline">Gemini API</a></p>}
    <Link href={`/${locale}/contact`} className="underline underline-offset-4">{contact}</Link>
  </PolicyLayout>;
}
