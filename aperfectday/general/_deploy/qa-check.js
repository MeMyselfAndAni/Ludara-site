#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
// qa-check.js — Full automated QA for the A Perfect Day platform
// Run from repo root: node aperfectday/general/_deploy/qa-check.js
//
// Catches every class of bug encountered in development:
//  1. JS syntax errors in all files
//  2. Hardcoded guide-specific strings in _platform files
//  3. Missing FAVS_KEY in guide data.js
//  4. Duplicate variable declarations across files loaded together
//  5. Neighbourhood IDs mismatch between data.js and index.html
//  6. Place count mismatch between data.js and index.html badges
//  7. Categories used in data.js missing from CC / CL
//  8. Required files missing from guide folder
//  9. FAVS_KEY not unique across guides (two guides would share saved places)
// 10. Duplicate place IDs within a guide
// 11. Platform files out of sync with _platform master
// 12. Blogger name / branding placeholders left unfilled
// ═══════════════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const ROOT     = path.resolve(__dirname, '../../..');   // repo root
const PLATFORM = path.join(ROOT, 'aperfectday/general/_platform');

// Add new guides here when you build them
const GUIDES = [
  { name: 'wanderlush/tbilisi', path: 'aperfectday/wanderlush/tbilisi' },
  { name: 'HLO/london',         path: 'aperfectday/HLO/london'         },
  // { name: 'NextBlogger/city',  path: 'aperfectday/NextBlogger/city'  },
];

// Files that must exist in every guide folder
const REQUIRED_GUIDE_FILES = [
  'index.html', 'data.js', 'map.js', 'images'
];

// Platform files that must exist in _platform AND be deployed to every guide
const PLATFORM_FILES = [
  'ui-filter.js', 'ui-card.js', 'ui-stories.js',
  'ui-favourites.js', 'ui-pdf.js', 'photos.js', 'styles.css'
];

// Strings that must NEVER appear in platform files (guide-specific hardcoding)
const PLATFORM_BANNED_STRINGS = [
  { str: 'tbilisi-favs',  reason: 'hardcoded FAVS_KEY — use FAVS_KEY variable instead' },
  { str: 'london-favs',   reason: 'hardcoded FAVS_KEY — use FAVS_KEY variable instead' },
  { str: 'Emily Lush',    reason: 'hardcoded blogger name — use index.html branding only' },
  { str: 'Wander-Lush',   reason: 'hardcoded blog name — use index.html branding only' },
  { str: 'Hand Luggage Only', reason: 'hardcoded blog name — use index.html branding only' },
];

// Strings that must NEVER appear in map.js (belong in platform only)
const MAP_JS_BANNED = [
  { str: 'userMarker',  reason: 'userMarker is declared in ui-filter.js — duplicate will crash' },
  { str: 'function locateMe', reason: 'locateMe() is defined in ui-filter.js — duplicate will crash' },
  { str: 'function renderList', reason: 'renderList() is defined in ui-filter.js — duplicate will crash' },
  { str: 'function closeSplash', reason: 'closeSplash() is defined in ui-filter.js — duplicate will crash' },
  { str: 'function openDetail', reason: 'openDetail() is defined in ui-card.js — duplicate will crash' },
  { str: 'function openPlaceCard', reason: 'openPlaceCard() is defined in ui-card.js — duplicate will crash' },
];

// Strings that must NEVER appear in data.js (belong in platform only)
const DATA_JS_BANNED = [
  { str: 'function renderList',  reason: 'renderList() belongs in ui-filter.js' },
  { str: 'function initMap',     reason: 'initMap() belongs in map.js' },
  { str: 'function openDetail',  reason: 'openDetail() belongs in ui-card.js' },
  { str: 'photoCache',           reason: 'photoCache is declared in photos.js — duplicate will crash' },
];

// ── RESULTS ───────────────────────────────────────────────────────────────────
let errors   = [];
let warnings = [];
let passes   = [];

function pass(msg)  { passes.push('  ✅ ' + msg); }
function warn(msg)  { warnings.push('  ⚠️  ' + msg); }
function fail(msg)  { errors.push('  ❌ ' + msg); }

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); }
  catch(e) { return null; }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// ── CHECK 1: JS syntax via node --check ──────────────────────────────────────
function checkSyntax(filePath, label) {
  const { execSync } = require('child_process');
  try {
    execSync(`node --check "${filePath}"`, { stdio: 'pipe' });
    pass(`Syntax OK: ${label}`);
    return true;
  } catch(e) {
    const msg = e.stderr ? e.stderr.toString().split('\n')[0] : 'unknown error';
    fail(`Syntax ERROR in ${label}: ${msg}`);
    return false;
  }
}

// ── CHECK 2: Platform files have no hardcoded guide strings ──────────────────
function checkPlatformBannedStrings() {
  console.log('\n── Platform file content checks ──');
  for (const fname of PLATFORM_FILES.filter(f => f.endsWith('.js'))) {
    const fpath = path.join(PLATFORM, fname);
    if (!fileExists(fpath)) { fail(`_platform/${fname} does not exist`); continue; }
    const content = readFile(fpath);
    let clean = true;
    for (const { str, reason } of PLATFORM_BANNED_STRINGS) {
      if (content.includes(str)) {
        fail(`_platform/${fname} contains "${str}" — ${reason}`);
        clean = false;
      }
    }
    if (clean) pass(`_platform/${fname} — no hardcoded guide strings`);
  }
}

// ── CHECK 3: map.js has no platform-only functions ───────────────────────────
function checkMapJsBanned(guideDir, guideName) {
  const fpath = path.join(guideDir, 'map.js');
  if (!fileExists(fpath)) return;
  const content = readFile(fpath);
  let clean = true;
  for (const { str, reason } of MAP_JS_BANNED) {
    if (content.includes(str)) {
      fail(`${guideName}/map.js contains "${str}" — ${reason}`);
      clean = false;
    }
  }
  if (clean) pass(`${guideName}/map.js — no duplicate platform declarations`);
}

// ── CHECK 4: data.js has FAVS_KEY and no platform-only functions ─────────────
function checkDataJs(guideDir, guideName) {
  const fpath = path.join(guideDir, 'data.js');
  if (!fileExists(fpath)) { fail(`${guideName}/data.js missing`); return null; }
  const content = readFile(fpath);

  // FAVS_KEY defined
  const favKeyMatch = content.match(/const\s+FAVS_KEY\s*=\s*['"]([^'"]+)['"]/);
  if (!favKeyMatch) {
    fail(`${guideName}/data.js — FAVS_KEY not defined (add: const FAVS_KEY = 'yourguide-favs';)`);
  } else {
    pass(`${guideName}/data.js — FAVS_KEY = '${favKeyMatch[1]}'`);
  }

  // No duplicate globals
  const letMapCount = (content.match(/^let\s+map[,\s]/gm) || []).length;
  if (letMapCount > 1) {
    fail(`${guideName}/data.js — 'let map' declared ${letMapCount} times (duplicate will crash)`);
  }

  // No banned content
  for (const { str, reason } of DATA_JS_BANNED) {
    if (content.includes(str)) {
      fail(`${guideName}/data.js contains "${str}" — ${reason}`);
    }
  }

  // No placeholder lines from template
  if (content.includes('const CC = { ... }') || content.includes('const CL = { ... }')) {
    fail(`${guideName}/data.js — contains placeholder lines "const CC = { ... }" — template was pasted incorrectly`);
  }

  return favKeyMatch ? favKeyMatch[1] : null;
}

// ── CHECK 5: Neighbourhood IDs match between data.js and index.html ──────────
function checkNeighbourhoods(guideDir, guideName) {
  const dataContent  = readFile(path.join(guideDir, 'data.js'));
  const htmlContent  = readFile(path.join(guideDir, 'index.html'));
  if (!dataContent || !htmlContent) return;

  // Extract nbhd values from data.js
  const dataNbhds = new Set();
  for (const m of dataContent.matchAll(/nbhd:\s*["']([^"']+)["']/g)) {
    dataNbhds.add(m[1]);
  }

  // Extract nbhd ids from index.html (id="nbhd-xxx" but not nbhd-all, nbhd-bar, nbhd-bubbles-row, nbhd-handle)
  const htmlNbhds = new Set();
  for (const m of htmlContent.matchAll(/id="nbhd-([^"]+)"/g)) {
    const id = m[1];
    if (!['all','bar','bubbles-row','handle','title','show-btn'].includes(id)) {
      htmlNbhds.add(id);
    }
  }

  // Check data nbhds all have a bubble in HTML
  let ok = true;
  for (const nbhd of dataNbhds) {
    if (!htmlNbhds.has(nbhd)) {
      fail(`${guideName} — data.js uses nbhd "${nbhd}" but no matching id="nbhd-${nbhd}" in index.html`);
      ok = false;
    }
  }
  // Check HTML bubbles all have places in data
  for (const nbhd of htmlNbhds) {
    if (!dataNbhds.has(nbhd)) {
      warn(`${guideName} — index.html has bubble "nbhd-${nbhd}" but no places use this neighbourhood`);
    }
  }
  if (ok) pass(`${guideName} — all neighbourhood IDs match between data.js and index.html`);
}

// ── CHECK 6: Place count badge matches actual PLACES array length ─────────────
function checkPlaceCount(guideDir, guideName) {
  const dataContent = readFile(path.join(guideDir, 'data.js'));
  const htmlContent = readFile(path.join(guideDir, 'index.html'));
  if (!dataContent || !htmlContent) return;

  // Count place objects (count "id:" occurrences in PLACES array — not perfect but reliable)
  const idCount = (dataContent.match(/\bid:\s*\d+/g) || []).length;

  // Extract badge numbers from HTML (place-count-all spans and list-badge)
  const badgeMatches = htmlContent.match(/class="place-count-all">(\d+)</g) || [];
  const listBadge    = htmlContent.match(/id="list-badge">(\d+)</);
  const desktopBadge = htmlContent.match(/id="desktop-list-count">(\d+)</);
  const sheetTitle   = htmlContent.match(/id="sheet-title">(\d+) Places</);

  const badgeNums = new Set();
  for (const m of badgeMatches) {
    const n = m.match(/(\d+)/); if (n) badgeNums.add(parseInt(n[1]));
  }
  if (listBadge)    badgeNums.add(parseInt(listBadge[1]));
  if (desktopBadge) badgeNums.add(parseInt(desktopBadge[1]));
  if (sheetTitle)   badgeNums.add(parseInt(sheetTitle[1]));

  let ok = true;
  for (const num of badgeNums) {
    if (num !== idCount) {
      warn(`${guideName} — HTML badge shows ${num} places but data.js has ${idCount} places (update the numbers in index.html)`);
      ok = false;
    }
  }
  if (ok) pass(`${guideName} — place count consistent: ${idCount} places`);
}

// ── CHECK 7: Categories in data.js all defined in CC and CL ──────────────────
function checkCategories(guideDir, guideName) {
  const dataContent = readFile(path.join(guideDir, 'data.js'));
  if (!dataContent) return;

  // Extract CC keys
  const ccMatch = dataContent.match(/const\s+CC\s*=\s*\{([^}]+)\}/);
  const clMatch = dataContent.match(/const\s+CL\s*=\s*\{([^}]+)\}/);
  if (!ccMatch || !clMatch) {
    fail(`${guideName}/data.js — cannot find CC or CL definitions`);
    return;
  }
  const ccKeys = new Set([...ccMatch[1].matchAll(/(\w+)\s*:/g)].map(m => m[1]));
  const clKeys = new Set([...clMatch[1].matchAll(/(\w+)\s*:/g)].map(m => m[1]));

  // Extract cat values used in PLACES
  const usedCats = new Set();
  for (const m of dataContent.matchAll(/\bcat:\s*["']([^"']+)["']/g)) {
    usedCats.add(m[1]);
  }

  let ok = true;
  for (const cat of usedCats) {
    if (!ccKeys.has(cat)) {
      fail(`${guideName}/data.js — category "${cat}" used in PLACES but missing from CC (no colour defined)`);
      ok = false;
    }
    if (!clKeys.has(cat)) {
      fail(`${guideName}/data.js — category "${cat}" used in PLACES but missing from CL (no label defined)`);
      ok = false;
    }
  }
  if (ok) pass(`${guideName} — all categories have CC colour and CL label`);
}

// ── CHECK 8: Duplicate place IDs ─────────────────────────────────────────────
function checkDuplicateIds(guideDir, guideName) {
  const dataContent = readFile(path.join(guideDir, 'data.js'));
  if (!dataContent) return;

  const ids = [...dataContent.matchAll(/\bid:\s*(\d+)/g)].map(m => parseInt(m[1]));
  const seen = new Set();
  const dupes = new Set();
  for (const id of ids) {
    if (seen.has(id)) dupes.add(id);
    seen.add(id);
  }
  if (dupes.size > 0) {
    fail(`${guideName}/data.js — duplicate place IDs: ${[...dupes].join(', ')}`);
  } else {
    pass(`${guideName} — all place IDs are unique`);
  }
}

// ── CHECK 9: FAVS_KEY unique across all guides ───────────────────────────────
function checkFavsKeyUniqueness(favsKeys) {
  console.log('\n── Cross-guide checks ──');
  const seen = {};
  let ok = true;
  for (const [guide, key] of Object.entries(favsKeys)) {
    if (!key) continue;
    if (seen[key]) {
      fail(`FAVS_KEY collision: "${key}" used by both "${seen[key]}" and "${guide}" — saved places will be shared!`);
      ok = false;
    } else {
      seen[key] = guide;
    }
  }
  if (ok) pass('FAVS_KEY is unique across all guides');
}

// ── CHECK 10: Platform files in sync with guide folders ──────────────────────
function checkPlatformSync(guideDir, guideName) {
  for (const fname of PLATFORM_FILES) {
    const platformPath = path.join(PLATFORM, fname);
    const guidePath    = path.join(guideDir, fname);
    if (!fileExists(platformPath)) { fail(`_platform/${fname} missing`); continue; }
    if (!fileExists(guidePath))    { fail(`${guideName}/${fname} missing — run deploy script`); continue; }

    const pContent = readFile(platformPath);
    const gContent = readFile(guidePath);
    if (pContent !== gContent) {
      warn(`${guideName}/${fname} differs from _platform — deploy-all.bat will fix this`);
    } else {
      pass(`${guideName}/${fname} in sync with _platform`);
    }
  }
}

// ── CHECK 11: Required files exist ───────────────────────────────────────────
function checkRequiredFiles(guideDir, guideName) {
  for (const fname of REQUIRED_GUIDE_FILES) {
    if (!fileExists(path.join(guideDir, fname))) {
      fail(`${guideName}/ — required file/folder missing: ${fname}`);
    } else {
      pass(`${guideName}/${fname} exists`);
    }
  }
}

// ── CHECK 12: No unfilled template placeholders ───────────────────────────────
function checkPlaceholders(guideDir, guideName) {
  const files = ['index.html', 'data.js', 'map.js'];
  const placeholders = ['CITYNAME', 'BLOG_URL', '{ ... }', 'TODO', 'PLACEHOLDER'];
  for (const fname of files) {
    const content = readFile(path.join(guideDir, fname));
    if (!content) continue;
    for (const p of placeholders) {
      if (content.includes(p)) {
        fail(`${guideName}/${fname} — contains unfilled placeholder: "${p}"`);
      }
    }
  }
  pass(`${guideName} — no unfilled template placeholders`);
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('  A Perfect Day — Platform QA Check');
console.log('═══════════════════════════════════════════════════════');

// Platform-level checks
console.log('\n── Platform JS syntax ──');
for (const fname of PLATFORM_FILES.filter(f => f.endsWith('.js'))) {
  checkSyntax(path.join(PLATFORM, fname), `_platform/${fname}`);
}
checkPlatformBannedStrings();

// Per-guide checks
const favsKeys = {};

for (const guide of GUIDES) {
  const guideDir = path.join(ROOT, guide.path);

  if (!fileExists(guideDir)) {
    warn(`Guide "${guide.name}" folder not found — skipping`);
    continue;
  }

  console.log(`\n══ Guide: ${guide.name} ══`);

  checkRequiredFiles(guideDir, guide.name);

  // Syntax check guide-specific JS files
  console.log(`\n── JS syntax ──`);
  for (const fname of ['data.js', 'map.js']) {
    checkSyntax(path.join(guideDir, fname), `${guide.name}/${fname}`);
  }

  console.log(`\n── Content checks ──`);
  const favsKey = checkDataJs(guideDir, guide.name);
  favsKeys[guide.name] = favsKey;

  checkMapJsBanned(guideDir, guide.name);
  checkNeighbourhoods(guideDir, guide.name);
  checkPlaceCount(guideDir, guide.name);
  checkCategories(guideDir, guide.name);
  checkDuplicateIds(guideDir, guide.name);
  checkPlaceholders(guideDir, guide.name);

  console.log(`\n── Platform sync ──`);
  checkPlatformSync(guideDir, guide.name);
}

checkFavsKeyUniqueness(favsKeys);

// ── SUMMARY ───────────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════');
console.log('  RESULTS');
console.log('═══════════════════════════════════════════════════════');

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n🎉 ALL CHECKS PASSED — safe to deploy!\n');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} ERROR(S) — fix before deploying:\n`);
    errors.forEach(e => console.log(e));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} WARNING(S) — review recommended:\n`);
    warnings.forEach(w => console.log(w));
  }
}

console.log(`\n✅ ${passes.length} checks passed`);
console.log('═══════════════════════════════════════════════════════\n');

process.exit(errors.length > 0 ? 1 : 0);
