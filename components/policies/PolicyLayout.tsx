"use client";
import type { ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CouncilSeal } from '@/components/layout/CouncilSeal';
import styles from './PolicyLayout.module.css';
const kinds = ['privacy', 'terms', 'copyright', 'hyperlinking', 'disclaimer', 'accessibility'];
export function PolicyLayout({ children, titleKey, lastUpdated, backHref }: { children: ReactNode; titleKey: string; lastUpdated: string; backHref?: string }) {
  const t = useTranslations('policies');
  const auth = useTranslations('auth');
  const locale = useLocale();
  const index = titleKey === 'indexTitle';
  return <div className={styles.page}>
    <header className={styles.masthead}><div className={styles.mastheadInner}>
      <Link className={styles.brand} href={`/${locale}`}><CouncilSeal size={46}/><span>{auth('councilName')}</span></Link>
      <Link className={styles.back} href={backHref || `/${locale}`}><ArrowLeft size={15} aria-hidden="true"/>{auth('backToPortal')}</Link>
    </div></header>
    <main className={styles.main}>
      <nav className={styles.breadcrumb} aria-label={locale === 'en' ? 'Breadcrumb' : locale === 'mr' ? 'पृष्ठ मार्ग' : 'पृष्ठ मार्ग'}><ol>
        <li><Link href={`/${locale}`}>{t('home')}</Link></li><li aria-hidden="true">/</li>
        {!index && <><li><Link href={`/${locale}/policies`}>{t('policiesIndex')}</Link></li><li aria-hidden="true">/</li></>}
        <li aria-current="page">{t(titleKey)}</li>
      </ol></nav>
      <article className={styles.article}>
        <header className={styles.header}><h1>{t(titleKey)}</h1><p>{t(index ? 'indexSubtitle' : titleKey.replace('Title', 'Desc'))}</p><p className={styles.updated}>{t('lastUpdated')}: <time dateTime={lastUpdated}>{new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(lastUpdated))}</time></p></header>
        <nav className={styles.policyNav} aria-label={t('policiesIndex')}>{kinds.map(kind => <Link key={kind} href={`/${locale}/policies/${kind}`} aria-current={titleKey === `${kind}Title` ? 'page' : undefined}>{t(`${kind}Title`)}</Link>)}</nav>
        <div className={styles.content}>{children}</div>
      </article>
    </main>
  </div>;
}
