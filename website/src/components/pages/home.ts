/**
 * The words on the home page that are not in the CMS, one object per language
 * (pages/index.astro, pages/en/index.astro). Longer prose with facts woven in
 * is passed to Home.astro as named slots instead: `rooms`, `gatherings`, `korgen`.
 */

/** A heading in two parts; the second is set in italics. */
export type Em = readonly [plain: string, emphasised: string];

export interface HomeCopy {
  title: string;
  description: string;
  hero: { h1: Em; stand: string };
  today: {
    h: string;
    callUs: string;
    /** Leads to the menu page, or to the dishes further down when the menu isn't in this language. */
    food: string;
    roomsFrom: string;
  };
  food: {
    h: Em;
    lede: string;
    /** The link to the full menu page. */
    all: string;
    allergens: string;
  };
  rooms: {
    h: Em;
    facts: { rooms: string; breakfast: string; included: string; checkIn: string; checkOut: string; perNight: string; from: string };
    /** Read by screen readers after «Ring 403 17 353». */
    toBook: string;
  };
  gatherings: {
    h: Em;
    occasions: string;
    meetingRooms: string;
    orMessage: string;
  };
  korgen: {
    h: Em;
    then: { caption: string; date: string };
    now: { caption: string; date: string };
    peaksDate: string;
    ridgeNote: string;
  };
  around: { h: Em; lede: string };
  findUs: {
    h: Em;
    address: string;
    directionsNote: string;
    today: string;
    phone: string;
  };
  map: string;
}
