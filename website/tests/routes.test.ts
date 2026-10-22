import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { defaultLocale, locales, toLocale } from '../src/i18n/locales.ts';
import { alternates, linkTo, pageAt, pageKeys, pathOf, registry, sitemapEntries, switchTargets } from '../src/i18n/routes.ts';

/** A site with a page that is only written in Norwegian, as articles may be. */
const fixture = registry({
  home: { paths: { nb: '/', en: '/en' } },
  contact: { paths: { nb: '/kontakt', en: '/en/contact' } },
  thanks: { paths: { nb: '/kontakt/takk', en: '/en/contact/thanks' }, noindex: true },
  article: { paths: { nb: '/artikler/korgen' } },
});

describe('the page registry', () => {
  it('has every page in Norwegian and the home page in every language, so fallbacks always land somewhere', () => {
    for (const page of pageKeys) assert.ok(pathOf(page, defaultLocale), page);
    for (const locale of locales) assert.ok(pathOf('home', locale), locale);
  });

  it('keeps the Norwegian URLs the site already has', () => {
    assert.equal(pathOf('home', 'nb'), '/');
    assert.equal(pathOf('menu', 'nb'), '/meny');
    assert.equal(pathOf('events', 'nb'), '/arrangementer');
    assert.equal(pathOf('contact', 'nb'), '/kontakt');
    assert.equal(pathOf('thanks', 'nb'), '/kontakt/takk');
    assert.equal(pathOf('credits', 'nb'), '/anerkjennelse');
    assert.equal(pathOf('privacy', 'nb'), '/privacy');
  });

  it('has every page on the site in English', () => {
    for (const page of pageKeys) assert.ok(pathOf(page, 'en'), page);
  });

  it('never gives two pages the same path', () => {
    const all = pageKeys.flatMap((page) => locales.map((l) => pathOf(page, l)).filter(Boolean));
    assert.equal(new Set(all).size, all.length);
  });

  it('puts English pages under /en', () => {
    for (const page of pageKeys) {
      const en = pathOf(page, 'en');
      if (en) assert.match(en, /^\/en(\/|$)/, page);
    }
  });
});

describe('linkTo', () => {
  it('links to the page in the same language when it exists', () => {
    assert.deepEqual(linkTo('contact', 'en'), { path: '/en/contact', fallback: false });
  });

  it('falls back to the Norwegian page, marked as Norwegian, when it does not', () => {
    assert.deepEqual(fixture.linkTo('article', 'en'), { path: '/artikler/korgen', hreflang: 'nb', fallback: true });
    assert.deepEqual(fixture.linkTo('article', 'nb'), { path: '/artikler/korgen', fallback: false });
  });
});

describe('switchTargets', () => {
  it('offers the same page in the other language', () => {
    assert.deepEqual(switchTargets('contact', 'nb'), [{ locale: 'en', path: '/en/contact', fallback: false }]);
    assert.deepEqual(switchTargets('contact', 'en'), [{ locale: 'nb', path: '/kontakt', fallback: false }]);
  });

  it('offers the home page in that language when the page is not translated, never a missing page', () => {
    assert.deepEqual(fixture.switchTargets('article', 'nb'), [{ locale: 'en', path: '/en', fallback: true }]);
  });

  it('never offers the language the page is already in', () => {
    for (const page of pageKeys) for (const l of locales) assert.ok(switchTargets(page, l).every((t) => t.locale !== l));
  });
});

describe('sitemapEntries', () => {
  const entries = sitemapEntries();

  it('lists every indexable page in every language it exists in', () => {
    assert.deepEqual(
      entries.map((e) => e.path),
      [
        ...['/', '/en', '/meny', '/en/menu', '/arrangementer', '/en/events', '/catering', '/en/catering'],
        ...['/kontakt', '/en/contact', '/anerkjennelse', '/en/credits', '/privacy', '/en/privacy'],
      ],
    );
  });

  it('leaves out the thank-you page', () => {
    assert.ok(!entries.some((e) => e.page === 'thanks'));
  });

  it('gives translated pages the same alternates on each side, and untranslated pages only themselves', () => {
    assert.deepEqual(entries.find((e) => e.path === '/en')?.alternates, alternates('home'));
    assert.deepEqual(entries.find((e) => e.path === '/')?.alternates, [
      { locale: 'nb', path: '/' },
      { locale: 'en', path: '/en' },
    ]);
    assert.deepEqual(entries.find((e) => e.path === '/en/menu')?.alternates, [
      { locale: 'nb', path: '/meny' },
      { locale: 'en', path: '/en/menu' },
    ]);
    assert.deepEqual(entries.find((e) => e.path === '/en/privacy')?.alternates, [
      { locale: 'nb', path: '/privacy' },
      { locale: 'en', path: '/en/privacy' },
    ]);
    assert.deepEqual(
      fixture.sitemapEntries().map((e) => [e.path, e.alternates]),
      [
        ['/', fixture.alternates('home')],
        ['/en', fixture.alternates('home')],
        ['/kontakt', fixture.alternates('contact')],
        ['/en/contact', fixture.alternates('contact')],
        ['/artikler/korgen', [{ locale: 'nb', path: '/artikler/korgen' }]],
      ],
    );
  });
});

describe('pageAt', () => {
  it('finds the page and language of a path, with or without a trailing slash', () => {
    assert.deepEqual(pageAt('/'), { page: 'home', locale: 'nb' });
    assert.deepEqual(pageAt('/en/'), { page: 'home', locale: 'en' });
    assert.deepEqual(pageAt('/en/contact/thanks'), { page: 'thanks', locale: 'en' });
    assert.deepEqual(fixture.pageAt('/artikler/korgen/'), { page: 'article', locale: 'nb' });
  });

  it('returns undefined for paths that are not pages', () => {
    assert.equal(pageAt('/en/meny'), undefined);
    assert.equal(pageAt('/404'), undefined);
  });
});

describe('toLocale', () => {
  it('reads known locales and treats anything else as Norwegian', () => {
    assert.equal(toLocale('en'), 'en');
    assert.equal(toLocale('nb'), 'nb');
    assert.equal(toLocale(undefined), 'nb');
    assert.equal(toLocale('de'), 'nb');
  });
});
