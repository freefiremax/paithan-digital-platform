"use client";

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, Pause, Play } from 'lucide-react';
import styles from './CitizenAuth.module.css';

const photos = ['temple.webp', 'jayakwadi.png', 'paithani.jpg', 'flamingos.png'];

export function AuthFrame({ mode, title, subtitle, children, footerNote }: {
  mode: 'login' | 'register' | 'admin'; title: string; subtitle: string; children: ReactNode; footerNote?: string;
}) {
  const locale = useLocale();
  const common = useTranslations('auth');
  const t = useTranslations('authPhotos');
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (!motion.matches && !document.hidden) timer = setInterval(() => setCurrent(index => (index + 1) % photos.length), 6000);
    };
    sync();
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => { clearInterval(timer); motion.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); };
  }, [paused]);

  return <div className={styles.page} data-auth-page={mode}>
    <header className={styles.mastheadInner}>
      <Link href={`/${locale}`} className={styles.back}><ArrowLeft size={15} aria-hidden="true" />{common('backToPortal')}</Link>
    </header>
    <main className={styles.layout}>
      <aside className={styles.photoPanel} aria-label={t('label')} data-auth-slideshow>
        {photos.map((photo, index) => <div key={photo} className={`${styles.slide} ${index === current ? styles.activeSlide : ''}`} aria-hidden={index !== current} data-active={index === current}>
          <Image src={`/images/auth/${photo}`} alt={t(`photo${index}`)} fill sizes="(max-width: 760px) 100vw, (max-width: 1280px) 48vw, 600px" loading={index === 0 ? 'eager' : 'lazy'} className={styles.photo} style={{ objectPosition: index === 2 ? '54% center' : 'center' }} />
        </div>)}
        <button type="button" className={styles.pause} aria-label={paused ? t('play') : t('pause')} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16} aria-hidden="true"/> : <Pause size={16} aria-hidden="true"/>}</button>
      </aside>
      <section className={styles.formColumn}>
        <div className={styles.heading}><h1>{title}</h1><p>{subtitle}</p></div>
        {children}
        <footer className={styles.notice}><p>{footerNote || common('privacyNote')}</p><div className={styles.policies}><Link href={`/${locale}/policies/privacy`}>{common('privacyPolicy')}</Link><Link href={`/${locale}/policies/terms`}>{common('terms')}</Link></div></footer>
      </section>
    </main>
  </div>;
}
