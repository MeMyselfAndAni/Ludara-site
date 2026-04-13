// ── Photo loading — local files, preloaded on page init ──────
const photoCache = {};

function fetchPhoto(p, callback){
  if(photoCache[p.id] !== undefined){ callback(photoCache[p.id]); return; }
  const basePath = (typeof IMAGES_PATH !== 'undefined') ? IMAGES_PATH : 'images/';
  const url = basePath + 'place-' + p.id + '.jpg';
  photoCache[p.id] = { url: url, attr: '' };
  callback(photoCache[p.id]);
}

// ── Preload all images silently after map loads ───────────────
function preloadAllPhotos(){
  const basePath = (typeof IMAGES_PATH !== 'undefined') ? IMAGES_PATH : 'images/';
  // Stagger preloads so we don't hammer the network at once
  PLACES.forEach((p, i) => {
    setTimeout(() => {
      if(photoCache[p.id]) return; // already cached
      const img = new Image();
      const url = basePath + 'place-' + p.id + '.jpg';
      img.onload = () => { photoCache[p.id] = { url: url, attr: '' }; };
      img.src = url;
    }, i * 80); // 80ms between each — all 63 preloaded in ~5 seconds
  });
}
