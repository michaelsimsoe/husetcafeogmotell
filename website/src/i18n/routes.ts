/**
 * Every page on the site and its path in each language. A page missing a
 * language simply has no path for it: links then go to the Norwegian page,
 * marked as Norwegian, and the language switcher offers that language's home
 * page instead. Nothing ever links to a page that doesn't exist.
 *
 * Paths are root-relative without the deploy base; callers add it with `withBase`.
 * Kept free of aliases and `import.meta.env` so tests and scripts can load it.
 */
import { defaultLocale, locales, type Locale } from './locales.ts';

interface Route {
  paths: { nb: string } & Partial<Record<Locale, string>>;
  /** Kept out of the sitemap and hreflang, e.g. the thank-you page after the contact form. */
  noindex?: boolean;
}

export const routes = {
  home: { paths: { nb: '/', en: '/en' } },
  menu: { paths: { nb: '/meny' } },
  events: { paths: { nb: '/arrangementer', en: '/en/events' } },
  catering: { paths: { nb: '/catering', en: '/en/catering' } },
  contact: { paths: { nb: '/kontakt', en: '/en/contact' } },
  thanks: { paths: { nb: '/kontakt/takk', en: '/en/contact/thanks' }, noindex: true },
  credits: { paths: { nb: '/anerkjennelse' } },
  privacy: { paths: { nb: '/privacy' } },
} as const satisfies Record<string, Route>;

export type PageKey = keyof typeof routes;

const route = (page: PageKey): Route => routes[page];

export const pageKeys = Object.keys(routes) as PageKey[];

/** The page's path in `locale`, or undefined when it isn't written in that language. */
export const pathOf = (page: PageKey, locale: Locale): string | undefined => route(page).paths[locale];

/** The languages the page exists in, default first. */
export const localesOf = (page: PageKey): Locale[] => locales.filter((l) => pathOf(page, l) !== undefined);

export const isNoindex = (page: PageKey) => route(page).noindex === true;

export interface Alternate {
  locale: Locale;
  path: string;
}

/** The page in every language it exists in. */
export const alternates = (page: PageKey): Alternate[] =>
  localesOf(page).map((locale) => ({ locale, path: pathOf(page, locale)! }));

export interface PageLink {
  path: string;
  /** Set when the link leads to a page in another language than the one asked for. */
  hreflang?: Locale;
  /** True when the page isn't written in the language asked for. */
  fallback: boolean;
}

/** A link from a `locale` page to `page`: the same language when it exists, else the default language, marked as such. */
export function linkTo(page: PageKey, locale: Locale): PageLink {
  const own = pathOf(page, locale);
  if (own !== undefined) return { path: own, fallback: false };
  return { path: pathOf(page, defaultLocale)!, hreflang: defaultLocale, fallback: true };
}

export interface SwitchTarget {
  locale: Locale;
  path: string;
  /** True when the page doesn't exist in `locale` and the target is that language's home page. */
  fallback: boolean;
}

/** Where the language switcher on `page` (in `current`) leads for each other language. */
export const switchTargets = (page: PageKey, current: Locale): SwitchTarget[] =>
  locales
    .filter((l) => l !== current)
    .map((locale) => {
      const own = pathOf(page, locale);
      return own !== undefined ? { locale, path: own, fallback: false } : { locale, path: pathOf('home', locale)!, fallback: true };
    });

export interface SitemapEntry {
  page: PageKey;
  locale: Locale;
  path: string;
  alternates: Alternate[];
}

/** Every indexable page in every language it exists in. */
export const sitemapEntries = (): SitemapEntry[] =>
  pageKeys
    .filter((page) => !isNoindex(page))
    .flatMap((page) => {
      const alts = alternates(page);
      return alts.map(({ locale, path }) => ({ page, locale, path, alternates: alts }));
    });

/** Reverse lookup: which page and language a root-relative path is. */
export function pageAt(path: string): { page: PageKey; locale: Locale } | undefined {
  const clean = path.length > 1 ? path.replace(/\/$/, '') : path;
  for (const page of pageKeys) {
    for (const locale of locales) if (pathOf(page, locale) === clean) return { page, locale };
  }
  return undefined;
}
