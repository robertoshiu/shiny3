# ShinyLogic `ui/` Component Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone React component library (`ui/`) that wraps the existing ShinyLogic site's BEM/CSS design system as ~17 faithful components, so `/design-sync` can bundle it for claude.ai/design.

**Architecture:** Thin React (`.tsx`) wrappers that emit the *exact* existing BEM markup and class names. Primitive styling comes from importing the site's shared CSS layer verbatim; genuinely page-scoped composite CSS is extracted into one `composites.css`. The package builds with Vite library mode to an ESM entry (`dist/index.es.js`) + pinned `dist/style.css` + a single bundled `dist/index.d.ts`; design-sync re-bundles that entry itself. The live site is untouched except for two root lint-config exclusions.

**Tech Stack:** React 18, TypeScript, Vite (library mode) + `@vitejs/plugin-react` + `vite-plugin-dts`, Vitest + `@testing-library/react` + jsdom.

**Source of truth:** This plan was derived from `docs/superpowers/specs/2026-06-27-shinylogic-ui-component-library-design.md` and verified blueprints of the real markup/CSS/behavior. Every component's markup mirrors `src/pages/*.html`; do not "improve" it.

---

## Conventions for every component task

- One component per directory: `ui/src/components/<group>/<Name>/<Name>.tsx` + co-located `<Name>.test.tsx`.
- Each component exports a named `function <Name>` and an `export interface <Name>Props`.
- Class names are joined with the `cx()` helper (Task 2). Never reorder or rename the BEM classes.
- Components are **i18n-agnostic**: all text and all aria strings arrive via props; no `data-i18n`, no `window.I18N`, no hard-coded Chinese aria-labels.
- **Sandbox/SSR contract:** no `document`/`window`/`localStorage`/`matchMedia`/`IntersectionObserver` access during render or at module scope — only inside `useEffect` or event handlers, always feature-guarded. No side effects on mount.
- Tests run in jsdom. Run a single test file with `pnpm -C ui exec vitest run src/components/<group>/<Name>/<Name>.test.tsx`.
- Commit after each component passes.

---

## Task 1: Scaffold the `ui/` package

**Files:**
- Create: `ui/package.json`
- Create: `ui/tsconfig.json`
- Create: `ui/vite.config.ts`
- Create: `ui/vitest.setup.ts`
- Create: `ui/postcss.config.cjs`
- Create: `ui/src/index.ts`
- Modify: `.eslintrc.cjs:16`
- Modify: `.prettierignore`

- [ ] **Step 1: Create `ui/package.json`**

```json
{
  "name": "ui",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "types": "dist/index.d.ts",
  "typings": "dist/index.d.ts",
  "module": "./dist/index.es.js",
  "exports": {
    ".": {
      "import": "./dist/index.es.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "vite": "^5.4.21",
    "@vitejs/plugin-react": "^4.3.4",
    "vite-plugin-dts": "^4.3.0",
    "@microsoft/api-extractor": "^7.47.11",
    "typescript": "^5.6.3",
    "vitest": "^2.1.8",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.3",
    "jsdom": "^25.0.1"
  }
}
```

> Why `types`/`typings`: design-sync's package-shape converter discovers components by reading the **single** `.d.ts` resolved from the top-level `types`/`typings` field. Without it, it finds zero components and silently ships a tokens-only DS.

- [ ] **Step 2: Create `ui/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "declaration": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "noEmit": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create `ui/vite.config.ts`**

```ts
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.es.js',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

> Tests assert class names, not computed styles, so CSS processing is left at the Vitest default (CSS imports are no-ops in tests) — this avoids processing the cross-package CSS closure + remote font `@import` in jsdom. The real `vite build` still bundles CSS normally. `cssFileName: 'style'` pins the CSS asset to `dist/style.css` (Vite 5.4+) so design-sync's fixed-filename probe finds it. `rollupTypes: true` emits one self-contained `dist/index.d.ts` with every component's types inlined — the most robust shape for the converter's single-file discovery. `external` keeps React out of our bundle; design-sync provides React in its own re-bundle.

- [ ] **Step 4: Create `ui/vitest.setup.ts`**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 5: Create `ui/postcss.config.cjs`** (parity with the site's pipeline)

```js
module.exports = {
  plugins: {
    'postcss-nested': {},
    'postcss-preset-env': { stage: 2 },
  },
};
```

> The shared CSS is effectively flat, so this is for exact-parity insurance (autoprefixer prefixes). It also stops Vite from walking up to the repo-root config ambiguously.

- [ ] **Step 6: Create the placeholder barrel `ui/src/index.ts`**

```ts
export {};
```

- [ ] **Step 7: Exclude `ui/` from the site's lint gate**

In `.eslintrc.cjs`, change line 16 from:

```js
  ignorePatterns: ['dist', 'node_modules', 'playwright-report', 'test-results', 'apps-script'],
```

to:

```js
  ignorePatterns: ['dist', 'node_modules', 'playwright-report', 'test-results', 'apps-script', 'ui'],
```

Append a line to `.prettierignore`:

```
ui/
```

> Required: the root `eslint .` / `prettier --check .` otherwise descend into `ui/**/*.tsx` and red-light the site's CI (the root espree config has no TS/JSX). `dist/` and `node_modules/` are already gitignored at any depth, so `ui/dist` and `ui/node_modules` need no `.gitignore` change.

- [ ] **Step 8: Install dependencies (isolated)**

Run: `pnpm -C ui install`
Expected: a `ui/node_modules` and `ui/pnpm-lock.yaml` are created; the **root** `pnpm-lock.yaml` is unchanged (standalone package — verify `git status` shows no root lockfile change).

- [ ] **Step 9: Verify the skeleton builds**

Run: `pnpm -C ui build`
Expected: PASS — emits `ui/dist/index.es.js` and `ui/dist/index.d.ts` (CSS appears once Task 3 adds the import).

- [ ] **Step 10: Verify the site is still green**

Run: `pnpm build && pnpm lint`
Expected: PASS — no `src/` change; lint passes with `ui/` excluded.

- [ ] **Step 11: Commit**

```bash
git add ui/package.json ui/tsconfig.json ui/vite.config.ts ui/vitest.setup.ts ui/postcss.config.cjs ui/src/index.ts .eslintrc.cjs .prettierignore
git commit -m "feat(ui): scaffold standalone React component-library package"
```

---

## Task 2: `cx` class-name helper

**Files:**
- Create: `ui/src/lib/cx.ts`
- Test: `ui/src/lib/cx.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
  it('joins truthy class names and drops falsy ones', () => {
    expect(cx('btn', false, 'btn--primary', null, undefined, 'nav__cta')).toBe(
      'btn btn--primary nav__cta',
    );
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm -C ui exec vitest run src/lib/cx.test.ts`
Expected: FAIL — `Failed to resolve import './cx'`.

- [ ] **Step 3: Implement**

```ts
export type ClassValue = string | false | null | undefined;

export function cx(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(' ');
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `pnpm -C ui exec vitest run src/lib/cx.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/lib/cx.ts ui/src/lib/cx.test.ts
git commit -m "feat(ui): add cx class-name helper"
```

---

## Task 3: CSS layer (`index.css` + `composites.css`)

**Files:**
- Create: `ui/src/styles/composites.css`
- Create: `ui/src/styles/index.css`
- Modify: `ui/src/index.ts`

- [ ] **Step 1: Create `ui/src/styles/composites.css`** — extracted page-scoped composite rules

Copy the rule-blocks **verbatim** from the cited sources (do not rewrite them), then de-scope `.accent-tag`:

```css
/* Extracted page-scoped composite CSS for the ui library.
   Source of truth: src/styles/pages/home.css. Keep in sync on change. */

/* ---- Accordion: src/styles/pages/home.css  .s-arch__* ------------------- */
/* COPY every rule block whose selector starts with `.s-arch` from
   src/styles/pages/home.css into here verbatim, EXCEPT change the selector
   `.s-arch .tag.accent-tag` (home.css:589) to the de-scoped `.tag.accent-tag`
   so the accent chip renders outside the original section wrapper. */

/* ---- CapabilityCard: src/styles/pages/home.css  .s-cap__* --------------- */
/* COPY every rule block whose selector starts with `.s-cap` (including the
   responsive blocks) from src/styles/pages/home.css into here verbatim. */

/* ---- SpecList: src/styles/pages/home.css  .s-compute__spec* ------------- */
/* COPY the rule blocks for .s-compute__spec-panel, .s-compute__spec-head,
   .s-compute__spec-rule, .s-compute__specs, .s-compute__spec-row,
   .s-compute__spec-row + .s-compute__spec-row, .s-compute__spec-key,
   .s-compute__spec-val, .s-compute__spec-badge (home.css:1069-1122) and their
   responsive block (home.css:~1296) verbatim. */
```

> Execution note: this is a mechanical copy. Open `src/styles/pages/home.css`, copy each cited block, and paste under the matching heading. Only one selector is edited: `.s-arch .tag.accent-tag` → `.tag.accent-tag`. Do **not** copy `.marquee*`/`.statusbar*`/`.footer*` — they ship via the shared import below.

- [ ] **Step 2: Create `ui/src/styles/index.css`** — the single entry stylesheet

```css
/* Brand webfonts MUST be the very first rule so they stay first in the built
   file. The site loads these only via an HTML <link>; the CSS layer ships none,
   so without this @import every preview renders in fallback system-ui. */
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+TC:wght@300;400;500;700&family=Saira:wght@300;400;500;600;700;800&family=Saira+Condensed:wght@500;600;700&display=swap");

/* Shared design layer — imported verbatim (single source of truth). */
@import "../../../src/styles/foundation.css";
@import "../../../src/styles/chrome.css";
@import "../../../src/styles/polish.css";
@import "../../../src/styles/utilities.css";

/* Page-scoped composite CSS, extracted. */
@import "./composites.css";
```

> The `../../../src/styles/*` depth is correct from `ui/src/styles/index.css`. Vite/postcss-import resolves cross-package `@import` in build mode with no `fs.allow` restriction, and inlines the whole closure into one `dist/style.css`.

- [ ] **Step 3: Import the CSS from the barrel.** Replace `ui/src/index.ts` contents with:

```ts
import './styles/index.css';

export {};
```

- [ ] **Step 4: Verify the build emits one CSS file with the font import first**

Run: `pnpm -C ui build`
Expected: PASS — `ui/dist/style.css` exists; its first non-comment line is the `@import url("https://fonts.googleapis.com/...")`. Confirm with:
Run: `pnpm -C ui exec node -e "const c=require('fs').readFileSync('dist/style.css','utf8');console.log(c.slice(0,120))"`
Expected: output begins with `@import` of the Google Fonts URL.

- [ ] **Step 5: Commit**

```bash
git add ui/src/styles/index.css ui/src/styles/composites.css ui/src/index.ts
git commit -m "feat(ui): assemble CSS layer (shared import + extracted composites + brand fonts)"
```

---

## Task 4: `Button`

**Files:**
- Create: `ui/src/components/primitives/Button/Button.tsx`
- Test: `ui/src/components/primitives/Button/Button.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders an anchor with primary variant and a trailing arrow', () => {
    const { container } = render(
      <Button href="contact.html" arrow="→">預約諮詢</Button>,
    );
    const a = container.querySelector('a.btn');
    expect(a?.className).toBe('btn btn--primary');
    expect(a?.getAttribute('href')).toBe('contact.html');
    const arrow = container.querySelector('.btn__arrow');
    expect(arrow?.getAttribute('aria-hidden')).toBe('true');
    expect(arrow?.textContent).toBe('→');
  });

  it('renders a <button> with ghost + block and no arrow', () => {
    const { container } = render(
      <Button as="button" variant="ghost" block type="submit">送出</Button>,
    );
    const btn = container.querySelector('button.btn');
    expect(btn?.className).toBe('btn btn--ghost btn--block');
    expect(btn?.getAttribute('type')).toBe('submit');
    expect(container.querySelector('.btn__arrow')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/primitives/Button/Button.test.tsx`
Expected: FAIL — cannot resolve `./Button`.

- [ ] **Step 3: Implement `Button.tsx`**

```tsx
import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';

export type ButtonVariant = 'primary' | 'ghost';
export type ButtonArrow = '→' | '↓';

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  as?: 'a' | 'button';
  href?: string;
  type?: 'button' | 'submit';
  block?: boolean;
  arrow?: ButtonArrow | false;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export function Button({
  children,
  variant = 'primary',
  as = 'a',
  href,
  type = 'button',
  block = false,
  arrow = false,
  disabled = false,
  className,
  onClick,
  ariaLabel,
}: ButtonProps) {
  const cls = cx('btn', `btn--${variant}`, block && 'btn--block', className);
  const tail = arrow ? (
    <>
      {' '}
      <span className="btn__arrow" aria-hidden="true">
        {arrow}
      </span>
    </>
  ) : null;

  if (as === 'a') {
    return (
      <a className={cls} href={href} onClick={onClick} aria-label={ariaLabel}>
        {children}
        {tail}
      </a>
    );
  }
  return (
    <button
      className={cls}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
      {tail}
    </button>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/primitives/Button/Button.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/primitives/Button
git commit -m "feat(ui): add Button primitive"
```

---

## Task 5: `Tag`

**Files:**
- Create: `ui/src/components/primitives/Tag/Tag.tsx`
- Test: `ui/src/components/primitives/Tag/Tag.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders a plain tag', () => {
    const { container } = render(<Tag>MES / EAP</Tag>);
    expect(container.querySelector('span.tag')?.className).toBe('tag');
  });
  it('adds accent-tag when accent', () => {
    const { container } = render(<Tag accent>RTO ≤ 4hr</Tag>);
    expect(container.querySelector('span.tag')?.className).toBe('tag accent-tag');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/primitives/Tag/Tag.test.tsx`
Expected: FAIL — cannot resolve `./Tag`.

- [ ] **Step 3: Implement `Tag.tsx`**

```tsx
import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';

export interface TagProps {
  children: ReactNode;
  accent?: boolean;
  className?: string;
}

export function Tag({ children, accent = false, className }: TagProps) {
  return <span className={cx('tag', accent && 'accent-tag', className)}>{children}</span>;
}
```

> Note: `.accent-tag` is styled by the de-scoped rule in `composites.css` (Task 3), so it renders anywhere.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/primitives/Tag/Tag.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/primitives/Tag
git commit -m "feat(ui): add Tag primitive"
```

---

## Task 6: `Pill`

**Files:**
- Create: `ui/src/components/primitives/Pill/Pill.tsx`
- Test: `ui/src/components/primitives/Pill/Pill.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Pill } from './Pill';

describe('Pill', () => {
  it('renders a pill with an optional contextual class', () => {
    const { container } = render(<Pill className="s-cap__card-spec">800 Gb/s</Pill>);
    expect(container.querySelector('span.pill')?.className).toBe('pill s-cap__card-spec');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/primitives/Pill/Pill.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `Pill.tsx`**

```tsx
import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';

export interface PillProps {
  children: ReactNode;
  className?: string;
}

export function Pill({ children, className }: PillProps) {
  return <span className={cx('pill', className)}>{children}</span>;
}
```

> The leading cyan dot is a CSS `::before` — do not add a dot element.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/primitives/Pill/Pill.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/primitives/Pill
git commit -m "feat(ui): add Pill primitive"
```

---

## Task 7: `Kicker`

**Files:**
- Create: `ui/src/components/primitives/Kicker/Kicker.tsx`
- Test: `ui/src/components/primitives/Kicker/Kicker.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Kicker } from './Kicker';

describe('Kicker', () => {
  it('renders a span by default', () => {
    const { container } = render(<Kicker>02 · BY THE NUMBERS</Kicker>);
    const el = container.querySelector('.kicker');
    expect(el?.tagName).toBe('SPAN');
  });
  it('renders a <p> with extra class when as="p"', () => {
    const { container } = render(<Kicker as="p" className="hero__kicker">FAB</Kicker>);
    const el = container.querySelector('.kicker');
    expect(el?.tagName).toBe('P');
    expect(el?.className).toBe('kicker hero__kicker');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/primitives/Kicker/Kicker.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `Kicker.tsx`**

```tsx
import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';

export interface KickerProps {
  children: ReactNode;
  as?: 'span' | 'p';
  className?: string;
}

export function Kicker({ children, as: As = 'span', className }: KickerProps) {
  return <As className={cx('kicker', className)}>{children}</As>;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/primitives/Kicker/Kicker.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/primitives/Kicker
git commit -m "feat(ui): add Kicker primitive"
```

---

## Task 8: `Hairline`

**Files:**
- Create: `ui/src/components/primitives/Hairline/Hairline.tsx`
- Test: `ui/src/components/primitives/Hairline/Hairline.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Hairline } from './Hairline';

describe('Hairline', () => {
  it('renders an <hr class="hairline"> by default', () => {
    const { container } = render(<Hairline />);
    expect(container.querySelector('hr')?.className).toBe('hairline');
  });
  it('renders the rule variant, aria-hidden, with extra class', () => {
    const { container } = render(<Hairline variant="rule" ariaHidden />);
    const hr = container.querySelector('hr');
    expect(hr?.className).toBe('rule');
    expect(hr?.getAttribute('aria-hidden')).toBe('true');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/primitives/Hairline/Hairline.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `Hairline.tsx`**

```tsx
import { cx } from '../../../lib/cx';

export interface HairlineProps {
  variant?: 'hairline' | 'rule';
  className?: string;
  ariaHidden?: boolean;
}

export function Hairline({ variant = 'hairline', className, ariaHidden }: HairlineProps) {
  return <hr className={cx(variant, className)} aria-hidden={ariaHidden ? 'true' : undefined} />;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/primitives/Hairline/Hairline.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/primitives/Hairline
git commit -m "feat(ui): add Hairline primitive"
```

---

## Task 9: `SectionHeader`

**Files:**
- Create: `ui/src/components/primitives/SectionHeader/SectionHeader.tsx`
- Test: `ui/src/components/primitives/SectionHeader/SectionHeader.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders kicker, title (with accent span), lede and aria-hidden index', () => {
    const { container } = render(
      <SectionHeader
        wrapperClass="s-cap__head-left"
        kicker="04 CAPABILITIES"
        title={<><span>從矽到決策的</span><span className="accent">全棧能力</span></>}
        lede="six layers"
        index="04"
      />,
    );
    expect(container.querySelector('header.section-head .s-cap__head-left .kicker')?.textContent).toBe('04 CAPABILITIES');
    expect(container.querySelector('.section-title .accent')?.textContent).toBe('全棧能力');
    expect(container.querySelector('.section-lede')?.textContent).toBe('six layers');
    const idx = container.querySelector('.section-index');
    expect(idx?.getAttribute('aria-hidden')).toBe('true');
    expect(idx?.textContent).toBe('04');
  });

  it('omits the lede paragraph when no lede is given', () => {
    const { container } = render(<SectionHeader kicker="k" title="t" index="01" />);
    expect(container.querySelector('.section-lede')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/primitives/SectionHeader/SectionHeader.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `SectionHeader.tsx`**

```tsx
import type { ReactNode } from 'react';

export interface SectionHeaderProps {
  kicker: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  index: string;
  wrapperClass?: string;
}

export function SectionHeader({
  kicker,
  title,
  lede,
  index,
  wrapperClass = 'section-head__text',
}: SectionHeaderProps) {
  return (
    <header className="section-head">
      <div className={wrapperClass}>
        <span className="kicker">{kicker}</span>
        <h2 className="section-title">{title}</h2>
        {lede ? <p className="section-lede">{lede}</p> : null}
      </div>
      <span className="section-index" aria-hidden="true">
        {index}
      </span>
    </header>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/primitives/SectionHeader/SectionHeader.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/primitives/SectionHeader
git commit -m "feat(ui): add SectionHeader primitive"
```

---

## Task 10: `StatusBar`

**Files:**
- Create: `ui/src/components/primitives/StatusBar/StatusBar.tsx`
- Test: `ui/src/components/primitives/StatusBar/StatusBar.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  it('renders one statusbar__item per item, with mono', () => {
    const { container } = render(
      <StatusBar ariaLabel="公司資訊" items={['顯藝科技 SHINYLOGIC', 'INTELLIGENT WAFER FAB SYSTEMS']} />,
    );
    const bar = container.querySelector('.statusbar');
    expect(bar?.className).toBe('statusbar mono');
    expect(bar?.getAttribute('aria-label')).toBe('公司資訊');
    expect(container.querySelectorAll('.statusbar__item')).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/primitives/StatusBar/StatusBar.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `StatusBar.tsx`**

```tsx
import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';

export interface StatusBarProps {
  items: ReactNode[];
  ariaLabel?: string;
  className?: string;
}

export function StatusBar({ items, ariaLabel, className }: StatusBarProps) {
  return (
    <div className={cx('statusbar', 'mono', className)} aria-label={ariaLabel}>
      {items.map((item, i) => (
        <span className="statusbar__item" key={i}>
          {item}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/primitives/StatusBar/StatusBar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/primitives/StatusBar
git commit -m "feat(ui): add StatusBar primitive"
```

---

## Task 11: `Marquee`

**Files:**
- Create: `ui/src/components/primitives/Marquee/Marquee.tsx`
- Test: `ui/src/components/primitives/Marquee/Marquee.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Marquee } from './Marquee';

describe('Marquee', () => {
  it('renders two identical groups for a seamless loop', () => {
    const { container } = render(<Marquee ariaLabel="技術夥伴與標準" items={['IEC 62443', 'SEMI E187']} />);
    expect(container.querySelector('.marquee')?.getAttribute('role')).toBe('region');
    const groups = container.querySelectorAll('.marquee__group');
    expect(groups).toHaveLength(2);
    expect(groups[0].getAttribute('aria-hidden')).toBe('false');
    expect(groups[1].getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelectorAll('.marquee__item')).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/primitives/Marquee/Marquee.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `Marquee.tsx`**

```tsx
import type { ReactNode } from 'react';

export interface MarqueeProps {
  items: ReactNode[];
  ariaLabel?: string;
}

export function Marquee({ items, ariaLabel }: MarqueeProps) {
  const group = (hidden: boolean) => (
    <div className="marquee__group" aria-hidden={hidden ? 'true' : 'false'}>
      {items.map((item, i) => (
        <span className="marquee__item" key={i}>
          {item}
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" aria-label={ariaLabel} role="region">
      <div className="marquee__track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/primitives/Marquee/Marquee.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/primitives/Marquee
git commit -m "feat(ui): add Marquee primitive"
```

---

## Task 12: `TickFrame`

**Files:**
- Create: `ui/src/components/primitives/TickFrame/TickFrame.tsx`
- Test: `ui/src/components/primitives/TickFrame/TickFrame.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TickFrame } from './TickFrame';

describe('TickFrame', () => {
  it('renders four decorative corner ticks in tl/tr/bl/br order', () => {
    const { container } = render(<div className="reticle"><TickFrame /></div>);
    const ticks = container.querySelectorAll('.tick');
    expect(ticks).toHaveLength(4);
    expect([...ticks].map((t) => t.className)).toEqual([
      'tick tick--tl',
      'tick tick--tr',
      'tick tick--bl',
      'tick tick--br',
    ]);
    expect(ticks[0].getAttribute('aria-hidden')).toBe('true');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/primitives/TickFrame/TickFrame.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `TickFrame.tsx`**

```tsx
export function TickFrame() {
  return (
    <>
      <span className="tick tick--tl" aria-hidden="true" />
      <span className="tick tick--tr" aria-hidden="true" />
      <span className="tick tick--bl" aria-hidden="true" />
      <span className="tick tick--br" aria-hidden="true" />
    </>
  );
}
```

> Renders only the four spans (no wrapper) — the corner-positioning CSS uses the direct-child combinator `.reticle > .tick--*` / `.card--reticle > .tick--*`, so these must be direct children of the framed element.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/primitives/TickFrame/TickFrame.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/primitives/TickFrame
git commit -m "feat(ui): add TickFrame primitive"
```

---

## Task 13: `Panel`

**Files:**
- Create: `ui/src/components/primitives/Panel/Panel.tsx`
- Test: `ui/src/components/primitives/Panel/Panel.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Panel } from './Panel';

describe('Panel', () => {
  it('renders a plain panel with no ticks by default', () => {
    const { container } = render(<Panel>body</Panel>);
    expect(container.querySelector('div.panel')?.className).toBe('panel');
    expect(container.querySelectorAll('.tick')).toHaveLength(0);
  });
  it('adds reticle + four ticks as direct children when reticle', () => {
    const { container } = render(<Panel reticle className="s-stats__panel">body</Panel>);
    const panel = container.querySelector('div.panel');
    expect(panel?.className).toBe('panel reticle s-stats__panel');
    expect(panel?.querySelectorAll(':scope > .tick')).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/primitives/Panel/Panel.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `Panel.tsx`**

```tsx
import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { TickFrame } from '../TickFrame/TickFrame';

export interface PanelProps {
  children: ReactNode;
  reticle?: boolean;
  className?: string;
  as?: 'div' | 'aside';
}

export function Panel({ children, reticle = false, className, as: As = 'div' }: PanelProps) {
  return (
    <As className={cx('panel', reticle && 'reticle', className)}>
      {reticle ? <TickFrame /> : null}
      {children}
    </As>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/primitives/Panel/Panel.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/primitives/Panel
git commit -m "feat(ui): add Panel primitive"
```

---

## Task 14: `Card`

**Files:**
- Create: `ui/src/components/primitives/Card/Card.tsx`
- Test: `ui/src/components/primitives/Card/Card.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders a div.card with no ticks by default', () => {
    const { container } = render(<Card>x</Card>);
    expect(container.querySelector('div.card')?.className).toBe('card');
    expect(container.querySelectorAll('.tick')).toHaveLength(0);
  });
  it('renders an li.card--reticle with four ticks and --i style', () => {
    const { container } = render(<Card as="li" reticle className="s-cap__card" i={3}>x</Card>);
    const li = container.querySelector('li.card');
    expect(li?.className).toBe('card card--reticle s-cap__card');
    expect((li as HTMLElement)?.style.getPropertyValue('--i')).toBe('3');
    expect(li?.querySelectorAll(':scope > .tick')).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/primitives/Card/Card.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `Card.tsx`**

```tsx
import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { TickFrame } from '../TickFrame/TickFrame';

export interface CardProps {
  children: ReactNode;
  reticle?: boolean;
  className?: string;
  i?: number;
  as?: 'li' | 'div';
}

export function Card({ children, reticle = false, className, i, as: As = 'div' }: CardProps) {
  const style = i !== undefined ? ({ '--i': String(i) } as CSSProperties) : undefined;
  return (
    <As className={cx('card', reticle && 'card--reticle', className)} style={style}>
      {reticle ? <TickFrame /> : null}
      {children}
    </As>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/primitives/Card/Card.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/primitives/Card
git commit -m "feat(ui): add Card primitive"
```

---

## Task 15: `Metric`

**Files:**
- Create: `ui/src/components/primitives/Metric/Metric.tsx`
- Test: `ui/src/components/primitives/Metric/Metric.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Metric } from './Metric';

describe('Metric', () => {
  it('renders static num + unit span + label', () => {
    const { container } = render(<Metric num="≥ 95" unit="%" label="系統 SLO" />);
    expect(container.querySelector('.metric__num')?.textContent).toBe('≥ 95%');
    expect(container.querySelector('.metric__unit')?.textContent).toBe('%');
    expect(container.querySelector('.metric__label')?.textContent).toBe('系統 SLO');
  });

  it('count mode renders the FINAL formatted value immediately (never 0)', () => {
    const { container } = render(<Metric count={1280} suffix=" GPUs" label="fabric" />);
    // No IntersectionObserver fires in jsdom, so the final value must be shown.
    expect(container.querySelector('.metric__num')?.textContent).toBe('1,280 GPUs');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/primitives/Metric/Metric.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `Metric.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';

export interface MetricProps {
  num?: ReactNode;
  unit?: string;
  label: ReactNode;
  count?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

function formatNumber(value: number, decimals: number): string {
  const parts = value.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function MetricStatic({ num, unit, label, className }: MetricProps) {
  return (
    <div className={cx('metric', className)}>
      <div className="metric__num">
        {num}
        {unit ? <span className="metric__unit">{unit}</span> : null}
      </div>
      <div className="metric__label">{label}</div>
    </div>
  );
}

function MetricCounter({ count = 0, decimals = 0, prefix = '', suffix = '', label, className }: MetricProps) {
  const final = prefix + formatNumber(count, decimals) + suffix;
  // Render the FINAL value first so a non-interactive snapshot is never blank/0.
  const [display, setDisplay] = useState(final);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e?.isIntersecting) return;
        io.disconnect();
        const duration = 1400;
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
        let start: number | null = null;
        const step = (ts: number) => {
          if (start === null) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          const cur = count * easeOut(p);
          setDisplay(prefix + formatNumber(decimals > 0 ? cur : Math.round(cur), decimals) + suffix);
          if (p < 1) raf = requestAnimationFrame(step);
          else setDisplay(final);
        };
        setDisplay(prefix + formatNumber(0, decimals) + suffix);
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count, decimals, prefix, suffix, final]);

  return (
    <div className={cx('metric', className)}>
      <div className="metric__num" ref={ref}>
        {display}
      </div>
      <div className="metric__label">{label}</div>
    </div>
  );
}

export function Metric(props: MetricProps) {
  return props.count !== undefined ? <MetricCounter {...props} /> : <MetricStatic {...props} />;
}
```

> Hooks live only in `MetricCounter`, which is rendered conditionally as a whole component — so the rules of hooks are never violated. The count-up runs only as an enhancement; jsdom/preview shows the final value.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/primitives/Metric/Metric.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/primitives/Metric
git commit -m "feat(ui): add Metric primitive with preview-safe count-up"
```

---

## Task 16: `Brand`

**Files:**
- Create: `ui/src/components/primitives/Brand/Brand.tsx`
- Test: `ui/src/components/primitives/Brand/Brand.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Brand } from './Brand';

describe('Brand', () => {
  it('renders the brand mark, sub and FAB300 tag', () => {
    const { container } = render(<Brand ariaHome="顯藝科技 ShinyLogic 首頁" />);
    const a = container.querySelector('a.brand');
    expect(a?.getAttribute('aria-label')).toBe('顯藝科技 ShinyLogic 首頁');
    expect(container.querySelector('.brand__mark .accent')?.textContent).toBe('LOGIC');
    expect(container.querySelector('.brand__sub')?.textContent).toBe('顯藝科技');
    expect(container.querySelector('.brand__tag')?.textContent).toContain('FAB300');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/primitives/Brand/Brand.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `Brand.tsx`**

```tsx
export interface BrandProps {
  href?: string;
  ariaHome?: string;
  logoWebp?: string;
  logoPng?: string;
}

export function Brand({
  href = 'index.html',
  ariaHome,
  logoWebp = '/logo.webp',
  logoPng = '/logo.png',
}: BrandProps) {
  return (
    <a className="brand" href={href} aria-label={ariaHome}>
      <picture className="brand__logo" aria-hidden="true">
        <source srcSet={logoWebp} type="image/webp" />
        <img src={logoPng} alt="" width={34} height={34} decoding="async" />
      </picture>
      <span className="brand__col">
        <span className="brand__mark">
          SHINY<span className="accent">LOGIC</span>
        </span>
        <span className="brand__sub">顯藝科技</span>
      </span>
      <span className="brand__tag">
        <span className="dot" aria-hidden="true" />
        FAB300
      </span>
    </a>
  );
}
```

> The mark/sub text are literal brand strings (not translated). Keep the 34×34 dimensions to avoid CLS.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/primitives/Brand/Brand.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/primitives/Brand
git commit -m "feat(ui): add Brand primitive"
```

---

## Task 17: `LangSwitch`

**Files:**
- Create: `ui/src/components/composites/LangSwitch/LangSwitch.tsx`
- Test: `ui/src/components/composites/LangSwitch/LangSwitch.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { LangSwitch } from './LangSwitch';

describe('LangSwitch', () => {
  it('marks the active lang via aria-pressed + is-active and fires onLangChange', () => {
    const onLangChange = vi.fn();
    const { container } = render(<LangSwitch lang="en" ariaLabel="語言切換" onLangChange={onLangChange} />);
    const buttons = container.querySelectorAll('.langswitch__btn');
    expect(buttons).toHaveLength(3);
    const en = container.querySelector('[data-lang="en"]');
    expect(en?.getAttribute('aria-pressed')).toBe('true');
    expect(en?.className).toBe('langswitch__btn is-active');
    fireEvent.click(container.querySelector('[data-lang="zh-Hans"]')!);
    expect(onLangChange).toHaveBeenCalledWith('zh-Hans');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/composites/LangSwitch/LangSwitch.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `LangSwitch.tsx`**

```tsx
import { cx } from '../../../lib/cx';

export type Lang = 'zh-Hant' | 'en' | 'zh-Hans';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'zh-Hant', label: '繁' },
  { code: 'en', label: 'EN' },
  { code: 'zh-Hans', label: '简' },
];

export interface LangSwitchProps {
  lang?: Lang;
  onLangChange?: (lang: Lang) => void;
  ariaLabel?: string;
  mobile?: boolean;
}

export function LangSwitch({ lang = 'zh-Hant', onLangChange, ariaLabel, mobile = false }: LangSwitchProps) {
  return (
    <div className={cx('langswitch', mobile && 'langswitch--mobile')} role="group" aria-label={ariaLabel}>
      {LANGS.map(({ code, label }) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            className={cx('langswitch__btn', active && 'is-active')}
            data-lang={code}
            aria-pressed={active ? 'true' : 'false'}
            lang={code}
            onClick={() => onLangChange?.(code)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
```

> Controlled: active button derives from the `lang` prop. No localStorage read on mount; no `sl:langchange` dispatch — that document-wide i18n is app-level.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/composites/LangSwitch/LangSwitch.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/composites/LangSwitch
git commit -m "feat(ui): add LangSwitch composite"
```

---

## Task 18: `ThemeToggle`

**Files:**
- Create: `ui/src/components/composites/ThemeToggle/ThemeToggle.tsx`
- Test: `ui/src/components/composites/ThemeToggle/ThemeToggle.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
});

describe('ThemeToggle', () => {
  it('controlled: aria-pressed reflects theme and click calls onToggle', () => {
    const onToggle = vi.fn();
    const { container } = render(<ThemeToggle theme="dark" ariaLabel="切換主題" onToggle={onToggle} />);
    const btn = container.querySelector('button.theme-toggle');
    expect(btn?.getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('.theme-toggle__icon--moon')).not.toBeNull();
    expect(container.querySelector('.theme-toggle__icon--sun')).not.toBeNull();
    fireEvent.click(btn!);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('uncontrolled: does not write data-theme on mount, only on click', () => {
    const { container } = render(<ThemeToggle ariaLabel="切換主題" />);
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    fireEvent.click(container.querySelector('button.theme-toggle')!);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/composites/ThemeToggle/ThemeToggle.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `ThemeToggle.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { cx } from '../../../lib/cx';

export type Theme = 'dark' | 'light';

export interface ThemeToggleProps {
  theme?: Theme;
  onToggle?: () => void;
  ariaLabel?: string;
  mobile?: boolean;
  target?: () => HTMLElement | null;
}

const MoonIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

export function ThemeToggle({ theme, onToggle, ariaLabel, mobile = false, target }: ThemeToggleProps) {
  const controlled = theme !== undefined;
  const [internal, setInternal] = useState<Theme>(theme ?? 'dark');

  // Uncontrolled only: read the existing attribute after mount; never write here.
  useEffect(() => {
    if (controlled || typeof document === 'undefined') return;
    const el = target?.() ?? document.documentElement;
    const current = el.getAttribute('data-theme');
    if (current === 'light' || current === 'dark') setInternal(current);
  }, [controlled, target]);

  const current = controlled ? (theme as Theme) : internal;

  const handleClick = () => {
    if (controlled) {
      onToggle?.();
      return;
    }
    const next: Theme = current === 'dark' ? 'light' : 'dark';
    setInternal(next);
    if (typeof document !== 'undefined') {
      (target?.() ?? document.documentElement).setAttribute('data-theme', next);
      try {
        localStorage.setItem('sl-theme', next);
      } catch {
        /* private mode / sandbox — ignore */
      }
    }
  };

  return (
    <button
      type="button"
      className={cx('theme-toggle', mobile && 'theme-toggle--mobile')}
      aria-pressed={current === 'dark' ? 'true' : 'false'}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
        {MoonIcon}
      </span>
      <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
        {SunIcon}
      </span>
    </button>
  );
}
```

> Renders both icon spans and lets the CSS swap (`[data-theme='dark'] .theme-toggle__icon--moon`, default dark via `:root:not([data-theme='light'])`) choose — no `innerHTML`, no `window.I18N`. No write on mount; `localStorage` guarded; theme target injectable.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/composites/ThemeToggle/ThemeToggle.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/composites/ThemeToggle
git commit -m "feat(ui): add ThemeToggle composite (sandbox-safe)"
```

---

## Task 19: `Nav`

**Files:**
- Create: `ui/src/components/composites/Nav/Nav.tsx`
- Test: `ui/src/components/composites/Nav/Nav.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Nav } from './Nav';

afterEach(cleanup);

const links = [
  { href: 'about.html', label: '關於' },
  { href: 'solutions.html', label: '解決方案' },
];

describe('Nav', () => {
  it('renders brand, links (desktop + mobile mirror), CTA and the toggle', () => {
    const { container } = render(
      <Nav links={links} ctaHref="contact.html" ctaLabel="預約諮詢" menuOpenLabel="開啟選單" menuCloseLabel="關閉選單" />,
    );
    expect(container.querySelector('.brand')).not.toBeNull();
    expect(container.querySelectorAll('.nav__link')).toHaveLength(2);
    expect(container.querySelector('.nav__cta')?.getAttribute('href')).toBe('contact.html');
    const toggle = container.querySelector('#navToggle');
    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(toggle?.getAttribute('aria-label')).toBe('開啟選單');
  });

  it('toggles the mobile menu open state and aria-label on click', () => {
    const { container } = render(
      <Nav links={links} menuOpenLabel="開啟選單" menuCloseLabel="關閉選單" />,
    );
    const toggle = container.querySelector('#navToggle')!;
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-label')).toBe('關閉選單');
    expect(container.querySelector('#navMobile')?.className).toContain('is-open');
  });

  it('forceScrolled renders the scrolled nav variant', () => {
    const { container } = render(<Nav links={links} forceScrolled />);
    expect(container.querySelector('.nav')?.className).toContain('is-scrolled');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/composites/Nav/Nav.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `Nav.tsx`**

```tsx
import { useEffect, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { Brand } from '../../primitives/Brand/Brand';
import { LangSwitch, type Lang } from '../LangSwitch/LangSwitch';
import { ThemeToggle, type Theme } from '../ThemeToggle/ThemeToggle';

export interface NavLink {
  href: string;
  label: ReactNode;
}

export interface NavProps {
  links: NavLink[];
  ariaPrimary?: string;
  brandAriaHome?: string;
  ctaHref?: string;
  ctaLabel?: ReactNode;
  menuOpenLabel?: string;
  menuCloseLabel?: string;
  lang?: Lang;
  onLangChange?: (lang: Lang) => void;
  langAriaLabel?: string;
  theme?: Theme;
  onThemeToggle?: () => void;
  themeAriaLabel?: string;
  forceScrolled?: boolean;
  defaultMobileOpen?: boolean;
}

export function Nav({
  links,
  ariaPrimary,
  brandAriaHome,
  ctaHref = 'contact.html',
  ctaLabel,
  menuOpenLabel,
  menuCloseLabel,
  lang,
  onLangChange,
  langAriaLabel,
  theme,
  onThemeToggle,
  themeAriaLabel,
  forceScrolled,
  defaultMobileOpen = false,
}: NavProps) {
  const [open, setOpen] = useState(defaultMobileOpen);
  const [scrolled, setScrolled] = useState(forceScrolled ?? false);

  useEffect(() => {
    if (forceScrolled !== undefined || typeof window === 'undefined') return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [forceScrolled]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onAnchorClick = (href: string) => (e: MouseEvent) => {
    if (!href.startsWith('#') || href.length < 2 || typeof document === 'undefined') return;
    const targetEl = document.querySelector(href);
    if (!targetEl) return;
    e.preventDefault();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    targetEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    try {
      history.pushState(null, '', href);
    } catch {
      /* sandboxed iframe — ignore */
    }
  };

  const themeToggle = (mobile: boolean) => (
    <ThemeToggle theme={theme} onToggle={onThemeToggle} ariaLabel={themeAriaLabel} mobile={mobile} />
  );
  const langSwitch = (mobile: boolean) => (
    <LangSwitch lang={lang} onLangChange={onLangChange} ariaLabel={langAriaLabel} mobile={mobile} />
  );

  return (
    <header>
      <nav className={cx('nav', scrolled && 'is-scrolled')} aria-label={ariaPrimary}>
        <div className="nav__inner">
          <Brand ariaHome={brandAriaHome} />

          <ul className="nav__links">
            {links.map((link) => (
              <li key={link.href}>
                <a className="nav__link" href={link.href} onClick={onAnchorClick(link.href)}>
                  {link.label}
                </a>
              </li>
            ))}

            <li className="nav__lang">{langSwitch(false)}</li>
            <li className="nav__theme">{themeToggle(false)}</li>

            <li>
              <a className="btn btn--primary nav__cta" href={ctaHref}>
                {ctaLabel} <span className="btn__arrow" aria-hidden="true">→</span>
              </a>
            </li>
          </ul>

          <button
            className="nav__toggle"
            id="navToggle"
            aria-label={open ? menuCloseLabel : menuOpenLabel}
            aria-expanded={open ? 'true' : 'false'}
            aria-controls="navMobile"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div className={cx('nav__mobile', open && 'is-open')} id="navMobile">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}

        <div className="nav__mobile-theme">{themeToggle(true)}</div>
        {langSwitch(true)}

        <a className="btn btn--primary" href={ctaHref} onClick={() => setOpen(false)}>
          {ctaLabel} <span className="btn__arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
}
```

> Open/scrolled are React state, not classList mutation. Scroll listener and Escape live in guarded effects; `pushState` is guarded; aria strings come from props. The smooth-anchor handler only acts on in-page `#` links.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/composites/Nav/Nav.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/composites/Nav
git commit -m "feat(ui): add Nav composite (scroll/mobile/anchors, sandbox-safe)"
```

---

## Task 20: `Accordion`

**Files:**
- Create: `ui/src/components/composites/Accordion/Accordion.tsx`
- Test: `ui/src/components/composites/Accordion/Accordion.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Accordion, type AccordionLayer } from './Accordion';

afterEach(cleanup);

const layers: AccordionLayer[] = [
  { n: 1, nameTc: '輸入層', nameEn: 'INPUT', chips: [{ label: 'MES / EAP' }], desc: 'd1', meta: 'm1' },
  { n: 2, nameTc: '數據層', nameEn: 'DATA', chips: [{ label: 'NVMe' }], desc: 'd2', meta: 'm2' },
  { n: 6, nameTc: '備援層', nameEn: 'RESILIENCE', chips: [{ label: 'RTO ≤ 4hr', accent: true }], desc: 'd6', meta: 'm6' },
];

describe('Accordion', () => {
  it('opens layer 0 by default; others are hidden', () => {
    const { container } = render(<Accordion layers={layers} />);
    const bodies = container.querySelectorAll('.s-arch__body');
    expect(bodies[0].classList.contains('is-open')).toBe(true);
    expect(bodies[0].hasAttribute('hidden')).toBe(false);
    expect(bodies[1].hasAttribute('hidden')).toBe(true);
    expect(container.querySelector('#arch-btn-1')?.getAttribute('aria-expanded')).toBe('true');
  });

  it('single-open: clicking a closed header opens it and closes others', () => {
    const { container } = render(<Accordion layers={layers} />);
    fireEvent.click(container.querySelector('#arch-btn-2')!);
    expect(container.querySelector('#arch-btn-2')?.getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('#arch-btn-1')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders accent chips with accent-tag', () => {
    const { container } = render(<Accordion layers={layers} defaultOpen={2} />);
    expect(container.querySelector('#arch-body-6 .tag')?.className).toBe('tag accent-tag');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/composites/Accordion/Accordion.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `Accordion.tsx`**

```tsx
import { useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '../../../lib/cx';

export interface AccordionChip {
  label: ReactNode;
  accent?: boolean;
}

export interface AccordionLayer {
  n: number;
  nameTc: ReactNode;
  nameEn: string;
  chips: AccordionChip[];
  desc: ReactNode;
  meta: ReactNode;
}

export interface AccordionProps {
  layers: AccordionLayer[];
  defaultOpen?: number;
  idPrefix?: string;
}

export function Accordion({ layers, defaultOpen = 0, idPrefix = 'arch' }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = btnRefs.current.indexOf(document.activeElement as HTMLButtonElement);
    if (idx === -1) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      btnRefs.current[idx + 1]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      btnRefs.current[idx - 1]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      btnRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      btnRefs.current[btnRefs.current.length - 1]?.focus();
    }
  };

  return (
    <div className="s-arch__stack" role="presentation" onKeyDown={onKeyDown}>
      <div className="s-arch__rail" aria-hidden="true">
        <div className="s-arch__pulse" />
      </div>

      {layers.map((layer, i) => {
        const open = i === openIndex;
        const btnId = `${idPrefix}-btn-${layer.n}`;
        const bodyId = `${idPrefix}-body-${layer.n}`;
        return (
          <div className="s-arch__layer" data-layer={layer.n} data-active={open ? 'true' : 'false'} key={layer.n}>
            <button
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              className="s-arch__header"
              aria-expanded={open ? 'true' : 'false'}
              aria-controls={bodyId}
              id={btnId}
              onClick={() => {
                if (!open) setOpenIndex(i);
              }}
            >
              <span className="s-arch__index mono accent" aria-hidden="true">
                L{layer.n}
              </span>
              <span className="s-arch__names">
                <span className="s-arch__name-tc">{layer.nameTc}</span>
                <span className="s-arch__name-en mono steel">{layer.nameEn}</span>
              </span>
              <span className="s-arch__arrow" aria-hidden="true" />
            </button>

            <div
              className={cx('s-arch__body', open && 'is-open')}
              id={bodyId}
              role="region"
              aria-labelledby={btnId}
              hidden={!open}
            >
              <div className="s-arch__chips">
                {layer.chips.map((chip, ci) => (
                  <span className={cx('tag', chip.accent && 'accent-tag')} key={ci}>
                    {chip.label}
                  </span>
                ))}
              </div>
              <p className="s-arch__desc">{layer.desc}</p>
              <div className="s-arch__meta mono steel">
                <span>{layer.meta}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

> `openIndex` is React state initialized to `defaultOpen` (0). Closed bodies get `hidden` (removed from tab order, matching the source's `[hidden]` management) and lose `is-open`; the rAF/transitionend bookkeeping from the vanilla version isn't needed in React. Clicking the open header is a no-op (single-open). Keyboard roving (↑/↓/Home/End) is scoped to the header buttons.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/composites/Accordion/Accordion.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/composites/Accordion
git commit -m "feat(ui): add Accordion composite (single-open, keyboard, a11y)"
```

---

## Task 21: `CapabilityCard`

**Files:**
- Create: `ui/src/components/composites/CapabilityCard/CapabilityCard.tsx`
- Test: `ui/src/components/composites/CapabilityCard/CapabilityCard.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CapabilityCard } from './CapabilityCard';

describe('CapabilityCard', () => {
  it('renders an li.card--reticle with icon slot, body and share', () => {
    const { container } = render(
      <CapabilityCard
        i={0}
        icon={<svg data-testid="icon" />}
        name="AI 算力與儲存"
        en="AI COMPUTE & STORAGE"
        blurb="NVIDIA Blackwell Ultra"
        spec="GB300 NVL72 · NVMe Lake"
        share="AI 算力"
      />,
    );
    const li = container.querySelector('li.card.card--reticle.s-cap__card');
    expect(li).not.toBeNull();
    expect((li as HTMLElement).style.getPropertyValue('--i')).toBe('0');
    expect(container.querySelector('.s-cap__card-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('.s-cap__card-name')?.textContent).toBe('AI 算力與儲存');
    expect(container.querySelector('.pill.s-cap__card-spec')?.textContent).toBe('GB300 NVL72 · NVMe Lake');
    expect(container.querySelector('.s-cap__card-share')?.getAttribute('aria-hidden')).toBe('true');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/composites/CapabilityCard/CapabilityCard.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `CapabilityCard.tsx`**

```tsx
import type { ReactNode } from 'react';
import { Card } from '../../primitives/Card/Card';

export interface CapabilityCardProps {
  icon: ReactNode;
  name: ReactNode;
  en: ReactNode;
  blurb: ReactNode;
  spec: ReactNode;
  share?: ReactNode;
  i?: number;
}

export function CapabilityCard({ icon, name, en, blurb, spec, share, i }: CapabilityCardProps) {
  return (
    <Card as="li" reticle className="s-cap__card" i={i}>
      <div className="s-cap__card-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="s-cap__card-body">
        <h3 className="s-cap__card-name">{name}</h3>
        <span className="s-cap__card-en mono accent">{en}</span>
        <p className="s-cap__card-blurb">{blurb}</p>
        <span className="pill s-cap__card-spec">{spec}</span>
      </div>
      {share ? (
        <span className="s-cap__card-share mono" aria-hidden="true">
          {share}
        </span>
      ) : null}
    </Card>
  );
}
```

> Built on the `Card` primitive. The per-card SVG is a slot (`icon`). The `reveal` class is intentionally omitted (it hides content until scroll — an excluded app behavior; previews must render visible).

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/composites/CapabilityCard/CapabilityCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/composites/CapabilityCard
git commit -m "feat(ui): add CapabilityCard composite"
```

---

## Task 22: `SpecList`

**Files:**
- Create: `ui/src/components/composites/SpecList/SpecList.tsx`
- Test: `ui/src/components/composites/SpecList/SpecList.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SpecList } from './SpecList';

describe('SpecList', () => {
  it('renders a reticle panel + dl rows with optional badge', () => {
    const { container } = render(
      <SpecList
        head="// HARDWARE CONFIGURATION"
        rows={[
          { key: 'GB300 NVL72 × 3', value: 'AI Fabric 算力', badge: '液冷' },
          { key: 'HGX B300 × 4', value: '推理節點' },
        ]}
      />,
    );
    expect(container.querySelector('.panel.s-compute__spec-panel.reticle')).not.toBeNull();
    expect(container.querySelector('.s-compute__spec-head')?.textContent).toBe('// HARDWARE CONFIGURATION');
    expect(container.querySelectorAll('.s-compute__spec-row')).toHaveLength(2);
    expect(container.querySelectorAll('.s-compute__spec-badge')).toHaveLength(1);
    expect(container.querySelector('.s-compute__spec-key')?.textContent).toBe('GB300 NVL72 × 3');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/composites/SpecList/SpecList.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `SpecList.tsx`**

```tsx
import type { ReactNode } from 'react';
import { Panel } from '../../primitives/Panel/Panel';

export interface SpecRow {
  key: ReactNode;
  value: ReactNode;
  badge?: ReactNode;
}

export interface SpecListProps {
  head: ReactNode;
  rows: SpecRow[];
}

export function SpecList({ head, rows }: SpecListProps) {
  return (
    <Panel reticle className="s-compute__spec-panel">
      <div className="s-compute__spec-head mono steel">{head}</div>
      <hr className="hairline s-compute__spec-rule" />
      <dl className="s-compute__specs">
        {rows.map((row, i) => (
          <div className="s-compute__spec-row" key={i}>
            <dt className="s-compute__spec-key mono accent">{row.key}</dt>
            <dd className="s-compute__spec-val">
              <span className="mist">{row.value}</span>
              {row.badge ? <span className="s-compute__spec-badge tag">{row.badge}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/composites/SpecList/SpecList.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/composites/SpecList
git commit -m "feat(ui): add SpecList composite"
```

---

## Task 23: `Footer`

**Files:**
- Create: `ui/src/components/composites/Footer/Footer.tsx`
- Test: `ui/src/components/composites/Footer/Footer.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders brand, sitemap groups, lang slot and the bottom bar', () => {
    const { container } = render(
      <Footer
        brandDesc="We build the intelligence layer."
        sitemapAriaLabel="網站地圖"
        groups={[
          { title: '公司', links: [{ href: 'about.html', label: '關於' }, { href: 'careers.html', label: '招募' }] },
          { title: '聯絡', links: [{ href: 'contact.html', label: '聯絡' }] },
        ]}
        langLabel="語言 / LANGUAGE"
        langSwitch={<div data-testid="lang-slot" />}
        tech="交付範疇依合約確認"
        copy="© 2026 顯藝科技 ShinyLogic."
        fine="FAB300 REFERENCE BUILD"
      />,
    );
    expect(container.querySelector('footer.footer')).not.toBeNull();
    expect(container.querySelector('.footer__brand .brand__mark .accent')?.textContent).toBe('LOGIC');
    expect(container.querySelectorAll('.footer__group')).toHaveLength(2);
    expect(container.querySelector('.footer__sitemap')?.getAttribute('aria-label')).toBe('網站地圖');
    expect(container.querySelector('[data-testid="lang-slot"]')).not.toBeNull();
    expect(container.querySelector('.footer__copy')?.textContent).toBe('© 2026 顯藝科技 ShinyLogic.');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/components/composites/Footer/Footer.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `Footer.tsx`**

```tsx
import type { ReactNode } from 'react';

export interface FooterLink {
  href: string;
  label: ReactNode;
}

export interface FooterGroup {
  title: ReactNode;
  links: FooterLink[];
}

export interface FooterProps {
  brandDesc: ReactNode;
  sitemapAriaLabel?: string;
  groups: FooterGroup[];
  langLabel: ReactNode;
  langSwitch: ReactNode;
  tech: ReactNode;
  copy: ReactNode;
  fine: ReactNode;
}

export function Footer({
  brandDesc,
  sitemapAriaLabel,
  groups,
  langLabel,
  langSwitch,
  tech,
  copy,
  fine,
}: FooterProps) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="brand__mark">
              SHINY<span className="accent">LOGIC</span>{' '}
              <span className="brand__sub is-inline u-m-0">顯藝科技</span>
            </span>
            <p className="footer__desc">{brandDesc}</p>
          </div>

          <nav className="footer__sitemap" aria-label={sitemapAriaLabel}>
            {groups.map((group, gi) => (
              <div className="footer__group" key={gi}>
                <span className="footer__group-title mono steel">{group.title}</span>
                {group.links.map((link) => (
                  <a href={link.href} key={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="footer__lang">
          <span className="footer__lang-label mono steel">{langLabel}</span>
          {langSwitch}
        </div>

        <div className="footer__bottom">
          <div>
            <p className="footer__tech mono">{tech}</p>
            <p className="footer__copy">{copy}</p>
          </div>
          <p className="footer__fine mono">{fine}</p>
        </div>
      </div>
    </footer>
  );
}
```

> The link block is `<nav class="footer__sitemap">` with `.footer__group` blocks (there is no `.footer__nav` class in the real source). The `LangSwitch` is a slot.

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm -C ui exec vitest run src/components/composites/Footer/Footer.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/composites/Footer
git commit -m "feat(ui): add Footer composite"
```

---

## Task 24: Barrel, build, and full verification

**Files:**
- Modify: `ui/src/index.ts`
- Test: `ui/src/index.test.tsx`

- [ ] **Step 1: Write the failing barrel smoke test**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as UI from './index';

describe('barrel', () => {
  it('exports every public component', () => {
    const names = [
      'Button', 'Tag', 'Pill', 'Kicker', 'Hairline', 'SectionHeader', 'StatusBar',
      'Marquee', 'TickFrame', 'Panel', 'Card', 'Metric', 'Brand',
      'LangSwitch', 'ThemeToggle', 'Nav', 'Accordion', 'CapabilityCard', 'SpecList', 'Footer',
    ];
    for (const n of names) expect(typeof (UI as Record<string, unknown>)[n]).toBe('function');
  });

  it('a representative component renders from the barrel', () => {
    const { container } = render(<UI.Button href="#">go</UI.Button>);
    expect(container.querySelector('a.btn')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm -C ui exec vitest run src/index.test.tsx`
Expected: FAIL — the barrel exports nothing yet.

- [ ] **Step 3: Write the full barrel `ui/src/index.ts`**

```ts
import './styles/index.css';

export { Button } from './components/primitives/Button/Button';
export type { ButtonProps, ButtonVariant, ButtonArrow } from './components/primitives/Button/Button';
export { Tag } from './components/primitives/Tag/Tag';
export type { TagProps } from './components/primitives/Tag/Tag';
export { Pill } from './components/primitives/Pill/Pill';
export type { PillProps } from './components/primitives/Pill/Pill';
export { Kicker } from './components/primitives/Kicker/Kicker';
export type { KickerProps } from './components/primitives/Kicker/Kicker';
export { Hairline } from './components/primitives/Hairline/Hairline';
export type { HairlineProps } from './components/primitives/Hairline/Hairline';
export { SectionHeader } from './components/primitives/SectionHeader/SectionHeader';
export type { SectionHeaderProps } from './components/primitives/SectionHeader/SectionHeader';
export { StatusBar } from './components/primitives/StatusBar/StatusBar';
export type { StatusBarProps } from './components/primitives/StatusBar/StatusBar';
export { Marquee } from './components/primitives/Marquee/Marquee';
export type { MarqueeProps } from './components/primitives/Marquee/Marquee';
export { TickFrame } from './components/primitives/TickFrame/TickFrame';
export { Panel } from './components/primitives/Panel/Panel';
export type { PanelProps } from './components/primitives/Panel/Panel';
export { Card } from './components/primitives/Card/Card';
export type { CardProps } from './components/primitives/Card/Card';
export { Metric } from './components/primitives/Metric/Metric';
export type { MetricProps } from './components/primitives/Metric/Metric';
export { Brand } from './components/primitives/Brand/Brand';
export type { BrandProps } from './components/primitives/Brand/Brand';
export { LangSwitch } from './components/composites/LangSwitch/LangSwitch';
export type { LangSwitchProps, Lang } from './components/composites/LangSwitch/LangSwitch';
export { ThemeToggle } from './components/composites/ThemeToggle/ThemeToggle';
export type { ThemeToggleProps, Theme } from './components/composites/ThemeToggle/ThemeToggle';
export { Nav } from './components/composites/Nav/Nav';
export type { NavProps, NavLink } from './components/composites/Nav/Nav';
export { Accordion } from './components/composites/Accordion/Accordion';
export type { AccordionProps, AccordionLayer, AccordionChip } from './components/composites/Accordion/Accordion';
export { CapabilityCard } from './components/composites/CapabilityCard/CapabilityCard';
export type { CapabilityCardProps } from './components/composites/CapabilityCard/CapabilityCard';
export { SpecList } from './components/composites/SpecList/SpecList';
export type { SpecListProps, SpecRow } from './components/composites/SpecList/SpecList';
export { Footer } from './components/composites/Footer/Footer';
export type { FooterProps, FooterGroup, FooterLink } from './components/composites/Footer/Footer';
```

- [ ] **Step 4: Run the barrel test + full suite**

Run: `pnpm -C ui exec vitest run`
Expected: PASS — all component suites + the barrel smoke test green.

- [ ] **Step 5: Typecheck**

Run: `pnpm -C ui typecheck`
Expected: PASS — no TS errors.

- [ ] **Step 6: Build the library and verify artifacts**

Run: `pnpm -C ui build`
Expected: PASS — emits `ui/dist/index.es.js`, `ui/dist/index.d.ts`, `ui/dist/style.css`.

Run: `pnpm -C ui exec node -e "const t=require('fs').readFileSync('dist/index.d.ts','utf8'); for (const n of ['Button','Nav','Accordion','Footer','Metric']) if(!t.includes(n)) throw new Error('missing '+n+' in dts'); console.log('dts barrel OK')"`
Expected: prints `dts barrel OK` (confirms the bundled `.d.ts` contains the component types design-sync discovers).

- [ ] **Step 7: Render-from-built-bundle smoke check**

Create a throwaway check (do not commit) to confirm the built ESM actually renders (catches React-external binding issues that a global-only check would miss):

Run:
```bash
pnpm -C ui exec node --input-type=module -e "import { renderToStaticMarkup } from 'react-dom/server'; import { createElement as h } from 'react'; const UI = await import('./dist/index.es.js'); const html = renderToStaticMarkup(h(UI.Button, { href:'#' }, 'go')); if(!html.includes('btn--primary')) throw new Error('render failed'); console.log('render OK:', html);"
```
Expected: prints `render OK:` followed by an `<a class="btn btn--primary" href="#">…</a>` (confirms the externalized React resolves and the component actually renders, not just that the export exists).

- [ ] **Step 8: Confirm the live site is untouched and green**

Run: `pnpm build && pnpm lint`
Expected: PASS.

Run: `git status --porcelain src`
Expected: no output (zero changes under `src/`).

- [ ] **Step 9: Commit**

```bash
git add ui/src/index.ts ui/src/index.test.tsx
git commit -m "feat(ui): wire public barrel and verify build + dts + render"
```

---

## Done criteria (matches the spec's success criteria)

1. `pnpm -C ui build` emits `dist/index.es.js`, `dist/index.d.ts`, `dist/style.css`; the built bundle renders (Task 24 Steps 6-7).
2. Visual fidelity is graded by design-sync's preview-grader in the **follow-on** `/design-sync` run (not in this plan).
3. design-sync discovers a non-zero component count — enabled here by the `types`/`typings` field + bundled `.d.ts` barrel (verify during the follow-on run with `cfg.globalName: "ShinyLogicUI"`, `cfg.cssEntry: "dist/style.css"`).
4. Site untouched: `pnpm build` + `pnpm lint` green; no `src/` diff (Task 24 Step 8).

## Follow-on (separate effort)

Run `/design-sync` against `ui/` (package shape). It re-bundles `dist/index.es.js`, authors the conventions header from the real class vocabulary + the `data-theme` root requirement, and uploads to claude.ai/design.
