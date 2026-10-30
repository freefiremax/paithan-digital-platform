"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Cookie, X } from 'lucide-react';
import { readConsent, saveConsent, serverConsent, subscribeConsent } from '@/lib/cookie-consent';
import styles from './CookiePreferences.module.css';

// The intro is server-rendered, so the first client snapshot also sees it.
// Observe its removal rather than guessing how long an animation will take.
const introFinished = () => !document.querySelector('.paithan-intro');
const introServerSnapshot = () => false;
function subscribeIntro(listener: () => void) {
  const observer = new MutationObserver(listener);
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}

export function CookiePreferences() {
  const t = useTranslations('cookies');
  const locale = useLocale();
  const ready = useSyncExternalStore(subscribeIntro, introFinished, introServerSnapshot);
  const consent = useSyncExternalStore(subscribeConsent, readConsent, serverConsent);
  const [editing, setEditing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [error, setError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const node = dialog.current;
    if (editing && node && !node.open) node.showModal();
    if (!editing && node?.open) { node.close(); opener.current?.focus(); }
  }, [editing]);
  const open = () => { opener.current = document.activeElement as HTMLElement; setAnalytics(consent === 'accepted'); setEditing(true); };
  const choose = (optional: boolean) => { if (saveConsent(optional)) { setError(false); setEditing(false); } else setError(true); };

  return <>
    {ready && consent === 'unset' && !editing && <aside className={styles.banner} aria-label={t('bannerLabel')}>
      <div className={styles.copy}><div className={styles.title}><Cookie size={21} aria-hidden="true"/><h2>{t('title')}</h2></div><p>{t('description')} <Link href={`/${locale}/policies/privacy`}>{t('privacyLink')}</Link></p>{error && <p role="alert">{t('storageError')}</p>}</div>
      <div className={styles.actions}><button className={styles.secondary} onClick={() => choose(false)}>{t('rejectOptional')}</button><button className={styles.primary} onClick={() => choose(true)}>{t('acceptAll')}</button><button className={styles.configure} onClick={open}>{t('preferences')}</button></div>
    </aside>}
    {ready && (consent === 'accepted' || consent === 'essential') && !editing && <button className={styles.reopen} onClick={open} aria-label={t('preferences')} title={t('preferences')}><Cookie size={20} aria-hidden="true"/></button>}
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="cookie-preferences-title" onCancel={() => setEditing(false)}>
      <div className={styles.dialogHeader}><h2 id="cookie-preferences-title">{t('preferences')}</h2><button className={styles.close} onClick={() => setEditing(false)} aria-label={t('close')}><X size={19}/></button></div>
      <p>{t('description')}</p>
      <div className={styles.category}><div><h3>{t('essentialTitle')}</h3><p>{t('essentialDescription')}</p></div><span className={styles.required}>{t('alwaysOn')}</span></div>
      <div className={styles.category}><div><label htmlFor="cookie-analytics">{t('analyticsTitle')}</label><p id="cookie-analytics-description">{t('analyticsDescription')}</p></div><input id="cookie-analytics" type="checkbox" checked={analytics} onChange={event => setAnalytics(event.target.checked)} aria-describedby="cookie-analytics-description"/></div>
      {error && <p role="alert">{t('storageError')}</p>}
      <div className={styles.dialogActions}><button className={styles.secondary} onClick={() => choose(false)}>{t('rejectOptional')}</button><button className={styles.primary} onClick={() => choose(analytics)}>{t('savePreferences')}</button></div>
      <Link className={styles.privacy} href={`/${locale}/policies/privacy`}>{t('privacyLink')}</Link>
    </dialog>
  </>;
}
