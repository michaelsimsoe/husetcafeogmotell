/**
 * The words on the menu page around the dishes, one object per language
 * (pages/meny.astro, pages/en/menu.astro). The dishes, sections and allergens
 * come from the CMS and go through the translation memory (see i18n/memory.ts).
 */
import type { Em } from './home';

export interface MenuCopy {
  title: string;
  description: string;
  h1: Em;
  lede: string;
  /** The opening hours beside the heading, as a sentence. */
  open: string;
  /** Accessible name of the section index. */
  index: string;
  /** Heading over the allergen key in the margin. */
  allergens: string;
  /** Hidden heading over the notes at the foot of the page. */
  notes: string;
  /** Before «Call <number>.» at the foot of the page. */
  questions: string;
  /** The link back to the home page after it. */
  home: string;
  /** Marks where a photo of a burger is still to come. */
  placeholder: { need: string; detail: string };
}
