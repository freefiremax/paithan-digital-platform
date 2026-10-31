"use client";

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { AuthFrame } from './AuthFrame';
import { GoogleSignIn } from './GoogleSignIn';
import { signInErrorMessage } from '@/lib/auth/error-message';
import { TurnstileWidget } from '@/components/security/TurnstileWidget';
import { citizenCallbackUrl } from '@/lib/auth/redirect';
import styles from './CitizenAuth.module.css';

export function CitizenAuth({ mode }: { mode: 'login' | 'register' }) {
  const registering = mode === 'register';
  const locale = useLocale();
  const t = useTranslations(mode);
  const common = useTranslations('auth');
  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = citizenCallbackUrl(params.get('callbackUrl'), locale);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(params.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const initialError = signInErrorMessage(params.get('error'));
  const [error, setError] = useState(initialError ? common(initialError) : '');
  const [registrationSuggested, setRegistrationSuggested] = useState(false);
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState('');
  const [challenge, setChallenge] = useState(0);
  const turnstileConfigured = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setRegistrationSuggested(false);
    if (registering && password !== confirmPassword) { setError(t('errorPasswordsMismatch')); return; }
    if (turnstileConfigured && !token) { setError(common('verificationRequired')); return; }
    setBusy(true);
    try {
      if (registering) {
        const response = await fetch('/api/auth/register', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), password, turnstileToken: token }),
        });
        const body = await response.json();
        if (!response.ok) {
          const code = body.error?.code;
          setError(code === 'CONFLICT' ? t('emailExists') : code === 'RATE_LIMITED' ? common('rateLimited') : code === 'TURNSTILE_FAILED' ? common('verificationRequired') : t('submitError'));
          return;
        }
        // Turnstile tokens are single-use: sign in on a fresh form after creation.
        const query = new URLSearchParams({ registered: '1', email: email.trim(), callbackUrl });
        router.push(`/${locale}/login?${query}`);
      } else {
        const result = await signIn('credentials', { email: email.trim(), password, turnstileToken: token, redirect: false, callbackUrl });
        if (result?.code === 'account_not_found') { setError(t('accountNotFound')); setRegistrationSuggested(true); return; }
        if (!result || result.error || !result.ok) { setError(t('errorInvalidCredentials')); return; }
        window.location.assign(callbackUrl);
      }
    } catch { setError(common('unexpectedError')); }
    finally { setBusy(false); setToken(''); setChallenge(value => value + 1); }
  }

  const alternate = `/${locale}/${registering ? 'login' : 'register'}?${new URLSearchParams({ callbackUrl, ...(email ? { email: email.trim() } : {}) })}`;
  return <AuthFrame mode={mode} title={t('title')} subtitle={t('subtitle')}>
      <section className={styles.card} aria-label={t('title')}>
        {!registering && params.get('registered') === '1' && <p className={styles.success} role="status">{t('accountCreatedSuccess')}</p>}
        {error && <div className={styles.error} role="alert"><p>{error}</p>{registrationSuggested && <Link href={alternate} className={styles.recoveryLink}>{t('registerLink')}</Link>}</div>}
        <GoogleSignIn callbackUrl={callbackUrl} disabled={busy} onStart={() => { setError(''); setBusy(true); }} onFailure={key => setError(common(key))} onRetry={() => setError('')}/>
        <div className={styles.divider}>{common('orUseEmail')}</div>
        <form onSubmit={submit} className={`${styles.form} ${registering ? styles.registerForm : ''}`} aria-busy={busy}>
          {registering && <div className={styles.field}><label htmlFor="auth-name">{t('nameLabel')}</label><div className={styles.inputWrap}><User size={17} className={styles.inputIcon} aria-hidden="true"/><input id="auth-name" name="name" autoComplete="name" required maxLength={100} value={name} onChange={e => setName(e.target.value)} className={styles.input} placeholder={t('namePlaceholder')} /></div></div>}
          <div className={styles.field}><label htmlFor="auth-email">{t('emailLabel')}</label><div className={styles.inputWrap}><Mail size={17} className={styles.inputIcon} aria-hidden="true"/><input id="auth-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className={styles.input} placeholder={t('emailPlaceholder')} /></div></div>
          <div className={styles.field}><label htmlFor="auth-password">{t('passwordLabel')}</label><div className={styles.inputWrap}><Lock size={17} className={styles.inputIcon} aria-hidden="true"/><input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={registering ? 'new-password' : 'current-password'} required minLength={registering ? 12 : 1} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} className={styles.input} placeholder={t('passwordPlaceholder')} aria-describedby={registering ? 'password-hint' : undefined}/><button type="button" className={styles.toggle} onClick={() => setShowPassword(value => !value)} aria-label={common(showPassword ? 'hidePassword' : 'showPassword')} aria-pressed={showPassword}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div>{registering && <p id="password-hint" className={styles.hint}>{t('passwordHint')}</p>}</div>
          {registering && <div className={styles.field}><label htmlFor="auth-confirm">{t('confirmPasswordLabel')}</label><div className={styles.inputWrap}><Lock size={17} className={styles.inputIcon} aria-hidden="true"/><input id="auth-confirm" name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={12} maxLength={128} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={styles.input} placeholder={t('confirmPasswordPlaceholder')}/></div></div>}
          {turnstileConfigured && <TurnstileWidget key={challenge} theme="light" action={mode} onVerify={setToken} />}
          <button type="submit" className={styles.submit} disabled={busy}>{busy ? t('loading') : t('submitBtn')}</button>
        </form>
        <p className={styles.switch}>{registering ? t('alreadyHaveAccount') : t('noAccount')} {' '}<Link href={alternate}>{registering ? t('signInLink') : t('registerLink')}</Link></p>
      </section>
  </AuthFrame>;
}
