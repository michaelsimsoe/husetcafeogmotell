/**
 * The words on the catering page, one object per language (pages/catering.astro).
 * Facts from the CMS (capacity, cakes) are woven in by the page that builds the object;
 * the cakes line itself is added to the offer list by the template, in the page's language.
 */
import type { Em } from './home';

export interface CateringCopy {
  title: string;
  description: string;
  h1: Em;
  lede: string;
  /** What the kitchen makes, one dish type per line. The CMS cakes line follows when it is set. */
  offer: { h: string; items: string[] };
  order: { h: string; text: string };
  /** After the order buttons: the party can be held at Huset instead. */
  here: { text: string; link: string };
  events: string;
}
