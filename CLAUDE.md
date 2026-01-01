# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start dev server at localhost:4321
pnpm build    # Build for production to ./dist/
pnpm preview  # Preview production build locally
```

## Architecture

Astro 5 static site deployed to Vercel with Tailwind CSS v4.

**Structure:**
- `src/pages/` - File-based routing (`.astro` files become routes)
- `src/pages/[slug]/` - Dynamic routes for essays and their OG images
- `src/layouts/Layout.astro` - Base HTML wrapper with dark mode and OG meta tags
- `src/styles/global.css` - Tailwind config, custom fonts, and base styles
- `src/content/essays/` - Markdown essays (content collection)
- `src/utils/og-templates/` - React components for OG image generation
- `public/fonts/` - Self-hosted Inter and La Belle Aurore fonts

**Content Collections:**
- Essays defined in `src/content/config.ts` with schema: `pubDatetime`, `title`, `draft`, `description`
- Essays stored in `src/content/essays/` (can organize by year folders)
- URLs: `/essay-slug` for article, `/essay-slug/index.png` for OG image
- Index page auto-lists non-draft essays sorted by date

**OG Images:**
- Site OG: `/og.png` - "awe in everything" text
- Essay OG: `/[slug]/index.png` - essay title + "awe in everything" footer
- Generated at build time using Satori (JSX to SVG) and Resvg (SVG to PNG)

**Styling:**
- Tailwind v4 via `@tailwindcss/vite` plugin (configured in `astro.config.mjs`)
- Custom theme variables defined in `global.css` using `@theme` directive
- Dark mode uses class strategy with localStorage persistence
- Links have a custom hand-drawn underline effect (SVG-based)
