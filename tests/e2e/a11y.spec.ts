/**
 * tests/e2e/a11y.spec.ts
 *
 * Wave 3 accessibility end-to-end tests.
 * Runs against `pnpm preview` at http://localhost:4173/shiny3/
 *
 * T21  Skip link behaviour
 * T22  Reduced-motion hero belt-and-braces
 * T23  aria-live locale announcement
 * T24  ARIA states (accordion / navToggle / lang buttons)
 * T25  Touch-target minimum (44 × 44 px)
 * T26  Role audit (statusbar / s-arch__stack)
 * T27  axe-core — zero critical/serious violations (7 pages × dark + light)
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ---------------------------------------------------------------------------
// Page list for axe sweeps
// ---------------------------------------------------------------------------
const AXE_PAGES = [
  { path: '.', name: 'index' },
  { path: 'about.html', name: 'about' },
  { path: 'solutions.html', name: 'solutions' },
  { path: 'technology.html', name: 'technology' },
  { path: 'case-studies.html', name: 'case-studies' },
  { path: 'careers.html', name: 'careers' },
  { path: 'contact.html', name: 'contact' },
] as const;

// ---------------------------------------------------------------------------
// T21 — Skip link
// ---------------------------------------------------------------------------
test('T21: skip-link is offscreen until focused; Tab→focus; Enter→#main', async ({ page }) => {
  await page.goto('.');

  // 1. Unfocused: CSS top is -48px → element is above viewport
  const topUnfocused = await page.evaluate(() => {
    const el = document.querySelector<HTMLElement>('.skip-link');
    return el ? parseFloat(getComputedStyle(el).top) : null;
  });
  expect(topUnfocused, '.skip-link CSS top should be < 0 when not focused').toBeLessThan(0);

  // 2. Tab once — first interactive element from top should be .skip-link
  await page.keyboard.press('Tab');
  const focusedCls = await page.evaluate(() => document.activeElement?.className ?? '');
  expect(focusedCls, 'first Tab should land on .skip-link').toContain('skip-link');

  // 3. After focus: CSS top becomes 8px (visible)
  const topFocused = await page.evaluate(() => {
    const el = document.querySelector<HTMLElement>('.skip-link');
    return el ? parseFloat(getComputedStyle(el).top) : null;
  });
  expect(topFocused, '.skip-link CSS top should be ≥ 0 when focused').toBeGreaterThanOrEqual(0);

  // 4. Press Enter — focus should move to #main (tabindex="-1")
  await page.keyboard.press('Enter');
  await page.waitForTimeout(80); // allow hash navigation to settle
  const activeId = await page.evaluate(() => document.activeElement?.id ?? '');
  expect(activeId, 'Enter on skip-link should move focus to #main').toBe('main');
});

// ---------------------------------------------------------------------------
// T22 — Reduced-motion: hero transforms are neutralised after scroll
// ---------------------------------------------------------------------------
test('T22: hero__inner and hero__video have no scroll transform at 600 px (reduced-motion)', async ({
  page,
}) => {
  // Emulate before navigation so that:
  //   a) window.matchMedia('(prefers-reduced-motion: reduce)').matches === true when JS runs
  //   b) CSS @media (prefers-reduced-motion: reduce) applies immediately
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('.');
  await page.evaluate(() => window.scrollBy(0, 600));
  // Give rAF/JS a tick to (non-)fire
  await page.waitForTimeout(120);

  const { innerT, videoT } = await page.evaluate(() => {
    const inner = document.querySelector<HTMLElement>('.hero__inner');
    const video = document.querySelector<HTMLElement>('.hero__video');
    return {
      innerT: inner ? getComputedStyle(inner).transform : null,
      videoT: video ? getComputedStyle(video).transform : null,
    };
  });

  const identity = ['none', 'matrix(1, 0, 0, 1, 0, 0)'];
  expect(
    identity.includes(innerT ?? ''),
    `.hero__inner transform should be identity/none; got: ${innerT}`,
  ).toBe(true);
  expect(
    identity.includes(videoT ?? ''),
    `.hero__video transform should be identity/none; got: ${videoT}`,
  ).toBe(true);
});

// ---------------------------------------------------------------------------
// T23 — aria-live locale announcement
// ---------------------------------------------------------------------------
test('T23: clicking EN announces to #langAnnounce (aria-live="polite")', async ({ page }) => {
  await page.goto('.');

  // Reset locale so switching to EN fires a real change
  await page.evaluate(() => localStorage.removeItem('sl-lang'));
  await page.reload();

  const liveRegion = page.locator('#langAnnounce');

  // Live region exists and has correct attribute
  await expect(liveRegion).toHaveAttribute('aria-live', 'polite');

  // Initially empty
  await expect(liveRegion).toHaveText('');

  // Click EN in the desktop nav langswitch
  await page.locator('.nav__links .langswitch__btn[data-lang="en"]').click();

  // Announcement text must be non-empty after locale change
  const announcement = await liveRegion.textContent();
  expect(announcement?.trim() ?? '', '#langAnnounce should have announcement text').not.toBe('');
});

// ---------------------------------------------------------------------------
// T24 — ARIA states
// ---------------------------------------------------------------------------
test('T24: accordion aria-expanded cycles false→true (L2) and true→false (L1)', async ({
  page,
}) => {
  await page.goto('.');

  const triggers = page.locator('.s-arch__header');
  const l1 = triggers.nth(0); // starts open (aria-expanded="true")
  const l2 = triggers.nth(1); // starts closed (aria-expanded="false")

  // Verify initial state
  await expect(l1).toHaveAttribute('aria-expanded', 'true');
  await expect(l2).toHaveAttribute('aria-expanded', 'false');

  // Click L2: opens L2 (false→true), closes L1 (true→false)
  await l2.click();
  await expect(l2).toHaveAttribute('aria-expanded', 'true');
  await expect(l1).toHaveAttribute('aria-expanded', 'false');

  // Click L1: opens L1 (false→true), closes L2 (true→false)
  await l1.click();
  await expect(l1).toHaveAttribute('aria-expanded', 'true');
  await expect(l2).toHaveAttribute('aria-expanded', 'false');
});

test('T24: #navToggle aria-expanded toggles on mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('.');

  const toggle = page.locator('#navToggle');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('T24: lang buttons reflect aria-pressed for active locale', async ({ page }) => {
  await page.goto('.');
  await page.evaluate(() => localStorage.removeItem('sl-lang'));
  await page.reload();

  const zhBtn = page.locator('.nav__links .langswitch__btn[data-lang="zh-Hant"]');
  const enBtn = page.locator('.nav__links .langswitch__btn[data-lang="en"]');

  // Default: zh-Hant active
  await expect(zhBtn).toHaveAttribute('aria-pressed', 'true');
  await expect(enBtn).toHaveAttribute('aria-pressed', 'false');

  // Switch to EN
  await enBtn.click();
  await expect(enBtn).toHaveAttribute('aria-pressed', 'true');
  await expect(zhBtn).toHaveAttribute('aria-pressed', 'false');
});

// ---------------------------------------------------------------------------
// T25 — Touch targets ≥ 44 × 44 px
// ---------------------------------------------------------------------------

/** Returns failure strings for every VISIBLE element matching selector. */
async function auditTargets(
  page: Parameters<typeof test>[1] extends (...args: infer A) => unknown
    ? never
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
  selector: string,
  requireWidth: boolean,
  label: string,
): Promise<string[]> {
  const els = page.locator(selector);
  const count: number = await els.count();
  const failures: string[] = [];
  for (let i = 0; i < count; i++) {
    const el = els.nth(i);
    if (!(await el.isVisible())) continue;
    const box = await el.boundingBox();
    if (!box) continue;
    if (requireWidth && box.width < 44) {
      failures.push(`${label}[${i}] w=${box.width.toFixed(1)} (need ≥44)`);
    }
    if (box.height < 44) {
      failures.push(`${label}[${i}] h=${box.height.toFixed(1)} (need ≥44)`);
    }
  }
  return failures;
}

test('T25: touch targets on index — desktop interactive elements', async ({ page }) => {
  await page.goto('.');
  const failures: string[] = [];

  // Desktop nav langswitch (visible on desktop ≥769 px)
  failures.push(
    ...(await auditTargets(page, '.nav__links .langswitch__btn', true, 'nav-lang-btn')),
  );

  // Theme toggle (desktop)
  failures.push(...(await auditTargets(page, '#themeToggle', true, 'themeToggle')));

  // CTA button in nav
  failures.push(...(await auditTargets(page, '.nav__cta', true, 'nav-cta')));

  // Nav text links — height only (width not required for inline links)
  failures.push(...(await auditTargets(page, '.nav__link', false, 'nav__link')));

  expect(failures, `Touch-target failures on index:\n${failures.join('\n')}`).toHaveLength(0);
});

test('T25: touch targets on index — mobile navToggle', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('.');
  const failures = await auditTargets(page, '#navToggle', true, 'navToggle');
  expect(failures, `navToggle size failure:\n${failures.join('\n')}`).toHaveLength(0);
});

test('T25: touch targets on contact — form controls', async ({ page }) => {
  await page.goto('contact.html');
  const failures: string[] = [];

  failures.push(...(await auditTargets(page, '.s-form__input', true, 's-form__input')));
  failures.push(...(await auditTargets(page, '.s-form__select', true, 's-form__select')));
  failures.push(
    ...(await auditTargets(page, '#contactForm button[type="submit"]', true, 'submit-btn')),
  );

  expect(failures, `Touch-target failures on contact:\n${failures.join('\n')}`).toHaveLength(0);
});

// ---------------------------------------------------------------------------
// T26 — Role audit
// ---------------------------------------------------------------------------
test('T26: .statusbar has no role="presentation" and has an aria-label', async ({ page }) => {
  await page.goto('.');
  const statusbar = page.locator('.statusbar');
  await expect(statusbar).not.toHaveAttribute('role', 'presentation');
  const label = await statusbar.getAttribute('aria-label');
  expect(label?.trim() ?? '', '.statusbar must have a non-empty aria-label').not.toBe('');
});

test('T26: .s-arch__stack uses role="presentation"; decorative rail is aria-hidden', async ({
  page,
}) => {
  await page.goto('.');
  // The stack is a layout container for interactive accordion buttons.
  // It correctly uses role="presentation" (not aria-hidden, which would hide
  // the interactive accordion buttons from the accessibility tree).
  await expect(page.locator('.s-arch__stack')).toHaveAttribute('role', 'presentation');
  // The decorative animated rail inside the stack IS aria-hidden
  await expect(page.locator('.s-arch__rail')).toHaveAttribute('aria-hidden', 'true');
});

// ---------------------------------------------------------------------------
// T27 — axe-core: zero critical/serious violations on all 7 pages × 2 themes
// ---------------------------------------------------------------------------

for (const { path, name } of AXE_PAGES) {
  for (const theme of ['dark', 'light'] as const) {
    test(`T27 axe(${theme}): ${name}`, async ({ page }) => {
      // Emulate reduced-motion BEFORE navigation so the CSS rule
      //   @media (prefers-reduced-motion: reduce) { .reveal { opacity:1; transform:none } }
      // fires immediately, preventing false low-contrast reports on opacity:0 reveal sections.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      // Apply theme via data attribute (no reload needed — CSS uses [data-theme])
      await page.evaluate(
        (t: string) => document.documentElement.setAttribute('data-theme', t),
        theme,
      );

      // Exclude elements that are aria-hidden (not in the a11y tree) and their
      // descendants. WCAG 1.4.3 exempts "pure decoration" text from contrast
      // requirements; opacity-based design textures (ghost section numbers,
      // monospace telemetry annotations) are all aria-hidden by authoring intent.
      const results = await new AxeBuilder({ page })
        .exclude('[aria-hidden="true"]')
        .exclude('[aria-hidden="true"] *')
        .analyze();

      const critical = results.violations.filter((v) => v.impact === 'critical');
      const serious = results.violations.filter((v) => v.impact === 'serious');

      const fmt = (vs: typeof critical) =>
        vs
          .map(
            (v) =>
              `  [${v.id}] ${v.description}\n    targets: ${v.nodes
                .slice(0, 3)
                .map((n) => n.target.join(' '))
                .join(', ')}`,
          )
          .join('\n');

      expect(
        critical,
        `Critical axe violations on ${name} (${theme}):\n${fmt(critical)}`,
      ).toHaveLength(0);
      expect(
        serious,
        `Serious axe violations on ${name} (${theme}):\n${fmt(serious)}`,
      ).toHaveLength(0);
    });
  }
}
