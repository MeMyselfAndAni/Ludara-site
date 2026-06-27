// ═══════════════════════════════════════════════════════════════════
// minimize-images.js — A Perfect Day
// Standalone version of the resize step from fetch-images-universal.js.
// Same behaviour: shrink every image in /images so its longest side is
// no more than MAX_SIZE px, save as progressive JPEG quality 85, and
// skip images that are already small. Overwrites in place (no second
// copy), exactly like the fetcher's resize stage.
//
// Use this when you've added images by hand and just want the resize,
// without re-running the whole fetch/verify pipeline.
//
// Run from the guide folder:
//   cd Venice
//   node minimize-images.js
//
// Needs `sharp` (same dependency as the fetcher).
//
// Flag:
//   --size=N   max longest side in pixels (default 600)
// ═══════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const sizeArg = process.argv.find(a => a.startsWith('--size='));
const MAX_SIZE = sizeArg ? parseInt(sizeArg.split('=')[1], 10) : 600;

const IMG_DIR = path.join(__dirname, 'images');

// ── locate sharp (local, then Ludara general/_scripts) ────────────
function loadSharp() {
  const tries = [
    'sharp',
    path.join(__dirname, 'node_modules', 'sharp'),
    path.join(__dirname, '..', '..', 'general', '_scripts', 'node_modules', 'sharp'),
    path.join(__dirname, '..', '_scripts', 'node_modules', 'sharp'),
  ];
  for (const t of tries) { try { return require(t); } catch (e) {} }
  console.error('ERROR: sharp not found. Fix: cd general\\_scripts && npm install sharp');
  process.exit(1);
}
const sharp = loadSharp();

(async () => {
  if (!fs.existsSync(IMG_DIR)) { console.error('ERROR: images/ folder not found'); process.exit(1); }

  const files = fs.readdirSync(IMG_DIR).filter(f => /\.(jpe?g)$/i.test(f));
  if (!files.length) { console.log('  No images to resize.'); return; }

  console.log('  Resizing ' + files.length + ' images (max ' + MAX_SIZE + 'px)...\n');
  let resized = 0, skipped = 0, failed = 0;

  for (const file of files) {
    const filepath = path.join(IMG_DIR, file);
    try {
      const meta = await sharp(filepath).metadata();
      if (meta.width <= MAX_SIZE && meta.height <= MAX_SIZE) {
        console.log('  ✓ ' + file + ' (' + meta.width + 'x' + meta.height + ') — already small');
        skipped++; continue;
      }
      const tmpPath = filepath + '.tmp';
      await sharp(filepath)
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
