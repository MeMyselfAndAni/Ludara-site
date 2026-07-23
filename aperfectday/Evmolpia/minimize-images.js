// ═══════════════════════════════════════════════════════════════════
// minimize-images.js — A Perfect Day (Plovdiv / Hotel Evmolpia)
// Shrinks every image in /images so its longest side is no more than
// MAX_SIZE px, saves as progressive JPEG quality 85, skips images that
// are already small, and bakes in EXIF orientation (fixes sideways
// phone/Instagram photos). Overwrites in place (no backup).
//
// Run from this guide folder:
//   cd Evmolpia
//   node minimize-images.js
//
// Flag:
//   --size=N   max longest side in pixels (default 600)
// ═══════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const sizeArg = process.argv.find(a => a.startsWith('--size='));
const MAX_SIZE = sizeArg ? parseInt(sizeArg.split('=')[1], 10) : 600;

const IMG_DIR = path.join(__dirname, 'images');

// ── locate sharp ──────────────────────────────────────────────────
// Works from any guide folder regardless of depth: walks up the tree
// from here, checking node_modules/sharp and general/_scripts/node_modules/sharp
// at every level (sharp lives in aperfectday/general/_scripts).
function loadSharp() {
  try { return require('sharp'); } catch (e) {}
  let dir = __dirname;
  for (let i = 0; i < 10; i++) {
    const candidates = [
      path.join(dir, 'node_modules', 'sharp'),
      path.join(dir, 'general', 'node_modules', 'sharp'),
      path.join(dir, 'general', '_scripts', 'node_modules', 'sharp'),
      path.join(dir, '_scripts', 'node_modules', 'sharp'),
    ];
    for (const c of candidates) { try { return require(c); } catch (e) {} }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  console.error('ERROR: sharp not found anywhere above this folder.');
  console.error('Fix: cd into aperfectday\\general\\_scripts and run  npm install sharp');
  process.exit(1);
}
const sharp = loadSharp();

(async () => {
  if (!fs.existsSync(IMG_DIR)) { console.error('ERROR: images/ folder not found'); process.exit(1); }

  const files = fs.readdirSync(IMG_DIR).filter(f => /\.(jpe?g|png)$/i.test(f));
  if (!files.length) { console.log('  No images to resize.'); return; }

  console.log('  Resizing ' + files.length + ' images (max ' + MAX_SIZE + 'px)...\n');
  let resized = 0, skipped = 0, failed = 0;

  for (const file of files) {
    const filepath = path.join(IMG_DIR, file);
    try {
      const meta = await sharp(filepath).metadata();
      const needsRotate = meta.orientation && meta.orientation > 1;  // EXIF rotation flag set
      if (meta.width <= MAX_SIZE && meta.height <= MAX_SIZE && !needsRotate) {
        console.log('  ✓ ' + file + ' (' + meta.width + 'x' + meta.height + ') — already small');
        skipped++; continue;
      }
      const tmpPath = filepath + '.tmp';
      await sharp(filepath)
        .rotate()  // bake EXIF orientation into the pixels, then strip the flag (fixes sideways/inverted photos)
        .resize(MAX_SIZE, MAX_SIZE, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toFile(tmpPath);
      const newMeta = await sharp(tmpPath).metadata();
      fs.renameSync(tmpPath, filepath);
      const kb = Math.round(fs.statSync(filepath).size / 1024);
      console.log('  ✓ ' + file + '  ' + meta.width + 'x' + meta.height + ' → ' + newMeta.width + 'x' + newMeta.height + ' (' + kb + 'KB)');
      resized++;
    } catch (err) {
      console.error('  ✗ ' + file + ' — ' + err.message);
      failed++;
    }
  }

  console.log('\n  Resize: ' + resized + ' resized · ' + skipped + ' already small · ' + failed + ' failed');
})();
