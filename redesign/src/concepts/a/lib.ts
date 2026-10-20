import { withBase } from '@lib/base';
import ridges from '@data/ridges.json';
import { photo, statusLabel } from '@data/credits';
import { site } from '@data/site';
import { allergens, type AllergenId } from '@data/menu';

type Pt = [number, number];
const dome = ridges['korgen-dome'];
const points = dome.points as Pt[];

export const ridgeSource = dome.source;

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

/** Short visible credit: licensed photos get the full line, unclear ones their source plus «Rettigheter avklares». */
export function creditShort(id: string) {
  const p = photo(id);
  if (p.status === 'avklares') {
    const source = p.credit.split(' – ')[0];
    return `${source} · ${statusLabel.avklares}`;
  }
  const via = p.sourceUrl?.includes('wikimedia') ? ', Wikimedia Commons' : '';
  return `Foto: ${p.credit}${p.license ? `, ${p.license}` : ''}${via}`;
}

export const allergenText = (ids: readonly AllergenId[]) => ids.map((i) => allergens[i]).join(', ');

export const groupsLine = site.hours.groups.map((g) => `${g.short} ${g.open}–${g.close}`).join(' · ');

/** «14:00» → «kl. 14.00» */
export const kl = (hhmm: string) => `kl. ${hhmm.replace(':', '.')}`;

/** «10:00» → «10» (opening-hours style). */
export const hr = (hhmm: string) => {
  const [h, m] = hhmm.split(':');
  return m === '00' ? String(Number(h)) : `${Number(h)}.${m}`;
};

export const coords = '66,0808° N, 13,8257° Ø';

export const base = withBase('/concepts/a');
