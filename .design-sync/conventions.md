# ShinyLogic — Soft Organic Clay

A warm, light, rounded design system for a B2B semiconductor-fab infrastructure brand. Hand-formed surfaces, exacting data underneath.

## Setup & theme

No provider or wrapper is required — components style themselves from the bound `styles.css`. There are **two themes**, switched by a `data-theme` attribute on a root ancestor:

- default / `data-theme="light"` → **Clay Light** (warm cream `#FAF6F0`)
- `data-theme="dark"` → **Espresso Clay** (warm-dark `#1C1611`)

Set it once high up: `<div data-theme="dark"> … </div>`. Every token below resolves per theme automatically.

Components are **i18n-agnostic**: all visible text *and* aria labels come from props — pass real strings (the system carries no built-in translation). The brand is bilingual zh-Hant / en; content is Traditional Chinese with English mono eyebrows.

## Styling idiom — CSS variables, NOT utility classes or style-bag props

Build UI from the **real components**, and for your own layout glue use the **CSS custom properties** on `:root`. There are no Tailwind-style utilities and no `sx`/`css` props — do not invent either.

- **Color** — surfaces `var(--bg-canvas)` (page), `var(--bg-sunken)` (sand wells), `var(--surface)` (cards), `var(--surface-ink)` (espresso inverted section, e.g. closing CTA). Text `var(--ink)` / `var(--ink-2)` / `var(--ink-3)`. Accents are **fill vs text**: `var(--clay)` fill / `var(--clay-ink)` text+links, `var(--sage)`/`var(--sage-ink)`, `var(--sun)`/`var(--sun-ink)`. **Never white text on clay/sage** (fails contrast — fills always take dark `var(--ink)` labels).
- **Type** — `var(--font-display)` (Fraunces soft-serif, headings), `var(--font-body)` (Nunito Sans, body/UI), `var(--font-mono)` (Spline Sans Mono, data/lab-report lines), `var(--font-mark)` (Varela Round, wordmark only). Eyebrows = uppercase tracked `var(--font-body)` in `var(--clay-ink)`.
- **Shape & space** — radii `var(--r-sm|--r-md|--r-lg|--r-xl|--r-2xl|--r-pill)` plus the signature asymmetric `var(--r-leaf)` corner (one per major composition). Spacing scale `var(--s-1)`…`var(--s-10)`. Depth `var(--elev-1|--elev-2|--elev-3)` + `var(--shadow-clay)` (warm double-shadows, never grey). Motion `var(--ease-soft)` with `var(--t-fast|--t-base|--t-slow)`.

An accent phrase inside a heading uses `<span className="accent">…</span>` (clay-ink).

## Where the truth lives

Read the bound **`styles.css` and its `@import`ed `_ds_bundle.css`** (the full 122-token system + component styles) before styling, and each component's **`<Name>.prompt.md`** + **`<Name>.d.ts`** for its API and usage. The components are the real shipped `ui/` library; compose them, don't reimplement them.

## Idiomatic build snippet

```jsx
<section data-theme="light" style={{ background: 'var(--bg-canvas)', padding: 'var(--s-9) var(--s-6)' }}>
  <SectionHeader
    kicker="04 · CAPABILITIES"
    title={<>從矽到決策的<span className="accent">全棧能力</span></>}
    lede="六層技術堆疊，從設備數據到 AI 決策閉環。"
    index="04"
  />
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s-5)', marginTop: 'var(--s-7)' }}>
    <CapabilityCard
      icon={<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="5" width="18" height="18" rx="1.5" /></svg>}
      name="AI 算力與儲存" en="AI COMPUTE & STORAGE"
      blurb="GB300 NVL72 + HGX B300，承接設備高頻數據與 Digital Twin 資產。"
      spec="GB300 NVL72 · NVMe Lake"
    />
  </div>
  <div style={{ marginTop: 'var(--s-7)' }}>
    <Button href="contact.html" arrow="→">預約諮詢</Button>
  </div>
</section>
```
