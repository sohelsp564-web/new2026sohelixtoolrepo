# Sohelix Tools

## Overview
An all-in-one collection of free browser-based tools for images, PDFs, text, and developers. Built with React + Vite + TypeScript, originally from Lovable, now running on Replit.

## Architecture
- **Frontend only** — pure client-side React SPA (no backend server)
- **Router**: React Router DOM v6 with lazy-loaded pages
- **Styling**: Tailwind CSS + Radix UI primitives (shadcn/ui)
- **State**: TanStack React Query
- **PDF tools**: pdf-lib, jspdf, pdfjs-dist
- **QR tools**: qr-code-styling, qrcode-react
- **Image tools**: browser-image-compression, colorthief, tesseract.js (OCR)

## Project Structure
- `src/pages/` — top-level pages (Index, ToolPage, CategoryPage, BlogPage, etc.)
- `src/components/` — shared UI components and tool implementations
- `src/data/` — static data for tools and categories
- `src/hooks/` — custom React hooks
- `src/lib/` — utility helpers
- `src/locales/` — i18n locale files
- `src/types/` — TypeScript type definitions
- `public/` — static assets

## Dev Server
- Runs on port **5000** via `npm run dev`
- Workflow: "Start application" (`npm run dev`)

## Key Configuration
- `vite.config.ts` — Vite config, host set to `0.0.0.0` for Replit proxy compatibility
- `tailwind.config.ts` — Tailwind configuration
- `components.json` — shadcn/ui component config

## Static Site Generation (SSG)
- **SSG via `vite-react-ssg`** — pre-renders all 128 pages (102 tools + 8 categories + 15 blog posts + static pages) into static HTML with correct meta tags for each page
- **Build command**: `VITE_SSG=true npx vite-react-ssg build` → generates `dist/` with one HTML file per route
- **Entry**: `src/main.tsx` exports `createRoot = ViteReactSSG({ routes })` (from `src/routes.tsx`)
- **Routes**: `src/routes.tsx` defines all 128 routes with `getStaticPaths` for dynamic tool/category/blog routes
- **react-helmet-async**: Must stay at `^1.3.0` (NOT v3.x) — vite-react-ssg peer dep requires this version for SSR context compatibility
- **index.html**: No hardcoded `<title>`, OG, or description meta — all injected per-page by react-helmet-async at SSG time
- **vite.config.ts**: `ssgOptions.entry: "src/main.tsx"` explicitly set (Blink script is first module script in index.html, which detectEntry() would wrongly pick)
- **manualChunks**: Skipped when `VITE_SSG=true` env var is set (conflicts with SSR externals)

## Deployment
- Static site deployment: `npm run build` → `dist/` directory (regular SPA build)
- SSG build: `VITE_SSG=true npx vite-react-ssg build` → `dist/` with pre-rendered HTML per page (preferred for SEO)
