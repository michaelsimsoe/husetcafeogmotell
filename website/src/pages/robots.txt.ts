import type { APIRoute } from 'astro';
import { withBase } from '@lib/base';
import { indexable } from '@lib/env';

// Previews and branch deploys stay out of search engines; only the production site is crawled.
export const GET: APIRoute = ({ site }) => {
  const body = indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL(withBase('/sitemap.xml'), site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
