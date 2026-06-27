# ShinyLogic Site Restyle — Soft Organic Clay — Spec

**Date:** 2026-06-27
**Status:** Spec — pending implementation plan
**Source of truth for the look:** `DESIGN.md` (Soft Organic Clay). This spec governs *how* the existing site is transformed to conform to it; `DESIGN.md` governs *what* it should look like. Where they disagree, `DESIGN.md` wins.

## Goal

Restyle the entire ShinyLogic site — the shared chrome + all 8 pages — from the retired "Lithographic Precision" dark/cold system to "Soft Organic Clay", as two themes (**Clay Light**, default, and **Espresso Clay**, warm-dark). The live site and the `ui/` component library (which imports `src/styles/*`) both end up rendering the new system.

## Boundaries

- **Content, copy, facts, i18n keys, and markup *structure* are unchanged.** Only the visual layer changes: tokens, fonts, shapes, shadows, motion, the decorative *motif* elements, and brand assets. Every `data-i18n` key, every number, every section ID and component class name stays.
- **Component class names are preserved** (`.btn`, `.card`, `.panel`, `.metric`, `.nav`, `.tag`, `.tick`, `.reticle`, …) — the live HTML and the `ui/` library depend on them; only their *styling* changes. (`.reticle`/`.tick`/`.card--reticle` keep their names but now render the leaf-corner gesture instead of L-ticks.)
- **The `ui/` library needs no source changes** — it inherits the look from the restyled `src/styles/*`. Verify its build still passes at the end.
- **Two themes, toggle kept.** Default = Clay Light. The `[data-theme]` system, the no-FOUC script, `localStorage['sl-theme']`, the nav `ThemeToggle`, and `core.js` `initTheme` all stay — repointed at the new palettes. (No-FOUC default flips to **light**; still respects a saved pref and `prefers-color-scheme`.)

## Two-theme palettes

**Clay Light** = the `:root` system already specified in `DESIGN.md §4` (cream `#FAF6F0`, espresso ink `#2A211B`, clay/sage/sun with their verified text-safe `*-700/800` roles).

**Espresso Clay (warm-dark)** — new; **Phase 0 adds this to `DESIGN.md §4` as the `[data-theme="dark"]` block.** Same hues, deep warm surfaces, contrast targets (verify with the WCAG script in Phase 1 exactly as the light system was):

```css
[data-theme="dark"] {
  /* surfaces — deep warm espresso (never neutral grey) */
  --bg-canvas:      #1C1611; --bg-sunken: #15100C;
  --surface:        #271F18; --surface-raised: #322619; --surface-ink: #0F0B08;
  /* ink — warm cream hierarchy (targets on --bg-canvas) */
  --ink:    #F3EADD; /* ~13:1 AAA */   --ink-2: #CDBFAF; /* ~8:1 */   --ink-3: #9C8E7E; /* ~4.5:1 large/UI */
  --ink-inverse: #2A211B; /* dark label on light accent fills */
  /* accents — FILLS unchanged (mid-tone, ink label still passes); TEXT uses lighter steps on dark */
  --clay-500: #E07A5F; --clay-ink: #EFA88E; /* clay text on dark ~7:1 */ --clay-deep: #F4BBA4;
  --sage-500: #81A684; --sage-ink: #A9C9AB; /* sage text on dark */
  --sun-500:  #E9C46A; --sun-ink:  #E9C46A; /* sun text on dark ~9:1 */
  /* borders / focus / shadow */
  --border: rgba(243,234,221,.12); --border-strong: rgba(243,234,221,.20);
  --border-field: rgba(243,234,221,.34); --focus-ring: #EFA88E;
  --shadow-rgb: 10 6 3; /* near-black warm; shadows are subtler on dark */
}
```
Both themes share the **fill** hues (clay/sage/sun-500) with **dark-ink labels**; only the *text-accent* and *surface/ink* tokens differ. Every dark pairing must clear WCAG AA (verify in Phase 1); fix any that misses by lightening the text step.

## Token migration strategy (role-based, not value-swap)

There are ~767 legacy token references across 11 CSS files. A blind value-swap leaks because the old tokens conflate roles the new system splits. The strategy:

1. **Author the new token system** in `foundation.css :root` (Clay Light) + the `[data-theme="dark"]` block (Espresso Clay), using the `DESIGN.md` names (`--bg-canvas`, `--ink`, `--ink-2/3`, `--clay`, `--clay-ink`, `--clay-deep`, `--sage*`, `--sun*`, `--border*`, `--focus-ring`, the `--r-*` radii, `--elev-*`, `--shadow-clay`, `--ease-soft`, `--t-*`, `--font-display/body/mark/mono`, `--tnum`, spacing `--s-*` unchanged, `--container`/`--container-text`).
2. **Bridge the unambiguous legacy names** with aliases so the bulk of references shift for free (these are 1:1 by role):
   `--text → var(--ink)` · `--mist → var(--ink-2)` · `--fog → var(--ink-2)` · `--steel → var(--ink-3)` · `--ink-900 → var(--bg-canvas)` · `--ink-850 → var(--bg-sunken)` · `--ink-800/700 → var(--surface)` · `--ink-600 → var(--surface-raised)` · `--line → var(--border)` · `--line-bright → var(--border-strong)` · `--good → var(--sage)` · `--gold → var(--sun-ink)` · `--font-display → var(--font-display)` (now Fraunces) · `--font-body → var(--font-body)` (Nunito) · `--font-mono → var(--font-mono)` (Spline Sans Mono) · `--font-cond → var(--font-display)`.
3. **Fix the leaky/ambiguous references by hand** (these can't be aliased):
   - **`--cyan` (162 uses)** — split by role: as *fill/background/border* → `--clay`; as *text/link/active* → `--clay-ink`; as *glow* → drop (replaced by blobs). Each of the 162 uses is reviewed in its file (shared + per-page passes).
   - **`--cyan-bright/-deep`, `--glow-cyan`, `--grid`** — glows/grid are retired motifs → remove or replace with blob/contour layers per `DESIGN.md §7`.
   - **`--radius` (53 uses, single 4px)** — map to the role-correct radius from the `--r-*` scale per element (chips `--r-xs`, inputs `--r-sm`, buttons `--r-md`, cards `--r-lg`, panels `--r-xl/2xl`, pills `--r-pill`).
4. **End state:** the alias bridge is a transitional convenience; the shared-CSS and per-page passes progressively replace legacy names with the real new tokens. A final grep for `--cyan`/`--ink-9`/`--font-cond` in active CSS should trend to zero (aliases may remain as a thin compat shim, documented).

## Phasing (the plan elaborates each into bite-sized tasks)

- **Phase 0 — DESIGN.md dark palette.** Add the Espresso Clay `[data-theme="dark"]` block to `DESIGN.md §4`. Verify: DESIGN.md documents both themes.
- **Phase 1 — Token layer.** Rewrite `foundation.css :root` (Clay Light) + add the `[data-theme="dark"]` block + the alias bridge (above). Move the existing `[data-theme="light"]` overrides in `polish.css` into this new scheme (the old light theme is discarded). Verify: **run the WCAG contrast script over every text/UI pairing in both themes — all pass AA**; the site loads without unstyled flashes.
- **Phase 2 — Fonts + theme meta.** Swap the Google Fonts `<link>` on all 8 pages to Fraunces + Nunito Sans + Varela Round + Spline Sans Mono + Noto Serif TC + Noto Sans TC (one CJK locale per page per the perf rule). Update each `<meta name="theme-color">` and flip the no-FOUC default to light. Verify: every page loads the new faces; no Saira/IBM Plex Mono requested.
- **Phase 3 — Shared primitives.** Restyle `foundation.css` + `chrome.css` + `polish.css` + `utilities.css` component groups to `DESIGN.md §5–§9`: type scale, `.btn`(clay fill + ink label) / `.btn--ghost`, `.card`/`.card--reticle`(leaf corner + `--elev-2`), `.panel`, `.nav`→floating pill + blur, `.brand`, `.langswitch`, `.theme-toggle`, `.statusbar`, `.marquee`, `.footer`, `.metric`(tabular), `.tag`/`.pill`, `.section-head`/`.kicker`(tracked eyebrow)/`.section-title`(Fraunces)/`.section-index`, `.hairline`/`.rule`, `.page-hero`, form `.field`/`.input`/`.select`/`.textarea`. Replace the `.grain`/`grid`/`glow` background layers with the warm-grain(≤3%)/contour/blob layers. Verify: a representative page (home) renders coherently in both themes.
- **Phase 4 — Motifs (HTML + JS).** Replace in-markup motifs: hero wafer SVG (index/about/solutions/404) → fab-process motif (diffraction rings + drifting blobs); `.tick` reticle spans → leaf-corner treatment (restyle `.reticle`/`.tick` so the existing spans render the gesture, OR simplify markup); per-page `__glow`/`__grid` → blob/contour. Update `core.js`: `wafer-spin` → blob drift, `initHeroParallax` → gentle settle, scroll-reveal → blur-dissolve, keep `initDotGrid` (restyle dots to clay/sage) or replace with a fab-process field; `initTheme` already updates theme-color. Verify: no wafer/reticle/grid/glow visuals remain; reduced-motion honored.
- **Phase 5 — Per-page CSS.** Migrate each page's scoped CSS to the new tokens + page motifs, one page per task (home is largest at 2715 lines; then technology, case-studies, solutions, about, contact, careers, 404). Verify: each page renders coherently in both themes, copy/numbers intact.
- **Phase 6 — Brand assets.** Restyle `public/favicon.svg` (sprout/leaf or SL monogram in clay on cream) and `public/og-card.html` (cream + clay, fab-process motif); regenerate `og-image.png` from it. Verify: favicon + OG render on-brand.
- **Phase 7 — QA.** Visual + contrast QA of all 8 pages × both themes against `DESIGN.md` (use `/design-review` / `/qa`); confirm `pnpm build` (site) + `pnpm lint` green, `pnpm -C ui build` still green (library inherits), no console errors, reduced-motion + keyboard + focus rings correct.

## Verification (success criteria)

1. **Both themes pass WCAG AA** — every text/UI pairing in Clay Light and Espresso Clay is contrast-verified (script-checked, as the light system was).
2. **All 8 pages render coherently** in the new system, both themes; copy/facts/i18n untouched (`git diff` shows no content/key changes, only visual).
3. **No retired system remains in active use** — grep shows no `--cyan`/`--gold` (non-alias) usage, no wafer/reticle-tick/blueprint-grid/radial-glow motifs rendering.
4. **Builds + library intact** — site `pnpm build` + `pnpm lint` green; `pnpm -C ui build` green (the library inherits the new look); no console errors; reduced-motion respected.
5. **DESIGN.md conformance** — a QA pass flags zero deviations from `DESIGN.md`.

## Out of scope

Net-new pages or sections; copy rewrites; backend/contact-form logic; the `ui/` library's component structure (it only re-skins via CSS). The OG `og-image.png` regeneration is included but depends on a render/screenshot step that may need the user's environment.
