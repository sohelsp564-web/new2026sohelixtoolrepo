/**
 * Prerender script — runs after Vite build via "postbuild".
 * Extracts all routes from tools.ts / blogPosts.ts and
 * passes them to react-snap for static HTML generation.
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
const toolsSrc  = readFileSync('src/data/tools.ts', 'utf-8');
const blogSrc   = readFileSync('src/data/blogPosts.ts', 'utf-8');

const toolSlugs     = extractSlugs(toolsSrc, 'tools');
const categorySlugs = extractSlugs(toolsSrc, 'categories');
const blogSlugs     = extractSlugs(blogSrc, 'blogPosts');

console.log(
  `[prerender] ${toolSlugs.length} tools | ` +
  `${categorySlugs.length} categories | ` +
  `${blogSlugs.length} blog posts`
);

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
  '/tools/image-resizer',
];

const routes = [
  ...staticPages,
  ...toolSlugs.map(s => `/tools/${s}`),
  ...categorySlugs.map(s => `/category/${s}`),
  ...blogSlugs.map(s => `/blog/${s}`),
];

console.log(`[prerender] Total routes to snapshot: ${routes.length}`);

// ── Run react-snap ────────────────────────────────────────────────
run({
  // Vite outputs to dist/, not build/
  source: 'dist',
  destination: 'dist',

  // All discovered routes
  include: routes,

  // Don't auto-crawl for additional links (we supply them all)
  crawl: false,

  // Wait for async content (Helmet, lazy components)
  waitFor: 500,

  // Puppeteer flags required for CI / sandbox environments
  puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox'],

  // Preserve all HTML — do not minify
  minifyHtml: false,

  // Keep React Helmet meta tags intact
  removeBlobs: true,

  // Ensure external resources don't block rendering
  externalServer: false,
}).catch(err => {
  console.error('[prerender] react-snap failed:', err);
  process.exit(1);
});
