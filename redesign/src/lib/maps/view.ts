/**
 * Framing maths shared by every implementation, so the marker lands in the
 * same place whichever renderer draws the map.
 *
 * Zoom is kept in the 256 px raster convention (OSM tiles, Leaflet, the
 * embed). MapLibre renders 512 px vector tiles, so the same ground scale is
 * one zoom level lower there.
 */
import type { LatLon } from './types';

const EARTH_CIRCUMFERENCE = 40075016.686;
const TILE = 256;

export function toMapLibreZoom(rasterZoom: number): number {
  return rasterZoom - 1;
}

export function fromMapLibreZoom(zoom: number): number {
  return zoom + 1;
}

/** Ground metres per CSS pixel at a latitude and raster zoom (Web Mercator). */
export function metresPerPixel(lat: number, rasterZoom: number): number {
  return (EARTH_CIRCUMFERENCE * Math.cos((lat * Math.PI) / 180)) / (TILE * 2 ** rasterZoom);
}

function project(p: LatLon, worldPx: number): { x: number; y: number } {
  const sin = Math.sin((p.lat * Math.PI) / 180);
  return {
    x: ((p.lon + 180) / 360) * worldPx,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * worldPx,
  };
}

function unproject(x: number, y: number, worldPx: number): LatLon {
  const lon = (x / worldPx) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / worldPx;
  const lat = (180 / Math.PI) * Math.atan(Math.sinh(n));
  return { lat, lon };
}

/**
 * The bounding box (west, south, east, north) a container of `width` × `height`
 * CSS pixels shows around `center` at a raster zoom. Shrunk a little so the
 * OSM embed, which fits the box, lands on the same zoom instead of one below.
 */
export function viewBounds(center: LatLon, rasterZoom: number, width: number, height: number, shrink = 0.96) {
  const world = TILE * 2 ** rasterZoom;
  const c = project(center, world);
  const hw = (width * shrink) / 2;
  const hh = (height * shrink) / 2;
  const sw = unproject(c.x - hw, c.y + hh, world);
  const ne = unproject(c.x + hw, c.y - hh, world);
  return { west: sw.lon, south: sw.lat, east: ne.lon, north: ne.lat };
}

const NICE = [5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 20000, 50000];

/** A round scale-bar length that fits within `maxPx`. */
export function scaleBar(lat: number, rasterZoom: number, maxPx = 120): { metres: number; px: number; label: string } {
  const mpp = metresPerPixel(lat, rasterZoom);
  let metres = NICE[0];
  for (const n of NICE) if (n / mpp <= maxPx) metres = n;
  const px = Math.round(metres / mpp);
  const label = metres >= 1000 ? `${(metres / 1000).toLocaleString('nb-NO')} km` : `${metres} m`;
  return { metres, px, label };
}

/** «66,0809° N · 13,8260° Ø» */
export function formatCoordinates(p: LatLon, digits = 4): string {
  const f = (n: number) => Math.abs(n).toLocaleString('nb-NO', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return `${f(p.lat)}° ${p.lat >= 0 ? 'N' : 'S'} · ${f(p.lon)}° ${p.lon >= 0 ? 'Ø' : 'V'}`;
}

export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isCoarsePointer(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
}

/** MapLibre 6 needs WebGL2. Checked before its ~450 kB are downloaded. */
export function hasWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}
