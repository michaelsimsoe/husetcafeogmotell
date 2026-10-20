/**
 * Shared, structured menu — transcribed from the three menu screens in the
 * restaurant. One dataset for the website and the 16:9 screens.
 * Prices and allergens are as shown on the screens and must be confirmed.
 */

export type AllergenId = 1 | 2 | 3 | 4 | 5;

export const allergens: Record<AllergenId, string> = {
  1: 'Gluten',
  2: 'Laktose',
  3: 'Egg',
  4: 'Sennep',
  5: 'Nøtter',
};

export interface PriceVariant {
  label: string;
  price: number;
}

export interface Dish {
  id: string;
  name: string;
  desc?: string;
  allergens: AllergenId[];
  price: number;
  variants?: PriceVariant[];
}

export interface MenuSection {
  id: string;
  title: string;
  /** Short line used under the heading where the screens had none. */
  lede?: string;
  note?: string;
  dishes: Dish[];
}

const d = (
  id: string,
  name: string,
  allergenList: AllergenId[],
  price: number,
  desc?: string,
  variants?: PriceVariant[],
): Dish => ({ id, name, allergens: allergenList, price, desc, variants });

export const menu: MenuSection[] = [
  {
    id: 'grill',
    title: 'Fra grillen',
    dishes: [
      d('biffburger', 'Biffburger', [1, 2, 4], 235, 'med salat og chips'),
      d('chilliburger', 'Husets chilliburger', [1, 2, 4], 310, 'med cheddar, løkringer og bacon'),
      d('kebabburger', 'Husets kebabburger', [1, 2, 3, 4], 245, 'kyllingkebab med chips og dressing'),
      d('vertshusburger', 'Vertshusburger', [1, 2, 4], 269, 'med bacon, nachos, salat og chips'),
      d('rullekebab', 'Rullekebab', [1, 2, 3], 245, 'med salat, jalapeño og chips'),
      d('kebabtallerken', 'Kebabtallerken', [1, 2, 3, 4], 260, 'med salat og chips'),
      d('biffsnadder', 'Biffsnadder', [2, 3, 4], 245, 'med salat og chips'),
      d('kyllingsnadder', 'Kyllingsnadder', [2, 3, 4], 245, 'med salat og chips'),
      d('husets-biff', 'Husets biff', [2, 3, 4], 329, 'med sopp, løk, stekt tomat og salat'),
      d('lovsteik', 'Løvsteik', [2, 3, 4], 235, 'med salat og chips'),
      d('ostesnitzel', 'Ostesnitzel av kalkun', [1, 2, 3, 4], 245, 'med salat og chips'),
    ],
  },
  {
    id: 'pizza',
    title: 'Pizza',
    dishes: [
      d('biffpizza', 'Biffpizza', [1, 2], 290, 'med biffkjøtt, løk og bacon'),
      d('pepperoni', 'Pepperoni', [1, 2], 270, 'med pepperoni, kjøttdeig og løk'),
      d('kjottdeig', 'Kjøttdeig', [1, 2], 270, 'med kjøttdeig og bacon'),
      d('jambon', 'Jambon', [1, 2], 230, 'med skinke'),
      d('hawaii', 'Hawaii', [1, 2], 250, 'med skinke og ananas'),
      d('vegetar-pizza', 'Vegetar', [1, 2], 250, 'med et utvalg av grønnsaker'),
      d('fredagspizza', 'Fredagspizza', [1, 2], 315, 'med ekstra alt!'),
      d('la-kebab', 'La Kebab', [1, 2, 3], 290, 'husets kebabpizza'),
      d('alabama', 'Alabama', [1, 2], 290, 'med kylling og løk'),
      d('margherita', 'Margherita', [1, 2], 215, 'med tomat, ost og basilikum'),
      d('monaco', 'Monaco', [1, 2], 290, 'med biff, sopp og løk'),
      d('hot-hot', 'Hot Hot', [1, 2], 290, 'med chillisaus og kjøttdeig'),
      d('mix', 'Mix', [1, 2], 340, 'velg opptil fem ingredienser'),
    ],
  },
  {
    id: 'fisk',
    title: 'Fisk',
    dishes: [
      d('laks', 'Ovnsbakt laksefilet', [2], 250, 'med salat og rømme'),
      d('steinbit', 'Steinbitkarbonader', [2], 260, 'med salat, rømme og potet'),
    ],
  },
  {
    id: 'smaretter',
    title: 'Småretter',
    dishes: [
      d('nachos', 'Husets nachos', [2, 4], 205),
      d('egg-bacon', 'Egg og bacon', [1, 2, 3, 4], 165),
      d('taco-wraps', 'Taco wraps', [1, 2, 4], 165),
      d('sandwich', 'Sandwich', [1, 2, 4], 175, 'med ost og skinke'),
      d('karbonade', 'Karbonadesmørbrød', [1, 2, 3, 4], 175, 'med speilegg'),
      d('karbonade-dobbel', 'Dobbel karbonadesmørbrød', [1, 2, 3, 4], 210, 'med speilegg'),
    ],
  },
  {
    id: 'salat',
    title: 'Husets salat',
    dishes: [
      d('salat-skinke', 'Skinke', [1, 2, 3, 4], 195),
      d('salat-kylling', 'Kylling og bacon', [1, 2, 3, 4], 210),
      d('salat-reker', 'Reker', [1, 2, 3, 4], 215),
      d('salat-vegetar', 'Vegetar', [1, 2, 3, 4], 205),
    ],
  },
  {
    id: 'pita',
    title: 'Pitabrød',
    dishes: [
      d('pita-kjottdeig', 'Kjøttdeig', [1, 4], 205),
      d('pita-kylling', 'Kylling og bacon', [1, 4], 210),
    ],
  },
  {
    id: 'omelett',
    title: 'Omeletter',
    dishes: [
      d('omelett-skinke', 'Skinke', [1, 2, 3, 4], 195),
      d('omelett-kjottdeig', 'Kjøttdeig', [1, 2, 3, 4], 195),
      d('omelett-reker', 'Reker', [1, 2, 3, 4], 210),
      d('omelett-bacon', 'Bacon', [1, 2, 3, 4], 205),
    ],
  },
  {
    id: 'barn',
    title: 'Barnemeny',
    note: 'Barneporsjon av dagens meny: 30 % rabatt.',
    dishes: [
      d('barn-kyllinglar', 'Kyllinglår', [], 150, 'med chips'),
      d('barn-fiskepinner', 'Fiskepinner', [1, 3], 145, 'med chips'),
      d('barn-burger', 'Barneburger 100 g', [1], 155, 'med chips'),
      d('barn-nuggets', 'Kyllingnuggets', [1], 145, 'med chips'),
      d('barn-biff', 'Barnebiff', [2, 3, 4], 195, 'med salat og chips'),
      d('barn-polse-chips', 'Pølse og chips', [], 135, undefined, [
        { label: 'Enkel', price: 135 },
        { label: 'Dobbel', price: 165 },
      ]),
      d('barn-polse-mos', 'Pølse og potetmos', [], 145, undefined, [
        { label: 'Enkel', price: 145 },
        { label: 'Dobbel', price: 175 },
      ]),
      d('barn-pannekake', 'Pannekake', [1, 2, 3], 65, 'med blåbærsyltetøy'),
      d('barn-chips', 'Chips', [], 80),
    ],
  },
  {
    id: 'ekstra',
    title: 'Ekstra',
    dishes: [
      d('ekstra-ost', 'Ost', [3], 17),
      d('ekstra-bacon', 'Bacon', [], 22),
      d('ekstra-lokringer', '3 løkringer', [1], 33),
      d('ekstra-mozzarella', '3 mozzarellasticks', [1, 2], 33),
    ],
  },
  {
    id: 'drikke',
    title: 'Drikke',
    dishes: [
      d('brus', 'Brus', [], 50),
      d('juice', 'Juice', [], 45),
      d('kaffe', 'Kaffe', [], 40),
      d('te', 'Te', [], 40),
      d('kakao', 'Kakao', [], 45),
      d('fatol', 'Fatøl', [1], 110, undefined, [
        { label: '0,4 l', price: 110 },
        { label: '0,5 l', price: 125 },
        { label: '0,6 l', price: 145 },
      ]),
      d('spesialol', 'Spesialøl', [1], 150),
      d('rusbrus', 'Rusbrus', [], 125),
      d('rodvin', 'Rødvin', [], 125),
      d('hvitvin', 'Hvitvin', [], 125),
    ],
  },
];

export const menuMeta = {
  verified: false,
  source: 'Overført fra de tre menyskjermene i restauranten.',
  note: 'Priser og allergener som på dagens menyskjermer – bekreftes før lansering.',
  allergenNote: 'Spør personalet om allergener. Merkingen er overført fra skjermene og må kontrolleres.',
};

export const sectionById = (id: string) => {
  const s = menu.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown menu section: ${id}`);
  return s;
};

/** «290,-» — the house style on the screens. */
export const kr = (n: number) => `${n.toLocaleString('nb-NO')},-`;

/** «290 kr» — for running text. */
export const krText = (n: number) => `${n.toLocaleString('nb-NO')} kr`;

export const allergenList = (ids: AllergenId[]) => ids.map((i) => allergens[i]).join(', ');
