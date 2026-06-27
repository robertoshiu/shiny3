> This is the design system source of truth for ShinyLogic v3. Read before any visual/UI decision.

# DESIGN.md — 顯藝科技 ShinyLogic

> Single source of truth for the ShinyLogic company website. Every build/review agent
> MUST read this file before touching markup, style, or copy. Do not deviate without
> explicit user approval. In QA mode, flag any code that contradicts this file.

---

## 1. Brand & Positioning

**顯藝科技 · ShinyLogic** — 智能晶圓廠 IT/OT 全棧系統整合商
(Intelligent wafer-fab IT/OT full-stack systems integrator.)

ShinyLogic 為高量產（HVM）晶圓廠設計並交付**從設備數據、到 AI 決策閉環、再到異地備援**的完整六層技術堆疊。我們不只供應硬體，而是承擔授權、責任與業務連續性。

**Flagship reference build — "FAB300"**：以 Applied SmartFactory FAB300 為 MES 核心、3 × NVIDIA GB300 NVL72（248 顆 AI GPU）為算力底座的全方位智能晶圓廠建置。網站以此案為代表性能力證明（capability proof），而非單純預算文件。

**One-line brand promise:** 把設備數據，鍛造成可決策的智能。
**Descriptor (EN):** We build the intelligence layer of the modern wafer fab.

---

## 2. Voice & Language

- **Body copy: 繁體中文（Traditional Chinese）.** The deck source is Simplified; convert all marketing copy to Traditional Chinese.
- **Kickers / section labels: English, tracked UPPERCASE eyebrow (Nunito Sans, color clay-ink); technical annotations / data labels: Spline Sans Mono (monospace) reserved for data / lab-report lines.** (e.g. `INTELLIGENT FAB INFRASTRUCTURE`, `// FIG.03`). Mirrors the deck's English section headers.
- **Keep verbatim, never translate:** product & standard names — NVIDIA GB300 NVL72, HGX B300, Blackwell Ultra, Quantum-X800, Spectrum-X, ConnectX-8, Applied SmartFactory FAB300 (AMAT FAB300), AVEVA PI, Omniverse, Claroty, Nozomi, SECS-GEM, GEM300, OPC UA, IEC 62443, SEMI E187, ISA-95, 等保 2.0, RTO/RPO/SLO/WSPM/PUE.
- **Tone:** precise, confident, engineering-grade, restrained. Lead with concrete numbers. No hype adjectives, no exclamation marks, no emoji.
- Numbers use thin grouping; currency shown as `RMB 4.35 億` / `RMB 43,459 萬`. Always note unit.

---

## 3. Aesthetic Direction — "Soft Organic Clay"

> **Soft Organic Clay** — *Hand-formed, never soft-headed.* The calm warmth of pressed clay wrapped around the exacting spine of fab-grade engineering.

This is the deliberate, total inverse of the retired **"Lithographic Precision"** (graphite/cyan, condensed industrial sans + mono telemetry, 4px reticle corners, cold hairlines, dense asymmetry). Every axis flips — *coherently*. Authority no longer comes from coldness and density; it comes from **a deep espresso-ink anchor, editorial restraint, precise data, and generous air** beneath a warm skin.

**Why organic is the right language for a wafer fab (the credibility keystone).** The soft forms are not decoration borrowed from a wellness app — they are the *actual shapes of the physics we build around*. Epitaxial growth is crystalline accretion; dopant diffusion is a soft gradient; photolithography is light interference; CMP is planarization to a smoothed stone; ion implantation is particle scatter. Our motifs map 1:1 onto these processes (§7). That mapping is what earns "clay" its seriousness: the warmth is a skin; the structure underneath is semiconductor process control.

**The inversion map (every axis flipped):**

| Axis | Retired: Lithographic Precision | New: Soft Organic Clay |
|---|---|---|
| Base | Graphite `#07090C`, dark/cold | Warm cream `#FAF6F0`, light |
| Accent | Phosphor-cyan `#67E8F9` | Clay `#E07A5F` / sage `#81A684` / sun `#E9C46A` |
| Type | Saira condensed + IBM Plex Mono | Fraunces soft-serif + Nunito Sans rounded |
| Radius | 4px sharp + L-reticle ticks | 8–40px + asymmetric leaf corner |
| Depth | 1px hairlines + radial glows | Soft warm double drop-shadows |
| Layout | Asymmetric, dense | Centered, floating cards, structured air |
| Motif | Wafer / grid / grain | Fab-process organic forms (strata, diffraction, delta, stone, scatter) |
| Motion | Snappy reveals, count-ups, pulse | Long settling drifts, slow counts, breathing |
| Ethos | "Restraint over glow" | "Warmth with no loss of rigor" |

**Forbidden (AI slop):** Inter / Roboto / Arial / system-ui as a display face, white text on clay/sage (fails contrast — white-on-clay 2.95:1), candy/neon pastels, sharp 4px corners + reticle ticks, cyan or condensed industrial sans, generic SaaS hero with a centered headline + two buttons + floating cards, emoji icons, cold drop shadows, rainbow palettes.

---

## 4. Color Tokens  (define as CSS variables on `:root`)

WCAG-verified (sRGB). **Rule of the system: dark espresso ink rides on light/accent surfaces; cream rides on deep surfaces. Never white text on clay/sage/sun.** (White-on-clay = 2.95:1, FAIL.)

```css
:root {
  /* ---------- BACKGROUNDS / SURFACES ---------- */
  --bg-canvas:      #FAF6F0; /* page base, warm cream */
  --bg-sunken:      #F2E9DE; /* alt sections / wells (sand) */
  --surface:        #FFFDFB; /* cards (warm near-white) */
  --surface-raised: #FFFFFF; /* top floating cards (use sparingly) */
  --surface-ink:    #241C16; /* deep "espresso" inverted section */

  /* ---------- INK / TEXT HIERARCHY ---------- */
  --ink:           #2A211B; /* primary text — 14.6:1 on canvas (AAA) */
  --ink-2:         #5A4F47; /* secondary text — 7.4:1 (AAA) */
  --ink-3:         #857A6E; /* tertiary — 3.9:1, ≥18px or UI glyphs only (AA large) */
  --ink-inverse:   #FFF8F0; /* text on --surface-ink — 15.9:1 (AAA) */
  --ink-inverse-2: #C9BCB0; /* muted on ink — 9.0:1 (AAA) */

  /* ---------- ACCENT RAMPS (50→900; *-700/800 are the text-safe roles) ---------- */
  /* CLAY (brand) */
  --clay-50:  #FCEDE7;  --clay-100: #F8E5DD; /* tint wash */
  --clay-300: #EFA88E;  --clay-500: #E07A5F; /* brand fill — ink text only */
  --clay-700: #B0492A;  /* TEXT/LINK on light — 5.1:1 (AA)  [role: clay-ink] */
  --clay-800: #8A3A21;  /* emphasis / on-tint / on-dark-fill — 7.2:1 (AAA) [role: clay-deep] */
  --clay-900: #6E2E1A;
  /* SAGE (secondary) */
  --sage-100: #E5EDE2; /* tint */  --sage-500: #81A684; /* fill — ink text only */
  --sage-700: #3F6248; /* TEXT on light — 6.4:1 (AA) */  --sage-800: #33503B; /* 8.3:1 (AAA) */
  /* SUN (tertiary / highlight) */
  --sun-100: #FBEFCF; /* tint */  --sun-500: #E9C46A; /* fill — ink text (9.4:1) */
  --sun-700: #8A5A00; /* "amber" TEXT on light — 5.5:1 (AA) */

  /* convenience aliases used across components */
  --clay: var(--clay-500); --clay-ink: var(--clay-700); --clay-deep: var(--clay-800);
  --sage: var(--sage-500); --sage-ink: var(--sage-700);
  --sun:  var(--sun-500);  --sun-ink:  var(--sun-700);

  /* ---------- SEMANTIC ---------- */
  --success: #3F6248; --success-fill: #81A684; --success-tint: #E5EDE2;
  --warning: #8A5A00; --warning-fill: #E9C46A; --warning-tint: #FBEFCF;
  --danger:  #B23A28; --danger-tint:  #F8E0DB; /* warm red, distinct from brand clay — 5.5:1 */
  --info:    #2E5866; --info-tint:    #E0EBEE; /* the system's single cool note (dusty teal) — 7.2:1 */

  /* ---------- BORDERS / LINES ---------- */
  --border:        #EBDFCF; /* decorative divider (non-load-bearing) */
  --border-strong: #DCCBB4; /* card edge emphasis */
  --border-field:  #9C886B; /* INTERACTIVE inputs — 3.2:1 vs surface (WCAG 1.4.11) */
  --focus-ring:    #B0492A; /* = clay-700, 5.1:1 vs canvas (>3:1) */

  /* ---------- SHADOW TINT (warm brown, never neutral grey) ---------- */
  --shadow-rgb: 83 60 42;
}
```

**Verified contrast cheat-sheet:** `--ink` on canvas/surface/sand 14.6/15.5/13.1 (AAA) · `--ink-2` 7.4 · `--ink-3` 3.9 (large/UI only) · `--clay-ink` on light 5.1 · `--sage-ink` 6.4 · `--ink` on clay fill **5.34** (button label) · `--ink` on sun 9.4 · `--ink` on sage 5.8 · `--ink-inverse` on espresso 15.9 · **white on clay 2.95 — FORBIDDEN.**

### Espresso Clay — `[data-theme="dark"]`

```css
[data-theme="dark"] {
  /* ---------- BACKGROUNDS / SURFACES ---------- */
  --bg-canvas:      #1C1611; /* deep espresso */
  --bg-sunken:      #15100C; /* sunken well */
  --surface:        #271F18; /* card surface */
  --surface-raised: #322619; /* raised card */
  --surface-ink:    #0F0B08; /* deepest inverted */

  /* ---------- INK / TEXT HIERARCHY ---------- */
  --ink:           #F3EADD; /* primary text */
  --ink-2:         #CDBFAF; /* secondary */
  --ink-3:         #9C8E7E; /* tertiary */
  --ink-inverse:   #2A211B; /* text on light surfaces */

  /* ---------- ACCENT RAMPS (lighter steps for dark bg) ---------- */
  --clay-500: #E07A5F; --clay-700: #EFA88E; --clay-800: #F4BBA4;
  --sage-500: #81A684; --sage-700: #A9C9AB;
  --sun-500:  #E9C46A; --sun-700:  #E9C46A;

  --clay: var(--clay-500); --clay-ink: var(--clay-700); --clay-deep: var(--clay-800);
  --sage: var(--sage-500); --sage-ink: var(--sage-700);
  --sun:  var(--sun-500);  --sun-ink:  var(--sun-700);

  /* ---------- SEMANTIC ---------- */
  --success: #A9C9AB; --success-tint: #21302A;
  --warning: #E9C46A; --warning-tint: #2E2615;
  --danger:  #E8917F; --danger-tint:  #33211C;
  --info:    #8FB6C4; --info-tint:    #16242A;

  /* ---------- BORDERS / LINES ---------- */
  --border:        rgba(243,234,221,.12);
  --border-strong: rgba(243,234,221,.20);
  --border-field:  rgba(243,234,221,.34);
  --focus-ring:    #EFA88E;

  /* ---------- SHADOW TINT ---------- */
  --shadow-rgb: 10 6 3;
}
```

Both themes share fill hues; dark uses lighter text-accent steps. Contrast targets verified in restyle Phase 1.

**Usage rule:** Background is overwhelmingly cream (~75–85%). Clay is the single dominant accent (links, active marks, key data, focus ring). Sage and sun appear sparingly — secondary accents and highlight. Accents punctuate; they never flood.

---

## 5. Typography

Load via Google Fonts `<link>` (preconnect + display=swap):

- **Display / headings (Latin):** `Fraunces` — variable (`opsz,wght,SOFT,WONK`).
- **Body / UI (Latin):** `Nunito Sans` — variable (`opsz,wght` axes), weights 200–900, rounded.
- **Wordmark only:** `Varela Round` — single weight 400. Logotype only — cannot carry hierarchy.
- **Data / code / lab-report:** `Spline Sans Mono` — rounded mono; tabular figures.
- **CJK display:** `Noto Serif TC` / `Noto Serif SC` — weights 600–900.
- **CJK body:** `Noto Sans TC` / `Noto Sans SC` — weights 400–700.

```css
:root {
  --font-display: "Fraunces", "Noto Serif TC", "Noto Serif SC", Georgia, serif;
  --font-body:    "Nunito Sans", "Noto Sans TC", "Noto Sans SC", system-ui, sans-serif;
  --font-mark:    "Varela Round", var(--font-body);
  --font-mono:    "Spline Sans Mono", ui-monospace, monospace;
  --fraunces-set: "opsz" 144, "SOFT" 50, "WONK" 0; /* soft + editorial, not wonky */
  --tnum: "tnum" 1, "lnum" 1; /* tabular figures so metrics never jump */
}
```

**Scale** (fluid `clamp`, 16px root):
- Hero headline: `--t-hero` Fraunces 600 `clamp(2.6rem,6vw,4.5rem)` / line-height 1.05 / letter-spacing −0.02em. CJK lines use Noto Serif TC 700.
- H1: `--t-h1` Fraunces 600 `clamp(2rem,4vw,3rem)` / 1.1.
- H2: `--t-h2` Fraunces 600 `clamp(1.6rem,3vw,2.25rem)` / 1.15.
- H3: `--t-h3` Nunito 800 22px / 1.25 (rounded sans at component scale).
- Eyebrow / kicker: `--t-eyebrow` Nunito 700 13px / letter-spacing 0.12em UPPERCASE, color `--clay-ink`.
- Lede: `--t-lead` Nunito 400 `clamp(1.125rem,1.6vw,1.25rem)` / 1.7, color `--ink-2`.
- Body: `--t-body` 16px / 1.7.
- Small: `--t-small` 14px / 1.6.
- Stat / metric numeral: `--t-metric` Nunito 800 + `--tnum` `clamp(2.5rem,5vw,3.75rem)` / 1.0.
- Section index (big faint): Fraunces `clamp(3rem,7vw,6rem)`, color `--ink-3` @ low opacity, sits behind/beside title.
- Button: `--t-button` Nunito 700 16px.

**CJK rules:** headlines → Noto Serif TC/SC 700–900; body → Noto Sans TC/SC 400–500; CJK `line-height:1.85`, `letter-spacing:0.02em`; never apply Latin negative tracking to CJK runs.

**CJK performance:** Full CJK weights are 15–60 MB. Load only ONE CJK locale per page (the page's `lang`), and subset via `unicode-range` / self-host (Fontsource) rather than pulling all three locales' full faces. Hard perf rule.

---

## 6. Spacing, Grid, Layout

```css
:root {
  --s-1:4px; --s-2:8px; --s-3:12px; --s-4:16px; --s-5:24px;
  --s-6:32px; --s-7:48px; --s-8:64px; --s-9:96px; --s-10:128px; --s-11:160px;
  --container:1200px; --container-text:720px;
  --gutter: clamp(20px,5vw,40px); --section-y: clamp(80px,11vw,160px); --card-pad: clamp(24px,3vw,36px);
}
```

- Container: `.wrap` max-width 1200px, side padding `--gutter`, centered.
- Section vertical padding: `--section-y`.
- **Structured Softness (layout law):** softness is *zoned*, not uniform. Structural chrome (nav, footer, data tables, form scaffolding) stays tighter and more rigid (smaller radii, aligned columns, precise gutters). Expressive surfaces (hero, feature cards, accordions) go fully organic (24–40px radii, leaf corners, float). Content is centered in `--container`; sections alternate canvas → sand → tinted panel → canvas; cards *float* (shadow + tint), not boxes-touching density.
- **Density = authority too.** Generous air carries ~75% of the surface, but data is dense and exact: tabular figures, aligned columns, tight metric blocks. Air frames rigor; it does not replace it.
- Breakpoints: 1024 (tablet), 768 (stack), 560 (mobile). Mobile: single column, reduced type scale, hamburger nav.

### Shape Language

```css
:root {
  --r-xs:8px; --r-sm:12px; --r-md:16px; --r-lg:24px; --r-xl:32px; --r-2xl:40px; --r-pill:999px;
  /* SIGNATURE: asymmetric leaf/petal corner — the new reticle-tick analogue */
  --r-leaf:     32px 32px 32px 8px;   /* default leaf */
  --r-leaf-alt: 40px 8px 40px 8px;    /* petal — hero/brand moments */
  --r-blob:     60% 40% 30% 70% / 60% 30% 70% 40%; /* living blob */

  /* Soft warm double-shadow + elevation scale */
  --elev-1: 0 1px 2px rgb(var(--shadow-rgb)/.06), 0 2px 6px rgb(var(--shadow-rgb)/.05);
  --elev-2: 0 2px 4px rgb(var(--shadow-rgb)/.05), 0 14px 30px -10px rgb(var(--shadow-rgb)/.14);
  --elev-3: 0 4px 8px rgb(var(--shadow-rgb)/.06), 0 28px 56px -14px rgb(var(--shadow-rgb)/.20);
  --shadow-clay: 0 20px 44px -14px rgb(var(--shadow-rgb)/.22), inset 0 1px 0 rgb(255 255 255/.65);
  --shadow-focus: 0 0 0 3px rgb(176 73 42/.35);
}
```

**Corner treatment:** uniform large radii on expressive surfaces; **exactly one leaf corner per major composition** (hero, key feature, contact panel) — the brand's recognizable gesture, never random. **Border treatment:** mostly borderless — separation via shadow + background tint. Lines only when needed: `--border` (decorative), `--border-strong` (card edge), `--border-field` 1.5px (inputs, meets 3:1). Focus = `--shadow-focus` + 2px offset, never removed.

---

## 7. Signature Motifs & Textures  (fab-process mapping — this is what makes it memorable)

Each organic motif is the visual of a real fab process — the softness reads as domain fluency, not whimsy:

| Retired motif | New carrier | Fab process it encodes |
|---|---|---|
| Wafer / concentric circles | **Drifting "pebble" blobs** (clay/sage/sun, 8–14% opacity, `--r-blob`) | CMP planarization → smoothed stone; dopant diffusion → soft gradient |
| Reticle corner ticks | **Asymmetric leaf corner** `--r-leaf` + small hand-drawn sprout glyph (section marker) | Crystalline / epitaxial growth |
| Mono telemetry | **Tabular-figure data** (Nunito `--tnum`) + quiet Spline Sans Mono lab-report line | Real numbers, warm voice |
| Blueprint micro-grid | **Faint geological strata + light-diffraction rings** (0.5px, ≤6% opacity sage) | Epitaxial layering; photolithography interference |
| Hard grain overlay | **Subtle warm paper grain ≤3%** (optional — keep very faint or omit) | Tactile surface, not grunge |

Plus **river-delta branching paths** (etching) and **particle-scatter fields** (ion implantation) as section dividers / decorative SVG. Brand recognition now lives in: the leaf corner, drifting blobs, the sprout section marker, puffy warm-shadow cards, and Fraunces headlines.

---

## 8. Components Contract (Foundation defines these; sections REUSE them)

Foundation phase must implement and style all of the following shared classes. Section
builders must use them and only add **scoped** CSS (selectors prefixed by the section's
scope class, e.g. `.s-arch ...`) to avoid collisions.

- `.wrap` — container.
- `.section` — vertical rhythm; `.section--alt` — uses `--bg-sunken` (sand) base.
- `.section-head` — header block. Contains:
  - `.kicker` — tracked UPPERCASE eyebrow (Nunito Sans, color `--clay-ink`).
  - `.section-index` — big faint Fraunces number (e.g. `03`), color `--ink-3`.
  - `.section-title` — display title (Fraunces, `--font-display`).
  - `.section-lede` — `--ink-2` intro paragraph.
- `.panel` — `--bg-sunken` or tint surface, `--r-2xl`, floats on canvas with `--elev-2` shadow, generous interior padding.
- `.card` — `--surface`, `--r-lg`, `--card-pad`, `--elev-2`; `.card--reticle` adds one leaf corner (`--r-leaf`); interactive hover lifts −4px + `--elev-3`.
- `.hairline` — 1px `--border` divider; `.rule` — ticked ruler variant (optional).
- `.metric` / `.metric__num` (Nunito tabular, `--tnum`, `--t-metric`) / `.metric__unit` / `.metric__label` (`--t-eyebrow` Nunito or `--font-mono` lab-report line).
- `.btn` / `.btn--primary` (`--clay` fill + `--ink` label, 5.34:1 AA; `--r-md`, `--elev-2`; hover: lift −2px + `--elev-3`; on-dark variant: `--clay-deep` fill + `--ink-inverse` label) / `.btn--ghost` (1.5px `--clay-ink` border, `--r-pill`; hover: `--clay-100` fill).
- `.pill` / `.tag` — `--r-pill` / `--r-sm`; tint bg + matching deep text (e.g. `--success-tint` + `--success`).
- `.mono`, `.fog`, `.mist`, `.accent` (`--clay-ink` text), `.gold` (`--sun-ink` text) — text utilities.
- `.reticle` — leaf corner wrapper utility (`--r-leaf` applied to target corner).
- Animation hooks: `.reveal` (JS toggles `.is-in` on scroll; blur-dissolve + rise 16px over `--t-slow` `--ease-soft`). Counters use
  `data-count="<number>"`, optional `data-suffix`, `data-prefix`, `data-decimals`.

**New component patterns:**
- **Floating pill nav:** `--surface` at `rgba(255,253,251,0.85)` + `backdrop-filter:blur(12px)`, `--r-pill`, `--elev-2`, inset 16px from top; wordmark in `--font-mark`.
- **Leaf-corner card (hero / feature):** `--r-xl` base + one `--r-leaf` corner + `--shadow-clay`.
- **Lab-report mono footnote:** a single `--font-mono` `--ink-3` line at the card/panel bottom (e.g. `SLO 99.95% · LOG 04:21Z · REF FAB300`) — keeps warm surfaces analytically honest.

### Placeholder markers (Foundation writes these into `index.html`, IN THIS ORDER):
```
<!--#stats-->
<!--#architecture-->
<!--#capabilities-->
<!--#compute-->
<!--#mes-->
<!--#delivery-->
<!--#assurance-->
<!--#contact-->
```
Each section root = `<section id="<id>" class="section reveal s-<scope>">…</section>`.

---

## 9. Motion

Inverts snappy/pulse — every transition **long, settling, organic**, decelerating to rest like clay relaxing into shape.

```css
:root {
  --ease-soft:   cubic-bezier(0.22,1,0.36,1);   /* default settle */
  --ease-inout:  cubic-bezier(0.65,0,0.35,1);
  --ease-spring: cubic-bezier(0.34,1.28,0.64,1);/* slight overshoot — ONE moment only */
  --t-fast:200ms; --t-base:360ms; --t-slow:600ms; --t-amble:900ms; --t-drift:18s;
}
```

- **Hero load:** staggered reveal — kicker → headline line 1 → line 2 → lede → metrics → motif, via `animation-delay` (80ms steps), `translateY(16px)` + opacity + `blur(4px)→0`. ~600ms `--ease-soft`.
- **Scroll reveal:** IntersectionObserver adds `.is-in`; fade + rise 16px + blur-dissolve (`filter:blur(4px)→0`) over `--t-slow` `--ease-soft`; stagger children with `--i` custom property × 80ms delay.
- **Counters:** slow count-up 1200ms `ease-out` + soft fade; tabular figures prevent digit jump.
- **Ambient blobs:** clay/sage/sun blobs drift + morph (`--r-blob` keyframe, translate/scale 1→1.03) over `--t-drift` (18s); key cards "breathe" subtly. Replaces the cyan pulse.
- **Capability cards / feature cards:** hover → lift −4px + `--elev-3`; leaf corner subtly warms on hover.
- **Architecture stack:** hovering/clicking a layer expands its detail (max-height + opacity) over `--t-base` `--ease-soft`; settling drift replaces the signal pulse as the ambient cue. Keyboard accessible (accordion: `button` headers, `aria-expanded`).
- **Timeline:** phase bars animate width from 0 → their budget % when in view over `--t-amble`.
- `--ease-spring` rationed to a single beat (nav logo / primary CTA press).
- **prefers-reduced-motion: reduce** → disable blob drift, breathing, parallax; count-ups show final value; translate reveals use instant opacity only (≤200ms fades).

### Iconography

Line icons, **1.75–2px stroke, fully rounded caps + joins**, 24px grid (Lucide with rounded joins, or Phosphor "regular") — roundness matches the type. Duotone option: `--ink` stroke + 12% clay/sage tint fill. Brand glyph set: hand-drawn sprout / leaf / droplet / pebble for section markers + empty states. No sharp wireframe glyphs, no thin cold 1px icons, no emoji anywhere.

### Do / Don't

**Do** — anchor every layout in `--ink` espresso; let cream + air carry ~75–85%. Put **dark ink on clay/sage/sun fills**; cream text only on `--surface-ink`. Keep data dense and exact under the soft skin (tabular figures, aligned columns, the mono lab-report line). Use **one** leaf corner and **≤3 accent hues** per viewport. Make motion long and settling; ration the spring to one beat. Zone softness (structural chrome tighter, expressive surfaces organic). Tie each motif to its fab process.

**Don't** — no pure `#FFFFFF` page bg, no pure-black text (everything warm). **No white text on clay/sage** (2.95 / 2.72 FAIL). No cold/navy ink or blue focus rings. No candy/neon pastels, kids-app gradients, rainbow chips, glossy 3D bubbles. No Varela Round below the wordmark (single weight — can't build hierarchy). No fast snap reveals or pulse glows; no bouncy spring everywhere. No sharp 4px corners, reticle ticks, cyan, or condensed industrial sans. No emoji; no thin cold technical glyphs.

---

## 10. Accessibility & Quality Bar

- Semantic landmarks: `header`/`nav`/`main`/`section`/`footer`; one `h1` (hero), section `h2`.
- All interactive elements keyboard-operable; visible `:focus-visible` ring using `--focus-ring` (clay).
- Decorative SVG/motifs `aria-hidden="true"`; meaningful images get alt text.
- Body text meets contrast on cream (use `--ink`/`--ink-2` for content, `--ink-3` for large text / UI glyphs only).
- Mobile nav toggles with a button (`aria-expanded`, `aria-controls`).
- No layout shift from counters (reserve width). Valid HTML5. No console errors.

---

## 11. Section Blueprint & Copy

> Copy below is the baseline; agents may refine wording but must keep all facts/numbers and
> the Traditional-Chinese voice. English kickers stay English.

### NAV (Foundation)
- Left: wordmark `SHINYLOGIC` (`--font-mark` Varela Round, tight) with sub `顯藝科技` (`--font-body`, `--ink-2`, small).
  A `--success` (sage) status dot + `[ FAB300 ]` tag (quiet `--font-mono` lab-report) is a nice touch.
- Links: `架構` (#architecture) · `能力` (#capabilities) · `算力` (#compute) · `交付` (#delivery) · `治理` (#assurance).
- CTA button `啟動建置規劃` (#contact).
- Floating pill bar; gains a warm shadow (`--elev-2`) + blur backdrop after scroll. Mobile hamburger.
- A thin top status strip (quiet `--font-mono` lab-report line, `--ink-2`) above nav:
  `顯藝科技 SHINYLOGIC` · `INTELLIGENT WAFER FAB SYSTEMS` · `規劃匯率 USD 1 = RMB 7.2` · `金額單位 RMB 萬`.

### HERO (Foundation)
- Kicker: `智能晶圓廠 · IT/OT 全棧建置  //  INTELLIGENT FAB INFRASTRUCTURE`
- Headline (two lines, CJK display):
  line 1 — `把設備數據，`
  line 2 — `鍛造成可決策的智能。`
  (treat the second clause / a key noun in `--clay-ink`)
- Lede: `從 8 大工藝機台的訊號，到 AI 決策閉環，再到跨區域異地備援 — 顯藝科技為高量產晶圓廠交付完整六層技術堆疊，承擔授權、責任與業務連續性。`
- Inline hero metrics (4): `248 AI GPU` · `4PB 數據湖` · `RTO ≤ 4hr` · `六層架構`.
- CTAs: `啟動建置規劃` (primary → #contact) · `查看系統架構` (ghost → #architecture).
- Right / background: fab-process motif (diffraction rings + drifting blobs).

### MARQUEE strip (Foundation, between hero & stats)
- Slow mono marquee of technology partners/standards (text only, hairline top/bottom):
  `NVIDIA Blackwell Ultra` · `Applied SmartFactory FAB300` · `AVEVA PI` · `NVIDIA Omniverse`
  · `Quantum-X800 InfiniBand` · `Spectrum-X` · `Claroty / Nozomi` · `IEC 62443` · `SEMI E187`
  · `ISA-95`. Pauses on hover.

### `#stats` — 02 / BY THE NUMBERS
Animated counters in a bordered grid (6 cells). Each: big `--t-metric tabular number` + tracked eyebrow / quiet lab-report mono line.
- `RMB 4.35 億` — CapEx 一次性建置 (`data-count="4.35" data-decimals="2" data-suffix=" 億"` w/ `RMB ` prefix shown statically)
- `RMB 6.07 億` — 3 年 TCO（CapEx + 3 年 OpEx）
- `248` — AI GPU（3 × GB300 NVL72 + 4 × HGX B300）
- `4 PB` — NVMe 數據湖
- `≤ 4 hr` — DR RTO（RPO ≤ 15 min）
- `≥ 95%` — 系統 SLO（良率 ≥ 90%）

### `#architecture` — 03 / ARCHITECTURE  ★ centerpiece
Title `六層架構，一條決策閉環`. Lede: `從設備數據到 AI 決策，再到異地備援 — 每一層的硬體、軟體、網路與安全都被涵蓋。`
Interactive vertical stack (accordion, top→bottom signal flow). Six layers:
1. **輸入層 / INPUT** — `8 大工藝機台 · MES / EAP / SECS-GEM · OPC UA 廠務 · 傳感網絡`
2. **數據層 / DATA** — `Historian（AVEVA PI）· Lakehouse + EDA 高頻採集 · 4PB NVMe 數據湖`
3. **算力層 / COMPUTE** — `3 × GB300 NVL72（216 GPU）· 4 × HGX B300 推理 · Quantum-X800 / Spectrum-X 網絡`
4. **應用層 / APPLICATION** — `Agentic RAG / LLM · Digital Twin（Omniverse）· MES（AMAT FAB300）· ECR / ECO`
5. **治理層 / GOVERNANCE** — `CCC 中控台 · SOC 24×7 · OT 安全（Claroty / Nozomi）· 合規底座`
6. **備援層 / RESILIENCE** — `異地備援 DR · 溫備援跨區域 · 異步複製 · SD-WAN 雙 ISP · RTO ≤ 4hr / RPO ≤ 15min`
Each layer header shows index (L1–L6), TC name, EN tag; expanded body shows the bullet tech list as `.tag` chips. First layer open by default.

### `#capabilities` — 04 / CAPABILITIES
Title `從矽到決策的全棧能力`. Grid of 6 leaf-corner cards. Each: inline-SVG line icon
(stroke `--clay-ink`, 1.5px, geometric — NO emoji), TC name, EN sub, one-line blurb, a key spec,
and a faint share % (from CapEx mix). Cards:
1. **AI 算力與儲存** / AI COMPUTE & STORAGE — `NVIDIA Blackwell Ultra 世代；GB300 NVL72 + HGX B300，承接設備高頻數據與 Digital Twin 資產。` spec `248 GPU · 4PB NVMe` · `36.1%`
2. **製造執行 MES** / MANUFACTURING EXECUTION — `Applied SmartFactory FAB300 — 實證 300K WSPM 的高量產旗艦，與設備自動化深度整合。` spec `AMAT FAB300` · `平台軟體 20.4%`
3. **高速網絡 Fabric** / NETWORK FABRIC — `Quantum-X800 InfiniBand 800Gb/s + Spectrum-X，覆蓋東西向 AI 計算網與南北向生產網。` spec `800 Gb/s` · `7.1%`
4. **資訊安全 OT/IT** / SECURITY — `OT/IT 雙域：Claroty / Nozomi 可視化、NGFW、SIEM/SOAR、SOC 24×7，對齊 IEC 62443。` spec `IEC 62443` · `5.8%`
5. **異地備援 DR** / RESILIENCE — `溫備援跨區域、異步複製、SD-WAN 雙 ISP；關鍵系統 RTO ≤ 4hr、RPO ≤ 15min。` spec `RTO ≤ 4hr` · `6.0%`
6. **企業整合** / ENTERPRISE INTEGRATION — `打通 ISA-95 L3↔L4：ERP/PLM 接口、AMHS/MCS、LIMS、FMCS。` spec `ISA-95 L3↔L4` · `5.1%`

### `#compute` — 05 / AI COMPUTE  (spotlight, has settling drift)
Title `Blackwell Ultra 算力底座`. Lede: `3 × GB300 NVL72 構成 AI Fabric，HGX B300 承擔推理，Quantum-X800 全互聯 — 為 Digital Twin 與 Agentic RAG 提供決策算力。`
Two-column: left = narrative + spec list; right = a visual (GPU dot-grid of 248 dots, or
3 stacked rack bars). Spec rows (quiet lab-report mono line): `GB300 NVL72 × 3 — 216 GPU · ~132kW/柜 · 液冷`;
`HGX B300 × 4 — 32 GPU 推理`; `Quantum-X800 InfiniBand — 800Gb/s XDR`; `Spectrum-X — SN5600 800Gb/s`;
`儲存 — 4PB NVMe 數據湖`. Big number `248` `AI GPU`. Note `GB300 NVL72 必須液冷，機房約 400kW`.

### `#mes` — 06 / MES · FAB300  (compact band, `--alt`)
Title `Applied SmartFactory FAB300`. Lede: `高量產（HVM）晶圓廠 MES 旗艦，與設備自動化最深整合，適合先進製程量產爬坡。`
Module chips (7, `.tag` / small cards): `Dispatching / WIP 調度`, `Genealogy 譜系追溯`,
`APC · R2R + FDC`, `Recipe / RMS 配方管理`, `Scheduling / APS 排程`, `SPC / YMS 良率`,
`設備整合 EAP / SECS-GEM（GEM300）`. Side facts: `定位：實證 300K WSPM 龍頭` · `授權＋實施 ≈ USD 6.5M` · `EAP/SECS-GEM 8 工藝機台聯調`.

### `#delivery` — 07 / DELIVERY
Title `四階段交付，八道 Gate`. Lede: `CapEx 依建置區間分攤，逐道 Gate 釋放撥款；裝機期承接 GB300 主交付與 AI Fabric。`
Horizontal phased timeline; each phase a column with an animated proportional bar:
- `建廠期 M1–M6` — `RMB 8,318 萬` — `19.1%`
- `裝機期 M7–M15` — `RMB 23,829 萬` — `54.8%`
- `試產期 M16–M21` — `RMB 8,884 萬` — `20.4%`
- `量產期 M22+` — `RMB 2,428 萬` — `5.6%`
Footnote: `OpEx 年費（RMB 5,756 萬/年）自裝機期起算 · 8% 預備金已按階段分攤 · DR 於試產期完成首輪演練`.

### `#assurance` — 08 / ASSURANCE  (`--alt`)
Title `承諾守住業務連續性`. A row of big SLA commitment metrics + compliance badges.
Metrics: `RTO ≤ 4hr`, `RPO ≤ 15min`, `良率 ≥ 90%`, `SLO ≥ 95%`, `跨廠模板 100% 歸檔`.
Governance line: `8 道 Gate 對齊四階段 · RACI 每議題唯一 A · 風險三級升級 · DR 演練納入季度 Review`.
Compliance badges (`.pill`): `等保 2.0 三級` · `密評` · `IEC 62443` · `SEMI E187` · `ISA-95`.

### `#contact` — 09 / ENGAGE
Title `規劃您的智能晶圓廠`. Bold closing statement: `顯藝科技不是只交付硬體 — 而是拿授權、拿責任，並以異地備援守住業務連續性。`
Contact panel: email `hello@shinylogic.tech` (mailto), a `下載建置藍圖` ghost CTA (href="#"),
and a short static form is optional. Keep it a striking bordered CTA panel with leaf corner
and settling drift. Big mono coordinate flourish allowed.

### FOOTER (Foundation)
- Wordmark + descriptor; quick nav links; the deck-style technical line:
  `USD 1 = RMB 7.2（規劃匯率） · 金額單位 RMB 萬 · 報價基準 2026 Q2`
- Copyright: `© 2026 顯藝科技 ShinyLogic. All rights reserved.`
- Small print mono: `FAB300 REFERENCE BUILD · CapEx 一次性 RMB 4.35 億 · 3 年 TCO RMB 6.07 億`.

---

## 12. Source Facts Appendix  (for content-fidelity review — do not contradict)

- Company: 顯藝科技 / ShinyLogic. Domain: intelligent (smart) wafer fab IT/OT build.
- CapEx 一次性合計 **RMB 43,459 萬 ≈ 4.35 億**（含 8% 預備金 3,219 萬）.
- OpEx 授權/雲端/DR/SaaS **RMB 5,756 萬/年**；3 年 TCO **RMB 60,727 萬 ≈ 6.07 億**.
- AI 算力：**3 × GB300 NVL72（216 GPU）** + **4 × HGX B300（32 GPU 推理）** = **248 AI GPU**；單柜 GB300 ≈ USD 6.0M、≈132kW、需液冷。儲存 **4PB NVMe**.
- CapEx mix: AI 算力與儲存 15,682 萬 (36.1%)、平台軟體含 MES 8,856 (20.4%)、網絡 3,082 (7.1%)、DR 2,592 (6.0%)、資安 2,520 (5.8%)、機房/液冷/供電 2,304 (5.3%)、中控/視覺 936 (2.2%)、企業整合 2,232 (5.1%)、消防安防備件 1,116 (2.6%)、員工設備 920 (2.1%)、不可預見費 3,219 (7.4%).
- MES = **Applied SmartFactory FAB300（AMAT）**；License+實施 ≈ USD 6.5M（RMB 4,680 萬，計入平台軟體）；年維護 ≈ RMB 700 萬/年；實證 **300K WSPM** HVM 龍頭。模組：Dispatching/WIP、Genealogy、APC R2R+FDC、Recipe/RMS、Scheduling/APS、SPC/YMS、EAP/SECS-GEM(GEM300).
- 網絡：Quantum-X800 InfiniBand 144-port 800Gb/s XDR；Spectrum-X SN5600 800Gb/s；ConnectX-8 SuperNIC + LinkX.
- 資安：Claroty/Nozomi（OT）、NGFW、SIEM/SOAR、EDR/IAM/PAM、SOC 24×7；對齊 ISA-95 / IEC 62443 / SEMI E187.
- DR：溫備援跨區域、異步複製、SD-WAN 雙 ISP、warm standby + 2× HGX B300 關鍵推理；**RTO ≤ 4hr / RPO ≤ 15min**；DR 年運維 RMB 576 萬/年.
- 階段別 CapEx：建廠 M1–6 8,318 (19.1%)、裝機 M7–15 23,829 (54.8%)、試產 M16–21 8,884 (20.4%)、量產 M22+ 2,428 (5.6%)。OpEx 自裝機期起算.
- 治理：8 道 Gate、RACI（每議題唯一 A）、風險三級（紅/黃/綠）升級、DR 季度演練.
- 結果承諾：良率 ≥ 90% · SLO ≥ 95% · DR RTO ≤ 4hr · RPO ≤ 15min · 跨廠模板 100% 歸檔.
- 編制：92 人（建廠 9 → 裝機 45 → 試產 85 → 量產 92）。Contact email: hello@shinylogic.tech.
- 規劃匯率 USD 1 = RMB 7.2；金額單位 RMB 萬；報價基準 2026 Q2；發布 2026-06-10.

---

## 13. Deliverable & Tech

- Static, self-contained, no build step. Multi-page (see §14). Fonts from Google Fonts CDN.
- Vanilla JS only (no framework). Progressive enhancement: content readable with JS off
  (a `<noscript>` block neutralizes the `.reveal` initial state; default in-HTML text is 繁中).
- Must look intentional and polished at 1440 / 1024 / 390 widths.

---

## 14. Multi-page Site, i18n & Social  (v2 — extends, never contradicts §1-§12)

The site grows from one landing page into a 7-page corporate site sharing one chrome
(nav + footer), one stylesheet, one JS core, and a client-side i18n layer (繁中 / English /
简体中文). The Lithographic-Precision aesthetic (§3-§9) is unchanged and MUST stay identical
across every page — same tokens, fonts, motifs, motion, components. Consistency is a hard rule.

### 14.1 Pages (root-level files)
| File | Tab (繁) | Purpose |
|---|---|---|
| `index.html` | 首頁 (brand) | Existing landing page; retrofitted with the new chrome + i18n + social. |
| `about.html` | 關於 | Who we are: mission, positioning, governance/RACI as differentiator, delivery rhythm, milestones, values. |
| `solutions.html` | 解決方案 | Full-stack offering framed by the six layers + the 6 capability domains as solutions (what each solves + scope + outcome). |
| `technology.html` | 技術 | Engineering deep-dive: AI compute (GB300/Blackwell), network fabric, MES FAB300 modules, data & AI, security, resilience/DR, compliance. |
| `case-studies.html` | 案例 | FAB300 flagship deep-dive: scope, CapEx mix table, 4-phase delivery, outcomes/SLA, risk & compliance; cross-fab replication as roadmap. |
| `careers.html` | 招募 | Join us: the 92-person 4-phase hiring build, teams/roles, culture (拿授權、拿責任), representative open roles, apply CTA. |
| `contact.html` | 聯絡 | Accessible contact form (static), inquiry types, direct email, HQ coordinate panel. |

Each new page opens with the standard `.section-head` pattern (kicker + index + title + lede)
and a page-hero band, then 3-6 sections, then a closing CTA band reusing the home `#contact`
visual language. Pull all facts from §11-§12; never invent numbers. Keep new pages substantial
but not bloated (each ~4-6 screens).

### 14.2 Shared chrome — Nav
- Brand `SHINYLOGIC` + 顯藝科技 → links to `index.html`. Keep the top status strip and `[FAB300]` dot.
- **Page tabs** (replace the old in-page anchors): 關於 / 解決方案 / 技術 / 案例 / 招募 → their pages;
  the active page's tab gets `aria-current="page"` + a cyan underline/active style.
- **Language switcher**: a compact segmented control of 3 buttons — `繁` / `EN` / `简` — with
  `aria-pressed` reflecting the active locale; min 44×44px touch target; visible focus ring.
- CTA button `啟動建置規劃` → `contact.html`.
- Mobile (≤768): hamburger reveals tabs + language switcher + CTA in the panel (existing toggle pattern).
- The nav markup MUST be byte-identical across all pages except the active-tab marker. Same for footer.

### 14.3 Shared chrome — Footer
- Keep the existing footer, and add a sitemap row linking all 6 pages (grouped, e.g. 公司 / 能力 / 聯絡)
  plus the language switcher mirror. Identical across pages.

### 14.4 i18n contract  (繁中 default · English · 简体中文)
- Two JS files, loaded `defer` on every page, dictionary BEFORE runtime:
  `i18n-dict.js` (generated — defines `window.I18N = { "zh-Hant": {...}, "en": {...}, "zh-Hans": {...} }`)
  then `i18n.js` (hand-written runtime).
- Mark translatable text with `data-i18n="ns.key"`. The element's in-HTML text is the **繁中**
  value and the no-JS fallback. For attributes use `data-i18n-attr="aria-label:ns.key;placeholder:ns.key2"`.
  For markup-bearing strings use `data-i18n-html="ns.key"`.
- Runtime (`i18n.js`): on DOM ready read `localStorage['sl-lang']` (default `zh-Hant`); apply the
  dictionary to every `[data-i18n]/[data-i18n-attr]/[data-i18n-html]`; set `document.documentElement.lang`
  to `zh-Hant`/`en`/`zh-Hans`; wire the switcher buttons (set + persist + re-apply, no reload, update
  `aria-pressed`). Missing key → fall back to `zh-Hant` then to existing DOM text (never blank). Guard for
  absent `window.I18N`.
- **Key namespaces**: `nav.*`, `foot.*`, `cta.*`, `lang.*`, `common.*` (shared, owned by Foundation),
  and one per page: `home.*`, `about.*`, `sol.*`, `tech.*`, `case.*`, `careers.*`, `contact.*`.
- **Never translate** product/standard names or numerals/units shown as data (keep verbatim in all 3
  locales): NVIDIA GB300 NVL72, HGX B300, Blackwell Ultra, Quantum-X800, Spectrum-X, ConnectX-8, Applied
  SmartFactory FAB300, AVEVA PI, Omniverse, Claroty, Nozomi, SECS-GEM, GEM300, OPC UA, IEC 62443, SEMI
  E187, ISA-95, 等保 2.0 (en: "China MLPS 2.0 Level 3"), RTO/RPO/SLO/WSPM/PUE, GPU counts, percentages,
  M-prefixed months, dates.
- **Trilingual figure table** (use these EXACT renderings so all pages/locales agree):
  | concept | zh-Hant | en | zh-Hans |
  |---|---|---|---|
  | CapEx 一次性 | RMB 4.35 億 | RMB 435M | RMB 4.35 亿 |
  | 3 年 TCO | RMB 6.07 億 | RMB 607M | RMB 6.07 亿 |
  | OpEx 年費 | RMB 5,756 萬/年 | RMB 57.56M/yr | RMB 5,756 万/年 |
  | 階段別 (萬) | 8,318 / 23,829 / 8,884 / 2,428 萬 | RMB 83.18M / 238.29M / 88.84M / 24.28M | 8,318 / 23,829 / 8,884 / 2,428 万 |
  | 數據湖 | 4PB | 4PB | 4PB |
  | AI GPU | 248（216 GB300 + 32 HGX B300） | 248 (216 GB300 + 32 HGX B300) | 248（216 GB300 + 32 HGX B300） |
  Percentages (36.1% etc.), RTO ≤ 4hr, RPO ≤ 15min, 良率/yield ≥ 90%, SLO ≥ 95%, 300K WSPM,
  92 人/staff, 8 Gate are identical across locales (translate only the surrounding label words).
- English voice: precise, engineering-grade, no hype (mirror §2). 简体中文: faithful conversion of the
  繁中 copy (the original deck was Simplified — match its register).

### 14.5 Social — Open Graph, Twitter, favicon  (every page)
- `<head>` of each page includes, with per-page `og:title`/`og:description`/`og:url`:
  `og:type=website`, `og:site_name=顯藝科技 ShinyLogic`, `og:image=og-image.png` (+`og:image:width=1200`,
  `og:image:height=630`, `og:image:alt`), `og:locale=zh_Hant` + `og:locale:alternate` en_US & zh_Hans;
  `twitter:card=summary_large_image` + `twitter:title/description/image`. Also `<meta name="theme-color"
  content="#FAF6F0">` and a canonical `<link rel="canonical">`.
- **favicon**: `favicon.svg` — a sprout/leaf glyph or SL monogram in clay (#E07A5F) on cream (#FAF6F0). Link `<link rel="icon" href="favicon.svg"
  type="image/svg+xml">` (+ a `<link rel="mask-icon">` is optional). No emoji.
- **OG image** `og-image.png` (1200×630): generated by rendering `og-card.html` (a self-contained card
  in the brand language — cream + warm clay, fab-process motif (diffraction rings / drifting blobs), SHINYLOGIC wordmark, tagline 把設備數據，鍛造成可決策的智能。,
  a few key metrics) and screenshotting it. Foundation builds `og-card.html`; the OG PNG is produced
  during verification.

### 14.6 UX rules to honor (from ui-ux-pro-max)
- SVG icons only (no emoji); consistent 24px viewBox. Visible `:focus-visible` rings everywhere.
- Touch targets ≥ 44px (nav tabs, lang buttons, form controls). Body ≥ 16px on mobile.
- Form: every input has an associated `<label for>`; inquiry type is a real `<select>`; clear error/help
  text; submit is a `<button type="submit">` (on submit, POSTs to a no-self-hosted-backend serverless endpoint — Google Apps Script → Google Sheet + email, see apps-script/SETUP.md; inline confirmation on success, inline error on failure; falls back to demo mode with no save when data-endpoint is unset).
- `cursor:pointer` on all interactive elements; transitions 150-300ms; respect `prefers-reduced-motion`.
- Cross-page consistency: identical nav/footer, same max-width, same active-state convention.

### 14.7 File structure (v2)
```
index.html about.html solutions.html technology.html case-studies.html careers.html contact.html
styles.css        (shared, extended per-page with scoped blocks)
script.js         (shared core: reveal, counters, nav, accordion, dot-grid, etc.)
i18n-dict.js      (generated: window.I18N for all 3 locales)
i18n.js           (runtime: applies dict, wires switcher, persists)
favicon.svg  og-image.png  og-card.html
DESIGN.md
```
Every page links, in `<head>`: `styles.css`; and deferred: `i18n-dict.js`, `i18n.js`, `script.js`
(dict before runtime before core). Page-scoped CSS uses a `.p-<page>` body/root class prefix.

### 14.8 Positioning history (the go-to-market truth changed — read this)
The site's positioning was revised by the founder mid-build. Current truth:
- **DIRECT-TO-FAB (current).** The customer is the **晶圓廠 (wafer fab)** itself, addressed directly;
  ShinyLogic delivers and owns the fab's IT/OT+AI full-stack build/integration/operations. Competitor =
  the fab's in-house build. CTA = **預約諮詢 / Book a consultation** → contact.html. Nav = 5 tabs:
  關於 / 解決方案 / 技術 / **方法論** / 招募 (案例 was renamed 方法論; the rename stays).
- **REMOVED — do not reintroduce:** the 合作模式 / Partners page (`partners.html`), the 成為交付夥伴 /
  "delivery partner" CTA, and all white-label / 分包 / subcontract / 「你的品牌、你的主約」 / 設備商·EPC-as-buyer
  framing. (Short-lived Stage-2 "B2B2B white-label partner for 設備商/EPC" experiment, since reverted.)
- **Pending real data (never fabricate):** hidden about leadership block (#about-leadership, display:none —
  needs founder's real fab résumé); company-domain email + legal entity (Gmail kept until provided).
