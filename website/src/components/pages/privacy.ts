/**
 * The privacy notice, written for what this site actually does, one page per
 * language (pages/privacy.astro, pages/en/privacy.astro). Update both whenever
 * the site starts sending data somewhere new (analytics, embeds, another form
 * service), and change `updated`.
 */
import { localeInfo, type Locale } from '../../i18n/locales.ts';
import type { Em } from './home';

/** When the notice last changed in substance, as YYYY-MM-DD. */
export const updated = '2026-10-21';

/** `updated` as a date in `locale`: «21. oktober 2026», «21 October 2026». */
export const updatedIn = (locale: Locale) =>
  new Intl.DateTimeFormat(localeInfo[locale].intl, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${updated}T00:00:00Z`),
  );

export interface PrivacyCopy {
  title: string;
  description: string;
  h1: Em;
  lede: string;
  /** The last section, which carries the date; Privacy.astro adds it after the page's own sections. */
  changes: { id: string; h: string; text: (date: string) => string };
}
