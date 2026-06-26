#!/usr/bin/env node
/**
 * T14 — i18n orphan-key audit
 * Finds keys defined in i18n-dict.js that are never referenced in any HTML file.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const DICT_PATH = resolve(__dirname, '../../shiny-logic/i18n-dict.js');
const HTML_DIR = resolve(__dirname, '../../shiny-logic');
const HTML_FILES = [
  'index.html',
  'about.html',
  'solutions.html',
  'technology.html',
  'case-studies.html',
  'contact.html',
  'careers.html',
  'og-card.html',
].map((f) => resolve(HTML_DIR, f));
const EVIDENCE_DIR = resolve(__dirname, '../.sisyphus/evidence');
const EVIDENCE_FILE = resolve(EVIDENCE_DIR, 'task-14-orphan-keys.txt');

// ---------------------------------------------------------------------------
// 1. Load i18n-dict.js — shim window then eval
// ---------------------------------------------------------------------------
const dictSource = readFileSync(DICT_PATH, 'utf8');

// Build a sandbox: shim window so `window.I18N = {...}` works
const sandbox = { window: {} };
const fn = new Function('window', dictSource + '\n');
fn(sandbox.window);

const I18N = sandbox.window.I18N;
if (!I18N || !I18N['zh-Hant']) {
  console.error('ERROR: Failed to load I18N dict from', DICT_PATH);
  process.exit(1);
}

// Use zh-Hant as the canonical key set (all locales share identical keys)
const dictKeys = new Set(Object.keys(I18N['zh-Hant']));
const totalDictKeys = dictKeys.size;

// ---------------------------------------------------------------------------
// 2. Scan HTML files — extract every referenced i18n key
// ---------------------------------------------------------------------------
const referencedKeys = new Set();

// Regex patterns
// data-i18n="key" and data-i18n-html="key" — value is used directly as a key
const RE_SIMPLE = /data-i18n(?:-html)?="([^"]+)"/g;

// data-i18n-attr="attr:key;attr2:key2;..."  — value is semicolon-separated pairs
const RE_ATTR = /data-i18n-attr="([^"]+)"/g;

for (const htmlPath of HTML_FILES) {
  let html;
  try {
    html = readFileSync(htmlPath, 'utf8');
  } catch (e) {
    console.warn(`WARN: Could not read ${htmlPath} — skipping`);
    continue;
  }

  // data-i18n="key" and data-i18n-html="key"
  for (const m of html.matchAll(RE_SIMPLE)) {
    referencedKeys.add(m[1].trim());
  }

  // data-i18n-attr="attr:key;attr2:key2"
  for (const m of html.matchAll(RE_ATTR)) {
    const pairs = m[1].split(';');
    for (const pair of pairs) {
      const colonIdx = pair.indexOf(':');
      if (colonIdx !== -1) {
        const key = pair.slice(colonIdx + 1).trim();
        if (key) referencedKeys.add(key);
      }
    }
  }
}

const totalReferencedKeys = referencedKeys.size;

// ---------------------------------------------------------------------------
// 3. Compute orphans
// ---------------------------------------------------------------------------
const orphans = [...dictKeys].filter((k) => !referencedKeys.has(k)).sort();

// ---------------------------------------------------------------------------
// 4. Build report
// ---------------------------------------------------------------------------
const lines = [
  `i18n Orphan Key Audit — T14`,
  `Generated: ${new Date().toISOString()}`,
  ``,
  `Total dict keys (zh-Hant): ${totalDictKeys}`,
  `Total referenced keys (HTML):  ${totalReferencedKeys}`,
  `Orphan keys: ${orphans.length}`,
  ``,
  `--- Orphan key list (sorted) ---`,
  ...orphans,
];
const report = lines.join('\n') + '\n';

// Print to stdout
process.stdout.write(report);

// ---------------------------------------------------------------------------
// 5. Write evidence file
// ---------------------------------------------------------------------------
mkdirSync(EVIDENCE_DIR, { recursive: true });
writeFileSync(EVIDENCE_FILE, report, 'utf8');
console.error(`\nEvidence written to: ${EVIDENCE_FILE}`);
