// ── PDF DAY GUIDE GENERATOR ──────────────────────────────────
// Uses browser's print-to-PDF via a hidden printable page
// No external libraries needed

async function generatePDF(){
  const places = getSortedFavPlaces();
  if(!places || places.length === 0){
    alert('Save some places first using the ♡ button, then generate your guide.');
    return;
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
      landmark:'linear-gradient(135deg,#1a3a5c,#2a5298)',
      food:    'linear-gradient(135deg,#7a3020,#c06040)',
      cafe:    'linear-gradient(135deg,#1a3a2a,#2a7a4a)',
      church:  'linear-gradient(135deg,#1a1a5c,#3a3a9c)',
      market:  'linear-gradient(135deg,#5c3a1a,#9c6a3a)',
      soviet:  'linear-gradient(135deg,#3a1a5c,#6a3a9c)',
      pub:     'linear-gradient(135deg,#3a1a5c,#6a3a9c)',
      nature:  'linear-gradient(135deg,#1a4a2a,#3a8a4a)',
    }[p.cat] || 'linear-gradient(135deg,#1a3a5c,#2a5298)';

    const catColors = {
      landmark:'#e8724a', food:'#f0c060', cafe:'#6b9e6e',
      church:'#6090c8', market:'#c08060', soviet:'#9080a8', pub:'#9080a8', nature:'#50906a'
    };

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
    const qrUrl   = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(mapsUrl)}`;

    const distNext = i < places.length-1 ? _routeStats.distM / Math.max(places.length-1,1) : null;
    const walkNext = i < places.length-1
      ? `<div class="pdf-walk">↓ ~${_routeStats.legMins[i]} min walk to next stop</div>`
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

  /* ── COVER PAGE ── */
  .pdf-cover {
    width: 100%; height: 100vh;
    min-height: 100vh;
    background: #1a3a5c;
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
    background: radial-gradient(ellipse at 30% 60%, rgba(184,150,10,0.25) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 30%, rgba(42,114,152,0.3) 0%, transparent 50%);
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
    color: #b8960a;
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
    color: #1a3a5c;
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
    border-left: 2px solid #b8960a;
    padding-left: 10px;
    margin: 4px 0;
    flex: 1;
  }
  .pdf-note-by {
    font-size: 0.62rem;
    color: #b8960a;
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
    color: #b8960a;
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
    color: #1a3a5c;
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
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 0.85rem;
    color: #1a3a5c;
    font-weight: 400;
  }
  .pdf-brand-footer-url {
    font-size: 0.6rem;
    color: #b8960a;
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
  <div class="pdf-cover-logo">${typeof BLOGGER_NAME !== 'undefined' ? BLOGGER_NAME : 'A Perfect Day'} · A Perfect Day by Ludara</div>
  <div class="pdf-cover-title">${typeof GUIDE_CITY !== 'undefined' ? GUIDE_CITY : 'City Guide'}</div>
  <div class="pdf-cover-subtitle">Your personal day guide</div>
  <div class="pdf-cover-divider"></div>
  <div class="pdf-cover-stats">
    <div class="pdf-stat">
      <div class="pdf-stat-num">${places.length}</div>
      <div class="pdf-stat-label">Places</div>
    </div>
    <div class="pdf-stat">
      <div class="pdf-stat-num">~${totalMins < 60 ? totalMins + 'm' : Math.round(totalMins/6)/10 + 'h'}</div>
      <div class="pdf-stat-label">Walking</div>
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
