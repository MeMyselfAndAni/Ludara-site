// A Perfect Day — ZenKimchi / Seoul
// fetch-images.js v2 — download place photos to images/
//
// Sources:
//   ZK = zenkimchi.com or koreafoodtours.com (Joe's own photos)
//   WM = Wikimedia Commons (CC-licensed, open use)
//       All WM URLs use ?width=800 to fetch a ~800px thumbnail, not the full file
//
// Run from the guide folder:
//   node fetch-images.js

const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');

const OUT_DIR    = path.join(__dirname, 'images');
const MAX_MB     = 3;               // skip files larger than this
const TIMEOUT_MS = 30_000;          // 30 second timeout per request

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Image map — id: URL ──────────────────────────────────────────────────────
// WM = Wikimedia Commons Special:FilePath?width=800 (auto-thumbnail, CC-licensed)
// ZK = ZenKimchi / koreafoodtours (Joe McPherson's own published photos)

const WM = (file) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=800`;

const IMAGES = {

  // ─── MAPO / GONGDEOK ───────────────────────────────────────────────────────
  // ZK: Jeong Daepo exterior from must-eat article
  1:  'https://www.koreafoodtours.com/wp-content/uploads/2019/07/14923967_10157689333175710_271091381_o-700x525.jpg',
  // ZK: Hongik Sutbul Galbi (Joe's photo, Aug 2023)
  2:  'https://zenkimchi.com/wp-content/uploads/2023/08/SE-8e6241b4-1ddb-11ec-97b9-1d81ac8cbd07-700x525.jpg',
  // ZK: Two-Two Chicken from chicken & beer article
  3:  'https://www.koreafoodtours.com/wp-content/uploads/2019/06/Two-Two-01-Saturate-Me-Red-700x525.jpg',
  // ZK: Nureungji spit-roasted chicken
  4:  'https://www.koreafoodtours.com/wp-content/uploads/2019/06/Nureungji-1-joe-700x525.jpg',
  // WM: Old-style Korean fried chicken — Ddobagi style (CC BY-SA)
  5:  WM('Old-style Korean fried chicken.jpg'),

  // ─── HONGDAE / MANGWON ─────────────────────────────────────────────────────
  // WM: Korean fried chicken banban (CC0) — Chicken Baengi hof style
  6:  WM('Korean fried chicken (banban).jpg'),
  // WM: Myeong-dong night street scene — Seoul street food vibe (CC BY-SA)
  7:  WM('Myeong-dong (22139460844).jpg'),
  // WM: Gwangjang Market food stalls (CC) — thematic for Mangwon traditional market
  8:  WM('Gwangjang Market.JPG'),
  // WM: Kaesong bossam kimchi (CC BY-SA) — Won Halmoni Bossam pork wraps
  9:  WM('Korean cuisine-Kaesong bossam kimchi-01.jpg'),
  // WM: Tteokbokki spicy rice cakes (CC BY-SA) — Jaws Tteokbokki
  10: WM('Tteokbokki.JPG'),
  // WM: Korean fried chicken (CC BY-SA) — BHC classic hof
  11: WM('Korean fried chicken 240206.jpg'),
  // WM: Myeongdong street food scene reused — Sulbing bingsu area
  12: WM('Dondurma stall in Myeongdong.jpg'),

  // ─── JONGNO / INSADONG ─────────────────────────────────────────────────────
  // ZK: Gwanghwamun Jip from must-eat article
  13: 'https://www.koreafoodtours.com/wp-content/uploads/2019/07/Gwanghwamun-Jip.jpg',
  // WM: Bibimbap with kkakdugi — Yuhalmeoni bibimbap (CC BY-SA)
  14: WM('Bibimbap with kkakdugi.jpg'),
  // WM: Samgyetang ginseng chicken soup (CC BY-SA) — Tosokchon
  15: WM('Dakbokkeumtang and samgyetang.jpg'),
  // WM: Gwangjang Market food scene (CC BY-SA)
  16: WM('Dongdaemon-korean-food-8.jpg'),
  // WM: Insadong street at dawn — similar hanok neighbourhood to Ikseon-dong (CC BY-SA)
  17: WM('2012-05-11 Insadong 01.jpg'),
  // WM: Jogyesa temple area — near Balwoo Gongyang (CC BY-SA)
  18: WM('Seoul-Insadong at dawn-01.jpg'),
  // WM: Insadong street food (CC BY-SA)
  19: WM('Korean.food-Yakgua-Yugua-Insadong.jpg'),
  // WM: Bossam pork wraps — Samhaejip (CC BY-SA)
  20: WM('Korean cuisine-Kaesong bossam kimchi-01.jpg'),
  // WM: Korean food banchan spread — Maetdollo-man (CC BY-SA)
  21: WM('Banchan (Supporting Food), Basic Dishes of Korean Food.jpg'),

  // ─── EULJIRO / JUNG-GU / MYEONGDONG ───────────────────────────────────────
  // WM: Euljiro printing alley — industrial Euljiro vibe (CC BY-SA)
  22: WM('A coating company in Euljiro Printing alley.jpg'),
  // ZK: Woo Lae Oak naengmyeon from must-eat article
  23: 'https://zenkimchi.com/wp-content/uploads/2023/08/h119238a_z.jpg',
  // ZK: Dongmu Bapsang North Korean defector restaurant
  24: 'https://zenkimchi.com/wp-content/uploads/2023/08/IMG_0543-700x526.jpg',
  // WM: Korean BBQ samgyeopsal pork belly — Sae Maul Sikdang (CC BY-SA)
  25: WM('Samgyeopsal.jpg'),
  // WM: Korean-style fried chicken — Goobne oven chicken (CC)
  26: WM('Iksan City 48 Korean Style Fried chicken.jpg'),
  // WM: Myeongdong street stalls (CC BY-SA)
  27: WM('Dondurma stall in Myeongdong.jpg'),
  // WM: Dakgalbi braised chicken (Public Domain) — Andong Jjimdalk
  28: WM('Korean Food Dakgalbi.JPG'),
  // WM: Myeongdong street at night (CC BY-SA) — Myeongdong Pizza area
  29: WM('Myeong-dong (22630604620).jpg'),
  // WM: Budae jjigae army base stew hotpot (CC BY-SA) — Haidilao hot pot
  30: WM('Korean.food-Budae.jjigae-02.jpg'),

  // ─── ITAEWON / YONGSAN ─────────────────────────────────────────────────────
  // ZK: Linus' BBQ pork platter (Joe's photo, Nov 2014)
  31: 'https://zenkimchi.com/wp-content/uploads/2014/11/2014-11-04-12.12.42-scaled.jpg',
  // WM: Dakgalbi charcoal chicken (Public Domain) — Orai Sutbul DalkGalbi
  32: WM('Korean Food Dakgalbi.JPG'),

  // ─── GANGNAM / JAMSIL / SEONGSU ────────────────────────────────────────────
  // ZK: Gogung Jeonju bibimbap brass bowl
  33: 'https://www.koreafoodtours.com/wp-content/uploads/2019/07/Gogung.jpg',
  // ZK: Omori Jjigae flagship (must-eat article)
  34: 'https://zenkimchi.com/wp-content/uploads/2023/08/img-700x467.jpg',
  // WM: Korean fried chicken banban — Kyochon battered style (CC0)
  35: WM('Korean fried chicken (banban).jpg'),
  // ZK: Nureungji rotisserie chicken — reused for Gyerimwon same style
  36: 'https://www.koreafoodtours.com/wp-content/uploads/2019/06/Nureungji-1-joe-700x525.jpg',
  // WM: Korean duck braised dish — Nolboo Clay Pot Duck (CC BY-SA)
  37: WM('Korean.food-Ori-tang-01.jpg'),
  // WM: Korean beef meat at market (CC BY-SA) — Majang Meat Market
  38: WM('Korean beef.jpg'),
  // WM: Cafe storefront in Seongsu-dong (CC BY-SA)
  39: WM('Cafe storefront in Seongsu-dong.jpg'),

  // ─── NORYANGJIN / YEOUIDO ──────────────────────────────────────────────────
  // WM: Noryangjin Fish Market octopus tanks (CC BY-SA)
  40: WM('Octopus as food at Noryangjin Fisheries Wholesale Market in Seoul South Korea.jpg'),
  // WM: Jeotgal salted seafood at Gyeongdong Market (CC BY-SA) — Noryangjin salted seafood
  41: WM('Korea-Gyeongdong Market-Various jeotgal-01.jpg'),
  // ZK: Cup Rice Road student street food (must-eat article)
  42: 'https://zenkimchi.com/wp-content/uploads/2023/08/159367174774_20200703.jpeg',
  // ZK: Jeongin Myeonok naengmyeon (must-eat article)
  43: 'https://zenkimchi.com/wp-content/uploads/2023/08/2a3de62293de41a891e7fe380835e8df-700x700.webp',
  // WM: Myeongdong shopping street — Lotte Department Store area (CC BY-SA)
  44: WM('Shopping street at Myondon , Seoul - panoramio.jpg'),
  // WM: Jjimjilbang Korean sauna (CC BY-SA)
  45: WM('2020-03-11 20.38.42 찜질방.jpg'),
  // WM: Bibim naengmyeon cold noodles (CC BY-SA) — Woo Lae Oak Noryangjin
  46: WM('Korean.food-Bibim.naengmyen-01.jpg'),
};

// ─── Download helper ──────────────────────────────────────────────────────────
const results = { ok: [], failed: [], skipped: [] };

function download(id, rawUrl) {
  const dest = path.join(OUT_DIR, `place-${id}`);

  // Already downloaded (any extension)?
  const existing = ['jpg','jpeg','png','webp'].map(e => `${dest}.${e}`).find(fs.existsSync);
  if (existing) {
    process.stdout.write(`  ⏭  ${String(id).padStart(2)} already exists\n`);
    results.ok.push(id);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let totalBytes = 0;
    let finalPath  = null;

    const follow = (u, hops = 0) => {
      if (hops > 8) {
        process.stdout.write(` ❌ too many redirects\n`);
        results.failed.push({ id, reason: 'too many redirects' });
        resolve(); return;
      }

      const mod = u.startsWith('https') ? https : http;
      const req = mod.get(u, {
        timeout: TIMEOUT_MS,
        headers: { 'User-Agent': 'APerfectDayGuide/1.0 (ludara.ai; contact@ludara.ai)' }
      }, (res) => {

        if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
          follow(new URL(res.headers.location, u).href, hops + 1);
          return;
        }
        if (res.statusCode !== 200) {
          process.stdout.write(` ❌ HTTP ${res.statusCode}\n`);
          results.failed.push({ id, reason: `HTTP ${res.statusCode}` });
          resolve(); return;
        }

        // Determine extension from Content-Type
        const ct  = res.headers['content-type'] || '';
        const ext = ct.includes('webp') ? 'webp' : ct.includes('png') ? 'png' : 'jpg';
        finalPath = `${dest}.${ext}`;
        const out = fs.createWriteStream(finalPath);

        res.on('data', (chunk) => {
          totalBytes += chunk.length;
          if (totalBytes > MAX_MB * 1024 * 1024) {
            req.destroy();
            out.destroy();
            try { fs.unlinkSync(finalPath); } catch {}
            process.stdout.write(` ⚠️  skipped (>${MAX_MB}MB)\n`);
            results.skipped.push({ id, reason: `>${MAX_MB}MB` });
            resolve(); return;
          }
          process.stdout.write('.');
        });

        res.pipe(out);
        out.on('finish', () => {
          const kb = (totalBytes / 1024).toFixed(0);
          process.stdout.write(` ✅ place-${id}.${ext} (${kb}KB)\n`);
          results.ok.push(id);
          resolve();
        });
        out.on('error', (e) => {
          try { fs.unlinkSync(finalPath); } catch {}
          process.stdout.write(` ❌ write error: ${e.message}\n`);
          results.failed.push({ id, reason: e.message });
          resolve();
        });
      });

      req.on('timeout', () => {
        req.destroy();
        process.stdout.write(` ❌ timeout\n`);
        results.failed.push({ id, reason: 'timeout' });
        resolve();
      });
      req.on('error', (e) => {
        process.stdout.write(` ❌ ${e.message}\n`);
        results.failed.push({ id, reason: e.message });
        resolve();
      });
    };

    process.stdout.write(`  ${String(id).padStart(2)} `);
    follow(rawUrl);
  });
}

// ─── Run sequentially, then print summary ─────────────────────────────────────
(async () => {
  const ids = Object.keys(IMAGES).map(Number).sort((a, b) => a - b);
  console.log(`\nFetching ${ids.length} images into:\n  ${OUT_DIR}\n`);

  for (const id of ids) {
    await download(id, IMAGES[id]);
    await new Promise(r => setTimeout(r, 400));  // polite delay
  }

  // ─── Summary ────────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('══════════════════════════════════════════');
  console.log(`  ✅ Downloaded:  ${results.ok.length}`);
  console.log(`  ⚠️  Skipped:    ${results.skipped.length}${results.skipped.length ? ' (too large — swap manually)' : ''}`);
  console.log(`  ❌ Failed:      ${results.failed.length}`);

  if (results.skipped.length) {
    console.log('\n  Skipped IDs:', results.skipped.map(x => `${x.id}(${x.reason})`).join(', '));
  }
  if (results.failed.length) {
    console.log('\n  Failed IDs:');
    results.failed.forEach(x => console.log(`    place-${x.id}: ${x.reason}`));
  }
  console.log('\n  Next step: node resize-images.js ..\\.\\zenkimchi\\seoul\n');
})();
