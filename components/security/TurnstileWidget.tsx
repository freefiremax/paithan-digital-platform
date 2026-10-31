"use client";

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LoaderCircle, ShieldCheck } from 'lucide-react';
import { loadTurnstile } from '@/lib/turnstile-client';
import styles from './TurnstileWidget.module.css';

interface Props { onVerify: (token: string) => void; onError?: () => void; theme?: 'light' | 'dark' | 'auto'; className?: string }
type Status = 'loading' | 'checking' | 'interactive' | 'verified' | 'error';

export function TurnstileWidget({ onVerify, onError, theme = 'light', className = '' }: Props) {
  const t = useTranslations('security');
  const locale = useLocale();
  const container = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onVerify, onError });
  useEffect(() => { callbacks.current = { onVerify, onError }; }, [onVerify, onError]);
  const [status, setStatus] = useState<Status>('loading');
  const [errorCode, setErrorCode] = useState('');
  const [attempt, setAttempt] = useState(0);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;
    let active = true;
    let id: string | null = null;
    let timer: ReturnType<typeof setTimeout>;
    let api: Awaited<ReturnType<typeof loadTurnstile>> | undefined;
    let phase: Status = 'loading';
    let changedAt = Date.now();
    let verifiedAt = 0;
    const update = (next: Status) => { phase = next; changedAt = Date.now(); setStatus(next); };
    const fail = (code = 'challenge-failed') => {
      if (!active) return;
      clearTimeout(timer); verifiedAt = 0; update('error'); setErrorCode(code);
      callbacks.current.onVerify(''); callbacks.current.onError?.();
    };
    const watch = (milliseconds = 15000) => { clearTimeout(timer); timer = setTimeout(() => fail('verification-timeout'), milliseconds); };
    const refresh = () => {
      if (!active) return;
      verifiedAt = 0; callbacks.current.onVerify(''); setErrorCode(''); update('checking'); watch();
      try { if (id !== null && api) api.reset(id); else fail('render-failed'); }
      catch { fail('render-failed'); }
    };
    const resume = () => {
      if (document.hidden || !active) return;
      if (phase === 'error') { callbacks.current.onVerify(''); setStatus('loading'); setErrorCode(''); setAttempt(value => value + 1); return; }
      // Browser timers and iframe callbacks may pause in a background tab.
      if ((phase === 'verified' && Date.now() - verifiedAt >= 240000) ||
          (phase === 'checking' && Date.now() - changedAt >= 15000)) refresh();
    };
    document.addEventListener('visibilitychange', resume);
    window.addEventListener('online', resume);
    watch();
    void loadTurnstile().then(loaded => {
      if (!active || !container.current) return;
      api = loaded;
      update('checking');
      id = api.render(container.current, {
        sitekey: siteKey, theme, size: container.current.clientWidth < 300 ? 'compact' : 'normal',
        appearance: 'always', execution: 'render', language: locale,
        'response-field': false, retry: 'auto', 'retry-interval': 8000,
        'refresh-expired': 'auto', 'refresh-timeout': 'auto',
        callback: token => {
          if (!active) return;
          if (typeof token !== 'string' || !token.trim() || token.length > 2048) { fail('invalid-token'); return; }
          clearTimeout(timer); verifiedAt = Date.now(); update('verified'); setErrorCode(''); callbacks.current.onVerify(token);
          // Refresh before the provider's five-minute expiry, even if an iframe callback is lost.
          timer = setTimeout(() => { if (!document.hidden) refresh(); }, 240000);
        },
        'error-callback': code => fail(code),
        'timeout-callback': () => fail('challenge-timeout'),
        'unsupported-callback': () => fail('unsupported-browser'),
        'before-interactive-callback': () => { if (!active) return; update('interactive'); watch(120000); },
        'after-interactive-callback': () => { if (!active) return; update('checking'); watch(); },
        'expired-callback': refresh,
      });
    }).catch(error => fail(error instanceof Error ? error.message : 'render-failed'));
    return () => {
      active = false; clearTimeout(timer);
      document.removeEventListener('visibilitychange', resume); window.removeEventListener('online', resume);
      if (id !== null) { try { api?.remove(id); } catch { /* Already removed. */ } }
    };
  }, [siteKey, theme, locale, attempt]);

  const retry = () => { callbacks.current.onVerify(''); setStatus('loading'); setErrorCode(''); setAttempt(value => value + 1); };
  const text = !siteKey ? 'unavailable' : status === 'verified' ? 'checkComplete' : status === 'error' ? (errorCode === '110200' ? 'domainError' : 'checkFailed') : status === 'interactive' ? 'checkInteractive' : status === 'loading' ? 'checkLoading' : 'checkChecking';
  return <>
    {siteKey && <><link rel="preconnect" href="https://challenges.cloudflare.com"/><link rel="preload" as="script" href="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"/></>}
    <section className={`${styles.panel} ${className}`} aria-label={t('title')} data-turnstile-status={!siteKey ? 'unavailable' : status}>
    <div className={styles.heading}><ShieldCheck size={16} aria-hidden="true"/><span>{t('title')}</span><small>Cloudflare Turnstile</small></div>
    {siteKey && <div className={styles.slot}>
      <div ref={container} className={styles.widget} />

    </div>}
    <p role={status === 'error' || !siteKey ? 'alert' : 'status'} className={styles.message}>{(status === 'loading' || status === 'checking') && siteKey && <LoaderCircle size={14} className={styles.spinner} aria-hidden="true"/>}{t(text)}</p>
    {status === 'error' && <div className={styles.recovery}><details><summary>{t('errorDetails')}</summary><span>{t('verificationError', { code: errorCode })}</span></details><button type="button" onClick={retry}>{t('retryCheck')}</button></div>}
  </section></>;
}
