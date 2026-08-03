// ── Photo loading — local files, preloaded on page init ──────
const photoCache = {};

// Places whose photograph does not exist. A family map always has some: not every
// shtetl or wartime address has a surviving picture, and the card falls back to
// the emoji by design. Without remembering the misses, though, every list render
// (a filter click, a search keystroke, a language switch) fired a fresh request
// for the same missing files, filling the console with 404s and making pointless
// round trips for the reader's whole visit.
const photoMissing = {};
function photoKnownMissing(id){ return photoMissing[id] === true; }
function markPhotoMissing(id){ photoMissing[id] = true; }

function fetchPhoto(p, callback){
  if(photoCache[p.id] !== undefined){ callback(photoCache[p.id]); return; }
  const basePath = (typeof IMAGES_PATH !== 'undefined') ? IMAGES_PATH : 'images/';
  const url = basePath + 'place-' + p.id + '.jpg';
  const attr = (typeof photoCreditHtml === 'function') ? photoCreditHtml(p.id) : '';
  photoCache[p.id] = { url: url, attr: attr };
  callback(photoCache[p.id]);
}

// ── Preload all images silently after map loads ───────────────
function preloadAllPhotos(){
  const basePath = (typeof IMAGES_PATH !== 'undefined') ? IMAGES_PATH : 'images/';
  // Stagger preloads so we don't hammer the network at once
  PLACES.forEach((p, i) => {
    setTimeout(() => {
      if(photoCache[p.id] || photoKnownMissing(p.id)) return; // already cached, or known to be absent
      const img = new Image();
      const url = basePath + 'place-' + p.id + '.jpg';
      const attr = (typeof photoCreditHtml === 'function') ? photoCreditHtml(p.id) : '';
      img.onload = () => { photoCache[p.id] = { url: url, attr: attr }; };
      img.onerror = () => { markPhotoMissing(p.id); };
      img.src = url;
    }, i * 80); // 80ms between each — all 63 preloaded in ~5 seconds
  });
}
