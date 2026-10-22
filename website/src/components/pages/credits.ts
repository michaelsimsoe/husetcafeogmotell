/**
 * The words on the credits page, one object per language (pages/anerkjennelse.astro, pages/en/credits.astro).
 * The photo rows come from data/credits.ts; the list of map, data and font sources is
 * prose full of links, so each page passes it to Credits.astro as its default slot.
 */
import type { Em } from './home';

export interface CreditsCopy {
  title: string;
  description: string;
  h1: Em;
  lede: string;
  photos: {
    /** Fragment id of the photos section. */
    id: string;
    h: string;
    /** `outside`: how many of the photos were taken by someone else. */
    intro: (outside: number) => string;
  };
  table: {
    caption: string;
    cols: { photo: string; caption: string; photographer: string; license: string; source: string };
    /** The license and source cells for Huset's own photos. */
    own: { license: string; source: string };
    /** The last row: the logo in the footer. */
    logo: { caption: string; license: string };
  };
  /** The sources section; its fragment id is `ui().anchors.sources`. */
  sources: { h: Em };
}
