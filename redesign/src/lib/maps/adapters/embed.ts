/**
 * Adapter D: openstreetmap.org's own embeddable map in an iframe.
 *
 * The least work and no JavaScript library, but the marker is OSM's default
 * pin (no branding, no popup), the iframe cannot do cooperative gestures, and
 * a blocked or failing iframe cannot be detected reliably (it fires `load`
 * either way). The frame therefore keeps it locked behind a shield until it is
 * activated, and falls back only on its own timeout.
 */
import { MAX_RASTER_ZOOM, MIN_RASTER_ZOOM, OSM_EMBED_URL } from '../config';
import { viewBounds } from '../view';
import type { AdapterContext, AdapterHandle } from '../types';

/** `.invalid` never resolves, so the iframe shows the browser's own error page. */
const BROKEN_EMBED_URL = 'https://www.openstreetmap.invalid/export/embed.html';
const SIMULATED_FAIL_MS = 2500;

export function embedUrl(ctx: Pick<AdapterContext, 'place'>, rasterZoom: number, width: number, height: number, base = OSM_EMBED_URL): string {
  const { marker } = ctx.place;
  const b = viewBounds(marker, rasterZoom, width, height);
  const bbox = [b.west, b.south, b.east, b.north].map((n) => n.toFixed(6)).join(',');
  return `${base}?bbox=${bbox}&layer=mapnik&marker=${marker.lat.toFixed(6)},${marker.lon.toFixed(6)}`;
}

export async function mount(ctx: AdapterContext): Promise<AdapterHandle> {
  const { host } = ctx;
  let zoom = ctx.rasterZoom;
  let active = false;
  let size = { w: 0, h: 0 };
  let failTimer = 0;
  let resizeTimer = 0;

  const iframe = document.createElement('iframe');
  iframe.className = 'hm-embed';
  iframe.title = ctx.title;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  // No `allow-same-origin`: the embed runs in an opaque origin and cannot navigate this page.
  iframe.setAttribute('sandbox', 'allow-scripts allow-popups allow-popups-to-escape-sandbox');

  // Until the map is activated, a transparent shield takes taps and wheel events so the page scrolls.
  const shield = document.createElement('div');
  shield.className = 'hm-shield';
  shield.setAttribute('aria-hidden', 'true');
  shield.addEventListener('click', () => ctx.mapClick());

  const measure = () => {
    const r = host.getBoundingClientRect();
    return { w: Math.round(r.width) || 640, h: Math.round(r.height) || 420 };
  };
  const update = () => {
    size = measure();
    iframe.src = embedUrl(ctx, zoom, size.w, size.h, ctx.simulateFailure ? BROKEN_EMBED_URL : OSM_EMBED_URL);
    ctx.viewChanged(zoom, ctx.place.marker.lat);
  };

  if (ctx.simulateFailure) {
    failTimer = window.setTimeout(() => ctx.fail('Det innebygde kartet svarte ikke (simulert).'), SIMULATED_FAIL_MS);
  } else {
    iframe.addEventListener('load', () => ctx.ready(), { once: true });
  }

  host.append(iframe, shield);
  update();

  // Re-frame after layout changes, but never while someone is using the map.
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const next = measure();
      if (!active && (Math.abs(next.w - size.w) > 24 || Math.abs(next.h - size.h) > 24)) update();
    }, 300);
  });
  ro.observe(host);

  return {
    supportsMarker: false,
    supportsCooperative: false,
    zoomBy(delta) {
      zoom = Math.min(MAX_RASTER_ZOOM, Math.max(MIN_RASTER_ZOOM, zoom + delta));
      update();
    },
    reset() {
      zoom = ctx.rasterZoom;
      update();
    },
    setInteractive(on) {
      active = on;
      shield.hidden = on;
    },
    showPopup() {},
    hidePopup() {},
    destroy() {
      clearTimeout(failTimer);
      clearTimeout(resizeTimer);
      ro.disconnect();
      iframe.src = 'about:blank';
      iframe.remove();
      shield.remove();
    },
  };
}
