/**
 * Builds public/maps/huset-style-spruce.json from huset-style.json: the same
 * sources, layers, filters and layout, with the spruce palette. Run it after
 * editing the light style:
 *
 *   npm run maps:spruce
 *
 * tests/maps.test.ts fails when the committed dark style is out of step.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HEX = /^#[0-9a-f]{6}$/i;

/**
 * Light colour → spruce colour. The ground is the site's spruce; forest sits
 * a step darker, open land a step lighter. Water is a deep river green with
 * the river token for streams. Roads turn into quiet lighter lines, and the
 * E6 keeps its warm sand so it still reads first. Labels use whitewash,
 * lichen and river-light on spruce halos, as text does on spruce sections.
 */
export const PALETTE = {
  // Ground and land cover
  '#f0f1ea': '#1e3a32', // background, other land cover
  '#dbe3d8': '#19322b', // wood
  '#e4e9de': '#213e35', // grass
  '#eceee4': '#223f37', // farmland
  '#e1e7e0': '#1c372f', // wetland
  '#e7e8e2': '#26423a', // rock, sand
  '#f7f8f6': '#2e4b42', // ice
  '#e1e7dd': '#1c3730', // cemetery, park
  '#e5e6e0': '#233f37', // industrial, commercial, retail, quarry
  '#e8eae4': '#213d35', // other land use
  // Water
  '#b8c9cb': '#163c3b', // water
  '#a5bbbe': '#2e6b5e', // waterway (river token)
  // Buildings, borders, rail, paths
  '#d6dcd7': '#2b4a41', // building
  '#bcc5bf': '#36574d', // building outline
  '#a9b3ad': '#4d6a60', // country border
  '#b7c0ba': '#46645a', // rail
  '#cdd4cf': '#3a584e', // path
  // Roads
  '#d3d9d4': '#172f28', // service and minor casing
  '#c4ccc6': '#172f28', // major casing
  '#ffffff': '#4f6e62', // service, minor and major roads
  '#a8968a': '#172f28', // E6 casing (tunnel casing: see LAYER_OVERRIDES)
  '#f4e6db': '#a8917f', // E6
  '#f6f7f3': '#1e3a32', // tunnel inner: hollow, the casing draws the tunnel
  // Labels
  '#18201d': '#f5f6f2', // villages and towns
  '#2e6b5e': '#8fc2b3', // water names (river-light)
  '#4a5651': '#b9c8c0', // roads, hamlets, regions (lichen)
  '#f5f6f2': '#1e3a32', // label halos
};

/** Where one light colour plays two roles, the layer decides. */
export const LAYER_OVERRIDES = {
  tunnel_casing: { 'line-color': '#8a7666' },
  road_shield_e: { 'text-color': '#f5f6f2' },
};

function swap(value, where) {
  if (typeof value === 'string' && HEX.test(value)) {
    const next = PALETTE[value.toLowerCase()];
    if (!next) throw new Error(`No spruce colour for ${value} (${where}). Add it to PALETTE.`);
    return next;
  }
  if (Array.isArray(value)) return value.map((v) => swap(v, where));
  return value;
}

/** Returns the spruce style for a light Huset style. Throws on a colour the palette does not cover. */
export function toSpruce(light) {
  const style = structuredClone(light);
  style.name = `${light.name} (gran)`;
  style.metadata = {
    ...light.metadata,
    'huset:description':
      'Mørk variant av Huset-stilen for granfargede seksjoner. Samme lag som huset-style.json; bygges av scripts/map-style-spruce.mjs.',
  };
  for (const layer of style.layers) {
    const overrides = LAYER_OVERRIDES[layer.id] ?? {};
    for (const [prop, value] of Object.entries(layer.paint ?? {})) {
      if (!prop.endsWith('color')) continue;
      layer.paint[prop] = overrides[prop] ?? swap(value, `${layer.id}.${prop}`);
    }
  }
  return style;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = new URL('../public/maps/', import.meta.url);
  const light = JSON.parse(readFileSync(new URL('huset-style.json', dir), 'utf8'));
  writeFileSync(new URL('huset-style-spruce.json', dir), `${JSON.stringify(toSpruce(light), null, 1)}\n`);
  console.log('Wrote public/maps/huset-style-spruce.json');
}
