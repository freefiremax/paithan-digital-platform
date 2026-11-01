"use client";
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { GoogleMark } from './GoogleMark';
import styles from './CitizenAuth.module.css';

type Failure = 'signInUnavailable' | 'unexpectedError';
export function GoogleSignIn({ callbackUrl, disabled = false, onStart, onFailure, onRetry }: {
  callbackUrl: string; disabled?: boolean; onStart: () => void; onFailure: (key: Failure) => void; onRetry: () => void;
}) {
  const t = useTranslations('auth');
  const callbacks = useRef({ onStart, onFailure, onRetry });
  useEffect(() => { callbacks.current = { onStart, onFailure, onRetry }; }, [onStart, onFailure, onRetry]);
  const [csrfToken, setCsrfToken] = useState('');
  const [failed, setFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    // Prepare CSRF in parallel with the security widget, rather than after a click.
    void fetch('/api/auth/csrf', { credentials: 'same-origin', cache: 'no-store', signal: controller.signal }).then(async response => {
      if (!active) return;
      if (!response.ok) { setFailed(true); return; }
      const body = await response.json();
      if (!active) return;
      if (typeof body?.csrfToken !== 'string' || !body.csrfToken.trim() || body.csrfToken.length > 1024) {
        setFailed(true); return;
      }
      setCsrfToken(body.csrfToken); setFailed(false);
    }).catch(() => { if (active) { setFailed(true); } }).finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [attempt]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    if (disabled || submitting) {
      event.preventDefault();
      return;
    }
    setSubmitting(true);
    callbacks.current.onStart();

    let token = csrfToken;
    if (!token) {
      event.preventDefault();
      try {
        const response = await fetch('/api/auth/csrf', { credentials: 'same-origin', cache: 'no-store' });
        if (response.ok) {
          const body = await response.json();
          if (typeof body?.csrfToken === 'string' && body.csrfToken.trim() && body.csrfToken.length <= 1024) {
            token = body.csrfToken;
            setCsrfToken(token);
          }
        }
      } catch {
        // Handled below
      }

      if (!token) {
        setSubmitting(false);
        callbacks.current.onFailure('signInUnavailable');
        return;
      }

      const form = event.currentTarget;
      const input = form.querySelector('input[name="csrfToken"]') as HTMLInputElement;
      if (input) input.value = token;
      form.submit();
    }
  }
  return <div>
    <form action="/api/auth/signin/google" method="POST" onSubmit={submit} data-google-sign-in>
      <input type="hidden" name="callbackUrl" value={callbackUrl}/>
      <input type="hidden" name="csrfToken" value={csrfToken}/>
      <button type="submit" disabled={disabled || submitting} className={styles.google} aria-busy={submitting}><GoogleMark/>{t('continueWithGoogle')}</button>
    </form>
    {failed && <button type="button" className={styles.recoveryLink} onClick={() => { callbacks.current.onRetry(); setFailed(false); setCsrfToken(''); setAttempt(value => value + 1); }}>{t('retrySignIn')}</button>}
  </div>;
}
