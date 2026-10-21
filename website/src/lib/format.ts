import ridges from '../data/ridges.json';
import { hoursIn, site } from '../data/site.ts';
import { location } from '../data/location.ts';
import type { Locale } from '../i18n/locales.ts';

type Pt = [number, number];
const dome = ridges['korgen-dome'];
const points = dome.points as Pt[];

interface RidgeOpts {
  /** Crop of the traced skyline, in source x (0–1). */
  from?: number;
  to?: number;
  /** Where the cropped skyline sits across the rule (0–1); the rest is a level line. */
  start?: number;
  end?: number;
  mirror?: boolean;
  /** viewBox size. */
  w?: number;
  h?: number;
  pad?: number;
}

const fmt = (n: number) => n.toFixed(1).replace(/\.0$/, '');

/** Polyline path of the Korgen skyline, squeezed into a short band. */
export function ridgePath({ from = 0, to = 1, start = 0, end = 1, mirror = false, w = 1000, h = 100, pad = 3 }: RidgeOpts = {}) {
  const seg = points.filter(([x]) => x >= from - 1e-6 && x <= to + 1e-6);
  const ys = seg.map((p) => p[1]);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  let mapped: Pt[] = seg.map(([x, y]) => {
    let t = (x - from) / (to - from);
    if (mirror) t = 1 - t;
    return [(start + t * (end - start)) * w, pad + ((y - top) / (bottom - top)) * (h - 2 * pad)];
  });
  if (mirror) mapped = mapped.reverse();
  const out: Pt[] = [];
  if (mapped[0][0] > 0.5) out.push([0, mapped[0][1]]);
  out.push(...mapped);
  const last = mapped[mapped.length - 1];
  if (last[0] < w - 0.5) out.push([w, last[1]]);
  return 'M' + out.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join(' L');
}

/** The skyline in the coordinates of its source photograph (4:3), for drawing on top of it. */
export function ridgeOnPhoto(w = 1000, lift = 0) {
  const h = w / dome.aspect;
  return {
    viewBox: `0 0 ${w} ${fmt(h)}`,
    d: 'M' + points.map(([x, y]) => `${fmt(x * w)} ${fmt((y - lift) * h)}`).join(' L'),
  };
}

/** «Man–fre 10–21 · Lør 11–21 · Søn 13–19» / «Mon–Fri 10:00–21:00 · …» */
export const groupsLine = (locale: Locale = 'nb') =>
  hoursIn(locale).groups.map((g) => `${g.short} ${g.time}`).join(' · ');

/** «14:00» → «kl. 14.00», or «14:00» in English. */
export const kl = (hhmm: string, locale: Locale = 'nb') => (locale === 'en' ? hhmm : `kl. ${hhmm.replace(':', '.')}`);

/** «a», «a og b», «a, b og c» / «a, b and c» */
export const listJoin = (items: readonly string[], locale: Locale = 'nb') =>
  items.length < 2
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} ${locale === 'en' ? 'and' : 'og'} ${items[items.length - 1]}`;

/** The address point: 66,0809° N, 13,8260° Ø in Norwegian, 66.0809° N, 13.8260° E in English. */
export const coords = (locale: Locale = 'nb') => {
  const deg = (n: number) => (locale === 'en' ? n.toFixed(4) : n.toFixed(4).replace('.', ','));
  return `${deg(site.place.geo.lat)}° N, ${deg(site.place.geo.lon)}° ${locale === 'en' ? 'E' : 'Ø'}`;
};

/** Spread onto a plain «Veibeskrivelse» link so the client can point it at the visitor's map app. */
export const directionsAttrs = {
  'data-directions': '',
  'data-lat': location.arrival.lat,
  'data-lon': location.arrival.lon,
  'data-label': location.name,
};
