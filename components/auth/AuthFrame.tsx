"use client";

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, ArrowUpRight, Building2, FileText, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';
import { CouncilSeal } from '@/components/layout/CouncilSeal';
import { WovenDiamond, WovenLotus, ZariStar } from '@/components/ui/PaithanNavMarks';
import styles from './CitizenAuth.module.css';

export function AuthFrame({ mode, title, subtitle, children, footerNote }: {
  mode: 'login' | 'register' | 'admin'; title: string; subtitle: string; children: ReactNode; footerNote?: string;
}) {
  const locale = useLocale();
  const common = useTranslations('auth');
  const t = useTranslations('authDecor');
  const staff = mode === 'admin';
  const links = staff ? [
    { href: '/admin/grievances', label: t('staffGrievances'), detail: t('staffGrievancesDetail'), Icon: MessageSquare },
    { href: '/admin/development-works', label: t('staffWorks'), detail: t('staffWorksDetail'), Icon: MapPin },
    { href: '/admin/notifications', label: t('staffNotices'), detail: t('staffNoticesDetail'), Icon: FileText },
  ] : [
    { href: '/grievances/new', label: t('citizenGrievances'), detail: t('citizenGrievancesDetail'), Icon: MessageSquare },
    { href: '/services', label: t('citizenServices'), detail: t('citizenServicesDetail'), Icon: Building2 },
    { href: '/tourism', label: t('citizenExplore'), detail: t('citizenExploreDetail'), Icon: MapPin },
  ];

  return <div className={styles.page} data-auth-page={mode}>
    <header className={styles.masthead}>
      <div className={styles.mastheadInner}>
        <Link href={`/${locale}`} className={styles.brand}><CouncilSeal size={50} /><span>{common('councilName')}</span></Link>
        <Link href={`/${locale}`} className={styles.back}><ArrowLeft size={15} aria-hidden="true" />{common('backToPortal')}</Link>
      </div>
      <div className="paithani-band" aria-hidden="true" />
    </header>
    <main className={styles.layout}>
      <aside className={styles.heritagePanel} aria-label={t('heritagePanel')}>
        <div className={styles.posterTop}><WovenDiamond /><span>{t('heritageLabel')}</span><WovenDiamond /></div>
        <h2>{t(`${mode}.posterTitle`)}</h2>
        <div className={styles.artwork}>
          <div className={styles.loomLines} aria-hidden="true" />
          <div className={styles.photoArch}><Image src="/images/sites/paithani-weaving.jpg" alt={t('weavingAlt')} fill sizes="(min-width: 1180px) 300px, 260px" className={styles.weavingPhoto} /></div>
          <span className={styles.cornerMark} aria-hidden="true"><ZariStar /></span>
          <div className={styles.roundel} aria-hidden="true"><WovenLotus /><span lang="mr">पैठण</span><small>Paithan</small></div>
          <span className={styles.wovenCorner} aria-hidden="true" />
        </div>
        <p className={styles.posterCaption}>{t('heritageCaption')}</p>
        <Link href={`/${locale}/heritage/cultural-heritage`} className={styles.storyLink}>{t('discoverHeritage')}<ArrowUpRight size={15} aria-hidden="true" /></Link>
      </aside>

      <section className={styles.formColumn}>
        <div className={styles.heading}><h1>{title}</h1><p>{subtitle}</p></div>
        {children}
        <footer className={styles.notice}><p>{footerNote || common('privacyNote')}</p><div className={styles.policies}><Link href={`/${locale}/policies/privacy`}>{common('privacyPolicy')}</Link><Link href={`/${locale}/policies/terms`}>{common('terms')}</Link></div></footer>
      </section>

      <aside className={styles.civicPanel} aria-label={t('civicPanel')}>
        <div className={styles.civicIllustration} aria-hidden="true">
          <svg className={styles.orbit} viewBox="0 0 300 170" fill="none"><path d="M26 128C-6 25 272-24 278 69S88 197 76 111S226 20 240 113" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 7"/><circle cx="28" cy="127" r="5" fill="currentColor"/><circle cx="239" cy="112" r="5" fill="currentColor"/></svg>
          <div className={styles.civicPass}><CouncilSeal size={46}/><div><span>{t('civicPassTitle')}</span><strong>{staff ? t('staffPass') : t('citizenPass')}</strong></div><ShieldCheck size={20}/></div>
          <span className={styles.orbitStar}><ZariStar /></span>
        </div>
        <h2>{t(`${mode}.guideTitle`)}</h2>
        <p className={styles.guideIntro}>{t(`${mode}.guideIntro`)}</p>
        <div className={styles.serviceLinks}>
          {links.map(({ href, label, detail, Icon }) => <Link key={href} href={`/${locale}${href}`}><span className={styles.serviceIcon}><Icon size={19}/></span><span><strong>{label}</strong><small>{detail}</small></span><ArrowUpRight size={16} aria-hidden="true" /></Link>)}
        </div>
        <div className={styles.townNote}><WovenLotus /><p>{t('communityNote')}</p></div>
        <svg className={styles.riverLines} viewBox="0 0 300 35" fill="none" aria-hidden="true"><path d="M1 8C50-9 66 32 118 14S192 1 220 16S267 29 299 13M1 17C50 0 66 41 118 23S192 10 220 25S267 38 299 22" stroke="currentColor" strokeWidth="1.4"/></svg>
      </aside>
    </main>
  </div>;
}
