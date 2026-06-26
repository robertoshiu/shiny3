/**
 * tests/e2e/pages.spec.ts
 *
 * Integration test suite for ShinyLogic v3 — covers all 7 HTML pages.
 * Runs against `pnpm preview` (vite preview at http://localhost:4173/shiny3/).
 */

import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Page definitions
// ---------------------------------------------------------------------------

const PAGES = [
  { path: '.', name: 'index', hasNavActive: false },
  { path: 'about.html', name: 'about', hasNavActive: true },
  { path: 'solutions.html', name: 'solutions', hasNavActive: true },
  { path: 'technology.html', name: 'technology', hasNavActive: true },
  { path: 'case-studies.html', name: 'case-studies', hasNavActive: true },
  { path: 'careers.html', name: 'careers', hasNavActive: true },
  { path: 'contact.html', name: 'contact', hasNavActive: true },
] as const;

// ---------------------------------------------------------------------------
// CHECK 1: each page loads, main visible, zero console errors, active nav
// ---------------------------------------------------------------------------

for (const { path, name, hasNavActive } of PAGES) {
  test(`${name}: loads ok, <main> visible, zero console errors, active nav`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const response = await page.goto(path);
    // HTTP status should be OK (200-series)
    expect(response?.status() ?? 200).toBeLessThan(400);

    // <main> is visible
    await expect(page.locator('main')).toBeVisible();

    // Zero console errors
    expect(consoleErrors, `console errors on ${name}`).toHaveLength(0);

    // Active nav link: all pages except index carry aria-current="page" in the header
    if (hasNavActive) {
      await expect(page.locator('header [aria-current="page"]').first()).toBeVisible();
    }
  });
}

// ---------------------------------------------------------------------------
// CHECK 2: lang switcher — click EN, text changes + localStorage, reload persists,
//          click 繁 reverts
// ---------------------------------------------------------------------------

test('lang switcher: EN click changes text, localStorage set, reload persists, 繁 reverts', async ({
  page,
}) => {
  await page.goto('.');

  // Reset to default zh-Hant to make the test deterministic
  await page.evaluate(() => localStorage.removeItem('sl-lang'));
  await page.reload();

  // Baseline: zh-Hant
  const aboutEl = page.locator('[data-i18n="nav.about"]').first();
  await expect(aboutEl).toHaveText('關於');

  // Click EN (desktop nav langswitch)
  await page.locator('.nav__links .langswitch__btn[data-lang="en"]').click();

  // Text updated dynamically
  await expect(aboutEl).toHaveText('About');

  // Persistence in localStorage
  const storedLang = await page.evaluate(() => localStorage.getItem('sl-lang'));
  expect(storedLang).toBe('en');

  // Reload — still EN
  await page.reload();
  await expect(page.locator('[data-i18n="nav.about"]').first()).toHaveText('About');

  // Click 繁 — reverts to zh-Hant
  await page.locator('.nav__links .langswitch__btn[data-lang="zh-Hant"]').click();
  await expect(page.locator('[data-i18n="nav.about"]').first()).toHaveText('關於');
});

// ---------------------------------------------------------------------------
// CHECK 3: theme toggle — data-theme flips, [data-theme-icon] has SVG, persists
// ---------------------------------------------------------------------------

test('theme toggle: data-theme flips, [data-theme-icon] has SVG, persists on reload', async ({
  page,
}) => {
  await page.goto('.');

  // Start from a known state (dark) by clearing stored theme
  await page.evaluate(() => localStorage.removeItem('sl-theme'));
  await page.reload();

  const html = page.locator('html');
  const beforeTheme = await html.getAttribute('data-theme');
  expect(['dark', 'light']).toContain(beforeTheme);

  // Toggle
  await page.locator('#themeToggle').click();

  const afterTheme = await html.getAttribute('data-theme');
  expect(afterTheme).not.toBe(beforeTheme);
  expect(['dark', 'light']).toContain(afterTheme);

  // Every [data-theme-icon] span should have exactly one SVG child
  const icons = page.locator('[data-theme-icon]');
  const iconCount = await icons.count();
  expect(iconCount, '[data-theme-icon] count').toBeGreaterThan(0);
  for (let i = 0; i < iconCount; i++) {
    await expect(icons.nth(i).locator('svg')).toHaveCount(1);
  }

  // localStorage updated
  const stored = await page.evaluate(() => localStorage.getItem('sl-theme'));
  expect(stored).toBe(afterTheme);

  // Reload — theme persists
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', afterTheme as string);
});

// ---------------------------------------------------------------------------
// CHECK 4: mobile nav — toggle opens / closes #navMobile
// ---------------------------------------------------------------------------

test('mobile nav: #navToggle opens #navMobile (aria-expanded + visibility), click closes', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('.');

  const toggle = page.locator('#navToggle');
  const navMobile = page.locator('#navMobile');

  // Initially collapsed
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navMobile).not.toBeVisible();

  // Open
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(navMobile).toBeVisible();

  // Close
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  // Wait for the close transition to complete before asserting not-visible
  await expect(navMobile).not.toBeVisible();
});
