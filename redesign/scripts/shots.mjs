// Screenshot helper for the concept prototypes.
// Usage:
//   node scripts/shots.mjs <path-or-url> <out.png> [--w 1440] [--h 900] [--full] [--motion] [--wait 600]
//   node scripts/shots.mjs --batch jobs.json
// jobs.json: [{ "url": "/concepts/a", "out": "screenshots/a-desktop.png", "w": 1440, "h": 900, "full": true }]
// Defaults: base http://localhost:4321, prefers-reduced-motion: reduce (so entrance motion is settled).
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const BASE = process.env.SHOTS_BASE ?? 'http://localhost:4321';
const local = process.env.LOCALAPPDATA ?? '';
const candidates = [
  process.env.CHROME_PATH,
  join(local, 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe'),
  join(local, 'ms-playwright', 'chromium-1234', 'chrome-win64', 'chrome.exe'),
].filter(Boolean);
const executablePath = candidates.find((p) => existsSync(p));

function parseArgs(argv) {
  const out = { full: false, motion: false, w: 1440, h: 900, wait: 500 };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--full') out.full = true;
    else if (a === '--motion') out.motion = true;
    else if (a === '--w') out.w = Number(argv[++i]);
    else if (a === '--h') out.h = Number(argv[++i]);
    else if (a === '--wait') out.wait = Number(argv[++i]);
    else if (a === '--batch') out.batch = argv[++i];
    else rest.push(a);
  }
  out.url = rest[0];
  out.out = rest[1];
  return out;
}

const args = parseArgs(process.argv.slice(2));
const jobs = args.batch ? JSON.parse(readFileSync(args.batch, 'utf8')) : [args];

const browser = await chromium.launch({ executablePath, headless: true });
const consoleErrors = [];
for (const job of jobs) {
  const w = job.w ?? 1440;
  const h = job.h ?? 900;
  const context = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: job.dpr ?? 1,
    reducedMotion: job.motion ? 'no-preference' : 'reduce',
    locale: 'nb-NO',
    timezoneId: 'Europe/Oslo',
  });
  const page = await context.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(`${job.url}: ${msg.text()}`);
  });
  page.on('pageerror', (err) => consoleErrors.push(`${job.url}: ${err.message}`));
  const url = job.url.startsWith('http') ? job.url : BASE + job.url;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (job.full) {
    // Trigger lazy images by scrolling through the page once, then return to top.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
  }
  await page.waitForTimeout(job.wait ?? 500);
  mkdirSync(dirname(job.out), { recursive: true });
  await page.screenshot({ path: job.out, fullPage: !!job.full });
  console.log(`saved ${job.out} (${w}x${h}${job.full ? ', full' : ''})`);
  await context.close();
}
await browser.close();
if (consoleErrors.length) {
  console.log('CONSOLE ERRORS:');
  for (const e of consoleErrors) console.log('  ' + e);
}
