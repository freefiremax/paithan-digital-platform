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
    const fail = (code = 'challenge-failed') => {
      if (!active) return;
      clearTimeout(timer); setStatus('error'); setErrorCode(code);
      callbacks.current.onVerify(''); callbacks.current.onError?.();
    };
    const watch = () => { clearTimeout(timer); timer = setTimeout(() => fail('verification-timeout'), 30000); };
    watch();
    void loadTurnstile().then(loaded => {
      if (!active || !container.current) return;
      api = loaded;
      setStatus('checking');
      id = api.render(container.current, {
        sitekey: siteKey, theme, size: container.current.clientWidth < 300 ? 'compact' : 'normal',
        appearance: 'always', execution: 'render', language: locale,
        callback: token => { if (!active) return; if (typeof token !== 'string' || !token.trim() || token.length > 2048) { fail('invalid-token'); return; } clearTimeout(timer); setStatus('verified'); setErrorCode(''); callbacks.current.onVerify(token); },
        'error-callback': code => fail(code),
        'timeout-callback': () => fail('challenge-timeout'),
        'unsupported-callback': () => fail('unsupported-browser'),
        'before-interactive-callback': () => { if (!active) return; clearTimeout(timer); setStatus('interactive'); },
        'after-interactive-callback': () => { if (!active) return; setStatus('checking'); watch(); },
        'expired-callback': () => { if (!active) return; callbacks.current.onVerify(''); setStatus('checking'); watch(); if (id !== null) api?.reset(id); },
      });
    }).catch(error => fail(error instanceof Error ? error.message : 'render-failed'));
    return () => { active = false; clearTimeout(timer); if (id !== null) { try { api?.remove(id); } catch { /* Already removed. */ } } };
  }, [siteKey, theme, locale, attempt]);

  const retry = () => { callbacks.current.onVerify(''); setStatus('loading'); setErrorCode(''); setAttempt(value => value + 1); };
  const text = !siteKey ? 'unavailable' : status === 'verified' ? 'checkComplete' : status === 'error' ? (errorCode === '110200' ? 'domainError' : 'checkFailed') : status === 'interactive' ? 'checkInteractive' : status === 'loading' ? 'checkLoading' : 'checkChecking';
  return <section className={`${styles.panel} ${className}`} aria-label={t('title')} data-turnstile-status={!siteKey ? 'unavailable' : status}>
    <div className={styles.heading}><ShieldCheck size={16} aria-hidden="true"/><span>{t('title')}</span><small>Cloudflare Turnstile</small></div>
    {siteKey && <div className={styles.slot}>
      <div ref={container} className={styles.widget} />
      {status === 'loading' && <div className={styles.loading}><LoaderCircle size={19} className={styles.spinner} aria-hidden="true"/><span>{t('checkLoading')}</span></div>}
    </div>}
    <p role={status === 'error' || !siteKey ? 'alert' : 'status'} className={styles.message}>{t(text)}</p>
    {status === 'error' && <div className={styles.recovery}><span>{t('verificationError', { code: errorCode })}</span><button type="button" onClick={retry}>{t('retryCheck')}</button></div>}
  </section>;
}
