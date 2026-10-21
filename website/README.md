# husetmotell.no – the new website

The replacement for the Create React App site in the repository root, built from design concept A («Huset i Korgen»). It is a static Astro site with Tailwind CSS v4 and TypeScript. Content lives in JSON that the family edits in Pages CMS, and Netlify hosts it.

The old site stays live until this one is approved. The design system is described in [`../DESIGN.md`](../DESIGN.md), the product in [`../PRODUCT.md`](../PRODUCT.md). The concept prototypes in [`../redesign/`](../redesign/) are an archive and are not used by this app.

## Commands

Run from `website/`. Requires Node 22.12 or newer (Netlify uses 24).

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:4322 |
| `npm run build` | Static build to `dist/`. Fails if the content JSON is invalid. |
| `npm run preview` | Serves `dist/` on port 4322 |
| `npm run content` | Checks every Pages CMS file and lists problems in Norwegian, by CMS screen and field |
| `npm test` | Unit tests (`node --test`): content schemas and error messages, notice, opening hours, directions, map styles |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check` | `astro check` (types in `.astro` files) |
| `npm run maps:spruce` | Rebuilds the dark map style from the light one (run after editing `public/maps/huset-style.json`) |

## Routes

| Path | Page |
| --- | --- |
| `/` | Homepage: today's hours and status, «Her ligger Korgen», food (`#mat`), rooms (`#rom`), gatherings and meeting rooms (`#selskap`), «Korgen, før og nå» (`#korgen`), surroundings (`#rundt`), address and directions (`#finn-fram`), street map (`#kart`) |
| `/meny` | The full menu with allergens |
| `/kontakt` | Contact details and the contact form |
| `/kontakt/takk` | Thank-you page for the form without JavaScript (noindex) |
| `/anerkjennelse` | Photo credits, map data and sources |
| `/privacy` | Privacy policy in Norwegian: the contact form (Netlify), hosting, the map (OpenFreeMap), the saved map-app choice, and visitors' rights |
| `/sitemap.xml`, `/robots.txt` | Generated at build time |

The old site's `/overnatting`, `/arrangementer` and `/tjenester` became homepage sections. Each still exists as a small noindex page that forwards to `/#rom` or `/#selskap`.

Pages build as `meny.html` rather than `meny/index.html` (`build.format: 'file'`), so Netlify serves `/meny` without redirecting to `/meny/`.

## Content and Pages CMS

The CMS holds what the owners change: facts and the menu. One screen per job, one file per screen, most frequent first. Page text, headings and future articles live in code.

| CMS screen | File | Holds |
| --- | --- | --- |
| Menyen | `src/content/menu.json` | Sections, dishes, prices, variants, allergens, which dishes are featured on the homepage and which are unavailable |
| Åpningstider | `src/content/hours.json` | Opening hours per weekday |
| Beskjed på nettsiden | `src/content/notice.json` | A short message at the top of every page, with an optional last day |
| Rom og priser | `src/content/rooms.json` | Number of rooms, price from, check-in and check-out |
| Selskap og møterom | `src/content/venues.json` | Guests, cakes, extras, meeting rooms |
| Kontakt og lenker | `src/content/contact.json` | Phone, e-mail and Facebook |

- Pages CMS reads [`../.pages.yml`](../.pages.yml) at the repository root. Sign in at [app.pagescms.org](https://app.pagescms.org) with a GitHub account that has access to the repository, then pick the branch the site deploys from. Until launch that is `michaelsimsoe-huset-site-remake`; the default branch has no `.pages.yml`, so don't let Pages CMS create one there. Each save is a commit, which `dev.yml` checks, builds and uploads in a couple of minutes.
- People without GitHub can be invited by e-mail under the repository's collaborators in Pages CMS. They can edit content but not the configuration. Their saves are committed by the Pages CMS app unless `settings.commit.identity: user` is set.
- `settings.content.merge: true` keeps any keys the CMS form does not show, so a save never drops data.
- Every build validates the files against `src/data/schema.ts` (`contentFiles`), and a test fails if a JSON file in `src/content/` has no schema. A bad edit (closing before opening, a missing price, an unknown allergen, a broken link) stops the deploy, and the previous version stays live. Errors are in Norwegian and point to the field as the CMS shows it, for example `«Fra grillen» → «Husets chilliburger»: Retten trenger en pris, eller varianter med pris`.
- A failed deploy opens a GitHub issue labelled `byggfeil`, assigned to the repository owner. When the content was the problem, the issue quotes the errors for the owners. Nobody would otherwise hear of it, because the CMS app, not a person, pushed the commit. Further failures comment on the open issue, and the next successful deploy closes it.
- Most screens have a `confirmed` switch. While it is off, the site shows the «bekreftes» mark next to those facts. Turn it on once the owners have checked them.
- `featured` on a dish puts it in the homepage menu excerpt. `unavailable` («Ikke tilgjengelig nå») hides it everywhere until switched off, and a section with every dish hidden disappears.
- The notice (`notice.json`) shows while «Vis beskjeden» is on. With a last day set, the build leaves it out after that day, and a small inline script removes it from pages built earlier, so it disappears at midnight Oslo time without a rebuild. There are no separate holiday hours: the owners change the weekly hours and use the notice for the exceptions.
- Allergens use the numbers from the menu screens (1 Gluten, 2 Laktose, 3 Egg, 4 Sennep, 5 Nøtter). Adding a sixth means adding it to the `allergens` list in `menu.json` and to the select options in `.pages.yml`.
- Menu translations are planned for when the site gets more languages: the owners keep editing Norwegian, and a step in GitHub Actions writes the translations.

Managed in code, not in the CMS:

- Page text, including the occasions and catering lines under «Selskap» (`src/pages/index.astro`).
- Nearby places and whether the directions are confirmed: `src/data/site.ts`.
- Photos: files in `public/img/`, with credit and rights status in `src/data/credits.ts`. Huset's own photos (`egen`) show no credit on the page; outside photos print theirs on the image. All of them are listed on `/anerkjennelse`.
- Location: `src/data/location.ts` holds the address (Kartverket), the map point and the arrival point the directions end on.
- Map, route and skyline lines: `src/data/norway-map.json`, `route-e6.json` and `ridges.json`.
- Street map: `src/components/maps/HusetMap.astro` (MapLibre with OpenFreeMap tiles), styled by `public/maps/huset-style.json` (light) and `huset-style-spruce.json` (dark). The dark style is generated by `scripts/map-style-spruce.mjs`, and a test fails if it falls out of step with the light one. See [`../MAPS.md`](../MAPS.md).

## Map band

A full-bleed street map in the dark (spruce) tone closes the homepage, between «Finn fram» and the footer (`#kart`). `HusetMap` also has a light tone; to switch, change `tone` and drop `map-band--spruce on-spruce` from the section in `index.astro`.

- The map opens wider, with Korgen, the river and the E6 in view, and eases in to the house once, when half of it is on screen. With reduced motion it opens at the house and does not move.
- MapLibre (about 300 kB gzip, 1.1 MB raw) loads only when the band is close to the viewport. Without WebGL2, if the tiles fail or after 15 seconds, the band shows the address and the directions links instead.
- Tiles and fonts come from OpenFreeMap: free, no key, no SLA. Visitors' browsers fetch them directly, so OpenFreeMap sees their IP addresses. The map credits are on `/anerkjennelse`.

## Contact form

The form posts to Netlify Forms with the old site's form name (`contact`) and field names (`contactName`, `contactEmail`, `contactPhone`, `contactMessage`), plus a honeypot (`bot-field`). With JavaScript it sends in the background, checks the fields and shows the result in place. Without JavaScript the browser posts it and lands on `/kontakt/takk`.

The form works only on Netlify. On the dev server, in a local preview or on GitHub Pages, sending shows the failure message.

## Netlify

Netlify Forms are stored per site. To keep the existing form, its submissions and its e-mail notifications, deploy this app to the **same Netlify site** as the old one, and run it on the test site first.

The old site is built in GitHub Actions and uploaded to Netlify (`.github/workflows/prod.yml` for `master`). `.github/workflows/dev.yml` already builds this app and uploads it to the test site on every push to `test` or `michaelsimsoe-huset-site-remake`, with every page `noindex`. To launch, copy its job into `prod.yml` with two changes: production secrets, and `FORCE_INDEX` on the build:

```yaml
      - run: npm run build
        env:
          FORCE_INDEX: 'true'
      - name: Deploy to Netlify
        run: npx --yes netlify-cli@27 deploy --dir=dist --no-build --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

Keep `--no-build`: current versions of the Netlify CLI build the project before deploying unless told not to.

Search engines see the site only when the build is marked as production. Otherwise every page is `noindex`, `robots.txt` says `Disallow: /` and the sitemap is empty. A build counts as production when:

- Netlify builds it with `CONTEXT=production` and `URL` on husetmotell.no (a Netlify site connected to Git, with base directory `website`, which reads `netlify.toml`), or
- `FORCE_INDEX=true` is set. GitHub Actions builds need this, because Netlify does not set `CONTEXT` for uploaded builds.

Other environment variables: `SITE_URL` (canonical origin, default `https://www.husetmotell.no`) and `BASE_PATH` (only for hosting under a sub-path).

`public/_headers` sets long caching for `/_astro/*` and two security headers. It ships inside `dist/`, so it works for both Git builds and uploads; `netlify.toml` only holds the build settings for a Git-connected site. Unlike the old site, there is no `/* /index.html 200` fallback: unknown paths get the real 404 page.

## Before launch

Facts (turn on `confirmed` in the CMS as each is checked, or in `src/data/site.ts` where noted):

- [ ] Opening hours
- [ ] Rooms: 8 rooms, from 1 130 kr (the old English page said 1 139 kr), check-in 14:00, check-out 12:00
- [ ] Venues: up to 80 guests, cakes, outdoor seating, Sunday dinner; and the occasions and catering lines in `index.astro`
- [ ] Meeting rooms: prices, and whether they are per hour or per day
- [ ] Nearby places (`nearby.confirmed` in `site.ts`)
- [ ] The whole menu: dishes, prices and allergens
- [ ] The arrival point: the directions end in the car park between the house and the E6 (`directions.confirmed` in `site.ts`)
- [ ] Distances and drive times in «Her ligger Korgen» (calculated and rounded)

Photos (missing ones are shown as marked placeholders):

- [ ] A burger from the kitchen (placeholder under «Fra grillen» on `/meny`)
- [ ] Optional: a wide, unretouched facade photo (2:1, at least 2 400 px) to replace the AI-retouched masthead photo
- [ ] Rooms in higher resolution, especially the single room and the breakfast room
- [ ] Food as it is served, the restaurant with people in it, and a set breakfast table
- [ ] The logo as SVG

Other:

- [x] Privacy policy in Norwegian (`/privacy`), written for what the site does. Update it and its date whenever the site starts sending data somewhere new.
- [ ] Owners: confirm the promise on `/privacy` to delete messages, in Netlify and in the mailbox, once the matter is closed, and then remove its «bekreftes» mark. Optionally add the company's legal name and organisation number.
- [ ] Test the directions and the map on a real iPhone and a real Android phone. Emulated iPhone 15 and Pixel 7 pass: Apple Maps on iPhone, `geo:` on Android, the saved choice and «Glem valget», one-finger scroll over the map, the marker popup, no sideways scrolling.
- [ ] Contact form: a test message sent on the test site on 21 October 2026 was accepted («Takk, Test fra ny nettside!»). Check that it shows in Netlify → Forms → `contact` (or its spam list) and arrived as an e-mail.
- [ ] Switch `prod.yml`, deploy, then submit `https://www.husetmotell.no/sitemap.xml` in Google Search Console.

## Structure

```
src/
  content/      menu, hours, notice, rooms, venues, contact (.json, one per Pages CMS screen)
  data/         schemas and Norwegian error messages, data loaders, credits, location, map and skyline data
  lib/          hours, notice, formatting, locator geometry, directions (URL builders, platform, saved choice), maps (MapLibre frame and adapter)
  components/   Photo, Placeholder, Dish, Locator, Directions, ContactForm, Ridge, Confirm, Arrow, maps/HusetMap
  layouts/      Layout.astro (head, SEO, notice, top bar, footer)
  pages/        routes
  scripts/      browser scripts: open status, skyline and map motion, photo credits, directions, contact form
  styles/       global.css (tokens, type roles, components)
public/maps/    the light and dark map styles and the E-road shield sprite
scripts/        build-time tools: check-content.ts, map-style-spruce.mjs
tests/          node --test suites
```
