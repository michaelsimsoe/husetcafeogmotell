/**
 * The MapLibre adapter is a dynamic `import()`, so its code (~450 kB gzip) is
 * only downloaded when a map is actually about to be shown.
 */
import { hasWebGL2 } from './view';
import type { AdapterLoader } from './types';

/** Checks WebGL2 first so browsers that cannot draw the map never download MapLibre. */
export const loadMapLibre: AdapterLoader = async () => {
  if (!hasWebGL2()) throw new Error('Nettleseren kan ikke tegne WebGL2-kart.');
  return import('./adapters/maplibre');
};