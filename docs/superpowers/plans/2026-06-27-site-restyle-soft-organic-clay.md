# ShinyLogic Site Restyle (Soft Organic Clay) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan phase-by-phase. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Transform the entire ShinyLogic site (shared chrome + 8 pages) from "Lithographic Precision" to "Soft Organic Clay" as two themes (Clay Light default + Espresso Clay dark), so the live site and the `ui/` library render the new system.

**Architecture:** `DESIGN.md` is the literal source of truth for the look; tasks transform existing files to conform to it. The token layer is rewritten once (both themes + a legacy-alias bridge); shared primitives are restyled with concrete recipes below; motifs are swapped; each page's scoped CSS is transformed by directive against `DESIGN.md`.

**Tech Stack:** Vanilla CSS (`src/styles/*`), multi-page HTML, vanilla JS (`src/scripts/*`), Vite build. No framework.

**Spec:** `docs/superpowers/specs/2026-06-27-site-restyle-soft-organic-clay.md`. **Read `DESIGN.md` before every task.**

## Conventions

- Preserve all copy, numbers, `data-i18n` keys, section IDs, and component **class names**. Only visual styling, motif elements, font links, and brand assets change.
- Token migration is role-based (spec §"Token migration strategy"). Use the alias bridge from Task 1 for unambiguous legacy names; hand-fix `--cyan`/`--radius`/glow per role.
- After each phase, run the site build (`pnpm build`) and confirm no console errors; commit per task with the `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` trailer.
- Verify visual results against `DESIGN.md` in **both** themes (toggle `[data-theme]`).
- This work is on branch `feat/ui-component-library` (continues the redesign initiative).

---

## Phase 0 — Document the dark palette in DESIGN.md

### Task 1: Add the Espresso Clay `[data-theme="dark"]` block to DESIGN.md §4

**Files:** Modify `E:\repo\shiny3\DESIGN.md` (§4 Color Tokens).

- [ ] **Step 1:** After the light `:root` block in §4, add a documented `[data-theme="dark"]` (Espresso Clay) block with the palette from the spec (bg `#1C1611`, sunken `#15100C`, surface `#271F18`, raised `#322619`, surface-ink `#0F0B08`; ink `#F3EADD` / ink-2 `#CDBFAF` / ink-3 `#9C8E7E` / ink-inverse `#2A211B`; clay-500 `#E07A5F`, clay-ink `#EFA88E`, clay-deep `#F4BBA4`; sage-500 `#81A684`, sage-ink `#A9C9AB`; sun-500 `#E9C46A`, sun-ink `#E9C46A`; border `rgba(243,234,221,.12)`, border-strong `.20`, border-field `.34`; focus-ring `#EFA88E`; shadow-rgb `10 6 3`). Add one line: "Both themes share fill hues; dark uses lighter text-accent steps. Contrast targets verified in restyle Phase 1."
- [ ] **Step 2:** Verify DESIGN.md now documents both themes (grep `[data-theme="dark"]` returns the block).
- [ ] **Step 3:** Commit. `git add DESIGN.md && git commit -m "design: document Espresso Clay dark theme in DESIGN.md §4"`

---

## Phase 1 — Token layer

### Task 2: Rewrite `foundation.css` `:root` with both themes + alias bridge

**Files:** Modify `E:\repo\shiny3\src\styles\foundation.css` (lines ~9-61, the `:root` block). Modify `E:\repo\shiny3\src\styles\polish.css` (remove the old `:root` token additions lines ~14-43 and the old `[data-theme="light"]` overrides lines ~47-94 — superseded).

- [ ] **Step 1:** Replace the `foundation.css :root` block with the new Clay Light token system + the legacy-alias bridge. Use this exact block (extend radii/elev/motion/fonts per DESIGN.md §1,§4,§5,§Shape,§Motion):

```css
:root {
  /* ===== Soft Organic Clay — Clay Light (default) ===== */
  --bg-canvas:#FAF6F0; --bg-sunken:#F2E9DE; --surface:#FFFDFB; --surface-raised:#FFFFFF; --surface-ink:#241C16;
  --ink:#2A211B; --ink-2:#5A4F47; --ink-3:#857A6E; --ink-inverse:#FFF8F0; --ink-inverse-2:#C9BCB0;
  --clay-100:#F8E5DD; --clay-500:#E07A5F; --clay-700:#B0492A; --clay-800:#8A3A21;
  --sage-100:#E5EDE2; --sage-500:#81A684; --sage-700:#3F6248; --sage-800:#33503B;
  --sun-100:#FBEFCF;  --sun-500:#E9C46A;  --sun-700:#8A5A00;
  --clay:var(--clay-500); --clay-ink:var(--clay-700); --clay-deep:var(--clay-800);
  --sage:var(--sage-500); --sage-ink:var(--sage-700);
  --sun:var(--sun-500);   --sun-ink:var(--sun-700);
  --success:#3F6248; --success-fill:#81A684; --success-tint:#E5EDE2;
  --warning:#8A5A00; --warning-fill:#E9C46A; --warning-tint:#FBEFCF;
  --danger:#B23A28;  --danger-tint:#F8E0DB; --info:#2E5866; --info-tint:#E0EBEE;
  --border:#EBDFCF; --border-strong:#DCCBB4; --border-field:#9C886B; --focus-ring:#B0492A;
  --shadow-rgb:83 60 42;
  /* fonts */
  --font-display:"Fraunces","Noto Serif TC","Noto Serif SC",Georgia,serif;
  --font-body:"Nunito Sans","Noto Sans TC","Noto Sans SC",system-ui,sans-serif;
  --font-mark:"Varela Round",var(--font-body);
  --font-mono:"Spline Sans Mono",ui-monospace,monospace;
  --fraunces-set:"opsz" 144,"SOFT" 50,"WONK" 0; --tnum:"tnum" 1,"lnum" 1;
  /* spacing/layout (unchanged scale) */
  --s-1:4px;--s-2:8px;--s-3:12px;--s-4:16px;--s-5:24px;--s-6:32px;--s-7:48px;--s-8:64px;--s-9:96px;--s-10:128px;
  --container:1200px; --container-text:720px; --wrap:1200px;
  --pad:clamp(20px,5vw,40px); --sec-pad:clamp(80px,11vw,160px);
  /* radius scale + leaf + blob */
  --r-xs:8px;--r-sm:12px;--r-md:16px;--r-lg:24px;--r-xl:32px;--r-2xl:40px;--r-pill:999px;
  --r-leaf:32px 32px 32px 8px; --r-leaf-alt:40px 8px 40px 8px; --r-blob:60% 40% 30% 70% / 60% 30% 70% 40%;
  --radius:var(--r-md); /* legacy alias → role-correct radii are applied per element in later tasks */
  /* elevation (warm double-shadow) */
  --elev-1:0 1px 2px rgb(var(--shadow-rgb)/.06),0 2px 6px rgb(var(--shadow-rgb)/.05);
  --elev-2:0 2px 4px rgb(var(--shadow-rgb)/.05),0 14px 30px -10px rgb(var(--shadow-rgb)/.14);
  --elev-3:0 4px 8px rgb(var(--shadow-rgb)/.06),0 28px 56px -14px rgb(var(--shadow-rgb)/.20);
  --shadow-clay:0 20px 44px -14px rgb(var(--shadow-rgb)/.22),inset 0 1px 0 rgb(255 255 255/.65);
  --shadow-focus:0 0 0 3px rgb(176 73 42/.35);
  /* motion */
  --ease-soft:cubic-bezier(0.22,1,0.36,1); --ease-inout:cubic-bezier(0.65,0,0.35,1); --ease-spring:cubic-bezier(0.34,1.28,0.64,1);
  --t-fast:200ms;--t-base:360ms;--t-slow:600ms;--t-amble:900ms;--t-drift:18s;
  --ease:var(--ease-soft); /* legacy alias */
  --strip-h:30px; --nav-h:68px;
  /* ===== legacy color aliases (transitional bridge; unambiguous 1:1 by role) ===== */
  --ink-900:var(--bg-canvas); --ink-850:var(--bg-sunken); --ink-800:var(--surface); --ink-700:var(--surface); --ink-600:var(--surface-raised);
  --text:var(--ink); --mist:var(--ink-2); --fog:var(--ink-2); --steel:var(--ink-3);
  --cyan:var(--clay-ink); --cyan-bright:var(--clay-deep); --cyan-deep:var(--clay-ink);
  --gold:var(--sun-ink); --good:var(--sage); --line:var(--border); --line-bright:var(--border-strong);
  --grid:transparent; --glow-cyan:transparent;
  --font-cond:var(--font-display);
  color-scheme:light;
}
```

> The `--cyan→--clay-ink` alias makes the 162 `--cyan` *text* uses correct immediately; the *fill/border* uses of `--cyan` get hand-fixed to `--clay` in Phase 3 and Phase 5. `--grid`/`--glow-cyan→transparent` neutralizes the retired grid/glow until their layers are replaced in Phase 4.

- [ ] **Step 2:** Append the Espresso Clay dark block (from Task 1) to `foundation.css` right after `:root`:

```css
[data-theme="dark"]{
  --bg-canvas:#1C1611;--bg-sunken:#15100C;--surface:#271F18;--surface-raised:#322619;--surface-ink:#0F0B08;
  --ink:#F3EADD;--ink-2:#CDBFAF;--ink-3:#9C8E7E;--ink-inverse:#2A211B;
  --clay-500:#E07A5F;--clay-700:#EFA88E;--clay-800:#F4BBA4;
  --sage-500:#81A684;--sage-700:#A9C9AB; --sun-500:#E9C46A;--sun-700:#E9C46A;
  --clay:var(--clay-500);--clay-ink:var(--clay-700);--clay-deep:var(--clay-800);
  --sage:var(--sage-500);--sage-ink:var(--sage-700);--sun:var(--sun-500);--sun-ink:var(--sun-700);
  --success:#A9C9AB;--success-tint:#21302A; --warning:#E9C46A;--warning-tint:#2E2615; --danger:#E8917F;--danger-tint:#33211C; --info:#8FB6C4;--info-tint:#16242A;
  --border:rgba(243,234,221,.12);--border-strong:rgba(243,234,221,.20);--border-field:rgba(243,234,221,.34);--focus-ring:#EFA88E;
  --shadow-rgb:10 6 3; color-scheme:dark;
  /* legacy aliases re-point automatically via the var() chain (--ink-900 etc. reference the redefined tokens) */
  --ink-900:var(--bg-canvas);--ink-850:var(--bg-sunken);--ink-800:var(--surface);--ink-700:var(--surface);--ink-600:var(--surface-raised);
  --text:var(--ink);--mist:var(--ink-2);--fog:var(--ink-2);--steel:var(--ink-3);
  --cyan:var(--clay-ink);--cyan-bright:var(--clay-deep);--gold:var(--sun-ink);--good:var(--sage);--line:var(--border);--line-bright:var(--border-strong);
}
```

- [ ] **Step 3:** Remove the superseded token additions and old `[data-theme="light"]` overrides from `polish.css` (lines ~14-43 and ~47-94). Keep any non-color polish (frosted nav, theme-toggle icon visibility, reduced-motion) but repoint its colors to the new tokens.
- [ ] **Step 4: Verify contrast — both themes.** Write a temporary node script (or reuse one) that computes WCAG ratios for every pairing in DESIGN.md's cheat-sheet AND the dark palette (ink/ink-2/ink-3 on bg-canvas/surface/sunken; clay-ink/sage-ink/sun-ink on bg; ink on clay/sage/sun fills; ink-inverse on surface-ink). Run it. **Every text pairing must be ≥4.5:1 (≥3:1 large/UI).** Fix any dark-theme miss by lightening the `*-700` text step. Delete the script after (do not commit it).
- [ ] **Step 5:** `pnpm build` succeeds; load the site and confirm it's no longer dark-graphite (cream in light, warm-dark in dark via the toggle). Commit. `git add src/styles/foundation.css src/styles/polish.css && git commit -m "restyle: rewrite token layer for Soft Organic Clay (both themes + alias bridge)"`

---

## Phase 2 — Fonts + theme meta (all 8 pages)

### Task 3: Swap Google Fonts links, theme-color, and no-FOUC default on every page

**Files:** Modify all 8 HTML files in `E:\repo\shiny3\src\pages\` (index, about, solutions, technology, case-studies, careers, contact, 404).

- [ ] **Step 1:** In each page's `<head>`, replace the Saira/Saira Condensed/IBM Plex Mono/Noto Sans TC `<link>` with the new faces. Per the CJK-perf rule, request the page's CJK locale only (default Noto TC; pages are zh-Hant). Use:

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Nunito+Sans:opsz,wght@6..12,300..900&family=Spline+Sans+Mono:wght@400;500&family=Varela+Round&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@600;700;900&display=swap" rel="stylesheet">
```

- [ ] **Step 2:** Change each `<meta name="theme-color" content="#07090C">` → `content="#FAF6F0"`. (The dark variant's theme-color is set dynamically by `core.js initTheme`; update its light value there too in Phase 4.)
- [ ] **Step 3:** In each no-FOUC inline script, flip the default from dark to light: `var theme = saved || (prefersDark ? 'dark' : 'light');` using `matchMedia('(prefers-color-scheme: dark)')`, fallback `'light'` in the catch.
- [ ] **Step 4:** Verify: each page requests Fraunces/Nunito/etc. (DevTools Network) and no Saira/IBM Plex Mono; first paint is cream, no FOUC.
- [ ] **Step 5:** Commit. `git commit -am "restyle: swap to Clay font stack + light theme-color/default on all 8 pages"`

---

## Phase 3 — Shared primitives

### Task 4: Restyle the shared component layer to DESIGN.md §5–§9

**Files:** Modify `foundation.css` (typography classes, `.btn`, `.card`, `.panel`, `.metric`, `.tag`/`.pill`, `.statusbar`, `.marquee`, `.footer`, `.section-head`/`.kicker`/`.section-title`/`.section-index`, `.hairline`/`.rule`, `.reticle`/`.tick`, `.grain`, hero base), `chrome.css` (`.nav`/`.brand`/`.langswitch`/`.theme-toggle` active states, `.page-hero`, forms), `polish.css` (frosted nav, theme-toggle icons), `utilities.css`.

Apply these concrete recipes (read DESIGN.md §8 component patterns for full intent):

- [ ] **Step 1: Typography + eyebrow.** `.section-title`→`font-family:var(--font-display);font-weight:600`. `.kicker`/`.eyebrow`→`font-family:var(--font-body);font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--clay-ink)`. `.mono`→`font-family:var(--font-mono)`. `.accent`→`color:var(--clay-ink)`. `.gold`→`color:var(--sun-ink)`. `.metric__num`→`font-family:var(--font-body);font-weight:800;font-feature-settings:var(--tnum)`. Body uses `--font-body`, color `--ink` (lede `--ink-2`).
- [ ] **Step 2: Buttons.**

```css
.btn{font-family:var(--font-body);font-weight:700;display:inline-flex;align-items:center;gap:var(--s-2);padding:14px 26px;border:0;border-radius:var(--r-md);cursor:pointer;transition:transform var(--t-fast) var(--ease-soft),box-shadow var(--t-fast) var(--ease-soft),background-color var(--t-fast) var(--ease-soft)}
.btn--primary{background:var(--clay);color:var(--ink);box-shadow:var(--elev-2)}
.btn--primary:hover{transform:translateY(-2px);box-shadow:var(--elev-3)}
.btn--ghost{background:transparent;color:var(--ink);border:1.5px solid var(--clay-ink);border-radius:var(--r-pill)}
.btn--ghost:hover{background:var(--clay-100)}
.btn__arrow{transition:transform var(--t-fast) var(--ease-soft)}
.btn:hover .btn__arrow{transform:translateX(3px)}
.btn--block{width:100%;justify-content:center}
```

- [ ] **Step 3: Cards, panels, leaf corner, retire ticks.**

```css
.card{background:var(--surface);border:0;border-radius:var(--r-lg);padding:var(--card-pad,clamp(24px,3vw,36px));box-shadow:var(--elev-2);transition:transform var(--t-fast) var(--ease-soft),box-shadow var(--t-fast) var(--ease-soft)}
.card:hover{transform:translateY(-4px);box-shadow:var(--elev-3)}
.card--reticle{border-radius:var(--r-leaf);box-shadow:var(--shadow-clay)}
.panel{background:var(--bg-sunken);border:0;border-radius:var(--r-2xl);padding:var(--card-pad,clamp(24px,3vw,36px));box-shadow:var(--elev-1)}
.panel.reticle{border-radius:var(--r-2xl)}
.tick{display:none} /* retired reticle marks — leaf corner replaces them */
.reticle{position:relative} /* keep as positioning wrapper only */
.hairline{border:0;height:1px;background:var(--border)}
.rule{border:0;height:1px;background:var(--border-strong)}
```

- [ ] **Step 4: Nav → floating pill + brand + active state.** `.nav` becomes a floating pill: `position:fixed;left:var(--gutter,16px);right:var(--gutter,16px);top:16px;border-radius:var(--r-pill);background:color-mix(in srgb,var(--bg-canvas) 85%,transparent);box-shadow:var(--elev-2)`. On scroll (`.nav.is-scrolled`) add `backdrop-filter:blur(12px)`. `.brand__mark`→`font-family:var(--font-mark)`. Active link (`.nav__link.is-active`/`[aria-current="page"]`)→`color:var(--clay-ink);background:var(--clay-100);border-radius:var(--r-pill)`. `.langswitch__btn.is-active`→clay-100 tint. `.theme-toggle` keeps the icon-swap CSS (already restyle-safe).
- [ ] **Step 5: Metric / tag / pill / statusbar / marquee / footer / section-head / page-hero / forms.** `.tag`/`.pill`→`border-radius:var(--r-pill);background:var(--clay-100);color:var(--clay-deep);border:0`. `.statusbar`→`font-family:var(--font-mono);color:var(--ink-2);background:var(--bg-sunken)`. `.marquee__item`→`font-family:var(--font-mono);color:var(--ink-2)`. `.footer`→`background:var(--bg-sunken)`. `.section-index`→`font-family:var(--font-display);color:var(--ink-3);opacity:.5`. Form `.input`/`.select`/`.textarea`→`background:var(--surface);border:1.5px solid var(--border-field);border-radius:var(--r-sm);color:var(--ink)`; focus→`border-color:var(--focus-ring);box-shadow:var(--shadow-focus)`. `.skip-link`/`:focus-visible`→`box-shadow:var(--shadow-focus)`.
- [ ] **Step 6: Backgrounds.** `.grain`→keep but warm-tint at `opacity:.03` (or `display:none` if it reads as grunge). Remove the old body blueprint-grid background; add a faint blob/contour body layer per DESIGN.md §7 (or leave plain cream for now and add blobs in Phase 4).
- [ ] **Step 7: Verify.** `pnpm build`; open `index.html` and toggle the theme — nav is a floating pill, buttons are clay+ink, cards have a leaf corner + warm shadow, headings are Fraunces, eyebrows are tracked clay-ink, no L-tick reticle marks, no cyan. Both themes legible. Commit. `git commit -am "restyle: shared primitives → Soft Organic Clay (nav pill, clay buttons, leaf-corner cards, Fraunces)"`

---

## Phase 4 — Motifs (HTML + JS)

### Task 5: Replace the hero wafer SVG + grid/glow with fab-process motifs

**Files:** `index.html`, `about.html`, `solutions.html`, `404.html` (hero wafer SVG ~line 164/178/201/170); the `.hero__grid-overlay` (index/careers/technology) and `__glow` (6 pages) elements; `foundation.css` hero rules; `src/scripts/core.js`.

- [ ] **Step 1:** Replace each hero wafer `<svg>` block with a **fab-process motif** SVG: concentric **light-diffraction rings** (clay/sage strokes, low opacity) + 2–3 soft **drifting blob** shapes (`border-radius:var(--r-blob)` divs or `<ellipse>` with clay/sage/sun fills at 8–14% opacity). Provide one reusable markup snippet and reuse it (the wafer was decorative `aria-hidden` — keep `aria-hidden="true"`).
- [ ] **Step 2:** Convert `.hero__glow` to a warm clay/sun radial at low opacity (or remove); convert `.hero__grid-overlay` to a faint sage **contour** layer (or remove). Update the matching CSS in `foundation.css`/page CSS.
- [ ] **Step 3:** In `core.js`: replace the `wafer-spin` animation usage with a slow **blob drift** (translate/scale over `--t-drift`); change `initHeroParallax` easing to a gentle settle; change `initReveal` to add the blur-dissolve (`filter:blur(4px)→0`) class; keep `initDotGrid` but recolor dots to clay/sage (or leave the grid as a fab-process field). Update `initTheme`'s light `theme-color` value to `#FAF6F0` (dark stays its bg). Keep all reduced-motion guards.
- [ ] **Step 4: Verify.** No wafer/reticle/grid/glow visuals remain; blobs drift gently; reduced-motion disables drift; `pnpm build` clean. Commit. `git commit -am "restyle: replace wafer/reticle/grid/glow with fab-process motifs (blobs, diffraction, leaf) + settling motion"`

---

## Phase 5 — Per-page CSS (one task per page)

### Tasks 6–13: Transform each page's scoped CSS to DESIGN.md

For EACH page CSS file below, one task: **(a)** replace legacy token references that the alias bridge doesn't fully cover — every `var(--cyan)` used as a *fill/border/background* → `var(--clay)` (text uses already alias to `--clay-ink`), every `var(--radius)` → the role-correct `--r-*`, remove `--glow-cyan`/`--grid` usages; **(b)** apply the new shapes/shadows/type to the page's components per DESIGN.md; **(c)** swap page-specific motifs (reticle-wrapped cards → leaf corner; page hero glow/grid → blob/contour; wafer/crosshair SVGs → fab-process). Then verify the page renders coherently in **both** themes with all copy/numbers intact, and commit.

- [ ] **Task 6:** `src/styles/pages/home.css` (2715 lines — largest; hero wafer, compute dot-grid, arch accordion, capability cards, MES timeline, delivery gates). Verify all home sections in both themes. Commit.
- [ ] **Task 7:** `src/styles/pages/technology.css` (1090; tech-compute dot-grid, capability cards, hero grid/glow). Commit.
- [ ] **Task 8:** `src/styles/pages/case-studies.css` (996; reticle cards throughout, capex timeline). Commit.
- [ ] **Task 9:** `src/styles/pages/solutions.css` (917; 6-layer wafer stack, reticle cards). Commit.
- [ ] **Task 10:** `src/styles/pages/about.css` (758; hero wafer + reticle, leadership grid). Commit.
- [ ] **Task 11:** `src/styles/pages/contact.css` (714; crosshair SVG, form grid). Commit.
- [ ] **Task 12:** `src/styles/pages/careers.css` (619; page-hero glow/grid, job cards). Commit.
- [ ] **Task 13:** `src/styles/pages/404.css` (118; wafer error state). Commit.

Each task verifies: `pnpm build` clean; the page renders on-brand in light AND dark; `git diff` shows no copy/number/`data-i18n` changes (visual-only).

---

## Phase 6 — Brand assets

### Task 14: Restyle favicon + OG card

**Files:** `public/favicon.svg`, `public/og-card.html`, `public/og-image.png`.

- [ ] **Step 1:** Rewrite `favicon.svg`: cream `#FAF6F0` background, a sprout/leaf glyph or `SL` monogram in clay `#E07A5F` (one leaf-corner gesture). Keep 64×64 + `mask-icon` compatible.
- [ ] **Step 2:** Restyle `og-card.html`'s inline `<style>` to the Clay Light tokens (cream bg, clay/sun accents, Fraunces wordmark, fab-process motif — diffraction rings / drifting blobs), keeping the wordmark/tagline/metrics content.
- [ ] **Step 3:** Regenerate `og-image.png` (1200×630) from `og-card.html` via the project's existing screenshot step (note: may require the user's environment; if unavailable, flag it and leave the PNG for a manual regen).
- [ ] **Step 4:** Verify favicon + OG card render on-brand. Commit. `git commit -am "restyle: favicon + OG card → Soft Organic Clay"`

---

## Phase 7 — QA & close-out

### Task 15: Full QA against DESIGN.md, both themes × 8 pages

- [ ] **Step 1:** Run `pnpm build` (site) and `pnpm lint` — both green.
- [ ] **Step 2:** Run `pnpm -C ui build` — the library still builds and now inherits the new look (its imported `src/styles/*` changed). Confirm green.
- [ ] **Step 3:** Use `/design-review` (and/or `/qa`) over all 8 pages in **both** themes. Confirm: zero `DESIGN.md` deviations; contrast AA in both themes; no console errors; reduced-motion honored; keyboard focus rings visible (`--shadow-focus`); touch targets ≥44px; no wafer/reticle/cyan/Saira remnants.
- [ ] **Step 4:** `git grep` for retired tokens/motifs in active CSS (`--cyan` as fill, `wafer`, `reticle` ticks visible, `Saira`, `IBM Plex Mono`) — should be absent or alias-only. Fix stragglers.
- [ ] **Step 5:** Final commit + summary. Update `docs/superpowers/specs/...restyle...md` status to Done if desired.

## Done criteria (matches spec §Verification)

1. Both themes pass WCAG AA (script-verified Phase 1 + QA Phase 7).
2. All 8 pages render coherently in Clay Light + Espresso Clay; copy/facts/i18n untouched.
3. No retired system in active use (grep clean).
4. Site `pnpm build`+`pnpm lint` green; `pnpm -C ui build` green; no console errors.
5. `/design-review` flags zero DESIGN.md deviations.
