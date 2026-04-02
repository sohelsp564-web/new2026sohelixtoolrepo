/**
 * Prerender script — runs after Vite build via "postbuild".
 * Extracts all routes from tools.ts / blogPosts.ts and passes
 * them to react-snap for full static HTML generation.
 *
 * Improvements over v1:
 *  - waitFor raised to 1000ms for lazy components + locale JSON
 *  - waitForSelector: "main" ensures page content has mounted
 *  - puppeteer.waitUntil: "networkidle0" waits for all async chunks
 *  - Additional Puppeteer flags for CI/sandbox compatibility
 *  - Per-category route counts and elapsed time logging
 *  - Graceful error exit
 */

import { readFileSync } from 'fs';
import { run } from 'react-snap';

// ── Slug extractor (mirrors generate-sitemap.js logic) ────────────
function extractSlugs(src, varName) {
  const re = new RegExp(`export\\s+const\\s+${varName}[^=]*=\\s*\\[`, 's');
  const match = re.exec(src);
  if (!match) return [];
  let depth = 1, i = match.index + match[0].length;
  while (i < src.length && depth > 0) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') depth--;
    i++;
  }
  const raw = src.slice(match.index + match[0].length, i - 1);
  return [...raw.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
}

// ── Read source files ─────────────────────────────────────────────
const toolsSrc  = readFileSync('src/data/tools.ts',    'utf-8');
const blogSrc   = readFileSync('src/data/blogPosts.ts', 'utf-8');

const toolSlugs     = extractSlugs(toolsSrc, 'tools');
const categorySlugs = extractSlugs(toolsSrc, 'categories');
const blogSlugs     = extractSlugs(blogSrc,  'blogPosts');

// ── Build full route list ─────────────────────────────────────────
const staticPages = [
  '/',
  '/categories',
  '/blog',
  '/about',
  '/contact',
  '/privacy',
  '/privacy-policy',
  '/terms-of-service',
  '/disclaimer',
  '/faq',
  '/request-tool',
];

const toolRoutes     = toolSlugs.map(s     => `/tools/${s}`);
const categoryRoutes = categorySlugs.map(s => `/category/${s}`);
const blogRoutes     = blogSlugs.map(s     => `/blog/${s}`);

const routes = [
  ...staticPages,
  ...toolRoutes,
  ...categoryRoutes,
  ...blogRoutes,
];

// ── Log route breakdown ───────────────────────────────────────────
console.log('\n[prerender] Route breakdown:');
console.log(`  Static pages : ${staticPages.length}`);
console.log(`  Tool pages   : ${toolRoutes.length}`);
console.log(`  Category pages: ${categoryRoutes.length}`);
console.log(`  Blog posts   : ${blogRoutes.length}`);
console.log(`  ─────────────────────────────`);
console.log(`  Total        : ${routes.length} routes\n`);

console.log('[prerender] Routes to snapshot:');
routes.forEach((r, i) => console.log(`  [${String(i + 1).padStart(3)}] ${r}`));
console.log('\n[prerender] Starting react-snap...\n');

const startTime = Date.now();

// ── Run react-snap ────────────────────────────────────────────────
run({
  // Vite outputs to dist/, not build/
  source:      'dist',
  destination: 'dist',

  // All discovered routes — no crawling needed
  include: routes,
  crawl:   false,

  // Wait for:
  //  1. Suspense lazy chunks to resolve
  //  2. useToolTranslation async locale JSON to load
  //  3. React Helmet to apply <title> / <meta> tags
  waitFor: 1000,

  // Ensure the main content area has mounted before snapshotting.
  // "main" is the <main> element wrapping all page content in App.tsx
  // and exists on every route, so it is safe as a universal selector.
  waitForSelector: 'main',

  // Wait for all network requests (lazy JS chunks + locale JSON) to finish.
  // "networkidle0" = no connections for 500 ms — most thorough option.
  puppeteer: {
    waitUntil: 'networkidle0',
  },

  // Puppeteer / Chrome flags for CI and sandboxed environments
  // (required on Cloudflare Pages build workers and most Linux CI)
  puppeteerArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-first-run',
    '--no-zygote',
  ],

  // Preserve full readable HTML — do not minify
  minifyHtml: false,

  // Strip data: blob URLs from the snapshot (images remain as URLs)
  removeBlobs: true,

  // react-snap starts its own server from the dist folder
  externalServer: false,

}).then(() => {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n[prerender] ✓ Successfully snapshotted ${routes.length} routes in ${elapsed}s`);
  console.log('[prerender] ✓ dist/ now contains prerendered HTML for all pages\n');
}).catch(err => {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.error(`\n[prerender] ✗ Failed after ${elapsed}s`);
  console.error('[prerender] Error:', err.message || err);
  process.exit(1);
});
