/**
 * Every tile, style and embed source the maps use, in one place. Swap a URL
 * here (for example to self-hosted OpenFreeMap tiles) and both the playground
 * and the production component follow.
 *
 * None of these need an API key or a billing account.
 */
import { withBase } from '@lib/base';

export type OfmStyleId = 'positron' | 'liberty' | 'fiord' | 'bright';

/** OpenFreeMap: free vector tiles (OpenMapTiles schema), no keys, no limits, no SLA. https://openfreemap.org */
export const OPENFREEMAP = {
  styleBase: 'https://tiles.openfreemap.org/styles/',
  /** TileJSON for the planet vector tiles; maxzoom 14, overzoomed above. */
  vectorSource: 'https://tiles.openfreemap.org/planet',
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
} as const;

export const OFM_STYLES: Record<OfmStyleId, { name: string; url: string; note: string }> = {
  positron: {
    name: 'Positron',
    url: `${OPENFREEMAP.styleBase}positron`,
    note: 'Lys og nøytral. Lite farge, få detaljer, vegnavn og stedsnavn i grått.',
  },
  liberty: {
    name: 'Liberty',
    url: `${OPENFREEMAP.styleBase}liberty`,
    note: 'Fullt kart i klassisk stil med bygninger, POI-ikoner og farget vegnett.',
  },
  fiord: {
    name: 'Fiord',
    url: `${OPENFREEMAP.styleBase}fiord`,
    note: 'Mørk blågrå. OpenFreeMap merker den som ikke ferdig.',
  },
  bright: {
    name: 'Bright',
    url: `${OPENFREEMAP.styleBase}bright`,
    note: 'Fargesterk OSM Bright med mange ikoner. Mest støy av de fire.',
  },
};

/** The self-hosted «Huset» style, derived from Positron. Relative URLs inside it resolve against this file. */
export const HUSET_STYLE_URL = withBase('/maps/huset-style.json');

/**
 * Standard OpenStreetMap raster tiles. Development and evaluation only: the
 * OSM Tile Usage Policy forbids heavy use and gives no service guarantee.
 * https://operations.osmfoundation.org/policies/tiles/
 */
export const OSM_RASTER = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  maxZoom: 19,
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-bidragsytere',
} as const;

/** openstreetmap.org's own embeddable map page. */
export const OSM_EMBED_URL = 'https://www.openstreetmap.org/export/embed.html';

export const OSM_COPYRIGHT_URL = 'https://www.openstreetmap.org/copyright';

/** Default framing in the 256 px raster convention: Leaflet z16 equals MapLibre z15. */
export const DEFAULT_RASTER_ZOOM = 16;
export const MIN_RASTER_ZOOM = 8;
export const MAX_RASTER_ZOOM = 19;

/** Give up and show the static fallback after this long without a rendered map. */
export const LOAD_TIMEOUT_MS = 15000;

/** A style URL that does not exist, used by «Simuler feil» so the real error path runs. */
export const BROKEN_STYLE_URL = withBase('/maps/finnes-ikke.json');
/** `.invalid` never resolves (RFC 2606), so every tile request fails fast. */
export const BROKEN_TILE_URL = 'https://tile.openstreetmap.invalid/{z}/{x}/{y}.png';
