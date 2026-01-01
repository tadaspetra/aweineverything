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
- `src/layouts/Layout.astro` - Base HTML wrapper with dark mode support
- `src/styles/global.css` - Tailwind config, custom fonts, and base styles
- `public/fonts/` - Self-hosted Inter and La Belle Aurore fonts

**Styling:**
- Tailwind v4 via `@tailwindcss/vite` plugin (configured in `astro.config.mjs`)
- Custom theme variables defined in `global.css` using `@theme` directive
- Dark mode uses class strategy with localStorage persistence
- Links have a custom hand-drawn underline effect (SVG-based)
