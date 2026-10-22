/**
 * Validation for the files owners edit in Pages CMS (src/content/*.json), one
 * schema per CMS screen. The build fails with a readable message if an edit
 * breaks the shape, so a bad value never reaches the live site.
 *
 * Only relative imports here: the tests load this file directly in Node.
 */
import { z } from 'astro/zod';

const text = z.string().trim().min(1);
/** Optional CMS fields come back as "", null or missing. */
const optionalText = z
  .string()
  .trim()
  .nullish()
  .transform((v) => v || undefined);
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Bruk formatet TT:MM, for eksempel 09:30');
const price = z.number().int().nonnegative();
const confirmed = z.boolean();
/** A toggle the CMS may leave empty; empty means off. */
const toggle = z
  .boolean()
  .nullish()
  .transform((v) => v ?? false);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Bruk en dato, for eksempel 2026-12-26')
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(v);
  }, 'Datoen finnes ikke');
const optionalDate = z
  .union([z.literal(''), date])
  .nullish()
  .transform((v) => v || undefined);

export const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const day = z
  .object({ open: time, close: time, closed: toggle })
  .refine((d) => d.closed || d.open < d.close, { message: 'Stengetid må være etter åpningstid' });

/** «Kontakt og lenker» — contact.json */
export const contactSchema = z.object({
  phone: z.string().regex(/^\+?[\d ]{8,16}$/, 'Telefonnummeret kan bare ha siffer og mellomrom'),
  email: z.email(),
  facebook: z.url(),
});

/** «Åpningstider» — hours.json */
export const hoursSchema = z.object({
  confirmed,
  monday: day,
  tuesday: day,
  wednesday: day,
  thursday: day,
  friday: day,
  saturday: day,
  sunday: day,
});

/** «Rom og priser» — rooms.json */
export const roomsSchema = z.object({
  confirmed,
  count: z.number().int().positive(),
  priceFrom: price,
  checkIn: time,
  checkOut: time,
});

/** «Selskap og møterom» — venues.json */
export const venuesSchema = z.object({
  confirmed,
  capacity: z.number().int().positive(),
  cakes: optionalText,
  extras: z
    .array(text)
    .nullish()
    .transform((v) => v ?? []),
  meetingRooms: z.object({
    confirmed,
    rooms: z.array(
      z.object({
        name: text,
        equipment: optionalText,
        price: price.nullish().transform((v) => v ?? undefined),
      }),
    ),
  }),
});

/** «Beskjed på nettsiden» — notice.json */
export const noticeSchema = z
  .object({ show: toggle, text: optionalText, textEn: optionalText, until: optionalDate })
  .refine((n) => !n.show || n.text, { message: 'Skriv en beskjed, eller slå av «Vis beskjeden»', path: ['text'] })
  .refine((n) => !n.text || n.text.length <= 200, { message: 'Beskjeden er for lang. Hold den under 200 tegn.', path: ['text'] })
  .refine((n) => !n.textEn || n.textEn.length <= 200, { message: 'Beskjeden er for lang. Hold den under 200 tegn.', path: ['textEn'] });

const allergenCode = z.coerce.string().regex(/^\d+$/, 'Allergenkoden må være et tall');

const dish = z
  .object({
    name: text,
    description: optionalText,
    price: price.nullish().transform((v) => v ?? undefined),
    variants: z
      .array(z.object({ label: text, price }))
      .nullish()
      .transform((v) => (v?.length ? v : undefined)),
    allergens: z
      .array(allergenCode)
      .nullish()
      .transform((v) => [...new Set(v ?? [])].sort((a, b) => Number(a) - Number(b))),
    featured: toggle,
    /** Hidden on the site while on, e.g. when an ingredient is out. */
    unavailable: toggle,
  })
  .refine((d) => d.price !== undefined || d.variants, { message: 'Retten trenger en pris, eller varianter med pris' });

export const menuSchema = z
  .object({
    confirmed,
    note: optionalText,
    allergenNote: optionalText,
    allergens: z.array(z.object({ code: allergenCode, name: text })).min(1),
    sections: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9-]+$/, 'Id kan bare ha små bokstaver a–z, tall og bindestrek'),
          title: text,
          note: optionalText,
          dishes: z.array(dish).min(1),
        }),
      )
      .min(1),
  })
  .superRefine((m, ctx) => {
    const ids = new Set<string>();
    m.sections.forEach((s, i) => {
      if (ids.has(s.id)) ctx.addIssue({ code: 'custom', path: ['sections', i, 'id'], message: `Id «${s.id}» er brukt to ganger` });
      ids.add(s.id);
    });
    const codes = new Set(m.allergens.map((a) => a.code));
    m.sections.forEach((s, i) =>
      s.dishes.forEach((d, j) =>
        d.allergens.forEach((c) => {
          if (!codes.has(c))
            ctx.addIssue({ code: 'custom', path: ['sections', i, 'dishes', j, 'allergens'], message: `Allergen ${c} finnes ikke i allergenlista` });
        }),
      ),
    );
  });

/** Every file owners edit in Pages CMS, relative to website/, with its schema. */
export const contentFiles = {
  'src/content/menu.json': menuSchema,
  'src/content/hours.json': hoursSchema,
  'src/content/notice.json': noticeSchema,
  'src/content/rooms.json': roomsSchema,
  'src/content/venues.json': venuesSchema,
  'src/content/contact.json': contactSchema,
} as const;

/** The CMS screen for each file, as named in .pages.yml. */
export const contentScreens: Record<keyof typeof contentFiles, string> = {
  'src/content/menu.json': 'Menyen',
  'src/content/hours.json': 'Åpningstider',
  'src/content/notice.json': 'Beskjed på nettsiden',
  'src/content/rooms.json': 'Rom og priser',
  'src/content/venues.json': 'Selskap og møterom',
  'src/content/contact.json': 'Kontakt og lenker',
};

export type MenuContent = z.infer<typeof menuSchema>;
export type Dish = MenuContent['sections'][number]['dishes'][number];
export type MenuSection = MenuContent['sections'][number];

/** Field names as the owners see them in .pages.yml. */
const fieldLabels: Record<string, string> = {
  confirmed: 'Bekreftet',
  note: 'Merknad',
  allergenNote: 'Merknad om allergener',
  allergens: 'Allergener',
  code: 'Nummer',
  sections: 'Deler av menyen',
  id: 'Lenkenavn',
  title: 'Overskrift',
  dishes: 'Retter',
  name: 'Navn',
  description: 'Beskrivelse',
  price: 'Pris',
  variants: 'Varianter',
  label: 'Variant',
  featured: 'Vis på forsiden',
  unavailable: 'Ikke tilgjengelig nå',
  monday: 'Mandag',
  tuesday: 'Tirsdag',
  wednesday: 'Onsdag',
  thursday: 'Torsdag',
  friday: 'Fredag',
  saturday: 'Lørdag',
  sunday: 'Søndag',
  open: 'Åpner',
  close: 'Stenger',
  closed: 'Stengt',
  show: 'Vis beskjeden',
  text: 'Beskjed',
  textEn: 'Beskjed på engelsk',
  until: 'Vis til og med',
  count: 'Antall rom',
  priceFrom: 'Pris fra',
  checkIn: 'Innsjekk fra',
  checkOut: 'Utsjekk innen',
  capacity: 'Antall gjester',
  cakes: 'Kaker',
  extras: 'Annet dere tilbyr',
  meetingRooms: 'Møterom',
  rooms: 'Rom',
  equipment: 'Utstyr',
  phone: 'Telefon',
  email: 'E-post',
  facebook: 'Facebook-side',
};

/**
 * Where a problem is, in the owner's words: sections.0.dishes.3.price becomes
 * «Fra grillen» → «Burger» → Pris. A list item is named by its own name or
 * title when it has one, otherwise by its number.
 */
export function describePath(data: unknown, path: readonly PropertyKey[]): string {
  const parts: string[] = [];
  let node = data;
  for (const key of path) {
    const next = node && typeof node === 'object' ? (node as Record<PropertyKey, unknown>)[key] : undefined;
    if (typeof key === 'number') {
      const item = next && typeof next === 'object' ? (next as Record<string, unknown>) : {};
      const named = [item.name, item.title, item.label].find((v): v is string => typeof v === 'string' && v.trim() !== '');
      const list = parts.pop();
      parts.push(named ? `«${named.trim()}»` : `${list ? `${list} ` : ''}nr. ${key + 1}`);
    } else {
      parts.push(fieldLabels[String(key)] ?? String(key));
    }
    node = next;
  }
  return parts.join(' → ');
}

const norwegian = z.locales.no().localeError;
/** Zod's Norwegian messages, with plainer words for the mistakes owners are likely to make. */
const ownerMessages: z.core.$ZodErrorMap = (issue) => {
  if (issue.input === undefined || issue.input === null) return 'Feltet må fylles ut';
  switch (issue.code) {
    case 'too_small':
      if (issue.origin === 'string') return 'Feltet må fylles ut';
      if (issue.origin === 'array') return 'Legg til minst én';
      if (issue.origin === 'number') return 'Tallet er for lite';
      break;
    case 'invalid_type':
      if (issue.expected === 'number' || issue.expected === 'int') return 'Skriv et helt tall';
      break;
    case 'invalid_format':
      if (issue.format === 'email') return 'Skriv en hel e-postadresse, for eksempel navn@eksempel.no';
      if (issue.format === 'url') return 'Skriv en hel lenke som begynner med https://';
      break;
  }
  return norwegian(issue);
};

/** Parse CMS content, or stop the build with a Norwegian list of what to fix and where. */
export function parseContent<S extends z.ZodType>(schema: S, data: unknown, file: string): z.infer<S> {
  const result = schema.safeParse(data, { error: ownerMessages });
  if (result.success) return result.data;
  const lines = result.error.issues.map((issue) => {
    const where = describePath(data, issue.path);
    return `• ${where ? `${where}: ` : ''}${issue.message}`;
  });
  throw new Error(`Feil i ${file}:\n${[...new Set(lines)].join('\n')}`);
}
