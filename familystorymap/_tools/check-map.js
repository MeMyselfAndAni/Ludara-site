#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────────────────────────
   check-map.js — validate one family map folder.

   Run it after copying a folder for a new family, and before every deploy:

       node _tools\check-map.js familystorymap\NewFamily

   It exists because every bug we have hit in these maps was one of five things,
   and all five are mechanically detectable:

     1. A previous family's name survived a copy      (the Lando-Kliot header in
        the Bar-Or map; the Lando-Kliot grandparents in the Bar-Or tutorial)
     2. A key was inherited but never renamed          (Bar-Or's NBHD_MIN_RADIUS
        still listed belarus/russia, so its own regions fell back to 80 m)
     3. A file was never added to the deploy .bat      (lang.js — the trilingual
        engine was live only because it had been copied by hand)
     4. The service-worker cache name did not match    (purging 'inanasfootsteps',
        so old shells were never evicted)
     5. A shared engine file drifted between maps      (a fix applied to one map
        and not the others)

   Exit code 0 = clean, 1 = problems found.
   ───────────────────────────────────────────────────────────────────────────── */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const target = process.argv[2];
if (!target) { console.error('usage: node check-map.js <family-folder>'); process.exit(2); }
const DIR = path.resolve(target);
const MAPS_ROOT = path.dirname(DIR);

const problems = [], notes = [];
const fail = m => problems.push(m);
const note = m => notes.push(m);

// Files every map must have, and which are the shared engine.
const SHARED = ['styles.css', 'map-core.js', 'map.js', 'lang.js',
  'ui-card.js', 'ui-filter.js', 'ui-tree.js', 'ui-favourites.js', 'ui-stories.js',
  'ui-pdf.js', 'photos.js', 'tutorial.js', 'sw.js', 'favicon.svg'];
// index.html is per-family for now: it still carries the splash markup and the
// region bubbles. Its family text is checked, but it is not compared byte-for-byte.
const PER_FAMILY = ['index.html', 'family.js', 'data.js', 'people.js', 'credits.js'];

// ── 0. Files present ─────────────────────────────────────────────────────────
for (const f of SHARED.concat(PER_FAMILY)) {
  if (!fs.existsSync(path.join(DIR, f))) fail(`missing file: ${f}`);
}
if (problems.length) { report(); process.exit(1); }

// ── 1. Load this map's config ────────────────────────────────────────────────
const ctx = { self: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(DIR, 'family.js'), 'utf8') + ';globalThis._F=FAMILY;', ctx);
const F = ctx._F;

const REQUIRED = ['slug', 'url', 'cacheVersion', 'languages', 'title', 'credit', 'map', 'threads', 'regions', 'tree'];
REQUIRED.forEach(k => { if (F[k] === undefined) fail(`family.js is missing "${k}"`); });

const folderSlug = path.basename(DIR).toLowerCase();
if (F.slug.toLowerCase() !== folderSlug)
  fail(`family.js slug "${F.slug}" does not match the folder name "${path.basename(DIR)}"`);
if (!F.url.includes(F.slug))
  fail(`family.js url "${F.url}" does not contain the slug "${F.slug}"`);

// ── 2. No OTHER family's name anywhere in this folder ────────────────────────
// Names are taken from the sibling maps' own family.js files, so this needs no
// hand-maintained blocklist and grows automatically with every new map.
const siblings = fs.readdirSync(MAPS_ROOT).filter(d =>
  d !== path.basename(DIR) && !d.startsWith('_') &&
  fs.existsSync(path.join(MAPS_ROOT, d, 'family.js')));

// Vocabulary of a map = the words that identify WHICH family it is: the slug, the
// header title, and the tree branch chips and headings. Deliberately NOT the thread
// labels — both of our maps have an "ישראל / Israel" thread, and a word two families
// legitimately share is not evidence of a bad copy.
function vocabulary(cfg) {
  const out = new Set();
  if (cfg.slug) out.add(cfg.slug);
  const bits = [cfg.title || '']
    .concat((cfg.tree && cfg.tree.branches || []).map(b => (b.chip || '') + ' · ' + (b.header || '')));
  bits.join(' · ').split(/[·|]/).map(t => t.trim())
      .filter(t => t.length >= 4)
      .forEach(t => out.add(t));
  return out;
}

const mine = vocabulary(F);
const foreign = [];
for (const sib of siblings) {
  const c = { self: {} }; vm.createContext(c);
  try {
    vm.runInContext(fs.readFileSync(path.join(MAPS_ROOT, sib, 'family.js'), 'utf8') + ';globalThis._F=FAMILY;', c);
  } catch (e) { note(`could not read ${sib}/family.js: ${e.message}`); continue; }
  // Subtract our own vocabulary: only words unique to the sibling are evidence.
  const words = [...vocabulary(c._F)].filter(w => !mine.has(w));
  if (words.length) foreign.push({ sib, words });
}

const scanFiles = fs.readdirSync(DIR).filter(f => /\.(js|html|css|bat|md)$/i.test(f));
for (const f of scanFiles) {
  const text = fs.readFileSync(path.join(DIR, f), 'utf8');
  for (const { sib, words } of foreign) {
    for (const w of words) {
      if (text.includes(w)) {
        const where = SHARED.includes(f)
          ? `${f} is a shared engine file and must name no family at all`
          : `${f} still says "${w}"`;
        fail(`${where} — "${w}" belongs to ${sib}`);
      }
    }
  }
}

// ── 3. Keys line up: threads ↔ data.js cat ↔ people.js branch, regions ↔ nbhd ─
const dctx = { self: {} }; vm.createContext(dctx);
vm.runInContext(fs.readFileSync(path.join(DIR, 'data.js'), 'utf8') + '\n' +
  fs.readFileSync(path.join(DIR, 'people.js'), 'utf8') +
  ';globalThis._D={PLACES,PEOPLE,FAMILY_UNIONS};', dctx);
const { PLACES, PEOPLE, FAMILY_UNIONS } = dctx._D;

const threadKeys = new Set(F.threads.map(t => t.key));
const regionKeys = new Set(F.regions.map(r => r.key));
const branchKeys = new Set(F.tree.branches.map(b => b.key));

new Set(PLACES.map(p => p.cat)).forEach(c => {
  if (!threadKeys.has(c)) fail(`data.js uses cat "${c}", which is not a thread in family.js`);
});
new Set(PLACES.map(p => p.nbhd)).forEach(n => {
  if (!regionKeys.has(n)) fail(`data.js uses nbhd "${n}", which is not a region in family.js`);
});
new Set(PEOPLE.map(p => p.branch)).forEach(b => {
  if (!branchKeys.has(b)) fail(`people.js uses branch "${b}", which is not a tree branch in family.js`);
});
branchKeys.forEach(b => {
  if (!threadKeys.has(b)) fail(`tree branch "${b}" has no matching thread, so it will render grey`);
});
regionKeys.forEach(r => {
  const n = PLACES.filter(p => p.nbhd === r).length;
  if (n === 0) note(`region "${r}" has no places — its bubble is hidden`);
});
F.regions.forEach(r => {
  if (!r.minRadius) fail(`region "${r.key}" has no minRadius — a one-place region would draw an 80 m bubble`);
});

// ── 4. Family tree consistency ───────────────────────────────────────────────
const byId = {}; PEOPLE.forEach(p => byId[p.id] = p);
(FAMILY_UNIONS || []).forEach(u => {
  const rows = u.p.map(id => byId[id] && byId[id].row).filter(r => r !== undefined);
  if (new Set(rows).size > 1) fail(`tree: spouses ${u.p.join(' + ')} are on different rows (${rows.join(', ')})`);
  const base = Math.max.apply(null, rows);
  (u.c || []).forEach(cid => {
    if (!byId[cid]) return fail(`tree: union names a child "${cid}" who is not in people.js`);
    if (byId[cid].row !== base + 1)
      fail(`tree: ${cid} is on row ${byId[cid].row}, but its parents are on row ${base} — a child must be exactly one row below`);
  });
});
const NW_COLS = 0.93;   // node width 186px / column width 200px
const byRow = {};
PEOPLE.forEach(p => (byRow[p.row] = byRow[p.row] || []).push(p));
Object.keys(byRow).forEach(r => {
  const a = byRow[r].slice().sort((x, y) => x.col - y.col);
  for (let i = 1; i < a.length; i++)
    if (a[i].col - a[i - 1].col < NW_COLS)
      fail(`tree: ${a[i - 1].id} and ${a[i].id} overlap on row ${r} (${(a[i].col - a[i - 1].col).toFixed(2)} columns apart)`);
});

// ── 5. Deploy script covers every file ───────────────────────────────────────
const bats = fs.readdirSync(DIR).filter(f => f.endsWith('.bat'));
if (!bats.length) note('no deploy .bat in this folder');
bats.forEach(bat => {
  const text = fs.readFileSync(path.join(DIR, bat), 'utf8');
  const m = text.match(/set "FILES=([^"]*)"/);
  if (!m) return note(`${bat} has no FILES= list to check`);
  const listed = new Set(m[1].split(/\s+/).filter(Boolean).map(s => s.toLowerCase()));
  fs.readdirSync(DIR)
    .filter(f => /\.(js|css|html|svg)$/i.test(f) && !f.startsWith('_'))
    .forEach(f => {
      if (!listed.has(f.toLowerCase()))
        fail(`${bat} will not deploy ${f} — add it to the FILES list`);
    });
  if (!/%WORKING%/.test(text) || !/%DEPLOY%/.test(text)) note(`${bat} does not look like the standard deploy script`);
  if (!text.includes(F.slug)) fail(`${bat} does not mention this map's slug "${F.slug}"`);
});

// ── 6. Shared engine files match the other maps ──────────────────────────────
const norm = s => s.replace(/\r\n/g, '\n');
siblings.forEach(sib => {
  SHARED.forEach(f => {
    const a = path.join(DIR, f), b = path.join(MAPS_ROOT, sib, f);
    if (!fs.existsSync(b)) return;
    if (norm(fs.readFileSync(a, 'utf8')) !== norm(fs.readFileSync(b, 'utf8')))
      fail(`${f} differs from ${sib}/${f} — shared engine files must be identical (run sync-shared)`);
  });
});

// ── 6b. The story path is this family's, not the one it was copied from ──────
//   Bar-Or shipped for weeks with Lando-Kliot's STORY_PATH_IDS, inherited when
//   the folder was copied. Every id existed, so nothing looked broken, and the
//   "family journey" line quietly left out eighteen of the thirty three places,
//   including the three years in America. Two rules close it: every id has to be
//   a real place here, and the list may not be identical to a sibling's.
const _idx = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
const _spOf = txt => {
  const m = txt.match(/STORY_PATH_IDS\s*=\s*\[([^\]]*)\]/);
  return m ? m[1].split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)) : null;
};
const storyIds = _spOf(_idx);
if (!storyIds) {
  note('index.html has no STORY_PATH_IDS, so this map draws no family journey line');
} else {
  const placeIds = new Set(PLACES.map(p => p.id));
  storyIds.forEach(id => {
    if (!placeIds.has(id)) fail(`STORY_PATH_IDS names place ${id}, which is not in data.js`);
  });
  if (new Set(storyIds).size !== storyIds.length)
    fail('STORY_PATH_IDS lists the same place twice');
  siblings.forEach(sib => {
    const f = path.join(MAPS_ROOT, sib, 'index.html');
    if (!fs.existsSync(f)) return;
    const other = _spOf(fs.readFileSync(f, 'utf8'));
    if (other && other.length === storyIds.length && other.every((v, i) => v === storyIds[i]))
      fail(`STORY_PATH_IDS is identical to ${sib}'s, so this map is drawing that family's journey`);
  });
  const missing = PLACES.filter(p => !storyIds.includes(p.id)).length;
  if (missing) note(`${missing} of ${PLACES.length} places are not on the family journey line, which may well be deliberate`);
}

// ── 7. Service worker ────────────────────────────────────────────────────────
const sw = fs.readFileSync(path.join(DIR, 'sw.js'), 'utf8');
if (!sw.includes("importScripts('./family.js')"))
  fail('sw.js does not import family.js, so its cache name is hardcoded');
if (!/\.\/family\.js/.test(sw.split('SHELL_FILES')[1] || ''))
  fail('sw.js does not precache family.js — an offline load would have no config');

// ── Report ───────────────────────────────────────────────────────────────────
function report() {
  console.log('\n  ' + path.basename(DIR) + '\n  ' + '─'.repeat(path.basename(DIR).length));
  if (!problems.length) console.log('  ✓ no problems found');
  problems.forEach(p => console.log('  ✗ ' + p));
  notes.forEach(n => console.log('  · ' + n));
  console.log('');
}
report();
process.exit(problems.length ? 1 : 0);
