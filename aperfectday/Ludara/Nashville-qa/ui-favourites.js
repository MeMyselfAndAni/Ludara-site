// ══════════════════════════════════════════════════════════════
// A PERFECT DAY - SAVED PLACES MODULE (Single Source of Truth)
// ══════════════════════════════════════════════════════════════
// This module is the AUTHORITATIVE source for all saved places functionality.
// Other modules should import functions from here, never duplicate logic.

// ── CORE DATA STORAGE ────────────────────────────────────────
// Unique key per guide so favourites don't mix between cities
const FAVS_KEY = 'favs_' + window.location.pathname.replace(/\//g,'_');
let favourites = JSON.parse(localStorage.getItem(FAVS_KEY) || '[]');
let savedFilterActive = false;

// ── ORDERING SYSTEM ──────────────────────────────────────────
// Single source of truth for manual drag ordering
const FAVS_ORDER_KEY_PREFIX = 'favs_order_';
function _favsOrderKey(){ return FAVS_ORDER_KEY_PREFIX + window.location.pathname.replace(/\//g,'_'); }
function _getSavedOrder(){ try{ return JSON.parse(localStorage.getItem(_favsOrderKey()) || 'null'); }catch(e){ return null; } }
function _setSavedOrder(ids){ localStorage.setItem(_favsOrderKey(), JSON.stringify(ids)); }
function _clearSavedOrder(){ localStorage.removeItem(_favsOrderKey()); }

// ── AUTHORITATIVE ORDERING FUNCTION ──────────────────────────
// This is THE function that determines place order. All systems must use this.
function getSortedFavPlaces(){
  let places = favourites.map(id => PLACES.find(x=>x.id===id)).filter(Boolean);
  if(places.length < 2) return places;
  
  // Use manual drag order if set
  const manual = _getSavedOrder();
  if(manual && manual.length){
    const ordered = manual.map(id => places.find(p=>p.id===id)).filter(Boolean);
    const rest = places.filter(p => !manual.includes(p.id));
    return [...ordered, ...rest];
  }
  
  // Fallback: Auto proximity sort
  places.sort((a,b) => a.lng - b.lng);
  const sorted = [places.shift()];
  while(places.length){ 
    const last = sorted[sorted.length-1]; 
    let bestIdx = 0, bestDist = Infinity; 
    places.forEach((p,i)=>{ 
      const d = Math.sqrt((p.lat-last.lat)**2 + (p.lng-last.lng)**2); 
      if(d < bestDist){bestDist = d; bestIdx = i;} 
    }); 
    sorted.push(places.splice(bestIdx,1)[0]); 
  }
  return sorted;
}

// ── GOOGLE MAPS INTEGRATION ──────────────────────────────────
// Authoritative function for opening saved places in Google Maps
function openTripInMaps(){
  console.log('🗺️ openTripInMaps called (authoritative version)');
  
  const places = getSortedFavPlaces();
  if(!places.length) {
    alert('Save some places first using the ♡ button');
    return;
  }
  
  console.log('🗺️ Opening Google Maps with order:', places.map(p => p.name));
  console.log('🗺️ Manual order from localStorage:', _getSavedOrder());
  
  const stops = places.slice(0,8);
  const origin = encodeURIComponent(`${stops[0].lat},${stops[0].lng}`);
  const dest = encodeURIComponent(`${stops[stops.length-1].lat},${stops[stops.length-1].lng}`);
  const waypts = stops.slice(1,-1).map(p=>encodeURIComponent(`${p.lat},${p.lng}`)).join('|');
  
  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${waypts?'&waypoints='+waypts:''}&travelmode=walking`;
  window.open(url, '_blank');
}

// ── SHARE FUNCTIONALITY ──────────────────────────────────────
// Authoritative function for sharing itineraries
function shareItinerary(){
  console.log('🔗 shareItinerary called (authoritative version)');
  
  const places = getSortedFavPlaces();
  if(!places.length) {
    alert('Save some places first to share your itinerary!');
    return;
  }
  
  console.log('🔗 Sharing itinerary with order:', places.map(p => p.name));
  
  const placeNames = places.map((p,i) => `${i+1}. ${p.emoji || '📍'} ${p.name}`).join('\n');
  const cityName = typeof GUIDE_CITY !== 'undefined' ? GUIDE_CITY : 'Nashville';
  const text = `My ${cityName} itinerary:\n\n${placeNames}\n\nCreated with A Perfect Day: ${window.location.href}`;
  
  if (navigator.share && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) {
    navigator.share({
      title: `My ${cityName} Itinerary`,
      text: text
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      _toast('Itinerary copied to clipboard! 📋', 3000);
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      _toast('Itinerary copied! 📋', 3000);
    });
  }
}

// ── CORE FAVOURITES MANAGEMENT ───────────────────────────────
function _toast(msg, duration = 3500){
  const existing = document.getElementById('_apd-toast');
  if(existing) existing.remove();
  const el = document.createElement('div');
  el.id = '_apd-toast';
  const brand = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#1a3a5c';
  el.style.cssText = `position:fixed;top:110px;left:50%;transform:translateX(-50%);background:white;color:${brand};padding:12px 22px;border-radius:24px;border:2px solid ${brand};font-size:0.82rem;font-weight:600;font-family:Inter,sans-serif;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,0.15);max-width:80vw;text-align:center;animation:_apd-fadein 0.2s ease;pointer-events:none;white-space:nowrap;`;
  el.textContent = msg;
  if(!document.getElementById('_apd-toast-style')){
    const s = document.createElement('style');
    s.id = '_apd-toast-style';
    s.textContent = '@keyframes _apd-fadein{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
    document.head.appendChild(s);
  }
  document.body.appendChild(el);
  setTimeout(() => { if(el.parentNode) el.remove(); }, duration);
}

function _brandColor(){ 
  return getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#1a3a5c'; 
}

function saveFavs(){ 
  localStorage.setItem(FAVS_KEY, JSON.stringify(favourites)); 
  updateFavUI(); 
}

function refreshFavourites(){ 
  favourites = JSON.parse(localStorage.getItem(FAVS_KEY) || '[]'); 
  updateFavUI(); 
}

function updateFavUI(){
  const count = favourites.length;
  const pillCount = document.getElementById('pill-saved-count');
  if(pillCount){ 
    pillCount.textContent = count; 
    pillCount.style.display = count > 0 ? 'inline-flex' : 'none'; 
  }
  const pill = document.getElementById('pill-saved');
  if(pill){ 
    const icon = pill.childNodes[0]; 
    if(icon && icon.nodeType === 3) icon.textContent = count > 0 ? '♥ Saved ' : '♡ Saved '; 
  }
  if(savedFilterActive) {
    if(typeof applyFilters === 'function') applyFilters();
  }
}

function isFav(id){ return favourites.includes(id); }

function toggleFav(){
  if(!AID) return;
  const wasSaved = favourites.includes(AID);
  if(wasSaved){
    favourites = favourites.filter(id => id !== AID);
    _toast('Removed from saved places');
  } else {
    favourites.push(AID);
    _toast('Added to saved places ♡');
  }
  saveFavs();
  if(typeof syncFavBtn === 'function') syncFavBtn(AID);
}

function toggleSavedFilter(el){
  if(typeof clearTripRoute === 'function') clearTripRoute();
  savedFilterActive = !savedFilterActive;
  el.classList.toggle('active', savedFilterActive);
  if(savedFilterActive){
    if(favourites.length === 0){
      _toast('Tap ♡ on places to save them first');
      savedFilterActive = false;
      el.classList.remove('active');
      return;
    }
    if(typeof applyFilters === 'function') applyFilters();
    if(window.innerWidth >= 768 && typeof openSheet === 'function') openSheet();
    if(typeof drawSavedRoute === 'function') drawSavedRoute();
  } else {
    if(typeof applyFilters === 'function') applyFilters();
  }
}

// ── VERY SPECIFIC RED BUTTON INTERCEPTOR ────────────────────
// Only intercepts the exact RED buttons, preserves all other functionality
document.addEventListener('click', function(e) {
  // Debug all clicks to see what's happening
  if (e.target.onclick && e.target.onclick.toString().includes('openDetail')) {
    console.log('🔧 Place card click detected, not intercepting');
    return; // Let normal place card clicks work
  }
  
  const target = e.target;
  
  // Only intercept if it's EXACTLY the RED Google Maps button
  const isExactRedButton = (
    target.classList.contains('saved-action-btn') && 
    target.classList.contains('saved-action-maps')
  );
  
  if (isExactRedButton) {
    console.log('🔄 Intercepting EXACT RED Google Maps button');
    e.preventDefault();
    e.stopPropagation();
    openTripInMaps();
    return false;
  }
});

// ── EXPORTS FOR OTHER MODULES ────────────────────────────────
// Other modules should use these, never duplicate the logic
window.APD_SavedPlaces = {
  getSortedFavPlaces,
  openTripInMaps, 
  shareItinerary,
  _getSavedOrder,
  _setSavedOrder,
  _clearSavedOrder
};

// ── ENSURE CORE UI COMPATIBILITY ────────────────────────────
// Make sure our module doesn't interfere with existing functionality
(function() {
  // Wait for other scripts to load, then initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSavedPlaces);
  } else {
    initSavedPlaces();
  }
  
  function initSavedPlaces() {
    // Initialize after a short delay to ensure other scripts are ready
    setTimeout(() => {
      console.log('✅ A Perfect Day Saved Places Module loaded (Single Source of Truth)');
      
      // Ensure openDetail is available (it should come from ui-card.js)
      if (typeof window.openDetail !== 'function') {
        console.warn('⚠️ openDetail function not found - place cards may not work');
      }
    }, 100);
  }
})();
