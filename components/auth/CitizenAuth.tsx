"use client";

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { CouncilSeal } from '@/components/layout/CouncilSeal';
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
  const [error, setError] = useState(params.has('error') ? common('googleError') : '');
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState('');
  const [challenge, setChallenge] = useState(0);
  const turnstileConfigured = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function googleSignIn() {
    setError('');
    setBusy(true);
    try { await signIn('google', { callbackUrl }); }
    catch { setError(common('googleError')); setBusy(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
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
        if (!result || result.error || !result.ok) { setError(t('errorInvalidCredentials')); return; }
        window.location.assign(callbackUrl);
      }
    } catch { setError(common('unexpectedError')); }
    finally { setBusy(false); setToken(''); setChallenge(value => value + 1); }
  }

  const alternate = `/${locale}/${registering ? 'login' : 'register'}?${new URLSearchParams({ callbackUrl })}`;
  return <div className={styles.page}>
    <header className={styles.masthead}>
      <div className={styles.mastheadInner}>
        <Link href={`/${locale}`} className={styles.brand}><CouncilSeal size={50} /><span>{common('councilName')}</span></Link>
        <Link href={`/${locale}`} className={styles.back}><ArrowLeft size={15} aria-hidden="true" />{common('backToPortal')}</Link>
      </div>
    </header>
    <main className={styles.main}>
      <div className={styles.heading}><h1>{t('title')}</h1><p>{t('subtitle')}</p></div>
      <section className={styles.card} aria-label={t('title')}>
        {!registering && params.get('registered') === '1' && <p className={styles.success} role="status">{t('accountCreatedSuccess')}</p>}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button type="button" className={styles.google} onClick={googleSignIn} disabled={busy}>
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5h6.6c3.9-3.6 6.1-8.8 6.1-14.9Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z"/><path fill="#FBBC05" d="M12.6 27.7a12 12 0 0 1 0-7.4v-5.2H5.8a20 20 0 0 0 0 17.8l6.8-5.2Z"/><path fill="#EA4335" d="M24 11.9c3 0 5.6 1 7.7 3l5.8-5.8A19.3 19.3 0 0 0 24 4 20 20 0 0 0 5.8 15.1l6.8 5.2C14.2 15.5 18.7 11.9 24 11.9Z"/></svg>
          {common('continueWithGoogle')}
        </button>
        <div className={styles.divider}>{common('orUseEmail')}</div>
        <form onSubmit={submit} className={styles.form} aria-busy={busy}>
          {registering && <div className={styles.field}><label htmlFor="auth-name">{t('nameLabel')}</label><div className={styles.inputWrap}><User size={17} className={styles.inputIcon} aria-hidden="true"/><input id="auth-name" name="name" autoComplete="name" required maxLength={100} value={name} onChange={e => setName(e.target.value)} className={styles.input} placeholder={t('namePlaceholder')} /></div></div>}
          <div className={styles.field}><label htmlFor="auth-email">{t('emailLabel')}</label><div className={styles.inputWrap}><Mail size={17} className={styles.inputIcon} aria-hidden="true"/><input id="auth-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className={styles.input} placeholder={t('emailPlaceholder')} /></div></div>
          <div className={styles.field}><label htmlFor="auth-password">{t('passwordLabel')}</label><div className={styles.inputWrap}><Lock size={17} className={styles.inputIcon} aria-hidden="true"/><input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={registering ? 'new-password' : 'current-password'} required minLength={registering ? 12 : 1} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} className={styles.input} placeholder={t('passwordPlaceholder')} aria-describedby={registering ? 'password-hint' : undefined}/><button type="button" className={styles.toggle} onClick={() => setShowPassword(value => !value)} aria-label={common(showPassword ? 'hidePassword' : 'showPassword')} aria-pressed={showPassword}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div>{registering && <p id="password-hint" className={styles.hint}>{t('passwordHint')}</p>}</div>
          {registering && <div className={styles.field}><label htmlFor="auth-confirm">{t('confirmPasswordLabel')}</label><div className={styles.inputWrap}><Lock size={17} className={styles.inputIcon} aria-hidden="true"/><input id="auth-confirm" name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={12} maxLength={128} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={styles.input} placeholder={t('confirmPasswordPlaceholder')}/></div></div>}
          {turnstileConfigured && <TurnstileWidget key={challenge} theme="light" onVerify={setToken} />}
          <button type="submit" className={styles.submit} disabled={busy}>{busy ? t('loading') : t('submitBtn')}</button>
        </form>
        <p className={styles.switch}>{registering ? t('alreadyHaveAccount') : t('noAccount')} {' '}<Link href={alternate}>{registering ? t('signInLink') : t('registerLink')}</Link></p>
      </section>
      <footer className={styles.notice}><p>{common('privacyNote')}</p><div className={styles.policies}><Link href={`/${locale}/policies/privacy`}>{common('privacyPolicy')}</Link><Link href={`/${locale}/policies/terms`}>{common('terms')}</Link></div></footer>
    </main>
  </div>;
}
