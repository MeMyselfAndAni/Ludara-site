// ── Photo loading — local images first, Google Places API fallback ──
const photoCache = {};

function fetchPhoto(p, callback){
  // Return cached result immediately
  if(photoCache[p.id] !== undefined){
    callback(photoCache[p.id]);
    return;
  }

  // Try local image first
  const basePath = (typeof IMAGES_PATH !== 'undefined') ? IMAGES_PATH : 'images/';
  const localUrl = basePath + p.id + '.jpg';

  // Use fetch to check if local file exists — more reliable than Image() probe
  fetch(localUrl, { method: 'HEAD' })
    .then(res => {
      if(res.ok){
        // Local file exists — use it
        photoCache[p.id] = { url: localUrl, attr: '' };
        callback(photoCache[p.id]);
      } else {
        // Fall back to Google Places API
        _fetchFromGoogle(p, callback);
      }
    })
    .catch(() => {
      // Network error — try Google
      _fetchFromGoogle(p, callback);
    });
}

function _fetchFromGoogle(p, callback){
  if(!placesService){
    photoCache[p.id] = null;
    callback(null);
    return;
  }
  placesService.findPlaceFromQuery({
    query: p.search,
    fields: ['photos','place_id','name']
  }, (results, status) => {
    try {
      if(status === google.maps.places.PlacesServiceStatus.OK && results[0]?.photos?.length){
        const photos = results[0].photos;
        let best = photos[0];
        for(const ph of photos){
          if((ph.width/ph.height) > (best.width/best.height)) best = ph;
        }
        const url  = best.getUrl({maxWidth:1200, maxHeight:600});
        const attr = best.html_attributions[0] || '';
        photoCache[p.id] = { url, attr };
        callback(photoCache[p.id]);
      } else {
        photoCache[p.id] = null;
        callback(null);
      }
    } catch(e) {
      photoCache[p.id] = null;
      callback(null);
    }
  });
}
