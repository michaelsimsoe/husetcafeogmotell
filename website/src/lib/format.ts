import ridges from '../data/ridges.json';
import { site } from '../data/site.ts';
import { location } from '../data/location.ts';

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

/** «Man–fre 10–21 · Lør 11–21 · Søn 13–19» */
export const groupsLine = site.hours.groups.map((g) => `${g.short} ${g.time}`).join(' · ');

/** «14:00» → «kl. 14.00» */
export const kl = (hhmm: string) => `kl. ${hhmm.replace(':', '.')}`;

/** «a», «a og b», «a, b og c» */
export const listJoin = (items: readonly string[]) =>
  items.length < 2 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} og ${items[items.length - 1]}`;

/** «Bryllup og julebord, konfirmasjon og dåp, minnestund og klassefest.» */
export function pairSentence(items: readonly string[]) {
  const pairs: string[] = [];
  for (let i = 0; i < items.length; i += 2) pairs.push(items.slice(i, i + 2).join(' og '));
  const s = pairs.join(', ');
  return s ? `${s[0].toUpperCase()}${s.slice(1)}.` : '';
}

const deg = (n: number) => n.toFixed(4).replace('.', ',');
/** The address point, written the Norwegian way: 66,0809° N, 13,8260° Ø */
export const coords = `${deg(site.place.geo.lat)}° N, ${deg(site.place.geo.lon)}° Ø`;

/** Spread onto a plain «Veibeskrivelse» link so the client can point it at the visitor's map app. */
export const directionsAttrs = {
  'data-directions': '',
  'data-lat': location.arrival.lat,
  'data-lon': location.arrival.lon,
  'data-label': location.name,
};
