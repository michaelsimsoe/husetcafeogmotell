import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

import { contentFiles, describePath, hoursSchema, menuSchema, noticeSchema, parseContent, venuesSchema } from '../src/data/schema.ts';
import { activeNotice, osloToday } from '../src/lib/notice.ts';

const read = (file: string) => JSON.parse(readFileSync(new URL(`../src/content/${file}`, import.meta.url), 'utf8'));
const clone = <T>(v: T): T => structuredClone(v);

describe('the content files owners edit in Pages CMS', () => {
  for (const [file, schema] of Object.entries(contentFiles)) {
    it(`${file} passes its schema`, () => {
      const raw = JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'));
      assert.doesNotThrow(() => parseContent(schema, raw, file));
    });
  }

  it('every JSON file in src/content has a schema, so no CMS screen goes unchecked', async () => {
    const { readdirSync } = await import('node:fs');
    const files = readdirSync(new URL('../src/content/', import.meta.url)).filter((f) => f.endsWith('.json'));
    assert.deepEqual(files.map((f) => `src/content/${f}`).sort(), Object.keys(contentFiles).sort());
  });

  it('every menu section has a unique id and every allergen on a dish exists', () => {
    const menu = parseContent(menuSchema, read('menu.json'), 'menu.json');
    const codes = new Set(menu.allergens.map((a) => a.code));
    assert.equal(new Set(menu.sections.map((s) => s.id)).size, menu.sections.length);
    for (const s of menu.sections) for (const d of s.dishes) for (const c of d.allergens) assert.ok(codes.has(c), `${d.name}: ${c}`);
  });
});

describe('hours schema', () => {
  it('rejects a time that is not TT:MM, and names the file in the error', () => {
    const hours = read('hours.json');
    hours.monday.open = '9.30';
    assert.throws(() => parseContent(hoursSchema, hours, 'hours.json'), /Feil i hours\.json[\s\S]*TT:MM/);
  });

  it('rejects closing before opening, unless the day is closed', () => {
    const hours = read('hours.json');
    hours.tuesday = { open: '21:00', close: '10:00', closed: false };
    assert.throws(() => parseContent(hoursSchema, hours, 'hours.json'), /Stengetid/);
    hours.tuesday.closed = true;
    assert.doesNotThrow(() => parseContent(hoursSchema, hours, 'hours.json'));
  });

  it('treats an empty or missing «closed» toggle as open', () => {
    const hours = read('hours.json');
    delete hours.wednesday.closed;
    hours.thursday.closed = null;
    const parsed = parseContent(hoursSchema, hours, 'hours.json');
    assert.equal(parsed.wednesday.closed, false);
    assert.equal(parsed.thursday.closed, false);
  });
});

describe('venues and contact schemas', () => {
  it('turns empty optional CMS fields into undefined', () => {
    const venues = read('venues.json');
    venues.cakes = '';
    venues.extras = null;
    venues.meetingRooms.rooms[0].equipment = '   ';
    venues.meetingRooms.rooms[0].price = null;
    const parsed = parseContent(venuesSchema, venues, 'venues.json');
    assert.equal(parsed.cakes, undefined);
    assert.deepEqual(parsed.extras, []);
    assert.equal(parsed.meetingRooms.rooms[0].equipment, undefined);
    assert.equal(parsed.meetingRooms.rooms[0].price, undefined);
  });

  it('rejects letters in the phone number', () => {
    const contact = read('contact.json');
    contact.phone = 'ring oss';
    assert.throws(() => parseContent(contentFiles['src/content/contact.json'], contact, 'contact.json'), /siffer/);
  });

  it('asks for a whole link and a whole e-mail address, in Norwegian', () => {
    const contact = read('contact.json');
    contact.email = 'kontakt(at)huset';
    contact.facebook = 'facebook.com/huset';
    assert.throws(
      () => parseContent(contentFiles['src/content/contact.json'], contact, 'contact.json'),
      (e: Error) => /E-post: Skriv en hel e-postadresse/.test(e.message) && /Facebook-side: Skriv en hel lenke/.test(e.message),
    );
  });
});

describe('error messages for owners', () => {
  it('names the place of a problem with CMS labels and the names of sections and dishes', () => {
    const data = { sections: [{ title: 'Fra grillen', dishes: [{ name: 'Burger' }, { name: ' ' }] }] };
    assert.equal(describePath(data, ['sections', 0, 'dishes', 0, 'price']), '«Fra grillen» → «Burger» → Pris');
    assert.equal(describePath(data, ['sections', 0, 'dishes', 1, 'name']), '«Fra grillen» → Retter nr. 2 → Navn');
    assert.equal(describePath({}, ['friday', 'open']), 'Fredag → Åpner');
    assert.equal(describePath({}, []), '');
  });

  it('says a required field is empty, and where', () => {
    const menu = read('menu.json');
    const dish = menu.sections[0].dishes[0];
    dish.name = '  ';
    assert.throws(() => parseContent(menuSchema, menu, 'menu.json'), /• «[^»]+» → Retter nr\. 1 → Navn: Feltet må fylles ut/);
  });
});

describe('notice', () => {
  it('accepts a notice that is switched off and empty, as the CMS saves it', () => {
    const parsed = parseContent(noticeSchema, { show: false, text: '', until: '' }, 'notice.json');
    assert.deepEqual(parsed, { show: false, text: undefined, until: undefined });
    assert.equal(activeNotice(parsed), undefined);
  });

  it('rejects a notice that is switched on without text', () => {
    assert.throws(() => parseContent(noticeSchema, { show: true, text: ' ' }, 'notice.json'), /Skriv en beskjed/);
  });

  it('rejects a last day that does not exist or is not a date', () => {
    assert.throws(() => parseContent(noticeSchema, { show: true, text: 'Hei', until: '2026-02-30' }, 'notice.json'), /finnes ikke/);
    assert.throws(() => parseContent(noticeSchema, { show: true, text: 'Hei', until: '26.12.2026' }, 'notice.json'), /dato/);
  });

  it('rejects a notice over 200 characters', () => {
    assert.throws(() => parseContent(noticeSchema, { show: true, text: 'a'.repeat(201) }, 'notice.json'), /for lang/);
  });

  it('shows through its last day and drops it the day after', () => {
    const n = { show: true, text: 'Stengt i dag', until: '2026-12-26' };
    assert.deepEqual(activeNotice(n, '2026-12-25'), { text: 'Stengt i dag', until: '2026-12-26' });
    assert.ok(activeNotice(n, '2026-12-26'));
    assert.equal(activeNotice(n, '2026-12-27'), undefined);
    assert.ok(activeNotice({ show: true, text: 'Uten sluttdato' }, '2099-01-01'));
    assert.equal(activeNotice({ ...n, show: false }, '2026-12-25'), undefined);
  });

  it('counts days in Oslo time, not UTC', () => {
    // 23:30 UTC on 25 December is already 26 December in Oslo.
    assert.equal(osloToday(new Date('2026-12-25T23:30:00Z')), '2026-12-26');
    assert.equal(osloToday(new Date('2026-07-01T21:59:00Z')), '2026-07-01');
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

  it('reads the «Ikke tilgjengelig nå» switch, and treats a missing one as available', () => {
    const menu = clone(base);
    menu.sections[0].dishes[0].unavailable = true;
    delete menu.sections[0].dishes[1].unavailable;
    menu.sections[0].dishes[2].unavailable = null;
    const parsed = parseContent(menuSchema, menu, 'menu.json');
    assert.equal(parsed.sections[0].dishes[0].unavailable, true);
    assert.equal(parsed.sections[0].dishes[1].unavailable, false);
    assert.equal(parsed.sections[0].dishes[2].unavailable, false);
  });
});
