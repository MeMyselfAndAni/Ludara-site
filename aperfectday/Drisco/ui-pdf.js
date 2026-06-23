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

async function generatePDF(){
  const places = getSortedFavPlaces();
  if(!places || places.length === 0){
    alert('Save some places first using the ♡ button, then generate your guide.');
    return;
  }

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

  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // Use OSRM stats from planFavTrip() if already fetched, otherwise fetch now
  const _routeStats = (typeof _lastRouteStats !== 'undefined' && _lastRouteStats)
    ? _lastRouteStats
    : await _fetchRouteStats(places);

  const totalM    = _routeStats.distM;
  const totalMins = _routeStats.walkMins;

  // Build HTML for each place card
  const cards = places.map((p, i) => {
    const photoUrl = photoCache[p.id]?.url || '';
    const gradient = {
      stay:    'linear-gradient(135deg,#12283f,#1a3a5c)',
      dining:  'linear-gradient(135deg,#7a2c18,#c0492a)',
      cafe:    'linear-gradient(135deg,#7a5418,#c98a2b)',
      bar:     'linear-gradient(135deg,#3a1a3a,#8b5080)',
      culture: 'linear-gradient(135deg,#1a3a5c,#4a7ab0)',
      shop:    'linear-gradient(135deg,#2a3a2a,#5a8060)',
      wellness:'linear-gradient(135deg,#143a34,#2f8f7f)',
    }[p.cat] || 'linear-gradient(135deg,#00342f,#004f48)';

    const catColors = {
      stay:'#1a3a5c', dining:'#c0492a', cafe:'#c98a2b',
      bar:'#8b5080', culture:'#4a7ab0', shop:'#5a8060', wellness:'#2f8f7f'
    };

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
    const qrUrl   = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(mapsUrl)}`;

    const distNext = i < places.length-1 ? _routeStats.distM / Math.max(places.length-1,1) : null;
    const legMode  = _routeStats.legModes ? _routeStats.legModes[i] : (_routeStats.travelMode || 'walk');
    const modeLabel = legMode === 'driving' ? '🚗 drive' : legMode === 'boat' ? '⛵ vaporetto' : '🚶 walk';
    const walkNext = i < places.length-1
      ? `<div class="pdf-walk">↓ ~${_routeStats.legMins[i]} min ${modeLabel} to next stop</div>`
      : '';

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
          ${p.hours ? `<span>🕐 ${p.hours}</span>` : ''}
          ${p.address ? `<span>📍 ${p.address}</span>` : ''}
          ${p.phone ? `<span>📞 ${p.phone}</span>` : ''}
        </div>
        ${p.note ? `<div class="pdf-card-note">"${p.note}"<span class="pdf-note-by"> — ${typeof BLOGGER_NAME !== 'undefined' ? BLOGGER_NAME : 'Your Guide'}</span></div>` : ''}
        ${p.tip ? `<div class="pdf-card-tip"><span class="pdf-tip-label">💡 ${typeof BLOGGER_NAME !== 'undefined' ? BLOGGER_NAME + "'s Tip" : 'Tip'}</span> ${p.tip}</div>` : ''}
        <div class="pdf-card-qr-row">
          <img class="pdf-qr" src="${qrUrl}" alt="Open in Maps">
          <span class="pdf-qr-label">Scan for Google Maps</span>
          ${p.website ? `<a class="pdf-website" href="${p.website}">${p.website.replace('https://','')}</a>` : ''}
        </div>
      </div>
    </div>
    ${walkNext}`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>A Perfect Day · ${typeof GUIDE_CITY !== 'undefined' ? GUIDE_CITY : 'City Guide'}</title>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Poppins', sans-serif;
    color: #1c1c1c;
    background: white;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ── COVER PAGE ── */
  .pdf-cover {
    width: 100%; height: 100vh;
    min-height: 100vh;
    background: #231f20;
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
    background: radial-gradient(ellipse at 30% 60%, rgba(0,79,72,0.40) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 30%, rgba(233,202,184,0.14) 0%, transparent 50%);
  }
  .pdf-cover-logo {
    font-family: 'Source Serif 4', serif;
    font-style: italic;
    font-size: 1.1rem;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 40px;
    position: relative;
  }
  .pdf-cover-drisco-logo {
    height: 58px;
    width: auto;
    margin-bottom: 26px;
    position: relative;
    filter: drop-shadow(0 1px 6px rgba(0,0,0,0.45));
  }
  .pdf-cover-title {
    font-family: 'Source Serif 4', serif;
    font-size: 4.5rem;
    color: white;
    line-height: 1;
    margin-bottom: 12px;
    position: relative;
  }
  .pdf-cover-subtitle {
    font-family: 'Source Serif 4', serif;
    font-style: italic;
    font-size: 1.6rem;
    color: #e9cab8;
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
    font-family: 'Source Serif 4', serif;
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
    font-family: 'Source Serif 4', serif;
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
    width: 220px;
    flex-shrink: 0;
    background-size: cover;
    background-position: center;
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
    color: #231f20;
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
    font-family: 'Source Serif 4', serif;
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
    border-left: 2px solid #004f48;
    padding-left: 10px;
    margin: 4px 0;
    flex: 1;
  }
  .pdf-note-by {
    font-size: 0.62rem;
    color: #004f48;
    font-weight: 600;
    font-style: normal;
  }
  .pdf-card-tip {
    font-size: 0.67rem;
    background: #f4f7f5;
    border: 1px solid #d8e6e0;
    border-radius: 6px;
    padding: 7px 10px;
    color: #555;
    line-height: 1.4;
  }
  .pdf-tip-label {
    font-weight: 700;
    color: #004f48;
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
    color: #231f20;
    text-decoration: none;
  }

  /* Walk connector between cards */
  .pdf-walk {
    padding: 7px 20px 7px 248px;
    font-size: 0.65rem;
    color: #004f48;
    font-weight: 600;
    letter-spacing: 0.04em;
    border-left: none;
    background: #f3f6f4;
    border-bottom: 1px solid #dfeae6;
    page-break-inside: avoid;
  }

  /* Branding footer — appears on every printed page */
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
    font-family: 'Source Serif 4', serif;
    font-style: italic;
    font-size: 0.85rem;
    color: #231f20;
    font-weight: 400;
  }
  .pdf-brand-footer-url {
    font-size: 0.6rem;
    color: #004f48;
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

<!-- COVER -->
<div class="pdf-cover">
  <img class="pdf-cover-drisco-logo" src="${new URL('Branding/drisco-logo-white.png', location.href).href}" alt="The Drisco">
  <div class="pdf-cover-logo">A Perfect Day in</div>
  <div class="pdf-cover-title">Tel Aviv-Jaffa</div>
  <div class="pdf-cover-subtitle">Your personal day guide</div>
  <div class="pdf-cover-divider"></div>
  <div class="pdf-cover-stats">
    <div class="pdf-stat">
      <div class="pdf-stat-num">${places.length}</div>
      <div class="pdf-stat-label">Places</div>
    </div>
    <div class="pdf-stat">
      <div class="pdf-stat-num">${_routeStats.travelMode === 'driving' ? '🚗' : _routeStats.travelMode === 'boat' ? '⛵' : '🚶'} ~${totalMins < 60 ? totalMins + 'm' : Math.round(totalMins/6)/10 + 'h'}</div>
      <div class="pdf-stat-label">${_routeStats.travelMode === 'driving' ? 'Driving' : _routeStats.travelMode === 'boat' ? 'Travel Time' : 'Walking'}</div>
    </div>
    <div class="pdf-stat">
      <div class="pdf-stat-num">${formatDistanceValue(totalM)}</div>
      <div class="pdf-stat-label">${formatDistanceUnit()}</div>
    </div>
  </div>
  <div class="pdf-cover-by">Curated by ${typeof BLOGGER_NAME !== 'undefined' ? BLOGGER_NAME : 'Your Guide'}</div>
  <div class="pdf-cover-date">${date}</div>
</div>

<!-- PLACE CARDS -->
<div class="pdf-places">
  ${cards}
</div>

<!-- BRANDING FOOTER -->
<div class="pdf-brand-footer">
  <div class="pdf-brand-footer-label">Interactive map guide created with</div>
  <div class="pdf-brand-footer-name">A Perfect Day</div>
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
