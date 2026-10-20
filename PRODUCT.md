# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro, Tailwind CSS v4, TypeScript, Netlify, Pages CMS (user-specified for the replacement site). The legacy Create React App in the repository root remains the production site until a replacement is approved; design prototypes live in an isolated `redesign/` app and are never deployed in the exploration phase.

## Users

1. **Locals in Korgen and Hemnes** want the menu, prices, opening hours and contact details, often on a phone, often deciding where to eat tonight.
2. **E6 travellers** need a quick food stop: are they open now, what can I eat, how do I get there. Usually mobile, often in a car.
3. **Motel guests** look for accommodation, what a room includes, and how to book or call.
4. **Visitors exploring Helgeland** need a base: accommodation plus a sense of the surroundings (Okstindan, Korgfjellet, Røssåga).
5. **Groups and businesses** look for meetings, dining for a group and practical accommodation.

## Product Purpose

Huset Café & Motell is a family-owned roadside restaurant and motel in Korgen, Hemnes, inland Helgeland, on the E6. The website gets hungry and tired people to the door: menu, opening hours, directions and rooms, without friction. Success means a visitor finds what they came for within seconds, on a phone, and either drives in, calls, or books.

## Positioning

A real, approachable place in a white building beside the E6, where locals eat, families visit, motorists stop and travellers sleep. Its setting is remarkable (Okstindan, Korgfjellet, Røssåga and Korgen itself); its hospitality is everyday and human. The site celebrates that contrast. It is not a luxury resort, a mountain lodge or a generic Scandinavian boutique hotel.

## Operating Context

- The restaurant shows its menu on three 16:9 digital screens. The website and those screens will eventually share one structured menu dataset (name, description, price, allergens, category).
- Allergen key used on the screens: 1 = Gluten, 2 = Laktose, 3 = Egg, 4 = Sennep, 5 = Nøtter.
- Rooms are booked via Booking.com or by phone/e-mail; payment on arrival unless otherwise agreed.
- Content will be maintained by the family through Pages CMS (not integrated during design exploration).

## Capabilities and Constraints

- Primary language: Norwegian Bokmål. English is secondary.
- Call the place **Korgen**. Nobody there calls it «dalen», so copy never says «i dalen», «Dalen» or «the valley».
- Facts from the live site, to be shown **marked as unverified ("bekreftes")** until the owners confirm them:
  - Opening hours: Mon–Fri 10–21, Sat 11–21, Sun 13–19.
  - 8 rooms, breakfast included, from NOK 1 130 (English copy says 1 139; discrepancy unresolved).
  - Check-in from 14:00, check-out by 12:00.
  - Meeting room, private parties and catering are offered; cakes to order.
- Confirmed contact: phone +47 403 17 353, e-mail kontakt@husetmotell.no, Facebook facebook.com/Husetcafe. Location approx. 66.0808 N, 13.8257 E, near Korgensenteret.
- The current menu (categories, dishes, prices, allergens) is taken from the three menu-board screens supplied by the owners.
- Never invent amenities, prices, opening hours, reviews or business claims.
- Exploration phase only: no CMS integration, no full content migration, no hosting change, no deployment.

## Brand Commitments

- Name: **Huset Café & Motell**. Existing wordmark: serif "HUSET" under a roofline outline, "CAFÉ & MOTELL" beneath.
- The building is white (repainted); older yellow-facade photos are outdated.
- The menu screens' emotional character (dark green-charcoal ground, copper headings, turquoise descriptions, bright dish names, large food photography) should be preserved in spirit; their exact layout, typography and palette are not binding.
- Photography must be realistic and authentic; licensing and photographer attribution stay visible; missing production assets are clearly marked placeholders.

## Evidence on Hand

- Menu screens: `C:\Users\micha\Downloads\husetmotell\meny\skjerm1.png` (pizza, drinks), `skjerm2.png` (grill, fish, småretter, ekstra), `skjerm3.png` (salads, pita, omelettes, children's menu).
- Current photos of the white building, entrance, reception wall (Skydsstation Oldernæs sign) and meeting room: `C:\Users\micha\Downloads\husetmotell\` (sources and rights to be confirmed).
- Legacy site photos in `src/pages/*/assets` (rooms, restaurant interior, sushi platters, outdated yellow facade). Several food/event images there are generic stock and must not be presented as Huset.
- Regional landscape photography on Wikimedia Commons with explicit licences (Okstindan, Korgen, Røssåga, Korgfjellet).
- Current-state information architecture: `SITE-MAP.md`.
- No reviews, testimonials, awards or press are on hand; none may be fabricated.

## Product Principles

1. **Practical first.** Open now?, menu, directions and rooms are always one tap away.
2. **Real place, real people.** Show the actual building, rooms and food; label anything that is not.
3. **The landscape is context, not costume.** Okstindan, Korgfjellet and Røssåga frame the everyday; they never turn Huset into a lodge.
4. **One menu, everywhere.** The website and the in-restaurant screens read from the same structured data.
5. **Honest facts.** Unverified facts are marked until the owners confirm them.

## Accessibility & Inclusion

Accessible navigation, readable text and excellent mobile layouts are required. Target WCAG 2.2 AA (assumed standard; not formally specified by the owners). Respect reduced-motion preferences.
