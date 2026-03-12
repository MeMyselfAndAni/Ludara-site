// ── LIST ──────────────────────────────────────────────────────
function renderList(){
  const el=document.getElementById('places-list');
  let filtered=AF==='all'?PLACES:PLACES.filter(p=>p.cat===AF);
  if(openNowActive) filtered=filtered.filter(p=>isOpenNow(p));
  const count=filtered.length;
  document.getElementById('sheet-title').textContent=`${count} Places`;
  document.getElementById('list-badge').textContent=count;

  el.innerHTML=filtered.map(p=>`
    <div class="place-row ${p.id===AID?'active':''}" onclick="openDetail(${p.id})" id="row-${p.id}">
      <div class="cat-pip" style="background:${CC[p.cat]}"></div>
      <div class="place-thumb" id="thumb-${p.id}">${p.emoji}</div>
      <div class="place-info">
        <div class="place-name">${p.name}</div>
        <div class="place-type">${CL[p.cat]}</div>
        <div class="place-addr">${p.address}</div>
      </div>
      <span class="chevron">›</span>
    </div>`).join('');

  // Lazy-load thumbnails
  filtered.forEach(p=>{
    placesService.findPlaceFromQuery({
      query: p.search,
      fields:['photos']
    }, (results, status)=>{
      const thumb=document.getElementById(`thumb-${p.id}`);
      if(!thumb) return;
      if(status===google.maps.places.PlacesServiceStatus.OK && results[0]?.photos?.length){
        const url = results[0].photos[0].getUrl({maxWidth:96, maxHeight:96});
        thumb.innerHTML=`<img src="${url}" alt="${p.name}" loading="lazy">`;
      }
    });
  });
}

// ── DETAIL ────────────────────────────────────────────────────
function openDetail(id){
  const p=PLACES.find(x=>x.id===id);if(!p)return;

  // Reset previous marker
  if(AID && markers[AID]){
    const prev=PLACES.find(x=>x.id===AID);
    if(prev){ markers[AID].setIcon(makeIcon(prev,false)); markers[AID].setZIndex(1); }
  }

  AID=id;
  markers[id].setIcon(makeIcon(p,true));
  markers[id].setZIndex(999);
  updatePulse(p);
  map.panTo({lat:p.lat, lng:p.lng});

  // Update list highlight
  document.querySelectorAll('.place-row').forEach(r=>r.classList.remove('active'));
  const row=document.getElementById(`row-${id}`);
  if(row){row.classList.add('active');row.scrollIntoView({block:'nearest',behavior:'smooth'});}

  // Populate detail
  const col=CC[p.cat];
  document.getElementById('detail-cat').innerHTML=
    `<span class="detail-cat-dot" style="background:${col}"></span><span style="color:${col}">${CL[p.cat]}</span>`;
  document.getElementById('detail-title').textContent=p.name;
  document.getElementById('detail-type').textContent=p.type;
  document.getElementById('detail-note').textContent=p.note;
  document.getElementById('detail-emoji').textContent=p.emoji;

  // Quick meta
  let qmeta='';
  if(p.hours) qmeta+=`<div class="detail-quick-item"><span class="dqi-icon">🕐</span><span>${p.hours}</span></div>`;
  if(p.address) qmeta+=`<div class="detail-quick-item"><span class="dqi-icon">📍</span><span>${p.address}</span></div>`;
  document.getElementById('detail-quick-meta').innerHTML=qmeta;

  // Tip
  if(p.tip){
    document.getElementById('detail-tip').style.display='flex';
    document.getElementById('detail-tip-text').textContent=p.tip;
  } else {
    document.getElementById('detail-tip').style.display='none';
  }

  // Action buttons
  const mapsUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name+' Tbilisi Georgia')}`;
  let actions=`<a class="btn-primary" href="${mapsUrl}" target="_blank">📍 Open in Maps</a>`;
  if(p.website){
    actions+=`<a class="btn-secondary" href="${p.website}" target="_blank">🌐 Website</a>`;
  }
  if(p.phone){
    actions+=`<a class="btn-secondary" href="tel:${p.phone.replace(/\s/g,'')}">📞 ${p.phone}</a>`;
  }
  document.getElementById('detail-actions').innerHTML=actions;

  // Scroll detail body to top
  const body=document.getElementById('detail-body');
  if(body) body.scrollTop=0;

  // Photo — compact square
  const imgBox=document.getElementById('detail-img-box');
  const emojiEl=document.getElementById('detail-emoji');
  emojiEl.style.display='block';
  const oldImg=imgBox.querySelector('img.detail-sq-img');
  if(oldImg) oldImg.remove();
  document.getElementById('photo-credit').innerHTML='';

  fetchPhoto(p, data=>{
    if(data?.url){
      emojiEl.style.display='none';
      const img=document.createElement('img');
      img.src=data.url;
      img.className='detail-sq-img';
      img.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:12px;';
      imgBox.insertBefore(img, imgBox.firstChild);
      if(data.attr){
        const tmp=document.createElement('div');
        tmp.innerHTML=data.attr;
        document.getElementById('photo-credit').textContent='© '+(tmp.querySelector('a')?.textContent||'Google');
      }
    }
  });

  // Show detail sheet — always on top, close list on mobile
  document.getElementById('detail-sheet').classList.add('open');
  if(window.innerWidth < 768){
    document.getElementById('sheet').classList.remove('open');
  }
}

function backToList(){
  document.getElementById('detail-sheet').classList.remove('open');
  if(window.innerWidth < 768){
    openSheet();
  }
}

function closeDetail(){
  updatePulse(null);
  if(AID && markers[AID]){
    const prev=PLACES.find(x=>x.id===AID);
    if(prev){ markers[AID].setIcon(makeIcon(prev,false)); markers[AID].setZIndex(1); }
  }
  AID=null;
  document.getElementById('detail-sheet').classList.remove('open');
  document.querySelectorAll('.place-row').forEach(r=>r.classList.remove('active'));
  // On mobile: reopen the list so it stays visible after closing a detail
  if(window.innerWidth < 768){
    openSheet();
  }
}

// ── FILTER ────────────────────────────────────────────────────
function fc(el,cat){
  AF=cat;
  // Close detail panel but keep list visible
  document.getElementById('detail-sheet').classList.remove('open');
  if(AID && markers[AID]){
    const prev=PLACES.find(x=>x.id===AID);
    if(prev){ markers[AID].setIcon(makeIcon(prev,false)); markers[AID].setZIndex(1); }
  }
  AID=null;
  document.querySelectorAll('.place-row').forEach(r=>r.classList.remove('active'));

  document.querySelectorAll('.pill:not(.pill-opennow)').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  applyFilters();

  // On desktop, ensure sidebar is open when user picks a filter
  if(window.innerWidth >= 768){
    const s = document.getElementById('sheet');
    if(s.classList.contains('desktop-hidden')) openSheet();
  }
  // On mobile, open the sheet to show the filtered list
  if(window.innerWidth < 768){
    openSheet();
  }

  const vis=PLACES.filter(p=>(cat==='all'||p.cat===cat)&&(!openNowActive||isOpenNow(p)));
  if(vis.length){
    const b=new google.maps.LatLngBounds();
    vis.forEach(p=>b.extend({lat:p.lat,lng:p.lng}));
    map.fitBounds(b,{top:120,right:20,bottom:100,left:window.innerWidth>=768?320:20});
  }
}

// ── MY LOCATION ───────────────────────────────────────────────
let userMarker = null;
function locateMe(){
  const btn = document.getElementById('locate-btn');
  if(!navigator.geolocation){
    alert('Geolocation is not supported by your browser.');
    return;
  }
  btn.classList.add('locating');
  navigator.geolocation.getCurrentPosition(
    pos => {
      btn.classList.remove('locating');
      btn.classList.add('active');
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // Remove old marker
      if(userMarker) userMarker.setMap(null);

      // Create pulsing dot via OverlayView
      const dotDiv = document.createElement('div');
      dotDiv.innerHTML = '<div class="user-dot-outer"><div class="user-dot-inner"></div></div>';

      userMarker = new google.maps.marker.AdvancedMarkerElement
        ? new google.maps.marker.AdvancedMarkerElement({
            map, position:{lat,lng}, content: dotDiv.firstChild
          })
        : new google.maps.Marker({
            map, position:{lat,lng},
            icon:{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8, fillColor:'#1a3a5c', fillOpacity:1,
              strokeColor:'white', strokeWeight:2.5
            },
            title:'You are here'
          });

      // Pan to location smoothly
      map.panTo({lat, lng});
      // Only zoom in if user is far zoomed out
      if(map.getZoom() < 14) map.setZoom(15);
    },
    err => {
      btn.classList.remove('locating');
      const msgs = {1:'Location access denied.', 2:'Location unavailable.', 3:'Request timed out.'};
      alert(msgs[err.code] || 'Could not get location.');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}


// ── SPLASH ────────────────────────────────────────────────────
function closeSplash(){
  document.getElementById('splash').classList.add('hidden');
}

// ── OPEN NOW ─────────────────────────────────────────────────
let openNowActive = false;
function toggleOpenNow(el){
  openNowActive = !openNowActive;
  el.classList.toggle('active', openNowActive);
  applyOpenNowFilter();
}

function isOpenNow(place){
  if(!place.hours) return true; // no hours = assume open
  const h = place.hours.toLowerCase();
  if(h.includes('always') || h.includes('24 hour') || h.includes('open 24')) return true;
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon...
  const mins = now.getHours() * 60 + now.getMinutes();
  // Parse simple "HH:MM–HH:MM" patterns
  const match = h.match(/(\d{1,2}):(\d{2})\s*[–\-]\s*(\d{1,2}):(\d{2})/);
  if(!match) return true; // can't parse = assume open
  const open = parseInt(match[1])*60 + parseInt(match[2]);
  const close = parseInt(match[3])*60 + parseInt(match[4]);
  // Check closed days
  if(h.includes('mon–sat') || h.includes('mon-sat')){
    if(day === 0) return false; // closed Sunday
  }
  if(h.includes('tue') && h.includes('sun')){
    if(day === 1) return false; // closed Monday
  }
  return mins >= open && mins <= close;
}

function applyFilters(){
  PLACES.forEach(p => {
    const catOk = AF === 'all' || p.cat === AF;
    const openOk = !openNowActive || isOpenNow(p);
    if(markers[p.id]) markers[p.id].setVisible(catOk && openOk);
  });
  renderList();
}
function applyOpenNowFilter(){ applyFilters(); }


// ── PIN PULSE OVERLAY ─────────────────────────────────────────
function updatePulse(place){
  const pulse = document.getElementById('pin-pulse');
  if(!place || !map){ pulse.style.display='none'; return; }
  const proj = map.getProjection();
  if(!proj){ pulse.style.display='none'; return; }
  const bounds = map.getBounds();
  if(!bounds){ pulse.style.display='none'; return; }
  // Convert lat/lng to pixel position on the map div
  const mapDiv = document.getElementById('map');
  const ne = proj.fromLatLngToPoint(bounds.getNorthEast());
  const sw = proj.fromLatLngToPoint(bounds.getSouthWest());
  const scale = Math.pow(2, map.getZoom());
  const pt = proj.fromLatLngToPoint(new google.maps.LatLng(place.lat, place.lng));
  const x = (pt.x - sw.x) * scale;
  const y = (pt.y - ne.y) * scale;
  pulse.style.display = 'block';
  pulse.style.left = x + 'px';
  pulse.style.top  = y + 'px';
}


// ══ NEIGHBOURHOOD STORIES ════════════════════════════════════
