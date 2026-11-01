"use client";

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';
import { isRetryableTurnstileError, loadTurnstile } from '@/lib/turnstile-client';
import styles from './TurnstileWidget.module.css';

interface Props {
  onVerify: (token: string) => void;
  onError?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  appearance?: 'always' | 'execute' | 'interaction-only';
  action?: string;
  cdata?: string;
  className?: string;
  showPrompt?: boolean;
}
type Status = 'loading' | 'checking' | 'interactive' | 'verified' | 'error';

export function TurnstileWidget({
  onVerify,
  onError,
  theme = 'light',
  appearance = 'always',
  action,
  cdata,
  className = '',
  showPrompt = true,
}: Props) {
  const t = useTranslations('security');
  const locale = useLocale();
  const container = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onVerify, onError });
  useEffect(() => { callbacks.current = { onVerify, onError }; }, [onVerify, onError]);
  const [status, setStatus] = useState<Status>('loading');
  const [errorCode, setErrorCode] = useState('');
  const [retryAvailable, setRetryAvailable] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const automaticRetries = useRef(0);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;
    let active = true;
    let id: string | null = null;
    let timer: ReturnType<typeof setTimeout>;
    let api: Awaited<ReturnType<typeof loadTurnstile>> | undefined;
    let phase: Status = 'loading';
    let verifiedAt = 0;
    let failureCode = '';
    const update = (next: Status) => { phase = next; setStatus(next); setRetryAvailable(false); };

    const completeVerified = (tok: string) => {
      if (!active || phase === 'verified') return;
      clearTimeout(timer);
      verifiedAt = Date.now();
      update('verified');
      setErrorCode('');
      callbacks.current.onVerify(tok);
    };

    const fail = (code = 'challenge-failed') => {
      if (!active || phase === 'verified') return;
      failureCode = code;
      clearTimeout(timer);
      callbacks.current.onVerify('');
      setErrorCode(code);
      update('error');
      callbacks.current.onError?.();
    };

    // A slow challenge is not a failed challenge. Keep Cloudflare mounted and
    // let its actual callbacks decide success/failure; offer a fast retry.
    const watch = (milliseconds = 6000) => {
      clearTimeout(timer);
      timer = setTimeout(() => { if (active) setRetryAvailable(true); }, milliseconds);
    };
    const refresh = () => {
      if (!active) return;
      verifiedAt = 0; callbacks.current.onVerify(''); setErrorCode(''); update('checking'); watch();
      try { if (id !== null && api) api.reset(id); else fail('render-failed'); }
      catch { fail('render-failed'); }
    };
    const resume = () => {
      if (document.hidden || !active) return;
      if (phase === 'error' && isRetryableTurnstileError(failureCode)) { callbacks.current.onVerify(''); setStatus('loading'); setErrorCode(''); setAttempt(value => value + 1); return; }
      // Browser timers and iframe callbacks may pause in a background tab.
      if (phase === 'verified' && Date.now() - verifiedAt >= 240000) refresh();
    };
    document.addEventListener('visibilitychange', resume);
    window.addEventListener('online', resume);
    watch();
    void loadTurnstile().then(loaded => {
      if (!active || !container.current) return;
      api = loaded;
      if (phase === 'verified') return;
      update('checking'); watch();
      id = api.render(container.current, {
        sitekey: siteKey, theme, size: container.current.clientWidth < 300 ? 'compact' : 'normal',
        appearance, action, cdata, execution: 'render', language: locale,
        'response-field': false, retry: 'auto', 'retry-interval': 1000,
        'refresh-expired': 'auto', 'refresh-timeout': 'auto',
        callback: token => {
          if (!active) return;
          if (typeof token !== 'string' || !token.trim() || token.length > 2048) { fail('invalid-token'); return; }
          automaticRetries.current = 0;
          completeVerified(token);
          timer = setTimeout(() => { if (!document.hidden) refresh(); }, 240000);
        },
        'error-callback': code => { fail(code); return true; },
        'timeout-callback': () => fail('challenge-timeout'),
        'unsupported-callback': () => fail('unsupported-browser'),
        'before-interactive-callback': () => { if (!active || phase === 'verified') return; update('interactive'); },
        'after-interactive-callback': () => { if (!active || phase === 'verified') return; update('checking'); },
        'expired-callback': refresh,
      });
    }).catch(() => fail('render-failed'));
    return () => {
      active = false; clearTimeout(timer);
      document.removeEventListener('visibilitychange', resume); window.removeEventListener('online', resume);
      if (id !== null) { try { api?.remove(id); } catch { /* Already removed. */ } }
    };
  }, [siteKey, theme, appearance, locale, attempt, action, cdata]);

  const retry = () => { automaticRetries.current = 0; callbacks.current.onVerify(''); setRetryAvailable(false); setStatus('loading'); setErrorCode(''); setAttempt(value => value + 1); };
  const text = !siteKey ? 'unavailable' : status === 'verified' ? 'checkComplete' : status === 'error' ? (errorCode === '110200' ? 'domainError' : 'checkFailed') : status === 'interactive' ? 'checkInteractive' : status === 'loading' ? 'checkLoading' : 'checkChecking';
  return <>
    {siteKey && <link rel="preconnect" href="https://challenges.cloudflare.com" />}
    <section className={`${styles.panel} ${className}`} aria-label={t('title')} data-turnstile-status={!siteKey ? 'unavailable' : status}>
    <div className={styles.heading}><ShieldCheck size={16} aria-hidden="true"/><span>{t('title')}</span><small>Cloudflare Turnstile</small></div>
    {showPrompt && status !== 'verified' && (
      <div className={styles.promptHeader}>
        {t('verifyingHuman')}
      </div>
    )}
    {siteKey && <div className={styles.slot}>
      {(status === 'loading' || status === 'checking') && (
        <div className={`${styles.cfPlaceholder} ${styles.cfOverlay}`} aria-hidden="true">
          <div className={styles.cfPlaceholderLeft}>
            <svg className={styles.cfSpinner} width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="3" r="1.8" fill="#16a34a" opacity="1" />
              <circle cx="18.36" cy="5.64" r="1.8" fill="#16a34a" opacity="0.875" />
              <circle cx="21" cy="12" r="1.8" fill="#16a34a" opacity="0.75" />
              <circle cx="18.36" cy="18.36" r="1.8" fill="#16a34a" opacity="0.625" />
              <circle cx="12" cy="21" r="1.8" fill="#16a34a" opacity="0.5" />
              <circle cx="5.64" cy="18.36" r="1.8" fill="#16a34a" opacity="0.375" />
              <circle cx="3" cy="12" r="1.8" fill="#16a34a" opacity="0.25" />
              <circle cx="5.64" cy="5.64" r="1.8" fill="#16a34a" opacity="0.125" />
            </svg>
            <span className={styles.cfPlaceholderText}>{t('verifyingDots')}</span>
          </div>
          <div className={styles.cfPlaceholderRight}>
            <div className={styles.cfBrand}>
              <svg width="24" height="11" viewBox="0 0 256 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fill="#F38020" d="M176.332 108.348c1.593-5.31 1.062-10.622-1.593-13.809-2.656-3.187-6.374-5.31-11.154-5.842L71.17 87.634c-.531 0-1.062-.53-1.593-.53-.531-.532-.531-1.063 0-1.594.531-1.062 1.062-1.594 2.124-1.594l92.946-1.062c11.154-.53 22.839-9.56 27.087-20.182l5.312-13.809c0-.532.531-1.063 0-1.594C191.203 20.182 166.772 0 138.091 0 111.535 0 88.697 16.995 80.73 40.896c-5.311-3.718-11.684-5.843-19.12-5.31-12.747 1.061-22.838 11.683-24.432 24.43-.531 3.187 0 6.374.532 9.56C16.996 70.107 0 87.103 0 108.348c0 2.124 0 3.718.531 5.842 0 1.063 1.062 1.594 1.594 1.594h170.489c1.062 0 2.125-.53 2.125-1.594l1.593-5.842Z"/>
                <path fill="#FAAD3F" d="M205.544 48.863h-2.656c-.531 0-1.062.53-1.593 1.062l-3.718 12.747c-1.593 5.31-1.062 10.623 1.594 13.809 2.655 3.187 6.373 5.31 11.153 5.843l19.652 1.062c.53 0 1.062.53 1.593.53.53.532.53 1.063 0 1.594-.531 1.063-1.062 1.594-2.125 1.594l-20.182 1.062c-11.154.53-22.838 9.56-27.087 20.182l-1.063 4.78c-.531.532 0 1.594 1.063 1.594h70.108c1.062 0 1.593-.531 1.593-1.593 1.062-4.25 2.124-9.03 2.124-13.81 0-27.618-22.838-50.456-50.456-50.456"/>
              </svg>
              <span className={styles.cfBrandName}>CLOUDFLARE</span>
            </div>
            <span className={styles.cfLegal}>
              <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className={styles.cfLegalLink}>Privacy</a>
              {' • '}
              <a href="https://www.cloudflare.com/website-terms/" target="_blank" rel="noopener noreferrer" className={styles.cfLegalLink}>Terms</a>
            </span>
          </div>
        </div>
      )}
      {status === 'verified' && (
        <div className={`${styles.cfPlaceholder} ${styles.cfStatic}`} aria-hidden="true">
          <div className={styles.cfPlaceholderLeft}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#16a34a" />
              <path d="M7 12.5l3.5 3.5 6.5-6.5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles.cfPlaceholderTextVerified}>{t('success')}</span>
          </div>
          <div className={styles.cfPlaceholderRight}>
            <div className={styles.cfBrand}>
              <svg width="24" height="11" viewBox="0 0 256 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fill="#F38020" d="M176.332 108.348c1.593-5.31 1.062-10.622-1.593-13.809-2.656-3.187-6.374-5.31-11.154-5.842L71.17 87.634c-.531 0-1.062-.53-1.593-.53-.531-.532-.531-1.063 0-1.594.531-1.062 1.062-1.594 2.124-1.594l92.946-1.062c11.154-.53 22.839-9.56 27.087-20.182l5.312-13.809c0-.532.531-1.063 0-1.594C191.203 20.182 166.772 0 138.091 0 111.535 0 88.697 16.995 80.73 40.896c-5.311-3.718-11.684-5.843-19.12-5.31-12.747 1.061-22.838 11.683-24.432 24.43-.531 3.187 0 6.374.532 9.56C16.996 70.107 0 87.103 0 108.348c0 2.124 0 3.718.531 5.842 0 1.063 1.062 1.594 1.594 1.594h170.489c1.062 0 2.125-.53 2.125-1.594l1.593-5.842Z"/>
                <path fill="#FAAD3F" d="M205.544 48.863h-2.656c-.531 0-1.062.53-1.593 1.062l-3.718 12.747c-1.593 5.31-1.062 10.623 1.594 13.809 2.655 3.187 6.373 5.31 11.153 5.843l19.652 1.062c.53 0 1.062.53 1.593.53.53.532.53 1.063 0 1.594-.531 1.063-1.062 1.594-2.125 1.594l-20.182 1.062c-11.154.53-22.838 9.56-27.087 20.182l-1.063 4.78c-.531.532 0 1.594 1.063 1.594h70.108c1.062 0 1.593-.531 1.593-1.593 1.062-4.25 2.124-9.03 2.124-13.81 0-27.618-22.838-50.456-50.456-50.456"/>
              </svg>
              <span className={styles.cfBrandName}>CLOUDFLARE</span>
            </div>
            <span className={styles.cfLegal}>
              <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className={styles.cfLegalLink}>Privacy</a>
              {' • '}
              <a href="https://www.cloudflare.com/website-terms/" target="_blank" rel="noopener noreferrer" className={styles.cfLegalLink}>Terms</a>
            </span>
          </div>
        </div>
      )}
      <div ref={container} className={styles.widget} style={status === 'verified' ? { display: 'none' } : undefined} />
    </div>}
    <p role={status === 'error' || !siteKey ? 'alert' : 'status'} className={status === 'error' ? styles.errorMessage : styles.srOnly}>{t(text)}</p>
    {(status === 'error' || retryAvailable) && <div className={styles.recovery}>{status === 'error' && <details><summary>{t('errorDetails')}</summary><span>{t('verificationError', { code: errorCode })}</span></details>}<button type="button" onClick={retry}>{t('retryCheck')}</button></div>}
  </section></>;
}
