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

export interface Route {
  paths: { nb: string } & Partial<Record<Locale, string>>;
  /** Kept out of the sitemap and hreflang, e.g. the thank-you page after the contact form. */
  noindex?: boolean;
}

export interface Alternate {
  locale: Locale;
  path: string;
}

export interface PageLink {
  path: string;
  /** Set when the link leads to a page in another language than the one asked for. */
  hreflang?: Locale;
  /** True when the page isn't written in the language asked for. */
  fallback: boolean;
}

export interface SwitchTarget {
  locale: Locale;
  path: string;
  /** True when the page doesn't exist in `locale` and the target is that language's home page. */
  fallback: boolean;
}

export interface SitemapEntry<K extends string = string> {
  page: K;
  locale: Locale;
  path: string;
  alternates: Alternate[];
}

/**
 * The lookups over a table of pages. The site's are exported below, built from
 * `routes`; tests build their own from a fixture table. The table needs a home
 * page in every language, since fallbacks land there.
 */
export function registry<T extends Record<string, Route> & { home: Route }>(table: T) {
  type K = keyof T & string;
  const route = (page: K): Route => table[page];
  const pageKeys = Object.keys(table) as K[];

  /** The page's path in `locale`, or undefined when it isn't written in that language. */
  const pathOf = (page: K, locale: Locale): string | undefined => route(page).paths[locale];

  /** The languages the page exists in, default first. */
  const localesOf = (page: K): Locale[] => locales.filter((l) => pathOf(page, l) !== undefined);

  const isNoindex = (page: K) => route(page).noindex === true;

  /** The page in every language it exists in. */
  const alternates = (page: K): Alternate[] => localesOf(page).map((locale) => ({ locale, path: pathOf(page, locale)! }));

  /** A link from a `locale` page to `page`: the same language when it exists, else the default language, marked as such. */
  function linkTo(page: K, locale: Locale): PageLink {
    const own = pathOf(page, locale);
    if (own !== undefined) return { path: own, fallback: false };
    return { path: pathOf(page, defaultLocale)!, hreflang: defaultLocale, fallback: true };
  }

  /** Where the language switcher on `page` (in `current`) leads for each other language. */
  const switchTargets = (page: K, current: Locale): SwitchTarget[] =>
    locales
      .filter((l) => l !== current)
      .map((locale) => {
        const own = pathOf(page, locale);
        return own !== undefined ? { locale, path: own, fallback: false } : { locale, path: table.home.paths[locale]!, fallback: true };
      });

  /** Every indexable page in every language it exists in. */
  const sitemapEntries = (): SitemapEntry<K>[] =>
    pageKeys
      .filter((page) => !isNoindex(page))
      .flatMap((page) => {
        const alts = alternates(page);
        return alts.map(({ locale, path }) => ({ page, locale, path, alternates: alts }));
      });

  /** Reverse lookup: which page and language a root-relative path is. */
  function pageAt(path: string): { page: K; locale: Locale } | undefined {
    const clean = path.length > 1 ? path.replace(/\/$/, '') : path;
    for (const page of pageKeys) {
      for (const locale of locales) if (pathOf(page, locale) === clean) return { page, locale };
    }
    return undefined;
  }

  return { pageKeys, pathOf, localesOf, isNoindex, alternates, linkTo, switchTargets, sitemapEntries, pageAt };
}

export const routes = {
  home: { paths: { nb: '/', en: '/en' } },
  menu: { paths: { nb: '/meny', en: '/en/menu' } },
  events: { paths: { nb: '/arrangementer', en: '/en/events' } },
  catering: { paths: { nb: '/catering', en: '/en/catering' } },
  contact: { paths: { nb: '/kontakt', en: '/en/contact' } },
  thanks: { paths: { nb: '/kontakt/takk', en: '/en/contact/thanks' }, noindex: true },
  credits: { paths: { nb: '/anerkjennelse', en: '/en/credits' } },
  privacy: { paths: { nb: '/privacy', en: '/en/privacy' } },
} as const satisfies Record<string, Route>;

export type PageKey = keyof typeof routes;

export const { pageKeys, pathOf, localesOf, isNoindex, alternates, linkTo, switchTargets, sitemapEntries, pageAt } = registry(routes);
