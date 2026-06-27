# design-sync NOTES — ShinyLogic `ui/` (Soft Organic Clay)

Repo-specific gotchas for future syncs. Package shape, `pkg: "ui"`, `globalName: "ShinyLogicUI"`.

## Build / pipeline

- The `ui/` package is a standalone sub-package (own `node_modules`, built with `pnpm -C ui build` → `ui/dist/index.es.js` + `dist/style.css`). Converter is pointed at it with `--node-modules ui/node_modules --entry ./ui/dist/index.es.js`.
- `ui/` imports the site's shared CSS in place (`ui/src/styles/index.css` → `../../../src/styles/*.css`), so the components inherit whatever the live site's design tokens are. After a site restyle, **rebuild `ui/` before the converter** so `dist/style.css` is current.
- The component CSS (`_ds_bundle.css`) ships the full Clay token set (122 custom props) + extracted composite CSS. Reachable from `styles.css`'s `@import` closure — verified.

## Known render warns (triaged legitimate — re-syncs check against this list)

- **Nav** `[RENDER_THIN]`: the nav is a `position: fixed` floating pill, so its measured document height is 0. The authored preview (`previews/Nav.tsx`) wraps each cell in a `transform: translateZ(0)` frame to give the fixed element a containing block — it renders in-card correctly; the warn is the fixed-position measurement, benign.
- **ThemeToggle** `[RENDER_THIN]`: icon-only button (moon/sun SVG spans, CSS shows one per `data-theme`). No text by design — the moon icon renders in the default (light) preview context. Benign.

## Fonts

- `[FONT_REMOTE]` (Fraunces / Nunito Sans / Spline Sans Mono / Varela Round) — the Clay brand fonts load via a Google Fonts `@import` at the top of `ui/src/styles/index.css`. This is the only place the fonts ship; **if the import is stale the components render in fallback fonts** (this happened once — the import was left on the old Saira/IBM Plex Mono set from before the redesign and was corrected to the Clay set; keep it in sync with the site's `<head>` font link).

## Preview-environment limitations (not component defects)

- **Brand** / **Nav** logo `<img src="/logo.png">` does not resolve in the capture sandbox (no static-asset server at the bundle root), so the wordmark shows a broken-image box before "SHINYLOGIC". The wordmark text (SHINY + clay LOGIC + 顯藝科技 + FAB300) renders correctly and is the recognizable brand mark. In a real design built with the DS, the host serves `/logo.*`. Documented; not worth faking with a data-URI (would diverge from real usage).
- **TickFrame** renders four corner `.tick` spans that are `display:none` in the Clay design (the asymmetric leaf corner, `--r-leaf`, replaced the old reticle ticks). It is now an internal helper with no standalone visual; its preview shows it inside a real leaf-corner card to demonstrate the gesture.

## Re-sync risks (what can silently go stale)

- The font `@import` in `ui/src/styles/index.css` is hand-maintained and must track the site's brand fonts — the highest-impact silent-failure path (wrong fonts everywhere).
- All preview content is real fab/CJK content ported from `src/pages/*.html`; if the site copy/specs change materially, the preview cards may show outdated figures (cosmetic, not broken).
- The bundle inherits the live `src/styles/*.css` tokens — a future site restyle changes the components' look automatically; rebuild `ui/` + re-run the converter to refresh.
