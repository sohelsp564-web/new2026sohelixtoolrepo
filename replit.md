# Sohelix Tools

A comprehensive web-based platform offering 50+ free online utilities across multiple categories, built with React, Vite, and TypeScript.

## Project Overview

All tools run entirely in the browser — no file uploads to a server, no registration required. This ensures privacy and speed for users.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite (dev server on port 5000)
- **Styling**: Tailwind CSS + shadcn/ui + Radix UI primitives
- **Routing**: React Router v6
- **SSG**: vite-react-ssg (for production static site generation)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **SEO**: react-helmet-async

## Tool Categories

- **Image Tools**: Image compressor, resizer, converter, color extractor, etc.
- **PDF Tools**: PDF rotate, merge, split, compress, image-to-PDF, etc.
- **Text Tools**: Word counter, case converter, text diff, etc.
- **Developer Tools**: JSON formatter, Base64 encoder, QR code generator, etc.
- **Calculators**: BMI, age, percentage, mortgage, etc.

## Key Files

- `src/data/tools.ts` — Central registry for all tools (metadata, slugs, SEO info)
- `src/routes.tsx` — App routing and SSG path generation
- `src/pages/ToolPage.tsx` — Dynamic route handler rendering tools by slug
- `src/components/tools/` — Individual tool implementations
- `src/components/ui/` — Reusable shadcn/ui components
- `src/locales/` — i18n JSON files (en, de, es, fr, hi, it, pt)
- `public/` — Static assets, sitemaps, robots.txt
- `public/_headers` — CDN/Netlify/Cloudflare response headers config (includes `Content-Type: application/xml` for `.xml` files)
- `generate-sitemap.js` — Generates sitemap XML files before build
- `server.cjs` — Production CJS server; copied to `dist/index.cjs` during build, serves static files with correct XML headers and SPA fallback

## Running the Project

- **Dev**: `npm run dev` — starts Vite dev server on port 5000 (XML middleware plugin ensures correct Content-Type)
- **Build**: `npm run build` — generates sitemaps, runs SSG build, copies server to `dist/index.cjs`
- **Production**: Replit runs `node ./dist/index.cjs` which serves `dist/` as static files

## Architecture Notes

- Tools are lazy-loaded via `safeLazy` wrapper in `ToolInterface.tsx` for performance
- `vite.config.ts` configures `host: "0.0.0.0"`, `port: 5000`, `allowedHosts: true` for Replit compatibility
- `vite.config.ts` has a custom `xml-content-type` plugin that sets `Content-Type: application/xml` for all `.xml` requests in dev
- Manual chunk splitting separates vendor libs (React, Router, Radix, etc.) from tool-specific code
- Internationalization via `/src/locales/` JSON files

## Sitemap / SEO Notes

- Sitemaps: `public/sitemap.xml` (index), `public/pages-sitemap.xml`, `public/tools-sitemap.xml`
- All `.xml` routes are served with `Content-Type: application/xml; charset=utf-8` — never as HTML
- The production `server.cjs` explicitly checks the file extension and sets the correct MIME type, preventing the SPA from intercepting sitemap URLs
- `public/_headers` sets XML content-type for Netlify/Cloudflare deployments
