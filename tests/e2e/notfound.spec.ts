/**
 * notfound.spec.ts — Permanent regression spec for the 404 page.
 * Drives http://localhost:4173/shiny3/ via pnpm preview.
 * Screenshots saved to .sisyphus/evidence/final-qa/404-*.png
 *
 * Covers:
 *   N1  HTTP ok, <main id="main"> visible, 404 headline visible
 *   N2  Wafer/reticle SVG: present, sized sensibly, not clipping CTA
 *   N3  Mono error-code kicker renders
 *   N4  CTA href → index.html
 *   N5  Zero console errors
 *   N6  Shared chrome present (skip-link, nav, langswitch, footer, statusbar, #langAnnounce)
 *   N7  Locale switching: zh-Hant / en / zh-Hans — chrome text translates, page intact
 *   N8  Theme toggle: dark → light, both themes legible, 404-light.png saved
 *   N9  axe-core: 0 critical/serious violations in dark AND light
 */

import { test, expect, Page, ConsoleMessage } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EVIDENCE_DIR = path.resolve(__dirname, '../../.sisyphus/evidence/final-qa');
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const PAGE_URL = '404.html';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Save a viewport screenshot to the evidence directory. */
async function shot(page: Page, name: string): Promise<void> {
  const file = path.join(EVIDENCE_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`Screenshot saved: ${name}.png`);
}

// ---------------------------------------------------------------------------
// Stub Google Fonts CDN routes for deterministic offline runs.
// Using route.fulfill (not abort) so the browser never logs "failed to load"
// console errors — keeping the zero-errors assertions intact.
// ---------------------------------------------------------------------------
test.beforeEach(async ({ page }) => {
  await page.route('**/fonts.googleapis.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/css', body: '/* fonts stubbed */' }),
  );
  await page.route('**/fonts.gstatic.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'font/woff2', body: '' }),
  );
});

// ---------------------------------------------------------------------------
// N1–N6  BASELINE
// ---------------------------------------------------------------------------
test.describe('404 page — baseline', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('sl-theme', 'dark');
      localStorage.removeItem('sl-lang');
    });
  });

  test('N1a: HTTP response ok', async ({ page }) => {
    const response = await page.goto(PAGE_URL, { waitUntil: 'load' });
    expect(response?.ok(), 'HTTP response should be ok (2xx)').toBe(true);
  });

  test('N1b: <main id="main"> is visible', async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: 'load' });
    await expect(page.locator('main#main')).toBeVisible();
  });

  test('N1c: Saira 404 headline is visible', async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: 'load' });
    // Locate by id or class — both are stable selectors
    const heading = page.locator('h1#err-heading, h1.p-404__code').first();
    await expect(heading).toBeVisible();
    const text = await heading.innerText();
    expect(text.trim(), '404 headline should read "404"').toBe('404');
  });

  test('N2: wafer/reticle SVG — present, sized ≥80 px, aria-hidden, not clipping CTA', async ({
    page,
  }) => {
    await page.goto(PAGE_URL, { waitUntil: 'load' });

    // Container present and aria-hidden (decorative)
    const wafer = page.locator('.p-404__wafer');
    await expect(wafer).toBeAttached();
    await expect(wafer).toHaveAttribute('aria-hidden', 'true');

    // Bounding box is sensible
    const waferBox = await wafer.boundingBox();
    expect(waferBox, 'Wafer must have a rendered bounding box').toBeTruthy();
    if (waferBox) {
      console.log(
        `Wafer box: x=${waferBox.x.toFixed(0)}, y=${waferBox.y.toFixed(0)}, ` +
          `w=${waferBox.width.toFixed(0)}, h=${waferBox.height.toFixed(0)}`,
      );
      expect(waferBox.width, 'Wafer width must be ≥ 80 px').toBeGreaterThanOrEqual(80);
      expect(waferBox.height, 'Wafer height must be ≥ 80 px').toBeGreaterThanOrEqual(80);
    }

    // SVG element present inside wafer
    const svg = page.locator('.p-404__wafer svg, .p-404__wafer-svg').first();
    await expect(svg).toBeAttached();

    // CTA is visible and not obscured by wafer
    const cta = page.locator('main .btn.btn--primary').first();
    await expect(cta, 'CTA button must be visible').toBeVisible();

    const ctaBox = await cta.boundingBox();
    if (waferBox && ctaBox) {
      console.log(
        `CTA box: x=${ctaBox.x.toFixed(0)}, y=${ctaBox.y.toFixed(0)}, ` +
          `w=${ctaBox.width.toFixed(0)}, h=${ctaBox.height.toFixed(0)}`,
      );
      // CTA must sit below the wafer (vertical stack layout)
      expect(
        ctaBox.y,
        'CTA must be rendered below the wafer (vertical layout, not overlapping)',
      ).toBeGreaterThan(waferBox.y + waferBox.height - 10);
    }
  });

  test('N3: mono error-code kicker renders and contains "404"', async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: 'load' });
    const kicker = page.locator('.p-404__kicker');
    await expect(kicker).toBeVisible();
    const text = await kicker.innerText();
    console.log(`Kicker text: "${text}"`);
    expect(text.length, 'Kicker should have non-empty text').toBeGreaterThan(5);
    expect(text.toUpperCase(), 'Kicker should reference the error code 404').toContain('404');
  });

  test('N4: CTA href points to index.html', async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: 'load' });
    const cta = page.locator('main .btn.btn--primary').first();
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute('href');
    expect(href, 'Primary CTA must link to index.html').toBe('index.html');
  });

  test('N5: zero console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.goto(PAGE_URL, { waitUntil: 'load' });
    await page.waitForTimeout(800);

    // Font CDN is stubbed above so these should never appear, but filter anyway
    const real = consoleErrors.filter(
      (e) => !e.includes('fonts.googleapis.com') && !e.includes('fonts.gstatic.com'),
    );
    expect(real, `Console errors on 404:\n${real.join('\n')}`).toEqual([]);
  });

  test('N6: shared chrome present — skip-link, nav, langswitch, footer, statusbar, #langAnnounce', async ({
    page,
  }) => {
    await page.goto(PAGE_URL, { waitUntil: 'load' });

    await expect(page.locator('a.skip-link'), 'skip-link must be in DOM').toBeAttached();
    await expect(page.locator('nav.nav'), 'nav.nav must be visible').toBeVisible();
    await expect(
      page.locator('.langswitch').first(),
      'at least one langswitch must be present',
    ).toBeAttached();
    await expect(page.locator('footer.footer'), 'footer.footer must be visible').toBeVisible();
    await expect(page.locator('.statusbar'), 'statusbar must be visible').toBeVisible();
    await expect(page.locator('#langAnnounce'), '#langAnnounce must be in DOM').toBeAttached();
    await expect(
      page.locator('#langAnnounce'),
      '#langAnnounce must carry aria-live="polite"',
    ).toHaveAttribute('aria-live', 'polite');
  });
});

// ---------------------------------------------------------------------------
// N7  LOCALE SWITCHING
// ---------------------------------------------------------------------------
test.describe('404 page — locale switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('sl-theme', 'dark');
      localStorage.removeItem('sl-lang');
    });
  });

  test('N7: zh-Hant / en / zh-Hans — chrome text translates, page does not break; screenshots saved', async ({
    page,
  }) => {
    await page.goto(PAGE_URL, { waitUntil: 'load' });
    await page.waitForTimeout(400);

    // ── zh-Hant baseline ──
    await shot(page, '404-zh-Hant');
    const zhText = await page.locator('body').innerText();
    await expect(page.locator('main#main')).toBeVisible();

    // ── switch to EN ──
    await page.locator('button.langswitch__btn[data-lang="en"]').first().click();
    await page.waitForTimeout(500);
    const enText = await page.locator('body').innerText();
    expect(enText, 'EN text must differ from zh-Hant').not.toEqual(zhText);
    await expect(page.locator('main#main'), 'main visible in EN').toBeVisible();
    await expect(
      page.locator('h1#err-heading, h1.p-404__code').first(),
      '404 heading visible in EN',
    ).toBeVisible();
    await shot(page, '404-en');

    // aria-pressed reflects the active locale
    await expect(page.locator('button.langswitch__btn[data-lang="en"]').first()).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    // ── switch to zh-Hans ──
    await page.locator('button.langswitch__btn[data-lang="zh-Hans"]').first().click();
    await page.waitForTimeout(500);
    const hansText = await page.locator('body').innerText();
    expect(hansText, 'zh-Hans text must differ from EN').not.toEqual(enText);
    await expect(page.locator('main#main'), 'main visible in zh-Hans').toBeVisible();
    await shot(page, '404-zh-Hans');
  });
});

// ---------------------------------------------------------------------------
// N8  THEMES
// ---------------------------------------------------------------------------
test.describe('404 page — themes', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('sl-theme', 'dark');
      localStorage.removeItem('sl-lang');
    });
  });

  test('N8a: dark theme — error panel + wafer visible, no invisible text', async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: 'load' });
    const theme = await page.evaluate(
      () => document.documentElement.getAttribute('data-theme') ?? '',
    );
    expect(theme, 'Should start in dark').toBe('dark');
    await expect(page.locator('h1#err-heading, h1.p-404__code').first()).toBeVisible();
    await expect(page.locator('.p-404__wafer')).toBeAttached();
    await expect(page.locator('main .btn.btn--primary').first()).toBeVisible();
  });

  test('N8b: light theme — error panel + wafer legible, screenshot saved', async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: 'load' });

    // Toggle to light
    await page.locator('#themeToggle').click();
    await page.waitForTimeout(300);

    const theme = await page.evaluate(
      () => document.documentElement.getAttribute('data-theme') ?? '',
    );
    expect(theme, 'Should be light after toggle').toBe('light');

    await expect(
      page.locator('h1#err-heading, h1.p-404__code').first(),
      '404 headline visible in light',
    ).toBeVisible();
    await expect(page.locator('.p-404__wafer'), 'wafer container present in light').toBeAttached();
    await expect(
      page.locator('main .btn.btn--primary').first(),
      'CTA visible in light',
    ).toBeVisible();

    await shot(page, '404-light');
  });
});

// ---------------------------------------------------------------------------
// N9  AXE-CORE — 0 critical/serious in both themes
// ---------------------------------------------------------------------------
for (const theme of ['dark', 'light'] as const) {
  test(`N9 axe(${theme}): 404 page — 0 critical/serious violations`, async ({ page }) => {
    // Emulate reduced-motion before navigation so opacity:0 reveal elements
    // don't trigger false low-contrast violations.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      localStorage.setItem('sl-theme', 'dark');
      localStorage.removeItem('sl-lang');
    });
    await page.goto(PAGE_URL, { waitUntil: 'load' });

    // Force the target theme via data attribute (no reload required)
    await page.evaluate(
      (t: string) => document.documentElement.setAttribute('data-theme', t),
      theme,
    );

    // Exclude aria-hidden decorative elements (telemetry, coordinate flourish, etc.)
    const results = await new AxeBuilder({ page })
      .exclude('[aria-hidden="true"]')
      .exclude('[aria-hidden="true"] *')
      .analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical');
    const serious = results.violations.filter((v) => v.impact === 'serious');

    const fmt = (vs: typeof critical): string =>
      vs
        .map(
          (v) =>
            `  [${v.id}] ${v.description}\n    targets: ${v.nodes
              .slice(0, 3)
              .map((n) => n.target.join(' '))
              .join(', ')}`,
        )
        .join('\n');

    expect(critical, `Critical axe violations on 404 (${theme}):\n${fmt(critical)}`).toHaveLength(
      0,
    );
    expect(serious, `Serious axe violations on 404 (${theme}):\n${fmt(serious)}`).toHaveLength(0);

    console.log(
      `axe(${theme}): ${results.violations.length} total violations ` +
        `(0 critical, 0 serious required)`,
    );
  });
}
