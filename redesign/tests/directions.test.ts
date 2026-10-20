import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { addressLine, location } from '../src/data/location.ts';
import {
  appleDirections,
  appleSystemNavigation,
  assertLatLon,
  directionsHref,
  formatLatLon,
  googleDirections,
  googleMapLink,
  googleNavigationIntent,
  isLatLon,
  osmMapLink,
  systemGeoUri,
  wazeDirections,
} from '../src/lib/directions/links.ts';
import {
  availableProviders,
  defaultProvider,
  detectPlatform,
  systemScheme,
  UNKNOWN_PLATFORM,
  usesUnifiedAppleUrls,
} from '../src/lib/directions/platform.ts';
import {
  clearPreference,
  getStorage,
  PREFERENCE_KEY,
  readPreference,
  savePreference,
  type StorageLike,
} from '../src/lib/directions/preferences.ts';
import { initialDirections, resolveDirections } from '../src/lib/directions/resolve.ts';

const ARRIVAL = { lat: 66.081075, lon: 13.825683 };
const DEST = { point: ARRIVAL, label: 'Huset Café & Motell' };

const UA = {
  iphone17: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  iphone184: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Mobile/15E148 Safari/604.1',
  iphoneSafari26: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
  iphoneChrome: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.54 Mobile/15E148 Safari/604.1',
  iphoneFacebook: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/470.0.0.40.97;FBBV/650000000;FBDV/iPhone15,2;FBMD/iPhone;FBSN/iOS;FBSV/18.5;FBSS/3;FBCR/;FBID/phone;FBLC/nb_NO;FBOP/5]',
  ipadDesktop: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15',
  mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15',
  androidChrome: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
  androidWebView: 'Mozilla/5.0 (Linux; Android 13; Pixel 7 Build/TQ3A.230805.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.71 Mobile Safari/537.36',
  androidFacebook: 'Mozilla/5.0 (Linux; Android 14; SM-S911B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.71 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/470.0.0.43.108;]',
  windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  linux: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
};

function memoryStorage(initial: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = String(v);
    },
    removeItem: (k) => {
      delete data[k];
    },
  };
}

describe('location', () => {
  it('renders the official address', () => {
    assert.equal(addressLine, 'Meieriveien 7, 8646 Korgen');
  });

  it('holds valid marker and arrival points close to each other', () => {
    assert.ok(isLatLon(location.addressPoint));
    assert.ok(isLatLon(location.arrival));
    // Both points belong to the same building: well within 50 m.
    const dLat = (location.arrival.lat - location.addressPoint.lat) * 111_320;
    const dLon = (location.arrival.lon - location.addressPoint.lon) * 111_320 * Math.cos((66.08 * Math.PI) / 180);
    assert.ok(Math.hypot(dLat, dLon) < 50);
  });
});

describe('URL builders', () => {
  it('builds Google Maps driving directions with an encoded comma', () => {
    assert.equal(
      googleDirections(ARRIVAL),
      'https://www.google.com/maps/dir/?api=1&destination=66.081075%2C13.825683&travelmode=driving&dir_action=navigate',
    );
  });

  it('builds unified and legacy Apple Maps directions', () => {
    assert.equal(appleDirections(ARRIVAL), 'https://maps.apple.com/directions?destination=66.081075,13.825683&mode=driving');
    assert.equal(appleDirections(ARRIVAL, { legacy: true }), 'https://maps.apple.com/?daddr=66.081075,13.825683&dirflg=d');
  });

  it('builds a Waze navigation link', () => {
    assert.equal(wazeDirections(ARRIVAL), 'https://waze.com/ul?ll=66.081075%2C13.825683&navigate=yes');
  });

  it('builds an Android geo: URI with a strictly encoded label', () => {
    assert.equal(
      systemGeoUri(ARRIVAL, 'Huset Café & Motell'),
      'geo:0,0?q=66.081075,13.825683(Huset%20Caf%C3%A9%20%26%20Motell)',
    );
    assert.equal(systemGeoUri(ARRIVAL, "Bob's (gamle) kro!*"), "geo:0,0?q=66.081075,13.825683(Bob%27s%20%28gamle%29%20kro%21%2A)");
  });

  it('omits an empty label and tidies long or messy ones', () => {
    assert.equal(systemGeoUri(ARRIVAL), 'geo:0,0?q=66.081075,13.825683');
    assert.equal(systemGeoUri(ARRIVAL, '   '), 'geo:0,0?q=66.081075,13.825683');
    assert.equal(systemGeoUri(ARRIVAL, '  Huset \n  Korgen '), 'geo:0,0?q=66.081075,13.825683(Huset%20Korgen)');
    const long = systemGeoUri(ARRIVAL, 'x'.repeat(200));
    assert.equal(long, `geo:0,0?q=66.081075,13.825683(${'x'.repeat(80)})`);
  });

  it('builds the native navigation intents', () => {
    assert.equal(googleNavigationIntent(ARRIVAL), 'google.navigation:q=66.081075,13.825683&mode=d');
    assert.equal(appleSystemNavigation(ARRIVAL), 'geo-navigation:///directions?destination=66.081075,13.825683');
  });

  it('builds map links for the address point', () => {
    const point = { lat: 66.080937, lon: 13.825965 };
    assert.equal(googleMapLink(point), 'https://www.google.com/maps/search/?api=1&query=66.080937%2C13.825965');
    assert.equal(osmMapLink(point), 'https://www.openstreetmap.org/?mlat=66.080937&mlon=13.825965#map=17/66.080937/13.825965');
    assert.equal(osmMapLink(point, 40), 'https://www.openstreetmap.org/?mlat=66.080937&mlon=13.825965#map=19/66.080937/13.825965');
  });

  it('routes each provider through directionsHref', () => {
    assert.equal(directionsHref('google', ARRIVAL), googleDirections(ARRIVAL));
    assert.equal(directionsHref('apple', ARRIVAL, { appleLegacy: true }), appleDirections(ARRIVAL, { legacy: true }));
    assert.equal(directionsHref('waze', ARRIVAL), wazeDirections(ARRIVAL));
    assert.equal(directionsHref('system', ARRIVAL, { systemScheme: 'geo', label: 'Huset' }), systemGeoUri(ARRIVAL, 'Huset'));
    assert.equal(directionsHref('system', ARRIVAL, { systemScheme: 'geo-navigation' }), appleSystemNavigation(ARRIVAL));
    // Without a system handler, «system» must still produce a working link.
    assert.equal(directionsHref('system', ARRIVAL), googleDirections(ARRIVAL));
  });
});

describe('coordinates', () => {
  it('formats to six decimals and trims zeros', () => {
    assert.equal(formatLatLon({ lat: 66.08, lon: 13.8 }), '66.08,13.8');
    assert.equal(formatLatLon({ lat: 66.0809374, lon: 13.8259651 }), '66.080937,13.825965');
    assert.equal(formatLatLon({ lat: 10, lon: 100 }), '10,100');
    assert.equal(formatLatLon({ lat: -0, lon: 0 }), '0,0');
    assert.equal(formatLatLon({ lat: -0.0000001, lon: 1e-7 }), '0,0');
    assert.equal(formatLatLon({ lat: -33.5, lon: -70.25 }), '-33.5,-70.25');
  });

  for (const [name, value] of [
    ['NaN', { lat: Number.NaN, lon: 13 }],
    ['Infinity', { lat: 66, lon: Number.POSITIVE_INFINITY }],
    ['latitude out of range', { lat: 91, lon: 13 }],
    ['longitude out of range', { lat: 66, lon: -181 }],
    ['strings', { lat: '66', lon: '13' }],
    ['null', null],
    ['undefined', undefined],
    ['missing longitude', { lat: 66 }],
  ] as const) {
    it(`rejects ${name}`, () => {
      assert.equal(isLatLon(value), false);
      assert.throws(() => assertLatLon(value), RangeError);
      assert.throws(() => googleDirections(value as never), RangeError);
      assert.throws(() => systemGeoUri(value as never, 'Huset'), RangeError);
    });
  }
});

describe('platform detection', () => {
  const cases: [keyof typeof UA, number, string, [number, number] | null, boolean][] = [
    ['iphone17', 5, 'ios', [17, 5], false],
    ['iphone184', 5, 'ios', [18, 4], false],
    ['iphoneSafari26', 5, 'ios', [26, 0], false],
    ['iphoneChrome', 5, 'ios', [17, 5], false],
    ['iphoneFacebook', 5, 'ios', [18, 5], true],
    ['ipadDesktop', 5, 'ios', [18, 4], false],
    ['mac', 0, 'macos', null, false],
    ['androidChrome', 5, 'android', null, false],
    ['androidWebView', 5, 'android', null, true],
    ['androidFacebook', 5, 'android', null, true],
    ['windows', 0, 'windows', null, false],
    ['linux', 0, 'linux', null, false],
  ];
  for (const [ua, touch, os, version, inApp] of cases) {
    it(`reads ${ua}`, () => {
      assert.deepEqual(detectPlatform({ userAgent: UA[ua], maxTouchPoints: touch }), { os, version, inApp });
    });
  }

  it('treats a missing user agent as an unknown desktop', () => {
    assert.deepEqual(detectPlatform(), UNKNOWN_PLATFORM);
  });
});

describe('defaults', () => {
  const p = (ua: keyof typeof UA, touch = 0) => detectPlatform({ userAgent: UA[ua], maxTouchPoints: touch });

  it('hands Android browsers to the system map handler', () => {
    assert.equal(systemScheme(p('androidChrome', 5)), 'geo');
    assert.equal(defaultProvider(p('androidChrome', 5)), 'system');
    assert.deepEqual(availableProviders(p('androidChrome', 5)), ['system', 'google', 'apple', 'waze']);
  });

  it('gives Android in-app browsers an HTTPS link instead', () => {
    for (const ua of ['androidWebView', 'androidFacebook'] as const) {
      assert.equal(systemScheme(p(ua, 5)), null);
      assert.equal(defaultProvider(p(ua, 5)), 'google');
      assert.deepEqual(availableProviders(p(ua, 5)), ['google', 'apple', 'waze']);
    }
  });

  it('defaults Apple devices to Apple Maps in the format they understand', () => {
    assert.equal(defaultProvider(p('iphone17', 5)), 'apple');
    assert.equal(usesUnifiedAppleUrls(p('iphone17', 5)), false);
    assert.equal(usesUnifiedAppleUrls(p('iphone184', 5)), true);
    assert.equal(usesUnifiedAppleUrls(p('iphoneSafari26', 5)), true);
    assert.equal(usesUnifiedAppleUrls(p('ipadDesktop', 5)), true);
    assert.equal(defaultProvider(p('mac')), 'apple');
    assert.equal(usesUnifiedAppleUrls(p('mac')), false);
  });

  it('defaults everything else to Google Maps', () => {
    assert.equal(defaultProvider(p('windows')), 'google');
    assert.equal(defaultProvider(p('linux')), 'google');
    assert.equal(defaultProvider(UNKNOWN_PLATFORM), 'google');
    assert.equal(usesUnifiedAppleUrls(p('windows')), true);
    assert.equal(usesUnifiedAppleUrls(UNKNOWN_PLATFORM), false);
  });

  it('keeps Apple’s system handler behind its flag', () => {
    const on = { appleSystemHandler: true };
    assert.equal(systemScheme(p('iphone184', 5)), null);
    assert.equal(systemScheme(p('iphone184', 5), on), 'geo-navigation');
    assert.equal(defaultProvider(p('iphone184', 5), on), 'system');
    assert.equal(systemScheme(p('iphone17', 5), on), null);
    assert.equal(defaultProvider(p('iphone17', 5), on), 'apple');
    assert.equal(systemScheme(p('mac'), on), null);
  });
});

describe('preferences', () => {
  it('reads a stored choice', () => {
    assert.equal(readPreference(memoryStorage({ [PREFERENCE_KEY]: 'waze' })), 'waze');
  });

  it('reads missing, blocked or junk values as no choice, without touching them', () => {
    assert.equal(readPreference(null), null);
    assert.equal(readPreference(memoryStorage()), null);
    const junk = memoryStorage({ [PREFERENCE_KEY]: 'bing' });
    assert.equal(readPreference(junk), null);
    assert.equal(junk.data[PREFERENCE_KEY], 'bing');
    const throwing: StorageLike = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {},
      removeItem: () => {},
    };
    assert.equal(readPreference(throwing), null);
  });

  it('survives a localStorage getter that throws', () => {
    const blocked = {
      get localStorage(): StorageLike {
        throw new Error('SecurityError');
      },
    };
    assert.equal(getStorage(blocked), null);
    assert.equal(getStorage(null), null);
    assert.equal(getStorage({}), null);
  });

  it('saves and clears an explicit choice', () => {
    const s = memoryStorage();
    assert.equal(savePreference(s, 'apple'), true);
    assert.equal(s.data[PREFERENCE_KEY], 'apple');
    assert.equal(clearPreference(s), true);
    assert.equal(PREFERENCE_KEY in s.data, false);
  });

  it('reports failure when storage is full or missing', () => {
    const full: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => {
        throw new Error('SecurityError');
      },
    };
    assert.equal(savePreference(full, 'google'), false);
    assert.equal(clearPreference(full), false);
    assert.equal(savePreference(null, 'google'), false);
    assert.equal(savePreference(memoryStorage(), 'bing' as never), false);
  });
});

describe('resolving a tap', () => {
  const windows = detectPlatform({ userAgent: UA.windows });
  const android = detectPlatform({ userAgent: UA.androidChrome, maxTouchPoints: 5 });
  const iphone17 = detectPlatform({ userAgent: UA.iphone17, maxTouchPoints: 5 });

  it('uses the saved choice when this device can open it', () => {
    assert.deepEqual(resolveDirections(DEST, 'waze', windows), {
      provider: 'waze',
      href: wazeDirections(ARRIVAL),
      reason: 'saved',
    });
    assert.deepEqual(resolveDirections(DEST, 'apple', iphone17), {
      provider: 'apple',
      href: appleDirections(ARRIVAL, { legacy: true }),
      reason: 'saved',
    });
  });

  it('falls back without overwriting a choice this device cannot open', () => {
    const s = memoryStorage({ [PREFERENCE_KEY]: 'system' });
    const r = resolveDirections(DEST, readPreference(s), windows);
    assert.deepEqual(r, { provider: 'google', href: googleDirections(ARRIVAL), reason: 'fallback' });
    assert.equal(s.data[PREFERENCE_KEY], 'system');
    // The same choice still applies on the phone it was made on.
    assert.equal(resolveDirections(DEST, readPreference(s), android).provider, 'system');
  });

  it('uses the platform default when nothing is saved', () => {
    assert.deepEqual(resolveDirections(DEST, null, android), {
      provider: 'system',
      href: 'geo:0,0?q=66.081075,13.825683(Huset%20Caf%C3%A9%20%26%20Motell)',
      reason: 'default',
    });
    assert.equal(resolveDirections(DEST, null, iphone17).href, 'https://maps.apple.com/?daddr=66.081075,13.825683&dirflg=d');
    assert.equal(resolveDirections(DEST, null, windows).href, googleDirections(ARRIVAL));
  });
});

describe('server render', () => {
  it('runs without a browser and renders a universal HTTPS link', async () => {
    assert.equal(typeof (globalThis as { window?: unknown }).window, 'undefined');
    assert.deepEqual(initialDirections(DEST), { provider: 'google', href: googleDirections(ARRIVAL), reason: 'default' });
    // Importing the browser module must not touch DOM globals.
    const mod = await import('../src/lib/directions/enhance.ts');
    assert.equal(typeof mod.mountDirections, 'function');
  });
});
