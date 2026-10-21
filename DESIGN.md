---
name: Huset Café & Motell
description: A white roadside house under Korgen's skyline, set as a light editorial page.
colors:
  whitewash: "#f5f6f2"
  fog: "#e4e8e3"
  ink: "#18201d"
  ink-soft: "#4a5651"
  hair: "#c3cbc5"
  spruce: "#1e3a32"
  hair-dark: "#3f5c52"
  lichen: "#b9c8c0"
  river: "#2e6b5e"
  river-light: "#8fc2b3"
  copper: "#9a4a2c"
  copper-light: "#e3a684"
  selection: "#c9ddd4"
typography:
  display:
    fontFamily: "Brygada 1918 Variable, Brygada 1918, Georgia, serif"
    fontSize: "clamp(2.75rem, 1.05rem + 5.25vw, 5.5rem)"
    fontWeight: 480
    lineHeight: 0.98
    letterSpacing: "-0.024em"
  headline:
    fontFamily: "Brygada 1918 Variable, Brygada 1918, Georgia, serif"
    fontSize: "clamp(2.125rem, 1.25rem + 2.9vw, 3.75rem)"
    fontWeight: 470
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Brygada 1918 Variable, Brygada 1918, Georgia, serif"
    fontSize: "clamp(1.5rem, 1.2rem + 0.9vw, 1.875rem)"
    fontWeight: 460
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  figure:
    fontFamily: "Brygada 1918 Variable, Brygada 1918, Georgia, serif"
    fontSize: "clamp(2.375rem, 1.9rem + 1.2vw, 3.25rem)"
    fontWeight: 450
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "'tnum' 1, 'lnum' 1"
  figure-small:
    fontFamily: "Brygada 1918 Variable, Brygada 1918, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.45rem + 0.8vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.005em"
    fontFeature: "'tnum' 1, 'lnum' 1"
  lede:
    fontFamily: "Ysabeau Office Variable, Ysabeau Office, Segoe UI, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 430
    lineHeight: 1.5
  body:
    fontFamily: "Ysabeau Office Variable, Ysabeau Office, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 430
    lineHeight: 1.55
  dish:
    fontFamily: "Ysabeau Office Variable, Ysabeau Office, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 620
    lineHeight: 1.3
    fontFeature: "'tnum' 1, 'lnum' 1"
  title-small:
    fontFamily: "Brygada 1918 Variable, Brygada 1918, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 460
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  small:
    fontFamily: "Ysabeau Office Variable, Ysabeau Office, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 430
    lineHeight: 1.5
  note:
    fontFamily: "Ysabeau Office Variable, Ysabeau Office, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 430
    lineHeight: 1.45
  fine:
    fontFamily: "Ysabeau Office Variable, Ysabeau Office, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 430
    lineHeight: 1.4
  label:
    fontFamily: "Ysabeau Office Variable, Ysabeau Office, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.04em"
rounded:
  none: "0px"
spacing:
  page-pad: "clamp(1.25rem, 5vw, 4.5rem)"
  gutter: "clamp(1rem, 1.8vw, 1.5rem)"
  section: "clamp(3.5rem, 7vw, 7rem)"
  container: "84rem"
  row: "3rem"
  touch: "44px"
components:
  button-primary:
    backgroundColor: "{colors.spruce}"
    textColor: "{colors.whitewash}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.1rem"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.whitewash}"
  button-on-spruce:
    backgroundColor: "{colors.whitewash}"
    textColor: "{colors.spruce}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.1rem"
    height: "3.25rem"
  button-on-spruce-hover:
    backgroundColor: "{colors.copper-light}"
    textColor: "{colors.spruce}"
  link:
    textColor: "{colors.river}"
  link-on-spruce:
    textColor: "{colors.whitewash}"
  link-on-spruce-hover:
    textColor: "{colors.copper-light}"
  row-link:
    textColor: "{colors.ink}"
    height: "{spacing.row}"
    padding: "0.35rem 0"
  row-link-hover:
    textColor: "{colors.river}"
  price:
    textColor: "{colors.copper}"
    typography: "{typography.dish}"
  price-on-spruce:
    textColor: "{colors.copper-light}"
  proof-mark:
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.none}"
    padding: "0.28em 0.45em 0.32em"
    typography: "{typography.label}"
  photo-placeholder:
    backgroundColor: "{colors.fog}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.none}"
    padding: "1.1rem 1.15rem"
---

# Design System: Huset Café & Motell

## Overview

**Creative North Star: "The white house under the ridge"**

Two things carry the whole system: a plain white building beside the E6 and the mountain line above Korgen. The page is the house: whitewashed, light, square-cornered, honest about what it is. The ridge is the signature: a single hairline traced from the real skyline above Korgen, which opens the page and returns between sections. Its only companion is another real line, the road: under the masthead the route north from Trondheim draws itself across a map of Norway, and the stretch through Korgen lifts off into a height profile over Korgfjellet. Ornament is only ever a real, traced line. Everything else is the language of a well-set printed page: hairline rules, dot leaders, tabular figures and a serif with a warm italic.

The system is calm, not sparse. Practical answers (open now, today's hours, the phone number, the menu, a room, the way there) sit in the first view, set as editorial type rather than as app widgets. Dark spruce takes over whole regions when the page goes indoors (the menu spread, finding the way, the footer), never as a card. Photography is real and of the place. Photos from outside sources carry their credit printed along the edge like a press photo; Huset's own photos run without one.

Status: in production build. The system comes from concept A («Huset i Korgen», `/concepts/a`), which the team chose, and now lives in the production app in `website/` (`website/src/styles/global.css`). The concepts in `redesign/` are an archive: B («Neste stopp: Huset») and C («Ly mot fjellan») stay published as references, and anything adopted from them is recorded here when it lands.

**Key Characteristics:**
- Light whitewash ground, ink type, spruce regions; no gradients, no radius, no shadows.
- The Korgen skyline as a river-green hairline: the system's signature. The only other ornament is the road and its height profile in «Her ligger Korgen»; both are real lines.
- Brygada 1918 for display, with italic for emphasis; Ysabeau Office for text.
- Structure by 1px rules and proximity, never by cards.
- Copper only where money or the current state is shown.
- Real photographs of Huset and Korgen; outside photos credited on the image edge, Huset's own uncredited; marked placeholders where a photo is missing.

## Colors

A cool, near-white paper with dark green-black ink, one deep forest region colour, a river green that carries the line, and copper used sparingly.

### Primary
- **Røssåga Green** (river): the skyline rule, text links, focus rings, the open-status dot and the arrows in action rows. It is the colour of the line and of things you can follow.
- **Pale River** (river-light): the same role on spruce: the skyline rule and the open-status dot inside dark regions.

### Secondary
- **Spruce** (spruce): owns whole full-bleed regions (the menu spread, «Finn fram», the footer) and fills the primary button. Text on it is whitewash, with lichen for secondary text.

### Tertiary
- **Price Copper** (copper): prices, the current item in navigation and the menu index (a 1px rule or short dash), list markers, and the here-mark (Korgen on the map and Huset on the height profile). On the 16:9 menu board it also sets the section heads, in keeping with the existing screens' copper headings.
- **Copper on Spruce** (copper-light): the same roles inside spruce regions, plus link hover and focus rings there.

### Neutral
- **Whitewash** (whitewash): the page ground and the white house. Also the theme colour.
- **Fog** (fog): the secondary ground, placeholder fields and the image background while photos load.
- **Ink** (ink): body text, headings, and the 1px rule that opens a group.
- **Soft Ink** (ink-soft): secondary text, captions, credits and the proof mark (7:1 on whitewash).
- **Hairline** (hair): rules between rows on light grounds.
- **Hairline on Spruce** (hair-dark): rules between rows inside spruce regions.
- **Lichen** (lichen): secondary text on spruce (7:1).
- **Selection** (selection): text selection on light grounds; inside spruce, selection uses copper-light with spruce text.
- **Land** (lichen mixed 62% into whitewash, about #d0dad3): land on the locator map and the terrain under the height profile, with neighbouring countries in fog.

### Named Rules
**The Copper Means Money Rule.** Copper marks a price, the current state or where Huset is (the here-mark), and nothing else on the web. Never a heading, a button fill or a background.

**The Spruce Region Rule.** Spruce changes the room: it fills a full-width region or a button, never a box floating on whitewash.

## Typography

**Display Font:** Brygada 1918 (with Georgia)
**Body Font:** Ysabeau Office (with Segoe UI)

**Character:** Brygada is a Polish book face from 1918 with a humane, slightly rustic italic. Ysabeau Office is a clear humanist sans with good figures. Together they read like a well-kept local publication: warm and literate, never luxurious.

### Hierarchy
- **Display** (480, clamp 2.75–5.5rem, 0.98): the homepage H1 only. Its second line is italic at 420 and set on its own line.
- **Headline** (470, clamp 2.125–3.75rem, 1.02): section heads. An italic phrase may carry the emphasis.
- **Title** (italic 460, clamp 1.5–1.875rem, 1.1): sub-heads, table captions, menu group heads.
- **Title small** (italic 460, 1.375rem, 1.2): the same voice one step down where a column must stay compact: the «I dag» head, the menu page's note, the form's fieldset legend and third-level heads in legal text.
- **Figure** (450, clamp 2.375–3.25rem, 1; tabular lining figures): today's hours, set as large type you can read across a room.
- **Figure small** (500, clamp 1.75–2.25rem, 1.05; tabular lining figures): the phone number beside today's hours, in river green.
- **Lede** (430, 1.1875rem, 1.5): opening paragraphs, max 34em.
- **Body** (430, 1.125rem; 1.0625rem below 48rem; 1.55): running text, max 68ch.
- **Dish** (620, 1.125rem, 1.3; tabular figures): dish names and prices in menu rows.
- **Small** (430, 1rem, 1.5): the top navigation, photo captions, dish descriptions, the footer and the form's failure message.
- **Note** (430, 0.9375rem, 1.45): secondary facts beside the main ones: the dateline, the week's hours under today's, fact terms, the menu index and legend, directions notes, credits, form hints and field errors.
- **Fine** (430, 0.875rem, 1.4): the note after a proof mark, photo credits from 48rem, caption dates and the credits table's header.
- **Label** (600, 0.8125rem, +0.04em, sentence case): small labels such as «Ring oss» and «Åpningstider». Never uppercase.

The text steps are fixed, not fluid: 1.1875 (lede), 1.125 (body, dish), 1.0625 (body on phones, inputs), 1, 0.9375, 0.875, 0.8125 and 0.75rem (proof mark only). Use one of them; do not add a step between.

### Named Rules
**The Italic Voice Rule.** Italic Brygada is the house's speaking voice: emphasis, captions, the second half of a heading. Upright text carries facts.

**The Tabular Figures Rule.** Every time, price, phone number and allergen number uses tabular lining figures, so columns of numbers line up like a printed price list.

## Layout

A 12-column grid in an 84rem container, with fluid page padding (`page-pad`) and gutters (`gutter`). From 64rem the page uses asymmetric editorial spreads: a narrow practical column beside a wide photograph, or a sticky menu index beside the menu. Below 64rem everything stacks in reading order, and photos bleed edge to edge on phones.

Rhythm comes from contrast: tight groups (rows with 0.35–0.7rem padding, separated only by hairlines) inside generous sections (`section` padding top and bottom). Spruce regions run full bleed. Touch targets are at least 44px tall; action rows are 3rem (3.75rem in the homepage «I dag» column).

The first view on every homepage layout must show the open status with today's closing time, today's hours, the phone number, and a way to the menu, rooms and directions, at both 1440×900 and 390×844. The top navigation counts as that way: the masthead photograph takes the room, so the «I dag» action rows may start just below the fold.

Breakpoints: 30rem (the dateline gains its weekday and place), 48rem (md: body size steps up, credits rotate onto the image edge), 64rem (lg: asymmetric spreads, side menu index).

## Elevation & Depth

Flat. There are no shadows anywhere. Depth comes from tonal grounds (whitewash → fog → spruce) and from rules: a 1px ink rule opens a group, 1px hairlines separate its rows. Sticky elements (the menu index) sit on whitewash with a hairline beneath them, not a shadow.

### Named Rules
**The Flat Paper Rule.** If something needs to stand out, give it a rule, a ground or a size, never a shadow or a lift on hover.

## Shapes

Square corners throughout (`rounded.none`). Lines are 1px. Dot leaders (a 1.8px dot every 7px) run from a dish name to its price. Placeholders are fog fields with an inset hairline frame and printer's crop marks at the corners. The only curves are the real lines (the ridge, the road and the height profile) and small round dots: the open status and the places on the map.

## Components

### Skyline rule (signature)
- **What:** the Korgen skyline (traced from a photograph of the dome above Korgen) as a 1px polyline in river green, river-light on spruce, with a non-scaling stroke. It runs full bleed along the top edge of the homepage photograph, opens the footer, and can divide sections.
- **Motion:** it draws itself once when it enters view, over 1.6s with an exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`). Without JavaScript, when printing or with reduced motion, it is simply there, fully drawn.
- **Rule:** never filled, never repeated as a pattern, never invented. It is the real line or it is absent.

### Masthead (homepage)
- **Order:** the dateline; then the skyline rule and a photograph of the white house from the road, both full bleed, with the skyline sitting directly on the photo's top edge; then the H1 and its stand (columns 1–7) beside the «I dag» column (columns 8–12).
- **Photo:** the owner's sunny facade shot (`huset-facade-sun`, an AI-retouched copy of `huset-facade-white` with the flagpole and signs removed), cropped at about half the viewport height (clamp 18.75–37.5rem, 52.5svh; 15–21.25rem on phones), focal point 50% 56%.
- **Below 64rem:** H1, then «I dag», then the stand, stacked.

### Masthead dateline
- Place («Korgen · Hemnes · ved E6»), coordinates (from 64rem) and the live open status between two 1px ink rules, like a newspaper's dateline. The status dot is filled river green when open and an outline when closed.

### «I dag» column
- An italic title (1.375rem) over an ink rule. Today's hours (figure) and the phone number (figure small, river green with a soft underline, «Ring oss» label above) share one line, hours left and phone right. The week's hours follow in soft ink with a proof mark.
- Action rows in two columns: «Se menyen» | «Veibeskrivelse», then the «Rom fra … / Book» split row across the full width. Rows here are 3.75rem tall.

### Locator («Her ligger Korgen»)
- **What:** the section directly under the masthead. It has a headline and a lede, then three parts:
  - **The map:** central Norway with land in the land tint and neighbouring countries in fog, inside a 1px hairline frame. An inset of all of Norway sits in the corner. The road from Trondheim to Bodø is a 2px river-green line, and the Mosjøen–Mo i Rana stretch is drawn heavier. Cities are ink dots with label type. Korgen is the copper here-mark, with its name in italic title type.
  - **The height profile:** the Mosjøen–Mo i Rana stretch, with the terrain as a land-tint silhouette over a km axis. The road is a river-green line, Korgfjelltunnelen is dotted, and a dotted line marks 600 moh. Huset is a copper pin with its name in italic.
  - **The distances:** «Kjøreavstand til Huset» as four figures (Trondheim, Mosjøen, Mo i Rana, Bodø), each opened by an ink rule. Each shows «ca.» km, plus minutes where the estimate is reliable. A small note follows on approximations and data credits.
- **Layout:** from 64rem the map takes columns 1–4, and the head, profile and distances sit in columns 6–12. Below that it stacks: head, map, profile, distances.
- **Motion:** it plays once, in two steps.
  - When the map is half in view, it zooms from all of Norway to the region and the road draws north from Trondheim. Each city, the E6 tag and Korgen appear as the line reaches them; Korgen gets one copper ripple.
  - When the profile is in view, the Mosjøen–Mo i Rana stretch lifts off the map, crosses the page and unrolls into the profile. The terrain then rises under it and the labels and Huset appear.
  - Only the line moves; everything else fades in. Without JavaScript, when printing or with reduced motion, the finished state is simply there.
- **Data:** `redesign/scripts/build-map.mjs` generates `src/data/norway-map.json`. The coast and borders come from Natural Earth, the route from OpenStreetMap via OSRM (ODbL), and the heights from Kartverket (CC BY 4.0). Distances are rounded and heights exaggerated, and the note says so. The note credits only OpenStreetMap, linked to its copyright page, because OSM's attribution guideline asks for the credit beside the map; it links on to the «Om» page, which credits all three sources. The whole line is never called E6, because the last stretch to Bodø is Rv 80.
- **Rule:** the profile's fill is measured terrain, not the skyline, and it does not appear anywhere else as a decorative mountain.

### Action rows
- **Style:** full-width links between hairlines, 3rem tall, ink text at 600 weight, with a river-green arrow on the right. A row can split in two with a hairline between, as with «Rom fra … / Book».
- **Hover / Focus:** text turns river green and the bottom rule darkens; the arrow nudges 0.15em right. Focus is a 2px river outline with a 3px offset.

### Buttons
- **Shape:** square (`rounded.none`), at least 3.25rem tall, with the label left and the arrow right.
- **Primary:** spruce fill, whitewash text, 640 weight. Hover goes to ink.
- **On spruce:** whitewash fill, spruce text; hover turns copper-light.
- **Go link:** the lighter alternative, a river-green link with a 1px underline drawn as a bottom border (2px on hover); the large version is set in italic Brygada.

### Menu rows
- Dish name (dish style), dot leader, price in copper; allergen numbers as small soft-ink superscripts; the description in soft ink below. Variants indent 1rem and step down in weight.
- On the menu page, rows are separated by hairlines, groups open with an italic headline over an ink rule, and the index is sticky (a horizontal strip on phones, a side list with a copper dash for the current section from 64rem).

### Photographs
- Real photographs only, `object-fit: cover` with a deliberate focal point, on a fog ground while loading.
- Huset's own photos (status «egen») carry no credit on the page; the credits page lists them. Every photo from an outside source (Wikimedia Commons, Nasjonalbiblioteket, anything licensed or not yet cleared) shows its credit: from 48rem it runs vertically along the image's outer edge in soft ink, falling back to a line under the image when it is longer than the image is tall. A full-bleed photo has no outer edge, so its credit sits as a small whitewash tab inside the bottom-right corner.
- Captions are italic Brygada, with an optional upright date.

### Placeholder
- A fog field at the target aspect ratio with an inset hairline frame and crop marks, an italic title saying what photo belongs there, and a line on what it should show.

### Proof mark («bekreftes»)
- A small outlined tag (1px current colour, label type at 0.75rem) set after any fact that is not yet confirmed. It is part of the design, not an apology; it stays visible until the fact is confirmed.

### Navigation
- The wordmark «Huset» in Brygada 560 with «Café & Motell» behind a hairline, then the nav (Mat, Rom, Selskap, Finn fram) and the phone number with a stroked river-green icon. The current item is underlined in copper, and hover uses an ink underline. On phones the nav drops to its own row below the wordmark.

### Notice («Beskjed på nettsiden»)
- When the owners switch a notice on in the CMS, a full-bleed spruce band sits above the top bar on every page: one line of whitewash text in the small step, aligned to the page grid, with no icon, label or close button. It is gone the day after its optional last day, even before the next build.

### Opening-hours table
- Days and hours between hairlines inside spruce; today's row is bolder, with a copper-light rule and an italic «i dag».

### Address («Finn fram»)
- The address leads the section, because it is what a driver needs: «Meieriveien 7» and «8646 Korgen» on two lines in Brygada 500 at display size (2.25–3.25rem), then one soft line with the area, the municipality and the coordinates («Olderneset, Hemnes · 66,0809° N, 13,8260° Ø»). The directions follow directly under it, the hours table sits to the right, and phone, e-mail and Facebook close the section in a band below. The street map follows as its own band (see «Map band»).
- The postal place is Korgen (Posten's place for 8646). Olderneset is the built-up area and is only shown as such. The footer repeats the address in an `<address>` element.
- **Data:** `website/src/data/location.ts` is the single source for the address (Kartverket), the address point the map uses, and the arrival point the directions end on. Every page and link reads from it.

### Directions («Veibeskrivelse»)
- **What:** one obvious way to get there, and a quiet way to choose the app. A slab button carries «Veibeskrivelse» in 680 weight with «Åpnes i Google Maps» (or the app in use) under it in a smaller line, and the arrow on the right. It uses the button colours: spruce on light ground, whitewash on spruce, at least 4.25rem tall. Under it, a native `<details>` with the underlined summary «Velg kartapp» and a small chevron opens a list of apps as action rows between hairlines. The list holds the phone's own map app (on Android only), Google Maps, Apple Maps (on Apple devices) and Waze. Four equal buttons are never shown.
- **Remembered choice:** choosing an app in the list opens it and saves the choice on the device. The row is then marked like today's row in the hours table: a copper rule under it and an italic «ditt valg». The button names that app, the hero and footer links follow it, and a plain «Glem valget» link appears under the list. A short note above the list says what happens: that the choice is remembered, that a saved app cannot open in this browser and where the link goes instead, or that the browser does not let the page remember.
- **Routing:** with no saved choice, Android opens the phone's own map app (`geo:`), iPhone, iPad and Mac open Apple Maps (the new URL format from iOS 18.4, the old one before that and on Mac), and everything else, including in-app browsers, opens Google Maps. The server renders the Google link, so the button works without JavaScript; the script only swaps the link once the page has loaded, without changing the layout. The page never asks for the visitor's location and never tries to detect installed apps.
- **Code:** the URL builders, platform rules and storage are plain modules in `website/src/lib/directions/` with unit tests in `website/tests/directions.test.ts`. Any link with `data-directions` follows the same choice.

### Map band («Kart»)
- **What:** a full-bleed street map in spruce that closes the homepage, between «Finn fram» and the footer, 24–36rem tall, with no heading and hair-dark rules above and below. The marker is the here-mark: a copper dot in a copper ring, a hairline stem and «Huset» on a whitewash plate in italic Brygada. Clicking it opens a whitewash popup with the name, the address and the directions links as action rows. Zoom and reset buttons are square keys stacked on the right, aligned to the page grid rather than the screen edge.
- **Map style:** the Huset map style recoloured onto spruce: forest a step darker, open land a step lighter, deep river-green water, lichen labels and the E6 in muted sand. The popup and the plate stay whitewash, the one bright thing on the map, and copper stays on the here-mark. The component also has a light tone (whitewash and fog, warm sand E6) for use on light ground.
- **Motion:** the one authored moment. The map opens wider, with Korgen, Røssåga and the E6 in view, and eases in to the house over 2.6 seconds once half of it is on screen. Any drag or zoom cancels it; reduced motion skips it.
- **Fallback:** without the map, the band shows «Kartet kunne ikke lastes», the name, the address and the directions links on spruce.
- **Code:** `website/src/components/maps/` and `website/src/lib/maps/`; the dark style is generated by `website/scripts/map-style-spruce.mjs`.

### Plain pages (menu, contact, credits, privacy, 404)
- **Head:** the page title in headline type with an italic phrase, a lede under it, and nothing above it: no eyebrow, no photo. Short pages that end after the head (the thank-you page and 404) close with extra space at the bottom rather than an empty section.
- **Lists:** a stack of entries under an ink rule with hairlines between them, each opening with an italic Brygada name at 1.25rem. On 404 the way on is action rows (Forsiden, Menyen, Rom og overnatting, Kontakt oss), then the phone number.
- **Legal text:** one 68ch column. Second-level heads are titles over an ink rule; third-level heads use title small; fourth-level heads are bold text type. Lists use plain discs in soft ink.

### Contact form
- **Shape:** fields stacked under an ink rule, labels above in bold text type, square 1px soft-ink inputs at least 3rem tall with 1.0625rem text, so phones do not zoom. E-mail and phone sit side by side from 40rem inside a fieldset whose title-small legend asks how to answer.
- **States:** hover darkens the border to ink. Focus turns it river green and doubles it with an inset ring, plus the standard focus outline. A field in error turns copper with a copper note under it. A failed send keeps what was written and shows a copper-framed message with the phone number and e-mail. The sent state replaces the form with «Takk, …» in italic headline type and a plain link to write a new message.
- **Behaviour:** field names match the old site's Netlify form, so submissions keep landing in the same place. Without JavaScript the browser posts the form and lands on `/kontakt/takk`.

### Menu board (16:9)
- The same world on a 1920×1080 screen: a whitewash board with a spruce panel on the right for drinks, the live clock and the phone number. Section heads are copper italic Brygada; dishes use the menu-row grammar scaled for reading at 3–5 m. It is drawn from the same menu data as the website.

## Do's and Don'ts

### Do:
- **Do** build structure from 1px rules and proximity: an ink rule to open a group, hairlines between rows.
- **Do** keep ornament to real, traced lines: the skyline, and the road and its height profile in the locator.
- **Do** set times, prices and phone numbers in tabular lining figures, and big when they answer the visitor's question.
- **Do** give spruce whole regions and set whitewash, lichen and copper-light on it.
- **Do** print the credit of every outside photo on the image edge or directly under it. Huset's own photos need none.
- **Do** mark unconfirmed facts with the «bekreftes» proof mark and missing photos with a crop-marked placeholder.
- **Do** keep the practical first view (status, hours, phone, and a way to the menu, rooms and directions) on desktop and mobile.

### Don't:
- **Don't** use rounded corners, shadows, gradients or glass.
- **Don't** use cards or card grids, on any surface.
- **Don't** use copper for anything but prices, the current state (a field in error included) and the here-mark (headings on the menu board excepted).
- **Don't** set labels in uppercase or put an eyebrow above a heading.
- **Don't** use stock or AI-generated imagery of the house or the landscape; use a placeholder instead. The one exception is a real photo that the owner has retouched (clutter removed, colour lifted), such as the masthead photo, and the credits page must say it is AI-retouched («KI-retusjert»).
- **Don't** turn the skyline into a pattern, a wave, a filled mountain or a logo.
