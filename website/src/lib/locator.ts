import map from '@data/norway-map.json';
import route from '@data/route-e6.json';

/** [km, roadZ, lon, lat, terrainZ] */
type Pt = [number, number, number, number, number];

const pts = route.points as Pt[];
const TOTAL = route.totalKm;
/** Top of the drawn height scale (m), a little above Korgfjellet. */
const Z_TOP = 660;
/** Profile user units per km. */
const U = 10;

const f = (n: number) => Math.round(n * 10) / 10;
const P = (km: number, z: number) => `${f(km * U)} ${f(Z_TOP - z)}`;

export const HUSET_KM = route.stops.find((s) => 'isHuset' in s && s.isHuset)!.km;

const zAt = (km: number) => {
  for (let k = 1; k < pts.length; k++) {
    const [ka, za] = pts[k - 1];
    const [kb, zb] = pts[k];
    if (km <= kb) return za + ((zb - za) * (km - ka)) / (kb - ka || 1);
  }
  return pts[pts.length - 1][1];
};

const line = (from: number, to: number) =>
  'M' +
  [
    P(from, zAt(from)),
    ...pts.filter((p) => p[0] > from && p[0] < to).map((p) => P(p[0], p[1])),
    P(to, zAt(to)),
  ].join('L');

const tunnels = route.tunnels.filter((t) => t.toKm - t.fromKm >= 0.25).sort((a, b) => a.fromKm - b.fromKm);
const korgfjell = route.tunnels.find((t) => t.name === 'Korgfjelltunnelen')!;

function runs() {
  const open: string[] = [];
  const tunnel: string[] = [];
  let at = 0;
  for (const t of tunnels) {
    if (t.fromKm > at) open.push(line(at, t.fromKm));
    tunnel.push(line(t.fromKm, t.toKm));
    at = t.toKm;
  }
  if (at < TOTAL) open.push(line(at, TOTAL));
  return { open: open.join(''), tunnel: tunnel.join('') };
}

const peak = pts.reduce((a, b) => (b[4] > a[4] ? b : a));
const pctX = (km: number) => f((km / TOTAL) * 100);
const pctY = (z: number) => f(((Z_TOP - z) / Z_TOP) * 100);

export const profile = {
  viewBox: `0 0 ${f(TOTAL * U)} ${Z_TOP}`,
  terrain: `M0 ${Z_TOP}L${pts.map((p) => P(p[0], p[4])).join('L')}L${f(TOTAL * U)} ${Z_TOP}Z`,
  ...runs(),
  y600: Z_TOP - 600,
  w: f(TOTAL * U),
  ticks: Array.from({ length: Math.floor(TOTAL / 10) + 1 }, (_, i) => i * 10),
  peak: { x: pctX(peak[0]), y: pctY(peak[4]) },
  tunnelAt: { x: pctX(korgfjell.fromKm), y: pctY(zAt(korgfjell.fromKm)) },
  huset: { x: pctX(HUSET_KM), y: pctY(zAt(HUSET_KM)) },
  pctX,
  /** The road, point for point with the map stretch, for the unroll. */
  road: pts.map((p) => P(p[0], p[1])).join(','),
};

const r = map.region;
const pct = (x: number, y: number) => ({ left: f(((x - r.x) / r.w) * 100), top: f(((y - r.y) / r.h) * 100) });

/** Fraction along the drawn road (by length) of the road point nearest (x, y). */
function atOnRoad(x: number, y: number) {
  const n = map.road.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  let len = 0;
  let best = Infinity;
  let bestLen = 0;
  for (let i = 0; i + 1 < n.length; i += 2) {
    if (i) len += Math.hypot(n[i] - n[i - 2], n[i + 1] - n[i - 1]);
    const d = Math.hypot(n[i] - x, n[i + 1] - y);
    if (d < best) [best, bestLen] = [d, len];
  }
  return Math.round((bestLen / len) * 1e4) / 1e4;
}
const moirana = map.cities.find((c) => c.id === 'moirana')!;

export const norway = {
  viewBox: `${r.x} ${r.y} ${r.w} ${r.h}`,
  full: `${map.full.x} ${map.full.y} ${map.full.w} ${map.full.h}`,
  aspect: `${r.w} / ${r.h}`,
  region: r,
  land: map.norway,
  neighbours: map.neighbours,
  inset: map.inset,
  road: map.road,
  stretch: 'M' + map.stretch.map(([x, y]) => `${x} ${y}`).join('L'),
  /** The stretch lights up when the drawn road reaches Mo i Rana. */
  stretchAt: moirana.at,
  stretchPts: map.stretch.map(([x, y]) => `${x} ${y}`).join(','),
  cities: map.cities.map((c) => ({ ...c, ...pct(c.x, c.y) })),
  e6Tag: { ...pct(map.e6Tag.x, map.e6Tag.y), at: atOnRoad(map.e6Tag.x, map.e6Tag.y) },
};

/** Driving distances to Huset, rounded the way a person would say them. */
export const distances = [
  { from: 'Trondheim', km: Math.round(map.legs.trondheim.km) },
  { from: 'Mosjøen', km: Math.round(HUSET_KM), min: route.durationsMin['Mosjøen'] },
  { from: 'Mo i Rana', km: Math.round(TOTAL - HUSET_KM), min: route.durationsMin['Mo i Rana'] },
  { from: 'Bodø', km: Math.round(map.legs.bodo.km) },
];

export const stretchKm = Math.round(TOTAL);
