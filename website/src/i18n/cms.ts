/**
 * CMS text in the page's language, from the translation memory in
 * src/i18n/memory/ (see memory.ts). A language with no memory file falls back
 * to Norwegian, marked as such.
 */
import { parseContent } from '../data/schema.ts';
import type { Locale } from './locales.ts';
import { createMemory, memorySchema, translate, type Memory, type Said } from './memory.ts';
import enRaw from './memory/en.json';

const memories: Partial<Record<Locale, Memory>> = {
  en: createMemory(parseContent(memorySchema, enRaw, 'src/i18n/memory/en.json')),
};

export const cmsText = (nb: string, locale: Locale): Said => translate(memories[locale], nb, locale);
