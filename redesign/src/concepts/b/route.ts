import route from '@data/route-e6.json';

/** [km, roadZ, lon, lat, terrainZ] */
type Pt = [number, number, number, number, number];

export const points = route.points as Pt[];
export const TOTAL = route.totalKm;
/** Top of the drawn elevation scale (m). A little headroom above Korgfjellet. */
export const Z_TOP = 660;
/** SVG user units per km along the road. */
export const U = 10;
export const LEN = TOTAL * U;

export const huset = route.stops.find((s) => 'isHuset' in s && s.isHuset)!;
export const HUSET_KM = huset.km;

export const approaches = {
  sor: { from: 'Mosjøen', km: HUSET_KM, min: route.durationsMin['Mosjøen'], startKm: 0 },
  nord: {
    from: 'Mo i Rana',
    km: Math.round((TOTAL - HUSET_KM) * 10) / 10,
    min: route.durationsMin['Mo i Rana'],
    startKm: TOTAL,
  },
} as const;

/** Tunnels long enough to draw (zero-length entries are portals only). */
export const tunnels = route.tunnels
  .filter((t) => t.toKm - t.fromKm >= 0.25)
  .sort((a, b) => a.fromKm - b.fromKm);
export const korgfjell = route.tunnels.find((t) => t.name === 'Korgfjelltunnelen')!;

export const places = route.places;

export const zAt = (km: number, i: 1 | 4 = 1) => {
  if (km <= points[0][0]) return points[0][i];
  for (let k = 1; k < points.length; k++) {
    const a = points[k - 1];
    const b = points[k];
    if (km <= b[0]) {
      const t = (km - a[0]) / (b[0] - a[0] || 1);
      return a[i] + (b[i] - a[i]) * t;
    }
  }
  return points[points.length - 1][i];
};

const f = (n: number) => Math.round(n * 10) / 10;

/** Horizontal profile: x = km, y = height (up). */
const h = (km: number, z: number) => `${f(km * U)},${f(Z_TOP - z)}`;
/** Vertical strip: north (Mo i Rana) at the top, height grows to the right. */
const v = (km: number, z: number) => `${f(z)},${f((TOTAL - km) * U)}`;

type Mapper = typeof h;

function line(map: Mapper, from: number, to: number) {
  const pts = points.filter((p) => p[0] >= from && p[0] <= to);
  const head = map(from, zAt(from));
  const tail = map(to, zAt(to));
  return `M${head}L${pts.map((p) => map(p[0], p[1])).join('L')}L${tail}`;
}

function terrain(map: Mapper, closeA: string, closeB: string) {
  return `M${closeA}L${points.map((p) => map(p[0], p[4])).join('L')}L${closeB}Z`;
}

/** Split the road into open-air and tunnel runs. */
function roadRuns(map: Mapper) {
  const open: string[] = [];
  const tunnel: string[] = [];
  let cursor = 0;
  for (const t of tunnels) {
    if (t.fromKm > cursor) open.push(line(map, cursor, t.fromKm));
    tunnel.push(line(map, t.fromKm, t.toKm));
    cursor = t.toKm;
  }
  if (cursor < TOTAL) open.push(line(map, cursor, TOTAL));
  return { open: open.join(''), tunnel: tunnel.join('') };
}

export const horizontal = {
  viewBox: `0 0 ${f(LEN)} ${Z_TOP}`,
  terrain: terrain(h, `0,${Z_TOP}`, `${f(LEN)},${Z_TOP}`),
  ...roadRuns(h),
  sor: line(h, 0, HUSET_KM),
  nord: line(h, HUSET_KM, TOTAL),
};

export const vertical = {
  viewBox: `0 0 ${Z_TOP} ${f(LEN)}`,
  terrain: terrain(v, `0,${f(LEN)}`, `0,0`),
  ...roadRuns(v),
  sor: line(v, 0, HUSET_KM),
  nord: line(v, HUSET_KM, TOTAL),
};

/** Percent helpers for HTML overlays. */
export const pctKm = (km: number) => (km / TOTAL) * 100;
export const pctZ = (z: number) => (z / Z_TOP) * 100;

/** «47,7» */
export const dec = (n: number) => n.toLocaleString('nb-NO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

