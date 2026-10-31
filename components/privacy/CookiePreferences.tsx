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
  const [dismissed, setDismissed] = useState(false);
  const reopenButton = useRef<HTMLButtonElement>(null);
  const [analytics, setAnalytics] = useState(false);
  const [error, setError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const node = dialog.current;
    if (editing && node && !node.open) node.showModal();
    if (!editing && node?.open) { node.close(); if (opener.current?.isConnected) opener.current.focus(); else reopenButton.current?.focus(); }
  }, [editing]);
  useEffect(() => { if (dismissed) reopenButton.current?.focus(); }, [dismissed]);
  const open = () => { opener.current = document.activeElement as HTMLElement; setAnalytics(consent === 'accepted'); setEditing(true); };
  const choose = (optional: boolean) => { if (saveConsent(optional)) { setError(false); setEditing(false); } else setError(true); };

  return <>
    {ready && consent === 'unset' && !dismissed && !editing && <aside className={styles.banner} aria-label={t('bannerLabel')}>
      <button type="button" className={styles.noticeClose} onClick={() => setDismissed(true)} aria-label={t('dismiss')}><X size={16} aria-hidden="true"/></button>
      <div className={styles.copy}><div className={styles.cookieArt} aria-hidden="true"><Cookie size={32}/></div><div className={styles.title}><h2>{t('title')}</h2></div><p>{t('description')} <Link href={`/${locale}/policies/privacy`}>{t('privacyLink')}</Link></p>{error && <p role="alert">{t('storageError')}</p>}</div>
      <div className={styles.actions}><button className={styles.primary} onClick={() => choose(true)}>{t('acceptAll')}</button><button className={styles.secondary} onClick={() => choose(false)}>{t('rejectOptional')}</button><button className={styles.configure} onClick={open}>{t('preferences')}</button></div>
    </aside>}
    {ready && (consent === 'accepted' || consent === 'essential' || (consent === 'unset' && dismissed)) && !editing && <button ref={reopenButton} className={styles.reopen} onClick={open} aria-label={t('preferences')} title={t('preferences')}><Cookie size={20} aria-hidden="true"/></button>}
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
