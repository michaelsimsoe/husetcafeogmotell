/**
 * Prefix a root-relative path with the deploy base (`base` in astro.config).
 * Locally the base is `/`; on GitHub Pages it is `/huset-konsepter/`.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${BASE}${path}`;
}
