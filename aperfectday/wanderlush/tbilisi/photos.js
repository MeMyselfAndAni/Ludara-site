// ── Photo loading — local images first, Google Places API fallback ──
// Local images expected at: images/{place_id}.jpg
// Set IMAGES_PATH per guide in index.html as a global variable
// e.g. <script>const IMAGES_PATH = 'images/';</script>

const photoCache = {};

function fetchPhoto(p, callback){
  // Return cached result immediately
  if(photoCache[p.id] !== undefined){ callback(photoCache[p.id]); return; }

  // Try local image first — instant, no API call
  const basePath = (typeof IMAGES_PATH !== 'undefined') ? IMAGES_PATH : 'images/';
  const localUrl = basePath + p.id + '.jpg';

  const img = new Image();
  img.onload = () => {
    // Local image exists and loaded
    photoCache[p.id] = { url: localUrl, attr: '' };
    callback(photoCache[p.id]);
  };
  img.onerror = () => {
    // Local image missing — fall back to Google Places API
    if(!placesService){ photoCache[p.id] = null; callback(null); return; }
    placesService.findPlaceFromQuery({
      query: p.search,
      fields: ['photos','place_id','name']
    }, (results, status) => {
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
    });
  };
  img.src = localUrl;
}
