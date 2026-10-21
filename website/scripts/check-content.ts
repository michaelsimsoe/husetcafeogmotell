/**
 * Checks every file the owners edit in Pages CMS against src/data/schema.ts and
 * prints the problems in Norwegian, under the name of the CMS screen. Exits with
 * 1 if any file is broken. The deploy workflow runs it first and quotes its
 * output in a GitHub issue when a save breaks the site.
 *
 *   npm run content
 */
import { readFileSync } from 'node:fs';
import { contentFiles, contentScreens, parseContent } from '../src/data/schema.ts';

let broken = 0;
for (const [file, schema] of Object.entries(contentFiles)) {
  const screen = `«${contentScreens[file as keyof typeof contentFiles]}» (${file})`;
  try {
    const raw = JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'));
    parseContent(schema, raw, file);
    console.log(`✔ ${screen}`);
  } catch (error) {
    broken++;
    const details =
      error instanceof SyntaxError
        ? `• Fila kan ikke leses (${error.message}). Sjekk siste endring i historikken.`
        : String((error as Error).message).split('\n').slice(1).join('\n');
    console.log(`✖ ${screen}\n${details}`);
  }
}

if (broken) {
  console.log(`\n${broken === 1 ? 'Én skjerm har' : `${broken} skjermer har`} feil. Nettsiden er ikke oppdatert; den forrige versjonen ligger fortsatt ute.`);
  process.exit(1);
}
