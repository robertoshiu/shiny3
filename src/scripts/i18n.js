/* =========================================================================
   顯藝科技 ShinyLogic — i18n runtime (ESM)
   Imported by core.js; call initI18n() after DOMContentLoaded.

   Contract (§14.4 / T16):
   - On init: read localStorage['sl-lang'] (default 'zh-Hant'); apply the
     active dictionary to every [data-i18n] / [data-i18n-html] / [data-i18n-attr].
   - Set document.documentElement.lang to the active locale.
   - Wire every [data-lang] switcher button: set + persist + re-apply, no reload,
     update aria-pressed, keep all switchers in sync.
   - Missing key → fall back to zh-Hant → existing in-HTML text (never blank).
   - Guard if I18N import is absent (page still readable with in-HTML 繁中).
   ========================================================================= */

import { I18N } from '../i18n/dict.js';

const STORAGE_KEY = 'sl-lang';
const DEFAULT_LANG = 'zh-Hant';
const SUPPORTED = ['zh-Hant', 'en', 'zh-Hans'];

/* ---- locale helpers ------------------------------------------------------ */

function normalizeLang(lang) {
  return SUPPORTED.includes(lang) ? lang : DEFAULT_LANG;
}

function readLang() {
  let stored = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch (_e) {
    /* ignore */
  }
  return normalizeLang(stored);
}

function persistLang(lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch (_e) {
    /* ignore */
  }
}

/* ---- dictionary lookup with fallback chain ------------------------------- */
/* Returns the resolved string for a key, or null if no locale defines it
   (caller then keeps the element's existing in-HTML text). */

function lookup(key, lang) {
  if (!I18N) return null;
  const primary = I18N[lang];
  if (primary && Object.prototype.hasOwnProperty.call(primary, key)) {
    return primary[key];
  }
  const fallback = I18N[DEFAULT_LANG];
  if (fallback && Object.prototype.hasOwnProperty.call(fallback, key)) {
    return fallback[key];
  }
  return null; /* never blank — leave existing DOM text in place */
}

/* ---- apply dictionary to the document ------------------------------------ */

function applyText(lang) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const val = lookup(el.getAttribute('data-i18n'), lang);
    if (val !== null) el.textContent = val;
  });
}

function applyHtml(lang) {
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const val = lookup(el.getAttribute('data-i18n-html'), lang);
    if (val !== null) el.innerHTML = val;
  });
}

/* data-i18n-attr="aria-label:ns.key;placeholder:ns.key2" */
function applyAttrs(lang) {
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    const spec = el.getAttribute('data-i18n-attr');
    if (!spec) return;
    spec.split(';').forEach((pair) => {
      const trimmed = pair.trim();
      if (!trimmed) return;
      const ci = trimmed.indexOf(':');
      if (ci === -1) return;
      const attr = trimmed.slice(0, ci).trim();
      const key = trimmed.slice(ci + 1).trim();
      if (!attr || !key) return;
      const val = lookup(key, lang);
      if (val !== null) el.setAttribute(attr, val);
    });
  });
}

function applyAll(lang) {
  applyText(lang);
  applyHtml(lang);
  applyAttrs(lang);
  document.documentElement.lang = lang;
}

/* ---- switcher buttons ---------------------------------------------------- */

function syncSwitchers(lang) {
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    const isActive = btn.getAttribute('data-lang') === lang;
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    btn.classList.toggle('is-active', isActive);
  });
}

export function setLang(lang) {
  lang = normalizeLang(lang);
  persistLang(lang);
  applyAll(lang);
  syncSwitchers(lang);
  /* Notify other modules (e.g. theme manager) that the locale changed so
     they can re-apply attributes they own (the theme toggle aria-label is
     theme-aware and must win over the static data-i18n-attr value). */
  try {
    document.dispatchEvent(new CustomEvent('sl:langchange', { detail: { lang } }));
  } catch (_e) {
    /* CustomEvent constructor unsupported — older engines; safe to skip. */
  }
  /* T23 — Announce locale change to screen readers via the #langAnnounce live region.
     Reads common.localeChanged from the active locale dict when present; falls back
     to a plain English string so there is always a meaningful announcement. */
  const announceEl = document.getElementById('langAnnounce');
  if (announceEl) {
    const LOCALE_NAMES = { 'zh-Hant': '繁體中文', en: 'English', 'zh-Hans': '简体中文' };
    const msg =
      lookup('common.localeChanged', lang) || 'Language changed to ' + (LOCALE_NAMES[lang] || lang);
    announceEl.textContent = msg;
  }
}

function wireSwitchers() {
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setLang(btn.getAttribute('data-lang'));
    });
  });
}

/* ---- boot ---------------------------------------------------------------- */
/* Called explicitly by core.js (not auto-run on import). */

export function initI18n() {
  const lang = readLang();
  /* Even if I18N import is absent, set lang + sync switchers so the UI is honest.
     lookup() returns null without I18N, so in-HTML 繁中 text is preserved. */
  applyAll(lang);
  syncSwitchers(lang);
  wireSwitchers();
}
