# ShinyLogic v3

A Vite-scaffolded, multi-page, trilingual (繁中 / English / 简体中文) corporate website for
顯藝科技 ShinyLogic, deployed under the base path `/shiny3/`. Ported from the `shiny-logic`
design target into a modern build pipeline with WCAG 2.1 AA accessibility and design-system
compliance.

## Stack

- **Build:** Vite 5 (multi-page, `base: '/shiny3/'`, `root: src/pages`)
- **CSS:** PostCSS (`postcss-nested` + `postcss-preset-env`), modular design system
- **JS:** vanilla ESM (no framework, no router)
- **i18n:** runtime switcher, 3 locales × 994 keys, `localStorage['sl-lang']`, `sl:langchange` event
- **Tests:** Playwright e2e (pages, accessibility via axe-core, hero visibility, 404)
- **Lint:** ESLint 8 + Stylelint + Prettier
- **CI:** GitHub Actions (lint → build → test)

## Commands

```bash
pnpm install        # install dependencies
pnpm dev            # dev server  → http://localhost:5173/
pnpm build          # production build → dist/
pnpm preview        # serve build  → http://localhost:4173/shiny3/
pnpm test           # Playwright e2e suite
pnpm lint           # ESLint + Stylelint + Prettier (check)
pnpm format         # Prettier (write)
node scripts/audit-i18n.mjs   # report orphan i18n keys
```

## Structure

```
src/
  pages/        7 content pages + 404.html (Vite entry points)
  styles/       foundation.css · chrome.css · polish.css · utilities.css · pages/*.css
  scripts/      core.js (entry) · i18n.js · icons.js
  i18n/         dict.js (zh-Hant / en / zh-Hans)
  assets/svg/   extracted chrome icons (moon / sun)
public/         favicon, OG, logo, hero video (init.webm + init.mp4 + poster.webp)
tests/e2e/      Playwright specs
scripts/        audit-i18n.mjs
.github/workflows/ci.yml
DESIGN.md       design-system source of truth (read before any visual change)
```

## Pages

`index` · `about` · `solutions` · `technology` · `case-studies` · `careers` · `contact` · `404`

## Accessibility

WCAG 2.1 AA: skip links, `prefers-reduced-motion`, `aria-live` locale announcements, audited
ARIA states (accordion / mobile nav / language switcher), ≥44px touch targets, light- and
dark-mode contrast — verified by axe-core across all pages in both themes.

## Deployment

Static build (`dist/`) intended for GitHub Pages at `https://robertoshiu.github.io/shiny3/`.
The design source of truth is `DESIGN.md`; do not deviate without approval.
