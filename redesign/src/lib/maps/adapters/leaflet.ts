/**
 * Adapter B: Leaflet with standard OpenStreetMap raster tiles.
 *
 * For development and evaluation only. The OSM Tile Usage Policy allows light
 * use with clear attribution but gives no guarantee and forbids heavy or bulk
 * use, so this is not a production option. No custom headers are sent.
 */
import leafletCss from 'leaflet/dist/leaflet.css?inline';
import { BROKEN_TILE_URL, MIN_RASTER_ZOOM, OSM_RASTER } from '../config';
import { injectCss } from '../dom';
import { isCoarsePointer, prefersReducedMotion } from '../view';
import type { AdapterContext, AdapterHandle } from '../types';

type Leaflet = typeof import('leaflet');

async function loadLeaflet(): Promise<Leaflet> {
  // Leaflet 1.9 ships UMD only; the bundler exposes it as the default export.
  const mod = (await import('leaflet')) as Leaflet & { default?: Leaflet };
  return mod.default ?? mod;
}

export async function mount(ctx: AdapterContext): Promise<AdapterHandle> {
  const L = await loadLeaflet();
  injectCss('leaflet', leafletCss);
  const { host } = ctx;
  const { lat, lon } = ctx.place.marker;
  const reduced = prefersReducedMotion();
  const cooperative = ctx.gestures === 'cooperative';
  const coarse = isCoarsePointer();
  const events = new AbortController();
  const hostClass = host.className;

  const map = L.map(host, {
    center: [lat, lon],
    zoom: ctx.rasterZoom,
    minZoom: MIN_RASTER_ZOOM,
    maxZoom: OSM_RASTER.maxZoom,
    zoomControl: false,
    // One finger scrolls the page on touch screens; two fingers pan and zoom (Leaflet's pinch follows the midpoint).
    dragging: !(cooperative && coarse),
    zoomAnimation: !reduced,
    fadeAnimation: !reduced,
    markerZoomAnimation: !reduced,
  });
  map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
  host.setAttribute('role', 'region');
  host.setAttribute('aria-label', ctx.title);

  const layer = L.tileLayer(ctx.simulateFailure ? BROKEN_TILE_URL : OSM_RASTER.url, {
    maxZoom: OSM_RASTER.maxZoom,
    attribution: OSM_RASTER.attribution,
  }).addTo(map);

  let awaiting = true;
  let loads = 0;
  let errors = 0;
  layer.on('tileload', () => loads++);
  layer.on('tileerror', () => errors++);
  layer.on('load', () => {
    if (!awaiting) return;
    if (errors > 0 && loads === 0) {
      awaiting = false;
      // Leaflet keeps using the map after firing `load`, so tear it down on the next task.
      window.setTimeout(() => ctx.fail('Ingen kartfliser kunne lastes.'), 0);
      return;
    }
    awaiting = false;
    ctx.ready();
  });

  const icon = L.divIcon({ html: ctx.marker, className: 'hm-leaflet-icon', iconSize: [44, 44], iconAnchor: [22, 22] });
  const marker = L.marker([lat, lon], { icon, interactive: false, keyboard: false }).addTo(map);
  L.DomEvent.disableClickPropagation(ctx.marker);

  let popup: ReturnType<typeof L.popup> | null = null;

  const report = () => ctx.viewChanged(map.getZoom(), map.getCenter().lat);
  map.on('moveend', report);
  report();
  map.on('click', () => ctx.mapClick());

  if (cooperative) {
    // Leaflet has no cooperative gestures. Plain wheel events are stopped before Leaflet sees them,
    // so the page scrolls; with Ctrl or ⌘ held they reach Leaflet and zoom.
    host.addEventListener(
      'wheel',
      (e) => {
        if (e.ctrlKey || e.metaKey) return;
        e.stopPropagation();
        ctx.hint('wheel');
      },
      { capture: true, passive: true, signal: events.signal },
    );
    if (coarse) {
      host.addEventListener('touchmove', (e) => e.touches.length === 1 && ctx.hint('touch'), {
        passive: true,
        signal: events.signal,
      });
    }
  }

  const ro = new ResizeObserver(() => map.invalidateSize({ animate: false }));
  ro.observe(host);

  const handlers = () => [map.dragging, map.touchZoom, map.scrollWheelZoom, map.doubleClickZoom, map.boxZoom];

  return {
    supportsMarker: true,
    supportsCooperative: true,
    zoomBy(delta) {
      map.setZoom(map.getZoom() + delta, { animate: !reduced });
    },
    reset() {
      map.setView([lat, lon], ctx.rasterZoom, { animate: !reduced });
    },
    setInteractive(on) {
      for (const h of handlers()) (on ? h.enable() : h.disable());
    },
    showPopup(content) {
      popup?.remove();
      popup = L.popup({
        closeButton: false,
        autoClose: false,
        closeOnClick: false,
        closeOnEscapeKey: false,
        autoPan: true,
        autoPanPaddingTopLeft: [8, 8],
        autoPanPaddingBottomRight: [64, 8],
        offset: [0, -36],
        minWidth: 0,
        maxWidth: 480,
        className: 'hm-popup',
      })
        .setLatLng([lat, lon])
        .setContent(content)
        .openOn(map);
    },
    hidePopup() {
      popup?.remove();
      popup = null;
    },
    destroy() {
      events.abort();
      ro.disconnect();
      popup?.remove();
      popup = null;
      marker.remove();
      map.remove();
      host.className = hostClass;
      for (const attr of ['role', 'aria-label', 'tabindex', 'style']) host.removeAttribute(attr);
      host.replaceChildren();
    },
  };
}
