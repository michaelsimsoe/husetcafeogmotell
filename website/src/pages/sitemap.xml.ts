import type { APIRoute } from 'astro';
import { withBase } from '@lib/base';
import { indexable } from '@lib/env';
import { localeInfo } from '@i18n/locales';
import { sitemapEntries } from '@i18n/routes';

/**
 * Every indexable page in every language it is written in (src/i18n/routes.ts).
 * Pages with translations list them all, themselves included, as the pages' own
 * hreflang links do. Thank-you and 404 pages are left out on purpose.
 */
export const GET: APIRoute = ({ site }) => {
  const abs = (path: string) => new URL(withBase(path), site).href;
  const entries = indexable ? sitemapEntries() : [];
  const url = (e: (typeof entries)[number]) => {
    const alts =
      e.alternates.length > 1
        ? [...e.alternates.map((a) => [localeInfo[a.locale].lang, a.path]), ['x-default', e.alternates[0].path]]
        : [];
    return [
      '  <url>',
      `    <loc>${abs(e.path)}</loc>`,
      ...alts.map(([lang, path]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${abs(path)}"/>`),
      '  </url>',
    ].join('\n');
  };
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(url).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
