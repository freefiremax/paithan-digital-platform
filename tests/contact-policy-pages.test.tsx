import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { NextIntlClientProvider } from 'next-intl';
import { Helplines } from '@/app/[locale]/contact/Helplines';
import { WebInfoManager } from '@/app/[locale]/contact/WebInfoManager';
import { PolicyDocument, type PolicyKind } from '@/components/policies/PolicyDocument';
import en from '@/messages/en.json';
import mr from '@/messages/mr.json';
import hi from '@/messages/hi.json';
for (const [locale, messages] of Object.entries({ en, mr, hi })) {
  describe(`${locale} contact and policy copy`, () => {
    it('renders helplines and support without missing keys or fake officer details', () => {
      const errors: unknown[] = [];
      const html = renderToStaticMarkup(<NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Kolkata" onError={error => errors.push(error)}><Helplines/><WebInfoManager/></NextIntlClientProvider>);
      expect(errors).toEqual([]);
      expect(html).not.toMatch(/contact\.(?:nationalHelplines|webInfoManager|helpline)/);
      expect(html).not.toContain('wim@paithan.gov.in');
      expect(html).not.toContain('Ext. XX');
      expect(html).toContain('href="tel:112"');
    });
    for (const kind of ['privacy', 'terms', 'copyright', 'hyperlinking', 'disclaimer', 'accessibility'] as PolicyKind[]) {
      it(`renders structured ${kind} policy points with translated navigation`, () => {
        const errors: unknown[] = [];
        const html = renderToStaticMarkup(<NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Kolkata" onError={error => errors.push(error)}><PolicyDocument kind={kind} locale={locale}/></NextIntlClientProvider>);
        expect(errors).toEqual([]);
        expect(html).toContain('<ul>');
        expect(html).toContain('href="#section-1"');
        expect(html).toContain('aria-labelledby="heading-1"');
        expect(html).toContain(`href="/${locale}/policies/privacy"`);
        expect(html).toContain(`href="/${locale}/contact"`);
      });
    }
  });
}
