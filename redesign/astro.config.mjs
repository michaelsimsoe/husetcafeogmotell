// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Preview deploys (GitHub Pages) set SITE_URL and BASE_PATH; local dev serves from /.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://www.husetmotell.no',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});

