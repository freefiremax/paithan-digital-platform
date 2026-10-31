import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import en from '@/content/policies/en.json';
import mr from '@/content/policies/mr.json';
import hi from '@/content/policies/hi.json';
import { PolicyLayout } from './PolicyLayout';
import styles from './PolicyLayout.module.css';

export type PolicyKind = keyof typeof en;
export function PolicyDocument({ kind, locale }: { kind: PolicyKind; locale: string }) {
  const documents = locale === 'mr' ? mr : locale === 'hi' ? hi : en;
  const contact = locale === 'mr' ? 'परिषद संपर्क' : locale === 'hi' ? 'परिषद संपर्क' : 'Contact the council';
  const onPage = locale === 'en' ? 'On this page' : locale === 'mr' ? 'या पृष्ठावर' : 'इस पृष्ठ पर';
  const numbered = kind === 'privacy' || kind === 'terms';
  return <PolicyLayout titleKey={`${kind}Title`} lastUpdated="2026-10-31">
    <div className={styles.document}>
      <nav className={styles.contents} aria-label={onPage}><h2>{onPage}</h2><ol>{documents[kind].map(([title], i) => <li key={title}><a href={`#section-${i + 1}`}>{title}</a></li>)}</ol></nav>
      <div className={styles.sections}>
        {documents[kind].map(([title, ...points], i) => {
          const heading = <h2 id={`heading-${i + 1}`}>{numbered && <span className={styles.sectionNumber}>{i + 1}.</span>}<span>{title}</span></h2>;
          const pointsList = <ul>{points.map(point => <li key={point}>{point}</li>)}</ul>;
          return kind === 'terms'
            ? <details key={title} name="portal-terms" open={i === 0} className={styles.accordion} data-policy-accordion>
                <summary>{heading}<ChevronDown size={19} className={styles.chevron} aria-hidden="true"/></summary>
                <section aria-labelledby={`heading-${i + 1}`} id={`section-${i + 1}`} className={styles.accordionBody}>{pointsList}</section>
              </details>
            : <section key={title} aria-labelledby={`heading-${i + 1}`} id={`section-${i + 1}`} className={styles.section}>{heading}{pointsList}</section>;
        })}
        <footer className={styles.help}><Link href={`/${locale}/contact`}>{contact}</Link>
          {kind === 'privacy' && <div className={styles.providers}><a href="https://www.cloudflare.com/turnstile-privacy-policy/">Cloudflare Turnstile</a><a href="https://policies.google.com/privacy">Google</a><a href="https://ai.google.dev/gemini-api/terms">Gemini API</a></div>}
        </footer>
      </div>
    </div>
  </PolicyLayout>;
}
