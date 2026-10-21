/**
 * Validation for the two files owners edit in Pages CMS (src/content/*.json).
 * The build fails with a readable message if an edit breaks the shape, so a
 * bad value never reaches the live site.
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

export const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const day = z
  .object({ open: time, close: time, closed: z.boolean().nullish().transform((v) => v ?? false) })
  .refine((d) => d.closed || d.open < d.close, { message: 'Stengetid må være etter åpningstid' });

export const siteSchema = z.object({
  contact: z.object({
    phone: z.string().regex(/^\+?[\d ]{8,16}$/, 'Telefonnummeret kan bare ha siffer og mellomrom'),
    email: z.email(),
    facebook: z.url(),
    booking: z.url(),
  }),
  hours: z.object({
    confirmed,
    monday: day,
    tuesday: day,
    wednesday: day,
    thursday: day,
    friday: day,
    saturday: day,
    sunday: day,
  }),
  rooms: z.object({
    confirmed,
    count: z.number().int().positive(),
    priceFrom: price,
    checkIn: time,
    checkOut: time,
  }),
  venues: z.object({
    confirmed,
    capacity: z.number().int().positive(),
    occasions: z.array(text).min(1),
    catering: z.array(text).min(1),
    cakes: optionalText,
    extras: z
      .array(text)
      .nullish()
      .transform((v) => v ?? []),
  }),
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
  nearby: z.object({
    confirmed,
    places: z.array(z.object({ name: text, what: text, where: text })),
  }),
  directions: z.object({ confirmed }),
});

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
    featured: z
      .boolean()
      .nullish()
      .transform((v) => v ?? false),
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

export type SiteContent = z.infer<typeof siteSchema>;
export type MenuContent = z.infer<typeof menuSchema>;
export type Dish = MenuContent['sections'][number]['dishes'][number];
export type MenuSection = MenuContent['sections'][number];

/** Parse CMS content, or stop the build with a message that names the file and the field. */
export function parseContent<S extends z.ZodType>(schema: S, data: unknown, file: string): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) throw new Error(`Feil i ${file}:\n${z.prettifyError(result.error)}`);
  return result.data;
}
