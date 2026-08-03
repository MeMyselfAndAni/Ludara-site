// ── PDF DAY GUIDE GENERATOR ──────────────────────────────────
// Uses browser's print-to-PDF via a hidden printable page
// No external libraries needed

async function preloadAllImages(places) {
  console.log('📸 Loading images for PDF...');
  
  const imagePromises = places.map((place, index) => {
    return new Promise((resolve) => {
      // Check if image is already cached
      if (photoCache && photoCache[place.id]?.url) {
        console.log(`✅ Image ${index + 1}/${places.length}: ${place.name} (cached)`);
        resolve(true);
        return;
      }

      // Try to load the image
      const img = new Image();
      const imagePath = (typeof IMAGES_PATH !== 'undefined' ? IMAGES_PATH : 'images/') + 'place-' + place.id + '.jpg';
      
      img.onload = () => {
        // Cache the loaded image if photoCache exists
        if (typeof photoCache !== 'undefined') {
          if (!photoCache[place.id]) {
            photoCache[place.id] = {};
          }
          photoCache[place.id].url = imagePath;
        }
        console.log(`✅ Image ${index + 1}/${places.length}: ${place.name} loaded`);
        resolve(true);
      };
      
      img.onerror = () => {
        console.warn(`❌ Image ${index + 1}/${places.length}: ${place.name} failed to load`);
        resolve(false); // Continue even if image fails to load
      };
      
      img.src = imagePath;
    });
  });
  
  const results = await Promise.all(imagePromises);
  const loadedCount = results.filter(Boolean).length;
  console.log(`🎉 Loaded ${loadedCount}/${places.length} images for PDF`);
  
  return results;
}

/* The booklet cover used the 🌳 emoji, which renders as a different picture on
   every machine and looks nothing like the map. The map has a drawn tree whose
   three crowns carry this family's own branch colours. Lift that same SVG out of
   the page so the cover, the guide and the map all show one identical tree.
   Falls back to the emoji only if the button is somehow absent. */
function _pdfTreeIcon(){
  var s = document.querySelector('#tree-fab svg');
  if (!s) return '🌳';
  var c = s.cloneNode(true);
  c.setAttribute('style', 'width:1em;height:1em;display:inline-block;vertical-align:-0.12em;');
  return c.outerHTML;
}

async function generatePDF(overridePlaces, customSubtitle){
  window._pdfCoverSubtitle = customSubtitle || null;
  var _ruP = (typeof LANG !== 'undefined' && LANG === 'ru');
  var _enP = (typeof LANG !== 'undefined' && LANG === 'en');
  // Family maps have no bookmarking: the booklet is the whole Place List.
  // Order of preference: an explicit list, then bookmarks if a map still offers
  // them, then every place. It must never refuse to produce a booklet.
  const places = (function(){
    if (overridePlaces && overridePlaces.length) return overridePlaces;
    if (typeof getSortedFavPlaces === 'function') {
      const f = getSortedFavPlaces();
      if (f && f.length) return f;
    }
    return (typeof PLACES !== 'undefined') ? PLACES.slice() : [];
  })();
  if(!places || places.length === 0) return;

  // Show loading message
  if (typeof _toast === 'function') {
    _toast('📸 Loading images for PDF...', 8000);
  }

  try {
    // 🔄 FORCE LOAD ALL IMAGES FIRST
    await preloadAllImages(places);
    
    // Show PDF generation message
    if (typeof _toast === 'function') {
      _toast('📄 Generating PDF...', 3000);
    }
  } catch (error) {
    console.error('Error loading images:', error);
    if (typeof _toast === 'function') {
      _toast('⚠️ Some images failed to load, generating PDF anyway...', 4000);
    }
  }

  const date = new Date().toLocaleDateString(_enP ? 'en-GB' : _ruP ? 'ru-RU' : 'he-IL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // NOTE (Family Edition): no route/leg stats here on purpose.
  // The city guides print "~N min walk/drive to next stop" between cards, which is
  // meaningless for a family history spanning Belarus → Russia → Israel across a century.
  // The OSRM fetch (_fetchRouteStats) is deliberately NOT called: it is slow, it fails
  // on intercontinental legs, and nothing in this PDF uses the result.

  // Build HTML for each place card
  const cards = places.map((p, i) => {
    const photoUrl = photoCache[p.id]?.url || '';
    const gradient = {
      landmark:'linear-gradient(135deg,#0f0d0a,#3a2a14)',
      food:    'linear-gradient(135deg,#7a3020,#c06040)',
      cafe:    'linear-gradient(135deg,#1a3a2a,#2a7a4a)',
      church:  'linear-gradient(135deg,#1a1a5c,#3a3a9c)',
      market:  'linear-gradient(135deg,#5c3a1a,#9c6a3a)',
      soviet:  'linear-gradient(135deg,#3a1a5c,#6a3a9c)',
      pub:     'linear-gradient(135deg,#3a1a5c,#6a3a9c)',
      nature:  'linear-gradient(135deg,#1a4a2a,#3a8a4a)',
    }[p.cat] || 'linear-gradient(135deg,#0f0d0a,#3a2a14)';

    const catColors = {
      landmark:'#e8724a', food:'#f0c060', cafe:'#6b9e6e',
      church:'#6090c8', market:'#c08060', soviet:'#9080a8', pub:'#9080a8', nature:'#50906a'
    };

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
    const qrUrl   = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(mapsUrl)}`;

    return `
    <div class="pdf-card">
      <div class="pdf-card-photo" style="${photoUrl ? `background-image:url('${photoUrl}')` : gradient}">
        ${!photoUrl ? `<span class="pdf-card-emoji">${p.emoji}</span>` : ''}
        <div class="pdf-card-num">${i+1}</div>
      </div>
      <div class="pdf-card-body">
        <div class="pdf-card-cat" style="color:${catColors[p.cat] || '#888'}">${(CL[p.cat]||p.cat).toUpperCase()}</div>
        <div class="pdf-card-name">${p.name}</div>
        ${p.type ? `<div class="pdf-card-type">${p.type}</div>` : ''}
        <div class="pdf-card-meta">
          ${p.book ? `<span>📖 ${p.book}</span>` : ''}
          ${p.years ? `<span>🗓 ${p.years}</span>` : ''}
          ${p.address ? `<span>📍 ${p.address}</span>` : ''}
          ${p.phone ? `<span>📞 ${p.phone}</span>` : ''}
        </div>
        ${p.note ? `<div class="pdf-card-note">${String(p.note).split(/\n+/).map(function(t){return t.trim();}).filter(Boolean).map(function(t){return '<p class="pdf-note-para">'+t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</p>';}).join('')}</div>` : ''}
        ${p.visit ? `<div class="pdf-card-tip"><span class="pdf-tip-label">🧭 ${_enP ? 'today' : _ruP ? 'сегодня' : 'היום'}</span> ${p.visit}</div>` : ''}
        <div class="pdf-card-qr-row">
          <img class="pdf-qr" src="${qrUrl}" alt="Open in Maps">
          <span class="pdf-qr-label">${_enP ? 'Scan for Google Maps' : _ruP ? 'Сканируйте для Google Maps' : 'סריקה ל־Google Maps'}</span>
          ${p.website ? `<a class="pdf-website" href="${p.website}">${p.website.replace('https://','')}</a>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="${_enP ? 'en' : _ruP ? 'ru' : 'he'}" dir="${(_enP || _ruP) ? 'ltr' : 'rtl'}">
<head>
<meta charset="UTF-8">
<title>${typeof pickLang === 'function' ? pickLang(FAMILY.title) : FAMILY.title} · Family Story Map</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Inter', sans-serif;
    color: #0f1a2e;
    background: white;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Hebrew booklets were being laid out left to right: the text ran RTL but every
     block still hugged the left edge, and rows like the QR caption came out
     backwards. dir="rtl" on <html> flips the flow; these rules align the text and
     let the flex rows follow it. Anything deliberately centred stays centred. */
  html[dir="rtl"] body { text-align: right; }
  html[dir="rtl"] .pdf-card-meta,
  html[dir="rtl"] .pdf-card-qr-row { flex-direction: row-reverse; justify-content: flex-end; }
  html[dir="rtl"] .pdf-cover,
  html[dir="rtl"] .pdf-cover-stats,
  html[dir="rtl"] .pdf-footer { text-align: center; }
  html[dir="rtl"] .pdf-card-note { border-left: none; border-right: 2px solid #d4a84b; padding-left: 0; padding-right: 10px; }
  html[dir="rtl"] .pdf-tip-label { margin-right: 0; margin-left: 4px; }

  /* ── COVER PAGE ── */
  .pdf-cover {
    width: 100%; height: 100vh;
    min-height: 100vh;
    background: #0f0d0a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px;
    page-break-after: always;
    position: relative;
    overflow: hidden;
  }
  .pdf-cover::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 60%, rgba(212,168,75,0.25) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 30%, rgba(212,168,75,0.12) 0%, transparent 50%);
  }
  .pdf-cover-logo {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 1.1rem;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 40px;
    position: relative;
  }
  .pdf-cover-title {
    font-family: 'Playfair Display', serif;
    font-size: 4.5rem;
    color: white;
    line-height: 1;
    margin-bottom: 12px;
    position: relative;
  }
  .pdf-cover-subtitle {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 1.6rem;
    color: #d4a84b;
    margin-bottom: 48px;
    position: relative;
  }
  .pdf-cover-divider {
    width: 60px; height: 2px;
    background: rgba(255,255,255,0.25);
    margin: 0 auto 48px;
    position: relative;
  }
  .pdf-cover-stats {
    display: flex;
    gap: 48px;
    position: relative;
  }
  .pdf-stat {
    text-align: center;
  }
  .pdf-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    color: white;
    line-height: 1;
    margin-bottom: 4px;
  }
  .pdf-stat-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(255,255,255,0.45);
    font-weight: 600;
  }
  .pdf-cover-date {
    position: absolute;
    bottom: 40px;
    font-size: 0.7rem;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 500;
  }
  .pdf-cover-by {
    position: absolute;
    bottom: 60px;
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 0.95rem;
    color: rgba(255,255,255,0.6);
  }

  /* ── PLACE CARDS ── */
  .pdf-places { padding: 0; }

  .pdf-card {
    display: flex;
    width: 100%;
    min-height: 240px;
    border-bottom: 1px solid #e8e4dc;
    page-break-inside: avoid;
    background: white;
  }
  .pdf-card-photo {
    width: 260px;
    flex-shrink: 0;
    /* Family Edition: archive photos are irreplaceable and often wide group shots,
       so show the WHOLE frame rather than a centre crop. 'cover' was cutting group
       photos down to one shoulder. Matches .pc-photo-img (contain) on screen. */
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #efeae1;
    border-right: 1px solid #e8e4dc;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    padding: 12px;
    position: relative;
  }
  .pdf-card-emoji {
    font-size: 3.5rem;
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
  }
  .pdf-card-num {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: white;
    color: #0f0d0a;
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    position: relative;
    z-index: 1;
  }
  .pdf-card-body {
    flex: 1;
    padding: 18px 20px 14px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .pdf-card-cat {
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .pdf-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.35rem;
    color: #0f1a2e;
    line-height: 1.2;
  }
  .pdf-card-type {
    font-size: 0.68rem;
    color: #666;
    font-style: italic;
  }
  .pdf-card-meta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    font-size: 0.65rem;
    color: #555;
    margin-top: 2px;
  }
  .pdf-card-note {
    font-size: 0.72rem;
    line-height: 1.55;
    color: #333;
    font-style: italic;
    border-left: 2px solid #d4a84b;
    padding-left: 10px;
    margin: 4px 0;
    flex: 1;
  }
  .pdf-note-para { margin: 0 0 0.5em; }
  .pdf-note-para:last-child { margin-bottom: 0; }
  .pdf-note-by {
    font-size: 0.62rem;
    color: #d4a84b;
    font-weight: 600;
    font-style: normal;
  }
  .pdf-card-tip {
    font-size: 0.67rem;
    background: #fffbf0;
    border: 1px solid #f0e0a0;
    border-radius: 6px;
    padding: 7px 10px;
    color: #555;
    line-height: 1.4;
  }
  .pdf-tip-label {
    font-weight: 700;
    color: #d4a84b;
    margin-right: 4px;
  }
  .pdf-card-qr-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }
  .pdf-qr { width: 52px; height: 52px; }
  .pdf-qr-label {
    font-size: 0.55rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .pdf-website {
    margin-left: auto;
    font-size: 0.62rem;
    color: #0f0d0a;
    text-decoration: none;
  }

  /* Walk connector between cards */
  .pdf-walk {
    padding: 7px 20px 7px 248px;
    font-size: 0.65rem;
    color: #e00040;
    font-weight: 600;
    letter-spacing: 0.04em;
    border-left: none;
    background: #fff8f9;
    border-bottom: 1px solid #f5e0e4;
    page-break-inside: avoid;
  }

  /* Branding footer: appears on every printed page */
  .pdf-brand-footer {
    text-align: center;
    padding: 20px 0 28px;
    border-top: 1px solid #e8e4dc;
    margin-top: 20px;
  }
  .pdf-brand-footer-label {
    font-size: 0.58rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #aaa;
    font-weight: 500;
    margin-bottom: 3px;
  }
  .pdf-brand-footer-name {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 0.85rem;
    color: #0f0d0a;
    font-weight: 400;
  }
  .pdf-brand-footer-url {
    font-size: 0.6rem;
    color: #d4a84b;
    letter-spacing: 0.06em;
  }

  @media print {
    body { margin: 0; }
    .pdf-cover { page-break-after: always; }
    .pdf-card { page-break-inside: avoid; }
    .pdf-walk { page-break-inside: avoid; }
    .pdf-brand-footer { page-break-inside: avoid; }
    @page { margin: 0; size: A4; }
  }
</style>
</head>
<body>

<!-- COVER: the family story booklet -->
<div class="pdf-cover">
  <div class="pdf-cover-logo">Family Story Map by Ludara</div>
  <div class="pdf-cover-title">${typeof pickLang === 'function' ? pickLang(FAMILY.title) : FAMILY.title}</div>
  <div class="pdf-cover-subtitle">${window._pdfCoverSubtitle || (_enP ? 'Every place in the family story, in order' : _ruP ? 'Все места семейной истории, по порядку' : 'כל המקומות בסיפור המשפחה, לפי הסדר')}</div>
  <div class="pdf-cover-divider"></div>
  <div class="pdf-cover-stats">
    <div class="pdf-stat">
      <div class="pdf-stat-num">${places.length}</div>
      <div class="pdf-stat-label">${_enP ? 'places' : _ruP ? 'мест' : 'מקומות'}</div>
    </div>
    <div class="pdf-stat">
      <div class="pdf-stat-num">${_pdfTreeIcon()}</div>
      <div class="pdf-stat-label">${(typeof pickLang === 'function' && typeof FAMILY !== 'undefined' && FAMILY.credit) ? pickLang(FAMILY.credit) : ''}</div>
    </div>
  </div>
  <div class="pdf-cover-by">${_enP ? 'Created with Family Story Map' : _ruP ? 'Создано с Family Story Map' : 'נוצר עם Family Story Map'}</div>
  <div class="pdf-cover-date">${date}</div>
</div>

<!-- PLACE CARDS -->
<div class="pdf-places">
  ${cards}
</div>

<!-- BRANDING FOOTER -->
<div class="pdf-brand-footer">
  <div class="pdf-brand-footer-label">${_enP ? 'Interactive family map created with' : _ruP ? 'Интерактивная семейная карта создана с' : 'מפה משפחתית אינטראקטיבית שנוצרה עם'}</div>
  <div class="pdf-brand-footer-name">Family Story Map</div>
  <div class="pdf-brand-footer-url">ludara.ai</div>
</div>

</body>
</html>`;

  // Open in new window → user hits Cmd/Ctrl+P or Save as PDF
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();

  // Trigger print dialog after images load
  win.onload = () => {
    setTimeout(() => {
      win.focus();
      win.print();
    }, 1200);
  };
}

