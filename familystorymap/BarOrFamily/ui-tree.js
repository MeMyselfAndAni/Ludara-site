// A Perfect Story Map — Family Edition
// ui-tree.js — the family tree overlay, linked both ways with the map:
//   • tree → map : click a person, their life journey is drawn on the map
//                  (numbered stops + route line, like the Family Path)
//   • map → tree : every place card shows chips of the people who lived there;
//                  a chip opens the tree scrolled to that person
// Data comes from people.js (PEOPLE, FAMILY_UNIONS, FAMILY_EXTRA_EDGES).
// Load order: after people.js, map.js and ui-card.js.

// ui-tree.js — SHARED ENGINE FILE. Identical in every family map.
// Branch keys, colours, labels and headings all come from FAMILY (family.js).
// Nothing in here may name a family: every hardcoded branch key used to be a way
// for one family's names to survive into another family's map.
(function(){
  const _TB   = (FAMILY.tree && FAMILY.tree.branches) || [];
  const _KEYS = _TB.map(b => b.key);
  const _HL   = _KEYS.map(k => 'hl-' + k);

  const COLW = 200, ROWH = 170, NW = 186, NH = 88, PADX = 50, PADY = 70;

  // A branch with col:null draws no heading — used when the family is one line of
  // descent rather than parallel branches.
  const BRANCH_HEADERS = _TB
    .filter(b => b.header && b.col !== null && b.col !== undefined)
    .map(b => ({ branch:b.key, label:b.header, col:b.col }));

  const nodeX = p => PADX + p.col * COLW;
  const nodeY = p => PADY + p.row * ROWH;
  const cx    = p => nodeX(p) + NW/2;
  const cy    = p => nodeY(p) + NH/2;
  const byId  = id => PEOPLE.find(p => p.id === id);

  let canvasW = 0, canvasH = 0, zoom = 0.55;

  // ── Styles + overlay DOM ─────────────────────────────────────────────────
  function injectDom(){
    const style = document.createElement('style');
    style.textContent = `
      #tree-overlay { position:fixed; inset:0; z-index:6000; background:#0f0d0a; display:none; flex-direction:column; }
      #tree-overlay.open { display:flex; }
      .tree-header { display:flex; align-items:center; gap:10px; padding:10px 16px; flex-wrap:wrap; border-bottom:1px solid rgba(212,168,75,0.35); }
      .tree-title { font-family:'Fraunces',Georgia,serif; font-size:1.25rem; color:#d4a84b; font-weight:700; unicode-bidi:plaintext; }
      .tree-hint { font-size:0.72rem; color:#bba97a; unicode-bidi:plaintext; }
      .tree-btn { background:none; border:1.5px solid rgba(212,168,75,0.6); color:#d4a84b; border-radius:16px; padding:5px 12px; font-size:0.75rem; font-weight:700; cursor:pointer; font-family:'Inter',sans-serif; }
      .tree-btn:hover { background:rgba(212,168,75,0.15); }
      .tree-close { margin-inline-start:auto; font-size:1rem; }
      #tree-scroll { flex:1; overflow:auto; direction:ltr; cursor:grab; }
      #tree-scroll.dragging { cursor:grabbing; }
      .tree-node { cursor:pointer; }
      .tree-node rect { fill:#fffdf7; stroke-width:2; rx:12; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.45)); }
      .tree-node:hover rect { fill:#fff3d6; }
      .tree-node text { font-family:'Inter','Segoe UI',sans-serif; pointer-events:none; }
      .tree-node .t-he { font-size:13px; font-weight:700; fill:#1a1a1a; }
      .tree-node .t-ru { font-size:10.5px; fill:#555; }
      .tree-node .t-role { font-size:9.3px; fill:#7a6a45; }
      .tree-node.no-places rect { stroke-dasharray:none; opacity:0.92; }
      .tree-node .t-pin { font-size:10px; }
      .tree-node.pulse rect { animation: treePulse 1.2s ease-in-out 3; }
      @keyframes treePulse { 0%,100%{ stroke-width:2; } 50%{ stroke-width:7; } }
      .pc-people { display:flex; flex-wrap:wrap; gap:6px; margin:8px 0 2px; unicode-bidi:plaintext; }
      .pc-people-label { width:100%; font-size:0.68rem; font-weight:700; color:#8a7a55; letter-spacing:0.04em; unicode-bidi:plaintext; }
      .pc-person-chip { border:1.5px solid; border-radius:14px; background:#fffdf7; padding:3px 10px; font-size:0.72rem; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif; unicode-bidi:plaintext; }
      .pc-person-chip:hover { background:#fff3d6; }
      /* Branch highlight — select a last name, its branch lights up, the rest dims.
         Generated from FAMILY.tree.branches, so adding a branch needs no CSS edit. */
      ${_KEYS.map(k => `#tree-svg.hl-${k} .tree-node:not(.br-${k}) { opacity:0.16; }
      #tree-svg.hl-${k} .tree-edge:not(.br-${k}) { opacity:0.10; }
      #tree-svg.hl-${k} .tree-node.br-${k} rect { fill:${(THREAD_TINT && THREAD_TINT[k]) || '#f3efe6'}; stroke-width:3.5; }
      .tree-btn.hl-on-${k} { background:${(CC && CC[k]) || '#8a7a55'}; border-color:${(CC && CC[k]) || '#8a7a55'}; color:#fff; }`).join('\n      ')}
      .tree-node, .tree-edge { transition:opacity 0.25s; }
      .tree-btn.hl-on-all    { background:#d4a84b; border-color:#d4a84b; color:#16130c; }
      @media (max-width:768px){ .tree-hint { display:none; } }
    `;
    document.head.appendChild(style);

    const ov = document.createElement('div');
    ov.id = 'tree-overlay';
    ov.innerHTML = `
      <div class="tree-header">
        <span class="tree-title">${FAMILY.tree.title}</span>
        <span class="tree-hint">${FAMILY.tree.hint}</span>
        <button class="tree-btn" id="tree-btn-all" onclick="window._treeJump(null)">${FAMILY.tree.allChip}</button>
        ${_TB.map(b => `<button class="tree-btn" id="tree-btn-${b.key}" onclick="window._treeJump('${b.key}')">${b.chip}</button>`).join('\n        ')}
        <button class="tree-btn" onclick="window._treeZoom(1.25)">＋</button>
        <button class="tree-btn" onclick="window._treeZoom(0.8)">－</button>
        <button class="tree-btn" onclick="window._treeFit()">⤢</button>
        <button class="tree-btn tree-close" onclick="closeFamilyTree()">✕ סגירה</button>
      </div>
      <div id="tree-scroll"></div>
    `;
    document.body.appendChild(ov);
  }

  // ── SVG build ────────────────────────────────────────────────────────────
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function buildSVG(){
    canvasW = Math.max(...PEOPLE.map(p => nodeX(p))) + NW + PADX;
    canvasH = Math.max(...PEOPLE.map(p => nodeY(p))) + NH + PADY + 40;
    // Look the branch up directly in the thread colours. An earlier version mapped
    // anything that wasn't friedland/kliot onto 'lando', so every branch of the
    // next family rendered grey — the exact failure this file is now built to avoid.
    const col = b => (typeof CC !== 'undefined' && CC[b]) || '#8a7a55';

    let s = '';

    // Branch headers
    BRANCH_HEADERS.forEach(h => {
      s += `<text x="${PADX + h.col*COLW}" y="${PADY-30}" style="font-family:'Fraunces',Georgia,serif;font-size:22px;font-weight:700;fill:${col(h.branch)}">${esc(typeof pickLang === 'function' ? pickLang(h.label) : h.label)}</text>`;
    });

    // Union connectors (behind nodes)
    FAMILY_UNIONS.forEach(u => {
      const ps = u.p.map(byId).filter(Boolean);
      if(!ps.length) return;
      s += `<g class="tree-edge br-${ps[0].branch}">`;
      let mx, my;
      if(ps.length === 2){
        const [a,b] = ps;
        mx = (cx(a)+cx(b))/2; my = (cy(a)+cy(b))/2;
        s += `<path d="M ${cx(a)} ${cy(a)} L ${cx(b)} ${cy(b)}" stroke="#c9a227" stroke-width="2.5" fill="none" opacity="0.85"/>`;
        s += `<circle cx="${mx}" cy="${my}" r="5" fill="#0f0d0a" stroke="#c9a227" stroke-width="2"/>`;
      } else {
        mx = cx(ps[0]); my = nodeY(ps[0]) + NH;
      }
      const kids = u.c.map(byId).filter(Boolean);
      if(kids.length){
        const busY = Math.min(...kids.map(k => nodeY(k))) - 22;
        s += `<path d="M ${mx} ${my} L ${mx} ${busY}" stroke="#9c8a5a" stroke-width="1.8" fill="none"/>`;
        const xs = kids.map(k => cx(k)).concat([mx]);
        s += `<path d="M ${Math.min(...xs)} ${busY} L ${Math.max(...xs)} ${busY}" stroke="#9c8a5a" stroke-width="1.8" fill="none"/>`;
        kids.forEach(k => {
          s += `<path d="M ${cx(k)} ${busY} L ${cx(k)} ${nodeY(k)}" stroke="#9c8a5a" stroke-width="1.8" fill="none"/>`;
        });
      }
      s += `</g>`;
    });

    // Dotted "descent known, exact line open" edges
    FAMILY_EXTRA_EDGES.forEach(e => {
      const a = byId(e.from), b = byId(e.to);
      if(!a || !b) return;
      s += `<g class="tree-edge br-${a.branch}"><path d="M ${cx(a)} ${nodeY(a)+NH} C ${cx(a)} ${nodeY(a)+NH+50}, ${cx(b)} ${nodeY(b)-50}, ${cx(b)} ${nodeY(b)}" stroke="#9c8a5a" stroke-width="1.6" stroke-dasharray="4 5" fill="none" opacity="0.8"/></g>`;
    });

    // Nodes — 4 centred lines: HE name, RU name, years + HE role, RU role.
    // Each line is ellipsized so text always stays inside the card.
    const fit = (t, n) => (t && t.length > n) ? t.slice(0, n-1) + '…' : (t || '');
    PEOPLE.forEach(p => {
      const c = col(p.branch);
      const hasPlaces = p.places && p.places.length;
      const pin = hasPlaces ? `<text class="t-pin" x="${NW-16}" y="17">📍</text>` : '';
      const parts  = (p.role || '').split(' · ');
      const roleHe = parts.shift() || '';
      let roleRu = '', roleEn = '';
      parts.forEach(function(t2){
        if(/[Ѐ-ӿ]/.test(t2)) roleRu = roleRu ? roleRu + ' · ' + t2 : t2;
        else roleEn = roleEn ? roleEn + ' · ' + t2 : t2;
      });
      const isRu   = (typeof LANG !== 'undefined' && LANG === 'ru');
      const isHe   = (typeof LANG !== 'undefined' && LANG === 'he');
      const isEn   = (typeof LANG !== 'undefined' && LANG === 'en');
      let yrs = p.years || '';
      if(isRu) yrs = yrs.replace('נרצחה','погибла').replace('נפל','погиб').replace("נפ׳ בגיל","ум. в").replace("נפ׳","ум.").replace("נ׳","р.").replace('נישא','женился').replace('פולין · Польша','Польша');
      if(isHe) yrs = yrs.replace('פולין · Польша','פולין');
      if(isEn) yrs = yrs.replace('נרצחה','murdered').replace('נפל','fell').replace("נפ׳ בגיל","d. at").replace("נפ׳","d.").replace("נ׳","b.").replace('נישא','m.').replace('פולין · Польша','Poland');
      let l3, l4;
      if(isEn){ l3 = [yrs, roleEn || roleRu || roleHe].filter(Boolean).join(' · '); l4 = ''; }
      else if(isRu){ l3 = [yrs, roleRu || roleHe].filter(Boolean).join(' · '); l4 = ''; }
      else if(isHe){ l3 = [yrs, roleHe].filter(Boolean).join(' · '); l4 = ''; }
      else { l3 = [yrs, roleHe].filter(Boolean).join(' · '); l4 = roleRu; }
      if(!l3){ l3 = l4; l4 = ''; }
      s += `<g class="tree-node br-${p.branch} ${hasPlaces?'':'no-places'}" id="tn-${p.id}" transform="translate(${nodeX(p)},${nodeY(p)})" onclick="window._treePersonClick('${p.id}')">
        <rect width="${NW}" height="${NH}" rx="12" stroke="${c}"/>
        <text class="t-he" x="${NW/2}" y="22" text-anchor="middle">${esc(fit(isEn ? (p.en || p.ru) : isRu ? p.ru : p.he, 26))}</text>
        <text class="t-ru" x="${NW/2}" y="39" text-anchor="middle">${esc(fit(isEn ? p.he : isRu ? p.he : p.ru, 30))}</text>
        <text class="t-role" x="${NW/2}" y="57" text-anchor="middle">${esc(fit(l3, 36))}</text>
        <text class="t-role" x="${NW/2}" y="72" text-anchor="middle">${esc(fit(l4, 36))}</text>
        ${pin}
      </g>`;
    });

    return `<svg id="tree-svg" viewBox="0 0 ${canvasW} ${canvasH}" xmlns="http://www.w3.org/2000/svg" style="width:${canvasW*zoom}px;height:auto;display:block;background:
      repeating-linear-gradient(0deg, rgba(212,168,75,0.03) 0 1px, transparent 1px ${ROWH}px)">${s}</svg>`;
  }

  function render(){
    const sc = document.getElementById('tree-scroll');
    if(sc) sc.innerHTML = buildSVG();
    // Re-assert the branch highlight: buildSVG() replaces the <svg>, so without this
    // the class is lost on rebuild, and the "All" chip would not read as active when
    // the tree first opens.
    if(typeof _applyHighlight === 'function') _applyHighlight();
  }

  function applyZoom(){
    const svg = document.getElementById('tree-svg');
    if(svg) svg.style.width = (canvasW * zoom) + 'px';
  }

  // ── Public controls ──────────────────────────────────────────────────────
  window._treeZoom = f => { zoom = Math.min(1.6, Math.max(0.15, zoom * f)); applyZoom(); };
  window._treeFit  = () => {
    const sc = document.getElementById('tree-scroll');
    if(!sc) return;
    zoom = Math.max(0.15, (sc.clientWidth - 20) / canvasW);
    applyZoom(); sc.scrollLeft = 0; sc.scrollTop = 0;
  };
  let _hlBranch = null;
  function _applyHighlight(){
    const svg = document.getElementById('tree-svg');
    if(svg){
      svg.classList.remove.apply(svg.classList, _HL);
      if(_hlBranch) svg.classList.add('hl-' + _hlBranch);
    }
    _KEYS.forEach(b => {
      const btn = document.getElementById('tree-btn-' + b);
      if(btn) btn.classList.toggle('hl-on-' + b, _hlBranch === b);
    });
    const allBtn = document.getElementById('tree-btn-all');
    if(allBtn) allBtn.classList.toggle('hl-on-all', !_hlBranch);
  }
  // Clicking the active branch again clears it, but that was the ONLY way back to
  // the whole tree and nothing on screen said so. _treeJump(null) — the "all"
  // chip — now clears it explicitly. (Fixed 31 Jul 2026.)
  window._treeJump = branch => {
    _hlBranch = (!branch || _hlBranch === branch) ? null : branch;
    _applyHighlight();
    if(_hlBranch){
      const first = PEOPLE.filter(p => p.branch === branch).sort((a,b) => a.col - b.col)[0];
      const sc = document.getElementById('tree-scroll');
      if(first && sc) sc.scrollTo({ left: nodeX(first)*zoom - 40, top: 0, behavior:'smooth' });
    }
  };

  window.openFamilyTree = function(personId){
    const ov = document.getElementById('tree-overlay');
    if(!ov) return;
    ov.classList.add('open');
    if(!document.getElementById('tree-svg')) render();
    if(personId){
      const p = byId(personId);
      const sc = document.getElementById('tree-scroll');
      if(p && sc){
        sc.scrollTo({ left: cx(p)*zoom - sc.clientWidth/2, top: cy(p)*zoom - sc.clientHeight/2 });
        const n = document.getElementById('tn-' + personId);
        if(n){ n.classList.remove('pulse'); void n.getBoundingClientRect(); n.classList.add('pulse'); }
      }
    }
  };
  window.closeFamilyTree = function(){
    const ov = document.getElementById('tree-overlay');
    if(ov) ov.classList.remove('open');
  };

  // ── Tree → map: draw a person's journey ──────────────────────────────────
  window._treePersonClick = function(personId){
    const per = byId(personId);
    if(!per) return;
    const label = (typeof LANG !== 'undefined' && LANG === 'en') ? (per.en || per.he) : (typeof LANG !== 'undefined' && LANG === 'ru') ? per.ru : (typeof LANG !== 'undefined' && LANG === 'he') ? per.he : per.he + ' · ' + per.ru;
    const pl = (per.places || []).map(id => PLACES.find(p => p.id === id)).filter(Boolean);
    if(!pl.length){
      const n = document.getElementById('tn-' + personId);
      if(n){ n.classList.remove('pulse'); void n.getBoundingClientRect(); n.classList.add('pulse'); }
      if(typeof _toast === 'function') _toast(label + (typeof pickLang==='function' ? pickLang(' — אין מקומות מקושרים במפה') : ' — אין מקומות מקושרים במפה'), 2800);
      return;
    }
    closeFamilyTree();
    if(typeof closePlaceCard === 'function') closePlaceCard(true);
    if(!window.map || !map.getSource){ return; }
    if(pl.length === 1){
      if(typeof openDetail === 'function') openDetail(pl[0].id);
      if(typeof _toast === 'function') _toast('📍 ' + label, 3000);
      return;
    }
    if(typeof _ensureRouteLayer === 'function') _ensureRouteLayer();
    if(typeof clearTripRoute === 'function') clearTripRoute();
    try {
      tripPolyline = true;
      map.getSource('trip-route').setData({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: pl.map(p => [p.lng, p.lat]) }
      });
    } catch(e) {}
    if(typeof window._addNumberedMarkers === 'function') window._addNumberedMarkers(pl);
    const b = new maplibregl.LngLatBounds();
    pl.forEach(p => b.extend([p.lng, p.lat]));
    const m = window.innerWidth < 768;
    map.fitBounds(b, { padding: m ? {top:140,bottom:190,left:40,right:40} : {top:190,bottom:230,left:120,right:120}, duration: 800 });
    if(typeof _toast === 'function') _toast('📍 ' + label + (typeof pickLang==='function' ? pickLang(' — המסע על המפה') : ' — המסע על המפה'), 3800);
  };

  // ── Map → tree: person chips on every place card ─────────────────────────
  function renderChips(){
    const titleEl = document.getElementById('pc-title');
    const host = document.getElementById('pc-people');
    if(!titleEl || !host) return;
    const name = titleEl.textContent.trim();
    const place = PLACES.find(p => p.name === name);
    if(!place){ host.innerHTML = ''; return; }
    const folks = PEOPLE.filter(per => (per.places || []).includes(place.id));
    if(!folks.length){ host.innerHTML = ''; return; }
    const colOf = b => (typeof CC !== 'undefined' && CC[b]) || '#8a7a55';
    const isRu = (typeof LANG !== 'undefined' && LANG === 'ru');
    const isEn = (typeof LANG !== 'undefined' && LANG === 'en');
    const lbl = (typeof pickLang === 'function') ? pickLang('🌳 מי קשור למקום') : '🌳 מי קשור למקום';
    host.innerHTML = '<span class="pc-people-label">' + lbl + '</span>' +
      folks.map(per =>
        `<button class="pc-person-chip" style="border-color:${colOf(per.branch)};color:${colOf(per.branch)}" onclick="closePlaceCard(true);openFamilyTree('${per.id}')">${esc(isEn ? (per.en || per.he) : isRu ? per.ru : per.he)}</button>`
      ).join('');
  }

  // ── Drag-to-pan + mouse-wheel zoom inside the tree ───────────────────────
  function enableDrag(){
    const sc = document.getElementById('tree-scroll');
    if(!sc) return;
    // Wheel = zoom, centred on the cursor (trackpad pinch works too)
    sc.addEventListener('wheel', function(e){
      e.preventDefault();
      const f = e.deltaY < 0 ? 1.12 : 1/1.12;
      const rect = sc.getBoundingClientRect();
      const mx = e.clientX - rect.left + sc.scrollLeft;
      const my = e.clientY - rect.top  + sc.scrollTop;
      const before = zoom;
      zoom = Math.min(1.6, Math.max(0.15, zoom * f));
      if(zoom === before) return;
      const k = zoom / before;
      applyZoom();
      sc.scrollLeft = mx * k - (e.clientX - rect.left);
      sc.scrollTop  = my * k - (e.clientY - rect.top);
    }, { passive:false });
    let down = false, sx = 0, sy = 0, sl = 0, st = 0, moved = false;
    sc.addEventListener('pointerdown', e => { down = true; moved = false; sx = e.clientX; sy = e.clientY; sl = sc.scrollLeft; st = sc.scrollTop; });
    sc.addEventListener('pointermove', e => {
      if(!down) return;
      if(Math.abs(e.clientX-sx) + Math.abs(e.clientY-sy) > 6){ moved = true; sc.classList.add('dragging'); }
      sc.scrollLeft = sl - (e.clientX - sx); sc.scrollTop = st - (e.clientY - sy);
    });
    window.addEventListener('pointerup', () => { down = false; sc.classList.remove('dragging'); });
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  window._treeRebuild = function(){ render(); };

  window.addEventListener('load', function(){
    injectDom();
    render();
    enableDrag();
    // fit on first open
    const ov = document.getElementById('tree-overlay');
    const obsOpen = new MutationObserver(() => {
      if(ov.classList.contains('open') && !ov.dataset.fitted){ ov.dataset.fitted = '1'; window._treeFit(); }
    });
    obsOpen.observe(ov, { attributes:true, attributeFilter:['class'] });
    // person chips whenever a place card opens / changes
    const titleEl = document.getElementById('pc-title');
    if(titleEl) new MutationObserver(renderChips).observe(titleEl, { childList:true, characterData:true, subtree:true });
  });
})();
