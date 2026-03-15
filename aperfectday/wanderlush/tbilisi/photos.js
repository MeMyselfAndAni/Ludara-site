// ── Photo loading — local first, Google Places API fallback ──
const photoCache = {};

function fetchPhoto(p, callback){
  // Return cached immediately
  if(photoCache[p.id] !== undefined){
    callback(photoCache[p.id]);
    return;
  }

  // Always try local image first — let the browser handle 404 via onerror
  const basePath = (typeof IMAGES_PATH !== 'undefined') ? IMAGES_PATH : 'images/';
  const localUrl = basePath + p.id + '.jpg';

  const testImg = new Image();

  testImg.onload = function(){
    photoCache[p.id] = { url: localUrl, attr: '' };
    callback(photoCache[p.id]);
  };

  testImg.onerror = function(){
    // Local file missing — fall back to Google Places API
    if(!window.placesService){
      photoCache[p.id] = null;
      callback(null);
      return;
    }
    window.placesService.findPlaceFromQuery({
      query: p.search,
      fields: ['photos']
    }, function(results, status){
      if(status === google.maps.places.PlacesServiceStatus.OK &&
         results && results[0] && results[0].photos && results[0].photos.length){
        const photos = results[0].photos;
        let best = photos[0];
        for(var i=1; i<photos.length; i++){
          if((photos[i].width/photos[i].height) > (best.width/best.height)) best = photos[i];
        }
        var url  = best.getUrl({maxWidth:1200, maxHeight:600});
        var attr = (best.html_attributions && best.html_attributions[0]) || '';
        photoCache[p.id] = { url: url, attr: attr };
        callback(photoCache[p.id]);
      } else {
        photoCache[p.id] = null;
        callback(null);
      }
    });
  };

  testImg.src = localUrl;
}
