/**
 * tests/e2e/hero-visible.spec.ts
 *
 * Regression guard: asserts that the primary hero element on each of the 7
 * pages has computed opacity > 0.9 after the rise animation has had time to
 * settle (max rise delay ~0.52 s + 0.7 s duration = ~1.22 s; we wait 1.5 s).
 *
 * This guards against @keyframes rise being dropped from the CSS bundle —
 * the exact bug fixed in foundation.css on 2026-06-25 where .p-sol__hero
 * [data-rise] elements stayed stuck at opacity:0 because the keyframe was
 * missing project-wide.
 *
 * Pages that use [data-rise] in the hero (index, about, solutions, technology,
 * contact): wait for the animation to settle, then assert opacity > 0.9.
 *
 * Pages whose heroes do NOT use [data-rise] (case-studies, careers): assert
 * the hero h1/kicker element is visible with opacity > 0.9 immediately.
 */

import { test, expect } from '@playwright/test';

// The rise animation runs for 0.7 s with a max stagger delay of ~0.52 s.
// We wait 1.5 s (headroom above the 1.22 s settle time) before sampling.
const SETTLE_MS = 1500;

// Pages whose heroes animate via [data-rise] + @keyframes rise
const RISE_PAGES = [
  { path: '.', name: 'index', heroSel: '.hero [data-rise]' },
  { path: 'about.html', name: 'about', heroSel: '.about-hero [data-rise]' },
  { path: 'solutions.html', name: 'solutions', heroSel: '.p-sol__hero [data-rise]' },
  { path: 'technology.html', name: 'technology', heroSel: '.tech-hero [data-rise]' },
  { path: 'contact.html', name: 'contact', heroSel: '.contact-hero [data-rise]' },
] as const;

// Pages whose hero content has opacity:1 by default (no rise animation)
const STATIC_PAGES = [
  { path: 'case-studies.html', name: 'case-studies', heroSel: '.case-hero h1, .case-hero .kicker' },
  {
    path: 'careers.html',
    name: 'careers',
    heroSel: '.p-careers__hero h1, .p-careers__hero .kicker',
  },
] as const;

// ---------------------------------------------------------------------------
// Animated pages — verify rise animation resolves to opacity 1
// ---------------------------------------------------------------------------

for (const { path, name, heroSel } of RISE_PAGES) {
  test(`hero-visible: ${name} — hero [data-rise] opacity settles to 1 after rise animation`, async ({
    page,
  }) => {
    await page.goto(path);

    // Wait for the longest possible rise settle time
    await page.waitForTimeout(SETTLE_MS);

    const el = page.locator(heroSel).first();

    // Element must be in the DOM and visible
    await expect(el).toBeVisible();

    // Computed opacity must have resolved from 0 → 1
    const opacity = await el.evaluate((node) =>
      parseFloat(getComputedStyle(node as HTMLElement).opacity),
    );

    expect(
      opacity,
      `${name}: hero [data-rise] opacity after ${SETTLE_MS} ms (expected > 0.9, got ${opacity})`,
    ).toBeGreaterThan(0.9);
  });
}

// ---------------------------------------------------------------------------
// Static pages — hero content should already be at opacity 1
// ---------------------------------------------------------------------------

for (const { path, name, heroSel } of STATIC_PAGES) {
  test(`hero-visible: ${name} — hero heading/kicker visible (no rise animation)`, async ({
    page,
  }) => {
    await page.goto(path);

    const el = page.locator(heroSel).first();

    await expect(el).toBeVisible();

    const opacity = await el.evaluate((node) =>
      parseFloat(getComputedStyle(node as HTMLElement).opacity),
    );

    expect(
      opacity,
      `${name}: hero element opacity (expected > 0.9, got ${opacity})`,
    ).toBeGreaterThan(0.9);
  });
}
