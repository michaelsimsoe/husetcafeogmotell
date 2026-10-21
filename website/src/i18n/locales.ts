/**
 * The site's languages. Norwegian (Bokmål) is the default and lives at the
 * root; every other language lives under its own prefix, e.g. /en/.
 *
 * Kept free of aliases and `import.meta.env` so tests and scripts can load it.
 */

export const locales = ['nb', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'nb';

export const localeInfo: Record<Locale, { lang: string; og: string; intl: string; name: string }> = {
  nb: { lang: 'nb', og: 'nb_NO', intl: 'nb-NO', name: 'Norsk' },
  en: { lang: 'en', og: 'en_GB', intl: 'en-GB', name: 'English' },
};

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (locales as readonly string[]).includes(v);

/** `Astro.currentLocale`, a `lang` attribute or anything else, narrowed to a known locale. */
export const toLocale = (v: unknown): Locale => {
  if (isLocale(v)) return v;
  if (typeof v === 'string') {
    const short = v.toLowerCase().split('-')[0];
    if (isLocale(short)) return short;
    if (short === 'no' || short === 'nn') return 'nb';
  }
  return defaultLocale;
};

/** In the browser: the language of the page the script runs on. */
export const docLocale = (): Locale => toLocale(typeof document === 'undefined' ? undefined : document.documentElement.lang);
