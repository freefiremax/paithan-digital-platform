"use client";
import { useTranslations } from 'next-intl';
import { Building2 } from 'lucide-react';
import { councilProfile } from '@/lib/mock-data';
import styles from './ContactDetails.module.css';
interface Props { locale?: 'en' | 'mr' | 'hi'; messages?: Record<string, string> }
export function WebInfoManager(_props: Props = {}) {
  const t = useTranslations('contact');
  return <section aria-labelledby="wim-heading" className={styles.support}>
    <h2 id="wim-heading"><Building2 size={24} aria-hidden="true"/>{t('webInfoManagerTitle')}</h2>
    <p>{t('webInfoManagerNote')}</p>
    <dl>
      <div><dt>{t('webInfoManagerFieldEmail')}</dt><dd><a href={`mailto:${councilProfile.email}`}>{councilProfile.email}</a></dd></div>
      <div><dt>{t('webInfoManagerFieldPhone')}</dt><dd><a href={`tel:${councilProfile.phone}`}>{councilProfile.phone}</a></dd></div>
      <div><dt>{t('webInfoManagerFieldAddress')}</dt><dd>{councilProfile.addressLine}</dd></div>
    </dl>
    <footer>{t('webInfoManagerLegalNote')}</footer>
  </section>;
}
