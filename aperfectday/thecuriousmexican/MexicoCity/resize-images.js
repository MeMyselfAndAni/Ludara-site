/**
 * resize-images.js  (shared — lives in general/_scripts/)
 * ─────────────────────────────────────────────────────────────────
 * Resizes all place-N.jpg images to max 600px on either side.
 * Overwrites files in place. Run from anywhere.
 *
 * Usage:
 *   node resize-images.js <path-to-guide-folder>
 *
 * Examples:
 *   node resize-images.js ..\nomadicmatt\Bangkok
 *   node resize-images.js ..\AdventurousKate\Prague
 *   node resize-images.js C:\full\path\to\guide
 *
 * Prerequisites (install once in general\_scripts\):
 *   npm install sharp
 * ─────────────────────────────────────────────────────────────────
 */

const fs    = require('fs');
const path  = require('path');
const sharp = require('sharp');

const MAX_SIZE = 600;

const arg = process.argv[2];
if (!arg) {
  console.error('\nUsage: node resize-images.js <path-to-guide-folder>');
  console.error('Example: node resize-images.js ..\\AdventurousKate\\Prague\n');
  process.exit(1);
}

const GUIDE_DIR = path.resolve(process.cwd(), arg);
const IMG_DIR   = path.join(GUIDE_DIR, 'images');

if (!fs.existsSync(IMG_DIR)) {
  console.error(`\nError: images/ folder not found at:\n  ${IMG_DIR}\n`);
  process.exit(1);
}

async function main() {
  const files = fs.readdirSync(IMG_DIR)
    .filter(f => /^place-\d+\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  if (!files.length) {
    console.log(`\nNo place-N.jpg files found in:\n  ${IMG_DIR}\n`);
    return;
  }

  console.log(`\n🖼️  Resizing ${files.length} images in:\n  ${IMG_DIR}\n  Max size: ${MAX_SIZE}px\n`);

  let resized = 0, skipped = 0, failed = 0;

  for (const file of files) {
    const filepath = path.join(IMG_DIR, file);
    try {
      const meta = await sharp(filepath).metadata();
      const { width, height } = meta;

      if (width <= MAX_SIZE && height <= MAX_SIZE) {
        console.log(`  ✓ ${file}  (${width}×${height}) — already small, skipped`);
        skipped++;
        continue;
      }

      const tmpPath = filepath + '.tmp';
      await sharp(filepath)
        .resize(MAX_SIZE, MAX_SIZE, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toFile(tmpPath);

      const newMeta = await sharp(tmpPath).metadata();
      fs.renameSync(tmpPath, filepath);

      const kb = (fs.statSync(filepath).size / 1024).toFixed(0);
      console.log(`  ✓ ${file}  ${width}×${height} → ${newMeta.width}×${newMeta.height}  (${kb} KB)`);
      resized++;

    } catch (err) {
      console.error(`  ✗ ${file} — ${err.message}`);
      failed++;
    }
  }

  console.log('\n' + '─'.repeat(50));
  console.log(`✅  Done!  ${resized} resized,  ${skipped} already small,  ${failed} failed.\n`);
}

main();
