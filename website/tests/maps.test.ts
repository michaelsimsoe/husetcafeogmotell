import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

import { toSpruce } from '../scripts/map-style-spruce.mjs';

type Layer = { id: string; type: string; source?: string; 'source-layer'?: string; paint?: Record<string, unknown> };
type Style = { version: number; sources: object; sprite: string; glyphs: string; layers: Layer[] };

const read = (file: string): Style => JSON.parse(readFileSync(new URL(`../public/maps/${file}`, import.meta.url), 'utf8'));
const light = read('huset-style.json');
const spruce = read('huset-style-spruce.json');

const colours = (style: Style) => {
  const out = new Set<string>();
  const walk = (v: unknown): void => {
    if (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v)) out.add(v.toLowerCase());
    else if (Array.isArray(v)) v.forEach(walk);
  };
  for (const l of style.layers) for (const [k, v] of Object.entries(l.paint ?? {})) if (k.endsWith('color')) walk(v);
  return out;
};

describe('the Huset map styles', () => {
  it('the committed spruce style is what the generator builds from the light style', () => {
    assert.deepEqual(spruce, JSON.parse(JSON.stringify(toSpruce(light))), 'Run `npm run maps:spruce` and commit the result.');
  });

  it('both styles draw the same layers from the same sources', () => {
    const shape = (s: Style) => s.layers.map((l) => [l.id, l.type, l.source, l['source-layer']]);
    assert.deepEqual(shape(spruce), shape(light));
    assert.deepEqual(spruce.sources, light.sources);
    assert.equal(spruce.sprite, light.sprite);
    assert.equal(spruce.glyphs, light.glyphs);
  });

  it('the spruce style keeps none of the light ground colours', () => {
    const lightOnly = [...colours(light)].filter((c) => !['#2e6b5e', '#f5f6f2'].includes(c));
    const dark = colours(spruce);
    for (const c of lightOnly) assert.ok(!dark.has(c), `${c} is still in the spruce style`);
  });
});
