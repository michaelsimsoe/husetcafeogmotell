// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://www.husetmotell.no',
  base,
  trailingSlash: 'ignore',
  // meny.html, not meny/index.html: Netlify then serves /meny directly instead of redirecting to /meny/,
  // which keeps the canonical URLs (no trailing slash) and the served URLs the same.
  build: { format: 'file' },
  devToolbar: { enabled: false },
  // Norwegian at the root, English under /en/. Pages and their paths per language: src/i18n/routes.ts.
  i18n: {
    locales: ['nb', 'en'],
    defaultLocale: 'nb',
    routing: { prefixDefaultLocale: false },
  },
  // Old pages whose content now lives elsewhere: the rooms on the homepage, the services (premises and meeting rooms) in its gatherings section.
  redirects: {
    '/overnatting': '/#rom',
    '/tjenester': '/#selskap',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
