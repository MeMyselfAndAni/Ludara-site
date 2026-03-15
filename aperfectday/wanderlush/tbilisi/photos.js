function fetchPhoto(p, callback){
  if(photoCache[p.id]){callback(photoCache[p.id]);return;}
  placesService.findPlaceFromQuery({
    query: p.search,
    fields:['photos','place_id','name']
  }, (results, status)=>{
    if(status===google.maps.places.PlacesServiceStatus.OK && results[0]?.photos?.length){
      // Pick the widest/best photo (skip narrow portrait shots)
      const photos = results[0].photos;
      let best = photos[0];
      for(const ph of photos){
        if((ph.width/ph.height) > (best.width/best.height)) best = ph;
      }
      const url = best.getUrl({maxWidth:1200, maxHeight:600});
      const attr = best.html_attributions[0]||'';
      photoCache[p.id] = {url, attr};
      callback(photoCache[p.id]);
    } else {
      photoCache[p.id] = null;
      callback(null);
    }
  });
}

