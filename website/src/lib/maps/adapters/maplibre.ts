/**
 * MapLibre GL JS with OpenFreeMap vector tiles and a self-hosted Huset style.
 * Loaded on demand with `import()`; nothing here runs until a map is shown.
 */
import { Map as MlMap, Marker, Popup, setWorkerUrl, type StyleSpecification } from 'maplibre-gl';
import maplibreCss from 'maplibre-gl/dist/maplibre-gl.css?inline';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { INTRO_MS, INTRO_ZOOM_OUT, MAX_RASTER_ZOOM, MIN_RASTER_ZOOM } from '../config';
import { injectCss } from '../dom';
import { fromMapLibreZoom, hasWebGL2, prefersReducedMotion, toMapLibreZoom } from '../view';
import type { AdapterContext, AdapterHandle } from '../types';

setWorkerUrl(workerUrl);

/** Room the popup keeps from the frame edges; the right side clears the zoom buttons. */
const POPUP_PAD = { top: 8, right: 64, bottom: 8, left: 8 };
/** The popup's bottom edge meets the top of the marker's stem. */
const POPUP_OFFSET: [number, number] = [0, -36];

const ABSOLUTE = /^[a-z][a-z\d+.-]*:/i;

/** Resolves a style's relative URLs against the style file, keeping `{z}`-style templates intact. */
function resolveAgainst(base: string, value: string): string {
  if (ABSOLUTE.test(value)) return value;
  return new URL(value, base).href.replace(/%7B/gi, '{').replace(/%7D/gi, '}');
}

/**
 * MapLibre resolves relative URLs in a style against the page, not the style
 * file, which breaks under a deploy base path. Same-origin styles are fetched
 * here and their sprite, glyph and source URLs made absolute first.
 */
async function loadStyle(url: string): Promise<string | StyleSpecification> {
  const abs = new URL(url, location.href);
  if (abs.origin !== location.origin) return abs.href;
  const res = await fetch(abs.href);
  if (!res.ok) throw new Error(`Kartstilen svarte ${res.status}.`);
  const style = (await res.json()) as StyleSpecification;
  const base = abs.href;
  if (typeof style.sprite === 'string') style.sprite = resolveAgainst(base, style.sprite);
  else if (Array.isArray(style.sprite)) style.sprite = style.sprite.map((s) => ({ ...s, url: resolveAgainst(base, s.url) }));
  if (style.glyphs) style.glyphs = resolveAgainst(base, style.glyphs);
  for (const source of Object.values(style.sources)) {
    const s = source as { url?: string; tiles?: string[] };
    if (s.url) s.url = resolveAgainst(base, s.url);
    if (s.tiles) s.tiles = s.tiles.map((t) => resolveAgainst(base, t));
  }
  return style;
}

export async function mount(ctx: AdapterContext): Promise<AdapterHandle> {
  if (!hasWebGL2()) throw new Error('Nettleseren kan ikke tegne WebGL2-kart.');
  if (!ctx.styleUrl) throw new Error('Ingen kartstil er valgt.');
  injectCss('maplibre', maplibreCss);

  const style = await loadStyle(ctx.styleUrl);

  const { marker: point } = ctx.place;
  const center: [number, number] = [point.lon, point.lat];
  const homeZoom = toMapLibreZoom(ctx.rasterZoom);
  const reduced = prefersReducedMotion();
  const cooperative = ctx.gestures === 'cooperative';
  // The intro opens wider, with Korgen, the river and the E6 in view, and waits for `glideIn()`.
  let pendingIntro = ctx.intro && !reduced;
  const startZoom = pendingIntro ? homeZoom - INTRO_ZOOM_OUT : homeZoom;

  let map: MlMap;
  try {
    map = new MlMap({
      container: ctx.host,
      style,
      center,
      zoom: startZoom,
      minZoom: toMapLibreZoom(MIN_RASTER_ZOOM),
      maxZoom: toMapLibreZoom(MAX_RASTER_ZOOM),
      maxPitch: 0,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      rollEnabled: false,
      cooperativeGestures: cooperative,
      attributionControl: { compact: false },
      maplibreLogo: false,
      fadeDuration: reduced ? 0 : 300,
      locale: {
        'Map.Title': ctx.title,
        'Marker.Title': ctx.place.name,
        'Popup.Close': 'Lukk',
        'AttributionControl.ToggleAttribution': 'Vis eller skjul kreditering',
        'AttributionControl.MapFeedback': 'Meld fra om feil i kartet',
        'CooperativeGesturesHandler.WindowsHelpText': 'Hold Ctrl og rull for å zoome',
        'CooperativeGesturesHandler.MacHelpText': 'Hold ⌘ og rull for å zoome',
        'CooperativeGesturesHandler.MobileHelpText': 'Bruk to fingre for å flytte kartet',
      },
    });
  } catch (err) {
    throw new Error(err instanceof Error ? `Kartet kunne ikke starte: ${err.message}` : 'Kartet kunne ikke starte.');
  }
  map.touchZoomRotate.disableRotation();
  map.keyboard.disableRotation();

  const marker = new Marker({ element: ctx.marker, anchor: 'center' }).setLngLat(center).addTo(map);
  let popup: Popup | null = null;
  let removed = false;

  // Ready on the first idle; a style, sprite or TileJSON error before that is fatal,
  // and so is a load where every tile failed.
  let awaiting = true;
  let tileErrors = 0;
  let tileLoads = 0;

  map.on('error', (e) => {
    if ((e as { tile?: unknown }).tile) {
      tileErrors++;
      return;
    }
    if (awaiting) ctx.fail(e.error?.message ? `Kartstilen kunne ikke lastes: ${e.error.message}` : 'Kartstilen kunne ikke lastes.');
  });
  map.on('sourcedata', (e) => {
    if ((e as { tile?: unknown }).tile) tileLoads++;
  });
  map.on('idle', () => {
    if (!awaiting) return;
    if (tileErrors > 0 && tileLoads === 0) {
      ctx.fail('Ingen kartfliser kunne lastes.');
      return;
    }
    awaiting = false;
    ctx.ready();
  });

  const report = () => ctx.viewChanged(fromMapLibreZoom(map.getZoom()), map.getCenter().lat);
  map.on('load', report);
  map.on('moveend', report);

  map.on('click', (e) => {
    const target = e.originalEvent.target as Node | null;
    if (target && (ctx.marker.contains(target) || popup?.getElement()?.contains(target))) return;
    ctx.mapClick();
  });
  map.on('cooperativegestureprevented', (e) => ctx.hint(e.gestureType === 'wheel_zoom' ? 'wheel' : 'touch'));
  // Once the visitor moves the map themselves, the intro never takes over.
  map.on('movestart', (e) => {
    if ((e as { originalEvent?: unknown }).originalEvent) pendingIntro = false;
  });

  const duration = (ms: number) => (reduced ? 0 : ms);
  /** Exponential ease-out: most of the distance early, a long soft landing on the house. */
  const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

  /** Pans just enough to bring the whole popup into view. */
  const keepPopupInView = () => {
    const el = popup?.getElement();
    if (!el) return;
    const box = map.getContainer().getBoundingClientRect();
    const r = el.getBoundingClientRect();
    let dx = 0;
    let dy = 0;
    if (r.top < box.top + POPUP_PAD.top) dy = r.top - (box.top + POPUP_PAD.top);
    else if (r.bottom > box.bottom - POPUP_PAD.bottom) dy = r.bottom - (box.bottom - POPUP_PAD.bottom);
    if (r.left < box.left + POPUP_PAD.left) dx = r.left - (box.left + POPUP_PAD.left);
    else if (r.right > box.right - POPUP_PAD.right) dx = r.right - (box.right - POPUP_PAD.right);
    if (dx || dy) map.panBy([dx, dy], { duration: duration(300) });
  };

  const handlers = () => [map.dragPan, map.scrollZoom, map.touchZoomRotate, map.doubleClickZoom, map.boxZoom];

  return {
    supportsMarker: true,
    supportsCooperative: true,
    zoomBy(delta) {
      pendingIntro = false;
      map.zoomTo(map.getZoom() + delta, { duration: duration(250) });
    },
    reset() {
      pendingIntro = false;
      map.easeTo({ center, zoom: homeZoom, bearing: 0, pitch: 0, duration: duration(400) });
    },
    glideIn() {
      if (!pendingIntro || removed) return;
      pendingIntro = false;
      map.easeTo({ center, zoom: homeZoom, duration: INTRO_MS, easing: easeOutExpo });
    },
    setInteractive(on) {
      for (const h of handlers()) (on ? h.enable() : h.disable());
      if (on) map.touchZoomRotate.disableRotation();
    },
    showPopup(content) {
      popup?.remove();
      popup = new Popup({
        closeButton: false,
        closeOnClick: false,
        closeOnMove: false,
        focusAfterOpen: false,
        anchor: 'bottom',
        offset: POPUP_OFFSET,
        maxWidth: 'none',
        className: 'hm-popup',
      })
        .setLngLat(center)
        .setDOMContent(content)
        .addTo(map);
      requestAnimationFrame(keepPopupInView);
    },
    hidePopup() {
      popup?.remove();
      popup = null;
    },
    destroy() {
      removed = true;
      popup?.remove();
      popup = null;
      marker.remove();
      map.remove();
    },
  };
}
