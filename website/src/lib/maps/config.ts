/**
 * Every tile and style source the map uses, in one place. Swap a URL here
 * (for example to self-hosted OpenFreeMap tiles) and the component follows.
 *
 * None of these need an API key or a billing account.
 */
import { withBase } from '@lib/base';

/** OpenFreeMap: free vector tiles (OpenMapTiles schema), no keys, no limits, no SLA. https://openfreemap.org */
export const OPENFREEMAP = {
  /** TileJSON for the planet vector tiles; maxzoom 14, overzoomed above. */
  vectorSource: 'https://tiles.openfreemap.org/planet',
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
} as const;

/**
 * The self-hosted Huset styles, derived from OpenFreeMap Positron. Relative
 * URLs inside them resolve against the style file. `spruce` is the same
 * layers with a dark palette; `tests/maps.test.ts` keeps the two in step.
 */
export const HUSET_STYLES = {
  light: withBase('/maps/huset-style.json'),
  spruce: withBase('/maps/huset-style-spruce.json'),
} as const;

export type MapTone = keyof typeof HUSET_STYLES;

export const HUSET_STYLE_URL = HUSET_STYLES.light;

/** Default framing in the 256 px raster convention: Leaflet z16 equals MapLibre z15. */
export const DEFAULT_RASTER_ZOOM = 16;
export const MIN_RASTER_ZOOM = 8;
export const MAX_RASTER_ZOOM = 19;

/** The glide-in starts this many zoom levels out, with Korgen and the E6 in view. */
export const INTRO_ZOOM_OUT = 2.75;
export const INTRO_MS = 2600;

/** Give up and show the static fallback after this long without a rendered map. */
export const LOAD_TIMEOUT_MS = 15000;
