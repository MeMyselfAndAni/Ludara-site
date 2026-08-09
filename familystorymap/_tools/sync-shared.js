#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────────────────────────
   sync-shared.js — push the shared engine files from one map into all the others.

       node _tools\sync-shared.js familystorymap\LandoKliotFamily          (dry run)
       node _tools\sync-shared.js familystorymap\LandoKliotFamily --write  (do it)

   This is the answer to "any structural change should apply to all maps at once".
   Make the change in one map, check it there, then sync — instead of hand-copying
   it and discovering months later that one map never got it.

   It only ever copies the SHARED list. family.js, data.js, people.js, credits.js,
   index.html and images/ are that map's own and are never touched.
   ───────────────────────────────────────────────────────────────────────────── */

const fs = require('fs');
const path = require('path');

const SHARED = ['styles.css', 'map-core.js', 'map.js', 'lang.js', 'ui-card.js',
  'ui-filter.js', 'ui-tree.js', 'ui-favourites.js', 'ui-stories.js', 'ui-pdf.js',
  'photos.js', 'tutorial.js', 'sw.js', 'favicon.svg', 'minimize-images.js'];

const src = process.argv[2];
const write = process.argv.includes('--write');
if (!src) { console.error('usage: node sync-shared.js <reference-map-folder> [--write]'); process.exit(2); }

const SRC = path.resolve(src);
const ROOT = path.dirname(SRC);
const targets = fs.readdirSync(ROOT).filter(d =>
  d !== path.basename(SRC) && !d.startsWith('_') &&
  fs.existsSync(path.join(ROOT, d, 'family.js')));

if (!targets.length) { console.log('\n  no other maps found next to ' + path.basename(SRC) + '\n'); process.exit(0); }

const norm = s => s.replace(/\r\n/g, '\n');
let changed = 0;

console.log(`\n  reference: ${path.basename(SRC)}`);
for (const t of targets) {
  console.log(`\n  → ${t}`);
  let clean = true;
  for (const f of SHARED) {
    const a = path.join(SRC, f), b = path.join(ROOT, t, f);
    if (!fs.existsSync(a)) { console.log(`      [skip] ${f} is not in the reference map`); continue; }
    const same = fs.existsSync(b) && norm(fs.readFileSync(a, 'utf8')) === norm(fs.readFileSync(b, 'utf8'));
    if (same) continue;
    clean = false; changed++;
    if (write) { fs.copyFileSync(a, b); console.log(`      updated  ${f}`); }
    else       { console.log(`      WOULD UPDATE  ${f}`); }
  }
  if (clean) console.log('      already up to date');
}

console.log(write
  ? `\n  ${changed} file(s) updated. Now run check-map on every map, bump each family.js\n  cacheVersion, and deploy them.\n`
  : `\n  ${changed} file(s) would change. Re-run with --write to apply.\n`);
