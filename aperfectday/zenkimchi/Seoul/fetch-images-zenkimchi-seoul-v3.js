// A Perfect Day — ZenKimchi / Seoul
// fetch-images.js v3 — download place photos to images/
//
// Sources:
//   ZK = zenkimchi.com or koreafoodtours.com (Joe's own published photos)
//   WM = Wikimedia Commons CC-licensed images (?width=800 thumbnail)
//
// Run from guide folder:  node fetch-images.js

const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');

const OUT_DIR    = path.join(__dirname, 'images');
const MAX_MB     = 3;       // skip files larger than this
const TIMEOUT_MS = 25000;   // socket idle timeout

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Wikimedia thumbnail helper ───────────────────────────────────────────────
const WM = (file) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=800`;

// ─── Image map — id: URL ──────────────────────────────────────────────────────
const IMAGES = {
  // ── MAPO / GONGDEOK ────────────────────────────────────────────────────────
  1:  'https://www.koreafoodtours.com/wp-content/uploads/2019/07/14923967_10157689333175710_271091381_o-700x525.jpg',  // ZK: Jeong Daepo BBQ
  2:  'https://zenkimchi.com/wp-content/uploads/2023/08/SE-8e6241b4-1ddb-11ec-97b9-1d81ac8cbd07-700x525.jpg',          // ZK: Hongik Sutbul Galbi
  3:  'https://www.koreafoodtours.com/wp-content/uploads/2019/06/Two-Two-01-Saturate-Me-Red-700x525.jpg',              // ZK: Two-Two Chicken
  4:  'https://www.koreafoodtours.com/wp-content/uploads/2019/06/Nureungji-1-joe-700x525.jpg',                         // ZK: Nureungji rotisserie
  5:  WM('Old-style Korean fried chicken.jpg'),                                    // WM: classic 1990s Korean fried chicken — Ddobagi

  // ── HONGDAE / MANGWON ──────────────────────────────────────────────────────
  6:  WM('Korean fried chicken (banban).jpg'),                                     // WM: banban fried chicken (CC0) — Chicken Baengi
  7:  WM('Myeong-dong (22139460844).jpg'),                                         // WM: Seoul street scene at night — Hongdae street food vibe
  8:  WM('Gwangjang Market.JPG'),                                                  // WM: Gwangjang Market — Mangwon traditional market
  9:  WM('Korean cuisine-Kaesong bossam kimchi-01.jpg'),                           // WM: bossam pork wraps (CC BY-SA) — Won Halmoni
  10: WM('Tteokbokki.JPG'),                                                        // WM: tteokbokki spicy rice cakes — Jaws
  11: WM('Korean fried chicken 240206.jpg'),                                       // WM: Korean fried chicken — BHC
  12: WM('Dondurma stall in Myeongdong.jpg'),                                      // WM: Myeongdong street food — Sulbing area

  // ── JONGNO / INSADONG ──────────────────────────────────────────────────────
  13: 'https://www.koreafoodtours.com/wp-content/uploads/2019/07/Gwanghwamun-Jip.jpg',   // ZK: Gwanghwamun Jip kimchi jjigae
  14: WM('Bibimbap with kkakdugi.jpg'),                                            // WM: bibimbap (CC BY-SA) — Jeonju Yuhalmeoni
  15: WM('Dakbokkeumtang and samgyetang.jpg'),                                     // WM: samgyetang ginseng chicken — Tosokchon
  16: WM('Dongdaemon-korean-food-8.jpg'),                                          // WM: Gwangjang Market food stalls
  17: WM('2012-05-11 Insadong 01.jpg'),                                            // WM: Insadong hanok street — Ikseon-dong area
  18: WM('Jogyesa 09.jpg'),                                                        // WM: Jogyesa Buddhist temple Seoul — Balwoo Gongyang is right next door (CC BY-SA)
  19: WM('Korean.food-Yakgua-Yugua-Insadong.jpg'),                                 // WM: Insadong street food (CC BY-SA)
  20: WM('Korean cuisine-Kaesong bossam kimchi-01.jpg'),                           // WM: bossam reused — Samhaejip
  21: WM('Banchan (Supporting Food), Basic Dishes of Korean Food.jpg'),            // WM: Korean banchan spread — Maetdollo-man

  // ── EULJIRO / JUNG-GU / MYEONGDONG ────────────────────────────────────────
  22: WM('A coating company in Euljiro Printing alley.jpg'),                       // WM: Euljiro industrial alley (CC BY-SA)
  23: 'https://zenkimchi.com/wp-content/uploads/2023/08/h119238a_z.jpg',           // ZK: Woo Lae Oak naengmyeon
  24: 'https://zenkimchi.com/wp-content/uploads/2023/08/IMG_0543-700x526.jpg',    // ZK: Dongmu Bapsang North Korean defector restaurant
  25: WM('Samgyeopsal.jpg'),                                                        // WM: samgyeopsal pork belly grill — Sae Maul Sikdang
  26: WM('Iksan City 48 Korean Style Fried chicken.jpg'),                          // WM: Korean fried chicken — Goobne
  27: WM('Dondurma stall in Myeongdong.jpg'),                                      // WM: Myeongdong street stalls
  28: WM('Korean Food Dakgalbi.JPG'),                                              // WM: dakgalbi braised chicken (PD) — Andong Jjimdalk
  29: WM('Myeong-dong (22630604620).jpg'),                                         // WM: Myeongdong street at night — Myeongdong Pizza area
  30: WM('Food 海底撈, Haidilao, 台灣一號店, 台北 (22608764687).jpg'),              // WM: Haidilao hot pot — actual Haidilao photo (CC BY-SA)

  // ── ITAEWON / YONGSAN ──────────────────────────────────────────────────────
  31: 'https://zenkimchi.com/wp-content/uploads/2014/11/2014-11-04-12.12.42-scaled.jpg',  // ZK: Linus' Bama Style BBQ pork platter
  32: WM('Korean Food Dakgalbi.JPG'),                                              // WM: dakgalbi charcoal chicken (PD) — Orai DalkGalbi

  // ── GANGNAM / JAMSIL / SEONGSU ─────────────────────────────────────────────
  33: 'https://www.koreafoodtours.com/wp-content/uploads/2019/07/Gogung.jpg',     // ZK: Gogung Jeonju bibimbap brass bowl
  34: 'https://zenkimchi.com/wp-content/uploads/2023/08/img-700x467.jpg',          // ZK: Omori Jjigae flagship
  35: WM('Korean fried chicken (banban).jpg'),                                     // WM: battered fried chicken — Kyochon style
  36: 'https://www.koreafoodtours.com/wp-content/uploads/2019/06/Nureungji-1-joe-700x525.jpg',  // ZK: Nureungji — Gyerimwon same style
  37: WM('Dakbokkeumtang and samgyetang.jpg'),                                     // WM: Korean clay pot stew — Nolboo (closest to clay pot duck)
  38: WM('Grilled beef innards 1.jpg'),                                             // WM: grilled beef innards (CC BY-SA) — Majang Meat Market specialty
  39: WM('Cafe storefront in Seongsu-dong.jpg'),                                   // WM: Seongsu cafe (CC BY-SA)

  // ── NORYANGJIN / YEOUIDO ───────────────────────────────────────────────────
  40: WM('Octopus as food at Noryangjin Fisheries Wholesale Market in Seoul South Korea.jpg'),  // WM: Noryangjin live octopus
  41: WM('Korea-Gyeongdong Market-Various jeotgal-01.jpg'),                        // WM: jeotgal salted seafood market
  42: 'https://zenkimchi.com/wp-content/uploads/2023/08/159367174774_20200703.jpeg',  // ZK: Cup Rice Road student street food
  43: 'https://zenkimchi.com/wp-content/uploads/2023/08/2a3de62293de41a891e7fe380835e8df-700x700.webp',  // ZK: Jeongin Myeonok naengmyeon
  44: WM('Shopping street at Myondon , Seoul - panoramio.jpg'),                    // WM: Myeongdong shopping — Lotte area
  45: WM('2020-03-11 20.38.42 찜질방.jpg'),                                        // WM: jjimjilbang Korean bathhouse (CC BY-SA)
  46: WM('Korean.food-Bibim.naengmyen-01.jpg'),                                   // WM: bibim naengmyeon cold noodles — Woo Lae Oak Noryangjin

  // ─── NEW: CAFÉS ───────────────────────────────────────────────────────────
  47: WM('Flowery cafe in Seongsu-dong.jpg'),                                     // WM: cafe storefront — Anthracite same vibe (CC BY-SA)
  48: WM('Alcohol in a South Korean supermarket.jpg'),                            // WM: Korean convenience store — convenience store bar culture (CC BY-SA)
  49: WM('Toasting makgeolli (4347102175).jpg'),                                  // WM: makgeolli toast — Sol-ip Makgeolli Bar Insadong (CC BY)

  // ─── NEW: LANDMARKS ───────────────────────────────────────────────────────
  50: WM('2012-05-06 Gyeongbokgung.jpg'),                                         // WM: Gyeongbokgung Palace (CC BY-SA)
  51: WM('Street Mural in Inwangsa (1).jpg'),                                     // WM: Inwangsa village on Inwangsan mountain (CC BY-SA)
  52: WM('Myeong-dong (22630604620).jpg'),                                        // WM: Seoul street at night — Hamilton Shirts Itaewon area

  // ─── NEW: MARKET ──────────────────────────────────────────────────────────
  53: WM('Gwangjang Market.JPG'),                                                 // WM: market scene — Dongmyo same traditional market feel
};

// ─── Download one image ────────────────────────────────────────────────────────
const results = { ok: [], failed: [], skipped: [], skippedExist: [] };

function download(id, rawUrl) {
  return new Promise((resolve) => {
    // ── Already downloaded? ──
    const existing = ['jpg', 'jpeg', 'png', 'webp']
      .map(e => path.join(OUT_DIR, `place-${id}.${e}`))
      .find(fs.existsSync);
    if (existing) {
      process.stdout.write(`  ${String(id).padStart(2)} ⏭  already exists\n`);
      results.ok.push(id);
      results.skippedExist.push(id);
      return resolve();
    }

    // ── done flag prevents double-resolve ──
    let done = false;
    let totalBytes = 0;
    let finalPath = null;

    const finish = (fn) => {
      if (done) return;
      done = true;
      fn();
      resolve();
    };

    process.stdout.write(`  ${String(id).padStart(2)} `);

    const follow = (u, hops = 0) => {
      if (hops > 8) {
        return finish(() => {
          process.stdout.write(` ❌ too many redirects\n`);
          results.failed.push({ id, reason: 'too many redirects' });
        });
      }

      const mod = u.startsWith('https') ? https : http;
      const req = mod.get(u, {
        headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai)' }
      }, (res) => {

        if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
          const loc = res.headers.location;
          if (!loc) return finish(() => {
            process.stdout.write(` ❌ redirect with no Location\n`);
            results.failed.push({ id, reason: 'bad redirect' });
          });
          res.resume();  // drain and ignore
          return follow(new URL(loc, u).href, hops + 1);
        }

        if (res.statusCode !== 200) {
          res.resume();
          return finish(() => {
            process.stdout.write(` ❌ HTTP ${res.statusCode}\n`);
            results.failed.push({ id, reason: `HTTP ${res.statusCode}` });
          });
        }

        const ct  = res.headers['content-type'] || '';
        // Always save as .jpg — photos.js constructs "place-N.jpg" paths.
        // Modern browsers handle webp/png content in a .jpg container fine.
        const ext = 'jpg';
        finalPath = path.join(OUT_DIR, `place-${id}.${ext}`);
        const out = fs.createWriteStream(finalPath);
        let tooBig = false;

        res.on('data', (chunk) => {
          if (done || tooBig) return;
          totalBytes += chunk.length;
          process.stdout.write('.');
          if (totalBytes > MAX_MB * 1024 * 1024) {
            tooBig = true;
            res.destroy();
            out.destroy();
            try { fs.unlinkSync(finalPath); } catch {}
            finish(() => {
              process.stdout.write(` ⚠️  skipped (>${MAX_MB}MB)\n`);
              results.skipped.push({ id, reason: `>${MAX_MB}MB` });
            });
          }
        });

        out.on('finish', () => {
          finish(() => {
            const kb = Math.round(totalBytes / 1024);
            process.stdout.write(` ✅ place-${id}.jpg (${kb}KB)\n`);
            results.ok.push(id);
          });
        });

        out.on('error', (e) => {
          try { if (finalPath) fs.unlinkSync(finalPath); } catch {}
          finish(() => {
            process.stdout.write(` ❌ write: ${e.message}\n`);
            results.failed.push({ id, reason: e.message });
          });
        });

        if (!tooBig) res.pipe(out);
      });

      // Idle socket timeout
      req.setTimeout(TIMEOUT_MS, () => {
        req.destroy();
        finish(() => {
          process.stdout.write(` ❌ timeout\n`);
          results.failed.push({ id, reason: 'timeout' });
        });
      });

      req.on('error', (e) => {
        finish(() => {
          process.stdout.write(` ❌ ${e.message}\n`);
          results.failed.push({ id, reason: e.message });
        });
      });
    };

    follow(rawUrl);
  });
}

// ─── Run sequentially, then print summary ─────────────────────────────────────
(async () => {
  const ids = Object.keys(IMAGES).map(Number).sort((a, b) => a - b);

  console.log(`\nFetching ${ids.length} images into:\n  ${OUT_DIR}\n`);

  for (const id of ids) {
    await download(id, IMAGES[id]);
    await new Promise(r => setTimeout(r, 300));
  }

  // Wait a moment for any trailing async events to settle
  await new Promise(r => setTimeout(r, 500));

  const newDownloads = results.ok.length - results.skippedExist.length;

  console.log('\n══════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('══════════════════════════════════════════');
  console.log(`  ✅ Downloaded now:   ${newDownloads}`);
  console.log(`  ⏭  Already existed: ${results.skippedExist.length}`);
  console.log(`  ⚠️  Skipped (>3MB):  ${results.skipped.length}`);
  console.log(`  ❌ Failed:           ${results.failed.length}`);
  console.log(`  ─────────────────────────────────────────`);
  console.log(`     Total accounted:  ${newDownloads + results.skippedExist.length + results.skipped.length + results.failed.length} / ${ids.length}`);

  if (results.skipped.length) {
    console.log(`\n  ⚠️  Skipped IDs (manually swap image):`)
    results.skipped.forEach(x => console.log(`     place-${x.id}: ${x.reason}`));
  }
  if (results.failed.length) {
    console.log('\n  ❌ Failed IDs (URL probably broken):');
    results.failed.forEach(x => console.log(`     place-${x.id}: ${x.reason}`));
  }
  if (results.failed.length === 0 && results.skipped.length === 0) {
    console.log('\n  🎉 All images downloaded successfully!');
  }

  console.log('\n  Next step:');
  console.log('  node ..\\..\\general\\_scripts\\resize-images.js ..\\zenkimchi\\seoul\n');
})();
