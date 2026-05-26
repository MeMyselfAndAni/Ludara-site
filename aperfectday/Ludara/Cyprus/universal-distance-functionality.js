// ══ UNIVERSAL DISTANCE FROM CURRENT LOCATION FUNCTIONALITY ══════════════
// Uses DISTANCE_UNITS variable to automatically detect imperial vs metric
// 
// FOR US CITIES: Set DISTANCE_UNITS = 'imperial' in map.js (Nashville, New Orleans, etc.)
// FOR INTERNATIONAL: Set DISTANCE_UNITS = 'metric' in map.js (or leave undefined for default)
//
// Simply add this script to any A Perfect Day platform after the existing JS files

// Distance calculation using haversine formula (returns meters)
function _distM(lat1, lng1, lat2, lng2) {
  var R = 6371000;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.asin(Math.sqrt(a));
}

// Format distance based on DISTANCE_UNITS setting
function formatDistance(meters) {
  if (typeof DISTANCE_UNITS !== 'undefined' && DISTANCE_UNITS === 'imperial') {
    // US format: feet/miles
    var feet = meters * 3.28084;
    if (feet < 1000) {
      return Math.round(feet/50)*50 + ' ft'; // Round to nearest 50ft for walking
    } else {
      var miles = feet / 5280;
      return miles < 10 ? miles.toFixed(1) + ' mi' : Math.round(miles) + ' mi';
    }
  } else {
    // International format: meters/kilometers (default)
    return meters < 1000 ? Math.round(meters) + 'm' : (meters/1000).toFixed(1) + 'km';
  }
}

// Enhanced navigate to place function with user location
function navigateToPlace(destLat, destLng, destName) {
  var dest = destLat + ',' + destLng;
  var url = window._userLat && window._userLng
    ? 'https://www.google.com/maps/dir/?api=1&origin=' + window._userLat + ',' + window._userLng + '&destination=' + dest + '&travelmode=walking'
    : 'https://www.google.com/maps/dir/?api=1&destination=' + dest + '&travelmode=walking';
  window.open(url, '_blank');
}

// Enhanced locateMe function that stores user location
window.addEventListener('load', function() {
  var _origLocate = window.locateMe;
  if (typeof _origLocate !== 'function') return;
  
  window.locateMe = function() {
    _origLocate();
    var attempts = 0;
    var poll = setInterval(function() {
      if (document.querySelector('.user-dot-inner') || attempts > 20) {
        clearInterval(poll);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(pos) {
            window._userLat = pos.coords.latitude;
            window._userLng = pos.coords.longitude;
            var units = (typeof DISTANCE_UNITS !== 'undefined' && DISTANCE_UNITS === 'imperial') ? 'imperial' : 'metric';
            console.log('🗺️ User location stored:', window._userLat, window._userLng, '(using', units, 'distances)');
            updateListDistances();
            updateNavigateButton();
          }, function(err) {
            console.log('❌ Failed to get user location:', err);
          }, { enableHighAccuracy: true, timeout: 10000 });
        }
      }
      attempts++;
    }, 300);
  };
});

// Add distance badges to places in the list
function updateListDistances() {
  if (!window._userLat) return;
  var units = (typeof DISTANCE_UNITS !== 'undefined' && DISTANCE_UNITS === 'imperial') ? 'imperial' : 'metric';
  console.log('🏷️ Updating list distances (' + units + ' format)');
  
  PLACES.forEach(function(place) {
    var row = document.getElementById('row-' + place.id);
    if (!row) return;
    
    var badge = row.querySelector('.dist-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'dist-badge';
      badge.style.cssText = 'display:inline-block;font-size:0.72rem;color:#888;background:rgba(0,0,0,0.06);border-radius:10px;padding:2px 7px;margin-left:6px;white-space:nowrap;vertical-align:middle';
      var nameEl = row.querySelector('.place-name');
      if (nameEl) nameEl.appendChild(badge);
    }
    
    var distance = _distM(window._userLat, window._userLng, place.lat, place.lng);
    badge.textContent = formatDistance(distance);
  });
}

// Update distances when list changes
window.addEventListener('load', function() {
  var list = document.getElementById('places-list');
  if (!list) return;
  
  new MutationObserver(function() { 
    if (window._userLat) updateListDistances(); 
  }).observe(list, { childList: true, subtree: false });
});

// Add navigate button with distance to place cards
window.addEventListener('load', function() {
  var titleEl = document.getElementById('pc-title');
  if (!titleEl) return;
  
  new MutationObserver(function() {
    var name = titleEl.textContent.trim();
    var place = PLACES.find(function(p) { return p.name === name; });
    if (!place) return;
    
    // Remove existing button
    var existing = document.getElementById('pc-nav-btn');
    if (existing) existing.remove();
    
    // Create new navigate button
    var btn = document.createElement('button');
    btn.id = 'pc-nav-btn';
    btn.style.cssText = [
      'display:inline-flex',
      'align-items:center', 
      'justify-content:center',
      'gap:6px',
      'margin:2px 0 2px',
      'padding:8px 18px',
      'background:white',
      'color:' + (typeof _brandColor === 'function' ? _brandColor() : 'var(--brand)'),
      'border:1.5px solid ' + (typeof _brandColor === 'function' ? _brandColor() : 'var(--brand)'),
      'border-radius:24px',
      'font-size:0.82rem',
      'font-weight:600',
      'cursor:pointer',
      'width:100%'
    ].join(';');
    
    // Add distance if user location available
    var distStr = (window._userLat && window._userLng) 
      ? formatDistance(_distM(window._userLat, window._userLng, place.lat, place.lng)) + ' away' 
      : '';
    
    btn.innerHTML = '🚶 Navigate on Google Maps' + 
      (distStr ? '  <span style="opacity:0.65;font-weight:400;font-size:0.78rem">· ' + distStr + '</span>' : '');
    
    btn.onclick = function() { 
      navigateToPlace(place.lat, place.lng, place.name); 
    };
    
    // Insert button after hours element
    var hours = document.getElementById('pc-hours');
    if (hours && hours.parentNode) {
      hours.parentNode.insertBefore(btn, hours.nextSibling);
    }
  }).observe(titleEl, { childList: true, characterData: true, subtree: true });
});

// Update navigate button when user location changes
function updateNavigateButton() {
  var titleEl = document.getElementById('pc-title');
  if (!titleEl) return;
  
  var name = titleEl.textContent.trim();
  var place = PLACES.find(function(p) { return p.name === name; });
  if (!place) return;
  
  var btn = document.getElementById('pc-nav-btn');
  if (!btn) return;
  
  var distStr = (window._userLat && window._userLng) 
    ? formatDistance(_distM(window._userLat, window._userLng, place.lat, place.lng)) + ' away' 
    : '';
  
  btn.innerHTML = '🚶 Navigate on Google Maps' + 
    (distStr ? '  <span style="opacity:0.65;font-weight:400;font-size:0.78rem">· ' + distStr + '</span>' : '');
}

// Log the units being used
var units = (typeof DISTANCE_UNITS !== 'undefined' && DISTANCE_UNITS === 'imperial') ? 'imperial' : 'metric';
console.log('✅ Universal distance functionality loaded (' + units + ' format)');
