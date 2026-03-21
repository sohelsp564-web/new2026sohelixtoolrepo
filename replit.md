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

## Deployment
- Static site deployment: `npm run build` → `dist/` directory
