import type { APIRoute } from 'astro';
import { withBase } from '@lib/base';
import { indexable } from '@lib/env';

/** Public, indexable pages. Thank-you and 404 pages are left out on purpose. */
const pages = ['/', '/meny', '/kontakt', '/anerkjennelse', '/privacy'];

export const GET: APIRoute = ({ site }) => {
  const urls = indexable ? pages.map((p) => new URL(withBase(p), site).href) : [];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
