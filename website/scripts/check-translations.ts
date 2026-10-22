/**
 * Lists the Norwegian text in the CMS that has no translation yet, for each
 * language with a translation memory in src/i18n/memory/. Those texts show in
 * Norwegian (marked lang="nb") on that language's pages until someone adds
 * them. Also lists translations nothing uses any more, e.g. after a dish was
 * renamed. Only reports: it always exits 0, so a CMS edit never stops a deploy.
 *
 *   npm run translations
 */
import { existsSync, readFileSync } from 'node:fs';
import { menuSchema, parseContent, venuesSchema } from '../src/data/schema.ts';
import { defaultLocale, locales } from '../src/i18n/locales.ts';
import { cmsTexts, coverage, createMemory, memorySchema } from '../src/i18n/memory.ts';

const read = (file: string) => JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'));
const menu = parseContent(menuSchema, read('src/content/menu.json'), 'src/content/menu.json');
const venues = parseContent(venuesSchema, read('src/content/venues.json'), 'src/content/venues.json');
const texts = cmsTexts(menu, venues);

for (const locale of locales.filter((l) => l !== defaultLocale)) {
  const file = `src/i18n/memory/${locale}.json`;
  if (!existsSync(new URL(`../${file}`, import.meta.url))) {
    console.log(`${locale}: no translation memory (${file}); all CMS text shows in Norwegian.\n`);
    continue;
  }
  const memory = createMemory(parseContent(memorySchema, read(file), file));
  const { missing, unused, total } = coverage(texts, memory);
  console.log(`${locale}: ${total - missing.length} of ${total} CMS texts translated (${file}).`);
  if (missing.length) {
    console.log(`\nShown in Norwegian until translated:`);
    for (const t of missing) console.log(`  • «${t.text}» – ${t.where}`);
  }
  if (unused.length) {
    console.log(`\nNo longer in the CMS, can be removed:`);
    for (const nb of unused) console.log(`  • «${nb}»`);
  }
  console.log('');
}
