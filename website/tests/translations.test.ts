import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

import { menuSchema, parseContent, venuesSchema } from '../src/data/schema.ts';
import { cmsTexts, coverage, createMemory, memoryKey, memorySchema, translate } from '../src/i18n/memory.ts';

const read = (file: string) => JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'));
const memory = createMemory([
  { nb: 'Biffburger', en: 'Beef burger' },
  { nb: 'med salat og chips', en: 'with salad and chips' },
]);

describe('the translation memory', () => {
  it('gives the translation in another language, and leaves Norwegian alone on Norwegian pages', () => {
    assert.deepEqual(translate(memory, 'Biffburger', 'en'), { text: 'Beef burger' });
    assert.deepEqual(translate(memory, 'Biffburger', 'nb'), { text: 'Biffburger' });
  });

  it('falls back to the Norwegian, marked as Norwegian, when there is no translation', () => {
    assert.deepEqual(translate(memory, 'Kebabtallerken', 'en'), { text: 'Kebabtallerken', lang: 'nb' });
    assert.deepEqual(translate(undefined, 'Biffburger', 'en'), { text: 'Biffburger', lang: 'nb' });
  });

  it('matches however the text is spaced, but not if the words or case change', () => {
    assert.equal(memoryKey('  med salat \n og  chips '), 'med salat og chips');
    assert.equal(translate(memory, 'med  salat og chips ', 'en').text, 'with salad and chips');
    assert.equal(translate(memory, 'Med salat og chips', 'en').lang, 'nb');
  });

  it('refuses the same Norwegian twice and empty entries', () => {
    assert.throws(() => memorySchema.parse([{ nb: 'Fisk', en: 'Fish' }, { nb: ' Fisk ', en: 'Seafood' }]));
    assert.throws(() => memorySchema.parse([{ nb: 'Fisk', en: '  ' }]));
  });

  it('reports what is missing once, and what is no longer used', () => {
    const texts = [
      { text: 'Biffburger', where: 'a' },
      { text: 'Kebabtallerken', where: 'b' },
      { text: 'Kebabtallerken', where: 'c' },
    ];
    const report = coverage(texts, memory);
    assert.deepEqual(report.missing, [{ text: 'Kebabtallerken', where: 'b' }]);
    assert.deepEqual(report.unused, ['med salat og chips']);
    assert.equal(report.total, 2);
  });
});

describe('the CMS text the memory has to cover', () => {
  const menu = parseContent(menuSchema, read('src/content/menu.json'), 'menu.json');
  const venues = parseContent(venuesSchema, read('src/content/venues.json'), 'venues.json');
  const texts = cmsTexts(menu, venues).map((t) => t.text);

  it('includes every dish, description, variant, section and allergen, even dishes switched off', () => {
    for (const s of menu.sections) {
      assert.ok(texts.includes(s.title), s.title);
      for (const d of s.dishes) {
        assert.ok(texts.includes(d.name), d.name);
        if (d.description) assert.ok(texts.includes(d.description), d.description);
        for (const v of d.variants ?? []) assert.ok(texts.includes(v.label), v.label);
      }
    }
    for (const a of menu.allergens) assert.ok(texts.includes(a.name), a.name);
  });

  it('includes the venue extras, cakes and meeting rooms', () => {
    for (const x of venues.extras) assert.ok(texts.includes(x), x);
    if (venues.cakes) assert.ok(texts.includes(venues.cakes));
    for (const m of venues.meetingRooms.rooms) assert.ok(texts.includes(m.name), m.name);
  });
});

describe('the English translation memory file', () => {
  it('src/i18n/memory/en.json is valid', () => {
    assert.doesNotThrow(() => parseContent(memorySchema, read('src/i18n/memory/en.json'), 'src/i18n/memory/en.json'));
  });
});
