# DESIGN.md — ShinyLogic / 顯藝科技 (Soft Organic Clay)

> **Status:** Fusion-synthesized draft, pending user approval to replace the current `DESIGN.md`.
> Synthesized by Opus 4.8 (judge) from a 5-model blind panel (Opus 4.8 + DeepSeek V4 Pro, Qwen3.7 Plus, MiMo v2.5 Pro, MiniMax M3; GLM 5.2 absent). All contrast ratios were computed with the WCAG 2.1 sRGB relative-luminance formula and independently re-verified.

## Aesthetic Manifesto

> **Soft Organic Clay** — *Hand-formed, never soft-headed.* The calm warmth of pressed clay wrapped around the exacting spine of fab-grade engineering.

This is the deliberate, total inverse of the retired **"Lithographic Precision"** (graphite/cyan, condensed industrial sans + mono telemetry, 4px reticle corners, cold hairlines, dense asymmetry). Every axis flips — *coherently*. Authority no longer comes from coldness and density; it comes from **a deep espresso-ink anchor, editorial restraint, precise data, and generous air** beneath a warm skin.

**Why organic is the right language for a wafer fab (the credibility keystone).** The soft forms are not decoration borrowed from a wellness app — they are the *actual shapes of the physics we build around*. Epitaxial growth is crystalline accretion; dopant diffusion is a soft gradient; photolithography is light interference; CMP is planarization to a smoothed stone; ion implantation is particle scatter. Our motifs map 1:1 onto these processes (§6). That mapping is what earns "clay" its seriousness: the warmth is a skin; the structure underneath is semiconductor process control.

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

---

## 1. Color Tokens

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

  /* ---------- ACCENT RAMPS (mimo-style 50→900; *-700/800 are the text-safe roles) ---------- */
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

> **Surface-area discipline (the credibility lever, unanimous across the panel):** ~75–85% cream + ink, ~10–15% sage/sand neutrals, ≤10% clay/sun. Accents *punctuate*; they never flood. This is what separates "fab-grade clay" from "kids app."

---

## 2. Typography

Bilingual by design: a **soft serif** Latin display matched by a **serif** CJK display; a **rounded** Latin body matched by a humanist CJK body — so zh / en read as one voice.

| Role | Latin | CJK | Notes |
|---|---|---|---|
| Display / headlines | **Fraunces** (`opsz,wght,SOFT,WONK`) | **Noto Serif TC / SC** 600–900 | editorial soft-serif authority |
| Body / UI | **Nunito Sans** (variable 200–900, rounded) | **Noto Sans TC / SC** 400–700 | |
| Wordmark only | **Varela Round** (single 400) | — | logotype only — cannot carry hierarchy |
| Data / code | **Spline Sans Mono** (rounded mono) | — | numbers via tabular figures; mono for config/lab-report lines |

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

**Type scale** (fluid `clamp`, 16px root): `--t-hero` Fraunces 600 `clamp(2.6rem,6vw,4.5rem)`/1.05/-0.02em · `--t-h1` Fraunces 600 `clamp(2rem,4vw,3rem)`/1.1 · `--t-h2` Fraunces 600 `clamp(1.6rem,3vw,2.25rem)`/1.15 · `--t-h3` **Nunito 800** 22px/1.25 (rounded sans at component scale) · `--t-eyebrow` Nunito 700 13px/0.12em UPPERCASE, color `--clay-ink` · `--t-lead` Nunito 400 `clamp(1.125rem,1.6vw,1.25rem)`/1.7 `--ink-2` · `--t-body` 16px/1.7 · `--t-small` 14px/1.6 · `--t-metric` Nunito 800 + `--tnum` `clamp(2.5rem,5vw,3.75rem)`/1.0 · `--t-button` Nunito 700 16px.

**CJK rules:** headlines → Noto Serif TC/SC 700/900; body → Noto Sans TC/SC 400/500; CJK `line-height:1.85`, `letter-spacing:0.02em`; never apply Latin negative tracking to CJK runs. Latin measure `--measure: 66ch`, looser for CJK.

**CJK performance (graft — deepseek, corroborated by qwen+mimo):** full CJK weights are 15–60 MB. **Load only ONE CJK locale per page** (the page's `lang`), and subset via `unicode-range` / self-host (Fontsource) rather than pulling all three locales' full faces. This is a hard perf rule for the restyle.

---

## 3. Spacing, Container & Rhythm

```css
:root {
  --s-1:4px; --s-2:8px; --s-3:12px; --s-4:16px; --s-5:24px;
  --s-6:32px; --s-7:48px; --s-8:64px; --s-9:96px; --s-10:128px; --s-11:160px;
  --container:1200px; --container-text:720px;
  --gutter: clamp(20px,5vw,40px); --section-y: clamp(80px,11vw,160px); --card-pad: clamp(24px,3vw,36px);
}
```

**Layout law — "Structured Softness" (graft — qwen):** softness is *zoned*, not uniform. **Structural chrome (nav, footer, data tables, form scaffolding) stays tighter and more rigid** (smaller radii, aligned columns, precise gutters); **expressive surfaces (hero, feature cards, accordions, hover states) go fully organic** (24–40px radii, leaf corners, float). Content is centered in `--container`; sections alternate `canvas → sand → tinted panel → canvas`; cards *float* (shadow + tint), not boxes-touching density.

**Counter-principle — density = authority too.** Generous air carries ~75% of the surface, **but** the data itself is dense and exact: tabular figures, aligned columns, tight metric blocks. Air frames rigor; it does not replace it. (This is the answer to "soft = unserious.")

---

## 4. Shape Language

```css
:root {
  --r-xs:8px;  --r-sm:12px; --r-md:16px; --r-lg:24px; --r-xl:32px; --r-2xl:40px; --r-pill:999px;
  /* SIGNATURE: asymmetric leaf/petal corner — the new "reticle tick" */
  --r-leaf:     32px 32px 32px 8px;   /* default leaf */
  --r-leaf-alt: 40px 8px 40px 8px;    /* petal — hero/brand moments */
  --r-blob:     60% 40% 30% 70% / 60% 30% 70% 40%; /* living blob (graft — mimo) */

  /* Soft warm double-shadow + elevation scale (graft — minimax token roles) */
  --elev-1: 0 1px 2px rgb(var(--shadow-rgb)/.06), 0 2px 6px rgb(var(--shadow-rgb)/.05);
  --elev-2: 0 2px 4px rgb(var(--shadow-rgb)/.05), 0 14px 30px -10px rgb(var(--shadow-rgb)/.14); /* cards */
  --elev-3: 0 4px 8px rgb(var(--shadow-rgb)/.06), 0 28px 56px -14px rgb(var(--shadow-rgb)/.20); /* hover/float */
  --shadow-clay: 0 20px 44px -14px rgb(var(--shadow-rgb)/.22), inset 0 1px 0 rgb(255 255 255/.65); /* pressed-clay, hero only */
  --shadow-focus: 0 0 0 3px rgb(176 73 42/.35);
}
```

**Corner treatment:** uniform large radii on expressive surfaces; **exactly one leaf corner per major composition** (hero, key feature, contact panel) — the brand's recognizable gesture, never random. **Border treatment:** mostly **borderless** — separation via shadow + background tint. Lines only when needed: `--border` (decorative), `--border-strong` (card edge), `--border-field` 1.5px (inputs, meets 3:1). Focus = `--shadow-focus` + 2px offset, never removed.

---

## 5. Motion

Inverts snappy/pulse → **long, settling, organic** — everything decelerates to rest, like clay relaxing into shape.

```css
:root {
  --ease-soft:   cubic-bezier(0.22,1,0.36,1);   /* default settle (panel-unanimous) */
  --ease-inout:  cubic-bezier(0.65,0,0.35,1);
  --ease-spring: cubic-bezier(0.34,1.28,0.64,1);/* slight overshoot — ONE moment only */
  --t-fast:200ms; --t-base:360ms; --t-slow:600ms; --t-amble:900ms; --t-drift:18s;
}
```

- **Scroll reveal:** fade + rise 16px + **blur-dissolve** `filter: blur(4px)→0` over `--t-slow` `--ease-soft`, staggered 80ms (graft — deepseek).
- **Stat numbers:** slow count-up 1200ms `ease-out` + soft fade; tabular figures prevent digit jump.
- **Ambient:** clay/sage/sun blobs drift + morph (`--r-blob` keyframe, translate/scale 1→1.03) over `--t-drift`; key cards "breathe" subtly. Replaces the cyan pulse.
- **Hover:** cards lift `translateY(-4px)` + `--elev-3`; buttons lift 2px.
- `--ease-spring` rationed to a single beat (nav logo / CTA press).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables drift/breathing/parallax + count-ups (show final); keep only ≤200ms opacity fades.

---

## 6. Signature Motifs — the fab-process mapping (graft — qwen; the credibility keystone)

Each organic motif is the visual of a real fab process, so the softness reads as domain fluency, not whimsy:

| Retired motif | New carrier | Fab process it encodes |
|---|---|---|
| Wafer / grid | **Drifting "pebble" blobs** (clay/sage/sun, 8–14% opacity, superellipse) | CMP planarization → smoothed stone; dopant diffusion → soft gradient |
| Reticle corner ticks | **Asymmetric leaf corner** `--r-leaf` + small hand-drawn sprout glyph (section marker) | crystalline / epitaxial growth |
| Mono telemetry | **Tabular-figure data** (Nunito `--tnum`) + a quiet mono "lab-report" line | real numbers, warm voice |
| Blueprint grid | **Faint geological strata + light-diffraction rings** (0.5px, ≤6% opacity sage) | epitaxial layering; photolithography interference |
| Hard grain | **Subtle warm paper grain ≤3%** (optional — 3/4 panelists drop it; keep *very* faint or off) | tactile surface, not grunge |

Plus **river-delta branching paths** (etching) and **particle-scatter fields** (ion implantation) as section dividers / decorative SVG. Brand recognition now lives in: the leaf corner, drifting blobs, the sprout marker, puffy warm-shadow cards, and Fraunces headlines.

---

## 7. Iconography

Line icons, **1.75–2px stroke, fully rounded caps + joins**, 24px grid (Lucide w/ rounded joins, or Phosphor "regular") — roundness matches the type. Duotone option: `--ink` stroke + 12% clay/sage tint fill. Brand glyph set: hand-drawn sprout / leaf / droplet / pebble for section markers + empty states. **No** sharp wireframe glyphs, **no** thin cold 1px icons, **no emoji** anywhere.

---

## 8. Component Patterns

**Button — primary (signature "Clay Sunset"):** `--clay` fill + **`--ink` label** (5.34:1 AA), Nunito 700, `--r-md`, padding `14px 26px`, `--elev-2`. Hover: `translateY(-2px)` + `--elev-3` (lift — *don't* darken the fill under dark text). Focus: `--shadow-focus` + 2px offset.
**Button — high-emphasis / on-dark variant** (panel's preferred CTA, offered alongside): `--clay-deep` (#8A3A21) fill + cream `--ink-inverse` label (~7.2:1 AAA). Use on espresso sections or where a denser CTA is wanted.
**Button — ghost:** transparent, 1.5px `--clay-ink` border, `--ink` label, `--r-pill`; hover → `--clay-100` fill. **Text link:** `--clay-ink`, **underlined** (never color-only).

**Card:** `--surface`, `--r-lg`, `--card-pad`, `--elev-2`. Interactive hover: lift -4px + `--elev-3`. **Feature/hero card:** `--r-xl` + one `--r-leaf` corner + `--shadow-clay`. **Quiet credibility footer (graft — minimax):** a single `--font-mono` `--ink-3` line at the card bottom — e.g. `SLO 99.95% · LOG 04:21Z · REF FAB300` — the "lab-report voice" that keeps the warm card honest.

**Panel (section block):** `--bg-sunken` or a tint, `--r-2xl`, floats on canvas with `--gutter` margin, generous interior padding.

**Nav (structural → tighter):** floating pill bar, `--surface` at `rgba(cream,0.85)` + `backdrop-filter: blur(12px)`, `--r-pill`, `--elev-2`, inset 16px from top. Wordmark in `--font-mark`. Active link = `--clay-ink` on `--clay-100` pill. Mobile: full-screen cream sheet, big rounded links, `--ease-soft` slide.

**Accordion:** each item a `--r-md` `--surface` card, 12px gap. Header `--ink` 700 + rounded chevron rotating 180° over `--t-base`. Open item: `--clay-100` tint + 4px `--clay` left edge.

**Metric / stat:** `--t-metric` number in `--ink` or `--clay-ink` with `--tnum`; label below in `--ink-2` `--t-eyebrow`. In a `--r-lg` surface card. Slow count-up; reduced-motion shows final.

**Tag / pill:** `--r-pill`, `6px 14px`, tint bg + matching deep text (e.g. *Operational* `--success-tint` + `--success`; *Critical* `--danger-tint` + `--danger`) — always deep text on tint (AAA).

**Form field (structural → tighter):** `--surface`, `--r-sm`, 1.5px `--border-field` (3:1), `--ink` text, `--ink-3` placeholder. Focus: border → `--focus-ring` + `--shadow-focus`. Error: `--danger` border + icon + text (not color-only).

---

## 9. Do / Don't

**Do** — anchor every layout in `--ink` espresso; let cream + air carry ~75–85%. Put **dark ink on clay/sage/sun fills**; cream text only on `--surface-ink`. Keep data dense and exact under the soft skin (tabular figures, aligned columns, the mono lab-report line). Use **one** leaf corner and **≤3 accent hues** per viewport. Make motion long and settling; ration the spring to one beat. Zone softness (structural chrome tighter, expressive surfaces organic). Tie each motif to its fab process.

**Don't** — no pure `#FFFFFF` page bg, no pure-black text (everything warm). **No white text on clay/sage** (2.95 / 2.72 FAIL). No cold/navy ink or blue focus rings (that was the *old* system). No candy/neon pastels, kids-app gradients, rainbow chips, glossy 3D bubbles. No Varela Round below the wordmark (single weight — can't build hierarchy). No fast snap reveals or pulse glows; no bouncy spring everywhere. No sharp 4px corners, reticle ticks, cyan, or condensed industrial sans. No emoji; no thin cold technical glyphs.

---

## Verification & honest flags

- **Contrast:** all text/UI tokens computed with the WCAG sRGB formula and re-verified by an independent pass; the two failing pairings (white-on-clay 2.95, white-on-sage 2.72) are called out as prohibited. Rejected from the panel: a primary button using white-on-`#C4613A` (4.1:1, fails) and a cold navy ink anchor (off-brief).
- **Fonts:** Fraunces (`wght/opsz/SOFT/WONK`), Nunito Sans (variable, axes `opsz,wght` only), Noto Serif/Sans TC, Varela Round (single weight 400), Spline Sans Mono — all verified on Google Fonts.
- **Open flags to tune during the restyle:** (1) **Rounded Traditional-Chinese display fonts are scarce on Google Fonts** — Noto Sans/Serif TC is the production-safe choice; a rounder zh display would need self-hosting (jf-jinxuan / GenJyuu class). (2) The **Fraunces serif display is the single boldest bet** — all four other panelists went all-rounded-sans; keep it but treat as the one element to A/B on real screens. (3) Exact `clamp` breakpoints and `SOFT`/`opsz` values are starting points to tune. (4) Keep paper grain ≤3% or drop it (panel split).
