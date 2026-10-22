/**
 * The words on the events page, one object per language (pages/arrangementer.astro).
 * Facts from the CMS (capacity, extras) are woven in by the page that builds the object.
 */
import type { Em } from './home';

/** A named kind of evening and a sentence or two about it. */
export interface Entry {
  name: string;
  text: string;
}

export interface EventsCopy {
  title: string;
  description: string;
  h1: Em;
  lede: string;
  /** The link to Facebook, where the dates are posted. */
  facebook: string;
  /** Fragment ids, written in the page's language. */
  ids: { music: string; food: string; party: string };
  music: { h: Em; lede: string; entries: Entry[] };
  food: {
    h: Em;
    lede: string;
    entries: Entry[];
    /** Shown only while Sunday dinner is in the CMS's list of extras. */
    sunday: Entry;
  };
  party: {
    h: Em;
    occasions: string;
    lede: string;
    /** Leads to the gatherings section on the home page: capacity, meeting rooms, prices. */
    venue: string;
    catering: string;
  };
}
