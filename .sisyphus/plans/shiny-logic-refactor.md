# ShinyLogic v3 ‚Ä?New Vite-Scaffolded Website

> **Pre-existing files in target directory** (`E:\repo\shiny3`): The working directory already contains `init.mp4`, `logo.png`, and other files. These are leftovers from the source `shiny-logic` repo copy. T19 (port favicon/og-image/logo to `public/`) will OVERWRITE these. T20 (video re-encode) will replace `init.mp4`. **No action needed in this plan** ‚Ä?the file copy in T19/T20 handles the overwrite.

## TL;DR

> **Quick Summary**: Build a new Vite-scaffolded, multi-page, trilingual (ÁπÅ‰∏≠ / English / ÁÆÄ‰Ωì‰∏≠Êñ? corporate website at `/shiny3/` that ports the existing ShinyLogic design system, content, and copy from `../shiny-logic`. Modern build pipeline (Vite + PostCSS via `postcss-preset-env`) + WCAG 2.1 AA accessibility + design polish. Code quality, accessibility, and visual fidelity are the three tracks.
>
> **Deliverables**:
> - Vite 5.x multi-page project (7 content entry points: index, about, solutions, technology, case-studies, careers, contact) + 1 infrastructure page: 404.html (Wafer Stage Calibration Error)
> - PostCSS pipeline via `postcss-preset-env` (autoprefixer, postcss-nested, custom-properties)
> - Modular CSS architecture (1 foundation + 1 chrome + 7 per-page CSS files)
> - Ported i18n system (3 locales, ~974 keys post-orphan-trim)
> - Ported 7 HTML pages with new canonical + OG URLs (no shiny-logic references)
> - Google Fonts loading (4 families, 16 faces) in all 7 pages
> - WCAG 2.1 AA compliance (skip link, prefers-reduced-motion, aria-live, ARIA audit, touch targets)
> - Design system compliance (no Inter/Roboto/Arial, no emojis, no AI slop, all signature motifs present)
> - New hero video (`init.webm` 3-5 MB AV1 + `init.mp4` smaller fallback + WebP poster)
> - Playwright e2e test suite (page loads, nav, lang switcher, a11y)
> - GitHub Actions CI (build + lint + test)
> - ESLint 8 + Stylelint + Prettier
>
> **Estimated Effort**: Large (~34 implementation tasks + 4 verification tasks = 38 total across 5 PRs)
> **Parallel Execution**: YES ‚Ä?5 waves, max 14 tasks per wave (Wave 2)
> **Critical Path**: Wave 1 (scaffold) ‚Ü?Wave 2 (port) ‚Ü?Wave 3 (a11y) ‚Ü?Wave 4 (polish) ‚Ü?Wave 5 (verify)

---

## Context

### Original Request
"ÂÑ™ÂåñÈáçÊßã ../shiny-logic" (Optimize & refactor ../shiny-logic)

### Project Reframe
The user clarified: **This is a new project, not a refactor of the existing repo**. The old `shiny-logic` is the design target ‚Ä?its content, design system, brand, and copy are the source of truth. The new project will be a Vite-scaffolded, modern rebuild that ports the design. The old repo's code is **reference material**, not code to be refactored.

### Interview Summary

**Round 1 (scope, build step, test strategy, out-of-scope):**
- **Refactor goals**: All of the above (full overhaul) ‚Ä?narrowed in Round 2 to B + C + E
- **Build step**: Accept introducing build step (Vite/PostCSS/esbuild)
- **Test/QA**: Add Playwright + visual regression (narrowed in Round 2 to Playwright e2e only, no SaaS)
- **Out-of-scope (Round 1)**: ‰øùÁïô logo (preserve È°ØËóùÁßëÊäÄ / SHINYLOGIC wordmark assets + favicon)

**Round 2 (narrow scope, build tools, tests, defaults):**
- **Refactor scope**: B (Code quality/DRY) + C (Accessibility WCAG 2.1 AA) + E (Design polish visual QA)
- **Excluded**: A (Performance) + D (i18n completeness) ‚Ä?with 2 narrow exceptions: init.mp4 re-encode (Q8=a), orphan i18n key trim (~84 keys)
- **Build step**: Vite 5.x + PostCSS pipeline
- **Test/QA**: Playwright e2e (page loads, nav, lang switcher, a11y: skip link, focus order, ARIA states)
- **Out-of-scope defaults applied**: ‰∏çÂãï 3 Ë™ûÁ≥ªÂÖßÂÆπ„ÄÅ‰∏çÂã?`:root` token ÂêçÁ®±„ÄÅ‰∏çÂã?semantic HTML ÁµêÊßã„ÄÅ‰∏çÂã?accordion a11y Ê®°Âºè

**Round 3 (deployment, structure, video, repo, e2e):**
- **Q6 Vite output**: base path `/shiny3/`
- **Q7 trilingual structure**: KEEP trilingual/ subdir (later reinterpreted as preserve inline `data-i18n` ÁπÅ‰∏≠ fallback, since trilingual/ doesn't exist in source)
- **Q8 init.mp4 (17.8 MB)**: Re-encode to WebM/AV1 (~3-5 MB) + smaller MP4 fallback
- **Q9 logo-source.png and *.pptx**: Don't touch (excluded from new project)
- **Q10 Playwright e2e**: Page loads, nav, lang switcher persistence, skip link, focus order, ARIA states

**Round 4 (scope re-frame, CRITICAL):**
- **This is a NEW project, NOT a refactor of shiny-logic**
- The old `shiny-logic` is the design target (content + design system + brand + copy)
- The new project lives at `/shiny3/`
- All canonical + OG URLs in new project point to new deployment, NOT `shiny-logic/`
- 7 HTML pages rebuilt from scratch with same content
- Assets to port: favicon.svg, og-image.png, og-card.html, logo.webp, logo.png
- Assets NOT to port: init.mp4 (re-create), logo-source.png, *.pptx

**Commit strategy**: 5 PRs (PR0 scaffold ‚Ü?PR1 B ‚Ü?PR2 C ‚Ü?PR3 E ‚Ü?PR4 verify)

### Research Findings (from codebase scan)

**Source repo at `E:\repo\shiny-logic` (the design target):**
- 7 HTML pages (index.html 1,716 lines, largest), all using a runtime i18n switcher
- `styles.css` 10,287 lines ‚Ä?monolithic, foundation L1-737, per-page scoped L738-9367, append-only patches L9708-10287
- `script.js` 757 lines ‚Ä?6 IIFEs, clean, idempotent
- `i18n.js` 147 lines ‚Ä?clean runtime, fallback chain (locale ‚Ü?zh-Hant ‚Ü?DOM text)
- `i18n-dict.js` 236 KB ‚Ä?3,182 lines, ~1,058 keys √ó 3 locales, ~84 orphan
- 333 inline `style="..."` attributes across 7 pages, categorized as:
  - 28 √ó `animation-delay:.XXs` on `[data-rise]` hero stagger elements
  - 144 √ó `--i:N` (stagger index on cards/rows, keep inline ‚Ä?per-element data)
  - 20 √ó data-driven `--pct/--pos/--seg-w/--phase-pct` (keep inline ‚Ä?per-element data)
  - 62 √ó `font-size:.XXrem` (migrate to scoped CSS classes)
  - 12 √ó `display:inline|none` (migrate to scoped CSS classes)
  - 67 √ó other functional (`text-align`, `min-width`, `vertical-align`, `border-color`, etc.)
- 7 identical `<noscript><style>` blocks (progressive enhancement, must remain per-page)
- 97 inline SVGs (24 chrome duplicates + ~30 semantic icons + ~19 decorative + ~20 data diagrams)
- 16 font faces from Google Fonts (Saira √ó 6, Saira Condensed √ó 3, IBM Plex Mono √ó 3, Noto Sans TC √ó 4)
- Zero test infrastructure, zero CI, zero linting
- **Known design violation**: `styles.css:9735` redefines `--font-display` with Roboto (violates DESIGN.md ¬ß3)

**Critical guardrails from DESIGN.md:**
- No emoji icons (SVG only)
- No Inter/Roboto/Arial (forbidden in display face stack)
- No purple-on-white gradients
- No generic SaaS hero
- 8px base scale, 3 motion tokens
- Semantic landmarks (header/nav/main/section/footer)
- `:focus-visible` ring in `--cyan`
- `prefers-reduced-motion: reduce` must disable all motion
- Multi-page consistency is a HARD rule (nav/footer byte-identical except active tab)

### Metis Review (Gaps Addressed)

**Top 5 gaps surfaced (all addressed in this plan):**

1. **Deployment URL contradiction** ‚Ä?Q4 reframe resolves: this is a new project at `/shiny3/`, all URLs new
2. **trilingual/ subdir doesn't exist** ‚Ä?Q7 reframed: preserve inline `data-i18n` ÁπÅ‰∏≠ fallback
3. **`--font-display` Roboto collision** (source L9735) ‚Ä?Fixed in Wave 2 T10 (audit) and verified in Wave 4 T31 (compliance)
4. **Animation-delay migration strategy** ‚Ä?Wave 2 T11: 200 animation-delay values ‚Ü?CSS custom properties `style="--delay:.XXs"` + `animation-delay: var(--delay)` rule
5. **Wave 1 ownership** ‚Ä?PR 0 scaffold, merged to `main` first, then 3 atomic PRs branch off

---

## Work Objectives

### Core Objective
Build a new Vite-scaffolded website at `/shiny3/` that ports the ShinyLogic design system, content, and copy. The new project replaces the existing `shiny-logic` deployment with a modern build pipeline (Vite + PostCSS), modern tooling (ESLint/Stylelint/Prettier/Playwright), WCAG 2.1 AA accessibility, and design system compliance.

### Concrete Deliverables
- New Vite 5.x project at `E:\repo\shiny3` (working directory) with `base: '/shiny3/'`
- 7 HTML pages: `index.html`, `about.html`, `solutions.html`, `technology.html`, `case-studies.html`, `careers.html`, `contact.html`
- Modular CSS: `src/styles/foundation.css` + 7 per-page files
- ESM JavaScript modules in `src/scripts/`
- i18n dictionary: `src/i18n/dict.js` (3 locales, ~1,058 keys, post-orphan-trim)
- New hero video: `public/init.webm` (3-5 MB AV1) + `public/init.mp4` (smaller fallback)
- Chrome SVGs extracted to `src/assets/svg/`
- Playwright e2e test suite in `tests/e2e/`
- GitHub Actions CI workflow
- DESIGN.md (design system source of truth) preserved
- README.md, package.json, .gitignore, .eslintrc, .stylelintrc, .prettierrc, postcss.config.js, vite.config.js, playwright.config.ts

### Definition of Done
- [ ] `pnpm build` (or `npm run build`) succeeds; `dist/` contains 7 HTML pages with proper `<base>` path
- [ ] `pnpm dev` serves the site at `http://localhost:5173/` with HMR
- [ ] `pnpm preview` serves the built site for Playwright e2e tests
- [ ] `pnpm test` runs all Playwright e2e tests; all green
- [ ] `pnpm lint` runs ESLint + Stylelint + Prettier check; all clean
- [ ] CI workflow on `.github/workflows/ci.yml` runs on PR; build + lint + test pass
- [ ] All 7 pages load in `vite preview` with no console errors, no 404s
- [ ] Language switcher persists choice in localStorage; `sl:langchange` event fires
- [ ] Skip link works on all 7 pages (tab ‚Ü?focus ‚Ü?jump to `<main>`)
- [ ] `prefers-reduced-motion: reduce` disables hero parallax + video scale
- [ ] `aria-live="polite"` on language switcher announces locale change to screen readers
- [ ] Touch targets ‚â?44px on nav/lang/form controls
- [ ] All 4 typography rules (Saira / Saira Condensed / IBM Plex Mono / Noto Sans TC) used correctly
- [ ] No Inter/Roboto/Arial leak in any font stack
- [ ] No emoji icons
- [ ] All 5 signature motifs (reticle / wafer / grid / grain / hairlines) present on hero
- [ ] No hardcoded colors/fonts outside `:root` token definitions

### Must Have
- All 7 pages functional with the same content as `shiny-logic`
- Trilingual (ÁπÅ‰∏≠ / English / ÁÆÄ‰Ωì‰∏≠Êñ? with runtime switcher
- Vite multi-page build with `base: '/shiny3/'`
- PostCSS pipeline with autoprefixer, postcss-nested, postcss-custom-properties
- ESLint + Stylelint + Prettier configured
- Playwright e2e test suite
- GitHub Actions CI
- New hero video (WebM/AV1 + MP4 fallback)
- Skip link on all 7 pages
- `prefers-reduced-motion` for hero
- `aria-live="polite"` on language switcher
- Touch targets ‚â?44px
- No Inter/Roboto/Arial leak
- No emoji icons
- All signature motifs present

### Must NOT Have (Guardrails)
- **DO NOT** copy `init.mp4` (17.8 MB) from source ‚Ä?re-create as new WebM/AV1 + smaller MP4
- **DO NOT** copy `logo-source.png` (19.4 MB) from source
- **DO NOT** copy `*.pptx` (805 KB) from source
- **DO NOT** change i18n-dict.js values (3 locales' content frozen)
- **DO NOT** rename `:root` token names
- **DO NOT** change semantic HTML structure (header/nav/main/section/footer)
- **DO NOT** change accordion a11y pattern (aria-expanded, Home/End keys)
- **DO NOT** extract `<noscript><style>` blocks to a shared file (they must remain per-page)
- **DO NOT** extract semantic/diagram SVGs (architecture diagrams, capability icons) to assets
- **DO NOT** introduce Inter/Roboto/Arial in any font stack
- **DO NOT** use emoji icons
- **DO NOT** use purple-on-white gradients
- **DO NOT** use generic SaaS hero (centered headline + 2 buttons + floating cards)
- **DO NOT** reference `shiny-logic/` in any canonical or OG URL in the new project
- **DO NOT** port the v3 "apple-fusion" append-only layer as-is ‚Ä?audit it first (especially the Roboto in `--font-display`)

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** ‚Ä?ALL verification is agent-executed. No exceptions.
> Acceptance criteria requiring "user manually tests/confirms" are FORBIDDEN.

### Test Decision
- **Infrastructure exists**: NO (greenfield project)
- **Automated tests**: YES (Playwright e2e ‚Ä?tests-after, scaffolded in Wave 1)
- **Framework**: Playwright (TypeScript)
- **If TDD**: Each task follows RED (failing test) ‚Ü?GREEN (minimal impl) ‚Ü?REFACTOR for Playwright specs
- **Agent-Executed QA**: ALWAYS (mandatory for all tasks regardless of test choice)

### QA Policy

Every task MUST include agent-executed QA scenarios (see TODO template below).
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) ‚Ä?Navigate, interact, assert DOM, screenshot
- **Build/CI**: Use Bash (node/pnpm) ‚Ä?Run build, lint, test commands, parse output
- **i18n**: Use Playwright ‚Ä?Switch locale, assert text content, verify localStorage persistence
- **Video**: Use Playwright ‚Ä?Load page, verify `<video>` element has both `init.webm` and `init.mp4` sources, verify autoplay/muted/playsinline attrs
- **A11y**: Use Playwright (with @axe-core/playwright if needed) ‚Ä?Tab through page, verify skip link, verify ARIA states, check focus order

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (PR 0 ‚Ä?Scaffold, foundation, 7 tasks in parallel):
‚îú‚îÄ‚îÄ T1: Initialize Vite 5.x project (npm init, install deps, vite.config.js with base: '/shiny3/' and 7 rollupOptions.input entries)
‚îú‚îÄ‚îÄ T2: Configure PostCSS pipeline (postcss.config.js with autoprefixer, postcss-nested, postcss-custom-properties)
‚îú‚îÄ‚îÄ T3: Set up ESLint + Stylelint + Prettier (.eslintrc.cjs, .stylelintrc.json, .prettierrc) with project rules
‚îú‚îÄ‚îÄ T4: Set up Playwright config (playwright.config.ts with vite preview server, base URL, browsers)
‚îú‚îÄ‚îÄ T5: Set up GitHub Actions CI (.github/workflows/ci.yml: install, lint, build, test)
‚îú‚îÄ‚îÄ T6: Port DESIGN.md to new project as design-system reference
‚îî‚îÄ‚îÄ T7: Create src/ structure (src/pages/, src/assets/svg/, src/styles/, src/scripts/, src/i18n/)

Wave 2 (PR 1 ‚Ä?Code quality / DRY, MAX PARALLEL, 13 tasks):
‚îú‚îÄ‚îÄ T8: Port styles.css foundation (L1-737) ‚Ü?src/styles/foundation.css [deep]
‚îú‚îÄ‚îÄ T9: Port per-page scoped CSS (L738-9367) ‚Ü?src/styles/pages/*.css √ó 7 [deep]
‚îú‚îÄ‚îÄ T10: Audit + fix --font-display Roboto collision (L9735 ‚Ü?pure Saira) [quick]
‚îú‚îÄ‚îÄ T11: Migrate 290 inline style= ‚Ü?CSS custom properties (animation-delay) or scoped classes (functional) [unspecified-high]
‚îú‚îÄ‚îÄ T12: Audit <noscript><style> blocks per-page (preserved, not extracted) [quick]
‚îú‚îÄ‚îÄ T13: Extract 24 chrome SVGs (theme toggle, nav arrows) ‚Ü?src/assets/svg/ [unspecified-low]
‚îú‚îÄ‚îÄ T14: Build + run scripts/audit-i18n.mjs to find ~84 orphan i18n keys [quick]
‚îú‚îÄ‚îÄ T15: Port script.js ‚Ü?src/scripts/core.js (6 IIFEs ‚Ü?ESM modules) [unspecified-high]
‚îú‚îÄ‚îÄ T16: Port i18n.js ‚Ü?src/scripts/i18n.js (runtime, ESM) [quick]
‚îú‚îÄ‚îÄ T17: Port i18n-dict.js ‚Ü?src/i18n/dict.js (3 locales, post-orphan-trim) [unspecified-high]
‚îú‚îÄ‚îÄ T18: Port 7 HTML pages ‚Ü?src/pages/*.html with multi-page Vite config [unspecified-high]
‚îú‚îÄ‚îÄ T19: Port favicon.svg, og-image.png, og-card.html, logo.webp, logo.png ‚Ü?public/ [quick]
‚îî‚îÄ‚îÄ T20: Generate new init.webm (3-5 MB AV1) + init.mp4 fallback (smaller) via ffmpeg [unspecified-high]

Wave 3 (PR 2 ‚Ä?Accessibility WCAG 2.1 AA, MAX PARALLEL, 7 tasks):
‚îú‚îÄ‚îÄ T21: Add skip link on all 7 pages (Skip to content, tabindex=-1 on <main>) [unspecified-high]
‚îú‚îÄ‚îÄ T22: Add prefers-reduced-motion overrides for hero parallax + video scale [unspecified-high]
‚îú‚îÄ‚îÄ T23: Add aria-live="polite" to language switcher [quick]
‚îú‚îÄ‚îÄ T24: Audit + fix ARIA states (accordion aria-expanded, mobile nav aria-expanded, lang buttons aria-pressed) [unspecified-high]
‚îú‚îÄ‚îÄ T25: Touch target audit (‚â?4px on nav/lang/form controls) [unspecified-high]
‚îú‚îÄ‚îÄ T26: Audit role="presentation" on .statusbar (re-evaluate if meaningful text hidden) [quick]
‚îî‚îÄ‚îÄ T27: Light mode contrast audit ([data-theme="light"] tokens at L9746+) [unspecified-high]

Wave 4 (PR 3 ‚Ä?Design polish, MAX PARALLEL, 6 tasks):
‚îú‚îÄ‚îÄ T28: Token usage audit (no hardcoded colors/fonts outside :root, no missing variables) [unspecified-high]
‚îú‚îÄ‚îÄ T29: :focus-visible contrast verification (4.5:1 on graphite AND light mode) [unspecified-high]
‚îú‚îÄ‚îÄ T30: :root variable consistency (no overrides, no leakage) [quick]
‚îú‚îÄ‚îÄ T31: Typography compliance (no Inter/Roboto/Arial leak ‚Ä?verify L9735 fix) [unspecified-high]
‚îú‚îÄ‚îÄ T32: Anti-AI-slop audit (no emojis, no generic SaaS hero, no purple gradients) [unspecified-high]
‚îî‚îÄ‚îÄ T33: Signature motif presence check (reticle / wafer / grid / grain / hairlines on every page) [unspecified-high]

Wave 5 (PR 4 ‚Ä?Verification, 4 parallel reviewers):
‚îú‚îÄ‚îÄ F1: Plan compliance audit (oracle) ‚Ä?verify all 3 PRs delivered, no scope creep
‚îú‚îÄ‚îÄ F2: Build + lint + test pass (CI gate ‚Ä?must be green)
‚îú‚îÄ‚îÄ F3: Real manual QA (browse skill against vite preview ‚Ä?all 7 pages, all 3 locales, all a11y checks)
‚îî‚îÄ‚îÄ F4: Scope fidelity check (deliverables match plan, no missing, no creep)

Critical Path: T1-T7 (scaffold) ‚Ü?T8-T20 (port) ‚Ü?T21-T27 (a11y) ‚Ü?T28-T33 (polish) ‚Ü?F1-F4 (verify)
Parallel Speedup: ~70% faster than sequential
Max Concurrent: 7 tasks (Wave 1) / 13 tasks (Wave 2) / 7 tasks (Wave 3) / 6 tasks (Wave 4)
```

### Dependency Matrix

| Task | Blocks | Blocked By |
|------|--------|------------|
| T1-T7 | T8-T20, T18a | ‚Ä?(scaffold, can start immediately) |
| T8 | T9, T11 | T1-T7 |
| T9 | T11 | T8 |
| T10 | T31 | T1-T7 |
| T11 | T18, T21, T28 | T8, T9 |
| T12 | T21 | T1-T7 |
| T13 | T18, T21, T24 | T1-T7 |
| T14 | T17 | T1-T7 |
| T15 | T18, T24 | T1-T7 |
| T16 | T18, T23 | T1-T7 |
| T17 | T18, T23 | T14, T16 |
| T18 | T21-T33 | T8, T9, T11, T13, T15, T16, T17, T19, T20 |
| T18a | (leaf) | T18 (T18a adds Google Fonts `<link>` AFTER T18 ports the `<head>` skeleton) |
| T19 | T18 | T1-T7 |
| T20 | T18 | T1-T7, ffmpeg installed |
| T21-T27 | T28-T33 | T18 |
| T28-T33 | F1-F4 | T21-T27 |
| F1-F4 | final gate | T28-T33 |

**Critical Path**: T1 ‚Ü?T7 ‚Ü?T8 ‚Ü?T9 ‚Ü?T11 ‚Ü?T18 ‚Ü?T18a ‚Ü?T21-T33 ‚Ü?F1-F4

**True parallelism in Wave 2**: ~10 tasks (T8, T9, T10, T12, T13, T14, T15, T16, T19, T20) can run in parallel; T18a, T17, T18 are the bottleneck chain.

### Agent Dispatch Summary

- **Wave 1 (PR 0)**: **7 tasks** ‚Ä?T1-T7 mostly `quick` and `unspecified-low`
- **Wave 2 (PR 1)**: **13 tasks** ‚Ä?T8, T9, T11, T15, T17, T18 are `deep` / `unspecified-high`; T10, T12, T14, T16, T19 are `quick`; T13, T20 are `unspecified-low` / `unspecified-high`
- **Wave 3 (PR 2)**: **7 tasks** ‚Ä?T21, T22, T24, T25, T27 are `unspecified-high`; T23, T26 are `quick`
- **Wave 4 (PR 3)**: **6 tasks** ‚Ä?T28, T29, T31, T32, T33 are `unspecified-high`; T30 is `quick`
- **Wave 5 (PR 4)**: **4 tasks** ‚Ä?F1 `oracle`, F2 `unspecified-high`, F3 `unspecified-high`, F4 `deep`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.
> **A task WITHOUT QA Scenarios is INCOMPLETE. No exceptions.**

### Wave 1 ‚Ä?Scaffold (PR 0)

- [ ] 1. Initialize Vite 5.x multi-page project

  **What to do**:
  - Run `pnpm init` to create package.json (use pnpm consistently throughout the project)
  - Install: `vite@5`, `playwright`, `@axe-core/playwright` (for T27 a11y audits), `eslint@8`, `stylelint`, `prettier`, `postcss-preset-env`
  - Create `vite.config.js` with `base: '/shiny3/'` and `build.rollupOptions.input` for 7 pages
  - Verify `pnpm dev` serves the placeholder page at `http://localhost:5173/`
  - Verify `pnpm build` produces `dist/` with proper `<base href="/shiny3/">` injection
  - **Commit `pnpm-lock.yaml` to version control** (lock file for reproducible builds)

  **Must NOT do**:
  - Don't add a framework (no React, Vue, Svelte) ‚Ä?stay vanilla
  - Don't add a router (multi-page, not SPA)
  - Don't add a UI library (no Tailwind, shadcn, etc.) ‚Ä?design system is hand-rolled
  - Don't use `npm` commands ‚Ä?pnpm is the project standard

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Single-file project init, well-documented steps
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T2-T7)
  - **Blocks**: T2-T7 (foundation), T8-T20 (port)
  - **Blocked By**: None (can start immediately)

  **References**:
  - `../shiny-logic/index.html:1-50` ‚Ä?see existing HTML structure to model
  - `../shiny-logic/CLAUDE.md` ‚Ä?project conventions (gstack, design system)

  **Acceptance Criteria**:
  - [ ] `package.json` exists with `name: "shinylogic-v3"`, `private: true`, `type: "module"`
  - [ ] `vite.config.js` exists with `base: '/shiny3/'` and 7 `rollupOptions.input` entries
  - [ ] `pnpm dev` starts dev server at `http://localhost:5173/` with HMR
  - [ ] `pnpm build` produces `dist/` with hashed assets and 7 HTML files
  - [ ] All 7 HTML files in `dist/` have `<base href="/shiny3/">` injected
  - [ ] `pnpm-lock.yaml` committed
  - [ ] `@axe-core/playwright` in devDependencies (for T27)

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: Vite dev server starts and serves placeholder page
    Tool: Bash (curl)
    Preconditions: Vite installed, vite.config.js exists
    Steps:
      1. Run `pnpm dev` in background
      2. Wait 3 seconds for server start
      3. curl http://localhost:5173/ ‚Ä?expect HTTP 200
      4. curl response contains `<!DOCTYPE html>` or `<html`
      5. Kill the dev server
    Expected Result: HTTP 200, HTML response
    Failure Indicators: Connection refused, timeout, non-HTML response
    Evidence: .sisyphus/evidence/task-1-vite-dev-starts.txt

  Scenario: Vite build produces 7 HTML files with base href injected
    Tool: Bash
    Preconditions: vite.config.js with 7 input entries
    Steps:
      1. Run `pnpm build`
      2. Check `dist/` directory contains: index.html, about/index.html, solutions/index.html, technology/index.html, case-studies/index.html, careers/index.html, contact/index.html
      3. Grep each for `<base href="/shiny3/">`
    Expected Result: 7 HTML files exist, all have base href
    Failure Indicators: Missing files, no base href, build errors
    Evidence: .sisyphus/evidence/task-1-vite-build-output.txt
  ```

  **Commit**: YES
  - Message: `chore(scaffold): init Vite 5.x project with multi-page config (pnpm)`
  - Files: `package.json`, `pnpm-lock.yaml`, `vite.config.js`, `.gitignore`
  - Pre-commit: `pnpm build` succeeds

- [ ] 2. Configure PostCSS pipeline

  **What to do**:
  - Create `postcss.config.js` with **`postcss-preset-env`** (modern unified plugin that includes autoprefixer, postcss-nested, and custom properties ‚Ä?replaces deprecated `postcss-custom-properties`)
  - Add explicit autoprefixer config for last 2 browser versions
  - Verify PostCSS loads via Vite (Vite has built-in PostCSS support when `postcss.config.js` is present)
  - Test with a simple CSS file that uses nesting + custom properties

  **Must NOT do**:
  - Don't add Tailwind, Sass, Less ‚Ä?PostCSS only
  - Don't add postcss-import unless explicitly needed (Vite handles CSS imports natively)
  - **Don't use the deprecated `postcss-custom-properties`** ‚Ä?use `postcss-preset-env` instead

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Single config file, well-documented plugins
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T3-T7)
  - **Blocks**: T8-T11 (CSS porting)
  - **Blocked By**: T1 (vite.config.js must exist)

  **References**:
  - Vite PostCSS docs: https://vitejs.dev/config/postcss.html
  - postcss-preset-env: https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env

  **Acceptance Criteria**:
  - [ ] `postcss.config.js` exists with `postcss-preset-env` configured
  - [ ] `pnpm build` succeeds with PostCSS pipeline active
  - [ ] Test CSS file with `& .child` (nested) compiles to flat selectors
  - [ ] Test CSS file with `var(--cyan)` resolves correctly
  - [ ] Autoprefixer adds vendor prefixes for `:focus-visible` in last 2 browser versions

  **QA Scenarios**:
  ```
  Scenario: PostCSS pipeline processes nested selectors
    Tool: Bash
    Preconditions: postcss.config.js exists
    Steps:
      1. Create `test-nested.css` with `.parent { & .child { color: red; } }`
      2. Import in a test HTML page
      3. Run `pnpm build`
      4. Inspect dist/assets/*.css ‚Ä?expect `.parent .child { color: red; }` (flattened)
    Expected Result: Nested CSS is flattened
    Failure Indicators: Nested CSS not processed, build error
    Evidence: .sisyphus/evidence/task-2-postcss-nested-works.txt
  ```

  **Commit**: YES
  - Message: `chore(scaffold): add PostCSS pipeline (postcss-preset-env)`
  - Files: `postcss.config.js`, `package.json` (deps)
  - Pre-commit: `pnpm build` succeeds

- [ ] 3. Set up ESLint + Stylelint + Prettier

  **What to do**:
  - **Use ESLint 8.x (NOT ESLint 9 flat config)** ‚Ä?flat config is too new, ecosystem plugins still catching up. Use legacy `.eslintrc.cjs` format.
  - Create `.eslintrc.cjs` for vanilla JS (no framework rules)
  - Create `.stylelintrc.json` for CSS with design-system-friendly rules
  - Create `.prettierrc` with 2-space indent, single quotes, trailing commas
  - Add npm scripts: `lint`, `lint:fix`, `format`, `format:check`
  - Verify `pnpm lint` runs all three linters and reports clean

  **Must NOT do**:
  - Don't add framework-specific lint rules (no React/Vue/Angular plugins)
  - Don't add TypeScript linting (vanilla JS only ‚Ä?TypeScript only for Playwright config)
  - **Don't use ESLint 9 flat config (`eslint.config.js`)** ‚Ä?use ESLint 8 + `.eslintrc.cjs` for stability

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Config files, well-documented rules
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1, T2, T4-T7)
  - **Blocks**: All subsequent tasks (linting must pass before commit)
  - **Blocked By**: T1 (package.json must exist)

  **References**:
  - ESLint 8 docs: https://eslint.org/docs/v8.x/use/configure/
  - Stylelint: https://stylelint.io/user-guide/configure
  - Prettier: https://prettier.io/docs/en/configuration.html

  **Acceptance Criteria**:
  - [ ] `eslint` v8.x in `package.json` devDependencies
  - [ ] `.eslintrc.cjs` exists with sensible vanilla JS rules
  - [ ] `.stylelintrc.json` exists with CSS rules
  - [ ] `.prettierrc` exists with project conventions
  - [ ] `pnpm lint` runs and reports clean on empty project
  - [ ] `pnpm format:check` passes

  **QA Scenarios**:
  ```
  Scenario: ESLint catches a deliberate error
    Tool: Bash
    Preconditions: .eslintrc.cjs exists
    Steps:
      1. Create `test-lint.js` with `var x = "test"; console.log(x)`
      2. Run `pnpm lint`
      3. Expect ESLint to flag `var` (should be `const` or `let`)
      4. Delete test file
    Expected Result: ESLint flags the var usage
    Failure Indicators: ESLint passes silently
    Evidence: .sisyphus/evidence/task-3-eslint-catches-error.txt
  ```

  **Commit**: YES
  - Message: `chore(scaffold): add ESLint 8 + Stylelint + Prettier config`
  - Files: `.eslintrc.cjs`, `.stylelintrc.json`, `.prettierrc`, `package.json` (scripts)
  - Pre-commit: `pnpm lint` passes

- [ ] 4. Set up Playwright config

  **What to do**:
  - Create `playwright.config.ts` with vite preview server config
  - Configure `baseURL: 'http://localhost:5173'` (vite preview default)
  - Add browsers: chromium, firefox, webkit
  - Add `webServer` config to auto-start `pnpm preview` before tests
  - Create `tests/e2e/smoke.spec.ts` with a placeholder test

  **Must NOT do**:
  - Don't add visual regression SaaS (Percy/Chromatic) ‚Ä?e2e only
  - Don't add component testing (Playwright Test is e2e only)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Standard Playwright config, well-documented
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1-T3, T5-T7)
  - **Blocks**: All Playwright test tasks (T21-T33 QA scenarios, F2/F3)
  - **Blocked By**: T1 (vite.config.js must exist)

  **References**:
  - Playwright config: https://playwright.dev/docs/test-configuration
  - Playwright + Vite: https://playwright.dev/docs/test-webserver

  **Acceptance Criteria**:
  - [ ] `playwright.config.ts` exists with vite preview webServer config
  - [ ] `tests/e2e/smoke.spec.ts` exists with placeholder test
  - [ ] `pnpm test` runs and reports 1 test passing (or skipped if no pages yet)
  - [ ] `pnpm exec playwright install` succeeds (browsers installed)

  **QA Scenarios**:
  ```
  Scenario: Playwright config is valid and runs
    Tool: Bash
    Preconditions: playwright.config.ts exists
    Steps:
      1. Run `pnpm exec playwright test --list`
      2. Expect 1 test listed (smoke.spec.ts)
      3. Run `pnpm test`
      4. Expect test passes (or skipped with reason)
    Expected Result: Test runs successfully
    Failure Indicators: Config error, test fails to start
    Evidence: .sisyphus/evidence/task-4-playwright-config-valid.txt
  ```

  **Commit**: YES
  - Message: `chore(scaffold): add Playwright e2e test config`
  - Files: `playwright.config.ts`, `tests/e2e/smoke.spec.ts`, `package.json` (deps)
  - Pre-commit: `pnpm test` passes

- [ ] 5. Set up GitHub Actions CI

  **What to do**:
  - Create `.github/workflows/ci.yml` with 3 jobs: `lint`, `build`, `test`
  - Use `actions/checkout@v4`, `actions/setup-node@v4` with Node 20
  - Cache `node_modules` and Playwright browsers
  - Run on `pull_request` and `push to main`

  **Must NOT do**:
  - Don't add deployment step (out of scope ‚Ä?user can add later)
  - Don't add code coverage (out of scope)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Standard GitHub Actions config
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1-T4, T6, T7)
  - **Blocks**: F2 (CI gate must be green)
  - **Blocked By**: T1 (package.json with scripts must exist)

  **References**:
  - GitHub Actions docs: https://docs.github.com/en/actions
  - Vite + GH Actions: https://vitejs.dev/guide/static-deploy.html

  **Acceptance Criteria**:
  - [ ] `.github/workflows/ci.yml` exists with 3 jobs
  - [ ] Workflow syntax is valid (test with `act` or push to test branch)
  - [ ] All 3 jobs have proper `needs` dependencies (lint ‚Ü?build ‚Ü?test)

  **QA Scenarios**:
  ```
  Scenario: GitHub Actions workflow YAML is valid
    Tool: Bash
    Preconditions: .github/workflows/ci.yml exists
    Steps:
      1. Validate YAML syntax: `pnpm exec js-yaml .github/workflows/ci.yml` (or use Python yaml)
      2. Expect no parse errors
    Expected Result: Valid YAML
    Failure Indicators: YAML parse error
    Evidence: .sisyphus/evidence/task-5-gh-actions-yaml-valid.txt
  ```

  **Commit**: YES
  - Message: `chore(ci): add GitHub Actions workflow (lint, build, test)`
  - Files: `.github/workflows/ci.yml`
  - Pre-commit: YAML syntax valid

- [ ] 6. Port DESIGN.md to new project

  **What to do**:
  - Copy `../shiny-logic/DESIGN.md` to new project as `DESIGN.md` (single source of truth)
  - Update any references to the old repo URL (if any) to be project-agnostic
  - Add a note at the top: "This is the design system source of truth for the ShinyLogic v3 website. Read this before any visual/UI decision."

  **Must NOT do**:
  - Don't modify the design tokens, anti-patterns, or contract ‚Ä?copy as-is
  - Don't add new sections not in the source

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: File copy, well-defined content
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1-T5, T7)
  - **Blocks**: T28-T33 (design polish audits reference DESIGN.md)
  - **Blocked By**: None (file copy, no deps)

  **References**:
  - `../shiny-logic/DESIGN.md` ‚Ä?source design system (453 lines)

  **Acceptance Criteria**:
  - [ ] `DESIGN.md` exists in new project root
  - [ ] Content is identical to source (or project-agnostic variant)
  - [ ] No references to `shiny-logic/` URLs in the design spec

  **QA Scenarios**:
  ```
  Scenario: DESIGN.md is identical to source
    Tool: Bash (diff)
    Preconditions: Source DESIGN.md exists
    Steps:
      1. `diff ../shiny-logic/DESIGN.md DESIGN.md` (excluding project-specific lines)
      2. Expect no significant diff (only URL/path references may differ)
    Expected Result: Minimal diff, design content preserved
    Failure Indicators: Content loss, accidental edits
    Evidence: .sisyphus/evidence/task-6-design-md-port.txt
  ```

  **Commit**: YES
  - Message: `docs(design): port DESIGN.md as design system source of truth`
  - Files: `DESIGN.md`
  - Pre-commit: Content verified

- [ ] 7. Create src/ directory structure

  **What to do**:
  - Create `src/pages/` (7 page subdirs or flat files ‚Ä?see Wave 2 T18)
  - Create `src/assets/svg/` (for chrome SVGs)
  - Create `src/styles/` (for modular CSS)
  - Create `src/scripts/` (for ESM JS modules)
  - Create `src/i18n/` (for dictionary)
  - Create `public/` (Vite static assets directory ‚Ä?populated in T19, T20)
  - Add `.gitkeep` to each empty dir
  - Update `.gitignore` to exclude `dist/`, `node_modules/`, `.sisyphus/evidence/`

  **Must NOT do**:
  - Don't create placeholder files in any dir (let Wave 2 populate)
  - Don't add anything to `public/` yet (populated in T19, T20)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Directory creation, well-defined structure
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with T1-T6)
  - **Blocks**: T8-T20 (port tasks)
  - **Blocked By**: None (dir creation, no deps)

  **References**:
  - Vite project structure: https://vitejs.dev/guide/#project-structure

  **Acceptance Criteria**:
  - [ ] `src/pages/`, `src/assets/svg/`, `src/styles/`, `src/scripts/`, `src/i18n/` all exist
  - [ ] `public/` exists (empty for now, populated in T19, T20)
  - [ ] Each has `.gitkeep` file
  - [ ] `.gitignore` includes `dist/`, `node_modules/`, `.sisyphus/evidence/`

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: src/ + public/ directory structure matches plan
    Tool: Bash (ls)
    Preconditions: None
    Steps:
      1. `ls -la src/` ‚Ä?expect 5 subdirs (pages, assets/svg, styles, scripts, i18n)
      2. `ls public/` ‚Ä?expect empty dir (no .gitkeep needed; Vite handles it)
      3. Verify all src subdirs have .gitkeep
    Expected Result: 5 src subdirs + 1 public dir
    Failure Indicators: Missing subdirs, public/ missing
    Evidence: .sisyphus/evidence/task-7-src-structure.txt
  ```

  **Commit**: YES
  - Message: `chore(scaffold): create src/ and public/ directory structure`
  - Files: `src/**/.gitkeep`, `public/.gitkeep`, `.gitignore`
  - Pre-commit: Structure verified

### Wave 2 ‚Ä?Code quality / DRY (PR 1)

- [ ] 8. Port styles.css foundation to src/styles/foundation.css

  **What to do**:
  - Read `../shiny-logic/styles.css` lines 1-737 (foundation section)
  - Port tokens (`:root` L8-52), base reset (L54-96), typography (L109-149), layout (L152-185), components (L187-348), chrome (L349-500), motion (L500-737)
  - Save as `src/styles/foundation.css`
  - Import in each per-page CSS file (Wave 2 T9)
  - Verify the import chain works (Vite + PostCSS)

  **Must NOT do**:
  - Don't port the v3 "apple-fusion" layer (L9708-10287) ‚Ä?Wave 2 T10 will audit it
  - Don't port per-page scoped CSS (L738-9367) ‚Ä?that's Wave 2 T9

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Reason**: Large file port, design system contract, must preserve every token
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T9-T20)
  - **Blocks**: T9, T11
  - **Blocked By**: T7 (src/styles/ must exist)

  **References**:
  - `../shiny-logic/styles.css:1-737` ‚Ä?foundation section (tokens, base, components)
  - `../shiny-logic/DESIGN.md:46-93` ‚Ä?token definitions (¬ß4 color, ¬ß5 typography)

  **Acceptance Criteria**:
  - [ ] `src/styles/foundation.css` exists
  - [ ] All `:root` tokens preserved (16 colors + 4 fonts + 10 spacing + 2 motion)
  - [ ] All component classes preserved (`.wrap`, `.section`, `.panel`, `.card`, `.reticle`, `.hairline`, `.metric`, `.btn`, `.pill`, `.tag`)
  - [ ] All motion rules preserved (`.reveal`, `.is-in`, animations)
  - [ ] File imports successfully in a test page

  **QA Scenarios**:
  ```
  Scenario: foundation.css preserves all design tokens
    Tool: Bash (grep)
    Preconditions: foundation.css exists
    Steps:
      1. Grep `--cyan` in foundation.css ‚Ä?expect `--cyan: #67E8F9` defined
      2. Grep `--font-display` ‚Ä?expect `"Saira", "Noto Sans TC", system-ui, sans-serif` (NO Roboto)
      3. Grep `.btn--primary` ‚Ä?expect class definition present
    Expected Result: All tokens preserved
    Failure Indicators: Missing tokens, accidental edits
    Evidence: .sisyphus/evidence/task-8-foundation-tokens.txt

  Scenario: foundation.css imports in test page
    Tool: Bash (curl)
    Preconditions: foundation.css exists, test page references it
    Steps:
      1. `pnpm build`
      2. Check dist/assets/*.css contains foundation rules
      3. Load test page in browser, verify styles apply
    Expected Result: Styles apply correctly
    Failure Indicators: Styles missing, 404 on CSS
    Evidence: .sisyphus/evidence/task-8-foundation-imports.txt
  ```

  **Commit**: YES
  - Message: `refactor(css): port foundation.css (L1-737) to src/styles/foundation.css`
  - Files: `src/styles/foundation.css`
  - Pre-commit: `pnpm build` succeeds, lint passes

- [ ] 9. Port per-page scoped CSS to src/styles/pages/*.css √ó 7

  **What to do**:
  - Read `../shiny-logic/styles.css` lines 738-9367 (per-page scoped sections)
  - **First port `chrome.css`** (shared across all pages):
    - L3523-3768 ‚Ä?v2 chrome (nav tabs active state, language switcher styles, footer sitemap, page-hero band, form controls, responsive rules)
    - This is the SHARED CSS that doesn't belong to any single page
    - Save as `src/styles/chrome.css`
    - Each per-page CSS file imports `chrome.css` after `foundation.css`
  - **Then port each page's CSS to `src/styles/pages/<page>.css`**:
    - `home.css` (L738-3522) ‚Ä?index.html sections
    - `about.css` (L3769-4517)
    - `careers.css` (L4518-5243)
    - `case-studies.css` (L5244-6397)
    - `contact.css` (L6398-7169)
    - `solutions.css` (L7170-8130)
    - `technology.css` (L8131-9367)
  - Each file imports `foundation.css` then `chrome.css` at the top
  - Verify Vite multi-page config picks up each page's CSS bundle

  **Must NOT do**:
  - Don't port the v3 patches (L9708-10287) ‚Ä?Wave 2 T10 will audit
  - Don't merge or dedupe across pages yet (out of scope for this task)
  - **Don't skip L3523-3768 (v2 chrome) ‚Ä?it's the shared chrome CSS that all pages need**

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Reason**: Large file port, 7 separate files + 1 shared chrome file, must preserve scoped class names
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T8, T10-T20)
  - **Blocks**: T11
  - **Blocked By**: T8 (foundation.css must exist for @import)

  **References**:
  - `../shiny-logic/styles.css:3523-3768` ‚Ä?v2 chrome (shared across pages, ~245 lines)
  - `../shiny-logic/styles.css:738-3522` ‚Ä?home (index.html) sections
  - `../shiny-logic/styles.css:3769-4517` ‚Ä?about
  - `../shiny-logic/styles.css:4518-5243` ‚Ä?careers
  - `../shiny-logic/styles.css:5244-6397` ‚Ä?case-studies
  - `../shiny-logic/styles.css:6398-7169` ‚Ä?contact
  - `../shiny-logic/styles.css:7170-8130` ‚Ä?solutions
  - `../shiny-logic/styles.css:8131-9367` ‚Ä?technology

  **Acceptance Criteria**:
  - [ ] `src/styles/chrome.css` exists with L3523-3768 content
  - [ ] 7 page CSS files exist in `src/styles/pages/`
  - [ ] Each page CSS file imports `foundation.css` then `chrome.css` at the top
  - [ ] All scoped class names preserved (`.s-arch__*`, `.s-mission__*`, etc.)
  - [ ] Chrome CSS imports correctly (nav active state, lang switcher, footer all work)
  - [ ] `pnpm build` produces 7 separate CSS bundles in `dist/assets/`
  - [ ] Total CSS size is roughly equivalent to source (allow ¬±5% for import overhead)

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: chrome.css exists with v2 chrome content
    Tool: Bash (ls + grep)
    Preconditions: src/styles/ exists
    Steps:
      1. `ls src/styles/` ‚Ä?expect foundation.css, chrome.css
      2. `grep "nav.*active\|aria-current" src/styles/chrome.css` ‚Ä?expect matches
    Expected Result: chrome.css exists with v2 chrome content
    Failure Indicators: chrome.css missing, no nav active styles
    Evidence: .sisyphus/evidence/task-9-chrome-css.txt

  Scenario: All 7 per-page CSS files exist and import foundation + chrome
    Tool: Bash (ls + grep)
    Preconditions: src/styles/pages/ exists
    Steps:
      1. `ls src/styles/pages/` ‚Ä?expect home.css, about.css, careers.css, case-studies.css, contact.css, solutions.css, technology.css
      2. Grep `@import.*foundation` in each ‚Ä?expect import present
      3. Grep `@import.*chrome` in each ‚Ä?expect import present
    Expected Result: 7 files, all import foundation + chrome
    Failure Indicators: Missing files, no chrome import
    Evidence: .sisyphus/evidence/task-9-page-css-files.txt

  Scenario: Vite produces 7 per-page CSS bundles
    Tool: Bash (ls dist/assets)
    Preconditions: Vite multi-page config with 7 pages
    Steps:
      1. `pnpm build`
      2. `ls dist/assets/*.css` ‚Ä?expect at least 7 CSS files (one per page)
    Expected Result: 7 CSS bundles
    Failure Indicators: Single bundle, missing bundles
    Evidence: .sisyphus/evidence/task-9-vite-css-bundles.txt

  Scenario: Chrome styles apply correctly (nav active state visible)
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Navigate to home page
      2. Verify active nav link has cyan underline / active style
      3. Navigate to about page
      4. Verify about link is now active (not home)
    Expected Result: Nav active state works
    Failure Indicators: All links look identical (chrome.css not applied)
    Evidence: .sisyphus/evidence/task-9-chrome-applied.png
  ```

  **Commit**: YES
  - Message: `refactor(css): port chrome.css (v2 chrome) + 7 per-page CSS files`
  - Files: `src/styles/chrome.css`, `src/styles/pages/*.css` (7 files)
  - Pre-commit: `pnpm build` succeeds, lint passes, chrome active state works

- [ ] 10. Audit + fix --font-display Roboto collision (L9735)

  **What to do**:
  - Read `../shiny-logic/styles.css:9708-9735` (v3 apple-fusion layer)
  - Identify the `--font-display` override at L9735 that includes Roboto
  - **Decide**: Don't port the v3 layer as-is. If the v3 layer's intent (prepend system fonts) is valuable, port a clean version WITHOUT Roboto:
    ```css
    --font-display: "Saira", "Noto Sans TC", system-ui, sans-serif;
    ```
  - If the v3 layer's other content (easing curves, light mode, view transitions) is wanted, port selectively
  - Document the decision in a code comment in `foundation.css`

  **Must NOT do**:
  - Don't keep Roboto in any font stack (violates DESIGN.md ¬ß3)
  - Don't port the full v3 layer as-is (it has multiple design violations)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Surgical fix, well-defined violation
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T8, T9, T11-T20)
  - **Blocks**: T31 (typography compliance audit verifies this fix)
  - **Blocked By**: T8 (foundation.css must exist)

  **References**:
  - `../shiny-logic/styles.css:9731-9739` ‚Ä?Roboto violation
  - `../shiny-logic/DESIGN.md:38-42` ‚Ä?anti-pattern list (no Inter/Roboto/Arial)
  - `../shiny-logic/DESIGN.md:80-92` ‚Ä?font stack definitions

  **Acceptance Criteria**:
  - [ ] `--font-display` in new project is `"Saira", "Noto Sans TC", system-ui, sans-serif` (NO Roboto)
  - [ ] No other CSS variable or class definition includes Roboto/Inter/Arial
  - [ ] Code comment in `foundation.css` documents the audit decision
  - [ ] Lint passes

  **QA Scenarios**:
  ```
  Scenario: No Roboto/Inter/Arial in any font stack
    Tool: Bash (grep)
    Preconditions: foundation.css exists
    Steps:
      1. `grep -i "roboto\|inter\|arial" src/styles/foundation.css` ‚Ä?expect no matches
      2. `grep -i "roboto\|inter\|arial" src/styles/pages/*.css` ‚Ä?expect no matches
    Expected Result: Zero matches
    Failure Indicators: Any match
    Evidence: .sisyphus/evidence/task-10-no-roboto-inter-arial.txt
  ```

  **Commit**: YES
  - Message: `fix(css): remove Roboto from --font-display (DESIGN.md ¬ß3 compliance)`
  - Files: `src/styles/foundation.css`
  - Pre-commit: Lint passes

- [ ] 11. Migrate 333 inline style= ‚Ü?CSS custom properties or scoped classes

  **What to do**:
  - **T11's role**: This task CREATES the CSS infrastructure (the `[data-rise] { animation-delay: var(--delay) }` rule and any new scoped classes) AND audits/categorizes the 333 inline styles. T11 does NOT itself port the HTML ‚Ä?that happens in T18.
  - Read all 7 source HTML files and find all `style="..."` attributes (**333 total**, NOT 290)
  - **Categorize each** (actual counts from source):
    - **28 √ó `style="animation-delay:.XXs"`** on `[data-rise]` elements (hero stagger) ‚Ü?will be converted to `style="--delay:.XXs"` in T18
    - **144 √ó `style="--i:N"`** (stagger index on cards/rows) ‚Ü?**KEEP INLINE** (per-element data, correct pattern)
    - **20 √ó data-driven properties** (`--pct`, `--pos`, `--seg-w`, `--phase-pct`) ‚Ü?**KEEP INLINE** (per-element data)
    - **62 √ó `font-size:.XXrem`** ‚Ü?migrate to scoped CSS classes
    - **12 √ó `display:inline|none`** ‚Ü?migrate to scoped CSS classes
    - **67 √ó other functional** (`text-align`, `min-width`, `vertical-align`, `border-color`, `padding`, `color`, `gap`, etc.) ‚Ü?migrate to scoped CSS classes
  - **Create CSS infrastructure in `foundation.css`**:
    - Add `[data-rise] { animation-delay: var(--delay); }` rule
    - Add new scoped classes for the 141 functional styles (`.icon-inline`, `.brand__sub--inline`, `.text-center`, `.text-mono-tight`, etc.)
  - **Generate a migration map**: a doc listing which HTML elements use which new pattern (consumed by T18)
  - T18 will apply the migration to the ported HTML files

  **Must NOT do**:
  - Don't create utility classes for every unique animation-delay value (only 28, but principle still applies)
  - Don't change the visual behavior ‚Ä?stagger must be identical
  - Don't extract CSS custom property assignments (`--i`, `--pct`, `--pos`, `--seg-w`, `--phase-pct`) ‚Ä?those are per-element data
  - Don't port HTML files in this task ‚Ä?that's T18's job
  - **Don't claim the count is 200+ animation-delay** ‚Ä?the actual count is 28

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Categorization + CSS infrastructure creation + audit across 7 files (333 styles, 6 categories)
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T8-T10, T12-T20)
  - **Blocks**: T18 (HTML porting uses the new CSS infrastructure), T21 (a11y uses clean HTML)
  - **Blocked By**: T8, T9 (foundation + per-page CSS must exist)

  **References**:
  - `../shiny-logic/index.html:54-80` ‚Ä?hero with data-rise + style="animation-delay"
  - `../shiny-logic/styles.css:500-737` ‚Ä?motion section (reveal, is-in, animations)
  - `../shiny-logic/DESIGN.md:178-190` ‚Ä?motion contract (hero stagger, prefers-reduced-motion)
  - **Verified count**: 333 inline styles across 7 pages, 28 animation-delay, 144 --i, 20 data props, 141 functional (62 font-size, 12 display, 67 other)

  **Acceptance Criteria**:
  - [ ] All 333 inline `style="..."` attributes categorized (audit document)
  - [ ] `foundation.css` has `[data-rise] { animation-delay: var(--delay); }` rule
  - [ ] New scoped classes for the 141 functional styles defined in `foundation.css` or per-page CSS
  - [ ] Migration map generated ‚Ä?saved as `.sisyphus/evidence/task-11-migration-map.md`
  - [ ] All 6 categories correctly identified (28 anim-delay, 144 --i, 20 data, 62 font-size, 12 display, 67 other)

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: CSS infrastructure for migration is in place
    Tool: Bash (grep)
    Preconditions: foundation.css exists, T8 + T9 complete
    Steps:
      1. `grep "data-rise.*animation-delay.*var" src/styles/foundation.css` ‚Ä?expect match
      2. `grep "icon-inline\|brand__sub--inline\|text-center\|text-mono-tight" src/styles/foundation.css` ‚Ä?expect matches
    Expected Result: Infrastructure in place
    Failure Indicators: Missing rules
    Evidence: .sisyphus/evidence/task-11-css-infrastructure.txt

  Scenario: Migration map is generated with all 333 styles categorized
    Tool: Bash (ls)
    Preconditions: T11 complete
    Steps:
      1. `cat .sisyphus/evidence/task-11-migration-map.md` ‚Ä?expect document listing 333 inline styles across 6 categories
      2. Verify document mentions: "28 animation-delay, 144 --i, 20 data props, 62 font-size, 12 display, 67 other"
    Expected Result: Migration map exists with correct counts
    Failure Indicators: Missing map, wrong counts
    Evidence: .sisyphus/evidence/task-11-migration-map.md
  ```

  **Commit**: YES
  - Message: `refactor(css): create infrastructure for migrating 333 inline styles (data-rise + 141 scoped classes)`
  - Files: `src/styles/foundation.css`, `src/styles/pages/*.css`, `.sisyphus/evidence/task-11-migration-map.md`
  - Pre-commit: `pnpm build` succeeds, infrastructure grep passes

- [ ] 12. Audit <noscript><style> blocks per-page

  **What to do**:
  - Read each source HTML file: `index.html:62`, `about.html:62`, `solutions.html:62`, etc.
  - Verify each has `<noscript><style>.reveal{opacity:1!important;transform:none!important}</style></noscript>`
  - In the new project, ensure each ported HTML file has this block inline (in `<head>`)
  - Document in a code comment why this must remain per-page (progressive enhancement)

  **Must NOT do**:
  - Don't extract to a shared file (must remain per-page for no-JS browsers)
  - Don't change the rule (it's the correct fallback)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Verification + comment addition
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T8-T11, T13-T20)
  - **Blocks**: T21 (skip link + a11y assumes correct progressive enhancement)
  - **Blocked By**: None (read-only audit until T18 ports HTML)

  **References**:
  - `../shiny-logic/index.html:62` ‚Ä?example `<noscript><style>` block
  - `../shiny-logic/README.md:32-33` ‚Ä?"readable with JS off" requirement

  **Acceptance Criteria**:
  - [ ] All 7 ported HTML files have `<noscript><style>.reveal{opacity:1!important;transform:none!important}</style></noscript>` in `<head>`
  - [ ] Code comment in each explains: "Must remain per-page for no-JS progressive enhancement"
  - [ ] Playwright test: disable JS, verify content is visible

  **QA Scenarios**:
  ```
  Scenario: All 7 HTML files have correct <noscript> block
    Tool: Bash (grep)
    Preconditions: HTML files ported
    Steps:
      1. `grep -l "noscript.*reveal" src/pages/*.html` ‚Ä?expect 7 matches
    Expected Result: 7 files have the block
    Failure Indicators: Missing files
    Evidence: .sisyphus/evidence/task-12-noscript-blocks.txt

  Scenario: No-JS fallback works
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Set `javaScriptEnabled: false` in Playwright context
      2. Navigate to http://localhost:5173/
      3. Verify hero content is visible (not hidden by .reveal initial state)
    Expected Result: Content visible without JS
    Failure Indicators: Content hidden
    Evidence: .sisyphus/evidence/task-12-no-js-fallback.png
  ```

  **Commit**: YES
  - Message: `docs(html): audit and document <noscript> per-page pattern`
  - Files: `src/pages/*.html` (7 files, comment additions in T18)
  - Pre-commit: `pnpm build` succeeds

- [ ] 13. Extract 24 chrome SVGs to src/assets/svg/

  **What to do**:
  - Identify 24 chrome SVGs across the 7 source HTML files:
    - Theme toggle (moon/sun) ‚Ä?~24 instances (12 per page √ó 2 variants)
    - Nav arrows (chevrons) ‚Ä?small number
    - Button icons (download, arrow) ‚Ä?small number
  - Extract unique SVGs to `src/assets/svg/`:
    - `theme-toggle-moon.svg`
    - `theme-toggle-sun.svg`
    - `icon-chevron-down.svg` (if present)
    - `icon-arrow-right.svg` (if present)
  - **Use Vite's `?raw` import** for reliability (avoids `<use>` cross-origin / CSP issues):
    ```js
    // src/scripts/icons.js
    import moonIcon from '@/assets/svg/theme-toggle-moon.svg?raw';
    import sunIcon from '@/assets/svg/theme-toggle-sun.svg?raw';
    // Inject into DOM via innerHTML
    ```
  - In each HTML file, replace inline `<svg>...</svg>` with `<span class="icon" data-icon="theme-moon"></span>` and populate via JS

  **Must NOT do**:
  - Don't extract semantic/diagram SVGs (architecture diagrams, capability icons) ‚Ä?they are unique per page
  - Don't extract decorative SVGs (reticle marks, grain) ‚Ä?they're utility elements
  - Don't change visual appearance
  - **Don't use `<use href="external.svg#id">` pattern** ‚Ä?use Vite `?raw` import for reliability

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Identify + extract 24 SVGs across 7 files, create `icons.js` with `?raw` imports, modify 7 HTML files to use `<span data-icon>` markers, test theme toggle ‚Ä?this is multi-file refactoring with state coupling
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T8-T12, T14-T20)
  - **Blocks**: T18 (HTML porting uses extracted SVGs)
  - **Blocked By**: T7 (src/assets/svg/ must exist)

  **References**:
  - `../shiny-logic/index.html` ‚Ä?find theme toggle SVG (search for "moon" or "sun" in class names)
  - `../shiny-logic/script.js:563-621` ‚Ä?theme manager (uses these SVGs)
  - Vite `?raw` imports: https://vitejs.dev/guide/assets.html#importing-asset-as-string

  **Acceptance Criteria**:
  - [ ] `src/assets/svg/theme-toggle-moon.svg` exists
  - [ ] `src/assets/svg/theme-toggle-sun.svg` exists
  - [ ] `src/scripts/icons.js` imports SVGs via `?raw`
  - [ ] All 24 instances in 7 HTML files replaced with `<span data-icon="...">` markers
  - [ ] Theme toggle still works (click switches moon ‚Ü?sun)
  - [ ] Visual appearance unchanged
  - [ ] No `<use href="external.svg">` patterns (avoided for reliability)

  **QA Scenarios**:
  ```
  Scenario: Chrome SVGs extracted to assets via ?raw import
    Tool: Bash (ls) + Playwright
    Preconditions: src/assets/svg/ exists, src/scripts/icons.js exists
    Steps:
      1. `ls src/assets/svg/` ‚Ä?expect at least theme-toggle-moon.svg, theme-toggle-sun.svg
      2. `grep -c "<svg.*theme-toggle" src/pages/*.html` ‚Ä?expect 0 (replaced with <span data-icon>)
      3. Navigate to home page in Playwright
      4. Query `[data-icon="theme-moon"]` and `[data-icon="theme-sun"]` ‚Ä?expect <svg> children rendered
    Expected Result: Files exist, inline replaced, icons render
    Failure Indicators: Missing files, inline still present, icons missing
    Evidence: .sisyphus/evidence/task-13-chrome-svgs-extracted.txt

  Scenario: Theme toggle works after extraction
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Navigate to http://localhost:5173/
      2. Click theme toggle button
      3. Verify `data-theme` attribute on `<html>` changes
      4. Verify sun ‚Ü?moon icon swaps
    Expected Result: Theme toggle works
    Failure Indicators: Icon missing, theme doesn't switch
    Evidence: .sisyphus/evidence/task-13-theme-toggle-works.png
  ```

  **Commit**: YES
  - Message: `refactor(svg): extract 24 chrome SVGs to src/assets/svg/ via Vite ?raw import`
  - Files: `src/assets/svg/*.svg`, `src/scripts/icons.js`, `src/pages/*.html` (7 files)
  - Pre-commit: `pnpm build` succeeds, theme toggle test passes

- [ ] 14. Build + run scripts/audit-i18n.mjs to find ~84 orphan i18n keys

  **What to do**:
  - Write `scripts/audit-i18n.mjs` that:
    1. Reads `../shiny-logic/i18n-dict.js` and parses `window.I18N`
    2. Reads all 7 source HTML files and finds all `data-i18n`, `data-i18n-attr`, `data-i18n-html` attributes
    3. Finds keys in dict that are NOT referenced in any HTML file
    4. Outputs a report: `Orphan keys: N (list)`
  - Run the script on the source repo to confirm ~84 orphans
  - In the new project, trim the dictionary to only referenced keys
  - Save the trimmed dict as `src/i18n/dict.js` (Wave 2 T17)

  **Must NOT do**:
  - Don't change any key VALUES (content is frozen per Q4)
  - Don't add new keys (out of scope)
  - Don't remove keys that ARE referenced in HTML

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Single-purpose script, well-defined input/output
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T8-T13, T15-T20)
  - **Blocks**: T17 (trimmed dict)
  - **Blocked By**: None (reads from source, no project deps)

  **References**:
  - `../shiny-logic/i18n-dict.js` ‚Ä?dictionary (3,182 lines, 1,058 keys)
  - All 7 source HTML files ‚Ä?find data-i18n attributes

  **Acceptance Criteria**:
  - [ ] `scripts/audit-i18n.mjs` exists
  - [ ] Script parses dict and HTML correctly
  - [ ] Output report lists orphan keys (target: ~84, ¬±10)
  - [ ] Script is idempotent (running twice gives same result)

  **QA Scenarios**:
  ```
  Scenario: Audit script reports ~84 orphan keys
    Tool: Bash (node)
    Preconditions: scripts/audit-i18n.mjs exists, source repo present
    Steps:
      1. `node scripts/audit-i18n.mjs`
      2. Expect output: "Orphan keys: 84 (range: 74-94)"
      3. Verify report file written to `.sisyphus/evidence/task-14-orphan-keys.txt`
    Expected Result: ~84 orphans
    Failure Indicators: 0 orphans (script broken), 200+ orphans (false positives)
    Evidence: .sisyphus/evidence/task-14-orphan-keys.txt
  ```

  **Commit**: YES
  - Message: `chore(i18n): add audit-i18n.mjs to detect orphan dictionary keys`
  - Files: `scripts/audit-i18n.mjs`
  - Pre-commit: Script runs successfully

- [ ] 15. Port script.js ‚Ü?src/scripts/core.js (ESM modules)

  **What to do**:
  - Read `../shiny-logic/script.js` (757 lines, 6 IIFEs)
  - Convert each IIFE to an ESM module:
    - Core (IntersectionObserver, counter, nav scroll, mobile menu, smooth anchors)
    - Architecture (accordion keyboard nav)
    - Compute grid (GPU dot-grid)
    - Theme manager (light/dark toggle)
    - Hero parallax
    - Contact form
  - Save as `src/scripts/core.js` (or split into 6 modules + 1 index.js)
  - Update Vite config to handle ESM
  - Verify all 6 behaviors still work

  **Must NOT do**:
  - Don't change the logic ‚Ä?only the module structure
  - Don't add a framework (stay vanilla)
  - Don't add new features

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: 6 IIFEs ‚Ü?ESM modules, requires careful refactoring
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T8-T14, T16-T20)
  - **Blocks**: T18 (HTML references the new module path)
  - **Blocked By**: T7 (src/scripts/ must exist)

  **References**:
  - `../shiny-logic/script.js:1-757` ‚Ä?full file with 6 IIFEs
  - Vite ESM docs: https://vitejs.dev/guide/features.html#import-with-query-suffixes

  **Acceptance Criteria**:
  - [ ] `src/scripts/core.js` exists (or 6 separate modules)
  - [ ] All 6 IIFEs (modules) preserved, producing 7 user-facing behaviors: core (5: reveal, counter, nav scroll, mobile menu, smooth anchors), architecture (accordion), compute-grid (GPU grid), theme (light/dark), hero-parallax (translateY + video scale + wafer scan), contact-form (validation)
  - [ ] Module imports correctly via Vite
  - [ ] No `window.*` global pollution (except `window.I18N` from dict)
  - [ ] All Playwright tests pass (behavior unchanged)

  **QA Scenarios**:
  ```
  Scenario: All 6 script.js IIFEs work after ESM conversion
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Navigate to http://localhost:5173/
      2. Verify IntersectionObserver triggers reveal (scroll into view)
      3. Verify counter animates from 0 to value
      4. Verify mobile menu opens/closes
      5. Verify theme toggle switches light/dark
      6. Verify hero parallax responds to scroll
      7. Verify contact form validates input
    Expected Result: All 6 behaviors work
    Failure Indicators: Any behavior broken
    Evidence: .sisyphus/evidence/task-15-iife-behaviors.png
  ```

  **Commit**: YES
  - Message: `refactor(js): convert script.js IIFEs to ESM modules`
  - Files: `src/scripts/core.js` (or 6 module files)
  - Pre-commit: `pnpm build` succeeds, all 6 behavior tests pass

- [ ] 16. Port i18n.js ‚Ü?src/scripts/i18n.js (ESM runtime)

  **What to do**:
  - Read `../shiny-logic/i18n.js` (147 lines)
  - Convert to ESM module
  - Import dict from `../i18n/dict.js`
  - Save as `src/scripts/i18n.js`
  - Update HTML files (T18) to use new module path

  **Must NOT do**:
  - Don't change the fallback chain (locale ‚Ü?zh-Hant ‚Ü?DOM text)
  - Don't change the `sl:langchange` event firing
  - Don't change the `aria-pressed` switcher button handling

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Single file, well-documented logic
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T8-T15, T17-T20)
  - **Blocks**: T17 (dict import), T18 (HTML references)
  - **Blocked By**: T7 (src/scripts/ must exist)

  **References**:
  - `../shiny-logic/i18n.js:1-147` ‚Ä?full runtime
  - `../shiny-logic/DESIGN.md:374-396` ‚Ä?i18n contract

  **Acceptance Criteria**:
  - [ ] `src/scripts/i18n.js` exists
  - [ ] Fallback chain preserved (locale ‚Ü?zh-Hant ‚Ü?DOM text)
  - [ ] `sl:langchange` event still fires on locale switch
  - [ ] `localStorage['sl-lang']` still persisted
  - [ ] Language switcher buttons work in all 3 locales

  **QA Scenarios**:
  ```
  Scenario: i18n runtime works after ESM conversion
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Navigate to http://localhost:5173/
      2. Click "EN" language button
      3. Verify visible text changes to English
      4. Verify `localStorage['sl-lang']` is "en"
      5. Reload page, verify English persists
      6. Click "Áπ? button, verify reverts to ÁπÅ‰∏≠
    Expected Result: All 3 locales switch correctly
    Failure Indicators: Text doesn't change, no persistence
    Evidence: .sisyphus/evidence/task-16-i18n-runtime.txt
  ```

  **Commit**: YES
  - Message: `refactor(i18n): convert i18n.js to ESM module`
  - Files: `src/scripts/i18n.js`
  - Pre-commit: `pnpm build` succeeds, locale switcher test passes

- [ ] 17. Port i18n-dict.js ‚Ü?src/i18n/dict.js (3 locales, post-orphan-trim)

  **What to do**:
  - Read `../shiny-logic/i18n-dict.js` (236 KB, 1,058 keys √ó 3 locales)
  - Remove the ~84 orphan keys identified by `audit-i18n.mjs` (T14)
  - Convert to ESM module: `export const I18N = { "zh-Hant": {...}, "en": {...}, "zh-Hans": {...} }`
  - Save as `src/i18n/dict.js`
  - Update i18n.js (T16) to import from this path

  **Must NOT do**:
  - Don't change any key VALUES (content is frozen)
  - Don't rename any keys
  - Don't remove keys that ARE referenced in HTML

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Large file trim, requires careful key-by-key review
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T8-T16, T18-T20)
  - **Blocks**: T18 (HTML references the dict)
  - **Blocked By**: T14 (orphan list), T16 (i18n.js import path)

  **References**:
  - `../shiny-logic/i18n-dict.js` ‚Ä?full dictionary
  - `scripts/audit-i18n.mjs` (from T14) ‚Ä?orphan list

  **Acceptance Criteria**:
  - [ ] `src/i18n/dict.js` exists
  - [ ] All 3 locales present (zh-Hant, en, zh-Hans)
  - [ ] Orphan keys removed (~84 fewer keys)
  - [ ] No key values changed
  - [ ] All HTML text still translates correctly

  **QA Scenarios**:
  ```
  Scenario: i18n dict has correct key count after trim
    Tool: Bash (node)
    Preconditions: src/i18n/dict.js exists
    Steps:
      1. Write a quick script: count keys in `zh-Hant` locale
      2. Expect: original count (1,058) - orphan count (~84) = ~974 keys
    Expected Result: ~974 keys per locale
    Failure Indicators: 1,058 (no trim), <900 (over-trim)
    Evidence: .sisyphus/evidence/task-17-dict-key-count.txt

  Scenario: All HTML text translates correctly
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Switch to each of 3 locales
      2. Verify no "missing translation" placeholder or blank text
      3. Verify sample texts translate (e.g., hero headline)
    Expected Result: All translations present
    Failure Indicators: Blank text, missing translations
    Evidence: .sisyphus/evidence/task-17-translations-ok.png
  ```

  **Commit**: YES
  - Message: `chore(i18n): port i18n-dict.js with ~84 orphan keys trimmed`
  - Files: `src/i18n/dict.js`
  - Pre-commit: `pnpm build` succeeds, all 3 locales render correctly

- [ ] 18. Port 7 HTML pages ‚Ü?src/pages/*.html with multi-page Vite config

  **What to do**:
  - Read each source HTML file: `index.html`, `about.html`, `solutions.html`, `technology.html`, `case-studies.html`, `careers.html`, `contact.html`
  - Port each to `src/pages/<page>.html` with:
    - Updated canonical URL (use new deployment path, NOT `shiny-logic/`)
    - Updated OG URL (same)
    - All `data-i18n` attributes preserved
    - All inline styles migrated (T11 pattern)
    - All chrome SVGs replaced with `<use>` (T13 pattern)
    - All `<noscript>` blocks preserved (T12 pattern)
    - **`<head>` setup**: Google Fonts `<link>` (see T18a for pre-port), favicon, og-image, theme-color meta ‚Ä?handled by T18a
    - Skip link added (T21, but can defer to T21)
  - Update `vite.config.js` `rollupOptions.input` to point to `src/pages/*.html`

  **Must NOT do**:
  - Don't reference `shiny-logic/` in any URL
  - Don't change the 7-page content (copy is frozen per Q4)
  - Don't change the section structure (semantic HTML frozen per Q4)
  - Don't add Google Fonts `<link>` here (T18a handles it independently)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: 7 large HTML files, careful content preservation
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T8-T17, T18a, T19-T20)
  - **Blocks**: T21-T33 (a11y + polish tasks assume HTML structure)
  - **Blocked By**: T8, T9, T11, T13, T15, T16, T17 (all upstream tasks)

  **References**:
  - `../shiny-logic/index.html:1-100` ‚Ä?see head structure, theme script, canonical, OG
  - `../shiny-logic/about.html:1-100` ‚Ä?similar structure
  - All 7 source HTML files

  **Acceptance Criteria**:
  - [ ] 7 HTML files in `src/pages/`
  - [ ] All canonical URLs use new deployment path (NOT `shiny-logic/`)
  - [ ] All OG URLs use new deployment path
  - [ ] All `data-i18n` attributes preserved
  - [ ] Vite config points to `src/pages/*.html`
  - [ ] `pnpm build` succeeds, all 7 pages in `dist/`

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: All 7 pages build and load correctly
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Navigate to each of 7 pages
      2. Verify HTTP 200 for all
      3. Verify no console errors
      4. Verify <head> has correct canonical URL (NOT shiny-logic/)
    Expected Result: All 7 pages work
    Failure Indicators: 404, console errors, shiny-logic URLs
    Evidence: .sisyphus/evidence/task-18-seven-pages-build.txt

  Scenario: Vite base path /shiny3/ is applied
    Tool: Bash (curl)
    Preconditions: pnpm build completed
    Steps:
      1. `curl http://localhost:5173/shiny3/` ‚Ä?expect HTTP 200
      2. `curl http://localhost:4173/shiny3/` (preview) ‚Ä?expect HTTP 200
    Expected Result: Both work with /shiny3/ path
    Failure Indicators: 404 on /shiny3/ path
    Evidence: .sisyphus/evidence/task-18-base-path-applied.txt
  ```

  **Commit**: YES
  - Message: `feat(html): port 7 HTML pages with new canonical URLs and Vite multi-page config`
  - Files: `src/pages/*.html` (7 files), `vite.config.js`
  - Pre-commit: `pnpm build` succeeds, all 7 pages load

- [ ] 18a. Add Google Fonts loading to all 7 HTML pages (post-port head setup)

  **What to do**:
  - **Prerequisite**: T18 has already ported the 7 HTML files to `src/pages/*.html` with empty/placeholder `<head>` structure
  - Add to each of the 7 HTML files' `<head>`:
    ```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+TC:wght@300;400;500;700&family=Saira+Condensed:wght@500;600;700&family=Saira:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    ```
  - This loads 4 families: Saira (6 weights), Saira Condensed (3), IBM Plex Mono (3), Noto Sans TC (4) = 16 font faces
  - Use `display=swap` to prevent FOIT
  - Verify with Playwright: all 4 font families load, no 404s
  - Verify with `browse` skill: visual rendering of all 4 typefaces (Latin display, big stat numerals, mono, CJK)

  **Must NOT do**:
  - Don't self-host fonts (out of scope, requires extra infra)
  - Don't add Inter/Roboto/Arial (forbidden per DESIGN.md ¬ß3)
  - Don't add more weights than needed (4 families √ó 16 faces is the correct count)
  - Don't run before T18 ‚Ä?T18a assumes HTML files exist in `src/pages/`

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Critical for typography, must match DESIGN.md ¬ß5 exactly
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (within Wave 2)
  - **Parallel Group**: Wave 2 (with T8-T18, T19-T20)
  - **Blocks**: (none ‚Ä?T18a is a leaf task that finalizes `<head>`)
  - **Blocked By**: T18 (HTML pages must be ported first)

  **References**:
  - `../shiny-logic/DESIGN.md:80-92` ‚Ä?font stack definitions (4 families + weights)
  - `../shiny-logic/index.html:1-30` ‚Ä?see existing Google Fonts `<link>` pattern
  - Google Fonts API docs: https://developers.google.com/fonts/docs/css2

  **Acceptance Criteria**:
  - [ ] All 7 HTML files have correct Google Fonts `<link>` in `<head>`
  - [ ] `<link rel="preconnect">` for fonts.googleapis.com AND fonts.gstatic.com
  - [ ] 4 families loaded: Saira, Saira Condensed, IBM Plex Mono, Noto Sans TC
  - [ ] 16 font faces total (correct weights per family)
  - [ ] `display=swap` set
  - [ ] No 404s in network tab

  **QA Scenarios (MANDATORY)**:
  ```
  Scenario: All 4 font families load without 404
    Tool: Playwright
    Preconditions: vite preview running, T18 already merged
    Steps:
      1. Navigate to home page
      2. Open Network tab in trace
      3. Filter by `fonts.googleapis.com` ‚Ä?expect 1 request
      4. Filter by `fonts.gstatic.com` ‚Ä?expect 16 requests (one per font face)
      5. Verify all return HTTP 200
    Expected Result: All 16 font faces load
    Failure Indicators: Any 404, missing family
    Evidence: .sisyphus/evidence/task-18a-fonts-load.txt

  Scenario: All 4 typefaces render correctly
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Navigate to home page
      2. Query computed font-family of: hero h1 (Saira display), stat numerals (Saira Condensed), kicker (IBM Plex Mono), CJK body (Noto Sans TC)
      3. Verify each matches expected family
      4. Take screenshot of hero, verify typefaces visually
    Expected Result: All 4 typefaces render
    Failure Indicators: Wrong font, fallback to system-ui
    Evidence: .sisyphus/evidence/task-18a-typefaces-render.png
  ```

  **Commit**: YES
  - Message: `feat(typography): add Google Fonts loading (4 families, 16 faces) to all 7 pages`
  - Files: `src/pages/*.html` (7 files)
  - Pre-commit: `pnpm build` succeeds, all 16 faces load, no 404s

- [ ] 19. Port favicon.svg, og-image.png, og-card.html, logo.webp, logo.png ‚Ü?public/

  **What to do**:
  - Copy these assets from `../shiny-logic/` to `public/`:
    - `favicon.svg` (873 B)
    - `og-image.png` (294 KB)
    - `og-card.html` (7.7 KB) ‚Ä?note: this is a utility, not a Vite page
    - `logo.webp` (53 KB)
    - `logo.png` (268 KB)
  - Verify Vite copies them to `dist/` as-is

  **Must NOT do**:
  - Don't copy `init.mp4` (17.8 MB) ‚Ä?Wave 2 T20 will re-create
  - Don't copy `logo-source.png` (19.4 MB) ‚Ä?excluded per Q9
  - Don't copy `*.pptx` (805 KB) ‚Ä?excluded per Q9
  - Don't copy `poster.jpg` (269 KB) ‚Ä?T20 will handle

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: File copy, well-defined list
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T8-T18, T18a, T20)
  - **Blocks**: T18 (HTML references favicon, og-image, logo)
  - **Blocked By**: T7 (public/ must exist)

  **References**:
  - `../shiny-logic/favicon.svg` ‚Ä?873 B
  - `../shiny-logic/og-image.png` ‚Ä?294 KB
  - `../shiny-logic/og-card.html` ‚Ä?7.7 KB
  - `../shiny-logic/logo.webp` ‚Ä?53 KB
  - `../shiny-logic/logo.png` ‚Ä?268 KB

  **Acceptance Criteria**:
  - [ ] 5 files in `public/`
  - [ ] `pnpm build` copies them to `dist/`
  - [ ] HTML files reference them correctly (favicon, og-image, logo)

  **QA Scenarios**:
  ```
  Scenario: All 5 assets copied to public/ and present in dist/
    Tool: Bash (ls)
    Preconditions: pnpm build completed
    Steps:
      1. `ls public/` ‚Ä?expect favicon.svg, og-image.png, og-card.html, logo.webp, logo.png
      2. `ls dist/` ‚Ä?expect all 5 (or dist/favicon.svg etc.)
    Expected Result: Files present
    Failure Indicators: Missing files
    Evidence: .sisyphus/evidence/task-19-assets-copied.txt
  ```

  **Commit**: YES
  - Message: `chore(assets): port favicon, og-image, og-card, logo to public/`
  - Files: `public/favicon.svg`, `public/og-image.png`, `public/og-card.html`, `public/logo.webp`, `public/logo.png`
  - Pre-commit: `pnpm build` succeeds

- [ ] 20. Generate new init.webm (3-5 MB AV1) + init.mp4 fallback via ffmpeg

  **What to do**:
  - **Precondition check**: verify ffmpeg is installed (`ffmpeg -version`). If not, install it or use a fallback.
  - Read `../shiny-logic/init.mp4` (17.8 MB) ‚Ä?this is the source video
  - Re-encode to WebM/AV1 using ffmpeg:
    ```bash
    ffmpeg -i ../shiny-logic/init.mp4 -c:v libaom-av1 -crf 30 -b:v 0 -c:a libopus -b:a 96k -movflags +faststart public/init.webm
    ```
  - Target size: 3-5 MB
  - Also re-encode a smaller MP4 fallback (target: 5-8 MB):
    ```bash
    ffmpeg -i ../shiny-logic/init.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k -movflags +faststart public/init.mp4
    ```
  - Update HTML files (T18) to use dual `<source>` with **consistent absolute paths** (poster matches sources):
    ```html
    <video autoplay muted loop playsinline poster="/shiny3/poster.webp">
      <source src="/shiny3/init.webm" type="video/webm">
      <source src="/shiny3/init.mp4" type="video/mp4">
    </video>
    ```
  - Also re-encode `poster.jpg` (269 KB) to `poster.webp` (~50 KB) for modern browsers
  - **Fallback if ffmpeg unavailable**: copy source `init.mp4` as-is (but document the size regression in a code comment)

  **Must NOT do**:
  - Don't re-encode if source file is already optimal (it isn't ‚Ä?17.8 MB is huge)
  - Don't change the visual appearance
  - Don't remove the MP4 fallback (browser compatibility)
  - Don't skip the ffmpeg precondition check (will fail silently otherwise)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Video encoding, requires ffmpeg expertise
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T8-T19)
  - **Blocks**: T18 (HTML references new video sources)
  - **Blocked By**: T7 (public/ must exist), ffmpeg available

  **References**:
  - `../shiny-logic/init.mp4` ‚Ä?17.8 MB source
  - `../shiny-logic/poster.jpg` ‚Ä?269 KB
  - `../shiny-logic/index.html:173` ‚Ä?`<video poster="poster.jpg">`
  - ffmpeg download: https://ffmpeg.org/download.html
  - WebM/AV1 encoding guide: https://trac.ffmpeg.org/wiki/Encode/AV1

  **Acceptance Criteria**:
  - [ ] ffmpeg verified installed (or fallback documented)
  - [ ] `public/init.webm` exists, size 3-5 MB
  - [ ] `public/init.mp4` exists, size 5-8 MB
  - [ ] `public/poster.webp` exists, size ~50 KB
  - [ ] HTML files reference both video sources + poster
  - [ ] Video plays in browser (verify with Playwright)
  - [ ] If ffmpeg unavailable, fallback documented in code comment

  **QA Scenarios**:
  ```
  Scenario: ffmpeg precondition check
    Tool: Bash
    Preconditions: None
    Steps:
      1. `ffmpeg -version` ‚Ä?expect version output
      2. If fails, install ffmpeg: `apt-get install ffmpeg` (Linux) or `brew install ffmpeg` (Mac) or `winget install ffmpeg` (Windows)
    Expected Result: ffmpeg available
    Failure Indicators: command not found
    Evidence: .sisyphus/evidence/task-20-ffmpeg-check.txt

  Scenario: New video files are within target size
    Tool: Bash (ls -lh)
    Preconditions: ffmpeg encoding completed
    Steps:
      1. `ls -lh public/init.webm public/init.mp4` ‚Ä?expect webm 3-5 MB, mp4 5-8 MB
    Expected Result: Both within target
    Failure Indicators: Sizes outside target
    Evidence: .sisyphus/evidence/task-20-video-sizes.txt

  Scenario: Video plays in browser
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Navigate to http://localhost:5173/
      2. Wait 2 seconds for video to load
      3. Check `<video>` element's `currentTime > 0` (means video is playing)
      4. Check `network` tab in Playwright trace ‚Ä?both webm and mp4 sources requested
    Expected Result: Video plays
    Failure Indicators: Video not playing, 404 on sources
    Evidence: .sisyphus/evidence/task-20-video-plays.png
  ```

  **Commit**: YES
  - Message: `perf(video): re-encode init.mp4 to WebM/AV1 (3-5 MB) + MP4 fallback + WebP poster`
  - Files: `public/init.webm`, `public/init.mp4`, `public/poster.webp`, `src/pages/*.html` (7 files, video tag update)
  - Pre-commit: `pnpm build` succeeds, video plays

### Wave 3 ‚Ä?Accessibility (PR 2)

- [ ] 21. Add skip link on all 7 pages

  **What to do**:
  - Add `<a href="#main" class="skip-link">Skip to content</a>` to each HTML file's `<header>` (or as first child of `<body>`)
  - Add `id="main" tabindex="-1"` to each `<main>` element
  - Add CSS for `.skip-link` in `foundation.css`:
    ```css
    .skip-link {
      position: absolute;
      top: -40px;
      left: 8px;
      z-index: 1000;
      padding: 8px 16px;
      background: var(--cyan);
      color: var(--ink-900);
      text-decoration: none;
      border-radius: 4px;
      transition: top 0.2s;
    }
    .skip-link:focus { top: 8px; }
    ```
  - Add `data-i18n="common.skipToContent"` to the link text for i18n

  **Must NOT do**:
  - Don't add the skip link to `<nav>` (should be the very first focusable element)
  - Don't make it visible by default (only on focus)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: 7 files, requires consistent placement and i18n
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T22-T27)
  - **Blocks**: T28-T33 (polish tasks assume skip link present)
  - **Blocked By**: T18 (HTML files must be ported)

  **References**:
  - `../shiny-logic/DESIGN.md:194-202` ‚Ä?a11y contract (semantic landmarks, focus rings)
  - WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html

  **Acceptance Criteria**:
  - [ ] All 7 HTML files have skip link as first focusable element
  - [ ] All 7 `<main>` elements have `id="main" tabindex="-1"`
  - [ ] `.skip-link` CSS rule in foundation.css
  - [ ] Playwright test: tab from URL bar ‚Ü?skip link focused ‚Ü?Enter ‚Ü?focus moves to `<main>`

  **QA Scenarios**:
  ```
  Scenario: Skip link is first focusable element
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Navigate to http://localhost:5173/
      2. Press Tab key
      3. Verify focused element is the skip link (not logo, not nav)
      4. Press Enter
      5. Verify focus moves to <main> (id="main")
    Expected Result: Skip link works
    Failure Indicators: Skip link not first, or doesn't jump to main
    Evidence: .sisyphus/evidence/task-21-skip-link-works.png
  ```

  **Commit**: YES
  - Message: `feat(a11y): add skip link on all 7 pages (WCAG 2.1 AA bypass blocks)`
  - Files: `src/pages/*.html` (7 files), `src/styles/foundation.css`
  - Pre-commit: `pnpm build` succeeds, skip link test passes

- [ ] 22. Add prefers-reduced-motion overrides for hero parallax + video scale

  **What to do**:
  - Read `src/scripts/core.js` (from Wave 2 T15) ‚Ä?find hero parallax logic (target classes: `.hero`, `.hero__inner`, `.hero__video`)
  - Source already checks `prefersReducedMotion.matches` at L671 ‚Ä?verify this is preserved in the ESM port
  - Add CSS in `foundation.css`:
    ```css
    @media (prefers-reduced-motion: reduce) {
      .hero__inner,
      .hero__video {
        transform: none !important;
      }
    }
    ```
  - Verify with Playwright: emulate `prefers-reduced-motion: reduce`, verify `.hero__inner` doesn't translate and `.hero__video` doesn't scale

  **Must NOT do**:
  - Don't disable all animations (only hero parallax and video scale)
  - Don't break the existing **17** `@media (prefers-reduced-motion)` rules in source
  - Don't invent class names ‚Ä?use `.hero__inner` and `.hero__video` from source

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: JS + CSS coordination, requires careful testing
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T21, T23-T27)
  - **Blocks**: T28-T33 (polish)
  - **Blocked By**: T15 (core.js must be ported)

  **References**:
  - `../shiny-logic/script.js:631-713` ‚Ä?hero parallax section (uses `.hero`, `.hero__inner`, `.hero__video`)
  - `../shiny-logic/DESIGN.md:188-190` ‚Ä?prefers-reduced-motion contract

  **Acceptance Criteria**:
  - [ ] `core.js` preserves the `prefersReducedMotion.matches` check from source
  - [ ] `foundation.css` has `@media (prefers-reduced-motion: reduce)` overrides for `.hero__inner` and `.hero__video`
  - [ ] Playwright test: with reduced motion emulated, hero parallax and video scale are disabled

  **QA Scenarios**:
  ```
  Scenario: Hero is static when prefers-reduced-motion: reduce
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Set `reducedMotion: 'reduce'` in Playwright context
      2. Navigate to http://localhost:5173/
      3. Take screenshot at t=0
      4. Scroll 500px
      5. Take screenshot at t=1000ms
      6. Verify .hero__inner position is unchanged (no parallax translateY)
      7. Verify .hero__video scale is unchanged (no zoom)
    Expected Result: Hero static
    Failure Indicators: Hero still moves or video still scales
    Evidence: .sisyphus/evidence/task-22-reduced-motion.txt
  ```

  **Commit**: YES
  - Message: `feat(a11y): respect prefers-reduced-motion for hero parallax (.hero__inner) + video scale (.hero__video)`
  - Files: `src/scripts/core.js`, `src/styles/foundation.css`
  - Pre-commit: `pnpm build` succeeds, reduced-motion test passes

- [ ] 23. Add aria-live="polite" to language switcher

  **What to do**:
  - Read each HTML file's language switcher (3 buttons: Áπ?/ EN / ÁÆÄ)
  - Add `aria-live="polite"` to the container `<div>` of the switcher
  - Add a hidden `<span>` with `aria-atomic="true"` that announces the locale change:
    ```html
    <div class="langswitch" role="group" aria-label="Language" aria-live="polite">
      <span class="sr-only" data-i18n="common.localeChanged">Locale changed to</span>
      <button data-lang="zh-Hant" aria-pressed="false">Áπ?/button>
      <button data-lang="en" aria-pressed="false">EN</button>
      <button data-lang="zh-Hans" aria-pressed="false">ÁÆÄ</button>
    </div>
    ```
  - Update `i18n.js` (from T16) to update the announcement text on locale change
  - Add `.sr-only` class to foundation.css:
    ```css
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    ```

  **Must NOT do**:
  - Don't use `aria-live="assertive"` (too aggressive for locale change)
  - Don't announce on every page load (only on user action)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Simple ARIA addition + i18n hook
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T21, T22, T24-T27)
  - **Blocks**: T28-T33 (polish)
  - **Blocked By**: T18 (HTML), T16 (i18n.js)

  **References**:
  - WCAG ARIA live regions: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
  - `../shiny-logic/script.js` (i18n section) ‚Ä?find locale change handler

  **Acceptance Criteria**:
  - [ ] All 7 HTML files have `aria-live="polite"` on lang switcher
  - [ ] `.sr-only` class in foundation.css
  - [ ] i18n.js updates announcement text on locale change
  - [ ] Playwright test: switch locale, verify screen reader announcement

  **QA Scenarios**:
  ```
  Scenario: Language switcher announces locale change
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Navigate to http://localhost:5173/
      2. Click "EN" button
      3. Verify `<div class="langswitch" aria-live="polite">` has updated text
      4. Verify screen reader would announce (Playwright can check aria-live updates)
    Expected Result: Announcement present
    Failure Indicators: No announcement, no aria-live
    Evidence: .sisyphus/evidence/task-23-aria-live.txt
  ```

  **Commit**: YES
  - Message: `feat(a11y): add aria-live=polite to language switcher`
  - Files: `src/pages/*.html` (7 files), `src/styles/foundation.css`, `src/scripts/i18n.js`
  - Pre-commit: `pnpm build` succeeds, aria-live test passes

- [ ] 24. Audit + fix ARIA states on accordion + mobile nav

  **What to do**:
  - Read each HTML file's accordion (architecture section) and mobile nav
  - Verify:
    - Accordion: `<button aria-expanded="false" aria-controls="layer-N">` for each layer, `id="layer-N"` on the panel
    - Mobile nav: `<button aria-expanded="false" aria-controls="navMobile">` toggle, `id="navMobile"` on the menu
    - Lang buttons: `aria-pressed="false"` initially, `aria-pressed="true"` on active
  - Fix any missing or incorrect ARIA states
  - Verify with Playwright: click accordion, verify `aria-expanded` toggles; click mobile nav, verify menu opens and `aria-expanded` is "true"

  **Must NOT do**:
  - Don't change the accordion a11y pattern (Home/End keys, single-open) ‚Ä?frozen per Q4
  - Don't change the keyboard navigation (already excellent in source)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: 7 files, requires careful ARIA audit
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T21-T23, T25-T27)
  - **Blocks**: T28-T33 (polish)
  - **Blocked By**: T18 (HTML), T15 (core.js for accordion handler)

  **References**:
  - `../shiny-logic/script.js:211-393` ‚Ä?accordion keyboard nav (Home/End, aria-expanded)
  - `../shiny-logic/DESIGN.md:194-202` ‚Ä?a11y contract

  **Acceptance Criteria**:
  - [ ] All accordion `<button>` have `aria-expanded` + `aria-controls`
  - [ ] All accordion panels have matching `id`
  - [ ] Mobile nav toggle has `aria-expanded` + `aria-controls="navMobile"`
  - [ ] Mobile menu has `id="navMobile"`
  - [ ] All lang buttons have `aria-pressed`
  - [ ] Playwright tests for all 3 patterns

  **QA Scenarios**:
  ```
  Scenario: Accordion ARIA states update correctly
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Navigate to home page (http://localhost:5173/)
      2. Scroll to #architecture section
      3. Click first accordion header
      4. Verify aria-expanded toggles "false" ‚Ü?"true"
      5. Click again
      6. Verify aria-expanded toggles "true" ‚Ü?"false"
    Expected Result: ARIA states update
    Failure Indicators: ARIA not updating, accordion doesn't open
    Evidence: .sisyphus/evidence/task-24-accordion-aria.txt

  Scenario: Mobile nav ARIA state
    Tool: Playwright
    Preconditions: vite preview running, viewport 375x667
    Steps:
      1. Navigate to home page
      2. Click hamburger button
      3. Verify aria-expanded="true" on button
      4. Verify navMobile menu is visible
      5. Click hamburger again
      6. Verify aria-expanded="false"
    Expected Result: Mobile nav ARIA correct
    Failure Indicators: ARIA missing, menu doesn't open
    Evidence: .sisyphus/evidence/task-24-mobile-nav-aria.txt
  ```

  **Commit**: YES
  - Message: `feat(a11y): audit and fix ARIA states on accordion + mobile nav + lang switcher`
  - Files: `src/pages/*.html` (7 files), `src/scripts/core.js`
  - Pre-commit: `pnpm build` succeeds, all 3 ARIA tests pass

- [ ] 25. Touch target audit (‚â?4px)

  **What to do**:
  - Audit all interactive elements across 7 pages: nav links, lang buttons, accordion headers, mobile menu toggle, form inputs, contact form submit
  - **Use actual source class names**:
    - `.nav` (nav container), `.nav a` (nav links)
    - `.langswitch` (container), `.langswitch__btn` (lang buttons)
    - `.nav__toggle` (mobile menu toggle, `id="navToggle"`)
    - `.accordion-header` (accordion buttons ‚Ä?verify exact class in source)
    - Form elements: `.form-input`, `.form-submit` (verify exact classes)
  - For each, verify computed style has `min-height: 44px` and `min-width: 44px`
  - Add CSS overrides in `foundation.css` for any that fail:
    ```css
    .nav a, .langswitch__btn, .nav__toggle, .accordion-header, .form-input, .form-submit {
      min-height: 44px;
      min-width: 44px;
    }
    ```
  - Verify with Playwright: query computed style for each interactive element

  **Must NOT do**:
  - Don't make all elements exactly 44px (some may be larger, that's fine)
  - Don't break the visual design (touch target is the clickable area, not the visible element)
  - Don't invent class names ‚Ä?use the verified ones from source

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: 7 files, requires computed style queries
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T21-T24, T26-T27)
  - **Blocks**: T28-T33 (polish)
  - **Blocked By**: T18 (HTML), T9 (per-page CSS)

  **References**:
  - `../shiny-logic/index.html:83-110, 129` ‚Ä?verified nav/lang/toggle class names
  - `../shiny-logic/index.html:418, 458, 496` ‚Ä?verified accordion `aria-expanded` usage
  - WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  - ui-ux-pro-max: `touch-target-size` rule (‚â?4x44px)

  **Acceptance Criteria**:
  - [ ] All interactive elements have `min-height: 44px` and `min-width: 44px` (or are inside a parent that does)
  - [ ] Playwright test: query all `button`, `a[href]`, `input`, `select`, `textarea` for computed size
  - [ ] Any failing element has CSS override in foundation.css or per-page CSS
  - [ ] All class names match source (no invented names)

  **QA Scenarios**:
  ```
  Scenario: All interactive elements meet 44x44px touch target
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Navigate to each of 7 pages
      2. For each page, query all `button`, `a[href]`, `input`, `select`, `textarea`
      3. Get computed `getBoundingClientRect()` for each
      4. Verify all have width >= 44 AND height >= 44
    Expected Result: All meet 44x44
    Failure Indicators: Any element < 44x44
    Evidence: .sisyphus/evidence/task-25-touch-targets.txt
  ```

  **Commit**: YES
  - Message: `feat(a11y): ensure all interactive elements meet 44x44px touch target`
  - Files: `src/styles/foundation.css`, per-page CSS as needed
  - Pre-commit: `pnpm build` succeeds, touch target test passes

- [ ] 26. Audit role="presentation" on .statusbar and .s-arch__stack

  **What to do**:
  - Read all 8 occurrences of `role="presentation"` across the 7 HTML files:
    - 7 √ó `<div class="statusbar mono" role="presentation">` (one per page, in header)
    - 1 √ó `<div class="s-arch__stack" role="presentation">` (index.html:407, architecture section)
  - **For each occurrence, determine**:
    - Is the content meaningful for screen readers?
    - If YES: remove `role="presentation"`, add `aria-label="..."` instead
    - If NO (purely decorative): keep `role="presentation"` and add `aria-hidden="true"`
  - **Specific judgments**:
    - `.statusbar` ‚Ä?contains company name, tag strip, currency/unit info ‚Ü?**MEANINGFUL** ‚Ü?remove role, add `aria-label="Company status"`
    - `.s-arch__stack` ‚Ä?architecture section visual stack ‚Ü?likely **DECORATIVE** (semantic info is in sibling elements) ‚Ü?keep role, add `aria-hidden="true"` (or just remove the role and let the section's own semantic structure take over)
  - Document each decision in a code comment
  - Apply the changes to all 7 HTML files

  **Must NOT do**:
  - Don't remove the statusbar or arch stack entirely
  - Don't change their visual appearance
  - Don't apply the same treatment to both ‚Ä?they have different semantics

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Single decision (per element), well-scoped
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T21-T25, T27)
  - **Blocks**: T28-T33 (polish)
  - **Blocked By**: T18 (HTML)

  **References**:
  - `../shiny-logic/index.html:74` ‚Ä?statusbar with role="presentation"
  - `../shiny-logic/index.html:407` ‚Ä?s-arch__stack with role="presentation"
  - WCAG ARIA: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/

  **Acceptance Criteria**:
  - [ ] Each of 8 `role="presentation"` instances audited individually
  - [ ] Decision documented in code comment for each
  - [ ] All 7 HTML files have correct role/aria-label/aria-hidden treatment
  - [ ] Statusbar treatment: meaningful (remove role, add aria-label)
  - [ ] s-arch__stack treatment: decorative (keep role + aria-hidden, OR remove role and let section structure handle it)

  **QA Scenarios**:
  ```
  Scenario: All 8 role=presentation instances have correct ARIA treatment
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Navigate to each of 7 pages
      2. Query `.statusbar` and `.s-arch__stack` for `role`, `aria-label`, `aria-hidden`
      3. Count: expect 7 statusbar + 1 s-arch__stack = 8 total
      4. Verify consistent treatment per element type
      5. Document the decisions
    Expected Result: 8 elements with correct ARIA
    Failure Indicators: Inconsistent, missing, wrong count
    Evidence: .sisyphus/evidence/task-26-statusbar-aria.txt
  ```

  **Commit**: YES
  - Message: `feat(a11y): audit and fix ARIA on statusbar (7) and s-arch__stack (1) ‚Ä?8 total`
  - Files: `src/pages/*.html` (7 files)
  - Pre-commit: `pnpm build` succeeds, ARIA consistent

- [ ] 27. Light mode contrast audit

  **What to do**:
  - Read `../shiny-logic/styles.css:9746+` ‚Ä?`[data-theme="light"]` token overrides
  - Port these to new project (in `foundation.css`)
  - Audit contrast for ALL text/background combinations in light mode:
    - Body text on light bg: must be ‚â?.5:1
    - Large text on light bg: must be ‚â?:1
    - UI components: must be ‚â?:1
  - Use `@axe-core/playwright` or manual computation
  - Fix any failing combinations

  **Must NOT do**:
  - Don't change the dark mode tokens (only audit light mode)
  - Don't introduce new tokens (use existing light mode overrides)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Contrast computation, requires WCAG knowledge
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T21-T26)
  - **Blocks**: T28-T33 (polish)
  - **Blocked By**: T8 (foundation.css must exist)

  **References**:
  - `../shiny-logic/styles.css:9746+` ‚Ä?light mode token overrides
  - WCAG contrast: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
  - `@axe-core/playwright`: https://github.com/alphagov/govuk-frontend/tree/main/packages/govuk-frontend-toolkit

  **Acceptance Criteria**:
  - [ ] All light mode tokens ported to foundation.css
  - [ ] All text/background combinations in light mode meet WCAG AA contrast
  - [ ] Playwright + axe-core test: 0 contrast violations

  **QA Scenarios**:
  ```
  Scenario: Light mode passes axe-core contrast audit
    Tool: Playwright + @axe-core/playwright
    Preconditions: vite preview running
    Steps:
      1. Set `data-theme="light"` on `<html>` (or click theme toggle)
      2. Run axe-core scan on all 7 pages
      3. Expect 0 contrast violations
    Expected Result: 0 violations
    Failure Indicators: Any contrast violation
    Evidence: .sisyphus/evidence/task-27-light-contrast.txt
  ```

  **Commit**: YES
  - Message: `feat(a11y): port and audit light mode contrast (WCAG 2.1 AA)`
  - Files: `src/styles/foundation.css`
  - Pre-commit: `pnpm build` succeeds, axe-core test passes

### Wave 4 ‚Ä?Design polish (PR 3)

- [ ] 28. Token usage audit (no hardcoded colors/fonts outside :root)

  **What to do**:
  - Read all 7 page CSS files in `src/styles/pages/`
  - Grep for hardcoded color values: `#[0-9a-f]{3,6}`, `rgb(`, `rgba(`
  - Grep for hardcoded font names: `"Saira"`, `"IBM Plex Mono"`, etc. (outside :root)
  - Any found should be either:
    - Moved to a `:root` token (if reused)
    - Documented as one-off (if not reused)
  - Fix violations by replacing with `var(--token-name)`

  **Must NOT do**:
  - Don't change `:root` token values (frozen per Q4)
  - Don't add new tokens (out of scope)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: 7 files, requires pattern recognition
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T29-T33)
  - **Blocks**: F1-F4 (verify)
  - **Blocked By**: T8, T9 (CSS files exist)

  **References**:
  - `../shiny-logic/DESIGN.md:46-93` ‚Ä?token definitions

  **Acceptance Criteria**:
  - [ ] Zero hardcoded hex colors outside `:root`
  - [ ] Zero hardcoded `rgb(` or `rgba(` outside `:root` (except rgba with --variable)
  - [ ] Zero hardcoded font names outside `:root`
  - [ ] Audit report saved to `.sisyphus/evidence/task-28-token-audit.txt`

  **QA Scenarios**:
  ```
  Scenario: No hardcoded tokens outside :root
    Tool: Bash (grep)
    Preconditions: All CSS files in src/styles/
    Steps:
      1. `grep -n "#[0-9a-fA-F]\{3,6\}" src/styles/pages/*.css | grep -v ":root"` ‚Ä?expect 0 (or only in :root context)
      2. `grep -n "rgb\|rgba" src/styles/pages/*.css` ‚Ä?expect 0 (or only with var())
      3. `grep -n '"Saira"\|"IBM Plex Mono"' src/styles/pages/*.css` ‚Ä?expect 0
    Expected Result: Zero violations
    Failure Indicators: Any match
    Evidence: .sisyphus/evidence/task-28-token-audit.txt
  ```

  **Commit**: YES
  - Message: `polish(css): audit and remove hardcoded tokens outside :root`
  - Files: `src/styles/pages/*.css` (7 files)
  - Pre-commit: Lint passes, audit grep returns 0

- [ ] 29. :focus-visible contrast verification (4.5:1 on graphite AND light mode)

  **What to do**:
  - Read `:focus-visible` CSS rule in `foundation.css`
  - Verify outline color (`--cyan: #67E8F9`) meets 4.5:1 contrast on:
    - Dark graphite (`--ink-900: #07090C`)
    - Light mode bg (whatever the override is)
  - If failing, darken the focus ring or use a different color (e.g., `--cyan-bright: #A5F3FC`)
  - Verify with Playwright: tab through interactive elements, screenshot focus ring, compute contrast

  **Must NOT do**:
  - Don't change the focus ring color without verifying contrast
  - Don't remove the focus ring (a11y regression)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Contrast computation + verification
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T28, T30-T33)
  - **Blocks**: F1-F4
  - **Blocked By**: T8, T27 (foundation + light mode tokens)

  **References**:
  - `../shiny-logic/styles.css:92-96` ‚Ä?:focus-visible rule
  - WCAG focus visible: https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html

  **Acceptance Criteria**:
  - [ ] `:focus-visible` outline color meets 4.5:1 on dark graphite
  - [ ] `:focus-visible` outline color meets 4.5:1 on light mode
  - [ ] Playwright test: focus each interactive element, verify ring visible + contrast OK

  **QA Scenarios**:
  ```
  Scenario: :focus-visible ring meets 4.5:1 on both themes
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. On dark theme, tab through interactive elements
      2. Screenshot focus ring, compute contrast
      3. Switch to light theme, repeat
      4. Both passes: contrast >= 4.5:1
    Expected Result: Both pass
    Failure Indicators: Any fail
    Evidence: .sisyphus/evidence/task-29-focus-contrast.png
  ```

  **Commit**: YES
  - Message: `polish(a11y): verify :focus-visible contrast on dark and light modes`
  - Files: `src/styles/foundation.css` (if adjustment needed)
  - Pre-commit: `pnpm build` succeeds, contrast test passes

- [ ] 30. :root variable consistency (no overrides, no leakage)

  **What to do**:
  - Read all 7 per-page CSS files
  - Grep for any `--` variable definitions outside `:root`
  - Grep for any `--variable-name` usage that doesn't have a corresponding `:root` definition
  - Fix any leakage or undefined usage
  - Document the canonical :root token list in a comment

  **Must NOT do**:
  - Don't add new tokens (out of scope)
  - Don't rename existing tokens (frozen per Q4)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Reason**: Grep-based audit
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T28, T29, T31-T33)
  - **Blocks**: F1-F4
  - **Blocked By**: T8, T9

  **References**:
  - `../shiny-logic/DESIGN.md:46-93` ‚Ä?token definitions

  **Acceptance Criteria**:
  - [ ] All `--` variable definitions are in `:root`
  - [ ] All `--variable` usages have a corresponding `:root` definition
  - [ ] No undefined variable usage anywhere

  **QA Scenarios**:
  ```
  Scenario: All CSS variables are defined in :root and used consistently
    Tool: Bash (grep)
    Preconditions: All CSS files
    Steps:
      1. `grep "^\s*--[a-z]" src/styles/foundation.css | grep -v ":root"` ‚Ä?expect 0 (all in :root)
      2. `grep "var(--" src/styles/pages/*.css` ‚Ä?list all variables used
      3. Cross-check: every used variable is defined in :root
    Expected Result: All defined, all used
    Failure Indicators: Undefined usage, leakage
    Evidence: .sisyphus/evidence/task-30-root-consistency.txt
  ```

  **Commit**: YES
  - Message: `polish(css): verify :root variable consistency (no overrides, no leakage)`
  - Files: (audit only, no code changes expected)
  - Pre-commit: Audit passes

- [ ] 31. Typography compliance (no Inter/Roboto/Arial leak ‚Ä?verify L9735 fix)

  **What to do**:
  - Read `src/styles/foundation.css` and `src/styles/pages/*.css`
  - Grep for `Inter`, `Roboto`, `Arial`, `system-ui` (in display context)
  - Verify zero matches (T10 fix should have eliminated Roboto from `--font-display`)
  - Also verify: only 4 font families are referenced: Saira, Saira Condensed, IBM Plex Mono, Noto Sans TC
  - Verify font loading: `<link>` to Google Fonts with correct families + weights

  **Must NOT do**:
  - Don't add Inter/Roboto/Arial (DESIGN.md ¬ß3 anti-pattern)
  - Don't remove Saira/Saira Condensed/IBM Plex Mono/Noto Sans TC (required by DESIGN.md ¬ß5)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Cross-file grep, font loading verification
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T28-T30, T32, T33)
  - **Blocks**: F1-F4
  - **Blocked By**: T8, T9, T10

  **References**:
  - `../shiny-logic/DESIGN.md:38-42` ‚Ä?anti-pattern list
  - `../shiny-logic/DESIGN.md:80-92` ‚Ä?font stack definitions

  **Acceptance Criteria**:
  - [ ] Zero matches for `Inter`, `Roboto`, `Arial` in any CSS
  - [ ] `system-ui` only used in fallback position (not as primary display)
  - [ ] Only 4 font families referenced: Saira, Saira Condensed, IBM Plex Mono, Noto Sans TC
  - [ ] Google Fonts `<link>` has correct families + weights

  **QA Scenarios**:
  ```
  Scenario: No Inter/Roboto/Arial leak in any CSS
    Tool: Bash (grep)
    Preconditions: All CSS files
    Steps:
      1. `grep -i "roboto\|inter\|arial" src/styles/**/*.css` ‚Ä?expect 0 matches
      2. `grep -E '"Saira"|"IBM Plex Mono"|"Noto Sans TC"' src/styles/foundation.css` ‚Ä?expect all 4 families
    Expected Result: 0 leaks, 4 families
    Failure Indicators: Any leak
    Evidence: .sisyphus/evidence/task-31-typography-compliance.txt
  ```

  **Commit**: YES
  - Message: `polish(css): verify typography compliance (no Inter/Roboto/Arial leak)`
  - Files: (audit only)
  - Pre-commit: Audit passes

- [ ] 32. Anti-AI-slop audit (no emojis, no generic SaaS hero, no purple gradients)

  **What to do**:
  - Read all 7 HTML files
  - Grep for emoji characters (Unicode range): `\x{1F300}-\x{1F9FF}` (emojis), `\x{2600}-\x{27BF}` (misc symbols), `\x{1F000}-\x{1F02F}` (mahjong), etc.
  - Grep for purple-on-white gradients: `linear-gradient.*purple\|linear-gradient.*#6[0-9a-f]{2}\|#8[0-9a-f]{2}\|#a[0-9a-f]{2}`
  - Verify hero structure: NOT a centered headline + 2 buttons + floating cards
  - Document findings

  **Must NOT do**:
  - Don't add emojis (DESIGN.md ¬ß3 anti-pattern)
  - Don't add purple gradients
  - Don't use generic SaaS hero

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Pattern detection across 7 files
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T28-T31, T33)
  - **Blocks**: F1-F4
  - **Blocked By**: T18

  **References**:
  - `../shiny-logic/DESIGN.md:38-42` ‚Ä?anti-pattern list

  **Acceptance Criteria**:
  - [ ] Zero emojis in any HTML
  - [ ] Zero purple-on-white gradients
  - [ ] Hero is NOT generic SaaS pattern (centered headline + 2 buttons + floating cards)
  - [ ] Audit report saved

  **QA Scenarios**:
  ```
  Scenario: No emojis or anti-patterns in HTML
    Tool: Bash (grep) + Playwright visual check
    Preconditions: All 7 HTML files
    Steps:
      1. `grep -P "[\x{1F300}-\x{1F9FF}]" src/pages/*.html` ‚Ä?expect 0 matches
      2. `grep -i "linear-gradient.*purple\|linear-gradient.*#[6-9a-f]" src/pages/*.html` ‚Ä?expect 0
      3. Playwright: load home page, take screenshot, verify hero is NOT generic SaaS pattern
    Expected Result: 0 anti-patterns
    Failure Indicators: Any match
    Evidence: .sisyphus/evidence/task-32-anti-ai-slop.txt
  ```

  **Commit**: YES
  - Message: `polish(html): audit for AI-slop anti-patterns (no emojis, no purple gradients)`
  - Files: (audit only)
  - Pre-commit: Audit passes

- [ ] 33. Signature motif presence check (reticle / wafer / grid / grain / hairlines)

  **What to do**:
  - Read all 7 HTML files and `foundation.css`
  - Verify each signature motif from DESIGN.md ¬ß7 is present:
    1. Blueprint micro-grid (background)
    2. Reticle / registration corner marks
    3. 300 mm wafer motif (hero)
    4. Monospace telemetry (kicker, annotations)
    5. Hairline system (1px borders)
    6. Grain / noise overlay
    7. Radial glow (hero)
  - Each must be present on the hero (at minimum)
  - Document the motif presence in each section of each page

  **Must NOT do**:
  - Don't remove any motif (DESIGN.md ¬ß7 mandate)
  - Don't add motifs not in the design

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Cross-file pattern verification
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T28-T32)
  - **Blocks**: F1-F4
  - **Blocked By**: T8, T9, T18

  **References**:
  - `../shiny-logic/DESIGN.md:118-134` ‚Ä?7 signature motifs

  **Acceptance Criteria**:
  - [ ] All 7 motifs present on hero
  - [ ] Blueprint grid on body background
  - [ ] Reticle marks on key panels
  - [ ] Wafer SVG in hero
  - [ ] Mono telemetry in section heads
  - [ ] Hairlines on cards/panels
  - [ ] Grain overlay on body
  - [ ] Radial glow on hero

  **QA Scenarios**:
  ```
  Scenario: All 7 signature motifs present on home page hero
    Tool: Playwright
    Preconditions: vite preview running
    Steps:
      1. Navigate to home page
      2. Query DOM for: `.grain` (grain overlay), `.reticle` (corner marks), `.wafer` (SVG), `.kicker` (mono), `.panel` (hairline), `.wrap` (grid bg)
      3. Take screenshot of hero
      4. Visually verify all 7 motifs visible
    Expected Result: All 7 present
    Failure Indicators: Any missing
    Evidence: .sisyphus/evidence/task-33-motifs-present.png
  ```

  **Commit**: YES
  - Message: `polish(design): verify all 7 signature motifs present (DESIGN.md ¬ß7)`
  - Files: (audit only, unless fixes needed)
  - Pre-commit: Audit passes

### Wave 5 ‚Ä?Verification (PR 4)

- [ ] F1. Plan compliance audit (oracle)

  **What to do**:
  - Read the original work plan (this file)
  - For each "Must Have": verify implementation exists (read file, run command, check Playwright test)
  - For each "Must NOT Have": search codebase for forbidden patterns
  - Compare deliverables against plan
  - Output verdict: APPROVE or REJECT

  **Recommended Agent Profile**:
  - **Category**: `oracle`
  - **Reason**: Read-only consultant, high-IQ verification

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with F2-F4)
  - **Blocks**: Final gate
  - **Blocked By**: T28-T33 (all polish tasks)

  **Acceptance Criteria**:
  - [ ] All "Must Have" items verified present
  - [ ] All "Must NOT Have" items verified absent
  - [ ] All 34 implementation tasks (T1-T33 + T18a) + 4 verification tasks (F1-F4) delivered
  - [ ] Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [38/38] | VERDICT: APPROVE/REJECT`

- [ ] F2. Build + lint + test pass (CI gate)

  **What to do**:
  - Run `pnpm build` ‚Ä?must succeed
  - Run `pnpm lint` ‚Ä?must pass
  - Run `pnpm test` ‚Ä?all Playwright tests must pass
  - Verify CI workflow on GitHub Actions is green

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Build + lint + test execution

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with F1, F3, F4)
  - **Blocks**: Final gate
  - **Blocked By**: T28-T33

  **Acceptance Criteria**:
  - [ ] `pnpm build` exits 0
  - [ ] `pnpm lint` exits 0
  - [ ] `pnpm test` exits 0 (all tests pass)
  - [ ] CI workflow green

- [ ] F3. Real manual QA (browse skill)

  **What to do**:
  - Use `browse` skill to manually test the site
  - Navigate all 7 pages
  - Switch all 3 locales
  - Test skip link
  - Test theme toggle
  - Test accordion
  - Test mobile menu
  - Verify visual fidelity to source (shiny-logic)
  - Save evidence to `.sisyphus/evidence/final-qa/`

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Reason**: Hands-on QA execution

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with F1, F2, F4)
  - **Blocks**: Final gate
  - **Blocked By**: F2 (build must succeed first)

  **Acceptance Criteria**:
  - [ ] All 7 pages load correctly
  - [ ] All 3 locales work
  - [ ] Skip link works
  - [ ] Theme toggle works
  - [ ] Accordion works
  - [ ] Mobile menu works
  - [ ] Visual fidelity matches source

- [ ] F4. Scope fidelity check (deep)

  **What to do**:
  - For each of 30 tasks: read "What to do", read actual diff
  - Verify 1:1: everything in spec was built (no missing)
  - Verify 1:1: nothing beyond spec was built (no creep)
  - Check "Must NOT do" compliance per task
  - Detect cross-task contamination
  - Flag unaccounted changes

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Reason**: Deep review of all changes

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with F1-F3)
  - **Blocks**: Final gate
  - **Blocked By**: T28-T33

  **Acceptance Criteria**:
  - [ ] All 34 implementation tasks compliant
  - [ ] Zero contamination
  - [ ] Zero unaccounted files
  - [ ] Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Final Verification Wave (MANDATORY)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
>
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
>
> **See Wave 5 ‚Ä?Verification (F1-F4) above for full task definitions. This section is a summary index only ‚Ä?tasks are NOT defined here to avoid duplication.**

---

## Commit Strategy

### PR 0 (Wave 1) ‚Ä?Scaffold
- T1: `chore(scaffold): init Vite 5.x project with multi-page config`
- T2: `chore(scaffold): add PostCSS pipeline (autoprefixer, nested, custom-properties)`
- T3: `chore(scaffold): add ESLint + Stylelint + Prettier config`
- T4: `chore(scaffold): add Playwright e2e test config`
- T5: `chore(ci): add GitHub Actions workflow (lint, build, test)`
- T6: `docs(design): port DESIGN.md as design system source of truth`
- T7: `chore(scaffold): create src/ directory structure`

### PR 1 (Wave 2) ‚Ä?Code quality / DRY
- T8: `refactor(css): port foundation.css (L1-737) to src/styles/foundation.css`
- T9: `refactor(css): port per-page CSS to src/styles/pages/*.css (7 files)`
- T10: `fix(css): remove Roboto from --font-display (DESIGN.md ¬ß3 compliance)`
- T11: `refactor(css): create infrastructure for migrating 333 inline styles (data-rise + 141 scoped classes)`
- T12: `docs(html): audit and document <noscript> per-page pattern`
- T13: `refactor(svg): extract 24 chrome SVGs to src/assets/svg/ via Vite ?raw import`
- T14: `chore(i18n): add audit-i18n.mjs to detect orphan dictionary keys`
- T15: `refactor(js): convert script.js IIFEs to ESM modules`
- T16: `refactor(i18n): convert i18n.js to ESM module`
- T17: `chore(i18n): port i18n-dict.js with ~84 orphan keys trimmed`
- T18: `feat(html): port 7 HTML pages with new canonical URLs and Vite multi-page config`
- T18a: `feat(typography): add Google Fonts loading (4 families, 16 faces) to all 7 pages`
- T19: `chore(assets): port favicon, og-image, og-card, logo to public/`
- T20: `perf(video): re-encode init.mp4 to WebM/AV1 (3-5 MB) + MP4 fallback + WebP poster`

### PR 2 (Wave 3) ‚Ä?Accessibility
- T21: `feat(a11y): add skip link on all 7 pages (WCAG 2.1 AA bypass blocks)`
- T22: `feat(a11y): respect prefers-reduced-motion for hero parallax + video scale`
- T23: `feat(a11y): add aria-live=polite to language switcher`
- T24: `feat(a11y): audit and fix ARIA states on accordion + mobile nav + lang switcher`
- T25: `feat(a11y): ensure all interactive elements meet 44x44px touch target`
- T26: `feat(a11y): audit and fix statusbar ARIA treatment`
- T27: `feat(a11y): port and audit light mode contrast (WCAG 2.1 AA)`

### PR 3 (Wave 4) ‚Ä?Design polish
- T28: `polish(css): audit and remove hardcoded tokens outside :root`
- T29: `polish(a11y): verify :focus-visible contrast on dark and light modes`
- T30: `polish(css): verify :root variable consistency (no overrides, no leakage)`
- T31: `polish(css): verify typography compliance (no Inter/Roboto/Arial leak)`
- T32: `polish(html): audit for AI-slop anti-patterns (no emojis, no purple gradients)`
- T33: `polish(design): verify all 7 signature motifs present (DESIGN.md ¬ß7)`

### PR 4 (Wave 5) ‚Ä?Verification
- F1-F4: `chore(verify): F1 plan compliance + F2 build/lint/test + F3 manual QA + F4 scope fidelity`

---

## Success Criteria

### Verification Commands
```bash
pnpm install                   # Install all deps
pnpm dev                       # Dev server at http://localhost:5173/
pnpm build                     # Production build to dist/
pnpm preview                   # Preview production build at http://localhost:4173/
pnpm test                      # Playwright e2e tests
pnpm lint                      # ESLint + Stylelint + Prettier
pnpm format                    # Prettier format all files
node scripts/audit-i18n.mjs    # i18n orphan key audit
```

### Final Checklist
- [ ] All 7 pages load with no console errors
- [ ] All 3 locales switch correctly
- [ ] Skip link works on all 7 pages
- [ ] `prefers-reduced-motion` respected
- [ ] `aria-live="polite"` on language switcher
- [ ] Touch targets ‚â?44px
- [ ] No Inter/Roboto/Arial in any font stack
- [ ] No emojis
- [ ] All 7 signature motifs present
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] CI workflow green
- [ ] No `shiny-logic/` URLs in any new project file
- [ ] DESIGN.md preserved
- [ ] All 5 PRs merged

---

## Open Decisions (for user before /start-work)

The plan is complete. There are 2 deployment decisions that need user input before /start-work:

1. **Deployment target** ‚Ä?where will the new `/shiny3/` project be hosted?
   - **(a) GitHub Pages at `robertoshiu.github.io/shiny3/`** ‚ú?**LOCKED**
   - (b) Custom domain (e.g., `shinylogic.tech`)
   - (c) TBD ‚Ä?user will configure later

2. **Existing `shiny-logic` repo** ‚Ä?what happens to it?
   - **(a) Keep as-is (reference, no changes)** ‚ú?**LOCKED**
   - (b) Archive (mark as deprecated)
   - (c) Delete (after new project is live)

### Locked deployment URL pattern (apply to all 7 HTML files in T18)

```
Canonical: https://robertoshiu.github.io/shiny3/<page>.html
OG URL:    https://robertoshiu.github.io/shiny3/<page>.html
OG Image:  https://robertoshiu.github.io/shiny3/og-image.png
Vite base: /shiny3/
```

Per-page canonical + OG URLs:
- `index.html` ‚Ü?`https://robertoshiu.github.io/shiny3/index.html`
- `about.html` ‚Ü?`https://robertoshiu.github.io/shiny3/about.html`
- `solutions.html` ‚Ü?`https://robertoshiu.github.io/shiny3/solutions.html`
- `technology.html` ‚Ü?`https://robertoshiu.github.io/shiny3/technology.html`
- `case-studies.html` ‚Ü?`https://robertoshiu.github.io/shiny3/case-studies.html`
- `careers.html` ‚Ü?`https://robertoshiu.github.io/shiny3/careers.html`
- `contact.html` ‚Ü?`https://robertoshiu.github.io/shiny3/contact.html`

---

## Specialist Enrichment Appendix (post-OKAY)

After Momus returned OKAY, 4 specialist categories were consulted to enrich the plan with depth, not bug-fixing. Each category returned 10-15 specific items. Below is the synthesized **top-priority enrichment** to apply during execution. These are NOT new tasks °™ they deepen existing tasks.

### 1. PostCSS nesting syntax (deep #1)

**Target task**: T2
**Problem**: `postcss-preset-env` uses CSSWG-spec nesting (requires `&`), but source `styles.css` uses Sass-like nesting (no `&`). Silent failure mode.
**Change**:
- Test CSS file with `.parent { .child { color: red; } }` (Sass-like) must compile to `.parent .child { color: red; }`
- If `postcss-preset-env` rejects this, fall back to `postcss-nested` (Sass-compatible) as a sibling plugin
- Add to T2 "Must NOT do": "Don't assume postcss-preset-env handles Sass-syntax nesting"

### 2. ESM i18n module graph (deep #2)

**Target task**: T15-T17
**Problem**: Source uses `window.I18N` globally. ESM modules are isolated °™ no implicit cross-module state.
**Change**: Add code comment at top of `core.js` documenting the dependency graph:
```js
// Module graph: core.js °˚ i18n.js °˚ dict.js
// State shared via `export const i18n = new I18nRuntime(dict)`, NOT window globals
// Event bus: `sl:langchange` CustomEvent on document for cross-module communication
```

### 3. Dev vs preview base path (deep #3)

**Target task**: T1, T20
**Problem**: Vite's `base` is ignored in dev (serves from `/`) but respected in preview (serves from `/shiny3/`). Absolute paths in `<source>` will 404 in dev mode.
**Change**:
- Use **relative paths** for `<source src="init.webm">` and `poster="poster.webp"` in HTML
- Vite rewrites paths at build time via `base` config automatically
- Update T20 line 1629-1633 to use relative paths

### 4. Library version pinning (deep #4)

**Target task**: T1
**Change**: Add exact version ranges to `package.json`:
```json
{
  "vite": "^5.4.0",
  "eslint": "^8.57.0",
  "stylelint": "^16.0.0",
  "prettier": "^3.2.0",
  "postcss-preset-env": "^9.5.0",
  "playwright": "^1.44.0",
  "@axe-core/playwright": "^4.9.0"
}
```

### 5. Playwright baseURL/port match (deep #5)

**Target task**: T4
**Change**: 
- `baseURL: 'http://localhost:4173/shiny3/'` (matches `pnpm preview` default)
- `webServer.command: 'pnpm preview'`, `port: 4173`
- Playwright tests run against production build, not dev

### 6. CI caching strategy (deep #6)

**Target task**: T5
**Change**: Use version-pinned cache keys:
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.local/share/playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}
- uses: actions/cache@v4
  with:
    path: ~/.local/share/pnpm/store
    key: pnpm-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}
```
Reduces CI time from 5min °˙ 30sec.

### 7. Build-time validation scripts (deep #9 + #10)

**Target task**: T18
**Add new scripts** to `scripts/`:
- `validate-i18n.mjs`: every `data-i18n` attribute in HTML has a key in dict.js. Fails build on missing.
- `audit-chrome-sync.mjs`: nav/footer/noscript are byte-identical across 7 HTML files (except `aria-current`). Fails CI on drift.
- `audit-shiny-logic-leak.mjs`: `grep -r "shiny-logic/" src/` returns 0 matches. Fails build on any leak.
- `validate-html-fallback.mjs`: every `data-i18n` element's text content equals `dict.js["zh-Hant"][key]`. Fails build on mismatch.

Wire into `package.json`:
```json
"build": "node scripts/validate-i18n.mjs && node scripts/audit-chrome-sync.mjs && node scripts/audit-shiny-logic-leak.mjs && node scripts/validate-html-fallback.mjs && vite build",
"precommit": "node scripts/audit-shiny-logic-leak.mjs && pnpm lint"
```

### 8. Vite CSS code-splitting (deep #11)

**Target task**: T1, T9
**Change**: Add to `vite.config.js`:
```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        foundation: 'src/styles/foundation.css',
        chrome: 'src/styles/chrome.css',
      },
    },
  },
  cssCodeSplit: true,
}
```
Ensures foundation + chrome are extracted once, not duplicated in each page bundle.

### 9. Zero-cost visual regression (deep #8)

**Target task**: T4
**Change**: Use Playwright's built-in `toHaveScreenshot()` for hero and chrome:
```ts
// tests/e2e/visual/hero.spec.ts
test('home hero matches baseline', async ({ page }) => {
  await page.goto('/');
  await page.locator('.hero').screenshot({ path: 'hero.png' });
  expect(await page.locator('.hero').screenshot()).toMatchSnapshot('hero.png');
});
```
Gated on CI: `updateSnapshots: 'missing'` °™ no auto-update, manual approval required.

### 10. Performance budgets in vite.config.js (deep #12)

**Target task**: T1
**Change**:
```js
build: {
  chunkSizeWarningLimit: 100, // warn if any JS chunk > 100KB
  assetsInlineLimit: 4096,
}
```
Post-build CI check:
- `dist/assets/*.js` total < 80KB gzipped
- `dist/assets/*.css` total < 60KB gzipped (shared chunks)
- `dist/*.html` total < 120KB uncompressed

### 11. CSS 3-valued boundary (ultrabrain #1)

**Target task**: T8, T9
**Problem**: Source's "chrome" is split across two locations (L349-500 inside foundation, L3523-3768 inside v2 chrome). Porting this split into the new project locks in the historical accident.
**Change**: Move L349-500 (original chrome) from T8's foundation to T9's chrome.css. T8 stops at L348 (end of components). T9 receives both L349-500 and L3523-3768, dedupes, and consolidates into `chrome.css`.
**Result**: `foundation.css` = pure design system (tokens + components). `chrome.css` = the frame (nav + footer + lang + statusbar + responsive). Clear mental model.

### 12. Self-guarding ESM module contract (ultrabrain #2)

**Target task**: T15
**Change**: Codify as module contract in code comment:
```js
// Contract: every module's init() MUST no-op if its target elements
// are absent from the DOM. This lets any page load core.js safely
// and enables future per-page code-splitting without refactor.
```
Future-proofs per-page tree-shaking (e.g., `import('./modules/contact.js')` only on contact page).

### 13. Scalability ceilings table (ultrabrain #4)

**Target task**: Documentation only (add to plan appendix)
**Add to ARCHITECTURE.md**:

| Layer | Ceiling | What breaks first | Mitigation |
|---|---|---|---|
| i18n dict | ~2000 keys | Per-page load cost | Split by locale (sync) or namespace (async) |
| HTML nav/footer | ~10 pages | Manual sync impossible | Vite HTML include plugin |
| CSS bundles | ~15 pages | foundation+chrome duplicated | `manualChunks` to extract shared chunk |
| JS modules | ~15 pages divergent | Single core.js loads irrelevant code | Per-page dynamic `import()` |

### 14. Stylelint design-contract enforcement (ultrabrain #5)

**Target task**: T3
**Change**: Add to `.stylelintrc.json`:
```json
{
  "plugins": ["stylelint-declaration-strict-value"],
  "rules": {
    "scale-unlimited/declaration-strict-value": [
      ["/color/", "background-color", "border-color", "font-family"],
      {
        "ignoreValues": ["transparent", "currentColor", "inherit", "unset", "0", "none", "/^var\\(--/"]
      }
    ],
    "color-no-hex": [true, { "message": "Use var(--*) tokens, not hardcoded hex" }]
  }
}
```
Converts T28/T30/T31 from point-in-time audits to continuous enforcement. Any hardcoded color/font in any CSS file fails CI.

### 16. i18n depth documentation (ultrabrain #10)

**Target task**: Documentation only (add to plan appendix or README)
**Decisions to document**:
- **RTL**: Out of scope. CSS uses physical properties. Adding RTL = full CSS audit.
- **CJK fallback**: Noto Sans TC serves both zh-Hant and zh-Hans. Future: add Noto Sans SC for native Simplified glyphs.
- **Number formatting**: Hand-coded per `DESIGN.md °Ï14.4` trilingual table. ICU MessageFormat only if numbers exceed ~200.
- **Date formatting**: Use `Intl.DateTimeFormat` with per-locale options (when dates are added).
- **Locale extensibility**: Adding a 4th locale is mechanical: 1 dict key + 1 switcher button.

### 17. Lithographic precision as enforceable pattern (ultrabrain #9)

**Target task**: T8, T32
**Change**: Convert visual motifs from "checklist items" to mechanical rules:
- **Every `.panel` has reticle marks** °™ bake into `.panel` CSS, not opt-in via `.reticle` wrapper
- **Every `<section class="section">` has a `.kicker`** °™ enforce via Stylelint or audit script
- **No spacing outside 8px scale** °™ Stylelint rule flagging `margin`/`padding`/`gap` not in `var(--s-1..10)` (allowlist: `0`, `auto`, `clamp()`)
- **Every `.metric` has mono unit label** °™ enforce via DOM audit

### 18. v3-layer full audit (ultrabrain #12)

**Target task**: T10
**Problem**: Plan's Must NOT Have says "Don't port the v3 apple-fusion layer as-is °™ audit it first." But T10 only audits L9735, not the full 580-line layer.
**Change**: Expand T10 from `quick` to `unspecified-high`. Audit every rule in L9708-10287:
- **Port**: legitimate additions (light-mode tokens, easing curves)
- **Drop**: experimental patches (the apple-fusion experiment itself per DESIGN.md °Ï14.8)
- **Refactor**: rules that belong in existing sections (not a new patch layer)
- Document in `.sisyphus/evidence/task-10-v3-layer-audit.md` (source:line | rule | decision | destination | rationale)

### 19. Documentation stubs (deep #15)

**Target task**: T6 (extend to T6a)
**Change**: Create three documentation files:
- `README.md` °™ quick start, scripts, deployment, tech stack
- `ARCHITECTURE.md` °™ directory tree, CSS module graph, JS module graph, i18n flow
- `CONTRIBUTING.md` °™ DESIGN.md compliance, lint rules, commit conventions, anti-patterns

### 20. The "Litho Lock-On" focus state (artistry #1)

**Target task**: T8, T29
**Change**: Replace `:focus-visible` outline with animated reticle marks that draw themselves in:
```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 1px var(--cyan-bright);
}
:focus-visible::before,
:focus-visible::after {
  content: '';
  position: absolute;
  /* L-shaped reticle ticks at the focused element's corners */
  animation: litho-lock-on 120ms cubic-bezier(0.2, 0.7, 0.2, 1);
}
@keyframes litho-lock-on {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
```
Plus fallback `outline` for forced-colors mode. Every focus event becomes a brand moment.

### 21. Hero telemetry coordinate drift (artistry #3)

**Target task**: T8, T18
**Change**: Animate hero's `X:0420 Y:1080` coordinates with stepped `@keyframes`:
```css
@keyframes coord-drift {
  from { --x: 0380; --y: 1060; }
  to   { --x: 0460; --y: 1100; }
}
.hero__coord { animation: coord-drift 30s steps(12) infinite; }
```
Plus `[ REC ]` blink at 1s. With `prefers-reduced-motion: reduce` °˙ static values.

### 22. Locale-aware footer date (artistry #4)

**Target task**: T16, T18
**Change**: Add live date to footer using `Intl.DateTimeFormat`:
- `zh-Hant`: `2026 ƒÍ 6 ‘¬ 25 »’ °§ –«∆⁄»˝`
- `en`: `25 Jun 2026 °§ Wednesday`
- `zh-Hans`: `2026ƒÍ6‘¬25»’ °§ –«∆⁄»˝`

Update on locale switch. Subtle "this page is alive" signal.

### 23. Print proof page transition (artistry #5)

**Target task**: T8
**Change**: Add View Transitions API as progressive enhancement:
```css
@view-transition { navigation: auto; }
::view-transition-old(root) { animation: proof-out 200ms ease-in; }
::view-transition-new(root) { animation: proof-in 200ms ease-out; }
@keyframes proof-out { to { opacity: 0; transform: translateX(-40px); } }
@keyframes proof-in { from { opacity: 0; transform: translateX(40px); } }
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
}
```
Multi-page navigation feels like a print proof sliding across a light table. Non-supporting browsers get instant nav (current behavior).

### 24. Typography OpenType features (artistry #9)

**Target task**: T8, T18a
**Change**: Add `font-feature-settings`:
- **Body/display**: `"kern" 1, "liga" 1` (enable kerning + ligatures for prose)
- **Saira Condensed stat numerals**: `"tnum" 1` (tabular figures °™ numbers align vertically in stat grid)
- **CJK kicker override**: `[lang="zh-Hant"] .kicker, [lang="zh-Hans"] .kicker { letter-spacing: .08em; }` (CJK needs tighter spacing than Latin's `.22em`)

### 25. Wafer SVG as video loading state (artistry #10)

**Target task**: T18, T15, T20
**Change**: Hero video's poster is a simplified wafer SVG that rotates while video loads. On `canplaythrough`, fade out wafer (300ms). If video fails to load, wafer stays as graceful fallback. Brand-aligned loading state, not a black rectangle.

### 26. Monospace section footers (artistry #7)

**Target task**: T18
**Change**: Add consistent `.section-telemetry` to every section's closing markup:
```html
<!-- Example for #architecture -->
<p class="section-telemetry" aria-hidden="true">// SEC.03 °§ 6 LAYERS °§ [ ACTIVE ]</p>
```
Style: `.65rem` `--font-mono`, `--steel` at 50% opacity, right-aligned. Creates instrument-readout rhythm across the site.

### 27. Source code confessional (artistry #8)

**Target task**: T18
**Change**: Add ASCII-art wafer in HTML comment at top of every ported page:
```html
<!--
  ®X®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®[
  ®U  SHINYLOGIC °§ Ô@Àáø∆ºº               ®U
  ®U  Intelligent Wafer Fab IT/OT Stack   ®U
  ®U  FAB300 REFERENCE BUILD               ®U
  ®U  248 AI GPU °§ 4PB NVMe °§ RTO °‹ 4hr   ®U
  ®^®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®T®a
-->
```
Engineers who view source find a brand moment.

### 28. Semantic color aliases (visual-engineering #1)

**Target task**: T8
**Add to foundation.css after base tokens**:
```css
:root {
  --ink-overlay: rgba(7, 9, 12, 0.85);
  --cyan-soft: rgba(103, 232, 249, 0.12);
  --cyan-hover: rgba(103, 232, 249, 0.25);
  --gold-deep: #C9964F;
  --line-focus: rgba(103, 232, 249, 0.6);
}
```
Aliases for state variations without adding new base tokens.

### 29. Elevation system (visual-engineering #2)

**Target task**: T8
**Add to foundation.css**:
```css
:root {
  --elevation-0: none;
  --elevation-1: 0 0 0 1px var(--line);
  --elevation-2: 0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px var(--line);
  --elevation-3: 0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px var(--line-bright);
  --elevation-4: 0 12px 32px rgba(0,0,0,0.6), 0 0 0 1px var(--line-focus);
}
.panel { box-shadow: var(--elevation-1); }
.card:hover { box-shadow: var(--elevation-2); }
```

### 30. Component state matrix (visual-engineering #3)

**Target task**: T8
**Add explicit state CSS for 5 core components**:
- `.panel`, `.card`, `.card--reticle`, `.metric`, `.btn--primary`
- Default / hover / active / focus / disabled states
- Transitions: 150ms (micro) / 300ms (standard) / 600ms (dramatic)

### 31. Iconography contract (visual-engineering #6)

**Target task**: T13
**Add to foundation.css**:
```css
.icon svg {
  width: 24px; height: 24px;
  stroke: var(--cyan); stroke-width: 1.5;
  stroke-linecap: square; fill: none;
  opacity: 0.8;
  transition: opacity 0.2s, stroke 0.2s;
}
.icon:hover svg { opacity: 1; stroke: var(--cyan-bright); }
.icon:active svg { stroke: var(--gold-deep); }
```

### 32. Motion language (visual-engineering #7)

**Target task**: T8
**Add to foundation.css**:
```css
:root {
  --ease-entry: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-state: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --duration-micro: 150ms;
  --duration-standard: 300ms;
  --duration-dramatic: 600ms;
}
```
Apply consistently across `.reveal`, `.card`, `.btn`, `.reticle`.

### 33. Layout primitives (visual-engineering #8)

**Target task**: T8
**Add 3 reusable layout primitives to foundation.css**:
- `.layout-hero-stats` °™ hero + stats band
- `.layout-grid-cards` °™ auto-fit card grid
- `.layout-timeline` °™ horizontal phase timeline with hairline

### 34. Hairline variants (visual-engineering #10)

**Target task**: T8
**Add to foundation.css**:
```css
.hairline { height: 1px; background: var(--line); }
.hairline--bright { background: var(--line-bright); }
.hairline--thick { height: 2px; background: var(--line-bright); }
.rule {
  background: repeating-linear-gradient(to right, var(--line) 0 8px, transparent 8px 16px);
  height: 1px;
}
```

### 35. Wafer motif animation (visual-engineering #13)

**Target task**: T8
**Add to foundation.css**:
```css
.wafer-svg { animation: wafer-rotate 60s linear infinite; }
@keyframes wafer-rotate { from { transform: rotate(0); } to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .wafer-svg { animation: none; }
}
```

### 36. Marquee behavior (visual-engineering #14)

**Target task**: T8
**Add to foundation.css**:
```css
.marquee { overflow: hidden; white-space: nowrap; }
.marquee__inner {
  display: inline-block;
  animation: marquee-scroll 30s linear infinite;
}
.marquee:hover .marquee__inner { animation-play-state: paused; }
@keyframes marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .marquee__inner { animation: none; } }
```

### 37. Dense data table pattern (visual-engineering #11 + artistry #11)

**Target task**: T9
**Add to foundation.css as `.data-table`**:
- `.data-table` uses `--font-mono` for numeric cells
- `text-align: right` + `font-variant-numeric: tabular-nums` for numbers
- 1px `--line` row separators
- Header row: `--font-cond` weight 600, uppercase, `--steel`
- Alternating row backgrounds: `--ink-800` / `--ink-850`
- Wrapper: `.panel.reticle` (bordered with corner marks)
- Percentage bars animate from 0 to value when in view (reuse timeline animation)

### 38. Build-step trade-off documentation (ultrabrain #11)

**Target task**: T6a (extend with build-step rationale)
**Document in README.md**:
- 5+ config files needed: `vite.config.js`, `postcss.config.js`, `.eslintrc.cjs`, `.stylelintrc.json`, `.prettierrc`, `playwright.config.ts`
- Designer onboarding: "Quick start for designers" °™ install, dev, where to find tokens
- Source uses PostCSS nesting + `@import`; output is flattened + bundled. Use `pnpm dev` for debug, not `dist/`
- The `dist/` output remains static HTML/CSS/JS for non-contributors

---

### Enrichment Priority Matrix

| Priority | Enrichments | Effort | Multi-year impact |
|---|---|---|---|
| **P0 °™ apply during execution** | #1, #2, #3, #5, #6, #7, #8, #10, #11, #14, #15, #18, #19 | ~6-8 hours spread across tasks | High (correctness, observability, enforcement) |
| **P1 °™ apply for visual quality** | #4 (versions), #9 (visual regression), #12 (ESM contract), #13 (scalability), #16 (i18n docs), #17 (lithographic enforcement), #20-27 (artistry), #28-37 (visual) | ~8-10 hours spread across tasks | High (visual distinctiveness, design integrity) |
| **P2 °™ documentation only** | #4 partial, #13, #16, #38 | ~2 hours | Medium (future-proofing, onboarding) |

All 38 enrichments stay within the locked scope (B + C + E). None add new features or pages. They convert the plan from "spec-compliant" to "precision instrument."
---

## Frontend Design Execution Brief (post-specialist, frontend-design skill)

### Aesthetic direction (LOCKED °™ do not deviate)

**"Lithographic Precision" °™ a refined engineering instrument panel, NOT maximalist.**

The source already embodies the frontend-design skill's anti-AI-slop mandate. The rebuild must preserve and AMPLIFY this, not reinvent it. The aesthetic is:
- **Tone**: restrained, engineering-grade, dense °™ a cleanroom instrument, not a cyberpunk gamer site
- **Dominant color**: graphite (`--ink-900: #07090C`) °™ overwhelmingly dark
- **Sharp accent**: phosphor-cyan (`--cyan: #67E8FF9`) °™ single dominant accent, used sparingly
- **Rare highlight**: gold (`--gold: #E7B567`) °™ only on hero/CTA numerals + primary button hover
- **Typography**: Saira (display) + Saira Condensed (stat numerals) + IBM Plex Mono (telemetry) + Noto Sans TC (CJK) °™ already distinctive, NOT generic
- **Signature moment**: the 300mm wafer SVG °™ this is the ONE thing visitors remember

**The builder's mandate**: execute the vision with precision. Restraint over intensity. Every detail intentional.

### The ONE signature moment (amplify this)

The **300mm wafer motif** is the narrative thread. It currently appears on the about page (decorative) and as a rotating scan line. The frontend-design skill asks "what makes this UNFORGETTABLE?" °™ the answer is making the wafer do MORE than rotate:

- **Enrichment #2** (Wafer-as-Architecture-Map): wafer rings highlight as user navigates the 6-layer accordion
- **Enrichment #25** (Wafer as video loading state): wafer spins while hero video buffers
- **NEW #39 below** (Wafer as custom cursor on contact page): the wafer becomes the cursor
- **NEW #40 below** (Wafer as 404 page): the wafer scans a nonexistent die site

The wafer appears in 4 contexts across the site °™ each time it teaches the visitor something new about the brand. That's the signature.

### Frontend-design skill principles °˙ plan mapping

| Skill principle | Source status | Existing enrichment | NEW enrichment |
|---|---|---|---|
| **Typography** (distinctive fonts) | ? 4 distinctive families | #24 (OpenType features, CJK spacing) | °™ |
| **Color & Theme** (dominant + sharp accent) | ? graphite + cyan + rare gold | #28 (semantic aliases) | °™ |
| **Motion** (high-impact moments, stagger) | ? hero stagger, wafer spin, marquee | #21 (telemetry drift), #23 (print proof), #32 (motion language), #35 (wafer anim), #36 (marquee) | #41 (page-load orchestration), #42 (scan-line card hover) |
| **Spatial Composition** (asymmetry, grid-breaking) | ? asymmetric hero 1.05fr/.95fr | #33 (layout primitives) | #43 (diagonal section dividers) |
| **Backgrounds & Visual Details** (textures, depth) | ? grain, grid, glow, scrim | #34 (hairline variants) | #44 (conic-gradient reticle sweep), #45 (clip-path panel reveals) |

### NEW frontend-design enrichments (39-45)

These fill gaps the 4 specialists didn't cover °™ specifically the advanced CSS features (`conic-gradient`, `clip-path`, `@property`, custom cursors) that the frontend-design skill encourages for a precision-instrument aesthetic.

#### 39. Wafer as custom cursor on contact page (artistry + frontend-design)

**Target task**: T8, T18 (contact.html only)
**Change**: On `contact.html`, replace the default cursor with a tiny wafer reticle (12°¡12 SVG crosshair) that follows the mouse. On hover over interactive elements, the reticle expands to a 24°¡24 ring. On click, it briefly flashes cyan.
```css
/* contact.html only °™ applied via body class .p-contact */
/* Guard: only hide cursor on mouse+hover devices (not touch, not touchpad) */
@media (hover: hover) and (pointer: fine) {
  .p-contact { cursor: none; }
  .p-contact a, .p-contact button, .p-contact input, .p-contact select, .p-contact textarea { cursor: none; }
}
.p-contact::after {
  content: '';
  position: fixed;
  top: 0; left: 0;
  width: 12px; height: 12px;
  border: 1px solid var(--cyan);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  transition: width 0.15s var(--ease-state), height 0.15s var(--ease-state);
  /* JS updates top/left via mousemove */
}
.p-contact a:hover::after, .p-contact button:hover::after { width: 24px; height: 24px; border-color: var(--cyan-bright); }
```
**Must NOT do**: 
- Don't apply to other pages (contact-only signature moment)
- Don't hide cursor on touch devices (no mouse) °™ guard with `@media (hover: hover) and (pointer: fine)`
- Don't break keyboard navigation (cursor:none is cosmetic; focus rings still work)
**Justification**: The contact page is where the visitor "engages" °™ the wafer-as-cursor makes the act of reaching out feel like aligning a wafer site. It's the 4th wafer appearance, completing the narrative thread.

#### 40. 404 page as "Wafer Stage Calibration Error" (artistry #6 + frontend-design)

**Target task**: T1 (add 8th Vite entry), T18 (port HTML pattern)
**Change**: Add `404.html` as 8th Vite entry point. Content:
- Large `404` in `--font-cond`, weight 700, `--steel` at 20% opacity (like section index numbers)
- Kicker: `// ERROR °§ STAGE NOT FOUND °§ RECALIBRATING`
- Body (i18n-ready): `¥ÀÌì√Êå¶ë™µƒæßàA’æ¸c≤ª¥Ê‘⁄°£Wafer stage ’˝‘⁄÷ÿ–¬–£ú °£`
- An animated wafer SVG (the scan line from the hero, but larger and slower at 60s) with a red `--steel` "error" ring
- CTA: `∑µªÿ ◊Ìì / Return to Home` (primary button)
- Full chrome (nav/footer) preserved
**Justification**: Even the error page is on-brand. The "wafer stage calibration" metaphor is inside-baseball enough to delight semiconductor engineers. This is the 4th wafer appearance if #39 is not applied, or the 5th if it is.

#### 41. Page-load orchestration (frontend-design motion principle)

**Target task**: T8, T15
**Problem**: Source has hero stagger (60-90ms steps) but the FIRST scroll reveal is generic (all `.reveal` elements fade+rise identically). The frontend-design skill says "one well-orchestrated page load creates more delight than scattered micro-interactions."
**Change**: Orchestrate the first viewport's reveal as a choreographed sequence, not a uniform fade:
1. Nav slides down from top (200ms, ease-out)
2. Status strip fades in (100ms after nav)
3. Hero scrim + grid + glow fade in (150ms after status)
4. Hero content staggers (existing 60-90ms steps)
5. Marquee begins scrolling (after hero, 300ms delay)
6. First section header (`.section-head`) reveals with a 50ms stagger between kicker °˙ title °˙ lede

Implement via CSS `animation-delay` cascade on first-load elements + JS `IntersectionObserver` for scroll-triggered sections. The first 2 seconds of page load should feel like a cleanroom booting up.
**Must NOT do**: Don't add this to non-home pages (they get a simpler nav+hero reveal). Don't break `prefers-reduced-motion` (instant opacity only).
**Justification**: The first 2 seconds set the tone. A choreographed boot sequence makes the site feel alive, not static.

#### 42. Scan-line card hover (frontend-design motion principle)

**Target task**: T8, T9 (per-page CSS for cards)
**Change**: On `.card--reticle:hover`, add a horizontal cyan scan line that sweeps top-to-bottom across the card once (400ms, ease-out), in addition to the existing lift + reticle brighten:
```css
.card--reticle { position: relative; overflow: hidden; }
.card--reticle::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--cyan-bright), transparent);
  opacity: 0;
  transform: translateY(0);
  pointer-events: none;
}
.card--reticle:hover::after {
  animation: card-scan 0.4s var(--ease-entry);
}
@keyframes card-scan {
  0% { opacity: 0; transform: translateY(0); }
  20% { opacity: 1; }
  100% { opacity: 0; transform: translateY(100%); }
}
@media (prefers-reduced-motion: reduce) {
  .card--reticle::after { animation: none; }
}
```
**Justification**: The scan line mimics a metrology tool scanning a wafer die. It's a hover surprise that reinforces the lithographic metaphor without being noisy. Pairs with the existing reticle-mark brighten.

#### 43. Diagonal section dividers (frontend-design spatial principle)

**Target task**: T8, T9
**Problem**: Source uses horizontal hairlines between sections. The frontend-design skill encourages "diagonal flow" and "grid-breaking elements."
**Change**: On 2-3 key section transitions (e.g., hero°˙stats, compute°˙mes), replace the horizontal hairline with a subtle diagonal hairline that crosses the full viewport at a 3-degree angle:
```css
.section-divider--diagonal {
  position: relative;
  height: 1px;
  background: var(--line);
  transform: rotate(-3deg) scaleX(1.05);
  transform-origin: center;
  margin: clamp(48px, 7vw, 96px) 0;
}
.section-divider--diagonal::before {
  content: '';
  position: absolute;
  top: -3px; left: 50%;
  width: 6px; height: 6px;
  border: 1px solid var(--cyan);
  border-radius: 50%;
  transform: translateX(-50%);
}
```
The small cyan dot at the midpoint is a "registration mark" °™ like a lithography alignment target.
**Must NOT do**: Don't apply to every section (2-3 key transitions only °™ restraint). Don't break responsive (the rotation must not cause horizontal scroll on mobile °™ use `overflow-x: clip` on body).
**Justification**: A single diagonal hairline with a registration dot breaks the rigid horizontal rhythm just enough to feel intentional, not chaotic. It's the "grid-breaking element" the skill asks for, executed with engineering restraint.

#### 44. Conic-gradient reticle sweep (frontend-design backgrounds principle)

**Target task**: T8
**Problem**: Source uses `radial-gradient` for the hero glow but never `conic-gradient`. A conic gradient can create a "reticle sweep" effect that radial cannot.
**Change**: Add a slow conic-gradient sweep behind the hero wafer motif (or the architecture section's wafer):
```css
.hero__wafer-sweep {
  position: absolute;
  inset: -20%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(103, 232, 249, 0.04) 30deg,
    transparent 60deg,
    transparent 360deg
  );
  animation: reticle-sweep 12s linear infinite;
  pointer-events: none;
  z-index: 0;
}
@keyframes reticle-sweep { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .hero__wafer-sweep { animation: none; } }
```
The sweep is a faint cyan wedge that rotates once every 12 seconds °™ like a radar or a reticle scanning for alignment marks.
**Justification**: This is atmospheric depth that the source doesn't have. It's subtle (4% opacity) but adds movement to the wafer column without competing with the wafer's own 26s rotation. The conic gradient is the only CSS feature that creates this effect efficiently.

#### 45. Clip-path panel reveals (frontend-design spatial principle)

**Target task**: T8, T15
**Problem**: Source uses `opacity` + `translateY` for `.reveal` animations. The frontend-design skill encourages "overlap" and unexpected reveals. `clip-path` can reveal content like a curtain opening.
**Change**: For 2-3 hero-adjacent panels (e.g., the stats panel, the architecture stack), use a `clip-path` reveal instead of the default fade+rise:
```css
.reveal--clip {
  clip-path: inset(0 100% 0 0); /* hidden: clipped from right edge to left */
  transition: clip-path 0.8s var(--ease-entry);
}
.reveal--clip.is-in {
  clip-path: inset(0 0 0 0); /* revealed: full panel */
}
@media (prefers-reduced-motion: reduce) {
  .reveal--clip { clip-path: none; transition: opacity 0.3s; opacity: 0; }
  .reveal--clip.is-in { opacity: 1; }
}
```
The panel wipes in from left to right °™ like a wafer being uncovered in a cleanroom. Use sparingly (2-3 panels per page, not every section).
**Justification**: A clip-path reveal is a distinctive alternative to the generic fade+rise. It feels like a physical uncovering, not a digital animation. The frontend-design skill explicitly calls for "unexpected" reveals.

### Builder directives (apply during execution)

These directives translate the frontend-design skill's mandate into per-task instructions for the builder agents:

1. **T8 (foundation.css)**: When porting components, ADD the new tokens from enrichments #28, #29, #32 AND the new CSS features from #42 (scan-line), #44 (conic sweep), #45 (clip-path). These are additive °™ they don't replace source patterns.
2. **T9 (per-page CSS)**: Apply #43 (diagonal dividers) to 2-3 key section transitions per page. Apply #42 (scan-line hover) to all `.card--reticle` elements.
3. **T15 (core.js)**: Add the cursor-tracking logic for #39 (wafer cursor on contact). Add the page-load orchestration for #41 (first 2 seconds).
4. **T18 (HTML port)**: Add `404.html` as 8th Vite entry (#40). Add the diagonal divider markup to 2-3 sections per page (#43). Add `reveal--clip` class to 2-3 hero-adjacent panels (#45).
5. **T29 (focus contrast)**: Verify the Litho Lock-On focus state (#20) meets 4.5:1 contrast on both themes.
6. **T32 (anti-AI-slop audit)**: The audit must verify the POSITIVE patterns are present (dense data tables #37, monospace section footers #26, reticle marks on panels, telemetry annotations) °™ not just that negative patterns are absent.

### What "production-grade" means for this plan

The frontend-design skill asks for "production-grade and functional" code. For this plan, that means:
- **No placeholder code** °™ every CSS rule, every JS function, every HTML element must be real
- **No `TODO` comments** in shipped code (only in evidence files)
- **Every animation has a `prefers-reduced-motion` override**
- **Every interactive element has a `:focus-visible` state** (the Litho Lock-On #20)
- **Every SVG is hand-crafted** (no auto-generated icons, no emoji)
- **Every color is a token** (enforced by Stylelint #14)
- **Every spacing value is on the 8px scale** (enforced by audit #17)

### The "one thing someone will remember"

If the builder executes only ONE enrichment, it should be the **wafer motif narrative thread** (#2 + #25 + #39 + #40): the wafer appears on the hero (loading state), the architecture page (as a map), the contact page (as cursor), and the 404 page (as calibration error). Four appearances, each teaching something new. That's the signature.