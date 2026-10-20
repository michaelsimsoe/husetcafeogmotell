/**
 * Adapter loaders. Each is a dynamic `import()`, so a renderer's code is only
 * downloaded when a map using it is actually shown.
 */
import { hasWebGL2 } from './view';
import type { AdapterLoader } from './types';

/** Checks WebGL2 first so browsers that cannot draw the map never download MapLibre. */
export const loadMapLibre: AdapterLoader = async () => {
  if (!hasWebGL2()) throw new Error('Nettleseren kan ikke tegne WebGL2-kart.');
  return import('./adapters/maplibre');
};

/** Development and evaluation only (OpenStreetMap's tile servers). */
export const loadLeaflet: AdapterLoader = () => import('./adapters/leaflet');

export const loadEmbed: AdapterLoader = () => import('./adapters/embed');
