# ShinyLogic React component library (`ui/`) for design-sync — Design

**Date:** 2026-06-27
**Status:** Approved (brainstorming) + revised after adversarial spec review — pending implementation plan

## Purpose

Build a self-contained React component library that wraps the ShinyLogic v3 site's
existing BEM/CSS design system, so `/design-sync` can bundle it and the
claude.ai/design agent builds on-brand UI from the customer's real components.

The site (`shinylogic-v3`) is a static, multi-page Vite site (vanilla JS + plain
CSS) with **no component framework**. `/design-sync` expects a component library
that compiles to a JS bundle exporting components, with a shipped `.d.ts` the
converter reads to discover components. This project produces that library; the
design-sync run itself is the **next** step after this.

## Revision note (post-review)

This spec was revised after a 5-lens adversarial review against the repo and the
design-sync skill source. Material changes from the originally-approved design:

- **Standalone package, not a pnpm workspace member.** Workspace membership would
  force the single-package `pnpm-lock.yaml` to be regenerated with the React
  toolchain, and both CI and Deploy run `pnpm install --frozen-lockfile` — so any
  `ui/package.json`↔lockfile drift would fail the **site's** deploy with zero
  `src/` changes. `ui/` is therefore its own isolated package (own
  `node_modules`/lockfile), built with `pnpm -C ui build`.
- **"Live site untouched" is qualified.** Purely-additive `ui/` still trips the
  root lint gate (`eslint .` / `prettier --check .` descend into `ui/`), so the
  boundary requires small **root lint-config** edits (enumerated below). No `src/`
  or site-build change.
- **Approach B (faithful interactivity) retained, hardened for preview.** All
  ported behavior must be sandbox/SSR-safe and render correct default states (the
  design-sync grader takes non-interactive snapshots).
- **Bundle reframed** from "UMD global `ShinyLogicUI`" to "named-export **ESM**
  entry + shipped `.d.ts`"; design-sync re-bundles the entry into its own IIFE and
  derives the global from `cfg.globalName`.
- **CSS extraction list corrected** (marquee/statusbar are shared, not page-scoped;
  `.s-compute__spec*` was missing); **Footer** added; **brand webfonts** must be
  imported by the library CSS or nothing ships them.

## Boundaries (constraints)

- **No `src/` or site-build changes.** The `ui/` package is additive. Verified by:
  root `pnpm build` stays green and `git diff` shows no changes under `src/` or the
  root Vite/site config.
- **Root lint config edits are required and in-scope.** Adding `ui/` makes
  `eslint .` parse `ui/**/*.tsx` with the site's espree config (no TS/JSX) and
  `prettier --check .` format `ui/` sources. So the boundary work includes: add
  `ui` to `.eslintrc.cjs` `ignorePatterns` and `ui/` to `.prettierignore` (or
  scope the root lint scripts to `src/`). These are config-only, not `src/`.
- **CSS stays the single source of truth.** Components emit the *exact* existing
  BEM class names; they never restyle. The only duplication is the small set of
  page-scoped composite rules that must be extracted (see CSS strategy).
- **i18n lives outside the components.** The site's translation is a global DOM
  scan over `data-i18n` (`src/scripts/i18n.js`) — app-level. Library components are
  **i18n-agnostic**: all text, and all `aria-label`/`aria-pressed` strings, come in
  via props with neutral defaults. No component reads `window.I18N`; no hard-coded
  Chinese aria strings. `LangSwitch` is a controlled active-state toggle with an
  `onChange` callback; it does NOT re-translate a document.

## Decisions (locked)

| Decision | Choice |
|---|---|
| Framework | React, thin presentational wrappers over existing markup |
| Interactivity | **Faithful** behavior ported from `core.js` (Approach B), hardened for sandbox/preview |
| Scope | Primitives + signature composites (~17 components) |
| Location | New standalone `ui/` package (own lockfile/`node_modules`), built `pnpm -C ui build` |
| Composite CSS | **Extract/duplicate** the genuinely page-scoped rules into the library (site untouched) |
| Authoring | TypeScript `.tsx` with exported `Props` interfaces; shipped `.d.ts` barrel |
| Bundle | Vite library **ESM** entry → `ui/dist/index.es.js` + pinned `dist/style.css`; design-sync re-bundles into its own IIFE, global `ShinyLogicUI` via `cfg.globalName` |

## Component inventory (~17)

### Primitives (12) — styled by the verbatim shared-CSS import

| Component | Wraps | Notes |
|---|---|---|
| `Button` | `.btn` `--primary/--ghost/--block`, `.btn__arrow` | renders `<a>` or `<button>` via `as`/`href`; optional arrow glyph `→`/`↓` |
| `Tag` | `.tag`; `accent` → `.tag.accent-tag` | **`.accent-tag` is NOT in the shared layer** — only `.s-arch .tag.accent-tag` (home.css:589). The accent variant is provided by a de-scoped extracted rule (see CSS strategy); without it `accent` renders as a plain tag |
| `Pill` | `.pill` | |
| `Kicker` | `.kicker` | eyebrow label, mono |
| `SectionHeader` | `.section-head` + `.kicker` + `.section-title` + `.section-lede` + `.section-index` | title supports an `.accent` span; `index` string |
| `Panel` | `.panel` (+ optional reticle ticks) | `reticle?: boolean` |
| `Card` | `.card`, `.card--reticle` | `reticle?: boolean` |
| `Metric` | `.metric__num` / `.metric__unit` / `.metric__label` | renders the **final** value as initial state; optional `count` animates from final as an enhancement only when IntersectionObserver fires (never shows 0) |
| `TickFrame` | `.reticle` + four corner `.tick` spans | shared internally by `Panel`/`Card`; also standalone |
| `Hairline` | `.hairline` / `.rule` | `variant: 'hairline' \| 'rule'` |
| `StatusBar` | `.statusbar` (+ `__item`) | shared CSS (foundation.css:497); static strip, `items: string[]`. No ported behavior |
| `Marquee` | `.marquee` / `__track` / `__group` / `__item` | shared CSS (foundation.css:839); pure CSS scroll, renders duplicated track group. No ported behavior |

### Composites (5)

| Component | Wraps | Behavior / source |
|---|---|---|
| `Nav` (exports `Brand`, `LangSwitch`, `ThemeToggle`) | `.nav`, `.brand`, `.langswitch`, `.theme-toggle`, `.nav__mobile` | `is-scrolled` on scroll; mobile toggle with `Escape` + close-on-link-click; smooth anchor scroll (`scrollIntoView`, **`pushState` guarded in try/catch**, early-return on missing target). `ThemeToggle` flips `data-theme` + `localStorage` **only on user toggle, guarded** (see sandbox contract); `LangSwitch` controlled active-state + `onChange`, default active `lang` so a snapshot shows a selected button. Expose `forceScrolled`/`defaultMobileOpen` props so scrolled/open states can be rendered. `core.js` `initNav`/`initTheme` |
| `Accordion` | `.s-arch__layer`/`__header`/`__body` | single-open; `defaultOpenIndex` prop **defaults to 0** (so a snapshot shows a populated open layer); keyboard nav `↑`/`↓`/`Home`/`End`; closed bodies get `hidden`/`inert` after the transition (synchronously under reduced-motion) so collapsed content leaves the tab order; `aria-expanded`/`aria-controls`. `core.js` `initArchitecture` |
| `CapabilityCard` | `.s-cap__card` | icon slot + name + EN label + blurb + spec pill |
| `SpecList` | `.s-compute__specs` + `__spec-row`/`__spec-key`/`__spec-val`/`__spec-badge` | `<dl>` rows of key / value / optional badge. **CSS is page-scoped → extracted** |
| `Footer` | `.footer` + `__top`/`__brand`/`__desc`/`__nav`/`__tech`/`__bottom`/`__copy`/`__fine` + `.footer__sitemap`/`__group`/`__group-title`/`__lang` | shared CSS (foundation.css:885 + chrome.css:75); slot-driven sitemap/brand/lang like `Nav`. Identical on all 8 pages → the most-reused composite after Nav |

### Explicitly out of scope (page-specific one-offs / cross-cutting app behavior)

Contact form (`initContactForm`), hero parallax + video (`initHeroParallax`),
compute dot-grid (`initComputeDots`), wafer-scan SVG (`initWaferScan`). Also the
**scroll-reveal** IntersectionObserver (`initReveal`, `.reveal`/`.reveal.is-in`,
188 elements site-wide) is a deliberately-excluded app-level cross-cutting
behavior — components render in their revealed (`.is-in`) state for previews.
`CapabilityCard` and `SpecList` are the chosen representatives of the recurring
card / spec-row vocabularies (the careers team-cards and solutions spec-rows are
structural duplicates, not separate components).

## CSS strategy

- **Primitives & the shared composites' look:** `ui` imports the shared layer in
  place: `foundation.css`, `chrome.css`, `polish.css`, `utilities.css`. These
  define **all** primitive classes, the design tokens, **and** `.statusbar*`,
  `.marquee*`, `.footer*` — genuinely single-source, no extraction.
- **Genuinely page-scoped composites — extract** the specific rule-blocks from
  `src/styles/pages/home.css` into `ui/src/styles/composites.css`, each block
  headed by a comment pointing back to its source:
  - `.s-arch__*` (Accordion) — plus **`.s-arch .tag.accent-tag` de-scoped to
    `.tag.accent-tag`** (the `.s-arch__*` glob does NOT capture this selector — the
    prefix is `.s-arch ` with a space — so it must be added explicitly; it also
    supplies the `Tag accent` variant).
  - `.s-cap__*` (CapabilityCard).
  - `.s-compute__spec*` (SpecList): `__specs`, `__spec-row`, `__spec-key`,
    `__spec-val`, `__spec-badge` (home.css:1083-1122). **Required — omitting it
    ships SpecList unstyled.**
  - Do **not** extract `.marquee*` / `.statusbar*` — they come free via the
    verbatim `foundation.css` import; extracting would duplicate single-source rules.
- **Brand webfonts:** the families (Saira / Saira Condensed / IBM Plex Mono / Noto
  Sans TC) are loaded **only** by a Google Fonts `<link>` in each page's HTML; the
  CSS layer has **no** `@font-face`/`@import` (`polish.css` says so explicitly).
  design-sync's package-shape font handling extracts only `@font-face` blocks from
  CSS, so **without action it ships zero fonts** and every preview renders in
  fallback `system-ui`. Therefore `ui/src/styles/index.css` MUST begin — as its
  **very first rule** — with
  `@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+TC:wght@300;400;500;700&family=Saira:wght@300;400;500;600;700;800&family=Saira+Condensed:wght@500;600;700&display=swap");`
  The remote `@import` survives Vite's build verbatim and design-sync copies it into
  the bundle CSS, treating it as `[FONT_REMOTE]` (informational).
- **Entry stylesheet:** `ui/src/styles/index.css` = the font `@import` first, then
  `@import`s of the four shared files (real relative depth from
  `ui/src/styles/index.css` is `../../../src/styles/foundation.css`, or use a Vite
  alias) plus `composites.css`. The Vite build must **inline the whole `@import`
  closure into one `dist/style.css`** (the converter copies a single file, not a
  graph).
- **PostCSS:** a standalone `ui/` Vite root resolves PostCSS config from its own
  root, so it won't run the site's root `postcss-nested` + `postcss-preset-env`
  pipeline. Verified the shared + composite CSS uses **no** real Sass nesting and
  **no** stage-2 features (no `@custom-media`/`color-mix`/`oklch`), so the only
  delta is autoprefixer prefixes — acceptable for a modern-browser preview. For
  exact parity, copy `postcss.config.js` + its two plugins into `ui/`.

## Build & packaging

- **Package:** standalone `ui/` (own `package.json`, `node_modules`, lockfile).
  Dependencies: `react`, `react-dom`. devDependencies: `vite`,
  `@vitejs/plugin-react`, `typescript`, `vite-plugin-dts`, **`@types/react`**,
  **`@types/react-dom`** (without the `@types`, JSX has no types and the emitted
  `.d.ts` degrades to `any`, defeating prop extraction).
- **`ui/tsconfig.json`** (required artifact): `jsx: "react-jsx"`,
  `declaration: true`, `include: ["src/**/*.tsx"]`. dts emitted via
  `vite-plugin-dts` (or a `tsc --emitDeclarationOnly` pass).
- **`ui/package.json` fields** (design-sync reads these):
  - `"types": "dist/index.d.ts"` **and** `"typings": "dist/index.d.ts"` — the
    converter discovers components by reading the **single** `.d.ts` resolved from
    the top-level `types`/`typings` field (NOT `exports["."].types`). With `dist/`
    present and no `types` resolving, it finds **zero** components and, because the
    package ships CSS, silently reclassifies as a **tokens-only DS** (CSS uploaded,
    no components). The `.d.ts` must be a single barrel matching the JS barrel.
  - `"module": "./dist/index.es.js"` and
    `"exports": { ".": { "import": "./dist/index.es.js", "types": "./dist/index.d.ts" } }`
    — design-sync's `resolveDistEntry` prefers an ESM entry; a UMD-only build gives
    no `module`, forcing esbuild to treat the entry as CJS (named exports not
    statically enumerable).
- **`ui/vite.config.ts`** library mode:
  - `build.lib.entry` = the barrel; `formats: ['es']` (optionally `['es','umd']`).
  - **Pin CSS output** to `style.css` (`build.lib.cssFileName` or
    `rollupOptions.output.assetFileNames`) — the converter's package-shape CSS
    probe only matches `dist/style.css` / `dist/styles.css` / `build/esm/styles.css`
    / `styles.css`; a miss writes an `@ds-css-runtime` placeholder (DS ships with
    **no CSS**).
  - **React externalization:** `external: ['react','react-dom','react/jsx-runtime']`
    with `output.globals: { react:'React', 'react-dom':'ReactDOM', 'react/jsx-runtime':'jsxRuntime' }`
    — OR set `@vitejs/plugin-react` `jsxRuntime: 'classic'` to drop the
    `react/jsx-runtime` import entirely. Omitting `react/jsx-runtime` from
    `external` (automatic runtime default) bundles a partial second React copy
    (invalid-hook-call); omitting `output.globals` maps externals to
    `window.react` (undefined). Pick one approach and pin it.
- **design-sync follow-on config (recorded for the next step, not built here):**
  `cfg.globalName: "ShinyLogicUI"` (the package name `ui` PascalCases to `Ui`, not
  `ShinyLogicUI`), and `cfg.cssEntry: "dist/style.css"` so discovery never depends
  on Vite-version filename defaults.
- **Preview React provisioning:** design-sync re-bundles the ESM entry into its own
  IIFE; the preview scaffold must expose `react`/`react-dom` for the IIFE's
  externals (pin the React major to avoid skew), **or** the entry bundles React.
  This is a design-sync-side concern flagged here so the follow-on step handles it.
- **Source layout:** `ui/src/components/<Group>/<Name>/<Name>.tsx` + an
  `index.ts` barrel exporting every public component; the dts barrel mirrors it.

## Sandbox / SSR safety contract (applies to every component)

design-sync grades **non-interactive snapshots** rendered in an isolated/sandboxed
context that may lack a full browser environment. Therefore:

- Every browser-global access (`document`, `window`, `localStorage`, `matchMedia`,
  `IntersectionObserver`) lives inside `useEffect` or an event handler — **never in
  the render body or module scope** — and is feature-guarded (`typeof` checks;
  `try/catch` around `localStorage`). The bundle must be import-safe.
- **No side effects on mount.** `ThemeToggle` reads the existing `data-theme`
  attribute and defaults to `dark`; it writes `data-theme`/`localStorage` **only on
  user toggle**, each `localStorage` access wrapped in `try/catch`. The theme
  target is **injectable** (prop, default `document.documentElement`) so a preview
  can scope `data-theme` to a local wrapper and not flip sibling components or
  pollute the grader's storage. The icon uses the **CSS swap** (render both icon
  spans; rely on `.theme-toggle__icon--moon/--sun`), not JS `innerHTML`.
- **Correct default states for snapshots:** `Metric` renders its final value (never
  0); `Accordion` opens `defaultOpenIndex` (0); `LangSwitch` shows a default active
  lang; components render in their revealed (`.is-in`) state.
- `Nav`'s `pushState` is guarded; its aria strings come via props (no `window.I18N`).

## Verification (success criteria)

1. **Library builds:** `pnpm -C ui build` produces `ui/dist/index.es.js`,
   `ui/dist/index.d.ts`, and `ui/dist/style.css`. → verify the dts barrel exports
   every component; **render at least one component** (not just check a global),
   since externals binding to `undefined` still "populate" without rendering.
2. **Visual fidelity:** each component renders matching the live site (brand fonts
   present, composites styled) — graded by the design-sync preview-grader on its
   absolute rubric in the next step.
3. **design-sync discovers components:** the package-shape converter logs a
   **non-zero `components:` count** (not `[ZERO_MATCH]` / tokens-only) and
   `package-validate.mjs` exits clean against `ui/`.
4. **Site untouched:** root `pnpm build` stays green; `git diff` shows no `src/` or
   site-build changes; **root `pnpm lint` stays green** (after the `.eslintrc.cjs`
   / `.prettierignore` exclusions).

> Steps 1 and 4 are self-verifiable in this repo today. Steps 2-3 require the
> external `/design-sync` toolchain (the package-shape converter, `package-validate.mjs`,
> the preview-grader), which runs in the follow-on step.

## Follow-on (not this plan)

After `ui/` builds and verifies, run `/design-sync` against it (package shape, with
`cfg.globalName: "ShinyLogicUI"`, `cfg.cssEntry: "dist/style.css"`). design-sync
authors the conventions header from the real class vocabulary (token names,
`.btn`/`.card`/etc. families, the `data-theme` root requirement) and uploads. This
design covers **building `ui/` only**.
