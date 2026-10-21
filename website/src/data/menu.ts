/**
 * The menu, from src/content/menu.json (Pages CMS). One dataset for the
 * website now and the 16:9 menu screens later.
 */
import raw from '../content/menu.json';
import { menuSchema, parseContent } from './schema.ts';

export type { Dish, MenuSection } from './schema.ts';

const data = parseContent(menuSchema, raw, 'src/content/menu.json');

export const menu = data.sections;

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

/** «290,-» — the house style on the screens. */
export const kr = (n: number) => `${n.toLocaleString('nb-NO')},-`;

/** «290 kr» — for running text. */
export const krText = (n: number) => `${n.toLocaleString('nb-NO')} kr`;
