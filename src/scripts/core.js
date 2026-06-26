/**
 * core.js — ESM entry point for ShinyLogic
 *
 * Module graph:
 *   core.js → i18n.js  → ../i18n/dict.js
 *   core.js → icons.js   (theme SVGs via paintThemeIcons)
 *
 * Cross-module signal: 'sl:langchange' CustomEvent on document
 *   dispatched by i18n.js after every language change;
 *   consumed here by the theme manager to re-assert theme-aware aria-label.
 */

import { initI18n } from './i18n.js';
import { paintThemeIcons } from './icons.js';

// =============================================================================
// IIFE1 — IntersectionObserver scroll reveal, count-up counters,
//          nav scrolled state, mobile menu toggle, smooth anchors
// =============================================================================

function formatNumber(value, decimals) {
  const n = Number(value).toFixed(decimals);
  const parts = n.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function renderCounter(el, value) {
  const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  el.textContent = prefix + formatNumber(value, decimals) + suffix;
}

function animateCounter(el, reduceMotion) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';

  const target = parseFloat(el.getAttribute('data-count'));
  if (isNaN(target)) return;
  const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

  // Reserve width to avoid layout shift.
  renderCounter(el, target);
  const finalWidth = el.getBoundingClientRect().width;
  if (finalWidth) el.style.minWidth = finalWidth + 'px';

  if (reduceMotion) {
    renderCounter(el, target);
    return;
  }

  const duration = 1400;
  let start = null;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(ts) {
    if (start === null) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const current = target * easeOut(p);
    renderCounter(el, decimals > 0 ? current : Math.round(current));
    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      renderCounter(el, target);
    }
  }
  renderCounter(el, 0);
  requestAnimationFrame(step);
}

function applyStagger(root) {
  const kids = root.querySelectorAll('[data-stagger] > *');
  kids.forEach(function (child, i) {
    if (!child.style.getPropertyValue('--i')) {
      child.style.setProperty('--i', i);
    }
  });
}

function fireCounters(scope, reduceMotion) {
  scope.querySelectorAll('[data-count]').forEach(function (c) {
    animateCounter(c, reduceMotion);
  });
}

function initReveal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A4: where CSS scroll-driven timelines are supported (and motion is allowed),
  // CSS owns .reveal entry via animation-timeline:view() — don't also add .is-in,
  // or the reveal animates twice.
  const SD_SUPPORTED =
    window.CSS &&
    CSS.supports &&
    CSS.supports('animation-timeline: view()') &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

  const revealEls = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) {
      el.classList.add('is-in');
      fireCounters(el, reduceMotion);
    });
    return;
  }

  const io = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        applyStagger(el);
        if (!SD_SUPPORTED) el.classList.add('is-in');
        fireCounters(el, reduceMotion);
        obs.unobserve(el);
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
  );

  revealEls.forEach(function (el) {
    io.observe(el);
  });

  // Counters that aren't inside a .reveal (defensive).
  document.querySelectorAll('[data-count]').forEach(function (c) {
    if (!c.closest('.reveal')) {
      const io2 = new IntersectionObserver(
        function (es, o) {
          es.forEach(function (e) {
            if (e.isIntersecting) {
              animateCounter(e.target, reduceMotion);
              o.unobserve(e.target);
            }
          });
        },
        { threshold: 0.4 },
      );
      io2.observe(c);
    }
  });
}

function initNav() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.querySelector('.nav');
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');

  if (nav) {
    const onScroll = function () {
      if (window.scrollY > 24) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function closeMenu() {
    if (!toggle || !mobile) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '開啟選單');
    mobile.classList.remove('is-open');
  }

  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? '開啟選單' : '關閉選單');
      mobile.classList.toggle('is-open', !open);
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Smooth anchor scrolling (respect reduced motion).
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      if (history.pushState) history.pushState(null, '', id);
      // Restore focus to programmatically-focusable targets (skip links, landmarks with tabindex).
      // Without this, e.preventDefault() above prevents the browser from natively focusing #main.
      if (target.hasAttribute('tabindex')) {
        target.focus({ preventScroll: true });
      }
    });
  });
}

// =============================================================================
// IIFE2 — #architecture accordion (single-open, keyboard nav, aria-expanded)
// =============================================================================

function initArchitecture() {
  const INIT_KEY = 'data-arch-init';
  const section = document.getElementById('architecture');
  if (!section || section.hasAttribute(INIT_KEY)) return;
  section.setAttribute(INIT_KEY, '1');

  const buttons = Array.from(section.querySelectorAll('.s-arch__header'));
  if (buttons.length === 0) return;

  function getBody(btn) {
    const id = btn.getAttribute('aria-controls');
    return id ? section.querySelector('#' + id) : null;
  }

  function getLayer(btn) {
    return btn.closest('.s-arch__layer');
  }

  /**
   * Open one layer; close all others (single-open accordion).
   * Reassigned below when prefers-reduced-motion is active.
   */
  let openLayer = function (targetBtn) {
    buttons.forEach(function (btn) {
      const body = getBody(btn);
      const layer = getLayer(btn);
      const isTarget = btn === targetBtn;

      btn.setAttribute('aria-expanded', isTarget ? 'true' : 'false');

      if (body) {
        if (isTarget) {
          /* open: remove hidden attr first so CSS transition can animate */
          body.removeAttribute('hidden');
          /* rAF pair: one frame to let display kick in, then class for transition */
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              body.classList.add('is-open');
            });
          });
        } else {
          /* close: remove class, wait for transition, then re-add hidden */
          body.classList.remove('is-open');
          body.addEventListener('transitionend', function onEnd(e) {
            /* only act on the max-height transition to avoid early trigger */
            if (e.propertyName !== 'max-height') return;
            body.removeEventListener('transitionend', onEnd);
            /* only hide if it's still supposed to be closed */
            if (btn.getAttribute('aria-expanded') !== 'true') {
              body.setAttribute('hidden', '');
            }
          });
        }
      }

      if (layer) {
        layer.setAttribute('data-active', isTarget ? 'true' : 'false');
      }
    });
  };

  /* ── Initialise from current DOM state ──────────────────────────────────── */
  buttons.forEach(function (btn) {
    const body = getBody(btn);
    const layer = getLayer(btn);
    const expanded = btn.getAttribute('aria-expanded') === 'true';

    if (body) {
      if (expanded) {
        body.removeAttribute('hidden');
        /* open immediately, no transition on init */
        body.classList.add('is-open');
      } else {
        body.setAttribute('hidden', '');
        body.classList.remove('is-open');
      }
    }

    if (layer) {
      layer.setAttribute('data-active', expanded ? 'true' : 'false');
    }
  });

  /* ── Click handler ───────────────────────────────────────────────────────── */
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      /* toggle: clicking an open layer keeps it open (spec: single-open) */
      if (btn.getAttribute('aria-expanded') === 'true') return;
      openLayer(btn);
    });
  });

  /* ── Keyboard: ArrowUp / ArrowDown move focus between headers ───────────── */
  section.addEventListener('keydown', function (e) {
    if (!['ArrowUp', 'ArrowDown'].includes(e.key)) return;

    const active = document.activeElement;
    const idx = buttons.indexOf(active);
    if (idx === -1) return;

    e.preventDefault(); /* prevent page scroll */

    if (e.key === 'ArrowDown') {
      const next = buttons[idx + 1];
      if (next) next.focus();
    } else {
      const prev = buttons[idx - 1];
      if (prev) prev.focus();
    }
  });

  /* ── Home / End keys ─────────────────────────────────────────────────────── */
  section.addEventListener('keydown', function (e) {
    if (e.key === 'Home' && buttons.includes(document.activeElement)) {
      e.preventDefault();
      buttons[0].focus();
    }
    if (e.key === 'End' && buttons.includes(document.activeElement)) {
      e.preventDefault();
      buttons[buttons.length - 1].focus();
    }
  });

  /* ── Reduced motion: instant open/close (no CSS transition) ─────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReduced.matches) {
    /* Override openLayer to skip requestAnimationFrame double-tap */
    const originalOpenLayer = openLayer;
    openLayer = function (targetBtn) {
      // eslint-disable-line no-func-assign
      buttons.forEach(function (btn) {
        const body = getBody(btn);
        const layer = getLayer(btn);
        const isTarget = btn === targetBtn;
        btn.setAttribute('aria-expanded', isTarget ? 'true' : 'false');
        if (body) {
          if (isTarget) {
            body.removeAttribute('hidden');
            body.classList.add('is-open');
          } else {
            body.classList.remove('is-open');
            body.setAttribute('hidden', '');
          }
        }
        if (layer) layer.setAttribute('data-active', isTarget ? 'true' : 'false');
      });
    };
    void originalOpenLayer; /* suppress unused-var warning */

    /* Re-wire click handlers with the synchronous version */
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.getAttribute('aria-expanded') === 'true') return;
        openLayer(btn);
      });
    });
  }
}

// =============================================================================
// IIFE3 — Compute dot grid (240 dots; dual-target: home + technology page)
// =============================================================================

function initComputeDots() {
  const TOTAL_DOTS = 240;
  const GOLD_COUNT = 24; // sparse decorative accent
  const STAGGER_MS = 8; // fast stagger wave across the field
  const BASE_DELAY = 120; // initial pause after .is-in fires

  // Both the home (#compute) and Technology (#tech-compute) pages render the
  // same decorative compute-fabric field. They share the layout but use
  // page-scoped BEM class names, so each target carries its own class scheme.
  //   home : .s-compute__dot.is-cyan / .is-gold  + staggered .is-visible wave
  //   tech : .s-tech-compute__dot--cyan / --gold (no wave; CSS shows on render)
  const TARGETS = [
    {
      containerId: 'compute-dots',
      sectionId: 'compute',
      dotClass: 's-compute__dot',
      cyanClass: 'is-cyan',
      goldClass: 'is-gold',
      wave: true,
    },
    {
      containerId: 'tech-compute-dots',
      sectionId: 'tech-compute',
      dotClass: 's-tech-compute__dot',
      cyanClass: 's-tech-compute__dot--cyan',
      goldClass: 's-tech-compute__dot--gold',
      wave: false,
    },
  ];

  for (let t = 0; t < TARGETS.length; t++) {
    initGrid(TARGETS[t]);
  }

  function initGrid(cfg) {
    /* ── Guard — idempotent ───────────────────────────────────────────────── */
    const container = document.getElementById(cfg.containerId);
    if (!container) return;
    if (container.dataset.rendered === 'true') return;
    container.dataset.rendered = 'true';

    /* ── Build ordered dot sequence ──────────────────────────────────────── */
    // Spread the accent dots evenly across the grid rather than clustering
    // them at the end — reflects real NVLink topology diversity.
    const goldPositions = new Set();
    const step = TOTAL_DOTS / GOLD_COUNT;
    for (let g = 0; g < GOLD_COUNT; g++) {
      goldPositions.add(Math.round(g * step + step / 2));
    }
    const ordered = [];
    for (let k = 0; k < TOTAL_DOTS; k++) {
      ordered.push(goldPositions.has(k) ? 'gold' : 'cyan');
    }

    /* ── Render dots into DOM ────────────────────────────────────────────── */
    const fragment = document.createDocumentFragment();
    const dots = [];

    for (let d = 0; d < TOTAL_DOTS; d++) {
      const isGold = ordered[d] === 'gold';
      const el = document.createElement('span');
      el.className = cfg.dotClass + ' ' + (isGold ? cfg.goldClass : cfg.cyanClass);
      el.setAttribute(
        'title',
        isGold ? 'HGX B300 — Inference' : 'GB300 NVL72 — AI Training/Inference',
      );
      fragment.appendChild(el);
      dots.push(el);
    }

    container.appendChild(fragment);

    // Targets that don't use the wave render their dots immediately.
    if (!cfg.wave) return;

    /* ── Staggered fade-in (triggered when section reveals) ──────────────── */
    // Respects prefers-reduced-motion: if reduced, all dots appear instantly.
    function revealDots() {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) {
        for (let n = 0; n < dots.length; n++) {
          dots[n].classList.add('is-visible');
        }
        return;
      }

      for (let m = 0; m < dots.length; m++) {
        (function (dot, index) {
          setTimeout(
            function () {
              dot.classList.add('is-visible');
            },
            BASE_DELAY + index * STAGGER_MS,
          );
        })(dots[m], m);
      }
    }

    /* ── Observe the section entering the viewport ───────────────────────── */
    const section = document.getElementById(cfg.sectionId);
    if (!section) {
      // No reveal section — show dots immediately so they never stay hidden.
      revealDots();
      return;
    }

    let dotsFired = false;
    function maybeFire() {
      if (dotsFired) return;
      dotsFired = true;
      revealDots();
    }

    if (section.classList.contains('is-in')) {
      maybeFire();
    } else {
      // Watch for .is-in being added by the core IntersectionObserver.
      const mutObserver = new MutationObserver(function (mutations) {
        for (let mi = 0; mi < mutations.length; mi++) {
          const mu = mutations[mi];
          if (mu.type === 'attributes' && mu.attributeName === 'class') {
            if (section.classList.contains('is-in')) {
              maybeFire();
              mutObserver.disconnect();
            }
          }
        }
      });
      mutObserver.observe(section, { attributes: true, attributeFilter: ['class'] });

      // Fallback IntersectionObserver in case core script hasn't run yet.
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
          function (entries) {
            if (entries[0].isIntersecting) {
              maybeFire();
              io.disconnect();
            }
          },
          { threshold: 0.15 },
        );
        io.observe(section);
      }
    }
  }
}

// =============================================================================
// IIFE4 — Theme manager (light/dark)
//   - toggles <html data-theme>, persists 'sl-theme' in localStorage
//   - wires #themeToggle (desktop) and #themeToggleMobile
//   - updates aria-pressed / aria-label + <meta name="theme-color">
//   - calls paintThemeIcons(theme) on init and after every toggle
//   - re-asserts theme-aware aria-label after 'sl:langchange'
// =============================================================================

function initTheme() {
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  function updateMetaThemeColor(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#F5F5F7' : '#07090C');
  }

  function syncToggleAria(theme) {
    // Theme-aware: dark shows "switch to light", light shows "switch to dark".
    const labelKey = theme === 'dark' ? 'theme.toggleAria' : 'theme.toggleAriaToDark';
    const lang = document.documentElement.lang;
    const dict = window.I18N && window.I18N[lang];
    const label = (dict && dict[labelKey]) || (dict && dict['theme.toggleAria']) || 'Switch theme';
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute('aria-label', label);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('sl-theme', theme);
    } catch (e) {
      /* ignore */
    }
    updateMetaThemeColor(theme);
    syncToggleAria(theme);
    paintThemeIcons(theme);
  }

  function bindToggle(btn) {
    btn.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // Init: no-FOUC script has already set data-theme; here we only sync UI.
  const theme = currentTheme();
  updateMetaThemeColor(theme);
  syncToggleAria(theme);
  paintThemeIcons(theme);
  document.querySelectorAll('#themeToggle, #themeToggleMobile').forEach(bindToggle);

  // i18n owns the toggle's static aria-label via data-i18n-attr and re-applies
  // it on every language switch, clobbering the theme-aware label. Re-assert
  // ownership after each locale change so the wording stays direction-correct.
  document.addEventListener('sl:langchange', function () {
    syncToggleAria(currentTheme());
  });
}

// =============================================================================
// IIFE5 — Hero parallax (index.html only) + off-screen video pause
//   - parallax moves ONLY .hero__inner (never .reveal), depth 0.3, ≤5% vh
//   - prefersReducedMotion.matches guard kills motion; change listener updates
//   - rAF-throttled; IntersectionObserver pauses rAF when hero off-screen
//   - no-ops when .hero / .hero__inner absent (safe on other pages)
//   - merged IO video pause for init.mp4 (.hero__video)
// =============================================================================

function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const heroInner = document.querySelector('.hero__inner');
  if (!hero || !heroInner) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // A5: hero video scroll-zoom target (index only). Shares this function's
  // reduced-motion guard + IntersectionObserver pause. No-ops if absent.
  const heroVideo = document.querySelector('.hero__video');

  let isActive = false;
  let ticking = false;

  function update() {
    if (!isActive) {
      ticking = false;
      return;
    }
    const rect = hero.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrolled = -rect.top;
    const total = hero.offsetHeight - vh;
    const progress = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0;
    // depth 0.3, ≤5% vh max
    const yOffset = progress * vh * -0.05 * 0.3;
    heroInner.style.transform = 'translate3d(0, ' + yOffset.toFixed(2) + 'px, 0)';
    // A5: subtle depth — capped scale 1 -> 1.06 across hero scroll.
    if (heroVideo) {
      heroVideo.style.transform = 'scale(' + (1 + Math.min(progress, 1) * 0.06).toFixed(4) + ')';
    }
    ticking = false;
  }

  function onScroll() {
    if (!isActive || ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function startParallax() {
    if (prefersReducedMotion.matches) return;
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          isActive = entry.isIntersecting;
          if (isActive) onScroll();
        });
      },
      { rootMargin: '50% 0px' },
    );
    io.observe(hero);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function onMotionChange() {
    if (prefersReducedMotion.matches) {
      heroInner.style.transform = '';
      if (heroVideo) heroVideo.style.transform = '';
      isActive = false;
    }
  }
  if (prefersReducedMotion.addEventListener) {
    prefersReducedMotion.addEventListener('change', onMotionChange);
  } else if (prefersReducedMotion.addListener) {
    prefersReducedMotion.addListener(onMotionChange);
  }

  if (!prefersReducedMotion.matches) {
    startParallax();
  }

  // Off-screen video pause for init.mp4 (merged into this module to save resources).
  if (heroVideo) {
    const videoIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const p = heroVideo.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            heroVideo.pause();
          }
        });
      },
      { rootMargin: '20% 0px' },
    );
    videoIO.observe(heroVideo);
  }
}

// =============================================================================
// IIFE6 — Contact form submit lifecycle (contact.html only)
//   - <form id="contactForm" novalidate> drives native validation manually
//   - On pass: POST form data (urlencoded, no-cors) to form.dataset.endpoint
//     (a Google Apps Script Web App); opaque response -> optimistic success.
//   - Success: form.hidden, #contactConfirm revealed + focused for SR.
//   - Network failure: re-enable submit, reveal #contactError (role=alert).
//   - No endpoint set -> demo mode (reveal success panel without sending).
//   - No-ops on pages without the form.
// =============================================================================

function initContactForm() {
  const form = document.getElementById('contactForm');
  const confirmEl = document.getElementById('contactConfirm');
  if (!form || !confirmEl) return;

  const errorEl = document.getElementById('contactError');
  const endpoint = (form.dataset.endpoint || '').trim();

  function reveal(el) {
    el.classList.add('is-visible');
    if (el.getAttribute('tabindex') === null) el.setAttribute('tabindex', '-1');
    if (typeof el.focus === 'function') el.focus();
  }

  function showSuccess() {
    form.removeAttribute('aria-busy');
    form.hidden = true;
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.classList.remove('is-visible');
    }
    reveal(confirmEl);
  }

  function showError(submitBtn) {
    form.removeAttribute('aria-busy');
    if (submitBtn) {
      submitBtn.classList.remove('is-submitting');
      submitBtn.removeAttribute('disabled');
    }
    if (errorEl) {
      errorEl.hidden = false;
      reveal(errorEl);
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Drive native constraint validation (form has novalidate).
    if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
      if (typeof form.reportValidity === 'function') form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector('.btn--primary');
    if (submitBtn) {
      submitBtn.classList.add('is-submitting');
      submitBtn.setAttribute('disabled', '');
    }
    form.setAttribute('aria-busy', 'true');
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.classList.remove('is-visible');
    }

    // No endpoint configured -> demo mode: reveal the success panel directly.
    if (!/^https:\/\//.test(endpoint)) {
      showSuccess();
      return;
    }

    // urlencoded body keeps this a CORS-safelisted request (no preflight, which a Google
    // Apps Script Web App cannot answer). Under no-cors the response is opaque, so a
    // resolved fetch is treated as success and only a network failure surfaces an error.
    const body = new URLSearchParams();
    new FormData(form).forEach(function (value, key) {
      body.append(key, value);
    });
    body.append('locale', document.documentElement.lang || 'zh-Hant');
    body.append('userAgent', navigator.userAgent);

    fetch(endpoint, { method: 'POST', mode: 'no-cors', body: body })
      .then(function () {
        showSuccess();
      })
      .catch(function () {
        showError(submitBtn);
      });
  });
}

// =============================================================================
// IIFE7 — Wafer scan SVG animation pause
//   Pauses or unpauses SVG animations on .wafer-scan per prefers-reduced-motion.
// =============================================================================

function initWaferScan() {
  const scan = document.querySelector('.wafer-scan');
  if (!scan) return;
  const svg = scan.ownerSVGElement || scan.closest('svg');
  if (!svg || typeof svg.pauseAnimations !== 'function') return;
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  function apply() {
    try {
      mq.matches ? svg.pauseAnimations() : svg.unpauseAnimations();
    } catch (e) {
      /* ignore */
    }
  }
  apply();
  if (mq.addEventListener) {
    mq.addEventListener('change', apply);
  } else if (mq.addListener) {
    mq.addListener(apply);
  }
}

// =============================================================================
// DOMContentLoaded — single entry point (HTML loads only core.js as module)
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {
  initI18n(); // i18n bootstraps first: populates window.I18N, sets lang attr
  initReveal(); // IIFE1: IntersectionObserver reveal + count-up counters
  initNav(); // IIFE1: nav scrolled state, mobile menu, smooth anchors
  initArchitecture(); // IIFE2: accordion
  initComputeDots(); // IIFE3: dot grid
  initTheme(); // IIFE4: theme manager
  initHeroParallax(); // IIFE5: parallax + video pause
  initContactForm(); // IIFE6: contact form
  initWaferScan(); // IIFE7: wafer scan pause
});
