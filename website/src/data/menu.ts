/**
 * The menu, from src/content/menu.json (Pages CMS). One dataset for the
 * website now and the 16:9 menu screens later.
 */
import raw from '../content/menu.json';
import { menuSchema, parseContent } from './schema.ts';
import type { Locale } from '../i18n/locales.ts';

export type { Dish, MenuSection } from './schema.ts';

const data = parseContent(menuSchema, raw, 'src/content/menu.json');

/** What guests can order now: dishes switched to «Ikke tilgjengelig nå» are left out, and so is a section left empty. */
export const menu = data.sections
  .map((s) => ({ ...s, dishes: s.dishes.filter((d) => !d.unavailable) }))
  .filter((s) => s.dishes.length > 0);

export const menuMeta = {
  confirmed: data.confirmed,
  note: data.note,
  allergenNote: data.allergenNote,
};

export const allergens = data.allergens;
const allergenNames = new Map(allergens.map((a) => [a.code, a.name]));

export const allergenText = (codes: readonly string[]) => codes.map((c) => allergenNames.get(c) ?? c).join(', ');

/** Sections with dishes picked for the homepage, keeping only the picked dishes. */
export const featured = menu
  .map((s) => ({ ...s, dishes: s.dishes.filter((d) => d.featured) }))
  .filter((s) => s.dishes.length > 0);

export const sectionById = (id: string) => menu.find((s) => s.id === id);

/** «290,-» — the house style on the screens. «NOK 290» in English. */
export const kr = (n: number, locale: Locale = 'nb') =>
  locale === 'en' ? `NOK ${n.toLocaleString('en-GB')}` : `${n.toLocaleString('nb-NO')},-`;

/** «290 kr» — for running text. «NOK 1,130» in English. */
export const krText = (n: number, locale: Locale = 'nb') =>
  locale === 'en' ? `NOK ${n.toLocaleString('en-GB')}` : `${n.toLocaleString('nb-NO')} kr`;
