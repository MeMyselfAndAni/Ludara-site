// cleanup-images.js — A Perfect Day / HolstonHouse
// 1. Removes image files for places no longer in data.js (orphans).
// 2. Removes image files for places that have a direct_image URL in data.js
//    so fetch-images-universal.js will re-download the correct image.
// Run from the HolstonHouse folder:
//   node cleanup-images.js
// Then run:
//   node fetch-images-universal.js

const fs   = require('fs');
const path = require('path');
const readline = require('readline');

const DATA_FILE  = path.join(__dirname, 'data.js');
const IMAGES_DIR = path.join(__dirname, 'images');

function loadCurrentIds() {
  const code = fs.readFileSync(DATA_FILE, 'utf8');
  const ids = [];
  const re = /\bid:\s*(\d+)/g;
  let m;
  while ((m = re.exec(code)) !== null) ids.push(parseInt(m[1]));
  return new Set(ids);
}

function loadDirectImageIds() {
  const code = fs.readFileSync(DATA_FILE, 'utf8');
  const ids = new Set();
  // Extract each flat entry block {no nested braces} and check for direct_image
  const blockRe = /\{([^{}]+)\}/g;
  let m;
  while ((m = blockRe.exec(code)) !== null) {
    const block = m[1];
    const idMatch = block.match(/\bid:\s*(\d+)/);
    if (idMatch && /direct_image:/.test(block)) ids.add(parseInt(idMatch[1]));
  }
  return ids;
}

function byNum(a, b) {
  return parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]);
}

function findOrphans(currentIds) {
  return fs.readdirSync(IMAGES_DIR)
    .filter(f => { const m = f.match(/^place-(\d+)\.(jpe?g|png|webp|avif)$/i); return m && !currentIds.has(parseInt(m[1])); })
    .sort(byNum);
}

function findToReplace(directIds) {
  return fs.readdirSync(IMAGES_DIR)
    .filter(f => { const m = f.match(/^place-(\d+)\.(jpe?g|png|webp|avif)$/i); return m && directIds.has(parseInt(m[1])); })
    .sort(byNum);
}

const currentIds  = loadCurrentIds();
const directIds   = loadDirectImageIds();
const orphans     = findOrphans(currentIds);
const toReplace   = findToReplace(directIds);
const allToDelete = [...new Set([...orphans, ...toReplace])].sort(byNum);

console.log('\n==============================================');
console.log('  A Perfect Day -- Image Cleanup');
console.log('==============================================');
console.log('  Active entries in data.js : ' + currentIds.size);
console.log('  Orphaned images           : ' + orphans.length);
console.log('  Wrong images to re-fetch  : ' + toReplace.length);
console.log('  Total files to delete     : ' + allToDelete.length);
console.log('----------------------------------------------');

if (allToDelete.length === 0) {
  console.log('  Nothing to delete. All good!\n');
  process.exit(0);
}

if (orphans.length > 0) {
  console.log('\n  Orphaned (place removed from guide):');
  orphans.forEach(f => console.log('    - ' + f));
}
if (toReplace.length > 0) {
  console.log('\n  Wrong image (has direct_image URL -- will re-fetch):');
  toReplace.forEach(f => console.log('    - ' + f));
}

console.log('\n----------------------------------------------');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('  Delete all ' + allToDelete.length + ' files? (y to confirm, any other key to cancel): ', answer => {
  rl.close();
  if (answer.trim().toLowerCase() === 'y') {
    let deleted = 0;
    for (const f of allToDelete) {
      try {
        fs.unlinkSync(path.join(IMAGES_DIR, f));
        console.log('  ok  ' + f);
        deleted++;
      } catch(e) {
        console.log('  ERR ' + f + ' -- ' + e.message);
      }
    }
    console.log('\n  Done -- ' + deleted + ' file(s) removed.');
    console.log('  Next step: node fetch-images-universal.js\n');
  } else {
    console.log('\n  Cancelled -- nothing deleted.\n');
  }
});
