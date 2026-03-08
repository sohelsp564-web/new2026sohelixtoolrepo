/**
 * Automatic sitemap generator — runs before each build.
 * Reads tools + blog data and writes XML sitemaps to public/.
 */
import { readFileSync, writeFileSync } from 'fs';

const DOMAIN = 'https://tools.sohelix.com';
const TODAY = new Date().toISOString().split('T')[0];

// ── Parse tools & blog data from source ──────────────────────────
function extractArray(src, varName) {
  // Match the array assigned to `export const <varName>: ...[] = [...]`
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
  // Extract slugs via regex (more robust than eval)
  return [...raw.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
}

const toolsSrc = readFileSync('src/data/tools.ts', 'utf-8');
const blogSrc = readFileSync('src/data/blogPosts.ts', 'utf-8');

const toolSlugs = extractArray(toolsSrc, 'tools');
const categorySlugs = extractArray(toolsSrc, 'categories');
const blogSlugs = extractArray(blogSrc, 'blogPosts');

console.log(`[sitemap] Found ${toolSlugs.length} tools, ${categorySlugs.length} categories, ${blogSlugs.length} blog posts`);

// ── Helpers ──────────────────────────────────────────────────────
const url = (loc, freq, priority) =>
  `  <url><loc>${DOMAIN}${loc}</loc><lastmod>${TODAY}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`;

const wrap = (body) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;

// ── pages-sitemap.xml ────────────────────────────────────────────
const pages = [
  url('/', 'daily', '1.0'),
  url('/categories', 'weekly', '0.9'),
  url('/blog', 'weekly', '0.8'),
  url('/about', 'monthly', '0.5'),
  url('/contact', 'monthly', '0.5'),
  url('/privacy-policy', 'monthly', '0.3'),
  url('/terms-of-service', 'monthly', '0.3'),
  url('/disclaimer', 'monthly', '0.3'),
  url('/faq', 'monthly', '0.5'),
  url('/request-tool', 'monthly', '0.4'),
  '',
  '  <!-- Category Pages -->',
  ...categorySlugs.map(s => url(`/category/${s}`, 'weekly', '0.8')),
  '',
  '  <!-- Blog Posts -->',
  ...blogSlugs.map(s => url(`/blog/${s}`, 'monthly', '0.7')),
];
writeFileSync('public/pages-sitemap.xml', wrap(pages.join('\n')));

// ── tools-sitemap.xml ────────────────────────────────────────────
const toolUrls = toolSlugs.map(s => url(`/tools/${s}`, 'weekly', '0.8'));
writeFileSync('public/tools-sitemap.xml', wrap(toolUrls.join('\n')));

// ── sitemap.xml (index) ──────────────────────────────────────────
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/pages-sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/tools-sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>`;
writeFileSync('public/sitemap.xml', sitemapIndex);

// ── robots.txt ───────────────────────────────────────────────────
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}/sitemap.xml\n`);

console.log('[sitemap] Generated sitemap.xml, pages-sitemap.xml, tools-sitemap.xml, robots.txt');
