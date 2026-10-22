/**
 * The translation memory: other languages for the Norwegian free text the
 * owners write in Pages CMS (dish names and descriptions, menu sections,
 * allergens, the venue extras and meeting rooms). Each entry is keyed on the
 * Norwegian exactly as written, so when a dish is renamed in the CMS its old
 * translation simply stops matching. Nothing needs dish ids. Until someone
 * writes the new translation, the page shows the Norwegian, marked lang="nb",
 * and `npm run translations` lists it.
 *
 * The entries live in src/i18n/memory/<locale>.json. Only relative imports
 * here: the tests and scripts load this file directly in Node.
 */
import { z } from 'astro/zod';
import { defaultLocale, type Locale } from './locales.ts';
import type { menuSchema, venuesSchema } from '../data/schema.ts';

/** Same text however it is spaced. Case and punctuation still count. */
export const memoryKey = (text: string) => text.trim().replace(/\s+/g, ' ');

export const memorySchema = z
  .array(z.object({ nb: z.string().trim().min(1), en: z.string().trim().min(1) }))
  .superRefine((entries, ctx) => {
    const seen = new Set<string>();
    entries.forEach((e, i) => {
      const key = memoryKey(e.nb);
      if (seen.has(key)) ctx.addIssue({ code: 'custom', path: [i, 'nb'], message: `«${key}» er oversatt to ganger` });
      seen.add(key);
    });
  });

export type MemoryEntry = z.infer<typeof memorySchema>[number];
export type Memory = ReadonlyMap<string, string>;

export const createMemory = (entries: readonly MemoryEntry[]): Memory =>
  new Map(entries.map((e) => [memoryKey(e.nb), e.en.trim()]));

export interface Said {
  text: string;
  /** Set when the text is not in the language asked for: the Norwegian, because the memory has no translation yet. */
  lang?: Locale;
}

/** CMS text in `locale`: the memory's translation, or else the Norwegian marked as such. */
export function translate(memory: Memory | undefined, nb: string, locale: Locale): Said {
  if (locale === defaultLocale) return { text: nb };
  const hit = memory?.get(memoryKey(nb));
  return hit === undefined ? { text: nb, lang: defaultLocale } : { text: hit };
}

export interface CmsText {
  text: string;
  /** Where the owners write it: the CMS screen and the item. */
  where: string;
}

type MenuContent = z.infer<typeof menuSchema>;
type VenuesContent = z.infer<typeof venuesSchema>;

/** Every piece of Norwegian free text the CMS can put on a page, including dishes switched off for now. */
export function cmsTexts(menu: MenuContent, venues: VenuesContent): CmsText[] {
  const out: CmsText[] = [];
  const add = (text: string | undefined, where: string) => {
    if (text) out.push({ text, where });
  };
  add(menu.allergenNote, 'Menyen › Merknad om allergener');
  for (const a of menu.allergens) add(a.name, `Menyen › Allergener › ${a.code}`);
  for (const s of menu.sections) {
    add(s.title, `Menyen › ${s.title}`);
    add(s.note, `Menyen › ${s.title} › merknad`);
    for (const d of s.dishes) {
      add(d.name, `Menyen › ${s.title} › ${d.name}`);
      add(d.description, `Menyen › ${s.title} › ${d.name} › beskrivelse`);
      for (const v of d.variants ?? []) add(v.label, `Menyen › ${s.title} › ${d.name} › variant`);
    }
  }
  add(venues.cakes, 'Selskap og møterom › Kaker');
  for (const x of venues.extras) add(x, 'Selskap og møterom › Ekstra');
  for (const m of venues.meetingRooms.rooms) {
    add(m.name, `Selskap og møterom › ${m.name}`);
    add(m.equipment, `Selskap og møterom › ${m.name} › utstyr`);
  }
  return out;
}

export interface Coverage {
  /** Norwegian text with no translation yet, once each, where it first appears. */
  missing: CmsText[];
  /** Entries whose Norwegian is no longer anywhere in the CMS, e.g. after a dish was renamed. */
  unused: string[];
  /** How many different texts the CMS has. */
  total: number;
}

export function coverage(texts: readonly CmsText[], memory: Memory): Coverage {
  const first = new Map<string, CmsText>();
  for (const t of texts) {
    const key = memoryKey(t.text);
    if (!first.has(key)) first.set(key, t);
  }
  return {
    missing: [...first.entries()].filter(([key]) => !memory.has(key)).map(([, t]) => t),
    unused: [...memory.keys()].filter((key) => !first.has(key)),
    total: first.size,
  };
}
