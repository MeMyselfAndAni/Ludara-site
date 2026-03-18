/**
 * resize-images.js
 * ─────────────────────────────────────────────────────────────────
 * Resizes all place-N.jpg images in ./images/ to a maximum of 600px
 * on either side, preserving aspect ratio. Overwrites files in place.
 *
 * Prerequisites:
 *   npm install sharp
 *
 * Usage:
 *   node resize-images.js
 * ─────────────────────────────────────────────────────────────────
 */

const fs   = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMG_DIR  = path.join(__dirname, 'images');
const MAX_SIZE = 600;

async function main() {
  const files = fs.readdirSync(IMG_DIR)
    .filter(f => /^place-\d+\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => {
      const n = x => parseInt(x.match(/\d+/)[0]);
      return n(a) - n(b);
    });

  if (!files.length) {
    console.log('No place-N.jpg files found in ./images/');
    return;
  }

  console.log(`\n🖼️  Resizing ${files.length} images to max ${MAX_SIZE}px…\n`);

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

      // Resize: shrink so the longer side hits MAX_SIZE, keep aspect ratio
      const tmpPath = filepath + '.tmp';
      await sharp(filepath)
        .resize(MAX_SIZE, MAX_SIZE, {
          fit: 'inside',          // never upscale, never crop
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85, progressive: true })
        .toFile(tmpPath);

      // Get new dimensions for the log
      const newMeta = await sharp(tmpPath).metadata();
      fs.renameSync(tmpPath, filepath);

      const saved = ((fs.statSync(filepath).size) / 1024).toFixed(0);
      console.log(`  ✓ ${file}  ${width}×${height} → ${newMeta.width}×${newMeta.height}  (${saved} KB)`);
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
