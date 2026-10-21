import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

import { menuSchema, parseContent, siteSchema } from '../src/data/schema.ts';

const read = (file: string) => JSON.parse(readFileSync(new URL(`../src/content/${file}`, import.meta.url), 'utf8'));
const clone = <T>(v: T): T => structuredClone(v);

describe('the content files owners edit in Pages CMS', () => {
  it('site.json passes the schema', () => {
    assert.doesNotThrow(() => parseContent(siteSchema, read('site.json'), 'site.json'));
  });

  it('menu.json passes the schema', () => {
    assert.doesNotThrow(() => parseContent(menuSchema, read('menu.json'), 'menu.json'));
  });

  it('every menu section has a unique id and every allergen on a dish exists', () => {
    const menu = parseContent(menuSchema, read('menu.json'), 'menu.json');
    const codes = new Set(menu.allergens.map((a) => a.code));
    assert.equal(new Set(menu.sections.map((s) => s.id)).size, menu.sections.length);
    for (const s of menu.sections) for (const d of s.dishes) for (const c of d.allergens) assert.ok(codes.has(c), `${d.name}: ${c}`);
  });
});

describe('site schema', () => {
  it('rejects a time that is not TT:MM, and names the file in the error', () => {
    const site = read('site.json');
    site.hours.monday.open = '9.30';
    assert.throws(() => parseContent(siteSchema, site, 'site.json'), /Feil i site\.json[\s\S]*TT:MM/);
  });

  it('rejects closing before opening, unless the day is closed', () => {
    const site = read('site.json');
    site.hours.tuesday = { open: '21:00', close: '10:00', closed: false };
    assert.throws(() => parseContent(siteSchema, site, 'site.json'), /Stengetid/);
    site.hours.tuesday.closed = true;
    assert.doesNotThrow(() => parseContent(siteSchema, site, 'site.json'));
  });

  it('treats an empty or missing «closed» toggle as open', () => {
    const site = read('site.json');
    delete site.hours.wednesday.closed;
    site.hours.thursday.closed = null;
    const parsed = parseContent(siteSchema, site, 'site.json');
    assert.equal(parsed.hours.wednesday.closed, false);
    assert.equal(parsed.hours.thursday.closed, false);
  });

  it('turns empty optional CMS fields into undefined', () => {
    const site = read('site.json');
    site.venues.cakes = '';
    site.venues.extras = null;
    site.meetingRooms.rooms[0].equipment = '   ';
    site.meetingRooms.rooms[0].price = null;
    const parsed = parseContent(siteSchema, site, 'site.json');
    assert.equal(parsed.venues.cakes, undefined);
    assert.deepEqual(parsed.venues.extras, []);
    assert.equal(parsed.meetingRooms.rooms[0].equipment, undefined);
    assert.equal(parsed.meetingRooms.rooms[0].price, undefined);
  });

  it('rejects letters in the phone number', () => {
    const site = read('site.json');
    site.contact.phone = 'ring oss';
    assert.throws(() => parseContent(siteSchema, site, 'site.json'), /siffer/);
  });
});

describe('menu schema', () => {
  const base = read('menu.json');

  it('rejects a dish with neither a price nor priced variants', () => {
    const menu = clone(base);
    menu.sections[0].dishes[0] = { name: 'Uten pris', allergens: [] };
    assert.throws(() => parseContent(menuSchema, menu, 'menu.json'), /pris/);
  });

  it('accepts a dish priced only through variants, and drops an empty variant list', () => {
    const menu = clone(base);
    menu.sections[0].dishes[0] = { name: 'Pølse', variants: [{ label: 'Enkel', price: 135 }] };
    menu.sections[0].dishes[1] = { name: 'Brus', price: 45, variants: [] };
    const parsed = parseContent(menuSchema, menu, 'menu.json');
    assert.equal(parsed.sections[0].dishes[0].price, undefined);
    assert.equal(parsed.sections[0].dishes[1].variants, undefined);
  });

  it('rejects a section id used twice', () => {
    const menu = clone(base);
    menu.sections[1].id = menu.sections[0].id;
    assert.throws(() => parseContent(menuSchema, menu, 'menu.json'), /brukt to ganger/);
  });

  it('rejects an allergen that is not in the allergen list', () => {
    const menu = clone(base);
    menu.sections[0].dishes[0].allergens = ['99'];
    assert.throws(() => parseContent(menuSchema, menu, 'menu.json'), /Allergen 99 finnes ikke/);
  });

  it('sorts and de-duplicates allergens, and accepts numbers from the CMS', () => {
    const menu = clone(base);
    menu.sections[0].dishes[0].allergens = [4, '1', '4', 2];
    const parsed = parseContent(menuSchema, menu, 'menu.json');
    assert.deepEqual(parsed.sections[0].dishes[0].allergens, ['1', '2', '4']);
  });

  it('rejects a section id with spaces or capitals', () => {
    const menu = clone(base);
    menu.sections[0].id = 'Fra grillen';
    assert.throws(() => parseContent(menuSchema, menu, 'menu.json'), /små bokstaver/);
  });
});
