/**
 * Checks the built site in dist/ against the page registry (src/i18n/routes.ts).
 * Run after `npm run build`:  npm run verify
 *
 * - every page in the registry was built, in every language it lists, and nothing else was
 * - each page says its own language in <html lang> and points its canonical at itself
 * - hreflang links only name pages that exist, and every page in a set names the same set
 * - links inside the site lead to a page that exists, and to an id on it when they carry a #hash
 * - a link marked with hreflang (the language switcher, «på norsk» links) lands on a page in that language
 * - the sitemap only lists pages that exist
 *
 * Exits with code 1 and a list of problems if anything is off.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { localeInfo, locales } from '../src/i18n/locales.ts';
import { pageAt, pageKeys, pathOf } from '../src/i18n/routes.ts';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const base = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
const problems: string[] = [];
const fail = (where: string, what: string) => problems.push(`${where}: ${what}`);

if (!existsSync(dist)) {
  console.error('dist/ is missing. Run `npm run build` first.');
  process.exit(1);
}

const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? files(join(dir, d.name)) : [join(dir, d.name)]));

/** dist/en/contact.html → /en/contact, dist/index.html → / */
const urlPathOf = (file: string) => {
  const rel = relative(dist, file).split(sep).join('/').replace(/\.html$/, '');
  return rel === 'index' ? '/' : `/${rel.replace(/\/index$/, '')}`;
};

/** The built file a site path is served from, or undefined. Mirrors build.format 'file' on Netlify. */
const fileFor = (path: string): string | undefined => {
  const p = decodeURIComponent(path).replace(/^\/+/, '');
  const candidates = p === '' ? ['index.html'] : p.endsWith('/') ? [`${p}index.html`] : [p, `${p}.html`, `${p}/index.html`];
  return candidates.map((c) => join(dist, c)).find((c) => existsSync(c) && statSync(c).isFile());
};

const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

type Attrs = Record<string, string>;
const tags = (html: string, name: string): Attrs[] =>
  [...html.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'gi'))].map((m) =>
    Object.fromEntries([...m[1].matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map((a) => [a[1].toLowerCase(), decode(a[2] ?? '')])),
  );

interface Page {
  file: string;
  path: string;
  html: string;
  lang: string | undefined;
  canonical: string | undefined;
  hreflang: Map<string, string>;
  ids: Set<string>;
  redirect: boolean;
}

/** Site-relative path for an href on this site, without the deploy base; undefined for other sites. */
let origin: string | undefined;
const local = (href: string, from: string): { path: string; hash: string } | undefined => {
  if (/^(mailto|tel|sms|geo|data|javascript):/i.test(href)) return undefined;
  const url = new URL(href, new URL(from, origin ?? 'https://site.invalid'));
  if (origin && url.origin !== origin) return undefined;
  if (!origin && url.origin !== 'https://site.invalid') return undefined;
  let path = url.pathname;
  if (path.startsWith(base)) path = `/${path.slice(base.length)}`;
  return { path, hash: url.hash.slice(1) };
};

const pages = new Map<string, Page>();
for (const file of files(dist).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  const path = urlPathOf(file);
  const links = tags(html, 'link');
  pages.set(path, {
    file,
    path,
    html,
    lang: tags(html, 'html')[0]?.lang,
    canonical: links.find((l) => l.rel === 'canonical')?.href,
    hreflang: new Map(links.filter((l) => l.rel === 'alternate' && l.hreflang).map((l) => [l.hreflang, l.href])),
    ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => decode(m[1]))),
    redirect: /<meta http-equiv="refresh"/i.test(html),
  });
}

origin = [...pages.values()].map((p) => p.canonical).find(Boolean)?.match(/^https?:\/\/[^/]+/)?.[0];
const langs = new Set(locales.map((l) => localeInfo[l].lang));
const canonicalPath = (href: string) => local(href, '/')?.path;

// The registry and the build agree.
for (const page of pageKeys) {
  for (const locale of locales) {
    const path = pathOf(page, locale);
    if (path === undefined) continue;
    const built = pages.get(path);
    if (!built) fail(path, `«${page}» (${locale}) is in the registry but was not built`);
    else if (built.lang !== localeInfo[locale].lang) fail(path, `<html lang="${built.lang}">, expected "${localeInfo[locale].lang}"`);
  }
}

for (const p of pages.values()) {
  if (p.redirect) continue;
  const at = pageAt(p.path);
  if (!at && p.path !== '/404') fail(p.path, 'built but missing from src/i18n/routes.ts');

  if (!p.lang || !langs.has(p.lang)) fail(p.path, `<html lang="${p.lang ?? ''}"> is not one of ${[...langs].join(', ')}`);

  if (!p.canonical) fail(p.path, 'no canonical link');
  else if (canonicalPath(p.canonical) !== p.path) fail(p.path, `canonical points at ${p.canonical}`);

  // hreflang: own entry, existing targets, x-default, and the same set on every page in it.
  if (p.hreflang.size > 0) {
    const own = p.hreflang.get(p.lang ?? '');
    if (!own || canonicalPath(own) !== p.path) fail(p.path, `hreflang="${p.lang}" does not point at the page itself`);
    if (!p.hreflang.has('x-default')) fail(p.path, 'hreflang set without x-default');
    for (const [lang, href] of p.hreflang) {
      const target = pages.get(canonicalPath(href) ?? '');
      if (!target) {
        fail(p.path, `hreflang="${lang}" points at ${href}, which was not built`);
        continue;
      }
      if (lang !== 'x-default' && target.lang !== lang) fail(p.path, `hreflang="${lang}" points at a page in "${target.lang}"`);
      const mine = [...p.hreflang].map(([l, h]) => `${l} ${canonicalPath(h)}`).sort().join(', ');
      const theirs = [...target.hreflang].map(([l, h]) => `${l} ${canonicalPath(h)}`).sort().join(', ');
      if (mine !== theirs) fail(p.path, `hreflang set differs from the one on ${target.path} (${mine} ≠ ${theirs})`);
    }
  }
}

// Links inside the site.
for (const p of pages.values()) {
  for (const a of tags(p.html, 'a')) {
    if (a.href === undefined) continue;
    const to = local(a.href, p.path);
    if (!to) continue;
    const file = fileFor(to.path);
    if (!file) {
      fail(p.path, `link to ${a.href} leads nowhere`);
      continue;
    }
    const target = pages.get(urlPathOf(file));
    if (!target) continue;
    if (to.hash && !target.ids.has(to.hash)) fail(p.path, `link to ${a.href}: no id="${to.hash}" on ${target.path}`);
    if (a.hreflang && target.lang !== a.hreflang) fail(p.path, `link to ${a.href} says hreflang="${a.hreflang}" but the page is "${target.lang}"`);
  }
  for (const l of tags(p.html, 'link').filter((l) => ['stylesheet', 'icon', 'preload', 'manifest'].includes(l.rel))) {
    const to = local(l.href, p.path);
    if (to && !fileFor(to.path)) fail(p.path, `<link rel="${l.rel}"> to ${l.href} leads nowhere`);
  }
}

// The sitemap, when it lists anything (only on the production build).
const sitemap = join(dist, 'sitemap.xml');
if (existsSync(sitemap)) {
  for (const m of readFileSync(sitemap, 'utf8').matchAll(/(?:<loc>|href=")([^<"]+)/g)) {
    const path = canonicalPath(decode(m[1]));
    const target = pages.get(path ?? '');
    if (!target || target.redirect) fail('sitemap.xml', `${m[1]} is not a built page`);
  }
}

const built = [...pages.values()].filter((p) => !p.redirect).length;
if (problems.length > 0) {
  console.error(`${problems.length} problem(s) in the built site:\n`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`dist/ looks right: ${built} pages in ${locales.length} languages, links, canonicals and hreflang all check out.`);
