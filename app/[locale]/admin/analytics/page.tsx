import { redirect } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { requireAuth } from '@/lib/auth/guard';
import { prisma } from '@/lib/db';
import styles from './analytics.module.css';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const t = await getTranslations('analytics');
  const locale = await getLocale();
  try { await requireAuth('ADMIN'); } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') redirect(`/${locale}/admin/login`);
    if (error instanceof Error && error.message === 'FORBIDDEN') return <p role="alert">{t('restricted')}</p>;
    throw error;
  }
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  const start = new Date(today); start.setUTCDate(start.getUTCDate() - 29);
  const where = { day: { gte: start } };
  const report = await (async () => {
    try {
      const [daily, pages, languages, devices, sources] = await Promise.all([
        prisma.visitorDailyMetric.groupBy({ by: ['day'], where, _sum: { pageViews: true }, orderBy: { day: 'asc' } }),
        prisma.visitorDailyMetric.groupBy({ by: ['path'], where, _sum: { pageViews: true }, orderBy: { _sum: { pageViews: 'desc' } } }),
        prisma.visitorDailyMetric.groupBy({ by: ['locale'], where, _sum: { pageViews: true } }),
        prisma.visitorDailyMetric.groupBy({ by: ['device'], where, _sum: { pageViews: true } }),
        prisma.visitorDailyMetric.groupBy({ by: ['source'], where, _sum: { pageViews: true } }),
      ]);
      return { daily, pages, languages, devices, sources };
    } catch { return null; }
  })();
  if (!report) return <div className={styles.page}><h1>{t('title')}</h1><p role="status">{t('unavailable')}</p></div>;
  const total = report.daily.reduce((sum, row) => sum + (row._sum.pageViews || 0), 0);
  const todayViews = report.daily.find(row => row.day.getTime() === today.getTime())?._sum.pageViews || 0;
  const maximum = Math.max(1, ...report.daily.map(row => row._sum.pageViews || 0));
  const days = Array.from({ length: 30 }, (_, i) => {
    const day = new Date(start); day.setUTCDate(day.getUTCDate() + i);
    return { date: day, count: report.daily.find(row => row.day.getTime() === day.getTime())?._sum.pageViews || 0 };
  });
  const number = (value: number) => new Intl.NumberFormat(locale).format(value);
  const date = (value: Date) => new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(value);
  const groups = [
    { title: t('languages'), rows: report.languages.map(row => ({ key: row.locale, value: row._sum.pageViews || 0 })) },
    { title: t('devices'), rows: report.devices.map(row => ({ key: row.device, value: row._sum.pageViews || 0 })) },
    { title: t('sources'), rows: report.sources.map(row => ({ key: row.source, value: row._sum.pageViews || 0 })) },
  ];
  return <div className={styles.page}>
    <header><h1>{t('title')}</h1><p>{t('subtitle')}</p></header>
    <div className={styles.stats}>{[[t('pageViews'), total], [t('today'), todayViews], [t('pages'), report.pages.length]].map(([label, value]) => <section key={label}><span>{label}</span><strong>{number(Number(value))}</strong></section>)}</div>
    <section className={styles.panel}><h2>{t('daily')}</h2>{!total && <p>{t('empty')}</p>}<div className={styles.chart} role="img" aria-label={t('chartLabel', { count: total })}>{days.map(day => <div key={day.date.toISOString()} title={`${date(day.date)}: ${number(day.count)}`}><span style={{ height: day.count ? `${Math.max(4, day.count / maximum * 100)}%` : '2px', opacity: day.count ? 1 : .2 }} /></div>)}</div><div className={styles.axis}><span>{date(start)}</span><span>{t('utcDays')}</span><span>{date(today)}</span></div></section>
    <section className={styles.panel}><h2>{t('topPages')}</h2>{report.pages.length ? <div className={styles.tableScroll}><table><thead><tr><th>{t('page')}</th><th>{t('pageViews')}</th></tr></thead><tbody>{report.pages.slice(0, 10).map(row => <tr key={row.path}><td>{row.path}</td><td>{number(row._sum.pageViews || 0)}</td></tr>)}</tbody></table></div> : <p>{t('empty')}</p>}</section>
    <div className={styles.breakdowns}>{groups.map(group => <section className={styles.panel} key={group.title}><h2>{group.title}</h2>{group.rows.length ? <ul>{group.rows.sort((a,b) => b.value - a.value).map(row => <li key={row.key}><span>{t(`labels.${row.key}`)}</span><strong>{number(row.value)}</strong></li>)}</ul> : <p>{t('empty')}</p>}</section>)}</div>
    <p className={styles.note}>{t('privacyNote')}</p>
  </div>;
}
