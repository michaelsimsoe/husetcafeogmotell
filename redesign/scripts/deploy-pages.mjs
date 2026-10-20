// Build the prototypes for GitHub Pages and publish them to the deploy-only repo.
//
//   npm run deploy:pages            build, verify, push to michaelsimsoe/huset-konsepter
//   npm run deploy:pages -- --dry   build and verify only
//
// The deploy repo holds built files only. Each deploy replaces its history.
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, relative } from 'node:path';

const OWNER = 'michaelsimsoe';
const REPO = 'huset-konsepter';
const BASE = `/${REPO}`;
const SITE = `https://${OWNER}.github.io`;
const URL = `${SITE}${BASE}/`;
const DIST = 'dist';
const dry = process.argv.includes('--dry');

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: 'inherit', ...opts });

run(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
  env: { ...process.env, SITE_URL: SITE, BASE_PATH: BASE },
});

// Every root-relative reference in the output must sit under the base path.
const escaped = [
  /(?:href|src|action|poster)=["']\/(?!\/|huset-konsepter(?:[/"']|$))[^"']*/g,
  /(?:srcset=["']|,\s*)\/(?!\/|huset-konsepter\/)[^\s,"']+\s+\d+w/g,
  /url\(\s*["']?\/(?!\/|huset-konsepter\/)[^)"']*/g,
  /["'`]\/(?:img|concepts|favicon)[^"'`]*/g,
];
const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? files(join(dir, d.name)) : [join(dir, d.name)],
  );
const problems = [];
for (const file of files(DIST).filter((f) => ['.html', '.css', '.js'].includes(extname(f)))) {
  const text = readFileSync(file, 'utf8');
  for (const re of escaped) {
    for (const m of text.matchAll(re)) problems.push(`${relative(DIST, file)}: ${m[0].slice(0, 90)}`);
  }
}
if (problems.length) {
  console.error(`\n${problems.length} path(s) escape ${BASE}:\n  ${problems.slice(0, 40).join('\n  ')}`);
  process.exit(1);
}
console.log(`\nVerified: all root-relative paths sit under ${BASE}/`);

// Pages runs Jekyll by default, which drops folders starting with "_" (Astro's _astro/).
writeFileSync(join(DIST, '.nojekyll'), '');
writeFileSync(
  join(DIST, 'README.md'),
  `# Huset Café & Motell – designkonsepter (forhåndsvisning)

Bygget versjon av designprototypene A, B og C, for intern gjennomgang. Ikke produksjon, og sidene er merket \`noindex\`.

**Se konseptene:** ${URL}

Kilden ligger i \`michaelsimsoe/husetcafeogmotell\` under \`redesign/\`. Ikke rediger her: alt overskrives ved hver publisering (\`npm run deploy:pages\`).

Fakta merket «bekreftes» og bilder merket «Rettigheter avklares» er ikke avklart ennå.
`,
);

if (dry) {
  console.log(`Dry run: ${DIST}/ is ready for ${URL}`);
  process.exit(0);
}

const tmp = mkdtempSync(join(tmpdir(), `${REPO}-`));
try {
  cpSync(DIST, tmp, { recursive: true });
  const git = (...args) => run('git', args, { cwd: tmp });
  git('init', '--quiet', '--initial-branch=main');
  git('config', 'core.autocrlf', 'false');
  git('add', '--all');
  const message = process.env.DEPLOY_MESSAGE ?? `Publiser designkonsepter ${new Date().toISOString().slice(0, 16)}`;
  git('commit', '--quiet', '-m', message);
  git('push', '--force', `https://github.com/${OWNER}/${REPO}.git`, 'HEAD:main');
  console.log(`\nPublished. GitHub Pages will serve it at ${URL} within a minute or two.`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
